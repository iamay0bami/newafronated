import { motion } from "motion/react";
import { useT } from "../context/ThemeContext";
import { useSEO } from "../hooks/useSEO";

// ─── Role data ────────────────────────────────────────────────────────────────

interface Role {
  title: string;
  type: "Paid" | "Contributor";
  tag: string;
  summary: string;
  whatYouDo: string[];
  whatWeLookFor: string[];
}

const ROLES: Role[] = [
  {
    title: "Video Editor",
    type: "Paid",
    tag: "Production",
    summary:
      "We're looking for a video editor to help shape the visual language of Afro-Nated across interviews, short-form content, and digital storytelling. From full-length conversations to reels and social edits, you'll help turn raw footage into thoughtful, engaging content that feels intentional and culturally connected.",
    whatYouDo: [
      "Edit interview content for YouTube and social platforms",
      "Create short-form edits for TikTok, Instagram Reels, and YouTube Shorts",
      "Colour-grade and clean up audio for a polished final product",
      "Work closely with the creative director to bring each piece to life",
      "Deliver edits within agreed timelines while contributing creative ideas and improvements",
    ],
    whatWeLookFor: [
      "A strong portfolio that shows taste, storytelling, and attention to detail",
      "Experience with Premiere Pro, DaVinci Resolve, or similar editing software",
      "A good sense of pacing, rhythm, and visual flow",
      "Clear communication and reliability",
      "Genuine interest in African music, culture, and storytelling",
    ],
  },
  {
    title: "Content Strategist",
    type: "Contributor",
    tag: "Strategy",
    summary:
      "We're looking for a content strategist to help shape how Afro-Nated shows up across platforms and how our stories reach and resonate with people. This role is about thinking beyond individual posts — focusing on patterns, timing, audience behaviour, and how content builds over time.",
    whatYouDo: [
      "Build and manage a content calendar across YouTube, Instagram, TikTok, and Medium",
      "Track performance and translate insights into clear direction",
      "Work with the team to align content with brand goals and cultural moments",
      "Spot growth opportunities, collaborations, and emerging trends",
      "Help shape a consistent and recognisable Afro-Nated voice",
    ],
    whatWeLookFor: [
      "Understanding of how content strategy works across multiple platforms",
      "Comfort working with analytics and interpreting what they mean",
      "Clear, thoughtful communication",
      "A strategic mindset with real curiosity about culture",
      "Self-driven energy and a long-term approach to building something meaningful",
    ],
  },
];

// ─── Values data ─────────────────────────────────────────────────────────────

const VALUES = [
  {
    label: "Cultural Authenticity",
    desc: "Afro-Nated is shaped by the culture we grew up around and continue to experience every day. From the music we spotlight to the stories we tell, everything comes from a real connection to the communities and creatives inspiring the culture forward.",
  },
  {
    label: "Creative Courage",
    desc: "We want people who are willing to try things, fail sometimes, and try again with more intention.",
  },
  {
    label: "Collective Ownership",
    desc: "Afro-Nated grows through collaboration, shared ideas, and people who genuinely care about what we're building. We value contributors who want to be part of the journey, bring their perspective to the table, and grow alongside the brand.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ type }: { type: Role["type"] }) {
  const T = useT();
  if (type === "Paid") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ef4444]/20 border border-[#ef4444]/50 rounded-full text-[#ef4444] text-[10px] font-bold tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
        Paid Role
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
        T.isDark
          ? "bg-white/5 border-white/15 text-white/50"
          : "bg-black/5 border-black/15 text-black/45"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          T.isDark ? "bg-white/40" : "bg-black/30"
        }`}
      />
      Contributor
    </span>
  );
}

function RoleCard({ role, index }: { role: Role; index: number }) {
  const T = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`relative border transition-colors duration-300 group ${
        T.isDark
          ? "border-white/10 hover:border-[#ef4444]/40"
          : "border-black/10 hover:border-[#ef4444]/40"
      }`}
    >
      <div className="absolute top-0 left-0 w-[3px] h-0 bg-[#ef4444] group-hover:h-full transition-all duration-500 ease-in-out" />

      <div className="p-8 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p
              className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-2 ${T.textFaint}`}
            >
              {role.tag}
            </p>
            <h3
              className={`text-2xl md:text-3xl font-black tracking-tight ${T.text}`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {role.title}
            </h3>
          </div>
          <RoleBadge type={role.type} />
        </div>

        <p className={`text-base leading-relaxed mb-8 ${T.textMuted}`}>
          {role.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4
              className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 ${T.textFaint}`}
            >
              What You'll Do
            </h4>
            <ul className="space-y-3">
              {role.whatYouDo.map((item) => (
                <li
                  key={item}
                  className={`flex items-start gap-3 text-sm leading-relaxed ${T.textMuted}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 ${T.textFaint}`}
            >
              What We Look For
            </h4>
            <ul className="space-y-3">
              {role.whatWeLookFor.map((item) => (
                <li
                  key={item}
                  className={`flex items-start gap-3 text-sm leading-relaxed ${T.textMuted}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      T.isDark ? "bg-white/30" : "bg-black/25"
                    }`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`mt-10 pt-8 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            T.isDark ? "border-white/8" : "border-black/8"
          }`}
        >
          <p className={`text-sm ${T.textFaint}`}>
            Interested? Drop us a message with the subject line{" "}
            <span className={`font-semibold ${T.textMuted}`}>
              "{role.title} — Afro-Nated"
            </span>
          </p>
          <a
            href={`mailto:afronated@gmail.com?subject=${encodeURIComponent(
              role.title + " — Afro-Nated"
            )}`}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#ef4444] text-white text-sm font-bold tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300"
          >
            Apply Now
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Careers page ────────────────────────────────────────────────────────

export function Careers() {
  const T = useT();

  useSEO({
    title: "Careers — Join the Afronated Collective",
    description:
      "Join Afronated — we're looking for video editors, content strategists, and creatives who want to help build a platform for African creative media.",
    canonical: "https://afronated.com/careers",
  });

  return (
    <section
      className={`min-h-screen pt-32 pb-24 px-4 md:px-8 transition-colors duration-300 ${T.bg} ${T.text}`}
    >
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="w-12 h-1 bg-[#ef4444] mb-6" />
          <span className="inline-block px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded-full text-[#ef4444] text-xs font-bold tracking-widest uppercase mb-6">
            Join The Collective
          </span>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-none"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            BUILD WITH US
          </h1>
          <p
            className={`text-xl md:text-2xl leading-relaxed max-w-3xl ${T.textMuted}`}
          >
            Afro-Nated is a brand in motion. A creative collective shaped by the
            people who believe in what we're building. As we continue to grow,
            we're always excited to connect with thoughtful, passionate creatives
            who want to grow with us. If that sounds like you, read on.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-6 h-px bg-[#ef4444]" />
            <span
              className={`text-[10px] font-bold tracking-[0.2em] uppercase ${T.textFaint}`}
            >
              What We're About
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`p-6 border transition-colors ${
                  T.isDark
                    ? "border-white/10 hover:border-[#ef4444]/30"
                    : "border-black/10 hover:border-[#ef4444]/30"
                }`}
              >
                <div className="w-4 h-[3px] bg-[#ef4444] mb-4" />
                <h3
                  className={`text-base font-bold mb-3 ${T.text}`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {v.label}
                </h3>
                <p className={`text-sm leading-relaxed ${T.textMuted}`}>
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-6 h-px bg-[#ef4444]" />
            <span
              className={`text-[10px] font-bold tracking-[0.2em] uppercase ${T.textFaint}`}
            >
              Open Roles
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#ef4444]/20 to-transparent" />
            <span
              className={`text-[10px] font-bold tracking-widest uppercase ${T.textFaint}`}
            >
              {ROLES.length} Available
            </span>
          </motion.div>

          <div className="space-y-8">
            {ROLES.map((role, i) => (
              <RoleCard key={role.title} role={role} index={i} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div
            className={`inline-block px-1 py-12 w-full max-w-2xl mx-auto`}
          >
            <span
              className={`block text-[10px] font-bold tracking-[0.25em] uppercase mb-4 ${T.textFaint}`}
            >
              What's Next
            </span>
            <p
              className={`text-lg md:text-xl leading-relaxed mb-6 ${T.textMuted}`}
            >
              The roles listed here reflect what we need right now. As Afro-Nated
              evolves, new opportunities will open up across production, writing,
              design, and community building. The best way to stay informed is to
              follow us on our socials — we'll announce new roles there first.
            </p>
            <p className={`text-sm ${T.textFaint}`}>
              General enquiries and speculative applications are always welcome at{" "}
              <a
                href="mailto:afronated@gmail.com"
                className="text-[#ef4444] hover:text-[#ef4444]/80 transition-colors font-medium"
              >
                afronated@gmail.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}