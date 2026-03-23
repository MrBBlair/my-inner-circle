import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function BottomNav() {
  const { user } = useAuth();
  if (!user || !user.onboardingComplete) return null;

  const item = ({ isActive }: { isActive: boolean }) =>
    "bottom-nav__item" + (isActive ? " bottom-nav__item--active" : "");

  return (
    <nav className="bottom-nav" aria-label="Mobile primary">
      <NavLink to="/app" className={item} end>
        <span className="bottom-nav__icon" aria-hidden>
          ◎
        </span>
        Home
      </NavLink>
      <NavLink to="/forum" className={item}>
        <span className="bottom-nav__icon" aria-hidden>
          🏘
        </span>
        Neighbors
      </NavLink>
      <NavLink to="/events" className={item}>
        <span className="bottom-nav__icon" aria-hidden>
          📅
        </span>
        Events
      </NavLink>
      <NavLink to="/wellness" className={item}>
        <span className="bottom-nav__icon" aria-hidden>
          ✦
        </span>
        Wellness
      </NavLink>
      <NavLink to="/resources" className={item}>
        <span className="bottom-nav__icon" aria-hidden>
          📚
        </span>
        Library
      </NavLink>
      <NavLink to="/community" className={item}>
        <span className="bottom-nav__icon" aria-hidden>
          ✶
        </span>
        Circle
      </NavLink>
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 40;
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 0.15rem;
          padding: 0.35rem 0.25rem calc(0.35rem + env(safe-area-inset-bottom));
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(12px);
          border-top: 1px solid var(--color-border);
          box-shadow: 0 -6px 24px rgba(45, 42, 50, 0.06);
        }
        @media (min-width: 900px) {
          .bottom-nav {
            display: none;
          }
        }
        .bottom-nav__item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.1rem;
          font-size: 0.58rem;
          font-weight: 700;
          text-decoration: none;
          color: var(--color-ink-muted);
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          min-width: 0;
        }
        .bottom-nav__item--active {
          color: var(--color-teal-dark);
          background: var(--color-teal-soft);
        }
        .bottom-nav__icon {
          font-size: 1.1rem;
          line-height: 1;
        }
      `}</style>
    </nav>
  );
}
