import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { HelpPanel } from "@/components/HelpPanel";
import { useEffect, useState } from "react";
import { WelcomeTutorialModal } from "@/components/WelcomeTutorialModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState<string | null>(null);
  useSessionTimeout();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("company_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setCompanyName(data.company_name);
      });
  }, [user]);

  return (
    <SidebarProvider>
      <div
        style={{
          minHeight: "100vh",
          background: "#F5F5F0",
          display: "flex",
          width: "100%",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        }}
      >
        <DashboardSidebar companyName={companyName} />
        <div className="flex-1 flex flex-col min-w-0">
          <header
            className="flex items-center px-5"
            style={{
              height: 52,
              background: "#F5F5F0",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <SidebarTrigger className="mr-3" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.2px" }}>RegCo</span>
          </header>
          <main style={{ flex: 1, padding: 28, background: "#F5F5F0", overflowY: "auto" }}>
            {children}
          </main>
        </div>
      </div>
      <HelpPanel />
      <WelcomeTutorialModal />
    </SidebarProvider>
  );
}
