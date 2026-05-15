import { useEffect, useRef, useState, useCallback } from "react";
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
const RSS2JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS)}&api_key=&count=10`;

function extractThumbnail(item: Record<string, unknown>): string {
  if (
    item.thumbnail &&
    typeof item.thumbnail === "string" &&
    item.thumbnail.startsWith("http")
  ) {
    return item.thumbnail;
  }
  if (typeof item.content === "string") {
    const match = item.content.match(/<img[^>]+src="([^"]+)"/);
    if (match) return match[1];
  }
  return "";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .trim();
}

// ─── Single Card ──────────────────────────────────────────────────────────────

function ArticleCard({
  article,
  T,
}: {
  article: Article;
  T: ReturnType<typeof useT>;
}) {
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
      onClick={(e) => {
        if ((e.currentTarget as HTMLElement).closest("[data-dragging='true']")) {
          e.preventDefault();
        }
      }}
    >
      <div
        className={`
          relative h-full rounded-lg overflow-hidden border transition-all duration-300
          group-hover:border-[#ef4444]/60 group-hover:shadow-[0_0_24px_rgba(239,68,68,0.12)]
          ${
            T.isDark
              ? "bg-[#0d0d0d] border-white/8"
              : "bg-[#f7f7f7] border-black/8"
          }
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
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
              <div className="text-center px-4">
                <div className="w-8 h-1 bg-[#ef4444] mx-auto mb-3" />
                <span
                  className={`text-xs font-bold tracking-widest uppercase ${T.textFaint}`}
                >
                  Afronated
                </span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          <p
            className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${T.textFaint}`}
          >
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

          <p
            className={`text-xs leading-relaxed line-clamp-2 mb-4 ${T.textFaint}`}
          >
            {excerpt}
          </p>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold tracking-wide text-[#ef4444] uppercase">
              Read on Medium
            </span>
            <ArrowUpRight className="w-3 h-3 text-[#ef4444] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Bottom red accent line */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#ef4444] group-hover:w-full transition-all duration-500" />
      </div>
    </a>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard({ T }: { T: ReturnType<typeof useT> }) {
  return (
    <div
      className={`
        flex-shrink-0 w-[280px] md:w-[320px] rounded-lg overflow-hidden border
        ${
          T.isDark
            ? "bg-[#0d0d0d] border-white/8"
            : "bg-[#f7f7f7] border-black/8"
        }
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Respect prefers-reduced-motion — if the user has opted out of motion,
  // we disable the autoscroll entirely and just show a static scrollable strip.
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Autoscroll state — starts paused if user prefers reduced motion
  const [autoPaused, setAutoPaused] = useState(prefersReducedMotion);

  // Refs for the scrollable container (not the inner track)
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const scrollPosRef = useRef(0);
  const speedRef = useRef(0.6); // px per frame

  // Drag state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const lastClientXRef = useRef(0);
  const velocityRef = useRef(0);
  const momentumRef = useRef<number | null>(null);

  // ── Fetch ──
  useEffect(() => {
    let cancelled = false;
    fetch(RSS2JSON)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.status === "ok" && Array.isArray(data.items)) {
          const parsed: Article[] = data.items
            .slice(0, 8)
            .map((item: Record<string, unknown>) => ({
              title: String(item.title ?? ""),
              link: String(item.link ?? ""),
              pubDate: String(item.pubDate ?? ""),
              thumbnail: extractThumbnail(item),
              description: String(item.description ?? ""),
            }));
          setArticles(parsed);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Autoscroll animation ──
  // Disabled entirely when prefersReducedMotion is true.
  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container || articles.length === 0) return;

    const startRaf = requestAnimationFrame(() => {
      const tick = () => {
        if (!isDraggingRef.current && !autoPaused) {
          scrollPosRef.current += speedRef.current;

          const halfWidth = container.scrollWidth / 2;
          if (scrollPosRef.current >= halfWidth) {
            scrollPosRef.current -= halfWidth;
          }

          container.scrollLeft = scrollPosRef.current;
        }
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(startRaf);
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [articles, autoPaused, prefersReducedMotion]);

  // ── Sync scrollPosRef when user manually scrolls ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      if (!isDraggingRef.current) {
        scrollPosRef.current = container.scrollLeft;
      }
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  // ── Momentum helper ──
  const cancelMomentum = useCallback(() => {
    if (momentumRef.current !== null) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
  }, []);

  const applyMomentum = useCallback(() => {
    cancelMomentum();
    if (prefersReducedMotion) {
      // No momentum when reduced motion is preferred — just stop
      scrollPosRef.current = containerRef.current?.scrollLeft ?? 0;
      setAutoPaused(true); // stays paused; autoscroll is already disabled
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let vel = velocityRef.current;

    const step = () => {
      if (Math.abs(vel) < 0.3) {
        scrollPosRef.current = container.scrollLeft;
        setAutoPaused(false);
        momentumRef.current = null;
        return;
      }
      vel *= 0.92;
      scrollPosRef.current = container.scrollLeft + vel;

      const halfWidth = container.scrollWidth / 2;
      if (scrollPosRef.current >= halfWidth) scrollPosRef.current -= halfWidth;
      if (scrollPosRef.current < 0) scrollPosRef.current += halfWidth;

      container.scrollLeft = scrollPosRef.current;
      momentumRef.current = requestAnimationFrame(step);
    };
    momentumRef.current = requestAnimationFrame(step);
  }, [cancelMomentum, prefersReducedMotion]);

  // ── Mouse drag handlers ──
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    cancelMomentum();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    lastClientXRef.current = e.clientX;
    scrollStartRef.current = containerRef.current?.scrollLeft ?? 0;
    velocityRef.current = 0;
    setAutoPaused(true);
    e.preventDefault();
  }, [cancelMomentum]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastClientXRef.current;
    lastClientXRef.current = e.clientX;
    velocityRef.current = -dx;

    const totalDx = e.clientX - dragStartXRef.current;
    if (Math.abs(totalDx) > 5) hasDraggedRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    scrollPosRef.current = container.scrollLeft - dx;

    const halfWidth = container.scrollWidth / 2;
    if (scrollPosRef.current >= halfWidth) scrollPosRef.current -= halfWidth;
    if (scrollPosRef.current < 0) scrollPosRef.current += halfWidth;

    container.scrollLeft = scrollPosRef.current;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (hasDraggedRef.current) {
      applyMomentum();
    } else {
      scrollPosRef.current = containerRef.current?.scrollLeft ?? 0;
      // Only resume autoscroll if reduced motion is NOT preferred
      if (!prefersReducedMotion) setAutoPaused(false);
    }
  }, [applyMomentum, prefersReducedMotion]);

  // ── Touch handlers ──
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    cancelMomentum();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.touches[0].clientX;
    lastClientXRef.current = e.touches[0].clientX;
    scrollStartRef.current = containerRef.current?.scrollLeft ?? 0;
    velocityRef.current = 0;
    setAutoPaused(true);
  }, [cancelMomentum]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - lastClientXRef.current;
    lastClientXRef.current = touch.clientX;
    velocityRef.current = -dx;

    const totalDx = touch.clientX - dragStartXRef.current;
    if (Math.abs(totalDx) > 5) hasDraggedRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    scrollPosRef.current = container.scrollLeft - dx;

    const halfWidth = container.scrollWidth / 2;
    if (scrollPosRef.current >= halfWidth) scrollPosRef.current -= halfWidth;
    if (scrollPosRef.current < 0) scrollPosRef.current += halfWidth;

    container.scrollLeft = scrollPosRef.current;
    if (Math.abs(dx) > 3) e.preventDefault();
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (hasDraggedRef.current) {
      applyMomentum();
    } else {
      scrollPosRef.current = containerRef.current?.scrollLeft ?? 0;
      if (!prefersReducedMotion) setAutoPaused(false);
    }
  }, [applyMomentum, prefersReducedMotion]);

  const onMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      applyMomentum();
    }
  }, [applyMomentum]);

  if (error) return null;

  // When reduced motion is preferred, only show one copy of articles (no infinite loop needed)
  const displayArticles = loading
    ? Array(5).fill(null)
    : prefersReducedMotion
    ? articles
    : [...articles, ...articles];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="mt-14 -mx-4 md:-mx-8"
    >
      {/* Section label */}
      <div className="px-4 md:px-8 mb-6 flex items-center gap-4">
        <div className="w-6 h-px bg-[#ef4444]" />
        <span
          className={`text-[10px] font-bold tracking-[0.2em] uppercase ${T.textFaint}`}
        >
          From the Blog
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent" />
      </div>

      {/* Scrollable strip */}
      <div
        ref={containerRef}
        className="overflow-x-scroll w-full"
        style={{
          cursor: isDraggingRef.current ? "grabbing" : "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <style>{`
          .medium-feed-strip::-webkit-scrollbar { display: none; }
        `}</style>
        <div
          className="medium-feed-strip flex gap-6 w-max will-change-transform"
          style={{ paddingLeft: "32px", paddingRight: "32px" }}
        >
          {displayArticles.map((article, i) =>
            loading ? (
              <SkeletonCard key={i} T={T} />
            ) : (
              <ArticleCard
                key={`${(article as Article).link}-${i}`}
                article={article as Article}
                T={T}
              />
            )
          )}
        </div>
      </div>

      {/* Hint label — hidden when reduced motion is preferred (no autoscroll to hint about) */}
      {!prefersReducedMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-3 flex justify-center"
        >
          <span className={`text-[10px] tracking-widest uppercase select-none ${T.textFaint}`}>
            {autoPaused ? "— dragging —" : "← drag to browse →"}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useT } from "../context/ThemeContext";
import { sessionCache } from "../utils/sessionCache";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  description: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const MEDIUM_RSS = "https://medium.com/feed/@afro-nated";
const RSS2JSON   = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS)}&api_key=&count=10`;
const CACHE_KEY  = "afronated:medium-articles";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractThumbnail(item: Record<string, unknown>): string {
  if (item.thumbnail && typeof item.thumbnail === "string" && item.thumbnail.startsWith("http")) {
    return item.thumbnail;
  }
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
  } catch { return ""; }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

// ─── Single card ──────────────────────────────────────────────────────────────

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
      onClick={(e) => {
        if ((e.currentTarget as HTMLElement).closest("[data-dragging='true']")) {
          e.preventDefault();
        }
      }}
    >
      <div
        className={`
          relative h-full rounded-lg overflow-hidden border transition-all duration-300
          group-hover:border-[#ef4444]/60 group-hover:shadow-[0_0_24px_rgba(239,68,68,0.12)]
          ${T.isDark ? "bg-[#0d0d0d] border-white/8" : "bg-[#f7f7f7] border-black/8"}
        `}
      >
        <div className="relative w-full h-[160px] overflow-hidden bg-[#1a1a1a]">
          {article.thumbnail && !imgError ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
              <div className="text-center px-4">
                <div className="w-8 h-1 bg-[#ef4444] mx-auto mb-3" />
                <span className={`text-xs font-bold tracking-widest uppercase ${T.textFaint}`}>
                  Afronated
                </span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="p-5">
          <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${T.textFaint}`}>
            {formatDate(article.pubDate)}
          </p>
          <h3
            className={`font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#ef4444] transition-colors duration-300 ${T.text}`}
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

        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#ef4444] group-hover:w-full transition-all duration-500" />
      </div>
    </a>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard({ T }: { T: ReturnType<typeof useT> }) {
  return (
    <div
      className={`flex-shrink-0 w-[280px] md:w-[320px] rounded-lg overflow-hidden border ${
        T.isDark ? "bg-[#0d0d0d] border-white/8" : "bg-[#f7f7f7] border-black/8"
      }`}
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

  const [articles, setArticles] = useState<Article[]>(() => {
    return sessionCache.get<Article[]>(CACHE_KEY) ?? [];
  });
  const [loading, setLoading] = useState(() => {
    return sessionCache.get<Article[]>(CACHE_KEY) === null;
  });
  const [error, setError] = useState(false);

  // Respect prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [autoPaused, setAutoPaused] = useState(prefersReducedMotion);

  const containerRef  = useRef<HTMLDivElement>(null);
  const animRef       = useRef<number | null>(null);
  const scrollPosRef  = useRef(0);
  const speedRef      = useRef(0.6);

  const isDraggingRef   = useRef(false);
  const dragStartXRef   = useRef(0);
  const scrollStartRef  = useRef(0);
  const hasDraggedRef   = useRef(false);
  const lastClientXRef  = useRef(0);
  const velocityRef     = useRef(0);
  const momentumRef     = useRef<number | null>(null);

  // ── Fetch ──
  useEffect(() => {
    if (!loading) return; // cache hit — skip

    let cancelled = false;
    fetch(RSS2JSON)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.status === "ok" && Array.isArray(data.items)) {
          const parsed: Article[] = data.items.slice(0, 8).map((item: Record<string, unknown>) => ({
            title:       String(item.title ?? ""),
            link:        String(item.link ?? ""),
            pubDate:     String(item.pubDate ?? ""),
            thumbnail:   extractThumbnail(item),
            description: String(item.description ?? ""),
          }));
          sessionCache.set<Article[]>(CACHE_KEY, parsed);
          setArticles(parsed);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) { setError(true); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [loading]);

  // ── Autoscroll ──
  useEffect(() => {
    if (prefersReducedMotion) return;
    const container = containerRef.current;
    if (!container || articles.length === 0) return;

    const startRaf = requestAnimationFrame(() => {
      const tick = () => {
        if (!isDraggingRef.current && !autoPaused) {
          scrollPosRef.current += speedRef.current;
          const halfWidth = container.scrollWidth / 2;
          if (scrollPosRef.current >= halfWidth) scrollPosRef.current -= halfWidth;
          container.scrollLeft = scrollPosRef.current;
        }
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(startRaf);
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [articles, autoPaused, prefersReducedMotion]);

  // ── Sync scroll pos on manual scroll ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      if (!isDraggingRef.current) scrollPosRef.current = container.scrollLeft;
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  // ── Momentum ──
  const cancelMomentum = useCallback(() => {
    if (momentumRef.current !== null) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
  }, []);

  const applyMomentum = useCallback(() => {
    cancelMomentum();
    if (prefersReducedMotion) {
      scrollPosRef.current = containerRef.current?.scrollLeft ?? 0;
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    let vel = velocityRef.current;
    const step = () => {
      if (Math.abs(vel) < 0.3) {
        scrollPosRef.current = container.scrollLeft;
        setAutoPaused(false);
        momentumRef.current = null;
        return;
      }
      vel *= 0.92;
      scrollPosRef.current = container.scrollLeft + vel;
      const halfWidth = container.scrollWidth / 2;
      if (scrollPosRef.current >= halfWidth) scrollPosRef.current -= halfWidth;
      if (scrollPosRef.current < 0) scrollPosRef.current += halfWidth;
      container.scrollLeft = scrollPosRef.current;
      momentumRef.current = requestAnimationFrame(step);
    };
    momentumRef.current = requestAnimationFrame(step);
  }, [cancelMomentum, prefersReducedMotion]);

  // ── Mouse handlers ──
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    cancelMomentum();
    isDraggingRef.current  = true;
    hasDraggedRef.current  = false;
    dragStartXRef.current  = e.clientX;
    lastClientXRef.current = e.clientX;
    scrollStartRef.current = containerRef.current?.scrollLeft ?? 0;
    velocityRef.current    = 0;
    setAutoPaused(true);
    e.preventDefault();
  }, [cancelMomentum]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastClientXRef.current;
    lastClientXRef.current = e.clientX;
    velocityRef.current = -dx;
    if (Math.abs(e.clientX - dragStartXRef.current) > 5) hasDraggedRef.current = true;
    const container = containerRef.current;
    if (!container) return;
    scrollPosRef.current = container.scrollLeft - dx;
    const halfWidth = container.scrollWidth / 2;
    if (scrollPosRef.current >= halfWidth) scrollPosRef.current -= halfWidth;
    if (scrollPosRef.current < 0) scrollPosRef.current += halfWidth;
    container.scrollLeft = scrollPosRef.current;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (hasDraggedRef.current) {
      applyMomentum();
    } else {
      scrollPosRef.current = containerRef.current?.scrollLeft ?? 0;
      if (!prefersReducedMotion) setAutoPaused(false);
    }
  }, [applyMomentum, prefersReducedMotion]);

  // ── Touch handlers ──
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    cancelMomentum();
    isDraggingRef.current  = true;
    hasDraggedRef.current  = false;
    dragStartXRef.current  = e.touches[0].clientX;
    lastClientXRef.current = e.touches[0].clientX;
    scrollStartRef.current = containerRef.current?.scrollLeft ?? 0;
    velocityRef.current    = 0;
    setAutoPaused(true);
  }, [cancelMomentum]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const touch = e.touches[0];
    const dx    = touch.clientX - lastClientXRef.current;
    lastClientXRef.current = touch.clientX;
    velocityRef.current    = -dx;
    if (Math.abs(touch.clientX - dragStartXRef.current) > 5) hasDraggedRef.current = true;
    const container = containerRef.current;
    if (!container) return;
    scrollPosRef.current = container.scrollLeft - dx;
    const halfWidth = container.scrollWidth / 2;
    if (scrollPosRef.current >= halfWidth) scrollPosRef.current -= halfWidth;
    if (scrollPosRef.current < 0) scrollPosRef.current += halfWidth;
    container.scrollLeft = scrollPosRef.current;
    if (Math.abs(dx) > 3) e.preventDefault();
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (hasDraggedRef.current) {
      applyMomentum();
    } else {
      scrollPosRef.current = containerRef.current?.scrollLeft ?? 0;
      if (!prefersReducedMotion) setAutoPaused(false);
    }
  }, [applyMomentum, prefersReducedMotion]);

  const onMouseLeave = useCallback(() => {
    if (isDraggingRef.current) { isDraggingRef.current = false; applyMomentum(); }
  }, [applyMomentum]);

  if (error) return null;

  const displayArticles = loading
    ? Array(5).fill(null)
    : prefersReducedMotion
    ? articles
    : [...articles, ...articles];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="mt-14 -mx-4 md:-mx-8"
    >
      <div className="px-4 md:px-8 mb-6 flex items-center gap-4">
        <div className="w-6 h-px bg-[#ef4444]" />
        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${T.textFaint}`}>
          From the Blog
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent" />
      </div>

      <div
        ref={containerRef}
        className="overflow-x-scroll w-full"
        style={{
          cursor: isDraggingRef.current ? "grabbing" : "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <style>{`.medium-feed-strip::-webkit-scrollbar { display: none; }`}</style>
        <div
          className="medium-feed-strip flex gap-6 w-max will-change-transform"
          style={{ paddingLeft: "32px", paddingRight: "32px" }}
        >
          {displayArticles.map((article, i) =>
            loading ? (
              <SkeletonCard key={i} T={T} />
            ) : (
              <ArticleCard
                key={`${(article as Article).link}-${i}`}
                article={article as Article}
                T={T}
              />
            )
          )}
        </div>
      </div>

      {!prefersReducedMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-3 flex justify-center"
        >
          <span className={`text-[10px] tracking-widest uppercase select-none ${T.textFaint}`}>
            {autoPaused ? "— dragging —" : "← drag to browse →"}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}