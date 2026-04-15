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
//
// Behold.so returns JSON at: https://feeds.behold.so/<WIDGET_ID>
//
// The API returns an ARRAY of post objects. Each object has these relevant keys:
//   - id            : string
//   - mediaUrl      : string  (full-size image URL)
//   - thumbnailUrl  : string  (video thumbnail / smaller image)
//   - permalink     : string  (instagram.com link)
//   - caption       : string
//   - mediaType     : "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
//
// If posts are not loading, check:
//   1. The widget ID is correct (copy from behold.so dashboard)
//   2. The Instagram account is connected and the widget is "Live" (not draft)
//   3. Open https://feeds.behold.so/<YOUR_ID> directly in your browser —
//      if it returns JSON, the ID is correct. If 404, regenerate the widget.
//   4. Behold free tier caches feeds; allow a few minutes after connecting.

const BEHOLD_WIDGET_ID = "RnYIoNYflGt00tl3LIWy"; // ← replace if needed

// Fallback skeleton tiles shown while loading / if fetch fails
const PLACEHOLDER_POSTS: InstaPost[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i),
  mediaUrl: "",
  permalink: "https://www.instagram.com/afro.nated",
  caption: "",
  mediaType: "IMAGE",
}));

// ─── Mosaic layout — 6 tiles in a 3-col asymmetric grid ───────────────────────
//
//  ┌──────────┬────┬────┐
//  │          │  2 │  3 │
//  │    1     ├────┴────┤
//  │  (tall)  │   4     │
//  ├────┬─────┴─────────┤
//  │ 5  │     6         │
//  └────┴───────────────┘

const MOSAIC_LAYOUT = [
  { col: "col-span-2 row-span-2", delay: 0 },
  { col: "col-span-1 row-span-1", delay: 0.08 },
  { col: "col-span-1 row-span-1", delay: 0.16 },
  { col: "col-span-2 row-span-1", delay: 0.24 },
  { col: "col-span-1 row-span-1", delay: 0.32 },
  { col: "col-span-2 row-span-1", delay: 0.4 },
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
      {isEmpty ? (
        <div
          className={`w-full h-full min-h-[120px] animate-pulse ${
            T.isDark ? "bg-white/5" : "bg-black/5"
          }`}
        >
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
          // If the mediaUrl 403s (Instagram CDN token expired), fall back to
          // the Instagram permalink thumbnail via oEmbed — or just hide the tile.
          onError={(e) => {
            const img = e.currentTarget;
            // Hide the broken image gracefully
            img.style.display = "none";
          }}
        />
      )}

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
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    if (!BEHOLD_WIDGET_ID) {
      setStatus("error");
      return;
    }

    // Behold.so feed endpoint — returns a JSON array of post objects.
    // No auth required; CORS is allowed from any origin.
    fetch(`https://feeds.behold.so/${BEHOLD_WIDGET_ID}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // data can be either:
        //   A) An array of posts directly: [ { id, mediaUrl, ... }, ... ]
        //   B) A widget object with a posts array: { posts: [...], ... }
        const raw: Record<string, unknown>[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.posts)
          ? data.posts
          : [];

        if (raw.length === 0) {
          // Widget exists but has no posts yet (still syncing)
          setStatus("error");
          return;
        }

        const parsed: InstaPost[] = raw.slice(0, 6).map((p) => {
          // Behold returns `mediaUrl` for images and `thumbnailUrl` for videos.
          // Some older widget versions used `prunedTagUrl` or `sizes` objects.
          const mediaUrl =
            (p.mediaUrl as string) ||
            (p.thumbnailUrl as string) ||
            // Fallback: try the first entry of a `sizes` object if present
            ((p.sizes as Record<string, string>)?.medium) ||
            "";

          return {
            id: String(p.id ?? Math.random()),
            mediaUrl,
            permalink: String(p.permalink ?? "https://www.instagram.com/afro.nated"),
            caption: p.caption ? String(p.caption).slice(0, 120) : undefined,
            mediaType: (p.mediaType as InstaPost["mediaType"]) || "IMAGE",
          };
        });

        setPosts(parsed);
        setStatus("loaded");
      })
      .catch((err) => {
        console.warn("[InstagramMosaic] Could not load Behold feed:", err);
        // Keep skeleton tiles visible; they link to the IG profile
        setStatus("error");
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
        {posts.slice(0, 6).map((post, i) => (
          <MosaicTile
            key={post.id || i}
            post={post}
            layout={MOSAIC_LAYOUT[i] ?? MOSAIC_LAYOUT[0]}
            index={i}
            isRevealed={isInView}
          />
        ))}
      </div>

      {/* Status hint — shown when loaded but could also debug */}
      {status === "error" && (
        <p className={`mt-3 text-center text-[10px] tracking-widest uppercase ${T.textFaint}`}>
          Visit us on Instagram for the latest posts
        </p>
      )}

      {/* Follow CTA */}
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