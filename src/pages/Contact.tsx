import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const reportOptions = [
  "CBN Returns",
  "NDIC Filing",
  "SEC Quarterly Report",
  "FIRS Compliance",
  "Other",
];

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reportType, setReportType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = fullName.trim();
    const trimmedCompany = companyName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedCompany || !trimmedEmail) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const payload = {
      full_name: trimmedName.slice(0, 100),
      company_name: trimmedCompany.slice(0, 100),
      email: trimmedEmail.slice(0, 255),
      phone: trimmedPhone.slice(0, 30) || null,
      report_type: reportType || null,
      message: trimmedMessage.slice(0, 2000) || null,
    };

    const { error: dbError } = await supabase.from("demo_requests").insert(payload);
    if (dbError) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      return;
    }

    try {
      await supabase.functions.invoke("send-demo-notification", { body: payload });
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
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

            {/* WhatsApp + Location */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="https://wa.me/2348000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                style={{ background: "#25D366" }}
              >
                <MessageCircle className="w-4 h-4" />
                Chat with us on WhatsApp
              </a>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Abuja, Nigeria
              </span>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-primary/10">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Thank you!</h2>
                <p className="text-sm text-muted-foreground">We'll be in touch within 24 hours.</p>
                <Button asChild variant="outline" className="mt-6 rounded-full px-6">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center text-foreground mb-1">Contact Us</h2>
                <p className="text-sm text-center text-muted-foreground mb-8">
                  Have a question? Fill in your details and our team will get back to you within 24 hours.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Full Name *</Label>
                    <Input placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Company Name *</Label>
                    <Input placeholder="Acme Bank Ltd" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required maxLength={100} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Email Address *</Label>
                    <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Phone Number <span className="text-muted-foreground">(optional)</span></Label>
                    <Input type="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Which reports do you need help with?</Label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select an option</option>
                      {reportOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Tell us about your compliance needs <span className="text-muted-foreground">(optional)</span></Label>
                    <textarea
                      placeholder="Describe your regulatory reporting challenges..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={2000}
                      rows={4}
                      className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </div>
                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full rounded-full font-semibold h-11">
                    {loading ? "Submitting..." : "Send Message"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
