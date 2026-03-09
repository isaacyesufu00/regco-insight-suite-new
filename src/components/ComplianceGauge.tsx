import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ScoreBreakdown {
  report_type: string;
  last_submission: string | null;
  status: string;
  points_deducted: number;
  reason: string;
}

export function ComplianceGauge() {
  const { user } = useAuth();
  const [score, setScore] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchScore = async () => {
      // Trigger score recalculation
      try {
        await supabase.functions.invoke("calculate-compliance-score", {
          body: { user_id: user.id },
        });
      } catch { /* ignore */ }

      const { data } = await supabase
        .from("compliance_scores")
        .select("score, score_breakdown")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setScore(data.score);
        setBreakdown((data.score_breakdown as unknown as ScoreBreakdown[]) || []);
      }
      setLoading(false);
    };

    fetchScore();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  const displayScore = score ?? 0;
  const gaugeColor =
    displayScore >= 90
      ? "hsl(var(--success))"
      : displayScore >= 70
        ? "hsl(var(--warning))"
        : "hsl(var(--destructive))";

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (displayScore / 100) * circumference;

  const statusLabel =
    displayScore >= 90
      ? "Excellent standing"
      : displayScore >= 70
        ? "Needs attention"
        : "Critical — action required";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Compliance Score</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {/* Circular Gauge */}
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={gaugeColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{displayScore}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <p className="text-sm font-medium" style={{ color: gaugeColor }}>{statusLabel}</p>
        </CardContent>
      </Card>

      {/* Breakdown Table */}
      {breakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Last Submission</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breakdown.map((b) => (
                  <TableRow key={b.report_type}>
                    <TableCell className="text-sm font-medium">{b.report_type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {b.last_submission ? new Date(b.last_submission).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell>
                      {b.points_deducted === 0 ? (
                        <span className="text-sm text-success font-medium">+0</span>
                      ) : (
                        <span className="text-sm text-destructive font-medium">-{b.points_deducted}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          b.points_deducted === 0
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {b.reason}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
