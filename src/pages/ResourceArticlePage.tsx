import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSupportLibraryArticle } from "../content/supportLibrary";

const BODY_PRINT_CLASS = "print-support-guide";

export function ResourceArticlePage() {
  const { user } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getSupportLibraryArticle(slug) : undefined;

  useEffect(() => {
    document.body.classList.add(BODY_PRINT_CLASS);
    return () => document.body.classList.remove(BODY_PRINT_CLASS);
  }, []);

  if (!user) return null;
  if (!article) return <Navigate to="/resources" replace />;

  const printPdf = () => {
    window.print();
  };

  return (
    <div className="resource-article">
      <div className="resource-article__toolbar no-print">
        <Link to="/resources" className="btn btn-secondary">
          ← Back to library
        </Link>
        <button type="button" className="btn btn-primary" onClick={printPdf}>
          Print / save as PDF
        </button>
      </div>

      <article className="surface resource-article__body" aria-labelledby="resource-article-title">
        <header className="resource-article__header">
          <h1 id="resource-article-title" className="page-title" style={{ marginBottom: "0.5rem" }}>
            {article.title}
          </h1>
          <p className="lede" style={{ marginTop: 0 }}>
            {article.description}
          </p>
          <p className="resource-article__print-hint no-print" style={{ fontSize: "0.88rem", color: "var(--color-ink-muted)" }}>
            Opens your browser’s print dialog — choose “Save as PDF” if you want a file.
          </p>
        </header>

        {article.sections.map((section) => (
          <section key={section.heading} className="resource-article__section">
            <h2 style={{ fontSize: "1.15rem", marginTop: "var(--space-lg)", marginBottom: "var(--space-sm)" }}>
              {section.heading}
            </h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} style={{ lineHeight: 1.55, color: "var(--color-ink)" }}>
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>

      <style>{`
        .resource-article__toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
          align-items: center;
          margin-bottom: var(--space-md);
        }
        .resource-article__body {
          padding: var(--space-lg);
          max-width: 40rem;
        }
      `}</style>
    </div>
  );
}
