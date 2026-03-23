import { useMemo, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { buildICS, downloadICS } from "../lib/calendar";
import { getEvents, saveEvents } from "../lib/storage";

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

  const events = getEvents();

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

  const addToCal = (ev: (typeof events)[0]) => {
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

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));

  return (
    <div>
      <h1 className="page-title">Events calendar</h1>
      <p className="lede">
        Virtual meetups and local gatherings. RSVP to save your spot, then add the event to your
        calendar app.
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
                    <span className="cal-pill">{ev.virtual ? "Online" : "Local"}</span>
                    <span className="cal-ev-title">{ev.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
      </div>

      <section style={{ marginTop: "var(--space-xl)" }} aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" style={{ fontSize: "1.2rem" }}>
          Upcoming &amp; RSVP
        </h2>
        <div className="card-list">
          {events
            .filter((e) => new Date(e.dateISO) >= new Date(new Date().setHours(0, 0, 0, 0)))
            .sort((a, b) => (a.dateISO > b.dateISO ? 1 : -1))
            .map((ev) => {
              const going = ev.rsvpUserIds.includes(user.id);
              return (
                <article key={ev.id} className="surface" style={{ padding: "var(--space-md)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                    <h3 style={{ margin: 0, flex: "1 1 200px" }}>{ev.title}</h3>
                    <span className="tag tag-teal">{ev.virtual ? "Virtual" : "In person"}</span>
                  </div>
                  <p style={{ color: "var(--color-ink-muted)", margin: "0.35rem 0" }}>
                    {new Date(ev.dateISO).toLocaleString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {" · "}
                    {ev.location}
                  </p>
                  <p style={{ margin: "0 0 0.75rem" }}>{ev.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <button
                      type="button"
                      className={going ? "btn btn-secondary" : "btn btn-primary"}
                      onClick={() => toggleRsvp(ev.id)}
                    >
                      {going ? "Undo RSVP" : "RSVP"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => addToCal(ev)}>
                      Add to calendar
                    </button>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", margin: "0.5rem 0 0" }}>
                    {ev.rsvpUserIds.length} attending
                  </p>
                </article>
              );
            })}
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
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 1px;
          padding: 0;
          overflow: hidden;
          border-radius: var(--radius-md);
        }
        .cal-dow {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.4rem;
          background: var(--color-surface);
          text-align: center;
          color: var(--color-ink-muted);
        }
        .cal-cell {
          min-height: 88px;
          background: var(--color-bg-elevated);
          padding: 0.25rem;
          font-size: 0.75rem;
        }
        .cal-cell--empty {
          background: var(--color-surface);
        }
        .cal-daynum {
          font-weight: 700;
          color: var(--color-ink-muted);
        }
        .cal-events {
          list-style: none;
          margin: 0.2rem 0 0;
          padding: 0;
        }
        .cal-events li {
          margin-bottom: 0.15rem;
        }
        .cal-pill {
          display: inline-block;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.05rem 0.25rem;
          border-radius: 4px;
          background: var(--color-purple-soft);
          color: var(--color-purple);
          margin-right: 0.2rem;
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
