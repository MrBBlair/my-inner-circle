import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { canJoinChallenges } from "../lib/storage";

const AFFIRMATIONS = [
  "You are allowed to take up space — your needs matter.",
  "Small steps still move mountains. Progress is not a race.",
  "Rest is not a reward you earn; it is part of how you thrive.",
  "Your boundaries are an act of love — for you and for others.",
  "You can be both healing and hopeful at the same time.",
  "Showing up imperfectly still counts as showing up.",
  "Community does not require performance — only presence.",
];

const CHALLENGE_DAYS = [
  "Name three specifics you are grateful for before noon.",
  "Send a kind note to someone who held you up this year.",
  "Take a ten-minute walk with no podcast — just breathe.",
  "Write down one boundary you are proud of maintaining.",
  "Savor a meal or drink without multitasking.",
  "List a fear you survived — evidence of your resilience.",
  "End the day by thanking your body for what it carried.",
];

function dayIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0).getTime();
  const diff = Date.now() - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function WellnessPage() {
  const { user } = useAuth();
  const [joined, setJoined] = useState(false);

  if (!user) return null;

  const quote = useMemo(() => {
    const i = dayIndex() % AFFIRMATIONS.length;
    return AFFIRMATIONS[i];
  }, []);

  const canChallenge = canJoinChallenges(user.tier);

  return (
    <div>
      <h1 className="page-title">Affirmations &amp; challenges</h1>
      <p className="lede">
        Gentle daily grounding and a weekly rhythm you can share with the circle — no pressure,
        no perfection.
      </p>

      <section className="surface affirm-card" aria-labelledby="daily-heading">
        <h2 id="daily-heading" style={{ fontSize: "1.2rem" }}>
          Today’s affirmation
        </h2>
        <p className="affirm-quote">“{quote}”</p>
        <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", margin: 0 }}>
          Refreshes daily — save or screenshot what speaks to you.
        </p>
      </section>

      <section className="surface challenge-card" style={{ marginTop: "var(--space-lg)" }} aria-labelledby="challenge-heading">
        <h2 id="challenge-heading" style={{ fontSize: "1.2rem" }}>
          7 Days of Gratitude
        </h2>
        <p>
          A community wellness challenge: one intentional prompt each day. Inner Circle members can
          officially join and track the week together.
        </p>
        {!canChallenge && (
          <p className="tier-note">
            <strong>Inner Circle tier</strong> unlocks joining tracked challenges. You can still
            follow along privately anytime.
          </p>
        )}
        {canChallenge && (
          <button
            type="button"
            className={joined ? "btn btn-secondary" : "btn btn-primary"}
            onClick={() => setJoined((j) => !j)}
          >
            {joined ? "Leave challenge" : "Join this week’s challenge"}
          </button>
        )}
        <ol className="challenge-days">
          {CHALLENGE_DAYS.map((day, i) => (
            <li key={i}>
              <strong>Day {i + 1}.</strong> {day}
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
        .tier-note {
          background: var(--color-surface);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-sm);
          font-size: 0.95rem;
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
