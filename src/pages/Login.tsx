import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { user, login, enterPreview } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: { pathname: string } } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user?.onboardingComplete) {
    const to = loc.state?.from?.pathname ?? "/app";
    return <Navigate to={to} replace />;
  }
  if (user && !user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(email, password);
    if (!res.ok) setError(res.message ?? "Could not sign in.");
  };

  return (
    <div className="auth-page">
      <div className="auth-card surface">
        <Link to="/" className="auth-brand" aria-label="The My Inner Circle App — home">
          <BrandLogo variant="full" size="sm" />
        </Link>
        <h1>Welcome back</h1>
        <p className="lede">Sign in to your circle account.</p>
        <button
          type="button"
          className="btn btn-primary auth-submit auth-preview"
          onClick={() => {
            enterPreview();
            nav("/app");
          }}
        >
          Enter (preview — no login)
        </button>
        <p className="auth-preview-note">Skips email and password for stakeholder walkthroughs.</p>
        <form onSubmit={onSubmit}>
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p role="alert" className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary auth-submit">
            Sign in
          </button>
        </form>
        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
        <p className="auth-demo">
          <strong>Demo moderator:</strong> <code>moderator@innercircle.demo</code> / password{" "}
          <code>circlecare</code> — opens the Moderation queue. New members can sign up with any
          email.
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
          max-width: 400px;
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
        .auth-submit {
          width: 100%;
          margin-top: var(--space-sm);
        }
        .auth-preview {
          margin-top: 0;
        }
        .auth-preview-note {
          margin: 0.35rem 0 var(--space-md);
          font-size: 0.82rem;
          color: var(--color-ink-muted);
          text-align: center;
        }
        .auth-error {
          color: #8b3a3a;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .auth-switch {
          margin-top: var(--space-md);
          font-size: 0.95rem;
        }
        .auth-demo {
          margin-top: var(--space-md);
          font-size: 0.8rem;
          color: var(--color-ink-muted);
        }
        .auth-demo code {
          font-size: 0.78rem;
          word-break: break-all;
        }
        .auth-back {
          margin-top: var(--space-md);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
