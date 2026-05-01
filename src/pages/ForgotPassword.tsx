import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) { setError("Please enter your email address."); return; }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (resetError) setError(resetError.message);
    else setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8,
    padding: "12px 16px", width: "100%", fontSize: 17, color: "#1D1D1F", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F5F7" }}>
        <div className="w-full text-center" style={{ maxWidth: 400, background: "#FFFFFF", borderRadius: 18, padding: 48, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(0,102,204,0.1)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
          </div>
          <h2 className="text-[24px] font-bold text-[#1D1D1F] mb-2">Check your email</h2>
          <p className="text-[15px] text-[#6E6E73] mb-6">If an account exists for <strong className="text-[#1D1D1F]">{email}</strong>, we've sent a password reset link.</p>
          <Link to="/login" className="text-[14px] text-[#0066CC] font-medium" style={{ backgroundImage: "none" }}>Back to Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F5F7" }}>
      <div className="w-full" style={{ maxWidth: 400, background: "#FFFFFF", borderRadius: 18, padding: 48, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div className="text-center mb-8"><span className="text-[20px] font-semibold text-[#1D1D1F]">RegCo</span></div>
        <h2 className="text-[28px] font-bold text-[#1D1D1F] text-center mb-1">Reset password</h2>
        <p className="text-[15px] text-[#6E6E73] text-center mb-8">Enter your email to receive a reset link</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            style={inputStyle} type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required
            onFocus={(e) => { e.currentTarget.style.borderColor = "#0066CC"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.2)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {error && <p className="text-[14px] font-medium text-[#FF3B30]">{error}</p>}
          <button type="submit" disabled={loading} className="w-full text-[17px] font-normal text-white disabled:opacity-60" style={{ background: "#0066CC", borderRadius: 980, padding: "13px 24px", border: "none", cursor: "pointer" }}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="mt-6 text-center text-[14px] text-[#6E6E73]">
          Remember your password? <Link to="/login" className="text-[#0066CC] font-medium" style={{ backgroundImage: "none" }}>Back to Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
