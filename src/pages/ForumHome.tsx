import { useState } from "react";
import { Link } from "react-router-dom";
import { ForumCategoryPills, ForumFauxSearch } from "../components/ForumCategoryPills";
import { useAuth } from "../context/AuthContext";
import {
  CATEGORY_SHORT_LABEL,
  HUB_BANNER,
  slugifyForumSlug,
} from "../lib/forumHelpers";
import {
  CATEGORY_META,
  getNeighborhoodGroupRequests,
  getNeighborhoodGroups,
  getThreads,
  pushAdminNotification,
  saveNeighborhoodGroupRequests,
  type ForumCategorySlug,
} from "../lib/storage";

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
  const [circleName, setCircleName] = useState("");
  const [circleDesc, setCircleDesc] = useState("");
  const [reqNote, setReqNote] = useState<string | null>(null);

  if (!user) return null;

  const submitCircleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circleName.trim() || !circleDesc.trim()) return;
    const id = crypto.randomUUID?.() ?? `ngr_${Date.now()}`;
    const item = {
      id,
      proposedName: circleName.trim(),
      proposedSlug: slugifyForumSlug(circleName),
      description: circleDesc.trim(),
      requestedByUserId: user.id,
      requestedByName: user.displayName,
      createdAt: new Date().toISOString(),
      status: "pending" as const,
    };
    saveNeighborhoodGroupRequests([item, ...getNeighborhoodGroupRequests()]);
    pushAdminNotification({
      kind: "circle_request",
      title: "New neighborhood circle request",
      body: `${user.displayName} requested "${item.proposedName}" for admin review.`,
      actorId: user.id,
      actorName: user.displayName,
      href: "/admin",
      relatedId: item.id,
    });
    setCircleName("");
    setCircleDesc("");
    setReqNote("Submitted — admins review requests under Admin › Neighborhood.");
  };

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
      </div>

      <ForumCategoryPills trailing={<ForumFauxSearch />} />

      <section className="surface" style={{ padding: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>Neighborhood circles (private silos)</h2>
        <p style={{ color: "var(--color-ink-muted)" }}>
          Approved groups get their own feed, events mentions, virtual meetups, and meet-here vibes. Requests notify site
          admins for approval.
        </p>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {getNeighborhoodGroups().map((g) => (
            <li key={g.id} style={{ marginBottom: "0.65rem" }}>
              <Link to={`/forum/group/${g.slug}`} style={{ fontWeight: 700 }}>
                {g.name}
              </Link>
              <span style={{ color: "var(--color-ink-muted)", marginLeft: "0.35rem", fontSize: "0.9rem" }}>
                — {g.description}
              </span>
            </li>
          ))}
        </ul>
        {getNeighborhoodGroups().length === 0 ? (
          <p style={{ fontSize: "0.92rem", color: "var(--color-ink-muted)" }}>No micro-circles yet — request one below.</p>
        ) : null}
        <h3 style={{ fontSize: "1rem" }}>Request a new circle</h3>
        <form onSubmit={submitCircleRequest}>
          <div className="field">
            <label className="label" htmlFor="circle-name">
              Working title
            </label>
            <input
              id="circle-name"
              className="input"
              required
              value={circleName}
              onChange={(e) => setCircleName(e.target.value)}
              placeholder='e.g., "Oak Park moms night"'
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="circle-desc">
              Purpose &amp; ground rules sketch
            </label>
            <textarea
              id="circle-desc"
              className="textarea"
              required
              value={circleDesc}
              onChange={(e) => setCircleDesc(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit for approval
          </button>
          {reqNote ? (
            <p role="status" style={{ marginTop: "var(--space-sm)", fontWeight: 600 }}>
              {reqNote}
            </p>
          ) : null}
          {user.isSiteAdmin ? (
            <p style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)" }}>
              Shortcut: approve from <Link to="/admin">Site admin › Neighborhood</Link>.
            </p>
          ) : null}
        </form>
        <div style={{ marginTop: "var(--space-md)", fontSize: "0.88rem", color: "var(--color-ink-muted)" }}>
          Pending for you locally:{" "}
          <strong>{getNeighborhoodGroupRequests().filter((r) => r.requestedByUserId === user.id && r.status === "pending").length}</strong>
        </div>
      </section>

      <section aria-labelledby="hubs-heading">
        <h2 id="hubs-heading" className="sr-only">
          Conversation spaces
        </h2>
        <div className="nd-hub-grid">
          {SLUGS.map((slug) => {
            const meta = CATEGORY_META[slug];
            const joined = user.joinedCategories.includes(slug);
            const count = getThreads().filter(
              (t) => t.categorySlug === slug && !t.neighborhoodGroupId,
            ).length;
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
