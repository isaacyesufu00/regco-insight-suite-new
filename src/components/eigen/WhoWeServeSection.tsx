import { motion } from "framer-motion";

interface Institution {
  id: string;
  category: string;
  count: string;
  headline: string;
  description: string;
  price: string;
}

const institutions: Institution[] = [
  { id: "unit-mfb", category: "UNIT MFB", count: "847", headline: "Community financial institutions", description: "Single-branch microfinance banks serving one community. Typically one compliance officer handling 10 mandatory returns across 4 regulators every month.", price: "From ₦350k/month" },
  { id: "state-mfb", category: "STATE MFB", count: "126", headline: "State-wide microfinance networks", description: "Operating across an entire state with multiple branches. Consolidating data from multiple locations into a single unified return.", price: "From ₦700k/month" },
  { id: "national-mfb", category: "NATIONAL MFB", count: "8", headline: "Nationwide microfinance operations", description: "Present in every state with tens of thousands of customers. CBN examinations are frequent. Constant deadline pressure.", price: "From ₦1.5M/month" },
  { id: "pmb", category: "PRIMARY MORTGAGE", count: "34", headline: "Mortgage & housing finance", description: "Complex loan portfolios requiring CBN CAMEL classification. Prudential returns demand detailed borrower-level data.", price: "From ₦700k/month" },
  { id: "finance-co", category: "FINANCE COMPANY", count: "150+", headline: "Licensed financial companies", description: "Fast-growing fintech and finance companies managing FIRS, SCUML, and NFIU obligations.", price: "From ₦500k/month" },
  { id: "pencom", category: "PENCOM LICENSED", count: "42", headline: "Pension fund administrators & custodians", description: "PFAs, PFCs, and CPFAs regulated by PenCom. Quarterly RSA returns, investment compliance, and member data.", price: "From ₦900k/month" },
  { id: "commercial", category: "COMMERCIAL BANK", count: "26", headline: "Commercial & merchant banking", description: "Full regulatory complexity. All 16 returns, live transaction screening, board-level reporting under CBN's closest scrutiny.", price: "From ₦3M/month" },
];

const WhoWeServeSection = () => {
  return (
    <section id="who-we-serve" style={{ background: "#F5F5F0", padding: "120px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6B6B6B", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
            Who We Serve
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-1.5px", lineHeight: 1.06, margin: "0 0 16px" }}>
            Built for every <span style={{ fontStyle: "italic" }}>Nigerian financial institution.</span>
          </h2>
          <p style={{ fontSize: 17, color: "#6B6B6B", lineHeight: 1.6, maxWidth: 640, margin: "0 auto" }}>
            From single-branch unit MFBs to nationwide commercial banks — one platform, every regulator.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {institutions.map((inst, i) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 16,
                padding: 28,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6B6B6B", letterSpacing: "0.12em" }}>{inst.category}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#1A1A1A" }}>{inst.count}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", margin: "0 0 10px", lineHeight: 1.3 }}>{inst.headline}</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.6, margin: "0 0 20px", flex: 1 }}>{inst.description}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", margin: 0, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>{inst.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeServeSection;
