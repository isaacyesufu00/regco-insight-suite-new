import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

const stages = [
  { id: 0, range: [0, 0.15] },
  { id: 1, range: [0.15, 0.30] },
  { id: 2, range: [0.30, 0.45] },
  { id: 3, range: [0.45, 0.65] },
  { id: 4, range: [0.65, 0.80] },
  { id: 5, range: [0.80, 1.0] },
];

const DashboardShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [activeStage, setActiveStage] = useState(0);

  scrollYProgress.on("change", (v) => {
    const s = stages.findIndex((st) => v >= st.range[0] && v < st.range[1]);
    if (s >= 0) setActiveStage(s);
  });

  const jumpTo = (dir: number) => {
    const next = Math.max(0, Math.min(5, activeStage + dir));
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop + containerRef.current.scrollHeight * stages[next].range[0];
    window.scrollTo({ top, behavior: "smooth" });
  };

  const opacity0 = useTransform(scrollYProgress, [0, 0.05, 0.12, 0.15], [0, 1, 1, 0]);
  const opacity1 = useTransform(scrollYProgress, [0.15, 0.2, 0.27, 0.30], [0, 1, 1, 0]);
  const tilt1 = useTransform(scrollYProgress, [0.15, 0.25], [12, 2]);
  const scale1 = useTransform(scrollYProgress, [0.15, 0.25], [0.88, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.30, 0.35, 0.42, 0.45], [0, 1, 1, 0]);
  const x2 = useTransform(scrollYProgress, [0.30, 0.37], [100, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.50, 0.60, 0.65], [0, 1, 1, 0]);
  const opacity4 = useTransform(scrollYProgress, [0.65, 0.70, 0.77, 0.80], [0, 1, 1, 0]);
  const scale4 = useTransform(scrollYProgress, [0.65, 0.73], [0.7, 1]);
  const opacity5 = useTransform(scrollYProgress, [0.80, 0.85, 1.0], [0, 1, 1]);

  return (
    <section ref={containerRef} id="platform" style={{ height: "600vh", position: "relative", background: "#000" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Nav arrows */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
          <button onClick={() => jumpTo(-1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <ChevronUp className="w-4 h-4 text-white/60" />
          </button>
          <span className="text-white/40 text-xs">{activeStage + 1}/6</span>
          <button onClick={() => jumpTo(1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <ChevronDown className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Stage 0 */}
        <motion.div style={{ opacity: opacity0 }} className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 52px)", color: "white", textAlign: "center", maxWidth: 700 }}>
            Every compliance deadline. Under control.
          </h2>
          <p style={{ fontWeight: 400, fontSize: 19, color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 16 }}>
            A complete walkthrough of RegCo.
          </p>
        </motion.div>

        {/* Stage 1 - Dashboard */}
        <motion.div style={{ opacity: opacity1 }} className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <motion.div
            style={{
              perspective: 2000,
              rotateX: tilt1,
              scale: scale1,
              maxWidth: 1100,
              width: "100%",
            }}
          >
            <div className="w-full aspect-[16/10] rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center" style={{ boxShadow: "0 0 80px rgba(255,255,255,0.06)" }}>
              <DashboardMockup />
            </div>
          </motion.div>
          <p style={{ fontWeight: 400, fontSize: 17, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 24 }}>
            The RegCo dashboard. Everything your compliance team needs.
          </p>
        </motion.div>

        {/* Stage 2 - Reports */}
        <motion.div style={{ opacity: opacity2, x: x2 }} className="absolute inset-0 flex items-center justify-center px-8">
          <div className="relative max-w-[1100px] w-full">
            <div className="w-full aspect-[16/10] rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
              <ReportsMockup />
            </div>
            <div className="absolute top-8 -right-4 bg-white/95 rounded-[14px] p-4 pr-5 max-w-[240px]" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
              <p style={{ fontWeight: 700, fontSize: 17, color: "#1D1D1F" }}>Your reports. Always organised.</p>
              <p style={{ fontWeight: 400, fontSize: 14, color: "#6E6E73", marginTop: 4 }}>Track status, download, and manage every CBN return.</p>
            </div>
          </div>
        </motion.div>

        {/* Stage 3 - Create Report */}
        <motion.div style={{ opacity: opacity3 }} className="absolute inset-0 flex items-center justify-center px-8">
          <div className="relative max-w-[1100px] w-full">
            <div className="w-full aspect-[16/10] rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
              <CreateReportMockup />
            </div>
            {["Upload any CBS format", "Set your reporting period", "Generate in under 5 minutes"].map((text, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={activeStage === 3 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", delay: i * 0.3, stiffness: 200 }}
                className="absolute bg-white rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  color: "#1D1D1F",
                  top: `${20 + i * 28}%`,
                  right: i % 2 === 0 ? "-10px" : "auto",
                  left: i % 2 !== 0 ? "-10px" : "auto",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              >
                {text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stage 4 - Report Ready */}
        <motion.div style={{ opacity: opacity4, scale: scale4 }} className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 style={{ fontWeight: 900, fontSize: "clamp(48px, 7vw, 80px)", color: "white", textAlign: "center" }}>5 minutes</h2>
          <p style={{ fontWeight: 400, fontSize: 19, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 12 }}>from upload to download</p>
        </motion.div>

        {/* Stage 5 - Compliance Mail */}
        <motion.div style={{ opacity: opacity5 }} className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <div className="max-w-[900px] w-full">
            <div className="w-full aspect-[16/10] rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
              <MailMockup />
            </div>
          </div>
          <p style={{ fontWeight: 400, fontSize: 19, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 24 }}>
            Every CBN notice. Every deadline. In one inbox.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

/* Styled UI Mockups */
const DashboardMockup = () => (
  <div className="w-full h-full p-6 flex gap-4">
    <div className="w-48 bg-white/5 rounded-xl p-4 flex flex-col gap-3">
      {["Home", "Reports", "Create", "Calendar", "Settings"].map((t) => (
        <div key={t} className="text-white/40 text-xs py-1.5 px-2 rounded-md hover:bg-white/5">{t}</div>
      ))}
    </div>
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex gap-3">
        {[{ n: "12", l: "Total" }, { n: "3", l: "Processing" }, { n: "9", l: "Ready" }].map((c) => (
          <div key={c.l} className="flex-1 bg-white/5 rounded-xl p-4">
            <div className="text-white text-2xl font-bold">{c.n}</div>
            <div className="text-white/30 text-xs mt-1">{c.l}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 bg-white/5 rounded-xl p-4">
        <div className="text-white/30 text-xs mb-3">Recent Reports</div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-white/60 text-xs">MFB Return Q{i} 2026</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Ready</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ReportsMockup = () => (
  <div className="w-full h-full p-6">
    <div className="text-white/30 text-xs mb-4">My Reports</div>
    <div className="space-y-2">
      {["MFB Prudential Return", "CBN Forex Return", "AML/CFT Report", "Liquidity Return", "Capital Adequacy"].map((r, i) => (
        <div key={r} className="flex justify-between items-center py-3 px-4 bg-white/5 rounded-xl">
          <span className="text-white/70 text-sm">{r}</span>
          <div className="flex items-center gap-3">
            <span className="text-white/30 text-xs">Q{(i % 4) + 1} 2026</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${i < 3 ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
              {i < 3 ? "Ready" : "Processing"}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CreateReportMockup = () => (
  <div className="w-full h-full p-8 flex flex-col items-center justify-center">
    <div className="text-white/30 text-xs mb-6">Create New Report</div>
    <div className="w-full max-w-md border-2 border-dashed border-white/15 rounded-2xl p-8 text-center">
      <div className="text-white/30 text-sm">Drop your CBS export here</div>
      <div className="text-white/20 text-xs mt-2">.xlsx, .csv, .xls</div>
    </div>
    <div className="w-full max-w-md mt-6 flex gap-3">
      <div className="flex-1 bg-white/5 rounded-xl p-3 text-white/30 text-xs">Period Start</div>
      <div className="flex-1 bg-white/5 rounded-xl p-3 text-white/30 text-xs">Period End</div>
    </div>
    <div className="w-full max-w-md mt-4 bg-blue-600 rounded-xl p-3 text-center text-white text-sm font-medium">
      Generate Report
    </div>
  </div>
);

const MailMockup = () => (
  <div className="w-full h-full p-6 flex gap-4">
    <div className="w-64 border-r border-white/5 pr-4 space-y-2">
      <div className="text-white/30 text-xs mb-3">Compliance Mail</div>
      {["CAR Below Threshold", "Q1 Return Due", "NFIU Deadline", "New CBN Circular"].map((m, i) => (
        <div key={m} className={`p-3 rounded-xl text-xs ${i === 0 ? "bg-white/10 text-white" : "text-white/40"}`}>
          <div className="font-medium">{m}</div>
          <div className="text-white/20 mt-1">Apr {10 + i}, 2026</div>
        </div>
      ))}
    </div>
    <div className="flex-1 p-4">
      <div className="text-white text-sm font-medium">CAR Below Threshold Warning</div>
      <div className="text-white/30 text-xs mt-1">From: RegCo Compliance Engine</div>
      <div className="text-white/50 text-xs mt-4 leading-relaxed">
        Your Capital Adequacy Ratio has fallen to 9.2%, below the CBN minimum of 10%. Immediate action is required to avoid regulatory sanctions...
      </div>
    </div>
  </div>
);

export default DashboardShowcase;
