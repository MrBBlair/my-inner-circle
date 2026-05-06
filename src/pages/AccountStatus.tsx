import { Link, Navigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import { hasApprovedMembership } from "../lib/storage";

export function AccountStatus() {
  const { user, logout, refreshUser } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (hasApprovedMembership(user)) {
    if (user.onboardingComplete) return <Navigate to="/app" replace />;
    return <Navigate to="/onboarding" replace />;
  }

  const status = user.memberApprovalStatus ?? "pending";

  return (
    <div className="auth-page">
      <div className="auth-card surface">
        <Link to="/" className="auth-brand" aria-label="My Inner Circle — home">
          <BrandLogo variant="full" size="sm" />
        </Link>
        {status === "pending" ? (
          <>
            <h1>Membership pending</h1>
            <p className="lede">
              Your account is logged in, but a site administrator has not approved your membership yet. You will be able
              to use the full app after approval. This page will update when you refresh — or sign out and sign in again
              later.
            </p>
            <p className="auth-legal">
              Signed in as <strong>{user.email}</strong>
            </p>
            <button type="button" className="btn btn-secondary auth-row" onClick={() => refreshUser()}>
              Refresh status
            </button>
            <button type="button" className="btn btn-primary auth-row" onClick={() => logout()}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <h1>Membership not approved</h1>
            <p className="lede">
              Your application was not approved for access at this time. If you believe this is a mistake, please reach
              out through our contact page.
            </p>
            <p className="auth-legal">
              Signed in as <strong>{user.email}</strong>
            </p>
            <Link to="/contact" className="btn btn-secondary auth-row">
              Contact us
            </Link>
            <button type="button" className="btn btn-primary auth-row" onClick={() => logout()}>
              Sign out
            </button>
          </>
        )}
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
        .auth-row {
          width: 100%;
          margin-top: var(--space-sm);
        }
        .auth-row:first-of-type {
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
