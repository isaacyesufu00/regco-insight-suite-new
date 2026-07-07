import { T } from "./tokens";

export type NumberedEntry = { title: string; body: string };

export default function NumberedList({ entries }: { entries: NumberedEntry[] }) {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      {entries.map((e, i) => (
        <div key={i}>
          {i > 0 && (
            <div style={{ height: 1, background: T.border, margin: "48px 0" }} />
          )}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: T.red,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                color: T.white,
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              {e.title}
            </div>
            <div style={{ color: T.whiteDim, fontSize: 16, lineHeight: 1.6 }}>
              {e.body}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
