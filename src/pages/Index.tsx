import { Navbar } from '@/components/homepage/Navbar';
import { HeroSection } from '@/components/homepage/HeroSection';
import { HarveyUseCases } from '@/components/homepage/HarveyUseCases';
import { SpeedSection } from '@/components/homepage/SpeedSection';
import { CompactProblemSolution } from '@/components/homepage/CompactProblemSolution';
import { CompactPillars } from '@/components/homepage/CompactPillars';
import { TimelineSection } from '@/components/homepage/TimelineSection';
import { CompactFlows } from '@/components/homepage/CompactFlows';
import { CompactWhoWeServe } from '@/components/homepage/CompactWhoWeServe';
import { CompactCtaFaq } from '@/components/homepage/CompactCtaFaq';
import { Footer } from '@/components/homepage/Footer';

export default function Index() {
  return (
    <div className="ballpark-bg" style={{ minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--tx-primary)' }}>
      <Navbar />
      <HeroSection />
      <HarveyUseCases />
      <SpeedSection />
      <CompactProblemSolution />
      <CompactPillars />
      <TimelineSection />
      <CompactFlows />
      <CompactWhoWeServe />
      <CompactCtaFaq />
      <Footer />
    </div>
  );
}
