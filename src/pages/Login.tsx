import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  // Countdown timer
  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const diff = lockedUntil.getTime() - Date.now();
      if (diff <= 0) {
        setLockedUntil(null);
        setAttemptCount(0);
        setCountdown("");
        // Reset in DB
        if (email.trim()) {
          supabase
            .from("login_attempts")
            .update({ attempt_count: 0, locked_until: null })
            .eq("email", email.trim().toLowerCase())
            .then();
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
    const { data } = await supabase
      .from("login_attempts")
      .select("attempt_count, locked_until")
      .eq("email", emailAddr)
      .maybeSingle();
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
    const { data: existing } = await supabase
      .from("login_attempts")
      .select("id, attempt_count")
      .eq("email", emailAddr)
      .maybeSingle();

    const newCount = (existing?.attempt_count ?? 0) + 1;
    const lockTime = newCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;

    if (existing) {
      await supabase
        .from("login_attempts")
        .update({ attempt_count: newCount, locked_until: lockTime, last_attempt_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("login_attempts")
        .insert({ email: emailAddr, attempt_count: newCount, locked_until: lockTime, last_attempt_at: new Date().toISOString() });
    }

    setAttemptCount(newCount);
    if (lockTime) setLockedUntil(new Date(lockTime));
  };

  const resetAttempts = async (emailAddr: string) => {
    await supabase
      .from("login_attempts")
      .update({ attempt_count: 0, locked_until: null })
      .eq("email", emailAddr);
    setAttemptCount(0);
    setLockedUntil(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Check lock status before attempting
    const locked = await checkLockStatus(trimmedEmail);
    if (locked) return;

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });
    setLoading(false);

    if (authError) {
      await recordFailedAttempt(trimmedEmail);
      if (authError.message === "Email not confirmed") {
        setError("Please check your email and confirm your account before logging in.");
      } else if (authError.message === "Invalid login credentials") {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(authError.message);
      }
    } else {
      await resetAttempts(trimmedEmail);
      navigate("/dashboard");
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#eef2ff" }}>
        <div className="w-full max-w-md rounded-2xl p-8 shadow-lg text-center" style={{ background: "#ffffff" }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#fef2f2" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1a1a2e" }}>Account Temporarily Locked</h2>
          <p className="text-sm mb-4" style={{ color: "#8a8a9a" }}>
            Your account has been temporarily locked for security reasons. Please try again in 15 minutes or click Forgot Password to reset your credentials.
          </p>
          <div className="text-3xl font-mono font-bold mb-6" style={{ color: "#ef4444" }}>
            {countdown}
          </div>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to="/forgot-password">Forgot Password</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#eef2ff" }}>
      <div className="w-full max-w-md rounded-2xl p-8 shadow-lg" style={{ background: "#ffffff" }}>
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-2 mb-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: "#3b6ef8" }}>
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-2xl font-bold" style={{ color: "#1a1a2e" }}>RegCo</span>
          </Link>
          <p className="text-sm" style={{ color: "#8a8a9a" }}>
            Sign in to your compliance dashboard
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: "#1a1a2e" }}>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: 12 }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: "#1a1a2e" }}>Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: 12 }}
            />
          </div>
          {error && (
            <p className="text-sm font-medium" style={{ color: "#ef4444" }}>{error}</p>
          )}
          {attemptCount >= 3 && attemptCount < 5 && (
            <div className="rounded-lg px-4 py-3 text-sm font-medium" style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" }}>
              ⚠️ Warning — you have made {attemptCount} failed login attempts. Your account will be locked after 5 attempts.
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold h-11"
            style={{ background: "#3b6ef8", borderRadius: 12 }}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm" style={{ color: "#8a8a9a" }}>
          <Link to="/forgot-password" className="font-semibold" style={{ color: "#3b6ef8" }}>
            Forgot your password?
          </Link>
          <p className="mt-2">
            Access is by invitation only.{" "}
            <Link to="/contact" className="font-semibold" style={{ color: "#3b6ef8" }}>
              Book a demo
            </Link>{" "}
            to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
