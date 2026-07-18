import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Nav, EditorialFooter, C, HELV, MONO, H1, Body, Mono } from "@/components/editorial/EditorialTheme";

const institutionTypes = ["Unit MFB", "State MFB", "National MFB", "Commercial Bank", "Finance Company", "Primary Mortgage Bank", "Fintech"];

const label: React.CSSProperties = {
  fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em",
  textTransform: "uppercase", color: C.ink3, display: "block", marginBottom: 8,
};
const input: React.CSSProperties = {
  width: "100%", background: "transparent",
  border: "none", borderBottom: `1px solid ${C.rule}`,
  color: C.ink, fontFamily: HELV, fontSize: 15,
  padding: "10px 0", outline: "none", transition: "border-color 150ms ease",
};

const BookDemo = () => {
  const [fullName, setFullName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !institutionName.trim() || !institutionType || !phone.trim() || !email.trim()) {
      setError("Please fill in all required fields."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address."); return;
    }
    setLoading(true);
    const payload = {
      full_name: fullName.trim().slice(0, 100),
      company_name: institutionName.trim().slice(0, 100),
      email: email.trim().slice(0, 255),
      phone: phone.trim().slice(0, 30),
      report_type: institutionType,
      message: message.trim().slice(0, 2000) || null,
    };
    const { error: dbError } = await supabase.from("demo_requests").insert(payload);
    if (dbError) { setLoading(false); setError("Something went wrong. Please try again."); return; }
    try { await supabase.functions.invoke("send-demo-notification", { body: payload }); } catch {}
    setLoading(false); setSubmitted(true);
  };

  return (
    <div className="regco-page" style={{ minHeight: "100vh", background: C.page, color: C.ink }}>
      <Nav />
      <main style={{ paddingTop: 160, paddingBottom: 120 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96 }}>
          {/* Left column: editorial context */}
          <div>
            <div style={{ ...Mono, marginBottom: 32 }}>REGCO · BOOK A DEMO</div>
            <h1 style={{ ...H1, fontSize: 48, marginBottom: 28 }}>
              A twenty-minute walkthrough, tailored to your institution.
            </h1>
            <p style={{ ...Body, marginBottom: 40, maxWidth: 480 }}>
              Bring a real export from last quarter. We'll generate the return in under
              five minutes — live, on your own data.
            </p>
            <div style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 24, maxWidth: 440 }}>
              <p style={{ fontFamily: HELV, fontSize: 17, lineHeight: 1.5, color: C.ink, fontStyle: "italic", margin: 0 }}>
                "We replaced four spreadsheets, two consultants and a permanent dread
                of the 20th of every month — with RegCo."
              </p>
              <p style={{ ...Mono, marginTop: 16 }}>HEAD OF COMPLIANCE · TIER-2 MFB</p>
            </div>
          </div>

          {/* Right column: form */}
          <div>
            {submitted ? (
              <div>
                <h2 style={{ ...H1, fontSize: 40, marginBottom: 20 }}>Thank you.</h2>
                <p style={{ ...Body, marginBottom: 32 }}>
                  A member of our team will confirm your demo within twenty-four hours.
                  We sent a confirmation to <span style={{ color: C.ink }}>{email}</span>.
                </p>
                <Link to="/" style={{ ...Body, color: C.ink, textDecoration: "underline", textUnderlineOffset: 4 }}>
                  Return home →
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <label style={label}>Email</label>
                    <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
                  </div>
                  <div>
                    <label style={label}>Phone</label>
                    <input style={input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} required />
                  </div>
                </div>
                <div>
                  <label style={label}>What would you like to see? (optional)</label>
                  <textarea style={{ ...input, resize: "none", paddingTop: 10 }} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} />
                </div>

                {error && <p style={{ fontFamily: HELV, fontSize: 13, color: "#E85D4E", margin: 0 }}>{error}</p>}

                <button type="submit" disabled={loading} style={{
                  marginTop: 8, background: C.cream, color: "#0A0A0A",
                  border: "none", borderRadius: 9999, padding: "14px 24px",
                  fontFamily: HELV, fontSize: 15, fontWeight: 500,
                  cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1,
                  transition: "background 150ms ease",
                }}>
                  {loading ? "Submitting…" : "Request a demo →"}
                </button>

                <p style={{ ...Body, fontSize: 13, color: C.ink3, marginTop: 8 }}>
                  Already a customer?{" "}
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
};

export default BookDemo;
