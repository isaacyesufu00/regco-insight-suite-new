import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FinalCTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} style={{ background: "#0A0A0A", padding: "96px 0", overflow: "hidden" }}>
      <motion.div style={{ y, textAlign: "center", padding: "0 24px" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
          LET'S TALK
        </p>
        <h2 style={{ fontSize: 48, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-1.5px", marginBottom: 24, lineHeight: 1.05 }}>
          Stop drowning in<br />compliance paperwork.
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 400, margin: "0 auto 40px" }}>
          Let RegCo handle every return. See what's possible in minutes.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link to="/login" style={{ background: "#0A0A0A", color: "#fff", borderRadius: 6, padding: "11px 22px", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            START FOR FREE <ArrowRight size={12} />
          </Link>
          <Link to="/book-demo" style={{ background: "transparent", color: "#fff", borderRadius: 6, padding: "11px 22px", fontSize: 12, fontWeight: 600, border: "1px solid rgba(255,255,255,0.25)", textDecoration: "none" }}>
            BOOK A DEMO
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCTASection;
