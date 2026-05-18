import { motion } from "framer-motion";
import { FileText, Activity, Users, BarChart2 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const ReportTypeMini = () => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
    {["CBN", "NFIU", "SCUML", "NDIC", "FIRS"].map((t, i) => (
      <span
        key={t}
        style={{
          padding: "4px 10px",
          borderRadius: 4,
          background: i === 0 ? "#4CAF50" : "rgba(0,0,0,0.05)",
          color: i === 0 ? "#fff" : "#6B6B6B",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}
      >
        {t}
      </span>
    ))}
  </div>
);

const FlaggedRows = () => (
  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
    {[
      { name: "TXN-08821", amt: "₦9,800,000", level: "CRITICAL", color: "#FF3B30" },
      { name: "TXN-08819", amt: "₦4,200,000", level: "HIGH", color: "#FF9F0A" },
    ].map((r) => (
      <div key={r.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#F8F8F4", borderRadius: 6, fontSize: 11 }}>
        <span style={{ color: "#1A1A1A", fontWeight: 600 }}>{r.name}</span>
        <span style={{ color: "#6B6B6B" }}>{r.amt}</span>
        <span style={{ background: r.color + "20", color: r.color, padding: "2px 8px", borderRadius: 10, fontSize: 9, fontWeight: 700 }}>{r.level}</span>
      </div>
    ))}
  </div>
);

const CustomerMini = () => (
  <div style={{ marginTop: 16, padding: 12, background: "#F8F8F4", borderRadius: 8 }}>
    <p style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>Adebayo Okonkwo</p>
    <p style={{ fontSize: 10, color: "#9B9B9B", margin: "2px 0" }}>BVN: 22198765432</p>
    <span style={{ display: "inline-block", background: "rgba(76,175,80,0.15)", color: "#2D6A4F", padding: "2px 8px", borderRadius: 10, fontSize: 9, fontWeight: 700 }}>LOW RISK</span>
  </div>
);

const DonutMini = () => (
  <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
    <svg width="90" height="90" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F0EFEA" strokeWidth="3.5" />
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4CAF50" strokeWidth="3.5" strokeDasharray="65 100" strokeDashoffset="25" transform="rotate(-90 18 18)" />
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FF9F0A" strokeWidth="3.5" strokeDasharray="20 100" strokeDashoffset="-40" transform="rotate(-90 18 18)" />
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FF3B30" strokeWidth="3.5" strokeDasharray="15 100" strokeDashoffset="-60" transform="rotate(-90 18 18)" />
      <text x="18" y="20" textAnchor="middle" fontSize="6" fontWeight="700" fill="#1A1A1A">CAMEL</text>
    </svg>
  </div>
);

const cards = [
  { icon: FileText, title: "Report Generation", desc: "Generate all 16 CBN, NFIU, SCUML, NDIC and FIRS returns from a single file upload.", inner: <ReportTypeMini /> },
  { icon: Activity, title: "Transaction Monitor", desc: "Upload transaction data for instant AML analysis across 6 CBN flagging rules.", inner: <FlaggedRows /> },
  { icon: Users, title: "Customer Intelligence", desc: "Search any customer by BVN or account. See all accounts, KYC status, and transaction history.", inner: <CustomerMini /> },
  { icon: BarChart2, title: "Risk Analysis", desc: "CBN CAMEL loan classification. Automatic provision calculation at CBN rates.", inner: <DonutMini /> },
];

const PlatformSection = () => (
  <section style={{ background: "#F5F5F0", padding: "80px 0" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginBottom: 48 }}>
        <ScrollReveal>
          <h2 style={{ fontSize: 44, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-1px", lineHeight: 1.1, maxWidth: 380, margin: 0 }}>
            All-in-one platform for compliance you can rely on.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p style={{ fontSize: 14, color: "#6B6B6B", maxWidth: 320, lineHeight: 1.7, margin: 0, justifySelf: "end" }}>
            RegCo's platform covers the entire lifecycle of your compliance obligations, not just the filings.
          </p>
        </ScrollReveal>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
      >
        {cards.map((c) => (
          <motion.div
            key={c.title}
            variants={fadeUp}
            whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.07)",
              padding: 28,
              transition: "box-shadow 0.2s",
            }}
          >
            <c.icon size={22} color="#4CAF50" />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "14px 0 6px" }}>{c.title}</h3>
            <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.55, margin: 0 }}>{c.desc}</p>
            {c.inner}
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default PlatformSection;
