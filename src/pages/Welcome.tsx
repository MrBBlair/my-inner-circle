import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
/** Other stills from the public marketing site (Wix CDN: myinnercircleinc.org). */
import missionFriends from "../assets/welcome/official/mission-female-friends.jpg";
import impactWellnessWorth from "../assets/welcome/official/impact-wellness-worth.png";
import impactBackToSchool from "../assets/welcome/official/impact-back-to-school.png";
import impactMentorship from "../assets/welcome/official/impact-mentorship-sisterhood.png";

const HERO_IMAGE = "/c3dfe7_7f6cbe41e28d46aca6c4a5b6c2383d25~mv2.png-2.avif";
const BLOGSPACE_TILE_BG = "/blogspace-tile-bg.png";

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
        <div className="welcome__hero-stage">
          <div className="welcome__hero-photo-strip" aria-hidden="true">
            <img
              src={HERO_IMAGE}
              alt=""
              width={1024}
              height={554}
              decoding="async"
              fetchPriority="high"
              className="welcome__hero-photo-strip__img"
            />
          </div>
          <div className="welcome__hero-cluster">
            <div className="welcome__hero-inner">
              <p className="welcome__eyebrow">My Inner Circle</p>
              <h1 className="welcome__headline">
                Where women belong.
              </h1>
              <p className="welcome__sub">
                A multicultural movement rooted in friendship — built for every woman, every background, every generation.
                Connection, support, healing, and purpose, all in one circle.
              </p>
              <Link to="/signup" className="btn btn-primary welcome__join-btn">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="welcome__pillars" aria-labelledby="pillars-heading">
        <div className="welcome__pillars-inner surface">
          <h2 id="pillars-heading" className="welcome__pillars-title">
            What this circle stands on
          </h2>
          <p className="welcome__pillars-lede">
            My Inner Circle is more than a community — it is a movement rooted in friendship, designed to empower
            resilient women through connection, education, and transformative experiences that ignite growth,
            confidence, and purpose.
          </p>
          <ul className="welcome__pillars-grid">
            {[
              ["Friendship", "The heart of everything — real bonds, real people"],
              ["Support", "Show up for each other through every season"],
              ["Trust", "Moderated, safe, and confidential by design"],
              ["Education & Coaching", "Workshops, peer wisdom, and life skills"],
              ["Healing", "Mental, spiritual, and emotional wellness tools"],
              ["Legacy & Culture", "Every heritage honored — from teens to elders"],
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
            Build Your Best Self, Together.
          </h2>
          <p className="welcome__homely-text">
            My Inner Circle is where personal empowerment meets powerful collective action. Functioning as a purposeful
            sisterhood, our programs are uniquely designed around meaningful service, genuine mentorship, and lasting
            friendship. We provide focused support for your emotional, spiritual, and practical development, helping you
            not only become the best version of yourself but also actively support and build up the women around you.
            This is where your journey meets our mission.
          </p>
          <div className="welcome__homely-cta">
            <Link to="/signup" className="btn btn-primary">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      <section className="welcome__features" aria-labelledby="features-heading">
        <div className="welcome__features-wrap">
          <header className="welcome__features-head">
            <p className="welcome__features-eyebrow">Community impact in action</p>
            <h2 id="features-heading" className="welcome__features-title">
              Programs that make a real difference
            </h2>
            <p className="welcome__features-lede">
              From wellness gatherings to mentorship circles, back-to-school drives to neighborhood forums —
              every program is designed to close gaps, build bridges, and create lasting bonds between women.
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
                  Real friendships built in real rooms — online and in your neighborhood.
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
                  Healing days and restorative gatherings centered on mental, emotional, and spiritual health.
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
                  Supply drives and mentoring touchpoints empowering young girls to show up ready and strong.
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
                  Circles of strength where experienced women pour into the next generation — consistently and on purpose.
                </p>
              </div>
            </article>
          </div>
          <div className="welcome__features-cta">
            <Link to="/signup" className="btn btn-primary">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      <section className="welcome__crown-teaser" aria-labelledby="crown-teaser-heading">
        <div className="welcome__crown-teaser-inner">
          <h2 id="crown-teaser-heading" className="welcome__homely-title welcome__crown-teaser-title">
            My Inner Circle Blog Space
          </h2>
          <p className="welcome__homely-text welcome__crown-teaser-lede" style={{ textAlign: "center" }}>
            Community voices, shared stories, and reflections written for real life — published monthly.
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
          padding: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          border-bottom: 1px solid rgba(232, 200, 210, 0.55);
          background-color: transparent;
        }
        .welcome__hero--official::before {
          content: none;
        }
        .welcome__hero-stage {
          position: relative;
          z-index: 1;
          flex: none;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          width: 100%;
          max-width: none;
          margin: 0 auto;
          /* Mobile: stage must be tall enough for bottom-pinned copy; otherwise the cluster
             grows upward past the photo and clips under the sticky header (overflow:hidden). */
          min-height: min(82vh, 52rem);
        }
        .welcome__hero-photo-strip {
          display: block;
          width: 100%;
          background: #fff2f5;
          line-height: 0;
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .welcome__hero-photo-strip__img {
          width: 100%;
          height: 100%;
          min-height: 100%;
          display: block;
          object-fit: cover;
          object-position: center 28%;
          filter: saturate(1.08) brightness(1.06);
        }
        .welcome__hero-cluster {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          width: 100%;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          padding: var(--space-md);
          padding-bottom: var(--space-md);
          /* Keep long headlines/subcopy from riding up past the photo when type scales. */
          padding-top: max(var(--space-md), env(safe-area-inset-top, 0px));
          justify-content: flex-end;
          max-height: 100%;
          box-sizing: border-box;
        }
        .welcome__hero-inner {
          background: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border: none;
          border-radius: 0;
          box-shadow: none;
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: none;
          padding: 0;
          text-align: center;
        }
        .welcome__hero--official .welcome__eyebrow {
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 var(--space-sm);
          text-shadow:
            0 1px 2px rgba(0, 0, 0, 0.55),
            0 2px 14px rgba(0, 0, 0, 0.45);
        }
        .welcome__hero--official .welcome__headline {
          font-size: clamp(2rem, 5vw, 2.85rem);
          margin: 0 0 var(--space-md);
          letter-spacing: -0.02em;
          color: #fff;
          text-shadow:
            0 2px 4px rgba(0, 0, 0, 0.55),
            0 4px 28px rgba(0, 0, 0, 0.4);
        }
        .welcome__hero--official .welcome__sub {
          color: rgba(255, 255, 255, 0.94);
          font-size: 1rem;
          max-width: none;
          margin: 0;
          line-height: 1.65;
          text-shadow:
            0 1px 3px rgba(0, 0, 0, 0.65),
            0 2px 18px rgba(0, 0, 0, 0.45);
        }
        .welcome__join-btn {
          margin-top: var(--space-md);
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
        @media (min-width: 768px) {
          .welcome__hero--official {
            padding: clamp(3rem, 8vw, 4.5rem) var(--space-md);
            min-height: min(78vh, 680px);
            background-color: #fff2f5;
          }
          .welcome__hero--official::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0;
            background-image: url(${HERO_IMAGE});
            background-size: cover;
            background-position: center 30%;
            background-repeat: no-repeat;
            filter: saturate(1.08) brightness(1.06);
            transform: scale(1.01);
          }
          .welcome__hero-stage {
            flex: 1;
            justify-content: flex-end;
            max-width: 1120px;
            min-height: 0;
          }
          .welcome__hero-photo-strip {
            display: none;
            position: static;
            inset: auto;
            z-index: auto;
          }
          .welcome__hero-cluster {
            position: relative;
            left: auto;
            right: auto;
            bottom: auto;
            z-index: auto;
            padding: 0;
            padding-bottom: clamp(0.75rem, 2.5vw, 1.5rem);
            padding-top: 0;
            max-height: none;
            justify-content: flex-start;
          }
          .welcome__hero-inner {
            max-width: 42rem;
          }
          .welcome__hero--official .welcome__sub {
            font-size: 1.05rem;
          }
        }
        .welcome__homely {
          background: linear-gradient(180deg, rgba(255, 251, 252, 0.98), var(--color-surface));
          border-top: 1px solid rgba(227, 220, 216, 0.9);
          border-bottom: 1px solid rgba(227, 220, 216, 0.9);
          padding: var(--space-lg) var(--space-md);
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
        .welcome__homely-cta {
          margin-top: var(--space-lg);
        }
        @media (min-width: 768px) {
          .welcome__homely {
            padding: var(--space-xl) var(--space-md);
          }
          .welcome__pillars {
            padding: var(--space-lg) var(--space-md) var(--space-xl);
          }
          .welcome__pillars-inner {
            padding: var(--space-lg);
          }
          .welcome__crown-teaser {
            margin: 0 auto var(--space-xl);
            min-height: clamp(300px, 52vw, 440px);
          }
          .welcome__crown-teaser-inner {
            padding: var(--space-lg);
            padding-top: var(--space-xl);
          }
          .welcome__features {
            padding: var(--space-xl) 0 var(--space-md);
          }
          .welcome__features-head {
            margin: 0 auto var(--space-xl);
          }
          .welcome__footer {
            padding: var(--space-lg) var(--space-md) var(--space-xl);
            font-size: 0.95rem;
          }
        }
        .welcome__pillars {
          position: relative;
          isolation: isolate;
          padding: var(--space-md) var(--space-md) var(--space-lg);
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
          padding: var(--space-md);
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
          text-align: center;
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
          .welcome__pillars-lede {
            text-align: left;
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
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-width: min(640px, calc(100vw - 2 * var(--space-md)));
          margin: 0 auto var(--space-lg);
          padding: 0;
          text-align: center;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(192, 32, 128, 0.22);
          box-shadow: 0 10px 36px rgba(48, 27, 63, 0.12);
          background-color: #fff;
          background-image:
            linear-gradient(180deg, rgba(255, 251, 252, 0.35) 0%, rgba(255, 246, 250, 0.45) 100%),
            url(${BLOGSPACE_TILE_BG});
          background-repeat: no-repeat, no-repeat;
          background-size: cover, contain;
          background-position: center, center;
          min-height: min(50vh, 300px);
        }
        .welcome__crown-teaser-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
          position: relative;
          z-index: 1;
          margin-top: auto;
          width: 100%;
          padding: var(--space-md);
          padding-top: var(--space-lg);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 252, 253, 0.88) 22%,
            rgba(255, 252, 253, 0.97) 100%
          );
        }
        .welcome__crown-teaser-title {
          margin-top: 0;
          margin-bottom: var(--space-sm);
        }
        .welcome__crown-teaser-lede {
          margin-bottom: var(--space-md);
        }
        .welcome__features {
          padding: var(--space-lg) 0 var(--space-md);
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
          margin: 0 auto var(--space-lg);
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
          padding: 0 0 var(--space-md);
        }
        .welcome__features-cta {
          display: flex;
          justify-content: center;
          padding: var(--space-sm) 0 var(--space-lg);
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
          padding: var(--space-md) var(--space-md) var(--space-lg);
          color: var(--color-ink-muted);
          font-size: 0.92rem;
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
