import { useState, useEffect, useMemo } from "react";
import { Section, Field, Row, TextInput, NumberInput, Computed, fmt } from "./FormShell";

export interface NDICPremiumPayload {
  section_a: Record<string, string>;
  section_b: Record<string, string | number>;
  section_c: Record<string, string | number>;
  section_d: Record<string, string | number>;
  section_e: Record<string, string>;
  computed: { total_insured: number; premium_payable: number; deposit_total: number };
}

interface Props {
  institutionName: string;
  cbnLicense: string;
  reportingYear: string;
  onValidChange: (valid: boolean, payload: NDICPremiumPayload) => void;
}

const num = (s: string) => parseFloat(s) || 0;

export default function NDICPremiumForm({ institutionName, cbnLicense, reportingYear, onValidChange }: Props) {
  const [a, setA] = useState({
    institution_name: institutionName, cbn_license_number: cbnLicense,
    ndic_cert_number: "", reporting_year: reportingYear, fy_end: `${reportingYear}-12-31`,
  });
  const [b, setB] = useState({ total_deposits: "", uninsured_portion: "", num_accounts: "", num_above_500k: "" });
  const [c, setC] = useState({ paid: "", payment_date: "", receipt_number: "" });
  const [d, setD] = useState({ savings: "", current: "", fixed: "", other: "" });
  const [e, setE] = useState({ ceo_name: "", cfo_name: "", date: "" });

  const totalInsured = useMemo(() => Math.max(0, num(b.total_deposits) - num(b.uninsured_portion)), [b]);
  const premiumPayable = useMemo(() => totalInsured * 0.004, [totalInsured]);
  const depositTotal = useMemo(() => num(d.savings) + num(d.current) + num(d.fixed) + num(d.other), [d]);

  useEffect(() => {
    const valid =
      !!a.ndic_cert_number && !!a.fy_end &&
      num(b.total_deposits) > 0 && !!b.num_accounts &&
      !!c.paid &&
      !!e.ceo_name && !!e.cfo_name && !!e.date;
    onValidChange(valid, {
      section_a: a, section_b: b, section_c: c, section_d: d, section_e: e,
      computed: { total_insured: totalInsured, premium_payable: premiumPayable, deposit_total: depositTotal },
    });
  }, [a, b, c, d, e, totalInsured, premiumPayable, depositTotal, onValidChange]);

  return (
    <div>
      <Section letter="A" title="Institution Details">
        <Row>
          <Field label="Institution Name"><TextInput value={a.institution_name} readOnly /></Field>
          <Field label="CBN License Number"><TextInput value={a.cbn_license_number} readOnly /></Field>
        </Row>
        <Row>
          <Field label="NDIC Certificate Number *"><TextInput value={a.ndic_cert_number} onChange={ev => setA({ ...a, ndic_cert_number: ev.target.value })} placeholder="NDIC/XXX/XXX" /></Field>
          <Field label="Reporting Year"><TextInput value={a.reporting_year} readOnly /></Field>
        </Row>
        <Field label="Date of Financial Year End"><TextInput type="date" value={a.fy_end} onChange={ev => setA({ ...a, fy_end: ev.target.value })} /></Field>
      </Section>

      <Section letter="B" title="Deposit Liability Computation">
        <Row>
          <Field label="Total deposits at year end (₦) *"><NumberInput value={b.total_deposits} onChange={ev => setB({ ...b, total_deposits: ev.target.value })} /></Field>
          <Field label="Uninsured portion — above ₦500,000 per depositor (₦)"><NumberInput value={b.uninsured_portion} onChange={ev => setB({ ...b, uninsured_portion: ev.target.value })} /></Field>
        </Row>
        <Computed label="Total Insured Deposits = Total deposits − Uninsured portion" value={totalInsured} prefix="₦" />
        <Row>
          <Field label="Number of deposit accounts *"><NumberInput value={b.num_accounts} onChange={ev => setB({ ...b, num_accounts: ev.target.value })} /></Field>
          <Field label="Depositors with balances above ₦500,000"><NumberInput value={b.num_above_500k} onChange={ev => setB({ ...b, num_above_500k: ev.target.value })} /></Field>
        </Row>
      </Section>

      <Section letter="C" title="Premium Calculation">
        <Row>
          <Field label="Total Insured Deposits (auto)"><TextInput value={`₦${fmt(totalInsured)}`} readOnly /></Field>
          <Field label="Premium Rate — NDIC MFB Category"><TextInput value="0.40%" readOnly /></Field>
        </Row>
        <Computed label={`₦${fmt(totalInsured)} × 0.40% = Premium Payable`} value={premiumPayable} prefix="₦" />
        <Field label="Has premium been paid? *">
          <select value={c.paid} onChange={ev => setC({ ...c, paid: ev.target.value })}
            style={{ width: "100%", background: "#FFF", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}>
            <option value="">Select…</option><option>Yes</option><option>No</option>
          </select>
        </Field>
        {c.paid === "Yes" && (
          <Row>
            <Field label="Date of payment"><TextInput type="date" value={c.payment_date} onChange={ev => setC({ ...c, payment_date: ev.target.value })} /></Field>
            <Field label="NDIC receipt number"><TextInput value={c.receipt_number} onChange={ev => setC({ ...c, receipt_number: ev.target.value })} /></Field>
          </Row>
        )}
      </Section>

      <Section letter="D" title="Deposit Breakdown by Type">
        <Row>
          <Field label="Savings deposits (₦)"><NumberInput value={d.savings} onChange={ev => setD({ ...d, savings: ev.target.value })} /></Field>
          <Field label="Current account deposits (₦)"><NumberInput value={d.current} onChange={ev => setD({ ...d, current: ev.target.value })} /></Field>
        </Row>
        <Row>
          <Field label="Fixed/term deposits (₦)"><NumberInput value={d.fixed} onChange={ev => setD({ ...d, fixed: ev.target.value })} /></Field>
          <Field label="Other deposits (₦)"><NumberInput value={d.other} onChange={ev => setD({ ...d, other: ev.target.value })} /></Field>
        </Row>
        <Computed label="Total" value={depositTotal} prefix="₦" />
      </Section>

      <Section letter="E" title="Certification">
        <Row>
          <Field label="CEO Name *"><TextInput value={e.ceo_name} onChange={ev => setE({ ...e, ceo_name: ev.target.value })} /></Field>
          <Field label="CFO Name *"><TextInput value={e.cfo_name} onChange={ev => setE({ ...e, cfo_name: ev.target.value })} /></Field>
        </Row>
        <Field label="Date *"><TextInput type="date" value={e.date} onChange={ev => setE({ ...e, date: ev.target.value })} /></Field>
      </Section>
    </div>
  );
}
