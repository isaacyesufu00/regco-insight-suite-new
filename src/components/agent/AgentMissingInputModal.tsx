import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { MissingInputDef } from '@/types/agent';

export const AgentMissingInputModal = ({
  field, pendingTask, onSubmit, onDismiss,
}: {
  field: MissingInputDef;
  pendingTask: string | null;
  onSubmit: (value: string) => void;
  onDismiss: () => void;
}) => {
  const [value, setValue] = useState('');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', padding: '24px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#0A0A0A', margin: '0 0 4px', fontFamily: 'inherit' }}>Additional information needed</p>
            <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)', margin: 0, fontFamily: 'inherit' }}>{field.description}</p>
          </div>
          <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.4)', padding: '2px', marginLeft: '12px', flexShrink: 0 }}>
            <X size={15} />
          </button>
        </div>

        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0A0A0A', marginBottom: '6px', fontFamily: 'inherit' }}>
          {field.label}
        </label>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onSubmit(value.trim()); }}
          placeholder={`Enter ${field.label.toLowerCase()}...`}
          autoFocus
          style={{ width: '100%', height: '40px', border: '1px solid rgba(0,0,0,0.14)', borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#0A0A0A', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#F7F7F5', marginBottom: '14px', transition: 'border-color 0.15s' }}
          onFocus={e => (e.target as HTMLElement).style.borderColor = 'rgba(0,0,0,0.4)'}
          onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(0,0,0,0.14)'}
        />

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onDismiss} style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)', background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '7px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button
            onClick={() => { if (value.trim()) onSubmit(value.trim()); }}
            disabled={!value.trim()}
            style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF', background: value.trim() ? '#0A0A0A' : 'rgba(0,0,0,0.15)', border: 'none', borderRadius: '7px', padding: '8px 20px', cursor: value.trim() ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background 0.15s' }}
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
};
