import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const springScaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const scaleX = prefersReducedMotion ? scrollYProgress : springScaleX;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[#ef4444] origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}
