import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DashboardShowcase from "@/components/DashboardShowcase";
import HowItWorks from "@/components/HowItWorks";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import ReportTypesTicker from "@/components/ReportTypesTicker";
import PricingSection from "@/components/PricingSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div style={{ background: "#F5F5F7" }}>
      <Navbar />
      <HeroSection />
      <DashboardShowcase />
      <HowItWorks />
      <StatsSection />
      <FeaturesSection />
      <ReportTypesTicker />
      <PricingSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
