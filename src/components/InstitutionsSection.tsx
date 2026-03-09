import { motion } from "framer-motion";
import { Building2, Landmark, Rocket, CreditCard, TrendingUp, Briefcase } from "lucide-react";

const institutions = [
  { icon: Landmark, title: "Commercial Banks", desc: "Enterprise-scale compliance for tier-1 banks." },
  { icon: Building2, title: "Microfinance Banks", desc: "Simplified regulatory reporting for MFBs." },
  { icon: Rocket, title: "Fintech Startups", desc: "Move fast and stay compliant." },
  { icon: CreditCard, title: "Payment Service Providers", desc: "PSP-specific filings and monitoring." },
  { icon: TrendingUp, title: "Investment Firms", desc: "SEC and capital market reporting made easy." },
  { icon: Briefcase, title: "Regulatory Consultants", desc: "Manage multiple clients from a single portal." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
};

const InstitutionsSection = () => (
  <section className="py-20 md:py-28 bg-background">
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
          Built for Regulated Institutions
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {institutions.map((item, i) => (
          <motion.div
            key={item.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            custom={i + 1}
            className="card-elevated rounded-xl p-6 border border-border/50 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default InstitutionsSection;
