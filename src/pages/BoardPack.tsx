import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Loader2, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BoardPackRow {
  id: string;
  month: string;
  status: string;
  generated_at: string | null;
  created_at: string;
  storage_path: string | null;
  metrics: any;
}

const currentMonth = () => new Date().toISOString().slice(0, 7);

const monthLabel = (m: string) => {
  try { return new Date(`${m}-01T00:00:00Z`).toLocaleString('en-NG', { month: 'long', year: 'numeric', timeZone: 'UTC' }); }
  catch { return m; }
};

export default function BoardPack() {
  const { user, session } = useAuth();
  const [month, setMonth] = useState(currentMonth());
  const [generating, setGenerating] = useState(false);
  const [packs, setPacks] = useState<BoardPackRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('compliance_reports')
      .select('id,month,status,generated_at,created_at,storage_path,metrics')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(24);
    setPacks((data as BoardPackRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const generate = async () => {
    if (!session?.access_token) { toast.error('Please sign in again'); return; }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-board-pack', {
        body: { month },
      });
      if (error) throw error;
      toast.success(`Board pack ready for ${monthLabel(month)}`);
      if (data?.download_url) {
        const a = document.createElement('a');
        a.href = data.download_url;
        a.download = `BoardPack_${month}.txt`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }
      await load();
    } catch (e: any) {
      toast.error(e.message || 'Unable to generate board pack');
    } finally {
      setGenerating(false);
    }
  };

  const downloadPack = async (p: BoardPackRow) => {
    if (!p.storage_path) { toast.error('File not available'); return; }
    const { data, error } = await supabase.storage.from('reports').createSignedUrl(p.storage_path, 60 * 60);
    if (error || !data?.signedUrl) { toast.error('Unable to fetch download link'); return; }
    const a = document.createElement('a');
    a.href = data.signedUrl;
    a.download = `BoardPack_${p.month}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0A0A0A', margin: 0, letterSpacing: '-0.5px' }}>
          Compliance Board Pack
        </h1>
        <p style={{ fontSize: 13, color: '#6B6B6B', margin: '6px 0 0' }}>
          Generate your monthly compliance committee report in seconds — RegCo compiles everything automatically.
        </p>
      </div>

      <div style={{
        background: '#FFFFFF', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)',
        padding: 28, marginBottom: 28,
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
              Reporting Month
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{
                padding: '11px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)',
                fontSize: 14, color: '#0A0A0A', minWidth: 200, fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            onClick={generate}
            disabled={generating}
            style={{
              padding: '12px 22px', borderRadius: 8, background: '#0A0A0A', color: '#FFFFFF',
              border: 'none', fontSize: 13.5, fontWeight: 600, cursor: generating ? 'wait' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8, opacity: generating ? 0.7 : 1,
            }}
          >
            {generating ? <Loader2 size={15} className="animate-spin" /> : <FileCheck size={15} />}
            {generating ? 'Generating...' : 'Generate Board Pack'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: '#9B9B9B', margin: '14px 0 0' }}>
          The board pack compiles regulatory returns, AML/CFT activity, customer due diligence, sanctions screening,
          and monthly task completion for the chosen month.
        </p>
      </div>

      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Past Board Packs
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9B9B9B' }}>
          <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 8px' }} />
        </div>
      ) : packs.length === 0 ? (
        <div style={{
          background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)',
          padding: 40, textAlign: 'center',
        }}>
          <FileText size={28} color="#9B9B9B" style={{ marginBottom: 10 }} />
          <p style={{ fontSize: 14, color: '#6B6B6B', margin: 0 }}>No board packs generated yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {packs.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)',
                padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: '#F5F5F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <FileCheck size={17} color="#0A0A0A" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>
                    Board Pack — {monthLabel(p.month)}
                  </p>
                  <p style={{ fontSize: 12, color: '#9B9B9B', margin: '2px 0 0' }}>
                    {p.status === 'ready'
                      ? `Generated ${new Date(p.generated_at || p.created_at).toLocaleString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                      : p.status}
                  </p>
                </div>
              </div>
              <button
                onClick={() => downloadPack(p)}
                disabled={p.status !== 'ready' || !p.storage_path}
                style={{
                  padding: '8px 14px', borderRadius: 8, background: p.status === 'ready' ? '#F5F5F0' : '#FAFAFA',
                  color: p.status === 'ready' ? '#0A0A0A' : '#9B9B9B', border: '1px solid rgba(0,0,0,0.08)',
                  fontSize: 12.5, fontWeight: 600, cursor: p.status === 'ready' ? 'pointer' : 'not-allowed',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <Download size={13} />
                Download
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
