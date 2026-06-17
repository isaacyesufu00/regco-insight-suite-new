-- Clean slate for agent chat
DROP TABLE IF EXISTS public.agent_messages CASCADE;
DROP TABLE IF EXISTS public.agent_conversations CASCADE;

CREATE TABLE public.agent_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_conversations TO authenticated;
GRANT ALL ON public.agent_conversations TO service_role;

ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_conversations_select" ON public.agent_conversations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_own_conversations_insert" ON public.agent_conversations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_own_conversations_update" ON public.agent_conversations
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_own_conversations_delete" ON public.agent_conversations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_agent_conversations_user ON public.agent_conversations(user_id, updated_at DESC);

CREATE TABLE public.agent_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL DEFAULT '',
  action_type TEXT,
  action_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_messages TO authenticated;
GRANT ALL ON public.agent_messages TO service_role;

ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_messages_select" ON public.agent_messages
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_own_messages_insert" ON public.agent_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_own_messages_update" ON public.agent_messages
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_own_messages_delete" ON public.agent_messages
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_agent_messages_conv ON public.agent_messages(conversation_id, created_at);