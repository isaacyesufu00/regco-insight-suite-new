import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import EnterpriseSalesModal from "@/components/EnterpriseSalesModal";

const tiers = [
  {
    name: "Unit MFB",
    planKey: "unit",
    audience: "For unit microfinance banks",
    features: ["Basic CBN returns", "Single-user access", "Email support", "Standard dashboard"],
    cta: "Contact Sales",
    highlight: false,
    message: "I am interested in the Unit MFB plan. Please contact me to discuss pricing.",
  },
  {
    name: "State MFB",
    planKey: "state",
    audience: "For state microfinance banks",
    features: ["All CBN & NFIU returns", "Multi-user access", "Priority support", "Compliance monitoring"],
    cta: "Contact Sales",
    highlight: true,
    message: "I am interested in the State MFB plan. Please contact me to discuss pricing.",
  },
  {
    name: "Commercial Bank",
    planKey: "commercial",
    audience: "For commercial banks",
    features: ["Full compliance suite", "Dedicated compliance specialist", "Custom integrations", "SLA guarantee"],
    cta: "Contact Sales",
    highlight: false,
    message: "I am interested in the Commercial Bank plan. Please contact me to discuss pricing.",
  },
];

const faqs = [
  {
    q: "Is my institution's data secure?",
    a: "Yes. All data is encrypted at rest using AES-256 and in transit using TLS 1.3. We operate under a strict Data Processing Agreement and are aligned with NDPC guidelines. Your data is never shared or used for any purpose other than generating your regulatory returns.",
  },
  {
    q: "Which core banking systems do you support?",
    a: "RegCo accepts standard CSV and Excel exports from any core banking system. If your CBS can export data, RegCo can process it. We support Flexcube, Temenos, Finacle, and custom CBS exports.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most institutions are fully onboarded and generating their first report within 7 days of signing. There is no technical installation required on your end.",
  },
  {
    q: "Do I need a dedicated IT team to use RegCo?",
    a: "No. RegCo is designed for compliance officers, not IT staff. If you can use email and upload a file, you can use RegCo.",
  },
  {
    q: "What happens if I need help with a submission?",
    a: "Every RegCo client has a dedicated compliance support contact. You can reach us via email or WhatsApp during business hours.",
  },
  {
    q: "Can I see a sample report before signing up?",
    a: "Yes. Book a free demo and we will walk you through a live report generation using fictional but realistic data so you can see exactly what your submissions will look like.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1 },
  }),
};

const CUSTOM_QUOTE_MESSAGE =
  "I would like to request a custom quote for RegCo. Please contact me to discuss my institution's specific needs.";

const PricingSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const openModal = (msg: string) => {
    setModalMessage(msg);
    setModalOpen(true);
  };

  return (
    <>
      <section id="pricing" className="py-24 md:py-[100px] bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#AAA] mb-4">
              Pricing
            </p>
            <h2 className="text-3xl md:text-[40px] font-bold text-foreground leading-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-[#666] text-base">
              Plans that grow with your compliance needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i + 1}
                className={`relative rounded-2xl p-9 border border-border bg-background flex flex-col card-lift overflow-hidden ${
                  tier.highlight ? "shadow-[0_8px_32px_rgba(0,0,0,0.06)]" : ""
                }`}
              >
                {tier.highlight && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(255,154,0,0.04), transparent 60%)",
                      }}
                    />
                  </>
                )}
                <div className="relative">
                  {tier.highlight && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-gradient">
                      Most Popular
                    </span>
                  )}
                  <h3 className="mt-2 text-xl font-bold text-foreground">{tier.name}</h3>
                  <p className="text-[14px] text-[#666] mt-1 mb-6">{tier.audience}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-[14px] text-foreground"
                      >
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-brand-gradient" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={tier.highlight ? "default" : "outline"}
                    className="w-full"
                    onClick={() => openModal(tier.message)}
                  >
                    {tier.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="ghost" onClick={() => openModal(CUSTOM_QUOTE_MESSAGE)}>
              Request Custom Quote
            </Button>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-3xl md:text-[40px] font-bold text-foreground text-center mb-10">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl border border-border px-6 bg-background"
                >
                  <AccordionTrigger className="text-[15px] font-semibold text-foreground hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[14px] text-[#666] pb-5 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <EnterpriseSalesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultMessage={modalMessage}
      />
    </>
  );
};

export default PricingSection;
