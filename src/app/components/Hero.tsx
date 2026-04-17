import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only autoplay on desktop by default to avoid blocking mobile load
    const isMobile = window.innerWidth < 768;

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay blocked — poster/gradient fallback remains visible
      });
    };

    if (!isMobile) {
      // Desktop: attempt immediately
      tryPlay();
    }

    // On any user interaction (tap, click, scroll) — start the video
    const onInteraction = () => {
      tryPlay();
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("click", onInteraction);
      document.removeEventListener("scroll", onInteraction);
    };

    document.addEventListener("touchstart", onInteraction, { passive: true });
    document.addEventListener("click", onInteraction);
    document.addEventListener("scroll", onInteraction, { passive: true });

    return cleanup;
  }, []);

  return (
    <section
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
    >
      {/* ── Background layer ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          // Fallback gradient — always visible until video fades in
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)",
        }}
      >
        {/* Static poster image — shows immediately, zero load cost */}
        {!videoFailed && (
          <img
            src="/hero-poster.jpg"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              // Fade out once video is ready to play
              opacity: videoReady ? 0 : 1,
              transition: "opacity 0.8s ease",
              pointerEvents: "none",
            }}
          />
        )}

        {!videoFailed && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            // metadata: load only enough to know dimensions/duration — fast on mobile
            // full video streams progressively as it plays
            preload="metadata"
            // poster still shown by browser before JS fades it
            poster="/hero-poster.jpg"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: "100%",
              minHeight: "100%",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              display: "block",
              // Fade in once buffered enough to play
              opacity: videoReady ? 1 : 0,
              transition: "opacity 0.8s ease",
            }}
          >
            {/*
              Serve a smaller/faster WebM first (if you have one), then MP4 as fallback.
              If you only have MP4 that's fine — just keep the single source below.
              To create a WebM version: use HandBrake or ffmpeg:
                ffmpeg -i hero-reel.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 -vf scale=1280:-2 hero-reel.webm
            */}
            {/* <source src="/hero-reel.webm" type="video/webm" /> */}
            <source src="/hero-reel.mp4" type="video/mp4" />
          </video>
        )}

        {/* Dark overlay — always on top of video */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.85) 100%)",
            zIndex: 1,
          }}
        />
      </div>

      {/* ── Hero content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 1rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "64rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ marginBottom: "1.5rem" }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                background: "rgba(239,68,68,0.20)",
                border: "1px solid rgba(239,68,68,0.40)",
                borderRadius: "9999px",
                color: "#ef4444",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Creative Media Collective
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}
          >
            <img
              src="/logo-transparent.png"
              alt="Afronated"
              draggable={false}
              style={{
                height: "clamp(6rem, 12vw, 12rem)",
                width: "auto",
                filter: "invert(1)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "rgba(255,255,255,0.80)",
              maxWidth: "42rem",
              margin: "0 auto 3rem",
              fontWeight: 300,
              lineHeight: 1.7,
            }}
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
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "1.5rem",
            height: "2.5rem",
            border: "2px solid rgba(255,255,255,0.30)",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "0.5rem",
          }}
        >
          <motion.div
            style={{
              width: "0.375rem",
              height: "0.5rem",
              background: "rgba(255,255,255,0.60)",
              borderRadius: "9999px",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}