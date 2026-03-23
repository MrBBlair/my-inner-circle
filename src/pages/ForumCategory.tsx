import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ForumCategoryPills } from "../components/ForumCategoryPills";
import { useAuth } from "../context/AuthContext";
import {
  avatarToneClass,
  CATEGORY_SHORT_LABEL,
  commentCountForThread,
  formatRelativeTime,
  displayInitials,
} from "../lib/forumHelpers";
import {
  fileToOptimizedDataUrl,
  MAX_THREAD_ATTACHMENTS,
} from "../lib/threadAttachments";
import {
  canPost,
  CATEGORY_META,
  getThreads,
  saveThreads,
  type ForumCategorySlug,
} from "../lib/storage";

export function ForumCategoryPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [attachBusy, setAttachBusy] = useState(false);
  const composerDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = composerDialogRef.current;
    if (!el) return;
    if (composerOpen) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [composerOpen]);

  if (!user) return null;

  const categorySlug = slug as ForumCategorySlug | undefined;
  if (!categorySlug || !CATEGORY_META[categorySlug]) {
    return (
      <div className="nd-forum">
        <p>Category not found.</p>
        <Link to="/forum">Back to neighborhood</Link>
      </div>
    );
  }

  const meta = CATEGORY_META[categorySlug];
  const threads = getThreads()
    .filter((t) => t.categorySlug === categorySlug)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const joined = user.joinedCategories.includes(categorySlug);
  const allowPost = joined && canPost(user.tier);

  const onPickImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length) return;
    setAttachError(null);
    setAttachBusy(true);
    try {
      const room = MAX_THREAD_ATTACHMENTS - attachments.length;
      if (room <= 0) {
        setAttachError(`You can add up to ${MAX_THREAD_ATTACHMENTS} photos per post.`);
        return;
      }
      const list = Array.from(files).slice(0, room);
      const batch: string[] = [];
      for (const file of list) {
        batch.push(await fileToOptimizedDataUrl(file));
      }
      setAttachments((prev) => [...prev, ...batch].slice(0, MAX_THREAD_ATTACHMENTS));
    } catch (err) {
      setAttachError(err instanceof Error ? err.message : "Could not add image.");
    } finally {
      setAttachBusy(false);
      e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((a) => a.filter((_, i) => i !== index));
  };

  const createThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowPost || !title.trim() || !body.trim()) return;
    const snaps = [...attachments];
    const t = {
      id: crypto.randomUUID?.() ?? `t_${Date.now()}`,
      categorySlug,
      title: title.trim(),
      body: body.trim(),
      authorId: user.id,
      authorName: user.displayName,
      createdAt: new Date().toISOString(),
      heartUserIds: [] as string[],
      ...(snaps.length ? { attachmentDataUrls: snaps } : {}),
    };
    saveThreads([t, ...getThreads()]);
    setTitle("");
    setBody("");
    setAttachments([]);
    setAttachError(null);
    setComposerOpen(false);
    nav(`/forum/${categorySlug}/${t.id}`);
  };

  return (
    <div className="nd-forum nd-forum--feed">
      <div className="nd-feed-header">
        <div>
          <Link to="/forum" className="nd-feed-header__back">
            ← All spaces
          </Link>
          <h1 className="nd-feed-header__name">{meta.title}</h1>
          <p className="nd-forum__subtitle" style={{ marginTop: "0.25rem" }}>
            {meta.description}
          </p>
        </div>
      </div>

      <ForumCategoryPills />

      {!joined && (
        <div className="nd-alert">
          <strong>Join this space</strong> from the{" "}
          <Link to="/forum">All spaces</Link> overview to follow posts here and surface them on your
          home feed.
        </div>
      )}

      {joined && !canPost(user.tier) && (
        <div className="nd-alert">
          <strong>Seedling:</strong> read the neighborhood. Upgrade to <strong>Bloom</strong> or{" "}
          <strong>Inner Circle</strong> to start posts and replies.
        </div>
      )}

      {allowPost && (
        <section className="nd-composer" aria-label="Start a conversation">
          <button
            type="button"
            className="nd-composer__trigger"
            onClick={() => setComposerOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={composerOpen}
          >
            <span
              className={`nd-avatar nd-avatar--sm ${avatarToneClass(user.displayName)}`}
              aria-hidden
            >
              {displayInitials(user.displayName)}
            </span>
            <span>Start a conversation in {CATEGORY_SHORT_LABEL[categorySlug]}</span>
          </button>

          <dialog
            ref={composerDialogRef}
            className="nd-forum-dialog"
            aria-labelledby="nd-composer-dialog-title"
            onClose={() => setComposerOpen(false)}
          >
            <div className="nd-forum-dialog__inner">
              <header className="nd-forum-dialog__head">
                <h2 id="nd-composer-dialog-title" className="nd-forum-dialog__title">
                  New post in {meta.title}
                </h2>
                <button
                  type="button"
                  className="nd-forum-dialog__close"
                  aria-label="Close composer"
                  onClick={() => setComposerOpen(false)}
                >
                  ×
                </button>
              </header>
              <form className="nd-composer__form" onSubmit={createThread}>
                <div className="nd-field">
                  <label className="nd-label" htmlFor="thread-title">
                    Headline
                  </label>
                  <input
                    id="thread-title"
                    className="nd-input"
                    required
                    autoFocus
                    placeholder="What do you want to talk about?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="nd-field">
                  <label className="nd-label" htmlFor="thread-body">
                    Details
                  </label>
                  <textarea
                    id="thread-body"
                    className="nd-textarea"
                    required
                    placeholder="Share context, ask for ideas, or offer support…"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
                <div className="nd-field">
                  <span className="nd-label">Photos (optional)</span>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", margin: "0 0 0.5rem" }}>
                    Up to {MAX_THREAD_ATTACHMENTS} images — compressed for this demo and stored on your device only.
                  </p>
                  <div className="nd-composer__attach-row">
                    <label className="nd-composer__attach-btn">
                      {attachBusy ? "Processing…" : "Add pictures"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={attachBusy || attachments.length >= MAX_THREAD_ATTACHMENTS}
                        onChange={onPickImages}
                        aria-label="Attach images to post"
                      />
                    </label>
                    <span style={{ fontSize: "0.82rem", color: "var(--color-ink-muted)" }}>
                      {attachments.length}/{MAX_THREAD_ATTACHMENTS}
                    </span>
                  </div>
                  {attachError && (
                    <p role="alert" style={{ color: "#8b3a3a", fontSize: "0.88rem", fontWeight: 600 }}>
                      {attachError}
                    </p>
                  )}
                  {attachments.length > 0 && (
                    <div className="nd-composer__previews">
                      {attachments.map((src, i) => (
                        <div key={i} className="nd-composer__preview">
                          <img src={src} alt="" />
                          <button
                            type="button"
                            className="nd-composer__preview-remove"
                            onClick={() => removeAttachment(i)}
                            aria-label={`Remove image ${i + 1}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="nd-forum-dialog__actions">
                  <button type="button" className="nd-btn nd-btn--ghost" onClick={() => setComposerOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="nd-btn nd-btn--primary">
                    Post to {CATEGORY_SHORT_LABEL[categorySlug]}
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </section>
      )}

      <section aria-label="Discussion feed">
        <h2 className="sr-only">Posts in this space</h2>
        {threads.length === 0 ? (
          <div className="nd-empty-feed">
            <p style={{ margin: 0, fontWeight: 700 }}>No posts yet</p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.92rem" }}>
              Be the first neighbor to start a conversation.
            </p>
          </div>
        ) : (
          threads.map((t) => {
            const nComments = commentCountForThread(t.id);
            return (
              <Link
                key={t.id}
                to={`/forum/${categorySlug}/${t.id}`}
                className="nd-post-card"
              >
                <div className="nd-post-card__row">
                  <span
                    className={`nd-avatar ${avatarToneClass(t.authorName)}`}
                    aria-hidden
                  >
                    {displayInitials(t.authorName)}
                  </span>
                  <div className="nd-post-card__main">
                    <div className="nd-post-card__head">
                      <p className="nd-post-card__author">{t.authorName}</p>
                      <span className="nd-post-card__time">{formatRelativeTime(t.createdAt)}</span>
                      <span className="nd-post-card__chip">{CATEGORY_SHORT_LABEL[categorySlug]}</span>
                    </div>
                    <h3 className="nd-post-card__title">{t.title}</h3>
                    <p className="nd-post-card__preview">{t.body}</p>
                    {t.attachmentDataUrls && t.attachmentDataUrls.length > 0 && (
                      <>
                        <p className="nd-post-card__attach-badge">
                          📷 {t.attachmentDataUrls.length} photo
                          {t.attachmentDataUrls.length === 1 ? "" : "s"}
                        </p>
                        <div className="nd-post-card__thumb" aria-hidden>
                          <img src={t.attachmentDataUrls[0]} alt="" />
                        </div>
                      </>
                    )}
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
