import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, FilePlus, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeadlineItem {
  reportType: string;
  regulator: string;
  deadline: Date;
  status: "ready" | "upcoming" | "due-soon" | "overdue";
  daysRemaining: number;
}

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

function getDeadlinesForYear(year: number): Array<{ reportType: string; date: Date }> {
  const deadlines: Array<{ reportType: string; date: Date }> = [];

  // CBN Monthly — 10th of every month
  for (let m = 0; m < 12; m++) {
    deadlines.push({ reportType: "MFB Regulatory Return", date: new Date(year, m, 10) });
    deadlines.push({ reportType: "Monetary Policy Return", date: new Date(year, m, 10) });
    deadlines.push({ reportType: "Prudential Return", date: new Date(year, m, 10) });
  }

  // CBN Forex Return — 15th monthly
  for (let m = 0; m < 12; m++) {
    deadlines.push({ reportType: "CBN Forex Return", date: new Date(year, m, 15) });
  }

  // PAYE — 10th of every month
  for (let m = 0; m < 12; m++) {
    deadlines.push({ reportType: "PAYE Remittance", date: new Date(year, m, 10) });
  }

  // WHT & VAT — 21st of every month
  for (let m = 0; m < 12; m++) {
    deadlines.push({ reportType: "Withholding Tax Return", date: new Date(year, m, 21) });
    deadlines.push({ reportType: "VAT Return", date: new Date(year, m, 21) });
  }

  // Quarterly — 15th of April, July, October, January
  const quarterlyMonths = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct
  const quarterlyTypes = [
    "AML/CFT Compliance Report",
    "NFIU Regulatory Return",
    "International Transfers Report",
    "Single Obligor Report",
    "Consumer Protection Return",
  ];
  for (const m of quarterlyMonths) {
    for (const rt of quarterlyTypes) {
      deadlines.push({ reportType: rt, date: new Date(year, m, 15) });
    }
  }

  // Board Governance — January 31 and July 31
  deadlines.push({ reportType: "Board Governance Return", date: new Date(year, 0, 31) });
  deadlines.push({ reportType: "Board Governance Return", date: new Date(year, 6, 31) });

  // Annual — March 31
  deadlines.push({ reportType: "SCUML Annual Compliance", date: new Date(year, 2, 31) });
  deadlines.push({ reportType: "NDIC Premium Return", date: new Date(year, 2, 31) });

  // CIT — June 30
  deadlines.push({ reportType: "Company Income Tax Return", date: new Date(year, 5, 30) });

  return deadlines;
}

const ComplianceCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignedTypes, setAssignedTypes] = useState<string[]>([]);
  const [readyReports, setReadyReports] = useState<Array<{ report_type: string; created_at: string }>>([]);
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlineItem | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("institution_report_types").select("report_type").eq("user_id", user.id).eq("is_active", true),
      supabase.from("reports").select("report_type, created_at, status").eq("user_id", user.id).eq("status", "Ready"),
    ]).then(([typesRes, reportsRes]) => {
      if (typesRes.data) setAssignedTypes(typesRes.data.map((t) => t.report_type));
      if (reportsRes.data) setReadyReports(reportsRes.data);
    });
  }, [user]);

  const allDeadlines = useMemo(() => {
    const raw = [...getDeadlinesForYear(year), ...getDeadlinesForYear(year + 1)];
    const now = new Date();

    return raw
      .filter((d) => assignedTypes.length === 0 || assignedTypes.includes(d.reportType))
      .map((d) => {
        const diffMs = d.date.getTime() - now.getTime();
        const daysRemaining = Math.ceil(diffMs / 86400000);
        const hasReady = readyReports.some(
          (r) => r.report_type === d.reportType && new Date(r.created_at) >= new Date(d.date.getTime() - 35 * 86400000)
        );
        let status: DeadlineItem["status"] = "upcoming";
        if (hasReady) status = "ready";
        else if (daysRemaining < 0) status = "overdue";
        else if (daysRemaining <= 7) status = "due-soon";

        return { reportType: d.reportType, regulator: REGULATOR_MAP[d.reportType] || "OTHER", deadline: d.date, status, daysRemaining };
      });
  }, [year, assignedTypes, readyReports]);

  const monthDeadlines = allDeadlines.filter(
    (d) => d.deadline.getMonth() === month && d.deadline.getFullYear() === year
  );

  // Compliance score for current month
  const monthScore = useMemo(() => {
    const total = monthDeadlines.length;
    if (total === 0) return { percentage: 100, filed: 0, pending: 0, overdue: 0 };
    const filed = monthDeadlines.filter(d => d.status === "ready").length;
    const overdue = monthDeadlines.filter(d => d.status === "overdue").length;
    const pending = total - filed - overdue;
    return { percentage: Math.round((filed / total) * 100), filed, pending, overdue };
  }, [monthDeadlines]);

  const upcoming90 = allDeadlines
    .filter((d) => {
      const now = new Date();
      const diff = d.deadline.getTime() - now.getTime();
      return diff >= -7 * 86400000 && diff <= 90 * 86400000;
    })
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const getDotsForDay = (day: number) => monthDeadlines.filter((d) => d.deadline.getDate() === day);

  const dotColor = (status: DeadlineItem["status"]) => {
    if (status === "ready") return "bg-success";
    if (status === "due-soon") return "bg-warning";
    if (status === "overdue") return "bg-destructive";
    return "bg-primary";
  };

  const statusBadge = (status: DeadlineItem["status"]) => {
    if (status === "ready") return <Badge className="bg-success/10 text-success border-success/20">Ready</Badge>;
    if (status === "due-soon") return <Badge className="bg-warning/10 text-warning border-warning/20">Due Soon</Badge>;
    if (status === "overdue") return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Overdue</Badge>;
    return <Badge variant="secondary">Upcoming</Badge>;
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const scoreColor = monthScore.percentage >= 80 ? "#34C759" : monthScore.percentage >= 50 ? "#FF9F0A" : "#FF3B30";

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Calendar</h1>
          <p className="text-sm text-muted-foreground">Track all regulatory submission deadlines</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/new-report"><FilePlus className="mr-2 h-4 w-4" />Create Report</Link>
        </Button>
      </div>

      {/* Compliance Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${monthScore.percentage * 2.64} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: scoreColor }}>{monthScore.percentage}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground">Monthly Compliance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success mb-2" />
            <p className="text-2xl font-bold text-foreground">{monthScore.filed}</p>
            <p className="text-xs text-muted-foreground">Filed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Clock className="w-8 h-8 text-warning mb-2" />
            <p className="text-2xl font-bold text-foreground">{monthScore.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive mb-2" />
            <p className="text-2xl font-bold text-foreground">{monthScore.overdue}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <CardTitle className="text-lg">{monthName}</CardTitle>
          <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              const dots = day ? getDotsForDay(day) : [];
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <div
                  key={i}
                  className={`min-h-[60px] p-1 border border-border/50 rounded-md ${day ? "cursor-pointer hover:bg-accent/50" : ""} ${isToday ? "bg-accent" : ""}`}
                  onClick={() => { if (dots.length > 0) setSelectedDeadline(dots[0]); }}
                >
                  {day && (
                    <>
                      <span className={`text-xs ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>{day}</span>
                      <div className="flex flex-wrap gap-0.5 mt-1">
                        {dots.slice(0, 3).map((d, j) => (
                          <div key={j} className={`w-2 h-2 rounded-full ${dotColor(d.status)}`} title={d.reportType} />
                        ))}
                        {dots.length > 3 && <span className="text-[10px] text-muted-foreground">+{dots.length - 3}</span>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Deadline popup */}
      <Dialog open={!!selectedDeadline} onOpenChange={() => setSelectedDeadline(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDeadline?.reportType}</DialogTitle>
          </DialogHeader>
          {selectedDeadline && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Regulator</p>
                  <p className="font-medium">{selectedDeadline.regulator}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Deadline</p>
                  <p className="font-medium">{selectedDeadline.deadline.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  {statusBadge(selectedDeadline.status)}
                </div>
                <div>
                  <p className="text-muted-foreground">Days Remaining</p>
                  <p className="font-medium">{selectedDeadline.daysRemaining > 0 ? `${selectedDeadline.daysRemaining} days` : selectedDeadline.daysRemaining === 0 ? "Today" : `${Math.abs(selectedDeadline.daysRemaining)} days overdue`}</p>
                </div>
              </div>
              {selectedDeadline.status !== "ready" && (
                <Button asChild className="w-full">
                  <Link to={`/dashboard/new-report?type=${encodeURIComponent(selectedDeadline.reportType)}`}>
                    <FilePlus className="mr-2 h-4 w-4" />Generate Now
                  </Link>
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upcoming Deadlines List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Deadlines (Next 90 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming90.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No upcoming deadlines.</p>
          ) : (
            <div className="space-y-2">
              {upcoming90.slice(0, 25).map((d, i) => (
                <div key={i} className="flex items-center justify-between py-3 px-4 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor(d.status)}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.reportType}</p>
                      <p className="text-xs text-muted-foreground">{d.regulator} · {d.deadline.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {d.daysRemaining > 0 ? `${d.daysRemaining}d left` : d.daysRemaining === 0 ? "Today" : `${Math.abs(d.daysRemaining)}d overdue`}
                    </span>
                    {statusBadge(d.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceCalendar;
