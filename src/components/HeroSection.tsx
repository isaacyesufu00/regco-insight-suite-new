import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-start overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #C8E6F5 0%, #D4EDF5 25%, #E0F0F4 50%, #EDF4F2 75%, #F2F2F7 100%)",
      }}
    >
      <div className="flex flex-col items-center" style={{ marginTop: "28vh" }}>
        {/* Product label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "19px",
              color: "#1D1D1F",
              letterSpacing: 0,
            }}
          >
            RegCo
          </span>{" "}
          <span
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "19px",
              color: "#1D1D1F",
            }}
          >
            Compliance
          </span>
        </motion.div>

        {/* Giant headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={mounted ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{
            opacity: { duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
            scale: { duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
            y: { duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
          }}
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(72px, 11vw, 120px)",
            color: "#1B4F8A",
            letterSpacing: "-3px",
            lineHeight: 1.0,
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          Automated.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "21px",
            color: "#6E6E73",
            textAlign: "center",
            maxWidth: "460px",
            marginTop: "20px",
          }}
        >
          CBN compliance in minutes. Not days.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-center gap-[14px]"
          style={{ marginTop: "32px" }}
        >
          <Link
            to="/book-demo"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "17px",
              background: "#0066CC",
              color: "white",
              borderRadius: "980px",
              padding: "12px 24px",
              border: "none",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Get Started
          </Link>
          <Link
            to="/book-demo"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "17px",
              background: "rgba(0,0,0,0.07)",
              color: "#1D1D1F",
              borderRadius: "980px",
              padding: "12px 24px",
              border: "none",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Watch a Demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
