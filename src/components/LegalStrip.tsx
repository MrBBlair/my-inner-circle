import { Link } from "react-router-dom";

const year = new Date().getFullYear();

/** Compact legal links inside the signed-in app shell (above bottom nav on mobile). */
export function LegalStrip() {
  return (
    <footer className="legal-strip">
      <div className="legal-strip__inner">
        <Link to="/privacy">Privacy</Link>
        <span aria-hidden>·</span>
        <Link to="/terms">Terms</Link>
        <span aria-hidden>·</span>
        <Link to="/guidelines">Guidelines</Link>
        <span className="legal-strip__copy">© {year} The My Inner Circle</span>
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
          gap: 0.35rem 0.65rem;
          font-size: 0.75rem;
          color: var(--color-ink-muted);
        }
        .legal-strip a {
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
            margin-left: 0.5rem;
          }
        }
      `}</style>
    </footer>
  );
}
