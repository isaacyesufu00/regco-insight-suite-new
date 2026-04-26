import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Check, FileSpreadsheet, FileText } from "lucide-react";

/* ----------------------------- Mockups ----------------------------- */

const UploadMockup = ({ progress }: { progress: MotionValue<number> }) => {
  const widthPct = useTransform(progress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);
  const showCheck = useTransform(progress, (v) => (v > 0.95 ? 1 : 0));
  return (
    <div
      className="rounded-[20px] p-8"
      style={{
        background: "#1A1A1A",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 60px rgba(255,98,0,0.10)",
      }}
    >
      <div
        className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-10 px-6"
        style={{ borderColor: "rgba(255,255,255,0.18)" }}
      >
        <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center mb-4">
          <FileSpreadsheet className="w-6 h-6 text-white" />
        </div>
        <p className="text-white/85 text-sm font-medium">nakdnx_cbs_march_2026.xlsx</p>
        <p className="text-white/40 text-xs mt-1">2.3 MB · Excel workbook</p>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-white/55 mb-2">
          <span>Uploading…</span>
          <motion.span style={{ opacity: showCheck }} className="text-emerald-400 inline-flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Uploaded
          </motion.span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div className="h-full bg-brand-gradient" style={{ width: widthPct }} />
        </div>
      </div>
    </div>
  );
};

const validations = [
  { label: "Balance Sheet Reconciled", detail: "₦50,000,000 = ₦35,000,000 + ₦15,000,000" },
  { label: "Loan Portfolio Check", detail: "Gross = Performing + NPL" },
  { label: "Deposit Reconciliation", detail: "All categories verified" },
  { label: "Capital Adequacy Ratio", detail: "30.4% — above 10% minimum" },
  { label: "Liquidity Ratio", detail: "27.8% — above 20% minimum" },
];

const ValidationRow = ({
  label,
  detail,
  progress,
  threshold,
}: {
  label: string;
  detail: string;
  progress: MotionValue<number>;
  threshold: number;
}) => {
  const opacity = useTransform(progress, [threshold - 0.05, threshold], [0, 1]);
  const x = useTransform(progress, [threshold - 0.05, threshold], [-12, 0]);
  return (
    <motion.div
      style={{ opacity, x, background: "rgba(255,255,255,0.04)", borderLeft: "3px solid #22c55e" }}
      className="flex items-center justify-between rounded-[10px] py-3 px-4"
    >
      <div className="flex items-center gap-3">
        <span
          className="w-7 h-7 rounded-full inline-flex items-center justify-center"
          style={{ background: "rgba(34,197,94,0.18)" }}
        >
          <Check className="w-4 h-4 text-emerald-400" />
        </span>
        <div>
          <p className="text-white text-sm font-semibold">{label}</p>
          <p className="text-white/45 text-xs mt-0.5">{detail}</p>
        </div>
      </div>
      <span
        className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
        style={{
          background: "rgba(34,197,94,0.15)",
          color: "#22c55e",
          border: "1px solid rgba(34,197,94,0.3)",
        }}
      >
        PASSED
      </span>
    </motion.div>
  );
};

const ValidationMockup = ({ progress }: { progress: MotionValue<number> }) => (
  <div
    className="rounded-[20px] p-6"
    style={{
      background: "#1A1A1A",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 0 60px rgba(34,197,94,0.08)",
    }}
  >
    <div className="space-y-2.5">
      {validations.map((v, i) => (
        <ValidationRow
          key={v.label}
          label={v.label}
          detail={v.detail}
          progress={progress}
          threshold={(i + 1) / (validations.length + 1)}
        />
      ))}
    </div>
  </div>
);

const ReportMockup = ({ progress }: { progress: MotionValue<number> }) => {
  const y = useTransform(progress, [0, 0.4], [-30, 0]);
  const opacity = useTransform(progress, [0, 0.3], [0, 1]);
  return (
    <motion.div
      style={{ y, opacity }}
      className="rounded-[20px] overflow-hidden bg-white"
    >
      <div className="bg-brand-gradient h-2" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-brand-gradient inline-flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </span>
            <span className="text-[#0A0A0A] font-bold tracking-tight">RegCo</span>
          </div>
          <span className="text-[10px] text-[#888] uppercase tracking-wider">Submission Ready</span>
        </div>
        <p className="text-[10px] text-[#888] uppercase tracking-[0.15em] font-semibold">
          Central Bank of Nigeria — MFB Regulatory Return
        </p>
        <h4 className="text-[#0A0A0A] text-xl font-bold mt-1">Nakdnx MFB Ltd.</h4>
        <p className="text-[#666] text-sm mt-0.5">Period: 01 Mar 2026 → 31 Mar 2026</p>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { l: "CAR", v: "30.4%" },
            { l: "Liquidity", v: "27.8%" },
            { l: "NPL", v: "1.9%" },
          ].map((m) => (
            <div key={m.l} className="rounded-lg border border-[#EEE] p-3">
              <p className="text-[10px] text-[#888] uppercase tracking-wider">{m.l}</p>
              <p className="text-[#0A0A0A] font-bold text-base mt-0.5">{m.v}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-5">
          <button className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-brand-gradient">
            PDF
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#0A0A0A] border border-[#E0E0E0]">
            Excel
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#0A0A0A] border border-[#E0E0E0]">
            Word
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ----------------------------- Step Panel ----------------------------- */

interface StepPanelProps {
  number: string;
  title: string;
  description: string;
  opacity: MotionValue<number>;
  x: MotionValue<number>;
  children: React.ReactNode;
}

const StepPanel = ({ number, title, description, opacity, x, children }: StepPanelProps) => (
  <motion.div
    style={{ opacity }}
    className="absolute inset-0 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 lg:gap-16 items-center"
  >
    <motion.div style={{ x }}>
      <div
        className="text-[120px] font-black leading-none text-brand-gradient"
        style={{ letterSpacing: "-0.05em" }}
      >
        {number}
      </div>
      <h3
        className="mt-4 text-3xl md:text-4xl font-bold text-white"
        style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
      >
        {title}
      </h3>
      <p className="mt-4 text-[15px] md:text-base text-white/55 max-w-[420px] leading-relaxed">
        {description}
      </p>
    </motion.div>
    <div className="w-full max-w-[520px] mx-auto">{children}</div>
  </motion.div>
);

/* ----------------------------- Section ----------------------------- */

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Segments: 0–0.20 intro, 0.20–0.45 step1, 0.45–0.70 step2, 0.70–1.00 step3
  const introOpacity = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);

  const step1Opacity = useTransform(scrollYProgress, [0.2, 0.25, 0.42, 0.47], [0, 1, 1, 0]);
  const step1X = useTransform(scrollYProgress, [0.2, 0.27], [-40, 0]);
  const step1Progress = useTransform(scrollYProgress, [0.22, 0.4], [0, 1]);

  const step2Opacity = useTransform(scrollYProgress, [0.47, 0.5, 0.67, 0.72], [0, 1, 1, 0]);
  const step2X = useTransform(scrollYProgress, [0.47, 0.52], [-40, 0]);
  const step2Progress = useTransform(scrollYProgress, [0.5, 0.67], [0, 1]);

  const step3Opacity = useTransform(scrollYProgress, [0.72, 0.76, 1], [0, 1, 1]);
  const step3X = useTransform(scrollYProgress, [0.72, 0.78], [-40, 0]);
  const step3Progress = useTransform(scrollYProgress, [0.74, 0.95], [0, 1]);

  // Progress rail fill height
  const railFill = useTransform(scrollYProgress, [0.18, 0.98], ["0%", "100%"]);

  // Dot active states
  const dot1Bg = useTransform(scrollYProgress, (v) => (v >= 0.25 ? "#FF6200" : "rgba(255,255,255,0.2)"));
  const dot2Bg = useTransform(scrollYProgress, (v) => (v >= 0.5 ? "#FF6200" : "rgba(255,255,255,0.2)"));
  const dot3Bg = useTransform(scrollYProgress, (v) => (v >= 0.76 ? "#FF6200" : "rgba(255,255,255,0.2)"));

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ background: "#0A0A0A", height: "400vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 h-full relative">
          {/* Section eyebrow */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-semibold">
              How RegCo Works
            </p>
          </div>

          {/* Intro */}
          <motion.div
            style={{ opacity: introOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          >
            <h2
              className="text-5xl md:text-7xl font-black text-white"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              Three steps.
            </h2>
            <p className="mt-5 text-lg md:text-xl text-white/55 max-w-xl">
              From raw CBS data to a CBN-ready submission.
            </p>
          </motion.div>

          {/* Steps stage */}
          <div className="absolute inset-0 flex items-center pt-20 pb-10 px-2 md:px-12">
            <div className="relative w-full h-[70vh] md:h-[68vh]">
              <StepPanel
                number="01"
                title="Upload Your CBS Export"
                description="Drop the trial balance or general ledger straight from Flexcube, Finacle, or any core banking system. No manual extraction. RegCo reads every row automatically."
                opacity={step1Opacity}
                x={step1X}
              >
                <UploadMockup progress={step1Progress} />
              </StepPanel>

              <StepPanel
                number="02"
                title="Automatic Mapping and Validation"
                description="RegCo parses every sheet, maps account codes, reconciles totals, and calculates CAR, liquidity ratio, and NPL automatically. Five checks run in under 3 seconds."
                opacity={step2Opacity}
                x={step2X}
              >
                <ValidationMockup progress={step2Progress} />
              </StepPanel>

              <StepPanel
                number="03"
                title="Download Submission-Ready Report"
                description="Get a fully formatted CBN, NFIU, or SCUML return in PDF, Excel, or Word — ready to file in under five minutes. RegCo emails it to you automatically."
                opacity={step3Opacity}
                x={step3X}
              >
                <ReportMockup progress={step3Progress} />
              </StepPanel>
            </div>
          </div>

          {/* Progress rail */}
          <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 h-[55vh] w-px">
            <div className="relative w-px h-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <motion.div
                className="absolute top-0 left-0 w-px bg-brand-gradient"
                style={{ height: railFill }}
              />
              {[
                { top: "25%", bg: dot1Bg },
                { top: "50%", bg: dot2Bg },
                { top: "75%", bg: dot3Bg },
              ].map((d, i) => (
                <motion.span
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                  style={{
                    top: d.top,
                    left: 0,
                    background: d.bg,
                    boxShadow: "0 0 0 3px #0A0A0A",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
