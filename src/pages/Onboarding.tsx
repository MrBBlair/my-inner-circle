import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

const INTERESTS = [
  "Mindful movement",
  "Career growth",
  "Boundaries",
  "Motherhood",
  "Healing from burnout",
  "Financial wellness",
  "Creative hobbies",
  "Friendship & belonging",
];

export function Onboarding() {
  const { user, updateProfile } = useAuth();
  const [bio, setBio] = useState(user?.bio ?? "");
  const [picked, setPicked] = useState<Set<string>>(
    () => new Set(user?.interests ?? []),
  );

  if (!user) return <Navigate to="/login" replace />;
  if (user.onboardingComplete) return <Navigate to="/app" replace />;

  const toggle = (label: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const finish = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      bio: bio.trim(),
      interests: Array.from(picked),
      onboardingComplete: true,
    });
  };

  return (
    <div className="onboarding">
      <div className="onboarding__card surface">
        <Link to="/" className="onboarding__brand" aria-label="The My Inner Circle App — home">
          <BrandLogo variant="full" size="sm" />
        </Link>
        <h1>Your profile</h1>
        <p className="lede">
          Tell us a little about you. This helps personalize your home feed and suggested forum
          rooms. You can change this anytime later.
        </p>
        <form onSubmit={finish}>
          <div className="field">
            <label className="label" htmlFor="bio">
              Short bio
            </label>
            <textarea
              id="bio"
              className="textarea"
              maxLength={280}
              placeholder="A few lines about what you’re navigating or hoping for in this season."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="hint">{bio.length}/280</p>
          </div>
          <div className="field">
            <span className="label">Interests</span>
            <p className="hint">Select all that resonate — we’ll highlight matching activity.</p>
            <div className="pill-row" style={{ marginTop: "0.5rem" }}>
              {INTERESTS.map((i) => (
                <button
                  key={i}
                  type="button"
                  className={"interest-chip" + (picked.has(i) ? " interest-chip--on" : "")}
                  onClick={() => toggle(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary onboarding__submit">
            Enter my Inner Circle
          </button>
        </form>
      </div>
      <style>{`
        .onboarding {
          min-height: 100dvh;
          padding: var(--space-xl) var(--space-md);
          background: linear-gradient(180deg, var(--color-purple-soft), transparent 40%), var(--color-bg);
        }
        .onboarding__card {
          max-width: 520px;
          margin: 0 auto;
          padding: var(--space-lg);
        }
        .onboarding__brand {
          display: flex;
          justify-content: center;
          line-height: 0;
          margin-bottom: var(--space-md);
          text-decoration: none;
          color: inherit;
        }
        .onboarding__brand:hover {
          opacity: 0.92;
        }
        .hint {
          font-size: 0.85rem;
          color: var(--color-ink-muted);
          margin: 0.25rem 0 0;
        }
        .interest-chip {
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          border-radius: 999px;
          padding: 0.35rem 0.75rem;
          font: inherit;
          font-size: 0.88rem;
          cursor: pointer;
          color: var(--color-ink-muted);
        }
        .interest-chip--on {
          background: var(--color-teal-soft);
          border-color: var(--color-teal);
          color: var(--color-teal-dark);
          font-weight: 600;
        }
        .onboarding__submit {
          width: 100%;
          margin-top: var(--space-md);
        }
      `}</style>
    </div>
  );
}
