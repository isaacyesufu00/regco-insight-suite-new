import { useState, useEffect, useMemo } from "react";
import { Section, Field, Row, TextInput, NumberInput, Computed, fmt, num, tableInputStyle, TableHeader, AddRowButton, RemoveRowButton, PaymentFields, DeclarationSection } from "./FormShell";

export interface WHTRow {
  id: string;
  payee_name: string;
  payee_tin: string;
  nature: string;
  gross: string;
  rate: string;
  wht: string;
}

export interface FIRSWHTPayload {
  section_a: Record<string, string>;
  transactions: WHTRow[];
  summary: { total_gross: number; total_wht: number };
  section_c: Record<string, string>;
  section_d: Record<string, string>;
}

interface Props {
  companyName: string;
  periodLabel: string;
  onValidChange: (valid: boolean, payload: FIRSWHTPayload) => void;
}

const NATURE_RATES: Record<string, number> = {
  "Rent": 10,
  "Dividend": 10,
  "Interest": 10,
  "Contract": 5,
  "Professional Fee": 10,
  "Other": 5,
};

const newRow = (): WHTRow => ({
  id: Math.random().toString(36).slice(2),
  payee_name: "", payee_tin: "", nature: "Contract",
  gross: "", rate: "5", wht: "",
});

export default function FIRSWHTForm({ companyName, periodLabel, onValidChange }: Props) {
  const [a, setA] = useState({ company_name: companyName, tin: "", period: periodLabel });
  const [rows, setRows] = useState<WHTRow[]>([newRow()]);
  const [c, setC] = useState({ paid: "", payment_date: "", receipt_number: "" });
  const [d, setD] = useState({ signatory_name: "", designation: "", date: "" });

  const computed = useMemo(() => rows.map(r => {
    const rate = NATURE_RATES[r.nature] ?? 5;
    const wht = num(r.gross) * (rate / 100);
    return { ...r, rate: String(rate), wht: String(wht) };
  }), [rows]);

  const summary = useMemo(() => ({
    total_gross: computed.reduce((s, r) => s + num(r.gross), 0),
    total_wht: computed.reduce((s, r) => s + num(r.wht), 0),
  }), [computed]);

  useEffect(() => {
    const validRows = computed.every(r => !!r.payee_name && num(r.gross) > 0);
    const valid = !!a.tin && computed.length >= 1 && validRows && !!c.paid && !!d.signatory_name && !!d.designation && !!d.date;
    onValidChange(valid, { section_a: a, transactions: computed, summary, section_c: c, section_d: d });
  }, [a, computed, summary, c, d, onValidChange]);

  const updateRow = (id: string, patch: Partial<WHTRow>) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
  const removeRow = (id: string) => setRows(rs => rs.length > 1 ? rs.filter(r => r.id !== id) : rs);

  const sel = tableInputStyle;

  return (
    <div>
      <Section letter="A" title="Remitting Company Details">
        <Row>
          <Field label="Company Name"><TextInput value={a.company_name} readOnly /></Field>
          <Field label="Reporting Period"><TextInput value={a.period} readOnly /></Field>
        </Row>
        <Field label="TIN *"><TextInput value={a.tin} onChange={ev => setA({ ...a, tin: ev.target.value })} /></Field>
      </Section>

      <Section letter="B" title="WHT Transactions">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <TableHeader columns={["Payee Name", "Payee TIN", "Nature of Payment", "Gross ₦", "Rate", "WHT ₦", ""]} />
            <tbody>
              {computed.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <td style={{ padding: 4 }}><input style={sel} value={r.payee_name} onChange={ev => updateRow(r.id, { payee_name: ev.target.value })} /></td>
                  <td style={{ padding: 4 }}><input style={sel} value={r.payee_tin} onChange={ev => updateRow(r.id, { payee_tin: ev.target.value })} /></td>
                  <td style={{ padding: 4 }}>
                    <select style={sel} value={r.nature} onChange={ev => updateRow(r.id, { nature: ev.target.value })}>
                      {Object.keys(NATURE_RATES).map(n => <option key={n}>{n}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: 4 }}><input type="number" style={sel} value={r.gross} onChange={ev => updateRow(r.id, { gross: ev.target.value })} /></td>
                  <td style={{ padding: 4, fontVariantNumeric: "tabular-nums" }}>{r.rate}%</td>
                  <td style={{ padding: 4, fontVariantNumeric: "tabular-nums" }}>₦{fmt(num(r.wht))}</td>
                  <td style={{ padding: 4 }}>
                    <RemoveRowButton onClick={() => removeRow(r.id)} disabled={rows.length === 1} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AddRowButton label="Add row" onClick={() => setRows([...rows, newRow()])} />
      </Section>

      <Section letter="C" title="Summary">
        <Row>
          <Computed label="Total gross payments subject to WHT" value={summary.total_gross} prefix="₦" />
          <Computed label="Total WHT deducted" value={summary.total_wht} prefix="₦" />
        </Row>
        <PaymentFields
          label="Payment made to FIRS? *"
          options={["Yes", "No"]}
          paid={c.paid} onPaidChange={v => setC({ ...c, paid: v })}
          paymentDate={c.payment_date} onPaymentDateChange={v => setC({ ...c, payment_date: v })}
          receiptNumber={c.receipt_number} onReceiptChange={v => setC({ ...c, receipt_number: v })}
          receiptLabel="FIRS receipt number"
          showDetails={p => p === "Yes"}
        />
      </Section>

      <DeclarationSection
        letter="D"
        signatoryName={d.signatory_name} onSignatoryChange={v => setD({ ...d, signatory_name: v })}
        designation={d.designation} onDesignationChange={v => setD({ ...d, designation: v })}
        date={d.date} onDateChange={v => setD({ ...d, date: v })}
      />
    </div>
  );
}
