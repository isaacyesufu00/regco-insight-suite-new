import { Navbar } from '@/components/homepage/Navbar';
import { HeroSection } from '@/components/homepage/HeroSection';
import { StatsStrip } from '@/components/homepage/StatsStrip';
import { ProblemSolutionSection } from '@/components/homepage/ProblemSolutionSection';
import { PlatformPillarsSection } from '@/components/homepage/PlatformPillarsSection';
import { InteractiveFlowsSection } from '@/components/homepage/InteractiveFlowsSection';
import { WhoWeServeSection } from '@/components/homepage/WhoWeServeSection';
import { TrustCtaSection } from '@/components/homepage/TrustCtaSection';
import { Footer } from '@/components/homepage/Footer';

export default function Index() {
  return (
    <div style={{ background: 'var(--bg-page)', fontFamily: 'var(--font-body)' }}>
      <Navbar />
      <HeroSection />
      <StatsStrip />
      <ProblemSolutionSection />
      <PlatformPillarsSection />
      <InteractiveFlowsSection />
      <WhoWeServeSection />
      <TrustCtaSection />
      <Footer />
    </div>
  );
}
