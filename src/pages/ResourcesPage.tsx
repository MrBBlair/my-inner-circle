import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SUPPORT_LIBRARY_INDEX } from "../content/supportLibrary";
import { DEFAULT_ANNOUNCEMENTS } from "../lib/seed";

export function ResourcesPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <h1 className="page-title">Resources &amp; announcements</h1>
      <p className="lede">
        Guides you read here on the site, plus trusted external links. Use{" "}
        <strong>Print / save as PDF</strong> on any guide if you want a copy. Announcements stay visible in the
        desktop sidebar too.
      </p>

      <section aria-labelledby="library-heading">
        <h2 id="library-heading" style={{ fontSize: "1.2rem" }}>
          Support library
        </h2>
        <div className="card-list">
          {SUPPORT_LIBRARY_INDEX.map((doc) => {
            return (
              <article key={doc.id} className="surface" style={{ padding: "var(--space-md)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                  <h3 style={{ margin: 0, flex: "1 1 200px" }}>{doc.title}</h3>
                  <span className="tag tag-teal">{doc.type === "guide" ? "Guide" : "External link"}</span>
                </div>
                <p style={{ color: "var(--color-ink-muted)" }}>{doc.description}</p>
                {doc.type === "guide" && doc.slug ? (
                  <Link className="btn btn-primary" to={`/resources/${doc.slug}`}>
                    Open guide
                  </Link>
                ) : (
                  <a className="btn btn-primary" href={doc.url} target="_blank" rel="noreferrer">
                    Open resource
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section style={{ marginTop: "var(--space-xl)" }} aria-labelledby="ann-heading">
        <h2 id="ann-heading" style={{ fontSize: "1.2rem" }}>
          All announcements
        </h2>
        <ul className="ann-list">
          {DEFAULT_ANNOUNCEMENTS.map((a) => (
            <li key={a.id} className="surface ann-item">
              {a.pinned && <span className="tag tag-teal">Pinned</span>}
              <h3 style={{ margin: "0.35rem 0" }}>{a.title}</h3>
              <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>{a.body}</p>
              <time dateTime={a.dateISO} style={{ fontSize: "0.82rem", color: "var(--color-ink-muted)" }}>
                {new Date(a.dateISO).toLocaleDateString()}
              </time>
            </li>
          ))}
        </ul>
      </section>

      <style>{`
        .ann-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .ann-item {
          padding: var(--space-md);
        }
      `}</style>
    </div>
  );
}
