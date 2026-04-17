import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt autoplay immediately and on first user interaction
    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay blocked — video poster/fallback gradient will show
      });
    };

    tryPlay();

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
    <section
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
    >
      {/* ── Video layer ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          // Fallback gradient shown while video loads or if it fails
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)",
        }}
      >
        {!videoFailed && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            poster="/hero-poster.jpg"
            onError={() => setVideoFailed(true)}
            /*
             * Why these exact styles:
             *
             * position absolute + inset 0 + width/height 100% — fills the
             * container completely on every browser including mobile Safari.
             *
             * object-fit cover — crops the video to fill the frame regardless
             * of its source aspect ratio.  If the client shot the video in
             * portrait (9:16 on iPhone), this will zoom/crop it to fill a
             * landscape 16:9 frame.  That is the correct behaviour for a hero
             * background — there is no CSS-only way to "make a portrait video
             * fill landscape without cropping" because pixels have to come from
             * somewhere.  See the note below the component for what to tell the
             * client if they want a non-cropped result.
             *
             * object-position center center — crops symmetrically so the
             * subject stays centred.  If the subject is off-centre in the
             * source video, the client should re-export with the subject
             * centred, or you can change this to e.g. "center 20%" to bias
             * toward the top.
             *
             * min-width / min-height 100% with width / height auto — classic
             * "cover" trick that predates object-fit and acts as an extra
             * safety net on very old WebViews.
             */
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              // Translate back so the centre of the video aligns with the
              // centre of the container.
              transform: "translate(-50%, -50%)",
              // These two lines implement "cover" for browsers that don't
              // honour object-fit on <video> (old Android WebViews).
              minWidth: "100%",
              minHeight: "100%",
              // On modern browsers object-fit handles everything.
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              // Prevent any intrinsic size from leaking through.
              display: "block",
            }}
          >
            <source src="/hero-reel.mp4" type="video/mp4" />
          </video>
        )}

        {/* Dark overlay — ensures text is always legible over any video frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.85) 100%)",
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