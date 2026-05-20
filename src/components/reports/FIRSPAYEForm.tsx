import { useState, useEffect, useMemo } from "react";
import { Section, Field, Row, TextInput, NumberInput, Computed, fmt } from "./FormShell";

export interface FIRSPAYEPayload {
  section_a: Record<string, string>;
  section_b: Record<string, string | number>;
  section_c: Record<string, string>;
  section_d: Record<string, string>;
  mode: "summary" | "detailed";
  employees: Array<Record<string, string>>;
  computed: { chargeable_income: number; total_paye: number };
}

interface Props {
  employerName: string;
  periodLabel: string;
  onValidChange: (valid: boolean, payload: FIRSPAYEPayload) => void;
}

const num = (s: string) => parseFloat(s) || 0;
const STATE_IRS = ["FCT-IRS", "LIRS (Lagos)", "OGIRS (Ogun)", "RIRS (Rivers)", "KIRS (Kano)", "OYIRS (Oyo)", "Other State IRS"];

const newEmp = () => ({ name: "", grade: "", gross: "", pension: "", nhf: "", nhis: "", chargeable: "", paye: "" });

export default function FIRSPAYEForm({ employerName, periodLabel, onValidChange }: Props) {
  const [a, setA] = useState({ employer_name: employerName, tin: "", state_irs: STATE_IRS[0], period: periodLabel });
  const [mode, setMode] = useState<"summary" | "detailed">("summary");
  const [b, setB] = useState({ total_gross: "", total_deductions: "", total_chargeable: "", total_paye: "", num_employees: "" });
  const [employees, setEmployees] = useState([newEmp()]);
  const [c, setC] = useState({ total_remit: "", paid: "", payment_date: "", receipt_number: "" });
  const [d, setD] = useState({ signatory_name: "", designation: "", date: "" });

  const detailedTotals = useMemo(() => {
    if (mode !== "detailed") return { chargeable: 0, paye: 0 };
    return employees.reduce((acc, e) => ({
      chargeable: acc.chargeable + num(e.chargeable),
      paye: acc.paye + num(e.paye),
    }), { chargeable: 0, paye: 0 });
  }, [employees, mode]);

  const totalPAYE = mode === "summary" ? num(b.total_paye) : detailedTotals.paye;
  const chargeable = mode === "summary" ? num(b.total_chargeable) : detailedTotals.chargeable;

  useEffect(() => {
    const baseValid = !!a.tin && !!a.state_irs && !!c.paid && !!d.signatory_name && !!d.designation && !!d.date;
    const modeValid = mode === "summary"
      ? num(b.total_gross) > 0 && num(b.total_paye) >= 0 && !!b.num_employees
      : employees.length >= 1 && employees.every(e => !!e.name && num(e.gross) > 0);
    onValidChange(baseValid && modeValid, {
      section_a: a, section_b: b, section_c: c, section_d: d, mode, employees,
      computed: { chargeable_income: chargeable, total_paye: totalPAYE },
    });
  }, [a, b, c, d, mode, employees, chargeable, totalPAYE, onValidChange]);

  const updateEmp = (i: number, patch: Record<string, string>) =>
    setEmployees(es => es.map((e, idx) => idx === i ? { ...e, ...patch } : e));

  const sel: React.CSSProperties = { width: "100%", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 6, padding: "6px 8px", fontSize: 12, background: "#FFF" };

  return (
    <div>
      <Section letter="A" title="Employer Details">
        <Row>
          <Field label="Employer Name"><TextInput value={a.employer_name} readOnly /></Field>
          <Field label="Reporting Period"><TextInput value={a.period} readOnly /></Field>
        </Row>
        <Row>
          <Field label="TIN *"><TextInput value={a.tin} onChange={ev => setA({ ...a, tin: ev.target.value })} /></Field>
          <Field label="State Internal Revenue Service *">
            <select value={a.state_irs} onChange={ev => setA({ ...a, state_irs: ev.target.value })}
              style={{ width: "100%", background: "#FFF", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}>
              {STATE_IRS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </Row>
      </Section>

      <Section letter="B" title="Payroll Summary">
        <div style={{ display: "inline-flex", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, padding: 2, marginBottom: 4 }}>
          {(["summary", "detailed"] as const).map(m => (
            <button key={m} type="button" onClick={() => setMode(m)}
              style={{
                padding: "6px 14px", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer",
                borderRadius: 6,
                background: mode === m ? "#0A0A0A" : "transparent",
                color: mode === m ? "#FFF" : "#6E6E73",
              }}>{m === "summary" ? "Summary entry" : "Per-employee table"}</button>
          ))}
        </div>

        {mode === "summary" ? (
          <>
            <Row>
              <Field label="Total gross salary paid this month (₦) *"><NumberInput value={b.total_gross} onChange={ev => setB({ ...b, total_gross: ev.target.value })} /></Field>
              <Field label="Number of employees *"><NumberInput value={b.num_employees} onChange={ev => setB({ ...b, num_employees: ev.target.value })} /></Field>
            </Row>
            <Field label="Total statutory deductions (Pension 8% + NHF 2.5% + NHIS 1.67%) (₦)">
              <NumberInput value={b.total_deductions} onChange={ev => setB({ ...b, total_deductions: ev.target.value })} />
            </Field>
            <Row>
              <Field label="Total chargeable income (₦)"><NumberInput value={b.total_chargeable} onChange={ev => setB({ ...b, total_chargeable: ev.target.value })} /></Field>
              <Field label="Total PAYE deducted (₦) *"><NumberInput value={b.total_paye} onChange={ev => setB({ ...b, total_paye: ev.target.value })} /></Field>
            </Row>
          </>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F5F5F0" }}>
                    {["Name", "Grade", "Gross ₦", "Pension ₦", "NHF ₦", "NHIS ₦", "Chargeable ₦", "PAYE ₦", ""].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 6px", fontWeight: 600, color: "#0A0A0A", borderBottom: "1px solid rgba(0,0,0,0.12)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      <td style={{ padding: 4 }}><input style={sel} value={e.name} onChange={ev => updateEmp(i, { name: ev.target.value })} /></td>
                      <td style={{ padding: 4 }}><input style={sel} value={e.grade} onChange={ev => updateEmp(i, { grade: ev.target.value })} /></td>
                      <td style={{ padding: 4 }}><input type="number" style={sel} value={e.gross} onChange={ev => updateEmp(i, { gross: ev.target.value })} /></td>
                      <td style={{ padding: 4 }}><input type="number" style={sel} value={e.pension} onChange={ev => updateEmp(i, { pension: ev.target.value })} /></td>
                      <td style={{ padding: 4 }}><input type="number" style={sel} value={e.nhf} onChange={ev => updateEmp(i, { nhf: ev.target.value })} /></td>
                      <td style={{ padding: 4 }}><input type="number" style={sel} value={e.nhis} onChange={ev => updateEmp(i, { nhis: ev.target.value })} /></td>
                      <td style={{ padding: 4 }}><input type="number" style={sel} value={e.chargeable} onChange={ev => updateEmp(i, { chargeable: ev.target.value })} /></td>
                      <td style={{ padding: 4 }}><input type="number" style={sel} value={e.paye} onChange={ev => updateEmp(i, { paye: ev.target.value })} /></td>
                      <td style={{ padding: 4 }}>
                        <button type="button" onClick={() => setEmployees(es => es.length > 1 ? es.filter((_, idx) => idx !== i) : es)}
                          disabled={employees.length === 1}
                          style={{ background: "transparent", border: "none", color: employees.length === 1 ? "#CCC" : "#0A0A0A", cursor: employees.length === 1 ? "not-allowed" : "pointer" }}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={() => setEmployees([...employees, newEmp()])}
              style={{ marginTop: 12, background: "#FFF", border: "1px dashed rgba(0,0,0,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", color: "#0A0A0A" }}>
              + Add employee
            </button>
            <Row>
              <Computed label="Total chargeable (auto)" value={detailedTotals.chargeable} prefix="₦" />
              <Computed label="Total PAYE (auto)" value={detailedTotals.paye} prefix="₦" />
            </Row>
          </>
        )}
      </Section>

      <Section letter="C" title="Remittance Details">
        <Computed label="Total PAYE to remit" value={totalPAYE} prefix="₦" />
        <Field label="Payment made? *">
          <select value={c.paid} onChange={ev => setC({ ...c, paid: ev.target.value })}
            style={{ width: "100%", background: "#FFF", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}>
            <option value="">Select…</option><option>Yes</option><option>No</option>
          </select>
        </Field>
        {c.paid === "Yes" && (
          <Row>
            <Field label="Payment date"><TextInput type="date" value={c.payment_date} onChange={ev => setC({ ...c, payment_date: ev.target.value })} /></Field>
            <Field label="FIRS receipt number"><TextInput value={c.receipt_number} onChange={ev => setC({ ...c, receipt_number: ev.target.value })} /></Field>
          </Row>
        )}
      </Section>

      <Section letter="D" title="Declaration">
        <Row>
          <Field label="Authorised Signatory *"><TextInput value={d.signatory_name} onChange={ev => setD({ ...d, signatory_name: ev.target.value })} /></Field>
          <Field label="Designation *"><TextInput value={d.designation} onChange={ev => setD({ ...d, designation: ev.target.value })} /></Field>
        </Row>
        <Field label="Date *"><TextInput type="date" value={d.date} onChange={ev => setD({ ...d, date: ev.target.value })} /></Field>
      </Section>
    </div>
  );
}
