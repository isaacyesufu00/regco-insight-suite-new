import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DotHandsCanvas from "./DotHandsCanvas";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full bg-background flex items-center justify-center overflow-hidden">
      {/* Dot-hand canvas */}
      <DotHandsCanvas />

      {/* Centered copy */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="leading-tight"
        >
          <span className="block text-3xl md:text-5xl font-normal text-[#999]">
            Automating Nigerian
          </span>
          <span className="block text-4xl md:text-[54px] font-black text-foreground mt-1 tracking-tight">
            Regulatory Compliance.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="mt-4 text-base text-[#666] max-w-[380px] mx-auto"
        >
          RegCo turns 5 days of manual CBN reporting into 5 minutes of AI-powered accuracy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mt-8 pointer-events-auto"
        >
          <Link to="/book-demo" className="btn-brand text-[15px]">
            Get Started Free
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
