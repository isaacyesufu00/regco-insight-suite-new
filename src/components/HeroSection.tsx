import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-start overflow-hidden"
      style={{
        height: "100vh",
        background: "linear-gradient(to bottom, #C8E6F5 0%, #D4EDF5 20%, #DDF0F4 40%, #E8F2F0 60%, #EFF4F2 80%, #F2F2F7 100%)",
      }}
    >
      <div className="flex flex-col items-center" style={{ paddingTop: "25vh" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span style={{ fontWeight: 400, fontSize: 19, color: "#1D1D1F" }}>RegCo</span>{" "}
          <span style={{ fontStyle: "italic", fontWeight: 300, fontSize: 19, color: "#1D1D1F" }}>Compliance</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={mounted ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{ duration: 1.0, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontWeight: 900,
            fontSize: "clamp(72px, 11vw, 120px)",
            color: "#1B4F8A",
            letterSpacing: -3,
            lineHeight: 1.0,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Everywhere.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ fontWeight: 400, fontSize: 21, color: "#6E6E73", textAlign: "center", maxWidth: 520, marginTop: 20 }}
        >
          CBN. NFIU. SCUML. NDIC. AML/CFT. All of it. Automated.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-center gap-[14px]"
          style={{ marginTop: 32 }}
        >
          <Link
            to="/login"
            style={{ fontWeight: 400, fontSize: 17, background: "#0066CC", color: "white", borderRadius: 980, padding: "13px 26px", textDecoration: "none", display: "inline-block" }}
          >
            Sign In
          </Link>
          <Link
            to="/book-demo"
            style={{ fontWeight: 400, fontSize: 17, background: "rgba(0,0,0,0.07)", color: "#1D1D1F", borderRadius: 980, padding: "13px 26px", textDecoration: "none", display: "inline-block" }}
          >
            Book a Demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
