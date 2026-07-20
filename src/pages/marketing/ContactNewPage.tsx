import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHero, MAX, NARROW, T, DarkPill } from "./_shared";

const REPORTS = ["CBN Returns", "NDIC Filing", "SEC Quarterly Report", "FIRS Compliance", "Other"];

const inputStyle: React.CSSProperties = {
  width: "100%", height: 44, padding: "0 14px", borderRadius: 8,
  border: `1px solid ${T.ink26}`, background: "#FFFFFF", color: T.ink,
  fontFamily: "Inter, system-ui, sans-serif", fontSize: 15, outline: "none",
  boxSizing: "border-box",
};

export default function ContactNewPage() {
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [report, setReport] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const n = fullName.trim(), c = company.trim(), em = email.trim(), ph = phone.trim(), m = message.trim();
    if (!n || !c || !em) { setError("Please fill in all required fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    const payload = {
      full_name: n.slice(0, 100), company_name: c.slice(0, 100), email: em.slice(0, 255),
      phone: ph.slice(0, 30) || null, report_type: report || null, message: m.slice(0, 2000) || null,
    };
    const { error: dbError } = await supabase.from("demo_requests").insert(payload);
    if (dbError) { setLoading(false); setError("Something went wrong. Please try again."); return; }
    try { await supabase.functions.invoke("send-demo-notification", { body: payload }); } catch (err) { console.error(err); }
    setLoading(false);
    setDone(true);
  };

  return (
    <PageShell>
      <PageHero
        kicker="Company"
        title="Contact us."
        sub="Have a question about onboarding, reporting, or security? Tell us what you need and our team will respond within 24 hours."
      />
      <div style={{ maxWidth: 520, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginBottom: 32 }}>
          <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 40, padding: "0 18px", borderRadius: 999, background: "#25D366", color: "#FFFFFF", fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Chat with us on WhatsApp
          </a>
          <span style={{ color: T.ink66, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14 }}>RegCo — our headquarters city</span>
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: T.ink0F, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <span style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 24 }}>✓</span>
            </div>
            <div style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 22, fontWeight: 600 }}>Thank you.</div>
            <div style={{ color: T.ink99, fontFamily: "Inter, system-ui, sans-serif", fontSize: 15, marginTop: 8 }}>We'll be in touch within 24 hours.</div>
            <div style={{ marginTop: 24 }}><DarkPill to="/">Back to home</DarkPill></div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, fontWeight: 500 }}>Full name *</label>
              <input style={inputStyle} placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, fontWeight: 500 }}>Company name *</label>
              <input style={inputStyle} placeholder="Acme Bank Ltd" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={100} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, fontWeight: 500 }}>Email address *</label>
              <input style={inputStyle} type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, fontWeight: 500 }}>Phone <span style={{ color: T.ink66 }}>(optional)</span></label>
              <input style={inputStyle} type="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, fontWeight: 500 }}>Which reports do you need help with?</label>
              <select style={{ ...inputStyle, height: 44 }} value={report} onChange={(e) => setReport(e.target.value)}>
                <option value="">Select an option</option>
                {REPORTS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, fontWeight: 500 }}>Tell us about your needs <span style={{ color: T.ink66 }}>(optional)</span></label>
              <textarea style={{ ...inputStyle, height: "auto", minHeight: 110, padding: 12, resize: "vertical", fontFamily: "Inter, system-ui, sans-serif", fontSize: 15 }} placeholder="Describe your regulatory reporting challenges..." value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} />
            </div>
            {error && <div style={{ color: T.red, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{
              height: 44, borderRadius: 999, border: "none", cursor: "pointer",
              background: T.inkE6, color: T.canvasTone, fontFamily: "Inter, system-ui, sans-serif", fontSize: 15, fontWeight: 500,
            }}>{loading ? "Submitting…" : "Send message"}</button>
          </form>
        )}
      </div>
    </PageShell>
  );
}
