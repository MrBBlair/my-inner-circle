import { useMemo, useState } from "react";
import { AFFIRMATIONS_365 } from "../content/wellnessAffirmations";
import { getMonthlyChallengeFor } from "../content/wellnessMonthlyChallenges";
import { useAuth } from "../context/AuthContext";
import { affirmationIndexForDay, getLocalDayOfYear } from "../lib/wellnessSchedule";

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function WellnessPage() {
  const { user } = useAuth();
  const [joined, setJoined] = useState(false);

  if (!user) return null;

  const dateKey = localDateKey(new Date());
  const quote = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const doy = getLocalDayOfYear(d);
    const idx = affirmationIndexForDay(year, doy, AFFIRMATIONS_365.length);
    return AFFIRMATIONS_365[idx] ?? "";
  }, [dateKey]);

  const monthlyChallenge = useMemo(() => getMonthlyChallengeFor(new Date()), [dateKey]);

  return (
    <div>
      <h1 className="page-title">Affirmations &amp; challenges</h1>
      <p className="lede">
        Gentle daily grounding and a monthly challenge you can share with the circle — no pressure,
        no perfection. Affirmations reuse the same collection each year with a new order; challenges
        rotate by calendar month and shuffle each year.
      </p>

      <section className="surface affirm-card" aria-labelledby="daily-heading">
        <h2 id="daily-heading" style={{ fontSize: "1.2rem" }}>
          Today’s affirmation
        </h2>
        <p className="affirm-quote">“{quote}”</p>
        <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", margin: 0 }}>
          One line per local calendar day; order reshuffles each January. Save or screenshot what speaks to you.
        </p>
      </section>

      <section className="surface challenge-card" style={{ marginTop: "var(--space-lg)" }} aria-labelledby="challenge-heading">
        <h2 id="challenge-heading" style={{ fontSize: "1.2rem" }}>
          This month’s challenge: {monthlyChallenge.title}
        </h2>
        <p>{monthlyChallenge.summary}</p>
        <button
          type="button"
          className={joined ? "btn btn-secondary" : "btn btn-primary"}
          onClick={() => setJoined((j) => !j)}
        >
          {joined ? "Leave challenge" : "Join this month’s challenge"}
        </button>
        <ol className="challenge-days">
          {monthlyChallenge.weeks.map((line, i) => (
            <li key={`${monthlyChallenge.id}-${i}`}>
              {line}
            </li>
          ))}
        </ol>
      </section>

      <style>{`
        .affirm-card {
          padding: var(--space-lg);
          background: linear-gradient(135deg, var(--color-teal-soft), var(--color-purple-soft));
          border: none;
        }
        .affirm-quote {
          font-family: var(--font-display);
          font-size: clamp(1.15rem, 3vw, 1.45rem);
          line-height: 1.45;
          margin: var(--space-md) 0;
        }
        .challenge-card {
          padding: var(--space-lg);
        }
        .challenge-days {
          margin: var(--space-md) 0 0;
          padding-left: 1.2rem;
          color: var(--color-ink-muted);
        }
        .challenge-days li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
