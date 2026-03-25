import { Link } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";

const year = new Date().getFullYear();

/** Compact legal links inside the signed-in app shell (above bottom nav on mobile). */
export function LegalStrip() {
  return (
    <footer className="legal-strip">
      <div className="legal-strip__inner">
        <Link
          to="/"
          className="legal-strip__logo"
          aria-label="The My Inner Circle App — welcome page"
        >
          <BrandLogo variant="mark" size="sm" />
        </Link>
        <nav className="legal-strip__links" aria-label="Legal">
          <Link to="/privacy">Privacy</Link>
          <span aria-hidden>·</span>
          <Link to="/terms">Terms</Link>
          <span aria-hidden>·</span>
          <Link to="/guidelines">Guidelines</Link>
        </nav>
        <span className="legal-strip__copy">© {year} The My Inner Circle App</span>
      </div>
      <style>{`
        .legal-strip {
          border-top: 1px solid var(--color-border);
          background: rgba(255, 255, 255, 0.6);
          padding: 0.5rem var(--space-md);
        }
        @media (max-width: 899px) {
          .legal-strip {
            margin-bottom: var(--bottom-nav-h);
          }
        }
        .legal-strip__inner {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.45rem 0.75rem;
          font-size: 0.75rem;
          color: var(--color-ink-muted);
        }
        .legal-strip__logo {
          display: inline-flex;
          line-height: 0;
          text-decoration: none;
          color: inherit;
          margin-right: 0.15rem;
        }
        .legal-strip__logo:hover {
          opacity: 0.9;
        }
        .legal-strip__links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.35rem 0.65rem;
        }
        .legal-strip__links a {
          font-weight: 600;
          color: var(--color-teal-dark);
        }
        .legal-strip__copy {
          width: 100%;
          text-align: center;
          font-size: 0.7rem;
          opacity: 0.9;
        }
        @media (min-width: 600px) {
          .legal-strip__copy {
            width: auto;
            margin-left: 0.35rem;
          }
        }
      `}</style>
    </footer>
  );
}
