import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { avatarToneClass, displayInitials } from "../lib/forumHelpers";
import { getDirectorySpotlights, getUsers, hasApprovedMembership } from "../lib/storage";
import type { UserProfile } from "../types";

export function DirectoryPage() {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!user) return null;

  const spotlights = useMemo(() => getDirectorySpotlights(), []);

  const members = useMemo(() => {
    return Object.values(getUsers()).filter(
      (u: UserProfile) =>
        u.onboardingComplete && u.showInDirectory && hasApprovedMembership(u),
    ) as UserProfile[];
  }, [user.showInDirectory]);

  const toggleCard = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h1 className="page-title">Inner Circle directory</h1>
      <p className="lede">
        Members who opt in appear below. Use <strong>Expand</strong> / <strong>Collapse</strong> on each row for full
        contact details and profile information. Update your listing anytime in <Link to="/profile">Profile</Link>. We
        also spotlight trusted groups further down.
      </p>

      <div className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <p style={{ margin: 0 }}>
          <strong>Your listing:</strong>{" "}
          {user.showInDirectory ? (
            <>You’re visible in the member list. </>
          ) : (
            <>You’re not listed yet. </>
          )}
          <Link to="/profile">Edit profile &amp; directory settings →</Link>
        </p>
      </div>

      <section style={{ marginBottom: "var(--space-xl)" }} aria-labelledby="spotlight-heading">
        <h2 id="spotlight-heading" className="h-section">
          Spotlight groups &amp; circles
        </h2>
        <div className="card-list">
          {spotlights.map((s) => (
            <article key={s.id} className="surface" style={{ padding: "var(--space-md)" }}>
              <span className="tag tag-teal">Spotlight</span>
              <h3 style={{ margin: "0.5rem 0 0.35rem", fontSize: "1.15rem" }}>{s.name}</h3>
              <p style={{ fontWeight: 600, margin: "0 0 0.35rem", color: "var(--color-purple)" }}>
                {s.headline}
              </p>
              <p style={{ margin: "0 0 0.5rem", color: "var(--color-ink-muted)" }}>{s.description}</p>
              <p className="pill-row" style={{ marginBottom: "0.5rem" }}>
                {s.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </p>
              {s.linkUrl && s.linkLabel && (
                <a href={s.linkUrl} className="btn btn-secondary" target="_blank" rel="noreferrer">
                  {s.linkLabel}
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="members-heading">
        <h2 id="members-heading" className="h-section">
          Members in the directory
        </h2>
        {members.length === 0 ? (
          <div className="empty-state">
            No member listings yet. Turn on visibility in <Link to="/profile">Profile</Link> after you’ve completed
            registration.
          </div>
        ) : (
          <div className="card-list dir-member-list">
            {members.map((m) => {
              const open = expandedId === m.id;
              const panelId = `dir-member-panel-${m.id}`;
              const triggerId = `dir-member-trigger-${m.id}`;
              return (
                <article
                  key={m.id}
                  className={"surface dir-member-card" + (open ? " dir-member-card--open" : "")}
                  data-self={m.id === user.id ? true : undefined}
                >
                  {m.backgroundImageDataUrl ? (
                    <div
                      className="dir-member-card__cover"
                      style={{ backgroundImage: `url(${m.backgroundImageDataUrl})` }}
                      aria-hidden
                    />
                  ) : null}
                  <button
                    type="button"
                    id={triggerId}
                    className="dir-member-card__trigger"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggleCard(m.id)}
                  >
                    <span className="dir-member-card__trigger-main">
                      <span className="dir-member-card__chevron" aria-hidden>
                        {open ? "▼" : "▶"}
                      </span>
                      <span
                        className={
                          "dir-member-card__avatar" +
                          (m.profileImageDataUrl ? " dir-member-card__avatar--photo" : ` ${avatarToneClass(m.displayName)}`)
                        }
                        aria-hidden
                      >
                        {m.profileImageDataUrl ? <img src={m.profileImageDataUrl} alt="" /> : displayInitials(m.displayName)}
                      </span>
                      <span className="dir-member-card__trigger-text">
                        <span className="dir-member-card__name-row">
                          <span className="dir-member-card__name">{m.displayName}</span>
                          {m.id === user.id ? (
                            <span className="tag tag-teal" style={{ marginLeft: "0.35rem" }}>
                              You
                            </span>
                          ) : null}
                        </span>
                        {m.directoryHeadline ? (
                          <span className="dir-member-card__headline">{m.directoryHeadline}</span>
                        ) : (
                          <span className="dir-member-card__headline dir-member-card__headline--muted">
                            Member of the Inner Circle
                          </span>
                        )}
                        <span className="dir-member-card__hint">
                          {open ? "Collapse details" : "Expand for full details"}
                        </span>
                      </span>
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={"dir-member-card__collapse" + (open ? " dir-member-card__collapse--open" : "")}
                  >
                    <div className="dir-member-card__collapse-inner" {...(!open ? { inert: true as const } : {})}>
                      <div
                        className="dir-contact"
                        style={{
                          display: "grid",
                          gap: "0.65rem",
                          fontSize: "0.95rem",
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          <strong>Email:</strong>{" "}
                          <a href={`mailto:${m.email}`}>{m.email}</a>
                        </p>
                        <p style={{ margin: 0 }}>
                          <strong>Phone:</strong>{" "}
                          {m.phone?.trim() ? (
                            <a href={`tel:${m.phone.replace(/\s/g, "")}`}>{m.phone}</a>
                          ) : (
                            <span style={{ color: "var(--color-ink-muted)" }}>—</span>
                          )}
                        </p>
                        <p style={{ margin: 0, whiteSpace: "pre-line" }}>
                          <strong>Address:</strong>{" "}
                          {m.address?.trim() ? (
                            m.address.trim()
                          ) : (
                            <span style={{ color: "var(--color-ink-muted)" }}>—</span>
                          )}
                        </p>
                        {m.city?.trim() ? (
                          <p style={{ margin: 0 }}>
                            <strong>City:</strong> {m.city.trim()}
                          </p>
                        ) : null}
                        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-ink-muted)" }}>
                          <strong>Member since:</strong>{" "}
                          <time dateTime={m.createdAt}>{new Date(m.createdAt).toLocaleDateString()}</time>
                        </p>
                      </div>

                      {m.directoryOffer ? (
                        <p style={{ margin: "0.85rem 0 0", color: "var(--color-ink-muted)" }}>
                          <strong style={{ color: "var(--color-ink)" }}>How to connect:</strong> {m.directoryOffer}
                        </p>
                      ) : null}

                      {(m.interests ?? []).length > 0 ? (
                        <div style={{ marginTop: "0.85rem" }}>
                          <strong style={{ fontSize: "0.88rem" }}>Interests</strong>
                          <p className="pill-row" style={{ margin: "0.35rem 0 0" }}>
                            {(m.interests ?? []).map((i) => (
                              <span key={i} className="tag">
                                {i}
                              </span>
                            ))}
                          </p>
                        </div>
                      ) : null}

                      {m.bio ? (
                        <p style={{ margin: "0.85rem 0 0", fontSize: "0.92rem", color: "var(--color-ink-muted)" }}>
                          <strong style={{ color: "var(--color-ink)" }}>Bio:</strong> {m.bio}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <style>{`
        .h-section {
          font-size: 1.15rem;
          margin: 0 0 var(--space-md);
        }
        .dir-member-card {
          padding: 0;
          overflow: hidden;
          text-align: left;
          width: 100%;
          border-radius: var(--radius-md);
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
        }
        .dir-member-card:hover {
          border-color: var(--color-teal-soft);
          box-shadow: var(--shadow-soft);
        }
        .dir-member-card--open {
          border-color: var(--color-teal);
          box-shadow: var(--shadow-soft);
        }
        .dir-member-card__trigger {
          display: block;
          width: 100%;
          margin: 0;
          padding: var(--space-md);
          border: none;
          background: transparent;
          font: inherit;
          text-align: left;
          cursor: pointer;
          color: inherit;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
        }
        .dir-member-card__trigger:hover {
          background: rgba(107, 63, 160, 0.04);
        }
        .dir-member-card__trigger:focus {
          outline: none;
        }
        .dir-member-card__trigger:focus-visible {
          outline: 2px solid var(--color-teal-dark);
          outline-offset: -2px;
        }
        .dir-member-card__trigger-main {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
        }
        .dir-member-card__cover {
          height: 6.5rem;
          background-size: cover;
          background-position: center;
          border-bottom: 1px solid var(--color-border);
        }
        .dir-member-card__chevron {
          flex-shrink: 0;
          width: 1.25rem;
          font-size: 0.75rem;
          line-height: 1.5;
          color: var(--color-purple);
          font-weight: 800;
          margin-top: 0.15rem;
        }
        .dir-member-card__avatar {
          flex-shrink: 0;
          width: 2.6rem;
          height: 2.6rem;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 800;
          border: 2px solid var(--color-bg-elevated);
        }
        .dir-member-card__avatar--photo {
          background: var(--color-surface);
          border-color: var(--color-border);
        }
        .dir-member-card__avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .dir-member-card__trigger-text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
        }
        .dir-member-card__name-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.25rem;
        }
        .dir-member-card__name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-ink);
        }
        .dir-member-card__headline {
          font-weight: 700;
          color: var(--color-teal-dark);
          font-size: 0.95rem;
          line-height: 1.35;
        }
        .dir-member-card__headline--muted {
          font-weight: 500;
          color: var(--color-ink-muted);
        }
        .dir-member-card__hint {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-purple);
          margin-top: 0.15rem;
        }
        .dir-member-card__collapse {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.32s ease;
        }
        .dir-member-card__collapse--open {
          grid-template-rows: 1fr;
        }
        .dir-member-card__collapse-inner {
          overflow: hidden;
          min-height: 0;
          padding: 0 var(--space-md);
        }
        .dir-member-card__collapse--open .dir-member-card__collapse-inner {
          padding: 0 var(--space-md) var(--space-md);
          border-top: 1px solid var(--color-border);
          padding-top: var(--space-md);
          margin-top: 0;
        }
        .dir-member-card .dir-member-card__collapse-inner a {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
