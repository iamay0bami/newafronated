import { useEffect, useState } from "react";
import type { YTShort } from "../components/YouTubeShorts";

// ─── Config ───────────────────────────────────────────────────────────────────
// Replace with your YouTube Data API v3 key from console.cloud.google.com
// Restrict it to: HTTP referrers → https://afronated.com/* and https://www.afronated.com/*
export const YT_API_KEY = "AIzaSyAixuU0sg_TtnQvDrwkMKRnyFtFmWoTcGI";
export const YT_CHANNEL_HANDLE = "@Afronated";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface YTVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  duration: string; // ISO 8601 e.g. PT1M30S
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

function detectShort(
  title: string,
  description: string,
  durationSeconds: number
): boolean {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  if (titleLower.includes("#shorts") || descLower.includes("#shorts")) return true;
  if (titleLower.includes("#short") || descLower.includes("#short")) return true;
  // YouTube Shorts are ≤60 seconds (some up to 180s but typically 60)
  if (durationSeconds > 0 && durationSeconds <= 62) return true;
  return false;
}

// ─── Main hook ────────────────────────────────────────────────────────────────

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
    if (!YT_API_KEY || YT_API_KEY === "AIzaSyAixuU0sg_TtnQvDrwkMKRnyFtFmWoTcGI") {
      // No API key set — return empty so fallbacks kick in
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchVideos() {
      try {
        // Step 1: Resolve channel ID from handle (search by channel)
        const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
        searchUrl.searchParams.set("part", "snippet");
        searchUrl.searchParams.set("q", YT_CHANNEL_HANDLE);
        searchUrl.searchParams.set("type", "channel");
        searchUrl.searchParams.set("maxResults", "1");
        searchUrl.searchParams.set("key", YT_API_KEY);

        const channelSearchRes = await fetch(searchUrl.toString());
        const channelSearchData = await channelSearchRes.json();
        const channelId: string =
          channelSearchData?.items?.[0]?.snippet?.channelId ?? "";

        if (!channelId) throw new Error("Channel not found");

        // Step 2: Get uploads playlist ID
        const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
        channelUrl.searchParams.set("part", "contentDetails");
        channelUrl.searchParams.set("id", channelId);
        channelUrl.searchParams.set("key", YT_API_KEY);

        const channelRes = await fetch(channelUrl.toString());
        const channelData = await channelRes.json();
        const uploadsPlaylist: string =
          channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? "";

        if (!uploadsPlaylist) throw new Error("Uploads playlist not found");

        // Step 3: Get latest 25 video IDs from uploads playlist
        const playlistUrl = new URL(
          "https://www.googleapis.com/youtube/v3/playlistItems"
        );
        playlistUrl.searchParams.set("part", "snippet,contentDetails");
        playlistUrl.searchParams.set("playlistId", uploadsPlaylist);
        playlistUrl.searchParams.set("maxResults", "25");
        playlistUrl.searchParams.set("key", YT_API_KEY);

        const playlistRes = await fetch(playlistUrl.toString());
        const playlistData = await playlistRes.json();
        const items: Array<Record<string, unknown>> =
          playlistData?.items ?? [];

        if (items.length === 0) throw new Error("No videos found");

        const videoIds = items
          .map(
            (item) =>
              (item?.contentDetails as Record<string, unknown>)
                ?.videoId as string
          )
          .filter(Boolean)
          .join(",");

        // Step 4: Get full details (duration, stats, thumbnails)
        const videosUrl = new URL(
          "https://www.googleapis.com/youtube/v3/videos"
        );
        videosUrl.searchParams.set(
          "part",
          "snippet,contentDetails,statistics"
        );
        videosUrl.searchParams.set("id", videoIds);
        videosUrl.searchParams.set("key", YT_API_KEY);

        const videosRes = await fetch(videosUrl.toString());
        const videosData = await videosRes.json();
        const videoItems: Array<Record<string, unknown>> =
          videosData?.items ?? [];

        if (cancelled) return;

        const allVideos: YTVideo[] = videoItems.map((v) => {
          const snippet = v.snippet as Record<string, unknown>;
          const contentDetails = v.contentDetails as Record<string, unknown>;
          const statistics = v.statistics as Record<string, unknown>;

          const title = String(snippet?.title ?? "");
          const description = String(snippet?.description ?? "");
          const duration = String(contentDetails?.duration ?? "PT0S");
          const durationSeconds = parseISO8601(duration);

          // Prefer maxresdefault, fall back through quality levels
          const thumbs = (snippet?.thumbnails as Record<string, { url: string }>) ?? {};
          const thumbnail =
            thumbs?.maxres?.url ??
            thumbs?.standard?.url ??
            thumbs?.high?.url ??
            thumbs?.medium?.url ??
            thumbs?.default?.url ??
            `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;

          return {
            id: String(v.id ?? ""),
            title,
            description,
            thumbnail,
            url: `https://youtu.be/${v.id}`,
            duration,
            durationSeconds,
            publishedAt: String(snippet?.publishedAt ?? ""),
            viewCount: String(statistics?.viewCount ?? ""),
            isShort: detectShort(title, description, durationSeconds),
          };
        });

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

        const newLongForm: YTVideo[] = allVideos
          .filter((v) => !v.isShort)
          .slice(0, 8);

        setShorts(newShorts);
        setLongForm(newLongForm);
        setLoading(false);
      } catch (err) {
        console.warn("[useYouTubeVideos]", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchVideos();
    return () => { cancelled = true; };
  }, []);

  return { shorts, longForm, loading, error };
}