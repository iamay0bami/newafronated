/**
 * TikTokDrop — Official TikTok Embed Grid
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses TikTok's own official embed system (the same <blockquote> embed that
 * TikTok's "Share → Embed" button generates). This is:
 *
 *   ✅  Officially supported & free forever — TikTok's own product
 *   ✅  Shows real thumbnail, caption, like/comment/share counts — live data
 *   ✅  Clicking opens TikTok.com on desktop / deep-links the app on mobile
 *   ✅  No API key, no CORS issues, no paid service, no backend required
 *   ✅  Portrait 9:16 cards — looks exactly like TikTok's profile grid
 *
 * TO ADD A NEW VIDEO:
 *   1. Go to the video on TikTok → Share → Copy link
 *   2. Grab the numeric ID from: tiktok.com/@afronated/video/XXXXXXXXXXXXXXX
 *   3. Add { id: "XXXXXXXXXXXXXXX" } at the TOP of TIKTOK_VIDEOS (newest first)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useT } from "../context/ThemeContext";

// ─── Config ───────────────────────────────────────────────────────────────────

const TIKTOK_USERNAME    = "afronated";
const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@afronated";

// Newest first. Max VISIBLE_COUNT are rendered.
const TIKTOK_VIDEOS: { id: string }[] = [
  { id: "7471462893032620321" },
  { id: "7448966772487418145" },
  { id: "7440710626342248737" },
  { id: "7434145091680668960" },
  { id: "7421378068773948705" },
  { id: "7408673672217543937" },
  { id: "7397812304598576417" },
  { id: "7385041923781741857" },
];

const VISIBLE_COUNT = 6;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function videoUrl(id: string) {
  return `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${id}`;
}

function loadTikTokSDK() {
  if (document.getElementById("tiktok-embed-sdk")) return;
  const s   = document.createElement("script");
  s.id      = "tiktok-embed-sdk";
  s.src     = "https://www.tiktok.com/embed.js";
  s.async   = true;
  document.body.appendChild(s);
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative inline-flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />
    </span>
  );
}

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
    </svg>
  );
}

// ─── Single embed card ────────────────────────────────────────────────────────

function EmbedCard({ id, index, isVisible }: { id: string; index: number; isVisible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.93 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 32, scale: 0.93 }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      {/*
        Official TikTok blockquote embed.
        TikTok's SDK (embed.js) scans the DOM for these and replaces each with
        a live iframe showing: video thumbnail, caption, username, engagement counts.
        data-embed-from="oembed" is TikTok's recommended attribution flag.
      */}
      <blockquote
        className="tiktok-embed"
        cite={videoUrl(id)}
        data-video-id={id}
        data-embed-from="oembed"
        style={{ maxWidth: "100%", minWidth: "0", margin: 0 }}
      >
        <section>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={videoUrl(id)}
            style={{ fontSize: "0.75rem", opacity: 0.5 }}
          >
            Watch on TikTok ↗
          </a>
        </section>
      </blockquote>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TikTokDrop() {
  const T          = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, amount: 0.05 });

  const visibleVideos = TIKTOK_VIDEOS.slice(0, VISIBLE_COUNT);

  // Load the TikTok embed SDK once when the section scrolls into view
  useEffect(() => {
    if (isInView) loadTikTokSDK();
  }, [isInView]);

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

        {/*
          ── Embed grid ──────────────────────────────────────────────────────────
          3 columns on md+, 2 columns on mobile.
          The <style> tag overrides TikTok's default max-width (605px) so each
          card fills its grid cell cleanly.
        */}
        <style>{`
          .tt-grid .tiktok-embed,
          .tt-grid .tiktok-embed iframe {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
          }
          .tt-grid .tiktok-embed {
            border-radius: 12px;
            overflow: hidden;
          }
        `}</style>

        <div className="tt-grid grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {visibleVideos.map((v, i) => (
            <EmbedCard key={v.id} id={v.id} index={i} isVisible={isInView} />
          ))}
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
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${T.isDark ? "bg-white/8" : "bg-black/6"}`}>
              <TikTokIcon size={17} />
            </div>
            <div>
              <p className={`text-sm font-bold tracking-wide ${T.text}`}>@{TIKTOK_USERNAME}</p>
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
                    T.isDark ? "border-white/10 text-white/40" : "border-black/10 text-black/35"
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