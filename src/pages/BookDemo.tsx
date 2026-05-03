import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const institutionTypes = ["Unit MFB", "State MFB", "National MFB", "Commercial Bank", "Finance Company", "Primary Mortgage Bank", "Fintech"];

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

    const trimmed = {
      fullName: fullName.trim(),
      institutionName: institutionName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };

    if (!trimmed.fullName || !trimmed.institutionName || !institutionType || !trimmed.phone || !trimmed.email) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const payload = {
      full_name: trimmed.fullName.slice(0, 100),
      company_name: trimmed.institutionName.slice(0, 100),
      email: trimmed.email.slice(0, 255),
      phone: trimmed.phone.slice(0, 30),
      report_type: institutionType,
      message: message.trim().slice(0, 2000) || null,
    };

    const { error: dbError } = await supabase.from("demo_requests").insert(payload);
    if (dbError) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      return;
    }

    try {
      await supabase.functions.invoke("send-demo-notification", { body: payload });
    } catch (err) {
      console.error("Email notification failed:", err);
    }

    setLoading(false);
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(0,0,0,0.04)",
    border: "1.5px solid rgba(0,0,0,0.12)",
    borderRadius: 10,
    padding: "13px 16px",
    fontSize: 17,
    color: "#1D1D1F",
    outline: "none",
    transition: "all 0.2s",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "#0066CC";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.15)";
    e.target.style.background = "white";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(0,0,0,0.12)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "rgba(0,0,0,0.04)";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "#F5F5F7" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[480px]"
        style={{ background: "white", borderRadius: 18, padding: 52, boxShadow: "0 4px 32px rgba(0,0,0,0.1)" }}
      >
        <div className="text-center mb-6">
          <Link to="/" style={{ fontWeight: 600, fontSize: 20, color: "#1D1D1F", textDecoration: "none" }}>
            RegCo
          </Link>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-8"
          >
            <svg className="mx-auto mb-6" width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="38" fill="none" stroke="#34C759" strokeWidth="3" />
              <motion.path
                d="M24 42 L34 52 L56 30"
                fill="none"
                stroke="#34C759"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </svg>
            <h2 style={{ fontWeight: 700, fontSize: 28, color: "#1D1D1F", marginBottom: 8 }}>Demo Booked.</h2>
            <p style={{ fontSize: 17, color: "#6E6E73" }}>We will confirm your time within 24 hours.</p>
            <p style={{ fontSize: 15, color: "#0066CC", marginTop: 8 }}>isaacyesufu00@gmail.com</p>
            <Link
              to="/"
              className="inline-block mt-8"
              style={{
                background: "rgba(0,0,0,0.06)",
                color: "#1D1D1F",
                borderRadius: 980,
                padding: "10px 24px",
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Back to home
            </Link>
          </motion.div>
        ) : (
          <>
            <h1 style={{ fontWeight: 700, fontSize: 28, color: "#1D1D1F", textAlign: "center", marginBottom: 8 }}>
              Book a Demo
            </h1>
            <p style={{ fontSize: 15, color: "#6E6E73", textAlign: "center", marginBottom: 28 }}>
              Schedule a 20-minute live walkthrough.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              <input placeholder="Institution Name *" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} required maxLength={100} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              <select value={institutionType} onChange={(e) => setInstitutionType(e.target.value)} style={{ ...inputStyle, appearance: "none" }} onFocus={handleFocus as any} onBlur={handleBlur as any}>
                <option value="">Institution Type *</option>
                {institutionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="email" placeholder="Email Address *" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              <input type="tel" placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={30} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              <textarea
                placeholder="What would you like to see?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={2000}
                style={{ ...inputStyle, height: 90, resize: "none" as const }}
                onFocus={handleFocus as any}
                onBlur={handleBlur as any}
              />

              {error && <p style={{ fontSize: 14, color: "#FF3B30", fontWeight: 500 }}>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: 52,
                  background: "#0066CC",
                  color: "white",
                  borderRadius: 10,
                  fontSize: 17,
                  fontWeight: 500,
                  border: "none",
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                {loading ? "Submitting..." : "Book My Demo"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default BookDemo;
