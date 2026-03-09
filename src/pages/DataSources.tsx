import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";
import { Upload, FileSpreadsheet, Eye, Download, Trash2 } from "lucide-react";

interface DataSource {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  status: string;
  created_at: string;
}

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const DataSources = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<string[][] | null>(null);
  const [previewName, setPreviewName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("data_sources").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setSources(data); setLoading(false); });
  }, [user]);

  const handleUpload = async (file: File) => {
    if (!user) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "csv", "xls"].includes(ext || "")) {
      toast({ title: "Unsupported file", description: "Please upload .xlsx or .csv files only.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 50MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const path = `${user.id}/${Date.now()}-${file.name}`;

    try {
      const { error: uploadErr } = await supabase.storage.from("data-sources").upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data, error: dbErr } = await supabase.from("data_sources").insert({
        user_id: user.id,
        file_name: file.name,
        file_path: path,
        file_size: file.size,
        status: "Ready",
      }).select().single();

      if (dbErr) throw dbErr;
      if (data) setSources((prev) => [data, ...prev]);

      toast({ title: "File uploaded", description: `${file.name} has been uploaded successfully.` });
    } catch {
      toast({ title: "Upload failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handlePreview = async (source: DataSource) => {
    if (!source.file_path) return;
    // For CSV, we can download and parse first 10 rows
    const { data } = await supabase.storage.from("data-sources").createSignedUrl(source.file_path, 300);
    if (!data?.signedUrl) return;

    try {
      const res = await fetch(data.signedUrl);
      const text = await res.text();
      const rows = text.split("\n").slice(0, 11).map((r) => r.split(",").map((c) => c.trim().replace(/^"|"$/g, "")));
      setPreviewData(rows);
      setPreviewName(source.file_name);
    } catch {
      toast({ title: "Preview unavailable", description: "We couldn't preview this file. Try downloading it instead." });
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    await supabase.storage.from("data-sources").remove([filePath]);
    await supabase.from("data_sources").delete().eq("id", id);
    setSources((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "File deleted" });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const statusColor = (s: string) => {
    if (s === "Ready") return "bg-success/10 text-success border-success/20";
    if (s === "Processing") return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <BackButton to="/dashboard" />

      {/* Upload Area */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-border"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx,.csv,.xls" onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground mb-1">
              {uploading ? "Uploading..." : "Upload from Core Banking Export"}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Drag & drop or click to upload. Supported: .xlsx, .csv (max 50MB)
            </p>
            <p className="text-xs text-muted-foreground">
              Supported systems: Flexcube, Finacle, T24, Rubies, Bankone, and all Excel/CSV exports
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          {sources.length === 0 ? (
            <div className="text-center py-12">
              <FileSpreadsheet className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No files uploaded yet</h3>
              <p className="text-sm text-muted-foreground">Upload your core banking data to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.file_name}</TableCell>
                      <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{formatSize(s.file_size)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(s.status)}`}>
                          {s.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          {s.file_name.endsWith(".csv") && (
                            <Button size="sm" variant="ghost" onClick={() => handlePreview(s)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(s.id, s.file_path)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={!!previewData} onOpenChange={() => setPreviewData(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Preview — {previewName}</DialogTitle>
          </DialogHeader>
          {previewData && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {previewData[0]?.map((h, i) => <TableHead key={i}>{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(1).map((row, ri) => (
                    <TableRow key={ri}>
                      {row.map((cell, ci) => <TableCell key={ci}>{cell}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataSources;
