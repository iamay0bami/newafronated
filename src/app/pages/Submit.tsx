import { motion } from "motion/react";
import { useState } from "react";
import { useT } from "../context/ThemeContext";

const SUCCESS_MSG = "The message has been delivered and the team would get back as soon as possible.";
const EMAILJS_SERVICE_ID  = "service_9cs3rys";
const EMAILJS_TEMPLATE_ID = "template_a4il80f";
const EMAILJS_PUBLIC_KEY  = "oBwCQc9U5DCQ8nOpU";

async function sendViaEmailJS(params: Record<string, string>) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "origin": "http://localhost",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PUBLIC_KEY,
      template_params: params,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`send failed: ${res.status} ${text}`);
  }
}

// ─── Intent clarification cards ───────────────────────────────────────────────

const INTENT_TYPES = [
  {
    label: "Feature / Spotlight",
    badge: "Editorial",
    badgeColor: "text-white/50 border-white/20 bg-white/5",
    badgeColorLight: "text-black/40 border-black/15 bg-black/5",
    accent: false,
    desc: "We review submissions and reach out if your work fits our editorial direction.",
    detail: "Submit your creative work, music, or project and we'll consider it for a future feature, interview, or spotlight across our platforms.",
  },
  {
    label: "Collaboration",
    badge: "Creative",
    badgeColor: "text-white/50 border-white/20 bg-white/5",
    badgeColorLight: "text-black/40 border-black/15 bg-black/5",
    accent: false,
    desc: "For mutual projects where both sides bring creative or audience value.",
    detail: "Got an idea that benefits both of us? Propose a joint project, co-production, or cross-platform campaign.",
  },
  {
    label: "Paid Projects",
    badge: "Commission",
    badgeColor: "text-[#ef4444] border-[#ef4444]/40 bg-[#ef4444]/10",
    badgeColorLight: "text-[#ef4444] border-[#ef4444]/40 bg-[#ef4444]/10",
    accent: true,
    desc: "For commissioned interviews, content production, or campaign work.",
    detail: "Hire Afro-Nated to produce interviews, create content for your brand, or lead a creative campaign. Tell us what you need and we'll talk scope and rates.",
  },
];

function IntentCards() {
  const T = useT();

  return (
    <div className="mt-10 mb-2">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-5 h-px bg-[#ef4444]" />
        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${T.textFaint}`}>
          How it works
        </span>
      </div>

      {/* Cards — 1 col on mobile, 3 col on md+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {INTENT_TYPES.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`relative p-5 border transition-colors duration-300 group ${
              item.accent
                ? T.isDark
                  ? "border-[#ef4444]/30 hover:border-[#ef4444]/60"
                  : "border-[#ef4444]/25 hover:border-[#ef4444]/50"
                : T.isDark
                ? "border-white/8 hover:border-white/20"
                : "border-black/8 hover:border-black/18"
            }`}
          >
            {/* Accent left strip */}
            {item.accent && (
              <div className="absolute top-0 left-0 w-[3px] h-full bg-[#ef4444]" />
            )}

            {/* Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[9px] font-bold tracking-widest uppercase mb-3 ${
                T.isDark ? item.badgeColor : item.badgeColorLight
              }`}
            >
              {item.badge}
            </span>

            {/* Title */}
            <h3
              className={`text-sm font-black tracking-tight mb-1.5 ${T.text}`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {item.label}
            </h3>

            {/* Short desc */}
            <p className={`text-xs leading-relaxed mb-2 font-medium ${T.textMuted}`}>
              {item.desc}
            </p>

            {/* Detail */}
            <p className={`text-[11px] leading-relaxed ${T.textFaint}`}>
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Submit page ─────────────────────────────────────────────────────────

export function Submit() {
  const T = useT();
  const [formData, setFormData] = useState({ name: "", email: "", intention: "", socialHandle: "", message: "" });
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendViaEmailJS({
        to_email: "afronated@gmail.com",
        from_name: formData.name,
        from_email: formData.email,
        reply_to: formData.email,
        intention: formData.intention,
        social: formData.socialHandle,
        message: formData.message,
        subject: `Submit inquiry from ${formData.name}`,
      });
      setFormData({ name: "", email: "", intention: "", socialHandle: "", message: "" });
      setStatus("success");
    } catch (err) {
      console.error("[Submit] EmailJS error:", err);
      setStatus("error");
    }
  };

  const inputCls = `w-full px-0 py-3 bg-transparent border-b focus:border-[#ef4444] outline-none transition-colors ${T.isDark ? "border-white/20 text-white placeholder:text-white/30" : "border-black/20 text-black placeholder:text-black/30"}`;
  const labelCls = `block text-xs font-medium tracking-wider uppercase mb-2 ${T.textFaint}`;

  const selectArrowColor = T.isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)";
  const selectStyle: React.CSSProperties = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(selectArrowColor)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0 center",
    backgroundSize: "24px",
    paddingRight: "32px",
    colorScheme: T.isDark ? "dark" : "light",
    backgroundColor: T.isDark ? "#0a0a0a" : "#ffffff",
    color: T.isDark ? "#ffffff" : "#000000",
  };

  return (
    <section className={`min-h-screen pt-32 pb-20 px-4 md:px-8 transition-colors duration-300 ${T.bg} ${T.text}`}>
      <div className="max-w-7xl mx-auto">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="w-12 h-1 bg-[#ef4444] mb-6"/>
          <span className="inline-block px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded-full text-[#ef4444] text-xs font-bold tracking-widest uppercase mb-4">
            GET INVOLVED
          </span>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            PUT ME ON
          </h1>
        </motion.div>

        {/* ── Two-column layout: left = info + intent cards, right = form ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className={`text-lg leading-relaxed mb-6 ${T.textMuted}`}>
              Are you a creative with work, ideas, or a story worth sharing?
              Afro-Nated exists to spotlight and connect African creatives
              through storytelling, interviews, and culture-driven content.
            </p>

            <ul className={`space-y-3 mb-8 ${T.textMuted}`}>
              {[
                "Submit your creative work or project",
                "Request a feature, interview, or spotlight",
                "Propose a collaboration or creative partnership",
                "Recommend a creative we should know about",
                "Commission content production or campaign work",
              ].map(t => (
                <li key={t} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-2 flex-shrink-0"/>
                  <span className="text-sm md:text-base">{t}</span>
                </li>
              ))}
            </ul>

            {/* Intent clarification cards */}
            <IntentCards />

            {/* Direct email fallback */}
            <div className={`mt-8 pt-6 border-t ${T.isDark ? "border-white/8" : "border-black/8"}`}>
              <p className={`mb-2 text-sm ${T.textFaint}`}>Or reach us directly at</p>
              <a
                href="mailto:afronated@gmail.com"
                className="text-[#ef4444] hover:text-[#ef4444]/80 transition-colors font-medium text-base md:text-lg"
              >
                afronated@gmail.com
              </a>
            </div>
          </motion.div>

          {/* RIGHT COLUMN — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/40 flex items-center justify-center mx-auto">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} className="w-8 h-8">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className={`text-lg leading-relaxed max-w-md mx-auto ${T.textMuted}`}>{SUCCESS_MSG}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-[#ef4444] hover:text-[#ef4444]/80 transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                {/* Name */}
                <div>
                  <label htmlFor="submit-name" className={labelCls}>Name *</label>
                  <input
                    type="text"
                    id="submit-name"
                    name="name"
                    required
                    autoComplete="name"
                    inputMode="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="submit-email" className={labelCls}>Email *</label>
                  <input
                    type="email"
                    id="submit-email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputCls}
                  />
                </div>

                {/* Social handle */}
                <div>
                  <label htmlFor="submit-social" className={labelCls}>Social Handle</label>
                  <input
                    type="text"
                    id="submit-social"
                    name="socialHandle"
                    autoComplete="username"
                    inputMode="text"
                    value={formData.socialHandle}
                    onChange={handleChange}
                    placeholder="@yourhandle"
                    className={inputCls}
                  />
                </div>

                {/* Intention */}
                <div>
                  <label htmlFor="submit-intention" className={labelCls}>I want to... *</label>
                  <select
                    id="submit-intention"
                    name="intention"
                    required
                    autoComplete="off"
                    value={formData.intention}
                    onChange={handleChange}
                    className={inputCls + " appearance-none cursor-pointer"}
                    style={selectStyle}
                  >
                    <option value="">Select...</option>
                    <option value="feature-spotlight">Feature / Spotlight — Submit my work for editorial consideration</option>
                    <option value="collaborate">Collaboration — Mutual creative or audience project</option>
                    <option value="paid-project">Paid Project — Commission an interview, production, or campaign</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="submit-message" className={labelCls}>Tell us more *</label>
                  <textarea
                    id="submit-message"
                    name="message"
                    required
                    autoComplete="off"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your creative work, share links, describe what you'd like to collaborate on..."
                    rows={5}
                    className={inputCls + " resize-none"}
                  />
                </div>

                {status === "error" && (
                  <p className="text-[#ef4444] text-sm">
                    Something went wrong. Please try again or email us directly at{" "}
                    <a href="mailto:afronated@gmail.com" className="underline">afronated@gmail.com</a>.
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-12 py-4 bg-[#ef4444] text-white hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  {status === "sending" ? "Sending..." : "Submit"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}