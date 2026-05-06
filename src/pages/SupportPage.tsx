import { useState, type FormEvent } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { pushAdminNotification } from "../lib/storage";

type PanelId = "prayer" | "talk" | "contact" | "directory";

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

const PANEL_SUMMARY: Record<PanelId, string> = {
  prayer: "Share an intention for the circle to hold — opens an email draft.",
  talk: "Request a listener — explain what you’re navigating and when to reply.",
  contact: "Account, moderation, accessibility, or general message to the team.",
  directory: "988, RAINN, crisis text, and other immediate resources (external).",
};

export function SupportPage() {
  const { user } = useAuth();
  const [open, setOpen] = useState<PanelId | null>(null);
  const [sent, setSent] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  if (!user) return null;

  const toggle = (id: PanelId) => {
    setOpen((current) => (current === id ? null : id));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    pushAdminNotification({
      kind: "support_message",
      title: "New support message",
      body: `${user.displayName} sent a ${subject || "support"} message: ${message.trim().slice(0, 140)}`,
      actorId: user.id,
      actorName: user.displayName,
      href: "/support",
    });
    setSent(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  const panel = (id: PanelId, title: string, triggerId: string, panelId: string, children: ReactNode) => {
    const isOpen = open === id;
    return (
      <section className="surface support-panel">
        <button
          type="button"
          id={triggerId}
          className="support-panel__trigger"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => toggle(id)}
        >
          <span className="support-panel__trigger-text">
            <span className="support-panel__trigger-title">{title}</span>
            <span className="support-panel__trigger-summary">{PANEL_SUMMARY[id]}</span>
          </span>
          <span className={"support-panel__chevron" + (isOpen ? " support-panel__chevron--open" : "")} aria-hidden />
        </button>
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          hidden={!isOpen}
          className="support-panel__content"
        >
          {children}
        </div>
      </section>
    );
  };

  return (
    <div className="support-page">
      <h1 className="page-title">Support &amp; contact</h1>
      <p className="lede">
        Reach the Inner Circle care team for account help, accessibility needs, or moderation follow-up. If you or
        someone else is in immediate danger, open <strong>Resource directory</strong> first.
      </p>

      <div className="support-accordion">
        {panel(
          "prayer",
          "Prayer request",
          "support-trigger-prayer",
          "support-panel-prayer",
          <>
            <p className="support-panel__intro">
              Share a first name plus the intention you&apos;d like the circle to hold gently. Tapping send opens an
              email draft for your care team inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = String(fd.get("pname") || "");
                const ask = String(fd.get("pray") || "");
                pushAdminNotification({
                  kind: "support_message",
                  title: "New prayer request",
                  body: `${user.displayName} submitted a prayer request for ${name.trim() || "the circle"}.`,
                  actorId: user.id,
                  actorName: user.displayName,
                  href: "/support",
                });
                const subj = encodeURIComponent(`Prayer request — Inner Circle (${name.trim()})`);
                const body = encodeURIComponent(`${ask.trim()}\n\n— Sent from Inner Circle support form`);
                window.location.href = `mailto:contact@innercircle.local?subject=${subj}&body=${body}`;
              }}
            >
              <div className="field">
                <label className="label" htmlFor="pname">
                  Preferred name / initials
                </label>
                <input id="pname" name="pname" className="input" required />
              </div>
              <div className="field">
                <label className="label" htmlFor="pray">
                  Prayer or praise
                </label>
                <textarea id="pray" name="pray" className="textarea" required />
              </div>
              <button type="submit" className="btn btn-secondary">
                Open email draft to care team
              </button>
            </form>
          </>
        )}

        {panel(
          "talk",
          "Someone to talk to",
          "support-trigger-talk",
          "support-panel-talk",
          <>
            <p className="support-panel__intro">
              Trained moderator coverage can pair you with volunteer listeners depending on staffing. Explain what
              you&apos;re navigating and safest times to reply.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = String(fd.get("talkname") || "");
                const story = String(fd.get("talkbody") || "");
                const preferred = String(fd.get("talkwhen") || "");
                pushAdminNotification({
                  kind: "support_message",
                  title: "Listener callback requested",
                  body: `${user.displayName} requested a listener callback. Best times: ${preferred.trim() || "not provided"}.`,
                  actorId: user.id,
                  actorName: user.displayName,
                  href: "/support",
                });
                const subj = encodeURIComponent(`Need to talk — ${name.trim()}`);
                const body = encodeURIComponent(`${story.trim()}\n\nBest times to reply: ${preferred}`);
                window.location.href = `mailto:contact@innercircle.local?subject=${subj}&body=${body}`;
              }}
            >
              <div className="field">
                <label className="label" htmlFor="talkname">
                  Preferred name / initials
                </label>
                <input id="talkname" name="talkname" className="input" required />
              </div>
              <div className="field">
                <label className="label" htmlFor="talkbody">
                  Context (no medical claims)
                </label>
                <textarea id="talkbody" name="talkbody" className="textarea" required />
              </div>
              <div className="field">
                <label className="label" htmlFor="talkwhen">
                  Best contact windows / time zone
                </label>
                <input id="talkwhen" name="talkwhen" className="input" required placeholder="Weeknights EST after 7pm …" />
              </div>
              <button type="submit" className="btn btn-primary">
                Request a listener callback
              </button>
            </form>
          </>
        )}

        {panel(
          "contact",
          "Contact the team",
          "support-trigger-contact",
          "support-panel-contact",
          <>
            {sent && (
              <p role="status" className="support-sent">
                Thanks — we’ll respond within two business days. This demo doesn’t send email; wire your form to your
                support inbox in production.
              </p>
            )}
            <p className="support-panel__intro">
              Questions about your account, moderation decisions, or accessibility — we typically reply within two
              business days.
            </p>
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
          </>
        )}

        {panel(
          "directory",
          "Resource directory",
          "support-trigger-directory",
          "support-panel-directory",
          <>
            <p className="support-panel__intro">
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
          </>
        )}
      </div>

      <style>{`
        .support-page .support-accordion {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          margin-top: var(--space-lg);
          max-width: 36rem;
        }
        .support-panel {
          padding: 0;
          overflow: hidden;
          text-align: left;
        }
        .support-panel__trigger {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          margin: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          font: inherit;
          text-align: left;
          color: inherit;
          border-radius: var(--radius-md);
          transition: background 0.15s ease;
        }
        .support-panel__trigger:hover {
          background: rgba(255, 255, 255, 0.35);
        }
        .support-panel__trigger:focus-visible {
          outline: 2px solid var(--color-teal);
          outline-offset: 2px;
        }
        .support-panel__trigger-text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
        }
        .support-panel__trigger-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-ink);
        }
        .support-panel__trigger-summary {
          font-size: 0.88rem;
          line-height: 1.45;
          color: var(--color-ink-muted);
        }
        .support-panel__chevron {
          flex-shrink: 0;
          width: 1.5rem;
          height: 1.5rem;
          margin-top: 0.15rem;
          position: relative;
        }
        .support-panel__chevron::before {
          content: "";
          position: absolute;
          inset: 0;
          margin: auto;
          width: 0.45rem;
          height: 0.45rem;
          border-right: 2px solid var(--color-teal-dark);
          border-bottom: 2px solid var(--color-teal-dark);
          transform: rotate(45deg);
          transition: transform 0.2s ease;
        }
        .support-panel__chevron--open::before {
          transform: rotate(-135deg);
          margin-top: 0.35rem;
        }
        .support-panel__content {
          padding: 0 var(--space-lg) var(--space-lg);
          border-top: 1px solid var(--color-border);
        }
        .support-panel__content[hidden] {
          display: none !important;
        }
        .support-panel__intro {
          font-size: 0.95rem;
          color: var(--color-ink-muted);
          margin: var(--space-md) 0 var(--space-md);
          line-height: 1.5;
        }
        .support-sent {
          background: rgba(235, 224, 247, 0.55);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-sm);
          font-weight: 600;
          color: var(--color-teal-dark);
          margin: var(--space-md) 0 0;
        }
        .support-page .dir-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .support-page .dir-list li {
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--color-border);
        }
        .support-page .dir-list li:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .support-page .dir-list a {
          font-weight: 700;
        }
        .support-page .dir-list p {
          margin: 0.35rem 0 0;
          font-size: 0.92rem;
          color: var(--color-ink-muted);
        }
      `}</style>
    </div>
  );
}
