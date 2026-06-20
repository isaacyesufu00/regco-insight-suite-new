import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileCog, Copy, Pencil, Archive, CheckCircle2, Trash2, Loader2 } from "lucide-react";

type Template = {
  id: string;
  code: string;
  version: number;
  title: string;
  regulator: string | null;
  frequency: string | null;
  status: string;
  updated_at: string;
};

const statusVariant = (s: string) =>
  s === "active" ? "default" : s === "draft" ? "secondary" : "outline";

export default function AdminTemplates() {
  const [rows, setRows] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("report_templates")
      .select("id, code, version, title, regulator, frequency, status, updated_at")
      .order("code", { ascending: true })
      .order("version", { ascending: false });
    if (error) {
      toast({ title: "Failed to load templates", description: error.message, variant: "destructive" });
    } else {
      setRows((data as Template[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createNew = async () => {
    const { data, error } = await supabase
      .from("report_templates")
      .insert({
        code: `NEW_${Date.now().toString(36).toUpperCase()}`,
        version: 1,
        title: "Untitled template",
        regulator: "CBN",
        frequency: "monthly",
        status: "draft",
        definition: {
          code: "NEW",
          parameters: [],
          sources: [],
          readiness: [],
          layout: { type: "table", columns: [] },
          formats: ["xlsx", "csv", "pdf"],
        },
      })
      .select()
      .single();
    if (error || !data) {
      toast({ title: "Create failed", description: error?.message, variant: "destructive" });
      return;
    }
    navigate(`/admin/templates/${data.id}`);
  };

  const duplicate = async (t: Template) => {
    const { data: src } = await supabase.from("report_templates").select("*").eq("id", t.id).single();
    if (!src) return;
    const { data, error } = await supabase
      .from("report_templates")
      .insert({
        code: src.code,
        version: t.version + 1,
        title: `${src.title} (v${t.version + 1})`,
        regulator: src.regulator,
        frequency: src.frequency,
        status: "draft",
        definition: src.definition,
      })
      .select()
      .single();
    if (error || !data) {
      toast({ title: "Duplicate failed", description: error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Duplicated as new draft version" });
    navigate(`/admin/templates/${data.id}`);
  };

  const activate = async (t: Template) => {
    const { error: demoteErr } = await supabase
      .from("report_templates")
      .update({ status: "archived" })
      .eq("code", t.code)
      .eq("status", "active")
      .neq("id", t.id);
    if (demoteErr) {
      toast({ title: "Activate failed", description: demoteErr.message, variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("report_templates").update({ status: "active" }).eq("id", t.id);
    if (error) {
      toast({ title: "Activate failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `${t.code} v${t.version} is now active` });
    load();
  };

  const archive = async (t: Template) => {
    const { error } = await supabase.from("report_templates").update({ status: "archived" }).eq("id", t.id);
    if (error) toast({ title: "Archive failed", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (t: Template) => {
    if (t.status !== "draft") {
      toast({ title: "Only drafts can be deleted", variant: "destructive" });
      return;
    }
    if (!confirm(`Delete draft ${t.code} v${t.version}?`)) return;
    const { error } = await supabase.from("report_templates").delete().eq("id", t.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCog className="h-5 w-5 text-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Report Templates</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Define every regulatory return as a schema. No SQL required.
          </p>
        </div>
        <Button onClick={createNew}>
          <Plus className="h-4 w-4 mr-2" /> New template
        </Button>
      </div>

      <div className="bg-background border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No templates yet. Create your first one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Code</th>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Regulator</th>
                <th className="text-left px-4 py-3 font-medium">Frequency</th>
                <th className="text-left px-4 py-3 font-medium">Version</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-t hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-xs">{t.code}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/templates/${t.id}`} className="font-medium hover:underline">{t.title}</Link>
                  </td>
                  <td className="px-4 py-3">{t.regulator ?? "—"}</td>
                  <td className="px-4 py-3 capitalize">{t.frequency ?? "—"}</td>
                  <td className="px-4 py-3">v{t.version}</td>
                  <td className="px-4 py-3"><Badge variant={statusVariant(t.status) as any}>{t.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/templates/${t.id}`)} title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => duplicate(t)} title="Duplicate as new version">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      {t.status !== "active" && (
                        <Button size="sm" variant="ghost" onClick={() => activate(t)} title="Activate">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        </Button>
                      )}
                      {t.status === "active" && (
                        <Button size="sm" variant="ghost" onClick={() => archive(t)} title="Archive">
                          <Archive className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {t.status === "draft" && (
                        <Button size="sm" variant="ghost" onClick={() => remove(t)} title="Delete draft">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
