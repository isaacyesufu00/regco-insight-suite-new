import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type LayoutKind = "returns-left-text-right" | "text-left-returns-right" | "centered-dark";

interface RegReturn {
  name: string;
  freq: string;
  desc: string;
}

interface Regulator {
  id: string;
  name: string;
  fullName: string;
  tagline: string;
  bg: string;
  description: string;
  returns: RegReturn[];
  penalty: string;
  layout: LayoutKind;
}

const regulators: Regulator[] = [
  {
    id: "cbn",
    name: "CBN",
    fullName: "Central Bank of Nigeria",
    tagline: "The most important filing deadline in Nigerian banking.",
    bg: "#F5F5F0",
    description:
      "The CBN is Nigeria's apex financial regulator. Every licensed bank and MFB reports directly to the CBN every single month. The CBN uses these returns to monitor the health of the Nigerian financial system — your balance sheet, your loans, your capital, your foreign exchange exposure.\n\nMiss a CBN return and the fine is immediate. Miss two and examiners arrive. Miss three and your license is at risk. There is no grace period and no negotiation.",
    returns: [
      { name: "MFB Regulatory Return", freq: "Monthly", desc: "Your complete balance sheet, deposits, loans, and capital adequacy ratio submitted monthly" },
      { name: "Monetary Policy Return", freq: "Monthly", desc: "Interest rates, monetary aggregates, and credit data for CBN's monetary policy analysis" },
      { name: "Prudential Return", freq: "Monthly", desc: "Risk asset classification, NPL ratio, loan loss provisions, and capital adequacy" },
      { name: "CBN Forex Return", freq: "Weekly/Monthly", desc: "All foreign exchange transactions and positions — critical for CBN's FX monitoring" },
      { name: "Board Governance Return", freq: "Bi-annual", desc: "Directors, senior management, shareholding structure, and corporate governance compliance" },
      { name: "Consumer Protection Return", freq: "Quarterly", desc: "Customer complaints received, resolved, and pending — CBN tracks how you treat customers" },
    ],
    penalty: "₦2,000,000 minimum fine per late or incorrect filing.",
    layout: "returns-left-text-right",
  },
  {
    id: "nfiu",
    name: "NFIU",
    fullName: "Nigerian Financial Intelligence Unit",
    tagline: "Fighting money laundering. One return at a time.",
    bg: "#FFFFFF",
    description:
      "The NFIU is Nigeria's financial intelligence agency — the equivalent of FinCEN in the US or UKFIU in the UK. They track money laundering, terrorism financing, and financial crime across the Nigerian banking system.\n\nEvery financial institution must tell NFIU what suspicious transactions they spotted, how many Suspicious Transaction Reports they filed, and how their AML programme is working. Failure to file is treated as potential complicity in financial crime.",
    returns: [
      { name: "AML/CFT Compliance Report", freq: "Quarterly", desc: "Your anti-money laundering programme effectiveness — staff trained, transactions monitored, STRs filed" },
      { name: "NFIU Regulatory Return", freq: "Quarterly", desc: "Compliance infrastructure, regulatory examination outcomes, international transaction data" },
      { name: "International Transfers Report", freq: "Quarterly", desc: "All cross-border wire transfers above reporting thresholds — inward and outward" },
    ],
    penalty: "License suspension and criminal prosecution for persistent non-compliance.",
    layout: "text-left-returns-right",
  },
  {
    id: "scuml",
    name: "SCUML",
    fullName: "Special Control Unit Against Money Laundering",
    tagline: "Nigeria's anti-money laundering watchdog.",
    bg: "#0A0A0A",
    description:
      "SCUML operates under the Economic and Financial Crimes Commission (EFCC) and focuses specifically on Designated Non-Financial Businesses and financial institutions. Every institution must register with SCUML and file an annual compliance report proving their AML/CFT programme is real — not just a document that sits in a drawer.\n\nSCUML examiners visit institutions. They ask for training records. They review your customer files. They check your transaction monitoring system. Your annual compliance report is their first line of assessment.",
    returns: [
      { name: "SCUML Annual Compliance Report", freq: "Annual", desc: "Full AML/CFT programme assessment — policies, KYC records, staff training, SCUML examination outcomes" },
    ],
    penalty: "EFCC prosecution and institution closure for non-compliance.",
    layout: "centered-dark",
  },
  {
    id: "ndic",
    name: "NDIC",
    fullName: "Nigeria Deposit Insurance Corporation",
    tagline: "The insurance that protects your depositors.",
    bg: "#F5F5F0",
    description:
      "The NDIC provides deposit insurance to Nigerian bank customers — if your bank fails, NDIC pays depositors up to ₦500,000 each. To fund this, every insured institution pays an annual premium calculated from their total insured deposits.\n\nBeyond the premium, NDIC also tracks large borrowers. If one customer owes you more than a certain percentage of your capital, NDIC wants to know — because if that customer defaults, it could bring down the institution and trigger a payout.",
    returns: [
      { name: "NDIC Premium Return", freq: "Annual", desc: "Annual insurance premium computation — total insured deposits × 0.40% = your premium payable to NDIC" },
      { name: "Single Obligor Report", freq: "Quarterly", desc: "All borrowers whose exposure exceeds 5% of your capital base — NDIC's large exposure monitoring" },
    ],
    penalty: "Loss of deposit insurance coverage and regulatory sanctions.",
    layout: "returns-left-text-right",
  },
  {
    id: "firs",
    name: "FIRS",
    fullName: "Federal Inland Revenue Service",
    tagline: "Tax compliance is not optional.",
    bg: "#FFFFFF",
    description:
      "The Federal Inland Revenue Service collects taxes for the federal government. Financial institutions are major taxpayers — they collect VAT on their services, deduct PAYE from staff salaries every month, withhold tax from vendor payments, and pay Company Income Tax on their profits.\n\nFIRS has become increasingly aggressive in enforcement. Tax audits of financial institutions are common. Penalties for late filing compound monthly. Getting FIRS filings right — and on time — is as important as getting CBN filings right.",
    returns: [
      { name: "VAT Return", freq: "Monthly", desc: "Value Added Tax at 7.5% — collected on your services, offset against purchases, remitted monthly" },
      { name: "PAYE Remittance", freq: "Monthly", desc: "Employee income tax deducted from every salary, remitted to FIRS before the 10th of each month" },
      { name: "Withholding Tax Return", freq: "Monthly", desc: "Tax deducted at source on payments to contractors, consultants, landlords, and vendors" },
      { name: "Company Income Tax Return", freq: "Annual", desc: "Annual corporate tax at 30% (large) or 20% (medium) of assessable profits" },
    ],
    penalty: "10% of tax due plus ₦50,000 per month for late filing.",
    layout: "text-left-returns-right",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TextContent = ({ reg, isDark, centered = false }: { reg: Regulator; isDark: boolean; centered?: boolean }) => {
  const primary = isDark ? "#FFFFFF" : "#0A0A0A";
  const muted = isDark ? "rgba(255,255,255,0.7)" : "#525252";
  const subtle = isDark ? "rgba(255,255,255,0.5)" : "#737373";
  return (
    <div style={{ textAlign: centered ? "center" : "left", maxWidth: centered ? 700 : undefined, margin: centered ? "0 auto" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, justifyContent: centered ? "center" : "flex-start" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: subtle, letterSpacing: "0.14em", textTransform: "uppercase" }}>REGULATOR</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: primary, letterSpacing: "0.14em" }}>{reg.name}</span>
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: muted, margin: "0 0 8px" }}>{reg.fullName}</h3>
      <h2 style={{ fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 800, color: primary, margin: "0 0 24px", letterSpacing: "-1.2px", lineHeight: 1.1 }}>
        {reg.tagline}
      </h2>
      {reg.description.split("\n\n").map((p, i) => (
        <p key={i} style={{ fontSize: 15, color: muted, lineHeight: 1.7, margin: "0 0 14px" }}>
          {p}
        </p>
      ))}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(220,38,38,0.06)",
          borderRadius: 10,
          padding: "14px 16px",
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(220,38,38,0.15)",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 18, color: "#DC2626" }}>⚠</span>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.6)" : "#9B9B9B", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Non-Compliance Penalty
          </p>
          <p style={{ fontSize: 14, color: primary, margin: 0, fontWeight: 500 }}>{reg.penalty}</p>
        </div>
      </div>
    </div>
  );
};

const ReturnsList = ({ reg, isDark, isInView }: { reg: Regulator; isDark: boolean; isInView: boolean }) => {
  const cardBg = isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.07)";
  const primary = isDark ? "#FFFFFF" : "#0A0A0A";
  const muted = isDark ? "rgba(255,255,255,0.65)" : "#525252";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {reg.returns.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: EASE }}
          style={{ background: cardBg, borderRadius: 10, border: cardBorder, padding: "16px 18px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: primary, margin: 0 }}>{r.name}</p>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: isDark ? "rgba(255,255,255,0.7)" : "#525252",
                background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                borderRadius: 999,
                padding: "3px 10px",
                whiteSpace: "nowrap",
              }}
            >
              {r.freq}
            </span>
          </div>
          <p style={{ fontSize: 13, color: muted, margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

const RegulatorBlock = ({ reg }: { reg: Regulator }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isDark = reg.bg === "#0A0A0A";

  return (
    <div ref={ref} style={{ background: reg.bg, padding: "96px 0", borderTop: !isDark ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {reg.layout === "returns-left-text-right" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="reg-grid">
            <motion.div initial={{ opacity: 0, x: -32 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}>
              <ReturnsList reg={reg} isDark={isDark} isInView={isInView} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 32 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease: EASE }}>
              <TextContent reg={reg} isDark={isDark} />
            </motion.div>
          </div>
        )}

        {reg.layout === "text-left-returns-right" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="reg-grid">
            <motion.div initial={{ opacity: 0, x: -32 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}>
              <TextContent reg={reg} isDark={isDark} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 32 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease: EASE }}>
              <ReturnsList reg={reg} isDark={isDark} isInView={isInView} />
            </motion.div>
          </div>
        )}

        {reg.layout === "centered-dark" && (
          <div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}>
              <TextContent reg={reg} isDark={isDark} centered />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              style={{ maxWidth: 700, margin: "48px auto 0" }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center" }}>
                Returns Automated
              </p>
              <ReturnsList reg={reg} isDark={isDark} isInView={isInView} />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

const RegulatoryReturnsSection = () => (
  <section id="reports">
    <style>{`
      @media (max-width: 860px) {
        .reg-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      }
    `}</style>
    <div style={{ background: "#F5F5F0", padding: "120px 0 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center" }}
        >
          <p style={{ fontSize: 11, color: "#9B9B9B", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px", fontWeight: 600 }}>
            REGULATORY RETURNS
          </p>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "#0A0A0A", letterSpacing: "-1.5px", lineHeight: 1.05, margin: "0 0 24px" }}>
            Every return.<br />Every regulator.
          </h2>
          <p style={{ fontSize: 17, color: "#525252", lineHeight: 1.6, maxWidth: 620, margin: "0 auto" }}>
            Nigerian financial institutions must file 16 mandatory returns across 5 separate regulators. RegCo automates all of them.
          </p>
        </motion.div>
      </div>
    </div>
    {regulators.map((reg) => (
      <RegulatorBlock key={reg.id} reg={reg} />
    ))}
  </section>
);

export default RegulatoryReturnsSection;
