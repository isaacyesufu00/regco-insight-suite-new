import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Nav, EditorialFooter, C, HELV, MONO, H1, Body, Mono } from "@/components/editorial/EditorialTheme";

type Strength = "weak" | "fair" | "strong";
const strengthOf = (p: string): Strength => {
  if (p.length < 8) return "weak";
  const checks = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;
  if (p.length >= 12 && checks === 4) return "strong";
  return "fair";
};
const strengthMeta: Record<Strength, { label: string; pct: number; color: string }> = {
  weak:   { label: "Weak",   pct: 33,  color: "#E85D4E" },
  fair:   { label: "Fair",   pct: 66,  color: "#D6A94E" },
  strong: { label: "Strong", pct: 100, color: "#8FB99B" },
};

const institutionTypes = ["Unit MFB", "State MFB", "National MFB", "Commercial Bank", "Finance Company", "Primary Mortgage Bank", "Fintech"];

const label: React.CSSProperties = {
  fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em",
  textTransform: "uppercase", color: C.ink3, display: "block", marginBottom: 8,
};
const input: React.CSSProperties = {
  width: "100%", background: "transparent",
  border: "none", borderBottom: `1px solid ${C.rule}`,
  color: C.ink, fontFamily: HELV, fontSize: 15,
  padding: "10px 0", outline: "none",
};

export default function SignUp() {
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
      setError("Please complete all required fields."); return;
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
    if (signUpError) { setError(signUpError.message || "Something went wrong. Please try again."); return; }
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.page, color: C.ink }}>
      <Nav />
      <main style={{ paddingTop: 160, paddingBottom: 120 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96 }}>
          <div>
            <div style={{ ...Mono, marginBottom: 32 }}>REGCO · CREATE ACCOUNT</div>
            <h1 style={{ ...H1, fontSize: 48, marginBottom: 28 }}>
              Built for licensed regulated financial institutions.
            </h1>
            <p style={{ ...Body, marginBottom: 40, maxWidth: 480 }}>
              Set up your workspace in under two minutes. Invite your compliance team,
              connect your core banking system, and file your next return the same day.
            </p>
            <div style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 24, maxWidth: 440 }}>
              <p style={{ ...Mono, marginBottom: 12 }}>WHAT'S INCLUDED</p>
              <ul style={{ ...Body, listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                <li>— Automated CBN & NFIU filings</li>
                <li>— Live BVN, NIN, sanctions & PEP screening</li>
                <li>— Full audit trail and case management</li>
                <li>— Bank-grade security, RLS by institution</li>
              </ul>
            </div>
          </div>

          <div>
            {submitted ? (
              <div>
                <h2 style={{ ...H1, fontSize: 40, marginBottom: 20 }}>Check your inbox.</h2>
                <p style={{ ...Body, marginBottom: 24 }}>
                  We sent a confirmation link to <span style={{ color: C.ink }}>{email}</span>.
                  Open it to finish setting up your account.
                </p>
                <p style={{ ...Body, fontSize: 13, color: C.ink3, marginBottom: 24 }}>
                  The link expires in 24 hours. If you don't see the email, check your spam folder.
                </p>
                <Link to="/sign-in" style={{ ...Body, color: C.ink, textDecoration: "underline", textUnderlineOffset: 4 }}>
                  Back to sign in →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <label style={label}>Full name</label>
                  <input style={input} value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} required />
                </div>
                <div>
                  <label style={label}>Institution</label>
                  <input style={input} value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} maxLength={100} required />
                </div>
                <div>
                  <label style={label}>License category</label>
                  <select style={{ ...input, appearance: "none" }} value={institutionType} onChange={(e) => setInstitutionType(e.target.value)} required>
                    <option value="" style={{ background: C.page }}>Select…</option>
                    {institutionTypes.map((t) => <option key={t} value={t} style={{ background: C.page }}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={label}>Work email</label>
                  <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
                </div>
                <div>
                  <label style={label}>Password</label>
                  <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  {password && (
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1, height: 2, background: C.rule, borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${strengthMeta[strength].pct}%`, background: strengthMeta[strength].color, transition: "width 200ms ease" }} />
                      </div>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: strengthMeta[strength].color }}>
                        {strengthMeta[strength].label}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label style={label}>Confirm password</label>
                  <input style={input} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>

                {error && <p style={{ fontFamily: HELV, fontSize: 13, color: "#E85D4E", margin: 0 }}>{error}</p>}

                <button type="submit" disabled={loading} style={{
                  marginTop: 8, background: C.cream, color: "#0A0A0A",
                  border: "none", borderRadius: 9999, padding: "14px 24px",
                  fontFamily: HELV, fontSize: 15, fontWeight: 500,
                  cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1,
                }}>
                  {loading ? "Creating account…" : "Create account →"}
                </button>

                <p style={{ ...Body, fontSize: 13, color: C.ink3, marginTop: 8 }}>
                  Already have an account?{" "}
                  <Link to="/sign-in" style={{ color: C.ink, textDecoration: "underline", textUnderlineOffset: 4 }}>Sign in</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
      <EditorialFooter />
    </div>
  );
}
