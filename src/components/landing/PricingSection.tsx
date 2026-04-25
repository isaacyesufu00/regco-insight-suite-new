import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "₦150,000",
    cadence: "/month",
    description: "For unit MFBs filing core CBN returns.",
    features: ["Up to 3 report types", "1 compliance officer seat", "Email support"],
    cta: "Book a demo",
    href: "/book-demo",
    featured: false,
  },
  {
    name: "Growth",
    price: "₦450,000",
    cadence: "/month",
    description: "For state and national MFBs scaling reporting.",
    features: [
      "All 7 report types",
      "5 officer seats",
      "Calendar reminders",
      "Priority support",
    ],
    cta: "Book a demo",
    href: "/book-demo",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "For commercial banks and finance houses.",
    features: [
      "Unlimited reports",
      "Dedicated success manager",
      "SLA + on-prem option",
      "Custom integrations",
    ],
    cta: "Talk to sales",
    href: "/contact",
    featured: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] text-center tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Simple, predictable pricing.
        </motion.h2>
        <p className="mt-4 text-center text-[#555] text-base md:text-lg max-w-xl mx-auto">
          One platform. Every CBN return. Pay for the institution size you serve.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`relative rounded-[20px] p-8 lift-on-hover ${
                t.featured
                  ? "bg-white border-2 border-transparent"
                  : "bg-white border border-[#E8E8E8]"
              }`}
              style={
                t.featured
                  ? {
                      backgroundImage:
                        "linear-gradient(white, white), linear-gradient(135deg, #FF9A00, #FF3D00)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                    }
                  : undefined
              }
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-gradient text-white text-[11px] font-bold uppercase tracking-wider">
                  Most popular
                </div>
              )}
              <div className="text-sm font-semibold text-[#888] uppercase tracking-wider">
                {t.name}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
                  {t.price}
                </span>
                {t.cadence && (
                  <span className="text-sm text-[#888] font-medium">{t.cadence}</span>
                )}
              </div>
              <p className="mt-2 text-[13px] text-[#555]">{t.description}</p>
              <ul className="mt-7 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-[#0A0A0A]">
                    <Check className="w-4 h-4 text-brand-gradient flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={t.href}
                className={`mt-8 block w-full text-center px-5 py-3 rounded-full text-sm font-semibold transition-all ease-apple hover:scale-[1.02] ${
                  t.featured
                    ? "bg-brand-gradient text-white"
                    : "bg-[#0A0A0A] text-white"
                }`}
              >
                {t.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
