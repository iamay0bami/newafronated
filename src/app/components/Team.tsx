import { motion } from "motion/react";
import { useState } from "react";
import { Linkedin, Instagram } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useT } from "../context/ThemeContext";

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  );
}

/** Silhouette placeholder rendered as an inline SVG data URL */
const PLACEHOLDER_FRONT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'%3E%3Crect width='600' height='800' fill='%231a1a1a'/%3E%3Ccircle cx='300' cy='240' r='110' fill='%23333'/%3E%3Cellipse cx='300' cy='620' rx='190' ry='200' fill='%23333'/%3E%3C/svg%3E";

const PLACEHOLDER_BACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'%3E%3Crect width='600' height='800' fill='%23111'/%3E%3Ccircle cx='300' cy='240' r='110' fill='%23222'/%3E%3Cellipse cx='300' cy='620' rx='190' ry='200' fill='%23222'/%3E%3Ctext x='300' y='780' text-anchor='middle' font-family='sans-serif' font-size='22' fill='%23555'%3EPhoto Coming Soon%3C/text%3E%3C/svg%3E";

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
    role: "Founder",
    bio: "Bio coming soon.",
    frontImage: PLACEHOLDER_FRONT,
    backImage: PLACEHOLDER_BACK,
    linkedin: "https://linkedin.com",
    twitter: "https://x.com/AfroNated",
    instagram: "https://www.instagram.com/afro.nated",
  },
  {
    name: "Grace Otolorin",
    role: "Head of Operations & Co-founder",
    bio: "A Creative Director and Project Manager dedicated to building structure and driving execution. Grace excels at bringing ideas to life through strategic planning and impactful storytelling.",
    frontImage: "/grace-front.png",
    backImage: "/grace-back.png",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com/AfroNated",
    instagram: "https://www.instagram.com/afro.nated",
  },
  {
    name: "Veronica Emmanuel",
    role: "Content Writer",
    bio: "A dedicated Content Writer specialising in clear brand communication and online growth. Veronica crafts engaging content for social media and blogs, focusing on simple, effective messaging.",
    frontImage: "/veronica-front.png",
    backImage: "/veronica-back.png",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com/AfroNated",
    instagram: "https://www.instagram.com/afro.nated",
  },
  {
    name: "Name Pending",
    role: "Position Pending",
    bio: "Bio coming soon.",
    frontImage: PLACEHOLDER_FRONT,
    backImage: PLACEHOLDER_BACK,
    linkedin: "https://linkedin.com",
    twitter: "https://x.com/AfroNated",
    instagram: "https://www.instagram.com/afro.nated",
  },
];

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative h-[500px] perspective-1000 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((f) => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ── Front ── */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative w-full h-full">
            <ImageWithFallback
              src={member.frontImage}
              alt={member.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
              <p className="text-white/70 font-medium">{member.role}</p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isFlipped ? 0 : 1 }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
            >
              <span className="text-xs text-white/60">→</span>
            </motion.div>
          </div>
        </div>

        {/* ── Back ── */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="relative w-full h-full">
            <ImageWithFallback
              src={member.backImage}
              alt={`${member.name} – behind the scenes`}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 opacity-95" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
              <div>
                <span className="inline-block px-3 py-1 bg-[#ef4444] rounded-full text-xs font-bold tracking-wide uppercase mb-4">
                  Behind the Scenes
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-white/80 font-medium mb-3">{member.role}</p>
                <p className="text-white/65 text-sm leading-snug mb-6 line-clamp-4">
                  {member.bio}
                </p>
                <div className="flex gap-3">
                  {member.linkedin && (
                    
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-[#ef4444] hover:border-[#ef4444] transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.twitter && (
                    
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-[#ef4444] hover:border-[#ef4444] transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <XIcon className="w-4 h-4" />
                    </a>
                  )}
                  {member.instagram && (
                    
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-[#ef4444] hover:border-[#ef4444] transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

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
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 ${T.text}`}>
            MEET THE TEAM
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${T.textMuted}`}>
            The visionaries and storytellers behind Afronated
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`text-center text-sm mt-8 ${T.textFaint}`}
        >
          Hover (or tap on mobile) to learn more about the team
        </motion.p>
      </div>

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