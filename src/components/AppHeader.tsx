import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrandLogo } from "./BrandLogo";
import { TIER_LABELS } from "../lib/storage";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "app-nav__link app-nav__link--active" : "app-nav__link";

const BASE_NAV: { to: string; label: string; end?: boolean }[] = [
  { to: "/app", label: "Home", end: true },
  { to: "/forum", label: "Neighborhood" },
  { to: "/events", label: "Events" },
  { to: "/wellness", label: "Wellness" },
  { to: "/resources", label: "Resources" },
  { to: "/community", label: "Circle" },
  { to: "/support", label: "Support" },
];

export function AppHeader() {
  const { user, logout } = useAuth();

  if (!user || !user.onboardingComplete) return null;

  const navItems = user.isModerator
    ? [...BASE_NAV, { to: "/moderation", label: "Moderation" as const }]
    : BASE_NAV;

  const renderPrimaryLinks = () =>
    navItems.map(({ to, label, end }) => (
      <NavLink key={to} to={to} className={navClass} end={Boolean(end)}>
        {label}
      </NavLink>
    ));

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="app-header__brand" aria-label="The My Inner Circle App — back to welcome page">
          <span className="app-header__logo-mobile">
            <BrandLogo variant="mark" size="sm" />
          </span>
          <span className="app-header__logo-desktop">
            <BrandLogo variant="full" size="sm" />
          </span>
        </Link>
        <nav className="nav-desktop" aria-label="Primary">
          {renderPrimaryLinks()}
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
      <nav className="nav-mobile" aria-label="Primary">
        <div className="nav-mobile__scroll">{renderPrimaryLinks()}</div>
      </nav>
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
          padding: 0.4rem var(--space-md);
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
        .app-nav__link {
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--color-ink-muted);
          text-decoration: none;
          padding: 0.35rem 0.5rem;
          border-radius: 999px;
          white-space: nowrap;
        }
        .app-nav__link:hover {
          color: var(--color-teal-dark);
          background: var(--color-surface);
        }
        .app-nav__link--active {
          color: var(--color-teal-dark);
          background: var(--color-teal-soft);
        }
        .nav-mobile {
          display: none;
          border-top: 1px solid var(--color-border);
          background: rgba(253, 248, 246, 0.97);
        }
        .nav-mobile__scroll {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          gap: 0.25rem;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 0.3rem var(--space-md) 0.4rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }
        .nav-mobile__scroll::-webkit-scrollbar {
          height: 5px;
        }
        .nav-mobile__scroll::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 4px;
        }
        .nav-mobile .app-nav__link {
          flex-shrink: 0;
          font-size: 0.86rem;
          padding: 0.4rem 0.65rem;
          min-height: 2.5rem;
          display: inline-flex;
          align-items: center;
        }
        @media (max-width: 899px) {
          .nav-mobile {
            display: block;
          }
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
