import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DashboardPositioning from "@/components/DashboardPositioning";
import InstitutionsSection from "@/components/InstitutionsSection";
import PricingSection from "@/components/PricingSection";
import SecuritySection from "@/components/SecuritySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DashboardPositioning />
      <InstitutionsSection />
      <PricingSection />
      <SecuritySection />
      <Footer />
    </div>
  );
};

export default Index;
