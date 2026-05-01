import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { HelpPanel } from "@/components/HelpPanel";

interface DashboardLayoutProps { children: React.ReactNode; }

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [reportCounts, setReportCounts] = useState({ pending: 0, unread: 0 });
  useSessionTimeout();

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("company_name").eq("id", user.id).maybeSingle().then(({ data }) => { if (data) setCompanyName(data.company_name); });
    const fetchCounts = async () => {
      const [reportsRes, mailRes] = await Promise.all([
        supabase.from("reports").select("id", { count: "exact", head: true }).eq("user_id", user.id).in("status", ["Pending", "Processing"]),
        supabase.from("compliance_messages").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false),
      ]);
      setReportCounts({ pending: reportsRes.count ?? 0, unread: mailRes.count ?? 0 });
    };
    fetchCounts();
    const channel = supabase.channel("dashboard-counts")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports", filter: `user_id=eq.${user.id}` }, fetchCounts)
      .on("postgres_changes", { event: "*", schema: "public", table: "compliance_messages", filter: `user_id=eq.${user.id}` }, fetchCounts)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return (
    <div className="min-h-screen w-full flex" style={{ background: "#F5F5F7" }}>
      <DashboardSidebar companyName={companyName} pendingCount={reportCounts.pending} unreadMail={reportCounts.unread} />
      <main className="flex-1 min-w-0 overflow-auto p-6">{children}</main>
      <HelpPanel />
    </div>
  );
}
