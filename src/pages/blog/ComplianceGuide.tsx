import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PageShell, PageHero } from "@/components/eigen/PageShell";

const toc = [
  { id: "cbn", label: "CBN Returns" },
  { id: "nfiu", label: "NFIU Returns" },
  { id: "scuml", label: "SCUML Returns" },
  { id: "ndic", label: "NDIC Returns" },
  { id: "firs", label: "FIRS Returns" },
  { id: "deadlines", label: "Filing Deadlines" },
  { id: "penalties", label: "Common Penalties" },
];

const sections: Record<string, { heading: string; lead: string; rows?: string[][]; bullets?: string[] }> = {
  cbn: {
    heading: "CBN — Central Bank of Nigeria",
    lead: "Every CBN-licensed institution must file between 6 and 10 mandatory returns to the CBN per year. These cover your institution's financial position, capital adequacy, foreign exchange transactions, and governance standards.",
    rows: [
      ["MFB Regulatory Return", "Monthly", "Balance sheet, deposits, loans, CAR", "₦2,000,000"],
      ["Monetary Policy Return", "Monthly", "Interest rates, monetary aggregates", "₦2,000,000"],
      ["Prudential Return", "Monthly", "Risk assets, NPL ratio, provisions", "₦2,000,000"],
      ["CBN Forex Return", "Weekly/Monthly", "FX transactions, positions", "₦2,000,000"],
      ["Board Governance Return", "Bi-annual", "Directors, ownership structure", "₦2,000,000"],
      ["Consumer Protection Return", "Quarterly", "Complaints received and resolved", "₦2,000,000"],
    ],
  },
  nfiu: {
    heading: "NFIU — Nigerian Financial Intelligence Unit",
    lead: "All financial institutions must file AML/CFT compliance returns to the NFIU and report suspicious transactions in real time.",
    rows: [
      ["AML/CFT Compliance Report", "Quarterly", "STRs, CTRs, training", "₦2,500,000"],
      ["International Transfers Report", "Quarterly", "Cross-border wires by corridor", "₦2,000,000"],
      ["NFIU Regulatory Return", "Quarterly", "Risk assessments, controls", "₦2,000,000"],
    ],
  },
  scuml: {
    heading: "SCUML — Special Control Unit Against Money Laundering",
    lead: "Designated non-financial businesses and financial institutions providing certain services must register with SCUML and file annual compliance reports.",
    rows: [
      ["SCUML Annual Compliance", "Annual", "AML programme, KYC stats, training", "₦1,000,000"],
      ["SCUML Registration Renewal", "Annual", "Updated KYC and ownership", "Suspension of registration"],
    ],
  },
  ndic: {
    heading: "NDIC — Nigeria Deposit Insurance Corporation",
    lead: "Every deposit-taking institution must file premium returns and large exposure reports with the NDIC.",
    rows: [
      ["NDIC Premium Return", "Annual", "Insured deposits, premium computation", "₦2,000,000"],
      ["Single Obligor Report", "Quarterly", "Large exposures, capital base", "₦2,000,000"],
    ],
  },
  firs: {
    heading: "FIRS — Federal Inland Revenue Service",
    lead: "All registered taxpayers must file monthly VAT, PAYE, and Withholding Tax returns, and an annual Company Income Tax return.",
    rows: [
      ["VAT Return", "Monthly", "Output VAT, input VAT, net payable", "10% of tax + ₦50,000/mo"],
      ["PAYE Remittance", "Monthly", "Employee gross salary, PAYE deducted", "10% of tax + ₦50,000/mo"],
      ["Withholding Tax Return", "Monthly", "WHT deducted at source, payees", "10% of tax + ₦50,000/mo"],
      ["Company Income Tax Return", "Annual", "Assessable profit, CIT, education tax", "10% of tax + ₦50,000/mo"],
    ],
  },
  deadlines: {
    heading: "Filing Deadlines",
    lead: "Missing a regulatory deadline is the single largest source of preventable penalties.",
    bullets: [
      "Monthly returns: due by the 15th of the following month",
      "Quarterly returns: due 30 days after quarter end",
      "Annual returns: due by March 31 of the following year (FIRS CIT: June 30)",
    ],
  },
  penalties: {
    heading: "Common Penalties",
    lead: "Nigerian regulators publish their penalty schedules — the most common are listed below.",
    bullets: [
      "Late filing: minimum ₦2,000,000 per return",
      "Incorrect filing: ₦500,000 to ₦2,000,000 depending on severity",
      "Non-filing: ₦5,000,000 and possible license suspension",
      "FIRS late filing: 10% of tax due plus ₦50,000 per month",
    ],
  },
};

const Table = ({ rows }: { rows: string[][] }) => (
  <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", background: "#FFFFFF", marginTop: 20 }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          {["Return", "Frequency", "Key Data Required", "Penalty"].map((h) => (
            <th key={h} style={{ textAlign: "left", padding: "14px 16px", fontWeight: 700, color: "#0A0A0A", borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#FAFAF6" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "14px 16px", color: "#3A3A3A", borderBottom: i === rows.length - 1 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Section = ({ id, data }: { id: string; data: typeof sections[string] }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{ scrollMarginTop: 120, paddingBottom: 64 }}
    >
      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 12px" }}>{data.heading}</h2>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4A4A4A", margin: 0 }}>{data.lead}</p>
      {data.rows && <Table rows={data.rows} />}
      {data.bullets && (
        <ul style={{ margin: "20px 0 0", padding: "0 0 0 20px" }}>
          {data.bullets.map((b) => (
            <li key={b} style={{ fontSize: 15, color: "#3A3A3A", lineHeight: 1.7, marginBottom: 8 }}>{b}</li>
          ))}
        </ul>
      )}
    </motion.section>
  );
};

const ComplianceGuide = () => {
  const [active, setActive] = useState(toc[0].id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    toc.forEach((t) => { const el = document.getElementById(t.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <PageShell>
      <PageHero label="COMPLIANCE GUIDE" title="Nigerian Regulatory Filing Guide" subtitle="Everything a compliance officer needs to know about mandatory regulatory returns in Nigeria." />
      <section style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "220px 1fr", gap: 56 }} className="guide-grid">
          <aside style={{ position: "sticky", top: 100, alignSelf: "start", display: "none" }} className="guide-toc">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9B9B9B", margin: "0 0 16px" }}>Contents</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, borderLeft: "1px solid rgba(0,0,0,0.1)" }}>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} style={{
                    display: "block", padding: "8px 16px", fontSize: 13,
                    color: active === t.id ? "#0A0A0A" : "#6B6B6B",
                    fontWeight: active === t.id ? 600 : 400,
                    borderLeft: active === t.id ? "2px solid #0A0A0A" : "2px solid transparent",
                    marginLeft: -1, textDecoration: "none", transition: "all 0.2s",
                  }}>{t.label} →</a>
                </li>
              ))}
            </ul>
          </aside>
          <div>
            {toc.map((t) => <Section key={t.id} id={t.id} data={sections[t.id]} />)}
          </div>
        </div>
      </section>
      <style>{`@media (min-width: 1024px) { .guide-grid { grid-template-columns: 220px 1fr !important; } .guide-toc { display: block !important; } } @media (max-width: 1023px) { .guide-grid { grid-template-columns: 1fr !important; } }`}</style>
    </PageShell>
  );
};

export default ComplianceGuide;
