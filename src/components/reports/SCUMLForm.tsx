import { useState, useEffect } from "react";
import { Section, Field, Row, TextInput, NumberInput, TextArea, YesNo, Select } from "./FormShell";

export interface SCUMLPayload {
  section_a: Record<string, string>;
  section_b: Record<string, string>;
  section_c: Record<string, string>;
  section_d: Record<string, string>;
  section_e: Record<string, string>;
  section_f: Record<string, string>;
  section_g: Record<string, string | boolean>;
}

interface Props {
  institutionName: string;
  cbnLicense: string;
  reportingYear: string;
  onValidChange: (valid: boolean, payload: SCUMLPayload) => void;
}

export default function SCUMLForm({ institutionName, cbnLicense, reportingYear, onValidChange }: Props) {
  const [a, setA] = useState({
    institution_name: institutionName,
    scuml_reg_number: "",
    cbn_license_number: cbnLicense,
    scuml_reg_date: "",
    reporting_year: reportingYear,
    co_name: "",
    co_email: "",
    co_phone: "",
  });
  const [b, setB] = useState({ has_policy: "", policy_reviewed: "", board_approval_date: "", does_risk_assessment: "", risk_freq: "" });
  const [c, setC] = useState({ total_customers: "", kyc_complete: "", kyc_incomplete: "", edd_conducted: "", edd_count: "", closed_kyc: "" });
  const [d, setD] = useState({ str_filed: "", ctr_filed: "", automated_monitoring: "", monitoring_system_name: "" });
  const [e, setE] = useState({ staff_trained: "", trainer_type: "", sessions: "", training_hours: "" });
  const [f, setF] = useState({ examined: "", exam_date: "", outcome: "", sanctions: "", sanction_nature: "" });
  const [g, setG] = useState({ ceo_name: "", cco_name: "", submission_date: "", ceo_cert: false, cco_cert: false });

  useEffect(() => {
    const valid =
      !!a.scuml_reg_number && !!a.co_name && !!a.co_email &&
      !!b.has_policy && !!b.does_risk_assessment &&
      !!c.total_customers && !!c.edd_conducted &&
      !!d.str_filed && !!d.ctr_filed && !!d.automated_monitoring &&
      !!e.staff_trained && !!e.trainer_type &&
      !!f.examined &&
      !!g.ceo_name && !!g.cco_name && g.ceo_cert && g.cco_cert;
    onValidChange(valid, { section_a: a, section_b: b, section_c: c, section_d: d, section_e: e, section_f: f, section_g: g });
  }, [a, b, c, d, e, f, g, onValidChange]);

  return (
    <div>
      <Section letter="A" title="Institution & Registration Details">
        <Row>
          <Field label="Institution Name"><TextInput value={a.institution_name} readOnly /></Field>
          <Field label="SCUML Registration Number *"><TextInput value={a.scuml_reg_number} onChange={e => setA({ ...a, scuml_reg_number: e.target.value })} placeholder="SCUML/XXX/XXXX" /></Field>
        </Row>
        <Row>
          <Field label="CBN License Number"><TextInput value={a.cbn_license_number} readOnly /></Field>
          <Field label="Date of SCUML Registration"><TextInput type="date" value={a.scuml_reg_date} onChange={e => setA({ ...a, scuml_reg_date: e.target.value })} /></Field>
        </Row>
        <Row>
          <Field label="Reporting Year"><TextInput value={a.reporting_year} readOnly /></Field>
          <Field label="Compliance Officer Name *"><TextInput value={a.co_name} onChange={e => setA({ ...a, co_name: e.target.value })} /></Field>
        </Row>
        <Row>
          <Field label="Compliance Officer Email *"><TextInput type="email" value={a.co_email} onChange={e => setA({ ...a, co_email: e.target.value })} /></Field>
          <Field label="Compliance Officer Phone"><TextInput value={a.co_phone} onChange={e => setA({ ...a, co_phone: e.target.value })} /></Field>
        </Row>
      </Section>

      <Section letter="B" title="AML/CFT Compliance Programme">
        <Field label="Does the institution have a written AML/CFT Policy? *"><YesNo name="b_policy" value={b.has_policy} onChange={v => setB({ ...b, has_policy: v })} /></Field>
        <Field label="Was the policy reviewed in the reporting year?"><YesNo name="b_review" value={b.policy_reviewed} onChange={v => setB({ ...b, policy_reviewed: v })} /></Field>
        <Field label="Date of Board approval of current policy"><TextInput type="date" value={b.board_approval_date} onChange={e => setB({ ...b, board_approval_date: e.target.value })} /></Field>
        <Field label="Does the institution conduct AML/CFT risk assessment? *"><YesNo name="b_risk" value={b.does_risk_assessment} onChange={v => setB({ ...b, does_risk_assessment: v })} /></Field>
        <Field label="Frequency of risk assessment">
          <Select value={b.risk_freq} onChange={e => setB({ ...b, risk_freq: e.target.value })}>
            <option value="">Select…</option>
            <option>Annual</option><option>Semi-Annual</option><option>Quarterly</option>
          </Select>
        </Field>
      </Section>

      <Section letter="C" title="Know Your Customer (KYC)">
        <Row>
          <Field label="Total customers at year end *"><NumberInput value={c.total_customers} onChange={e => setC({ ...c, total_customers: e.target.value })} /></Field>
          <Field label="Customers with complete KYC"><NumberInput value={c.kyc_complete} onChange={e => setC({ ...c, kyc_complete: e.target.value })} /></Field>
        </Row>
        <Row>
          <Field label="Customers with incomplete KYC"><NumberInput value={c.kyc_incomplete} onChange={e => setC({ ...c, kyc_incomplete: e.target.value })} /></Field>
          <Field label="Customers subjected to EDD"><NumberInput value={c.edd_count} onChange={e => setC({ ...c, edd_count: e.target.value })} /></Field>
        </Row>
        <Field label="Was Enhanced Due Diligence (EDD) conducted on high-risk customers? *"><YesNo name="c_edd" value={c.edd_conducted} onChange={v => setC({ ...c, edd_conducted: v })} /></Field>
        <Field label="Accounts closed due to KYC failure"><NumberInput value={c.closed_kyc} onChange={e => setC({ ...c, closed_kyc: e.target.value })} /></Field>
      </Section>

      <Section letter="D" title="Transaction Monitoring & Reporting">
        <Row>
          <Field label="STRs filed with NFIU in the year *"><NumberInput value={d.str_filed} onChange={e => setD({ ...d, str_filed: e.target.value })} /></Field>
          <Field label="CTRs filed with NFIU in the year *"><NumberInput value={d.ctr_filed} onChange={e => setD({ ...d, ctr_filed: e.target.value })} /></Field>
        </Row>
        <Field label="Was an automated transaction monitoring system in use? *"><YesNo name="d_auto" value={d.automated_monitoring} onChange={v => setD({ ...d, automated_monitoring: v })} /></Field>
        <Field label="Name of transaction monitoring system"><TextInput value={d.monitoring_system_name} onChange={e => setD({ ...d, monitoring_system_name: e.target.value })} /></Field>
      </Section>

      <Section letter="E" title="Staff Training">
        <Row>
          <Field label="Staff who received AML/CFT training *"><NumberInput value={e.staff_trained} onChange={ev => setE({ ...e, staff_trained: ev.target.value })} /></Field>
          <Field label="Training sessions conducted"><NumberInput value={e.sessions} onChange={ev => setE({ ...e, sessions: ev.target.value })} /></Field>
        </Row>
        <Row>
          <Field label="Trainer type *">
            <Select value={e.trainer_type} onChange={ev => setE({ ...e, trainer_type: ev.target.value })}>
              <option value="">Select…</option><option>Internal</option><option>External</option><option>Both</option>
            </Select>
          </Field>
          <Field label="Total training hours"><NumberInput value={e.training_hours} onChange={ev => setE({ ...e, training_hours: ev.target.value })} /></Field>
        </Row>
      </Section>

      <Section letter="F" title="SCUML Examination">
        <Field label="Was the institution examined by SCUML in the reporting year? *"><YesNo name="f_exam" value={f.examined} onChange={v => setF({ ...f, examined: v })} /></Field>
        {f.examined === "Yes" && (
          <>
            <Row>
              <Field label="Date of examination"><TextInput type="date" value={f.exam_date} onChange={e => setF({ ...f, exam_date: e.target.value })} /></Field>
              <Field label="Examination outcome">
                <Select value={f.outcome} onChange={e => setF({ ...f, outcome: e.target.value })}>
                  <option value="">Select…</option><option>Satisfactory</option><option>Needs Improvement</option><option>Unsatisfactory</option>
                </Select>
              </Field>
            </Row>
            <Field label="Were any sanctions imposed?"><YesNo name="f_sanc" value={f.sanctions} onChange={v => setF({ ...f, sanctions: v })} /></Field>
            {f.sanctions === "Yes" && (
              <Field label="Nature of sanction"><TextArea value={f.sanction_nature} onChange={e => setF({ ...f, sanction_nature: e.target.value })} /></Field>
            )}
          </>
        )}
      </Section>

      <Section letter="G" title="Declaration & Certification">
        <Row>
          <Field label="Name of Chief Executive Officer *"><TextInput value={g.ceo_name} onChange={ev => setG({ ...g, ceo_name: ev.target.value })} /></Field>
          <Field label="Name of Chief Compliance Officer *"><TextInput value={g.cco_name} onChange={ev => setG({ ...g, cco_name: ev.target.value })} /></Field>
        </Row>
        <Field label="Date of submission"><TextInput type="date" value={g.submission_date} onChange={ev => setG({ ...g, submission_date: ev.target.value })} /></Field>
        <div style={{ background: "#F5F5F0", padding: 14, borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }}>
          <p style={{ fontSize: 12, color: "#0A0A0A", margin: "0 0 12px", lineHeight: 1.5, fontStyle: "italic" }}>
            "I hereby certify that the information contained in this Annual Compliance Report submitted to SCUML is true, accurate, and complete."
          </p>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={g.ceo_cert} onChange={e => setG({ ...g, ceo_cert: e.target.checked })} />
            CEO certification ({g.ceo_name || "—"})
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={g.cco_cert} onChange={e => setG({ ...g, cco_cert: e.target.checked })} />
            CCO certification ({g.cco_name || "—"})
          </label>
        </div>
      </Section>
    </div>
  );
}
