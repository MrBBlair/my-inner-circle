import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrandLogo } from "./BrandLogo";
import { getUnreadAdminNotificationCount } from "../lib/storage";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "app-nav__link app-nav__link--active" : "app-nav__link";

const BASE_NAV: { to: string; label: string; end?: boolean }[] = [
  { to: "/app", label: "Feed", end: true },
  { to: "/forum", label: "Neighborhood" },
  { to: "/events", label: "Events" },
  { to: "/wellness", label: "Wellness" },
  { to: "/resources", label: "Resources" },
  { to: "/community", label: "Circle" },
  { to: "/support", label: "Support" },
];

export function AppHeader() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadAdminCount, setUnreadAdminCount] = useState(0);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const refreshAdminCount = () => {
      setUnreadAdminCount(user?.isSiteAdmin ? getUnreadAdminNotificationCount() : 0);
    };
    refreshAdminCount();
    window.addEventListener("mic_admin_notifications_changed", refreshAdminCount);
    return () => window.removeEventListener("mic_admin_notifications_changed", refreshAdminCount);
  }, [loc.pathname, user?.isSiteAdmin]);

  if (!user || !user.onboardingComplete) return null;

  const navItems = [...BASE_NAV];
  if (user.isSiteAdmin) {
    navItems.push({ to: "/admin", label: unreadAdminCount ? `Admin (${unreadAdminCount})` : ("Admin" as const) });
  }
  if (user.isModerator) {
    navItems.push({ to: "/moderation", label: "Moderation" as const });
  }

  const renderPrimaryLinks = () =>
    navItems.map(({ to, label, end }) => (
      <NavLink key={to} to={to} className={navClass} end={Boolean(end)} onClick={closeMenu}>
        {label}
      </NavLink>
    ));

  const myCircleClass = ({ isActive }: { isActive: boolean }) =>
    "app-header__mycircle" + (isActive ? " app-header__mycircle--active" : "");

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/app" className="app-header__brand" aria-label="My Inner Circle — home feed">
          <BrandLogo variant="mark" size="sm" />
          <span className="app-header__site-title">Inner Circle</span>
        </Link>
        <div className="app-header__actions">
          <NavLink to="/app" className={myCircleClass} end aria-label="My Circle home feed">
            My Circle
          </NavLink>
          <button
            type="button"
            className="app-header__menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((x) => !x)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <nav
          className={"app-header__menu" + (menuOpen ? " app-header__menu--open" : "")}
          aria-label="Account and navigation"
          hidden={!menuOpen}
        >
          <div className="app-header__menu-nav">{renderPrimaryLinks()}</div>
          {user.isSiteAdmin ? (
            <div className="app-header__menu-meta">
              <span className="app-header__admin-badge">Admin</span>
              <span className="app-header__admin-email" title={user.email}>
                {user.displayName} · {user.email}
              </span>
            </div>
          ) : null}
          <button type="button" className="btn btn-ghost app-header__logout" onClick={() => { closeMenu(); logout(); }}>
            Log out
          </button>
        </nav>
      </div>
      <style>{`
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 40;
          background: var(--header-bar-bg);
          backdrop-filter: blur(var(--header-bar-blur));
          -webkit-backdrop-filter: blur(var(--header-bar-blur));
          border-bottom: 1px solid var(--color-border);
        }
        .app-header__inner {
          position: relative;
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--header-inner-pad-y) var(--space-md) var(--header-inner-pad-y-bottom);
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .app-header__actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
        }
        .app-header__mycircle {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--color-teal-dark);
          text-decoration: none;
          padding: 0.45rem 0.65rem;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          white-space: nowrap;
        }
        .app-header__mycircle:hover {
          background: var(--color-teal-soft);
          border-color: var(--color-teal-soft);
        }
        .app-header__mycircle--active {
          background: var(--color-teal-soft);
          border-color: var(--color-teal);
        }
        .app-header__brand {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          text-decoration: none;
          color: var(--color-ink);
          white-space: nowrap;
          overflow: visible;
          flex-shrink: 0;
          min-width: 0;
        }
        .app-header__site-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: 0.02em;
          line-height: 1.15;
          color: var(--color-ink);
        }
        .app-header__menu-toggle {
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.22rem;
          cursor: pointer;
        }
        .app-header__menu-toggle span {
          width: 1rem;
          height: 2px;
          border-radius: 999px;
          background: var(--color-ink-muted);
        }
        .app-header__menu {
          display: none;
          position: absolute;
          right: var(--space-md);
          top: calc(100% - 0.15rem);
          width: min(18rem, calc(100vw - 2rem));
          border: 1px solid var(--color-border);
          border-radius: 14px;
          background: var(--color-surface);
          box-shadow: 0 18px 40px rgba(24, 18, 32, 0.12);
          padding: 0.45rem;
          z-index: 600;
        }
        .app-header__menu--open {
          display: block;
        }
        .app-header__menu-nav {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .app-nav__link {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--color-ink-muted);
          text-decoration: none;
          padding: 0.6rem 0.65rem;
          border-radius: 10px;
          display: block;
        }
        .app-nav__link:hover {
          color: var(--color-teal-dark);
          background: var(--color-surface);
        }
        .app-nav__link--active {
          color: var(--color-teal-dark);
          background: var(--color-teal-soft);
        }
        .app-header__menu-meta {
          margin-top: 0.35rem;
          padding: 0.5rem 0.65rem 0.35rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .app-header__admin-badge {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-teal-dark);
          background: var(--color-teal-soft);
          padding: 0.12rem 0.4rem;
          border-radius: 999px;
          width: fit-content;
        }
        .app-header__admin-email {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-ink-muted);
          line-height: 1.35;
          word-break: break-word;
        }
        .app-header__logout {
          margin-top: 0.35rem;
          width: 100%;
          justify-content: center;
          font-size: 0.9rem;
          padding: 0.5rem 0.75rem;
        }
        @media (min-width: 900px) {
          .app-header__site-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </header>
  );
}
