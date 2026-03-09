import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import EnterpriseSalesModal from "@/components/EnterpriseSalesModal";

interface PageCTAProps {
  headline: string;
  primaryLabel?: string;
  showDemo?: boolean;
  contactMessage?: string;
}

const PageCTA = ({
  headline,
  primaryLabel = "Book a Demo",
  showDemo = true,
  contactMessage = "I would like to learn more about RegCo. Please contact me to discuss my institution's needs.",
}: PageCTAProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-20 md:py-28 hero-gradient">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              {headline}
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold hover:scale-[1.02] transition-transform">
                <Link to="/book-demo">{primaryLabel}</Link>
              </Button>
              {showDemo && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 text-base font-semibold border-foreground/20 hover:scale-[1.02] transition-transform"
                >
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <EnterpriseSalesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultMessage={contactMessage}
      />
    </>
  );
};

export default PageCTA;
