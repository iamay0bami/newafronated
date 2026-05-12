import { motion } from "motion/react";
import { useT } from "../context/ThemeContext";
import { useSEO } from "../hooks/useSEO";

export function Privacy() {
  const T = useT();

  return (
    <section className={`min-h-screen pt-32 pb-20 px-4 md:px-8 transition-colors duration-300 ${T.bg}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1
            className={`text-5xl md:text-7xl font-black tracking-tighter mb-8 ${T.text}`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            PRIVACY POLICY
          </h1>
          <p className={`mb-12 ${T.textFaint}`}>Last updated: May 2026</p>

          <div className={`space-y-10 leading-relaxed ${T.textMuted}`}>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Introduction</h2>
              <p>
                Afro-Nated ("we", "us", or "our") is committed to protecting the privacy of everyone who visits or interacts with our website at{" "}
                <a href="https://afronated.com" className="text-[#ef4444] hover:text-[#ef4444]/80 transition-colors">afronated.com</a>.
                This policy explains what information we collect, how we use it, and what your rights are in relation to it.
                By using this website you agree to the practices described below.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Information We Collect</h2>
              <p className="mb-4">
                We only collect personal information that you choose to provide to us, through the following channels on this website:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>
                  <strong>Put Me On (submission form)</strong> — your name, email address, social handle, and the details of your creative work or inquiry.
                </li>
                <li>
                  <strong>Partner form</strong> — your name, email address, organisation or brand name, the type of partnership you are interested in, and your message.
                </li>
                <li>
                  <strong>Careers enquiries</strong> — if you apply for or enquire about a role via email, we collect the information you include in that correspondence.
                </li>
              </ul>
              <p>
                We do not use cookies for tracking, we do not run advertising on this website, and we do not automatically collect personal data such as your IP address, device identifiers, or browsing behaviour through any proprietary system.
                Third-party services embedded in the site (such as YouTube, TikTok, and Instagram) may collect data in accordance with their own privacy policies when you interact with their content.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>How We Use Your Information</h2>
              <p className="mb-4">Information you submit through our forms is used exclusively to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Respond to your submission, inquiry, or application</li>
                <li>Evaluate creative work or partnership proposals</li>
                <li>Communicate follow-up details relevant to your enquiry</li>
              </ul>
              <p className="mt-4">
                We do not use your personal information for marketing purposes without your explicit consent, and we do not share, sell, or transfer it to any third party outside of the service providers necessary to operate our email systems (currently EmailJS).
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Third-Party Services</h2>
              <p className="mb-4">
                Our website integrates content and services from the following third-party platforms. Their own privacy policies apply when you interact with their embedded content:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>YouTube (Google LLC) — embedded video content and channel data via the YouTube Data API</li>
                <li>TikTok — video thumbnails fetched via TikTok's oEmbed API</li>
                <li>Instagram / Behold.so — Instagram feed displayed via the Behold widget service</li>
                <li>Medium (via RSS2JSON) — blog posts fetched from our public Medium publication</li>
                <li>EmailJS — used to transmit form submissions to our team inbox; your data passes through EmailJS's servers</li>
              </ul>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Data Retention</h2>
              <p>
                Information submitted via our contact forms is retained only for as long as is necessary to fulfil the purpose for which it was submitted — typically the duration of the relevant conversation or review process.
                If you would like us to delete any information we hold about you, please contact us and we will action your request promptly.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Request access to the personal information we hold about you</li>
                <li>Request that we correct any inaccurate information</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw any consent you have given at any time</li>
                <li>Lodge a complaint with a data protection authority if you believe your rights have been violated</li>
              </ul>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Children's Privacy</h2>
              <p>
                This website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has submitted information to us, please contact us and we will remove it.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. The date at the top of this page will always reflect the most recent revision.
                Continued use of the website after any update constitutes your acceptance of the revised policy.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or how we handle your data, please reach out at{" "}
                <a href="mailto:afronated@gmail.com" className="text-[#ef4444] hover:text-[#ef4444]/80 transition-colors">
                  afronated@gmail.com
                </a>.
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}