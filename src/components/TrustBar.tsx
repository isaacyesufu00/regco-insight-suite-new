/**
 * TrustBar — thin horizontal strip of compliance/credential labels.
 * Auto-scrolls on small screens via the marquee utility.
 */
const labels = [
  "CBN Compliant",
  "NDPC Registered",
  "256-bit Encrypted",
  "7 Report Types",
  "Unit MFB",
  "State MFB",
  "National MFB",
  "Commercial Bank",
  "NFIU Approved",
  "SCUML Certified",
];

const TrustBar = () => {
  return (
    <section className="border-t border-border bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Desktop: even row */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {labels.map((l) => (
            <span
              key={l}
              className="text-[13px] font-medium text-[#AAA] tracking-wide whitespace-nowrap"
            >
              {l}
            </span>
          ))}
        </div>

        {/* Mobile: marquee */}
        <div className="md:hidden overflow-hidden">
          <div className="flex w-max animate-marquee gap-10">
            {[...labels, ...labels].map((l, i) => (
              <span
                key={`${l}-${i}`}
                className="text-[13px] font-medium text-[#AAA] tracking-wide whitespace-nowrap"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
