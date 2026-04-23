import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Export CBS Data",
    desc: "Pull a raw trial balance or general ledger export from your core banking system — no preparation needed.",
  },
  {
    n: "02",
    title: "Upload to RegCo",
    desc: "Drop the file in. RegCo parses every sheet, maps account codes, and validates totals automatically.",
  },
  {
    n: "03",
    title: "Download Return",
    desc: "Receive a fully formatted, submission-ready CBN return in PDF, Word, or Excel within minutes.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 md:py-[100px] bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#AAA] mb-4">
            How It Works
          </p>
          <h2 className="text-3xl md:text-[40px] font-bold text-foreground leading-tight">
            From spreadsheet to CBN portal in minutes
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-6 max-w-5xl mx-auto items-start relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="text-center md:text-left relative"
            >
              <div className="text-[72px] font-black leading-none text-brand-gradient">
                {step.n}
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-[14px] text-[#666] leading-relaxed max-w-xs mx-auto md:mx-0">
                {step.desc}
              </p>

              {/* Connector arrow — only between cards on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-8 -right-3 items-center text-[#D0D0D0]">
                  <span className="text-2xl">→</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
