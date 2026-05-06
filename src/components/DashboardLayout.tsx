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
          background: "#F0F0F2",
          padding: 28,
          display: "flex",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "white",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
            display: "flex",
          }}
        >
          <DashboardSidebar companyName={companyName} />
          <div className="flex-1 flex flex-col min-w-0">
            <header
              className="flex items-center px-5"
              style={{
                height: 48,
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <SidebarTrigger className="mr-4" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>RegCo</span>
            </header>
            <main style={{ flex: 1, padding: 20, background: "#F5F5F7", overflowY: "auto" }}>
              {children}
            </main>
          </div>
        </div>
      </div>
      <HelpPanel />
      <WelcomeTutorialModal />
    </SidebarProvider>
  );
}
