import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useT } from "../context/ThemeContext";

export function Mission() {
  const T = useT();

  return (
    <section id="mission" className={`relative py-24 md:py-32 lg:py-40 px-4 md:px-8 overflow-hidden transition-colors duration-300 ${T.bg}`}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: T.isDark
            ? `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`
            : `linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded text-[#ef4444] text-xs font-bold tracking-widest uppercase">
                Our Mission
              </span>
            </div>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-none mb-6 ${T.text}`}>
              REDEFINING<br />AFRICAN<br />NARRATIVES
            </h2>
            <div className="w-24 h-1 bg-[#ef4444]" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6">
            <p className={`text-lg md:text-xl leading-relaxed ${T.textMuted}`}>
              We are a creative media collective dedicated to showcasing the richness, diversity, and innovation of African culture.
              Through compelling interviews, documentaries, and visual storytelling, we bring authentic voices to the forefront.
            </p>
            <p className={`text-lg md:text-xl leading-relaxed ${T.textMuted}`}>
              Our work challenges stereotypes, celebrates excellence, and creates a platform where African creators, entrepreneurs,
              and visionaries can share their stories with the world.
            </p>
            <motion.a href="https://medium.com/@afro-nated" target="_blank" rel="noopener noreferrer"
              className={`group relative inline-flex items-center gap-3 hover:text-[#ef4444] transition-colors duration-300 pt-4 ${T.text}`}
              whileHover={{ x: 5 }}>
              <span className="font-bold tracking-wide">READ OUR STORIES</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ef4444] group-hover:w-full transition-all duration-300" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 0.05, scale: 1 }}
        viewport={{ once: true }} transition={{ duration: 1.5 }}
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#ef4444] blur-3xl" />
    </section>
  );
}
