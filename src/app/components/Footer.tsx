import { motion, useReducedMotion } from "motion/react";
import { Youtube, Instagram } from "lucide-react";
import { FaTiktok, FaMedium } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { AfronatedLogo } from "./AfronatedLogo";
import { useT } from "../context/ThemeContext";
import { NewsletterSignup } from "./NewsletterSignup";

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export function Footer() {
  const T = useT();
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const pendingScrollRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingScrollRef.current) return;
    const id = pendingScrollRef.current;
    pendingScrollRef.current = null;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });
  }, [location.pathname, prefersReducedMotion]);

  const goTo = (id: string) => {
    const onHome = window.location.pathname === "/";
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    } else {
      pendingScrollRef.current = id;
      navigate("/");
    }
  };

  // ── Fixed: "About" was previously missing from this list ──
  const quickLinks: Array<{ label: string; href?: string; action?: () => void }> = [
    { label: "About",   href: "/about"                   },
    { label: "Watch",   action: () => goTo("interviews") },
    { label: "Team",    href: "/team"                    },
    { label: "Submit",  href: "/submit"                  },
    { label: "Partner", href: "/partner"                 },
    { label: "Careers", href: "/careers"                 },
  ];

  const socialLinks = [
    { href: "https://www.youtube.com/@Afronated",   icon: <Youtube className="w-5 h-5" />,   label: "YouTube"   },
    { href: "https://www.tiktok.com/@afronated",    icon: <FaTiktok className="w-5 h-5" />,   label: "TikTok"    },
    { href: "https://medium.com/@afro-nated",       icon: <FaMedium className="w-5 h-5" />,   label: "Medium"    },
    { href: "https://www.instagram.com/afro.nated", icon: <Instagram className="w-5 h-5" />,  label: "Instagram" },
    { href: "https://x.com/AfroNated",              icon: <XIcon className="w-5 h-5" />,       label: "X"         },
  ];

  const footerBg  = T.isDark ? "bg-[#0d0d0d]"  : "bg-white";
  const topBorder = T.isDark ? "border-t border-white/[0.07]" : "border-t border-black/[0.08]";

  return (
    <footer
      className={`relative py-20 md:py-32 px-4 md:px-8 overflow-hidden transition-colors duration-300 ${footerBg} ${topBorder}`}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/*
          Four-column grid:
          1. Brand blurb
          2. Quick links
          3. Connect (social icons)
          4. Newsletter signup (new)

          On mobile: single column stack
          On md: 2 × 2 grid
          On lg: 4 columns
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand blurb */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AfronatedLogo className="h-12 w-auto mb-4" style={{ maxWidth: 160 }} />
            <p className={`leading-relaxed text-sm ${T.textMuted}`}>
              A creative media collective amplifying African voices through
              powerful storytelling and innovative content.
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className={`text-xl font-bold mb-4 ${T.text}`}>QUICK LINKS</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href, action }) => (
                <li key={label}>
                  {href ? (
                    <Link
                      to={href}
                      aria-current={location.pathname === href ? "page" : undefined}
                      className={`text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] ${location.pathname === href ? "text-[#ef4444]" : T.textMuted} hover:text-[#ef4444]`}
                    >
                      {label}
                    </Link>
                  ) : (
                    <button
                      onClick={action}
                      className={`text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] hover:text-[#ef4444] ${T.textMuted}`}
                    >
                      {label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className={`text-xl font-bold mb-4 ${T.text}`}>CONNECT</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-11 h-11 rounded-md border flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] hover:bg-[#ef4444] hover:border-[#ef4444] hover:text-white transition-colors duration-300 ${
                    T.isDark
                      ? "bg-white/5 border-white/10 text-white/60"
                      : "bg-black/5 border-black/10 text-black/50"
                  }`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <NewsletterSignup variant="footer" />
          </motion.div>
        </div>

        {/* Divider */}
        <div className={`w-full h-px mb-8 ${T.isDark ? "bg-white/10" : "bg-black/10"}`} />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${T.textMuted}`}
        >
          <p>© 2026 Afro-Nated. All rights reserved.</p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link to="/careers" aria-current={location.pathname === "/careers" ? "page" : undefined} className={`hover:text-[#ef4444] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] ${location.pathname === "/careers" ? "text-[#ef4444]" : ""}`}>
              Careers
            </Link>
            <Link to="/privacy" aria-current={location.pathname === "/privacy" ? "page" : undefined} className={`hover:text-[#ef4444] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] ${location.pathname === "/privacy" ? "text-[#ef4444]" : ""}`}>
              Privacy Policy
            </Link>
            <Link to="/terms" aria-current={location.pathname === "/terms" ? "page" : undefined} className={`hover:text-[#ef4444] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] ${location.pathname === "/terms" ? "text-[#ef4444]" : ""}`}>
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>

    </footer>
  );
}
