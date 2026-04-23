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
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F8F8]">
        <div className="w-full max-w-md rounded-2xl p-12 border border-border bg-background text-center">
          <div className="flex justify-center mb-6"><RegCoLogo size={26} /></div>
          <h2 className="text-xl font-bold mb-2 text-foreground">Account Temporarily Locked</h2>
          <p className="text-[14px] text-[#666] mb-4">
            Try again in 15 minutes or reset your password.
          </p>
          <div className="text-3xl font-mono font-bold mb-6 text-foreground">{countdown}</div>
          <Button asChild variant="outline">
            <Link to="/forgot-password">Forgot Password</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F8F8]">
      <div className="w-full max-w-md rounded-2xl p-12 border border-border bg-background">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center mb-4">
            <RegCoLogo size={26} />
          </Link>
          <p className="text-[14px] text-[#666]">Sign in to your compliance dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[13px] font-medium text-[#333]">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[13px] font-medium text-[#333]">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          {attemptCount >= 3 && attemptCount < 5 && (
            <div className="rounded-lg px-4 py-3 text-sm font-medium bg-[#F8F8F8] text-foreground border border-border">
              Warning — {attemptCount} failed attempts. Account locks after 5.
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full h-12 rounded-lg">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <div className="mt-6 text-center text-[14px] text-[#666]">
          <Link to="/forgot-password" className="font-semibold text-foreground hover:text-brand-gradient">
            Forgot your password?
          </Link>
          <p className="mt-2">
            Access is by invitation only.{" "}
            <Link to="/contact" className="font-semibold text-foreground">Book a demo</Link>{" "}to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
