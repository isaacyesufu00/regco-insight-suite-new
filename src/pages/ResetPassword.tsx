import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PasswordStrength = "weak" | "fair" | "strong";

function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) return "weak";
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  if (password.length >= 12 && hasUpper && hasLower && hasNumber && hasSpecial) return "strong";
  return "fair";
}

const strengthConfig: Record<PasswordStrength, { label: string; value: number; color: string }> = {
  weak: { label: "Weak", value: 33, color: "#ef4444" },
  fair: { label: "Fair", value: 66, color: "#f59e0b" },
  strong: { label: "Strong", value: 100, color: "#22c55e" },
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const config = strengthConfig[strength];
  const isWeak = strength === "weak";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isWeak) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-secondary">
        <div className="w-full max-w-md rounded-2xl p-8 shadow-lg bg-card text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-accent">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-foreground">Password Updated</h2>
          <p className="text-sm text-muted-foreground">
            Your password has been reset successfully. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const submitButton = (
    <Button
      type="submit"
      disabled={loading || isWeak}
      className="w-full font-semibold h-11 rounded-xl"
      style={{ background: isWeak ? undefined : "#3b6ef8" }}
    >
      {loading ? "Updating..." : "Reset Password"}
    </Button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-secondary">
      <div className="w-full max-w-md rounded-2xl p-8 shadow-lg bg-card">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-2 mb-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-bold text-foreground">RegCo</span>
          </Link>
          <p className="text-sm text-muted-foreground">Set your new password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl"
            />
            {password.length > 0 && (
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#e5e7eb" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${config.value}%`, background: config.color }}
                  />
                </div>
                <span className="text-xs font-medium shrink-0" style={{ color: config.color }}>
                  {config.label}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
          {isWeak && password.length > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block">{submitButton}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your password is too weak to continue</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            submitButton
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
