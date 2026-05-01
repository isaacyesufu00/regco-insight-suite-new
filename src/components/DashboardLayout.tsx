import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { HelpPanel } from "@/components/HelpPanel";
import { useEffect, useState } from "react";
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
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar companyName={companyName} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card">
            <SidebarTrigger className="mr-4" />
            <span className="text-sm font-semibold text-foreground">RegCo Dashboard</span>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <HelpPanel />
    </SidebarProvider>
  );
}
