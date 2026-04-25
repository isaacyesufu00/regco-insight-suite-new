import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import worldMap from "@/assets/world-map-dots.png";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Parallax: map moves up slower than content (0.6x scroll)
  const mapY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const mapOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-surface-black"
    >
      {/* Subtle radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(255,98,0,0.08) 0%, transparent 60%)",
        }}
      />

      {/* World map with parallax */}
      <motion.div
        style={{ y: mapY, opacity: mapOpacity }}
        className="absolute left-0 right-0 bottom-0 w-full h-[65vh] pointer-events-none"
      >
        <img
          src={worldMap}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center select-none"
          draggable={false}
        />
        {/* Bottom fade into black */}
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, transparent, hsl(var(--surface-black)))",
          }}
        />
      </motion.div>

      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-32 md:pt-40 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Automating Nigerian
            <br />
            Regulatory Compliance.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-5 text-base md:text-lg text-white/55 max-w-md mx-auto leading-relaxed"
          >
            RegCo turns 5 days of manual CBN reporting into 5 minutes of AI-powered accuracy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/book-demo"
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white border transition-all ease-apple hover:scale-[1.03]"
              style={{
                background: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              Get Started
            </Link>
            <Link
              to="/book-demo"
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white border inline-flex items-center gap-2 transition-all ease-apple hover:scale-[1.03]"
              style={{
                background: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              <span className="w-3 h-3 bg-brand-gradient" aria-hidden="true" />
              Watch a Demo
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
