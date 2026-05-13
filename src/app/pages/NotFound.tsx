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
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${T.bg} ${T.text}`}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: T.isDark ? 0.06 : 0.04,
        }}
      />

      <div className="relative z-10 text-center max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Big 404 */}
          <p
            className="font-black tracking-tighter leading-none mb-6 select-none"
            style={{
              fontSize: "clamp(6rem, 20vw, 14rem)",
              color: T.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            404
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="-mt-8 md:-mt-16"
        >
          <div className="w-8 h-[3px] bg-[#ef4444] mx-auto mb-6" />

          <h1
            className={`text-3xl md:text-4xl font-black tracking-tighter mb-4 ${T.text}`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            PAGE NOT FOUND
          </h1>

          <p className={`text-base md:text-lg leading-relaxed mb-10 ${T.textMuted}`}>
            The page you're looking for doesn't exist or may have been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#ef4444] text-white font-bold tracking-wide hover:bg-white hover:text-black transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              BACK TO HOME
            </Link>

            <Link
              to="/submit"
              className={`inline-flex items-center gap-3 px-8 py-4 border font-bold tracking-wide transition-all duration-300 hover:border-[#ef4444] hover:text-[#ef4444] ${
                T.isDark ? "border-white/20 text-white/70" : "border-black/20 text-black/60"
              }`}
            >
              PUT ME ON
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}