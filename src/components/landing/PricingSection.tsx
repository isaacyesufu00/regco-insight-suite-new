import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const tiers = [
  {
    category: "UNIT MFB",
    headline: "Single branch compliance.",
    body: "For unit microfinance banks filing core CBN returns with a single compliance officer.",
    price: "₦150,000",
    setup: "₦50,000 one-time setup",
    features: ["Up to 3 report types", "1 officer seat", "Email support", "Monthly reports", "Data validation"],
    href: "/book-demo",
  },
  {
    category: "STATE MFB",
    headline: "Multi-branch automation.",
    body: "For state and national MFBs scaling compliance across multiple branches and return types.",
    price: "₦450,000",
    setup: "₦100,000 one-time setup",
    features: ["All 7 report types", "5 officer seats", "Calendar reminders", "Priority support", "Dedicated onboarding"],
    href: "/book-demo",
  },
  {
    category: "NATIONAL MFB",
    headline: "Enterprise-grade reporting.",
    body: "For commercial banks and finance houses requiring unlimited reports and custom integrations.",
    price: "Custom",
    setup: "Contact for pricing",
    features: ["Unlimited reports", "Dedicated success manager", "SLA + on-prem option", "Custom integrations", "API access"],
    href: "/contact",
  },
];

const PricingCard = ({ tier }: { tier: typeof tiers[number] }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white flex-shrink-0 w-full md:w-auto flex flex-col cursor-pointer"
      style={{
        borderRadius: 18,
        padding: 32,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.25s, transform 0.25s",
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <p className="text-[12px] text-[#6E6E73] uppercase font-normal" style={{ letterSpacing: "0.1em" }}>
        {tier.category}
      </p>
      <h3 className="text-[28px] font-bold text-[#1D1D1F] mt-3" style={{ letterSpacing: "-0.3px", lineHeight: 1.15 }}>
        {tier.headline}
      </h3>
      <p className="text-[15px] text-[#6E6E73] mt-3" style={{ lineHeight: 1.5 }}>
        {tier.body}
      </p>

      <div className="flex-1" />

      {/* Expand zone */}
      <div
        style={{
          maxHeight: expanded ? 400 : 0,
          opacity: expanded ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease",
        }}
      >
        <div className="pt-5 mt-5" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <div className="text-[36px] font-bold text-[#1D1D1F]" style={{ letterSpacing: -1 }}>
            {tier.price}
          </div>
          <p className="text-[13px] text-[#6E6E73] mt-1">{tier.setup}</p>
          <ul className="mt-4 space-y-2">
            {tier.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[14px] text-[#1D1D1F]">
                <Check size={14} className="text-[#6E6E73] flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            to={tier.href}
            className="mt-5 block w-full text-center py-3 rounded-full text-[15px] font-medium text-white"
            style={{ background: "#0066CC", backgroundImage: "none", transition: "filter 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
          >
            Get started
          </Link>
        </div>
      </div>

      {/* + button */}
      <div className="flex justify-end mt-5">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[18px] font-light"
          style={{
            background: "#1D1D1F",
            transition: "transform 0.3s",
            transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </div>
    </div>
  );
};

const PricingSection = () => (
  <section id="pricing" className="py-[120px]" style={{ background: "#F5F5F7" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 22px" }}>
      <div className="flex items-baseline justify-between mb-12">
        <h2 className="text-[48px] font-bold text-[#1D1D1F]" style={{ letterSpacing: "-0.5px" }}>
          Simple pricing.
        </h2>
        <Link to="/contact" className="text-[17px] text-[#0066CC] font-normal hidden md:block" style={{ backgroundImage: "none" }}>
          Compare all plans ›
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-5 overflow-x-auto" style={{ scrollSnapType: "x mandatory" }}>
        {tiers.map((t) => (
          <div key={t.category} className="flex-1 min-w-[280px]" style={{ scrollSnapAlign: "start" }}>
            <PricingCard tier={t} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
