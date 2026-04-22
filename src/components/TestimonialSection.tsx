import { motion } from "framer-motion";

const TestimonialSection = () => (
  <section className="relative py-28 md:py-40 bg-[#0A0A0A] text-white overflow-hidden">
    {/* Soft pulsing gradient glow */}
    <div
      aria-hidden
      className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-3xl glow-pulse"
      style={{ backgroundImage: "var(--gradient-primary)" }}
    />
    <div
      aria-hidden
      className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 glow-pulse"
      style={{ backgroundImage: "var(--gradient-primary)", animationDelay: "3s" }}
    />

    <div className="relative container mx-auto px-6 lg:px-12 text-center max-w-4xl">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-xs tracking-[0.4em] uppercase text-primary mb-8"
      >
        The math
      </motion.p>
      <motion.blockquote
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="font-serif-display italic text-3xl md:text-5xl leading-[1.15] text-white"
      >
        “One CBN fine starts at <span className="text-gradient not-italic font-semibold">₦2,000,000</span>.
        RegCo costs a fraction of that per month. We pay for ourselves the first time we prevent a penalty.”
      </motion.blockquote>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
        className="mt-10 text-sm tracking-[0.3em] uppercase text-white/60"
      >
        RegCo — Built for Nigerian Compliance Officers
      </motion.p>
    </div>
  </section>
);

export default TestimonialSection;
