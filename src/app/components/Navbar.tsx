import { motion } from "motion/react";
import { Youtube, Instagram, Menu, X } from "lucide-react";
import { FaTiktok, FaMedium } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { AfronatedLogo } from "./AfronatedLogo";
import { useT } from "../context/ThemeContext";

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const T = useT();

  const isHome = location.pathname === "/";

  const goToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  };

  const closeMobile = () => setIsMobileMenuOpen(false);

  const navLinks = isHome ? [
    { label: "ABOUT", action: () => goToSection("mission") },
    { label: "WATCH", action: () => goToSection("interviews") },
    { label: "TEAM",  action: () => goToSection("team") },
  ] : [
    { label: "HOME",  action: () => { navigate("/"); closeMobile(); } },
    { label: "ABOUT", action: () => goToSection("mission") },
    { label: "WATCH", action: () => goToSection("interviews") },
    { label: "TEAM",  action: () => goToSection("team") },
  ];

  const socialLinks = [
    { href: "https://www.youtube.com/@Afronated",   icon: <Youtube className="w-4 h-4"/>,   label: "YouTube"   },
    { href: "https://www.instagram.com/afro.nated", icon: <Instagram className="w-4 h-4"/>, label: "Instagram" },
    { href: "https://x.com/AfroNated",              icon: <XIcon className="w-4 h-4"/>,      label: "X"         },
    { href: "https://medium.com/@afro-nated",       icon: <FaMedium className="w-4 h-4"/>,  label: "Medium"    },
    { href: "https://www.tiktok.com/@afronated",    icon: <FaTiktok className="w-4 h-4"/>,  label: "TikTok"    },
  ];

  // ─── FIX: Use `lg` breakpoint (1024px) for the desktop nav instead of `md`
  // (768px). At iPad Mini (768px) and iPad Air (820px) the nav links + social
  // icons + theme toggle all had to cram into the pill — switching to lg gives
  // those tablet sizes a clean hamburger menu instead of an overflowing row.
  const linkCls = `text-sm font-medium transition-colors tracking-wide ${T.textMuted} hover:text-[#ef4444]`;
  const mobileLinkCls = `w-full text-left px-4 py-3 rounded-lg transition-all font-medium tracking-wide ${T.textMuted} hover:text-[#ef4444]`;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 md:px-8"
      >
        <div className={`flex items-center justify-between w-full max-w-6xl px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-full backdrop-blur-xl border shadow-2xl transition-colors duration-300 ${T.bgNav}`}>

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={() => {
              closeMobile();
              if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
            aria-label="Go to home"
          >
            <AfronatedLogo className="h-7 md:h-8 lg:h-10 w-auto" style={{ maxWidth: 120 }} />
          </Link>

          {/* ── Desktop nav links — visible only at lg+ (≥1024px) ── */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(({ label, action }) => (
              <button key={label} onClick={action} className={linkCls}>{label}</button>
            ))}
            <Link to="/submit"  onClick={closeMobile} className={linkCls}>SUBMIT</Link>
            <Link to="/partner" onClick={closeMobile} className={linkCls}>PARTNER</Link>
          </div>

          {/* ── Right cluster: social icons + theme toggle + hamburger ── */}
          <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3">

            {/* Social icons — hidden on mobile, visible from md+ but only 3 icons
                to avoid overflow on iPad Mini; all 5 shown at lg+ */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              {/* Show only YouTube, Instagram, X on md tablets to save space */}
              {socialLinks.slice(0, 3).map(({ href, icon, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className={`transition-colors hover:text-[#ef4444] ${T.iconColor}`}>{icon}</a>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              {socialLinks.map(({ href, icon, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className={`transition-colors hover:text-[#ef4444] ${T.iconColor}`}>{icon}</a>
              ))}
            </div>

            {/* Theme toggle */}
            <button onClick={T.toggleTheme} aria-label="Toggle theme"
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all border ${T.border} ${T.iconColor} hover:text-[#ef4444]`}>
              {T.isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Hamburger — shown below lg (covers mobile + iPad Mini/Air) */}
            <button onClick={() => setIsMobileMenuOpen(o => !o)} aria-label="Toggle menu"
              className={`lg:hidden transition-colors ${T.textMuted}`}>
              {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile / tablet slide-down menu (shown below lg) ── */}
      <motion.div
        initial={false}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20, pointerEvents: isMobileMenuOpen ? "auto" : "none" }}
        transition={{ duration: 0.3 }}
        className="fixed top-24 left-0 right-0 z-40 lg:hidden px-4"
      >
        <div className={`backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300 ${T.isDark ? "bg-black/95" : "bg-white/98"} ${T.border}`}>
          <div className="p-6 space-y-2">
            {navLinks.map(({ label, action }) => (
              <button key={label} onClick={() => { action(); closeMobile(); }} className={`block ${mobileLinkCls}`}>{label}</button>
            ))}
            <Link to="/submit"  onClick={closeMobile} className={`block ${mobileLinkCls}`}>SUBMIT</Link>
            <Link to="/partner" onClick={closeMobile} className={`block ${mobileLinkCls}`}>PARTNER</Link>
          </div>

          <div className={`h-px ${T.isDark ? "bg-white/10" : "bg-black/10"}`}/>

          <div className="p-6">
            <p className={`text-xs uppercase tracking-wider mb-4 ${T.textFaint}`}>Connect With Us</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ href, icon, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                   className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all hover:text-[#ef4444] hover:border-[#ef4444] ${T.isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-black/5 border-black/10 text-black/50"}`}>
                  {icon}<span className="text-sm">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {isMobileMenuOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeMobile}/>
      )}
    </>
  );
}