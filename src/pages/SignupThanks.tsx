import { Link } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";

export function SignupThanks() {
  return (
    <div className="auth-page">
      <div className="auth-card surface">
        <Link to="/" className="auth-brand" aria-label="My Inner Circle — home">
          <BrandLogo variant="full" size="sm" />
        </Link>
        <h1>Application received</h1>
        <p className="lede">
          Thank you for applying to join the Inner Circle. A site administrator will review your details and approve
          your account when ready. When you are approved, sign in with the email and password you chose to continue
          profile setup and full access.
        </p>
        <p className="auth-legal">
          Questions? <Link to="/contact">Contact us</Link> or visit <Link to="/guidelines">Community guidelines</Link>.
        </p>
        <Link to="/login" className="btn btn-primary auth-submit">
          Go to sign in
        </Link>
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
        .auth-submit {
          display: block;
          width: 100%;
          margin-top: var(--space-md);
          text-align: center;
          text-decoration: none;
          box-sizing: border-box;
        }
        .auth-back {
          margin-top: var(--space-md);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
