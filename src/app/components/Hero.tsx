import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useEffect, useRef } from "react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force play on mobile — iOS Safari requires a direct .play() call
    // after a user gesture OR with muted + playsinline + autoplay combo.
    // We call play() manually as a belt-and-suspenders approach.
    const tryPlay = () => {
      video.play().catch(() => {
        // Silently swallow — autoplay policy blocked it (fine, poster shows)
      });
    };

    // Attempt immediately
    tryPlay();

    // Also attempt on first user interaction (covers iOS strict mode)
    const onInteraction = () => {
      tryPlay();
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("click", onInteraction);
    };
    document.addEventListener("touchstart", onInteraction, { passive: true });
    document.addEventListener("click", onInteraction);

    return () => {
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("click", onInteraction);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* ── Video background ── */}
      <div className="absolute inset-0 z-0">
        {/*
          KEY FIXES FOR FULLSCREEN + MOBILE:
          1. `object-fit: cover` + `object-position: center` fills the frame
             regardless of the video's original aspect ratio.
          2. `width/height: 100%` on both the wrapper and video element.
          3. `playsinline` (camelCase: playsInline) is REQUIRED for iOS Safari
             to play inline instead of opening the native player.
          4. `muted` is REQUIRED for autoplay to work in any modern browser.
          5. `autoPlay` alone isn't enough on mobile — see useEffect above.
          6. A `poster` attribute shows a solid dark frame while the video loads,
             preventing the white/blank background flash on mobile.
             Replace "/hero-poster.jpg" with a real frame grab if you have one,
             or remove the attribute to fall back to the CSS background below.
        */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="auto"
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "cover",
            objectPosition: "center center",
            /*
              Force the video element itself to cover the full viewport.
              Without explicit width/height 100%, some browsers (especially
              mobile Safari) render at the video's intrinsic resolution.
            */
            width: "100%",
            height: "100%",
            /*
              If the video is portrait-oriented (shot on mobile in 9:16),
              `object-fit: cover` will crop the sides to fill landscape.
              That's intentional — it's the correct behaviour for a hero bg.
            */
          }}
        >
          <source src="/hero-reel.mp4" type="video/mp4" />
        </video>

        {/* Fallback: solid dark bg shown before video loads / if it fails */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)" }}
        />

        {/* Overlay gradient — darkens edges, keeps text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
      </div>

      {/* ── Hero content ── */}
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

      {/* ── Scroll indicator ── */}
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