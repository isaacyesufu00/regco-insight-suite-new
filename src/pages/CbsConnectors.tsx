import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Database, FileDown, RefreshCw, ShieldCheck } from "lucide-react";

interface FeedConnection {
  id: string;
  label: string;
  feed_type: string;
  endpoint: string | null;
  schedule: string;
  enabled: boolean;
  last_synced_at: string | null;
  last_status: string | null;
}

type Mode = "pull" | "file_drop";

const FEED_TYPES: { value: string; label: string }[] = [
  { value: "db_postgres", label: "Postgres read-replica" },
  { value: "warehouse", label: "Data warehouse view" },
  { value: "sftp_csv", label: "SFTP CSV export" },
  { value: "api_read", label: "Read-only API" },
];

const CbsConnectors = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [connections, setConnections] = useState<FeedConnection[]>([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<Mode>("pull");
  const [label, setLabel] = useState("");
  const [feedType, setFeedType] = useState("db_postgres");
  const [endpoint, setEndpoint] = useState("");
  const [schedule, setSchedule] = useState("0 2 * * *");
  const [saving, setSaving] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("institution_users")
      .select("institution_id")
      .eq("user_id", user.id)
      .limit(1)
      .then(({ data }) => {
        const id = (data?.[0]?.institution_id as string) || null;
        setInstitutionId(id);
        if (id) loadConnections(id);
        else setLoading(false);
      });
  }, [user]);

  const loadConnections = async (instId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("cbs_feed_connections")
      .select("id, label, feed_type, endpoint, schedule, enabled, last_synced_at, last_status")
      .eq("institution_id", instId)
      .order("created_at", { ascending: false });
    setConnections((data as FeedConnection[]) || []);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !institutionId || !label.trim()) return;
    setSaving(true);

    const effectiveType = mode === "file_drop" ? "sftp_csv" : feedType;
    const payload: any = {
      institution_id: institutionId,
      user_id: user.id,
      feed_type: effectiveType,
      label: label.trim(),
      schedule: mode === "file_drop" ? "0 4 * * *" : schedule,
      enabled: true,
    };
    if (endpoint.trim()) payload.endpoint = endpoint.trim();

    const { error } = await supabase.from("cbs_feed_connections").insert(payload);
    setSaving(false);

    if (error) {
      toast({ title: "Could not save connection", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: mode === "file_drop" ? "File-drop connection added" : "Pull connection added",
      description: "RegCo will ingest from this feed on the next scheduled run.",
    });
    setLabel("");
    setEndpoint("");
    loadConnections(institutionId);
  };

  const runSync = async (connId: string) => {
    setSyncingId(connId);
    const { error } = await supabase.functions.invoke("cbs-pull-connector", {
      body: { connection_id: connId },
    });
    setSyncingId(null);
    if (error) {
      toast({ title: "Sync failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Pull triggered", description: "Check the sync status shortly." });
    if (institutionId) loadConnections(institutionId);
  };

  const fileDropNote =
    "Bank exports CBS transactions to a RegCo-owned drop (CSV/SFTP). No CBS code changes, no secret in the bank.";
  const pullNote =
    "Bank grants RegCo read-only access to an existing feed. RegCo holds the credential in Vault and ingests on a schedule.";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CBS Connectors</h1>
        <p className="text-muted-foreground mt-1">
          Connect your core banking system to RegCo. Pull is the recommended path — the bank writes no crypto and holds no secret.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={`cursor-pointer border-2 transition-colors ${mode === "pull" ? "border-primary" : "border-border"}`}
          onClick={() => setMode("pull")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-4 w-4" /> Pull (recommended)
              </CardTitle>
              {mode === "pull" && <Badge>Default</Badge>}
            </div>
            <CardDescription className="text-xs leading-relaxed">{pullNote}</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer border-2 transition-colors ${mode === "file_drop" ? "border-primary" : "border-border"}`}
          onClick={() => setMode("file_drop")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileDown className="h-4 w-4" /> File drop (fallback)
              </CardTitle>
              {mode === "file_drop" && <Badge variant="secondary">Fallback</Badge>}
            </div>
            <CardDescription className="text-xs leading-relaxed">{fileDropNote}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {mode === "file_drop" ? "Add file-drop export" : "Add pull connection"}
          </CardTitle>
          <CardDescription>
            {mode === "file_drop"
              ? "Register the bank's scheduled CSV export drop location."
              : "Register a bank-provisioned read-only feed for RegCo to pull from."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Connection name</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Main CBS read-replica"
                required
              />
            </div>

            {mode === "pull" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="feedType">Feed type</Label>
                  <select
                    id="feedType"
                    value={feedType}
                    onChange={(e) => setFeedType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    {FEED_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule (cron)</Label>
                  <Input
                    id="schedule"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="0 2 * * *"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="endpoint">
                {mode === "file_drop" ? "Drop location / SFTP path" : "Endpoint or connection string"}
              </Label>
              <Input
                id="endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder={mode === "file_drop" ? "sftp://drop.regco.app/bank-cbs" : "postgres://readonly@…"}
              />
              <p className="text-xs text-muted-foreground">
                {mode === "pull"
                  ? "Non-secret host/endpoint. Credentials are stored encrypted in RegCo Vault out-of-band."
                  : "RegCo generates and owns the drop bucket; the bank only needs write access to it."}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Secrets are Vault-encrypted and fail-closed; the bank never custodies a RegCo secret.
            </div>

            <Button type="submit" disabled={saving || !institutionId}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "file_drop" ? "Add file-drop" : "Add pull connection"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connections</CardTitle>
          <CardDescription>Registered feeds and their last pull status.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : connections.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No connections yet. Add one above to start ingesting transactions.
            </p>
          ) : (
            <div className="divide-y">
              {connections.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{c.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {FEED_TYPES.find((t) => t.value === c.feed_type)?.label || c.feed_type}
                      {c.endpoint ? ` · ${c.endpoint}` : ""} · {c.schedule}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.last_synced_at
                        ? `Last sync ${new Date(c.last_synced_at).toLocaleString()}${c.last_status ? ` · ${c.last_status}` : ""}`
                        : "Never synced"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={syncingId === c.id}
                    onClick={() => runSync(c.id)}
                  >
                    {syncingId === c.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Sync now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CbsConnectors;
