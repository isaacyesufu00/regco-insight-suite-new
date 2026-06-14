import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type PasswordStrength = "weak" | "fair" | "strong";

function getPasswordStrength(p: string): PasswordStrength {
  if (p.length < 8) return "weak";
  const hasUpper = /[A-Z]/.test(p);
  const hasLower = /[a-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  const hasSpecial = /[^A-Za-z0-9]/.test(p);
  if (p.length >= 12 && hasUpper && hasLower && hasNumber && hasSpecial) return "strong";
  return "fair";
}

const strengthConfig: Record<PasswordStrength, { label: string; value: number; color: string }> = {
  weak: { label: "Weak", value: 33, color: "#FF3B30" },
  fair: { label: "Fair", value: 66, color: "#FF9500" },
  strong: { label: "Strong", value: 100, color: "#34C759" },
};

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

const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "#0A0A0A";
  e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.06)";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "rgba(0,0,0,0.12)";
  e.target.style.boxShadow = "none";
};

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const config = strengthConfig[strength];
  const isWeak = strength === "weak";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const t = {
      fullName: fullName.trim(),
      institutionName: institutionName.trim(),
      email: email.trim(),
    };

    if (!t.fullName || !t.institutionName || !institutionType || !t.email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (isWeak) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: t.email,
      password,
      options: {
        data: {
          full_name: t.fullName.slice(0, 100),
          company_name: t.institutionName.slice(0, 100),
          institution_type: institutionType,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    if (data.user && !data.session) {
      setSubmitted(true);
    } else {
      navigate("/dashboard/agent");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F7F7F5" }}>
      {/* Left panel — brand */}
      <div
        style={{
          flex: 1,
          background: "#F7F7F5",
          padding: 56,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        className="hidden md:flex"
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
            Bank-grade compliance, automated.
          </h2>
          <p style={{ fontSize: 16, color: "#6E6E73", lineHeight: 1.55 }}>
            Generate CBN, NDIC and NFIU returns from your raw CBS export in minutes — with audit trails, validation, and deadline tracking built in.
          </p>

          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            {["CBN, NDIC & NFIU returns", "Automated validation & balance checks", "Encrypted file handling"].map((t) => (
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

      {/* Right panel — form */}
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
              <h1 style={{ fontSize: 26, fontWeight: 600, color: "#0A0A0A", marginBottom: 8, letterSpacing: -0.5 }}>Check your email</h1>
              <p style={{ fontSize: 15, color: "#6E6E73", lineHeight: 1.5 }}>
                We sent a confirmation link to <strong style={{ color: "#0A0A0A" }}>{email}</strong>. Click it to verify your account, then log in.
              </p>
              <Link
                to="/login"
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
                Go to login
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 30, fontWeight: 600, color: "#0A0A0A", letterSpacing: -0.6, marginBottom: 8 }}>
                Create your account
              </h1>
              <p style={{ fontSize: 15, color: "#6E6E73", marginBottom: 28 }}>
                Start generating regulator-ready returns in minutes.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                  required
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <input
                  placeholder="Institution name"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  maxLength={100}
                  required
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
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
                <input
                  type="email"
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  required
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    style={fieldStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  {password.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                      <div style={{ flex: 1, height: 4, borderRadius: 4, background: "#EDEDED", overflow: "hidden" }}>
                        <div style={{ width: `${config.value}%`, height: "100%", background: config.color, transition: "width 0.25s" }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: config.color, minWidth: 44, textAlign: "right" }}>
                        {config.label}
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />

                {error && (
                  <p style={{ fontSize: 14, color: "#FF3B30", fontWeight: 500, margin: 0 }}>{error}</p>
                )}

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
                    transition: "opacity 0.15s",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>

                <p style={{ fontSize: 13, color: "#8A8A8E", textAlign: "center", marginTop: 4, lineHeight: 1.5 }}>
                  By signing up you agree to our{" "}
                  <Link to="/terms" style={{ color: "#0A0A0A", textDecoration: "underline" }}>Terms</Link>
                  {" "}and{" "}
                  <Link to="/privacy-policy" style={{ color: "#0A0A0A", textDecoration: "underline" }}>Privacy Policy</Link>.
                </p>
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

export default SignUp;
