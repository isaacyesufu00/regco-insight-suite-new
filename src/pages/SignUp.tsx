import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import EditorialAuthShell from "@/components/editorial/EditorialAuthShell";

type Strength = "weak" | "fair" | "strong";
const strengthOf = (p: string): Strength => {
  if (p.length < 8) return "weak";
  const checks = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;
  if (p.length >= 12 && checks === 4) return "strong";
  return "fair";
};
const strengthMeta: Record<Strength, { label: string; pct: number; color: string }> = {
  weak:   { label: "Weak",   pct: 33,  color: "#9C2A1F" },
  fair:   { label: "Fair",   pct: 66,  color: "#B8862A" },
  strong: { label: "Strong", pct: 100, color: "#3F6B4A" },
};

const institutionTypes = ["Unit MFB", "State MFB", "National MFB", "Commercial Bank", "Finance Company", "Primary Mortgage Bank", "Fintech"];

const fieldClass =
  "w-full bg-transparent border-0 border-b border-ink-15 px-0 py-3 text-[15px] text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-ink transition-colors";

export default function SignUp() {
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

  const strength = useMemo(() => strengthOf(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !institutionName.trim() || !institutionType || !email.trim() || !password) {
      setError("Please complete all required fields.");
      return;
    }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName.trim(),
          company_name: institutionName.trim(),
          institution_type: institutionType,
        },
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message || "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <EditorialAuthShell
        title="Check your inbox."
        subtitle={`We sent a confirmation link to ${email}. Open it to finish setting up your account.`}
        footer={<Link to="/sign-in" className="text-ink underline underline-offset-4 decoration-rust">Back to sign in</Link>}
      >
        <p className="text-[14px] text-ink-muted leading-relaxed">
          The link expires in 24 hours. If you don't see the email, check your spam folder.
        </p>
      </EditorialAuthShell>
    );
  }

  return (
    <EditorialAuthShell
      title="Create your account."
      subtitle="Built for licensed regulated financial institutions."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-ink underline underline-offset-4 decoration-rust hover:text-rust transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Full name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} required className={fieldClass} />
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Institution</label>
          <input value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} maxLength={100} required className={fieldClass} />
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">License category</label>
          <select value={institutionType} onChange={(e) => setInstitutionType(e.target.value)} required
            className={`${fieldClass} appearance-none ${institutionType ? "" : "text-ink-muted/60"}`}>
            <option value="">Select…</option>
            {institutionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Work email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required className={fieldClass} />
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={fieldClass} />
          {password && (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 h-[2px] bg-ink/10 rounded-full overflow-hidden">
                <div className="h-full transition-all" style={{ width: `${strengthMeta[strength].pct}%`, background: strengthMeta[strength].color }} />
              </div>
              <span className="font-mono text-[11px]" style={{ color: strengthMeta[strength].color }}>{strengthMeta[strength].label}</span>
            </div>
          )}
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Confirm password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={fieldClass} />
        </div>

        {error && <p className="text-[13px] text-[var(--rust)]">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-full bg-ink text-[var(--paper)] text-[14.5px] font-medium hover:bg-[var(--rust)] disabled:opacity-60 transition-colors">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </EditorialAuthShell>
  );
}
