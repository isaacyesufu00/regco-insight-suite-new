import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const inputStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.04)",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 8,
  padding: "12px 16px",
  width: "100%",
  fontSize: 17,
  color: "#1D1D1F",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
};

const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "#0066CC";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.2)";
};
const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
  e.currentTarget.style.boxShadow = "none";
};

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
      if (diff <= 0) { setLockedUntil(null); setAttemptCount(0); setCountdown(""); if (email.trim()) { supabase.from("login_attempts").update({ attempt_count: 0, locked_until: null }).eq("email", email.trim().toLowerCase()).then(); } return; }
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
    if (data) { setAttemptCount(data.attempt_count ?? 0); if (data.locked_until && new Date(data.locked_until) > new Date()) { setLockedUntil(new Date(data.locked_until)); return true; } }
    return false;
  }, []);

  const recordFailedAttempt = async (emailAddr: string) => {
    const { data: existing } = await supabase.from("login_attempts").select("id, attempt_count").eq("email", emailAddr).maybeSingle();
    const newCount = (existing?.attempt_count ?? 0) + 1;
    const lockTime = newCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;
    if (existing) { await supabase.from("login_attempts").update({ attempt_count: newCount, locked_until: lockTime, last_attempt_at: new Date().toISOString() }).eq("id", existing.id); }
    else { await supabase.from("login_attempts").insert({ email: emailAddr, attempt_count: newCount, locked_until: lockTime, last_attempt_at: new Date().toISOString() }); }
    setAttemptCount(newCount);
    if (lockTime) setLockedUntil(new Date(lockTime));
  };

  const resetAttempts = async (emailAddr: string) => {
    await supabase.from("login_attempts").update({ attempt_count: 0, locked_until: null }).eq("email", emailAddr);
    setAttemptCount(0); setLockedUntil(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
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
    } else { await resetAttempts(trimmedEmail); navigate("/dashboard"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F5F7" }}>
      <div className="w-full" style={{ maxWidth: 400, background: "#FFFFFF", borderRadius: 18, padding: 48, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div className="text-center mb-8">
          <span className="text-[20px] font-semibold text-[#1D1D1F]">RegCo</span>
        </div>

        {isLocked ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,59,48,0.1)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 className="text-[28px] font-bold text-[#1D1D1F] mb-2">Account Locked</h2>
            <p className="text-[15px] text-[#6E6E73] mb-4">Try again in 15 minutes or reset your password.</p>
            <div className="text-[32px] font-mono font-bold text-[#FF3B30] mb-6">{countdown}</div>
            <Link to="/forgot-password" className="text-[14px] text-[#0066CC] font-medium" style={{ backgroundImage: "none" }}>Forgot Password</Link>
          </div>
        ) : (
          <>
            <h2 className="text-[28px] font-bold text-[#1D1D1F] text-center mb-1">Sign in to RegCo</h2>
            <p className="text-[15px] text-[#6E6E73] text-center mb-8">Enter your email</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input style={inputStyle} type="email" placeholder="you@institution.com" value={email} onChange={(e) => setEmail(e.target.value)} required onFocus={focusHandler} onBlur={blurHandler} />
              <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required onFocus={focusHandler} onBlur={blurHandler} />

              {error && <p className="text-[14px] font-medium text-[#FF3B30]">{error}</p>}
              {attemptCount >= 3 && attemptCount < 5 && (
                <div className="rounded-lg px-4 py-3 text-[14px] font-medium" style={{ background: "rgba(255,159,10,0.1)", color: "#FF9500", border: "1px solid rgba(255,159,10,0.2)" }}>
                  ⚠️ {attemptCount} failed attempts. Account locks at 5.
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full text-[17px] font-normal text-white disabled:opacity-60"
                style={{ background: "#0066CC", borderRadius: 980, padding: "13px 24px", transition: "filter 0.15s", backgroundImage: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-[14px] text-[#0066CC]" style={{ backgroundImage: "none" }}>Forgot password?</Link>
            </div>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]" />
              <span className="text-[13px] text-[#86868B]">or</span>
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]" />
            </div>

            <p className="text-center text-[14px] text-[#6E6E73]">
              Don't have an account?{" "}
              <Link to="/book-demo" className="text-[#0066CC] font-medium" style={{ backgroundImage: "none" }}>Book a demo</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
