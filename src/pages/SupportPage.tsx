import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const DIRECTORY = [
  {
    name: "988 Suicide & Crisis Lifeline",
    detail: "Call or text 988 — 24/7, free, confidential (US).",
    href: "https://988lifeline.org/",
  },
  {
    name: "RAINN National Sexual Assault Hotline",
    detail: "800-656-HOPE (4673) — 24/7 support.",
    href: "https://www.rainn.org/",
  },
  {
    name: "National Domestic Violence Hotline",
    detail: "800-799-SAFE (7233) — safety planning & resources.",
    href: "https://www.thehotline.org/",
  },
  {
    name: "Crisis Text Line",
    detail: "Text HOME to 741741 — trained crisis counselors.",
    href: "https://www.crisistextline.org/",
  },
];

export function SupportPage() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  if (!user) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div>
      <h1 className="page-title">Support &amp; contact</h1>
      <p className="lede">
        Reach the Inner Circle care team for account help, accessibility needs, or moderation
        follow-up. If you or someone else is in immediate danger, use the Resource Directory first.
      </p>

      <div className="support-grid">
        <section className="surface" style={{ padding: "var(--space-lg)" }} aria-labelledby="contact-heading">
          <h2 id="contact-heading" style={{ fontSize: "1.2rem" }}>
            Contact the team
          </h2>
          {sent && (
            <p role="status" className="support-sent">
              Thanks — we’ll respond within two business days. This demo doesn’t send email; wire your
              form to your support inbox in production.
            </p>
          )}
          <form onSubmit={submit}>
            <div className="field">
              <label className="label" htmlFor="subject">
                Topic
              </label>
              <select
                id="subject"
                className="select"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select</option>
                <option value="account">Account / billing</option>
                <option value="moderation">Moderation follow-up</option>
                <option value="accessibility">Accessibility</option>
                <option value="other">Something else</option>
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                className="textarea"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
          </form>
        </section>

        <section className="surface dir-panel" aria-labelledby="dir-heading">
          <h2 id="dir-heading" style={{ fontSize: "1.2rem" }}>
            Resource Directory — immediate support
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--color-ink-muted)" }}>
            These services are independent of Inner Circle. Links open in a new tab.
          </p>
          <ul className="dir-list">
            {DIRECTORY.map((d) => (
              <li key={d.name}>
                <a href={d.href} target="_blank" rel="noreferrer">
                  {d.name}
                </a>
                <p>{d.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <style>{`
        .support-grid {
          display: grid;
          gap: var(--space-lg);
        }
        @media (min-width: 800px) {
          .support-grid {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
        .support-sent {
          background: rgba(197, 221, 217, 0.45);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-sm);
          font-weight: 600;
          color: var(--color-teal-dark);
        }
        .dir-panel {
          padding: var(--space-lg);
          border-left: 4px solid var(--color-blush);
        }
        .dir-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .dir-list li {
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--color-border);
        }
        .dir-list li:last-child {
          border-bottom: none;
        }
        .dir-list a {
          font-weight: 700;
        }
        .dir-list p {
          margin: 0.35rem 0 0;
          font-size: 0.92rem;
          color: var(--color-ink-muted);
        }
      `}</style>
    </div>
  );
}
