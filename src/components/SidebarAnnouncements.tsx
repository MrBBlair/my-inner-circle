import { DEFAULT_ANNOUNCEMENTS } from "../lib/seed";

export function SidebarAnnouncements() {
  return (
    <aside className="sidebar" aria-label="Inner Circle updates">
      <div className="sidebar__inner surface">
        <h2 className="sidebar__title">Circle updates</h2>
        <p className="sidebar__intro">
          Official announcements from the Inner Circle team — always visible while you browse.
        </p>
        <ul className="sidebar__list">
          {DEFAULT_ANNOUNCEMENTS.map((a) => (
            <li key={a.id} className="sidebar__item">
              {a.pinned && <span className="tag tag-teal">Pinned</span>}
              <h3 className="sidebar__item-title">{a.title}</h3>
              <p className="sidebar__item-body">{a.body}</p>
              <time className="sidebar__time" dateTime={a.dateISO}>
                {new Date(a.dateISO).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        .sidebar {
          display: none;
        }
        @media (min-width: 900px) {
          .sidebar {
            display: block;
            position: sticky;
            top: calc(var(--header-h) + var(--space-md));
          }
        }
        .sidebar__inner {
          padding: var(--space-md);
        }
        .sidebar__title {
          font-size: 1.1rem;
          margin-bottom: var(--space-xs);
        }
        .sidebar__intro {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin-bottom: var(--space-md);
        }
        .sidebar__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .sidebar__item {
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--color-border);
        }
        .sidebar__item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .sidebar__item-title {
          font-size: 1rem;
          margin: var(--space-xs) 0;
        }
        .sidebar__item-body {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin: 0 0 var(--space-xs);
        }
        .sidebar__time {
          font-size: 0.78rem;
          color: var(--color-ink-muted);
        }
      `}</style>
    </aside>
  );
}
