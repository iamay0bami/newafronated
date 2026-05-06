import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useT } from "../context/ThemeContext";

// ─── Config ───────────────────────────────────────────────────────────────────
const TIKTOK_USERNAME = "afronated";
const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@afronated";

// ─── Video ID list ────────────────────────────────────────────────────────────
// To add a new video: copy the number from tiktok.com/@afronated/video/XXXXXXX
// and prepend it here (newest first). The thumbnails + titles are fetched
// automatically via TikTok's free oEmbed API (no auth, CORS-enabled).
const TIKTOK_VIDEO_IDS = [
  "7471462893032620321",
  "7448966772487418145",
  "7440710626342248737",
  "7434145091680668960",
  "7421378068773948705",
  "7408673672217543937",
  "7397812304598576417",
  "7385041923781741857",
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface TikTokVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

// ─── Pulsing dot ─────────────────────────────────────────────────────────────
function LiveDot() {
  return (
    <span className="relative inline-flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />
    </span>
  );
}

// ─── TikTok icon ─────────────────────────────────────────────────────────────
function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
    </svg>
  );
}

// ─── Single video thumbnail card ──────────────────────────────────────────────
function VideoCard({ video, index }: { video: TikTokVideo; index: number }) {
  const T = useT();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);

  return (
    <motion.a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={video.title || `@${TIKTOK_USERNAME} TikTok video ${index + 1}`}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block overflow-hidden rounded-xl cursor-pointer"
      style={{ aspectRatio: "9/16" }}
    >
      {/* Thumbnail */}
      {!imgError && (
        <img
          src={video.thumbnail}
          alt={video.title || `@${TIKTOK_USERNAME}`}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Skeleton / fallback background */}
      {(!imgLoaded || imgError) && (
        <div className={`absolute inset-0 flex items-center justify-center ${
          T.isDark ? "bg-[#1a1a1a]" : "bg-[#e0e0e0]"
        }`}>
          <span className="opacity-30"><TikTokIcon size={32} /></span>
        </div>
      )}

      {/* Always-on dark gradient so text/icons read over any thumbnail */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      {/* Top-left: TikTok badge */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <span className="text-white"><TikTokIcon size={13} /></span>
        </div>
      </div>

      {/* Top-right: external link on hover */}
      <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <ExternalLink className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Centre: play button on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-14 h-14 rounded-full bg-[#ef4444]/90 flex items-center justify-center shadow-xl shadow-black/40">
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Bottom: video title */}
      {video.title && (
        <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
          <p className="text-white text-[10px] sm:text-[11px] leading-snug line-clamp-2 font-medium">
            {video.title}
          </p>
        </div>
      )}

      {/* Red border glow on hover */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#ef4444]/70 transition-all duration-300 pointer-events-none" />
    </motion.a>
  );
}

// ─── Skeleton placeholder card ────────────────────────────────────────────────
function SkeletonCard({ index }: { index: number }) {
  const T = useT();
  return (
    <div
      className={`relative overflow-hidden rounded-xl animate-pulse ${
        T.isDark ? "bg-[#1a1a1a]" : "bg-[#e0e0e0]"
      }`}
      style={{ aspectRatio: "9/16" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#ef4444]/5" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TikTokDrop() {
  const T = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  const [videos,      setVideos]      = useState<TikTokVideo[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  // ── Fetch via TikTok oEmbed ──────────────────────────────────────────────
  // TikTok's oEmbed endpoint:  https://www.tiktok.com/oembed?url=<video-url>
  // Returns: { title, thumbnail_url, author_name, ... }
  // No API key. No authentication. CORS-enabled — works from any browser.
  // Official TikTok Developer docs: developers.tiktok.com/doc/embed-videos
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchOne(id: string): Promise<TikTokVideo | null> {
      const videoUrl  = `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${id}`;
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
      try {
        const res  = await fetch(oembedUrl);
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.thumbnail_url) return null;
        return {
          id,
          title:     data.title ?? "",
          thumbnail: data.thumbnail_url,
          url:       videoUrl,
        };
      } catch {
        return null;
      }
    }

    async function loadAll() {
      try {
        const results = await Promise.all(
          TIKTOK_VIDEO_IDS.slice(0, 8).map(fetchOne)
        );
        if (cancelled) return;
        const valid = results.filter((v): v is TikTokVideo => v !== null);
        if (valid.length === 0) setFetchFailed(true);
        else setVideos(valid);
      } catch {
        if (!cancelled) setFetchFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, []);

  const showSkeletons = loading;
  const showVideos    = !loading && !fetchFailed && videos.length > 0;
  const showFallback  = !loading && (fetchFailed || videos.length === 0);

  return (
    <section
      ref={sectionRef}
      className={`relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 md:px-8 overflow-hidden transition-colors duration-300 ${
        T.isDark
          ? "bg-gradient-to-b from-black via-[#0a0a0a] to-black"
          : "bg-gradient-to-b from-white via-[#f8f8f8] to-white"
      }`}
    >
      {/* Ambient glow */}
      <motion.div
        initial={{ opacity: 0, x: "30%", y: "-40%" }}
        animate={isInView
          ? { opacity: T.isDark ? 0.10 : 0.06, x: "18%", y: "-18%" }
          : { opacity: 0, x: "30%", y: "-40%" }
        }
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 right-0 w-[300px] sm:w-[500px] md:w-[700px] h-[300px] sm:h-[500px] md:h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 sm:mb-10 md:mb-14"
        >
          <div className="w-12 h-[3px] bg-[#ef4444] mb-4 sm:mb-5" />
          <span className="inline-block px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded text-[#ef4444] text-xs font-bold tracking-widest uppercase mb-4 sm:mb-5">
            Latest Drop
          </span>
          <div className="flex items-end gap-3 sm:gap-4 flex-wrap">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none ${T.text}`}>
              ON TIKTOK
            </h2>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "60px" } : { width: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-[3px] bg-[#ef4444] mb-1 sm:mb-2 origin-left hidden sm:block"
            />
          </div>
          <p className={`mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-md ${T.textMuted}`}>
            African culture, music &amp; storytelling — straight from the feed.
          </p>
        </motion.div>

        {/* Live label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="w-5 sm:w-6 h-px bg-[#ef4444] flex-shrink-0" />
          <span className={`text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase ${T.textFaint} whitespace-nowrap`}>
            @{TIKTOK_USERNAME} · latest videos
          </span>
          <LiveDot />
          <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent min-w-0" />
        </motion.div>

        {/* ── Grid ── */}
        {/* 
          Portrait (9:16) cards mirroring the TikTok profile grid.
          2 cols on mobile → 3 on sm → 4 on lg → 6 on xl (shows all 8 with 2 peeking).
          Each card click = opens that video on TikTok. No autoplay. No iframe.
        */}
        {showSkeletons && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {Array(6).fill(null).map((_, i) => <SkeletonCard key={i} index={i} />)}
          </div>
        )}

        {showVideos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4"
          >
            {videos.slice(0, 8).map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </motion.div>
        )}

        {/* Fallback if oEmbed fails (network issue, CORS change, etc.) */}
        {showFallback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6 py-12"
          >
            <p className={`text-sm text-center ${T.textFaint}`}>
              See our latest videos on TikTok
            </p>
            <a
              href={TIKTOK_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#ef4444] text-white rounded-full font-bold tracking-wide hover:bg-white hover:text-black transition-all duration-300"
            >
              <TikTokIcon size={18} />
              VIEW ON TIKTOK
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        )}

        {/* Footer */}
        {!showFallback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className={`mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-7 border-t ${
              T.isDark ? "border-white/8" : "border-black/8"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                T.isDark ? "bg-white/8" : "bg-black/6"
              }`}>
                <TikTokIcon size={17} />
              </div>
              <div>
                <p className={`text-sm font-bold tracking-wide ${T.text}`}>@{TIKTOK_USERNAME}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <LiveDot />
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${T.textFaint}`}>
                    Live on TikTok
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                {["African culture", "Music", "Storytelling"].map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
                      T.isDark
                        ? "border-white/10 text-white/40"
                        : "border-black/10 text-black/35"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <motion.a
                href={TIKTOK_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                className={`group inline-flex items-center gap-2.5 font-bold tracking-wide text-sm hover:text-[#ef4444] transition-colors duration-300 ${T.text}`}
              >
                <TikTokIcon size={14} />
                FOLLOW ON TIKTOK
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 pointer-events-none"
        style={{
          background: T.isDark
            ? "linear-gradient(to top, black, transparent)"
            : "linear-gradient(to top, white, transparent)",
        }}
      />
    </section>
  );
}