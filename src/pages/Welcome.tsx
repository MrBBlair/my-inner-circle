import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import hero1 from "../assets/welcome/hero-1.png";
import hero2 from "../assets/welcome/hero-2.png";
import hero3 from "../assets/welcome/hero-3.png";
import featureCommunity from "../assets/welcome/feature-community.png";
import featureEvents from "../assets/welcome/feature-events.png";
import featureWellness from "../assets/welcome/feature-wellness.png";
import imgSisterLocs from "../assets/welcome/welcome-sister-locs.png";
import imgStraightHair from "../assets/welcome/welcome-straight-hair.png";
import imgBraids from "../assets/welcome/welcome-braids.png";

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

/** Short reads on care, styling, and showing up as you are — by hair type. */
const HAIR_TYPE_GUIDES = [
  {
    src: imgSisterLocs,
    label: "Sister locs",
    alt: "Illustration of an African American woman with sisterlocks",
    excerpt:
      "Retwist schedules, buildup, and how to keep your parts happy — without treating your crown like a chore list.",
    body: "Sister locs thrive on consistency, not stress. Space out retwists enough that your roots don’t feel tight, rinse thoroughly after workouts or swim days, and reach for lightweight moisture that won’t cake. If buildup shows up, clarify gently and follow with something nourishing — your scalp deserves the same patience you give the rest of you.",
  },
  {
    src: imgStraightHair,
    label: "Straight hair",
    alt: "Illustration of an African American woman with sleek straight hair",
    excerpt:
      "Silk presses, heat balance, and humidity — how to enjoy sleek styles while keeping strands strong between appointments.",
    body: "Straightened styles are allowed to be fun, not fragile. Keep heat on a reasonable setting, use a heat protectant every time, and plan recovery days with braids or buns when you can. In humid seasons, anti-humidity serums can help — but the real flex is listening when your hair asks for a wash-and-go reset instead of another pass with the iron.",
  },
  {
    src: imgBraids,
    label: "Braids",
    alt: "Illustration of an African American woman with braided hairstyle",
    excerpt:
      "Knotless, box braids, twists — tension, edges, and wash day so protective styles stay protective.",
    body: "If it hurts when you leave the chair, speak up — tension can cost you edges. Oil your scalp lightly as needed, cleanse without roughing up the parts, and don’t keep a style in past its welcome. When you take braids down, detangle slowly and deep condition; that’s how the next install starts on healthy ground.",
  },
] as const;

const CURRENT_BLOG_POSTS = [
  {
    id: "locs-moisture",
    dateISO: "2025-03-12",
    dateLabel: "March 12, 2025",
    category: "Sister locs",
    title: "Moisture that actually stays in your locs",
    excerpt:
      "The difference between wet hair and hydrated locs — plus the leave-in vs. oil order that finally clicked for our editors.",
    body: "Spraying water alone often evaporates before your hair can drink. Try layering: dampen, add a water-based leave-in or light cream to the length of your locs, then seal lightly with oil on the ends if they feel dry — not a heavy grease mask on the whole head unless that’s what your scalp likes. Pay attention to how your locs feel two days later; that feedback is more honest than any routine you saw online.",
    src: imgSisterLocs,
    alt: "Illustration of an African American woman with sisterlocks",
    readMins: 4,
  },
  {
    id: "braid-tension",
    dateISO: "2025-03-08",
    dateLabel: "March 8, 2025",
    category: "Braids",
    title: "Braid day without the tension headache",
    excerpt:
      "What to ask your braider for, how to check tension at the mirror, and when to take a style down early — guilt-free.",
    body: "You’re paying for a service, not permission to be in pain. Ask for knotless or larger sections if your scalp is sensitive, and check the first row before they finish the whole head — adjustments are easier early. Headaches the same night, bumps along the parts, or pain when you raise your brows are signs to loosen or remove. Protective styles only protect when your follicles aren’t fighting for air.",
    src: imgBraids,
    alt: "Illustration of an African American woman with braided hairstyle",
    readMins: 5,
  },
] as const;

export function Welcome() {
  const { user, enterPreview } = useAuth();
  const nav = useNavigate();

  const handlePreviewEnter = () => {
    enterPreview();
    nav("/app");
  };

  return (
    <div className="welcome">
      <header className="welcome__hero">
        <div className="welcome__hero-grid">
          <div className="welcome__hero-inner">
            <p className="welcome__eyebrow">The My Inner Circle</p>
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
            {CURRENT_BLOG_POSTS.map((post) => (
              <li key={post.id}>
                <article className="welcome__crown-post">
                  <div className="welcome__crown-post-photo">
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
                    <details className="welcome__crown-details">
                      <summary>Continue reading</summary>
                      <p>{post.body}</p>
                    </details>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <h3 className="welcome__crown-subhead" id="crown-guides">
            Guides by hair type
          </h3>
          <ul className="welcome__crown-grid" aria-labelledby="crown-guides">
            {HAIR_TYPE_GUIDES.map((item) => (
              <li key={item.label} className="welcome__crown-card">
                <div className="welcome__crown-card-photo">
                  <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                </div>
                <div className="welcome__crown-card-copy">
                  <h4 className="welcome__crown-card-title">{item.label}</h4>
                  <p className="welcome__crown-card-excerpt">{item.excerpt}</p>
                  <details className="welcome__crown-details welcome__crown-details--compact">
                    <summary>Read the guide</summary>
                    <p>{item.body}</p>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="welcome__grid" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          What you will find inside
        </h2>
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
          AI-generated illustrations made for The My Inner Circle (preview); they are not photographs
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
          font-size: 1.08rem;
          line-height: 1.35;
          color: var(--color-ink);
        }
        .welcome__crown-post-excerpt {
          margin: 0 0 var(--space-sm);
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--color-ink-muted);
          flex: 1;
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
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: var(--color-ink);
        }
        .welcome__crown-card-excerpt {
          margin: 0 0 var(--space-sm);
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--color-ink-muted);
          flex: 1;
        }
        .welcome__crown-details {
          margin-top: auto;
          text-align: left;
        }
        .welcome__crown-details summary {
          cursor: pointer;
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--color-teal-dark);
          list-style-position: outside;
        }
        .welcome__crown-details summary:hover {
          text-decoration: underline;
        }
        .welcome__crown-details[open] summary {
          margin-bottom: 0.5rem;
        }
        .welcome__crown-details p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-ink-muted);
        }
        .welcome__crown-details--compact summary {
          font-size: 0.85rem;
        }
        .welcome__grid {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--space-xl) var(--space-md);
          display: grid;
          gap: var(--space-lg);
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
