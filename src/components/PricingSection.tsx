import { useState } from "react";
import { AnimateIn } from "./AnimateIn";
import { Link } from "react-router-dom";

const plans = [
  {
    category: "UNIT MFB",
    title: "Single branch. Full compliance.",
    desc: "Everything you need to submit your first CBN return.",
    price: "₦350,000",
    setup: "₦150,000 one-time setup",
    features: ["1 institution", "All 13 return types", "Email support", "Monthly returns", "CSV & Excel upload"],
  },
  {
    category: "STATE MFB",
    title: "Multi-branch. Complete automation.",
    desc: "Multi-branch support with priority processing.",
    price: "₦700,000",
    setup: "₦300,000 one-time setup",
    features: ["Up to 5 branches", "All return types", "Priority support", "Weekly & monthly", "Compliance calendar"],
  },
  {
    category: "NATIONAL / COMMERCIAL",
    title: "Enterprise compliance at scale.",
    desc: "Full compliance infrastructure with dedicated support.",
    price: "From ₦1,000,000",
    setup: "₦500,000 one-time setup",
    features: ["Unlimited branches", "All return types", "Dedicated CSM", "API access", "Custom integrations"],
  },
];

const PricingSection = () => (
  <section id="pricing" style={{ background: "#F5F5F7", padding: "140px 0" }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="flex items-center justify-between mb-12">
        <AnimateIn>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 52px)", color: "#1D1D1F" }}>Simple pricing.</h2>
        </AnimateIn>
        <a href="#pricing" style={{ color: "#0066CC", fontSize: 17 }}>Compare all plans ›</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <AnimateIn key={i} delay={i * 0.1}>
            <PricingCard {...plan} />
          </AnimateIn>
        ))}
      </div>
    </div>
  </section>
);

const PricingCard = ({ category, title, desc, price, setup, features }: typeof plans[0]) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        background: "white",
        borderRadius: 18,
        padding: "36px 36px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
        maxHeight: expanded ? 580 : 280,
        transition: "max-height 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <p style={{ fontSize: 12, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.08em" }}>{category}</p>
      <h3 style={{ fontWeight: 700, fontSize: 26, color: "#1D1D1F", marginTop: 12, lineHeight: 1.2 }}>{title}</h3>
      <p style={{ fontSize: 15, color: "#6E6E73", marginTop: 12 }}>{desc}</p>

      <div style={{ marginTop: 24, opacity: expanded ? 1 : 0, transition: "opacity 0.3s" }}>
        <p style={{ fontWeight: 900, fontSize: 44, color: "#1D1D1F" }}>{price}</p>
        <p style={{ fontSize: 15, color: "#6E6E73", marginTop: 4 }}>{setup}</p>
        <div className="mt-4 space-y-2">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-2">
              <span style={{ color: "#34C759" }}>✓</span>
              <span style={{ fontSize: 14, color: "#1D1D1F" }}>{f}</span>
            </div>
          ))}
        </div>
        <Link
          to="/login"
          className="block mt-6 text-center py-3"
          style={{ background: "#0066CC", color: "white", borderRadius: 10, fontSize: 17, textDecoration: "none" }}
        >
          Sign In
        </Link>
      </div>

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
          transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
        }}
      >
        +
      </div>
    </div>
  );
};

export default PricingSection;
