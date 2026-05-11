import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useT } from "../context/ThemeContext";

// ─── Section data ─────────────────────────────────────────────────────────────

const PILLARS = [
  {
    number: "01",
    title: "Spotlight Interviews",
    desc: "The 'Behind The Creative' series is our flagship format — long-form, unfiltered conversations with African musicians, filmmakers, entrepreneurs, and stylists. We don't do press junkets. We sit down, go deep, and let the person speak.",
  },
  {
    number: "02",
    title: "Short-Form Content",
    desc: "Culture moves fast. Our TikTok and YouTube Shorts output keeps pace — quick cuts, sharp angles, and moments pulled from the broader creative ecosystem we move through every day.",
  },
  {
    number: "03",
    title: "Editorial & Writing",
    desc: "Published on Medium, our written work goes where video can't. Profiles, essays, and cultural commentary that contextualise the work of the creatives we spotlight and the movements shaping the scene.",
  },
  {
    number: "04",
    title: "Community & Discovery",
    desc: "Through 'Put Me On', any creative can submit their work for consideration. We actively seek out voices that have been overlooked and give them a real platform, not just a moment.",
  },
];

const VALUES = [
  {
    label: "Authenticity over aesthetics",
    desc: "We'd rather show something real and raw than produce something polished but hollow. Our content lives in the tension between craft and truth.",
  },
  {
    label: "Depth over virality",
    desc: "Trending content has its place, but what we're building is an archive of genuine voices. Something someone can come back to in five years and still find relevant.",
  },
  {
    label: "Africa as a creative centre",
    desc: "Not as context for a story told somewhere else — as the origin, the standard, and the source. The creativity we document isn't happening despite our context. It's happening because of it.",
  },
  {
    label: "Collective over clout",
    desc: "Afro-Nated isn't built on one person's following. It's built on the relationships, trust, and shared work of a team that believes in what this becomes.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  const T = useT();
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="w-6 h-px bg-[#ef4444]" />
      <span className={`text-[10px] font-bold tracking-[0.25em] uppercase ${T.textFaint}`}>
        {text}
      </span>
    </div>
  );
}

// ─── Main About page ──────────────────────────────────────────────────────────

export function About() {
  const T = useT();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${T.bg} ${T.text}`}>

      {/* ══════════════════════════════════════════════════════════════════
          HERO — full-bleed statement
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-32 px-4 md:px-8 overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: T.isDark
            ? `linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)`
            : `linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-[3px] bg-[#ef4444] mb-8" />
            <span className="inline-block px-4 py-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-full text-[#ef4444] text-xs font-bold tracking-widest uppercase mb-8">
              About Afro-Nated
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.92] mb-12"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            We document<br />
            what Africa<br />
            <span className="text-[#ef4444]">creates.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={`text-xl md:text-2xl leading-relaxed max-w-2xl ${T.textMuted}`}
          >
            Afro-Nated is a creative media collective built to spotlight African creatives, amplify their stories, and connect them to the audiences their work deserves.
          </motion.p>
        </div>

        {/* Ambient glow */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: T.isDark ? 0.07 : 0.04 }}
          transition={{ duration: 2 }}
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #ef4444 0%, transparent 70%)", filter: "blur(80px)", transform: "translate(30%, -20%)" }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          ORIGIN STORY
      ══════════════════════════════════════════════════════════════════ */}
      <section className={`py-24 md:py-32 px-4 md:px-8 ${T.isDark ? "bg-[#0a0a0a]" : "bg-[#f7f5f3]"}`}>
        <div className="max-w-7xl mx-auto">
          <SectionLabel text="The Origin" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className={`text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight mb-0 ${T.text}`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                BUILT FROM<br />THE INSIDE OUT
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="space-y-6"
            >
              <p className={`text-lg leading-relaxed ${T.textMuted}`}>
                Afro-Nated started with a simple frustration: African creatives doing remarkable work were consistently underrepresented in the media spaces that shaped how the world consumed culture. The talent was undeniable. The coverage wasn't keeping up.
              </p>
              <p className={`text-lg leading-relaxed ${T.textMuted}`}>
                Founded in 2024, we set out to close that gap — not by asking for a seat at someone else's table, but by building our own. A platform rooted in the culture, run by people who live inside it, for an audience that recognises what they see because it reflects their world.
              </p>
              <p className={`text-lg leading-relaxed ${T.textMuted}`}>
                What started as a series of interviews has grown into a full creative media operation — video content, editorial, short-form, and a growing community of artists, makers, and storytellers who trust us to represent them honestly.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          WHAT WE DO — four content pillars
      ══════════════════════════════════════════════════════════════════ */}
      <section className={`py-24 md:py-32 px-4 md:px-8 ${T.bg}`}>
        <div className="max-w-7xl mx-auto">
          <SectionLabel text="What We Do" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`text-3xl md:text-5xl font-black tracking-tighter mb-16 ${T.text}`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            FOUR WAYS WE SHOW UP
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative p-8 md:p-10 border group hover:border-[#ef4444]/40 transition-colors duration-300 ${
                  T.isDark ? "border-white/8" : "border-black/8"
                }`}
              >
                {/* Number */}
                <span
                  className="block text-[64px] md:text-[80px] font-black leading-none tracking-tighter mb-4 select-none"
                  style={{ color: T.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", fontFamily: "Montserrat, sans-serif" }}
                >
                  {p.number}
                </span>
                {/* Red accent */}
                <div className="w-6 h-[3px] bg-[#ef4444] mb-4" />
                <h3
                  className={`text-xl md:text-2xl font-black tracking-tight mb-4 ${T.text}`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {p.title}
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${T.textMuted}`}>
                  {p.desc}
                </p>
                {/* Hover left accent */}
                <div className="absolute top-0 left-0 w-[3px] h-0 bg-[#ef4444] group-hover:h-full transition-all duration-500 ease-in-out" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          MISSION — the full statement
      ══════════════════════════════════════════════════════════════════ */}
      <section className={`py-24 md:py-32 px-4 md:px-8 ${T.isDark ? "bg-[#0a0a0a]" : "bg-[#f7f5f3]"}`}>
        <div className="max-w-7xl mx-auto">
          <SectionLabel text="Our Mission" />

          <div className="max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`text-3xl md:text-5xl font-black tracking-tighter mb-12 ${T.text}`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              REDEFINING<br />AFRICAN NARRATIVES
            </motion.h2>

            <div className="space-y-6">
              {[
                "Afro-Nated is a creative media platform focused on amplifying African creatives through storytelling, interviews, and culture-driven content.",
                "We highlight the people, sounds, and ideas shaping today's creative scene — from emerging artists to established voices — and present them in a way that feels honest, intentional, and rooted in culture.",
                "Through interviews, visual storytelling, and curated content, we aim to spotlight African creativity and make it more visible to wider audiences.",
                "Afro-Nated exists to document, support, and amplify the creative energy coming out of Africa — not as a trend, not as a moment, but as a permanent, evolving record of what this generation is building.",
              ].map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className={`text-lg md:text-xl leading-relaxed ${T.textMuted}`}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════════════════════════════ */}
      <section className={`py-24 md:py-32 px-4 md:px-8 ${T.bg}`}>
        <div className="max-w-7xl mx-auto">
          <SectionLabel text="What We Stand For" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`text-3xl md:text-5xl font-black tracking-tighter mb-16 ${T.text}`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            OUR VALUES
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`p-8 border transition-colors duration-300 hover:border-[#ef4444]/40 ${
                  T.isDark ? "border-white/8" : "border-black/8"
                }`}
              >
                <div className="w-4 h-[3px] bg-[#ef4444] mb-5" />
                <h3
                  className={`text-lg md:text-xl font-black tracking-tight mb-4 ${T.text}`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {v.label}
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${T.textMuted}`}>
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CTA — meet the team + get involved
      ══════════════════════════════════════════════════════════════════ */}
      <section className={`py-24 md:py-32 px-4 md:px-8 ${T.isDark ? "bg-[#0a0a0a]" : "bg-[#f7f5f3]"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Meet the team */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`p-10 border transition-colors duration-300 group hover:border-[#ef4444]/40 ${
                T.isDark ? "border-white/8" : "border-black/8"
              }`}
            >
              <div className="w-4 h-[3px] bg-[#ef4444] mb-6" />
              <h3
                className={`text-2xl md:text-3xl font-black tracking-tight mb-4 ${T.text}`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                MEET THE COLLECTIVE
              </h3>
              <p className={`text-base leading-relaxed mb-8 ${T.textMuted}`}>
                The people behind Afro-Nated — their backgrounds, their roles, and what drives them to keep building.
              </p>
              <Link
                to="/team"
                className={`inline-flex items-center gap-3 font-bold tracking-wide hover:text-[#ef4444] transition-colors duration-300 group ${T.text}`}
              >
                <span>MEET THE TEAM</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Get featured */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-10 border border-[#ef4444]/30 hover:border-[#ef4444]/60 transition-colors duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="w-4 h-[3px] bg-[#ef4444] mb-6" />
                <h3
                  className={`text-2xl md:text-3xl font-black tracking-tight mb-4 ${T.text}`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  GET FEATURED
                </h3>
                <p className={`text-base leading-relaxed mb-8 ${T.textMuted}`}>
                  Are you a creative doing something worth sharing? Submit your work and let's see if we can put you on.
                </p>
                <Link
                  to="/submit"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#ef4444] text-white font-bold tracking-wide hover:bg-white hover:text-black transition-all duration-300"
                >
                  PUT ME ON
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}