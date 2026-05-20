import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    tier: "Unit MFB",
    desc: "Single-location microfinance banks",
    features: ["All CBN returns", "NFIU quarterly reports", "FIRS monthly remittances", "1 user account", "Email support"],
    popular: false,
  },
  {
    tier: "State MFB",
    desc: "State-wide microfinance banks",
    features: ["All 16 mandatory returns", "Customer 360", "AML transaction monitoring", "Risk analysis", "3 user accounts", "Priority support"],
    popular: true,
  },
  {
    tier: "National MFB",
    desc: "Nationwide microfinance banks",
    features: ["All 16 mandatory returns", "Customer 360 & KYC management", "Live transaction flagging", "Unlimited users", "24hr support", "Compliance intelligence dashboard"],
    popular: false,
  },
  {
    tier: "Commercial Bank",
    desc: "Commercial and merchant banks",
    features: ["Everything in National MFB", "Custom CBS integration", "Dedicated compliance manager", "SLA guarantee", "Custom regulatory modules"],
    popular: false,
  },
];

const PricingSection = () => (
  <section id="pricing" style={{ background: "#F5F5F0", padding: "96px 0" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center", marginBottom: 16 }}>PRICING</p>
      <h2 style={{ fontSize: 44, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-1.2px", textAlign: "center", marginBottom: 12, lineHeight: 1.1 }}>
        The right plan for<br />your institution.
      </h2>
      <p style={{ fontSize: 15, color: "#6B6B6B", textAlign: "center", marginBottom: 60 }}>
        Transparent pricing based on your CBN license category.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
        {plans.map((plan, i) => (
          <motion.div
            key={plan.tier}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.10)" }}
            style={{
              background: plan.popular ? "#0A0A0A" : "#FFFFFF",
              borderRadius: 14,
              border: plan.popular ? "none" : "1px solid rgba(0,0,0,0.08)",
              padding: "28px 24px",
              position: "relative",
              transition: "box-shadow 0.2s",
            }}
          >
            {plan.popular && (
              <div style={{
                position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                background: "#FFFFFF", color: "#0A0A0A", borderRadius: 999,
                padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                border: "1px solid rgba(0,0,0,0.1)", whiteSpace: "nowrap",
              }}>
                MOST POPULAR
              </div>
            )}

            <h3 style={{ fontSize: 16, fontWeight: 700, color: plan.popular ? "#FFFFFF" : "#0A0A0A", marginBottom: 4, marginTop: 0 }}>{plan.tier}</h3>
            <p style={{ fontSize: 12, color: plan.popular ? "rgba(255,255,255,0.5)" : "#9B9B9B", marginBottom: 20, marginTop: 0 }}>{plan.desc}</p>

            <div style={{ borderTop: `1px solid ${plan.popular ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)"}`, paddingTop: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: plan.popular ? "rgba(255,255,255,0.4)" : "#9B9B9B", margin: "0 0 4px" }}>Pricing</p>
              <p style={{ fontSize: 17, fontWeight: 700, color: plan.popular ? "#FFFFFF" : "#0A0A0A", margin: 0 }}>Contact us for pricing</p>
            </div>

            <ul style={{ listStyle: "none", padding: 0, marginBottom: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: plan.popular ? "rgba(255,255,255,0.8)" : "#525252", lineHeight: 1.5 }}>
                  <Check size={14} style={{ flexShrink: 0, marginTop: 2, color: plan.popular ? "#FFFFFF" : "#0A0A0A" }} />
                  {f}
                </li>
              ))}
            </ul>

            <Link to="/book-demo" style={{
              display: "block", textAlign: "center",
              background: plan.popular ? "#FFFFFF" : "#0A0A0A",
              color: plan.popular ? "#0A0A0A" : "#FFFFFF",
              borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 600,
              textDecoration: "none", letterSpacing: "0.02em",
            }}>
              REQUEST A QUOTE →
            </Link>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
        {["🛡 CBN Compliant Architecture", "🔒 Bank-grade Data Security", "📋 NDPC Registered"].map((t) => (
          <span key={t} style={{ fontSize: 13, color: "#9B9B9B" }}>{t}</span>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
