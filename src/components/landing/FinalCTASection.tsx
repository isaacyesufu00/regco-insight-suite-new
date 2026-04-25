import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FinalCTASection = () => {
  return (
    <section className="bg-surface-black py-28 md:py-36 relative overflow-hidden">
      {/* Pulsing radial glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none animate-brand-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(255,98,0,0.18) 0%, transparent 65%)",
        }}
      />
      <div className="relative container mx-auto px-4 lg:px-8 text-center max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Stop filing CBN returns manually.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-5 text-base md:text-lg text-white/55 max-w-xl mx-auto"
        >
          Join the Nigerian financial institutions automating regulatory compliance with RegCo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/book-demo"
            className="px-7 py-3 rounded-full bg-brand-gradient text-white text-sm font-semibold transition-transform ease-apple hover:scale-[1.04]"
          >
            Book a free demo
          </Link>
          <Link
            to="/login"
            className="px-7 py-3 rounded-full text-white text-sm font-semibold border transition-all ease-apple hover:scale-[1.04]"
            style={{
              background: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.15)",
            }}
          >
            Sign in to dashboard
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
