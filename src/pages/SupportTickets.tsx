import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  created_at: string;
}

const statusColor: Record<string, string> = {
  Open: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-300",
  Resolved: "bg-green-100 text-green-800 border-green-300",
};

export default function SupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("support_tickets")
      .select("id, subject, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTickets(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Support Tickets</h1>
        <p className="text-muted-foreground text-sm mt-1">View the status of your support requests.</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-muted-foreground">No support tickets yet.</p>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id.slice(0, 8)}</TableCell>
                  <TableCell>{t.subject}</TableCell>
                  <TableCell>{format(new Date(t.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor[t.status] || ""}>
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
