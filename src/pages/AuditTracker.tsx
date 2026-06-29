import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Plus, X, AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type View = 'dashboard' | 'list' | 'add';

interface Issue {
  id: string;
  issue_ref: string | null;
  source: string;
  category: string | null;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  owner_name: string | null;
  owner_email: string | null;
  due_date: string | null;
  closed_date: string | null;
  remediation_plan: string | null;
  evidence_notes: string | null;
  examination_date: string | null;
  regulator: string | null;
  created_at: string;
  updated_at: string;
}

const SOURCES = ['CBN Examination', 'Internal Audit', 'NDIC', 'SCUML', 'Self-Assessment'];
const CATEGORIES = ['AML/CFT', 'KYC', 'Governance', 'Capital/Liquidity', 'Consumer Protection', 'Data Protection', 'Other'];
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['open', 'in_progress', 'overdue', 'closed'];

const sevColor = (s: string) => {
  const k = s.toLowerCase();
  if (k === 'critical') return { bg: '#FEE2E2', fg: '#991B1B' };
  if (k === 'high') return { bg: '#FED7AA', fg: '#9A3412' };
  if (k === 'medium') return { bg: '#FEF3C7', fg: '#92400E' };
  return { bg: '#E0E7FF', fg: '#3730A3' };
};

const statusColor = (s: string) => {
  if (s === 'closed') return { bg: '#D1FAE5', fg: '#065F46' };
  if (s === 'overdue') return { bg: '#FEE2E2', fg: '#991B1B' };
  if (s === 'in_progress') return { bg: '#DBEAFE', fg: '#1E40AF' };
  return { bg: '#F5F5F0', fg: '#525252' };
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function AuditTracker() {
  const { user } = useAuth();
  const [view, setView] = useState<View>('dashboard');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Issue | null>(null);

  useEffect(() => { if (user) initLoad(); }, [user?.id]);

  const initLoad = async () => {
    if (!user) return;
    // Auto-update overdue
    const today = new Date().toISOString().slice(0, 10);
    await supabase.from('audit_issues')
      .update({ status: 'overdue', updated_at: new Date().toISOString() })
      .eq('user_id', user.id).eq('status', 'open').lt('due_date', today);
    await load();
  };

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await (supabase as any)
      .from('audit_issues')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setIssues((data as unknown as Issue[]) || []);
    setLoading(false);
  };

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      open: issues.filter((i) => i.status === 'open').length,
      overdue: issues.filter((i) => i.status === 'overdue').length,
      inProgress: issues.filter((i) => i.status === 'in_progress').length,
      closedThisMonth: issues.filter((i) => i.status === 'closed' && i.closed_date && new Date(i.closed_date) >= monthStart).length,
    };
  }, [issues]);

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0A0A0A', margin: 0, letterSpacing: '-0.5px' }}>
            Audit Issue Tracker
          </h1>
          <p style={{ fontSize: 13, color: '#6B6B6B', margin: '6px 0 0' }}>
            Track every examination finding, assign owners, and close with evidence.
          </p>
        </div>
        {view !== 'add' && (
          <button
            onClick={() => setView('add')}
            style={{
              padding: '10px 18px', borderRadius: 8, background: '#0A0A0A', color: '#FFFFFF',
              border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <Plus size={14} /> Add Issue
          </button>
        )}
      </div>

      {view !== 'add' && (
        <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: '#EFEFEA', borderRadius: 10, marginBottom: 22 }}>
          {[
            { id: 'dashboard' as const, label: 'Dashboard' },
            { id: 'list' as const, label: 'Issues List' },
          ].map((t) => {
            const active = view === t.id;
            return (
              <button key={t.id} onClick={() => setView(t.id)}
                style={{
                  padding: '8px 18px', borderRadius: 7, border: 'none', fontSize: 13,
                  fontWeight: active ? 600 : 500, color: active ? '#0A0A0A' : '#6B6B6B',
                  background: active ? '#FFFFFF' : 'transparent',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.10)' : 'none', cursor: 'pointer',
                }}>{t.label}</button>
            );
          })}
        </div>
      )}

      {view === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Open Issues', value: stats.open, accent: stats.open > 0 ? '#DC2626' : '#0A0A0A', icon: AlertTriangle },
            { label: 'Overdue', value: stats.overdue, accent: stats.overdue > 0 ? '#991B1B' : '#0A0A0A', icon: Clock },
            { label: 'In Progress', value: stats.inProgress, accent: '#0A0A0A', icon: Loader2 },
            { label: 'Closed This Month', value: stats.closedThisMonth, accent: '#16A34A', icon: CheckCircle2 },
          ].map((s) => (
            <div key={s.label} style={{
              background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)',
              padding: 22,
            }}>
              <s.icon size={18} color={s.accent} />
              <p style={{ fontSize: 34, fontWeight: 800, color: s.accent, margin: '12px 0 4px', letterSpacing: '-1px' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#6B6B6B', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'list' && (
        <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center' }}><Loader2 size={20} className="animate-spin" /></div>
          ) : issues.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <ClipboardCheck size={28} color="#9B9B9B" style={{ marginBottom: 10 }} />
              <p style={{ fontSize: 14, color: '#6B6B6B', margin: 0 }}>No audit issues logged yet.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#FAFAF7', textAlign: 'left' }}>
                  {['Ref', 'Source', 'Category', 'Title', 'Severity', 'Owner', 'Due', 'Status', ''].map((h) => (
                    <th key={h} style={{ padding: '12px 14px', fontSize: 11, fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issues.map((i) => {
                  const sc = sevColor(i.severity);
                  const stc = statusColor(i.status);
                  return (
                    <tr key={i.id} style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <td style={{ padding: '14px', fontFamily: 'ui-monospace, monospace', fontSize: 11.5, color: '#525252' }}>{i.issue_ref || '—'}</td>
                      <td style={{ padding: '14px', color: '#525252' }}>{i.source}</td>
                      <td style={{ padding: '14px', color: '#525252' }}>{i.category || '—'}</td>
                      <td style={{ padding: '14px', color: '#0A0A0A', fontWeight: 600, maxWidth: 280 }}>{i.title}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: sc.bg, color: sc.fg }}>{i.severity}</span>
                      </td>
                      <td style={{ padding: '14px', color: '#525252' }}>{i.owner_name || '—'}</td>
                      <td style={{ padding: '14px', color: '#525252' }}>{fmtDate(i.due_date)}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: stc.bg, color: stc.fg, textTransform: 'capitalize' }}>
                          {i.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <button onClick={() => setSelected(i)} style={{
                          background: 'none', border: 'none', color: '#0A0A0A', fontSize: 12,
                          fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
                        }}>View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {view === 'add' && <AddForm onCancel={() => setView('list')} onSaved={async () => { await load(); setView('list'); }} userId={user!.id} />}

      <AnimatePresence>
        {selected && <DetailModal issue={selected} onClose={() => setSelected(null)} onUpdate={async () => { await load(); setSelected(null); }} />}
      </AnimatePresence>
    </div>
  );
}

function AddForm({ onCancel, onSaved, userId }: { onCancel: () => void; onSaved: () => void; userId: string }) {
  const [form, setForm] = useState({
    issue_ref: '', source: 'CBN Examination', category: 'AML/CFT', title: '', description: '',
    severity: 'Medium', owner_name: '', owner_email: '', due_date: '', examination_date: '', remediation_plan: '',
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.title.trim() || !form.source) { toast.error('Title and source are required'); return; }
    setSaving(true);
    const { error } = await (supabase as any).from('audit_issues').insert({
      user_id: userId,
      issue_ref: form.issue_ref || null,
      source: form.source, category: form.category, title: form.title.trim(),
      description: form.description || null, severity: form.severity.toLowerCase(),
      owner_name: form.owner_name || null, owner_email: form.owner_email || null,
      due_date: form.due_date || null, examination_date: form.examination_date || null,
      remediation_plan: form.remediation_plan || null, status: 'open',
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Audit issue added');
    onSaved();
  };

  const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 };
  const input: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', fontSize: 13.5, fontFamily: 'inherit' };

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', padding: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label style={label}>Issue Ref</label><input style={input} value={form.issue_ref} onChange={(e) => setForm({ ...form, issue_ref: e.target.value })} placeholder="e.g. CBN-2026-018" /></div>
        <div><label style={label}>Source *</label>
          <select style={input} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
            {SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select></div>
        <div><label style={label}>Category</label>
          <select style={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((s) => <option key={s}>{s}</option>)}
          </select></div>
        <div><label style={label}>Severity</label>
          <select style={input} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
            {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
          </select></div>
        <div style={{ gridColumn: 'span 2' }}><label style={label}>Title *</label><input style={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div style={{ gridColumn: 'span 2' }}><label style={label}>Description</label><textarea style={{ ...input, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div><label style={label}>Owner Name</label><input style={input} value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} /></div>
        <div><label style={label}>Owner Email</label><input type="email" style={input} value={form.owner_email} onChange={(e) => setForm({ ...form, owner_email: e.target.value })} /></div>
        <div><label style={label}>Due Date</label><input type="date" style={input} value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
        <div><label style={label}>Examination Date</label><input type="date" style={input} value={form.examination_date} onChange={(e) => setForm({ ...form, examination_date: e.target.value })} /></div>
        <div style={{ gridColumn: 'span 2' }}><label style={label}>Remediation Plan</label><textarea style={{ ...input, minHeight: 80, resize: 'vertical' }} value={form.remediation_plan} onChange={(e) => setForm({ ...form, remediation_plan: e.target.value })} /></div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ padding: '10px 18px', borderRadius: 8, background: '#FFFFFF', color: '#0A0A0A', border: '1px solid rgba(0,0,0,0.12)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button onClick={submit} disabled={saving} style={{ padding: '10px 22px', borderRadius: 8, background: '#0A0A0A', color: '#FFFFFF', border: 'none', fontSize: 13, fontWeight: 600, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : 'Save Issue'}
        </button>
      </div>
    </div>
  );
}

function DetailModal({ issue, onClose, onUpdate }: { issue: Issue; onClose: () => void; onUpdate: () => void }) {
  const [evidence, setEvidence] = useState(issue.evidence_notes || '');
  const [saving, setSaving] = useState(false);

  const setStatus = async (status: string) => {
    setSaving(true);
    const patch: any = { status, updated_at: new Date().toISOString() };
    if (status === 'closed') patch.closed_date = new Date().toISOString().slice(0, 10);
    if (evidence !== issue.evidence_notes) patch.evidence_notes = evidence;
    const { error } = await supabase.from('audit_issues').update(patch).eq('id', issue.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Status updated to ${status.replace('_', ' ')}`);
    onUpdate();
  };

  const saveEvidence = async () => {
    setSaving(true);
    const { error } = await supabase.from('audit_issues').update({ evidence_notes: evidence, updated_at: new Date().toISOString() }).eq('id', issue.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Evidence saved');
  };

  const sc = sevColor(issue.severity);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100,
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 680, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}
      >
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: sc.bg, color: sc.fg }}>{issue.severity}</span>
              <span style={{ fontSize: 11.5, color: '#9B9B9B', fontFamily: 'ui-monospace, monospace' }}>{issue.issue_ref || 'No ref'}</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>{issue.title}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
            <Field label="Source" value={issue.source} />
            <Field label="Category" value={issue.category} />
            <Field label="Owner" value={issue.owner_name} />
            <Field label="Owner Email" value={issue.owner_email} />
            <Field label="Due Date" value={fmtDate(issue.due_date)} />
            <Field label="Examination Date" value={fmtDate(issue.examination_date)} />
          </div>
          {issue.description && <div style={{ marginBottom: 18 }}><Field label="Description" value={issue.description} /></div>}
          {issue.remediation_plan && <div style={{ marginBottom: 18 }}><Field label="Remediation Plan" value={issue.remediation_plan} /></div>}

          <label style={{ fontSize: 11, fontWeight: 700, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
            Evidence Notes
          </label>
          <textarea
            value={evidence} onChange={(e) => setEvidence(e.target.value)}
            placeholder="Document the evidence supporting closure of this issue..."
            style={{ width: '100%', minHeight: 90, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', fontSize: 13.5, fontFamily: 'inherit', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            <button onClick={saveEvidence} disabled={saving} style={{ padding: '8px 14px', borderRadius: 8, background: '#F5F5F0', color: '#0A0A0A', border: '1px solid rgba(0,0,0,0.08)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Save Evidence</button>
            {STATUSES.filter((s) => s !== issue.status).map((s) => (
              <button key={s} onClick={() => setStatus(s)} disabled={saving} style={{
                padding: '8px 14px', borderRadius: 8,
                background: s === 'closed' ? '#0A0A0A' : '#FFFFFF',
                color: s === 'closed' ? '#FFFFFF' : '#0A0A0A',
                border: '1px solid rgba(0,0,0,0.12)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              }}>Mark {s.replace('_', ' ')}</button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p style={{ fontSize: 10.5, fontWeight: 700, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: 13.5, color: '#0A0A0A', margin: 0, lineHeight: 1.55 }}>{value || '—'}</p>
    </div>
  );
}
