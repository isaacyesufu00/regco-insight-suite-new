import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import { motion } from "framer-motion";
import { Check, Users, Link2, Shield, HeadphonesIcon, AlertTriangle, Clock, XCircle, Lock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
};

const painPoints = [
  { icon: AlertTriangle, text: "Multiple return types with overlapping deadlines across different departments." },
  { icon: Clock, text: "Manual data consolidation from Flexcube or Finacle takes your IT and compliance teams days." },
  { icon: XCircle, text: "Any error in a commercial bank CBN submission carries significant regulatory and reputational risk." },
];

const features = [
  { icon: Users, title: "Multi-user access", text: "Role-based permissions for your entire compliance team." },
  { icon: Link2, title: "Direct integration", text: "Integration with Flexcube and Finacle via scheduled automated exports." },
  { icon: Shield, title: "Full audit trail", text: "Every report generated, who generated it, and when — fully logged." },
  { icon: HeadphonesIcon, title: "SLA guarantee", text: "Dedicated account manager and priority support." },
];

const returns = [
  { name: "CBN Monetary Policy Return", freq: "Monthly", desc: "Key monetary aggregates and policy compliance data." },
  { name: "CBN Forex Return", freq: "Weekly & Monthly", desc: "Foreign exchange position and transaction data." },
  { name: "Prudential Return", freq: "Monthly", desc: "Capital adequacy, asset quality, and liquidity ratios." },
  { name: "AML/CFT Report", freq: "Quarterly", desc: "Anti-money laundering compliance and suspicious transaction reports." },
  { name: "NFIU Return", freq: "Quarterly", desc: "Financial intelligence reporting for regulatory compliance." },
];

const security = [
  "AES-256 encryption at rest and TLS 1.3 in transit.",
  "Role-based access control with full audit logging.",
  "NDPR compliant with signed Data Processing Agreement.",
];

const UseCaseCommercial = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="hero-gradient pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
            Enterprise-Grade Regulatory Reporting for Commercial Banks.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            RegCo handles the complexity of commercial bank CBN reporting — from Monetary Policy Returns to Forex submissions — with the security and reliability your institution demands.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Pain Points */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          The challenges commercial banks face
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {painPoints.map((p, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-6 card-elevated">
              <p.icon className="w-8 h-8 text-destructive mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Enterprise Features */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Enterprise features built for scale
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-6 card-elevated flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Supported Returns */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Supported Return Types
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {returns.map((r, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-5 card-elevated">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-success shrink-0" />
                <h3 className="text-sm font-bold text-foreground">{r.name}</h3>
              </div>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{r.freq}</span>
              <p className="text-xs text-muted-foreground mt-2">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Security */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-10">
          Bank-grade security as standard.
        </motion.h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {security.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{s}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <PageCTA
      headline="Speak to our enterprise team."
      primaryLabel="Contact Sales"
      showDemo={false}
      contactMessage="I am interested in RegCo for our commercial bank. Please contact me to discuss enterprise pricing."
    />
    <Footer />
  </div>
);

export default UseCaseCommercial;
