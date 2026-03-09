import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { ChevronDown } from "lucide-react";

const sections = [
  { id: "who-we-are", label: "1. Who We Are" },
  { id: "what-data", label: "2. What Data We Collect" },
  { id: "how-we-use", label: "3. How We Use Your Data" },
  { id: "legal-basis", label: "4. Legal Basis for Processing" },
  { id: "data-sharing", label: "5. Who We Share Your Data With" },
  { id: "data-storage", label: "6. How We Store and Protect Your Data" },
  { id: "data-retention", label: "7. How Long We Keep Your Data" },
  { id: "your-rights", label: "8. Your Data Rights" },
  { id: "cookies", label: "9. Cookies" },
  { id: "childrens-data", label: "10. Children's Data" },
  { id: "changes", label: "11. Changes to This Policy" },
  { id: "contact", label: "12. Contact Us" },
];

const TOCSidebar = ({ activeId }: { activeId: string }) => (
  <nav className="hidden lg:block sticky top-24 w-56 shrink-0 self-start">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contents</p>
    <ul className="space-y-1 border-l border-border">
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className={`block pl-4 py-1.5 text-sm transition-colors ${
              activeId === s.id
                ? "text-primary font-medium border-l-2 border-primary -ml-px"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const TOCMobile = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden mb-8 border border-border rounded-xl bg-muted/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground"
      >
        Table of Contents
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="px-4 pb-3 space-y-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className="block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SectionHeading = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2
    id={id}
    className="text-xl md:text-2xl font-bold font-display text-foreground mt-14 mb-4 scroll-mt-24"
  >
    {children}
  </h2>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">{children}</h3>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-base text-muted-foreground leading-[1.75] mb-4">{children}</p>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="list-disc pl-6 mb-4 space-y-1.5">
    {items.map((item, i) => (
      <li key={i} className="text-base text-muted-foreground leading-[1.75]">{item}</li>
    ))}
  </ul>
);

const PrivacyPolicy = () => {
  const [activeId, setActiveId] = useState(sections[0].id);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-[800px] mx-auto lg:max-w-none lg:mx-0">
            <BackButton />
          </div>

          {/* Header */}
          <div className="max-w-[800px] mx-auto lg:max-w-none lg:mx-0 lg:pl-[calc(50%-400px+14rem+2rem)] mt-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-4">Last updated: March 2026</p>
            <P>
              This policy explains how RegCo collects, uses, stores, and protects the personal data
              of visitors to our website and clients who use our platform. Please read it carefully.
            </P>
          </div>

          {/* Main layout */}
          <div className="flex justify-center gap-10">
            <TOCSidebar activeId={activeId} />

            <div className="max-w-[800px] w-full min-w-0">
              <TOCMobile />

              {/* Section 1 */}
              <SectionHeading id="who-we-are">1. Who We Are</SectionHeading>
              <P>
                RegCo is a regulatory reporting automation platform built exclusively for Nigerian
                banks and microfinance banks. RegCo is a product of [Your Company Legal Name], a
                company registered with the Corporate Affairs Commission of Nigeria.
              </P>
              <P>
                Registered address: Abuja, Nigeria<br />
                Contact email: support@regco.com<br />
                Data protection enquiries: privacy@regco.com
              </P>
              <P>
                In this policy, &lsquo;RegCo&rsquo;, &lsquo;we&rsquo;, &lsquo;us&rsquo;, and
                &lsquo;our&rsquo; refer to [Your Company Legal Name]. &lsquo;You&rsquo; and
                &lsquo;your&rsquo; refer to any individual or institution accessing our website or
                using our platform.
              </P>

              {/* Section 2 */}
              <SectionHeading id="what-data">2. What Data We Collect</SectionHeading>
              <SubHeading>2.1 Data you provide directly</SubHeading>
              <P>When you interact with RegCo we may collect the following personal data:</P>
              <BulletList
                items={[
                  "Full name and job title",
                  "Email address and phone number",
                  "Institution name and RC number",
                  "CBN license category",
                  "Password (stored in encrypted form — we never store plain text passwords)",
                  "Data Processing Agreement acceptance records",
                  "Support messages and communications you send us",
                  "Demo booking form submissions",
                ]}
              />

              <SubHeading>2.2 Data collected automatically</SubHeading>
              <P>When you visit our website we may collect:</P>
              <BulletList
                items={[
                  "Browser type and version",
                  "Device type and operating system",
                  "Pages visited and time spent on each page",
                  "Referring URL",
                  "IP address",
                  "Cookie identifiers",
                ]}
              />
              <P>
                This data is collected to ensure the website functions correctly and to improve your
                experience. It is not used for advertising.
              </P>

              <SubHeading>2.3 Data uploaded by clients</SubHeading>
              <P>
                Clients who use the RegCo platform upload core banking system export files for the
                purpose of generating regulatory returns. These files may contain financial
                transaction data relating to the clients&rsquo; own customers.
              </P>
              <P>
                RegCo processes this data solely to generate the requested regulatory return. This
                data is never analysed, sold, shared, or used for any purpose other than the specific
                report generation task requested by the client.
              </P>

              {/* Section 3 */}
              <SectionHeading id="how-we-use">3. How We Use Your Data</SectionHeading>
              <P>We use the data we collect for the following purposes:</P>
              <BulletList
                items={[
                  "To create and manage your RegCo account",
                  "To generate regulatory returns on your behalf",
                  "To send you account-related emails including welcome emails, password reset links, and report completion notifications",
                  "To send compliance deadline reminder emails for returns assigned to your institution",
                  "To respond to support requests and enquiries",
                  "To process your demo booking and follow up with you",
                  "To maintain security and audit logs of account activity",
                  "To fulfil our obligations under your Service Agreement and Data Processing Agreement",
                  "To comply with applicable Nigerian law including the Nigeria Data Protection Act 2023",
                ]}
              />
              <P>
                We do not use your data for advertising, profiling, or marketing to third parties. We
                do not sell your data under any circumstances.
              </P>

              {/* Section 4 */}
              <SectionHeading id="legal-basis">4. Legal Basis for Processing</SectionHeading>
              <P>
                Under the Nigeria Data Protection Act 2023, we process your personal data on the
                following legal bases:
              </P>
              <BulletList
                items={[
                  "Contractual necessity — processing required to deliver the services you have contracted with us for, including generating regulatory returns and managing your account",
                  "Legitimate interests — processing necessary for our legitimate business interests such as maintaining security logs, preventing fraud, and improving our platform, where these interests are not overridden by your rights",
                  "Legal obligation — processing required to comply with applicable Nigerian law",
                  "Consent — where you have explicitly consented to a specific use of your data, such as accepting our Data Processing Agreement or our cookie policy",
                ]}
              />

              {/* Section 5 */}
              <SectionHeading id="data-sharing">5. Who We Share Your Data With</SectionHeading>
              <P>RegCo does not sell, rent, or trade your personal data to any third party.</P>
              <P>
                We share data only with the following categories of trusted service providers who
                process data strictly on our behalf and under contractual obligations:
              </P>
              <BulletList
                items={[
                  "Supabase — database, authentication, and file storage infrastructure. Supabase is SOC 2 Type 2 certified.",
                  "Vercel — website hosting and content delivery",
                  "Resend — transactional email delivery for account and compliance notifications",
                  "AI processing providers — used within our automated report generation engine to format regulatory return content. Data is processed transiently and is not retained by the provider.",
                ]}
              />
              <P>
                All third-party providers are contractually prohibited from using your data for any
                purpose other than providing their service to RegCo.
              </P>
              <P>
                We may disclose your data if required to do so by Nigerian law, a court order, or a
                request from a competent regulatory authority.
              </P>

              {/* Section 6 */}
              <SectionHeading id="data-storage">
                6. How We Store and Protect Your Data
              </SectionHeading>
              <P>
                All data stored on RegCo is encrypted at rest using AES-256 encryption. All data
                transmitted between your browser and our servers is protected using TLS 1.3.
              </P>
              <P>
                Access to your institution&rsquo;s data is restricted using database-level Row Level
                Security. It is architecturally impossible for one institution&rsquo;s data to be
                accessed by another user.
              </P>
              <P>
                Uploaded CBS files are stored in private access-controlled storage buckets. Files are
                only accessible via time-limited signed URLs that expire after 30 minutes.
              </P>
              <P>
                We maintain a full audit log of all account activity. Your compliance lead can view
                this log at any time from within the platform settings.
              </P>
              <P>
                Despite our security measures, no system is completely immune to risk. We encourage
                all clients to use strong unique passwords and to report any suspected security
                incidents to security@regco.com immediately.
              </P>

              {/* Section 7 */}
              <SectionHeading id="data-retention">7. How Long We Keep Your Data</SectionHeading>
              <P>
                We retain your personal data for as long as your account is active or as long as is
                necessary to fulfil the purposes outlined in this policy. Specifically:
              </P>
              <BulletList
                items={[
                  "Account data including your profile and institution details — retained for the duration of your active subscription plus 12 months after termination",
                  "Generated regulatory return files — retained for 7 years to support compliance and audit requirements unless you request earlier deletion",
                  "Uploaded CBS files — retained for 90 days after the associated report is generated, then permanently deleted",
                  "Audit logs — retained for 3 years",
                  "Support communications — retained for 2 years",
                  "Website visitor data — retained for 12 months",
                ]}
              />
              <P>
                When retention periods expire, data is permanently and securely deleted from all
                systems.
              </P>

              {/* Section 8 */}
              <SectionHeading id="your-rights">8. Your Data Rights</SectionHeading>
              <P>
                Under the Nigeria Data Protection Act 2023 you have the following rights in relation
                to your personal data:
              </P>
              <BulletList
                items={[
                  "Right of access — You have the right to request a copy of the personal data we hold about you.",
                  "Right to rectification — You have the right to request that we correct any inaccurate or incomplete personal data we hold about you.",
                  "Right to erasure — You have the right to request that we delete your personal data. This right is subject to our legal and regulatory retention obligations.",
                  "Right to restriction — You have the right to request that we restrict the processing of your personal data in certain circumstances.",
                  "Right to data portability — You have the right to request that we provide your personal data in a structured, commonly used, machine-readable format.",
                  "Right to object — You have the right to object to processing of your personal data where we rely on legitimate interests as our legal basis.",
                  "Right to withdraw consent — Where we process your data based on your consent you have the right to withdraw that consent at any time.",
                ]}
              />
              <P>
                To exercise any of these rights please contact us at privacy@regco.com. We will
                respond to all requests within 30 days. We may need to verify your identity before
                processing your request.
              </P>

              {/* Section 9 */}
              <SectionHeading id="cookies">9. Cookies</SectionHeading>
              <P>
                RegCo uses essential cookies to operate the platform. These cookies are necessary for
                the website and dashboard to function correctly and cannot be disabled.
              </P>
              <P>Essential cookies we use:</P>
              <BulletList
                items={[
                  "Session authentication cookies — used to keep you logged in to your dashboard securely",
                  "Security cookies — used to protect against cross-site request forgery and other security threats",
                ]}
              />
              <P>
                We do not use advertising cookies, tracking cookies, or third-party analytics
                cookies. We do not use cookies to build profiles of your behaviour for marketing
                purposes.
              </P>
              <P>
                By continuing to use the RegCo website you accept our use of essential cookies as
                described above.
              </P>

              {/* Section 10 */}
              <SectionHeading id="childrens-data">10. Children&rsquo;s Data</SectionHeading>
              <P>
                RegCo is a business-to-business platform designed exclusively for use by regulated
                financial institutions and their authorised staff. Our services are not directed at
                individuals under the age of 18. We do not knowingly collect personal data from
                anyone under 18 years of age.
              </P>
              <P>
                If you believe we have inadvertently collected data from a minor please contact us at
                privacy@regco.com and we will delete it immediately.
              </P>

              {/* Section 11 */}
              <SectionHeading id="changes">11. Changes to This Policy</SectionHeading>
              <P>
                We may update this Privacy Policy from time to time to reflect changes in our
                practices, technology, legal requirements, or for other operational reasons.
              </P>
              <P>
                When we make material changes we will notify all active clients by email at least 14
                days before the changes take effect. The updated policy will also be published on
                this page with a revised date.
              </P>
              <P>
                Your continued use of RegCo after any changes take effect constitutes your acceptance
                of the updated policy. If you do not agree with any changes you may terminate your
                account by contacting support@regco.com.
              </P>

              {/* Section 12 */}
              <SectionHeading id="contact">
                12. Contact Us and How to Make a Complaint
              </SectionHeading>
              <P>
                If you have any questions about this Privacy Policy or how we handle your personal
                data please contact us:
              </P>
              <P>
                Email: privacy@regco.com<br />
                General support: support@regco.com<br />
                Address: Abuja, Nigeria
              </P>
              <P>
                If you believe we have not handled your personal data in accordance with this policy
                or applicable Nigerian law you have the right to lodge a complaint with the Nigeria
                Data Protection Commission at ndpc.gov.ng.
              </P>
              <P>
                We would always prefer the opportunity to address your concerns directly before you
                contact the NDPC. Please reach out to us first and we will do our best to resolve
                your complaint promptly.
              </P>

              {/* Footer note */}
              <hr className="mt-16 mb-6 border-border" />
              <p className="text-sm text-muted-foreground/70 leading-relaxed mb-4">
                This Privacy Policy was prepared for RegCo and reflects our practices as of March
                2026. This document does not constitute legal advice. RegCo recommends that all
                clients seek independent legal advice regarding their own data protection obligations
                under the Nigeria Data Protection Act 2023.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
