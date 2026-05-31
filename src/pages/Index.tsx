import EigenNavbar from "@/components/eigen/EigenNavbar";
import EigenHero from "@/components/eigen/EigenHero";
import TaglineSection from "@/components/eigen/TaglineSection";
import PlatformSection from "@/components/eigen/PlatformSection";
import { MedusaFeatureGrid, ScrollProgressBar } from "@/components/eigen/MedusaSections";
import { PlatformCounterSection } from "@/components/eigen/HomepageExtraSections";
import BestInClassSection from "@/components/eigen/BestInClassSection";
import TutorialSection from "@/components/eigen/TutorialSection";
import SecurityDarkSection from "@/components/eigen/SecurityDarkSection";
import UseCasesSection from "@/components/eigen/UseCasesSection";
import RegulatoryReturnsSection from "@/components/eigen/RegulatoryReturnsSection";
import PricingSection from "@/components/eigen/PricingSection";
import AboutUsSection from "@/components/eigen/AboutUsSection";
import FinalCTASection from "@/components/eigen/FinalCTASection";
import EigenFooter from "@/components/eigen/EigenFooter";

const Index = () => (
  <div style={{ background: "#F5F5F0", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
    <EigenNavbar />
    <ScrollProgressBar />
    <EigenHero />
    <TaglineSection />
    <PlatformSection />
    <MedusaFeatureGrid />
    <PlatformCounterSection />
    <BestInClassSection />
    <SecurityDarkSection />
    <UseCasesSection />
    <RegulatoryReturnsSection />
    <TutorialSection />
    <PricingSection />
    <AboutUsSection />
    <FinalCTASection />
    <EigenFooter />
  </div>
);

export default Index;
