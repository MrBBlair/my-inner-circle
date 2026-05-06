import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import { hasApprovedMembership } from "../lib/storage";
export function Signup() {
  const { user, signup, enterPreview } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthdateISO, setBirthdateISO] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user && !hasApprovedMembership(user)) return <Navigate to="/account-status" replace />;
  if (user?.onboardingComplete) return <Navigate to="/app" replace />;
  if (user && !user.onboardingComplete) return <Navigate to="/onboarding" replace />;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = signup({
      email,
      password,
      displayName,
      phone,
      address,
      birthdateISO,
    });
    if (!res.ok) setError(res.message ?? "Could not create account.");
    else nav("/signup/thanks", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card surface">
        <Link to="/" className="auth-brand" aria-label="My Inner Circle — home">
          <BrandLogo variant="full" size="sm" />
        </Link>
        <h1>Join the Circle</h1>
        <p className="lede">
          Membership is free. Tell us how to reach you — a site administrator will review new applications before you
          can use the full community. After approval, sign in to finish your profile.
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
              Full name
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
            <label className="label" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              className="input"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              className="textarea"
              rows={3}
              required
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, state, ZIP — as you would share for the member directory"
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="birthdate">
              Birthday
            </label>
            <input
              id="birthdate"
              className="input"
              type="date"
              required
              value={birthdateISO}
              onChange={(e) => setBirthdateISO(e.target.value)}
            />
            <p className="field-hint">
              Helps us personalize celebrations. Stored with your account inside this demo.
            </p>
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
          {error && <p role="alert" className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary auth-submit">
            Submit application
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
        .auth-brand {
          display: flex;
          justify-content: center;
          line-height: 0;
          margin-bottom: var(--space-md);
          text-decoration: none;
          color: inherit;
        }
        .auth-brand:hover {
          opacity: 0.92;
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
