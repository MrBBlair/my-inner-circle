import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_ANNOUNCEMENTS } from "../lib/seed";
import { getEvents, getThreads, getUsers, saveThreads } from "../lib/storage";
import type { Announcement, EventItem, Thread, UserProfile } from "../types";
import {
  avatarToneClass,
  CATEGORY_SHORT_LABEL,
  commentCountForThread,
  displayInitials,
  formatRelativeTime,
} from "../lib/forumHelpers";

type SocialFeedItem =
  | { kind: "announcement"; id: string; announcement: Announcement; createdAt: string }
  | { kind: "thread"; id: string; thread: Thread; createdAt: string }
  | { kind: "event"; id: string; event: EventItem; createdAt: string }
  | { kind: "challenge"; id: string; createdAt: string };

function clip(text: string, max = 220) {
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

function eventDateLabel(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function memberSinceLabel(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function SocialAvatar({
  name,
  profile,
  size = "md",
  className = "",
  interactive = false,
}: {
  name: string;
  profile?: UserProfile;
  size?: "sm" | "md";
  className?: string;
  interactive?: boolean;
}) {
  const classes = `social-avatar ${interactive ? "social-avatar--interactive" : ""} ${size === "sm" ? "social-avatar--sm" : ""} ${
    profile?.profileImageDataUrl ? "social-avatar--photo" : avatarToneClass(name)
  } ${className}`.trim();

  return (
    <span className={classes} aria-hidden>
      {profile?.profileImageDataUrl ? <img src={profile.profileImageDataUrl} alt="" /> : displayInitials(name)}
    </span>
  );
}

export function HomeFeed() {
  const { user, updateProfile } = useAuth();
  const [refreshKey, bump] = useState(0);
  const [statusLine, setStatusLine] = useState(user?.statusLine ?? "");
  const [statusEditing, setStatusEditing] = useState(() => !String(user?.statusLine ?? "").trim());
  const statusInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const next = user?.statusLine ?? "";
    setStatusLine(next);
    if (!next.trim()) {
      setStatusEditing(true);
    }
  }, [user?.statusLine]);

  const feedItems = useMemo((): SocialFeedItem[] => {
    if (!user) return [];

    const threads = getThreads()
      .filter((t) => user.joinedCategories.includes(t.categorySlug) && !t.neighborhoodGroupId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 8);

    const events = getEvents()
      .filter((ev) => new Date(ev.dateISO).getTime() >= Date.now() - 1000 * 60 * 60 * 24)
      .sort((a, b) => (a.dateISO > b.dateISO ? 1 : -1))
      .slice(0, 3);

    const items: SocialFeedItem[] = [
      ...DEFAULT_ANNOUNCEMENTS.filter((a) => a.pinned).map((announcement) => ({
        kind: "announcement" as const,
        id: `ann-${announcement.id}`,
        announcement,
        createdAt: announcement.dateISO,
      })),
      ...threads.map((thread) => ({
        kind: "thread" as const,
        id: `th-${thread.id}`,
        thread,
        createdAt: thread.createdAt,
      })),
      ...events.map((event) => ({
        kind: "event" as const,
        id: `ev-${event.id}`,
        event,
        createdAt: event.dateISO,
      })),
      {
        kind: "challenge" as const,
        id: "challenge-gratitude",
        createdAt: new Date().toISOString(),
      },
    ];

    return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [refreshKey, user]);

  const usersById = useMemo(() => getUsers(), [refreshKey]);

  const toggleHeart = (thread: Thread) => {
    if (!user) return;
    const liked = thread.heartUserIds.includes(user.id);
    const heartUserIds = liked
      ? thread.heartUserIds.filter((id) => id !== user.id)
      : [...thread.heartUserIds, user.id];
    saveThreads(getThreads().map((t) => (t.id === thread.id ? { ...t, heartUserIds } : t)));
    bump((n) => n + 1);
  };

  const saveStatus = (e: FormEvent) => {
    e.preventDefault();
    const next = statusLine.trim();
    updateProfile({ statusLine: next });
    if (next) {
      setStatusEditing(false);
    }
  };

  const startStatusEdit = () => {
    setStatusEditing(true);
    queueMicrotask(() => statusInputRef.current?.focus());
  };

  if (!user) return null;

  const joinedLabels = user.joinedCategories.map((slug) => CATEGORY_SHORT_LABEL[slug]);

  return (
    <div className="social-home">
      <div
        className={"social-home__masthead" + (user.backgroundImageDataUrl ? " social-home__masthead--photo" : "")}
        style={{
          backgroundImage: user.backgroundImageDataUrl ? `url(${user.backgroundImageDataUrl})` : undefined,
        }}
      >
        <div className="social-home__identity">
          <h1 className="page-title social-home__title">{user.displayName}</h1>
          <p className="social-home__member-since">Member since {memberSinceLabel(user.createdAt)}</p>
          {statusEditing ? (
            <form className="social-status" onSubmit={saveStatus}>
              <label className="sr-only" htmlFor="home-status-line">
                Status, life update, or one-liner
              </label>
              <input
                ref={statusInputRef}
                id="home-status-line"
                value={statusLine}
                onChange={(e) => setStatusLine(e.target.value)}
                maxLength={120}
                placeholder="Add a status, life update, or one-liner..."
              />
              <button type="submit">{statusLine.trim() ? "Save" : "Add"}</button>
            </form>
          ) : (
            <div className="social-status-done" role="status">
              <p className="social-status-done__text">{(user.statusLine ?? "").trim()}</p>
              <button type="button" className="social-status-done__edit" onClick={startStatusEdit}>
                Edit
              </button>
            </div>
          )}
        </div>
        <Link to="/profile" className="social-home__profile-link" aria-label="Open profile">
          <SocialAvatar name={user.displayName} profile={user} />
        </Link>
      </div>

      <section className="social-composer surface" aria-label="Create post">
        <SocialAvatar name={user.displayName} profile={user} size="sm" />
        <Link to="/forum/community" className="social-composer__prompt">
          What do you want to share with the circle?
        </Link>
        <div className="social-composer__actions" aria-label="Post shortcuts">
          <Link to="/forum/community">Post</Link>
          <Link to="/events">Event</Link>
          <Link to="/give">Give</Link>
        </div>
      </section>

      <section className="social-rail" aria-label="Quick spaces">
        <Link to="/forum" className="social-rail__chip social-rail__chip--primary">
          Browse spaces
        </Link>
        {joinedLabels.length === 0 ? (
          <Link to="/forum" className="social-rail__chip">
            Join rooms
          </Link>
        ) : (
          joinedLabels.map((label) => (
            <span key={label} className="social-rail__chip">
              {label}
            </span>
          ))
        )}
      </section>

      {user.joinedCategories.length === 0 ? (
        <div className="surface social-tip">
          <strong>Personalize your feed:</strong> join a few neighborhood rooms so posts from those spaces show up here.{" "}
          <Link to="/forum">Browse spaces</Link>
        </div>
      ) : null}

      <section className="social-feed" aria-label="Social activity feed">
        {feedItems.map((item) => {
          if (item.kind === "thread") {
            const thread = item.thread;
            const threadAuthor = usersById[thread.authorId];
            const liked = thread.heartUserIds.includes(user.id);
            const comments = commentCountForThread(thread.id);
            return (
              <article key={item.id} className="social-post surface">
                <div className="social-post__head">
                  {threadAuthor && threadAuthor.id !== user.id ? (
                    <Link to={`/members/${threadAuthor.id}`} className="social-avatar-link" aria-label={`Open ${thread.authorName}'s profile`}>
                      <SocialAvatar name={thread.authorName} profile={threadAuthor} size="sm" interactive />
                    </Link>
                  ) : (
                    <SocialAvatar name={thread.authorName} profile={threadAuthor} size="sm" />
                  )}
                  <div className="social-post__meta">
                    <strong>{thread.authorName}</strong>
                    <span>
                      {CATEGORY_SHORT_LABEL[thread.categorySlug]} · {formatRelativeTime(thread.createdAt)}
                    </span>
                  </div>
                  <Link to={`/forum/${thread.categorySlug}/${thread.id}`} className="social-post__menu" aria-label="Open post">
                    ...
                  </Link>
                </div>
                <Link to={`/forum/${thread.categorySlug}/${thread.id}`} className="social-post__body">
                  <h2>{thread.title}</h2>
                  <p>{clip(thread.body)}</p>
                  {thread.attachmentDataUrls?.length ? (
                    <div className={`social-post__photos social-post__photos--${Math.min(thread.attachmentDataUrls.length, 3)}`}>
                      {thread.attachmentDataUrls.slice(0, 3).map((src, index) => (
                        <img key={src} src={src} alt={`Attachment ${index + 1} for ${thread.title}`} />
                      ))}
                    </div>
                  ) : null}
                </Link>
                <div className="social-post__counts">
                  <span>{thread.heartUserIds.length} thanks</span>
                  <span>{comments} comments</span>
                </div>
                <div className="social-post__actions">
                  <button type="button" data-active={liked ? true : undefined} onClick={() => toggleHeart(thread)}>
                    {liked ? "Thanked" : "Thank"}
                  </button>
                  <Link to={`/forum/${thread.categorySlug}/${thread.id}`}>Comment</Link>
                  <Link to={`/forum/${thread.categorySlug}/${thread.id}`}>Share</Link>
                </div>
              </article>
            );
          }

          if (item.kind === "event") {
            return (
              <article key={item.id} className="social-post social-post--event surface">
                <div className="social-post__head">
                  <div className="social-avatar social-avatar--sm social-avatar--event" aria-hidden>
                    Cal
                  </div>
                  <div className="social-post__meta">
                    <strong>Inner Circle Events</strong>
                    <span>{eventDateLabel(item.event.dateISO)}</span>
                  </div>
                </div>
                <Link to={`/events/${item.event.id}`} className="social-event-card">
                  <span className="tag tag-teal">{item.event.virtual ? "Virtual event" : "Local event"}</span>
                  <h2>{item.event.title}</h2>
                  <p>{clip(item.event.description, 160)}</p>
                  <span>{item.event.location}</span>
                </Link>
                <div className="social-post__actions">
                  <Link to={`/events/${item.event.id}`}>Details</Link>
                  <Link to="/events">Calendar</Link>
                  <Link to={`/events/${item.event.id}`}>RSVP</Link>
                </div>
              </article>
            );
          }

          if (item.kind === "announcement") {
            return (
              <article key={item.id} className="social-post social-post--announcement surface">
                <div className="social-post__head">
                  <div className="social-avatar social-avatar--sm social-avatar--official" aria-hidden>
                    IC
                  </div>
                  <div className="social-post__meta">
                    <strong>Inner Circle</strong>
                    <span>Official update · {formatRelativeTime(item.announcement.dateISO)}</span>
                  </div>
                </div>
                <Link to="/resources" className="social-post__body">
                  <h2>{item.announcement.title}</h2>
                  <p>{item.announcement.body}</p>
                </Link>
                <div className="social-post__actions">
                  <Link to="/resources">Read</Link>
                  <Link to="/support">Ask support</Link>
                </div>
              </article>
            );
          }

          return (
            <article key={item.id} className="social-post social-post--challenge surface">
              <div className="social-post__head">
                <div className="social-avatar social-avatar--sm social-avatar--challenge" aria-hidden>
                  7
                </div>
                <div className="social-post__meta">
                  <strong>Wellness challenge</strong>
                  <span>This week</span>
                </div>
              </div>
              <Link to="/wellness" className="social-post__body">
                <h2>7 Days of Gratitude</h2>
                <p>A gentle daily prompt for noticing what still holds, helps, and heals.</p>
              </Link>
              <div className="social-post__actions">
                <Link to="/wellness">Join</Link>
                <Link to="/wellness">Save</Link>
              </div>
            </article>
          );
        })}
      </section>

      <style>{`
        .social-home {
          max-width: 43rem;
          margin: 0 auto;
        }
        .social-home__masthead {
          position: relative;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
          border-radius: var(--radius-sm);
          padding: var(--space-lg);
          overflow: hidden;
          background:
            linear-gradient(135deg, rgba(252, 234, 242, 0.72), rgba(235, 224, 247, 0.7)),
            var(--color-bg);
          background-size: cover;
          background-position: center;
        }
        .social-home__masthead--photo {
          min-height: 13rem;
          align-items: flex-end;
          color: #fff;
        }
        .social-home__masthead--photo::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(41, 23, 32, 0.16), rgba(41, 23, 32, 0.62));
        }
        .social-home__masthead > * {
          position: relative;
          z-index: 1;
        }
        .social-home__masthead--photo h1.social-home__title {
          color: #fff;
        }
        .social-home__masthead--photo .social-home__member-since {
          color: rgba(255, 255, 255, 0.88);
        }
        .social-home__masthead--photo .social-status-done__text {
          color: #fff;
        }
        .social-home__masthead--photo .social-status-done__edit {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.55);
          background: rgba(255, 249, 251, 0.18);
        }
        .social-home__masthead--photo .social-status-done__edit:hover {
          background: rgba(255, 249, 251, 0.32);
        }
        .social-status-done {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.35rem 0.65rem;
          max-width: 34rem;
        }
        .social-status-done__text {
          flex: 0 1 auto;
          margin: 0;
          min-width: 0;
          line-height: 1.45;
          font-size: 1.02rem;
          font-weight: 800;
          color: var(--color-teal-dark);
          text-wrap: balance;
        }
        .social-status-done__edit {
          flex-shrink: 0;
          margin: 0;
          padding: 0.28rem 0.65rem;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: rgba(255, 249, 251, 0.72);
          color: var(--color-teal-dark);
          font: inherit;
          font-weight: 700;
          font-size: 0.78rem;
          cursor: pointer;
        }
        .social-status-done__edit:hover {
          background: var(--color-teal-soft);
          border-color: var(--color-teal-soft);
        }
        .social-status-done__edit:focus-visible {
          outline: 2px solid var(--color-teal);
          outline-offset: 2px;
        }
        .social-home__identity {
          min-width: 0;
          flex: 1;
          align-self: flex-end;
        }
        .social-home__title {
          margin-bottom: 0.25rem;
        }
        .social-home__member-since {
          color: var(--color-ink-muted);
          margin: 0 0 var(--space-md);
          max-width: 34rem;
          font-size: 0.95rem;
        }
        .social-home__profile-link {
          display: inline-flex;
          align-self: flex-start;
          text-decoration: none;
        }
        .social-home__masthead--photo .social-home__profile-link {
          align-self: flex-end;
        }
        .social-home__profile-link .social-avatar {
          width: 3.9rem;
          height: 3.9rem;
          border: 3px solid rgba(255, 255, 255, 0.92);
          box-shadow: 0 12px 28px rgba(41, 23, 32, 0.25);
        }
        .social-status {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 0.5rem;
          max-width: 34rem;
        }
        .social-status input {
          min-width: 0;
          width: 100%;
          border: 1px solid rgba(232, 202, 219, 0.8);
          border-radius: 999px;
          background: rgba(255, 249, 251, 0.88);
          color: var(--color-ink);
          font: inherit;
          font-size: 0.95rem;
          padding: 0.7rem 0.95rem;
        }
        .social-home__masthead--photo .social-status input {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 249, 251, 0.94);
        }
        .social-status button {
          border: 0;
          border-radius: 999px;
          background: var(--color-teal);
          color: #fff;
          font: inherit;
          font-weight: 800;
          padding: 0.7rem 1rem;
          cursor: pointer;
        }
        .social-avatar {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 0.85rem;
          text-decoration: none;
          flex-shrink: 0;
          overflow: hidden;
        }
        .social-avatar--sm {
          width: 2.25rem;
          height: 2.25rem;
          font-size: 0.72rem;
        }
        .social-avatar--event {
          background: linear-gradient(145deg, var(--color-gold), var(--color-teal));
        }
        .social-avatar--official {
          background: linear-gradient(145deg, var(--color-teal-dark), var(--color-purple));
        }
        .social-avatar--challenge {
          background: linear-gradient(145deg, var(--color-blush-deep), var(--color-gold));
        }
        .social-avatar--photo {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
        }
        .social-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .social-avatar-link {
          display: inline-flex;
          border-radius: 50%;
          text-decoration: none;
        }
        .social-avatar--interactive {
          box-shadow: 0 0 0 2px var(--color-bg-elevated), 0 0 0 4px var(--color-teal-soft);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .social-avatar-link:hover .social-avatar--interactive,
        .social-avatar-link:focus-visible .social-avatar--interactive {
          transform: translateY(-1px);
          box-shadow: 0 0 0 2px var(--color-bg-elevated), 0 0 0 4px var(--color-teal);
        }
        .social-composer {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--space-sm);
          align-items: center;
          padding: var(--space-md);
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-md);
        }
        .social-composer__prompt {
          display: flex;
          align-items: center;
          min-height: 2.5rem;
          padding: 0.65rem 0.9rem;
          border: 1px solid var(--color-border);
          border-radius: 999px;
          background: var(--color-surface);
          color: var(--color-ink-muted);
          text-decoration: none;
          font-weight: 600;
        }
        .social-composer__actions {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.45rem;
          padding-top: var(--space-sm);
          border-top: 1px solid var(--color-border);
        }
        .social-composer__actions a,
        .social-post__actions a,
        .social-post__actions button {
          min-height: 2.35rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: var(--radius-sm);
          background: transparent;
          color: var(--color-ink-muted);
          font: inherit;
          font-weight: 800;
          font-size: 0.9rem;
          text-decoration: none;
          cursor: pointer;
        }
        .social-composer__actions a:hover,
        .social-post__actions a:hover,
        .social-post__actions button:hover {
          background: var(--color-teal-soft);
          color: var(--color-teal-dark);
        }
        .social-rail {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0 0 var(--space-md);
          margin-bottom: var(--space-sm);
          -webkit-overflow-scrolling: touch;
        }
        .social-rail__chip {
          flex: 0 0 auto;
          padding: 0.5rem 0.8rem;
          border-radius: 999px;
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          color: var(--color-ink);
          text-decoration: none;
          font-size: 0.86rem;
          font-weight: 800;
        }
        .social-rail__chip--primary {
          background: var(--color-teal);
          border-color: var(--color-teal);
          color: #fff;
        }
        .social-tip {
          padding: var(--space-md);
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-md);
        }
        .social-feed {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .social-post {
          padding: 0;
          overflow: hidden;
          border-radius: var(--radius-sm);
          box-shadow: 0 1px 2px rgba(92, 21, 56, 0.08);
        }
        .social-post__head {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: var(--space-md) var(--space-md) var(--space-sm);
        }
        .social-post__meta {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }
        .social-post__meta strong {
          font-size: 0.95rem;
        }
        .social-post__meta span {
          font-size: 0.78rem;
          color: var(--color-ink-muted);
        }
        .social-post__menu {
          width: 2rem;
          height: 2rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--color-ink-muted);
          text-decoration: none;
          font-weight: 900;
        }
        .social-post__menu:hover {
          background: var(--color-surface);
        }
        .social-post__body,
        .social-event-card {
          display: block;
          padding: 0 var(--space-md) var(--space-md);
          color: inherit;
          text-decoration: none;
        }
        .social-post__body h2,
        .social-event-card h2 {
          font-family: var(--font-body);
          font-size: 1.02rem;
          line-height: 1.25;
          margin: 0 0 0.4rem;
          letter-spacing: 0;
        }
        .social-post__body p,
        .social-event-card p {
          margin: 0;
          color: var(--color-ink);
          font-size: 0.95rem;
          line-height: 1.45;
          white-space: pre-wrap;
        }
        .social-post__photos {
          display: grid;
          gap: 0.2rem;
          margin: var(--space-md) calc(-1 * var(--space-md)) 0;
          background: var(--color-border);
        }
        .social-post__photos img {
          width: 100%;
          height: 100%;
          min-height: 190px;
          max-height: 420px;
          object-fit: cover;
          display: block;
          background: var(--color-surface);
        }
        .social-post__photos--2 {
          grid-template-columns: 1fr 1fr;
        }
        .social-post__photos--3 {
          grid-template-columns: 1fr 1fr;
        }
        .social-post__photos--3 img:first-child {
          grid-row: span 2;
        }
        .social-post__counts {
          display: flex;
          justify-content: space-between;
          gap: var(--space-md);
          padding: 0 var(--space-md) var(--space-sm);
          font-size: 0.82rem;
          color: var(--color-ink-muted);
        }
        .social-post__actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.2rem;
          padding: 0.25rem var(--space-sm) var(--space-sm);
          border-top: 1px solid var(--color-border);
        }
        .social-post__actions button[data-active="true"] {
          color: var(--color-teal-dark);
          background: var(--color-teal-soft);
        }
        .social-event-card {
          margin: 0 var(--space-md) var(--space-md);
          padding: var(--space-md);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-surface);
        }
        .social-event-card h2 {
          margin-top: 0.55rem;
        }
        .social-event-card span:last-child {
          display: block;
          margin-top: 0.65rem;
          font-size: 0.86rem;
          font-weight: 800;
          color: var(--color-teal-dark);
        }
        @media (max-width: 520px) {
          .social-home {
            margin: 0 calc(-1 * var(--space-sm));
          }
          .social-home__masthead {
            padding: var(--space-md);
            flex-direction: column-reverse;
            min-height: 12rem;
          }
          .social-home__profile-link,
          .social-home__masthead--photo .social-home__profile-link {
            align-self: flex-end;
          }
          .social-status {
            grid-template-columns: 1fr;
          }
          .social-post__photos img {
            min-height: 160px;
          }
        }
      `}</style>
    </div>
  );
}
