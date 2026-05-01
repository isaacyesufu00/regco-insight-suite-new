import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle, CalendarDays, FilePlus, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ComplianceGauge } from "@/components/ComplianceGauge";

interface Profile {
  full_name: string | null;
  company_name: string | null;
  rc_number: string | null;
  account_status: string;
}

interface Report {
  id: string;
  report_name: string;
  report_type: string | null;
  status: string;
  created_at: string;
  file_path: string | null;
  reporting_period_start: string | null;
  reporting_period_end: string | null;
  pdf_url: string | null;
}

const DashboardHome = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, reportsRes] = await Promise.all([
        supabase.from("profiles").select("full_name, company_name, rc_number, account_status").eq("id", user.id).maybeSingle(),
        supabase.from("reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (reportsRes.data) setReports(reportsRes.data);
      setLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel("reports-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports", filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === "INSERT") {
          setReports((prev) => [payload.new as Report, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          const updated = payload.new as Report;
          setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
          if (updated.status === "Ready") {
            toast({ title: "Report ready", description: `"${updated.report_name}" is ready to download.` });
          }
        } else if (payload.eventType === "DELETE") {
          setReports((prev) => prev.filter((r) => r.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, toast]);

  const handleDownload = async (filePath: string, reportName: string) => {
    const { data } = await supabase.storage.from("reports").createSignedUrl(filePath, 3600);
    if (data?.signedUrl) {
      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = reportName;
      a.click();
    }
  };

  const now = new Date();
  const thisMonth = reports.filter((r) => {
    const d = new Date(r.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const totalReports = reports.length;
  const processing = reports.filter((r) => r.status === "Processing").length;
  const ready = reports.filter((r) => r.status === "Ready").length;

  const statusColor = (s: string) => {
    if (s === "Ready") return "bg-success/10 text-success border-success/20";
    if (s === "Processing") return "bg-warning/10 text-warning border-warning/20";
    if (s === "Failed") return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-muted text-muted-foreground";
  };

  const recentReports = reports.slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {profile?.company_name || "User"}
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            {profile?.rc_number && <span>RC: {profile.rc_number}</span>}
            <Badge variant={profile?.account_status === "Active" ? "default" : "secondary"}>
              {profile?.account_status || "Active"}
            </Badge>
          </div>
        </div>
        <Button asChild>
          <Link to="/dashboard/new-report">
            <FilePlus className="mr-2 h-4 w-4" />
            Create New Report
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: totalReports, icon: FileText, iconClass: "text-primary" },
          { label: "Processing", value: processing, icon: Clock, iconClass: "text-warning" },
          { label: "Ready for Download", value: ready, icon: CheckCircle, iconClass: "text-success" },
          { label: "Reports This Month", value: thisMonth, icon: CalendarDays, iconClass: "text-info" },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
                <c.icon className={`w-5 h-5 ${c.iconClass}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
                <p className="text-sm text-muted-foreground">{c.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Score Gauge */}
      <ComplianceGauge />

      {/* Recent Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Reports</CardTitle>
          {reports.length > 0 && (
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/reports">View All</Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No reports yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Click Create New Report to get started.</p>
              <Button asChild variant="outline">
                <Link to="/dashboard/new-report"><FilePlus className="mr-2 h-4 w-4" />Create New Report</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reporting Period</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.report_name}</TableCell>
                      <TableCell>{r.report_type || "—"}</TableCell>
                      <TableCell>
                        {r.reporting_period_start && r.reporting_period_end
                          ? `${new Date(r.reporting_period_start).toLocaleDateString()} – ${new Date(r.reporting_period_end).toLocaleDateString()}`
                          : "—"}
                      </TableCell>
                      <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {r.status === "Ready" && r.file_path && (
                          <Button size="sm" variant="outline" onClick={() => handleDownload(r.file_path!, r.report_name)}>
                            <Download className="mr-1 h-3 w-3" />Download
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
