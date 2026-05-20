import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { PageShell, PageHero, ContentSection } from "@/components/eigen/PageShell";

const articles = [
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
    excerpt: "The Central Bank of Nigeria recently revised the minimum capital requirements for Microfinance Banks. Here is what changes in your regulatory returns and how RegCo handles it automatically.",
  },
  {
    slug: "customer-360",
    category: "PRODUCT UPDATE",
    date: "March 2026",
    title: "Introducing Customer 360 — see every customer across all channels in one screen",
    excerpt: "Search any customer by BVN or account number and immediately see all their accounts, KYC status, and transaction history — without logging into multiple systems.",
  },
];

const Card = ({ a, i }: { a: typeof articles[number]; i: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.08 }}
    >
      <Link
        to={`/blog/updates/${a.slug}`}
        style={{
          display: "block", background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)",
          padding: 28, textDecoration: "none", color: "inherit", transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.06)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "#0A0A0A", color: "#fff", padding: "4px 10px", borderRadius: 999 }}>{a.category}</span>
          <span style={{ fontSize: 12, color: "#9B9B9B" }}>{a.date}</span>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{a.title}</h3>
        <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.6, margin: "0 0 16px" }}>{a.excerpt}</p>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>Read more →</span>
      </Link>
    </motion.div>
  );
};

const BlogUpdates = () => (
  <PageShell>
    <PageHero label="BLOG" title="RegCo Updates" subtitle="Product updates, new features, and regulatory news for Nigerian financial institutions." />
    <ContentSection>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {articles.map((a, i) => <Card key={a.slug} a={a} i={i} />)}
      </div>
    </ContentSection>
  </PageShell>
);

export default BlogUpdates;
export { articles };
