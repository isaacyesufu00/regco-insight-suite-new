import { useState } from "react";
import { AnimateIn } from "./AnimateIn";
import { motion } from "framer-motion";

const features = [
  {
    category: "INTELLIGENCE",
    title: "AI Validation",
    desc: "Every figure is cross-checked against CBN thresholds before your return is generated. Balance sheet mismatches are caught instantly.",
  },
  {
    category: "COVERAGE",
    title: "7 Return Types",
    desc: "MFB Prudential, CBN Forex, AML/CFT, NFIU, SCUML, Capital Adequacy, and Liquidity returns — all from a single CBS upload.",
  },
  {
    category: "SPEED",
    title: "5-Minute Generation",
    desc: "Upload your raw CBS export and receive a fully formatted, CBN-ready return in under five minutes. No manual extraction.",
  },
  {
    category: "SIMPLICITY",
    title: "Zero Integration Required",
    desc: "No API keys, no IT department approval. Upload your file directly from your core banking system export. Works with Flexcube, Finacle, and more.",
  },
];

const FeaturesSection = () => (
  <section id="features" style={{ background: "#F5F5F7", padding: "120px 0" }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="flex items-center justify-between mb-12">
        <AnimateIn>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 48px)", color: "#1D1D1F" }}>
            Why compliance officers choose RegCo.
          </h2>
        </AnimateIn>
        <a href="#features" style={{ color: "#0066CC", fontSize: 17 }}>See all features ›</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((f, i) => (
          <AnimateIn key={i} delay={i * 0.1}>
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
      whileHover={{ y: -4, boxShadow: "0 12px 48px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        padding: 40,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <p style={{ fontSize: 12, color: "#6E6E73", textTransform: "uppercase", letterSpacing: "0.08em" }}>{category}</p>
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
