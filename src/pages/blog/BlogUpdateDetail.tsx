import { useParams, Link } from "react-router-dom";
import { PageShell, PageHero, ContentSection } from "@/components/eigen/PageShell";
import { articles } from "../marketing/BlogUpdatesNewPage";

const BlogUpdateDetail = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    return (
      <PageShell>
        <PageHero label="BLOG" title="Article not found" subtitle="The article you are looking for does not exist." />
        <ContentSection>
          <Link to="/blog/updates" style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>← Back to updates</Link>
        </ContentSection>
      </PageShell>
    );
  }
  return (
    <PageShell>
      <PageHero label={article.category} title={article.title} subtitle={article.date} />
      <ContentSection>
        <div style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#2A2A2A", margin: "0 0 32px" }}>{article.excerpt}</p>
          <Link to="/blog/updates" style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", textDecoration: "none" }}>← Back to all updates</Link>
        </div>
      </ContentSection>
    </PageShell>
  );
};

export default BlogUpdateDetail;
