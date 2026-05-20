import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) setError(resetError.message);
    else setSent(true);
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
            Forgot your password?
          </h2>
          <p style={{ fontSize: 16, color: "#6E6E73", lineHeight: 1.55 }}>
            Enter the email tied to your RegCo account and we'll send you a secure link to set a new password.
          </p>

          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Encrypted reset link",
              "Expires in 60 minutes",
              "Audit-logged for compliance",
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
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(10,10,10,0.06)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 600, color: "#0A0A0A", marginBottom: 8, letterSpacing: -0.5 }}>Check your email</h1>
              <p style={{ fontSize: 15, color: "#6E6E73", lineHeight: 1.5, marginBottom: 24 }}>
                If an account exists for <strong style={{ color: "#0A0A0A" }}>{email}</strong>, we've sent a password reset link. Check your inbox and spam folder.
              </p>
              <Link
                to="/login"
                style={{
                  display: "inline-block",
                  background: "#0A0A0A",
                  color: "white",
                  borderRadius: 10,
                  padding: "12px 26px",
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 30, fontWeight: 600, color: "#0A0A0A", letterSpacing: -0.6, marginBottom: 8 }}>
                Reset your password
              </h1>
              <p style={{ fontSize: 15, color: "#6E6E73", marginBottom: 28 }}>
                We'll email you a secure link to choose a new one.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input
                  type="email"
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={fieldStyle}
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
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>

              <p style={{ marginTop: 24, textAlign: "center", fontSize: 14.5, color: "#6E6E73" }}>
                Remember your password?{" "}
                <Link to="/login" style={{ color: "#0A0A0A", fontWeight: 500, textDecoration: "none" }}>Back to sign in</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
