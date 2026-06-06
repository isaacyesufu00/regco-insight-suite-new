import { DashboardSidebar } from "@/components/DashboardSidebar";
import { HelpPanel } from "@/components/HelpPanel";
import { WelcomeTutorialModal } from "@/components/WelcomeTutorialModal";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { useProfile } from "@/contexts/ProfileContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { institutionName } = useProfile();
  useSessionTimeout();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F5F0",
        display: "flex",
        width: "100%",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      <DashboardSidebar companyName={institutionName} />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: 28,
          background: "#F5F5F0",
          overflowY: "auto",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
      <HelpPanel />
      <WelcomeTutorialModal />
    </div>
  );
}
