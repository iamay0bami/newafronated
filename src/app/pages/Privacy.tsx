import { motion } from "motion/react";
import { useT } from "../context/ThemeContext";

export function Privacy() {
  const T = useT();

  return (
    <section className={`min-h-screen pt-32 pb-20 px-4 md:px-8 transition-colors duration-300 ${T.bg}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mb-8 ${T.text}`} style={{ fontFamily: "Montserrat, sans-serif" }}>
            PRIVACY POLICY
          </h1>
          <p className={`mb-12 ${T.textFaint}`}>Last updated: March 31, 2026</p>

          <div className={`space-y-8 leading-relaxed ${T.textMuted}`}>
            {[
              { title: "Introduction", content: "At Afronated, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information." },
              { title: "Information We Collect", content: null, list: ["Name and contact information (email, phone)", "Information provided in forms and inquiries", "Social media handles when provided", "Usage data and analytics"], pre: "We collect information that you provide to us including:" },
              { title: "How We Use Your Data", content: null, list: ["Respond to your inquiries and submissions", "Process partnership requests", "Improve our services and content", "Send updates about our work (with your consent)"], pre: "We use your information to:" },
              { title: "Data Protection", content: "We implement appropriate security measures to protect your personal information. Your data is stored securely and we do not sell or share your information with third parties without your consent." },
              { title: "Your Rights", content: null, list: ["Access your personal data", "Request correction or deletion of your data", "Withdraw consent at any time", "File a complaint with a supervisory authority"], pre: "You have the right to:" },
            ].map(({ title, content, list, pre }) => (
              <div key={title}>
                <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>{title}</h2>
                {pre && <p className="mb-4">{pre}</p>}
                {content && <p>{content}</p>}
                {list && <ul className="list-disc list-inside space-y-2 ml-4">{list.map(i => <li key={i}>{i}</li>)}</ul>}
              </div>
            ))}
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Contact Us</h2>
              <p>If you have any questions about this privacy policy, please contact us at{" "}
                <a href="mailto:afronated@gmail.com" className="text-[#ef4444] hover:text-[#ef4444]/80 transition-colors">afronated@gmail.com</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
