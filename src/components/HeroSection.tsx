import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ["start end", "center center"],
  });
  const previewY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const previewRot = useTransform(scrollYProgress, [0, 1], [8, 3]);
  const previewOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative w-full" style={{ background: "linear-gradient(180deg, #F0F0F2 0%, #E8E8ED 100%)" }}>
      {/* First viewport — Whoosh style */}
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 22px" }} className="text-center">
          <div className="text-[19px] text-[#1D1D1F]">
            <span className="font-normal">RegCo</span>{" "}
            <span className="italic font-light">Compliance</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.94 }}
            animate={mounted ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-black text-[#1D1D1F] leading-[1]"
            style={{ fontSize: "clamp(72px, 10vw, 120px)", letterSpacing: -3 }}
          >
            Automated.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={mounted ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-3 mx-auto max-w-[500px] text-[21px] text-[#6E6E73]"
            style={{ lineHeight: 1.6 }}
          >
            CBN compliance in minutes. Not days.
          </motion.p>
        </div>
      </div>

      {/* Dashboard preview — scroll reveal with perspective tilt */}
      <div ref={previewRef} className="pb-28">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 22px" }}>
          <motion.div
            style={{ opacity: previewOpacity, y: previewY, transformPerspective: 2000, rotateX: previewRot }}
            className="mx-auto"
          >
            <div
              className="bg-white overflow-hidden"
              style={{ borderRadius: 18, boxShadow: "0 30px 80px rgba(0,0,0,0.12)" }}
            >
              {/* Mock dashboard */}
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex gap-6">
                  {/* Sidebar mock */}
                  <div className="hidden md:block w-48 flex-shrink-0">
                    <div className="text-[14px] font-semibold text-[#1D1D1F] mb-4">RegCo</div>
                    {["Dashboard", "My Reports", "Create Report", "Compliance Mail", "Calendar"].map((item, i) => (
                      <div
                        key={item}
                        className="text-[13px] py-2 px-3 rounded-lg mb-0.5"
                        style={{
                          background: i === 0 ? "#F5F5F7" : "transparent",
                          color: i === 0 ? "#1D1D1F" : "#6E6E73",
                          fontWeight: i === 0 ? 600 : 400,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  {/* Content mock */}
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {[
                        { n: "12", l: "Pending", c: "#8E8E93" },
                        { n: "4", l: "Processing", c: "#FF9F0A" },
                        { n: "18", l: "Ready", c: "#34C759" },
                        { n: "1", l: "Failed", c: "#FF3B30" },
                      ].map((s) => (
                        <div key={s.l} className="bg-[#F5F5F7] rounded-2xl p-4">
                          <div className="text-[11px] font-medium" style={{ color: s.c }}>{s.l}</div>
                          <div className="text-[28px] font-bold text-[#1D1D1F] mt-1">{s.n}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#F5F5F7] rounded-2xl p-4">
                      <div className="text-[13px] font-medium text-[#6E6E73] mb-3">Recent Reports</div>
                      {["Q4 Regulatory Return", "AML/CFT Report", "Prudential Return"].map((r, i) => (
                        <div key={r} className="flex items-center justify-between py-2" style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                          <span className="text-[13px] text-[#1D1D1F]">{r}</span>
                          <span
                            className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{
                              background: i === 0 ? "rgba(52,199,89,0.12)" : i === 1 ? "rgba(255,159,10,0.12)" : "rgba(142,142,147,0.12)",
                              color: i === 0 ? "#34C759" : i === 1 ? "#FF9F0A" : "#8E8E93",
                            }}
                          >
                            {i === 0 ? "Ready" : i === 1 ? "Processing" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
