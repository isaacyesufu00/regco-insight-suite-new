import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { AgentSidebar } from '@/components/agent/AgentSidebar';
import { AgentCenter } from '@/components/agent/AgentCenter';
import { AgentRightPanel } from '@/components/agent/AgentRightPanel';
import { AgentMissingInputModal } from '@/components/agent/AgentMissingInputModal';
import type { AgentMessage, AgentConversation, RightPanelItem, MissingInputDef } from '@/types/agent';

export default function AgentPage() {
  // ─── State ──────────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState<AgentConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'sources' | 'outputs' | 'reports' | 'uploads'>('outputs');
  const [rightPanelItems, setRightPanelItems] = useState<RightPanelItem[]>([]);
  const [missingInput, setMissingInput] = useState<MissingInputDef | null>(null);
  const [reportModal, setReportModal] = useState<string | null>(null);
  const [pendingTask, setPendingTask] = useState<string | null>(null);

  // CRITICAL: use ref for messages to avoid stale closures in async functions
  const messagesRef = useRef<AgentMessage[]>([]);
  const activeConvIdRef = useRef<string | null>(null);

  const { profile, institutionName, userInitial, userName } = useProfile();
  const navigate = useNavigate();

  // ─── Sync refs with state ────────────────────────────────────────────────
  const setMessagesAndRef = useCallback((updater: AgentMessage[] | ((prev: AgentMessage[]) => AgentMessage[])) => {
    setMessages(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      messagesRef.current = next;
      return next;
    });
  }, []);

  // ─── Load conversations on mount ─────────────────────────────────────────
  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from('agent_conversations')
      .select('*')
      .eq('user_id', profile.id)
      .order('updated_at', { ascending: false })
      .limit(25)
      .then(({ data }) => {
        if (data) {
          setConversations(data.map((c: any) => ({
            ...c,
            timeLabel: getTimeLabel(c.updated_at),
          })));
        }
      });
  }, [profile?.id]);

  // ─── Load messages when conversation changes ──────────────────────────────
  useEffect(() => {
    activeConvIdRef.current = activeConvId;
    if (!activeConvId) {
      setMessagesAndRef([]);
      return;
    }
    supabase
      .from('agent_messages')
      .select('*')
      .eq('conversation_id', activeConvId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) {
          const loaded = data.map((m: any) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: new Date(m.created_at),
            actionType: m.action_type || undefined,
          }));
          setMessagesAndRef(loaded);
        }
      });
  }, [activeConvId]);

  // ─── Create new conversation ──────────────────────────────────────────────
  const createNewConversation = useCallback(() => {
    setActiveConvId(null);
    setMessagesAndRef([]);
    setInputValue('');
    setRightPanelItems([]);
  }, []);

  // ─── Select existing conversation ─────────────────────────────────────────
  const selectConversation = useCallback((conv: AgentConversation) => {
    setActiveConvId(conv.id);
    setRightPanelItems([]);
  }, []);

  // ─── MAIN SUBMIT HANDLER ──────────────────────────────────────────────────
  const handleSubmit = useCallback(async (userMessage: string, injectedContext?: string) => {
    if (!userMessage.trim() || isLoading || !profile?.id) return;

    const finalMessage = injectedContext
      ? `${userMessage}\n\nAdditional context provided: ${injectedContext}`
      : userMessage;

    // Step 1: Add user message to UI immediately using the ref-backed setter
    const userMsgId = `user-${Date.now()}`;
    const userMsg: AgentMessage = {
      id: userMsgId,
      role: 'user',
      content: finalMessage,
      timestamp: new Date(),
    };
    setMessagesAndRef(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setMissingInput(null);

    // Step 2: Get or create conversation
    let convId = activeConvIdRef.current;
    if (!convId) {
      const { data: newConv } = await supabase
        .from('agent_conversations')
        .insert({
          user_id: profile.id,
          title: finalMessage.slice(0, 60) + (finalMessage.length > 60 ? '…' : ''),
        })
        .select()
        .single();

      if (newConv) {
        convId = newConv.id;
        setActiveConvId(convId);
        activeConvIdRef.current = convId;
        setConversations(prev => [{
          ...newConv,
          timeLabel: 'Today',
        }, ...prev]);
      }
    }

    // Step 3: Save user message to DB
    if (convId) {
      await supabase.from('agent_messages').insert({
        conversation_id: convId,
        user_id: profile.id,
        role: 'user',
        content: finalMessage,
      });

      supabase.from('agent_conversations').update({ updated_at: new Date().toISOString() }).eq('id', convId);
    }

    // Step 4: Build API message history from the REF (not stale state)
    const currentMessages = messagesRef.current;
    const apiMessages = currentMessages
      .filter(m => m.role === 'user' || (m.role === 'assistant' && m.content && m.content.length > 0))
      .map(m => ({ role: m.role, content: m.content }));

    // Safety: ensure last message is the user's new message
    const lastMsg = apiMessages[apiMessages.length - 1];
    if (!lastMsg || lastMsg.content !== finalMessage) {
      apiMessages.push({ role: 'user', content: finalMessage });
    }

    console.log('[Agent] Sending to model. Message count:', apiMessages.length);
    console.log('[Agent] Latest message:', apiMessages[apiMessages.length - 1]);

    // Step 5: Show thinking animation
    const thinkingId = `thinking-${Date.now()}`;
    setMessagesAndRef(prev => [...prev, {
      id: thinkingId,
      role: 'assistant',
      content: '',
      streaming: true,
      thinkingLabel: 'Thinking…',
      timestamp: new Date(),
    }]);

    // Step 6: Call agent-chat edge function with streaming
    let labelInterval: ReturnType<typeof setInterval> | undefined;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No auth session');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            messages: apiMessages,
            userId: profile.id,
            conversationId: convId,
          }),
        }
      );

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorJson.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) throw new Error('No response body from agent');

      // Step 7: Read the stream and update the message in real time
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      // Update thinking label progressively
      const thinkingLabels = ['Reading your request…', 'Checking compliance context…', 'Preparing response…'];
      let labelIndex = 0;
      labelInterval = setInterval(() => {
        if (labelIndex < thinkingLabels.length - 1) {
          labelIndex++;
          setMessagesAndRef(prev => prev.map(m =>
            m.id === thinkingId ? { ...m, thinkingLabel: thinkingLabels[labelIndex] } : m
          ));
        }
      }, 600);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              setMessagesAndRef(prev => prev.map(m =>
                m.id === thinkingId
                  ? { ...m, content: accumulated, thinkingLabel: undefined }
                  : m
              ));
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }

      clearInterval(labelInterval);

      // Step 8: Parse action tags from the complete response
      let cleanContent = accumulated.trim();
      let actionType: string | undefined;
      let modalType: string | undefined;
      let needInput: MissingInputDef | undefined;

      const reportMatch = cleanContent.match(/\[GENERATE_REPORT:([a-z_]+)\]/);
      if (reportMatch) {
        modalType = reportMatch[1];
        cleanContent = cleanContent.replace(reportMatch[0], '').trim();
      }

      const dataMatch = cleanContent.match(/\[SHOW_DATA:([a-z_]+)\]/);
      if (dataMatch) {
        actionType = `show_data:${dataMatch[1]}`;
        cleanContent = cleanContent.replace(dataMatch[0], '').trim();
      }

      const inputMatch = cleanContent.match(/\[NEED_INPUT:([^:]+):([^:]+):([^\]]+)\]/);
      if (inputMatch) {
        needInput = { fieldKey: inputMatch[1], label: inputMatch[2], description: inputMatch[3] };
        cleanContent = cleanContent.replace(inputMatch[0], '').trim();
      }

      // Step 9: Finalize the message
      const finalAssistantId = `assistant-${Date.now()}`;
      setMessagesAndRef(prev => prev
        .filter(m => m.id !== thinkingId)
        .concat({
          id: finalAssistantId,
          role: 'assistant',
          content: cleanContent,
          streaming: false,
          actionType,
          modalType,
          timestamp: new Date(),
        })
      );

      // Step 10: Execute parsed actions
      if (needInput) {
        setTimeout(() => setMissingInput(needInput!), 300);
      }

      if (modalType) {
        setTimeout(() => setReportModal(modalType!), 300);
      }

      if (actionType?.startsWith('show_data:')) {
        const dataType = actionType.replace('show_data:', '');
        await fetchAndShowData(dataType);
      }

      // Step 11: Save assistant response to DB
      if (convId && cleanContent) {
        await supabase.from('agent_messages').insert({
          conversation_id: convId,
          user_id: profile.id,
          role: 'assistant',
          content: cleanContent,
          action_type: actionType || modalType || null,
        });
      }

      // Step 12: Add to right panel outputs
      if (cleanContent.length > 200) {
        setRightPanelItems(prev => [{
          id: finalAssistantId,
          type: 'output',
          title: finalMessage.slice(0, 50),
          subtitle: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
          content: cleanContent,
          createdAt: new Date(),
        }, ...prev].slice(0, 20));
        setRightPanelTab('outputs');
      }

    } catch (error: any) {
      if (labelInterval) clearInterval(labelInterval);
      console.error('[Agent] Error:', error);
      setMessagesAndRef(prev => prev
        .filter(m => m.id !== thinkingId)
        .concat({
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Something went wrong: ${error.message || 'Connection error'}. Please try again.`,
          timestamp: new Date(),
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, profile?.id]);

  // ─── Fetch data for inline display ───────────────────────────────────────
  const fetchAndShowData = async (dataType: string) => {
    if (!profile?.id) return;
    let data: any[] = [];

    if (dataType === 'aml_flags') {
      const { data: flags } = await supabase
        .from('transaction_reviews')
        .select('*')
        .eq('user_id', profile.id)
        .eq('review_status', 'pending')
        .order('transaction_date', { ascending: false })
        .limit(8);
      data = flags || [];
    } else if (dataType === 'reports') {
      const { data: reports } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(8);
      data = reports || [];
    } else if (dataType === 'audit_issues') {
      const { data: issues } = await supabase
        .from('audit_issues')
        .select('*')
        .eq('user_id', profile.id)
        .in('status', ['open', 'in_progress', 'overdue'])
        .limit(8);
      data = issues || [];
    }

    if (data.length > 0) {
      setRightPanelItems(prev => [{
        id: `data-${Date.now()}`,
        type: 'source',
        title: `${dataType.replace(/_/g, ' ')} — ${data.length} items`,
        subtitle: 'Retrieved from RegCo database',
        content: JSON.stringify(data),
        createdAt: new Date(),
      }, ...prev].slice(0, 20));
      setRightPanelTab('sources');
    }
  };

  // ─── Handle report modal submit ───────────────────────────────────────────
  const handleReportSubmit = async (data: Record<string, any>) => {
    setReportModal(null);
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-report`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
          body: JSON.stringify({ user_id: profile?.id, ...data }),
        }
      );
      const result = await res.json();

      const resultMsg: AgentMessage = {
        id: `report-result-${Date.now()}`,
        role: 'assistant',
        content: result.success
          ? `Your ${data.report_config?.label || 'report'} has been generated successfully. Download it below.`
          : `Report generation failed: ${result.error || 'unknown error'}. Please try again.`,
        timestamp: new Date(),
        actionType: result.success ? `download:${result.report_id}` : undefined,
      };
      setMessagesAndRef(prev => [...prev, resultMsg]);

      if (result.success) {
        setRightPanelItems(prev => [{
          id: result.report_id,
          type: 'report',
          title: data.report_config?.label || 'Generated Report',
          subtitle: new Date().toLocaleDateString('en-NG'),
          createdAt: new Date(),
        }, ...prev]);
        setRightPanelTab('reports');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: '#FFFFFF',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
    }}>
      <AgentSidebar
        institutionName={institutionName}
        userInitial={userInitial}
        userName={userName}
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={selectConversation}
        onNewConversation={createNewConversation}
      />

      <AgentCenter
        messages={messages}
        inputValue={inputValue}
        isLoading={isLoading}
        institutionName={institutionName}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        onToggleRightPanel={() => setRightPanelOpen(p => !p)}
        reportModal={reportModal}
        onDismissReportModal={() => setReportModal(null)}
        onReportSubmit={handleReportSubmit}
        profile={profile}
      />

      <AnimatePresence>
        {rightPanelOpen && (
          <AgentRightPanel
            activeTab={rightPanelTab}
            items={rightPanelItems}
            onTabChange={setRightPanelTab}
            onClose={() => setRightPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      {missingInput && (
        <AgentMissingInputModal
          field={missingInput}
          pendingTask={pendingTask}
          onSubmit={(value) => {
            const context = `${missingInput.label}: ${value}`;
            setMissingInput(null);
            handleSubmit(`Please continue with this information: ${value}`, context);
          }}
          onDismiss={() => setMissingInput(null)}
        />
      )}
    </div>
  );
}

function getTimeLabel(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 86400000 && now.getDate() === date.getDate()) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}
