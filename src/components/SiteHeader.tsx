import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrandLogo } from "./BrandLogo";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  "site-header__link" + (isActive ? " site-header__link--active" : "");

export function SiteHeader() {
  const { user } = useAuth();
  const inApp = Boolean(user?.onboardingComplete);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand" aria-label="The My Inner Circle App — home">
          <BrandLogo variant="full" size="sm" />
        </Link>
        <nav className="site-header__nav" aria-label="Site">
          <NavLink to="/guidelines" className={linkClass}>
            Guidelines
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>
        <div className="site-header__actions">
          {inApp ? (
            <Link to="/app" className="btn btn-primary site-header__btn">
              My Circle
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost site-header__btn">
                Sign in
              </Link>
              <Link to="/signup" className="btn btn-primary site-header__btn site-header__btn--cta">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--header-bar-bg);
          backdrop-filter: blur(var(--header-bar-blur));
          -webkit-backdrop-filter: blur(var(--header-bar-blur));
          border-bottom: 1px solid var(--color-border);
        }
        .site-header__inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--header-inner-pad-y) var(--space-md) var(--header-inner-pad-y-bottom);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .site-header__brand {
          text-decoration: none;
          color: inherit;
          flex-shrink: 0;
          overflow: visible;
          display: flex;
          align-items: center;
        }
        .site-header__nav {
          display: none;
          flex: 1;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.15rem 0.5rem;
        }
        @media (min-width: 900px) {
          .site-header__nav {
            display: flex;
          }
        }
        .site-header__link {
          font-weight: 600;
          font-size: 0.88rem;
          color: var(--color-ink-muted);
          text-decoration: none;
          padding: 0.35rem 0.55rem;
          border-radius: 999px;
        }
        .site-header__link:hover {
          color: var(--color-teal-dark);
          background: var(--color-surface);
        }
        .site-header__link--active {
          color: var(--color-teal-dark);
          background: var(--color-teal-soft);
        }
        .site-header__actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-left: auto;
        }
        .site-header__btn {
          font-size: 0.88rem;
          padding: 0.45rem 0.75rem;
        }
        .site-header__btn--cta {
          display: none;
        }
        @media (min-width: 480px) {
          .site-header__btn--cta {
            display: inline-flex;
          }
        }
      `}</style>
    </header>
  );
}
