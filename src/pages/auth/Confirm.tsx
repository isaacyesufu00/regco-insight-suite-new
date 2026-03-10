import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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

const Confirm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const config = strengthConfig[strength];
  const isWeak = strength === "weak";

  // Extract token from URL on mount
  useEffect(() => {
    const initToken = async () => {
      try {
        // Try to get token from hash (recovery/signup flow)
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const hashToken = params.get("access_token");
        const hashType = params.get("type");

        // Try to get token from query params (invite flow)
        const queryToken = searchParams.get("token");
        const queryType = searchParams.get("type");

        const token = hashToken || queryToken;
        const type = hashType || queryType;

        if (!token) {
          setHasValidToken(false);
          setLoading(false);
          return;
        }

        // For hash-based tokens (recovery/signup), set the session
        if (hashToken && (hashType === "recovery" || hashType === "signup")) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: hashToken,
            refresh_token: params.get("refresh_token") || "",
          });

          if (!sessionError) {
            setHasValidToken(true);
          } else {
            setHasValidToken(false);
          }
        }
        // For query-based tokens (invite), verify OTP
        else if (queryToken && queryType === "invite") {
          const email = searchParams.get("email");
          if (!email) {
            setHasValidToken(false);
            setLoading(false);
            return;
          }

          const { error: otpError } = await supabase.auth.verifyOtp({
            email,
            token: queryToken,
            type: "invite",
          });

          if (!otpError) {
            setHasValidToken(true);
          } else {
            setHasValidToken(false);
          }
        } else {
          setHasValidToken(false);
        }
      } catch (err) {
        setHasValidToken(false);
      } finally {
        setLoading(false);
      }
    };

    initToken();
  }, [searchParams]);

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
      setTimeout(() => navigate("/dashboard"), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#eef2ff" }}>
        <div className="w-full max-w-md rounded-2xl p-8 shadow-lg text-center" style={{ background: "#ffffff" }}>
          <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin border-4 border-gray-200 border-t-blue-500" />
          <p style={{ color: "#8a8a9a" }}>Verifying your link...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#eef2ff" }}>
        <div className="w-full max-w-md rounded-2xl p-8 shadow-lg text-center" style={{ background: "#ffffff" }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#f0fdf4" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1a1a2e" }}>Password Set Successfully</h2>
          <p className="text-sm" style={{ color: "#8a8a9a" }}>
            Your account is ready. Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!hasValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#eef2ff" }}>
        <div className="w-full max-w-md rounded-2xl p-8 shadow-lg text-center" style={{ background: "#ffffff" }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#fef2f2" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1a1a2e" }}>Invalid or Expired Link</h2>
          <p className="text-sm mb-6" style={{ color: "#8a8a9a" }}>
            This link is invalid or has expired. Please contact <a href="mailto:support@regco.com" className="font-semibold" style={{ color: "#3b6ef8" }}>support@regco.com</a> for assistance.
          </p>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to="/login">Back to Login</Link>
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
      {loading ? "Setting Password..." : "Set Password and Access Dashboard"}
    </Button>
  );

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
          <h1 className="text-2xl font-bold mt-4 mb-2" style={{ color: "#1a1a2e" }}>Set Up Your Password</h1>
          <p className="text-sm" style={{ color: "#8a8a9a" }}>
            Welcome to RegCo. Please set a secure password to access your compliance dashboard.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <Label htmlFor="confirmPassword" style={{ color: "#1a1a2e" }}>Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ borderRadius: 12 }}
            />
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
      </div>
    </div>
  );
};

export default Confirm;
