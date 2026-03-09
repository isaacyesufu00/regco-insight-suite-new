import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const institutionTypes = [
  "Commercial Bank",
  "Merchant Bank",
  "National MFB",
  "State MFB",
  "Unit MFB",
  "Finance Company",
  "Other",
];

interface EnterpriseSalesModalProps {
  open: boolean;
  onClose: () => void;
  defaultMessage?: string;
}

const EnterpriseSalesModal = ({ open, onClose, defaultMessage = "" }: EnterpriseSalesModalProps) => {
  const [fullName, setFullName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage, open]);

  useEffect(() => {
    if (!open) {
      // Reset on close
      setTimeout(() => {
        setFullName("");
        setInstitutionName("");
        setInstitutionType("");
        setEmail("");
        setPhone("");
        setMessage(defaultMessage);
        setErrors({});
        setSubmitted(false);
        setLoading(false);
      }, 300);
    }
  }, [open, defaultMessage]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required.";
    if (!institutionName.trim()) errs.institutionName = "Institution name is required.";
    if (!institutionType) errs.institutionType = "Please select an institution type.";
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Enter a valid email.";
    if (!phone.trim()) errs.phone = "Phone number is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      full_name: fullName.trim().slice(0, 100),
      company_name: institutionName.trim().slice(0, 100),
      email: email.trim().slice(0, 255),
      phone: phone.trim().slice(0, 30) || null,
      report_type: institutionType || null,
      message: message.trim().slice(0, 2000) || null,
    };

    const { error: dbError } = await supabase.from("demo_requests").insert(payload);
    if (dbError) {
      setLoading(false);
      setErrors({ form: "Something went wrong. Please try again." });
      return;
    }

    try {
      await supabase.functions.invoke("send-demo-notification", { body: payload });
    } catch (err) {
      console.error("Email notification failed:", err);
    }

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => onClose(), 3000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-7 shadow-2xl bg-background border border-border"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-primary/10">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Thank you</h2>
                <p className="text-sm text-muted-foreground">
                  A member of our enterprise sales team will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-lg font-bold font-display text-foreground">RegCo</span>
                </div>
                <h2 className="text-xl font-bold text-foreground mt-3 mb-1">Contact Enterprise Sales</h2>
                <p className="text-sm text-muted-foreground mb-6">Tell us about your institution and we'll get back to you within 24 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-foreground">Full Name *</Label>
                    <Input placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} className="rounded-xl" />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-foreground">Institution Name *</Label>
                    <Input placeholder="Acme Bank Ltd" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} maxLength={100} className="rounded-xl" />
                    {errors.institutionName && <p className="text-xs text-destructive">{errors.institutionName}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-foreground">Institution Type *</Label>
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select type</option>
                      {institutionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.institutionType && <p className="text-xs text-destructive">{errors.institutionType}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-foreground">Email Address *</Label>
                    <Input type="email" placeholder="you@institution.com" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} className="rounded-xl" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-foreground">Phone Number *</Label>
                    <Input type="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} className="rounded-xl" />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-foreground">Message</Label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={2000}
                      rows={3}
                      className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </div>
                  {errors.form && <p className="text-sm font-medium text-destructive">{errors.form}</p>}
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 rounded-full">
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnterpriseSalesModal;
