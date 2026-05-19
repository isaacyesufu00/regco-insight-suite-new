import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";
import {
  Download,
  FileText,
  Search,
  RefreshCw,
  ChevronDown,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DownloadButton from "@/components/DownloadButton";

interface Report {
  id: string;
  report_name: string;
  report_type: string | null;
  status: string;
  created_at: string;
  file_path: string | null;
  file_url: string | null;
  report_url: string | null;
  reporting_period_start: string | null;
  reporting_period_end: string | null;
  pdf_url: string | null;
  docx_url: string | null;
  xlsx_url: string | null;
  error_message: string | null;
}

const isReady = (s: string) => s.toLowerCase() === "ready";
const isFailed = (s: string) => s.toLowerCase() === "failed";
const isProcessing = (s: string) => s.toLowerCase() === "processing" || s.toLowerCase() === "pending";

const POLL_INTERVAL_MS = 8_000;

const REGULATOR_MAP: Record<string, string> = {
  'MFB Regulatory Return': 'CBN',
  'Monetary Policy Return': 'CBN',
  'CBN Monetary Policy Return': 'CBN',
  'Prudential Return': 'CBN',
  'CBN Forex Return': 'CBN',
  'Board Governance Return': 'CBN',
  'Consumer Protection Return': 'CBN',
  'CBN Consumer Protection Return': 'CBN',
  'AML/CFT Compliance Report': 'NFIU',
  'AML/CFT Report': 'NFIU',
  'NFIU Regulatory Return': 'NFIU',
  'International Transfers Report': 'NFIU',
  'SCUML Annual Compliance': 'SCUML',
  'SCUML Compliance Report': 'SCUML',
  'NDIC Premium Return': 'NDIC',
  'Single Obligor Report': 'NDIC',
  'Company Income Tax Return': 'FIRS',
  'PAYE Remittance': 'FIRS',
  'Withholding Tax Return': 'FIRS',
  'VAT Return': 'FIRS',
};

const REGULATOR_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CBN: { bg: 'rgba(0,102,204,0.1)', text: '#0066CC', border: 'rgba(0,102,204,0.2)' },
  NFIU: { bg: 'rgba(217,119,6,0.1)', text: '#D97706', border: 'rgba(217,119,6,0.2)' },
  SCUML: { bg: 'rgba(22,163,74,0.1)', text: '#16A34A', border: 'rgba(22,163,74,0.2)' },
  NDIC: { bg: 'rgba(147,51,234,0.1)', text: '#9333EA', border: 'rgba(147,51,234,0.2)' },
  FIRS: { bg: 'rgba(220,38,38,0.1)', text: '#DC2626', border: 'rgba(220,38,38,0.2)' },
};

const FILTER_TABS = ["All", "CBN", "NFIU", "SCUML", "NDIC", "FIRS", "Pending", "Processing", "Ready", "Failed"];

const MyReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reportsRef = useRef<Report[]>([]);
  useEffect(() => { reportsRef.current = reports; }, [reports]);

  const fetchReports = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      (data as Report[]).forEach((updated) => {
        const existing = reportsRef.current.find((r) => r.id === updated.id);
        if (existing && existing.status !== updated.status && isReady(updated.status)) {
          toast({ title: "Report ready", description: `"${updated.report_name}" is ready to download.` });
        }
      });
      setReports(data as Report[]);
    }
  }, [user, toast]);

  useEffect(() => { fetchReports().then(() => setLoading(false)); }, [fetchReports]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("reports-my")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports", filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === "INSERT") {
          setReports((p) => [payload.new as Report, ...p]);
        } else if (payload.eventType === "UPDATE") {
          const updated = payload.new as Report;
          setReports((p) => p.map((r) => (r.id === updated.id ? updated : r)));
          if (isReady(updated.status)) {
            toast({ title: "Report ready", description: `"${updated.report_name}" is ready to download.` });
          }
        } else if (payload.eventType === "DELETE") {
          setReports((p) => p.filter((r) => r.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, toast]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchReports, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [user, fetchReports]);

  const resolveDownloadUrl = (r: Report): string | null => {
    if (r.report_url) {
      const { data } = supabase.storage.from("reports").getPublicUrl(r.report_url);
      return data?.publicUrl || null;
    }
    return r.pdf_url || null;
  };

  const handleDownload = async (r: Report) => {
    const url = resolveDownloadUrl(r);
    if (url) { const a = document.createElement("a"); a.href = url; a.download = r.report_name; a.target = "_blank"; a.click(); return; }
    if (r.file_path) {
      const { data } = await supabase.storage.from("reports").createSignedUrl(r.file_path, 3600);
      if (data?.signedUrl) { const a = document.createElement("a"); a.href = data.signedUrl; a.download = r.report_name; a.click(); return; }
    }
    toast({ title: "Download unavailable", description: "The report file is not yet available.", variant: "destructive" });
  };

  const handleDownloadFormat = async (url: string | null, filePath: string | null, name: string) => {
    let signedUrl = url;
    if (!signedUrl && filePath) {
      const { data } = await supabase.storage.from("reports").createSignedUrl(filePath, 3600);
      signedUrl = data?.signedUrl || null;
    }
    if (signedUrl) { const a = document.createElement("a"); a.href = signedUrl; a.download = name; a.click(); } else {
      toast({ title: "Download unavailable", description: "This file format is not yet available.", variant: "destructive" });
    }
  };

  const handleRetry = async (reportId: string) => {
    await supabase.from("reports").update({ status: "Processing" }).eq("id", reportId);
    toast({ title: "Retrying", description: "We're regenerating your report." });
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;
    setDeleting(true);
    const { error } = await supabase.from("reports").delete().eq("id", reportToDelete.id);
    setDeleting(false);
    setReportToDelete(null);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
      toast({ title: "Report deleted", description: "The report has been removed." });
    }
  };

  const filtered = reports.filter((r) => {
    if (search && !r.report_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter === "All") return true;
    if (["CBN", "NFIU", "SCUML", "NDIC", "FIRS"].includes(activeFilter)) {
      const reg = r.report_type ? REGULATOR_MAP[r.report_type] : null;
      return reg === activeFilter;
    }
    return r.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const regulatorBadge = (reportType: string | null) => {
    if (!reportType) return null;
    const reg = REGULATOR_MAP[reportType];
    if (!reg) return null;
    const colors = REGULATOR_COLORS[reg] || REGULATOR_COLORS.CBN;
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
      >
        {reg}
      </span>
    );
  };

  const statusBadge = (r: Report) => {
    if (isReady(r.status)) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-success/10 text-success border-success/20">Ready</span>;
    if (isFailed(r.status)) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-destructive/10 text-destructive border-destructive/20">Failed</span>;
    if (isProcessing(r.status)) return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-warning/10 text-warning border-warning/20"><Loader2 className="h-3 w-3 animate-spin" />Processing</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-muted text-muted-foreground">{r.status}</span>;
  };

  const actionCell = (r: Report) => {
    if (isReady(r.status)) {
      return <DownloadButton report={r as any} variant="icon" size="sm" />;
    }
    if (isFailed(r.status)) {
      return (
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-start gap-2 p-2.5 rounded-lg border border-destructive/30 bg-destructive/5 max-w-[260px] text-left">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive break-words">{r.error_message || "We encountered an issue. Our team has been notified."}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => handleRetry(r.id)}><RefreshCw className="mr-1 h-3 w-3" /> Try Again</Button>
        </div>
      );
    }
    if (isProcessing(r.status)) {
      return <span className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />Generating…</span>;
    }
    return null;
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

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                style={{
                  borderRadius: 980,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: activeFilter === tab ? "#1D1D1F" : "rgba(0,0,0,0.04)",
                  color: activeFilter === tab ? "white" : "#6E6E73",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search reports..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                    <TableHead>Regulator</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reporting Period</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.report_name}</TableCell>
                      <TableCell>{regulatorBadge(r.report_type)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.report_type || "—"}</TableCell>
                      <TableCell>
                        {r.reporting_period_start && r.reporting_period_end
                          ? `${new Date(r.reporting_period_start).toLocaleDateString()} – ${new Date(r.reporting_period_end).toLocaleDateString()}`
                          : "—"}
                      </TableCell>
                      <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{statusBadge(r)}</TableCell>
                      <TableCell className="text-right">{actionCell(r)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => setReportToDelete(r)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!reportToDelete} onOpenChange={(open) => { if (!open) setReportToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this report?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">{reportToDelete?.report_name}</span> will be permanently deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyReports;
