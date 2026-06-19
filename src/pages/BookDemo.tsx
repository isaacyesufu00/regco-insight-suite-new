import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import EditorialAuthShell from "@/components/editorial/EditorialAuthShell";

const institutionTypes = ["Unit MFB", "State MFB", "National MFB", "Commercial Bank", "Finance Company", "Primary Mortgage Bank", "Fintech"];

const fieldClass =
  "w-full bg-transparent border-0 border-b border-ink-15 px-0 py-3 text-[15px] text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-ink transition-colors";

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
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
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
    if (dbError) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      return;
    }
    try { await supabase.functions.invoke("send-demo-notification", { body: payload }); } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <EditorialAuthShell
        title="Thank you."
        subtitle="A member of our team will confirm your demo within twenty-four hours."
        quote="Bring a real export from last quarter. We'll generate the return in under five minutes."
        attribution="What to expect"
        footer={<Link to="/" className="text-ink underline underline-offset-4 decoration-rust">Return home</Link>}
      >
        <p className="font-serif italic text-[20px] text-ink-muted">
          We sent a confirmation to <span className="text-ink not-italic">{email}</span>.
        </p>
      </EditorialAuthShell>
    );
  }

  return (
    <EditorialAuthShell
      title="Book a demo."
      subtitle="A twenty-minute walkthrough, tailored to your institution."
      quote="We replaced four spreadsheets, two consultants and a permanent dread of the 20th of every month — with RegCo."
      attribution="Head of Compliance · Tier-2 MFB"
      footer={<>Already a customer?{" "}<Link to="/sign-in" className="text-ink underline underline-offset-4 decoration-rust">Sign in</Link></>}
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
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required className={fieldClass} />
          </div>
          <div>
            <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} required className={fieldClass} />
          </div>
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">What would you like to see? (optional)</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={3}
            className={`${fieldClass} resize-none py-3`} />
        </div>

        {error && <p className="text-[13px] text-[var(--rust)]">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-full bg-ink text-[var(--paper)] text-[14.5px] font-medium hover:bg-[var(--rust)] disabled:opacity-60 transition-colors">
          {loading ? "Submitting…" : "Request a demo"}
        </button>
      </form>
    </EditorialAuthShell>
  );
};

export default BookDemo;
