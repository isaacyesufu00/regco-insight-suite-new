CREATE TABLE IF NOT EXISTS public.regulatory_news (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  url          TEXT UNIQUE NOT NULL,
  published_at TIMESTAMPTZ,
  source       TEXT,
  category     TEXT,
  image_url    TEXT,
  is_read      BOOLEAN DEFAULT false,
  is_important BOOLEAN DEFAULT false,
  tags         TEXT[],
  fetched_at   TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_published ON public.regulatory_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.regulatory_news(category);

ALTER TABLE public.regulatory_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read news" ON public.regulatory_news
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage news" ON public.regulatory_news
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.news_read_status (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL,
  news_id    UUID NOT NULL REFERENCES public.regulatory_news(id) ON DELETE CASCADE,
  read_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, news_id)
);

ALTER TABLE public.news_read_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_read_status" ON public.news_read_status
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.monthly_compliance_tasks (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID NOT NULL,
  month          TEXT NOT NULL,
  category       TEXT NOT NULL,
  title          TEXT NOT NULL,
  description    TEXT,
  priority       TEXT DEFAULT 'medium',
  priority_order INTEGER DEFAULT 0,
  status         TEXT DEFAULT 'pending',
  recurring      BOOLEAN DEFAULT true,
  completed_at   TIMESTAMPTZ,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monthly_tasks_user_month ON public.monthly_compliance_tasks(user_id, month);

ALTER TABLE public.monthly_compliance_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_tasks" ON public.monthly_compliance_tasks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);