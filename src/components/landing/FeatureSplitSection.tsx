import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileCheck, Sparkles, Download } from "lucide-react";
import RegCoLogo from "@/components/RegCoLogo";

const features = [
  {
    icon: FileCheck,
    label: "CBN Validation",
    desc: "Reconciles balance sheet, deposits, and loan portfolio totals before generation.",
  },
  {
    icon: Sparkles,
    label: "AI-Assisted Generation",
    desc: "Deterministic ratios first, AI for intelligent mapping and structure.",
  },
  {
    icon: Download,
    label: "Instant Download",
    desc: "PDF, Excel, or Word — formatted to match the official CBN template.",
  },
];

const FeatureSplitSection = () => {
  return (
    <section className="bg-white">
      <div className="grid md:grid-cols-2 min-h-[640px]">
        {/* Left: white text panel */}
        <div className="flex items-center px-8 md:px-16 lg:px-24 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-md"
          >
            <RegCoLogo size="sm" />
            <h2
              className="mt-8 text-4xl md:text-5xl font-black text-[#0A0A0A] leading-[1.05] tracking-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              No Manual Shortcuts.
              <br />
              Just Real Compliance.
            </h2>
            <p className="mt-5 text-[15px] text-[#555] leading-relaxed">
              RegCo enforces the same controls a CBN examiner would — every figure
              traced, every total reconciled, every ratio checked.
            </p>

            <ul className="mt-8 space-y-5">
              {features.map((f) => (
                <li key={f.label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#0A0A0A] flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[#0A0A0A]">
                      {f.label}
                    </div>
                    <div className="text-[13px] text-[#555] mt-0.5">{f.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-3">
              <Link
                to="/book-demo"
                className="px-5 py-2.5 rounded-full bg-[#0A0A0A] text-white text-sm font-semibold hover:scale-[1.03] transition-transform ease-apple"
              >
                Get Started
              </Link>
              <Link
                to="/security"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors"
              >
                Read Docs →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right: gradient halftone panel */}
        <div className="relative bg-brand-gradient overflow-hidden flex items-center justify-center min-h-[400px]">
          <div className="absolute inset-0 halftone-overlay opacity-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10 w-72 md:w-80 bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#888] font-semibold">
              <span>CBN Return</span>
              <span className="px-2 py-0.5 rounded-full bg-success/10 text-success">Validated</span>
            </div>
            <div className="mt-4 text-xl font-bold text-[#0A0A0A] leading-tight">
              Q4 2025 Regulatory Return
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { l: "CAR", v: "18.4%" },
                { l: "Liquidity", v: "42.1%" },
                { l: "NPL", v: "3.2%" },
              ].map((m) => (
                <div key={m.l} className="bg-[#F5F5F5] rounded-lg p-3 text-center">
                  <div className="text-[10px] text-[#888] uppercase tracking-wider">{m.l}</div>
                  <div className="mt-1 text-base font-bold text-[#0A0A0A]">{m.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-[#E8E8E8] flex items-center justify-between">
              <span className="text-xs text-[#555]">Generated in 3m 42s</span>
              <span className="text-xs font-semibold text-brand-gradient">Ready</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSplitSection;
