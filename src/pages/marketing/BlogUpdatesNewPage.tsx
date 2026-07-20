import { Link } from "react-router-dom";
import { PageShell, PageHero, MAX, T, AccentBar } from "./_shared";

export const articles = [
  {
    slug: "raw-cbs-uploads",
    category: "PRODUCT UPDATE",
    date: "May 2026",
    title: "RegCo now supports raw CBS file uploads from FlexCube and Ncube",
    excerpt: "Compliance officers can now upload their transaction files directly from any core banking system without filling a template. RegCo automatically reads and maps the data.",
  },
  {
    slug: "cbn-mfb-capital-requirements",
    category: "REGULATORY NEWS",
    date: "April 2026",
    title: "CBN updates MFB capital requirements — what it means for your filings",
    excerpt: "The Central Bank recently revised the minimum capital requirements for Microfinance Banks. Here is what changes in your regulatory returns and how RegCo handles it automatically.",
  },
  {
    slug: "customer-360",
    category: "PRODUCT UPDATE",
    date: "March 2026",
    title: "Introducing Customer 360 — see every customer across all channels in one screen",
    excerpt: "Search any customer by BVN or account number and immediately see all their accounts, KYC status, and transaction history — without logging into multiple systems.",
  },
];

export default function BlogUpdatesNewPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Blog"
        title="RegCo Updates"
        sub="Product updates, new features, and regulatory news for regulated financial institutions."
      />
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {articles.map((a) => (
            <Link key={a.slug} to={`/blog/updates/${a.slug}`} style={{ display: "block", background: "#FFFFFF", borderRadius: 8, border: `1px solid ${T.ink14}`, padding: 28, textDecoration: "none", color: "inherit" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <AccentBar color={T.red} />
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.ink66, fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {a.category}
                  <span style={{ color: T.ink26 }}>·</span>
                  <span style={{ fontWeight: 500, letterSpacing: 0 }}>{a.date}</span>
                </span>
              </div>
              <div style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.01em" }}>{a.title}</div>
              <div style={{ color: T.ink99, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>{a.excerpt}</div>
              <div style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, fontWeight: 600, marginTop: 16 }}>Read more →</div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
