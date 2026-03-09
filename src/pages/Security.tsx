import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Lock, Shield, Layers, Fingerprint, CheckCircle, FileText,
  Server, FolderLock, Globe, Flag, FileCheck, Building, ShieldCheck,
  Mail, MessageCircle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07 },
  }),
};

const protectionCards = [
  { icon: Lock, title: "Encryption at Rest", body: "All data stored on RegCo is encrypted at rest using AES-256. This is the same encryption standard used by global financial institutions and is enforced at the infrastructure level by default." },
  { icon: Shield, title: "Encryption in Transit", body: "All data transmitted between your browser and our servers is protected using TLS 1.3. No data travels over the network in an unencrypted state." },
  { icon: Layers, title: "Strict Data Isolation", body: "Every institution's data is completely isolated using database-level Row Level Security. It is architecturally impossible for one institution's data to be accessed by another user or institution." },
  { icon: Fingerprint, title: "Login Protection", body: "RegCo enforces automatic account lockout after 5 consecutive failed login attempts with a 15-minute cooldown period. All login activity is logged and visible to your compliance lead in their security activity log." },
  { icon: CheckCircle, title: "Password Security", body: "RegCo checks every password against the HaveIBeenPwned database of over 800 million known compromised credentials. Any password that appears in a known data breach is automatically rejected." },
  { icon: FileText, title: "Full Audit Trail", body: "Every action taken on your account is recorded in a detailed audit log. Your compliance lead can review all account activity at any time directly from their settings page." },
];

const dataChecklist = [
  "Your data is never sold to third parties",
  "Your data is never shared with other institutions",
  "Your data is never used for advertising or profiling",
  "CBS files are accessed via signed URLs that expire in 30 minutes",
  "No uploaded file is ever publicly accessible",
  "A Data Processing Agreement is signed with every client",
  "You can request deletion of your data at any time",
];

const infraCols = [
  { icon: Server, title: "SOC 2 Certified Infrastructure", body: "RegCo is built on Supabase, which holds SOC 2 Type 2 certification with controls audited annually. This means the underlying infrastructure your data sits on meets the highest independent security audit standards." },
  { icon: FolderLock, title: "Secure File Storage", body: "All uploaded CBS files are stored in private access-controlled storage buckets. Files are only ever accessible via time-limited signed URLs that expire after 30 minutes. No file is ever publicly accessible via a permanent link." },
  { icon: Globe, title: "Secure Global Hosting", body: "The RegCo platform is hosted on Vercel's enterprise-grade global content delivery network. All traffic is served over HTTPS with TLS 1.3 enforced on every request." },
];

const accessLeft = [
  "Invitation-only access — no public signup",
  "Email confirmation required on all accounts",
  "Strong password requirements enforced at signup",
  "Compromised password detection via HaveIBeenPwned",
  "Automatic lockout after 5 failed login attempts",
  "15-minute cooldown on locked accounts",
  "Cryptographically signed JWT session tokens",
  "All backend operations require a valid JWT",
  "Admin operations fully separated from client operations",
  "Service role keys never exposed to the browser or frontend",
];

const accessRight = [
  "Only staff you authorise can ever access your dashboard",
  "Unverified accounts cannot access any data",
  "Weak passwords are rejected before they can be set",
  "Known breached passwords are blocked automatically",
  "Brute force login attacks are blocked automatically",
  "Attackers cannot simply wait and retry immediately",
  "Sessions cannot be forged or tampered with",
  "Our backend cannot be called directly from a browser",
  "Clients and admins operate in completely separate environments",
  "The most sensitive credentials are inaccessible from the internet",
];

const badges = [
  { icon: Flag, line1: "NDPA 2023", line2: "Nigeria Data Protection Act aligned" },
  { icon: FileCheck, line1: "Data Processing Agreement", line2: "Signed with every client before access" },
  { icon: Building, line1: "CAC Registered", line2: "Registered with Corporate Affairs Commission" },
  { icon: ShieldCheck, line1: "SOC 2 Infrastructure", line2: "Built on SOC 2 Type 2 certified infrastructure" },
];

const Security = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* SECTION 1 — HERO */}
    <section className="bg-foreground pt-28 pb-20 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold font-display text-background"
        >
          Security at RegCo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-background/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
        >
          RegCo was built from the ground up for Nigerian financial institutions. Every architectural decision we have made prioritises the security and confidentiality of your institution's data.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {[
            ["AES-256", "Encryption at rest"],
            ["TLS 1.3", "Encryption in transit"],
            ["NDPA 2023", "Nigerian data protection aligned"],
          ].map(([bold, sub]) => (
            <span key={bold} className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-2 text-sm text-background">
              <span className="font-semibold">{bold}</span>
              <span className="text-background/60">—</span>
              <span className="text-background/70">{sub}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>

    {/* SECTION 2 — HOW WE PROTECT YOUR DATA */}
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-3xl md:text-4xl font-bold font-display text-foreground text-center mb-14"
        >
          How We Protect Your Data
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-5">
          {protectionCards.map((c, i) => (
            <motion.div
              key={c.title} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-40px" }} variants={fadeUp} custom={i + 1}
              className="card-elevated rounded-xl p-6 border border-border/50"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* SECTION 3 — YOUR DATA BELONGS TO YOU */}
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-3xl md:text-4xl font-bold font-display text-foreground text-center mb-14"
        >
          Your Data Belongs to You
        </motion.h2>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="space-y-4 text-muted-foreground text-sm leading-relaxed"
          >
            <p>
              RegCo processes your institution's data solely for the purpose of generating your regulatory returns. We do not sell, share, license, or analyse your data for any other purpose.
            </p>
            <p>
              Your CBS export data is processed once to generate your report. All file access is controlled through time-limited signed URLs that expire automatically after 30 minutes. No uploaded file is ever publicly accessible.
            </p>
            <p>
              Every client relationship is governed by a Data Processing Agreement that is accepted before accessing the platform. RegCo operates in alignment with the Nigeria Data Protection Act 2023.
            </p>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="space-y-3"
          >
            {dataChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "hsl(var(--success))" }} />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* SECTION 4 — INFRASTRUCTURE */}
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-3xl md:text-4xl font-bold font-display text-foreground text-center mb-14"
        >
          Infrastructure and Hosting
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-5">
          {infraCols.map((c, i) => (
            <motion.div
              key={c.title} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-40px" }} variants={fadeUp} custom={i + 1}
              className="card-elevated rounded-xl p-6 border border-border/50"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* SECTION 5 — ACCESS CONTROL */}
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-3xl md:text-4xl font-bold font-display text-foreground text-center mb-14"
        >
          Access Control and Authentication
        </motion.h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-5">What We Enforce</h3>
            <div className="space-y-3">
              {accessLeft.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-5">What This Means For You</h3>
            <div className="space-y-3">
              {accessRight.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="w-4 h-4 mt-1 shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* SECTION 6 — REGULATORY ALIGNMENT */}
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-3xl md:text-4xl font-bold font-display text-foreground text-center mb-14"
        >
          Regulatory and Compliance Alignment
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {badges.map((b, i) => (
            <motion.div
              key={b.line1} initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              className="card-elevated rounded-xl p-5 border border-border/50 text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{b.line1}</p>
              <p className="text-xs text-muted-foreground mt-1">{b.line2}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
          RegCo is currently pursuing formal NDPC registration. We are working toward ISO 27001 certification. All security practices on this page reflect the current state of our platform and infrastructure as of March 2026.
        </p>
      </div>
    </section>

    {/* SECTION 7 — RESPONSIBLE DISCLOSURE */}
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-3xl md:text-4xl font-bold font-display text-foreground text-center mb-8"
        >
          Responsible Disclosure
        </motion.h2>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-sm text-muted-foreground leading-relaxed space-y-4"
        >
          <p>
            RegCo takes security vulnerabilities seriously. If you believe you have discovered a security issue in our platform we ask that you contact us privately before any public disclosure so we can investigate and resolve the issue promptly.
          </p>
          <p>
            Please send all security disclosures to:{" "}
            <a href="mailto:security@regco.com" className="text-primary font-medium hover:underline">
              security@regco.com
            </a>
          </p>
          <p>
            We commit to acknowledging your report within 2 business days and keeping you informed throughout our investigation. We do not pursue legal action against researchers who disclose vulnerabilities responsibly and in good faith.
          </p>
        </motion.div>
      </div>
    </section>

    {/* SECTION 8 — CONTACT */}
    <section className="bg-foreground py-20 md:py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold font-display text-background mb-4"
        >
          Have a Security Question?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-background/70 text-lg max-w-2xl mx-auto mb-12"
        >
          If you have questions about RegCo's security practices, our Data Processing Agreement, or how we handle your institution's data, our team is ready to help.
        </motion.p>
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {[
            { icon: Mail, label: "Security Disclosures", value: "security@regco.com", sub: "For security vulnerability reports and detailed security enquiries" },
            { icon: MessageCircle, label: "General Support", value: "support@regco.com", sub: "For questions about data handling, your DPA, or compliance matters" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-background/15 bg-background/5 p-6 text-left">
              <c.icon className="w-5 h-5 text-primary mb-3" />
              <p className="text-xs text-background/50 uppercase tracking-wider font-medium">{c.label}</p>
              <a href={`mailto:${c.value}`} className="text-background font-semibold text-sm hover:underline block mt-1">
                {c.value}
              </a>
              <p className="text-xs text-background/50 mt-2 leading-relaxed">{c.sub}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-background/40 mt-14 max-w-2xl mx-auto leading-relaxed">
          This page was last reviewed March 2026. RegCo is committed to maintaining and improving our security posture as the platform grows. Material changes to our security practices will be communicated to all active clients.
        </p>
      </div>
    </section>

    <Footer />
  </div>
);

export default Security;
