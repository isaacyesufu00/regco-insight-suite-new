import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import ReportTypesTicker from "@/components/ReportTypesTicker";
import PricingSection from "@/components/PricingSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <FeaturesSection />
      <ReportTypesTicker />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
