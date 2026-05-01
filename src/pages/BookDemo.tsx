import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const institutionTypes = ["Unit MFB", "State MFB", "National MFB", "Commercial Bank", "Other"];
const returnOptions = ["CBN Monetary Policy Return", "CBN Forex Return", "AML/CFT Report", "NFIU Return", "MFB Regulatory Return", "Prudential Return", "SCUML Report"];
const timeOptions = ["Less than 4 hours", "4 to 8 hours", "8 to 16 hours", "More than 16 hours"];

const inputStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8,
  padding: "12px 16px", width: "100%", fontSize: 15, color: "#1D1D1F", outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
};

const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = "#0066CC";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.2)";
};
const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
  e.currentTarget.style.boxShadow = "none";
};

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
      {label} {required && <span className="text-[#FF3B30]">*</span>}
    </label>
    {children}
  </div>
);

const BookDemo = () => {
  const [fullName, setFullName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedReturns, setSelectedReturns] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleReturn = (r: string) => setSelectedReturns((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    const trimmed = { fullName: fullName.trim(), institutionName: institutionName.trim(), jobTitle: jobTitle.trim(), phone: phone.trim(), email: email.trim() };
    if (!trimmed.fullName || !trimmed.institutionName || !institutionType || !trimmed.jobTitle || !trimmed.phone || !trimmed.email) { setError("Please fill in all required fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    const messageLines = [`Institution Type: ${institutionType}`, `Job Title: ${trimmed.jobTitle}`, selectedReturns.length > 0 ? `Returns filed manually: ${selectedReturns.join(", ")}` : "", timeSpent ? `Time spent on reporting: ${timeSpent}` : ""].filter(Boolean).join("\n");
    const payload = { full_name: trimmed.fullName.slice(0, 100), company_name: trimmed.institutionName.slice(0, 100), email: trimmed.email.slice(0, 255), phone: trimmed.phone.slice(0, 30), report_type: institutionType, message: messageLines.slice(0, 2000) || null };
    const { error: dbError } = await supabase.from("demo_requests").insert(payload);
    if (dbError) { setLoading(false); setError("Something went wrong. Please try again."); return; }
    try { await supabase.functions.invoke("send-demo-notification", { body: payload }); } catch (err) { console.error("Email notification failed:", err); }
    setLoading(false); setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: "#F5F5F7" }}>
      <div className="w-full" style={{ maxWidth: 440, background: "#FFFFFF", borderRadius: 18, padding: "40px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div className="text-center mb-6">
          <span className="text-[20px] font-semibold text-[#1D1D1F]">RegCo</span>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(52,199,89,0.12)" }}>
              <CheckCircle className="w-9 h-9" style={{ color: "#34C759" }} />
            </div>
            <h2 className="text-[28px] font-bold text-[#1D1D1F] mb-2">Demo Booked!</h2>
            <p className="text-[15px] text-[#6E6E73]">We will email you a confirmation within 24 hours.</p>
            <Link to="/" className="inline-block mt-6 px-6 py-2.5 rounded-full text-[15px] font-medium text-white" style={{ background: "#0066CC", backgroundImage: "none" }}>Back to home</Link>
          </div>
        ) : (
          <>
            <h2 className="text-[28px] font-bold text-[#1D1D1F] text-center mb-1">Book a Demo</h2>
            <p className="text-[15px] text-[#6E6E73] text-center mb-6">Schedule a 20-minute live walkthrough.</p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Field label="Full Name" required><input style={inputStyle} placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} onFocus={focusStyle} onBlur={blurStyle} /></Field>
              <Field label="Institution Name" required><input style={inputStyle} placeholder="Acme MFB Ltd" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} maxLength={100} onFocus={focusStyle} onBlur={blurStyle} /></Field>
              <Field label="Institution Type" required><select style={inputStyle} value={institutionType} onChange={(e) => setInstitutionType(e.target.value)} onFocus={focusStyle} onBlur={blurStyle}><option value="">Select type</option>{institutionTypes.map((t) => <option key={t} value={t}>{t}</option>)}</select></Field>
              <Field label="Job Title" required><input style={inputStyle} placeholder="Head of Compliance" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} maxLength={100} onFocus={focusStyle} onBlur={blurStyle} /></Field>
              <Field label="Phone Number" required><input style={inputStyle} type="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} onFocus={focusStyle} onBlur={blurStyle} /></Field>
              <Field label="Email Address" required><input style={inputStyle} type="email" placeholder="you@institution.com" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} onFocus={focusStyle} onBlur={blurStyle} /></Field>
              <Field label="Returns currently filed manually">
                <div className="space-y-1.5 mt-1">
                  {returnOptions.map((r) => (
                    <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                      <Checkbox checked={selectedReturns.includes(r)} onCheckedChange={() => toggleReturn(r)} />
                      <span className="text-[14px] text-[#1D1D1F]">{r}</span>
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Monthly time spent on reporting"><select style={inputStyle} value={timeSpent} onChange={(e) => setTimeSpent(e.target.value)} onFocus={focusStyle} onBlur={blurStyle}><option value="">Select an option</option>{timeOptions.map((t) => <option key={t} value={t}>{t}</option>)}</select></Field>
              {error && <p className="text-[14px] font-medium text-[#FF3B30]">{error}</p>}
              <button type="submit" disabled={loading} className="w-full text-[17px] font-normal text-white disabled:opacity-60" style={{ background: "#0066CC", borderRadius: 980, padding: "13px 24px", transition: "filter 0.15s", border: "none", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.06)"; }} onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}>
                {loading ? "Submitting…" : "Book My Demo"}
              </button>
              <p className="text-[13px] text-center text-[#86868B] mt-2">
                Prefer WhatsApp?{" "}
                <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="text-[#0066CC] font-medium" style={{ backgroundImage: "none" }}>Message us</a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookDemo;
