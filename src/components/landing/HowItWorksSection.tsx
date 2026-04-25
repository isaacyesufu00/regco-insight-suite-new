import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Upload your raw CBS export",
    desc: "Drop the trial balance or general ledger straight from Flexcube, Finacle, or any core banking system. No manual extraction.",
  },
  {
    n: "02",
    title: "Automatic mapping & validation",
    desc: "RegCo parses every sheet, maps account codes, reconciles totals, and calculates CAR, liquidity ratio, and NPL automatically.",
  },
  {
    n: "03",
    title: "Download submission-ready report",
    desc: "Get a fully formatted CBN, NFIU, or SCUML report in PDF, Excel, or Word — ready to file in under five minutes.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-surface-black py-24 md:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white text-center tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          How RegCo Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 text-center text-white/55 text-base md:text-lg max-w-xl mx-auto"
        >
          Three steps from raw data to a regulator-ready submission.
        </motion.p>

        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="bg-surface-night border border-dark-soft rounded-[20px] p-9 lift-on-hover"
            >
              <div
                className="text-[80px] font-black leading-none text-brand-gradient"
                style={{ letterSpacing: "-0.04em" }}
              >
                {s.n}
              </div>
              <h3 className="mt-6 text-2xl font-bold text-white">{s.title}</h3>
              <p className="mt-3 text-[15px] text-white/55 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
