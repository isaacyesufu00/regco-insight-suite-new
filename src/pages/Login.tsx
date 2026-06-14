import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const timeoutNotice = searchParams.get("reason") === "timeout";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState("");

  const isLocked = lockedUntil && lockedUntil > new Date();

  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const diff = lockedUntil.getTime() - Date.now();
      if (diff <= 0) {
        setLockedUntil(null);
        setAttemptCount(0);
        setCountdown("");
        if (email.trim()) {
          supabase.from("login_attempts").update({ attempt_count: 0, locked_until: null }).eq("email", email.trim().toLowerCase()).then();
        }
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${mins}:${secs.toString().padStart(2, "0")}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil, email]);

  const checkLockStatus = useCallback(async (emailAddr: string) => {
    const { data } = await supabase.from("login_attempts").select("attempt_count, locked_until").eq("email", emailAddr).maybeSingle();
    if (data) {
      setAttemptCount(data.attempt_count ?? 0);
      if (data.locked_until && new Date(data.locked_until) > new Date()) {
        setLockedUntil(new Date(data.locked_until));
        return true;
      }
    }
    return false;
  }, []);

  const recordFailedAttempt = async (emailAddr: string) => {
    const { data: existing } = await supabase.from("login_attempts").select("id, attempt_count").eq("email", emailAddr).maybeSingle();
    const newCount = (existing?.attempt_count ?? 0) + 1;
    const lockTime = newCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;
    if (existing) {
      await supabase.from("login_attempts").update({ attempt_count: newCount, locked_until: lockTime, last_attempt_at: new Date().toISOString() }).eq("id", existing.id);
    } else {
      await supabase.from("login_attempts").insert({ email: emailAddr, attempt_count: newCount, locked_until: lockTime, last_attempt_at: new Date().toISOString() });
    }
    setAttemptCount(newCount);
    if (lockTime) setLockedUntil(new Date(lockTime));
  };

  const resetAttempts = async (emailAddr: string) => {
    await supabase.from("login_attempts").update({ attempt_count: 0, locked_until: null }).eq("email", emailAddr);
    setAttemptCount(0);
    setLockedUntil(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) { setError("Please fill in all fields."); return; }
    const locked = await checkLockStatus(trimmedEmail);
    if (locked) return;
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
    setLoading(false);
    if (authError) {
      await recordFailedAttempt(trimmedEmail);
      if (authError.message === "Email not confirmed") setError("Please check your email and confirm your account before logging in.");
      else if (authError.message === "Invalid login credentials") setError("Invalid email or password. Please try again.");
      else setError(authError.message);
    } else {
      await resetAttempts(trimmedEmail);
      navigate("/dashboard/agent");
    }
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
            Welcome back.
          </h2>
          <p style={{ fontSize: 16, color: "#6E6E73", lineHeight: 1.55 }}>
            Sign in to access your compliance dashboard, generate returns, and track regulatory deadlines in one place.
          </p>

          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Bank-grade security",
              "Live compliance score",
              "One-click CBN, NDIC & NFIU returns",
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
          {isLocked ? (
            <div style={{ textAlign: "center" }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(255,59,48,0.1)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 600, color: "#0A0A0A", marginBottom: 8, letterSpacing: -0.5 }}>Account temporarily locked</h1>
              <p style={{ fontSize: 15, color: "#6E6E73", lineHeight: 1.5, marginBottom: 20 }}>
                Too many failed attempts. Try again in 15 minutes or reset your password.
              </p>
              <div style={{ fontWeight: 600, fontSize: 36, color: "#FF3B30", fontFamily: "monospace", marginBottom: 24 }}>{countdown}</div>
              <Link
                to="/forgot-password"
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
                Reset password
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 30, fontWeight: 600, color: "#0A0A0A", letterSpacing: -0.6, marginBottom: 8 }}>
                Sign in
              </h1>
              <p style={{ fontSize: 15, color: "#6E6E73", marginBottom: 28 }}>
                Enter your credentials to continue.
              </p>

              {timeoutNotice && (
                <div style={{ background: "rgba(10,10,10,0.04)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#0A0A0A", marginBottom: 18 }}>
                  You were signed out after 8 hours of inactivity. Please sign in again.
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
                  <Link to="/forgot-password" style={{ fontSize: 13.5, color: "#0A0A0A", textDecoration: "none", fontWeight: 500 }}>
                    Forgot password?
                  </Link>
                </div>

                {error && <p style={{ fontSize: 14, color: "#FF3B30", fontWeight: 500, margin: 0 }}>{error}</p>}

                {attemptCount >= 3 && attemptCount < 5 && (
                  <div style={{ background: "rgba(255,159,10,0.08)", border: "1px solid rgba(255,159,10,0.25)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#B26B00" }}>
                    {attemptCount} failed attempts. Account locks after 5.
                  </div>
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
                    opacity: loading ? 0.7 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid rgba(0,0,0,0.08)", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#6E6E73", margin: "0 0 12px" }}>New to RegCo?</p>
                <Link
                  to="/book-demo"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    height: 40, padding: "0 20px",
                    background: "transparent", color: "#0A0A0A",
                    border: "1px solid rgba(0,0,0,0.15)", borderRadius: 8,
                    fontSize: 13, fontWeight: 600, textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F0")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Book a demo →
                </Link>
                <p style={{ fontSize: 12, color: "#9B9B9B", margin: "12px 0 0", lineHeight: 1.5 }}>
                  We'll set up your institution's account and guide you through your first return.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
