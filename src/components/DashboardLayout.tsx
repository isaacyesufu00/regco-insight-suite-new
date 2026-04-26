import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { HelpPanel } from "@/components/HelpPanel";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Floating-card shell. Outer #F0F0F0 surface, inner white card holds
 * sidebar + main content with rounded corners and subtle shadow.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [reportCounts, setReportCounts] = useState({ pending: 0, unread: 0 });
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

    const fetchCounts = async () => {
      const [reportsRes, mailRes] = await Promise.all([
        supabase
          .from("reports")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .in("status", ["Pending", "Processing"]),
        supabase
          .from("compliance_messages")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_read", false),
      ]);
      setReportCounts({
        pending: reportsRes.count ?? 0,
        unread: mailRes.count ?? 0,
      });
    };
    fetchCounts();

    const channel = supabase
      .channel("dashboard-counts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports", filter: `user_id=eq.${user.id}` },
        fetchCounts
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "compliance_messages", filter: `user_id=eq.${user.id}` },
        fetchCounts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#F0F0F0", padding: "24px" }}
    >
      <div
        className="flex w-full overflow-hidden"
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          minHeight: "calc(100vh - 48px)",
        }}
      >
        <DashboardSidebar
          companyName={companyName}
          pendingCount={reportCounts.pending}
          unreadMail={reportCounts.unread}
        />
        <main
          className="flex-1 min-w-0 overflow-auto"
          style={{ background: "#F5F5F5", padding: 20 }}
        >
          {children}
        </main>
      </div>
      <HelpPanel />
    </div>
  );
}
