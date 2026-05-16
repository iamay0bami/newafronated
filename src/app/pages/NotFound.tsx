import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Home } from "lucide-react";
import { useT } from "../context/ThemeContext";
import { useSEO } from "../hooks/useSEO";

export function NotFound() {
  const T = useT();

  useSEO({
    title: "Page Not Found — Afronated",
    description: "The page you're looking for doesn't exist. Head back to the Afronated homepage.",
    noIndex: true,
  });

  return (
    <div
      className={`relative min-h-screen w-full flex items-center justify-center px-6 transition-colors duration-300 overflow-hidden ${T.bg} ${T.text}`}
    >
      {/* Ambient glow — contained inside overflow-hidden */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: T.isDark ? 0.06 : 0.04,
        }}
      />

      <div className="relative z-10 text-center w-full max-w-sm mx-auto">

        {/* Ghost 404 */}
        <div className="select-none pointer-events-none" aria-hidden="true">
          <span
            className="block font-black tracking-tighter leading-none"
            style={{
              fontSize: "clamp(4.5rem, 28vw, 10rem)",
              color: T.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            404
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="-mt-3"
        >
          <div className="w-8 h-[3px] bg-[#ef4444] mx-auto mb-5" />

          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tighter mb-3 ${T.text}`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            PAGE NOT FOUND
          </h1>

          {/* On-brand copy — turns a dead end into a brand moment */}
          <p className={`text-sm sm:text-base leading-relaxed mb-2 max-w-xs mx-auto ${T.textMuted}`}>
            Lost? If you're a creative, you're in the right place anyway.
          </p>
          <p className={`text-xs leading-relaxed mb-10 max-w-xs mx-auto ${T.textFaint}`}>
            The page you were looking for doesn't exist or may have moved.
          </p>

          <div className="flex flex-col items-center gap-3 w-full max-w-[260px] mx-auto">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#ef4444] text-white font-bold tracking-wide hover:bg-white hover:text-black transition-all duration-300 text-sm"
            >
              <Home className="w-4 h-4 flex-shrink-0" />
              BACK TO HOME
            </Link>

            <Link
              to="/submit"
              className={`w-full inline-flex items-center justify-center gap-3 px-6 py-4 border font-bold tracking-wide transition-all duration-300 hover:border-[#ef4444] hover:text-[#ef4444] text-sm ${
                T.isDark
                  ? "border-white/20 text-white/70"
                  : "border-black/20 text-black/60"
              }`}
            >
              PUT ME ON
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}