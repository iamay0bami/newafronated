import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";
import { Play, ExternalLink, Youtube } from "lucide-react";
import { useT } from "../context/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface YTShort {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  viewCount?: string;
}

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────

function ShortCard({
  short,
  index,
  isVisible,
}: {
  short: YTShort;
  index: number;
  isVisible: boolean;
}) {
  const T = useT();
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateY.set(dx * 12);
    rotateX.set(-dy * 12);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  };

  // Stagger: cards drop in from above with slight rotation
  const dropDelay = index * 0.08;

  return (
    <motion.div
      initial={{ opacity: 0, y: -60, rotate: index % 2 === 0 ? -4 : 4, scale: 0.85 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
          : { opacity: 0, y: -60, rotate: index % 2 === 0 ? -4 : 4, scale: 0.85 }
      }
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
        delay: dropDelay,
      }}
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-pointer select-none"
      >
        {/* Portrait card — ~9:16 ratio */}
        <div
          className={`relative overflow-hidden rounded-xl`}
          style={{ width: "100%", aspectRatio: "9/16" }}
        >
          {/* Thumbnail */}
          <img
            src={short.thumbnail}
            alt={short.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
          />

          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-black/30"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Animated red border glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{
              boxShadow: hovered
                ? "inset 0 0 0 2px #ef4444, 0 0 32px rgba(239,68,68,0.4)"
                : "inset 0 0 0 0px transparent, 0 0 0px transparent",
            }}
            transition={{ duration: 0.25 }}
          />

          {/* Shorts label top-left */}
          <div className="absolute top-3 left-3 z-10">
            <span className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[10px] font-bold text-white tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              SHORT
            </span>
          </div>

          {/* Play button center */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <a
              href={short.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#ef4444] flex items-center justify-center shadow-lg shadow-red-500/40"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Watch ${short.title}`}
            >
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </a>
          </motion.div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <p className="text-white text-xs font-semibold leading-snug line-clamp-2">
              {short.title}
            </p>
          </div>

          {/* External link */}
          <motion.a
            href={short.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#ef4444] transition-colors"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Open in YouTube"
          >
            <ExternalLink className="w-3 h-3" />
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ShortSkeleton({ index }: { index: number }) {
  const T = useT();
  return (
    <div
      className={`rounded-xl overflow-hidden animate-pulse ${
        T.isDark ? "bg-white/5" : "bg-black/5"
      }`}
      style={{ aspectRatio: "9/16" }}
    >
      <div className="w-full h-full bg-gradient-to-br from-transparent to-[#ef4444]/5" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface YouTubeShortsProps {
  shorts: YTShort[];
  loading: boolean;
}

export function YouTubeShorts({ shorts, loading }: YouTubeShortsProps) {
  const T = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const displayItems = loading
    ? Array(6).fill(null)
    : shorts.slice(0, 8);

  if (!loading && shorts.length === 0) return null;

  return (
    <div ref={sectionRef} className="mt-20">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-6 h-px bg-[#ef4444]" />
        <div className="flex items-center gap-2">
          <Youtube className={`w-3.5 h-3.5 ${T.textFaint}`} />
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${T.textFaint}`}>
            YouTube Shorts
          </span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent" />
        <motion.a
          href="https://www.youtube.com/@Afronated/shorts"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase hover:text-[#ef4444] transition-colors ${T.textFaint}`}
          whileHover={{ x: 3 }}
        >
          View All
          <ExternalLink className="w-3 h-3" />
        </motion.a>
      </motion.div>

      {/* Responsive grid of portrait cards */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
        {displayItems.map((short, i) =>
          loading ? (
            <ShortSkeleton key={i} index={i} />
          ) : (
            <ShortCard
              key={(short as YTShort).id}
              short={short as YTShort}
              index={i}
              isVisible={isVisible}
            />
          )
        )}
      </div>
    </div>
  );
}