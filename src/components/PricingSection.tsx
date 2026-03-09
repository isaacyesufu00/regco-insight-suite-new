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
      <section id="pricing" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Penalty Highlight Banner */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="rounded-2xl bg-foreground text-background p-8 md:p-10 text-center mb-14 max-w-4xl mx-auto"
          >
            <p className="text-lg md:text-xl font-bold font-display leading-relaxed">
              One CBN regulatory sanction starts at{" "}
              <span className="text-warning">₦2,000,000</span>.<br />
              RegCo starts at way less.{" "}
              <span className="text-warning">It is not a cost — it is insurance.</span>
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
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
                className={`rounded-2xl p-7 border flex flex-col ${
                  tier.highlight
                    ? "border-primary card-elevated-lg ring-2 ring-primary/20"
                    : "border-border/60 card-elevated"
                }`}
              >
                {tier.highlight && (
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full self-start mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-6">{tier.audience}</p>
                <ul className="flex-1 space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.highlight ? "default" : "outline"}
                  className="rounded-full w-full hover:scale-[1.02] transition-transform"
                  onClick={() => openModal(tier.message)}
                >
                  {tier.cta}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="ghost"
              className="text-primary font-semibold hover:scale-[1.02] transition-transform"
              onClick={() => openModal(CUSTOM_QUOTE_MESSAGE)}
            >
              Request Custom Quote
            </Button>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground text-center mb-10">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="card-elevated rounded-xl border border-border/50 px-6">
                  <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
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
