import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ForumCategoryPills, ForumFauxSearch } from "../components/ForumCategoryPills";
import { useAuth } from "../context/AuthContext";
import {
  avatarToneClass,
  CATEGORY_SHORT_LABEL,
  commentCountForThread,
  displayInitials,
  formatRelativeTime,
} from "../lib/forumHelpers";
import { getNeighborhoodGroups, getThreads, saveThreads } from "../lib/storage";

export function NeighborhoodGroupForumPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (!user) return null;

  const group = getNeighborhoodGroups().find((g) => g.slug === slug);
  if (!group) {
    return (
      <div className="nd-forum">
        <p>Neighborhood circle not found.</p>
        <Link to="/forum">Back to neighborhood</Link>
      </div>
    );
  }

  const joined = user.joinedCategories.includes("community");
  const allowPost = joined;

  const threads = getThreads()
    .filter((t) => t.neighborhoodGroupId === group.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const createThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowPost || !title.trim() || !body.trim()) return;
    const t = {
      id: crypto.randomUUID?.() ?? `t_${Date.now()}`,
      categorySlug: "community" as const,
      neighborhoodGroupId: group.id,
      title: title.trim(),
      body: body.trim(),
      authorId: user.id,
      authorName: user.displayName,
      createdAt: new Date().toISOString(),
      heartUserIds: [] as string[],
    };
    saveThreads([t, ...getThreads()]);
    setTitle("");
    setBody("");
    nav(`/forum/community/${t.id}`);
  };

  return (
    <div className="nd-forum nd-forum--feed">
      <div className="nd-feed-header">
        <div>
          <Link to="/forum" className="nd-feed-header__back">
            ← All spaces
          </Link>
          <h1 className="nd-feed-header__name">{group.name}</h1>
          <p className="nd-forum__subtitle" style={{ marginTop: "0.25rem" }}>
            {group.description}
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--color-ink-muted)" }}>
            Invite link slug: <strong>{group.slug}</strong>
          </p>
        </div>
      </div>

      <ForumCategoryPills trailing={<ForumFauxSearch />} />

      {!joined && (
        <div className="nd-alert">
          Join the <strong>Community pulse</strong> room from{" "}
          <Link to="/forum">Neighborhood forum</Link> to reply here.
        </div>
      )}

      {allowPost && (
        <form className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-md)" }} onSubmit={createThread}>
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Start a thread in this circle</h2>
          <div className="field">
            <label className="label" htmlFor="ng-title">
              Headline
            </label>
            <input id="ng-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="ng-body">
              Details
            </label>
            <textarea id="ng-body" className="textarea" value={body} onChange={(e) => setBody(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">
            Post to {group.name}
          </button>
        </form>
      )}

      <section aria-label="Circle feed">
        <h2 className="sr-only">Posts in this circle</h2>
        {threads.length === 0 ? (
          <div className="nd-empty-feed">
            <p style={{ margin: 0, fontWeight: 700 }}>No posts yet</p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.92rem" }}>Kick off the first neighbor thread.</p>
          </div>
        ) : (
          threads.map((t) => {
            const nComments = commentCountForThread(t.id);
            return (
              <Link key={t.id} to={`/forum/${t.categorySlug}/${t.id}`} className="nd-post-card">
                <div className="nd-post-card__row">
                  <span className={`nd-avatar ${avatarToneClass(t.authorName)}`} aria-hidden>
                    {displayInitials(t.authorName)}
                  </span>
                  <div className="nd-post-card__main">
                    <div className="nd-post-card__head">
                      <p className="nd-post-card__author">{t.authorName}</p>
                      <span className="nd-post-card__time">{formatRelativeTime(t.createdAt)}</span>
                      <span className="nd-post-card__chip">{CATEGORY_SHORT_LABEL[t.categorySlug]}</span>
                    </div>
                    <h3 className="nd-post-card__title">{t.title}</h3>
                    <p className="nd-post-card__preview">{t.body}</p>
                    <div className="nd-post-card__footer">
                      <span aria-label={`${t.heartUserIds.length} thanks`}>
                        ♥ Thank ({t.heartUserIds.length})
                      </span>
                      <span aria-label={`${nComments} comments`}>
                        💬 {nComments} comment{nComments === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </section>
    </div>
  );
}
