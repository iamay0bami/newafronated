import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeTokens {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => void;
  // Convenience class strings so every component stays DRY
  bg: string;            // page / section background
  bgCard: string;        // card / elevated surface
  bgNav: string;         // navbar pill
  border: string;        // subtle border
  text: string;          // primary text
  textMuted: string;     // secondary text
  textFaint: string;     // footer / meta text
  iconColor: string;     // social icon base colour
}

const ThemeContext = createContext<ThemeTokens>({} as ThemeTokens);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const s = localStorage.getItem("afronated-theme");
      return s === "light" ? "light" : "dark";
    } catch { return "dark"; }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("afronated-theme", theme); } catch {}
  }, [theme]);

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const tokens: ThemeTokens = {
    isDark, theme, toggleTheme,
    bg:         isDark ? "bg-black"             : "bg-white",
    bgCard:     isDark ? "bg-[#111]"            : "bg-[#f5f5f5]",
    bgNav:      isDark ? "bg-black/60 border-white/10" : "bg-white/80 border-black/10",
    border:     isDark ? "border-white/10"      : "border-black/10",
    text:       isDark ? "text-white"           : "text-black",
    textMuted:  isDark ? "text-white/70"        : "text-black/65",
    textFaint:  isDark ? "text-white/40"        : "text-black/35",
    iconColor:  isDark ? "text-white/60"        : "text-black/50",
  };

  return (
    <ThemeContext.Provider value={tokens}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Full token object — use when you need multiple tokens */
export function useTheme() { return useContext(ThemeContext); }
/** Shorthand alias used by components */
export function useT()     { return useContext(ThemeContext); }
