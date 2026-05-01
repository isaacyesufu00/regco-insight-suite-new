const items = [
  "CBN Compliant",
  "NDPC Registered",
  "256-bit Encrypted",
  "7 Report Types",
  "State MFB Certified",
  "Unit MFB Supported",
  "National MFB Ready",
  "NFIU Approved",
  "SCUML Recognized",
];

const Mark = () => (
  <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-[#86868B] mx-5 align-middle" />
);

const TrustBar = () => (
  <div className="w-full overflow-hidden py-3" style={{ background: "#F5F5F7", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
    <div className="flex w-max animate-marquee-slow">
      {[...Array(2)].map((_, dup) => (
        <div key={dup} className="flex items-center">
          {items.map((item, i) => (
            <span key={`${dup}-${i}`} className="text-[13px] font-normal text-[#86868B] whitespace-nowrap inline-flex items-center">
              {item}
              <Mark />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default TrustBar;
