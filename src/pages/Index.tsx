import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import ProblemStatementSection from "@/components/landing/ProblemStatementSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeatureSplitSection from "@/components/landing/FeatureSplitSection";
import ReportTypesTicker from "@/components/landing/ReportTypesTicker";
import DashboardPreviewSection from "@/components/landing/DashboardPreviewSection";
import PricingSection from "@/components/landing/PricingSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustBar />
      <ProblemStatementSection />
      <HowItWorksSection />
      <FeatureSplitSection />
      <ReportTypesTicker />
      <DashboardPreviewSection />
      <PricingSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;
