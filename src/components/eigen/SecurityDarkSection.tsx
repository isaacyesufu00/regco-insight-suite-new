import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lock, Shield, FileCheck, KeyRound } from "lucide-react";

const badges = [
  { icon: Lock, title: "CBN Data Guidelines", sub: "Compliant with CBN data security circulars" },
  { icon: Shield, title: "NDPC Registered", sub: "Data Protection Commission" },
  { icon: FileCheck, title: "NDPC Compliant", sub: "Data Protection Regulation" },
  { icon: KeyRound, title: "Row Level Security", sub: "Each institution's data fully isolated" },
];

const SecurityDarkSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} style={{ background: "#0A0A0A", padding: "80px 0", overflow: "hidden" }}>
      <motion.div style={{ y, maxWidth: 1100, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          FOR ALL TIERS
        </p>
        <h2 style={{ fontSize: 40, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-1px", marginBottom: 12 }}>
          Enterprise-grade security
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 400, margin: "0 auto 48px" }}>
          Industry-standard protections to safeguard your company and your clients.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, maxWidth: 720, margin: "0 auto" }}>
          {badges.map((b) => (
            <div key={b.title} style={{ textAlign: "center" }}>
              <b.icon size={26} color="#0A0A0A" style={{ marginBottom: 10 }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF", margin: "0 0 4px" }}>{b.title}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>{b.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SecurityDarkSection;
