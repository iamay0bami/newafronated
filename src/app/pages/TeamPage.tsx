import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Instagram, ArrowRight, X } from "lucide-react";
import { Link } from "react-router";
import { useT } from "../context/ThemeContext";

// ─── X (Twitter) icon ─────────────────────────────────────────────────────────

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

// ─── Team data — full bios ────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  tagline: string;
  bio: string[];
  frontImage: string;
  backImage: string;
  instagram?: string;
  twitter?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Onahi Ijeh",
    role: "Founder & Creative Director",
    tagline: "Storyteller. Curator. Builder.",
    bio: [
      "Onahi Ijeh is the founder and creative director of Afro-Nated — a platform she built out of a deeply held conviction that African creatives deserve better coverage than they typically receive.",
      "A storyteller by instinct and a curator by discipline, Onahi brings a sharp editorial eye and a genuine connection to youth culture across Africa. Her approach to content creation is intentional: everything Afro-Nated produces must feel true to the people it represents and the communities it speaks to.",
      "She leads the overall creative direction of the platform — from interview formats and visual language to the editorial standards that shape every piece of content that goes out under the Afro-Nated name. Her belief is that authenticity and craft aren't at odds; the work has to be both honest and excellent.",
      "Beyond Afro-Nated, Onahi is driven by the long-term vision of building something that outlasts any single moment — an archive of African creativity that documents this generation's output with the seriousness it deserves.",
    ],
    frontImage: "/onahi-official.png",
    backImage: "/onahi-party1.png",
    instagram: "https://www.instagram.com/onahiijeh",
  },
  {
    name: "Grace Otolorin",
    role: "Head of Operations",
    tagline: "Structure. Strategy. Execution.",
    bio: [
      "Grace Otolorin is the operational backbone of Afro-Nated. As Head of Operations and Creative Director, she's the person responsible for turning ambitious ideas into structured, executable plans — and making sure the collective actually functions as one.",
      "With a background spanning creative direction and project management, Grace operates at the intersection of strategy and delivery. She understands both the creative vision and the practical reality of what it takes to bring that vision to life consistently.",
      "Her role touches almost every aspect of how Afro-Nated runs — from coordinating production schedules and managing workflows to ensuring the brand's output maintains quality and coherence across every platform. She brings clarity to complexity and keeps the team aligned.",
      "Grace's belief is simple: great creative work doesn't happen by accident. It happens because the right structures are in place to support the people doing it. She builds those structures.",
    ],
    frontImage: "/grace-front.png",
    backImage: "/grace-back.png",
    instagram: "https://www.instagram.com/graceotolorin",
  },
  {
    name: "Veronica Emmanuel",
    role: "Content Writer",
    tagline: "Words that land. Messaging that moves.",
    bio: [
      "Veronica Emmanuel is Afro-Nated's Content Writer — the person making sure that everything the platform says in writing is clear, engaging, and unmistakably on-brand.",
      "Her work spans editorial copy, social media messaging, interview transcripts, and any written content that carries the Afro-Nated voice into the world. She has a rare ability to write in a way that feels human and direct without sacrificing precision.",
      "Veronica approaches content writing as a communication problem as much as a creative one — the goal is always to say something that actually lands with the person reading it. That means understanding the audience, the platform, and the message before putting anything down.",
      "She plays an important role in the collective's ability to maintain a consistent and credible presence across its growing range of channels and formats.",
    ],
    frontImage: "/veronica-back.png",
    backImage: "/veronica-front.png",
    instagram: "https://www.instagram.com/verah_skill_guild/",
  },
];

// ─── Bio Modal ────────────────────────────────────────────────────────────────

function BioModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const T = useT();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6 lg:p-8"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

        {/*
          Modal layout:
          - Mobile: full-width bottom sheet, image top + scrollable bio below
          - Desktop: side-by-side — tall image left (~42%), scrollable bio right
        */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`
            relative z-10 w-full
            md:max-w-4xl md:max-h-[90vh]
            flex flex-col md:flex-row
            overflow-hidden
            rounded-t-2xl md:rounded-2xl
            border shadow-2xl
            ${T.isDark ? "bg-[#0d0d0d] border-white/10" : "bg-white border-black/10"}
          `}
          style={{ maxHeight: "92vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Close button (always top-right) ── */}
          <button
            onClick={onClose}
            className={`
              absolute top-4 right-4 z-30
              w-9 h-9 rounded-full flex items-center justify-center
              transition-all
              ${T.isDark
                ? "bg-black/60 hover:bg-white/15 text-white"
                : "bg-white/80 hover:bg-black/10 text-black"}
            `}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ── LEFT / TOP: Photo panel ── */}
          <div className="relative flex-shrink-0 w-full md:w-[42%]">
            {/*
              Mobile: tall enough to show the face properly — 65vw capped at 340px
              Desktop: full height of the modal (stretches via md:h-full)
            */}
            <div
              className="relative w-full md:h-full"
              style={{ height: "min(65vw, 340px)" }}
            >
              <img
                src={member.frontImage}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover object-top md:object-center"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/onahi-official.png";
                }}
              />

              {/* Gradient — fades to bg colour at the bottom (mobile) / right edge (desktop) */}
              <div
                className={`
                  absolute inset-0
                  bg-gradient-to-t from-[#0d0d0d]/90 via-transparent to-transparent
                  md:bg-gradient-to-r md:from-transparent md:via-transparent
                  ${T.isDark
                    ? "md:to-[#0d0d0d]/40"
                    : "md:to-white/30"}
                `}
              />

              {/* Name overlay — mobile only (shown at bottom of image) */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:hidden">
                <p className="text-[#ef4444] text-[10px] font-bold tracking-widest uppercase mb-0.5">
                  {member.role}
                </p>
                <h2
                  className="text-2xl font-black text-white tracking-tight leading-tight"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {member.name}
                </h2>
                <p className="text-white/55 text-xs mt-0.5 italic">{member.tagline}</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT / BOTTOM: Scrollable bio content ── */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-7 md:p-10 pt-8 md:pt-10">

              {/* Name block — desktop only */}
              <div className="hidden md:block mb-8">
                <p className="text-[#ef4444] text-[10px] font-bold tracking-widest uppercase mb-1.5">
                  {member.role}
                </p>
                <h2
                  className={`text-3xl lg:text-4xl font-black tracking-tight leading-tight ${T.text}`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {member.name}
                </h2>
                <p className={`text-sm mt-1.5 italic ${T.textFaint}`}>{member.tagline}</p>
              </div>

              <div className="w-6 h-[3px] bg-[#ef4444] mb-7" />

              {/* Bio paragraphs */}
              <div className="space-y-4">
                {member.bio.map((para, i) => (
                  <p key={i} className={`text-sm md:text-base leading-relaxed ${T.textMuted}`}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Social links */}
              {(member.instagram || member.twitter) && (
                <div
                  className={`flex flex-wrap gap-3 mt-8 pt-7 border-t ${
                    T.isDark ? "border-white/8" : "border-black/8"
                  }`}
                >
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg
                        text-sm font-medium transition-all
                        hover:bg-[#ef4444] hover:border-[#ef4444] hover:text-white
                        ${T.isDark
                          ? "border-white/12 text-white/70"
                          : "border-black/12 text-black/60"}
                      `}
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg
                        text-sm font-medium transition-all
                        hover:bg-[#ef4444] hover:border-[#ef4444] hover:text-white
                        ${T.isDark
                          ? "border-white/12 text-white/70"
                          : "border-black/12 text-black/60"}
                      `}
                    >
                      <XIcon className="w-4 h-4" />
                      X / Twitter
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Member Card ──────────────────────────────────────────────────────────────

function MemberCard({
  member,
  index,
  onSelect,
}: {
  member: TeamMember;
  index: number;
  onSelect: (m: TeamMember) => void;
}) {
  const T = useT();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
      onClick={() => onSelect(member)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo */}
      <div className="relative overflow-hidden rounded-xl mb-5" style={{ aspectRatio: "3/4" }}>
        <motion.img
          src={member.frontImage}
          alt={member.name}
          draggable={false}
          className="w-full h-full object-cover object-top"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/onahi-official.png";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {[
          "top-3 left-3 border-t-2 border-l-2",
          "top-3 right-3 border-t-2 border-r-2",
          "bottom-3 left-3 border-b-2 border-l-2",
          "bottom-3 right-3 border-b-2 border-r-2",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-4 h-4 border-[#ef4444]/50 ${cls} pointer-events-none`} />
        ))}

        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-[#ef4444] rounded-full text-white text-sm font-bold">
            Read Bio
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: hovered
              ? "inset 0 0 0 1.5px #ef4444, 0 0 30px rgba(239,68,68,0.2)"
              : "inset 0 0 0 0px transparent",
          }}
          transition={{ duration: 0.25 }}
        />
      </div>

      <div>
        <p className="text-[#ef4444] text-[10px] font-bold tracking-widest uppercase mb-1">
          {member.role}
        </p>
        <h3
          className={`text-xl md:text-2xl font-black tracking-tight ${T.text}`}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {member.name}
        </h3>
        <p className={`text-sm mt-1 italic ${T.textFaint}`}>{member.tagline}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Team page ───────────────────────────────────────────────────────────

export function TeamPage() {
  const T = useT();
  const [selected, setSelected] = useState<TeamMember | null>(null);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${T.bg} ${T.text}`}>

      {/* ── Page hero ── */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-28 px-4 md:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: T.isDark
              ? `radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)`
              : `radial-gradient(circle, rgba(0,0,0,0.10) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-12 h-[3px] bg-[#ef4444] mb-8" />
            <span className="inline-block px-4 py-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-full text-[#ef4444] text-xs font-bold tracking-widest uppercase mb-8">
              The Collective
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.92] mb-10"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            THE PEOPLE<br />
            <span className="text-[#ef4444]">BEHIND THE</span><br />
            WORK.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={`text-lg md:text-xl leading-relaxed max-w-xl ${T.textMuted}`}
          >
            Afro-Nated is built by a small, focused team that cares deeply about what they're making. Click any card to read the full story.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: T.isDark ? 0.07 : 0.04 }}
          transition={{ duration: 2 }}
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
            filter: "blur(80px)",
            transform: "translate(30%, -20%)",
          }}
        />
      </section>

      {/* ── Team grid ── */}
      <section className="pb-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`text-[10px] font-bold tracking-[0.25em] uppercase mb-12 ${T.textFaint}`}
          >
            Click a card to read the full bio
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-5xl">
            {TEAM_MEMBERS.map((member, index) => (
              <MemberCard
                key={member.name}
                member={member}
                index={index}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section
        className={`py-24 px-4 md:px-8 border-t ${
          T.isDark ? "border-white/8 bg-[#0a0a0a]" : "border-black/8 bg-[#f7f5f3]"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2
              className={`text-3xl md:text-4xl font-black tracking-tighter mb-3 ${T.text}`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              WANT TO JOIN?
            </h2>
            <p className={`text-base md:text-lg max-w-lg ${T.textMuted}`}>
              We're always open to passionate creatives who want to build something meaningful. See what roles we have available.
            </p>
          </div>
          <Link
            to="/careers"
            className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-[#ef4444] text-white font-bold tracking-wide hover:bg-white hover:text-black transition-all duration-300"
          >
            VIEW OPEN ROLES
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Bio modal */}
      {selected && (
        <BioModal member={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}