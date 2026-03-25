import { Link, Navigate, useParams } from "react-router-dom";
import { getCrownBlogPost } from "../content/crownChronicles";
import "../styles/crownArticle.css";

export function CrownBlogArticlePage() {
  const { slug } = useParams();
  const post = getCrownBlogPost(slug);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  return (
    <article className="crown-article">
      <Link to="/#crown-heading" className="crown-article__back">
        ← Crown chronicles
      </Link>
      <p className="crown-article__eyebrow">Crown chronicles</p>
      <h1 className="crown-article__title">{post.title}</h1>
      <p className="crown-article__meta">
        <time dateTime={post.dateISO}>{post.dateLabel}</time>
        <span aria-hidden> · </span>
        <span className="crown-article__meta-cat">{post.category}</span>
        <span aria-hidden> · </span>
        <span>{post.readMins} min read</span>
      </p>
      <figure
        className={
          "crown-article__hero" +
          (post.photoFocus === "lower" ? " crown-article__hero--focus-lower" : "")
        }
      >
        <img src={post.src} alt={post.alt} width={800} height={600} />
      </figure>
      <div className="crown-article__body">
        {post.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {post.tips && post.tips.length > 0 && (
        <aside className="crown-article__tips" aria-label="Quick tips">
          <h2>Quick tips</h2>
          <ul>
            {post.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </aside>
      )}
      <p className="crown-article__cta">
        <Link to="/signup">Join the Inner Circle</Link> to swap routines with neighbors in our forums and events.
      </p>
      <p className="crown-article__credit">
        Artwork on this page is original illustration for The My Inner Circle App; not photographs of real members.
      </p>
    </article>
  );
}
