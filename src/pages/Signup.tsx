import { useState, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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

const planLabels: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
};

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan");
  const planName = selectedPlan ? planLabels[selectedPlan] : null;
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const config = strengthConfig[strength];
  const isWeak = strength === "weak";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = fullName.trim();
    const trimmedCompany = companyName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedCompany || !trimmedEmail || !password || !confirmPassword) {
      setError("Please fill in all fields.");
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
      email: trimmedEmail,
      password,
      options: {
        data: { full_name: trimmedName, company_name: trimmedCompany },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else if (data.user && !data.session) {
      setError("");
      setShowConfirmation(true);
    } else {
      navigate("/dashboard");
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#eef2ff" }}>
        <div className="w-full max-w-md rounded-2xl p-8 shadow-lg text-center" style={{ background: "#ffffff" }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#f0fdf4" }}>
            <CheckCircle className="w-8 h-8" style={{ color: "#22c55e" }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1a1a2e" }}>Check your email</h2>
          <p className="text-sm mb-6" style={{ color: "#8a8a9a" }}>
            We've sent a confirmation link to your email. Please click it to verify your account, then come back and log in.
          </p>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const submitButton = (
    <Button
      type="submit"
      disabled={loading || isWeak}
      className="w-full text-white font-semibold h-11"
      style={{ background: isWeak ? undefined : "#3b6ef8", borderRadius: 12 }}
    >
      {loading ? "Creating account..." : "Create Account"}
    </Button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#eef2ff" }}>
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
            Create your compliance account
          </p>
          {planName && (
            <div className="mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold" style={{ background: "#eef2ff", color: "#3b6ef8" }}>
              You are signing up for the {planName} Plan
            </div>
          )}
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" style={{ color: "#1a1a2e" }}>Full Name</Label>
            <Input id="name" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ borderRadius: 12 }} maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" style={{ color: "#1a1a2e" }}>Company Name</Label>
            <Input id="company" placeholder="Acme Bank Ltd" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required style={{ borderRadius: 12 }} maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: "#1a1a2e" }}>Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ borderRadius: 12 }} maxLength={255} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: "#1a1a2e" }}>Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} style={{ borderRadius: 12 }} />
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
            <Label htmlFor="confirm" style={{ color: "#1a1a2e" }}>Confirm Password</Label>
            <Input id="confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ borderRadius: 12 }} />
          </div>
          {error && (
            <p className="text-sm font-medium" style={{ color: "#ef4444" }}>{error}</p>
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
        <p className="mt-6 text-center text-sm" style={{ color: "#8a8a9a" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold" style={{ color: "#3b6ef8" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
