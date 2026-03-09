import { FileText, CheckCircle } from "lucide-react";

const DashboardMock = () => {
  return (
    <div className="relative flex items-end justify-center gap-6 pb-0" style={{ minHeight: 280 }}>
      {/* Before card */}
      <div className="relative z-10 w-56 md:w-64 card-elevated rounded-2xl border border-border/60 p-5 -rotate-3 translate-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-muted flex items-center justify-center">
            <FileText className="w-3 h-3 text-muted-foreground" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">Before</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded-full w-full" />
          <div className="h-2 bg-muted rounded-full w-4/5" />
          <div className="h-2 bg-muted rounded-full w-3/5" />
          <div className="h-2 bg-muted rounded-full w-full" />
          <div className="h-2 bg-muted rounded-full w-2/3" />
          <div className="h-2 bg-destructive/20 rounded-full w-4/5" />
          <div className="h-2 bg-muted rounded-full w-1/2" />
        </div>
      </div>

      {/* After card */}
      <div className="relative z-20 w-60 md:w-72 card-elevated-lg rounded-2xl border border-border/60 p-5 rotate-2 -translate-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-success" />
          </div>
          <span className="text-xs font-semibold text-foreground">After</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1.5 font-mono leading-relaxed">
          <p className="text-foreground font-semibold font-sans text-sm">CBN Quarterly Return</p>
          <p>Filed by: RegCo AI Engine</p>
          <p>Period: Q4 2025</p>
          <p>Status: <span className="text-success font-semibold">Ready for Submission</span></p>
          <p>Compliance Score: <span className="text-primary font-semibold">94/100</span></p>
          <p className="text-muted-foreground/60">All validation checks passed.</p>
        </div>
      </div>

      {/* Background decorative shape */}
      <div className="absolute inset-0 -bottom-8 bg-gradient-to-t from-background via-transparent to-transparent z-30 pointer-events-none" />
    </div>
  );
};

export default DashboardMock;
