import { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { QrInline } from "../components/QrInline";
import { buildICS, downloadICS } from "../lib/calendar";
import { getMonetaryGivingUrl, PUBLIC_WEBSITE_URL } from "../lib/constants";
import { useAuth } from "../context/AuthContext";
import {
  crownBlogReleaseStart,
  getAllCrownBlogPostsMerged,
  isCrownBlogReleased,
} from "../content/crownChronicles";
import { getEvents, getEventGalleryPhotos, saveEvents } from "../lib/storage";
import type { CrownBlogPost, EventItem } from "../types";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function EventsPage() {
  const { user } = useAuth();
  const [cursor, setCursor] = useState(() => new Date());
  const [calVersion, setCalVersion] = useState(0);

  if (!user) return null;

  const monthStart = startOfMonth(cursor);
  const totalDays = daysInMonth(cursor);
  const startWeekday = monthStart.getDay();
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const byDay = useMemo(() => {
    const list = getEvents();
    const map = new Map<number, typeof list>();
    list.forEach((ev) => {
      const dt = new Date(ev.dateISO);
      if (dt.getFullYear() !== year || dt.getMonth() !== month) return;
      const day = dt.getDate();
      const list = map.get(day) ?? [];
      list.push(ev);
      map.set(day, list);
    });
    return map;
  }, [year, month, calVersion]);

  const blogsByDay = useMemo(() => {
    const map = new Map<number, CrownBlogPost[]>();
    getAllCrownBlogPostsMerged().forEach((post) => {
      const dt = crownBlogReleaseStart(post);
      if (dt.getFullYear() !== year || dt.getMonth() !== month) return;
      const day = dt.getDate();
      const list = map.get(day) ?? [];
      list.push(post);
      map.set(day, list);
    });
    map.forEach((list) => {
      list.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
    });
    return map;
  }, [year, month, calVersion]);

  const toggleRsvp = useCallback(
    (id: string) => {
      const list = getEvents();
      const idx = list.findIndex((e) => e.id === id);
      if (idx === -1) return;
      const ev = list[idx];
      const has = ev.rsvpUserIds.includes(user.id);
      const rsvpUserIds = has
        ? ev.rsvpUserIds.filter((x) => x !== user.id)
        : [...ev.rsvpUserIds, user.id];
      const next = [...list];
      next[idx] = { ...ev, rsvpUserIds };
      saveEvents(next);
      setCalVersion((n) => n + 1);
    },
    [user.id],
  );

  const addToCal = (ev: EventItem) => {
    const start = new Date(ev.dateISO);
    const end = ev.endISO ? new Date(ev.endISO) : new Date(start.getTime() + 60 * 60 * 1000);
    const ics = buildICS({
      title: ev.title,
      description: ev.description,
      location: ev.location,
      start,
      end,
      uid: ev.id,
    });
    downloadICS(`${ev.title.replace(/\s+/g, "-")}.ics`, ics);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const upcomingCombined = useMemo(() => {
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    type Row = { kind: "event"; ev: EventItem } | { kind: "blog"; post: CrownBlogPost };
    const rows: Row[] = [];
    getEvents().forEach((ev) => {
      if (new Date(ev.dateISO) >= startToday) rows.push({ kind: "event", ev });
    });
    getAllCrownBlogPostsMerged().forEach((post) => {
      if (crownBlogReleaseStart(post) >= startToday) rows.push({ kind: "blog", post });
    });
    rows.sort((a, b) => {
      const ta =
        a.kind === "event" ? new Date(a.ev.dateISO).getTime() : crownBlogReleaseStart(a.post).getTime();
      const tb =
        b.kind === "event" ? new Date(b.ev.dateISO).getTime() : crownBlogReleaseStart(b.post).getTime();
      return ta - tb;
    });
    return rows;
  }, [calVersion]);

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));

  return (
    <div>
      <h1 className="page-title">Events calendar</h1>
      <p className="lede">
        Gatherings and <strong>Blog Space</strong> releases appear on the calendar by title and date. Tap an item for
        details; RSVP and add-to-calendar below are for events.
      </p>

      <div className="cal-toolbar surface">
        <button type="button" className="btn btn-secondary" onClick={prevMonth} aria-label="Previous month">
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
          {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </h2>
        <button type="button" className="btn btn-secondary" onClick={nextMonth} aria-label="Next month">
          →
        </button>
      </div>

      <div className="cal-grid surface" role="grid" aria-label={`Calendar ${month + 1} ${year}`}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="cal-dow" role="columnheader">
            {d}
          </div>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <div key={`e-${i}`} className="cal-cell cal-cell--empty" />
          ) : (
            <div key={day} className="cal-cell">
              <span className="cal-daynum">{day}</span>
              <ul className="cal-events">
                {(byDay.get(day) ?? []).map((ev) => (
                  <li key={ev.id}>
                    <Link
                      to={`/events/${ev.id}`}
                      className="cal-ev-link"
                      aria-label={`${ev.title}, ${ev.virtual ? "Online" : "Local event"}. Open full details.`}
                    >
                      <span className="cal-pill">{ev.virtual ? "Online" : "Local"}</span>
                      <span className="cal-ev-title">{ev.title}</span>
                    </Link>
                  </li>
                ))}
                {(blogsByDay.get(day) ?? []).map((post) => {
                  const released = isCrownBlogReleased(post);
                  return (
                    <li key={`blog-${post.slug}`}>
                      <Link
                        to={`/crown/blog/${post.slug}`}
                        className={"cal-ev-link" + (released ? "" : " cal-ev-link--upcoming")}
                        aria-label={`${post.title}. Blog Space release${released ? "" : " (opens on release date)"}.`}
                      >
                        <span className="cal-pill cal-pill--blog">{released ? "Blog" : "Blog · soon"}</span>
                        <span className="cal-ev-title">{post.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ),
        )}
      </div>

      <section style={{ marginTop: "var(--space-xl)" }} aria-labelledby="upcoming-heading">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
          <h2 id="upcoming-heading" style={{ fontSize: "1.2rem", margin: 0 }}>
            Upcoming events &amp; blog releases
          </h2>
          <QrInline value={PUBLIC_WEBSITE_URL} caption="QR to marketing site for flyers" />
        </div>
        <div className="card-list">
          {upcomingCombined.length === 0 ? (
            <div className="empty-state">No upcoming events or scheduled blog releases.</div>
          ) : (
            upcomingCombined.map((row) =>
              row.kind === "event" ? (
                <article key={row.ev.id} className="surface" style={{ padding: "var(--space-md)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                    <h3 style={{ margin: 0, flex: "1 1 200px" }}>{row.ev.title}</h3>
                    <span className="tag tag-teal">{row.ev.virtual ? "Virtual" : "In person"}</span>
                  </div>
                  <p style={{ color: "var(--color-ink-muted)", margin: "0.35rem 0" }}>
                    {new Date(row.ev.dateISO).toLocaleString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {" · "}
                    {row.ev.location}
                  </p>
                  <p style={{ margin: "0 0 0.75rem" }}>{row.ev.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <button
                      type="button"
                      className={row.ev.rsvpUserIds.includes(user.id) ? "btn btn-secondary" : "btn btn-primary"}
                      onClick={() => toggleRsvp(row.ev.id)}
                    >
                      {row.ev.rsvpUserIds.includes(user.id) ? "Undo RSVP" : "RSVP"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => addToCal(row.ev)}>
                      Add to calendar
                    </button>
                    <Link className="btn btn-secondary" to={`/events/${row.ev.id}`}>
                      Details &amp; QR
                    </Link>
                    <a
                      className="btn btn-heart"
                      href={row.ev.donationUrl || getMonetaryGivingUrl()}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Give
                    </a>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", margin: "0.5rem 0 0" }}>
                    {row.ev.rsvpUserIds.length} attending
                  </p>
                </article>
              ) : (
                <article key={`blog-${row.post.slug}`} className="surface" style={{ padding: "var(--space-md)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                    <h3 style={{ margin: 0, flex: "1 1 200px" }}>{row.post.title}</h3>
                    <span className="tag" style={{ background: "var(--color-purple-soft)", color: "var(--color-purple)" }}>
                      Blog release
                    </span>
                    {!isCrownBlogReleased(row.post) ? (
                      <span className="tag">Upcoming</span>
                    ) : null}
                  </div>
                  <p style={{ color: "var(--color-ink-muted)", margin: "0.35rem 0" }}>
                    {crownBlogReleaseStart(row.post).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · Blog Space (live at start of day)
                  </p>
                  <p style={{ margin: "0 0 0.75rem" }}>{row.post.excerpt}</p>
                  <Link className="btn btn-secondary" to={`/crown/blog/${row.post.slug}`}>
                    {isCrownBlogReleased(row.post) ? "Read in Blog Space" : "Open in Blog Space (live on release date)"}
                  </Link>
                </article>
              ),
            )
          )}
        </div>
      </section>

      <section aria-labelledby="gallery-heading" style={{ marginTop: "var(--space-xl)" }}>
        <h2 id="gallery-heading" style={{ fontSize: "1.15rem" }}>
          Event highlights (gallery)
        </h2>
        <p className="lede">Snapshots uploaded by admins after gatherings — thank you for showing up generously.</p>
        <div className="card-list">
          {getEventGalleryPhotos().length === 0 ? (
            <div className="empty-state">No gallery photos yet — admins add them from Site admin › Gallery.</div>
          ) : (
            getEventGalleryPhotos().map((p) => (
              <article key={p.id} className="surface" style={{ padding: "var(--space-md)" }}>
                {p.imageDataUrl ? (
                  <img src={p.imageDataUrl} alt="" style={{ width: "100%", borderRadius: 12, marginBottom: "0.35rem" }} />
                ) : null}
                <h3 style={{ margin: "0.25rem 0", fontSize: "1.05rem" }}>{p.title}</h3>
                <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "0.95rem" }}>{p.caption}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <style>{`
        .cal-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-sm) var(--space-md);
          margin-bottom: var(--space-md);
        }
        .cal-grid {
          --cal-line: color-mix(in srgb, var(--color-teal-dark) 36%, var(--color-border));
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 1px;
          padding: 1px;
          background: var(--cal-line);
          border: 1px solid color-mix(in srgb, var(--color-teal-dark) 50%, var(--color-border));
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .cal-dow {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.5rem 0.35rem;
          background: color-mix(in srgb, var(--color-teal-soft) 75%, var(--color-bg-elevated));
          text-align: center;
          color: var(--color-teal-dark);
        }
        .cal-cell {
          min-height: 88px;
          background: var(--color-bg-elevated);
          padding: 0.3rem;
          font-size: 0.75rem;
        }
        .cal-cell--empty {
          background: color-mix(in srgb, var(--color-surface) 92%, var(--color-teal-soft));
        }
        .cal-daynum {
          font-weight: 700;
          color: var(--color-teal-dark);
          font-size: 0.8rem;
        }
        .cal-events {
          list-style: none;
          margin: 0.2rem 0 0;
          padding: 0;
        }
        .cal-events li {
          margin-bottom: 0.15rem;
        }
        .cal-ev-link {
          display: block;
          text-decoration: none;
          color: inherit;
          padding: 0.15rem 0.2rem;
          margin: 0 -0.2rem;
          border-radius: 6px;
          line-height: 1.3;
          transition: background 0.12s ease;
        }
        .cal-ev-link:hover {
          background: var(--color-teal-soft);
        }
        .cal-ev-link:focus {
          outline: none;
        }
        .cal-ev-link:focus-visible {
          outline: 2px solid var(--color-teal-dark);
          outline-offset: 1px;
        }
        .cal-pill {
          display: inline-block;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.05rem 0.25rem;
          border-radius: 4px;
          background: var(--color-teal-soft);
          color: var(--color-teal-dark);
          margin-right: 0.2rem;
        }
        .cal-pill--blog {
          background: var(--color-purple-soft);
          color: var(--color-purple);
        }
        .cal-ev-link--upcoming {
          opacity: 0.9;
        }
        .cal-ev-title {
          color: var(--color-ink);
        }
        @media (max-width: 640px) {
          .cal-cell {
            min-height: 72px;
            font-size: 0.68rem;
          }
        }
      `}</style>
    </div>
  );
}
