import { useState } from "react";
import { AnimateIn } from "./AnimateIn";
import { motion } from "framer-motion";

const features = [
  {
    category: "BUILT FOR NIGERIA",
    title: "The only platform that knows Nigerian regulatory formats by heart.",
    desc: "Every return on RegCo outputs in the exact format required by each portal — CBN Supervision, NFIU, SCUML, and NDIC. Not adapted. Not approximate. Exact.",
  },
  {
    category: "COMPLETE COVERAGE",
    title: "One platform. Thirteen return types. Zero Excel.",
    desc: "From the CBN Monetary Policy Return to Withholding Tax remittance, every regulatory obligation your compliance team faces is handled in one login.",
  },
  {
    category: "AI VALIDATION",
    title: "Your figures are checked five times before we generate anything.",
    desc: "RegCo's validation engine checks balance sheet integrity, loan portfolio reconciliation, deposit categorisation, CAR compliance, and liquidity ratio — automatically, in seconds.",
  },
  {
    category: "NO INTEGRATION",
    title: "Works with Flexcube, Finacle, Bankone, T24, and every other CBS.",
    desc: "Export your trial balance as you always have. RegCo reads any column format, any layout, any CBS software. Nothing to install. Nothing for IT to configure.",
  },
  {
    category: "SPEED",
    title: "5 minutes from upload to a submission-ready return.",
    desc: "A process that takes your compliance team 3 to 5 days every month is completed in under 5 minutes. The CBN deadline is the 10th. You can now submit on the 10th instead of the 8th.",
  },
  {
    category: "SECURITY",
    title: "NDPC registered. Bank-grade data handling.",
    desc: "RegCo is registered with the Nigeria Data Protection Commission as both Data Controller and Data Processor. Your CBS data is processed in-memory and never stored permanently on our servers.",
  },
];

const FeaturesSection = () => (
  <section id="features" style={{ background: "#FFFFFF", padding: "140px 0" }}>
    <div className="max-w-[1080px] mx-auto px-6">
      <div className="flex items-center justify-between mb-12">
        <AnimateIn>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 52px)", color: "#1D1D1F", maxWidth: 600 }}>
            Why Nigeria's financial institutions choose RegCo.
          </h2>
        </AnimateIn>
        <a href="#features" style={{ color: "#0066CC", fontSize: 17, whiteSpace: "nowrap" }}>See all features ›</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <AnimateIn key={i} delay={i * 0.08}>
            <FeatureCard {...f} />
          </AnimateIn>
        ))}
      </div>
    </div>
  </section>
);

const FeatureCard = ({ category, title, desc }: { category: string; title: string; desc: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 16px 48px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#FFFFFF" : "#F5F5F7",
        borderRadius: 18,
        padding: "40px 36px",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.3s",
      }}
    >
      <p style={{ fontSize: 12, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.08em" }}>{category}</p>
      <h3 style={{ fontWeight: 700, fontSize: 26, color: "#1D1D1F", marginTop: 12, lineHeight: 1.2 }}>{title}</h3>
      <p style={{ fontSize: 15, color: "#6E6E73", marginTop: 12, lineHeight: 1.6 }}>{desc}</p>
      <div
        className="absolute bottom-6 right-6 flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#1D1D1F",
          color: "white",
          fontSize: 20,
          fontWeight: 300,
          transition: "transform 0.3s",
          transform: hovered ? "rotate(45deg)" : "rotate(0deg)",
        }}
      >
        +
      </div>
    </motion.div>
  );
};

export default FeaturesSection;
