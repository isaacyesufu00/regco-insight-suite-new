import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Circle } from "lucide-react";

const steps = [
  {
    title: "Upload CBS Data",
    desc: "Export your trial balance from Flexcube, Finacle, or any core banking system. RegCo accepts Excel and CSV in any column format.",
    panel: "upload",
  },
  {
    title: "Automatic Field Mapping",
    desc: "RegCo reads every row and intelligently maps account codes to CBN field names — no template required, no manual matching.",
    panel: "mapping",
  },
  {
    title: "5-Point Validation",
    desc: "Before generating anything, RegCo checks that your balance sheet reconciles, loans add up, deposits match, CAR is above 10%, and liquidity is above 20%.",
    panel: "validation",
  },
  {
    title: "AI Report Generation",
    desc: "The AI engine generates all sections of your CBN return simultaneously — balance sheet, loan portfolio, capital adequacy, liquidity, and KPIs.",
    panel: "generation",
  },
  {
    title: "Download Your Return",
    desc: "Your completed CBN-formatted return is ready to download as a text file within 5 minutes. It contains every section the CBN portal requires.",
    panel: "download",
  },
  {
    title: "Email Notification",
    desc: "RegCo emails you when your report is ready with your key ratios — CAR, liquidity ratio, and NPL — so you can review before submitting.",
    panel: "email",
  },
];

/* Right panel mockups */
const PanelContent = ({ panel }: { panel: string }) => {
  const mockCard = "bg-white rounded-[20px] p-6 md:p-8";
  const mockShadow = { boxShadow: "0 20px 60px rgba(0,0,0,0.1)" };

  if (panel === "upload") {
    return (
      <div className={mockCard} style={mockShadow}>
        <div className="border-2 border-dashed border-[rgba(0,0,0,0.12)] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          </div>
          <p className="text-[15px] font-medium text-[#1D1D1F]">trial_balance_q4.xlsx</p>
          <p className="text-[13px] text-[#6E6E73] mt-1">2.3 MB · Excel workbook</p>
        </div>
        <div className="mt-4 h-1.5 rounded-full bg-[#F5F5F7] overflow-hidden">
          <div className="h-full bg-[#0066CC] rounded-full" style={{ width: "100%" }} />
        </div>
        <p className="text-[13px] text-[#34C759] mt-2 font-medium">✓ Upload complete</p>
      </div>
    );
  }
  if (panel === "mapping") {
    return (
      <div className={mockCard} style={mockShadow}>
        <p className="text-[12px] text-[#6E6E73] uppercase tracking-wider font-medium mb-4">Field Mapping</p>
        {["Account Code → CBN Field", "GL Balance → Report Line", "Currency → Base Rate", "Branch → Consolidation"].map((m, i) => (
          <div key={m} className="flex items-center justify-between py-3" style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <span className="text-[14px] text-[#1D1D1F]">{m}</span>
            <span className="text-[12px] text-[#34C759] font-medium">Mapped</span>
          </div>
        ))}
      </div>
    );
  }
  if (panel === "validation") {
    const checks = ["Balance Sheet Reconciled", "Loan Portfolio Check", "Deposit Reconciliation", "Capital Adequacy: 30.4%", "Liquidity Ratio: 27.8%"];
    return (
      <div className={mockCard} style={mockShadow}>
        <p className="text-[12px] text-[#6E6E73] uppercase tracking-wider font-medium mb-4">5-Point Validation</p>
        {checks.map((c, i) => (
          <div key={c} className="flex items-center gap-3 py-2.5" style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <span className="w-6 h-6 rounded-full bg-[rgba(52,199,89,0.12)] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            </span>
            <span className="text-[14px] text-[#1D1D1F]">{c}</span>
          </div>
        ))}
      </div>
    );
  }
  if (panel === "generation") {
    return (
      <div className={mockCard} style={mockShadow}>
        <p className="text-[12px] text-[#6E6E73] uppercase tracking-wider font-medium mb-4">Generating Report</p>
        {["Balance Sheet", "Loan Portfolio", "Capital Adequacy", "Liquidity Analysis", "Key Performance Indicators"].map((s, i) => (
          <div key={s} className="flex items-center justify-between py-2.5" style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <span className="text-[14px] text-[#1D1D1F]">{s}</span>
            <span className="text-[12px] text-[#34C759] font-medium">Complete</span>
          </div>
        ))}
      </div>
    );
  }
  if (panel === "download") {
    return (
      <div className={mockCard} style={mockShadow}>
        <p className="text-[12px] text-[#6E6E73] uppercase tracking-wider font-medium">CBN Regulatory Return</p>
        <p className="text-[20px] font-bold text-[#1D1D1F] mt-2">Q4 2025 Return</p>
        <p className="text-[14px] text-[#6E6E73] mt-1">Nakdnx MFB Ltd.</p>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[{ l: "CAR", v: "30.4%" }, { l: "Liquidity", v: "27.8%" }, { l: "NPL", v: "1.9%" }].map((m) => (
            <div key={m.l} className="bg-[#F5F5F7] rounded-lg p-3 text-center">
              <div className="text-[10px] text-[#6E6E73] uppercase">{m.l}</div>
              <div className="text-[16px] font-bold text-[#1D1D1F] mt-1">{m.v}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          {["PDF", "Excel", "Word"].map((f, i) => (
            <span key={f} className="px-4 py-2 rounded-full text-[13px] font-medium" style={{
              background: i === 0 ? "#0066CC" : "rgba(0,0,0,0.06)",
              color: i === 0 ? "#FFFFFF" : "#1D1D1F",
            }}>{f}</span>
          ))}
        </div>
      </div>
    );
  }
  // email
  return (
    <div className={mockCard} style={mockShadow}>
      <p className="text-[12px] text-[#6E6E73] uppercase tracking-wider font-medium mb-4">Email Notification</p>
      <div className="bg-[#F5F5F7] rounded-2xl p-5">
        <p className="text-[13px] text-[#6E6E73]">From: RegCo Compliance</p>
        <p className="text-[13px] text-[#6E6E73]">Subject: Your Q4 Return is Ready</p>
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <p className="text-[14px] text-[#1D1D1F]">Your CBN regulatory return has been generated.</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[{ l: "CAR", v: "30.4%" }, { l: "Liquidity", v: "27.8%" }, { l: "NPL", v: "1.9%" }].map((m) => (
              <div key={m.l} className="text-center">
                <div className="text-[10px] text-[#6E6E73] uppercase">{m.l}</div>
                <div className="text-[15px] font-bold text-[#1D1D1F]">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setRef = useCallback((el: HTMLDivElement | null, i: number) => {
    itemRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i); },
        { threshold: 0.6, rootMargin: "-30% 0px -30% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="py-[120px]" style={{ background: "#F5F5F7" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 22px" }}>
        <h2 className="text-[48px] font-bold text-[#1D1D1F] mb-16" style={{ letterSpacing: "-0.5px" }}>
          How RegCo works.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-10 lg:gap-16">
          {/* Left — accordion */}
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => setRef(el, i)}
                className="transition-all duration-400"
              >
                <button
                  onClick={() => setActive(i)}
                  className="w-full flex items-center gap-3 text-left"
                  style={{
                    background: active === i ? "#F5F5F7" : "rgba(0,0,0,0.04)",
                    borderRadius: 980,
                    padding: "10px 18px",
                    transition: "background 0.25s",
                  }}
                >
                  {active === i ? (
                    <Circle size={18} className="text-[#1D1D1F] flex-shrink-0" fill="#1D1D1F" />
                  ) : (
                    <Plus size={18} className="text-[#6E6E73] flex-shrink-0" />
                  )}
                  <span className="text-[17px] font-medium text-[#1D1D1F]">{step.title}</span>
                </button>

                <div
                  style={{
                    maxHeight: active === i ? 200 : 0,
                    opacity: active === i ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease",
                  }}
                >
                  <div className="bg-[#F5F5F7] rounded-2xl p-4 mt-2 ml-9">
                    <p className="text-[15px] text-[#6E6E73]" style={{ lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right — sticky panel */}
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            <div style={{ transition: "opacity 0.35s ease" }} key={active}>
              <PanelContent panel={steps[active].panel} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
