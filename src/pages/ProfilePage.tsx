import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fileToOptimizedDataUrl, MAX_SINGLE_ATTACHMENT_CHARS } from "../lib/threadAttachments";
import { avatarToneClass, displayInitials } from "../lib/forumHelpers";

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [profileImageDataUrl, setProfileImageDataUrl] = useState(user?.profileImageDataUrl ?? "");
  const [backgroundImageDataUrl, setBackgroundImageDataUrl] = useState(user?.backgroundImageDataUrl ?? "");
  const [statusLine, setStatusLine] = useState(user?.statusLine ?? "");
  const [headline, setHeadline] = useState(user?.directoryHeadline ?? "");
  const [offer, setOffer] = useState(user?.directoryOffer ?? "");
  const [show, setShow] = useState(Boolean(user?.showInDirectory));
  const [saved, setSaved] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageBusy, setImageBusy] = useState<"profile" | "background" | null>(null);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName ?? "");
    setPhone(user.phone ?? "");
    setAddress(user.address ?? "");
    setProfileImageDataUrl(user.profileImageDataUrl ?? "");
    setBackgroundImageDataUrl(user.backgroundImageDataUrl ?? "");
    setStatusLine(user.statusLine ?? "");
    setHeadline(user.directoryHeadline ?? "");
    setOffer(user.directoryOffer ?? "");
    setShow(Boolean(user.showInDirectory));
  }, [user]);

  if (!user) return null;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      profileImageDataUrl,
      backgroundImageDataUrl,
      statusLine: statusLine.trim(),
      showInDirectory: show,
      directoryHeadline: headline.trim() || undefined,
      directoryOffer: offer.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>, kind: "profile" | "background") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    setImageBusy(kind);
    try {
      const dataUrl = await fileToOptimizedDataUrl(file);
      if (dataUrl.length > MAX_SINGLE_ATTACHMENT_CHARS) {
        setImageError("That image is too large for demo storage. Try a smaller photo.");
        return;
      }
      if (kind === "profile") setProfileImageDataUrl(dataUrl);
      else setBackgroundImageDataUrl(dataUrl);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Could not upload that image.");
    } finally {
      setImageBusy(null);
      e.target.value = "";
    }
  };

  return (
    <div>
      <h1 className="page-title">Your profile</h1>
      <p className="lede">
        Update how you show up in the <Link to="/directory">Inner Circle directory</Link>. When listed, your{" "}
        <strong>name, email, phone, and address</strong> are visible to other signed-in members.
      </p>

      <section className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <h2 className="h-section">Account</h2>
        <div
          className="profile-photo-preview"
          style={{
            backgroundImage: backgroundImageDataUrl ? `url(${backgroundImageDataUrl})` : undefined,
          }}
        >
          <div className="profile-photo-preview__shade" />
          <div className="profile-photo-preview__avatar">
            {profileImageDataUrl ? (
              <img src={profileImageDataUrl} alt={`${displayName || user.displayName} profile`} />
            ) : (
              <span className={`profile-photo-preview__fallback ${avatarToneClass(displayName || user.displayName)}`}>
                {displayInitials(displayName || user.displayName)}
              </span>
            )}
          </div>
        </div>
        <div className="profile-upload-grid" aria-label="Profile photo uploads">
          <div>
            <label className="label" htmlFor="profile-photo">
              Profile picture
            </label>
            <div className="profile-upload-row">
              <label className="btn btn-secondary profile-upload-button">
                {imageBusy === "profile" ? "Uploading..." : "Choose photo"}
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  disabled={imageBusy !== null}
                  onChange={(e) => pickImage(e, "profile")}
                />
              </label>
              {profileImageDataUrl ? (
                <button type="button" className="btn btn-ghost" onClick={() => setProfileImageDataUrl("")}>
                  Remove
                </button>
              ) : null}
            </div>
          </div>
          <div>
            <label className="label" htmlFor="background-photo">
              Background picture
            </label>
            <div className="profile-upload-row">
              <label className="btn btn-secondary profile-upload-button">
                {imageBusy === "background" ? "Uploading..." : "Choose photo"}
                <input
                  id="background-photo"
                  type="file"
                  accept="image/*"
                  disabled={imageBusy !== null}
                  onChange={(e) => pickImage(e, "background")}
                />
              </label>
              {backgroundImageDataUrl ? (
                <button type="button" className="btn btn-ghost" onClick={() => setBackgroundImageDataUrl("")}>
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        </div>
        {imageError ? (
          <p role="alert" className="profile-image-error">
            {imageError}
          </p>
        ) : null}
        <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--color-ink-muted)" }}>
          Community access is <strong>free</strong> for members.
        </p>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.88rem", color: "var(--color-ink-muted)" }}>
          Sign-in email (change by contacting support in a production app):
        </p>
        <p style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.88rem", color: "var(--color-ink-muted)" }}>
          Bio and interests from onboarding still appear on your directory card when enabled.
        </p>
      </section>

      <section className="surface" style={{ padding: "var(--space-md)" }}>
        <h2 className="h-section">Directory listing &amp; contact</h2>
        <form onSubmit={save}>
          <div className="field">
            <label className="label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
              List me in the Inner Circle directory
            </label>
            <p className="field-hint">
              Other members will see your name, email, phone, and address exactly as entered below.
            </p>
          </div>
          <div className="field">
            <label className="label" htmlFor="prof-name">
              Full name
            </label>
            <input
              id="prof-name"
              className="input"
              required
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="prof-status">
              Status / life update
            </label>
            <input
              id="prof-status"
              className="input"
              value={statusLine}
              onChange={(e) => setStatusLine(e.target.value)}
              placeholder="A one-liner for your home tile"
              maxLength={120}
            />
            <p className="field-hint">{statusLine.length}/120</p>
          </div>
          <div className="field">
            <label className="label" htmlFor="prof-phone">
              Phone number
            </label>
            <input
              id="prof-phone"
              className="input"
              type="tel"
              required={show}
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="prof-address">
              Address
            </label>
            <textarea
              id="prof-address"
              className="textarea"
              rows={3}
              required={show}
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, state, ZIP"
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="dir-head">
              Headline
            </label>
            <input
              id="dir-head"
              className="input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Postpartum doula · Eastside"
              maxLength={120}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="dir-offer">
              Offer or how to connect
            </label>
            <textarea
              id="dir-offer"
              className="textarea"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="What you’re open to — trades, advice, meetups — beyond your listed contact info."
              maxLength={400}
            />
          </div>
          {saved && (
            <p role="status" className="save-ok">
              Saved.
            </p>
          )}
          <button type="submit" className="btn btn-primary">
            Save directory settings
          </button>
        </form>
      </section>

      <style>{`
        .h-section {
          font-size: 1.1rem;
          margin: 0 0 var(--space-md);
        }
        .field-hint {
          font-size: 0.85rem;
          color: var(--color-ink-muted);
          margin: 0.35rem 0 0;
        }
        .profile-photo-preview {
          position: relative;
          min-height: 12rem;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background:
            linear-gradient(135deg, rgba(137, 36, 86, 0.92), rgba(107, 63, 160, 0.82)),
            var(--color-surface);
          background-size: cover;
          background-position: center;
          margin-bottom: var(--space-md);
        }
        .profile-photo-preview__shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(41, 23, 32, 0.45));
        }
        .profile-photo-preview__avatar {
          position: absolute;
          left: var(--space-md);
          bottom: var(--space-md);
          width: 5.5rem;
          height: 5.5rem;
          border-radius: 50%;
          border: 4px solid var(--color-bg-elevated);
          overflow: hidden;
          background: var(--color-bg-elevated);
          box-shadow: 0 10px 28px rgba(41, 23, 32, 0.22);
        }
        .profile-photo-preview__avatar img,
        .profile-photo-preview__fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          object-fit: cover;
          color: #fff;
          font-weight: 800;
          font-size: 1.4rem;
        }
        .profile-upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }
        .profile-upload-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }
        .profile-upload-button {
          position: relative;
          overflow: hidden;
        }
        .profile-upload-button input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }
        .profile-image-error {
          color: #8b3a3a;
          font-weight: 700;
          margin: 0 0 var(--space-md);
        }
        .save-ok {
          color: var(--color-success);
          font-weight: 700;
          margin: 0 0 var(--space-sm);
        }
      `}</style>
    </div>
  );
}
