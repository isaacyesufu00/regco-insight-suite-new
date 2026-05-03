import { AnimateIn } from "./AnimateIn";
import { motion } from "framer-motion";

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

const ComplianceTypesSection = () => (
  <section id="reports" style={{ background: "#000000", padding: "140px 0" }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <AnimateIn>
        <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 56px)", color: "white", textAlign: "center", marginBottom: 16 }}>
          Every return. Every regulator. One platform.
        </h2>
      </AnimateIn>
      <AnimateIn delay={0.1}>
        <p style={{ fontSize: 21, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 80 }}>
          RegCo covers the complete Nigerian financial sector compliance calendar.
        </p>
      </AnimateIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <AnimateIn key={i} delay={i * 0.06}>
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
          </AnimateIn>
        ))}
      </div>
    </div>
  </section>
);

export default ComplianceTypesSection;
