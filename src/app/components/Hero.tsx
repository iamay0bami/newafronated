import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { AfronatedLogo } from "./AfronatedLogo";

export function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video / image background */}
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          <img src="https://img.youtube.com/vi/YnsnAwQaZhM/maxresdefault.jpg" alt="Hero Background" className="w-full h-full object-cover"/>
        ) : (
          <iframe
            src="https://www.youtube.com/embed/YnsnAwQaZhM?autoplay=1&mute=1&loop=1&playlist=YnsnAwQaZhM&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            title="Hero Background"
            className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            allow="autoplay; encrypted-media"
            style={{ border: "none", minWidth: "100vw", minHeight: "100vh" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black"/>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-8">
        <div className="text-center max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="mb-6">
            <span className="inline-block px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded-full text-[#ef4444] text-xs md:text-sm font-bold tracking-widest uppercase">
              Creative Media Collective
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7 }} className="mb-6 flex justify-center">
            {/*
              Hero sits on a dark overlay (bg-black gradient), so we always
              need the logo inverted to white here regardless of global theme.
              We apply the invert+screen treatment directly.
            */}
            <img
              src="/logo-transparent.png"
              alt="Afronated"
              className="h-24 md:h-32 lg:h-40 xl:h-48 w-auto"
              style={{ filter: "invert(1)", mixBlendMode: "screen" }}
              draggable={false}
            />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9 }}
            className="text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Amplifying African voices through powerful storytelling, innovative media, and cultural excellence.
          </motion.p>

          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 1.1 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById("interviews")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full hover:bg-[#ef4444] hover:text-white transition-all duration-300 font-bold tracking-wide">
            <Play className="w-5 h-5"/> WATCH OUR WORK
          </motion.button>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <motion.div className="w-1.5 h-2 bg-white/60 rounded-full"/>
        </motion.div>
      </motion.div>
    </section>
  );
}
