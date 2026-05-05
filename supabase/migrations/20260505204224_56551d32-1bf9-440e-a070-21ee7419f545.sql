
-- Add generated regulator column
ALTER TABLE public.reports
ADD COLUMN IF NOT EXISTS regulator TEXT GENERATED ALWAYS AS (
  CASE 
    WHEN report_type IN ('MFB Regulatory Return', 'Monetary Policy Return', 'Prudential Return', 'CBN Forex Return', 'Board Governance Return', 'Consumer Protection Return', 'CBN Consumer Protection Return', 'CBN Monetary Policy Return') THEN 'CBN'
    WHEN report_type IN ('AML/CFT Compliance Report', 'AML/CFT Report', 'NFIU Regulatory Return', 'International Transfers Report') THEN 'NFIU'
    WHEN report_type IN ('SCUML Annual Compliance', 'SCUML Compliance Report') THEN 'SCUML'
    WHEN report_type IN ('NDIC Premium Return', 'Single Obligor Report') THEN 'NDIC'
    WHEN report_type IN ('Company Income Tax Return', 'PAYE Remittance', 'Withholding Tax Return', 'VAT Return') THEN 'FIRS'
    ELSE 'OTHER'
  END
) STORED;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_report_type ON public.reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_regulator ON public.reports(regulator);
CREATE INDEX IF NOT EXISTS idx_reports_user_id_status ON public.reports(user_id, status);
