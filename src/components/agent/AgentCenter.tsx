import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, ArrowUp, ChevronDown, Database, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import type { AgentMessage } from '@/types/agent';
import { AgentReportModal } from './AgentReportModal';
import { supabase } from '@/integrations/supabase/client';

const QUICK_ACTIONS = [
  'Generate my CBN MFB Return',
  'Screen a customer',
  'Show pending AML flags',
  'Generate my VAT Return',
];

const SOURCE_CHIPS = [
  { label: 'CBN Circulars', dotColor: '#1B4332' },
  { label: 'My Reports', dotColor: '#1A3A6B' },
  { label: 'Sanctions Lists', dotColor: '#6B1A1A' },
  { label: 'Manage', dotColor: '#3A3A3A' },
];

interface AgentCenterProps {
  messages: AgentMessage[];
  inputValue: string;
  isLoading: boolean;
  institutionName: string;
  onInputChange: (v: string) => void;
  onSubmit: (msg: string) => void;
  onToggleRightPanel: () => void;
  reportModal: string | null;
  onDismissReportModal: () => void;
  onReportSubmit: (data: any) => void;
  profile: any;
}

export const AgentCenter = ({
  messages, inputValue, isLoading, institutionName,
  onInputChange, onSubmit, onToggleRightPanel,
  reportModal, onDismissReportModal, onReportSubmit, profile,
}: AgentCenterProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInConversation = messages.some(m => m.role === 'user');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`; }
  }, [inputValue]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      if (inputValue.trim()) onSubmit(inputValue.trim());
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', background: '#FFFFFF', overflow: 'hidden', position: 'relative' }}>

      {/* HOME STATE — when no conversation yet */}
      {!isInConversation && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '0 24px', overflowY: 'auto' }}>

          <div style={{ width: '100%', maxWidth: '680px', display: 'flex', justifyContent: 'flex-end', padding: '16px 0 0' }}>
            <button onClick={onToggleRightPanel} style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Context panel
            </button>
          </div>

          <div style={{ marginTop: '40px', marginBottom: '20px' }}>
            <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-2px', margin: 0, lineHeight: 1, textAlign: 'center' }}>
              {institutionName || 'RegCo'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {QUICK_ACTIONS.map(action => (
              <button key={action} onClick={() => { onInputChange(action); onSubmit(action); }} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '999px', padding: '7px 15px', fontSize: '13px', color: 'rgba(0,0,0,0.65)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.3)'; (e.currentTarget as HTMLElement).style.color = '#0A0A0A'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.12)'; (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.65)'; }}
              >
                {action}
              </button>
            ))}
          </div>

          <InputCard inputValue={inputValue} isLoading={isLoading} onInputChange={onInputChange} handleKey={handleKey} onSubmit={onSubmit} textareaRef={textareaRef} showDropdowns />

          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '680px' }}>
            {SOURCE_CHIPS.map(chip => (
              <button key={chip.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '999px', padding: '5px 12px', fontSize: '12px', color: 'rgba(0,0,0,0.55)', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)'}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: chip.dotColor, flexShrink: 0 }} />
                {chip.label} +
              </button>
            ))}
          </div>

          <div style={{ flex: 1, minHeight: '40px' }} />
        </div>
      )}

      {/* CONVERSATION STATE */}
      {isInConversation && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px 16px' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map(msg => (
              <AgentMessageBubble key={msg.id} msg={msg} profile={profile} onReportSubmit={onReportSubmit} onDismissReportModal={onDismissReportModal} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {/* INPUT pinned at bottom during conversation */}
      {isInConversation && (
        <div style={{ padding: '12px 24px 20px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <InputCard inputValue={inputValue} isLoading={isLoading} onInputChange={onInputChange} handleKey={handleKey} onSubmit={onSubmit} textareaRef={textareaRef} showDropdowns={false} />
          </div>
        </div>
      )}

      {/* Report modal */}
      <AnimatePresence>
        {reportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
            onClick={(e) => { if (e.target === e.currentTarget) onDismissReportModal(); }}
          >
            <motion.div initial={{ scale: 0.97, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97 }} style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
              <AgentReportModal
                reportType={reportModal}
                institutionName={profile?.company_name || ''}
                isGenerating={isLoading}
                onDismiss={onDismissReportModal}
                onSubmit={onReportSubmit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Message Bubble Component ─────────────────────────────────────────────
const AgentMessageBubble = ({ msg, profile, onReportSubmit, onDismissReportModal }: { msg: AgentMessage; profile: any; onReportSubmit: any; onDismissReportModal: any }) => {
  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ background: '#F0F0EE', borderRadius: '12px 12px 2px 12px', padding: '11px 15px', maxWidth: '75%' }}>
          <p style={{ fontSize: '14px', color: '#0A0A0A', margin: 0, lineHeight: 1.65, fontFamily: 'inherit' }}>{msg.content}</p>
        </div>
      </div>
    );
  }

  // Thinking state — dots animation
  if (msg.streaming && !msg.content && msg.thinkingLabel) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2].map(i => (
            <motion.div key={i} animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(0,0,0,0.45)' }} />
          ))}
        </div>
        <span style={{ fontSize: '13px', color: 'rgba(0,0,0,0.4)', fontFamily: 'inherit' }}>{msg.thinkingLabel}</span>
      </div>
    );
  }

  // Streaming or complete assistant message
  return (
    <div style={{ maxWidth: '85%' }}>
      <p style={{ fontSize: '14px', color: '#0A0A0A', margin: '0 0 12px', lineHeight: 1.75, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
        {msg.content}
        {msg.streaming && msg.content && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ display: 'inline-block', width: '2px', height: '14px', background: '#0A0A0A', marginLeft: '2px', verticalAlign: 'text-bottom' }} />}
      </p>

      {/* Download action for completed reports */}
      {msg.actionType?.startsWith('download:') && (
        <button
          onClick={async () => {
            const reportId = msg.actionType!.replace('download:', '');
            const { data } = await supabase.from('reports').select('content, report_type').eq('id', reportId).single();
            if (data?.content) {
              const blob = new Blob([data.content], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `RegCo_${data.report_type}_${new Date().toISOString().slice(0, 10)}.txt`;
              document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            }
          }}
          style={{ fontSize: '13px', fontWeight: '500', color: '#0A0A0A', background: '#F0F0EE', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          Download report
        </button>
      )}
    </div>
  );
};

// ─── Input Card (reused in home state and conversation state) ─────────────
const InputCard = ({ inputValue, isLoading, onInputChange, handleKey, onSubmit, textareaRef, showDropdowns }: any) => (
  <div style={{ background: '#F7F7F5', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '12px', overflow: 'hidden', width: '100%', maxWidth: showDropdowns ? '680px' : undefined }}>
    {showDropdowns && (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px 0' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', fontSize: '12px', color: 'rgba(0,0,0,0.45)', cursor: 'pointer', fontFamily: 'inherit' }}>
          Regulator <ChevronDown size={11} />
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', fontSize: '12px', color: 'rgba(0,0,0,0.45)', cursor: 'pointer', fontFamily: 'inherit' }}>
          Prompts <ChevronDown size={11} />
        </button>
      </div>
    )}
    <textarea
      ref={textareaRef}
      value={inputValue}
      onChange={e => onInputChange(e.target.value)}
      onKeyDown={handleKey}
      placeholder="Ask RegCo Agent anything. Type @ to attach a CBS file or document."
      disabled={isLoading}
      rows={showDropdowns ? 3 : 2}
      style={{ width: '100%', padding: showDropdowns ? '10px 16px 8px' : '12px 16px 8px', background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#0A0A0A', fontFamily: 'inherit', resize: 'none', lineHeight: 1.6, boxSizing: 'border-box', display: 'block' }}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px 10px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'rgba(0,0,0,0.4)', padding: '5px 8px', borderRadius: '5px', fontFamily: 'inherit' }}>
          <Paperclip size={13} /> Files
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'rgba(0,0,0,0.4)', padding: '5px 8px', borderRadius: '5px', fontFamily: 'inherit' }}>
          <Database size={13} /> Sources
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button style={{ padding: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.3)', display: 'flex' }}><LayoutGrid size={14} /></button>
        <button style={{ padding: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.3)', display: 'flex' }}><SlidersHorizontal size={14} /></button>
        <div style={{ width: '1px', height: '16px', background: 'rgba(0,0,0,0.1)' }} />
        <button
          onClick={() => { if (inputValue.trim() && !isLoading) onSubmit(inputValue.trim()); }}
          disabled={!inputValue.trim() || isLoading}
          style={{ background: 'none', border: 'none', cursor: inputValue.trim() && !isLoading ? 'pointer' : 'default', color: inputValue.trim() && !isLoading ? '#0A0A0A' : 'rgba(0,0,0,0.2)', display: 'flex', padding: '5px' }}
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  </div>
);
