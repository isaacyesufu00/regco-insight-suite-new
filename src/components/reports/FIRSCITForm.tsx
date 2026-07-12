import { useState, useEffect, useMemo } from "react";
import { Section, Field, Row, TextInput, NumberInput, Computed, fmt, num, PaymentFields, DeclarationSection } from "./FormShell";

export interface FIRSCITPayload {
  section_a: Record<string, string>;
  section_b: Record<string, string | number>;
  section_d: Record<string, string>;
  section_e: Record<string, string>;
  computed: {
    gross_profit: number;
    assessable_profit: number;
    net_assessable: number;
    category: string;
    cit_rate: number;
    cit_payable: number;
    edu_tax: number;
    total_tax: number;
    balance: number;
  };
}

interface Props {
  companyName: string;
  rcNumber: string;
  reportingYear: string;
  onValidChange: (valid: boolean, payload: FIRSCITPayload) => void;
}

function determineCategory(turnover: number): { category: string; rate: number } {
  if (turnover < 25_000_000) return { category: "Small", rate: 0 };
  if (turnover <= 100_000_000) return { category: "Medium", rate: 20 };
  return { category: "Large", rate: 30 };
}

export default function FIRSCITForm({ companyName, rcNumber, reportingYear, onValidChange }: Props) {
  const [a, setA] = useState({
    company_name: companyName, tin: "", rc_number: rcNumber, year: reportingYear,
  });
  const [b, setB] = useState({
    turnover: "", cost_of_sales: "", other_income: "", capital_allowances: "", advance_tax: "",
  });
  const [d, setD] = useState({ paid: "", payment_date: "", receipt_number: "" });
  const [e, setE] = useState({ signatory_name: "", designation: "", date: "" });

  const c = useMemo(() => {
    const turnover = num(b.turnover);
    const grossProfit = turnover - num(b.cost_of_sales);
    const assessable = grossProfit + num(b.other_income);
    const netAssessable = assessable - num(b.capital_allowances);
    const { category, rate } = determineCategory(turnover);
    const citPayable = Math.max(0, netAssessable) * (rate / 100);
    const eduTax = Math.max(0, netAssessable) * 0.025;
    const totalTax = citPayable + eduTax;
    const balance = totalTax - num(b.advance_tax);
    return {
      gross_profit: grossProfit, assessable_profit: assessable, net_assessable: netAssessable,
      category, cit_rate: rate, cit_payable: citPayable, edu_tax: eduTax, total_tax: totalTax, balance,
    };
  }, [b]);

  useEffect(() => {
    const valid =
      !!a.tin && !!a.rc_number && num(b.turnover) > 0 &&
      !!d.paid && !!e.signatory_name && !!e.designation && !!e.date;
    onValidChange(valid, { section_a: a, section_b: b, section_d: d, section_e: e, computed: c });
  }, [a, b, c, d, e, onValidChange]);

  return (
    <div>
      <Section letter="A" title="Company Details">
        <Row>
          <Field label="Company Name"><TextInput value={a.company_name} readOnly /></Field>
          <Field label="Year of Assessment"><TextInput value={a.year} readOnly /></Field>
        </Row>
        <Row>
          <Field label="TIN *"><TextInput value={a.tin} onChange={ev => setA({ ...a, tin: ev.target.value })} /></Field>
          <Field label="RC Number *"><TextInput value={a.rc_number} onChange={ev => setA({ ...a, rc_number: ev.target.value })} /></Field>
        </Row>
      </Section>

      <Section letter="B" title="Income Computation">
        <Row>
          <Field label="Total gross income / turnover (₦) *"><NumberInput value={b.turnover} onChange={ev => setB({ ...b, turnover: ev.target.value })} /></Field>
          <Field label="Cost of sales / operating expenses (₦)"><NumberInput value={b.cost_of_sales} onChange={ev => setB({ ...b, cost_of_sales: ev.target.value })} /></Field>
        </Row>
        <Computed label="Gross profit = Income − Expenses" value={c.gross_profit} prefix="₦" />
        <Field label="Other income (interest, fees etc) (₦)"><NumberInput value={b.other_income} onChange={ev => setB({ ...b, other_income: ev.target.value })} /></Field>
        <Computed label="Total assessable profit" value={c.assessable_profit} prefix="₦" />
        <Field label="Capital allowances claimed (₦)"><NumberInput value={b.capital_allowances} onChange={ev => setB({ ...b, capital_allowances: ev.target.value })} /></Field>
        <Computed label="Net assessable profit (after allowances)" value={c.net_assessable} prefix="₦" />
      </Section>

      <Section letter="C" title="Tax Computation">
        <div style={{ background: "#0A0A0A", color: "#FFF", borderRadius: 8, padding: "12px 14px", fontSize: 13 }}>
          Your turnover of ₦{fmt(num(b.turnover))} places you in the <strong>{c.category}</strong> company category — CIT rate: <strong>{c.cit_rate}%</strong>
        </div>
        <Row>
          <Computed label="Assessable profit" value={c.net_assessable} prefix="₦" />
          <Computed label={`CIT payable @ ${c.cit_rate}%`} value={c.cit_payable} prefix="₦" />
        </Row>
        <Computed label="Education tax @ 2.5% of assessable profit" value={c.edu_tax} prefix="₦" />
        <Computed label="TOTAL TAX PAYABLE (CIT + Education tax)" value={c.total_tax} prefix="₦" />
      </Section>

      <Section letter="D" title="Payment Details">
        <Field label="Advance tax paid / instalments (₦)"><NumberInput value={b.advance_tax} onChange={ev => setB({ ...b, advance_tax: ev.target.value })} /></Field>
        <Computed label={c.balance < 0 ? "Refund due" : "Balance payable"} value={Math.abs(c.balance)} prefix={c.balance < 0 ? "−₦" : "₦"} />
        <PaymentFields
          label="Payment status *"
          options={["Paid in full", "Partial", "Unpaid"]}
          paid={d.paid} onPaidChange={v => setD({ ...d, paid: v })}
          paymentDate={d.payment_date} onPaymentDateChange={v => setD({ ...d, payment_date: v })}
          receiptNumber={d.receipt_number} onReceiptChange={v => setD({ ...d, receipt_number: v })}
          receiptLabel="FIRS receipt number"
          showDetails={p => p === "Paid in full" || p === "Partial"}
        />
      </Section>

      <DeclarationSection
        letter="E"
        signatoryName={e.signatory_name} onSignatoryChange={v => setE({ ...e, signatory_name: v })}
        designation={e.designation} onDesignationChange={v => setE({ ...e, designation: v })}
        date={e.date} onDateChange={v => setE({ ...e, date: v })}
      />
    </div>
  );
}
