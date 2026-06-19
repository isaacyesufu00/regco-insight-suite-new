import { DashboardSidebar } from "@/components/DashboardSidebar";
import { HelpPanel } from "@/components/HelpPanel";
import { WelcomeTutorialModal } from "@/components/WelcomeTutorialModal";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { useProfile } from "@/contexts/ProfileContext";

interface DashboardLayoutProps { children: React.ReactNode; }

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { institutionName } = useProfile();
  useSessionTimeout();

  return (
    <div
      className="min-h-screen flex w-full"
      style={{ background: "var(--paper)", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <DashboardSidebar companyName={institutionName} />
      <main
        className="flex-1 min-w-0 overflow-y-auto"
        style={{ background: "var(--paper)", minHeight: "100vh" }}
      >
        <div className="max-w-[1200px] mx-auto px-8 py-10">
          {children}
        </div>
      </main>
      <HelpPanel />
      <WelcomeTutorialModal />
    </div>
  );
}
