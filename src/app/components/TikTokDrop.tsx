import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useT } from "../context/ThemeContext";

// ─── Config ───────────────────────────────────────────────────────────────────
// To update: replace the videoId below with the latest TikTok video ID.
// Get the ID from the TikTok URL: https://www.tiktok.com/@afronated/video/XXXXXXXXXXXXXXXXXX
// Just paste the long numeric string as videoId.

const FEATURED_TIKTOK = {
  videoId: "7627601060894461204", // ← update to latest video ID from @afronated
  caption: "Our latest drop — tune in.",
  profileUrl: "https://www.tiktok.com/@afronated",
};

// ─── Main component ───────────────────────────────────────────────────────────

export function TikTokDrop() {
  const T = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const embedUrl = `https://www.tiktok.com/embed/v2/${FEATURED_TIKTOK.videoId}`;

  return (
    <section
      ref={sectionRef}
      className={`relative py-24 md:py-32 px-4 md:px-8 overflow-hidden transition-colors duration-300 ${
        T.isDark
          ? "bg-gradient-to-b from-black via-[#0a0a0a] to-black"
          : "bg-gradient-to-b from-white via-[#f8f8f8] to-white"
      }`}
    >
      {/* Animated spotlight — tracks in from top-right on reveal */}
      <motion.div
        initial={{ opacity: 0, x: "30%", y: "-40%" }}
        animate={
          isInView
            ? { opacity: T.isDark ? 0.12 : 0.07, x: "20%", y: "-20%" }
            : { opacity: 0, x: "30%", y: "-40%" }
        }
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #ef4444 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header — slides in from left */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16"
        >
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded text-[#ef4444] text-xs font-bold tracking-widest uppercase">
              Latest Drop
            </span>
          </div>
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
              className="h-[3px] bg-[#ef4444] mb-3 origin-left"
            />
          </div>
          <p className={`mt-4 text-base md:text-lg max-w-md ${T.textMuted}`}>
            {FEATURED_TIKTOK.caption}
          </p>
        </motion.div>

        {/* Layout: video on left, context panel on right */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-16 items-center">

          {/* TikTok embed — drops in from below with elastic easing */}
          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 12 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, rotateX: 0 }
                : { opacity: 0, y: 80, rotateX: 12 }
            }
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ perspective: 1000 }}
            className="mx-auto lg:mx-0"
          >
            <div
              className="relative overflow-hidden"
              style={{ width: "325px", height: "576px" }}
            >
              {/* Glow frame */}
              <div
                className="absolute -inset-[1px] rounded-[18px] pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(239,68,68,0.5) 0%, transparent 50%, rgba(239,68,68,0.2) 100%)",
                  padding: "1px",
                }}
              />
              <iframe
                src={embedUrl}
                className="w-full h-full rounded-[16px]"
                allowFullScreen
                allow="encrypted-media"
                style={{ border: "none" }}
                title="Afronated TikTok"
              />
            </div>
          </motion.div>

          {/* Context panel — reveals line by line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-8 lg:max-w-sm"
          >
            {/* TikTok profile stat block */}
            <div className="space-y-6">
              {[
                {
                  label: "Platform",
                  value: "TikTok",
                  icon: <FaTiktok className="w-4 h-4" />,
                  delay: 0.6,
                },
                {
                  label: "Handle",
                  value: "@afronated",
                  icon: null,
                  delay: 0.7,
                },
                {
                  label: "Content",
                  value: "African culture, music & storytelling",
                  icon: null,
                  delay: 0.8,
                },
              ].map(({ label, value, icon, delay }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                  }
                  transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4"
                >
                  <div
                    className={`w-px self-stretch min-h-[2rem] ${
                      T.isDark ? "bg-white/10" : "bg-black/10"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5 ${T.textFaint}`}
                    >
                      {label}
                    </p>
                    <p
                      className={`text-sm font-semibold flex items-center gap-2 ${T.text}`}
                    >
                      {icon}
                      {value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className={`h-px origin-left ${
                T.isDark ? "bg-white/10" : "bg-black/10"
              }`}
            />

            {/* CTA */}
            <motion.a
              href={FEATURED_TIKTOK.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
              }
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ x: 6 }}
              className={`group inline-flex items-center gap-3 font-bold tracking-wide hover:text-[#ef4444] transition-colors ${T.text}`}
            >
              <FaTiktok className="w-5 h-5" />
              FOLLOW ON TIKTOK
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: T.isDark
            ? "linear-gradient(to top, black, transparent)"
            : "linear-gradient(to top, white, transparent)",
        }}
      />
    </section>
  );
}