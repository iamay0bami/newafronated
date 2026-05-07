/**
 * TikTokDrop — Static Thumbnail Grid
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays TikTok videos as clean portrait thumbnail cards.
 * Clicking any card opens the TikTok video directly — no in-page playback,
 * no autoplay, no "related videos" drift.
 *
 * HOW TO ADD NEW VIDEOS (takes ~10 seconds):
 *   1. Copy the TikTok video URL from the app or browser
 *      e.g. https://www.tiktok.com/@afronated/video/7636822040716086548
 *   2. Paste it at the TOP of TIKTOK_VIDEOS below (newest first)
 *   3. Save. Done.
 *
 * THUMBNAIL STRATEGY:
 *   TikTok's oEmbed endpoint (api.tiktok.com/v1/oembed) returns a
 *   thumbnail_url for each video — no API key, no auth, completely free.
 *   We fetch thumbnails lazily when the section scrolls into view, so there's
 *   zero performance cost until the user reaches this section.
 *   If a thumbnail fails (deleted/private video), the card shows a branded
 *   fallback with the Afronated red accent — always looks intentional.
 *
 * RESPONSIVE GRID:
 *   Mobile  (<480px):  2 columns
 *   sm      (480px+):  3 columns
 *   md      (768px+):  4 columns
 *   lg      (1024px+): 5 columns
 *   xl      (1280px+): 6 columns
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
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

const TIKTOK_USERNAME    = "afronated";
const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@afronated";

// Max cards to render (keeps mobile scroll manageable)
const MAX_CARDS = 8;

// ─── Types ────────────────────────────────────────────────────────────────────

interface TikTokCard {
  url: string;
  thumbnail: string | null; // null = loading, "" = failed
  title: string;
}

// ─── oEmbed fetcher ───────────────────────────────────────────────────────────
// TikTok's oEmbed endpoint is free, no API key needed.
// Returns: { thumbnail_url, title, author_name, … }

async function fetchOEmbed(videoUrl: string): Promise<{ thumbnail: string; title: string }> {
  const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`oEmbed ${res.status}`);
  const data = await res.json();
  return {
    thumbnail: data.thumbnail_url ?? "",
    title:     data.title        ?? "",
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

// ─── Single card ──────────────────────────────────────────────────────────────

function VideoCard({
  card,
  index,
  isVisible,
}: {
  card: TikTokCard;
  index: number;
  isVisible: boolean;
}) {
  const T = useT();
  const [hovered, setHovered] = useState(false);
  const isLoading = card.thumbnail === null;
  const hasFailed = card.thumbnail === "";

  return (
    <motion.a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={card.title || `Watch TikTok video ${index + 1}`}
      className="block relative w-full cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] rounded-xl"
      style={{ aspectRatio: "9/16" }}
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.92 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
        delay: Math.min(index * 0.06, 0.42), // cap stagger so last card doesn't wait forever
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Card shell ── */}
      <div className="relative w-full h-full rounded-xl overflow-hidden group">

        {/* ── Thumbnail / loading / fallback ── */}
        {isLoading ? (
          // Skeleton shimmer while fetching
          <div
            className={`w-full h-full animate-pulse ${
              T.isDark ? "bg-white/8" : "bg-black/6"
            }`}
          >
            <div className="w-full h-full bg-gradient-to-br from-transparent via-[#ef4444]/5 to-[#ef4444]/10" />
          </div>
        ) : hasFailed ? (
          // Branded fallback — looks intentional, not broken
          <div
            className={`w-full h-full flex flex-col items-center justify-center gap-3 ${
              T.isDark ? "bg-[#111]" : "bg-[#f0f0f0]"
            }`}
          >
            <div className="w-8 h-1 bg-[#ef4444]" />
            <TikTokIcon size={28} />
            <span className={`text-[10px] font-bold tracking-widest uppercase ${T.textFaint}`}>
              @{TIKTOK_USERNAME}
            </span>
          </div>
        ) : (
          // Real thumbnail
          <img
            src={card.thumbnail!}
            alt={card.title || `TikTok by @${TIKTOK_USERNAME}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            draggable={false}
          />
        )}

        {/* ── Always-present gradient overlay ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

        {/* ── "SHORT" badge top-left ── */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <span className="flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full text-[9px] sm:text-[10px] font-bold text-white tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
            TIKTOK
          </span>
        </div>

        {/* ── Hover overlay — play icon + "Watch on TikTok" ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          aria-hidden="true"
        >
          {/* Play pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ef4444] rounded-full shadow-lg shadow-black/40">
            <Play className="w-3 h-3 text-white" fill="white" />
            <span className="text-white text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
              Watch on TikTok
            </span>
          </div>
        </motion.div>

        {/* ── Hover border glow ── */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: hovered
              ? "inset 0 0 0 2px #ef4444, 0 0 24px rgba(239,68,68,0.35)"
              : "inset 0 0 0 0px transparent",
          }}
          transition={{ duration: 0.2 }}
        />

        {/* ── Bottom label ── */}
        {!isLoading && !hasFailed && card.title && (
          <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10 pointer-events-none">
            <p className="text-white text-[10px] sm:text-xs font-semibold leading-snug line-clamp-2 opacity-80">
              {card.title}
            </p>
          </div>
        )}
      </div>
    </motion.a>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TikTokDrop() {
  const T          = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, amount: 0.05 });

  // Card state: initialise with null thumbnails (loading)
  const [cards, setCards] = useState<TikTokCard[]>(() =>
    TIKTOK_VIDEOS.slice(0, MAX_CARDS).map((url) => ({
      url,
      thumbnail: null,
      title: "",
    }))
  );

  // Fetch all thumbnails once the section enters the viewport
  const fetchStarted = useRef(false);

  const fetchThumbnails = useCallback(async () => {
    const urls = TIKTOK_VIDEOS.slice(0, MAX_CARDS);

    // Fire all requests in parallel for speed
    const results = await Promise.allSettled(urls.map(fetchOEmbed));

    setCards(
      urls.map((url, i) => {
        const result = results[i];
        if (result.status === "fulfilled") {
          return { url, thumbnail: result.value.thumbnail, title: result.value.title };
        }
        return { url, thumbnail: "", title: "" }; // failed → branded fallback
      })
    );
  }, []);

  useEffect(() => {
    if (isInView && !fetchStarted.current) {
      fetchStarted.current = true;
      fetchThumbnails();
    }
  }, [isInView, fetchThumbnails]);

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
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none ${T.text}`}>
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

        {/* ── Live label ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10"
        >
          <div className="w-5 sm:w-6 h-px bg-[#ef4444] flex-shrink-0" />
          <span className={`text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase ${T.textFaint} whitespace-nowrap`}>
            @{TIKTOK_USERNAME} · latest videos
          </span>
          <LiveDot />
          <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent min-w-0" />
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────────────
          RESPONSIVE GRID
          • 2 cols on the smallest phones  (default, < 480px)
          • 3 cols from 480 px (xs / large phones portrait)
          • 4 cols from 768 px (tablets)
          • 5 cols from 1024 px (small desktops)
          • 6 cols from 1280 px (wide desktops)

          Each card is 9:16 (portrait), so the grid self-sizes based on
          available width — no fixed heights needed.
        ───────────────────────────────────────────────────────────────────── */}
        <div
          className="grid gap-2 sm:gap-3"
          style={{
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          {/* Use inline style for the responsive breakpoints since Tailwind
              v4 requires compiled classes — a JS-driven grid-cols approach
              avoids the purge issue on dynamic class names. */}
          <style>{`
            @media (min-width: 480px)  { .tt-drop-grid { grid-template-columns: repeat(3, 1fr) !important; } }
            @media (min-width: 768px)  { .tt-drop-grid { grid-template-columns: repeat(4, 1fr) !important; } }
            @media (min-width: 1024px) { .tt-drop-grid { grid-template-columns: repeat(5, 1fr) !important; } }
            @media (min-width: 1280px) { .tt-drop-grid { grid-template-columns: repeat(6, 1fr) !important; } }
          `}</style>
          <div className="tt-drop-grid grid gap-2 sm:gap-3 col-span-full"
            style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {cards.map((card, i) => (
              <VideoCard
                key={card.url}
                card={card}
                index={i}
                isVisible={isInView}
              />
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className={`mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-7 border-t ${
            T.isDark ? "border-white/8" : "border-black/8"
          }`}
        >
          {/* Profile pill */}
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
                <span className={`text-[10px] font-bold tracking-widest uppercase ${T.textFaint}`}>
                  Live on TikTok
                </span>
              </div>
            </div>
          </div>

          {/* Tags + CTA */}
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