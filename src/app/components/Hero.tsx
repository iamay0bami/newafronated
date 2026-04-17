import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── YouTube thumbnail sizes ───────────────────────────────────────────────────
// maxresdefault (1280×720) — best quality, sometimes missing for older videos
// sddefault     (640×480)  — reliable fallback
// hqdefault     (480×360)  — always present
const YT_ID = "YnsnAwQaZhM";
const THUMB_MAXRES = `https://img.youtube.com/vi/${YT_ID}/maxresdefault.jpg`;
const THUMB_SD     = `https://img.youtube.com/vi/${YT_ID}/sddefault.jpg`;
const THUMB_HQ     = `https://img.youtube.com/vi/${YT_ID}/hqdefault.jpg`;

/**
 * useIsMobile
 *
 * Returns true on devices narrower than 1024 px (phones + tablets).
 * We only show the thumbnail-first strategy on mobile/tablet because
 * desktop connections load the video quickly enough that the poster
 * attribute is sufficient.
 *
 * We use 1024 px (lg breakpoint) rather than 768 px so that iPads in
 * landscape are also covered.
 */
function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const onChange = (e: MediaQueryListEvent) => setMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return mobile;
}

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed]   = useState(false);
  // videoReady = true once the video has enough data to play smoothly
  const [videoReady, setVideoReady]     = useState(false);
  // thumbSrc — start with the highest-res thumbnail, fall back if it 404s
  const [thumbSrc, setThumbSrc]         = useState(THUMB_MAXRES);

  const isMobile = useIsMobile();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay blocked — video poster / thumbnail fallback will show
      });
    };

    tryPlay();

    const onInteraction = () => {
      tryPlay();
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("click",      onInteraction);
    };
    document.addEventListener("touchstart", onInteraction, { passive: true });
    document.addEventListener("click",      onInteraction);

    return () => {
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("click",      onInteraction);
    };
  }, []);

  /**
   * Handle YouTube thumbnail 404s.
   * maxresdefault is sometimes missing → fall back to sddefault → hqdefault.
   */
  const handleThumbError = () => {
    if (thumbSrc === THUMB_MAXRES) setThumbSrc(THUMB_SD);
    else if (thumbSrc === THUMB_SD) setThumbSrc(THUMB_HQ);
    // hqdefault always exists — no further fallback needed
  };

  /**
   * Called when the video has buffered enough to start smooth playback.
   * We use `canplaythrough` (fires once) so the crossfade only happens
   * once the browser is confident it can play without stalling.
   *
   * On desktop (isMobile === false) we skip this entirely and just let
   * the video play normally with the standard poster attribute.
   */
  const handleCanPlayThrough = () => {
    if (isMobile) setVideoReady(true);
  };

  return (
    <section
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
    >
      {/* ─────────────────────────────────────────────────────────────────────
          Layer stack (back to front):
          1. Gradient fallback          — always present, lowest layer
          2. YouTube thumbnail          — visible immediately on mobile, fades
                                          out once the video is ready
          3. Video element              — fades in once canplaythrough fires
          4. Dark overlay               — always on top of media, below content
          5. Hero content
      ───────────────────────────────────────────────────────────────────── */}

      {/* ── 1. Gradient fallback (base layer) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)",
        }}
      />

      {/* ── 2. YouTube thumbnail — mobile only ── */}
      {isMobile && !videoFailed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            // Fade out once the video is loaded and ready to play.
            // Using a CSS transition here instead of Framer Motion keeps this
            // layer lightweight — it's essentially an <img> wrapper.
            opacity: videoReady ? 0 : 1,
            transition: "opacity 0.8s ease",
            pointerEvents: "none",
          }}
        >
          <img
            src={thumbSrc}
            alt=""
            aria-hidden="true"
            onError={handleThumbError}
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
            }}
          />
        </div>
      )}

      {/* ── 3. Video element ── */}
      {!videoFailed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            // On mobile the video fades IN once ready (starts invisible).
            // On desktop it's always visible (opacity 1) — same as before.
            opacity: isMobile ? (videoReady ? 1 : 0) : 1,
            transition: isMobile ? "opacity 0.8s ease" : "none",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            // poster is still set as a belt-and-suspenders fallback for
            // desktop and for the brief instant before our thumbnail renders.
            poster="/hero-poster.jpg"
            onError={() => setVideoFailed(true)}
            onCanPlayThrough={handleCanPlayThrough}
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
            }}
          >
            <source src="/hero-reel.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* ── 4. Dark overlay — always above the media layers ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── 5. Hero content ── */}
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