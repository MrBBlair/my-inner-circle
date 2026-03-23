import { Link } from "react-router-dom";

const cards = [
  {
    to: "/give",
    title: "Give & receive",
    desc: "Donate clothes and essentials, or offer neighborly services.",
    icon: "🎁",
  },
  {
    to: "/directory",
    title: "Inner Circle directory",
    desc: "Members and spotlight groups who chose to be visible.",
    icon: "📇",
  },
  {
    to: "/vendors",
    title: "Vendor space",
    desc: "Black-owned and aligned businesses trusted by the circle.",
    icon: "🛍",
  },
  {
    to: "/profile",
    title: "Your profile",
    desc: "Opt into the directory and tune your public card.",
    icon: "✦",
  },
];

export function CommunityHubPage() {
  return (
    <div>
      <h1 className="page-title">Circle hub</h1>
      <p className="lede">
        Give, connect, and support — everything that happens beyond the neighborhood feed lives here.
      </p>
      <div className="hub-grid">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="hub-card surface">
            <span className="hub-card__icon" aria-hidden>
              {c.icon}
            </span>
            <h2 className="hub-card__title">{c.title}</h2>
            <p className="hub-card__desc">{c.desc}</p>
            <span className="hub-card__cta">Open →</span>
          </Link>
        ))}
      </div>
      <p style={{ marginTop: "var(--space-xl)", fontSize: "0.92rem" }}>
        <Link to="/resources">Library</Link>
        {" · "}
        <Link to="/support">Support</Link>
        {" · "}
        <Link to="/app">Home feed</Link>
      </p>
      <style>{`
        .hub-grid {
          display: grid;
          gap: var(--space-md);
          grid-template-columns: 1fr;
        }
        @media (min-width: 560px) {
          .hub-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .hub-card {
          display: block;
          padding: var(--space-lg);
          text-decoration: none;
          color: inherit;
          border-radius: var(--radius-md);
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .hub-card:hover {
          border-color: var(--color-teal-soft);
          box-shadow: var(--shadow-soft);
        }
        .hub-card__icon {
          font-size: 1.75rem;
          display: block;
          margin-bottom: var(--space-sm);
        }
        .hub-card__title {
          font-size: 1.15rem;
          margin: 0 0 0.35rem;
        }
        .hub-card__desc {
          margin: 0 0 var(--space-sm);
          font-size: 0.95rem;
          color: var(--color-ink-muted);
          line-height: 1.5;
        }
        .hub-card__cta {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--color-teal-dark);
        }
      `}</style>
    </div>
  );
}
