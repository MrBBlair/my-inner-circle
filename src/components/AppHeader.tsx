import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrandLogo } from "./BrandLogo";
import { TIER_LABELS } from "../lib/storage";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-desktop__link nav-desktop__link--active" : "nav-desktop__link";

export function AppHeader() {
  const { user, logout } = useAuth();

  if (!user || !user.onboardingComplete) return null;

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/app" className="app-header__brand">
          <span className="app-header__logo-mobile">
            <BrandLogo variant="mark" size="sm" idSuffix="app-m" />
          </span>
          <span className="app-header__logo-desktop">
            <BrandLogo variant="full" size="sm" idSuffix="app-d" />
          </span>
        </Link>
        <nav className="nav-desktop" aria-label="Primary">
          <NavLink to="/app" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/forum" className={navClass}>
            Neighborhood
          </NavLink>
          <NavLink to="/events" className={navClass}>
            Events
          </NavLink>
          <NavLink to="/wellness" className={navClass}>
            Wellness
          </NavLink>
          <NavLink to="/resources" className={navClass}>
            Resources
          </NavLink>
          <NavLink to="/community" className={navClass}>
            Circle
          </NavLink>
          <NavLink to="/support" className={navClass}>
            Support
          </NavLink>
          {user.isModerator && (
            <NavLink to="/moderation" className={navClass}>
              Moderation
            </NavLink>
          )}
        </nav>
        <div className="app-header__user">
          <span className="app-header__tier" title={TIER_LABELS[user.tier].blurb}>
            {TIER_LABELS[user.tier].label}
          </span>
          <button type="button" className="btn btn-ghost app-header__logout" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
      <style>{`
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 40;
          background: rgba(253, 248, 246, 0.92);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--color-border);
        }
        .app-header__inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0.55rem var(--space-md);
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .app-header__brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--color-ink);
          white-space: nowrap;
        }
        .app-header__logo-desktop {
          display: none;
        }
        .app-header__logo-mobile {
          display: flex;
        }
        .nav-desktop {
          display: none;
          flex: 1;
          flex-wrap: wrap;
          gap: 0.15rem 0.75rem;
          justify-content: center;
        }
        .nav-desktop__link {
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--color-ink-muted);
          text-decoration: none;
          padding: 0.35rem 0.5rem;
          border-radius: 999px;
        }
        .nav-desktop__link:hover {
          color: var(--color-teal-dark);
          background: var(--color-surface);
        }
        .nav-desktop__link--active {
          color: var(--color-teal-dark);
          background: var(--color-teal-soft);
        }
        .app-header__user {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-left: auto;
        }
        .app-header__tier {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-purple);
          background: var(--color-purple-soft);
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .app-header__logout {
          padding: 0.35rem 0.65rem;
          font-size: 0.85rem;
        }
        @media (min-width: 900px) {
          .nav-desktop {
            display: flex;
          }
          .app-header__logo-desktop {
            display: flex;
          }
          .app-header__logo-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
