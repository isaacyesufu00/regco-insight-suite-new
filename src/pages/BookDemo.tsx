import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const institutionTypes = ["Unit MFB", "State MFB", "National MFB", "Commercial Bank", "Finance Company", "Primary Mortgage Bank", "Fintech"];

const fieldStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  background: "#FFFFFF",
  border: "1.5px solid rgba(0,0,0,0.12)",
  borderRadius: 10,
  padding: "0 14px",
  fontSize: 15,
  color: "#0A0A0A",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const onFocus = (e: React.FocusEvent<any>) => {
  e.target.style.borderColor = "#0A0A0A";
  e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.06)";
};
const onBlur = (e: React.FocusEvent<any>) => {
  e.target.style.borderColor = "rgba(0,0,0,0.12)";
  e.target.style.boxShadow = "none";
};

const BookDemo = () => {
  const [fullName, setFullName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const t = {
      fullName: fullName.trim(),
      institutionName: institutionName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };

    if (!t.fullName || !t.institutionName || !institutionType || !t.phone || !t.email) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const payload = {
      full_name: t.fullName.slice(0, 100),
      company_name: t.institutionName.slice(0, 100),
      email: t.email.slice(0, 255),
      phone: t.phone.slice(0, 30),
      report_type: institutionType,
      message: message.trim().slice(0, 2000) || null,
    };

    const { error: dbError } = await supabase.from("demo_requests").insert(payload);
    if (dbError) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      return;
    }

    try {
      await supabase.functions.invoke("send-demo-notification", { body: payload });
    } catch (err) {
      console.error("Notification failed:", err);
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F7F7F5" }}>
      {/* Left panel */}
      <div
        className="hidden md:flex"
        style={{
          flex: 1,
          background: "#F7F7F5",
          padding: 56,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" style={{ fontWeight: 600, fontSize: 22, color: "#0A0A0A", textDecoration: "none", letterSpacing: -0.3 }}>
          RegCo
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: 460 }}
        >
          <h2 style={{ fontSize: 36, fontWeight: 600, color: "#0A0A0A", lineHeight: 1.15, letterSpacing: -0.8, marginBottom: 18 }}>
            See RegCo in action.
          </h2>
          <p style={{ fontSize: 16, color: "#6E6E73", lineHeight: 1.55 }}>
            A 20-minute live walkthrough tailored to your institution. We'll show how RegCo automates your CBN, NDIC and NFIU returns end-to-end.
          </p>

          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Tailored to your institution type",
              "Live CBS-to-return demo",
              "Pricing & onboarding timeline",
            ].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, color: "#1D1D1F", fontSize: 14.5 }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#0A0A0A" />
                  <path d="M6 10.5l2.5 2.5L14 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </motion.div>

        <p style={{ fontSize: 13, color: "#8A8A8E" }}>© {new Date().getFullYear()} RegCo. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          {submitted ? (
            <div style={{ textAlign: "center" }}>
              <svg className="mx-auto mb-5" width="64" height="64" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="38" fill="none" stroke="#34C759" strokeWidth="3" />
                <motion.path
                  d="M24 42 L34 52 L56 30"
                  fill="none"
                  stroke="#34C759"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                />
              </svg>
              <h1 style={{ fontSize: 26, fontWeight: 600, color: "#0A0A0A", marginBottom: 8, letterSpacing: -0.5 }}>Demo booked.</h1>
              <p style={{ fontSize: 15, color: "#6E6E73", lineHeight: 1.5 }}>
                We'll confirm your time within 24 hours at{" "}
                <strong style={{ color: "#0A0A0A" }}>{email}</strong>.
              </p>
              <Link
                to="/"
                style={{
                  display: "inline-block",
                  marginTop: 28,
                  background: "#0A0A0A",
                  color: "white",
                  borderRadius: 10,
                  padding: "12px 26px",
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Back to home
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 30, fontWeight: 600, color: "#0A0A0A", letterSpacing: -0.6, marginBottom: 8 }}>
                Book a demo
              </h1>
              <p style={{ fontSize: 15, color: "#6E6E73", marginBottom: 28 }}>
                Schedule a 20-minute live walkthrough.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                <input placeholder="Institution name" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} required maxLength={100} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                <select
                  value={institutionType}
                  onChange={(e) => setInstitutionType(e.target.value)}
                  required
                  style={{ ...fieldStyle, appearance: "none", color: institutionType ? "#0A0A0A" : "#8A8A8E" }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                >
                  <option value="">Institution type</option>
                  {institutionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                <input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={30} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                <textarea
                  placeholder="What would you like to see? (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  style={{ ...fieldStyle, height: 100, padding: "12px 14px", resize: "none", fontFamily: "inherit" }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />

                {error && <p style={{ fontSize: 14, color: "#FF3B30", fontWeight: 500, margin: 0 }}>{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: 50,
                    background: "#0A0A0A",
                    color: "white",
                    borderRadius: 10,
                    fontSize: 15.5,
                    fontWeight: 500,
                    border: "none",
                    cursor: loading ? "wait" : "pointer",
                    marginTop: 4,
                    opacity: loading ? 0.7 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {loading ? "Submitting..." : "Book my demo"}
                </button>
              </form>

              <p style={{ marginTop: 24, textAlign: "center", fontSize: 14.5, color: "#6E6E73" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#0A0A0A", fontWeight: 500, textDecoration: "none" }}>Log in</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookDemo;
