import { motion } from "motion/react";
import { useT } from "../context/ThemeContext";

export function Terms() {
  const T = useT();

  return (
    <section className={`min-h-screen pt-32 pb-20 px-4 md:px-8 transition-colors duration-300 ${T.bg}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mb-8 ${T.text}`} style={{ fontFamily: "Montserrat, sans-serif" }}>
            TERMS OF SERVICE
          </h1>
          <p className={`mb-12 ${T.textFaint}`}>Last updated: March 31, 2026</p>

          <div className={`space-y-8 leading-relaxed ${T.textMuted}`}>
            {[
              { title: "Acceptance of Terms", content: "By accessing and using Afronated's website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services." },
              { title: "Use of Services", content: null, pre: "Our services are provided for creative and community purposes. You agree to:", list: ["Use our services lawfully and responsibly", "Not submit false or misleading information", "Respect intellectual property rights", "Not engage in harmful or abusive behavior"] },
              { title: "Intellectual Property", content: "All content on the Afronated website, including videos, images, text, and logos, is owned by Afronated or our content creators. Unauthorized use of our content is prohibited." },
              { title: "User Submissions", content: "When you submit content or information to us, you grant Afronated a non-exclusive license to use, reproduce, and display that content for the purposes of reviewing submissions and potential feature opportunities." },
              { title: "Limitation of Liability", content: 'Afronated is not liable for any indirect, incidental, or consequential damages arising from your use of our services. We provide services "as is" without warranties of any kind.' },
              { title: "Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use of our services after changes indicates acceptance of the updated terms." },
            ].map(({ title, content, list, pre }) => (
              <div key={title}>
                <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>{title}</h2>
                {pre && <p className="mb-4">{pre}</p>}
                {content && <p>{content}</p>}
                {list && <ul className="list-disc list-inside space-y-2 ml-4">{list.map(i => <li key={i}>{i}</li>)}</ul>}
              </div>
            ))}
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Contact</h2>
              <p>For questions about these terms, please contact us at{" "}
                <a href="mailto:afronated@gmail.com" className="text-[#ef4444] hover:text-[#ef4444]/80 transition-colors">afronated@gmail.com</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
