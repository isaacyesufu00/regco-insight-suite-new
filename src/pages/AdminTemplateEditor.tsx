import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react";

// --- Domain types for the template `definition` JSON column ---
type ParamType = "text" | "number" | "date" | "select" | "boolean";

type Parameter = {
  key: string;
  label: string;
  type: ParamType;
  required?: boolean;
  default?: string;
  options?: string[];
  help?: string;
};

type FilterOp = "=" | "!=" | ">" | ">=" | "<" | "<=" | "in" | "like";

type SourceFilter = { column: string; op: FilterOp; value: string };

type Source = {
  key: string;
  table: string;
  columns: string[];
  filters: SourceFilter[];
  order_by?: string;
  limit?: number;
};

type ReadinessRuleType = "min_rows" | "required_column" | "non_null" | "regex";

type ReadinessRule = {
  type: ReadinessRuleType;
  source: string;
  column?: string;
  value?: string | number;
  message: string;
};

type LayoutType = "table" | "form" | "sectioned";

type Layout = {
  type: LayoutType;
  source?: string;
  columns?: { key: string; label: string }[];
};

type FormatKey = "xlsx" | "csv" | "xml" | "pdf";

type Definition = {
  code?: string;
  title?: string;
  regulator?: string;
  frequency?: string;
  period?: { type: "monthly" | "quarterly" | "annual" | "ad_hoc"; offset_days?: number };
  parameters: Parameter[];
  sources: Source[];
  readiness: ReadinessRule[];
  layout: Layout;
  formats: FormatKey[];
};

const FORMATS: FormatKey[] = ["xlsx", "csv", "xml", "pdf"];
const KNOWN_TABLES = [
  "unified_transactions",
  "customers",
  "customer_accounts",
  "customer_kyc",
  "screening_results",
  "transaction_reviews",
  "cases",
  "case_events",
  "filing_schedules",
];
const FILTER_OPS: FilterOp[] = ["=", "!=", ">", ">=", "<", "<=", "in", "like"];

const emptyDef = (): Definition => ({
  parameters: [],
  sources: [],
  readiness: [],
  layout: { type: "table", columns: [] },
  formats: ["xlsx", "csv", "pdf"],
});

export default function AdminTemplateEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState("");
  const [version, setVersion] = useState(1);
  const [title, setTitle] = useState("");
  const [regulator, setRegulator] = useState("CBN");
  const [frequency, setFrequency] = useState("monthly");
  const [status, setStatus] = useState("draft");
  const [definition, setDefinition] = useState<Definition>(emptyDef());

  useEffect(() => {
    (async () => {
      if (!id) return;
      const { data, error } = await supabase.from("report_templates").select("*").eq("id", id).single();
      if (error || !data) {
        toast({ title: "Load failed", description: error?.message, variant: "destructive" });
        return;
      }
      setCode(data.code);
      setVersion(data.version);
      setTitle(data.title);
      setRegulator(data.regulator ?? "CBN");
      setFrequency(data.frequency ?? "monthly");
      setStatus(data.status);
      const def = (data.definition as any) ?? {};
      setDefinition({
        ...emptyDef(),
        ...def,
        parameters: def.parameters ?? [],
        sources: def.sources ?? [],
        readiness: def.readiness ?? [],
        layout: def.layout ?? { type: "table", columns: [] },
        formats: def.formats ?? ["xlsx", "csv", "pdf"],
      });
      setLoading(false);
    })();
  }, [id]);

  const save = async (activateAfter = false) => {
    if (!id) return;
    setSaving(true);
    const payload = {
      code,
      version,
      title,
      regulator,
      frequency,
      status: activateAfter ? "active" : status,
      definition: {
        ...definition,
        code,
        title,
        regulator,
        frequency,
      } as any,
    };
    if (activateAfter) {
      // demote other active versions sharing this code
      await supabase
        .from("report_templates")
        .update({ status: "archived" })
        .eq("code", code)
        .eq("status", "active")
        .neq("id", id);
    }
    const { error } = await supabase.from("report_templates").update(payload).eq("id", id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    if (activateAfter) setStatus("active");
    toast({ title: activateAfter ? "Activated" : "Saved", description: `${code} v${version}` });
  };

  const definitionJson = useMemo(() => JSON.stringify(definition, null, 2), [definition]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  }

  return (
    <div className="max-w-5xl">
      <Link to="/admin/templates" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to templates
      </Link>

      {/* Header */}
      <div className="bg-background border rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <Label>Code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="font-mono" />
          </div>
          <div className="md:col-span-2">
            <Label>Version</Label>
            <Input type="number" min={1} value={version} onChange={(e) => setVersion(parseInt(e.target.value) || 1)} />
          </div>
          <div className="md:col-span-7">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <Label>Regulator</Label>
            <Select value={regulator} onValueChange={setRegulator}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["CBN", "NDIC", "NFIU", "SCUML", "FIRS", "PENCOM", "NDPC", "SEC"].map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["daily", "weekly", "monthly", "quarterly", "annual", "ad_hoc"].map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Label>Status</Label>
            <div className="h-10 flex items-center"><Badge variant="outline" className="capitalize">{status}</Badge></div>
          </div>
          <div className="md:col-span-3 flex items-end gap-2">
            <Button onClick={() => save(false)} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />} Save
            </Button>
            {status !== "active" && (
              <Button variant="outline" onClick={() => save(true)} disabled={saving}>Activate</Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="parameters">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="readiness">Validators</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="formats">Formats</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>

        {/* PARAMETERS */}
        <TabsContent value="parameters">
          <SectionShell title="Input parameters" desc="Values the user provides each time the return is generated. Reference them in source filters as ${param.key}.">
            {definition.parameters.map((p, idx) => (
              <RepeaterRow key={idx} onRemove={() => setDefinition((d) => ({ ...d, parameters: d.parameters.filter((_, i) => i !== idx) }))}>
                <div className="grid grid-cols-12 gap-2">
                  <Input className="col-span-3" placeholder="key" value={p.key} onChange={(e) => updateParam(setDefinition, idx, { key: e.target.value })} />
                  <Input className="col-span-3" placeholder="Label" value={p.label} onChange={(e) => updateParam(setDefinition, idx, { label: e.target.value })} />
                  <Select value={p.type} onValueChange={(v) => updateParam(setDefinition, idx, { type: v as ParamType })}>
                    <SelectTrigger className="col-span-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["text", "number", "date", "select", "boolean"] as ParamType[]).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input className="col-span-2" placeholder="Default" value={p.default ?? ""} onChange={(e) => updateParam(setDefinition, idx, { default: e.target.value })} />
                  <label className="col-span-2 inline-flex items-center gap-2 text-xs">
                    <Checkbox checked={!!p.required} onCheckedChange={(v) => updateParam(setDefinition, idx, { required: !!v })} /> Required
                  </label>
                  {p.type === "select" && (
                    <Input className="col-span-12" placeholder="Comma-separated options" value={(p.options ?? []).join(", ")} onChange={(e) => updateParam(setDefinition, idx, { options: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
                  )}
                  <Input className="col-span-12" placeholder="Help text" value={p.help ?? ""} onChange={(e) => updateParam(setDefinition, idx, { help: e.target.value })} />
                </div>
              </RepeaterRow>
            ))}
            <AddBtn label="Add parameter" onClick={() => setDefinition((d) => ({ ...d, parameters: [...d.parameters, { key: "", label: "", type: "text" }] }))} />
          </SectionShell>
        </TabsContent>

        {/* SOURCES */}
        <TabsContent value="sources">
          <SectionShell title="Data sources & mappings" desc="Declarative queries against tenant tables. Use ${param.key} in filter values to reference parameters.">
            {definition.sources.map((s, idx) => (
              <RepeaterRow key={idx} onRemove={() => setDefinition((d) => ({ ...d, sources: d.sources.filter((_, i) => i !== idx) }))}>
                <div className="grid grid-cols-12 gap-2">
                  <Input className="col-span-3" placeholder="source key" value={s.key} onChange={(e) => updateSource(setDefinition, idx, { key: e.target.value })} />
                  <Select value={s.table} onValueChange={(v) => updateSource(setDefinition, idx, { table: v })}>
                    <SelectTrigger className="col-span-4"><SelectValue placeholder="Table" /></SelectTrigger>
                    <SelectContent>
                      {KNOWN_TABLES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input className="col-span-3" placeholder="order_by" value={s.order_by ?? ""} onChange={(e) => updateSource(setDefinition, idx, { order_by: e.target.value })} />
                  <Input className="col-span-2" type="number" placeholder="limit" value={s.limit ?? ""} onChange={(e) => updateSource(setDefinition, idx, { limit: e.target.value ? parseInt(e.target.value) : undefined })} />
                  <Input className="col-span-12" placeholder="Columns (comma-separated, blank = all)" value={s.columns.join(", ")} onChange={(e) => updateSource(setDefinition, idx, { columns: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
                  <div className="col-span-12 mt-1 space-y-2">
                    <Label className="text-xs text-muted-foreground">Filters</Label>
                    {(s.filters ?? []).map((f, fi) => (
                      <div key={fi} className="grid grid-cols-12 gap-2">
                        <Input className="col-span-4" placeholder="column" value={f.column} onChange={(e) => updateFilter(setDefinition, idx, fi, { column: e.target.value })} />
                        <Select value={f.op} onValueChange={(v) => updateFilter(setDefinition, idx, fi, { op: v as FilterOp })}>
                          <SelectTrigger className="col-span-2"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {FILTER_OPS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Input className="col-span-5" placeholder="value or ${param.key}" value={f.value} onChange={(e) => updateFilter(setDefinition, idx, fi, { value: e.target.value })} />
                        <Button size="sm" variant="ghost" className="col-span-1" onClick={() => removeFilter(setDefinition, idx, fi)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => addFilter(setDefinition, idx)}><Plus className="h-3 w-3 mr-1" /> Add filter</Button>
                  </div>
                </div>
              </RepeaterRow>
            ))}
            <AddBtn label="Add source" onClick={() => setDefinition((d) => ({ ...d, sources: [...d.sources, { key: "", table: KNOWN_TABLES[0], columns: [], filters: [] }] }))} />
          </SectionShell>
        </TabsContent>

        {/* READINESS */}
        <TabsContent value="readiness">
          <SectionShell title="Validators (readiness rules)" desc="Each rule runs against a source and fails the readiness check with the configured message.">
            {definition.readiness.map((r, idx) => (
              <RepeaterRow key={idx} onRemove={() => setDefinition((d) => ({ ...d, readiness: d.readiness.filter((_, i) => i !== idx) }))}>
                <div className="grid grid-cols-12 gap-2">
                  <Select value={r.type} onValueChange={(v) => updateRule(setDefinition, idx, { type: v as ReadinessRuleType })}>
                    <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["min_rows", "required_column", "non_null", "regex"] as ReadinessRuleType[]).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input className="col-span-3" placeholder="source key" value={r.source} onChange={(e) => updateRule(setDefinition, idx, { source: e.target.value })} />
                  <Input className="col-span-3" placeholder="column" value={r.column ?? ""} onChange={(e) => updateRule(setDefinition, idx, { column: e.target.value })} />
                  <Input className="col-span-3" placeholder="value / threshold" value={r.value?.toString() ?? ""} onChange={(e) => updateRule(setDefinition, idx, { value: e.target.value })} />
                  <Input className="col-span-12" placeholder="Error message shown when this rule fails" value={r.message} onChange={(e) => updateRule(setDefinition, idx, { message: e.target.value })} />
                </div>
              </RepeaterRow>
            ))}
            <AddBtn label="Add validator" onClick={() => setDefinition((d) => ({ ...d, readiness: [...d.readiness, { type: "min_rows", source: "", value: 1, message: "" }] }))} />
          </SectionShell>
        </TabsContent>

        {/* LAYOUT */}
        <TabsContent value="layout">
          <SectionShell title="Output layout" desc="How the rendered return is shaped.">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <Label>Type</Label>
                <Select value={definition.layout.type} onValueChange={(v) => setDefinition((d) => ({ ...d, layout: { ...d.layout, type: v as LayoutType } }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["table", "form", "sectioned"] as LayoutType[]).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-4">
                <Label>Primary source</Label>
                <Input value={definition.layout.source ?? ""} onChange={(e) => setDefinition((d) => ({ ...d, layout: { ...d.layout, source: e.target.value } }))} placeholder="source key" />
              </div>
              <div className="col-span-12 space-y-2">
                <Label className="text-xs text-muted-foreground">Columns (key → label)</Label>
                {(definition.layout.columns ?? []).map((c, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2">
                    <Input className="col-span-5" placeholder="key" value={c.key} onChange={(e) => updateLayoutCol(setDefinition, idx, { key: e.target.value })} />
                    <Input className="col-span-6" placeholder="Label" value={c.label} onChange={(e) => updateLayoutCol(setDefinition, idx, { label: e.target.value })} />
                    <Button size="sm" variant="ghost" className="col-span-1" onClick={() => removeLayoutCol(setDefinition, idx)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => setDefinition((d) => ({ ...d, layout: { ...d.layout, columns: [...(d.layout.columns ?? []), { key: "", label: "" }] } }))}><Plus className="h-3 w-3 mr-1" /> Add column</Button>
              </div>
            </div>
          </SectionShell>
        </TabsContent>

        {/* FORMATS */}
        <TabsContent value="formats">
          <SectionShell title="Output formats" desc="Formats users can request when generating this return.">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FORMATS.map((f) => (
                <label key={f} className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer">
                  <Checkbox
                    checked={definition.formats.includes(f)}
                    onCheckedChange={(v) => setDefinition((d) => ({
                      ...d,
                      formats: v
                        ? Array.from(new Set([...d.formats, f]))
                        : d.formats.filter((x) => x !== f),
                    }))}
                  />
                  <span className="text-sm uppercase">{f}</span>
                </label>
              ))}
            </div>
          </SectionShell>
        </TabsContent>

        {/* JSON */}
        <TabsContent value="json">
          <SectionShell title="Definition JSON" desc="Read-only synced view of the template definition.">
            <Textarea readOnly value={definitionJson} className="font-mono text-xs h-[480px]" />
          </SectionShell>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- helpers ---------- */
const updateParam = (setD: any, idx: number, patch: Partial<Parameter>) =>
  setD((d: Definition) => ({ ...d, parameters: d.parameters.map((p, i) => (i === idx ? { ...p, ...patch } : p)) }));
const updateSource = (setD: any, idx: number, patch: Partial<Source>) =>
  setD((d: Definition) => ({ ...d, sources: d.sources.map((p, i) => (i === idx ? { ...p, ...patch } : p)) }));
const updateFilter = (setD: any, sIdx: number, fIdx: number, patch: Partial<SourceFilter>) =>
  setD((d: Definition) => ({
    ...d,
    sources: d.sources.map((s, i) =>
      i === sIdx ? { ...s, filters: s.filters.map((f, j) => (j === fIdx ? { ...f, ...patch } : f)) } : s
    ),
  }));
const addFilter = (setD: any, sIdx: number) =>
  setD((d: Definition) => ({
    ...d,
    sources: d.sources.map((s, i) => (i === sIdx ? { ...s, filters: [...(s.filters ?? []), { column: "", op: "=", value: "" }] } : s)),
  }));
const removeFilter = (setD: any, sIdx: number, fIdx: number) =>
  setD((d: Definition) => ({
    ...d,
    sources: d.sources.map((s, i) => (i === sIdx ? { ...s, filters: s.filters.filter((_, j) => j !== fIdx) } : s)),
  }));
const updateRule = (setD: any, idx: number, patch: Partial<ReadinessRule>) =>
  setD((d: Definition) => ({ ...d, readiness: d.readiness.map((r, i) => (i === idx ? { ...r, ...patch } : r)) }));
const updateLayoutCol = (setD: any, idx: number, patch: Partial<{ key: string; label: string }>) =>
  setD((d: Definition) => ({
    ...d,
    layout: { ...d.layout, columns: (d.layout.columns ?? []).map((c, i) => (i === idx ? { ...c, ...patch } : c)) },
  }));
const removeLayoutCol = (setD: any, idx: number) =>
  setD((d: Definition) => ({
    ...d,
    layout: { ...d.layout, columns: (d.layout.columns ?? []).filter((_, i) => i !== idx) },
  }));

/* ---------- presentational ---------- */
function SectionShell({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-background border rounded-lg p-6 mt-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {desc && <p className="text-sm text-muted-foreground mb-4">{desc}</p>}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function RepeaterRow({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="border rounded-md p-3 bg-muted/20">
      <div className="flex justify-end mb-1">
        <Button size="sm" variant="ghost" onClick={onRemove}><Trash2 className="h-3.5 w-3.5" /></Button>
      </div>
      {children}
    </div>
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick} className="mt-2">
      <Plus className="h-4 w-4 mr-1" /> {label}
    </Button>
  );
}
