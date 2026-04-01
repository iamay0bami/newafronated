import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress]   = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }} className="mb-8"
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
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
