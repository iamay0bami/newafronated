import { motion } from "motion/react";
import { Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video background */}
      <div
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="auto"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "cover",
            objectPosition: "center center",
            minWidth: "100%",
            minHeight: "100%",
            width: "100%",
            height: "100%",
          }}
        >
          <source src="/hero-reel.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-8">
        <div className="text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded-full text-[#ef4444] text-xs md:text-sm font-bold tracking-widest uppercase">
              Creative Media Collective
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mb-6 flex justify-center"
          >
            <img
              src="/logo-transparent.png"
              alt="Afronated"
              className="h-24 md:h-32 lg:h-40 xl:h-48 w-auto"
              style={{ filter: "invert(1)", mixBlendMode: "screen" }}
              draggable={false}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            Amplifying African voices through powerful storytelling, innovative
            media, and cultural excellence.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              document
                .getElementById("interviews")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full hover:bg-[#ef4444] hover:text-white transition-all duration-300 font-bold tracking-wide"
          >
            <Play className="w-5 h-5" /> WATCH OUR WORK
          </motion.button>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}