
-- Customer 360 tables
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  bvn text,
  phone_number text,
  email text,
  customer_segment text DEFAULT 'Retail',
  account_number text,
  date_of_birth date,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_customers_user ON public.customers(user_id);
CREATE INDEX idx_customers_bvn ON public.customers(bvn);
CREATE INDEX idx_customers_name ON public.customers(full_name);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own customers" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own customers" ON public.customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own customers" ON public.customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own customers" ON public.customers FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all customers" ON public.customers FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));

CREATE TABLE public.customer_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  account_number text NOT NULL,
  account_type text DEFAULT 'Savings',
  currency text DEFAULT 'NGN',
  balance numeric DEFAULT 0,
  status text DEFAULT 'Active',
  open_date date DEFAULT CURRENT_DATE,
  branch text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_caccts_customer ON public.customer_accounts(customer_id);
CREATE INDEX idx_caccts_user ON public.customer_accounts(user_id);
CREATE INDEX idx_caccts_acct ON public.customer_accounts(account_number);

ALTER TABLE public.customer_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own accounts" ON public.customer_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own accounts" ON public.customer_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own accounts" ON public.customer_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own accounts" ON public.customer_accounts FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.customer_kyc (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid UNIQUE REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  kyc_status text DEFAULT 'incomplete',
  kyc_tier int DEFAULT 1,
  id_type text,
  id_number text,
  id_verified boolean DEFAULT false,
  address_verified boolean DEFAULT false,
  bvn_verified boolean DEFAULT false,
  photo_verified boolean DEFAULT false,
  missing_items jsonb DEFAULT '[]'::jsonb,
  last_reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.customer_kyc ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own kyc" ON public.customer_kyc FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own kyc" ON public.customer_kyc FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own kyc" ON public.customer_kyc FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own kyc" ON public.customer_kyc FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.unified_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  account_number text,
  transaction_date timestamptz NOT NULL DEFAULT now(),
  amount numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'NGN',
  transaction_type text,
  channel text,
  description text,
  counterparty text,
  reference text,
  balance_after numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_utx_customer ON public.unified_transactions(customer_id);
CREATE INDEX idx_utx_user ON public.unified_transactions(user_id);
CREATE INDEX idx_utx_date ON public.unified_transactions(transaction_date DESC);

ALTER TABLE public.unified_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own tx" ON public.unified_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own tx" ON public.unified_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own tx" ON public.unified_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own tx" ON public.unified_transactions FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.transaction_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  customer_id uuid,
  account_number text,
  transaction_date timestamptz NOT NULL DEFAULT now(),
  amount numeric,
  flag_severity text DEFAULT 'low',
  flag_reason text,
  status text DEFAULT 'Open',
  case_number text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_trev_user ON public.transaction_reviews(user_id);
CREATE INDEX idx_trev_acct ON public.transaction_reviews(account_number);

ALTER TABLE public.transaction_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own reviews" ON public.transaction_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own reviews" ON public.transaction_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON public.transaction_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own reviews" ON public.transaction_reviews FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.sanctions_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  aliases text,
  list_name text NOT NULL,
  list_type text DEFAULT 'Sanctions',
  country text,
  date_of_birth date,
  notes text,
  active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sanctions_name ON public.sanctions_entries(full_name);

ALTER TABLE public.sanctions_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read sanctions" ON public.sanctions_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage sanctions" ON public.sanctions_entries FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- Triggers
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_customer_kyc_updated BEFORE UPDATE ON public.customer_kyc FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a couple of sanctions entries (well-known list names; non-real names)
INSERT INTO public.sanctions_entries (full_name, list_name, list_type, country) VALUES
  ('John Doe Sample', 'UN Security Council', 'Sanctions', 'XX'),
  ('Jane Smith Sample', 'OFAC SDN', 'Sanctions', 'XX'),
  ('Test PEP Subject', 'CBN Watchlist', 'PEP', 'NG');
