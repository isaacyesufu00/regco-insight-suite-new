import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_KEY = "regco_cookie_consent_v2";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  const persist = (accepted: boolean) => {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({ accepted, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            bottom: isMobile ? 16 : 28,
            left: isMobile ? 16 : 28,
            right: isMobile ? 16 : "auto",
            zIndex: 9999,
            background: "rgba(10, 10, 10, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.10)",
            padding: "20px 24px",
            maxWidth: isMobile ? "100%" : 380,
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#FFFFFF",
              margin: "0 0 10px",
              letterSpacing: "-0.3px",
            }}
          >
            RegCo
          </p>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              margin: "0 0 18px",
            }}
          >
            We use cookies to improve your experience and understand how our platform is used.{" "}
            <a
              href="/legal/privacy-policy"
              style={{
                color: "rgba(255,255,255,0.85)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                textDecorationColor: "rgba(255,255,255,0.3)",
              }}
            >
              Privacy Policy
            </a>
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => persist(true)}
              style={{
                flex: 1,
                height: 38,
                background: "#FFFFFF",
                color: "#0A0A0A",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "-0.2px",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Accept
            </button>
            <button
              onClick={() => persist(false)}
              style={{
                flex: 1,
                height: 38,
                background: "transparent",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.color = "rgba(255,255,255,0.75)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              }}
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
