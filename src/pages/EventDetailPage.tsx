import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QrInline } from "../components/QrInline";
import { useAuth } from "../context/AuthContext";
import { buildICS, downloadICS } from "../lib/calendar";
import { getMonetaryGivingUrl, PUBLIC_WEBSITE_URL } from "../lib/constants";
import { getEvents, saveEvents } from "../lib/storage";

export function EventDetailPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [, bump] = useState(0);
  const refresh = useCallback(() => bump((n) => n + 1), []);

  if (!user) return null;

  const ev = getEvents().find((e) => e.id === eventId);
  if (!ev) {
    return (
      <div>
        <p>Event not found.</p>
        <Link to="/events">Back to calendar</Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/events/${ev.id}` : "";
  const donate = ev.donationUrl || getMonetaryGivingUrl();
  const going = ev.rsvpUserIds.includes(user.id);

  const toggleRsvp = () => {
    const list = getEvents();
    const idx = list.findIndex((e) => e.id === ev.id);
    if (idx === -1) return;
    const cur = list[idx];
    const rsvpUserIds = going
      ? cur.rsvpUserIds.filter((id) => id !== user.id)
      : [...cur.rsvpUserIds, user.id];
    const next = [...list];
    next[idx] = { ...cur, rsvpUserIds };
    saveEvents(next);
    refresh();
  };

  const addToCal = () => {
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

  const mode = ev.registrationMode ?? "rsvp";

  return (
    <div>
      <p>
        <Link to="/events">← Events calendar</Link>
      </p>
      <h1 className="page-title">{ev.title}</h1>
      <p className="tag tag-teal">{ev.virtual ? "Virtual" : "In person"}</p>
      <p className="lede">
        {new Date(ev.dateISO).toLocaleString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}{" "}
        · {ev.location}
      </p>
      <p>{ev.description}</p>
      <p style={{ fontSize: "0.92rem", color: "var(--color-ink-muted)" }}>
        Registration: <strong>{mode}</strong>
        {ev.ticketPriceUsd != null ? ` · Suggested contribution $${ev.ticketPriceUsd}` : null}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "var(--space-md) 0" }}>
        {(mode === "rsvp" || mode === "ticket" || mode === "other") && (
          <button type="button" className={going ? "btn btn-secondary" : "btn btn-primary"} onClick={toggleRsvp}>
            {going ? "Undo RSVP" : "RSVP"}
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={addToCal}>
          Add to calendar (.ics)
        </button>
        <a className="btn btn-secondary" href={donate} target="_blank" rel="noreferrer">
          Donate / support
        </a>
        <a className="btn btn-ghost" href={PUBLIC_WEBSITE_URL} target="_blank" rel="noreferrer">
          Visit nonprofit site
        </a>
      </div>

      <section className="surface" style={{ padding: "var(--space-md)", maxWidth: 320 }}>
        <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Share this event</h2>
        <QrInline value={shareUrl} caption="Scan to open this event in the app" />
      </section>
    </div>
  );
}
