import { motion } from "motion/react";
import { useT } from "../context/ThemeContext";

export function Terms() {
  const T = useT();

  return (
    <section className={`min-h-screen pt-32 pb-20 px-4 md:px-8 transition-colors duration-300 ${T.bg}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1
            className={`text-5xl md:text-7xl font-black tracking-tighter mb-8 ${T.text}`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            TERMS OF SERVICE
          </h1>
          <p className={`mb-12 ${T.textFaint}`}>Last updated: May 2026</p>

          <div className={`space-y-10 leading-relaxed ${T.textMuted}`}>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Acceptance of Terms</h2>
              <p>
                By accessing or using the Afro-Nated website at{" "}
                <a href="https://afronated.com" className="text-[#ef4444] hover:text-[#ef4444]/80 transition-colors">
                  afronated.com
                </a>{" "}
                (the "Site"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the Site.
                These terms apply to all visitors, users, and anyone who submits information through the Site.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>About the Site</h2>
              <p>
                Afro-Nated is a creative media collective. This website serves as our public-facing platform, showcasing our video content, editorial work, team, and social presence.
                It also provides forms through which visitors can submit creative work, request features or spotlights, and enquire about partnerships or collaboration opportunities.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Use of the Site</h2>
              <p className="mb-4">You agree to use this Site only for lawful purposes and in a way that does not infringe on the rights of others. Specifically, you agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Submit false, misleading, or fraudulent information through any of our forms</li>
                <li>Use the Site to harass, threaten, or abuse any individual or group</li>
                <li>Attempt to interfere with, disrupt, or gain unauthorised access to the Site or its underlying systems</li>
                <li>Reproduce, republish, or distribute our content without written permission</li>
                <li>Use automated tools to scrape or harvest data from the Site</li>
              </ul>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Form Submissions</h2>
              <p>
                When you submit information through our "Put Me On" or "Partner" forms, you confirm that the information you have provided is accurate and that you have the right to share it.
                Submitting work does not guarantee a response, feature, or collaboration — all submissions are reviewed at the discretion of the Afro-Nated team.
              </p>
              <p className="mt-4">
                By submitting creative work, links, or descriptions of your projects, you grant Afro-Nated a non-exclusive, royalty-free licence to review that content and reference it internally for the purpose of evaluating your submission.
                We will not publish, redistribute, or commercially exploit your submitted content without your explicit consent.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Careers and Contributor Roles</h2>
              <p>
                Roles listed on the Careers page of this Site reflect current opportunities within the Afro-Nated collective.
                Applying for or expressing interest in a role does not create a contract of employment or any other binding legal obligation between you and Afro-Nated.
                All applications are reviewed at our discretion and we are not obligated to respond to every enquiry.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Intellectual Property</h2>
              <p>
                All original content on this Site — including but not limited to video productions, written articles, photography, brand assets, and the Site design itself — is the property of Afro-Nated or of the respective content creators who have licensed it to us.
                Nothing on this Site grants you a licence to use, reproduce, or distribute our intellectual property without our written permission.
              </p>
              <p className="mt-4">
                Third-party content embedded on this Site (including YouTube videos, TikTok clips, and Instagram posts) remains the property of the respective creators and platforms and is subject to their own terms.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Third-Party Links and Services</h2>
              <p>
                This Site links to and embeds content from third-party platforms including YouTube, TikTok, Instagram, and Medium. We are not responsible for the content, privacy practices, or terms of service of any third-party platform.
                Your use of those platforms is governed by their own terms and policies.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Disclaimer of Warranties</h2>
              <p>
                This Site is provided on an "as is" and "as available" basis. We make no warranties — express or implied — regarding the accuracy, reliability, or availability of any content on this Site.
                We do not guarantee that the Site will be uninterrupted or free from errors.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, Afro-Nated shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use this Site or any content on it.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Changes to These Terms</h2>
              <p>
                We reserve the right to update these Terms of Service at any time. The date at the top of this page reflects the most recent revision.
                Continued use of the Site after any changes constitutes your acceptance of the updated terms.
                We encourage you to review this page periodically.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Governing Law</h2>
              <p>
                These terms are governed by and construed in accordance with applicable law. Any disputes arising in connection with these terms or your use of the Site shall be subject to the jurisdiction of the courts relevant to Afro-Nated's place of operation.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${T.text}`}>Contact</h2>
              <p>
                For any questions about these Terms of Service, please contact us at{" "}
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