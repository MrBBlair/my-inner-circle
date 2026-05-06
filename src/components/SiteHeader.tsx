import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrandLogo } from "./BrandLogo";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  "site-header__link" + (isActive ? " site-header__link--active" : "");

const blogSpaceNavClass = ({ isActive }: { isActive: boolean }) =>
  "site-header__link site-header__link--blog-space" +
  (isActive ? " site-header__link--active" : "");

export function SiteHeader() {
  const { user } = useAuth();
  const inApp = Boolean(user?.onboardingComplete);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          to={inApp ? "/app" : "/"}
          className="site-header__brand"
          aria-label={inApp ? "My Inner Circle — home feed" : "My Inner Circle — home"}
        >
          <BrandLogo variant="full" size="sm" />
        </Link>
        <div className="site-header__actions">
          {inApp ? (
            <Link to="/app" className="site-header__mycircle">
              My Circle
            </Link>
          ) : null}
          <button
            type="button"
            className="site-header__menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <nav className={"site-header__menu" + (menuOpen ? " site-header__menu--open" : "")} aria-label="Site">
          <NavLink to="/crown" className={blogSpaceNavClass} aria-label="My Inner Circle Blog Space" onClick={closeMenu}>
            Blog Space
          </NavLink>
          <NavLink to="/guidelines" className={linkClass} onClick={closeMenu}>
            Guidelines
          </NavLink>
          <NavLink to="/contact" className={linkClass} onClick={closeMenu}>
            Contact
          </NavLink>
          <NavLink to="/login" className={linkClass} onClick={closeMenu}>
            Sign in
          </NavLink>
        </nav>
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
          justify-content: space-between;
          gap: var(--space-md);
        }
        .site-header__actions {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-shrink: 0;
        }
        .site-header__mycircle {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--color-teal-dark);
          text-decoration: none;
          padding: 0.45rem 0.7rem;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          white-space: nowrap;
        }
        .site-header__mycircle:hover {
          background: var(--color-teal-soft);
          border-color: var(--color-teal-soft);
        }
        .site-header__brand {
          text-decoration: none;
          color: inherit;
          flex-shrink: 0;
          overflow: visible;
          display: flex;
          align-items: center;
        }
        .site-header__menu-toggle {
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
        .site-header__menu-toggle span {
          width: 1rem;
          height: 2px;
          border-radius: 999px;
          background: var(--color-ink-muted);
        }
        .site-header__menu {
          display: none;
          position: absolute;
          right: var(--space-md);
          top: calc(100% - 0.2rem);
          width: min(16rem, calc(100vw - 2rem));
          border: 1px solid var(--color-border);
          border-radius: 14px;
          background: var(--color-surface);
          box-shadow: 0 18px 40px rgba(24, 18, 32, 0.12);
          padding: 0.45rem;
          z-index: 60;
        }
        .site-header__menu--open {
          display: grid;
          gap: 0.2rem;
        }
        .site-header__link {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--color-ink-muted);
          text-decoration: none;
          padding: 0.6rem 0.65rem;
          border-radius: 10px;
          display: block;
        }
        .site-header__link:hover {
          color: var(--color-teal-dark);
          background: var(--color-surface);
        }
        .site-header__link--active {
          color: var(--color-teal-dark);
          background: var(--color-teal-soft);
        }
        .site-header__link--blog-space {
          white-space: nowrap;
          text-align: left;
          line-height: 1.25;
          max-width: none;
        }
      `}</style>
    </header>
  );
}
