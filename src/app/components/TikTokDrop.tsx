import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useT } from "../context/ThemeContext";

// ─── Config ───────────────────────────────────────────────────────────────────
const SOCIABLEKIT_WIDGET_ID = "25673144";
const SOCIABLEKIT_URL = `https://widgets.sociablekit.com/tiktok-feed/iframe/${SOCIABLEKIT_WIDGET_ID}`;
const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@afronated";

// ─── TikTok icon ──────────────────────────────────────────────────────────────
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

// ─── Pulsing "live" dot ───────────────────────────────────────────────────────
function LiveDot() {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TikTokDrop() {
  const T = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className={`relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 md:px-8 overflow-hidden transition-colors duration-300 ${
        T.isDark
          ? "bg-gradient-to-b from-black via-[#0a0a0a] to-black"
          : "bg-gradient-to-b from-white via-[#f8f8f8] to-white"
      }`}
    >
      {/* ── Ambient glow ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: "30%", y: "-40%" }}
        animate={
          isInView
            ? { opacity: T.isDark ? 0.10 : 0.06, x: "18%", y: "-18%" }
            : { opacity: 0, x: "30%", y: "-40%" }
        }
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Section header ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 sm:mb-10 md:mb-12 lg:mb-16"
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

        {/* ── Live feed label ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
        >
          <div className="w-5 sm:w-6 h-px bg-[#ef4444] flex-shrink-0" />
          <span className={`text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase ${T.textFaint} whitespace-nowrap`}>
            @afronated · live feed
          </span>
          <LiveDot />
          <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent min-w-0" />
        </motion.div>

        {/* ── Feed card ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={`rounded-xl sm:rounded-2xl overflow-hidden border transition-colors duration-300 ${
            T.isDark
              ? "bg-[#0a0a0a] border-white/8"
              : "bg-white border-black/8"
          }`}
          style={{
            boxShadow: T.isDark
              ? "0 0 80px rgba(239,68,68,0.06), 0 32px 64px rgba(0,0,0,0.4)"
              : "0 32px 64px rgba(0,0,0,0.08)",
          }}
        >
          {/* Card header */}
          <div
            className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b transition-colors duration-300 ${
              T.isDark ? "border-white/6" : "border-black/6"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  T.isDark ? "bg-white/8" : "bg-black/6"
                }`}
              >
                <FaTiktok className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${T.isDark ? "text-white" : "text-black"}`} />
              </div>
              <span className={`text-xs sm:text-sm font-bold tracking-wide ${T.text}`}>
                @afronated
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <LiveDot />
              <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase ${T.textFaint}`}>
                Live
              </span>
            </div>
          </div>

          {/*
            ── SociableKit iframe ──────────────────────────────────────────
            RESPONSIVE HEIGHT STRATEGY:
            - xs phones (≤374px):  420px — shows ~1 row of videos without cutoff
            - sm phones (375–413px): 480px — iPhone SE/standard
            - md phones (414–767px): 520px — iPhone Plus/Max
            - tablets (768px+):    580px
            - desktop (1024px+):   640px

            We use a CSS custom property approach via inline style + clamp()
            so the iframe fills appropriately at every breakpoint without JS.

            The key insight: SociableKit's grid on mobile renders in a 2-column
            layout with ~220px tall cards. At 420px height, 2 full rows are
            visible. The previous 480px on mobile was cutting mid-card.

            We also set overflow: hidden on the wrapper and let the iframe
            scroll internally (scrolling="yes") so users can browse more videos
            by scrolling inside the embed — this is more natural on mobile than
            a clipped non-scrollable window.
          ──────────────────────────────────────────────────────────────────── */}
          <div
            className="w-full overflow-hidden"
            style={{
              height: "clamp(420px, 70vw, 660px)",
            }}
          >
            <iframe
              src={SOCIABLEKIT_URL}
              title="Afronated TikTok Feed"
              width="100%"
              height="100%"
              style={{ border: "none", display: "block" }}
              allowFullScreen
              allow="encrypted-media; autoplay"
              // @ts-expect-error — non-standard but widely supported
              frameBorder="0"
              scrolling="yes"
              allowTransparency
            />
          </div>

          {/* Card footer */}
          <div
            className={`flex flex-col xs:flex-row sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-t transition-colors duration-300 ${
              T.isDark ? "border-white/6" : "border-black/6"
            }`}
          >
            {/* Tags — hidden on very small screens, shown from sm */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-wrap">
              {["African culture", "Music", "Storytelling"].map((tag) => (
                <span
                  key={tag}
                  className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 sm:px-2.5 py-1 rounded-full border ${
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
              className={`group inline-flex items-center gap-2 sm:gap-2.5 font-bold tracking-wide text-xs sm:text-sm hover:text-[#ef4444] transition-colors duration-300 ${T.text}`}
            >
              <TikTokIcon size={14} />
              FOLLOW ON TIKTOK
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </div>
        </motion.div>

        {/* ── Decorative stat line — hidden on mobile to save space ─────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-6 sm:mt-8 hidden md:flex items-center justify-center gap-8"
        >
          {[
            { label: "Platform", value: "TikTok" },
            { label: "Handle",   value: "@afronated" },
            { label: "Content",  value: "Culture & Music" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className={`text-[9px] font-bold tracking-[0.2em] uppercase mb-1 ${T.textFaint}`}>
                {label}
              </p>
              <p className={`text-xs font-semibold ${T.textMuted}`}>{value}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
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