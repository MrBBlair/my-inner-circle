import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TIER_LABELS } from "../lib/storage";

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [headline, setHeadline] = useState(user?.directoryHeadline ?? "");
  const [offer, setOffer] = useState(user?.directoryOffer ?? "");
  const [show, setShow] = useState(Boolean(user?.showInDirectory));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setHeadline(user.directoryHeadline ?? "");
    setOffer(user.directoryOffer ?? "");
    setShow(Boolean(user.showInDirectory));
  }, [user]);

  if (!user) return null;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      showInDirectory: show,
      directoryHeadline: headline.trim() || undefined,
      directoryOffer: offer.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tier = TIER_LABELS[user.tier];

  return (
    <div>
      <h1 className="page-title">Your profile</h1>
      <p className="lede">
        Update how you show up in the <Link to="/directory">Inner Circle directory</Link>. Your account email
        is never shown on your public card.
      </p>

      <section className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <h2 className="h-section">Account</h2>
        <p style={{ margin: "0 0 0.25rem" }}>
          <strong>{user.displayName}</strong>
        </p>
        <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--color-ink-muted)" }}>
          Tier: <strong>{tier.label}</strong> — {tier.blurb}
        </p>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.88rem", color: "var(--color-ink-muted)" }}>
          Bio &amp; interests from onboarding: edit flow can be expanded later; for now they appear on your
          directory card when enabled.
        </p>
      </section>

      <section className="surface" style={{ padding: "var(--space-md)" }}>
        <h2 className="h-section">Directory listing</h2>
        <form onSubmit={save}>
          <div className="field">
            <label className="label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
              List me in the Inner Circle directory
            </label>
            <p className="field-hint">Members only see what you enter below plus your display name, bio, and interests.</p>
          </div>
          <div className="field">
            <label className="label" htmlFor="dir-head">
              Headline
            </label>
            <input
              id="dir-head"
              className="input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Postpartum doula · Eastside"
              maxLength={120}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="dir-offer">
              Offer or how to connect
            </label>
            <textarea
              id="dir-offer"
              className="textarea"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="What you’re open to — trades, advice, meetups — without sharing private contact info unless you choose."
              maxLength={400}
            />
          </div>
          {saved && (
            <p role="status" className="save-ok">
              Saved.
            </p>
          )}
          <button type="submit" className="btn btn-primary">
            Save directory settings
          </button>
        </form>
      </section>

      <style>{`
        .h-section {
          font-size: 1.1rem;
          margin: 0 0 var(--space-md);
        }
        .field-hint {
          font-size: 0.85rem;
          color: var(--color-ink-muted);
          margin: 0.35rem 0 0;
        }
        .save-ok {
          color: var(--color-success);
          font-weight: 700;
          margin: 0 0 var(--space-sm);
        }
      `}</style>
    </div>
  );
}
