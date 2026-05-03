import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ReportTypesTicker from "@/components/ReportTypesTicker";
import StatsSection from "@/components/StatsSection";
import InstitutionScrollSection from "@/components/InstitutionScrollSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import ComplianceTypesSection from "@/components/ComplianceTypesSection";
import PricingSection from "@/components/PricingSection";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div style={{ background: "#F5F5F7" }}>
      <Navbar />
      <HeroSection />
      <ReportTypesTicker />
      <StatsSection />
      <InstitutionScrollSection />
      <FeaturesSection />
      <HowItWorks />
      <ComplianceTypesSection />
      <PricingSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
