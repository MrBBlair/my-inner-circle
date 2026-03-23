import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDirectorySpotlights, getUsers } from "../lib/storage";
import type { UserProfile } from "../types";

export function DirectoryPage() {
  const { user } = useAuth();

  if (!user) return null;

  const spotlights = useMemo(() => getDirectorySpotlights(), []);

  const members = useMemo(() => {
    return Object.values(getUsers()).filter(
      (u: UserProfile) => u.onboardingComplete && u.showInDirectory && u.directoryHeadline?.trim(),
    ) as UserProfile[];
  }, []);

  return (
    <div>
      <h1 className="page-title">Inner Circle directory</h1>
      <p className="lede">
        Discover members who opted in to be visible and trusted groups we spotlight. Your email stays
        private unless you choose to share contact details in your listing.
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
            No member listings yet. Be the first — turn on visibility in{" "}
            <Link to="/profile">Profile</Link>.
          </div>
        ) : (
          <div className="card-list">
            {members.map((m) => (
              <article key={m.id} className="surface" style={{ padding: "var(--space-md)" }} data-self={m.id === user.id ? true : undefined}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                  <h3 style={{ margin: 0, flex: "1 1 200px" }}>{m.displayName}</h3>
                  {m.id === user.id && <span className="tag tag-teal">You</span>}
                </div>
                <p style={{ fontWeight: 700, margin: "0.5rem 0 0.25rem" }}>{m.directoryHeadline}</p>
                {m.directoryOffer && (
                  <p style={{ margin: "0 0 0.5rem", color: "var(--color-ink-muted)" }}>{m.directoryOffer}</p>
                )}
                <p className="pill-row">
                  {(m.interests ?? []).slice(0, 6).map((i) => (
                    <span key={i} className="tag">
                      {i}
                    </span>
                  ))}
                </p>
                {m.bio && (
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.92rem", color: "var(--color-ink-muted)" }}>
                    {m.bio}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .h-section {
          font-size: 1.15rem;
          margin: 0 0 var(--space-md);
        }
      `}</style>
    </div>
  );
}
