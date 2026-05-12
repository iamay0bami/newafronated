import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const YT_ID = "YnsnAwQaZhM";
const THUMB_MAXRES = `https://img.youtube.com/vi/${YT_ID}/maxresdefault.jpg`;
const THUMB_SD     = `https://img.youtube.com/vi/${YT_ID}/sddefault.jpg`;
const THUMB_HQ     = `https://img.youtube.com/vi/${YT_ID}/hqdefault.jpg`;

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

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed]   = useState(false);
  const [videoReady, setVideoReady]     = useState(false);
  const [thumbSrc, setThumbSrc]         = useState(THUMB_MAXRES);
  const isMobile = useIsMobile();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => { video.play().catch(() => {}); };
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

  const handleThumbError = () => {
    if (thumbSrc === THUMB_MAXRES) setThumbSrc(THUMB_SD);
    else if (thumbSrc === THUMB_SD) setThumbSrc(THUMB_HQ);
  };

  const handleCanPlayThrough = () => {
    if (isMobile) setVideoReady(true);
  };

  return (
    <section
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
      aria-label="Afronated — African Creative Media Collective"
    >
      {/* ── 1. Gradient fallback ── */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)",
        }}
      />

      {/* ── 2. YouTube thumbnail — mobile only ── */}
      {isMobile && !videoFailed && (
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 1,
            opacity: videoReady ? 0 : 1,
            transition: "opacity 0.8s ease",
            pointerEvents: "none",
          }}
        >
          <img
            src={thumbSrc} alt="" aria-hidden="true"
            onError={handleThumbError}
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: "100%", minHeight: "100%",
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center center", display: "block",
            }}
          />
        </div>
      )}

      {/* ── 3. Video ── */}
      {!videoFailed && (
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            opacity: isMobile ? (videoReady ? 1 : 0) : 1,
            transition: isMobile ? "opacity 0.8s ease" : "none",
          }}
        >
          <video
            ref={videoRef}
            autoPlay muted loop playsInline disablePictureInPicture preload="auto"
            poster="/hero-poster.jpg"
            onError={() => setVideoFailed(true)}
            onCanPlayThrough={handleCanPlayThrough}
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: "100%", minHeight: "100%",
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center center", display: "block",
            }}
          >
            <source src="/hero-reel.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* ── 4. Dark overlay ── */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 3,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── 5. Hero content ── */}
      <div
        style={{
          position: "relative", zIndex: 10, height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 1rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "64rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ marginBottom: "1.5rem" }}
          >
            <span style={{
              display: "inline-block", padding: "0.5rem 1rem",
              background: "rgba(239,68,68,0.20)", border: "1px solid rgba(239,68,68,0.40)",
              borderRadius: "9999px", color: "#ef4444",
              fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
            }}>
              Creative Media Collective
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}
          >
            {/*
              SEO: This is the homepage H1. Visually it renders as the logo image
              (which is correct for branding), but the accessible text "Afronated"
              is read by crawlers and screen readers, satisfying Bing's H1
              requirement without changing the visual design at all.
            */}
            <h1
              style={{
                margin: 0,
                lineHeight: 1,
                /* Let the image dictate the visual size */
                fontSize: 0,
                color: "transparent",
              }}
            >
              <img
                src="/logo-transparent.png"
                alt="Afronated"
                draggable={false}
                style={{
                  height: "clamp(6rem, 12vw, 12rem)", width: "auto",
                  filter: "invert(1)", mixBlendMode: "screen",
                  /* Reset font-size:0 visual side-effects on the img itself */
                  fontSize: "initial",
                }}
              />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "rgba(255,255,255,0.80)", maxWidth: "42rem",
              margin: "0 auto 3rem", fontWeight: 300, lineHeight: 1.7,
            }}
          >
            A media platform that supports and amplifies African creatives and creativity.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById("interviews")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full hover:bg-[#ef4444] hover:text-white transition-all duration-300 font-bold tracking-wide"
          >
            <Play className="w-5 h-5" /> WATCH OUR WORK
          </motion.button>
        </div>
      </div>
    </section>
  );
}