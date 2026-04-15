import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Instagram, ArrowUpRight } from "lucide-react";
import { useT } from "../context/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InstaPost {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
}

// ─── Behold.so widget config ──────────────────────────────────────────────────
// Behold.so is a no-auth Instagram feed service.
// Client needs to sign up at behold.so with their Instagram handle @afro.nated,
// grab their widget ID, and replace the value below.
// Free tier gives 9 posts which is perfect for this mosaic.
const BEHOLD_WIDGET_ID = "YOUR_BEHOLD_WIDGET_ID"; // replace after Behold signup

// Fallback placeholder tiles shown before live data loads / if no widget ID set
const PLACEHOLDER_POSTS: InstaPost[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i),
  mediaUrl: "",
  permalink: "https://www.instagram.com/afro.nated",
  caption: "",
  mediaType: "IMAGE",
}));

// ─── Mosaic layout — 9 tiles in a 3-col asymmetric grid ───────────────────────
//
//  ┌──────────┬────┬────┐
//  │          │  2 │  3 │
//  │    1     ├────┴────┤
//  │  (tall)  │   4     │
//  ├────┬─────┴─────────┤
//  │ 5  │     6         │
//  ├────┼────┬──────────┤
//  │    │ 8  │   9      │
//  │ 7  ├────┴──────────┤
//  │    │  (end)        │
//  └────┴───────────────┘

const MOSAIC_LAYOUT = [
  { col: "col-span-2 row-span-2", delay: 0 },      // 0 — big
  { col: "col-span-1 row-span-1", delay: 0.08 },   // 1
  { col: "col-span-1 row-span-1", delay: 0.16 },   // 2
  { col: "col-span-2 row-span-1", delay: 0.24 },   // 3 — wide
  { col: "col-span-1 row-span-1", delay: 0.32 },   // 4
  { col: "col-span-2 row-span-1", delay: 0.4 },    // 5 — wide
  { col: "col-span-1 row-span-2", delay: 0.48 },   // 6 — tall
  { col: "col-span-1 row-span-1", delay: 0.56 },   // 7
  { col: "col-span-1 row-span-1", delay: 0.64 },   // 8
];

// ─── Single tile ──────────────────────────────────────────────────────────────

function MosaicTile({
  post,
  layout,
  index,
  isRevealed,
}: {
  post: InstaPost;
  layout: (typeof MOSAIC_LAYOUT)[number];
  index: number;
  isRevealed: boolean;
}) {
  const T = useT();
  const isEmpty = !post.mediaUrl;

  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className={`${layout.col} relative overflow-hidden cursor-pointer group min-h-[120px]`}
      initial={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
      animate={
        isRevealed
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, scale: 0.88, filter: "blur(8px)" }
      }
      transition={{
        duration: 0.65,
        delay: layout.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Image / Skeleton */}
      {isEmpty ? (
        <div
          className={`w-full h-full min-h-[120px] animate-pulse ${
            T.isDark ? "bg-white/5" : "bg-black/5"
          }`}
        >
          {/* Branded skeleton */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-5 h-[2px] bg-[#ef4444] mx-auto mb-2" />
              <Instagram
                className={`w-5 h-5 mx-auto ${T.textFaint}`}
                strokeWidth={1}
              />
            </div>
          </div>
        </div>
      ) : (
        <img
          src={post.mediaUrl}
          alt={post.caption ?? `Afronated post ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-400 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center gap-2 p-3 text-center"
        >
          <ArrowUpRight className="w-5 h-5 text-white" />
          {post.caption && (
            <p className="text-white text-[10px] leading-snug line-clamp-2 max-w-[120px]">
              {post.caption}
            </p>
          )}
        </motion.div>
      </div>

      {/* Red border accent on hover */}
      <div className="absolute inset-0 border-0 group-hover:border group-hover:border-[#ef4444]/50 transition-all duration-300 pointer-events-none" />
    </motion.a>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InstagramMosaic() {
  const T = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  const [posts, setPosts] = useState<InstaPost[]>(PLACEHOLDER_POSTS);
  const [loaded, setLoaded] = useState(false);

  // Load from Behold widget API if ID is set
  useEffect(() => {
    if (BEHOLD_WIDGET_ID === "YOUR_BEHOLD_WIDGET_ID") return;

    fetch(`https://feeds.behold.so/${BEHOLD_WIDGET_ID}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const parsed: InstaPost[] = data.slice(0, 9).map((p: Record<string, string>) => ({
            id: p.id,
            mediaUrl: p.mediaUrl || p.thumbnailUrl || "",
            permalink: p.permalink,
            caption: p.caption?.slice(0, 100),
            mediaType: (p.mediaType as InstaPost["mediaType"]) || "IMAGE",
          }));
          setPosts(parsed);
          setLoaded(true);
        }
      })
      .catch(() => {
        // Graceful degradation: show skeleton grid with link to profile
        setLoaded(true);
      });
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="mt-20 -mx-4 md:-mx-8 px-4 md:px-8"
    >
      {/* Section label */}
      <div className="mb-6 flex items-center gap-4">
        <div className="w-6 h-px bg-[#ef4444]" />
        <span
          className={`text-[10px] font-bold tracking-[0.2em] uppercase ${T.textFaint}`}
        >
          On Instagram
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent" />
        <a
          href="https://www.instagram.com/afro.nated"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase hover:text-[#ef4444] transition-colors ${T.textFaint}`}
        >
          <Instagram className="w-3 h-3" />
          @afro.nated
        </a>
      </div>

      {/* Mosaic grid */}
      <div
        className="grid grid-cols-3 gap-1.5 md:gap-2"
        style={{ gridAutoRows: "clamp(80px, 14vw, 180px)" }}
      >
        {posts.slice(0, 9).map((post, i) => (
          <MosaicTile
            key={post.id || i}
            post={post}
            layout={MOSAIC_LAYOUT[i] ?? MOSAIC_LAYOUT[0]}
            index={i}
            isRevealed={isInView}
          />
        ))}
      </div>

      {/* Follow CTA strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mt-4 flex justify-end"
      >
        <a
          href="https://www.instagram.com/afro.nated"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase hover:text-[#ef4444] transition-colors ${T.textFaint}`}
        >
          Follow on Instagram
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </motion.div>
    </motion.div>
  );
}