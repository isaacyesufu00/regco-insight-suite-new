import { motion } from 'framer-motion';
import { X, FileText, Download } from 'lucide-react';
import type { RightPanelItem } from '@/types/agent';

const TABS = ['sources', 'outputs', 'reports', 'uploads'] as const;

export const AgentRightPanel = ({
  activeTab, items, onTabChange, onClose,
}: {
  activeTab: string;
  items: RightPanelItem[];
  onTabChange: (t: any) => void;
  onClose: () => void;
}) => {
  const filtered = items.filter(i => {
    if (activeTab === 'sources') return i.type === 'source';
    if (activeTab === 'outputs') return i.type === 'output';
    if (activeTab === 'reports') return i.type === 'report';
    if (activeTab === 'uploads') return i.type === 'upload';
    return false;
  });

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: '300px', flexShrink: 0,
        height: '100vh', display: 'flex', flexDirection: 'column',
        background: '#FFFFFF', borderLeft: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 14px 0' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#0A0A0A', margin: 0 }}>Context</p>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.4)', padding: '4px', display: 'flex' }}>
          <X size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '8px 10px 0', gap: '2px' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => onTabChange(tab)} style={{
            flex: 1, padding: '6px 4px', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: '11px', fontWeight: activeTab === tab ? '600' : '400',
            color: activeTab === tab ? '#0A0A0A' : 'rgba(0,0,0,0.45)',
            borderBottom: activeTab === tab ? '2px solid #0A0A0A' : '2px solid transparent',
            textTransform: 'capitalize', fontFamily: 'inherit', marginBottom: '-1px',
            transition: 'color 0.15s',
          }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.35)', margin: 0, lineHeight: 1.65 }}>
              {activeTab === 'outputs' && 'Agent responses and generated content will appear here.'}
              {activeTab === 'reports' && 'Generated regulatory returns will appear here.'}
              {activeTab === 'sources' && 'Data retrieved during your session will appear here.'}
              {activeTab === 'uploads' && 'Uploaded files will appear here.'}
            </p>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} style={{ background: '#F7F7F5', borderRadius: '8px', padding: '12px', marginBottom: '8px', border: '1px solid rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                <FileText size={13} color="rgba(0,0,0,0.4)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#0A0A0A', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                  {item.subtitle && <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', margin: 0 }}>{item.subtitle}</p>}
                </div>
              </div>
              {item.content && item.content.length < 400 && (
                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.55)', margin: '0 0 8px', lineHeight: 1.55 }}>
                  {item.content.slice(0, 200)}{item.content.length > 200 ? '…' : ''}
                </p>
              )}
              {(item.type === 'report' || item.type === 'output') && (
                <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(0,0,0,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                  <Download size={11} /> Download
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </motion.aside>
  );
};
