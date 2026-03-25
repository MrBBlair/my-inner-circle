import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import hero1 from "../assets/welcome/hero-1.png";
import hero2 from "../assets/welcome/hero-2.png";
import hero3 from "../assets/welcome/hero-3.png";
import featureCommunity from "../assets/welcome/feature-community.png";
import featureEvents from "../assets/welcome/feature-events.png";
import featureWellness from "../assets/welcome/feature-wellness.png";
import { CROWN_BLOG_POSTS, CROWN_GUIDES } from "../content/crownChronicles";

/** Bundled illustrations — African American women only (see footer note). */
const HERO_PHOTOS = [
  {
    src: hero1,
    alt: "Illustration of an African American woman smiling warmly in golden tones",
  },
  {
    src: hero2,
    alt: "Illustration of an African American woman with natural curls, relaxed and smiling",
  },
  {
    src: hero3,
    alt: "Illustration of an African American woman at home with a warm, inviting smile",
  },
] as const;

const FEATURE_PHOTOS = [
  {
    src: featureCommunity,
    alt: "Illustration of two African American women supporting each other as friends",
  },
  {
    src: featureEvents,
    alt: "Illustration of two African American women enjoying tea together on a sofa",
  },
  {
    src: featureWellness,
    alt: "Illustration of an African American woman in a peaceful wellness moment with journal and tea",
  },
] as const;

export function Welcome() {
  const { user, enterPreview } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#crown-heading") {
      document.getElementById("crown-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, location.pathname]);

  const handlePreviewEnter = () => {
    enterPreview();
    nav("/app");
  };

  return (
    <div className="welcome">
      <header className="welcome__hero">
        <div className="welcome__hero-grid">
          <div className="welcome__hero-inner">
            <p className="welcome__eyebrow">The My Inner Circle App</p>
            <h1 className="welcome__headline">
              Join your safe space to grow, connect, and move forward with purpose.
            </h1>
            <p className="welcome__sub">
              A warm, moderated community built with African American women in focus — like gathering
              in a friend’s living room: real talk, neighborhood-style forums, events, and wellness
              that fits real life.
            </p>
            <div className="welcome__cta-stack">
              {user?.onboardingComplete ? (
                <Link to="/app" className="btn btn-primary welcome__enter">
                  Enter
                </Link>
              ) : user ? (
                <Link to="/onboarding" className="btn btn-primary welcome__enter">
                  Continue setup
                </Link>
              ) : (
                <>
                  <button type="button" className="btn btn-primary welcome__enter" onClick={handlePreviewEnter}>
                    Enter
                  </button>
                  <p className="welcome__preview-hint">
                    Preview — no sign-in required. Data stays on this device.
                  </p>
                </>
              )}
              <p className="welcome__auth-links">
                <Link to="/signup">Join the Circle</Link>
                <span aria-hidden> · </span>
                <Link to="/login">Member login</Link>
              </p>
            </div>
            <ul className="welcome__trust">
              <li>Moderated discussions &amp; confidential reporting</li>
              <li>Tiered membership — upgrade as your needs grow</li>
              <li>Mobile-first, readable, and calm by design</li>
            </ul>
          </div>

          <div className="welcome__collage" aria-label="African American women in the Inner Circle community">
            <div className="welcome__collage-frame">
              <img
                className="welcome__collage-img welcome__collage-img--1"
                src={HERO_PHOTOS[0].src}
                alt={HERO_PHOTOS[0].alt}
                width={280}
                height={360}
                loading="eager"
                decoding="async"
              />
              <img
                className="welcome__collage-img welcome__collage-img--2"
                src={HERO_PHOTOS[1].src}
                alt={HERO_PHOTOS[1].alt}
                width={220}
                height={280}
                loading="eager"
                decoding="async"
              />
              <img
                className="welcome__collage-img welcome__collage-img--3"
                src={HERO_PHOTOS[2].src}
                alt={HERO_PHOTOS[2].alt}
                width={260}
                height={200}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="welcome__collage-caption">Sisterhood, strength, and your circle.</p>
          </div>
        </div>
      </header>

      <section className="welcome__homely" aria-labelledby="homely-heading">
        <div className="welcome__homely-inner">
          <h2 id="homely-heading" className="welcome__homely-title">
            Come as you are
          </h2>
          <p className="welcome__homely-text">
            We built this place to feel less like a corporate app and more like the corner of the
            couch where you can exhale — soft light, honest conversation, and neighbors who look like
            you and get it.
          </p>
        </div>
      </section>

      <section className="welcome__crown" aria-labelledby="crown-heading">
        <div className="welcome__crown-inner">
          <p className="welcome__crown-eyebrow">Crown chronicles</p>
          <h2 id="crown-heading" className="welcome__crown-title">
            Your crown, your way
          </h2>
          <p className="welcome__crown-lede">
            A small blog about hair types, care, and confidence — because how you wear your hair is part of how you
            move through the world. Whether you rock sister locs, a silk press, braids, or something else entirely, you
            belong here.
          </p>

          <h3 className="welcome__crown-subhead" id="crown-current">
            Current on the blog
          </h3>
          <ul className="welcome__crown-featured" aria-labelledby="crown-current">
            {CROWN_BLOG_POSTS.map((post) => (
              <li key={post.id}>
                <Link to={`/crown/blog/${post.slug}`} className="welcome__crown-post-link">
                  <article className="welcome__crown-post">
                    <div
                      className={
                        "welcome__crown-post-photo" +
                        (post.photoFocus === "lower" ? " welcome__crown-post-photo--focus-lower" : "")
                      }
                    >
                      <img src={post.src} alt={post.alt} loading="lazy" decoding="async" />
                    </div>
                    <div className="welcome__crown-post-body">
                      <p className="welcome__crown-post-meta">
                        <time dateTime={post.dateISO}>{post.dateLabel}</time>
                        <span aria-hidden> · </span>
                        <span className="welcome__crown-post-cat">{post.category}</span>
                        <span aria-hidden> · </span>
                        <span>{post.readMins} min read</span>
                      </p>
                      <h4 className="welcome__crown-post-title">{post.title}</h4>
                      <p className="welcome__crown-post-excerpt">{post.excerpt}</p>
                      <span className="welcome__crown-more">
                        Continue reading <span aria-hidden>→</span>
                      </span>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="welcome__crown-subhead" id="crown-guides">
            Guides by hair type
          </h3>
          <ul className="welcome__crown-grid" aria-labelledby="crown-guides">
            {CROWN_GUIDES.map((item) => (
              <li key={item.slug}>
                <Link to={`/crown/guide/${item.slug}`} className="welcome__crown-card-link">
                  <article className="welcome__crown-card">
                    <div className="welcome__crown-card-photo">
                      <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                    </div>
                    <div className="welcome__crown-card-copy">
                      <h4 className="welcome__crown-card-title">{item.label}</h4>
                      <p className="welcome__crown-card-excerpt">{item.excerpt}</p>
                      <span className="welcome__crown-more welcome__crown-more--compact">
                        Read the guide <span aria-hidden>→</span>
                      </span>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="welcome__features" aria-labelledby="features-heading">
        <div className="welcome__features-wrap">
          <header className="welcome__features-head">
            <p className="welcome__features-eyebrow">Inside the membership</p>
            <h2 id="features-heading" className="welcome__features-title">
              Community, events &amp; wellness
            </h2>
            <p className="welcome__features-lede">
              Beyond hair stories — this is what your Inner Circle login opens up: neighborhood-style
              rooms, real gatherings on the calendar, and gentle wellness you can do from your own space.
            </p>
          </header>
          <div className="welcome__grid">
            <article className="welcome__card welcome__card--home">
              <div className="welcome__card-photo-wrap">
                <img src={FEATURE_PHOTOS[0].src} alt={FEATURE_PHOTOS[0].alt} loading="lazy" decoding="async" />
              </div>
              <div className="welcome__card-body">
                <h3>Community forum</h3>
                <p>
                  Topic rooms for health, career, healing, parenting, and more — pull up a chair, share
                  what’s on your mind, and cheer each other on.
                </p>
              </div>
            </article>
            <article className="welcome__card welcome__card--home">
              <div className="welcome__card-photo-wrap">
                <img src={FEATURE_PHOTOS[1].src} alt={FEATURE_PHOTOS[1].alt} loading="lazy" decoding="async" />
              </div>
              <div className="welcome__card-body">
                <h3>Events &amp; RSVPs</h3>
                <p>
                  Virtual meetups and local gatherings — mark your calendar like a kitchen fridge full
                  of save-the-dates.
                </p>
              </div>
            </article>
            <article className="welcome__card welcome__card--home">
              <div className="welcome__card-photo-wrap">
                <img src={FEATURE_PHOTOS[2].src} alt={FEATURE_PHOTOS[2].alt} loading="lazy" decoding="async" />
              </div>
              <div className="welcome__card-body">
                <h3>Wellness &amp; growth</h3>
                <p>
                  Daily affirmations and gentle challenges — small rituals that feel doable from your own
                  space.
                </p>
              </div>
            </article>
          </div>
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
          This page centers African American women in original artwork only. Portraits and scenes are
          AI-generated illustrations made for The My Inner Circle App (preview); they are not photographs
          of real members.
        </p>
      </footer>

      <style>{`
        .welcome {
          min-height: 100dvh;
          background-color: #f7f1ea;
          background-image:
            radial-gradient(ellipse 100% 80% at 50% -20%, rgba(232, 180, 184, 0.35), transparent),
            radial-gradient(ellipse 80% 50% at 100% 50%, rgba(197, 221, 217, 0.25), transparent),
            radial-gradient(ellipse 60% 40% at 0% 80%, rgba(220, 212, 232, 0.3), transparent),
            repeating-linear-gradient(
              -12deg,
              transparent,
              transparent 12px,
              rgba(227, 220, 216, 0.35) 12px,
              rgba(227, 220, 216, 0.35) 13px
            );
        }
        .welcome__hero {
          position: relative;
          overflow: hidden;
          padding: var(--space-xl) var(--space-md) var(--space-lg);
          max-width: 1120px;
          margin: 0 auto;
        }
        .welcome__hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(92%, 720px);
          height: 4px;
          border-radius: 0 0 8px 8px;
          background: linear-gradient(90deg, var(--color-teal-soft), var(--color-blush), var(--color-purple-soft));
          opacity: 0.85;
        }
        .welcome__hero-grid {
          display: grid;
          gap: var(--space-xl);
          align-items: center;
        }
        @media (min-width: 900px) {
          .welcome__hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(280px, 400px);
          }
        }
        .welcome__hero-inner {
          position: relative;
          z-index: 1;
          max-width: 38rem;
        }
        .welcome__eyebrow {
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.75rem;
          color: var(--color-purple);
          margin: 0 0 var(--space-sm);
        }
        .welcome__headline {
          font-size: clamp(2rem, 5vw, 2.85rem);
          margin-bottom: var(--space-md);
          letter-spacing: -0.02em;
        }
        .welcome__sub {
          color: var(--color-ink-muted);
          font-size: 1.08rem;
          max-width: 36rem;
          line-height: 1.6;
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
          box-shadow: 0 4px 20px rgba(74, 124, 120, 0.25);
        }
        .welcome__preview-hint {
          margin: 0;
          font-size: 0.88rem;
          color: var(--color-ink-muted);
          max-width: 22rem;
        }
        .welcome__auth-links {
          margin: 0;
          font-size: 0.95rem;
        }
        .welcome__auth-links a {
          font-weight: 600;
        }
        .welcome__trust {
          margin: var(--space-md) 0 0;
          padding: var(--space-md) var(--space-md) var(--space-md) 1.75rem;
          color: var(--color-ink-muted);
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.55);
          border-radius: var(--radius-md);
          border: 1px solid rgba(227, 220, 216, 0.9);
          list-style-position: outside;
        }
        .welcome__trust li {
          margin-bottom: 0.35rem;
        }
        .welcome__trust li:last-child {
          margin-bottom: 0;
        }
        .welcome__collage {
          position: relative;
          z-index: 1;
          justify-self: center;
          width: 100%;
          max-width: 380px;
        }
        .welcome__collage-frame {
          position: relative;
          min-height: 340px;
          margin: 0 auto;
        }
        .welcome__collage-img {
          position: absolute;
          object-fit: cover;
          border-radius: 18px;
          border: 4px solid #fff;
          box-shadow:
            0 4px 6px rgba(45, 42, 50, 0.06),
            0 18px 40px rgba(45, 42, 50, 0.12);
        }
        .welcome__collage-img--1 {
          width: min(72%, 260px);
          height: auto;
          aspect-ratio: 280 / 360;
          top: 0;
          left: 0;
          z-index: 3;
          transform: rotate(-2deg);
        }
        .welcome__collage-img--2 {
          width: min(58%, 200px);
          height: auto;
          aspect-ratio: 220 / 280;
          top: 12%;
          right: 0;
          z-index: 2;
          transform: rotate(4deg);
        }
        .welcome__collage-img--3 {
          width: min(78%, 240px);
          height: auto;
          aspect-ratio: 260 / 200;
          bottom: 0;
          left: 18%;
          z-index: 1;
          transform: rotate(-1deg);
        }
        @media (max-width: 899px) {
          .welcome__collage-frame {
            min-height: 300px;
            max-width: 340px;
            margin: 0 auto;
          }
        }
        .welcome__collage-caption {
          text-align: center;
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-style: italic;
          color: var(--color-ink-muted);
          margin: var(--space-md) 0 0;
        }
        .welcome__homely {
          background: linear-gradient(180deg, rgba(255, 252, 248, 0.95), #ebe4dc);
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
        .welcome__crown {
          padding: var(--space-xl) var(--space-md);
          background: linear-gradient(180deg, rgba(255, 252, 248, 0.6), #f0ebe4);
          border-top: 1px solid rgba(227, 220, 216, 0.85);
          border-bottom: 1px solid rgba(227, 220, 216, 0.85);
        }
        .welcome__crown-inner {
          max-width: 960px;
          margin: 0 auto;
          text-align: center;
        }
        .welcome__crown-eyebrow {
          margin: 0 0 0.35rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.72rem;
          color: var(--color-purple);
        }
        .welcome__crown-title {
          font-family: var(--font-display);
          font-size: clamp(1.45rem, 3.5vw, 1.85rem);
          margin: 0 0 var(--space-sm);
          color: var(--color-teal-dark);
        }
        .welcome__crown-lede {
          margin: 0 auto var(--space-lg);
          max-width: 38rem;
          font-size: 1.02rem;
          line-height: 1.65;
          color: var(--color-ink-muted);
        }
        .welcome__crown-subhead {
          font-family: var(--font-display);
          font-size: 1.2rem;
          margin: var(--space-xl) 0 var(--space-md);
          color: var(--color-teal-dark);
          text-align: center;
        }
        .welcome__crown-subhead:first-of-type {
          margin-top: var(--space-md);
        }
        .welcome__crown-featured {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--space-lg);
          grid-template-columns: 1fr;
          text-align: left;
        }
        @media (min-width: 720px) {
          .welcome__crown-featured {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-md);
          }
        }
        .welcome__crown-post {
          background: #fffefb;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(227, 220, 216, 0.95);
          box-shadow: 0 8px 26px rgba(45, 42, 50, 0.07);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        @media (min-width: 480px) {
          .welcome__crown-post {
            flex-direction: row;
            align-items: stretch;
          }
        }
        .welcome__crown-post-photo {
          flex: 0 0 42%;
          min-height: 200px;
          max-height: 280px;
          overflow: hidden;
          background: var(--color-surface);
        }
        @media (min-width: 480px) {
          .welcome__crown-post-photo {
            max-height: none;
            min-height: 100%;
          }
        }
        .welcome__crown-post-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .welcome__crown-post-photo--focus-lower {
          background: linear-gradient(165deg, #b8a8cf 0%, #8e7aa3 45%, #6d5d7a 100%);
        }
        .welcome__crown-post-photo--focus-lower img {
          object-position: center 92%;
          transform: scale(1.14);
          transform-origin: center 90%;
        }
        .welcome__crown-post-body {
          padding: var(--space-md);
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .welcome__crown-post-meta {
          margin: 0 0 0.5rem;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-ink-muted);
        }
        .welcome__crown-post-cat {
          color: var(--color-teal-dark);
        }
        .welcome__crown-post-title {
          margin: 0 0 0.5rem;
          font-family: var(--font-display);
          font-size: 1.08rem;
          line-height: 1.35;
          color: var(--color-teal-dark);
        }
        .welcome__crown-post-excerpt {
          margin: 0 0 var(--space-sm);
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--color-ink-muted);
          flex: 1;
        }
        .welcome__crown-post-link,
        .welcome__crown-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
          border-radius: 18px;
          transition: box-shadow 0.18s ease, transform 0.18s ease;
        }
        .welcome__crown-post-link:focus-visible,
        .welcome__crown-card-link:focus-visible {
          outline: 2px solid var(--color-teal-dark);
          outline-offset: 3px;
        }
        .welcome__crown-post-link:hover .welcome__crown-post,
        .welcome__crown-card-link:hover .welcome__crown-card {
          box-shadow: 0 14px 36px rgba(45, 42, 50, 0.11);
        }
        .welcome__crown-more {
          margin-top: auto;
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--color-teal-dark);
        }
        .welcome__crown-more--compact {
          font-size: 0.85rem;
        }
        .welcome__crown-grid {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--space-md);
          grid-template-columns: 1fr;
          text-align: left;
        }
        @media (min-width: 640px) {
          .welcome__crown-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .welcome__crown-card {
          background: #fffefb;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(227, 220, 216, 0.95);
          box-shadow: 0 6px 22px rgba(45, 42, 50, 0.06);
          display: flex;
          flex-direction: column;
        }
        .welcome__crown-card-photo {
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: var(--color-surface);
        }
        .welcome__crown-card-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .welcome__crown-card-copy {
          padding: var(--space-sm) var(--space-md) var(--space-md);
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .welcome__crown-card-title {
          margin: 0 0 0.4rem;
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--color-teal-dark);
        }
        .welcome__crown-card-excerpt {
          margin: 0 0 var(--space-sm);
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--color-ink-muted);
          flex: 1;
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
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .welcome__card--home {
          background: #fffefb;
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
