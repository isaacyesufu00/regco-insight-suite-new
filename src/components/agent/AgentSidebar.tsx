import { Home, Activity, Newspaper, FileText, ClipboardCheck, Shield, Settings, HelpCircle, Search, PanelLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AgentConversation } from '@/types/agent';

interface AgentSidebarProps {
  institutionName: string;
  userInitial: string;
  userName: string;
  conversations: AgentConversation[];
  activeConvId: string | null;
  onSelectConversation: (c: AgentConversation) => void;
  onNewConversation: () => void;
}

export const AgentSidebar = ({
  institutionName, userInitial, userName,
  conversations, activeConvId,
  onSelectConversation, onNewConversation,
}: AgentSidebarProps) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Dashboard', action: () => onNewConversation() },
    { icon: Activity, label: 'Live Monitoring', action: () => navigate('/dashboard/transactions') },
    { icon: Newspaper, label: 'Regulatory News', action: () => navigate('/dashboard/regulatory-intelligence') },
    { icon: FileText, label: 'My Reports', action: () => navigate('/dashboard/reports') },
    { icon: Shield, label: 'Screening', action: () => navigate('/dashboard/screening') },
    { icon: ClipboardCheck, label: 'Audit', action: () => navigate('/dashboard/audit-tracker') },
  ];

  return (
    <aside style={{
      width: '216px',
      flexShrink: 0,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#FFFFFF',
      borderRight: '1px solid rgba(0,0,0,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 14px 8px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#FFFFFF' }}>{userInitial}</span>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          <button style={{ padding: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.4)', borderRadius: '5px', display: 'flex' }}>
            <Search size={14} />
          </button>
          <button style={{ padding: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.4)', borderRadius: '5px', display: 'flex' }}>
            <PanelLeft size={14} />
          </button>
        </div>
      </div>

      <div style={{ padding: '0 14px 10px' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#0A0A0A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {institutionName || 'RegCo'}
        </p>
      </div>

      <div style={{ padding: '0 10px 10px' }}>
        <button onClick={onNewConversation} style={{
          width: '100%', height: '30px', background: 'transparent',
          border: '1px solid rgba(0,0,0,0.14)', borderRadius: '7px',
          fontSize: '13px', fontWeight: '400', color: 'rgba(0,0,0,0.7)',
          cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.1px',
          transition: 'background 0.12s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          New conversation
        </button>
      </div>

      <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', margin: '0 0 6px' }} />

      <nav style={{ padding: '2px 8px', flex: 1, overflowY: 'auto' }}>
        {navItems.map(item => (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
              padding: '6px 8px', borderRadius: '6px', background: 'transparent',
              border: 'none', cursor: 'pointer', fontSize: '13px', color: 'rgba(0,0,0,0.6)',
              fontFamily: 'inherit', textAlign: 'left', marginBottom: '1px',
              transition: 'background 0.1s, color 0.1s',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(0,0,0,0.05)'; el.style.color = '#0A0A0A'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(0,0,0,0.6)'; }}
          >
            <item.icon size={14} strokeWidth={1.7} style={{ flexShrink: 0 }} />
            {item.label}
          </button>
        ))}

        {conversations.length > 0 && (
          <>
            <p style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 8px 5px', margin: 0 }}>
              History
            </p>
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                style={{
                  width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '6px 8px', borderRadius: '6px', marginBottom: '1px',
                  background: activeConvId === conv.id ? 'rgba(0,0,0,0.06)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (activeConvId !== conv.id) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { if (activeConvId !== conv.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '13px', color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{conv.title}</span>
                <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.35)', marginTop: '1px' }}>{conv.timeLabel}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      <div style={{ padding: '8px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        {[
          { icon: Settings, label: 'Settings', action: () => navigate('/dashboard/settings') },
          { icon: HelpCircle, label: 'Help', action: () => window.open('mailto:support@regco.com.ng') },
        ].map(item => (
          <button key={item.label} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '9px', padding: '6px 8px', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'rgba(0,0,0,0.5)', fontFamily: 'inherit', marginBottom: '1px', transition: 'background 0.1s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <item.icon size={14} strokeWidth={1.7} />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
};
