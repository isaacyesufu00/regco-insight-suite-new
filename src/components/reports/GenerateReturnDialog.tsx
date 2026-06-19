import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ParamDef = { key: string; label: string; type: "string" | "number" | "date" | "boolean"; required?: boolean };
type Template = {
  id: string;
  code: string;
  title: string;
  regulator: string | null;
  frequency: string | null;
  definition: {
    formats?: string[];
    parameters?: ParamDef[];
    period?: { kind: string };
  };
};

const PERIOD_PLACEHOLDER: Record<string, string> = {
  day: "YYYY-MM-DD or 'today' / 'yesterday'",
  week: "YYYY-MM-DD (any day in week)",
  month: "YYYY-MM",
  quarter: "YYYY-Q1 .. YYYY-Q4",
  year: "YYYY",
  event: "Event identifier (optional)",
};

export function GenerateReturnDialog({ onGenerated }: { onGenerated?: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [code, setCode] = useState<string>("");
  const [period, setPeriod] = useState("");
  const [params, setParams] = useState<Record<string, any>>({});
  const [formats, setFormats] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [override, setOverride] = useState(false);
  const [result, setResult] = useState<{ ready: boolean; missing?: any[]; urls?: Record<string, string> } | null>(null);

  const selected = useMemo(() => templates.find((t) => t.code === code), [templates, code]);

  useEffect(() => {
    if (!open) return;
    void (async () => {
      const { data } = await supabase.from("report_templates").select("id,code,title,regulator,frequency,definition").eq("status", "active").order("regulator");
      setTemplates((data ?? []) as Template[]);
    })();
  }, [open]);

  useEffect(() => {
    if (!selected) return;
    setFormats(selected.definition.formats ?? ["xlsx", "csv"]);
    setParams({});
    setPeriod("");
    setResult(null);
    setOverride(false);
  }, [selected?.code]);

  const submit = async () => {
    if (!selected) return;
    setBusy(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-return", {
        body: { template_code: selected.code, period: period || undefined, params, formats, override_readiness: override },
      });
      if (error) throw error;
      if (data?.ready === false && !override) {
        setOverride(true);
        setResult({ ready: false, missing: data.readiness?.missing_fields ?? [] });
        toast({ title: "Missing data", description: "Review the gaps, then click Generate again to override." });
      } else {
        setResult({ ready: true, urls: data?.urls ?? {} });
        toast({ title: "Report generated", description: selected.title });
        onGenerated?.();
      }
    } catch (e: any) {
      toast({ title: "Failed", description: e?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const grouped = useMemo(() => {
    const out: Record<string, Template[]> = {};
    for (const t of templates) (out[t.regulator || "Other"] ??= []).push(t);
    return out;
  }, [templates]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Generate return</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate regulatory return</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-xs">Return</Label>
            <Select value={code} onValueChange={setCode}>
              <SelectTrigger><SelectValue placeholder="Select a return…" /></SelectTrigger>
              <SelectContent>
                {Object.entries(grouped).map(([reg, list]) => (
                  <div key={reg}>
                    <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">{reg}</div>
                    {list.map((t) => <SelectItem key={t.code} value={t.code}>{t.title}</SelectItem>)}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected && (
            <>
              <div>
                <Label className="text-xs">Period</Label>
                <Input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder={PERIOD_PLACEHOLDER[selected.definition.period?.kind ?? "day"]} />
              </div>

              {(selected.definition.parameters ?? []).map((p) => (
                <div key={p.key}>
                  <Label className="text-xs">{p.label}{p.required && <span className="text-red-600"> *</span>}</Label>
                  <Input
                    type={p.type === "number" ? "number" : p.type === "date" ? "date" : "text"}
                    value={params[p.key] ?? ""}
                    onChange={(e) => setParams({ ...params, [p.key]: p.type === "number" ? Number(e.target.value) : e.target.value })}
                  />
                </div>
              ))}

              <div>
                <Label className="text-xs">Formats</Label>
                <div className="flex gap-3 mt-1">
                  {(selected.definition.formats ?? ["xlsx", "csv", "pdf", "xml"]).map((f) => (
                    <label key={f} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <Checkbox checked={formats.includes(f)} onCheckedChange={(c) => setFormats(c ? [...formats, f] : formats.filter((x) => x !== f))} />
                      <span className="uppercase font-mono">{f}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {result && result.ready === false && (
            <div className="rounded border border-amber-300 bg-amber-50 p-2 text-xs">
              <p className="font-medium mb-1">Readiness: missing</p>
              <ul className="space-y-0.5">
                {(result.missing ?? []).map((m: any) => (
                  <li key={m.field}>• {m.field}{m.count ? ` (${m.count})` : ""}</li>
                ))}
              </ul>
              <p className="mt-1 text-amber-800">Click Generate again to override and produce the file anyway.</p>
            </div>
          )}

          {result?.urls && (
            <div className="rounded border bg-muted/30 p-2 text-xs space-y-1">
              <p className="font-medium">Files</p>
              {Object.entries(result.urls).map(([k, href]) => (
                <a key={k} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 underline text-primary">
                  <Download className="h-3 w-3" /> {k.replace("_url", "").toUpperCase()}
                </a>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={submit} disabled={!selected || busy}>
            {busy && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
            {override ? "Generate anyway" : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
