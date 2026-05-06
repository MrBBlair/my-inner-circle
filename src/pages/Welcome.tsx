import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
/** Hero: multicultural women composite (faces side by side). */
import heroMulticultural from "../assets/welcome/official/hero-multicultural.png";
/** Other stills from the public marketing site (Wix CDN: myinnercircleinc.org). */
import missionFriends from "../assets/welcome/official/mission-female-friends.jpg";
import impactWellnessWorth from "../assets/welcome/official/impact-wellness-worth.png";
import impactBackToSchool from "../assets/welcome/official/impact-back-to-school.png";
import impactMentorship from "../assets/welcome/official/impact-mentorship-sisterhood.png";

const FEATURE_PHOTOS = [
  {
    src: missionFriends,
    alt: "Friendship and connection: laughing and sharing stories",
  },
  {
    src: impactWellnessWorth,
    alt: "Wellness & Worth: a day of healing and connection — community gathering",
  },
  {
    src: impactBackToSchool,
    alt: "Back-to-School with Confidence: supporting young girls in need",
  },
  {
    src: impactMentorship,
    alt: "Empowering through mentorship: a sisterhood of strength",
  },
] as const;

export function Welcome() {
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#crown-heading") {
      nav("/crown" + location.search, { replace: true });
    }
  }, [location.hash, location.search, nav]);

  return (
    <div className="welcome">
      <header className="welcome__hero welcome__hero--official">
        <div className="welcome__hero-photo-strip" aria-hidden="true">
          <img
            src={heroMulticultural}
            alt=""
            width={2400}
            height={900}
            decoding="async"
            fetchPriority="high"
            className="welcome__hero-photo-strip__img"
          />
        </div>
        <div className="welcome__hero-grid">
          <div className="welcome__hero-inner">
            <p className="welcome__eyebrow">My Inner Circle</p>
            <h1 className="welcome__headline">
              Transform connection through friendship, trust, and support.
            </h1>
            <p className="welcome__sub">
              Women of every background — Black, White, Latina, Asian, Indigenous, and every heritage in between —
              seeking encouragement, mentorship, healing, mental and spiritual uplift, coaching, and lifelong friends.
              We welcome moms, daughters, grandmothers, teens (with guardians when needed), retirees, founders,
              creatives, caregivers, seekers, mentors, and elders: every generation, every culture, every story
              invited to meaningful rooms.
            </p>
            <ul className="welcome__trust">
              <li>Moderated discussions &amp; confidential reporting</li>
              <li>Free membership — full community access for every member</li>
              <li>Mobile-first, readable, and calm by design</li>
            </ul>
          </div>
        </div>
      </header>

      <section className="welcome__pillars" aria-labelledby="pillars-heading">
        <div className="welcome__pillars-inner surface">
          <h2 id="pillars-heading" className="welcome__pillars-title">
            What anchors this circle
          </h2>
          <p className="welcome__pillars-lede">
            Inner Circle echoes the heartbeat of friendship on{" "}
            <a href="https://www.myinnercircleinc.org" target="_blank" rel="noreferrer">
              myinnercircleinc.org
            </a>
            — a multicultural community where Black women, White women, Latinas, Asian women, Indigenous women, and
            women of every heritage find common ground. Support, trust, education, empowerment, healing, mentoring,
            friendship, spirituality, storytelling, generosity, joyful meetups near you &amp; online, and
            neighbor-style forums for every decade of life — because women everywhere deserve community that listens.
          </p>
          <ul className="welcome__pillars-grid">
            {[
              ["Support", "Hands-on empathy and referrals when storms hit"],
              ["Trust", "Transparency, moderated rooms, respectful boundaries"],
              ["Friendship", "The main focus — we grow better together"],
              ["Education & coaching", "Workshops & peer wisdom you can replay"],
              ["Healing", "Gentle tools for nervous systems and hearts"],
              ["Culture & Legacy", "Honoring every heritage — from elders to Gen Z"],
            ].map(([k, v]) => (
              <li key={k} className="welcome__pillars-chip">
                <strong>{k}</strong>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="welcome__homely" aria-labelledby="homely-heading">
        <div className="welcome__homely-inner">
          <h2 id="homely-heading" className="welcome__homely-title">
            Come as you are
          </h2>
          <p className="welcome__homely-text">
            We wanted it to feel like the cozy corner where you exhale — soft light, honest conversation, neighbors who
            get it. Every culture is welcome here: Black, Latina, Asian, White, Indigenous, and every beautiful blend.
            Multilingual corners, diaspora threads, bilingual aunties, Gen Z and grandmothers, all cheering one
            another forward.
          </p>
        </div>
      </section>

      <section className="welcome__features" aria-labelledby="features-heading">
        <div className="welcome__features-wrap">
          <header className="welcome__features-head">
            <p className="welcome__features-eyebrow">Community impact in action</p>
            <h2 id="features-heading" className="welcome__features-title">
              Programs you will feel in real life
            </h2>
            <p className="welcome__features-lede">
              Neighborhood-style rooms for women of all cultures and every generation — moderated gatherings,
              multilingual threads, mentorship spotlights spanning teens through elders, wellness respite tracks,
              and real-life service opportunities via Give. Whether you're 18 or 80, a first-generation immigrant
              or a third-generation local, a bilingual auntie or a caregiving grandmother — there is a room here
              for you, because friendship anchors every chapter.
            </p>
          </header>
          <div className="welcome__grid">
            <article className="welcome__card welcome__card--home">
              <div className="welcome__card-photo-wrap" style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  top: "1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "#fff",
                  fontWeight: "800",
                  letterSpacing: "0.1em",
                  textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                  zIndex: 2,
                  fontSize: "0.95rem"
                }}>
                  FRIENDSHIP
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <img src={FEATURE_PHOTOS[0].src} alt={FEATURE_PHOTOS[0].alt} loading="lazy" decoding="async" />
              </div>
              <div className="welcome__card-body">
                <h3>Lifelong connections</h3>
                <p>
                  Friendship anchors every chapter. Connect with neighbors and build real relationships that sustain through every season of life.
                </p>
              </div>
            </article>
            <article className="welcome__card welcome__card--home">
              <div className="welcome__card-photo-wrap">
                <img src={FEATURE_PHOTOS[1].src} alt={FEATURE_PHOTOS[1].alt} loading="lazy" decoding="async" />
              </div>
              <div className="welcome__card-body">
                <h3>Wellness &amp; worth</h3>
                <p>
                  Healing days and restorative gatherings — the same spirit as our in-person wellness programs on the
                  public site, now mirrored in app events and forum rooms.
                </p>
              </div>
            </article>
            <article className="welcome__card welcome__card--home">
              <div className="welcome__card-photo-wrap">
                <img src={FEATURE_PHOTOS[2].src} alt={FEATURE_PHOTOS[2].alt} loading="lazy" decoding="async" />
              </div>
              <div className="welcome__card-body">
                <h3>Back-to-school confidence</h3>
                <p>
                  Supply drives and mentoring touchpoints for young girls — align your RSVP and Give flows with the
                  outreach stories you see on myinnercircleinc.org.
                </p>
              </div>
            </article>
            <article className="welcome__card welcome__card--home">
              <div className="welcome__card-photo-wrap">
                <img src={FEATURE_PHOTOS[3].src} alt={FEATURE_PHOTOS[3].alt} loading="lazy" decoding="async" />
              </div>
              <div className="welcome__card-body">
                <h3>Mentorship sisterhood</h3>
                <p>
                  Circles of strength where peers and mentors show up consistently — carry that energy into directory
                  spotlights and neighborhood forums.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="welcome__crown-teaser surface" aria-labelledby="crown-teaser-heading">
        <div className="welcome__crown-teaser-inner">
          <p className="welcome__pillars-chip welcome__pillars-chip--plain">
            My Inner Circle Blog Space
          </p>
          <h2 id="crown-teaser-heading" className="welcome__homely-title" style={{ marginTop: "0.5rem" }}>
            Blog space &amp; stories
          </h2>
          <p className="welcome__homely-text" style={{ marginBottom: "var(--space-md)", textAlign: "center" }}>
            Community reads and reflections — a new long edition on the 1st of each month. Step in anytime; each issue
            is written for real life, not perfection.
          </p>
          <Link to="/crown" className="btn btn-primary">
            Open blog space
          </Link>
        </div>
      </section>

      <footer className="welcome__footer">
        <p>
          If you are in crisis, call or text <strong>988</strong> (US) or visit the{" "}
          <a href="https://988lifeline.org/" target="_blank" rel="noreferrer">
            988 Lifeline
          </a>
          . After you join, the in-app Support page includes a full resource directory.
        </p>
        <p className="welcome__photo-credit">
          Photos come from the "Community Impact in Action" gallery on{" "}
          <a href="https://www.myinnercircleinc.org" target="_blank" rel="noreferrer">
            myinnercircleinc.org
          </a>
          .
        </p>
      </footer>

      <style>{`
        .welcome {
          min-height: 100dvh;
          background-color: var(--color-bg);
          background-image:
            radial-gradient(ellipse 100% 80% at 50% -20%, rgba(234, 143, 128, 0.2), transparent),
            radial-gradient(ellipse 80% 50% at 100% 50%, rgba(235, 224, 247, 0.38), transparent),
            radial-gradient(ellipse 60% 40% at 0% 80%, rgba(107, 63, 160, 0.1), transparent),
            repeating-linear-gradient(
              -12deg,
              transparent,
              transparent 12px,
              rgba(232, 202, 219, 0.32) 12px,
              rgba(232, 202, 219, 0.32) 13px
            );
        }
        .welcome__hero {
          position: relative;
          overflow: hidden;
        }
        .welcome__hero--official {
          max-width: none;
          margin: 0;
          padding: clamp(3rem, 8vw, 4.5rem) var(--space-md);
          min-height: min(78vh, 680px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(232, 200, 210, 0.55);
          background-color: #1a0a0a;
          background-image: url(${heroMulticultural});
          background-size: cover;
          background-position: center 30%;
          background-repeat: no-repeat;
        }
        .welcome__hero--official::before {
          content: none;
        }
        .welcome__hero-photo-strip {
          display: none;
        }
        .welcome__hero-grid {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
        }
        .welcome__hero-inner {
          background: rgba(252, 234, 242, 0.52);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: var(--radius-lg);
          padding: var(--space-xl) var(--space-lg);
          border: 1px solid rgba(255, 255, 255, 0.55);
          box-shadow: 0 8px 40px rgba(92, 21, 56, 0.12);
          position: relative;
          z-index: 1;
          max-width: 40rem;
        }
        .welcome__hero--official .welcome__eyebrow {
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.75rem;
          color: var(--color-purple);
          margin: 0 0 var(--space-sm);
        }
        .welcome__hero--official .welcome__headline {
          font-size: clamp(2rem, 5vw, 2.85rem);
          margin-bottom: var(--space-md);
          letter-spacing: -0.02em;
          color: var(--color-teal-dark);
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
        }
        .welcome__hero--official .welcome__sub {
          color: var(--color-ink);
          font-size: 1.08rem;
          max-width: 36rem;
          line-height: 1.6;
          text-shadow: none;
        }
        .welcome__cta-stack {
          margin: var(--space-lg) 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-sm);
        }
        .welcome__enter {
          min-width: 200px;
          justify-content: center;
          font-size: 1.05rem;
          padding: 0.85rem 1.5rem;
          box-shadow: 0 4px 22px rgba(120, 50, 80, 0.18);
        }
        .welcome__hero--official .welcome__preview-hint {
          margin: 0;
          font-size: 0.88rem;
          color: var(--color-ink-muted);
          max-width: 22rem;
        }
        .welcome__hero--official .welcome__auth-links {
          margin: 0;
          font-size: 0.95rem;
          color: var(--color-ink);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.35rem;
        }
        .welcome__hero--official .welcome__auth-links a {
          font-weight: 600;
          color: var(--color-teal-dark);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .welcome__trust {
          margin: var(--space-md) 0 0;
          padding: var(--space-md) var(--space-md) var(--space-md) 1.75rem;
          font-size: 0.95rem;
          border-radius: var(--radius-md);
          list-style-position: outside;
        }
        .welcome__hero--official .welcome__trust {
          color: var(--color-ink-muted);
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(232, 200, 210, 0.65);
          backdrop-filter: blur(10px);
        }
        .welcome__trust li {
          margin-bottom: 0.35rem;
        }
        .welcome__trust li:last-child {
          margin-bottom: 0;
        }
        @media (max-width: 767px) {
          .welcome__hero--official {
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            background-image: none;
            background-color: transparent;
            min-height: 0;
            padding: 0;
          }
          .welcome__hero-photo-strip {
            display: block;
            width: 100%;
            background: #1a0a0a;
            line-height: 0;
          }
          .welcome__hero-photo-strip__img {
            width: 100%;
            height: auto;
            display: block;
            object-fit: contain;
            object-position: center top;
          }
          .welcome__hero-grid {
            padding: var(--space-md);
            max-width: none;
          }
          .welcome__hero-inner {
            max-width: none;
          }
        }
        .welcome__homely {
          background: linear-gradient(180deg, rgba(255, 251, 252, 0.98), var(--color-surface));
          border-top: 1px solid rgba(227, 220, 216, 0.9);
          border-bottom: 1px solid rgba(227, 220, 216, 0.9);
          padding: var(--space-xl) var(--space-md);
        }
        .welcome__homely-inner {
          max-width: 36rem;
          margin: 0 auto;
          text-align: center;
        }
        .welcome__homely-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          margin: 0 0 var(--space-sm);
          color: var(--color-teal-dark);
        }
        .welcome__homely-text {
          margin: 0;
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--color-ink-muted);
        }
        .welcome__pillars {
          position: relative;
          isolation: isolate;
          padding: var(--space-lg) var(--space-md) var(--space-xl);
          max-width: 1120px;
          margin: 0 auto;
        }
        .welcome__pillars::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: 20px;
          margin: var(--space-sm) 0;
          background-image: linear-gradient(
              155deg,
              rgba(255, 251, 252, 0.94) 0%,
              rgba(255, 245, 248, 0.86) 45%,
              rgba(253, 232, 239, 0.88) 100%
            ),
            url(${missionFriends});
          background-size: cover;
          background-position: center 36%;
          opacity: 1;
          pointer-events: none;
        }
        .welcome__pillars-inner {
          position: relative;
          z-index: 1;
          padding: var(--space-lg);
          text-align: center;
        }
        .welcome__pillars-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          margin: 0 0 var(--space-sm);
          color: var(--color-teal-dark);
        }
        .welcome__pillars-lede {
          margin: 0 auto var(--space-lg);
          max-width: 40rem;
          font-size: 1.02rem;
          line-height: 1.65;
          color: var(--color-ink-muted);
          text-align: left;
        }
        .welcome__pillars-grid {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--space-md);
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .welcome__pillars-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 960px) {
          .welcome__pillars-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .welcome__pillars-chip {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: left;
          padding: var(--space-md);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: rgba(255, 255, 255, 0.75);
        }
        .welcome__pillars-chip strong {
          font-size: 1.02rem;
          color: var(--color-teal-dark);
        }
        .welcome__pillars-chip span {
          font-size: 0.92rem;
          color: var(--color-ink-muted);
          line-height: 1.45;
        }
        .welcome__pillars-chip--plain {
          align-items: center;
          text-align: center;
          background: transparent;
          border-style: dashed;
        }
        .welcome__crown-teaser {
          max-width: 640px;
          margin: 0 auto var(--space-xl);
          padding: var(--space-lg);
          text-align: center;
        }
        .welcome__crown-teaser-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
        }
        .welcome__features {
          padding: var(--space-xl) 0 var(--space-md);
          border-top: 1px solid rgba(227, 220, 216, 0.85);
          background: linear-gradient(180deg, rgba(255, 252, 248, 0.85), transparent);
        }
        .welcome__features-wrap {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 var(--space-md);
        }
        .welcome__features-head {
          text-align: center;
          max-width: 38rem;
          margin: 0 auto var(--space-xl);
        }
        .welcome__features-eyebrow {
          margin: 0 0 0.35rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.72rem;
          color: var(--color-purple);
        }
        .welcome__features-title {
          font-family: var(--font-display);
          font-size: clamp(1.45rem, 3.5vw, 1.9rem);
          margin: 0 0 var(--space-sm);
          color: var(--color-teal-dark);
          line-height: 1.25;
        }
        .welcome__features-lede {
          margin: 0;
          font-size: 1.02rem;
          line-height: 1.65;
          color: var(--color-ink-muted);
        }
        .welcome__grid {
          display: grid;
          gap: var(--space-lg);
          padding: 0 0 var(--space-lg);
        }
        @media (min-width: 720px) {
          .welcome__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .welcome__grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .welcome__card--home {
          background: var(--color-bg-elevated);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(227, 220, 216, 0.95);
          box-shadow: 0 8px 28px rgba(45, 42, 50, 0.06);
          display: flex;
          flex-direction: column;
        }
        .welcome__card-photo-wrap {
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: var(--color-surface);
        }
        .welcome__card-photo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .welcome__card-body {
          padding: var(--space-md);
        }
        .welcome__card-body h3 {
          margin-top: 0;
          font-size: 1.15rem;
        }
        .welcome__card-body p {
          margin: 0;
          font-size: 0.95rem;
          color: var(--color-ink-muted);
          line-height: 1.55;
        }
        .welcome__footer {
          text-align: center;
          padding: var(--space-lg) var(--space-md) var(--space-xl);
          color: var(--color-ink-muted);
          font-size: 0.95rem;
        }
        .welcome__photo-credit {
          margin: var(--space-md) 0 0;
          font-size: 0.78rem;
          line-height: 1.5;
          max-width: 40rem;
          margin-left: auto;
          margin-right: auto;
        }
        .welcome__photo-credit a {
          color: var(--color-teal-dark);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
