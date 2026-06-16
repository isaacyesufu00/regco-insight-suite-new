export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  thinkingLabel?: string;
  actionType?: string;
  actionPayload?: Record<string, any>;
  inlineData?: { type: string; data: any[] };
  modalType?: string;
  timestamp: Date;
}

export interface AgentConversation {
  id: string;
  title: string;
  timeLabel: string;
  updatedAt: string;
}

export interface RightPanelItem {
  id: string;
  type: 'source' | 'output' | 'report' | 'upload';
  title: string;
  subtitle?: string;
  content?: string;
  createdAt: Date;
}

export interface MissingInputDef {
  fieldKey: string;
  label: string;
  description: string;
}
