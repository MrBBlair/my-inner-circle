import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ForumCategoryPills } from "../components/ForumCategoryPills";
import { ReportModal } from "../components/ReportModal";
import { useAuth } from "../context/AuthContext";
import {
  avatarToneClass,
  CATEGORY_SHORT_LABEL,
  displayInitials,
  formatRelativeTime,
} from "../lib/forumHelpers";
import {
  canPost,
  CATEGORY_META,
  getComments,
  getThreads,
  saveComments,
  saveThreads,
  type ForumCategorySlug,
} from "../lib/storage";

export function ThreadPage() {
  const { slug, threadId } = useParams();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [, bump] = useState(0);
  const replyDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = replyDialogRef.current;
    if (!el) return;
    if (replyOpen) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [replyOpen]);

  const categorySlug = slug as ForumCategorySlug | undefined;
  const thread =
    threadId && categorySlug
      ? getThreads().find((t) => t.id === threadId && t.categorySlug === categorySlug)
      : undefined;

  if (!user) return null;

  if (!categorySlug || !CATEGORY_META[categorySlug] || !thread) {
    return (
      <div className="nd-forum">
        <p>Thread not found.</p>
        <Link to="/forum">Back to neighborhood</Link>
      </div>
    );
  }

  const meta = CATEGORY_META[categorySlug];
  const comments = getComments()
    .filter((c) => c.threadId === thread.id)
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  const joined = user.joinedCategories.includes(categorySlug);
  const canComment = joined && canPost(user.tier);

  const toggleHeart = () => {
    const threads = getThreads();
    const idx = threads.findIndex((t) => t.id === thread.id);
    if (idx === -1) return;
    const t = threads[idx];
    const has = t.heartUserIds.includes(user.id);
    const heartUserIds = has
      ? t.heartUserIds.filter((id) => id !== user.id)
      : [...t.heartUserIds, user.id];
    const next = [...threads];
    next[idx] = { ...t, heartUserIds };
    saveThreads(next);
    bump((n) => n + 1);
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canComment || !comment.trim()) return;
    const c = {
      id: crypto.randomUUID?.() ?? `c_${Date.now()}`,
      threadId: thread.id,
      authorId: user.id,
      authorName: user.displayName,
      body: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    saveComments([...getComments(), c]);
    setComment("");
    setReplyOpen(false);
    bump((n) => n + 1);
  };

  const live = getThreads().find((t) => t.id === thread.id) ?? thread;
  const heartedLive = live.heartUserIds.includes(user.id);

  return (
    <div className="nd-forum nd-forum--feed">
      <div className="nd-feed-header">
        <div>
          <Link to={`/forum/${categorySlug}`} className="nd-feed-header__back">
            ← {meta.title}
          </Link>
        </div>
      </div>

      <ForumCategoryPills />

      <article className="nd-thread-hero">
        <div className="nd-post-card__row">
          <span className={`nd-avatar ${avatarToneClass(live.authorName)}`} aria-hidden>
            {displayInitials(live.authorName)}
          </span>
          <div className="nd-post-card__main">
            <div className="nd-post-card__head">
              <p className="nd-post-card__author">{live.authorName}</p>
              <span className="nd-post-card__time">{formatRelativeTime(live.createdAt)}</span>
              <span className="nd-post-card__chip">{CATEGORY_SHORT_LABEL[categorySlug]}</span>
            </div>
            <h1 className="nd-thread-hero__title">{live.title}</h1>
          </div>
        </div>
        <div className="nd-thread-body">{live.body}</div>
        {live.attachmentDataUrls && live.attachmentDataUrls.length > 0 && (
          <div className="nd-thread-attachments" aria-label="Photos attached to this post">
            {live.attachmentDataUrls.map((src, i) => (
              <figure key={i}>
                <img src={src} alt={`Attachment ${i + 1} on this post`} loading="lazy" />
              </figure>
            ))}
          </div>
        )}
        <div className="nd-thread-actions">
          <button
            type="button"
            className="btn btn-heart"
            data-active={heartedLive}
            onClick={toggleHeart}
            aria-pressed={heartedLive}
          >
            ♥ Thank · {live.heartUserIds.length}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setReportOpen(true)}>
            Report
          </button>
        </div>
      </article>

      <section aria-labelledby="comments-heading">
        <h2 id="comments-heading" className="nd-comments-title">
          Replies ({comments.length})
        </h2>
        {!canComment && (
          <div className="nd-alert">
            Join this space and use <strong>Bloom+</strong> to reply — we keep chats kind and
            on-topic.
          </div>
        )}
        {canComment && (
          <>
            <button
              type="button"
              className="nd-btn nd-btn--primary"
              style={{ marginBottom: "var(--space-md)" }}
              onClick={() => setReplyOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={replyOpen}
            >
              Add a reply
            </button>
            <dialog
              ref={replyDialogRef}
              className="nd-forum-dialog"
              aria-labelledby="nd-reply-dialog-title"
              onClose={() => setReplyOpen(false)}
            >
              <div className="nd-forum-dialog__inner">
                <header className="nd-forum-dialog__head">
                  <h2 id="nd-reply-dialog-title" className="nd-forum-dialog__title">
                    Reply to thread
                  </h2>
                  <button
                    type="button"
                    className="nd-forum-dialog__close"
                    aria-label="Close reply form"
                    onClick={() => setReplyOpen(false)}
                  >
                    ×
                  </button>
                </header>
                <form onSubmit={submitComment} className="nd-composer">
                  <div className="nd-post-card__row" style={{ marginBottom: "var(--space-sm)" }}>
                    <span className={`nd-avatar nd-avatar--sm ${avatarToneClass(user.displayName)}`} aria-hidden>
                      {displayInitials(user.displayName)}
                    </span>
                    <span style={{ fontWeight: 800, alignSelf: "center" }}>{user.displayName}</span>
                  </div>
                  <label className="sr-only" htmlFor="comment">
                    Your reply
                  </label>
                  <textarea
                    id="comment"
                    className="nd-textarea"
                    required
                    autoFocus
                    placeholder="Write a supportive reply…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="nd-forum-dialog__actions">
                    <button type="button" className="nd-btn nd-btn--ghost" onClick={() => setReplyOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="nd-btn nd-btn--primary">
                      Post reply
                    </button>
                  </div>
                </form>
              </div>
            </dialog>
          </>
        )}
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {comments.map((c) => (
            <li key={c.id} className="nd-comment">
              <span className={`nd-avatar nd-avatar--sm ${avatarToneClass(c.authorName)}`} aria-hidden>
                {displayInitials(c.authorName)}
              </span>
              <div className="nd-comment__body">
                <p className="nd-comment__author">{c.authorName}</p>
                <p className="nd-comment__text">{c.body}</p>
                <p className="nd-comment__time">{formatRelativeTime(c.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="thread"
        targetId={live.id}
        threadId={live.id}
      />
    </div>
  );
}
