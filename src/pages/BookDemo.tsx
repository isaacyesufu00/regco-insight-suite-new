import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-lg">
          <div className="rounded-2xl p-8 card-elevated border border-border/50">
            <div className="text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-2xl font-bold font-display text-foreground">RegCo</span>
              </Link>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-primary/10">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Thank you</h2>
                <p className="text-sm text-muted-foreground">
                  A member of our team will reach out within 1 business day to schedule your demo.
                </p>
                <Button asChild variant="outline" className="mt-6 rounded-full px-6">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center text-foreground mb-1">Book a Free Demo</h2>
                <p className="text-sm text-center text-muted-foreground mb-8">
                  See how RegCo can simplify your regulatory reporting. Fill in your details and our team will be in touch.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Full Name *</Label>
                    <Input placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Institution Name *</Label>
                    <Input placeholder="Acme MFB Ltd" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} required maxLength={100} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Institution Type *</Label>
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select type</option>
                      {institutionTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Job Title *</Label>
                    <Input placeholder="Head of Compliance" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required maxLength={100} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Phone Number *</Label>
                    <Input type="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={30} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Email Address *</Label>
                    <Input type="email" placeholder="you@institution.com" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} className="rounded-xl" />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-foreground">Which returns do you currently file manually?</Label>
                    <div className="space-y-2">
                      {returnOptions.map((r) => (
                        <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                          <Checkbox
                            checked={selectedReturns.includes(r)}
                            onCheckedChange={() => toggleReturn(r)}
                          />
                          <span className="text-sm text-foreground">{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">How long does your team spend on reporting per month?</Label>
                    <select
                      value={timeSpent}
                      onChange={(e) => setTimeSpent(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select an option</option>
                      {timeOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                  <Button type="submit" disabled={loading} className="w-full rounded-full font-semibold h-11">
                    {loading ? "Submitting..." : "Request a Demo"}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
                  We will contact you within 1 business day to confirm your demo time. Prefer WhatsApp? Message us directly at{" "}
                  <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                    +234 800 000 0000
                  </a>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookDemo;
