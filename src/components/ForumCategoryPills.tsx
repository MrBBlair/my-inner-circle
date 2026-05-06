import { useEffect, useRef, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { CATEGORY_META, type ForumCategorySlug } from "../lib/storage";
import { CATEGORY_SHORT_LABEL } from "../lib/forumHelpers";

const SLUGS = Object.keys(CATEGORY_META) as ForumCategorySlug[];

function pillClass(isActive: boolean) {
  return "nd-cat-pill" + (isActive ? " nd-cat-pill--active" : "");
}

/** Decorative search chip */
export function ForumFauxSearch() {
  return (
    <div className="nd-faux-search nd-faux-search--toolbar" title="Search discussions — coming soon">
      <span className="sr-only">Search discussions — coming soon. Not available yet.</span>
      <span className="nd-faux-search__icon" aria-hidden>
        🔍
      </span>
      <span className="nd-faux-search__label" aria-hidden>
        Search — coming soon
      </span>
    </div>
  );
}

type ForumCategoryPillsProps = {
  /** e.g. &lt;ForumFauxSearch /&gt; — renders on the same row after the scrolling pills */
  trailing?: ReactNode;
};

export function ForumCategoryPills({ trailing }: ForumCategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el) return;
    let frame = 0;
    let direction: 1 | -1 = 1;
    let lastTs = 0;

    const setOverflow = () => {
      const overflow = Math.max(0, el.scrollWidth - el.clientWidth);
      el.dataset.marquee = overflow > 8 ? "true" : "false";
    };

    const step = (ts: number) => {
      const overflow = Math.max(0, el.scrollWidth - el.clientWidth);
      if (overflow > 8 && !el.matches(":focus-within")) {
        const delta = lastTs ? ts - lastTs : 16;
        const speed = 0.035;
        el.scrollLeft += direction * delta * speed;
        if (el.scrollLeft >= overflow - 1) direction = -1;
        if (el.scrollLeft <= 1) direction = 1;
      }
      lastTs = ts;
      frame = requestAnimationFrame(step);
    };

    setOverflow();
    const resizeObserver = new ResizeObserver(setOverflow);
    resizeObserver.observe(el);
    if (track) resizeObserver.observe(track);
    window.addEventListener("resize", setOverflow);
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", setOverflow);
    };
  }, []);

  const nav = (
    <div ref={scrollRef} className="nd-cat-scroll" role="navigation" aria-label="Neighborhood chat spaces">
      <div ref={trackRef} className="nd-cat-track">
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

  if (trailing) {
    return (
      <div className="nd-cat-toolbar">
        <div className="nd-cat-scroll-wrap nd-cat-scroll-wrap--grow">
          <p className="sr-only">Browse conversation spaces</p>
          {nav}
        </div>
        {trailing}
      </div>
    );
  }

  return (
    <div className="nd-cat-scroll-wrap">
      <p className="sr-only">Browse conversation spaces</p>
      {nav}
    </div>
  );
}
