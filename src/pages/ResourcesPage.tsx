import { useAuth } from "../context/AuthContext";
import { DEFAULT_ANNOUNCEMENTS } from "../lib/seed";
import type { ResourceDoc } from "../types";

const LIBRARY: ResourceDoc[] = [
  {
    id: "r1",
    title: "Circle safety & privacy basics",
    description: "How we handle reports, DMs policy, and what stays in the room.",
    type: "pdf",
    url: "#",
  },
  {
    id: "r2",
    title: "Consent-forward sharing worksheet",
    description: "Prompts for posting vulnerably while protecting your story.",
    type: "pdf",
    url: "#",
  },
  {
    id: "r3",
    title: "Negotiation phrases that feel grounded",
    description: "Short scripts for career conversations — Bloom+ resource.",
    type: "pdf",
    url: "#",
  },
  {
    id: "r4",
    title: "Partner toolkit: crisis language",
    description: "Inner Circle: language for asking for help and supporting others.",
    type: "link",
    url: "https://www.samhsa.gov/find-help",
  },
];

export function ResourcesPage() {
  const { user } = useAuth();
  if (!user) return null;

  const tierOk = user.tier === "bloom" || user.tier === "inner_circle";

  return (
    <div>
      <h1 className="page-title">Resources &amp; announcements</h1>
      <p className="lede">
        Curated PDFs and links from the Inner Circle team. Bloom and Inner Circle tiers unlock the
        full library; announcements stay visible in the desktop sidebar too.
      </p>

      <section aria-labelledby="library-heading">
        <h2 id="library-heading" style={{ fontSize: "1.2rem" }}>
          Support library
        </h2>
        <div className="card-list">
          {LIBRARY.map((doc, index) => {
            const locked = index >= 2 && !tierOk;
            return (
              <article key={doc.id} className="surface" style={{ padding: "var(--space-md)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                  <h3 style={{ margin: 0, flex: "1 1 200px" }}>{doc.title}</h3>
                  <span className="tag tag-teal">{doc.type === "pdf" ? "PDF" : "Link"}</span>
                </div>
                <p style={{ color: "var(--color-ink-muted)" }}>{doc.description}</p>
                {locked ? (
                  <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-purple)" }}>
                    Included with Bloom or Inner Circle — upgrade your tier to open this item.
                  </p>
                ) : doc.type === "pdf" ? (
                  <a className="btn btn-secondary" href={doc.url} onClick={(e) => e.preventDefault()}>
                    View PDF (demo)
                  </a>
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
