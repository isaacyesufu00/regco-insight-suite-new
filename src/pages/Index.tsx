import EigenNavbar from "@/components/eigen/EigenNavbar";
import EigenHero from "@/components/eigen/EigenHero";
import TaglineSection from "@/components/eigen/TaglineSection";
import PlatformSection from "@/components/eigen/PlatformSection";
import BestInClassSection from "@/components/eigen/BestInClassSection";
import DashboardTutorialSection from "@/components/eigen/DashboardTutorialSection";
import SecurityDarkSection from "@/components/eigen/SecurityDarkSection";
import UseCasesSection from "@/components/eigen/UseCasesSection";
import FinalCTASection from "@/components/eigen/FinalCTASection";
import EigenFooter from "@/components/eigen/EigenFooter";

const Index = () => (
  <div style={{ background: "#F5F5F0", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
    <EigenNavbar />
    <EigenHero />
    <TaglineSection />
    <PlatformSection />
    <DashboardTutorialSection />
    <BestInClassSection />
    <SecurityDarkSection />
    <UseCasesSection />
    <FinalCTASection />
    <EigenFooter />
  </div>
);

export default Index;
