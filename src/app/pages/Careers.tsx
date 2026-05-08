import { motion } from "motion/react";
import { useT } from "../context/ThemeContext";

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
      "You'll shape the final look and feel of our interview series and short-form content. Your eye for pacing, colour, and storytelling will turn raw footage into the kind of visual work that moves people.",
    whatYouDo: [
      "Cut and assemble interview footage for our YouTube series and social platforms",
      "Colour-grade and mix audio to a consistent, high-quality finish",
      "Create short-form edits and reels adapted for TikTok, Instagram, and YouTube Shorts",
      "Collaborate directly with the creative director to realise the visual identity of each piece",
      "Deliver content within agreed timelines and suggest creative improvements along the way",
    ],
    whatWeLookFor: [
      "A strong portfolio of edited video work — format and style matter less than intention",
      "Proficiency in Premiere Pro, DaVinci Resolve, or a comparable editing suite",
      "An instinct for rhythm, pacing, and visual storytelling",
      "Reliability and clear communication — we're a small team and every role counts",
      "Genuine enthusiasm for African creative culture",
    ],
  },
  {
    title: "Content Creator",
    type: "Contributor",
    tag: "Creative",
    summary:
      "You're someone who lives and breathes creative culture and can translate that energy into content people stop scrolling for. This is a chance to build something real alongside a growing collective.",
    whatYouDo: [
      "Shoot and produce original content for our social platforms — on-location or studio-based",
      "Contribute ideas to our content calendar and pitch concepts rooted in African culture",
      "Collaborate with the team on interview setups, event coverage, and creative campaigns",
      "Help maintain a consistent visual identity across all platforms",
      "Be an active, creative voice within the Afro-Nated collective",
    ],
    whatWeLookFor: [
      "A creative eye — whether you shoot on a phone or a professional camera, it's the vision that counts",
      "Familiarity with social platforms and what content performs well on each",
      "Energy, initiative, and the ability to work independently when needed",
      "A passion for storytelling that centres African voices and perspectives",
      "Willingness to grow with us and contribute to building something meaningful from the ground up",
    ],
  },
  {
    title: "Content Strategist",
    type: "Contributor",
    tag: "Strategy",
    summary:
      "You think in systems, patterns, and narratives. You understand how content moves audiences and you want to apply that thinking to a brand with a clear cultural mission and a growing platform.",
    whatYouDo: [
      "Develop and manage a content calendar across YouTube, Instagram, TikTok, and Medium",
      "Analyse performance data and translate findings into actionable strategy",
      "Work with the team to align content output with brand goals and cultural moments",
      "Identify growth opportunities, collaboration prospects, and emerging platform trends",
      "Help build the Afro-Nated voice into something consistent, recognisable, and culturally grounded",
    ],
    whatWeLookFor: [
      "An understanding of how content strategy works across multiple platforms",
      "Comfort with analytics — you know what the numbers are telling you",
      "Strong written communication and the ability to articulate ideas clearly",
      "A strategic mind paired with genuine cultural curiosity",
      "Self-motivation and a long-term view — this is about building something that lasts",
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
    desc: "This isn't a job board for passive contributors. We want people invested in building the brand alongside us — not just doing a task.",
  },
  {
    label: "Integrity",
    desc: "We show up, we follow through, and we communicate when things change. Reliability and honesty are non-negotiable in a small team.",
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
      {/* Red left accent line */}
      <div className="absolute top-0 left-0 w-[3px] h-0 bg-[#ef4444] group-hover:h-full transition-all duration-500 ease-in-out" />

      <div className="p-8 md:p-10">
        {/* Header row */}
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

        {/* Summary */}
        <p className={`text-base leading-relaxed mb-8 ${T.textMuted}`}>
          {role.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What you'll do */}
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

          {/* What we look for */}
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

        {/* Apply CTA */}
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

  return (
    <section
      className={`min-h-screen pt-32 pb-24 px-4 md:px-8 transition-colors duration-300 ${T.bg} ${T.text}`}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Page header ── */}
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

        {/* ── Brand values ── */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* ── Roles ── */}
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

        {/* ── Note on contributor roles ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`border p-8 md:p-10 mb-16 ${
            T.isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div className="w-8 h-[3px] bg-[#ef4444] mb-6" />
          <h3
            className={`text-xl font-bold mb-4 ${T.text}`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            A Note on How We Work
          </h3>
          <p className={`text-base leading-relaxed mb-4 ${T.textMuted}`}>
            Afro-Nated is a self-sustained creative collective. Some of the roles
            here are compensated — others are contributor positions where the value
            is in the work itself, the community, the portfolio, and the shared
            mission of building something that matters. We're transparent about
            this because we respect your time and want to attract people who are
            genuinely aligned with where we're going.
          </p>
          <p className={`text-base leading-relaxed ${T.textMuted}`}>
            As the brand grows, so does the opportunity. We're not offering
            permanence — we're offering the chance to be part of something at the
            beginning, when it counts most.
          </p>
        </motion.div>

        {/* ── Future roles notice ── */}
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