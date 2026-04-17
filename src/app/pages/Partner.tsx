import { motion } from "motion/react";
import { useState } from "react";
import { useT } from "../context/ThemeContext";

const SUCCESS_MSG = "The message has been delivered and the team would get back as soon as possible.";
const EMAILJS_SERVICE_ID  = "service_u74ua9d";
const EMAILJS_TEMPLATE_ID = "template_fpj67ic";
const EMAILJS_PUBLIC_KEY  = "oBwCQc9U5DCQ8nOpU";

async function sendViaEmailJS(params: Record<string, string>) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service_id: EMAILJS_SERVICE_ID, template_id: EMAILJS_TEMPLATE_ID, user_id: EMAILJS_PUBLIC_KEY, template_params: params }),
  });
  if (!res.ok) throw new Error("send failed");
}

export function Partner() {
  const T = useT();
  const [formData, setFormData] = useState({ name: "", email: "", organization: "", type: "", message: "" });
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendViaEmailJS({ to_email: "afronated@gmail.com", from_name: formData.name, from_email: formData.email, reply_to: formData.email, organization: formData.organization, type: formData.type, message: formData.message, subject: `Partnership inquiry from ${formData.name}${formData.organization ? ` (${formData.organization})` : ""}` });
      setFormData({ name: "", email: "", organization: "", type: "", message: "" });
      setStatus("success");
    } catch { setStatus("error"); }
  };

  const inputCls = `w-full px-0 py-3 bg-transparent border-b focus:border-[#ef4444] outline-none transition-colors ${T.isDark ? "border-white/20 text-white placeholder:text-white/30" : "border-black/20 text-black placeholder:text-black/30"}`;
  const labelCls = `block text-xs font-medium tracking-wider uppercase mb-2 ${T.textFaint}`;
  const selectArrowColor = T.isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)";
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(selectArrowColor)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0 center",
    backgroundSize: "24px",
    paddingRight: "32px",
    colorScheme: T.isDark ? "dark" as const : "light" as const,
  };

  const cardCls = `border p-8 hover:border-[#ef4444]/40 transition-colors ${T.isDark ? "border-white/10" : "border-black/10"}`;

  return (
    <section className={`min-h-screen pt-32 pb-20 px-4 md:px-8 transition-colors duration-300 ${T.bg} ${T.text}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
          <div className="w-12 h-1 bg-[#ef4444] mb-6"/>
          <span className="inline-block px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded-full text-[#ef4444] text-xs font-bold tracking-widest uppercase mb-4">WORK WITH US</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>PARTNER</h1>
        </motion.div>

        {/* Partnership options */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-20">
          <p className={`text-xl leading-relaxed mb-16 max-w-3xl ${T.textMuted}`}>Collaborate with Afronated to reach an engaged community of creative youth and culture enthusiasts.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              { title: "Brand Partnerships", desc: "Authentic integration opportunities that align with our community values and creative vision.",        shape: <div className="w-6 h-6 border-2 border-[#ef4444] rounded"/> },
              { title: "Event Coverage",     desc: "Professional documentation and storytelling for festivals, showcases, and cultural events.",           shape: <div className="w-6 h-6 border-2 border-[#ef4444] rounded-full"/> },
              { title: "Content Creation",  desc: "Custom video production, interviews, and editorial content tailored to your objectives.",               shape: <div className="w-6 h-6 border-2 border-[#ef4444]"/> },
              { title: "Community Access",  desc: "Direct engagement with our audience through sponsored content and collaborative campaigns.",            shape: <div className="w-6 h-6 border-2 border-[#ef4444] rounded-lg rotate-45"/> },
            ].map(({ title, desc, shape }) => (
              <div key={title} className={cardCls}>
                <div className="w-12 h-12 bg-[#ef4444]/20 rounded-lg flex items-center justify-center mb-4">{shape}</div>
                <h3 className={`text-2xl font-bold mb-3 ${T.text}`}>{title}</h3>
                <p className={T.textMuted}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center py-8">
            <p className={`mb-2 ${T.textFaint}`}>For partnership inquiries and media kit</p>
            <a href="mailto:afronated@gmail.com" className="text-[#ef4444] hover:text-[#ef4444]/80 transition-colors font-medium text-xl">afronated@gmail.com</a>
          </div>
        </motion.div>

        <div className="w-full h-px bg-[#ef4444]/30 mb-16"/>

        {/* Inquiry form */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>SEND AN INQUIRY</h2>
            <p className={`mb-12 ${T.textFaint}`}>Tell us about your brand or project and we'll follow up with our media kit.</p>

            {status === "success" ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/40 flex items-center justify-center mx-auto">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} className="w-8 h-8"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className={`text-lg leading-relaxed max-w-md mx-auto ${T.textMuted}`}>{SUCCESS_MSG}</p>
                <button onClick={() => setStatus("idle")} className="mt-4 text-[#ef4444] hover:text-[#ef4444]/80 transition-colors text-sm font-medium tracking-wide uppercase">Send Another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="partner-name" className={labelCls}>Name *</label>
                  <input
                    type="text"
                    id="partner-name"
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
                  <label htmlFor="partner-email" className={labelCls}>Email *</label>
                  <input
                    type="email"
                    id="partner-email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className={inputCls}
                  />
                </div>

                {/* Organization */}
                <div>
                  <label htmlFor="partner-organization" className={labelCls}>Organization</label>
                  <input
                    type="text"
                    id="partner-organization"
                    name="organization"
                    autoComplete="organization"
                    inputMode="text"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Brand / Company"
                    className={inputCls}
                  />
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="partner-type" className={labelCls}>Type *</label>
                  <select
                    id="partner-type"
                    name="type"
                    required
                    autoComplete="off"
                    value={formData.type}
                    onChange={handleChange}
                    className={inputCls + " appearance-none cursor-pointer"}
                    style={selectStyle}
                  >
                    <option value="">Select...</option>
                    <option value="sponsorship">Sponsorship</option>
                    <option value="brand-partnership">Brand Partnership</option>
                    <option value="event-coverage">Event Coverage</option>
                    <option value="content-creation">Content Creation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="partner-message" className={labelCls}>Message *</label>
                  <textarea
                    id="partner-message"
                    name="message"
                    required
                    autoComplete="off"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your brand and how you'd like to work together..."
                    rows={6}
                    className={inputCls + " resize-none"}
                  />
                </div>

                {status === "error" && (
                  <p className="text-[#ef4444] text-sm">Something went wrong. Please try again or email us directly.</p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-12 py-4 bg-[#ef4444] text-white hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  {status === "sending" ? "Sending..." : "Send Inquiry"}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}