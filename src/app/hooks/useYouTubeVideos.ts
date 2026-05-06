import { useEffect, useState } from "react";
import type { YTShort } from "../components/YouTubeShorts";

// ─── Config ───────────────────────────────────────────────────────────────────
// YouTube Data API v3 key
const YT_API_KEY = "AIzaSyAixuU0sg_TtnQvDrwkMKRnyFtFmWoTcGI";

// Hardcoded channel ID for @Afronated — verified from youtube.com/@Afronated
const YT_CHANNEL_ID = "UCy6712z38Ovxm4gsf_yN1Rg";

// ─── Short detection threshold ────────────────────────────────────────────────
// YouTube's own Shorts shelf only shows videos ≤60 seconds.
// We use 62s as a small buffer for edge cases.
// Videos > 62 seconds are treated as long-form / interviews.
// We deliberately do NOT check #shorts in title/description because:
//   1. Creators sometimes tag long videos with #shorts accidentally
//   2. YouTube's own categorisation is purely duration-based for the Shorts shelf
//   3. The brand's long-form interviews are all well over 5 minutes
const SHORTS_MAX_SECONDS = 62;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface YTVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  duration: string;
  durationSeconds: number;
  publishedAt: string;
  viewCount?: string;
  isShort: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseISO8601(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] ?? "0");
  const m = parseInt(match[2] ?? "0");
  const s = parseInt(match[3] ?? "0");
  return h * 3600 + m * 60 + s;
}

/**
 * Determine if a video is a YouTube Short.
 *
 * Strategy: duration ONLY.
 *
 * YouTube Shorts are defined by the platform as videos ≤60 seconds uploaded
 * to the Shorts creation flow. The YouTube Data API does not expose a direct
 * "isShort" boolean, but duration is the most reliable proxy because:
 *
 *   - All Afronated interviews run 5–30+ minutes (well above the threshold)
 *   - All Afronated Shorts are genuine short clips (≤60s)
 *   - Hashtag checks are unreliable (creators misuse #shorts on long videos)
 *
 * If a video is exactly 0 seconds (duration parse failure) we treat it as
 * long-form to avoid incorrectly filtering out a video.
 */
function isYouTubeShort(durationSeconds: number): boolean {
  if (durationSeconds === 0) return false; // parse failure — treat as long-form
  return durationSeconds <= SHORTS_MAX_SECONDS;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseYouTubeVideosResult {
  shorts: YTShort[];
  longForm: YTVideo[];
  loading: boolean;
  error: boolean;
}

export function useYouTubeVideos(): UseYouTubeVideosResult {
  const [shorts, setShorts] = useState<YTShort[]>([]);
  const [longForm, setLongForm] = useState<YTVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchVideos() {
      try {
        // Step 1: Get uploads playlist ID
        const channelUrl = new URL(
          "https://www.googleapis.com/youtube/v3/channels"
        );
        channelUrl.searchParams.set("part", "contentDetails");
        channelUrl.searchParams.set("id", YT_CHANNEL_ID);
        channelUrl.searchParams.set("key", YT_API_KEY);

        const channelRes = await fetch(channelUrl.toString());
        if (!channelRes.ok) throw new Error(`Channels API: ${channelRes.status}`);
        const channelData = await channelRes.json();
        const uploadsPlaylist: string =
          channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? "";
        if (!uploadsPlaylist) throw new Error("Uploads playlist not found");

        // Step 2: Get latest 50 video IDs (more headroom for filtering)
        const playlistUrl = new URL(
          "https://www.googleapis.com/youtube/v3/playlistItems"
        );
        playlistUrl.searchParams.set("part", "contentDetails");
        playlistUrl.searchParams.set("playlistId", uploadsPlaylist);
        playlistUrl.searchParams.set("maxResults", "50");
        playlistUrl.searchParams.set("key", YT_API_KEY);

        const playlistRes = await fetch(playlistUrl.toString());
        if (!playlistRes.ok) throw new Error(`Playlist API: ${playlistRes.status}`);
        const playlistData = await playlistRes.json();
        const items: Array<Record<string, unknown>> = playlistData?.items ?? [];
        if (items.length === 0) throw new Error("No videos found");

        const videoIds = items
          .map((item) => ((item?.contentDetails as Record<string, unknown>) ?? {})?.videoId as string)
          .filter(Boolean)
          .join(",");

        // Step 3: Get full video details
        const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
        videosUrl.searchParams.set("part", "snippet,contentDetails,statistics");
        videosUrl.searchParams.set("id", videoIds);
        videosUrl.searchParams.set("key", YT_API_KEY);

        const videosRes = await fetch(videosUrl.toString());
        if (!videosRes.ok) throw new Error(`Videos API: ${videosRes.status}`);
        const videosData = await videosRes.json();
        const videoItems: Array<Record<string, unknown>> = videosData?.items ?? [];

        if (cancelled) return;

        const allVideos: YTVideo[] = videoItems.map((v) => {
          const snippet = (v.snippet ?? {}) as Record<string, unknown>;
          const contentDetails = (v.contentDetails ?? {}) as Record<string, unknown>;
          const statistics = (v.statistics ?? {}) as Record<string, unknown>;
          const title = String(snippet?.title ?? "");
          const description = String(snippet?.description ?? "");
          const duration = String(contentDetails?.duration ?? "PT0S");
          const durationSeconds = parseISO8601(duration);
          const thumbs = (snippet?.thumbnails ?? {}) as Record<string, { url: string }>;
          const thumbnail =
            thumbs?.maxres?.url ??
            thumbs?.standard?.url ??
            thumbs?.high?.url ??
            thumbs?.medium?.url ??
            `https://img.youtube.com/vi/${String(v.id)}/hqdefault.jpg`;

          return {
            id: String(v.id ?? ""),
            title,
            description,
            thumbnail,
            url: `https://youtu.be/${String(v.id)}`,
            duration,
            durationSeconds,
            publishedAt: String(snippet?.publishedAt ?? ""),
            viewCount: String(statistics?.viewCount ?? ""),
            // Duration-only detection — no hashtag guessing
            isShort: isYouTubeShort(durationSeconds),
          };
        });

        // Shorts: duration ≤ 62 seconds, up to 8 shown
        const newShorts: YTShort[] = allVideos
          .filter((v) => v.isShort)
          .slice(0, 8)
          .map((v) => ({
            id: v.id,
            title: v.title,
            thumbnail: v.thumbnail,
            url: v.url,
            viewCount: v.viewCount,
          }));

        // Long-form: duration > 62 seconds (interviews, documentaries, etc.)
        // Show up to 6 — newest first (API returns newest first from uploads playlist)
        const newLongForm: YTVideo[] = allVideos
          .filter((v) => !v.isShort)
          .slice(0, 6);

        setShorts(newShorts);
        setLongForm(newLongForm);
      } catch (err) {
        console.error("[useYouTubeVideos] Failed:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchVideos();
    return () => { cancelled = true; };
  }, []);

  return { shorts, longForm, loading, error };
}