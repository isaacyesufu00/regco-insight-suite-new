import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import RegCoLogo from "@/components/RegCoLogo";

const institutionTypes = ["Unit MFB", "State MFB", "National MFB", "Commercial Bank", "Other"];

const returnOptions = [
  "CBN Monetary Policy Return",
  "CBN Forex Return",
  "AML/CFT Report",
  "NFIU Return",
  "MFB Regulatory Return",
  "Prudential Return",
  "SCUML Report",
];

const timeOptions = [
  "Less than 4 hours",
  "4 to 8 hours",
  "8 to 16 hours",
  "More than 16 hours",
];

const inputStyle: React.CSSProperties = {
  background: "#FAFAFA",
  border: "1.5px solid #E0E0E0",
  borderRadius: 10,
  padding: "12px 14px",
  color: "#0A0A0A",
  fontSize: 14,
  width: "100%",
  outline: "none",
  transition: "all 0.2s",
};

const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = "#0A0A0A";
  e.currentTarget.style.background = "#FFFFFF";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,98,0,0.1)";
};
const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = "#E0E0E0";
  e.currentTarget.style.background = "#FAFAFA";
  e.currentTarget.style.boxShadow = "none";
};

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-[13px] font-medium mb-1.5" style={{ color: "#333" }}>
      {label} {required && <span style={{ color: "#FF6200" }}>*</span>}
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

  const toggleReturn = (r: string) => {
    setSelectedReturns((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = {
      fullName: fullName.trim(),
      institutionName: institutionName.trim(),
      jobTitle: jobTitle.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };

    if (!trimmed.fullName || !trimmed.institutionName || !institutionType || !trimmed.jobTitle || !trimmed.phone || !trimmed.email) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const messageLines = [
      `Institution Type: ${institutionType}`,
      `Job Title: ${trimmed.jobTitle}`,
      selectedReturns.length > 0 ? `Returns filed manually: ${selectedReturns.join(", ")}` : "",
      timeSpent ? `Time spent on reporting: ${timeSpent}` : "",
    ].filter(Boolean).join("\n");

    const payload = {
      full_name: trimmed.fullName.slice(0, 100),
      company_name: trimmed.institutionName.slice(0, 100),
      email: trimmed.email.slice(0, 255),
      phone: trimmed.phone.slice(0, 30),
      report_type: institutionType,
      message: messageLines.slice(0, 2000) || null,
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

  const stats = [
    { value: "20 min", label: "Demo duration" },
    { value: "Live", label: "Real CBS data" },
    { value: "Free", label: "No commitment" },
  ];

  return (
    <AuthSplitLayout
      headline="See RegCo in Action."
      tagline="Watch a live report generate in 5 minutes."
      stats={stats}
    >
      <div className="flex justify-center mb-6">
        <RegCoLogo size="md" />
      </div>

      {submitted ? (
        <div className="text-center py-8">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(255,98,0,0.12)" }}
          >
            <CheckCircle className="w-9 h-9" style={{ color: "#FF6200" }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#0A0A0A" }}>
            Demo Booked!
          </h2>
          <p className="text-sm" style={{ color: "#888" }}>
            We will email you a confirmation within 24 hours.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-5 py-2.5 rounded-[10px] text-sm font-semibold border-2"
            style={{ borderColor: "#0A0A0A", color: "#0A0A0A" }}
          >
            Back to home
          </Link>
        </div>
      ) : (
        <>
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: "#0A0A0A", letterSpacing: "-0.02em" }}
          >
            Book a Demo
          </h2>
          <p className="text-[15px] text-center mb-6" style={{ color: "#888" }}>
            Schedule a live walkthrough with our team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Field label="Full Name" required>
              <input
                style={inputStyle}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={100}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>
            <Field label="Institution Name" required>
              <input
                style={inputStyle}
                placeholder="Acme MFB Ltd"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                maxLength={100}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>
            <Field label="Institution Type" required>
              <select
                style={inputStyle}
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              >
                <option value="">Select type</option>
                {institutionTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Job Title" required>
              <input
                style={inputStyle}
                placeholder="Head of Compliance"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                maxLength={100}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>
            <Field label="Phone Number" required>
              <input
                style={inputStyle}
                type="tel"
                placeholder="+234 800 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={30}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>
            <Field label="Email Address" required>
              <input
                style={inputStyle}
                type="email"
                placeholder="you@institution.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            <Field label="Returns currently filed manually">
              <div className="space-y-1.5 mt-1">
                {returnOptions.map((r) => (
                  <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                    <Checkbox
                      checked={selectedReturns.includes(r)}
                      onCheckedChange={() => toggleReturn(r)}
                    />
                    <span className="text-sm" style={{ color: "#333" }}>{r}</span>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Monthly time spent on reporting">
              <select
                style={inputStyle}
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              >
                <option value="">Select an option</option>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>

            {error && (
              <p className="text-sm font-medium" style={{ color: "#ef4444" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold text-white text-base transition-all hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #FF9A00 0%, #FF3D00 100%)",
                borderRadius: 10,
                height: 52,
                boxShadow: "0 4px 16px rgba(255,98,0,0.25)",
              }}
            >
              {loading ? "Submitting…" : "Book My Demo"}
            </button>

            <p className="text-xs text-center mt-3 leading-relaxed" style={{ color: "#888" }}>
              Prefer WhatsApp?{" "}
              <a
                href="https://wa.me/2348000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold"
                style={{ color: "#FF6200" }}
              >
                Message us
              </a>
            </p>
          </form>
        </>
      )}
    </AuthSplitLayout>
  );
};

export default BookDemo;
