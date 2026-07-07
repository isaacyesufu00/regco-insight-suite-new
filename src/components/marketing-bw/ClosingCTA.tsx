import { Link } from "react-router-dom";
import { T } from "./tokens";

export default function ClosingCTA({
  headline,
  subheadline,
  id,
}: {
  headline: string;
  subheadline: string;
  id?: string;
}) {
  return (
    <section
      data-section
      id={id}
      style={{
        background: T.blackPure,
        padding: "140px 24px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: "-1.2px",
          lineHeight: 1.05,
          color: T.white,
          maxWidth: 620,
          margin: "0 auto",
        }}
      >
        {headline}
      </h2>
      <p
        style={{
          marginTop: 20,
          color: T.whiteDim,
          fontSize: 17,
          maxWidth: 520,
          marginInline: "auto",
        }}
      >
        {subheadline}
      </p>
      <div style={{ marginTop: 40 }}>
        <Link
          to="/book-demo"
          style={{
            background: T.red,
            color: T.white,
            borderRadius: 4,
            padding: "14px 32px",
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
            transition: "background 150ms ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = T.redHover)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = T.red)}
        >
          Book a Demo
        </Link>
      </div>
    </section>
  );
}
