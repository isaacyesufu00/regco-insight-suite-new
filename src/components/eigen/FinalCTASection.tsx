import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

const FinalCTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#0A0A0A", padding: "120px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}
        >
          GET STARTED
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          style={{ fontSize: 56, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-2px", lineHeight: 1.06, marginBottom: 20 }}
        >
          Ready to stop filing<br />returns manually?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.14 }}
          style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, maxWidth: 480, margin: "0 auto 48px" }}
        >
          Book a 30-minute demo and we will show you how RegCo generates your institution's actual CBN return from your real CBS data — in under 5 minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link
            to="/book-demo"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, height: 52, padding: "0 28px",
              background: "#FFFFFF", color: "#0A0A0A", borderRadius: 10, fontSize: 14, fontWeight: 700,
              textDecoration: "none", letterSpacing: "0.01em", transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(255,255,255,0.15)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            Book a demo →
          </Link>

          <Link
            to="/sign-up"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, height: 52, padding: "0 28px",
              background: "transparent", color: "rgba(255,255,255,0.7)", borderRadius: 10, fontSize: 14, fontWeight: 600,
              textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)", letterSpacing: "0.01em",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.color = "#FFFFFF"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          >
            Start free trial
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}
        >
          {["🛡 CBN Compliant Architecture", "🔒 NDPC Registered", "📋 16 Returns Automated"].map((t) => (
            <span key={t} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{t}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
