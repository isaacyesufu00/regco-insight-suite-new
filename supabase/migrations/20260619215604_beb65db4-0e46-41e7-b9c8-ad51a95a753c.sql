-- 1. report_templates table
CREATE TABLE public.report_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  version int NOT NULL DEFAULT 1,
  title text NOT NULL,
  regulator text,
  frequency text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  definition jsonb NOT NULL,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (code, version)
);

-- only one active version per code
CREATE UNIQUE INDEX report_templates_one_active_per_code
  ON public.report_templates (code) WHERE status = 'active';

GRANT SELECT ON public.report_templates TO authenticated;
GRANT ALL ON public.report_templates TO service_role;

ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read active templates"
  ON public.report_templates FOR SELECT TO authenticated
  USING (status = 'active' OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins manage templates"
  ON public.report_templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER update_report_templates_updated_at
  BEFORE UPDATE ON public.report_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. reports linkage
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES public.report_templates(id),
  ADD COLUMN IF NOT EXISTS template_version int;

-- 3. Seed 11 starter templates from filing_schedules
INSERT INTO public.report_templates (code, version, title, regulator, frequency, status, definition)
SELECT
  fs.return_type,
  1,
  fs.title,
  fs.regulator,
  fs.frequency,
  'active',
  jsonb_build_object(
    'code', fs.return_type,
    'title', fs.title,
    'regulator', fs.regulator,
    'frequency', fs.frequency,
    'version', 1,
    'period', jsonb_build_object('kind',
      CASE fs.frequency
        WHEN 'daily' THEN 'day'
        WHEN 'weekly' THEN 'week'
        WHEN 'monthly' THEN 'month'
        WHEN 'quarterly' THEN 'quarter'
        WHEN 'annual' THEN 'year'
        ELSE 'event'
      END
    ),
    'parameters', '[]'::jsonb,
    'sources', CASE
      WHEN fs.return_type IN ('NFIU_STR','NFIU_CTR') THEN
        jsonb_build_array(
          jsonb_build_object(
            'id','tx',
            'table','unified_transactions',
            'select','id,amount,currency,transaction_type,channel,branch_code,customer_id,customer_name,account_number,transaction_date,narration,description,counterparty',
            'filters', jsonb_build_array(
              jsonb_build_object('col','transaction_date','op','gte','value','${period.start}'),
              jsonb_build_object('col','transaction_date','op','lt', 'value','${period.end}')
            )
          )
        )
      ELSE '[]'::jsonb
    END,
    'readiness', CASE
      WHEN fs.return_type = 'NFIU_CTR' THEN
        jsonb_build_array(
          jsonb_build_object('rule','min_rows','source','tx','min',1,'label','cash transactions for period'),
          jsonb_build_object('rule','field_present','source','tx','field','branch_code','label','branch_code'),
          jsonb_build_object('rule','field_present','source','tx','field','customer_name','label','customer_name'),
          jsonb_build_object('rule','field_present','source','tx','field','account_number','label','account_number')
        )
      ELSE '[]'::jsonb
    END,
    'layout', jsonb_build_object(
      'cover', jsonb_build_array(
        jsonb_build_object('label','Return','value', fs.title),
        jsonb_build_object('label','Regulator','value', fs.regulator),
        jsonb_build_object('label','Period','value','${period.label}')
      ),
      'sections', CASE
        WHEN fs.return_type IN ('NFIU_STR','NFIU_CTR') THEN
          jsonb_build_array(
            jsonb_build_object(
              'id','transactions','title','Transactions','type','table','source','tx',
              'columns', jsonb_build_array(
                jsonb_build_object('header','Date','value','${row.transaction_date|date}'),
                jsonb_build_object('header','Account','value','${row.account_number}'),
                jsonb_build_object('header','Customer','value','${row.customer_name}'),
                jsonb_build_object('header','Branch','value','${row.branch_code}'),
                jsonb_build_object('header','Type','value','${row.transaction_type}'),
                jsonb_build_object('header','Amount','value','${row.amount|naira}'),
                jsonb_build_object('header','Narration','value','${row.narration|default:${row.description}}')
              )
            )
          )
        ELSE '[]'::jsonb
      END
    ),
    'formats', CASE
      WHEN fs.return_type LIKE 'NFIU_%' THEN jsonb_build_array('xml','xlsx','csv','pdf')
      ELSE jsonb_build_array('xlsx','csv','pdf')
    END
  )
FROM public.filing_schedules fs;