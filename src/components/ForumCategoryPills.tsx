import { NavLink } from "react-router-dom";
import { CATEGORY_META, type ForumCategorySlug } from "../lib/storage";
import { CATEGORY_SHORT_LABEL } from "../lib/forumHelpers";

const SLUGS = Object.keys(CATEGORY_META) as ForumCategorySlug[];

function pillClass(isActive: boolean) {
  return "nd-cat-pill" + (isActive ? " nd-cat-pill--active" : "");
}

export function ForumCategoryPills() {
  return (
    <div className="nd-cat-scroll-wrap">
      <p className="sr-only">Browse conversation spaces</p>
      <div className="nd-cat-scroll" role="navigation" aria-label="Neighborhood chat spaces">
        <NavLink to="/forum" end className={({ isActive }) => pillClass(isActive)}>
          All spaces
        </NavLink>
        {SLUGS.map((slug) => (
          <NavLink key={slug} to={`/forum/${slug}`} className={({ isActive }) => pillClass(isActive)}>
            {CATEGORY_SHORT_LABEL[slug]}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
