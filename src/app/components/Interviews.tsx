import { motion } from "motion/react";
import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { useT } from "../context/ThemeContext";

interface Video { id: string; url: string; guest: string; occupation: string; title: string; description: string; }

const videos: Video[] = [
  {
    id: "YnsnAwQaZhM",
    url: "https://youtu.be/YnsnAwQaZhM",
    guest: "Psamuel",
    occupation: "Recording Artist",
    title: "The Art of Persistence",
    description: "From promoting his first show with zero naira to filling out theaters, Psamuel discusses the raw reality of the music journey and his deep connection with the 'Samo family'.",
  },
  {
    id: "zHtjLi-8_sc",
    url: "https://youtu.be/zHtjLi-8_sc",
    guest: "Halimah Agbaje",
    occupation: "Documentary Filmmaker",
    title: "Faith in Film",
    description: "Discover how Halimah turned personal struggle into a powerful visual narrative, exploring the intersection of faith, documentary storytelling, and the courage to offer value.",
  },
  {
    id: "jf2N-WFeEGQ",
    url: "https://youtu.be/jf2N-WFeEGQ",
    guest: "Lasko Blark",
    occupation: "Rapper & Entrepreneur",
    title: "Impossible Dreams",
    description: "More than just a rapper, Lasko Blark reveals his 'impossible' ambitions—from building business empires to owning football clubs—using his music as the ultimate catalyst.",
  },
  {
    id: "FShRD37VV6U",
    url: "https://youtu.be/FShRD37VV6U",
    guest: "Giran",
    occupation: "Fashion Stylist",
    title: "Beauty in the Worthless",
    description: "Meet the 'Pretty G' of styling, a night-walking creative who transforms discarded materials into high-fashion statements, defining a new retro aesthetic for the streets.",
  },
];

function VideoCard({ video, index }: { video: Video; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const T = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative aspect-video rounded-lg overflow-hidden cursor-pointer ${T.isDark ? "bg-[#1a1a1a]" : "bg-[#e8e8e8]"}`}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
        alt={video.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 md:p-6">
        {/* Top-right external link */}
        <div className="flex justify-end">
          <motion.a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#ef4444] hover:border-[#ef4444] transition-all duration-300"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
          </motion.a>
        </div>

        {/*
          ── Play button ──────────────────────────────────────────────────────
          FIX: The original button was always w-20 h-20 (80px), which on a
          narrow phone tile (≈160–180px tall) consumed nearly half the card
          height and buried the title/description text below it.

          Solution — responsive sizing via Tailwind:
            • Mobile (default):  w-10 h-10  (40px) — compact, out of the way
            • sm  (≥640px):      w-12 h-12  (48px)
            • md  (≥768px):      w-14 h-14  (56px) — tablets (iPad Mini/Air)
            • lg  (≥1024px):     w-16 h-16  (64px)
            • xl  (≥1280px):     w-20 h-20  (80px) — original desktop size

          The play icon inside scales proportionally the same way.

          We also lower the play button's vertical centre-point slightly
          (translate-y-[-55%]) so it sits above the text block rather than
          directly on top of it on small tiles.
        ──────────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center"
             style={{ paddingBottom: "30%" /* nudge up so button clears the text area */ }}>
          <motion.a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full bg-[#ef4444]/90 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white shadow-2xl flex-shrink-0"
            onClick={e => e.stopPropagation()}
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 ml-0.5" fill="currentColor" />
          </motion.a>
        </div>

        {/* Bottom text block */}
        <div>
          <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#ef4444] mb-1 line-clamp-1">
            {video.guest} · {video.occupation}
          </p>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 text-white leading-tight line-clamp-1">
            {video.title}
          </h3>
          <p className="text-[10px] sm:text-xs text-white/65 leading-snug line-clamp-2">{video.description}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 border-2 border-[#ef4444] rounded-lg pointer-events-none"
      />
    </motion.div>
  );
}

export function Interviews() {
  const T = useT();
  return (
    <section id="interviews" className={`relative py-24 md:py-32 px-4 md:px-8 transition-colors duration-300 ${T.isDark ? "bg-gradient-to-b from-black to-[#1a1a1a]/30" : "bg-gradient-to-b from-white to-[#f0f0f0]"}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded text-[#ef4444] text-xs font-bold tracking-widest uppercase">Featured Content</span>
          </div>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 ${T.text}`}>SPOTLIGHT<br className="md:hidden" /> INTERVIEWS</h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${T.textMuted}`}>Intimate conversations with the minds shaping Africa's future</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {videos.map((video, index) => <VideoCard key={video.id} video={video} index={index} />)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="https://www.youtube.com/@Afronated"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-3 px-8 py-4 border rounded-full font-bold tracking-wide group hover:bg-[#ef4444] hover:border-[#ef4444] hover:text-white transition-all duration-300 ${T.isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"}`}
          >
            VIEW ALL CONTENT <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}