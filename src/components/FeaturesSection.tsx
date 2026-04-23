import { motion } from "framer-motion";
import { RegCoMark } from "@/components/RegCoLogo";

const features = [
  {
    title: "AI Validation Engine",
    desc: "Reconciles balance sheet, loan portfolio, and deposit totals before any return leaves your dashboard.",
  },
  {
    title: "7 Report Types",
    desc: "Covers MFB, Forex, AML/CFT, Prudential, NFIU, SCUML, and Monetary Policy returns out of the box.",
  },
  {
    title: "5-Minute Generation",
    desc: "Average end-to-end report time, from raw upload to download, sits comfortably under five minutes.",
  },
  {
    title: "CBN Formatted Output",
    desc: "Every return follows the latest CBN templates and naming conventions — no formatting work required.",
  },
  {
    title: "Error Detection",
    desc: "Flags missing accounts, broken totals, and unusual ratios before you submit to the regulator.",
  },
  {
    title: "Email Notifications",
    desc: "Compliance lead and team members are alerted the moment a return is ready or a deadline is near.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="platform" className="py-24 md:py-[100px] bg-[#F8F8F8]">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#AAA] mb-4">
            Platform
          </p>
          <h2 className="text-3xl md:text-[40px] font-bold text-foreground leading-tight">
            Built for Compliance Officers
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="group bg-background rounded-xl border border-border p-7 card-lift"
            >
              <RegCoMark size={20} />
              <h3 className="mt-5 text-[17px] font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-[14px] text-[#666] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
