import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useT } from "../context/ThemeContext";
import { MediumFeed } from "./MediumFeed";
import { InstagramMosaic } from "./InstagramMosaic";
import { NewsletterSignup } from "./NewsletterSignup";

export function Mission() {
  const T = useT();

  return (
    <section
      id="mission"
      className={`relative py-24 md:py-32 lg:py-40 overflow-hidden transition-colors duration-300 ${T.bg}`}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: T.isDark
              ? `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`
              : `linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Punchline block */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          {/* Label */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-[3px] bg-[#ef4444]" />
            <span className={`text-[10px] font-bold tracking-[0.25em] uppercase ${T.textFaint}`}>
              Who We Are
            </span>
          </div>

          <h2
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] mb-10 ${T.text}`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Africa's story,{" "}
            <span className="text-[#ef4444]">told right.</span>
          </h2>

          <p className={`text-lg md:text-xl max-w-2xl leading-relaxed mb-10 ${T.textMuted}`}>
            We amplify African creatives — their sound, vision, and story — through
            interviews, short-form content, and editorial work that doesn't compromise.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-6">
            <motion.div whileHover={{ x: 5 }}>
              <Link
                to="/about"
                className={`group inline-flex items-center gap-3 font-bold tracking-wide hover:text-[#ef4444] transition-colors duration-300 ${T.text}`}
              >
                <span>OUR FULL STORY</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.a
              href="https://medium.com/@afro-nated"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative inline-flex items-center gap-3 hover:text-[#ef4444] transition-colors duration-300 pt-0 ${T.textMuted}`}
              whileHover={{ x: 5 }}
            >
              <span className="font-medium tracking-wide">READ OUR STORIES</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </motion.div>

        {/* Medium article feed */}
        <MediumFeed />

        {/* Newsletter signup — sits between the blog feed and Instagram mosaic */}
        <NewsletterSignup variant="inline" />

        {/* Instagram mosaic */}
        <InstagramMosaic />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.05, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#ef4444] blur-3xl"
      />
    </section>
  );
}