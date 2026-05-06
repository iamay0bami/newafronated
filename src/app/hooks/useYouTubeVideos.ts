import { useEffect, useState } from "react";
import type { YTShort } from "../components/YouTubeShorts";

// ─── Config ───────────────────────────────────────────────────────────────────
const YT_API_KEY    = "AIzaSyAixuU0sg_TtnQvDrwkMKRnyFtFmWoTcGI";
const YT_CHANNEL_ID = "UCy6712z38Ovxm4gsf_yN1Rg";

// ─── Thresholds ───────────────────────────────────────────────────────────────
// Videos ≤ 62 s  → Shorts shelf
const SHORTS_MAX_SECONDS = 62;

// Videos > 180 s (3 min) AND matching INTERVIEW_KEYWORDS → Interviews section.
// Everything else (event clips, music videos, etc.) is intentionally excluded.
const INTERVIEW_MIN_SECONDS = 180;

/**
 * INTERVIEW DETECTION STRATEGY
 * ─────────────────────────────
 * Afronated names every interview episode "… | Behind The Creative …"
 * (confirmed across all six existing episodes).
 *
 * Filtering purely by duration breaks when the brand uploads long non-interview
 * content (event recaps, freestyle sets, etc.). Title-keyword detection is far
 * more reliable because:
 *   1. The brand already uses a consistent naming convention.
 *   2. It self-updates — new episodes auto-appear; other videos auto-exclude.
 *   3. It requires zero maintenance unless the brand renames their series.
 *
 * Add extra keywords here if the brand starts a second interview series.
 */
const INTERVIEW_KEYWORDS = ["behind the creative"];

function isInterview(title: string, durationSeconds: number): boolean {
  if (durationSeconds < INTERVIEW_MIN_SECONDS) return false;
  const lower = title.toLowerCase();
  return INTERVIEW_KEYWORDS.some((kw) => lower.includes(kw));
}

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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseYouTubeVideosResult {
  shorts:   YTShort[];
  longForm: YTVideo[];   // interview episodes only
  loading:  boolean;
  error:    boolean;
}

export function useYouTubeVideos(): UseYouTubeVideosResult {
  const [shorts,   setShorts]   = useState<YTShort[]>([]);
  const [longForm, setLongForm] = useState<YTVideo[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchVideos() {
      try {
        // ── Step 1: uploads playlist ID ──────────────────────────────────────
        const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
        channelUrl.searchParams.set("part", "contentDetails");
        channelUrl.searchParams.set("id", YT_CHANNEL_ID);
        channelUrl.searchParams.set("key", YT_API_KEY);

        const channelRes = await fetch(channelUrl.toString());
        if (!channelRes.ok) throw new Error(`Channels API: ${channelRes.status}`);
        const channelData = await channelRes.json();
        const uploadsPlaylist: string =
          channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? "";
        if (!uploadsPlaylist) throw new Error("Uploads playlist not found");

        // ── Step 2: latest 50 video IDs ──────────────────────────────────────
        const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
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
          .map((item) =>
            ((item?.contentDetails as Record<string, unknown>) ?? {})
              ?.videoId as string,
          )
          .filter(Boolean)
          .join(",");

        // ── Step 3: full video details ────────────────────────────────────────
        const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
        videosUrl.searchParams.set("part", "snippet,contentDetails,statistics");
        videosUrl.searchParams.set("id", videoIds);
        videosUrl.searchParams.set("key", YT_API_KEY);

        const videosRes = await fetch(videosUrl.toString());
        if (!videosRes.ok) throw new Error(`Videos API: ${videosRes.status}`);
        const videosData = await videosRes.json();
        const videoItems: Array<Record<string, unknown>> =
          videosData?.items ?? [];

        if (cancelled) return;

        // ── Step 4: map + classify ────────────────────────────────────────────
        const allVideos: YTVideo[] = videoItems.map((v) => {
          const snippet        = (v.snippet        ?? {}) as Record<string, unknown>;
          const contentDetails = (v.contentDetails ?? {}) as Record<string, unknown>;
          const statistics     = (v.statistics     ?? {}) as Record<string, unknown>;

          const title       = String(snippet?.title ?? "");
          const description = String(snippet?.description ?? "");
          const duration    = String(contentDetails?.duration ?? "PT0S");
          const durationSeconds = parseISO8601(duration);

          const thumbs = (snippet?.thumbnails ?? {}) as Record<
            string,
            { url: string }
          >;
          const thumbnail =
            thumbs?.maxres?.url ??
            thumbs?.standard?.url ??
            thumbs?.high?.url ??
            thumbs?.medium?.url ??
            `https://img.youtube.com/vi/${String(v.id)}/hqdefault.jpg`;

          const isShort = durationSeconds > 0 && durationSeconds <= SHORTS_MAX_SECONDS;

          return {
            id:              String(v.id ?? ""),
            title,
            description,
            thumbnail,
            url:             `https://youtu.be/${String(v.id)}`,
            duration,
            durationSeconds,
            publishedAt:     String(snippet?.publishedAt ?? ""),
            viewCount:       String(statistics?.viewCount ?? ""),
            isShort,
          };
        });

        // ── Shorts: ≤ 62 s, up to 8 ─────────────────────────────────────────
        const newShorts: YTShort[] = allVideos
          .filter((v) => v.isShort)
          .slice(0, 8)
          .map((v) => ({
            id:        v.id,
            title:     v.title,
            thumbnail: v.thumbnail,
            url:       v.url,
            viewCount: v.viewCount,
          }));

        // ── Interviews: "Behind The Creative" episodes, > 3 min, up to 6 ────
        // Newest-first is guaranteed by the uploads playlist order.
        const newLongForm: YTVideo[] = allVideos
          .filter((v) => !v.isShort && isInterview(v.title, v.durationSeconds))
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
    return () => {
      cancelled = true;
    };
  }, []);

  return { shorts, longForm, loading, error };
}