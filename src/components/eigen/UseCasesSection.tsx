import { motion } from "framer-motion";
import { Building2, Home, TrendingUp, Landmark, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "./ScrollReveal";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const cards = [
  { icon: Building2, title: "Microfinance Banks", desc: "Unit, State, and National MFBs. All CBN, NFIU, SCUML, NDIC and FIRS returns automated from a single dashboard." },
  { icon: Home, title: "Primary Mortgage Banks", desc: "PMB prudential returns, loan classification, and NDIC premium returns generated automatically." },
  { icon: TrendingUp, title: "Finance Companies", desc: "FIRS, SCUML, and CBN oversight — all from one dashboard. Fastest-growing licensed category." },
  { icon: Landmark, title: "Commercial Banks", desc: "Full suite of CBN, NFIU, SCUML, NDIC and FIRS returns. Enterprise-grade compliance infrastructure." },
];

const UseCasesSection = () => (
  <section id="who-we-serve" style={{ background: "#F5F5F0", padding: "80px 0" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginBottom: 48 }}>
        <ScrollReveal>
          <p style={{ fontSize: 11, color: "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 16px" }}>USE CASES</p>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-1px", lineHeight: 1.1, maxWidth: 380, margin: "0 0 24px" }}>
            Unlock compliance automation across every institution type.
          </h2>
          <Link to="/login" style={{ background: "#0A0A0A", color: "#fff", borderRadius: 6, padding: "10px 18px", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            START FOR FREE <ArrowRight size={12} />
          </Link>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7, margin: 0, maxWidth: 380, justifySelf: "end" }}>
            Enterprise compliance platform. Process regulatory returns, monitor transactions, and manage customer risk — in one place.
          </p>
        </ScrollReveal>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
      >
        {cards.map((c) => (
          <motion.div
            key={c.title}
            variants={fadeUp}
            whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
            style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: 24 }}
          >
            <c.icon size={24} color="#0A0A0A" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "14px 0 6px" }}>{c.title}</h3>
            <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default UseCasesSection;
