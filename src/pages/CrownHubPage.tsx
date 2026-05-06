import { Link } from "react-router-dom";
import { getReleasedCrownBlogPosts, resolveCrownBlogHeroSrc } from "../content/crownChronicles";

export function CrownHubPage() {
  const releasedPosts = getReleasedCrownBlogPosts();
  const hasPosts = releasedPosts.length > 0;

  return (
    <div className="crown-hub">
      <header className="crown-hub__hero surface">
        <h1 className="welcome__crown-title">My Inner Circle Blog Space</h1>
        <p className="welcome__crown-lede">
          Stories and updates from the circle — read at your own pace, neighbor to neighbor. A new long read is released
          on the 1st of each month.
        </p>
      </header>

      <section className="welcome__crown" aria-label="My Inner Circle Blog Space">
        <div className="welcome__crown-inner">
          {hasPosts ? (
            <>
              <h2 id="crown-blog-heading" className="welcome__crown-subhead">
                Current on the blog
              </h2>
              <ul className="welcome__crown-featured" aria-labelledby="crown-blog-heading">
                {releasedPosts.map((post) => (
                  <li key={post.id}>
                    <Link to={`/crown/blog/${post.slug}`} className="welcome__crown-post-link">
                      <article className="welcome__crown-post">
                        <div
                          className={
                            "welcome__crown-post-photo" +
                            (post.photoFocus === "lower" ? " welcome__crown-post-photo--focus-lower" : "")
                          }
                        >
                          <img
                          src={resolveCrownBlogHeroSrc(post)}
                          alt={post.alt}
                          loading="lazy"
                          decoding="async"
                        />
                        </div>
                        <div className="welcome__crown-post-body">
                          <p className="welcome__crown-post-meta">
                            <time dateTime={post.dateISO}>{post.dateLabel}</time>
                            <span aria-hidden> · </span>
                            <span className="welcome__crown-post-cat">{post.category}</span>
                            <span aria-hidden> · </span>
                            <span>{post.readMins} min read</span>
                          </p>
                          <h3 className="welcome__crown-post-title">{post.title}</h3>
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
            </>
          ) : (
            <p className="welcome__crown-empty">
              A new long read goes live on the 1st of each month. Check back then — thank you for stopping by.
            </p>
          )}
        </div>
      </section>

      <style>{`
        .crown-hub {
          min-height: 100dvh;
          background-color: var(--color-bg);
        }
        .crown-hub__hero {
          max-width: 720px;
          margin: var(--space-lg) auto;
          padding: var(--space-lg);
          text-align: center;
        }
        .crown-hub__hero .welcome__crown-title {
          font-size: clamp(1.5rem, 3.8vw, 2.05rem);
          line-height: 1.2;
        }
        .crown-hub__brand {
          display: none;
        }
        .welcome__crown {
          padding: var(--space-xl) var(--space-md);
          background: linear-gradient(180deg, rgba(255, 251, 252, 0.75), var(--color-surface));
          border-top: 1px solid rgba(227, 220, 216, 0.85);
        }
        .welcome__crown-inner {
          max-width: 960px;
          margin: 0 auto;
          text-align: center;
        }
        .welcome__crown-empty {
          margin: 0 auto;
          max-width: 28rem;
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--color-ink-muted);
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
          margin: var(--space-md) 0 var(--space-md);
          color: var(--color-teal-dark);
          text-align: center;
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
          }
        }
        .welcome__crown-post {
          background: var(--color-bg-elevated);
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
          }
        }
        .welcome__crown-post-photo {
          flex: 0 0 42%;
          min-height: 200px;
          overflow: hidden;
          background: var(--color-surface);
        }
        .welcome__crown-post-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
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
          color: var(--color-teal-dark);
        }
        .welcome__crown-post-excerpt {
          margin: 0 0 var(--space-sm);
          font-size: 0.92rem;
          color: var(--color-ink-muted);
          flex: 1;
        }
        .welcome__crown-post-link {
          text-decoration: none;
          color: inherit;
          border-radius: 18px;
        }
        .welcome__crown-more {
          margin-top: auto;
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--color-teal-dark);
        }
      `}</style>
    </div>
  );
}
