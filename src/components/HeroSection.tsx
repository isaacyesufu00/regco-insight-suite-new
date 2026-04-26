import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
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

  const headline = useMemo(() => "Automated.", []);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F0F0F2 0%, #E8E8ED 100%)",
      }}
    >
      {/* First viewport */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-[22px] pt-24 pb-20">
          <div className="max-w-[980px] mx-auto text-center">
            <div className="text-[19px] text-[#1D1D1F]">
              <span className="font-normal">RegCo</span>{" "}
              <span className="italic font-light">Compliance</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.94 }}
              animate={mounted ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-black text-[#1D1D1F] leading-[1] tracking-[-3px]"
              style={{
                fontSize: "clamp(72px, 10vw, 120px)",
              }}
            >
              {headline}
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
      </div>

      {/* Dashboard preview (scroll reveal) */}
      <div ref={previewRef} className="pb-28">
        <div className="container mx-auto px-[22px]">
          <motion.div
            style={{
              opacity: previewOpacity,
              y: previewY,
              transformPerspective: 2000,
              rotateX: previewRot,
            }}
            className="mx-auto max-w-[1200px]"
          >
            <div
              className="bg-white overflow-hidden"
              style={{
                borderRadius: 18,
                boxShadow: "0 30px 80px rgba(0,0,0,0.12)",
              }}
            >
              <div className="p-10">
                <div className="text-[12px] text-[#6E6E73]">Dashboard preview</div>
                <div className="mt-2 text-[28px] font-semibold text-[#1D1D1F] tracking-[-0.02em]">
                  Reports, monitoring, and compliance — in one place.
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Upload CBS data", "Validate ratios", "Download return"].map((t) => (
                    <div
                      key={t}
                      className="bg-[#F5F5F7]"
                      style={{ borderRadius: 18, padding: 18 }}
                    >
                      <div className="text-[15px] font-medium text-[#1D1D1F]">{t}</div>
                      <div className="mt-1 text-[13px] text-[#6E6E73]" style={{ lineHeight: 1.5 }}>
                        A clean, Apple-like UI mock that will be replaced with the real screenshot panel next.
                      </div>
                    </div>
                  ))}
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
