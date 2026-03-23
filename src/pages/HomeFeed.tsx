import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_ANNOUNCEMENTS } from "../lib/seed";
import { getEvents, getThreads } from "../lib/storage";
import type { FeedItem } from "../types";

export function HomeFeed() {
  const { user } = useAuth();

  const items = useMemo((): FeedItem[] => {
    if (!user) return [];
    const threads = getThreads()
      .filter((t) => user.joinedCategories.includes(t.categorySlug))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 5);

    const events = getEvents()
      .sort((a, b) => (a.dateISO > b.dateISO ? 1 : -1))
      .slice(0, 3);

    const feed: FeedItem[] = [];

    DEFAULT_ANNOUNCEMENTS.filter((a) => a.pinned).forEach((a) => {
      feed.push({
        id: `ann-${a.id}`,
        type: "announcement",
        title: a.title,
        summary: a.body,
        meta: "Official update",
        href: "/resources",
      });
    });

    threads.forEach((t) => {
      feed.push({
        id: `th-${t.id}`,
        type: "thread",
        title: t.title,
        summary: t.body.slice(0, 120) + (t.body.length > 120 ? "…" : ""),
        meta: `${t.authorName} · Neighborhood`,
        href: `/forum/${t.categorySlug}/${t.id}`,
      });
    });

    events.forEach((ev) => {
      feed.push({
        id: `ev-${ev.id}`,
        type: "event",
        title: ev.title,
        summary: ev.description.slice(0, 100) + (ev.description.length > 100 ? "…" : ""),
        meta: new Date(ev.dateISO).toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        href: "/events",
      });
    });

    feed.push({
      id: "challenge-gratitude",
      type: "challenge",
      title: "7 Days of Gratitude",
      summary: "A gentle daily prompt — Inner Circle members can join from Wellness.",
      meta: "This week",
      href: "/wellness",
    });

    return feed;
  }, [user]);

  return (
    <div>
      <h1 className="page-title">Hello, {user?.displayName}</h1>
      <p className="lede">
        Your feed blends official updates, conversations in rooms you’ve joined, upcoming events,
        and community challenges.
      </p>

      {user && user.joinedCategories.length === 0 && (
        <div className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
          <p style={{ margin: 0 }}>
            <strong>Tip:</strong> Join neighborhood spaces to personalize this feed.{" "}
            <Link to="/forum">Browse spaces →</Link>
          </p>
        </div>
      )}

      <section aria-label="Activity feed">
        <h2 className="sr-only">Recent activity</h2>
        <div className="card-list">
          {items.map((item) => (
            <Link key={item.id} to={item.href} className="card-link">
              <span className="tag tag-teal">{item.type}</span>
              <h3 style={{ margin: "0.35rem 0 0.25rem", fontSize: "1.1rem" }}>{item.title}</h3>
              <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "0.95rem" }}>
                {item.summary}
              </p>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.82rem", color: "var(--color-ink-muted)" }}>
                {item.meta}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
