import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHero, ContentSection } from "@/components/eigen/PageShell";

const tiers = [
  { title: "Referral Partners", body: "Are you a compliance consultant, chartered accountant, or financial advisor serving Nigerian MFBs and banks? Refer your clients to RegCo and earn a referral commission for every successful onboarding.", cta: "Become a referral partner →", href: "mailto:partnerships@regco.com.ng?subject=Referral%20Partner%20Enquiry" },
  { title: "CBS Vendors", body: "Do you provide core banking software to Nigerian financial institutions? Integrate RegCo into your platform so your clients can generate regulatory returns directly from their CBS dashboard.", cta: "Technical integration enquiry →", href: "mailto:partnerships@regco.com.ng?subject=CBS%20Integration%20Enquiry" },
  { title: "Regulatory Consultants", body: "Are you a compliance firm or legal practice specialising in CBN, NFIU, or FIRS regulatory matters? White-label RegCo's report generation for your clients under your brand.", cta: "White-label enquiry →", href: "mailto:partnerships@regco.com.ng?subject=White-label%20Enquiry" },
];

const TierCard = ({ t, i }: { t: typeof tiers[number]; i: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: 28 }}
    >
      <h3 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.01em" }}>{t.title}</h3>
      <p style={{ fontSize: 14, color: "#4A4A4A", lineHeight: 1.65, margin: "0 0 18px" }}>{t.body}</p>
      <a href={t.href} style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", textDecoration: "none" }}>{t.cta}</a>
    </motion.div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", fontSize: 14, border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 8, background: "#FFFFFF", fontFamily: "inherit", color: "#0A0A0A", outline: "none",
};

const PartnershipsPage = () => {
  const [form, setForm] = useState({ name: "", company: "", type: "Referral Partner", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("demo_requests").insert({
        full_name: form.name,
        company_name: form.company,
        email: form.email,
        message: form.message,
        report_type: `Partnership — ${form.type}`,
      });
      if (error) throw error;
      toast.success("Thanks — our partnerships team will be in touch.");
      setForm({ name: "", company: "", type: "Referral Partner", email: "", message: "" });
    } catch (err: any) {
      toast.error(err?.message || "Could not submit. Please email partnerships@regco.com.ng directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <PageHero label="PARTNERSHIPS" title="Partner with RegCo" subtitle="We work with accounting firms, compliance consultants, and CBS vendors serving Nigerian financial institutions." />
      <ContentSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 80 }}>
          {tiers.map((t, i) => <TierCard key={t.title} t={t} i={i} />)}
        </div>
        <div style={{ maxWidth: 640, margin: "0 auto", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 6px" }}>Get in touch</h2>
          <p style={{ fontSize: 14, color: "#6B6B6B", margin: "0 0 24px" }}>Tell us about your firm and we will reach out within two business days.</p>
          <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
            <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input required placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={inputStyle} />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
              <option>Referral Partner</option>
              <option>CBS Vendor</option>
              <option>Regulatory Consultant</option>
              <option>Other</option>
            </select>
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <textarea required rows={4} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
            <button type="submit" disabled={submitting} style={{ background: "#0A0A0A", color: "#fff", border: "none", borderRadius: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "inherit" }}>
              {submitting ? "Sending…" : "Send enquiry"}
            </button>
          </form>
        </div>
      </ContentSection>
    </PageShell>
  );
};

export default PartnershipsPage;
