import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getReports, saveReports } from "../lib/storage";

export function ModerationPage() {
  const { user } = useAuth();
  const [, bump] = useState(0);

  if (!user) return null;
  if (!user.isModerator) return <Navigate to="/app" replace />;

  const reports = getReports();

  const resolve = (id: string) => {
    const next = getReports().map((r) =>
      r.id === id ? { ...r, status: "resolved" as const } : r,
    );
    saveReports(next);
    bump((n) => n + 1);
  };

  const open = reports.filter((r) => r.status === "open");

  return (
    <div>
      <h1 className="page-title">Moderation queue</h1>
      <p className="lede">
        Reports submitted by members. In production, connect this view to your backend, audit log,
        and escalation policy. Never share reporter identities publicly.
      </p>

      {open.length === 0 ? (
        <div className="empty-state">No open reports — the circle is quiet.</div>
      ) : (
        <ul className="mod-list">
          {open.map((r) => (
            <li key={r.id} className="surface mod-item">
              <div className="mod-meta">
                <span className="tag tag-teal">{r.targetType}</span>
                <span className="mod-id">Target: {r.targetId}</span>
              </div>
              <p style={{ margin: "0.5rem 0" }}>
                <strong>Reason:</strong> {r.reason}
              </p>
              <p style={{ fontSize: "0.88rem", color: "var(--color-ink-muted)", margin: 0 }}>
                Reported by {r.reporterName} · {new Date(r.createdAt).toLocaleString()}
              </p>
              <button type="button" className="btn btn-primary mod-action" onClick={() => resolve(r.id)}>
                Mark reviewed
              </button>
            </li>
          ))}
        </ul>
      )}

      {reports.some((r) => r.status === "resolved") && (
        <section style={{ marginTop: "var(--space-xl)" }} aria-labelledby="resolved-heading">
          <h2 id="resolved-heading" style={{ fontSize: "1.05rem", color: "var(--color-ink-muted)" }}>
            Recently resolved
          </h2>
          <ul className="mod-list mod-list--muted">
            {reports
              .filter((r) => r.status === "resolved")
              .slice(0, 8)
              .map((r) => (
                <li key={r.id} className="mod-item-resolved">
                  {r.reason} · {r.targetType} · {new Date(r.createdAt).toLocaleDateString()}
                </li>
              ))}
          </ul>
        </section>
      )}

      <style>{`
        .mod-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .mod-item {
          padding: var(--space-md);
        }
        .mod-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }
        .mod-id {
          font-size: 0.82rem;
          color: var(--color-ink-muted);
          font-family: ui-monospace, monospace;
        }
        .mod-action {
          margin-top: var(--space-md);
        }
        .mod-list--muted {
          opacity: 0.85;
        }
        .mod-item-resolved {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          padding: 0.35rem 0;
          border-bottom: 1px solid var(--color-border);
        }
      `}</style>
    </div>
  );
}
