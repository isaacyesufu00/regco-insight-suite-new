import { ReactNode } from "react";

export const fmt = (n: number | string | undefined | null) => {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (v === null || v === undefined || isNaN(v as number)) return "0";
  return new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 }).format(v as number);
};

const baseField: React.CSSProperties = {
  width: "100%",
  background: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  color: "#0A0A0A",
  fontFamily: "Inter, sans-serif",
  outline: "none",
};

export function Section({ letter, title, children }: { letter: string; title: string; children: ReactNode }) {
  return (
    <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 24, marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span
          style={{
            width: 24, height: 24, borderRadius: 6,
            background: "#0A0A0A", color: "#FFF",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
          }}
        >{letter}</span>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", letterSpacing: "0.02em", textTransform: "uppercase", margin: 0 }}>
          {title}
        </h3>
      </div>
      <div style={{ display: "grid", gap: 14 }}>{children}</div>
    </div>
  );
}

export function Field({ label, children, hint, cols = 1 }: { label: string; children: ReactNode; hint?: string; cols?: 1 | 2 }) {
  return (
    <div style={{ gridColumn: cols === 2 ? "span 2" : "auto" }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6E6E73", marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: 11, color: "#9B9B9B", margin: "4px 0 0" }}>{hint}</p>}
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{children}</div>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...baseField, ...(props.style || {}) }} />;
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" inputMode="decimal" {...props} style={{ ...baseField, ...(props.style || {}) }} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} style={{ ...baseField, resize: "vertical", ...(props.style || {}) }} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...baseField, appearance: "auto", ...(props.style || {}) }}>{children}</select>;
}

export function YesNo({ value, onChange, name }: { value: string; onChange: (v: string) => void; name: string }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {["Yes", "No"].map((opt) => {
        const selected = value === opt;
        return (
          <label
            key={opt}
            style={{
              flex: 1, textAlign: "center", padding: "9px 12px",
              border: `1px solid ${selected ? "#0A0A0A" : "rgba(0,0,0,0.12)"}`,
              background: selected ? "#0A0A0A" : "#FFF",
              color: selected ? "#FFF" : "#0A0A0A",
              borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500,
              transition: "all 0.15s",
            }}
          >
            <input type="radio" name={name} checked={selected} onChange={() => onChange(opt)} style={{ display: "none" }} />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

export function Computed({ label, value, prefix = "" }: { label: string; value: string | number; prefix?: string }) {
  return (
    <div style={{ background: "#F5F5F0", border: "1px dashed rgba(0,0,0,0.18)", borderRadius: 8, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, color: "#6E6E73", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A", fontVariantNumeric: "tabular-nums" }}>
        {prefix}{typeof value === "number" ? fmt(value) : value}
      </div>
    </div>
  );
}
