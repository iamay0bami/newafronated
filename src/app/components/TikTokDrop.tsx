/**
 * TikTokDrop — Scrollable Video Feed Widget
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays TikTok videos as a clean, scrollable collection.
 * Horizontal scroll on desktop, vertical stack on mobile.
 * Uses TikTok's free oEmbed endpoint for thumbnails.
 * Clicking any video opens it directly on TikTok.com.
 *
 * oEmbed results are cached in sessionStorage for 30 minutes so the
 * 8 parallel fetch calls only happen once per session.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "../context/ThemeContext";
import { sessionCache } from "../utils/sessionCache";

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

const TIKTOK_USERNAME    = "afronated";
const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@afronated";
const MAX_VIDEOS         = 20;
const CACHE_KEY          = "afronated:tiktok-videos";

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
    title:     data.title ?? "",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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

// ─── Single video card ────────────────────────────────────────────────────────

const CARD_WIDTH_CLASS = "w-[70vw] sm:w-[38vw] md:w-[26vw] lg:w-[20vw] xl:w-[16vw]";
const CARD_MAX_WIDTH   = "max-w-[260px]";

function VideoCard({
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
      className={`flex-shrink-0 ${CARD_WIDTH_CLASS} ${CARD_MAX_WIDTH} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] rounded-xl block`}
      initial={{ opacity: 0, y: 28 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: Math.min(index * 0.06, 0.5),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative group cursor-pointer rounded-xl overflow-hidden">
        {/* Thumbnail */}
        <div className="relative w-full" style={{ aspectRatio: "9/16" }}>
          {isLoading ? (
            <div className={`w-full h-full animate-pulse rounded-xl ${T.isDark ? "bg-white/8" : "bg-black/6"}`}>
              <div className="w-full h-full bg-gradient-to-br from-transparent via-[#ef4444]/5 to-[#ef4444]/10" />
            </div>
          ) : hasFailed ? (
            <div className={`w-full h-full flex flex-col items-center justify-center gap-2 rounded-xl ${T.isDark ? "bg-[#1a1a1a]" : "bg-[#e8e8e8]"}`}>
              <div className="w-6 h-0.5 bg-[#ef4444]" />
              <TikTokIcon size={24} />
              <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">
                @{TIKTOK_USERNAME}
              </span>
            </div>
          ) : (
            <img
              src={video.thumbnail!}
              alt={video.title || `TikTok by @${TIKTOK_USERNAME}`}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              draggable={false}
            />
          )}

          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 via-black/5 to-transparent pointer-events-none" />

          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="flex items-center gap-1 px-2 py-0.5 bg-black/55 backdrop-blur-sm rounded-full text-[9px] font-bold text-white tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
              TIKTOK
            </span>
          </div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-2 px-3.5 py-2 bg-[#ef4444] rounded-full shadow-lg shadow-black/40">
              <Play className="w-3.5 h-3.5 text-white" fill="white" />
              <span className="text-white text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
                Watch on TikTok
              </span>
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{
              boxShadow: hovered
                ? "inset 0 0 0 2px #ef4444, 0 0 24px rgba(239,68,68,0.3)"
                : "inset 0 0 0 0px transparent",
            }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className="mt-2.5 px-1 pb-1">
          <p
            className={`text-[11px] sm:text-xs leading-snug line-clamp-2 font-medium ${T.isDark ? "text-white/70" : "text-black/60"}`}
            title={isLoading ? "Loading..." : hasFailed ? "Video unavailable" : video.title}
          >
            {isLoading
              ? "Loading..."
              : hasFailed
              ? "Video unavailable"
              : video.title || `TikTok by @${TIKTOK_USERNAME}`}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  const T = useT();
  return (
    <div className={`flex-shrink-0 ${CARD_WIDTH_CLASS} ${CARD_MAX_WIDTH}`}>
      <div
        className={`w-full animate-pulse rounded-xl ${T.isDark ? "bg-white/8" : "bg-black/6"}`}
        style={{ aspectRatio: "9/16" }}
      />
      <div className="mt-2.5 space-y-1.5 px-1">
        <div className={`h-3 w-full rounded animate-pulse ${T.isDark ? "bg-white/8" : "bg-black/6"}`} />
        <div className={`h-3 w-2/3 rounded animate-pulse ${T.isDark ? "bg-white/8" : "bg-black/6"}`} />
      </div>
    </div>
  );
}

// ─── Cached video shape (thumbnails only, not the null loading state) ─────────

interface CachedTikTokVideo {
  url: string;
  thumbnail: string;
  title: string;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TikTokDrop() {
  const T = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, amount: 0.05 });

  const [videos, setVideos] = useState<TikTokVideo[]>(() => {
    // Initialise from cache immediately so there's zero loading flash on revisit
    const cached = sessionCache.get<CachedTikTokVideo[]>(CACHE_KEY);
    if (cached) {
      return cached.map((v) => ({ ...v, thumbnail: v.thumbnail }));
    }
    return TIKTOK_VIDEOS.slice(0, MAX_VIDEOS).map((url) => ({
      url,
      thumbnail: null,
      title: "",
    }));
  });

  const fetchStarted = useRef(false);
  // If we already had a cache hit during useState init, mark fetch as done
  const alreadyCached = useRef(
    sessionCache.get<CachedTikTokVideo[]>(CACHE_KEY) !== null
  );

  const fetchThumbnails = useCallback(async () => {
    const urls = TIKTOK_VIDEOS.slice(0, MAX_VIDEOS);
    const results = await Promise.allSettled(urls.map(fetchOEmbed));

    const resolved = urls.map((url, i) => {
      const result = results[i];
      if (result.status === "fulfilled") {
        return { url, thumbnail: result.value.thumbnail, title: result.value.title };
      }
      return { url, thumbnail: "", title: "" };
    });

    // Persist to cache
    sessionCache.set<CachedTikTokVideo[]>(CACHE_KEY, resolved);

    setVideos(resolved);
  }, []);

  useEffect(() => {
    if (alreadyCached.current) return; // cache hit — skip fetch
    if (isInView && !fetchStarted.current) {
      fetchStarted.current = true;
      fetchThumbnails();
    }
  }, [isInView, fetchThumbnails]);

  const isLoading = !alreadyCached.current && videos.some((v) => v.thumbnail === null);

  // ── Scroll helpers ──
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.65;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, videos]);

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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
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
              animate={isInView ? { width: "60px" } : { width: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-[3px] bg-[#ef4444] mb-1 sm:mb-2 origin-left hidden sm:block"
            />
          </div>
          <p className={`mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-md ${T.textMuted}`}>
            African culture, music &amp; storytelling — straight from the feed.
          </p>
        </motion.div>

        {/* Video feed widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className={`rounded-2xl overflow-hidden border ${
              T.isDark
                ? "bg-[#0a0a0a] border-white/8"
                : "bg-white border-black/8"
            } shadow-xl ${T.isDark ? "shadow-black/40" : "shadow-black/5"}`}
          >
            {/* Widget header */}
            <div
              className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b ${
                T.isDark ? "border-white/6" : "border-black/6"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${T.isDark ? "bg-white/8" : "bg-black/6"}`}>
                  <TikTokIcon size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm sm:text-base font-bold tracking-wide ${T.text}`}>
                      @{TIKTOK_USERNAME}
                    </p>
                    <LiveDot />
                  </div>
                  <p className={`text-[10px] sm:text-xs ${T.isDark ? "text-white/35" : "text-black/35"}`}>
                    Latest videos on TikTok
                  </p>
                </div>
              </div>

              <motion.a
                href={TIKTOK_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full text-xs font-bold tracking-wide transition-colors flex-shrink-0"
              >
                <TikTokIcon size={12} />
                Follow
              </motion.a>
            </div>

            {/* Scrollable video row */}
            <div className="relative group/widget">
              {canScrollLeft && (
                <button
                  onClick={() => scroll("left")}
                  aria-label="Scroll left"
                  className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-opacity duration-200 ${
                    T.isDark
                      ? "bg-black/60 text-white hover:bg-black/80"
                      : "bg-white/70 text-black hover:bg-white/90"
                  } shadow-lg opacity-0 group-hover/widget:opacity-100`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div
                ref={scrollRef}
                className="flex gap-3 sm:gap-4 px-4 sm:px-6 py-5 sm:py-6 overflow-x-auto scrollbar-hide items-start"
                style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
                onScroll={checkScroll}
              >
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                  : videos.map((video, i) => (
                      <div key={video.url} style={{ scrollSnapAlign: "start" }}>
                        <VideoCard video={video} index={i} isVisible={isInView} />
                      </div>
                    ))}
              </div>

              {canScrollRight && (
                <button
                  onClick={() => scroll("right")}
                  aria-label="Scroll right"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-opacity duration-200 ${
                    T.isDark
                      ? "bg-black/60 text-white hover:bg-black/80"
                      : "bg-white/70 text-black hover:bg-white/90"
                  } shadow-lg opacity-0 group-hover/widget:opacity-100`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r ${T.isDark ? "from-[#0a0a0a]" : "from-white"} to-transparent`} />
              <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-transparent ${T.isDark ? "to-[#0a0a0a]" : "to-white"}`} />
            </div>

            {/* Widget footer */}
            <div className={`flex items-center justify-between px-4 sm:px-6 py-3 border-t ${T.isDark ? "border-white/6" : "border-black/6"}`}>
              <span className={`text-[10px] sm:text-xs ${T.isDark ? "text-white/30" : "text-black/30"}`}>
                {videos.length} videos
              </span>
              <motion.a
                href={TIKTOK_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 3 }}
                className={`group inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-wide hover:text-[#ef4444] transition-colors duration-300 ${T.text}`}
              >
                <TikTokIcon size={11} />
                Open in TikTok
                <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Section footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className={`mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-7 border-t ${
            T.isDark ? "border-white/8" : "border-black/8"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${T.isDark ? "bg-white/8" : "bg-black/6"}`}>
              <TikTokIcon size={17} />
            </div>
            <div>
              <p className={`text-sm font-bold tracking-wide ${T.text}`}>
                @{TIKTOK_USERNAME}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <LiveDot />
                <span className={`text-[10px] font-bold tracking-widest uppercase ${T.textFaint}`}>
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

      <div
        className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 pointer-events-none"
        style={{
          background: T.isDark
            ? "linear-gradient(to top, black, transparent)"
            : "linear-gradient(to top, white, transparent)",
        }}
      />

      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}