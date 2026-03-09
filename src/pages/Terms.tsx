import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
        <BackButton />
        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mt-8 mb-4">Terms of Service</h1>
        <p className="text-muted-foreground text-lg">
          This page is being updated. Please contact us at{" "}
          <a href="mailto:support@regco.com" className="text-primary font-medium hover:underline">
            support@regco.com
          </a>{" "}
          for the current document.
        </p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Terms;
