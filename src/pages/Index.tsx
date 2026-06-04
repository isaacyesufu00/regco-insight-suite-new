import EigenNavbar from "@/components/eigen/EigenNavbar";
import EigenHero from "@/components/eigen/EigenHero";
import TaglineSection from "@/components/eigen/TaglineSection";
import PlatformSection from "@/components/eigen/PlatformSection";
import FeaturesSection from "@/components/eigen/FeaturesSection";
import { Customer360Section, ScreeningSection } from "@/components/eigen/NewFeaturesSections";
import FraudDetectionSection from "@/components/home/FraudDetectionSection";
import { BoardPackSection, AuditTrackerSection, RegulatoryIntelSection, PlatformCounterSection } from "@/components/eigen/HomepageExtraSections";
import BestInClassSection from "@/components/eigen/BestInClassSection";
import TutorialSection from "@/components/eigen/TutorialSection";
import SecurityDarkSection from "@/components/eigen/SecurityDarkSection";
import WhoWeServeSection from "@/components/eigen/WhoWeServeSection";
import RegulatoryReturnsSection from "@/components/eigen/RegulatoryReturnsSection";
import PricingSection from "@/components/eigen/PricingSection";
import AboutUsSection from "@/components/eigen/AboutUsSection";
import FinalCTASection from "@/components/eigen/FinalCTASection";
import EigenFooter from "@/components/eigen/EigenFooter";

const Index = () => (
  <div style={{ background: "#F5F5F0", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
    <EigenNavbar />
    <EigenHero />
    <TaglineSection />
    <PlatformSection />
    <FeaturesSection />
    <Customer360Section />
    <FraudDetectionSection />
    <ScreeningSection />
    <BoardPackSection />
    <AuditTrackerSection />
    <RegulatoryIntelSection />
    <PlatformCounterSection />
    <BestInClassSection />
    <SecurityDarkSection />
    <WhoWeServeSection />
    <RegulatoryReturnsSection />
    <TutorialSection />
    <PricingSection />
    <AboutUsSection />
    <FinalCTASection />
    <EigenFooter />
  </div>
);

export default Index;
