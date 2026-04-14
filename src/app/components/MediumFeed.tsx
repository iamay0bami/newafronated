import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useT } from "../context/ThemeContext";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  description: string;
}

// ─── RSS → JSON fetch ─────────────────────────────────────────────────────────

const MEDIUM_RSS = "https://medium.com/feed/@afro-nated";
const RSS2JSON   = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS)}&api_key=&count=10`;

function extractThumbnail(item: Record<string, unknown>): string {
  // rss2json sometimes puts it in thumbnail, sometimes in content
  if (item.thumbnail && typeof item.thumbnail === "string" && item.thumbnail.startsWith("http")) {
    return item.thumbnail;
  }
  // Try to pull first <img> src from content string
  if (typeof item.content === "string") {
    const match = item.content.match(/<img[^>]+src="([^"]+)"/);
    if (match) return match[1];
  }
  return "";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch {
    return "";
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

// ─── Single Card ──────────────────────────────────────────────────────────────

function ArticleCard({ article, T }: { article: Article; T: ReturnType<typeof useT> }) {
  const [imgError, setImgError] = useState(false);
  const excerpt = stripHtml(article.description).slice(0, 100) + "…";

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-[280px] md:w-[320px] block"
      tabIndex={0}
      aria-label={article.title}
    >
      <div
        className={`
          relative h-full rounded-lg overflow-hidden border transition-all duration-300
          group-hover:border-[#ef4444]/60 group-hover:shadow-[0_0_24px_rgba(239,68,68,0.12)]
          ${T.isDark
            ? "bg-[#0d0d0d] border-white/8"
            : "bg-[#f7f7f7] border-black/8"}
        `}
      >
        {/* Cover image */}
        <div className="relative w-full h-[160px] overflow-hidden bg-[#1a1a1a]">
          {article.thumbnail && !imgError ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Branded placeholder */
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
              <div className="text-center px-4">
                <div className="w-8 h-1 bg-[#ef4444] mx-auto mb-3" />
                <span className={`text-xs font-bold tracking-widest uppercase ${T.textFaint}`}>
                  Afronated
                </span>
              </div>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${T.textFaint}`}>
            {formatDate(article.pubDate)}
          </p>

          <h3
            className={`
              font-bold text-sm leading-snug mb-2 line-clamp-2
              group-hover:text-[#ef4444] transition-colors duration-300
              ${T.text}
            `}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {article.title}
          </h3>

          <p className={`text-xs leading-relaxed line-clamp-2 mb-4 ${T.textFaint}`}>
            {excerpt}
          </p>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold tracking-wide text-[#ef4444] uppercase">
              Read on Medium
            </span>
            <ArrowUpRight className="w-3 h-3 text-[#ef4444] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Bottom red accent line — grows on hover */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#ef4444] group-hover:w-full transition-all duration-500" />
      </div>
    </a>
  );
}

// ─── Skeleton card shown while loading ───────────────────────────────────────

function SkeletonCard({ T }: { T: ReturnType<typeof useT> }) {
  return (
    <div
      className={`
        flex-shrink-0 w-[280px] md:w-[320px] rounded-lg overflow-hidden border
        ${T.isDark ? "bg-[#0d0d0d] border-white/8" : "bg-[#f7f7f7] border-black/8"}
      `}
    >
      <div className="w-full h-[160px] bg-white/5 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-2 w-16 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-full rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-4/5 rounded bg-white/10 animate-pulse" />
        <div className="h-2 w-full rounded bg-white/5 animate-pulse" />
        <div className="h-2 w-3/4 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MediumFeed() {
  const T = useT();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [paused, setPaused]     = useState(false);

  const trackRef   = useRef<HTMLDivElement>(null);
  const animRef    = useRef<number | null>(null);
  const posRef     = useRef(0);
  const speedRef   = useRef(0.6); // px per frame

  // ── Fetch ──
  useEffect(() => {
    let cancelled = false;
    fetch(RSS2JSON)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.status === "ok" && Array.isArray(data.items)) {
          const parsed: Article[] = data.items.slice(0, 8).map((item: Record<string, unknown>) => ({
            title:       String(item.title ?? ""),
            link:        String(item.link  ?? ""),
            pubDate:     String(item.pubDate ?? ""),
            thumbnail:   extractThumbnail(item),
            description: String(item.description ?? ""),
          }));
          setArticles(parsed);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // ── Marquee animation ──
  useEffect(() => {
    const track = trackRef.current;
    if (!track || articles.length === 0) return;

    const GAP = 24; // gap between cards in px

    const tick = () => {
      if (!paused) {
        posRef.current -= speedRef.current;
        const halfWidth = (track.scrollWidth - GAP) / 2;
        if (Math.abs(posRef.current) >= halfWidth) posRef.current = 0;
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current !== null) cancelAnimationFrame(animRef.current); };
  }, [articles, paused]);

  // ── Don't render anything if there's an error (graceful degradation) ──
  if (error) return null;

  // Double the articles so the strip loops seamlessly
  const displayArticles = loading
    ? Array(5).fill(null)
    : [...articles, ...articles];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="mt-14 -mx-4 md:-mx-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Section label */}
      <div className="px-4 md:px-8 mb-6 flex items-center gap-4">
        <div className="w-6 h-px bg-[#ef4444]" />
        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${T.textFaint}`}>
          From the Blog
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent" />
      </div>

      {/* Scrolling strip */}
      <div className="overflow-hidden w-full">
        <div
          ref={trackRef}
          className="flex gap-6 w-max will-change-transform"
          style={{ paddingLeft: "32px", paddingRight: "32px" }}
        >
          {displayArticles.map((article, i) =>
            loading ? (
              <SkeletonCard key={i} T={T} />
            ) : (
              <ArticleCard key={`${(article as Article).link}-${i}`} article={article as Article} T={T} />
            )
          )}
        </div>
      </div>

      {/* Pause indicator */}
      {paused && articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-4 flex justify-center"
        >
          <span className={`text-[10px] tracking-widest uppercase ${T.textFaint}`}>
            — paused —
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}