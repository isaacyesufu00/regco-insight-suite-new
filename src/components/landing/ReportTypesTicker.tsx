import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reportTypes = [
  { name: "MFB Regulatory Return", color: "#0066CC" },
  { name: "CBN Forex Return", color: "#5856D6" },
  { name: "AML/CFT Report", color: "#FF3B30" },
  { name: "SCUML Report", color: "#FF9500" },
  { name: "NFIU Return", color: "#34C759" },
  { name: "Prudential Return", color: "#007AFF" },
  { name: "CBN Monetary Policy", color: "#AF52DE" },
];

const ReportTypesTicker = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 10,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 10,
    });
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  };

  return (
    <section className="py-[120px]" style={{ background: "#FFFFFF" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 22px" }}>
        {/* RegCo mark */}
        <div className="flex justify-center mb-4">
          <div
            className="w-[80px] h-[80px] rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FF9A00, #FF3D00)" }}
          >
            <span className="text-white text-[32px] font-black">R</span>
          </div>
        </div>
        <p className="text-center text-[17px] text-[#0066CC] font-normal">RegCo</p>
        <h2 className="text-center text-[56px] font-black text-[#1D1D1F] mt-2" style={{ letterSpacing: "-1px", lineHeight: 1.05 }}>
          Every return. Automated.
        </h2>
        <p className="text-center text-[21px] text-[#6E6E73] mt-3">
          One subscription. Seven CBN-required reports.
        </p>

        {/* Scrollable cards */}
        <div className="relative mt-12">
          <div
            ref={scrollRef}
            onScroll={updateScroll}
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reportTypes.map((r) => (
              <div
                key={r.name}
                className="flex-shrink-0 flex flex-col justify-between"
                style={{
                  width: 200,
                  height: 280,
                  borderRadius: 20,
                  background: "#F5F5F7",
                  padding: 24,
                  scrollSnapAlign: "start",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${r.color}20` }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                  </div>
                  <p className="text-[15px] font-semibold text-[#1D1D1F] leading-tight">{r.name}</p>
                </div>
                <p className="text-[12px] text-[#6E6E73]">CBN-compliant format</p>
              </div>
            ))}
          </div>

          {/* Nav arrows */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: canScroll.left ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.03)", transition: "background 0.2s" }}
              disabled={!canScroll.left}
            >
              <ChevronLeft size={18} className={canScroll.left ? "text-[#1D1D1F]" : "text-[#86868B]"} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: canScroll.right ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.03)", transition: "background 0.2s" }}
              disabled={!canScroll.right}
            >
              <ChevronRight size={18} className={canScroll.right ? "text-[#1D1D1F]" : "text-[#86868B]"} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportTypesTicker;
