import { useT } from "../context/ThemeContext";

/**
 * AfronatedLogo
 *
 * Uses the original brand PNG exactly as designed — warped letterforms intact.
 *
 * The PNG has a WHITE background with BLACK lettering.
 *
 * We strip the white background using:
 *   mix-blend-mode: multiply   → on light (white) page backgrounds
 *   filter: invert(1) + mix-blend-mode: screen  → on dark (black) page backgrounds
 *
 * This preserves the exact original warped typography without any redrawing.
 */

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export function AfronatedLogo({ className = "", style }: LogoProps) {
  const { isDark } = useT();

  /*
   * Dark mode:
   *   invert(1) flips black→white (so letters become white)
   *   mix-blend-mode: screen makes the now-white background invisible against black bg
   *
   * Light mode:
   *   mix-blend-mode: multiply makes white→transparent, black letters stay black
   *   No invert needed — the original PNG is already black on white
   */
  const imgStyle: React.CSSProperties = isDark
    ? { filter: "invert(1)", mixBlendMode: "screen", ...style }
    : { mixBlendMode: "multiply",                    ...style };

  return (
    <img
      src="/logo.png"
      alt="Afronated"
      className={className}
      style={imgStyle}
      draggable={false}
    />
  );
}
