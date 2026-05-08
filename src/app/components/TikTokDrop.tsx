/**
 * TikTokDrop — Phone-Frame Widget
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays a TikTok-style phone frame with a scrollable video feed.
 * Uses TikTok's free oEmbed endpoint for thumbnails.
 * Clicking any video opens it directly on TikTok.com.
 *
 * No API key required. No third-party services. No recurring costs.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Play, Heart, MessageCircle, Share2, Plus } from "lucide-react";
import { useT } from "../context/ThemeContext";

// ─── ✏️  ADD NEW VIDEOS HERE — paste the full TikTok URL, newest first ────────
const TIKTOK_VIDEOS: string[] = [
  "https://www.tiktok.com/@afronated/video/7636822040716086548",
  "https://www.tiktok.com/@afronated/video/7634714587706821909",
  "https://www.tiktok.com/@afronated/video/7631498414395624724",
  "https://www.tiktok.com/@afronated/video/7630882854968249620",
  "https://www.tiktok.com/@afronated/video/7627601060894461204",
  "https://www.tiktok.com/@afronated/video/7627153826323156245",
  "https://www.tiktok.com/@afronated/video/7626054468563717397",
  "https://www.tiktok.com/@afronated/video/7625729431235054868",
];

const TIKTOK_USERNAME = "afronated";
const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@afronated";
const MAX_VIDEOS = 20; // Fetch up to 20, show all in scrollable list

// ─── Types ────────────────────────────────────────────────────────────────────

interface TikTokVideo {
  url: string;
  thumbnail: string | null; // null = loading, "" = failed
  title: string;
}

// ─── oEmbed fetcher ───────────────────────────────────────────────────────────

async function fetchOEmbed(
  videoUrl: string
): Promise<{ thumbnail: string; title: string }> {
  const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`oEmbed ${res.status}`);
  const data = await res.json();
  return {
    thumbnail: data.thumbnail_url ?? "",
    title: data.title ?? "",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
    </svg>
  );
}

function LiveDot() {
  return (
    <span className="relative inline-flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />
    </span>
  );
}

/** Fake stat for visual polish — TikTok doesn't expose this via oEmbed */
function FakeStat({ min = 1200, max = 98000 }: { min?: number; max?: number }) {
  const n = useRef(Math.floor(Math.random() * (max - min) + min)).current;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

// ─── Video Row (inside phone feed) ────────────────────────────────────────────

function VideoRow({
  video,
  index,
  isVisible,
}: {
  video: TikTokVideo;
  index: number;
  isVisible: boolean;
}) {
  const T = useT();
  const [hovered, setHovered] = useState(false);
  const isLoading = video.thumbnail === null;
  const hasFailed = video.thumbnail === "";

  return (
    <motion.a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={video.title || `Watch TikTok video ${index + 1}`}
      className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-inset"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: Math.min(index * 0.05, 0.5),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative group cursor-pointer">
        {/* Thumbnail area — 9:16 aspect */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "9/16" }}
        >
          {isLoading ? (
            <div
              className={`w-full h-full animate-pulse ${
                T.isDark ? "bg-white/5" : "bg-black/5"
              }`}
            />
          ) : hasFailed ? (
            <div
              className={`w-full h-full flex flex-col items-center justify-center gap-2 ${
                T.isDark ? "bg-[#1a1a1a]" : "bg-[#e8e8e8]"
              }`}
            >
              <TikTokIcon size={22} />
              <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">
                @{TIKTOK_USERNAME}
              </span>
            </div>
          ) : (
            <img
              src={video.thumbnail!}
              alt={video.title || `TikTok by @${TIKTOK_USERNAME}`}
              className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.03]"
              loading="lazy"
              draggable={false}
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

          {/* Play button — centered */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Play
                className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5"
                fill="white"
              />
            </div>
          </motion.div>

          {/* View count badge */}
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <span className="flex items-center gap-1 text-white text-[10px] font-semibold drop-shadow-md">
              <Play className="w-2.5 h-2.5" fill="white" />{" "}
              <FakeStat min={500} max={50000} />
            </span>
          </div>
        </div>

        {/* Caption + engagement row */}
        <div
          className={`px-3 py-2.5 space-y-1.5 ${
            T.isDark ? "bg-[#121212]" : "bg-white"
          } border-b ${
            T.isDark ? "border-white/5" : "border-black/5"
          }`}
        >
          <p
            className={`text-[11px] sm:text-xs leading-snug line-clamp-2 font-medium ${
              T.isDark ? "text-white/85" : "text-black/80"
            }`}
          >
            {isLoading
              ? "Loading..."
              : hasFailed
              ? "Video unavailable"
              : video.title || `TikTok by @${TIKTOK_USERNAME}`}
          </p>
          <div className="flex items-center gap-4 text-[10px] opacity-50">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" /> <FakeStat min={100} max={8500} />
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />{" "}
              <FakeStat min={10} max={1200} />
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-3 h-3" /> <FakeStat min={50} max={3000} />
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

// ─── Skeleton rows for loading state ──────────────────────────────────────────

function SkeletonRow({ index }: { index: number }) {
  const T = useT();
  return (
    <div
      className={`animate-pulse ${
        T.isDark ? "bg-white/5" : "bg-black/5"
      }`}
      style={{ aspectRatio: "9/16", marginBottom: "1px" }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TikTokDrop() {
  const T = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  const [videos, setVideos] = useState<TikTokVideo[]>(() =>
    TIKTOK_VIDEOS.slice(0, MAX_VIDEOS).map((url) => ({
      url,
      thumbnail: null,
      title: "",
    }))
  );

  const fetchStarted = useRef(false);

  const fetchThumbnails = useCallback(async () => {
    const urls = TIKTOK_VIDEOS.slice(0, MAX_VIDEOS);
    const results = await Promise.allSettled(urls.map(fetchOEmbed));

    setVideos(
      urls.map((url, i) => {
        const result = results[i];
        if (result.status === "fulfilled") {
          return {
            url,
            thumbnail: result.value.thumbnail,
            title: result.value.title,
          };
        }
        return { url, thumbnail: "", title: "" };
      })
    );
  }, []);

  useEffect(() => {
    if (isInView && !fetchStarted.current) {
      fetchStarted.current = true;
      fetchThumbnails();
    }
  }, [isInView, fetchThumbnails]);

  const isLoading = videos.some((v) => v.thumbnail === null);

  return (
    <section
      ref={sectionRef}
      className={`relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 md:px-8 overflow-hidden transition-colors duration-300 ${
        T.isDark
          ? "bg-gradient-to-b from-black via-[#0a0a0a] to-black"
          : "bg-gradient-to-b from-white via-[#f8f8f8] to-white"
      }`}
    >
      {/* Ambient glow */}
      <motion.div
        initial={{ opacity: 0, x: "30%", y: "-40%" }}
        animate={
          isInView
            ? { opacity: T.isDark ? 0.10 : 0.06, x: "18%", y: "-18%" }
            : { opacity: 0, x: "30%", y: "-40%" }
        }
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 right-0 w-[300px] sm:w-[500px] md:w-[700px] h-[300px] sm:h-[500px] md:h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 sm:mb-10 md:mb-14"
        >
          <div className="w-12 h-[3px] bg-[#ef4444] mb-4 sm:mb-5" />
          <span className="inline-block px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded text-[#ef4444] text-xs font-bold tracking-widest uppercase mb-4 sm:mb-5">
            Latest Drop
          </span>
          <div className="flex items-end gap-3 sm:gap-4 flex-wrap">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none ${T.text}`}
            >
              ON TIKTOK
            </h2>
            <motion.div
              initial={{ width: 0 }}
              animate={
                isInView ? { width: "60px" } : { width: 0 }
              }
              transition={{
                duration: 0.9,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-[3px] bg-[#ef4444] mb-1 sm:mb-2 origin-left hidden sm:block"
            />
          </div>
          <p
            className={`mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-md ${T.textMuted}`}
          >
            African culture, music &amp; storytelling — straight from the feed.
          </p>
        </motion.div>

        {/* ── Live label ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10"
        >
          <div className="w-5 sm:w-6 h-px bg-[#ef4444] flex-shrink-0" />
          <span
            className={`text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase ${T.textFaint} whitespace-nowrap`}
          >
            @{TIKTOK_USERNAME} · latest videos
          </span>
          <LiveDot />
          <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent min-w-0" />
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════
            PHONE-FRAME WIDGET
            ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 40, scale: 0.95 }
          }
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <div
            className={`relative w-full max-w-[390px] rounded-[2.5rem] overflow-hidden shadow-2xl ${
              T.isDark
                ? "bg-[#0d0d0d] shadow-[#ef4444]/10 ring-1 ring-white/10"
                : "bg-white shadow-black/15 ring-1 ring-black/10"
            }`}
          >
            {/* ── Phone notch / status bar ── */}
            <div
              className={`relative h-10 sm:h-11 flex items-center justify-center ${
                T.isDark ? "bg-[#0d0d0d]" : "bg-white"
              }`}
            >
              {/* Notch pill */}
              <div
                className={`w-20 sm:w-24 h-5 sm:h-6 rounded-full ${
                  T.isDark ? "bg-[#1a1a1a]" : "bg-[#e5e5e5]"
                }`}
              />
            </div>

            {/* ── Profile header ── */}
            <div
              className={`px-4 sm:px-5 py-3 sm:py-4 ${
                T.isDark ? "bg-[#0d0d0d]" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-black ${
                    T.isDark
                      ? "bg-gradient-to-br from-[#ef4444]/30 to-[#ef4444]/10 text-white"
                      : "bg-gradient-to-br from-[#ef4444]/20 to-[#ef4444]/5 text-black"
                  }`}
                >
                  <TikTokIcon size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm sm:text-base font-bold tracking-wide truncate ${T.text}`}
                  >
                    @{TIKTOK_USERNAME}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span
                      className={`text-[10px] sm:text-xs font-semibold ${
                        T.isDark ? "text-white/40" : "text-black/40"
                      }`}
                    >
                      <span className="font-bold text-inherit">Afronated</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <LiveDot />
                      <span className="text-[9px] font-bold tracking-widest uppercase text-[#ef4444]">
                        Live
                      </span>
                    </span>
                  </div>
                  <p
                    className={`text-[10px] sm:text-[11px] mt-1 ${
                      T.isDark ? "text-white/30" : "text-black/30"
                    }`}
                  >
                    <FakeStat min={10000} max={500000} /> followers ·{" "}
                    <FakeStat min={50000} max={2000000} /> likes
                  </p>
                </div>

                {/* Follow button */}
                <motion.a
                  href={TIKTOK_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full text-[11px] sm:text-xs font-bold tracking-wide transition-colors flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Follow
                </motion.a>
              </div>

              {/* Bio */}
              <p
                className={`mt-3 text-[10px] sm:text-[11px] leading-relaxed ${
                  T.isDark ? "text-white/45" : "text-black/40"
                }`}
              >
                🌍 African culture, music &amp; storytelling. New drops weekly.
                Tap to watch on TikTok.
              </p>

              {/* External link hint */}
              <div
                className={`mt-2 flex items-center gap-1 text-[9px] ${
                  T.isDark ? "text-white/25" : "text-black/25"
                }`}
              >
                <ArrowUpRight className="w-2.5 h-2.5" />
                <span>tiktok.com</span>
              </div>
            </div>

            {/* ── Divider ── */}
            <div
              className={`h-px ${
                T.isDark ? "bg-white/8" : "bg-black/8"
              }`}
            />

            {/* ── Tab bar ── */}
            <div
              className={`flex items-center px-4 sm:px-5 py-2 gap-6 text-[10px] sm:text-[11px] font-bold tracking-wide ${
                T.isDark ? "bg-[#0d0d0d]" : "bg-white"
              }`}
            >
              <span className="text-[#ef4444] border-b-2 border-[#ef4444] pb-1.5">
                Videos
              </span>
              <span
                className={`pb-1.5 ${
                  T.isDark ? "text-white/30" : "text-black/30"
                }`}
              >
                Liked
              </span>
            </div>
            <div
              className={`h-px ${
                T.isDark ? "bg-white/5" : "bg-black/5"
              }`}
            />

            {/* ── Scrollable video feed ── */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "70vh", WebkitOverflowScrolling: "touch" }}
            >
              {isLoading
                ? // Skeleton state
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} index={i} />
                  ))
                : // Video rows
                  videos.map((video, i) => (
                    <VideoRow
                      key={video.url}
                      video={video}
                      index={i}
                      isVisible={isInView}
                    />
                  ))}
            </div>

            {/* ── Bottom CTA ── */}
            <div
              className={`px-4 sm:px-5 py-3 ${
                T.isDark ? "bg-[#0d0d0d]" : "bg-white"
              } border-t ${
                T.isDark ? "border-white/8" : "border-black/8"
              }`}
            >
              <motion.a
                href={TIKTOK_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 3 }}
                className={`group inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-wide hover:text-[#ef4444] transition-colors duration-300 ${T.text}`}
              >
                <TikTokIcon size={13} />
                OPEN IN TIKTOK
                <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className={`mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-7 border-t ${
            T.isDark ? "border-white/8" : "border-black/8"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                T.isDark ? "bg-white/8" : "bg-black/6"
              }`}
            >
              <TikTokIcon size={17} />
            </div>
            <div>
              <p className={`text-sm font-bold tracking-wide ${T.text}`}>
                @{TIKTOK_USERNAME}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <LiveDot />
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase ${T.textFaint}`}
                >
                  Live on TikTok
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              {["African culture", "Music", "Storytelling"].map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
                    T.isDark
                      ? "border-white/10 text-white/40"
                      : "border-black/10 text-black/35"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <motion.a
              href={TIKTOK_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className={`group inline-flex items-center gap-2.5 font-bold tracking-wide text-sm hover:text-[#ef4444] transition-colors duration-300 ${T.text}`}
            >
              <TikTokIcon size={14} />
              FOLLOW ON TIKTOK
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 pointer-events-none"
        style={{
          background: T.isDark
            ? "linear-gradient(to top, black, transparent)"
            : "linear-gradient(to top, white, transparent)",
        }}
      />
    </section>
  );
}