import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ExternalLink, Loader2, Inbox, Check, FileText, ListChecks, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  description: string | null;
  url: string;
  published_at: string | null;
  source: string | null;
  category: string | null;
  image_url: string | null;
}

interface TaskRow {
  id: string;
  category: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
}

const defaultTasks = [
  { category: 'Regulatory Returns', title: 'File CBN MFB Regulatory Return', description: 'Monthly balance sheet, deposits, loans, and CAR submission to CBN. Due by 15th of following month.', priority: 'high' },
  { category: 'Regulatory Returns', title: 'File PAYE Remittance — FIRS', description: 'Employee income tax deducted this month must be remitted to FIRS by the 10th.', priority: 'high' },
  { category: 'Regulatory Returns', title: 'File VAT Return — FIRS', description: 'Monthly VAT collected on services, offset against input VAT, remitted to FIRS.', priority: 'high' },
  { category: 'Regulatory Returns', title: 'File Withholding Tax Return — FIRS', description: 'WHT deducted on vendor/contractor payments this month remitted to FIRS.', priority: 'high' },
  { category: 'AML Monitoring', title: 'Review flagged transactions from Transaction Monitor', description: 'Clear, escalate, or file STRs for all pending AML flags from this month.', priority: 'high' },
  { category: 'AML Monitoring', title: 'Run sanctions screening on new customers onboarded this month', description: 'Screen all new customer names against sanctions and PEP lists in the Screening module.', priority: 'high' },
  { category: 'KYC Compliance', title: 'Review KYC incomplete customer list', description: 'Check Customer 360 → KYC Overview for customers with missing documents. Follow up on incomplete files.', priority: 'medium' },
  { category: 'Regulatory Monitoring', title: 'Check for new CBN circulars and regulatory updates', description: 'Review Regulatory Intelligence feed for new CBN/NDIC/NFIU circulars. Note any that require policy or process changes.', priority: 'medium' },
  { category: 'Reporting', title: 'Prepare monthly compliance committee report', description: 'Compile key metrics: reports filed, AML flags raised, STRs filed, KYC completion rate, new customers screened.', priority: 'medium' },
  { category: 'Controls Testing', title: 'Sample review of AML alert dispositions', description: 'Select 10 random alerts cleared this month and verify they were correctly dispositioned with proper documentation.', priority: 'medium' },
  { category: 'Data Preparation', title: 'Export transaction data from CBS for AML batch analysis', description: "Upload this month's transactions to Transaction Monitor for full AML analysis across all channels.", priority: 'medium' },
  { category: 'Audit', title: 'Review open audit findings and update status', description: 'Check all open issues from last internal or CBN examination. Update remediation status for any completed items.', priority: 'low' },
];


const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';

const CHANGE_KEYWORDS = ['filing requirement', 'reporting deadline', 'new guideline', 'circular', 'effective date', 'must comply', 'mandatory filing', 'compliance deadline', 'new requirement', 'amended'];
const REGULATORS = ['cbn', 'ndic', 'nfiu', 'firs', 'scuml'];
const isRegulatoryChange = (a: Article) => {
  const t = `${a.title || ''} ${a.description || ''}`.toLowerCase();
  return CHANGE_KEYWORDS.some((k) => t.includes(k)) && REGULATORS.some((r) => t.includes(r));
};

export default function RegulatoryIntelligence() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'circulars' | 'tasks'>('news');
  const [filter, setFilter] = useState('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNews();
    if (user) fetchReadStatus();
  }, [user]);

  const fetchNews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('regulatory_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(50);
    setArticles((data as Article[]) || []);
    setLoading(false);
  };

  const fetchReadStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('news_read_status')
      .select('news_id')
      .eq('user_id', user.id);
    setReadIds(new Set((data || []).map((r: any) => r.news_id)));
  };

  const markAsRead = async (newsId: string) => {
    if (!user || readIds.has(newsId)) return;
    setReadIds((prev) => new Set([...prev, newsId]));
    await supabase.from('news_read_status').upsert({ user_id: user.id, news_id: newsId });
  };

  const refreshNews = async () => {
    setRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke('fetch-regulatory-news', { body: {} });
      if (error) throw error;
      toast.success('News feed refreshed');
      await fetchNews();
    } catch (e) {
      console.error('Failed to refresh news feed:', e);
      toast.error('Unable to refresh news feed');
    } finally {
      setRefreshing(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'cbn', label: 'CBN' },
    { id: 'regulation', label: 'Regulation' },
    { id: 'banking', label: 'Banking' },
    { id: 'industry-banking', label: 'Industry' },
  ];

  const filtered = filter === 'all' ? articles : articles.filter((a) => a.category === filter);
  const unreadCount = articles.filter((a) => !readIds.has(a.id)).length;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0A0A0A', margin: 0, letterSpacing: '-0.5px' }}>
            Regulatory Intelligence
          </h1>
          <p style={{ fontSize: 13, color: '#6B6B6B', margin: '6px 0 0' }}>
            Live CBN, NDIC, NFIU news and regulatory updates — refreshed every 3 hours.
          </p>
        </div>
        <button
          onClick={refreshNews}
          disabled={refreshing}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 8,
            background: '#0A0A0A', color: '#FFFFFF', border: 'none', fontSize: 13, fontWeight: 600,
            cursor: refreshing ? 'wait' : 'pointer', opacity: refreshing ? 0.7 : 1,
          }}
        >
          {refreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: '#EFEFEA', borderRadius: 10, marginBottom: 22 }}>
        {[
          { id: 'news' as const, label: 'News Feed', badge: unreadCount > 0 ? unreadCount : null },
          { id: 'circulars' as const, label: 'CBN Circulars', badge: null },
          { id: 'tasks' as const, label: 'Monthly Tasks', badge: null },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 18px', borderRadius: 7, border: 'none', fontSize: 13,
                fontWeight: active ? 600 : 500,
                color: active ? '#0A0A0A' : '#6B6B6B',
                background: active ? '#FFFFFF' : 'transparent',
                boxShadow: active ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {tab.label}
              {tab.badge && (
                <span style={{ background: '#0A0A0A', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999 }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === 'news' && (
        <div>
          {/* Category chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const active = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  style={{
                    padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(0,0,0,0.1)',
                    background: active ? '#0A0A0A' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#525252',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#9B9B9B' }}>
              <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: 13, margin: 0 }}>Loading regulatory news...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(0,0,0,0.07)' }}>
              <Inbox size={28} style={{ color: '#9B9B9B', margin: '0 auto 10px' }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', margin: '0 0 4px' }}>No news yet</p>
              <button onClick={refreshNews} style={{ background: 'none', border: 'none', color: '#0A0A0A', textDecoration: 'underline', fontSize: 13, cursor: 'pointer' }}>
                Fetch latest news →
              </button>
            </div>
          ) : (
            filtered.map((article) => {
              const isRead = readIds.has(article.id);
              const isChange = isRegulatoryChange(article);
              return (
                <div key={article.id}>
                  {isChange && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#FEF3C7', borderLeft: '3px solid #D97706',
                      borderRadius: 8, padding: '10px 14px', marginBottom: 6,
                    }}>
                      <AlertCircle size={14} color="#92400E" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#92400E' }}>
                        Regulatory change detected — review whether this affects your filings
                      </span>
                    </div>
                  )}
                  <motion.a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markAsRead(article.id)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex', gap: 16,
                      background: isRead ? '#FAFAFA' : '#FFFFFF',
                      borderRadius: 12,
                      border: `1px solid ${isRead ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.09)'}`,
                      padding: '18px 20px', marginBottom: 8,
                      textDecoration: 'none', color: 'inherit',
                      borderLeft: !isRead ? '3px solid #0A0A0A' : '3px solid transparent',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                        <h3 style={{ fontSize: 14.5, fontWeight: 600, color: '#0A0A0A', margin: 0, lineHeight: 1.4 }}>
                          {article.title}
                        </h3>
                        <ExternalLink size={14} style={{ color: '#9B9B9B', flexShrink: 0, marginTop: 2 }} />
                      </div>
                      {article.description && (
                        <p style={{ fontSize: 13, color: '#6B6B6B', margin: '0 0 10px', lineHeight: 1.5 }}>
                          {article.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#0A0A0A', background: '#F5F5F0', padding: '2px 8px', borderRadius: 4 }}>
                          {article.source}
                        </span>
                        <span style={{ fontSize: 11, color: '#9B9B9B' }}>{fmtDate(article.published_at)}</span>
                      </div>
                    </div>
                  </motion.a>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'circulars' && <CircularsTab />}
      {activeTab === 'tasks' && <MonthlyTasksTab />}
    </div>
  );
}

function CircularsTab() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('regulatory_news')
      .select('*')
      .eq('category', 'cbn_circular')
      .order('published_at', { ascending: false })
      .limit(100);
    setItems((data as Article[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sync = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke('fetch-cbn-circulars', { body: {} });
      if (error) throw error;
      toast.success('CBN circulars synced');
      await load();
    } catch (e) {
      console.error('Failed to sync CBN circulars:', e);
      toast.error('Unable to sync circulars');
    } finally {
      setSyncing(false);
    }
  };

  const parseRef = (title: string) => {
    const m = title.match(/^\[([^\]]+)\]\s*(.+)$/);
    return m ? { ref: m[1], clean: m[2] } : { ref: '', clean: title };
  };
  const parseAffects = (desc: string | null) => {
    if (!desc) return [];
    const m = desc.match(/Affects:\s*([^.]+)\./);
    return m ? m[1].split(',').map((s) => s.trim()) : [];
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: '#6B6B6B', margin: 0 }}>
          CBN circulars affecting your institution. Always verify with the official issuer.
        </p>
        <button onClick={sync} disabled={syncing}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, background: '#0A0A0A', color: '#FFFFFF', border: 'none', fontSize: 12, fontWeight: 600, cursor: syncing ? 'wait' : 'pointer', opacity: syncing ? 0.7 : 1 }}>
          {syncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          Sync Circulars
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9B9B9B' }}>
          <Loader2 size={18} className="animate-spin" style={{ margin: '0 auto' }} />
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(0,0,0,0.07)' }}>
          <FileText size={24} color="#9B9B9B" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: 13, color: '#6B6B6B', margin: 0 }}>No circulars yet. Click "Sync Circulars" to load.</p>
        </div>
      ) : items.map((c) => {
        const { ref, clean } = parseRef(c.title);
        const affects = parseAffects(c.description);
        return (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)',
            padding: '16px 20px', marginBottom: 8,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#FFFFFF', background: '#0A0A0A', padding: '2px 7px', borderRadius: 4 }}>CBN</span>
                {ref && <span style={{ fontSize: 11, color: '#9B9B9B', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{ref}</span>}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', margin: '0 0 8px', lineHeight: 1.35 }}>{clean}</h3>
              {affects.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: '#6B6B6B', alignSelf: 'center' }}>Affects:</span>
                  {affects.map((a) => (
                    <span key={a} style={{ fontSize: 10, background: '#F5F5F0', color: '#525252', padding: '2px 8px', borderRadius: 999, fontWeight: 500 }}>{a}</span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#9B9B9B' }}>Issued {fmtDate(c.published_at)}</span>
                <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#0A0A0A', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  View on CBN website <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MonthlyTasksTab() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('monthly_compliance_tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .order('priority_order', { ascending: true });

    if (!data || data.length === 0) {
      const rows = defaultTasks.map((t, i) => ({
        user_id: user.id,
        month: currentMonth,
        category: t.category,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: 'pending',
        priority_order: i,
        recurring: true,
      }));
      const { data: inserted } = await supabase.from('monthly_compliance_tasks').insert(rows).select();
      setTasks((inserted as TaskRow[]) || []);
    } else {
      setTasks(data as TaskRow[]);
    }
    setLoading(false);
  };

  const toggleTask = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'completed' ? 'pending' : 'completed';
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: next } : t)));
    await supabase
      .from('monthly_compliance_tasks')
      .update({ status: next, completed_at: next === 'completed' ? new Date().toISOString() : null })
      .eq('id', id);
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const categoryList = Array.from(new Set(tasks.map((t) => t.category)));

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: '#9B9B9B' }}>
        <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 10px' }} />
        <p style={{ fontSize: 13, margin: 0 }}>Loading monthly tasks…</p>
      </div>
    );
  }

  const priorityColor = (p: string) =>
    p === 'high' ? { bg: '#FEE2E2', fg: '#991B1B' } : p === 'medium' ? { bg: '#FEF3C7', fg: '#92400E' } : { bg: '#E0E7FF', fg: '#3730A3' };

  return (
    <div>
      {/* Progress header */}
      <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>
              {new Date().toLocaleString('en-NG', { month: 'long', year: 'numeric' })} — Monthly Compliance Tasks
            </h3>
            <p style={{ fontSize: 12, color: '#6B6B6B', margin: '4px 0 0' }}>
              {completedCount} of {tasks.length} completed
            </p>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.5px' }}>{pct}%</div>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: '#F0F0EB', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#0A0A0A', transition: 'width 0.3s' }} />
        </div>
      </div>

      {categoryList.map((cat) => {
        const list = tasks.filter((t) => t.category === cat);
        return (
          <div key={cat} style={{ marginBottom: 22 }}>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ListChecks size={12} /> {cat}
            </h4>
            {list.map((task) => {
              const done = task.status === 'completed';
              const pc = priorityColor(task.priority);
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id, task.status)}
                  style={{
                    display: 'flex', gap: 14, background: '#FFFFFF',
                    borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)',
                    padding: '14px 16px', marginBottom: 6, cursor: 'pointer',
                    opacity: done ? 0.6 : 1,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${done ? '#0A0A0A' : '#D4D4D0'}`,
                    background: done ? '#0A0A0A' : '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
                  }}>
                    {done && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                      <h5 style={{ fontSize: 13.5, fontWeight: 600, color: '#0A0A0A', margin: 0, textDecoration: done ? 'line-through' : 'none' }}>
                        {task.title}
                      </h5>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: pc.bg, color: pc.fg }}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    {task.description && (
                      <p style={{ fontSize: 12, color: '#6B6B6B', margin: 0, lineHeight: 1.5 }}>{task.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
