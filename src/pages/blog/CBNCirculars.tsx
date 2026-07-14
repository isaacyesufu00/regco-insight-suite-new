import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PageShell, PageHero, ContentSection } from "@/components/eigen/PageShell";

const circulars = [
  { ref: "CBN/FPR/DIR/GEN/CIR/2024/001", date: "January 2024", title: "Revised Regulatory Capital Requirements for Microfinance Banks", summary: "The CBN revised minimum capital requirements for all MFB categories. Unit MFBs: ₦200M. State MFBs: ₦1B. National MFBs: ₦5B. Institutions have until December 2026 to comply.", tags: ["MFB", "Capital", "Prudential"] },
  { ref: "NFIU/CGF/I/2023/001", date: "March 2023", title: "Revised AML/CFT Compliance Framework for Financial Institutions", summary: "Updated AML/CFT programme requirements including enhanced customer due diligence, beneficial ownership identification, and quarterly reporting obligations.", tags: ["AML/CFT", "NFIU", "Compliance"] },
  { ref: "BSD/DIR/GEN/LAB/12/036", date: "2022", title: "Consumer Protection Framework — Complaints Resolution Requirements", summary: "All institutions must maintain a formal complaints register and report quarterly to CBN on complaints received, resolved, and pending.", tags: ["Consumer Protection", "Quarterly Return"] },
  { ref: "FPR/DIR/GEN/CIR/2021/002", date: "2021", title: "Guidelines on Dormant Accounts and Unclaimed Balances", summary: "Institutions must report dormant accounts annually to CBN. Accounts inactive for 6 years are to be surrendered to the Unclaimed Balances Trust Fund.", tags: ["CBN", "Annual", "Dormant Accounts"] },
  { ref: "SCUML/001/2022", date: "2022", title: "SCUML Registration Renewal Requirements for Financial Institutions", summary: "All financial institutions must renew their SCUML registration annually and file the Annual Compliance Report within 30 days of year end.", tags: ["SCUML", "Annual", "Registration"] },
];

const Card = ({ c, i }: { c: typeof circulars[number]; i: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: 28, marginBottom: 16 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#6B6B6B", margin: 0, fontFamily: "monospace" }}>{c.ref}</p>
        <p style={{ fontSize: 12, color: "#9B9B9B", margin: 0 }}>{c.date}</p>
      </div>
      <h3 style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.35, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{c.title}</h3>
      <p style={{ fontSize: 14, color: "#4A4A4A", lineHeight: 1.65, margin: "0 0 16px" }}>{c.summary}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {c.tags.map((t) => (
          <span key={t} style={{ fontSize: 11, color: "#3A3A3A", background: "#F0EFE9", padding: "4px 10px", borderRadius: 999, fontWeight: 500 }}>{t}</span>
        ))}
      </div>
      <a href="https://www.cbn.gov.ng" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", textDecoration: "none" }}>View on CBN website →</a>
    </motion.article>
  );
};

const CBNCirculars = () => (
  <PageShell>
    <PageHero label="CBN CIRCULARS" title="Recent CBN Regulatory Updates" subtitle="Key circulars and guidelines from the the Central Bank relevant to licensed financial institutions." />
    <ContentSection>
      <div style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: 20, marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: "#3A3A3A", lineHeight: 1.65, margin: 0 }}>
          RegCo monitors CBN circulars and updates its return templates automatically. When a circular changes a filing requirement, RegCo's AI prompts are updated.
        </p>
      </div>
      {circulars.map((c, i) => <Card key={c.ref} c={c} i={i} />)}
    </ContentSection>
  </PageShell>
);

export default CBNCirculars;
