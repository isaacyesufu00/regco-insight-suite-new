import { motion } from "framer-motion";
import { ShieldCheck, Cloud, ScrollText, Database, Scale } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "End-to-End Encryption", desc: "Every byte encrypted in transit and at rest." },
  { icon: Cloud, title: "Secure Cloud Infrastructure", desc: "Hosted on enterprise-grade, SOC 2 compliant infrastructure." },
  { icon: ScrollText, title: "Full Audit Logs", desc: "Tamper-proof logs for every action in your account." },
  { icon: Database, title: "Data Isolation Per Client", desc: "Strict tenant isolation ensures complete data privacy." },
  { icon: Scale, title: "NDPR-Aligned Data Handling", desc: "Compliant with Nigerian Data Protection Regulation standards." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
};

const SecuritySection = () => (
  <section id="security" className="py-20 md:py-28 hero-gradient">
    <div className="container mx-auto px-4 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        custom={0}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
          Enterprise-Grade Security
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Your data is our highest priority. RegCo is built with bank-grade security at every layer.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            custom={i + 1}
            className="card-elevated rounded-xl p-6 border border-border/50"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SecuritySection;
