import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { MembershipTier } from "../types";
import { TIER_LABELS } from "../lib/storage";

const TIERS: MembershipTier[] = ["seedling", "bloom", "inner_circle"];

export function Signup() {
  const { user, signup, enterPreview } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [tier, setTier] = useState<MembershipTier>("bloom");
  const [error, setError] = useState<string | null>(null);

  if (user?.onboardingComplete) return <Navigate to="/app" replace />;
  if (user && !user.onboardingComplete) return <Navigate to="/onboarding" replace />;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = signup({
      email,
      password,
      displayName,
      tier,
    });
    if (!res.ok) setError(res.message ?? "Could not create account.");
  };

  return (
    <div className="auth-page">
      <div className="auth-card surface">
        <h1>Join the Circle</h1>
        <p className="lede">
          Create your account, then we’ll set up your profile — interests, bio, and the rooms you
          want to be part of.
        </p>
        <p className="auth-legal">
          By creating an account you agree to our{" "}
          <Link to="/terms">Terms of use</Link> and <Link to="/privacy">Privacy policy</Link>, and to
          follow our <Link to="/guidelines">Community guidelines</Link>.
        </p>
        <button
          type="button"
          className="btn btn-secondary auth-submit"
          style={{ marginBottom: "var(--space-md)" }}
          onClick={() => {
            enterPreview();
            nav("/app");
          }}
        >
          Enter preview (skip signup)
        </button>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label className="label" htmlFor="displayName">
              Display name
            </label>
            <input
              id="displayName"
              className="input"
              required
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="field-hint">At least 8 characters. Stored locally in this demo only.</p>
          </div>
          <fieldset className="tier-fieldset">
            <legend className="label">Membership tier</legend>
            {TIERS.map((t) => (
              <label key={t} className="tier-option">
                <input
                  type="radio"
                  name="tier"
                  value={t}
                  checked={tier === t}
                  onChange={() => setTier(t)}
                />
                <span>
                  <strong>{TIER_LABELS[t].label}</strong>
                  <span className="tier-blurb">{TIER_LABELS[t].blurb}</span>
                </span>
              </label>
            ))}
          </fieldset>
          {error && <p role="alert" className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary auth-submit">
            Continue to profile setup
          </button>
        </form>
        <p className="auth-switch">
          Already a member? <Link to="/login">Sign in</Link>
        </p>
      </div>
      <Link to="/" className="auth-back">
        ← Back to welcome
      </Link>
      <style>{`
        .auth-page {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg) var(--space-md);
          background: var(--color-bg);
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: var(--space-lg);
        }
        .auth-legal {
          font-size: 0.85rem;
          color: var(--color-ink-muted);
          margin: 0 0 var(--space-md);
          line-height: 1.45;
        }
        .auth-legal a {
          font-weight: 600;
        }
        .field-hint {
          font-size: 0.82rem;
          color: var(--color-ink-muted);
          margin: 0.25rem 0 0;
        }
        .tier-fieldset {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-sm) var(--space-md);
          margin: 0 0 var(--space-md);
        }
        .tier-option {
          display: flex;
          gap: var(--space-sm);
          align-items: flex-start;
          margin-bottom: var(--space-sm);
          cursor: pointer;
          font-size: 0.92rem;
        }
        .tier-option:last-child {
          margin-bottom: 0;
        }
        .tier-blurb {
          display: block;
          color: var(--color-ink-muted);
          font-weight: 400;
          margin-top: 0.15rem;
        }
        .auth-submit {
          width: 100%;
        }
        .auth-error {
          color: #8b3a3a;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .auth-switch {
          margin-top: var(--space-md);
        }
        .auth-back {
          margin-top: var(--space-md);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
