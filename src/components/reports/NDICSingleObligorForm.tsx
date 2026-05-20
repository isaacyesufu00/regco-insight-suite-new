import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Section, Field, Row, TextInput, NumberInput, Computed, fmt } from "./FormShell";

export interface ExposureRow {
  id: string;
  borrower_name: string;
  borrower_type: string;
  account_number: string;
  sector: string;
  total_facility: string;
  outstanding: string;
  collateral_type: string;
  collateral_value: string;
  classification: string;
  days_past_due: string;
}

export interface SingleObligorPayload {
  section_a: Record<string, string>;
  section_b: Record<string, string | number>;
  exposures: ExposureRow[];
  summary: { count: number; total_outstanding: number; largest: number; largest_pct: number };
  section_e: Record<string, string>;
}

interface Props {
  institutionName: string;
  cbnLicense: string;
  period: string;
  onValidChange: (valid: boolean, payload: SingleObligorPayload) => void;
}

const num = (s: string) => parseFloat(s) || 0;
const newRow = (): ExposureRow => ({
  id: Math.random().toString(36).slice(2),
  borrower_name: "", borrower_type: "Corporate", account_number: "", sector: "Trade",
  total_facility: "", outstanding: "", collateral_type: "Property",
  collateral_value: "", classification: "Pass", days_past_due: "0",
});

export default function NDICSingleObligorForm({ institutionName, cbnLicense, period, onValidChange }: Props) {
  const [a] = useState({ institution_name: institutionName, cbn_license_number: cbnLicense, period });
  const [b, setB] = useState({ capital_base: "" });
  const [rows, setRows] = useState<ExposureRow[]>([newRow()]);
  const [e, setE] = useState({ ceo_name: "", cco_name: "", date: "" });

  const capital = num(b.capital_base);
  const limit = capital * 0.05;

  const summary = useMemo(() => {
    const totalOut = rows.reduce((s, r) => s + num(r.outstanding), 0);
    const largest = rows.reduce((m, r) => Math.max(m, num(r.outstanding)), 0);
    const largestPct = capital > 0 ? (largest / capital) * 100 : 0;
    return { count: rows.length, total_outstanding: totalOut, largest, largest_pct: largestPct };
  }, [rows, capital]);

  useEffect(() => {
    const validRows = rows.every(r => !!r.borrower_name && num(r.outstanding) > 0);
    const valid = capital > 0 && rows.length >= 1 && validRows && !!e.ceo_name && !!e.cco_name && !!e.date;
    onValidChange(valid, { section_a: a, section_b: b, exposures: rows, summary, section_e: e });
  }, [a, b, rows, summary, e, capital, onValidChange]);

  const updateRow = (id: string, patch: Partial<ExposureRow>) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
  const removeRow = (id: string) => setRows(rs => rs.length > 1 ? rs.filter(r => r.id !== id) : rs);

  const sel: React.CSSProperties = { width: "100%", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 6, padding: "6px 8px", fontSize: 12, background: "#FFF" };

  return (
    <div>
      <Section letter="A" title="Institution Details">
        <Row>
          <Field label="Institution Name"><TextInput value={a.institution_name} readOnly /></Field>
          <Field label="CBN License Number"><TextInput value={a.cbn_license_number} readOnly /></Field>
        </Row>
        <Field label="Reporting Period"><TextInput value={a.period} readOnly /></Field>
      </Section>

      <Section letter="B" title="Capital Base Reference">
        <Field label="Shareholders funds / Capital base at period end (₦) *">
          <NumberInput value={b.capital_base} onChange={ev => setB({ capital_base: ev.target.value })} />
        </Field>
        <Computed label={`Single Obligor Limit — 5% × ₦${fmt(capital)} (max single borrower exposure)`} value={limit} prefix="₦" />
      </Section>

      <Section letter="C" title="Large Exposures">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F5F5F0" }}>
                {["Borrower", "Type", "Account #", "Sector", "Facility ₦", "Outstanding ₦", "% Cap", "Collateral", "Coll. ₦", "Class", "DPD", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 6px", fontWeight: 600, color: "#0A0A0A", borderBottom: "1px solid rgba(0,0,0,0.12)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const pct = capital > 0 ? (num(r.outstanding) / capital) * 100 : 0;
                const overLimit = pct > 5;
                return (
                  <tr key={r.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <td style={{ padding: "4px" }}><input style={sel} value={r.borrower_name} onChange={ev => updateRow(r.id, { borrower_name: ev.target.value })} placeholder="Name" /></td>
                    <td style={{ padding: "4px" }}>
                      <select style={sel} value={r.borrower_type} onChange={ev => updateRow(r.id, { borrower_type: ev.target.value })}>
                        <option>Individual</option><option>Corporate</option><option>Government</option>
                      </select>
                    </td>
                    <td style={{ padding: "4px" }}><input style={sel} value={r.account_number} onChange={ev => updateRow(r.id, { account_number: ev.target.value })} /></td>
                    <td style={{ padding: "4px" }}>
                      <select style={sel} value={r.sector} onChange={ev => updateRow(r.id, { sector: ev.target.value })}>
                        <option>Agriculture</option><option>Manufacturing</option><option>Trade</option><option>Services</option><option>Real Estate</option><option>Other</option>
                      </select>
                    </td>
                    <td style={{ padding: "4px" }}><input type="number" style={sel} value={r.total_facility} onChange={ev => updateRow(r.id, { total_facility: ev.target.value })} /></td>
                    <td style={{ padding: "4px" }}><input type="number" style={sel} value={r.outstanding} onChange={ev => updateRow(r.id, { outstanding: ev.target.value })} /></td>
                    <td style={{ padding: "4px", color: overLimit ? "#B91C1C" : "#0A0A0A", fontWeight: overLimit ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>{pct.toFixed(2)}%</td>
                    <td style={{ padding: "4px" }}>
                      <select style={sel} value={r.collateral_type} onChange={ev => updateRow(r.id, { collateral_type: ev.target.value })}>
                        <option>Property</option><option>Cash</option><option>Guarantees</option><option>Unsecured</option>
                      </select>
                    </td>
                    <td style={{ padding: "4px" }}><input type="number" style={sel} value={r.collateral_value} onChange={ev => updateRow(r.id, { collateral_value: ev.target.value })} /></td>
                    <td style={{ padding: "4px" }}>
                      <select style={sel} value={r.classification} onChange={ev => updateRow(r.id, { classification: ev.target.value })}>
                        <option>Pass</option><option>Watch List</option><option>Substandard</option><option>Doubtful</option><option>Loss</option>
                      </select>
                    </td>
                    <td style={{ padding: "4px" }}><input type="number" style={sel} value={r.days_past_due} onChange={ev => updateRow(r.id, { days_past_due: ev.target.value })} /></td>
                    <td style={{ padding: "4px" }}>
                      <button type="button" onClick={() => removeRow(r.id)} disabled={rows.length === 1}
                        style={{ background: "transparent", border: "none", color: rows.length === 1 ? "#CCC" : "#0A0A0A", cursor: rows.length === 1 ? "not-allowed" : "pointer", padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={() => setRows([...rows, newRow()])}
          style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, background: "#FFF", border: "1px dashed rgba(0,0,0,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", color: "#0A0A0A" }}>
          <Plus size={14} /> Add exposure row
        </button>
      </Section>

      <Section letter="D" title="Summary">
        <Row>
          <Computed label="Total large exposures" value={summary.count} />
          <Computed label="Total outstanding" value={summary.total_outstanding} prefix="₦" />
        </Row>
        <Row>
          <Computed label="Largest single exposure" value={summary.largest} prefix="₦" />
          <Computed label="Largest as % of capital" value={`${summary.largest_pct.toFixed(2)}%`} />
        </Row>
      </Section>

      <Section letter="E" title="Certification">
        <Row>
          <Field label="CEO Name *"><TextInput value={e.ceo_name} onChange={ev => setE({ ...e, ceo_name: ev.target.value })} /></Field>
          <Field label="CCO Name *"><TextInput value={e.cco_name} onChange={ev => setE({ ...e, cco_name: ev.target.value })} /></Field>
        </Row>
        <Field label="Date *"><TextInput type="date" value={e.date} onChange={ev => setE({ ...e, date: ev.target.value })} /></Field>
      </Section>
    </div>
  );
}
