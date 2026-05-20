import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Layout = "dark" | "white" | "grey";

interface Institution {
  id: string;
  number: string;
  name: string;
  tagline: string;
  stat: string;
  statLabel: string;
  description: string;
  pain: string;
  solution: string;
  returns: string[];
  layout: Layout;
}

const institutions: Institution[] = [
  {
    id: "unit-mfb",
    number: "01",
    name: "Unit Microfinance Banks",
    tagline: "Small bank. Big compliance burden.",
    stat: "847",
    statLabel: "Unit MFBs licensed by CBN",
    description:
      "A Unit MFB serves one community — one branch, one location, one set of customers. The compliance officer is often the same person doing everything else: account opening, customer service, and still somehow expected to file 10 mandatory returns to 4 regulators every month and year.\n\nMost Unit MFB compliance officers work with 4-5 separate Excel spreadsheets, manually pulling figures from their CBS each month. One wrong cell reference and a ₦2,000,000 CBN fine arrives at the door.",
    pain: "Filing 10 mandatory returns manually while running a one-person compliance department.",
    solution:
      "RegCo handles all CBN, NFIU, and FIRS returns from a single file upload. What used to take 3 days now takes under 5 minutes.",
    returns: [
      "MFB Regulatory Return",
      "Monetary Policy Return",
      "NFIU AML/CFT Report",
      "PAYE Remittance",
      "VAT Return",
      "WHT Return",
    ],
    layout: "dark",
  },
  {
    id: "state-mfb",
    number: "02",
    name: "State Microfinance Banks",
    tagline: "More branches. More data. More deadlines.",
    stat: "126",
    statLabel: "State MFBs in Nigeria",
    description:
      "State MFBs operate across an entire state — multiple branches, thousands of customers, and a compliance team that is still surprisingly small relative to the filing workload.\n\nThe challenge isn't just filing returns — it's consolidating data from 5, 10, or 20 branches into one report. Each branch exports separately. Someone has to stitch it all together in Excel. Then validate it. Then format it to CBN's exact template. Every. Single. Month.",
    pain: "Consolidating branch data from multiple locations into one unified regulatory return.",
    solution:
      "Upload one consolidated file. RegCo reads it, validates the figures against CBN thresholds, and produces a submission-ready return covering all 16 mandatory filings.",
    returns: [
      "All 16 mandatory returns",
      "Multi-branch data support",
      "Customer 360 across branches",
      "AML transaction monitoring",
    ],
    layout: "white",
  },
  {
    id: "national-mfb",
    number: "03",
    name: "National Microfinance Banks",
    tagline: "Nationwide scale. Nationwide scrutiny.",
    stat: "8",
    statLabel: "National MFBs in Nigeria",
    description:
      "National MFBs are the largest category of microfinance institutions — operating in every state, with tens of thousands of customers and a compliance obligation that rivals commercial banks in complexity.\n\nAt this scale, a missed filing isn't just a fine. It's a headline. CBN examiners show up. Board members ask questions. The compliance team is under constant pressure to produce clean, accurate returns across all 5 regulators on time, every time.",
    pain: "Managing 16 mandatory returns across 5 regulators with a compliance team that can never be large enough.",
    solution:
      "RegCo becomes the compliance team's central hub. Every return generated from one dashboard. Every deadline tracked on one calendar. Every flag surfaced in one place.",
    returns: [
      "All 16 mandatory returns",
      "Live compliance health score",
      "Real-time AML flagging",
      "CBN CAMEL risk classification",
      "Customer 360 — every channel",
    ],
    layout: "dark",
  },
  {
    id: "pmb",
    number: "04",
    name: "Primary Mortgage Banks",
    tagline: "Complex loans. Strict oversight.",
    stat: "34",
    statLabel: "PMBs licensed by CBN",
    description:
      "Primary Mortgage Banks exist to help Nigerians buy homes. Their loan books are more complex than MFBs — longer tenors, larger amounts, stricter collateral requirements — and CBN watches them closely.\n\nThe CBN prudential return for PMBs requires detailed loan classification by sector, days-past-due, and collateral type. Getting it wrong means CBN questions your capital adequacy. Getting it right manually means a compliance officer spending days cross-referencing loan ledgers.",
    pain: "Generating accurate loan portfolio classification and CBN prudential returns from complex mortgage data.",
    solution:
      "Upload your loan portfolio data and RegCo classifies every borrower using CBN's CAMEL framework automatically. Provisions calculated at CBN-prescribed rates. Prudential return generated in minutes.",
    returns: [
      "CBN Prudential Return",
      "NDIC Premium Return",
      "Single Obligor Report",
      "Risk Analysis — CAMEL classification",
    ],
    layout: "grey",
  },
  {
    id: "finance-companies",
    number: "05",
    name: "Finance Companies & Fintechs",
    tagline: "Fast growth. Complex obligations.",
    stat: "150+",
    statLabel: "Finance companies in Nigeria",
    description:
      "Nigeria's finance companies and licensed fintechs are the fastest-growing category of financial institution. Some have millions of customers and billions in transaction volume — but their compliance teams are lean, their processes are newer, and the regulators are catching up fast.\n\nFIRS wants your VAT, PAYE, and CIT. SCUML wants your annual compliance report. NFIU wants your AML returns. CBN may be watching too. Most fintechs handle these in silos — one person for FIRS, another for SCUML, spreadsheets everywhere.",
    pain: "Coordinating compliance across FIRS, SCUML, and NFIU with a small team and no unified system.",
    solution:
      "RegCo brings every obligation into one dashboard. Generate your FIRS VAT return and your SCUML annual compliance report from the same platform on the same day.",
    returns: [
      "VAT Return — FIRS",
      "PAYE Remittance — FIRS",
      "WHT Return — FIRS",
      "CIT Return — FIRS",
      "SCUML Annual Compliance",
      "NFIU AML/CFT Report",
    ],
    layout: "white",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const InstitutionChapter = ({ inst }: { inst: Institution }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isDark = inst.layout === "dark";
  const bg = isDark ? "#0A0A0A" : inst.layout === "grey" ? "#F5F5F0" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#0A0A0A";
  const textMuted = isDark ? "rgba(255,255,255,0.7)" : "#525252";
  const textSubtle = isDark ? "rgba(255,255,255,0.5)" : "#737373";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
      style={{
        background: bg,
        borderRadius: 20,
        border: isDark ? "none" : "1px solid rgba(0,0,0,0.07)",
        padding: "64px",
        marginBottom: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: 40,
          fontSize: 200,
          fontWeight: 900,
          lineHeight: 1,
          color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-8px",
        }}
      >
        {inst.number}
      </div>

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, position: "relative", zIndex: 1, gap: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.4)" : "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {inst.number} / 05
          </span>
          <span
            style={{
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
              color: isDark ? "rgba(255,255,255,0.7)" : "#525252",
              borderRadius: 999,
              padding: "4px 14px",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {inst.name}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: 52, fontWeight: 900, color: textPrimary, margin: 0, letterSpacing: "-2px", lineHeight: 1 }}
          >
            {inst.stat}
          </motion.p>
          <p style={{ fontSize: 12, color: textSubtle, margin: "6px 0 0", maxWidth: 180 }}>{inst.statLabel}</p>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 56, position: "relative", zIndex: 1 }} className="chapter-grid">
        {/* Left — story */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.5)" : "#737373", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {inst.name}
          </p>
          <h3 style={{ fontSize: 36, fontWeight: 800, color: textPrimary, margin: "0 0 24px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            {inst.tagline}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {inst.description.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 15, color: textMuted, lineHeight: 1.7, margin: 0 }}>
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Right — cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              borderRadius: 12,
              padding: "20px 22px",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.07)",
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.5)" : "#9B9B9B", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              The Challenge
            </p>
            <p style={{ fontSize: 14, color: textPrimary, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{inst.pain}</p>
          </div>

          <div
            style={{
              background: isDark ? "rgba(255,255,255,0.07)" : "#0A0A0A",
              borderRadius: 12,
              padding: "20px 22px",
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              RegCo's Solution
            </p>
            <p style={{ fontSize: 14, color: "#FFFFFF", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{inst.solution}</p>
          </div>

          <div
            style={{
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
              borderRadius: 12,
              padding: "20px 22px",
              border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.5)" : "#9B9B9B", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Returns Automated
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {inst.returns.map((r) => (
                <span
                  key={r}
                  style={{
                    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    color: isDark ? "rgba(255,255,255,0.75)" : "#525252",
                    borderRadius: 999,
                    padding: "5px 12px",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UseCasesSection = () => (
  <section id="who-we-serve" style={{ background: "#F5F5F0", padding: "120px 0" }}>
    <style>{`
      @media (max-width: 860px) {
        .chapter-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        .who-we-serve-card { padding: 36px 24px !important; }
      }
    `}</style>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ textAlign: "center", marginBottom: 80 }}
      >
        <p style={{ fontSize: 11, color: "#9B9B9B", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px", fontWeight: 600 }}>
          WHO WE SERVE
        </p>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "#0A0A0A", letterSpacing: "-1.5px", lineHeight: 1.05, margin: "0 0 24px" }}>
          Built for every<br />licensed institution.
        </h2>
        <p style={{ fontSize: 17, color: "#525252", lineHeight: 1.6, maxWidth: 620, margin: "0 auto" }}>
          Whether you run a small Unit MFB in Kano or a nationwide Commercial Bank in Lagos — RegCo handles your regulatory filings automatically.
        </p>
      </motion.div>

      {institutions.map((inst) => (
        <div key={inst.id} className="who-we-serve-card-wrap">
          <InstitutionChapter inst={inst} />
        </div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          background: "#0A0A0A",
          borderRadius: 16,
          padding: "40px 56px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32,
          marginTop: 20,
        }}
        className="who-stats-bar"
      >
        {[
          { n: "1,000+", l: "Licensed institutions in Nigeria" },
          { n: "16", l: "Mandatory returns per institution per year" },
          { n: "₦2M", l: "Minimum CBN fine per late filing" },
        ].map((s) => (
          <div key={s.l}>
            <p style={{ fontSize: 40, fontWeight: 900, color: "#FFFFFF", margin: 0, letterSpacing: "-1.5px", lineHeight: 1 }}>{s.n}</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "8px 0 0", lineHeight: 1.4 }}>{s.l}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default UseCasesSection;
