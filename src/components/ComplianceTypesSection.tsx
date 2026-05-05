import { useState } from "react";
import { AnimateIn } from "./AnimateIn";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  { reg: "CBN", name: "MFB Regulatory Return", freq: "Monthly", desc: "Balance sheet, loans, deposits, CAR, liquidity" },
  { reg: "CBN", name: "Monetary Policy Return", freq: "Monthly", desc: "Interest rates, credit data, monetary compliance" },
  { reg: "CBN", name: "Prudential Return", freq: "Monthly", desc: "CAMEL framework — capital, asset quality, earnings" },
  { reg: "CBN", name: "CBN Forex Return", freq: "Weekly/Monthly", desc: "Foreign currency positions and transactions" },
  { reg: "NFIU", name: "AML/CFT Compliance Report", freq: "Quarterly", desc: "Anti-money laundering and counter-terrorism" },
  { reg: "NFIU", name: "NFIU Regulatory Return", freq: "Quarterly", desc: "STR filings, CTR reports, financial intelligence" },
  { reg: "NFIU", name: "International Transfers Report", freq: "Quarterly", desc: "Cross-border transaction monitoring" },
  { reg: "SCUML", name: "SCUML Annual Compliance", freq: "Annual", desc: "Designated non-financial business compliance" },
  { reg: "NDIC", name: "NDIC Premium Return", freq: "Annual", desc: "Deposit insurance premium calculation" },
  { reg: "NDIC", name: "Single Obligor Report", freq: "Quarterly", desc: "Large exposure and concentration risk" },
  { reg: "FIRS", name: "Company Income Tax Return", freq: "Annual", desc: "Corporate tax filing and compliance" },
  { reg: "FIRS", name: "Payee Remittance (PAYE)", freq: "Monthly", desc: "Employee income tax remittance" },
  { reg: "FIRS", name: "Withholding Tax Return", freq: "Monthly", desc: "WHT on vendor payments and dividends" },
  { reg: "FIRS", name: "VAT Return", freq: "Monthly", desc: "Value added tax on qualifying services" },
  { reg: "CBN", name: "Board Governance Return", freq: "Bi-annual", desc: "Corporate governance and board matters" },
  { reg: "CBN", name: "Consumer Protection Return", freq: "Quarterly", desc: "Customer complaints and resolution data" },
];

const FILTER_OPTIONS = ["All", "CBN", "NFIU", "SCUML", "NDIC", "FIRS"];

const ComplianceTypesSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? cards : cards.filter(c => c.reg === activeFilter);

  return (
    <section id="reports" style={{ background: "#000000", padding: "140px 0" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimateIn>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 56px)", color: "white", textAlign: "center", marginBottom: 16 }}>
            Every return. Every regulator. One platform.
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 12 }}>
            16 return types. 5 regulators. One platform.
          </p>
        </AnimateIn>

        {/* Filter pills */}
        <AnimateIn delay={0.15}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                style={{
                  borderRadius: 980,
                  padding: "8px 20px",
                  fontSize: 13,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  background: activeFilter === opt ? "#1D1D1F" : "rgba(255,255,255,0.08)",
                  color: activeFilter === opt ? "white" : "rgba(255,255,255,0.6)",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </AnimateIn>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((c) => (
              <motion.div
                key={c.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <motion.div
                  whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.2)", background: "#242426" }}
                  transition={{ duration: 0.25 }}
                  style={{
                    background: "#1D1D1F",
                    borderRadius: 18,
                    padding: 28,
                    border: "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                  }}
                >
                  <span
                    className="inline-block"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.6)",
                      borderRadius: 980,
                      padding: "4px 12px",
                      fontSize: 12,
                    }}
                  >
                    {c.reg}
                  </span>
                  <h4 style={{ fontWeight: 700, fontSize: 19, color: "white", marginTop: 12 }}>{c.name}</h4>
                  <span
                    className="inline-block mt-2"
                    style={{
                      background: "rgba(0,102,204,0.2)",
                      color: "#0066CC",
                      borderRadius: 980,
                      padding: "2px 10px",
                      fontSize: 12,
                    }}
                  >
                    {c.freq}
                  </span>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>{c.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ComplianceTypesSection;
