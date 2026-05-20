import { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";
import EigenNavbar from "./EigenNavbar";
import EigenFooter from "./EigenFooter";

export const PageShell = ({ children }: { children: ReactNode }) => (
  <div style={{ minHeight: "100vh", background: "#F5F5F0", fontFamily: "Inter, -apple-system, sans-serif", color: "#0A0A0A" }}>
    <EigenNavbar />
    <main style={{ paddingTop: 80 }}>{children}</main>
    <EigenFooter />
  </div>
);

export const PageHero = ({ label, title, subtitle }: { label: string; title: string; subtitle: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <section ref={ref} style={{ padding: "80px 24px 60px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B6B6B", margin: 0 }}
        >
          {label}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "16px 0 20px", color: "#0A0A0A" }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.16 }}
          style={{ fontSize: 19, color: "#4A4A4A", lineHeight: 1.55, maxWidth: 720, margin: 0 }}
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
};

export const ContentSection = ({ children }: { children: ReactNode }) => (
  <section style={{ padding: "64px 24px" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
  </section>
);
