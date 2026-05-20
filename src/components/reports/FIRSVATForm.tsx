import { useState, useEffect, useMemo } from "react";
import { Section, Field, Row, TextInput, NumberInput, Computed, fmt } from "./FormShell";

export interface FIRSVATPayload {
  section_a: Record<string, string>;
  section_b: Record<string, string | number>;
  section_c: Record<string, string | number>;
  section_d: Record<string, string | number>;
  section_e: Record<string, string>;
  computed: { output_vat: number; input_vat: number; net_vat: number };
}

interface Props {
  institutionName: string;
  periodLabel: string;
  onValidChange: (valid: boolean, payload: FIRSVATPayload) => void;
}

const num = (s: string) => parseFloat(s) || 0;
const RATE = 0.075;

export default function FIRSVATForm({ institutionName, periodLabel, onValidChange }: Props) {
  const [a, setA] = useState({
    business_name: institutionName, tin: "", vat_reg_number: "", period: periodLabel,
  });
  const [b, setB] = useState({ taxable_supplies: "" });
  const [c, setC] = useState({ taxable_purchases: "" });
  const [d, setD] = useState({ paid: "", payment_date: "", receipt_number: "" });
  const [e, setE] = useState({ signatory_name: "", designation: "", date: "" });

  const outputVAT = useMemo(() => num(b.taxable_supplies) * RATE, [b]);
  const inputVAT = useMemo(() => num(c.taxable_purchases) * RATE, [c]);
  const netVAT = useMemo(() => outputVAT - inputVAT, [outputVAT, inputVAT]);

  useEffect(() => {
    const valid =
      !!a.tin && num(b.taxable_supplies) >= 0 && num(c.taxable_purchases) >= 0 &&
      !!d.paid && !!e.signatory_name && !!e.designation && !!e.date;
    onValidChange(valid, {
      section_a: a, section_b: b, section_c: c, section_d: d, section_e: e,
      computed: { output_vat: outputVAT, input_vat: inputVAT, net_vat: netVAT },
    });
  }, [a, b, c, d, e, outputVAT, inputVAT, netVAT, onValidChange]);

  return (
    <div>
      <Section letter="A" title="Taxpayer Details">
        <Row>
          <Field label="Business Name"><TextInput value={a.business_name} readOnly /></Field>
          <Field label="Reporting Period"><TextInput value={a.period} readOnly /></Field>
        </Row>
        <Row>
          <Field label="TIN — Tax Identification Number *"><TextInput value={a.tin} onChange={ev => setA({ ...a, tin: ev.target.value })} placeholder="XXXXXXXX-XXXX" /></Field>
          <Field label="VAT Registration Number"><TextInput value={a.vat_reg_number} onChange={ev => setA({ ...a, vat_reg_number: ev.target.value })} /></Field>
        </Row>
      </Section>

      <Section letter="B" title="Output VAT — VAT on Sales / Income">
        <Field label="Total taxable supplies / income for the month (₦) *">
          <NumberInput value={b.taxable_supplies} onChange={ev => setB({ taxable_supplies: ev.target.value })} />
        </Field>
        <Row>
          <Field label="VAT Rate (Finance Act 2019)"><TextInput value="7.5%" readOnly /></Field>
          <Computed label="Output VAT = Taxable income × 7.5%" value={outputVAT} prefix="₦" />
        </Row>
      </Section>

      <Section letter="C" title="Input VAT — VAT on Purchases">
        <Field label="Total taxable purchases / expenses for the month (₦)">
          <NumberInput value={c.taxable_purchases} onChange={ev => setC({ taxable_purchases: ev.target.value })} />
        </Field>
        <Computed label="Input VAT claimable = Taxable purchases × 7.5%" value={inputVAT} prefix="₦" />
      </Section>

      <Section letter="D" title="Net VAT Payable">
        <Row>
          <Computed label="Output VAT" value={outputVAT} prefix="₦" />
          <Computed label="Less: Input VAT" value={inputVAT} prefix="₦" />
        </Row>
        <Computed label={netVAT < 0 ? "Net VAT credit carried forward" : "Net VAT Payable"} value={Math.abs(netVAT)} prefix={netVAT < 0 ? "−₦" : "₦"} />
        {netVAT < 0 && (
          <p style={{ fontSize: 11, color: "#6E6E73", margin: 0 }}>If negative, this is a VAT credit carried forward.</p>
        )}
        <Field label="Has payment been made? *">
          <select value={d.paid} onChange={ev => setD({ ...d, paid: ev.target.value })}
            style={{ width: "100%", background: "#FFF", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}>
            <option value="">Select…</option><option>Yes</option><option>No</option><option>N/A — credit position</option>
          </select>
        </Field>
        {d.paid === "Yes" && (
          <Row>
            <Field label="Payment date"><TextInput type="date" value={d.payment_date} onChange={ev => setD({ ...d, payment_date: ev.target.value })} /></Field>
            <Field label="FIRS e-receipt number"><TextInput value={d.receipt_number} onChange={ev => setD({ ...d, receipt_number: ev.target.value })} /></Field>
          </Row>
        )}
      </Section>

      <Section letter="E" title="Declaration">
        <Row>
          <Field label="Authorised Signatory *"><TextInput value={e.signatory_name} onChange={ev => setE({ ...e, signatory_name: ev.target.value })} /></Field>
          <Field label="Designation *"><TextInput value={e.designation} onChange={ev => setE({ ...e, designation: ev.target.value })} placeholder="e.g. Chief Finance Officer" /></Field>
        </Row>
        <Field label="Date *"><TextInput type="date" value={e.date} onChange={ev => setE({ ...e, date: ev.target.value })} /></Field>
      </Section>
    </div>
  );
}
