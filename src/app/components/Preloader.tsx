import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

// ─── Session flag ─────────────────────────────────────────────────────────────
// We use sessionStorage so the preloader shows once per browser session
// (i.e. once per tab open), but reappears when the user opens a fresh tab
// or closes and reopens the browser. This is the right balance between
// brand presence and not annoying repeat visitors within the same session.
const SESSION_KEY = "afronated:preloader-shown";

function hasSeenPreloader(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markPreloaderSeen(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // ignore — if storage is unavailable just always show it
  }
}

export function Preloader() {
  // If already seen this session, start in the hidden state immediately
  // so there is zero flash of the preloader on subsequent navigations.
  const [isLoading, setIsLoading] = useState(() => !hasSeenPreloader());
  const [progress, setProgress]   = useState(0);

  useEffect(() => {
    // Already seen — nothing to do
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Mark as seen, then start the exit animation
          markPreloaderSeen();
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              {/*
                Preloader always sits on a black background,
                so we always invert the logo to white.
              */}
              <img
                src="/logo-preloader.png"
                alt="Afronated"
                className="h-16 md:h-20 w-auto mx-auto"
                style={{ filter: "invert(1)", mixBlendMode: "screen" }}
                draggable={false}
              />
            </motion.div>

            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#ef4444]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-white/40 text-sm tracking-wider"
            >
              LOADING EXPERIENCE...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}