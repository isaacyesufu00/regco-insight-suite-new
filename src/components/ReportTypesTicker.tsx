const reportTypes = [
  "MFB Regulatory Return",
  "CBN Forex Return",
  "AML/CFT Compliance",
  "Prudential Return",
  "NFIU Return",
  "SCUML Annual Report",
  "Monetary Policy Return",
  "Payee Remittance",
  "Withholding Tax Return",
];

const Row = ({ direction }: { direction: "left" | "right" }) => {
  const items = [...reportTypes, ...reportTypes];
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className={direction === "left" ? "animate-marquee-left" : "animate-marquee-right"} style={{ display: "inline-flex" }}>
        {items.map((r, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-4" style={{ fontWeight: 600, fontSize: 16, color: "white" }}>
            {r}
            <span style={{ color: "rgba(255,255,255,0.3)" }}>■</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const ReportTypesTicker = () => (
  <section style={{ background: "#1D1D1F", padding: "40px 0", overflow: "hidden" }}>
    <Row direction="left" />
    <div className="h-4" />
    <Row direction="right" />
  </section>
);

export default ReportTypesTicker;
