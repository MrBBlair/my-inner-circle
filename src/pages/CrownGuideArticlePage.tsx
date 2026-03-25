import { Link, Navigate, useParams } from "react-router-dom";
import { getCrownGuide } from "../content/crownChronicles";
import "../styles/crownArticle.css";

export function CrownGuideArticlePage() {
  const { slug } = useParams();
  const guide = getCrownGuide(slug);

  if (!guide) {
    return <Navigate to="/" replace />;
  }

  return (
    <article className="crown-article">
      <Link to="/#crown-heading" className="crown-article__back">
        ← Crown chronicles
      </Link>
      <p className="crown-article__eyebrow">Guide · Hair type</p>
      <h1 className="crown-article__title">{guide.label}</h1>
      <p className="crown-article__meta">
        <span className="crown-article__meta-cat">Guides by hair type</span>
      </p>
      <figure className="crown-article__hero">
        <img src={guide.src} alt={guide.alt} width={800} height={600} />
      </figure>
      <div className="crown-article__body">
        {guide.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {guide.sections.map((sec) => (
        <section key={sec.heading} className="crown-article__section">
          <h2>{sec.heading}</h2>
          <div className="crown-article__body">
            {sec.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ))}
      <p className="crown-article__closing">{guide.closing}</p>
      <p className="crown-article__cta">
        <Link to="/signup">Join the Inner Circle</Link> — bring your questions to the neighborhood when you are ready.
      </p>
      <p className="crown-article__credit">
        Artwork on this page is original illustration for The My Inner Circle App; not photographs of real members.
      </p>
    </article>
  );
}
