/**
 * NewsletterSignup
 * ─────────────────────────────────────────────────────────────────────────────
 * Captures an email address and adds the subscriber to a MailerLite group.
 * MailerLite then automatically sends a branded email whenever a new article
 * is published on the Afro-Nated Medium channel via RSS automation.
 *
 * SETUP (one-time, takes ~10 minutes):
 * ─────────────────────────────────────
 * 1. Create a free account at https://www.mailerlite.com
 *    (free tier covers up to 1,000 subscribers and includes RSS campaigns)
 *
 * 2. In MailerLite: Subscribers → Groups → Create group → name it e.g. "Blog Subscribers"
 *    Note the Group ID (visible in the URL when you open the group)
 *
 * 3. In MailerLite: Integrations → API → Generate a new API token
 *
 * 4. Add to Vercel Environment Variables:
 *      VITE_MAILERLITE_API_KEY   → your API token
 *      VITE_MAILERLITE_GROUP_ID  → your group ID (numeric string)
 *
 * 5. In MailerLite: Campaigns → Create campaign → RSS campaign
 *    RSS feed URL: https://medium.com/feed/@afro-nated
 *    Select your "Blog Subscribers" group
 *    Design the email template (MailerLite has good defaults)
 *    Set send frequency to "As new items appear"
 *
 * That's it. Every new Medium article will trigger a branded email to
 * everyone who signs up through this form.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { useT } from "../context/ThemeContext";

const MAILERLITE_API_KEY  = import.meta.env.VITE_MAILERLITE_API_KEY  as string | undefined;
const MAILERLITE_GROUP_ID = import.meta.env.VITE_MAILERLITE_GROUP_ID as string | undefined;

async function subscribeEmail(email: string): Promise<void> {
  if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
    throw new Error("MailerLite environment variables are not configured.");
  }

  // MailerLite v2 API — add subscriber and assign to group in one call
  const res = await fetch(
    `https://connect.mailerlite.com/api/subscribers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MAILERLITE_API_KEY}`,
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email,
        groups: [MAILERLITE_GROUP_ID],
        status: "active",
      }),
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // 409 = already subscribed — treat as success so the user isn't confused
    if (res.status === 409) return;
    throw new Error(body?.message ?? `Subscribe failed: ${res.status}`);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface NewsletterSignupProps {
  /** Layout variant — "inline" for homepage sections, "footer" for the footer */
  variant?: "inline" | "footer";
}

export function NewsletterSignup({ variant = "inline" }: NewsletterSignupProps) {
  const T = useT();
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      await subscribeEmail(email.trim().toLowerCase());
      setEmail("");
      setStatus("success");
    } catch (err) {
      console.error("[NewsletterSignup]", err);
      setErrorMsg("Something went wrong. Try again or follow us on Medium directly.");
      setStatus("error");
    }
  };

  // ── Footer variant — compact horizontal layout ────────────────────────────
  if (variant === "footer") {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-3">
          <Mail className={`w-3.5 h-3.5 text-[#ef4444]`} />
          <h3 className={`text-sm font-bold tracking-wide uppercase ${T.text}`}>
            New articles, straight to you
          </h3>
        </div>
        <p className={`text-xs leading-relaxed mb-4 ${T.textFaint}`}>
          Get notified whenever we publish on Medium.
        </p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[#ef4444] text-xs font-bold tracking-wide"
            >
              ✓ You're in. Watch your inbox.
            </motion.p>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                inputMode="email"
                disabled={status === "sending"}
                className={`
                  flex-1 min-w-0 px-3 py-2.5 text-xs rounded-lg border
                  bg-transparent focus:outline-none focus:border-[#ef4444]
                  transition-colors duration-200 disabled:opacity-50
                  ${T.isDark
                    ? "border-white/15 text-white placeholder:text-white/25"
                    : "border-black/15 text-black placeholder:text-black/30"
                  }
                `}
              />
              <button
                type="submit"
                disabled={status === "sending"}
                aria-label="Subscribe"
                className="flex-shrink-0 w-9 h-9 bg-[#ef4444] hover:bg-white text-white hover:text-black rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {status === "error" && (
          <p className={`mt-2 text-[10px] leading-snug ${T.textFaint}`}>{errorMsg}</p>
        )}
      </div>
    );
  }

  // ── Inline variant — full-width section block ─────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={`
        relative mt-20 rounded-2xl overflow-hidden
        border p-8 md:p-12
        ${T.isDark
          ? "bg-[#0a0a0a] border-white/8"
          : "bg-[#f5f5f5] border-black/8"
        }
      `}
    >
      {/* Red accent glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: T.isDark ? 0.08 : 0.05,
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="relative z-10 max-w-xl">
        {/* Label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-5 h-px bg-[#ef4444]" />
          <span className={`text-[10px] font-bold tracking-[0.25em] uppercase ${T.textFaint}`}>
            Stay in the loop
          </span>
        </div>

        <h2
          className={`text-2xl md:text-3xl font-black tracking-tighter mb-3 ${T.text}`}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          NEW ARTICLES,{" "}
          <span className="text-[#ef4444]">STRAIGHT TO YOU.</span>
        </h2>

        <p className={`text-sm md:text-base leading-relaxed mb-8 ${T.textMuted}`}>
          Every time we publish something new on Medium — interviews, essays, cultural
          commentary — it drops in your inbox. No noise. Just the work.
        </p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/40 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2.5} className="w-4 h-4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className={`text-sm font-bold ${T.text}`}>
                You're in. Watch your inbox for the next drop.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${T.textFaint}`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  inputMode="email"
                  disabled={status === "sending"}
                  className={`
                    w-full pl-11 pr-4 py-4 text-sm rounded-xl border
                    bg-transparent focus:outline-none focus:border-[#ef4444]
                    transition-colors duration-200 disabled:opacity-50
                    ${T.isDark
                      ? "border-white/15 text-white placeholder:text-white/30"
                      : "border-black/15 text-black placeholder:text-black/35"
                    }
                  `}
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ef4444] text-white font-bold tracking-wide text-sm hover:bg-white hover:text-black transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Subscribing...
                  </span>
                ) : (
                  <>
                    SUBSCRIBE
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-3 text-xs leading-relaxed ${T.textFaint}`}
          >
            {errorMsg}
          </motion.p>
        )}

        <p className={`mt-4 text-[10px] tracking-wide ${T.textFaint}`}>
          No spam. Unsubscribe any time. Powered by Medium RSS + MailerLite.
        </p>
      </div>
    </motion.div>
  );
}