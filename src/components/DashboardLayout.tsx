import AgentRail from "@/components/dashboard/AgentRail";
import { HelpPanel } from "@/components/HelpPanel";
import { WelcomeTutorialModal } from "@/components/WelcomeTutorialModal";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

interface DashboardLayoutProps { children: React.ReactNode; }

export function DashboardLayout({ children }: DashboardLayoutProps) {
  useSessionTimeout();

  return (
    <div className="min-h-screen flex w-full bg-white text-[var(--navy)]" style={{ fontFamily: "var(--font-sans)" }}>
      <AgentRail />
      <main className="flex-1 min-w-0 overflow-y-auto" style={{ minHeight: "100vh" }}>
        {children}
      </main>
      <HelpPanel />
      <WelcomeTutorialModal />
    </div>
  );
}

export default DashboardLayout;
