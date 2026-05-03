const row1 = [
  "CBN Monetary Policy Return",
  "MFB Regulatory Return",
  "AML/CFT Compliance Report",
  "SCUML Annual Return",
  "NFIU Regulatory Return",
  "NDIC Premium Return",
  "Prudential Return",
];

const row2 = [
  "Payee Remittance",
  "Withholding Tax Return",
  "CBN Forex Return",
  "Single Obligor Limit Report",
  "Board & Governance Return",
  "Consumer Protection Report",
  "Financial Statement Filing",
];

const Row = ({ items, direction }: { items: string[]; direction: "left" | "right" }) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className={direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}
        style={{ display: "inline-flex" }}
      >
        {doubled.map((r, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-4" style={{ fontWeight: 600, fontSize: 15, color: "white" }}>
            {r}
            <span style={{ color: "rgba(255,255,255,0.25)" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const ReportTypesTicker = () => (
  <section style={{ background: "#1D1D1F", padding: "20px 0", overflow: "hidden" }}>
    <Row items={row1} direction="left" />
    <div className="h-3" />
    <Row items={row2} direction="right" />
  </section>
);

export default ReportTypesTicker;
