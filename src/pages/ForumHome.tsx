import { Link } from "react-router-dom";
import { ForumCategoryPills } from "../components/ForumCategoryPills";
import { useAuth } from "../context/AuthContext";
import {
  CATEGORY_SHORT_LABEL,
  HUB_BANNER,
} from "../lib/forumHelpers";
import { CATEGORY_META, getThreads, type ForumCategorySlug } from "../lib/storage";

const SLUGS = Object.keys(CATEGORY_META) as ForumCategorySlug[];

const HUB_ICONS: Record<ForumCategorySlug, string> = {
  health: "🌿",
  career: "💼",
  healing: "💜",
  parenting: "🏠",
  community: "✦",
};

export function ForumHome() {
  const { user, updateProfile } = useAuth();
  if (!user) return null;

  const toggleJoin = (slug: ForumCategorySlug) => {
    const has = user.joinedCategories.includes(slug);
    const joinedCategories = has
      ? user.joinedCategories.filter((s) => s !== slug)
      : [...user.joinedCategories, slug];
    updateProfile({ joinedCategories });
  };

  return (
    <div className="nd-forum">
      <div className="nd-forum__topbar">
        <div>
          <h1 className="nd-forum__title">Neighborhood forum</h1>
          <p className="nd-forum__subtitle">
            Host categorized chats the way local apps do — pick your spaces, scroll the feed, and
            join the conversations that fit your season.
          </p>
        </div>
        <div className="nd-faux-search" aria-hidden>
          <span className="nd-faux-search__icon">🔍</span>
          <span>Search discussions (coming soon)</span>
        </div>
      </div>

      <ForumCategoryPills />

      <section aria-labelledby="hubs-heading">
        <h2 id="hubs-heading" className="sr-only">
          Conversation spaces
        </h2>
        <div className="nd-hub-grid">
          {SLUGS.map((slug) => {
            const meta = CATEGORY_META[slug];
            const joined = user.joinedCategories.includes(slug);
            const count = getThreads().filter((t) => t.categorySlug === slug).length;
            return (
              <article key={slug} className="nd-hub-card">
                <div
                  className="nd-hub-card__banner"
                  style={{ background: HUB_BANNER[slug] }}
                >
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "8px",
                      fontSize: "1.75rem",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,.15))",
                    }}
                    aria-hidden
                  >
                    {HUB_ICONS[slug]}
                  </span>
                </div>
                <div className="nd-hub-card__body">
                  <h3 className="nd-hub-card__title">{meta.title}</h3>
                  <p className="nd-hub-card__desc">{meta.description}</p>
                  <p className="nd-hub-card__meta">
                    {count} discussion{count === 1 ? "" : "s"} · {CATEGORY_SHORT_LABEL[slug]}
                  </p>
                  <div className="nd-hub-card__actions">
                    <button
                      type="button"
                      className={joined ? "nd-btn nd-btn--outline" : "nd-btn nd-btn--primary"}
                      onClick={() => toggleJoin(slug)}
                    >
                      {joined ? "Joined" : "Join space"}
                    </button>
                    <Link to={`/forum/${slug}`} className="nd-btn nd-btn--ghost">
                      View feed →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
