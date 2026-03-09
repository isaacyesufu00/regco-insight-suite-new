import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";
import { Download, FileText, Search, RefreshCw, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  docx_url: string | null;
  xlsx_url: string | null;
}

const MyReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (!user) return;

    supabase.from("reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setReports(data);
        setLoading(false);
      });

    const channel = supabase
      .channel("reports-my")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports", filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === "INSERT") setReports((p) => [payload.new as Report, ...p]);
        else if (payload.eventType === "UPDATE") {
          const u = payload.new as Report;
          setReports((p) => p.map((r) => (r.id === u.id ? u : r)));
          if (u.status === "Ready") toast({ title: "Report ready", description: `"${u.report_name}" is ready to download.` });
        } else if (payload.eventType === "DELETE") setReports((p) => p.filter((r) => r.id !== (payload.old as any).id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, toast]);

  const handleDownloadFormat = async (url: string | null, filePath: string | null, name: string) => {
    let signedUrl = url;
    if (!signedUrl && filePath) {
      const { data } = await supabase.storage.from("reports").createSignedUrl(filePath, 3600);
      signedUrl = data?.signedUrl || null;
    }
    if (signedUrl) {
      const a = document.createElement("a");
      a.href = signedUrl;
      a.download = name;
      a.click();
    } else {
      toast({ title: "Download unavailable", description: "This file format is not yet available.", variant: "destructive" });
    }
  };

  const handleRetry = async (reportId: string) => {
    await supabase.from("reports").update({ status: "Processing" }).eq("id", reportId);
    toast({ title: "Retrying", description: "We're regenerating your report." });
  };

  const types = Array.from(new Set(reports.map((r) => r.report_type).filter(Boolean)));

  const filtered = reports.filter((r) => {
    if (search && !r.report_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && r.report_type !== typeFilter) return false;
    return true;
  });

  const statusColor = (s: string) => {
    if (s === "Ready") return "bg-success/10 text-success border-success/20";
    if (s === "Processing") return "bg-warning/10 text-warning border-warning/20";
    if (s === "Failed") return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-muted text-muted-foreground";
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <BackButton to="/dashboard" />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Reports</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reports..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((t) => <SelectItem key={t!} value={t!}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No reports found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reporting Period</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
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
                        {r.status === "Ready" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Download className="mr-1 h-3 w-3" /> Download <ChevronDown className="ml-1 h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownloadFormat(r.pdf_url, r.file_path, `${r.report_name}.pdf`)}>
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadFormat(r.docx_url, null, `${r.report_name}.docx`)}>
                                Download Word (.docx)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadFormat(r.xlsx_url, null, `${r.report_name}.xlsx`)}>
                                Download Excel (.xlsx)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        {r.status === "Failed" && (
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs text-destructive">We encountered an issue. Our team has been notified.</span>
                            <Button size="sm" variant="outline" onClick={() => handleRetry(r.id)}>
                              <RefreshCw className="mr-1 h-3 w-3" /> Retry
                            </Button>
                          </div>
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

export default MyReports;
