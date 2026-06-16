import { useState } from 'react';
import { X, FileText } from 'lucide-react';

const REPORT_CONFIGS: Record<string, { label: string; fields: { key: string; label: string; type: string; placeholder: string }[] }> = {
  mfb_regulatory: {
    label: 'CBN MFB Regulatory Return',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  monetary_policy: {
    label: 'CBN Monetary Policy Return',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  prudential_return: {
    label: 'CBN Prudential Return',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  forex_return: {
    label: 'CBN Forex Return',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  vat_return: {
    label: 'FIRS VAT Return (7.5%)',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  paye: {
    label: 'FIRS PAYE Return',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  wht_return: {
    label: 'FIRS Withholding Tax Return',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  cit_return: {
    label: 'FIRS Company Income Tax Return',
    fields: [
      { key: 'period_year', label: 'Tax Year', type: 'number', placeholder: 'e.g. 2025' },
    ],
  },
  ndic_premium: {
    label: 'NDIC Premium Return (0.40%)',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  ndic_single_obligor: {
    label: 'NDIC Single Obligor Quarterly Return',
    fields: [
      { key: 'period_month', label: 'Reporting Quarter (start month)', type: 'month', placeholder: 'e.g. 2026-04' },
    ],
  },
  scuml_annual: {
    label: 'SCUML Annual Compliance Report',
    fields: [
      { key: 'period_year', label: 'Reporting Year', type: 'number', placeholder: 'e.g. 2025' },
    ],
  },
  nfiu_amlcft: {
    label: 'NFIU AML/CFT Quarterly Report',
    fields: [
      { key: 'period_month', label: 'Quarter Start Month', type: 'month', placeholder: 'e.g. 2026-04' },
    ],
  },
  nfiu_regulatory: {
    label: 'NFIU Regulatory Return',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  nfiu_international: {
    label: 'NFIU International Transfers Report',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  pencom: {
    label: 'PENCOM Pension Remittance Return',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
  board_governance: {
    label: 'CBN Board Governance Return',
    fields: [
      { key: 'period_month', label: 'Reporting Quarter (start month)', type: 'month', placeholder: 'e.g. 2026-04' },
    ],
  },
  consumer_protection: {
    label: 'CBN Consumer Protection Return',
    fields: [
      { key: 'period_month', label: 'Reporting Month', type: 'month', placeholder: 'e.g. 2026-05' },
    ],
  },
};

interface AgentReportModalProps {
  reportType: string;
  institutionName: string;
  isGenerating: boolean;
  onDismiss: () => void;
  onSubmit: (data: Record<string, any>) => void;
}

export const AgentReportModal = ({
  reportType, institutionName, isGenerating, onDismiss, onSubmit,
}: AgentReportModalProps) => {
  const config = REPORT_CONFIGS[reportType] || {
    label: reportType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    fields: [{ key: 'period_month', label: 'Reporting Period', type: 'month', placeholder: 'e.g. 2026-05' }],
  };

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map(f => [f.key, '']))
  );

  const allFilled = config.fields.every(f => values[f.key]?.trim());

  const handleSubmit = () => {
    if (!allFilled || isGenerating) return;

    const periodMonth = values.period_month;
    const periodYear = values.period_year;

    let reportingPeriodStart: string;
    let reportingPeriodEnd: string;

    if (periodMonth) {
      const [year, month] = periodMonth.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      reportingPeriodStart = startDate.toISOString().slice(0, 10);
      reportingPeriodEnd = endDate.toISOString().slice(0, 10);
    } else if (periodYear) {
      reportingPeriodStart = `${periodYear}-01-01`;
      reportingPeriodEnd = `${periodYear}-12-31`;
    } else {
      const now = new Date();
      reportingPeriodStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      reportingPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
    }

    onSubmit({
      report_type: config.label,
      reporting_period_start: reportingPeriodStart,
      reporting_period_end: reportingPeriodEnd,
      report_config: { key: reportType, label: config.label },
      ...values,
    });
  };

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0F9F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={15} color="#16A34A" />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A', margin: 0, fontFamily: 'inherit' }}>{config.label}</p>
            <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', margin: 0, fontFamily: 'inherit' }}>{institutionName}</p>
          </div>
        </div>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.4)', padding: '4px', display: 'flex' }}>
          <X size={16} />
        </button>
      </div>

      {/* Form */}
      <div style={{ padding: '24px' }}>
        <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)', marginBottom: '20px', lineHeight: 1.6, fontFamily: 'inherit' }}>
          Confirm the reporting period below. RegCo will generate the {config.label} using your uploaded CBS data.
        </p>

        {config.fields.map(field => (
          <div key={field.key} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0A0A0A', marginBottom: '6px', fontFamily: 'inherit' }}>
              {field.label}
            </label>
            <input
              type={field.type}
              value={values[field.key]}
              onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              style={{ width: '100%', height: '40px', border: '1px solid rgba(0,0,0,0.14)', borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#0A0A0A', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#F7F7F5', transition: 'border-color 0.15s' }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = 'rgba(0,0,0,0.4)'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(0,0,0,0.14)'}
            />
          </div>
        ))}

        <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', margin: 0, lineHeight: 1.6, fontFamily: 'inherit' }}>
            RegCo will validate your data against CBN thresholds before generating. If any required CBS figures are missing, you will be prompted to provide them.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onDismiss} disabled={isGenerating} style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)', background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '7px', padding: '10px 18px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!allFilled || isGenerating}
            style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF', background: allFilled && !isGenerating ? '#16A34A' : 'rgba(0,0,0,0.15)', border: 'none', borderRadius: '7px', padding: '10px 24px', cursor: allFilled && !isGenerating ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isGenerating ? 'Generating…' : 'Generate return'}
          </button>
        </div>
      </div>
    </div>
  );
};
