import { motion } from "motion/react";
import { useState } from "react";
import { useT } from "../context/ThemeContext";

const SUCCESS_MSG = "The message has been delivered and the team would get back as soon as possible.";
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";

async function sendViaEmailJS(params: Record<string, string>) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service_id: EMAILJS_SERVICE_ID, template_id: EMAILJS_TEMPLATE_ID, user_id: EMAILJS_PUBLIC_KEY, template_params: params }),
  });
  if (!res.ok) throw new Error("send failed");
}

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
      await sendViaEmailJS({ to_email: "afronated@gmail.com", from_name: formData.name, from_email: formData.email, intention: formData.intention, social: formData.socialHandle, message: formData.message, subject: `Submit inquiry from ${formData.name}` });
      setFormData({ name: "", email: "", intention: "", socialHandle: "", message: "" });
      setStatus("success");
    } catch { setStatus("error"); }
  };

  const inputCls = `w-full px-0 py-3 bg-transparent border-b focus:border-[#ef4444] outline-none transition-colors ${T.isDark ? "border-white/20 text-white placeholder:text-white/30" : "border-black/20 text-black placeholder:text-black/30"}`;
  const labelCls = `block text-xs font-medium tracking-wider uppercase mb-2 ${T.textFaint}`;

  const selectArrowColor = T.isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)";
  const selectStyle = { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(selectArrowColor)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0 center", backgroundSize: "24px", paddingRight: "32px", colorScheme: T.isDark ? "dark" as const : "light" as const };

  return (
    <section className={`min-h-screen pt-32 pb-20 px-4 md:px-8 transition-colors duration-300 ${T.bg} ${T.text}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
          <div className="w-12 h-1 bg-[#ef4444] mb-6"/>
          <span className="inline-block px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded-full text-[#ef4444] text-xs font-bold tracking-widest uppercase mb-4">GET INVOLVED</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>PUT ME ON</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
            <p className={`text-lg leading-relaxed ${T.textMuted}`}>Are you an artist or musician? Know someone we should feature? Want to collaborate? We'd love to hear from you.</p>
            <ul className={`space-y-3 ${T.textMuted}`}>
              {["Submit your music or creative projects","Request an interview or feature","Collaboration ideas","Just want to be part of the community"].map(t => (
                <li key={t} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-2 flex-shrink-0"/><span>{t}</span></li>
              ))}
            </ul>
            <div className="pt-6">
              <p className={`mb-2 ${T.textFaint}`}>Or email us directly at</p>
              <a href="mailto:afronated@gmail.com" className="text-[#ef4444] hover:text-[#ef4444]/80 transition-colors font-medium text-lg">afronated@gmail.com</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            {status === "success" ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/40 flex items-center justify-center mx-auto">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} className="w-8 h-8"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className={`text-lg leading-relaxed max-w-md mx-auto ${T.textMuted}`}>{SUCCESS_MSG}</p>
                <button onClick={() => setStatus("idle")} className="mt-4 text-[#ef4444] hover:text-[#ef4444]/80 transition-colors text-sm font-medium tracking-wide uppercase">Send Another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[{id:"name",label:"Name *",type:"text",required:true,ph:"Your name"},{id:"email",label:"Email *",type:"email",required:true,ph:"your@email.com"},{id:"socialHandle",label:"Social Handle",type:"text",required:false,ph:"@yourhandle"}].map(f => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className={labelCls}>{f.label}</label>
                    <input type={f.type} id={f.id} name={f.id} required={f.required} value={formData[f.id as keyof typeof formData]} onChange={handleChange} placeholder={f.ph} className={inputCls}/>
                  </div>
                ))}
                <div>
                  <label htmlFor="intention" className={labelCls}>I want to... *</label>
                  <select id="intention" name="intention" required value={formData.intention} onChange={handleChange} className={inputCls + " appearance-none cursor-pointer"} style={selectStyle}>
                    <option value="">Select...</option>
                    <option value="submit-story">Submit my story</option>
                    <option value="recommend">Recommend someone to feature</option>
                    <option value="collaborate">Collaborate with Afronated</option>
                    <option value="other">Something else</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className={labelCls}>Tell us more *</label>
                  <textarea id="message" name="message" required value={formData.message} onChange={handleChange} placeholder="Your ideas, links to your work, what you'd like to collaborate on..." rows={5} className={inputCls + " resize-none"}/>
                </div>
                {status === "error" && <p className="text-[#ef4444] text-sm">Something went wrong. Please try again or email us directly.</p>}
                <motion.button type="submit" disabled={status === "sending"} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto px-12 py-4 bg-[#ef4444] text-white hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed">
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
