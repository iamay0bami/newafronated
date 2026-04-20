import { motion } from "motion/react";
import { useState } from "react";
import { Play, ExternalLink, Youtube } from "lucide-react";
import { useT } from "../context/ThemeContext";
import { YouTubeShorts } from "./YouTubeShorts";
import type { YTVideo, YTShort } from "../hooks/useYouTubeVideos";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoItem {
  id: string;
  url: string;
  guest: string;
  occupation: string;
  title: string;
  description: string;
}

// ─── Hardcoded fallback interviews ───────────────────────────────────────────

const HARDCODED_VIDEOS: VideoItem[] = [
  {
    id: "YnsnAwQaZhM",
    url: "https://youtu.be/YnsnAwQaZhM",
    guest: "Psamuel",
    occupation: "Recording Artist",
    title: "The Art of Persistence",
    description:
      "From promoting his first show with zero naira to filling out theaters, Psamuel discusses the raw reality of the music journey and his deep connection with the 'Samo family'.",
  },
  {
    id: "zHtjLi-8_sc",
    url: "https://youtu.be/zHtjLi-8_sc",
    guest: "Halimah Agbaje",
    occupation: "Documentary Filmmaker",
    title: "Faith in Film",
    description:
      "Discover how Halimah turned personal struggle into a powerful visual narrative, exploring the intersection of faith, documentary storytelling, and the courage to offer value.",
  },
  {
    id: "jf2N-WFeEGQ",
    url: "https://youtu.be/jf2N-WFeEGQ",
    guest: "Lasko Blark",
    occupation: "Rapper & Entrepreneur",
    title: "Impossible Dreams",
    description:
      "More than just a rapper, Lasko Blark reveals his 'impossible' ambitions—from building business empires to owning football clubs—using his music as the ultimate catalyst.",
  },
  {
    id: "FShRD37VV6U",
    url: "https://youtu.be/FShRD37VV6U",
    guest: "Giran",
    occupation: "Fashion Stylist",
    title: "Beauty in the Worthless",
    description:
      "Meet the 'Pretty G' of styling, a night-walking creative who transforms discarded materials into high-fashion statements, defining a new retro aesthetic for the streets.",
  },
];

// ─── Convert dynamic YTVideo → VideoItem ─────────────────────────────────────

function ytVideoToItem(v: YTVideo): VideoItem {
  // Try to extract a guest name from title (e.g. "Interview with NAME | ...")
  const titleParts = v.title.split(/[|–—\-:]/);
  const guest = titleParts.length > 1 ? titleParts[1].trim() : "Featured Guest";
  const titleMain = titleParts[0].trim();

  return {
    id: v.id,
    url: v.url,
    guest,
    occupation: "Creative",
    title: titleMain,
    description: v.description.slice(0, 200) || "Watch the full interview on YouTube.",
  };
}

// ─── Single video card ────────────────────────────────────────────────────────

function VideoCard({ video, index }: { video: VideoItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const T = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative aspect-video rounded-lg overflow-hidden cursor-pointer ${
        T.isDark ? "bg-[#1a1a1a]" : "bg-[#e8e8e8]"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <img
        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
        alt={video.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

      {/* External link */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <motion.a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#ef4444] hover:border-[#ef4444] transition-all duration-300"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </motion.a>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6">
        <div className="flex items-end gap-3 sm:gap-4">
          <motion.a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-[#ef4444] border-2 border-white/20 flex items-center justify-center text-white shadow-lg shadow-black/40"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Play ${video.title}`}
          >
            <Play className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 ml-0.5" fill="currentColor" />
          </motion.a>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#ef4444] mb-0.5 truncate">
              {video.guest} · {video.occupation}
            </p>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 text-white leading-tight line-clamp-1">
              {video.title}
            </h3>
            <p className="text-[10px] sm:text-xs text-white/65 leading-snug line-clamp-2 hidden sm:block">
              {video.description}
            </p>
          </div>
        </div>
      </div>

      {/* Hover border */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 border-2 border-[#ef4444] rounded-lg pointer-events-none"
      />
    </motion.div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard({ T }: { T: ReturnType<typeof useT> }) {
  return (
    <div
      className={`relative aspect-video rounded-lg overflow-hidden animate-pulse ${
        T.isDark ? "bg-[#1a1a1a]" : "bg-[#e8e8e8]"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#ef4444]/5" />
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
        <div className={`h-2 w-24 rounded ${T.isDark ? "bg-white/10" : "bg-black/10"}`} />
        <div className={`h-4 w-3/4 rounded ${T.isDark ? "bg-white/10" : "bg-black/10"}`} />
        <div className={`h-3 w-full rounded ${T.isDark ? "bg-white/5" : "bg-black/5"}`} />
      </div>
    </div>
  );
}

// ─── Main Interviews component ────────────────────────────────────────────────

interface InterviewsProps {
  dynamicVideos?: YTVideo[];
  dynamicLoading?: boolean;
  shorts?: YTShort[];
  shortsLoading?: boolean;
}

export function Interviews({
  dynamicVideos = [],
  dynamicLoading = false,
  shorts = [],
  shortsLoading = false,
}: InterviewsProps) {
  const T = useT();

  // Merge: use dynamic long-form if available, otherwise fall back to hardcoded
  const displayVideos: VideoItem[] =
    dynamicLoading
      ? [] // show skeletons
      : dynamicVideos.length > 0
        ? dynamicVideos.map(ytVideoToItem)
        : HARDCODED_VIDEOS;

  const showSkeletons = dynamicLoading;

  // Always ensure at least 4 hardcoded are shown if dynamic returns < 4
  const finalVideos =
    displayVideos.length >= 4
      ? displayVideos.slice(0, 6) // show up to 6 dynamic
      : [
          ...displayVideos,
          ...HARDCODED_VIDEOS.filter(
            (h) => !displayVideos.some((d) => d.id === h.id)
          ),
        ].slice(0, 4);

  return (
    <section
      id="interviews"
      className={`relative py-24 md:py-32 px-4 md:px-8 transition-colors duration-300 ${
        T.isDark
          ? "bg-gradient-to-b from-black to-[#1a1a1a]/30"
          : "bg-gradient-to-b from-white to-[#f0f0f0]"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded text-[#ef4444] text-xs font-bold tracking-widest uppercase">
              Featured Content
            </span>
          </div>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 ${T.text}`}
          >
            SPOTLIGHT
            <br className="md:hidden" /> INTERVIEWS
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${T.textMuted}`}>
            Intimate conversations with the minds shaping Africa's future
          </p>
        </motion.div>

        {/* Video grid */}
        {showSkeletons ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <SkeletonCard key={i} T={T} />
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {finalVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        )}

        {/* YouTube Shorts sub-section */}
        <YouTubeShorts shorts={shorts} loading={shortsLoading} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="https://www.youtube.com/@Afronated"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-3 px-8 py-4 border rounded-full font-bold tracking-wide group hover:bg-[#ef4444] hover:border-[#ef4444] hover:text-white transition-all duration-300 ${
              T.isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-black/5 border-black/10 text-black"
            }`}
          >
            <Youtube className="w-5 h-5" />
            VIEW ALL CONTENT
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}