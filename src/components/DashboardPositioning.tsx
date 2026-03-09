import { motion } from "framer-motion";
import { Lock, Users, FileText, ClipboardCheck, Bell, Building } from "lucide-react";

const features = [
  { icon: Lock, title: "Encrypted Data Storage", desc: "All client data protected with bank-grade encryption." },
  { icon: Users, title: "Role-Based Access Control", desc: "Granular permissions for every team member." },
  { icon: FileText, title: "Automated Filing Logs", desc: "Every submission logged automatically." },
  { icon: ClipboardCheck, title: "Audit-Ready Documentation", desc: "One-click export for regulators." },
  { icon: Bell, title: "Real-Time Compliance Alerts", desc: "Never miss a critical deadline." },
  { icon: Building, title: "Multi-Entity Support", desc: "Manage multiple subsidiaries from one dashboard." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
};

const DashboardPositioning = () => (
  <section id="platform" className="py-24 md:py-32 bg-muted/30">
    <div className="container mx-auto px-4 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        custom={0}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold font-display text-foreground leading-tight">
          Your Secure Compliance<br />Command Center
        </h2>
        <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
          RegCo provides a private, encrypted dashboard for every client. Manage filings, track obligations, collaborate with your team, and maintain a full audit trail — all in one place.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            custom={i + 1}
            className="bg-background rounded-2xl p-6 border border-border/40"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DashboardPositioning;
