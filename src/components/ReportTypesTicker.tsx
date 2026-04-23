import { RegCoMark } from "@/components/RegCoLogo";

const reportTypes = [
  "MFB Regulatory Return",
  "CBN Forex Return",
  "AML/CFT Compliance Report",
  "Prudential Return",
  "NFIU Regulatory Return",
  "SCUML Annual Report",
  "Monetary Policy Return",
];

const ReportTypesTicker = () => {
  // Duplicate for seamless infinite scroll
  const items = [...reportTypes, ...reportTypes];

  return (
    <section className="bg-[#0A0A0A] py-7 overflow-hidden">
      <div className="flex w-max animate-marquee gap-10">
        {items.map((label, i) => (
          <div key={`${label}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
            <span className="text-[16px] font-semibold text-white">{label}</span>
            <RegCoMark size={14} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReportTypesTicker;
