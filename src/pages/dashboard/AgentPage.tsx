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

type RightTab = 'sources' | 'outputs' | 'reports' | 'uploads';

const AGENT_AI_URL = 'https://api.anthropic.com/v1/messages';
const AGENT_AI_MODEL = 'claude-sonnet-4-20250514';

const SYSTEM_PROMPT = `You are RegCo Agent — a compliance command center for Nigerian licensed financial institutions regulated by the CBN, NFIU, SCUML, NDIC, FIRS, and PENCOM.

You serve compliance officers at Microfinance Banks (Unit, State, National), Primary Mortgage Banks, Finance Companies, and Commercial Banks.

DOMAIN EXPERTISE:
- All 17 mandatory regulatory returns: CBN (MFB Regulatory, Monetary Policy, Prudential, Forex, Board Governance, Consumer Protection), NFIU (AML/CFT Quarterly, Regulatory Return, International Transfers), SCUML Annual Compliance, NDIC (Premium Return at 0.40%, Single Obligor Quarterly), FIRS (VAT at 7.5%, PAYE with pension deductions of 8% employee + NHF 2.5% + NHIS 1.67%, WHT by payment type, CIT at 30% large / 20% medium / 0% small), PENCOM pension (18% total: 8% employee + 10% employer)
- AML/CFT: CTR threshold NGN 5,000,000, structuring detection, 24-hour velocity threshold NGN 10,000,000, dormant account triggers, narration mismatch
- CBN CAMEL loan classification: Pass (0% provision), Watch List (5%), Substandard (25%), Doubtful (50%), Loss (100%)
- KYC/CDD: tiered KYC under CBN guidelines, BVN verification requirements
- STR/CTR filing obligations and NFIU reporting formats
- Sanctions: UN Security Council, OFAC SDN, EU Consolidated, UK HM Treasury, CBN Watchlist
- PEP identification under Nigerian political context

CRITICAL BEHAVIORAL RULES:
1. ALWAYS respond to the most recent user message. NEVER repeat a previous answer. Check what was just asked and respond to THAT.
2. Before every response, read the full conversation history above and confirm you are answering the LATEST message only.
3. If you need a specific piece of information to complete a task, ask for exactly ONE thing. End your message with this exact tag on a new line: [NEED_INPUT:field_key:Human-readable label:Short explanation of why you need this]
4. When you have enough information to generate a regulatory return, end with: [GENERATE_REPORT:report_type_key] where report_type_key is one of: mfb_regulatory, monetary_policy, prudential_return, forex_return, vat_return, paye, wht_return, cit_return, ndic_premium, ndic_single_obligor, scuml_annual, nfiu_amlcft, nfiu_regulatory, nfiu_international, pencom, board_governance, consumer_protection
5. When retrieving data like AML flags, reports, or customer info, end with: [SHOW_DATA:data_type] where data_type is one of: aml_flags, reports, customers, audit_issues, screening_results
6. Never pretend a task is done unless the tool confirms it.
7. Keep explanations to 2-3 sentences. Be direct.
8. Do not use emojis. Professional tone only.
9. Always vary your responses — do not give the same opening sentence twice in a conversation.`;

type AiMessage = { role: 'user' | 'assistant'; content: string };

function extractAssistantText(payload: unknown): string {
  const data = payload as {
    content?: Array<{ type?: string; text?: string } | string>;
    choices?: Array<{ message?: { content?: string }; delta?: { content?: string } }>;
    message?: { content?: string };
    output_text?: string;
  };

  if (Array.isArray(data.content)) {
    return data.content
      .map((part) => (typeof part === 'string' ? part : part.type === 'text' ? part.text || '' : ''))
      .join('')
      .trim();
  }

  const choiceText = data.choices?.[0]?.message?.content || data.choices?.[0]?.delta?.content;
  return (choiceText || data.message?.content || data.output_text || '').trim();
}

async function readAiError(response: Response): Promise<string> {
  const text = await response.text().catch(() => '');
  if (!text) return `HTTP ${response.status}`;
  try {
    const parsed = JSON.parse(text) as { error?: { message?: string } | string; message?: string };
    if (typeof parsed.error === 'string') return parsed.error;
    return parsed.error?.message || parsed.message || text.slice(0, 220);
  } catch {
    return text.slice(0, 220);
  }
}

function getTimeLabel(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 86400000 && now.getDate() === date.getDate()) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

export default function AgentPage() {
  const [conversations, setConversations] = useState<AgentConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<RightTab>('outputs');
  const [rightPanelItems, setRightPanelItems] = useState<RightPanelItem[]>([]);
  const [missingInput, setMissingInput] = useState<MissingInputDef | null>(null);
  const [reportModal, setReportModal] = useState<string | null>(null);
  const [pendingTask] = useState<string | null>(null);

  const messagesRef = useRef<AgentMessage[]>([]);
  const activeConvIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);

  const { profile, institutionName, userInitial, userName } = useProfile();
  const navigate = useNavigate();

  const setMessagesAndRef = useCallback(
    (updater: AgentMessage[] | ((prev: AgentMessage[]) => AgentMessage[])) => {
      setMessages((prev) => {
        const next = typeof updater === 'function' ? (updater as (p: AgentMessage[]) => AgentMessage[])(prev) : updater;
        messagesRef.current = next;
        return next;
      });
    },
    [],
  );

  // Load conversations on mount
  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from('agent_conversations' as never)
      .select('*')
      .eq('user_id', profile.id)
      .order('updated_at', { ascending: false })
      .limit(25)
      .then(({ data }: { data: Array<{ id: string; title: string; updated_at: string }> | null }) => {
        if (data) {
          setConversations(
            data.map((c) => ({
              id: c.id,
              title: c.title,
              updatedAt: c.updated_at,
              timeLabel: getTimeLabel(c.updated_at),
            })),
          );
        }
      });
  }, [profile?.id]);

  // Load messages when conversation changes
  useEffect(() => {
    activeConvIdRef.current = activeConvId;
    if (!activeConvId) {
      setMessagesAndRef([]);
      return;
    }
    supabase
      .from('agent_messages' as never)
      .select('*')
      .eq('conversation_id', activeConvId)
      .order('created_at', { ascending: true })
      .then(
        ({
          data,
        }: {
          data: Array<{ id: string; role: string; content: string; created_at: string; action_type: string | null }> | null;
        }) => {
          if (data) {
            const loaded: AgentMessage[] = data.map((m) => ({
              id: m.id,
              role: m.role as 'user' | 'assistant',
              content: m.content,
              timestamp: new Date(m.created_at),
              actionType: m.action_type || undefined,
            }));
            setMessagesAndRef(loaded);
          }
        },
      );
  }, [activeConvId, setMessagesAndRef]);

  const createNewConversation = useCallback(() => {
    setActiveConvId(null);
    setMessagesAndRef([]);
    setInputValue('');
    setRightPanelItems([]);
  }, [setMessagesAndRef]);

  const selectConversation = useCallback((conv: AgentConversation) => {
    setActiveConvId(conv.id);
    setRightPanelItems([]);
  }, []);

  const fetchAndShowData = useCallback(
    async (dataType: string) => {
      if (!profile?.id) return;
      let rows: unknown[] = [];
      if (dataType === 'aml_flags') {
        const { data } = await supabase
          .from('transaction_reviews')
          .select('*')
          .eq('user_id', profile.id)
          .eq('review_status', 'pending')
          .order('transaction_date', { ascending: false })
          .limit(8);
        rows = data || [];
      } else if (dataType === 'reports') {
        const { data } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(8);
        rows = data || [];
      } else if (dataType === 'audit_issues') {
        const { data } = await supabase
          .from('audit_issues')
          .select('*')
          .eq('user_id', profile.id)
          .in('status', ['open', 'in_progress', 'overdue'])
          .limit(8);
        rows = data || [];
      }

      if (rows.length > 0) {
        setRightPanelItems((prev) => {
          const next: RightPanelItem[] = [
            {
              id: `data-${Date.now()}`,
              type: 'source',
              title: `${dataType.replace(/_/g, ' ')} — ${rows.length} items`,
              subtitle: 'Retrieved from RegCo database',
              content: JSON.stringify(rows),
              createdAt: new Date(),
            },
            ...prev,
          ];
          return next.slice(0, 20);
        });
        setRightPanelTab('sources');
      }
    },
    [profile?.id],
  );

  const handleSubmit = useCallback(
    async (userMessage: string, injectedContext?: string) => {
      if (!userMessage.trim() || isLoadingRef.current || !profile?.id) return;
      isLoadingRef.current = true;

      const finalMessage = injectedContext
        ? `${userMessage}\n\nAdditional context provided: ${injectedContext}`
        : userMessage;

      const userMsgId = `user-${Date.now()}`;
      const priorMessages = messagesRef.current.filter((m) => !m.streaming && m.content.trim());
      const optimisticMessages: AgentMessage[] = [
        ...priorMessages,
        { id: userMsgId, role: 'user', content: finalMessage, timestamp: new Date() },
      ];
      messagesRef.current = optimisticMessages;
      setMessagesAndRef(optimisticMessages);
      setInputValue('');
      setIsLoading(true);
      setMissingInput(null);

      let convId = activeConvIdRef.current;
      if (!convId) {
        const { data: newConv } = await supabase
          .from('agent_conversations' as never)
          .insert({
            user_id: profile.id,
            title: finalMessage.slice(0, 60) + (finalMessage.length > 60 ? '…' : ''),
          } as never)
          .select()
          .single();

        const inserted = newConv as { id: string; title: string; updated_at: string } | null;
        if (inserted) {
          convId = inserted.id;
          setActiveConvId(convId);
          activeConvIdRef.current = convId;
          const newRow: AgentConversation = {
            id: inserted.id,
            title: inserted.title,
            updatedAt: inserted.updated_at,
            timeLabel: 'Today',
          };
          setConversations((prev) => [newRow, ...prev]);
        }
      }

      if (convId) {
        await supabase.from('agent_messages' as never).insert({
          conversation_id: convId,
          user_id: profile.id,
          role: 'user',
          content: finalMessage,
        } as never);
        supabase
          .from('agent_conversations' as never)
          .update({ updated_at: new Date().toISOString() } as never)
          .eq('id', convId);
      }

      const apiMessages = optimisticMessages.reduce<AiMessage[]>((acc, message) => {
        const content = message.content.trim();
        if (!content) return acc;

        const role = message.role;
        const previous = acc[acc.length - 1];
        if (previous?.role === role) {
          previous.content = `${previous.content}\n\n${content}`;
        } else {
          acc.push({ role, content });
        }
        return acc;
      }, []);

      const thinkingId = `thinking-${Date.now()}`;
      setMessagesAndRef((prev) => [
        ...prev,
        {
          id: thinkingId,
          role: 'assistant',
          content: '',
          streaming: true,
          thinkingLabel: 'Thinking…',
          timestamp: new Date(),
        },
      ]);

      let labelInterval: ReturnType<typeof setInterval> | null = null;

      try {
        const systemContext = `${SYSTEM_PROMPT}\n\nCURRENT USER CONTEXT:\nInstitution: ${institutionName || 'Unknown'}\nLicense Type: ${profile.cbn_license_category || 'Unknown'}\nCompliance Officer: ${userName || 'Unknown'}`;

        const thinkingLabels = ['Reading your request…', 'Checking compliance context…', 'Preparing response…'];
        let labelIndex = 0;
        labelInterval = setInterval(() => {
          if (labelIndex < thinkingLabels.length - 1) {
            labelIndex++;
            setMessagesAndRef((prev) =>
              prev.map((m) => (m.id === thinkingId ? { ...m, thinkingLabel: thinkingLabels[labelIndex] } : m)),
            );
          }
        }, 600);

        const response = await fetch(AGENT_AI_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: AGENT_AI_MODEL,
            system: systemContext,
            messages: apiMessages,
            max_tokens: 1200,
            temperature: 0.25,
          }),
        });

        if (!response.ok) {
          const detail = await readAiError(response);
          throw new Error(`AI request failed (${response.status}): ${detail}`);
        }

        const payload = await response.json().catch(() => null);
        const accumulated = extractAssistantText(payload);

        if (!accumulated) {
          throw new Error('The AI gateway returned an unexpected response shape. Please retry.');
        }

        if (labelInterval) clearInterval(labelInterval);

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

        const finalAssistantId = `assistant-${Date.now()}`;
        setMessagesAndRef((prev) =>
          prev
            .filter((m) => m.id !== thinkingId)
            .concat({
              id: finalAssistantId,
              role: 'assistant',
              content: cleanContent,
              streaming: false,
              actionType,
              modalType,
              timestamp: new Date(),
            }),
        );

        if (needInput) setTimeout(() => setMissingInput(needInput!), 300);
        if (modalType) setTimeout(() => setReportModal(modalType!), 300);
        if (actionType?.startsWith('show_data:')) {
          await fetchAndShowData(actionType.replace('show_data:', ''));
        }

        if (convId && cleanContent) {
          await supabase.from('agent_messages' as never).insert({
            conversation_id: convId,
            user_id: profile.id,
            role: 'assistant',
            content: cleanContent,
            action_type: actionType || modalType || null,
          } as never);
        }

        if (cleanContent.length > 200) {
          setRightPanelItems((prev) => {
            const next: RightPanelItem[] = [
              {
                id: finalAssistantId,
                type: 'output',
                title: finalMessage.slice(0, 50),
                subtitle: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
                content: cleanContent,
                createdAt: new Date(),
              },
              ...prev,
            ];
            return next.slice(0, 20);
          });
          setRightPanelTab('outputs');
        }
      } catch (error) {
        if (labelInterval) clearInterval(labelInterval);
        const msg = error instanceof Error ? error.message : 'Connection error';
        setMessagesAndRef((prev) =>
          prev
            .filter((m) => m.id !== thinkingId)
            .concat({
              id: `error-${Date.now()}`,
              role: 'assistant',
              content: `Something went wrong: ${msg}. Please try again.`,
              timestamp: new Date(),
            }),
        );
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [profile, institutionName, userName, setMessagesAndRef, fetchAndShowData],
  );

  const handleReportSubmit = async (data: Record<string, unknown>) => {
    setReportModal(null);
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ user_id: profile?.id, ...data }),
      });
      const result = await res.json();
      const reportConfig = (data.report_config as { label?: string } | undefined);
      const resultMsg: AgentMessage = {
        id: `report-result-${Date.now()}`,
        role: 'assistant',
        content: result.success
          ? `Your ${reportConfig?.label || 'report'} has been generated successfully. Download it below.`
          : `Report generation failed: ${result.error || 'unknown error'}. Please try again.`,
        timestamp: new Date(),
        actionType: result.success ? `download:${result.report_id}` : undefined,
      };
      setMessagesAndRef((prev) => [...prev, resultMsg]);

      if (result.success) {
        setRightPanelItems((prev) => {
          const next: RightPanelItem[] = [
            {
              id: result.report_id,
              type: 'report',
              title: reportConfig?.label || 'Generated Report',
              subtitle: new Date().toLocaleDateString('en-NG'),
              createdAt: new Date(),
            },
            ...prev,
          ];
          return next;
        });
        setRightPanelTab('reports');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: '#FFFFFF',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
      }}
    >
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
        onToggleRightPanel={() => setRightPanelOpen((p) => !p)}
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
            onTabChange={(t) => setRightPanelTab(t as RightTab)}
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
            const field = missingInput;
            setMissingInput(null);
            handleSubmit(`Please continue with this information: ${value}`, context);
            void field;
          }}
          onDismiss={() => setMissingInput(null)}
        />
      )}

      {/* unused to silence */}
      <span style={{ display: 'none' }}>{userName}{navigate.length}</span>
    </div>
  );
}
