import { useState, useRef, useEffect } from "react";
import { AnimateIn } from "./AnimateIn";

const items = [
  {
    label: "Upload CBS Data",
    desc: "Upload your raw CBS data. Drop the trial balance or general ledger straight from Flexcube, Finacle, or any core banking system. No template required, no manual matching.",
    panel: "upload",
  },
  {
    label: "Automatic Field Mapping",
    desc: "RegCo reads every row and intelligently maps account codes to CBN field names using smart pattern recognition. Messy column names and inconsistent formats are handled automatically.",
    panel: "mapping",
  },
  {
    label: "5-Point Validation",
    desc: "Before generating anything RegCo checks balance sheet reconciliation, loan portfolio integrity, deposit categorisation, capital adequacy ratio above 10%, and liquidity ratio above 20%.",
    panel: "validation",
  },
  {
    label: "AI Report Generation",
    desc: "The AI engine generates all sections of your CBN return simultaneously — balance sheet, loan portfolio, capital adequacy, liquidity, and all KPIs — in under 5 minutes.",
    panel: "generation",
  },
  {
    label: "Download Your Return",
    desc: "Your completed CBN-formatted return downloads instantly. Every section the CBN, NFIU, SCUML, or NDIC portal requires — formatted precisely to specification.",
    panel: "download",
  },
  {
    label: "Email Notification",
    desc: "RegCo emails you when your report is ready with your CAR, liquidity ratio, and NPL ratio highlighted so you can review before submitting to the portal.",
    panel: "email",
  },
];

const HowItWorks = () => {
  const [active, setActive] = useState(0);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = items.map((_, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i); },
        { threshold: 0.5 }
      );
      if (triggerRefs.current[i]) observer.observe(triggerRefs.current[i]!);
      return observer;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section id="how-it-works" style={{ background: "#F5F5F7", padding: "120px 0", position: "relative" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimateIn>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 48px)", color: "#1D1D1F", marginBottom: 60 }}>
            How it works.
          </h2>
        </AnimateIn>

        <div className="flex gap-12" style={{ minHeight: 600 }}>
          {/* Left accordion */}
          <div className="w-[38%] shrink-0">
            {items.map((item, i) => (
              <div key={i} className="mb-3">
                <div ref={(el) => { triggerRefs.current[i] = el; }} />
                <button
                  onClick={() => setActive(i)}
                  className="w-full flex items-center gap-3 text-left transition-all"
                  style={{
                    background: "rgba(0,0,0,0.05)",
                    borderRadius: 980,
                    padding: "11px 18px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: active === i ? "none" : "1.5px solid rgba(0,0,0,0.25)",
                      background: active === i ? "#1D1D1F" : "transparent",
                      color: active === i ? "white" : "#1D1D1F",
                      fontSize: 16,
                      fontWeight: 300,
                      lineHeight: 1,
                    }}
                  >
                    {active === i ? "−" : "+"}
                  </div>
                  <span style={{ fontWeight: 500, fontSize: 17, color: "#1D1D1F" }}>{item.label}</span>
                </button>

                {/* Expanded description */}
                <div
                  style={{
                    maxHeight: active === i ? 300 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                  }}
                >
                  <div
                    style={{
                      background: "#EBEBF0",
                      borderRadius: 14,
                      padding: 20,
                      marginTop: 8,
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 15, color: "#1D1D1F" }}>{item.label}. </span>
                    <span style={{ fontWeight: 400, fontSize: 15, color: "#6E6E73" }}>{item.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right sticky panel */}
          <div className="flex-1 sticky top-[100px] self-start">
            <div
              style={{
                background: "white",
                borderRadius: 20,
                boxShadow: "0 4px 40px rgba(0,0,0,0.1)",
                overflow: "hidden",
                height: 480,
              }}
            >
              {items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    opacity: active === i ? 1 : 0,
                    transition: "opacity 0.4s",
                    position: active === i ? "relative" : "absolute",
                    inset: 0,
                    height: "100%",
                    display: active === i ? "flex" : "none",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 32,
                  }}
                >
                  <StepPanel step={item.panel} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StepPanel = ({ step }: { step: string }) => {
  const panels: Record<string, React.ReactNode> = {
    upload: (
      <div className="w-full text-center">
        <div className="w-full max-w-sm mx-auto border-2 border-dashed border-black/10 rounded-2xl p-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F5F7] flex items-center justify-center mb-4">
            <span className="text-xl">📄</span>
          </div>
          <p style={{ fontWeight: 600, fontSize: 16, color: "#1D1D1F" }}>Drop your CBS export</p>
          <p style={{ fontSize: 13, color: "#86868B", marginTop: 4 }}>.xlsx, .csv, .xls from any core banking system</p>
        </div>
      </div>
    ),
    mapping: (
      <div className="w-full space-y-3 max-w-sm mx-auto">
        <p style={{ fontWeight: 600, fontSize: 14, color: "#1D1D1F", marginBottom: 12 }}>Field Mapping</p>
        {[["GL_CODE_001", "Cash & Balances"], ["ACC_DEBIT_TOT", "Total Loans"], ["DEP_SAV_CURR", "Customer Deposits"]].map(([from, to]) => (
          <div key={from} className="flex items-center gap-3">
            <div className="flex-1 bg-[#F5F5F7] rounded-lg p-2.5 text-xs text-[#86868B] font-mono">{from}</div>
            <span className="text-[#86868B]">→</span>
            <div className="flex-1 bg-[#E8F5E9] rounded-lg p-2.5 text-xs text-[#2E7D32] font-medium">{to}</div>
          </div>
        ))}
      </div>
    ),
    validation: (
      <div className="w-full space-y-3 max-w-sm mx-auto">
        <p style={{ fontWeight: 600, fontSize: 14, color: "#1D1D1F", marginBottom: 12 }}>Validation Checks</p>
        {["Balance Sheet Reconciliation", "Loan Portfolio Integrity", "Deposit Categorisation", "CAR ≥ 10%", "Liquidity ≥ 20%"].map((check) => (
          <div key={check} className="flex items-center gap-3 py-2">
            <div className="w-5 h-5 rounded-full bg-[#34C759] flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span style={{ fontSize: 14, color: "#1D1D1F" }}>{check}</span>
          </div>
        ))}
      </div>
    ),
    generation: (
      <div className="w-full text-center">
        <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#0066CC] border-t-transparent animate-spin mb-6" />
        <p style={{ fontWeight: 600, fontSize: 16, color: "#1D1D1F" }}>Generating Report...</p>
        <p style={{ fontSize: 13, color: "#86868B", marginTop: 4 }}>Balance sheet, loans, capital adequacy, liquidity</p>
        <div className="mt-6 bg-[#F5F5F7] rounded-full h-2 max-w-xs mx-auto overflow-hidden">
          <div className="h-full bg-[#0066CC] rounded-full" style={{ width: "65%", transition: "width 1s" }} />
        </div>
      </div>
    ),
    download: (
      <div className="w-full text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#34C759]/10 flex items-center justify-center mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <p style={{ fontWeight: 600, fontSize: 16, color: "#1D1D1F" }}>Report Ready</p>
        <p style={{ fontSize: 13, color: "#86868B", marginTop: 4 }}>MFB Prudential Return — Q1 2026</p>
        <button className="mt-6 px-6 py-2.5 rounded-full text-sm font-medium" style={{ background: "#0066CC", color: "white" }}>
          Download Report
        </button>
      </div>
    ),
    email: (
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-[#F5F5F7] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-xs font-bold">R</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 13, color: "#1D1D1F" }}>RegCo</p>
              <p style={{ fontSize: 11, color: "#86868B" }}>Your report is ready</p>
            </div>
          </div>
          <div className="space-y-2">
            {[["CAR", "12.4%"], ["Liquidity", "28.1%"], ["NPL", "3.2%"]].map(([label, val]) => (
              <div key={label} className="flex justify-between bg-white rounded-lg p-2.5">
                <span style={{ fontSize: 13, color: "#6E6E73" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1D1D1F" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  };
  return <>{panels[step]}</>;
};

export default HowItWorks;
