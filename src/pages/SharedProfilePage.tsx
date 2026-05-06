import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { avatarToneClass, CATEGORY_SHORT_LABEL, displayInitials, formatRelativeTime } from "../lib/forumHelpers";
import { getThreads, getUsers, hasApprovedMembership } from "../lib/storage";

export function SharedProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const member = userId ? getUsers()[userId] : null;

  if (!user) return null;

  if (!member || !hasApprovedMembership(member) || !member.onboardingComplete) {
    return (
      <section className="surface shared-profile-empty">
        <h1>Profile unavailable</h1>
        <p>This member profile is not available to view.</p>
        <Link to="/app" className="btn btn-secondary">
          Back to home
        </Link>
      </section>
    );
  }

  if (member.id === user.id) {
    return (
      <section className="surface shared-profile-empty">
        <h1>Your profile</h1>
        <p>Open your account settings to edit how you show up around the circle.</p>
        <Link to="/profile" className="btn btn-primary">
          Edit my profile
        </Link>
      </section>
    );
  }

  const recentPosts = getThreads()
    .filter((t) => t.authorId === member.id && !t.neighborhoodGroupId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 3);

  const showContact = Boolean(member.showInDirectory);

  return (
    <div className="shared-profile">
      <Link to="/app" className="shared-profile__back">
        Back to feed
      </Link>

      <section className="surface shared-profile__card">
        <div
          className={"shared-profile__cover" + (member.backgroundImageDataUrl ? " shared-profile__cover--photo" : "")}
          style={{ backgroundImage: member.backgroundImageDataUrl ? `url(${member.backgroundImageDataUrl})` : undefined }}
          aria-hidden
        />
        <div className="shared-profile__body">
          <div
            className={
              "shared-profile__avatar" +
              (member.profileImageDataUrl ? " shared-profile__avatar--photo" : ` ${avatarToneClass(member.displayName)}`)
            }
            aria-hidden
          >
            {member.profileImageDataUrl ? <img src={member.profileImageDataUrl} alt="" /> : displayInitials(member.displayName)}
          </div>

          <div className="shared-profile__title-row">
            <div>
              <h1>{member.displayName}</h1>
              {member.statusLine ? <p className="shared-profile__status">{member.statusLine}</p> : null}
            </div>
            {member.isModerator ? <span className="tag tag-teal">Moderator</span> : null}
          </div>

          {member.directoryHeadline ? <p className="shared-profile__headline">{member.directoryHeadline}</p> : null}
          {member.bio ? <p className="shared-profile__bio">{member.bio}</p> : null}

          {(member.interests ?? []).length > 0 ? (
            <div className="shared-profile__section">
              <h2>Interests</h2>
              <p className="pill-row">
                {(member.interests ?? []).map((interest) => (
                  <span key={interest} className="tag">
                    {interest}
                  </span>
                ))}
              </p>
            </div>
          ) : null}

          {(member.joinedCategories ?? []).length > 0 ? (
            <div className="shared-profile__section">
              <h2>Spaces</h2>
              <p className="pill-row">
                {(member.joinedCategories ?? []).map((slug) => (
                  <span key={slug} className="tag">
                    {CATEGORY_SHORT_LABEL[slug]}
                  </span>
                ))}
              </p>
            </div>
          ) : null}

          {member.directoryOffer ? (
            <div className="shared-profile__section">
              <h2>How to connect</h2>
              <p>{member.directoryOffer}</p>
            </div>
          ) : null}

          {showContact ? (
            <div className="shared-profile__section shared-profile__contact">
              <h2>Shared contact</h2>
              <p>
                <strong>Email:</strong> <a href={`mailto:${member.email}`}>{member.email}</a>
              </p>
              {member.phone?.trim() ? (
                <p>
                  <strong>Phone:</strong> <a href={`tel:${member.phone.replace(/\s/g, "")}`}>{member.phone}</a>
                </p>
              ) : null}
              {member.address?.trim() ? (
                <p style={{ whiteSpace: "pre-line" }}>
                  <strong>Address:</strong> {member.address.trim()}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="shared-profile__privacy">This member has not shared contact details in the directory.</p>
          )}
        </div>
      </section>

      {recentPosts.length > 0 ? (
        <section className="shared-profile__posts" aria-labelledby="shared-profile-posts">
          <h2 id="shared-profile-posts">Recent posts</h2>
          <div className="card-list">
            {recentPosts.map((post) => (
              <Link key={post.id} to={`/forum/${post.categorySlug}/${post.id}`} className="card-link">
                <span className="tag">{CATEGORY_SHORT_LABEL[post.categorySlug]}</span>
                <h3>{post.title}</h3>
                <p>{post.body.length > 140 ? `${post.body.slice(0, 140).trim()}...` : post.body}</p>
                <span>{formatRelativeTime(post.createdAt)}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <style>{`
        .shared-profile {
          max-width: 44rem;
          margin: 0 auto;
        }
        .shared-profile__back {
          display: inline-flex;
          margin-bottom: var(--space-md);
          font-weight: 800;
        }
        .shared-profile-empty {
          max-width: 36rem;
          margin: 0 auto;
          padding: var(--space-lg);
        }
        .shared-profile__card {
          padding: 0;
          overflow: hidden;
          border-radius: var(--radius-sm);
        }
        .shared-profile__cover {
          min-height: 13rem;
          background:
            linear-gradient(135deg, rgba(137, 36, 86, 0.92), rgba(107, 63, 160, 0.82)),
            var(--color-surface);
          background-size: cover;
          background-position: center;
        }
        .shared-profile__cover--photo {
          min-height: 15rem;
        }
        .shared-profile__body {
          position: relative;
          padding: 4.4rem var(--space-lg) var(--space-lg);
        }
        .shared-profile__avatar {
          position: absolute;
          top: -3.6rem;
          left: var(--space-lg);
          width: 7rem;
          height: 7rem;
          border-radius: 50%;
          border: 4px solid var(--color-bg-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.45rem;
          font-weight: 900;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(41, 23, 32, 0.22);
        }
        .shared-profile__avatar--photo {
          background: var(--color-surface);
        }
        .shared-profile__avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .shared-profile__title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-md);
          flex-wrap: wrap;
        }
        .shared-profile__title-row h1 {
          margin-bottom: 0.25rem;
        }
        .shared-profile__status {
          margin: 0;
          font-size: 1rem;
          color: var(--color-teal-dark);
          font-weight: 800;
        }
        .shared-profile__headline {
          margin-top: var(--space-md);
          color: var(--color-purple);
          font-weight: 800;
        }
        .shared-profile__bio,
        .shared-profile__section p,
        .shared-profile__privacy {
          color: var(--color-ink-muted);
        }
        .shared-profile__section {
          margin-top: var(--space-lg);
        }
        .shared-profile__section h2,
        .shared-profile__posts h2 {
          font-family: var(--font-body);
          font-size: 0.95rem;
          letter-spacing: 0;
          margin-bottom: var(--space-sm);
        }
        .shared-profile__contact p {
          margin: 0 0 0.45rem;
        }
        .shared-profile__privacy {
          margin: var(--space-lg) 0 0;
          font-size: 0.92rem;
        }
        .shared-profile__posts {
          margin-top: var(--space-lg);
        }
        .shared-profile__posts .card-link h3 {
          margin: 0.5rem 0 0.35rem;
          font-family: var(--font-body);
          font-size: 1rem;
          letter-spacing: 0;
        }
        .shared-profile__posts .card-link p {
          margin: 0 0 0.45rem;
          color: var(--color-ink-muted);
        }
        .shared-profile__posts .card-link span:last-child {
          color: var(--color-ink-muted);
          font-size: 0.82rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
