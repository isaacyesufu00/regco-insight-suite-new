import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, AlertTriangle, CheckCircle, FilePlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeadlineItem {
  reportType: string;
  deadline: Date;
  status: "ready" | "upcoming" | "due-soon" | "overdue";
  daysRemaining: number;
}

// Standard CBN deadlines
function getDeadlinesForYear(year: number): Array<{ reportType: string; date: Date }> {
  const deadlines: Array<{ reportType: string; date: Date }> = [];

  for (let m = 0; m < 12; m++) {
    deadlines.push({ reportType: "MFB Regulatory Return", date: new Date(year, m, 10) });
    deadlines.push({ reportType: "CBN Monetary Policy Return", date: new Date(year, m, 15) });
    deadlines.push({ reportType: "Prudential Return", date: new Date(year, m, 15) });
    deadlines.push({ reportType: "CBN Forex Return", date: new Date(year, m, 15) });
  }

  // Weekly Forex Mondays
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 1) {
      deadlines.push({ reportType: "CBN Forex Return", date: new Date(d) });
    }
  }

  // Quarterly
  [new Date(year, 3, 30), new Date(year, 6, 31), new Date(year, 9, 31), new Date(year + 1, 0, 31)].forEach((date) => {
    deadlines.push({ reportType: "AML/CFT Report", date });
    deadlines.push({ reportType: "NFIU Regulatory Return", date });
  });

  deadlines.push({ reportType: "SCUML Compliance Report", date: new Date(year, 2, 31) });

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
      .filter((d) => assignedTypes.includes(d.reportType))
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

        return { reportType: d.reportType, deadline: d.date, status, daysRemaining };
      });
  }, [year, assignedTypes, readyReports]);

  const monthDeadlines = allDeadlines.filter(
    (d) => d.deadline.getMonth() === month && d.deadline.getFullYear() === year
  );

  const upcoming90 = allDeadlines
    .filter((d) => {
      const now = new Date();
      const diff = d.deadline.getTime() - now.getTime();
      return diff >= -7 * 86400000 && diff <= 90 * 86400000;
    })
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

  // Build calendar grid
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const getDotsForDay = (day: number) =>
    monthDeadlines.filter((d) => d.deadline.getDate() === day);

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

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Calendar</h1>
          <p className="text-sm text-muted-foreground">Track CBN submission deadlines</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/new-report"><FilePlus className="mr-2 h-4 w-4" />Create Report</Link>
        </Button>
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
              const isToday =
                day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <div
                  key={i}
                  className={`min-h-[60px] p-1 border border-border/50 rounded-md ${day ? "cursor-pointer hover:bg-accent/50" : ""} ${isToday ? "bg-accent" : ""}`}
                  onClick={() => {
                    if (dots.length > 0) setSelectedDeadline(dots[0]);
                  }}
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
                    <FilePlus className="mr-2 h-4 w-4" />Generate Report
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
            <p className="text-sm text-muted-foreground text-center py-8">No upcoming deadlines for your assigned report types.</p>
          ) : (
            <div className="space-y-2">
              {upcoming90.slice(0, 20).map((d, i) => (
                <div key={i} className="flex items-center justify-between py-3 px-4 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor(d.status)}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.reportType}</p>
                      <p className="text-xs text-muted-foreground">{d.deadline.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}</p>
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
