import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
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
      navigate("/dashboard");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(0,0,0,0.04)",
    border: "1.5px solid rgba(0,0,0,0.12)",
    borderRadius: 10,
    padding: "13px 16px",
    fontSize: 17,
    color: "#1D1D1F",
    outline: "none",
    transition: "all 0.2s",
  };

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F5F7" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-[400px] text-center"
          style={{ background: "white", borderRadius: 18, padding: 52, boxShadow: "0 4px 32px rgba(0,0,0,0.1)" }}
        >
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,59,48,0.1)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 28, color: "#1D1D1F", marginBottom: 8 }}>Account Temporarily Locked</h2>
          <p style={{ fontSize: 15, color: "#6E6E73", marginBottom: 24 }}>
            Too many failed attempts. Please try again in 15 minutes or reset your password.
          </p>
          <div style={{ fontWeight: 700, fontSize: 36, color: "#FF3B30", fontFamily: "monospace", marginBottom: 24 }}>{countdown}</div>
          <Link to="/forgot-password" style={{ fontSize: 14, color: "#0066CC", textDecoration: "none" }}>
            Forgot Password?
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F5F7" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[400px]"
        style={{ background: "white", borderRadius: 18, padding: 52, boxShadow: "0 4px 32px rgba(0,0,0,0.1)" }}
      >
        <div className="text-center mb-8">
          <Link to="/" style={{ fontWeight: 600, fontSize: 20, color: "#1D1D1F", textDecoration: "none" }}>
            RegCo
          </Link>
        </div>

        <h1 style={{ fontWeight: 700, fontSize: 28, color: "#1D1D1F", textAlign: "center", marginBottom: 8 }}>
          Sign in to RegCo
        </h1>
        <p style={{ fontSize: 15, color: "#6E6E73", textAlign: "center", marginBottom: 28 }}>
          Enter your email to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#0066CC";
                e.target.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.15)";
                e.target.style.background = "white";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(0,0,0,0.12)";
                e.target.style.boxShadow = "none";
                e.target.style.background = "rgba(0,0,0,0.04)";
              }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#0066CC";
                e.target.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.15)";
                e.target.style.background = "white";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(0,0,0,0.12)";
                e.target.style.boxShadow = "none";
                e.target.style.background = "rgba(0,0,0,0.04)";
              }}
            />
            <div className="text-right mt-1">
              <Link to="/forgot-password" style={{ fontSize: 13, color: "#0066CC", textDecoration: "none" }}>
                Forgot password?
              </Link>
            </div>
          </div>

          {error && <p style={{ fontSize: 14, color: "#FF3B30", fontWeight: 500 }}>{error}</p>}

          {attemptCount >= 3 && attemptCount < 5 && (
            <div style={{ background: "rgba(255,159,10,0.1)", border: "1px solid rgba(255,159,10,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#FF9F0A" }}>
              ⚠️ {attemptCount} failed attempts. Account locks after 5.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 52,
              background: "#0066CC",
              color: "white",
              borderRadius: 10,
              fontSize: 17,
              fontWeight: 500,
              border: "none",
              cursor: loading ? "wait" : "pointer",
              marginTop: 20,
              transition: "all 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p style={{ fontSize: 14, color: "#6E6E73" }}>
            Don't have an account?{" "}
            <Link to="/book-demo" style={{ color: "#0066CC", fontWeight: 600, textDecoration: "none" }}>
              Book a demo
            </Link>
          </p>
        </div>

        <div className="text-center mt-8">
          <span style={{ fontSize: 12, color: "#86868B" }}>
            <Link to="/contact" style={{ color: "#86868B", textDecoration: "none" }}>Help</Link>
            {" · "}
            <Link to="/privacy-policy" style={{ color: "#86868B", textDecoration: "none" }}>Privacy</Link>
            {" · "}
            <Link to="/terms" style={{ color: "#86868B", textDecoration: "none" }}>Terms</Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
