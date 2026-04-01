import { motion } from "motion/react";
import { Youtube, Instagram } from "lucide-react";
import { FaTiktok, FaMedium } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { AfronatedLogo } from "./AfronatedLogo";
import { useT } from "../context/ThemeContext";

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  );
}

export function Footer() {
  const T = useT();
  const navigate = useNavigate();

  /** One-click section nav from any page */
  const goTo = (id: string) => {
    const onHome = window.location.pathname === "/";
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 120);
    }
  };

  const quickLinks: Array<{ label: string; href?: string; action?: () => void }> = [
    { label: "About",   action: () => goTo("mission")    },
    { label: "Watch",   action: () => goTo("interviews") },
    { label: "Submit",  href: "/submit"                  },
    { label: "Team",    action: () => goTo("team")       },
    { label: "Partner", href: "/partner"                 },
  ];

  const socialLinks = [
    { href: "https://www.youtube.com/@Afronated",   icon: <Youtube className="w-5 h-5"/>,   label: "YouTube"   },
    { href: "https://www.tiktok.com/@afronated",    icon: <FaTiktok className="w-5 h-5"/>,   label: "TikTok"    },
    { href: "https://medium.com/@afro-nated",       icon: <FaMedium className="w-5 h-5"/>,   label: "Medium"    },
    { href: "https://www.instagram.com/afro.nated", icon: <Instagram className="w-5 h-5"/>,  label: "Instagram" },
    { href: "https://x.com/AfroNated",              icon: <XIcon className="w-5 h-5"/>,       label: "X"         },
  ];

  return (
    <footer className={`relative py-20 md:py-32 px-4 md:px-8 overflow-hidden transition-colors duration-300 ${T.bg}`}>
      {/* Ghosted background wordmark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 0.03, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.5 }}
          className={`text-[12vw] md:text-[15vw] lg:text-[18vw] font-black tracking-tighter whitespace-nowrap ${T.text}`}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          AFRONATED
        </motion.h2>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">

          {/* Brand blurb */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <AfronatedLogo className="h-12 w-auto mb-4" style={{ maxWidth: 160 }}/>
            <p className={`leading-relaxed ${T.textMuted}`}>
              A creative media collective amplifying African voices through powerful storytelling and innovative content.
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h3 className={`text-xl font-bold mb-4 ${T.text}`}>QUICK LINKS</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href, action }) => (
                <li key={label}>
                  {href
                    ? <Link to={href} className={`transition-colors hover:text-[#ef4444] ${T.textMuted}`}>{label}</Link>
                    : <button onClick={action} className={`transition-colors hover:text-[#ef4444] ${T.textMuted}`}>{label}</button>
                  }
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social icons */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h3 className={`text-xl font-bold mb-4 ${T.text}`}>CONNECT</h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(({ href, icon, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className={`w-12 h-12 rounded-full border flex items-center justify-center hover:bg-[#ef4444] hover:border-[#ef4444] hover:text-white transition-all duration-300 ${T.isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-black/5 border-black/10 text-black/50"}`}>
                  {icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className={`w-full h-px mb-8 ${T.isDark ? "bg-white/10" : "bg-black/10"}`}/>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className={`flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${T.textFaint}`}>
          <p>© 2026 Afronated. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#ef4444] transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-[#ef4444] transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#ef4444]/30 to-transparent"/>
    </footer>
  );
}
