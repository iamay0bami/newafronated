import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useT } from "../context/ThemeContext";

// ─── Config ───────────────────────────────────────────────────────────────────
// SociableKit widget ID for @afronated TikTok feed.
// To update: swap the widget ID in the src URL below.
const SOCIABLEKIT_WIDGET_ID = "25673144";
const SOCIABLEKIT_URL = `https://widgets.sociablekit.com/tiktok-feed/iframe/${SOCIABLEKIT_WIDGET_ID}`;
const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@afronated";

// ─── TikTok icon (same SVG used throughout the codebase) ──────────────────────
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
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className={`relative py-24 md:py-32 px-4 md:px-8 overflow-hidden transition-colors duration-300 ${
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
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />

      {/* ── Noise texture ────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Section header ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16"
        >
          {/* Red accent bar */}
          <div className="w-12 h-[3px] bg-[#ef4444] mb-5" />

          <span className="inline-block px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded text-[#ef4444] text-xs font-bold tracking-widest uppercase mb-5">
            Latest Drop
          </span>

          <div className="flex items-end gap-4 flex-wrap">
            <h2
              className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none ${T.text}`}
            >
              ON TIKTOK
            </h2>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "80px" } : { width: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-[3px] bg-[#ef4444] mb-2 origin-left"
            />
          </div>

          <p className={`mt-4 text-base md:text-lg max-w-md ${T.textMuted}`}>
            African culture, music &amp; storytelling — straight from the feed.
          </p>
        </motion.div>

        {/* ── Live feed label ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-6 h-px bg-[#ef4444]" />
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${T.textFaint}`}>
            @afronated · live feed
          </span>
          <LiveDot />
          <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent" />
        </motion.div>

        {/* ── Feed card ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={`rounded-2xl overflow-hidden border transition-colors duration-300 ${
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
            className={`flex items-center justify-between px-6 py-4 border-b transition-colors duration-300 ${
              T.isDark ? "border-white/6" : "border-black/6"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  T.isDark ? "bg-white/8" : "bg-black/6"
                }`}
              >
                <FaTiktok className={`w-3.5 h-3.5 ${T.isDark ? "text-white" : "text-black"}`} />
              </div>
              <span className={`text-sm font-bold tracking-wide ${T.text}`}>
                @afronated
              </span>
            </div>

            <div className="flex items-center gap-2">
              <LiveDot />
              <span className={`text-[10px] font-bold tracking-widest uppercase ${T.textFaint}`}>
                Live
              </span>
            </div>
          </div>

          {/* ── SociableKit iframe ─────────────────────────────────────── */}
          {/*
            SociableKit renders the full @afronated TikTok feed.
            The iframe is set to a generous height (600px desktop, 480px mobile)
            so a grid of videos is visible without scrolling.

            allowtransparency + frameBorder="0" prevent a white box flash on
            slower connections. scrolling="no" hides the inner scrollbar since
            the iframe already has internal pagination/infinite scroll.
          */}
          <div className="w-full h-[480px] md:h-[600px] overflow-hidden">
            <iframe
              src={SOCIABLEKIT_URL}
              title="Afronated TikTok Feed"
              className="w-full h-full"
              style={{ border: "none" }}
              allowFullScreen
              allow="encrypted-media; autoplay"
              // @ts-expect-error — non-standard but widely supported attribute
              frameBorder="0"
              scrolling="no"
              allowTransparency
            />
          </div>

          {/* Card footer */}
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5 border-t transition-colors duration-300 ${
              T.isDark ? "border-white/6" : "border-black/6"
            }`}
          >
            <div className="flex items-center gap-3">
              {["African culture", "Music", "Storytelling"].map((tag) => (
                <span
                  key={tag}
                  className={`hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
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

        {/* ── Decorative stat line ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 flex items-center justify-center gap-8"
        >
          {[
            { label: "Platform", value: "TikTok" },
            { label: "Handle",   value: "@afronated" },
            { label: "Content",  value: "Culture & Music" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center hidden md:block">
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
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: T.isDark
            ? "linear-gradient(to top, black, transparent)"
            : "linear-gradient(to top, white, transparent)",
        }}
      />
    </section>
  );
}