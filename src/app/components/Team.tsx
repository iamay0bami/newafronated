import { motion, useSpring, useMotionValue, AnimatePresence } from "motion/react";
import { useRef, useState, useCallback, useEffect } from "react";
import { Instagram } from "lucide-react";
import { useT } from "../context/ThemeContext";

// ─── X icon ───────────────────────────────────────────────────────────────────

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

// ─── Team data ────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  frontImage: string;
  backImage: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Onahi Ijeh",
    role: "Founder & Creative Director",
    bio: "A storyteller and curator transforming ideas into resonant visuals and high-impact content rooted in youth culture.",
    frontImage: "/onahi-event5.png",
    backImage: "/onahi-party1.png",
    instagram: "https://www.instagram.com/onahiijeh",
  },
  {
    name: "Grace Otolorin",
    role: "Head of Operations",
    bio: "A strategic Creative Director and Project Manager focused on building structure and transforming ideas into structured execution.",
    frontImage: "/grace-front.png",
    backImage: "/grace-back.png",
    instagram: "https://www.instagram.com/graceotolorin",
  },
  {
    name: "Veronica Emmanuel",
    role: "Content Writer",
    bio: "Dedicated Content Writer crafting simple, engaging messaging for clear brand communication and social media growth.",
    frontImage: "/veronica-back.png",
    backImage: "/veronica-front.png",
    instagram: "https://www.instagram.com/verah_skill_guild/",
  },
  {
    name: "Bamgbola Onaopemipo",
    role: "Content Creator",
    bio: "A creative storyteller and content creator driving student engagement and purposeful community impact.",
    frontImage: "/opemipo-front.png",
    backImage: "/opemipo-second.png",
    instagram: "https://www.instagram.com/the_real_ope_",
  },
];

// ─── Signal Card ─────────────────────────────────────────────────────────────

function SignalCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  const T = useT();
  const cardRef = useRef<HTMLDivElement>(null);

  // Cursor-tracked spotlight
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const springSpotX = useSpring(spotX, { stiffness: 120, damping: 20 });
  const springSpotY = useSpring(spotY, { stiffness: 120, damping: 20 });

  // Hover / active state
  const [hovered, setHovered] = useState(false);
  const [bioOpen, setBioOpen] = useState(false);
  const [glitching, setGlitching] = useState(false);

  // Periodic scan line
  const [scanActive, setScanActive] = useState(false);

  // Scan line ping every ~5–8s (staggered per card)
  useEffect(() => {
    const delay = index * 1200 + 4000;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setScanActive(true);
      interval = setInterval(() => {
        setScanActive(false);
        setTimeout(() => setScanActive(true), 100);
      }, 6000 + index * 700);
    }, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [index]);

  // Glitch on hover enter
  const triggerGlitch = useCallback(() => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 320);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    spotX.set(x);
    spotY.set(y);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    setBioOpen(true);
    triggerGlitch();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setBioOpen(false);
  };

  const handleTap = () => {
    setBioOpen((o) => !o);
    if (!bioOpen) triggerGlitch();
  };

  // Wave ripple on entry (from bottom)
  const entryDelay = index * 0.12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
        delay: entryDelay,
      }}
      className="relative h-[480px] sm:h-[500px] select-none"
      style={{ cursor: "crosshair" }}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full rounded-xl overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTap}
      >
        {/* ── Base photo ── */}
        <motion.img
          src={member.frontImage}
          alt={member.name}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-top"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onError={(e) => {
            const img = e.currentTarget;
            img.src = "/onahi-event5.png";
          }}
        />

        {/* ── Cursor spotlight overlay ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle 200px at ${springSpotX.get()}% ${springSpotY.get()}%, rgba(239,68,68,0.18) 0%, transparent 70%)`,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          // Re-render on spring changes
          ref={(el) => {
            if (!el) return;
            const unsub1 = springSpotX.on("change", (v) => {
              const y = springSpotY.get();
              el.style.background = `radial-gradient(circle 200px at ${v}% ${y}%, rgba(239,68,68,0.18) 0%, transparent 70%)`;
            });
            const unsub2 = springSpotY.on("change", (v) => {
              const x = springSpotX.get();
              el.style.background = `radial-gradient(circle 200px at ${x}% ${v}%, rgba(239,68,68,0.18) 0%, transparent 70%)`;
            });
            return () => { unsub1(); unsub2(); };
          }}
        />

        {/* ── Base gradient (always) ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 z-20" />

        {/* ── Scan line ── */}
        <AnimatePresence>
          {scanActive && (
            <motion.div
              key="scan"
              className="absolute left-0 right-0 h-[2px] pointer-events-none z-30"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(239,68,68,0.7) 30%, rgba(239,68,68,0.9) 50%, rgba(239,68,68,0.7) 70%, transparent)",
                boxShadow: "0 0 8px rgba(239,68,68,0.6)",
              }}
              initial={{ top: "0%", opacity: 0 }}
              animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "linear" }}
            />
          )}
        </AnimatePresence>

        {/* ── Red corner accents ── */}
        <div className="absolute top-3 left-3 z-30 pointer-events-none">
          <div className="w-4 h-4 border-t-2 border-l-2 border-[#ef4444]/60" />
        </div>
        <div className="absolute top-3 right-3 z-30 pointer-events-none">
          <div className="w-4 h-4 border-t-2 border-r-2 border-[#ef4444]/60" />
        </div>
        <div className="absolute bottom-3 left-3 z-30 pointer-events-none">
          <div className="w-4 h-4 border-b-2 border-l-2 border-[#ef4444]/60" />
        </div>
        <div className="absolute bottom-3 right-3 z-30 pointer-events-none">
          <div className="w-4 h-4 border-b-2 border-r-2 border-[#ef4444]/60" />
        </div>

        {/* ── Hover border glow ── */}
        <motion.div
          className="absolute inset-0 z-30 rounded-xl pointer-events-none"
          animate={{
            boxShadow: hovered
              ? "inset 0 0 0 1.5px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.2)"
              : "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* ── Idle name/role (bottom) — fades when bio opens ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-5 z-40"
          animate={{ opacity: bioOpen ? 0 : 1, y: bioOpen ? 8 : 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Role with glitch effect */}
          <div className="relative mb-1 overflow-hidden">
            <motion.p
              className="text-[10px] font-bold tracking-widest uppercase text-[#ef4444]"
              animate={
                glitching
                  ? { x: [0, -3, 3, -1, 0], opacity: [1, 0.6, 1, 0.8, 1] }
                  : { x: 0, opacity: 1 }
              }
              transition={{ duration: 0.3 }}
            >
              {member.role}
            </motion.p>
            {/* Chromatic aberration ghost */}
            <AnimatePresence>
              {glitching && (
                <motion.p
                  className="absolute inset-0 text-[10px] font-bold tracking-widest uppercase text-cyan-400 mix-blend-screen"
                  initial={{ opacity: 0, x: 3 }}
                  animate={{ opacity: [0, 0.8, 0], x: [3, -2, 3] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {member.role}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            {member.name}
          </h3>
        </motion.div>

        {/* ── Bio panel (slides up on hover/tap) ── */}
        <AnimatePresence>
          {bioOpen && (
            <motion.div
              className="absolute inset-0 z-40 flex flex-col justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Bio overlay bg */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Bio content */}
              <motion.div
                className="relative z-10 p-5"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* "Behind the signal" badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded-full text-[9px] font-bold tracking-widest uppercase text-[#ef4444] mb-3">
                    <span className="w-1 h-1 rounded-full bg-[#ef4444] animate-pulse" />
                    Signal Live
                  </span>
                </motion.div>

                {/* Role */}
                <motion.p
                  className="text-[10px] font-bold tracking-widest uppercase text-[#ef4444] mb-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.07 }}
                >
                  {member.role}
                </motion.p>

                {/* Name */}
                <motion.h3
                  className="text-xl font-black text-white tracking-tight mb-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {member.name}
                </motion.h3>

                {/* Bio text */}
                <motion.p
                  className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 }}
                >
                  {member.bio}
                </motion.p>

                {/* Social icons */}
                <motion.div
                  className="flex gap-2.5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#ef4444] hover:border-[#ef4444] transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X"
                      className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#ef4444] hover:border-[#ef4444] transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <XIcon className="w-4 h-4" />
                    </a>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Team section ────────────────────────────────────────────────────────

export function Team() {
  const T = useT();

  return (
    <section
      id="team"
      className={`relative py-24 md:py-32 px-4 md:px-8 overflow-hidden transition-colors duration-300 ${
        T.isDark
          ? "bg-gradient-to-b from-[#1a1a1a]/30 to-black"
          : "bg-gradient-to-b from-[#f0f0f0] to-white"
      }`}
    >
      {/* Dot grid bg */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${
              T.isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"
            } 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded text-[#ef4444] text-xs font-bold tracking-widest uppercase">
              The Collective
            </span>
          </div>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 ${T.text}`}
          >
            MEET THE TEAM
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${T.textMuted}`}>
            The visionaries and storytellers behind Afronated
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {teamMembers.map((member, index) => (
            <SignalCard key={member.name} member={member} index={index} />
          ))}
        </div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`text-center text-sm mt-8 ${T.textFaint}`}
        >
          Hover (or tap on mobile) to reveal each member's signal
        </motion.p>
      </div>

      {/* Ambient glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.03, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#ef4444] blur-3xl"
      />
    </section>
  );
}