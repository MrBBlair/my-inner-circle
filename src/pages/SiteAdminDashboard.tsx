import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { QrInline } from "../components/QrInline";
import { CROWN_BLOG_DEFAULT_HERO_SENTINEL, getAllCrownBlogSlugs, isCrownBlogReleased } from "../content/crownChronicles";
import { useAuth } from "../context/AuthContext";
import { apiBirthdaySweep, apiBulkEmail } from "../lib/apiClient";
import {
  DEMO_SITE_ADMIN_DISPLAY_NAME,
  DEMO_SITE_ADMIN_EMAIL,
  DEMO_SITE_ADMIN_PASSWORD,
  PUBLIC_WEBSITE_URL,
} from "../lib/constants";
import { PREVIEW_USER_ID } from "../lib/previewUser";
import { CATEGORY_SHORT_LABEL, slugifyForumSlug } from "../lib/forumHelpers";
import type {
  CrownBlogPost,
  DirectorySpotlight,
  EventGalleryPhoto,
  ForumCategorySlug,
  NeighborhoodGroup,
  NeighborhoodGroupRequest,
  UserProfile,
} from "../types";
import {
  CATEGORY_META,
  getAdminCrownBlogPosts,
  getAdminNotifications,
  getDirectorySpotlights,
  getEvents,
  getEventGalleryPhotos,
  getNeighborhoodGroupRequests,
  getNeighborhoodGroups,
  getUsers,
  hasApprovedMembership,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  saveAdminCrownBlogPosts,
  saveEvents,
  saveEventGalleryPhotos,
  saveNeighborhoodGroupRequests,
  saveNeighborhoodGroups,
  saveUser,
} from "../lib/storage";

type Tab = "overview" | "notifications" | "neighborhood" | "directory" | "events" | "gallery" | "email" | "blog";

function adminUserStatusLabel(member: UserProfile) {
  if (member.isSiteAdmin) return "Site admin";
  if (member.memberApprovalStatus === "pending") return "Pending";
  if (member.memberApprovalStatus === "declined") return "Declined";
  if (!member.onboardingComplete) return "Setup incomplete";
  return "Active";
}

function AdminEmptyValue() {
  return <span style={{ color: "var(--color-ink-muted)" }}>Not provided</span>;
}

function AdminUserDetailRow({
  label,
  children,
  preLine = false,
}: {
  label: string;
  children: React.ReactNode;
  preLine?: boolean;
}) {
  return (
    <p style={{ margin: 0, whiteSpace: preLine ? "pre-line" : undefined }}>
      <strong>{label}:</strong> {children}
    </p>
  );
}

function AdminMemberCard({
  member,
  expanded,
  onToggle,
  onApprove,
  onDecline,
}: {
  member: UserProfile;
  expanded: boolean;
  onToggle: () => void;
  onApprove?: () => void;
  onDecline?: () => void;
}) {
  const status = adminUserStatusLabel(member);
  const joinedLabels = (member.joinedCategories ?? []).map((slug) => CATEGORY_SHORT_LABEL[slug] ?? slug);
  const interests = member.interests ?? [];

  return (
    <article
      className="surface"
      style={{
        padding: "var(--space-md)",
        margin: 0,
        border: expanded ? "1px solid var(--color-teal)" : "1px solid var(--color-border)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          width: "100%",
          border: 0,
          padding: 0,
          background: "transparent",
          color: "inherit",
          textAlign: "left",
          cursor: "pointer",
          font: "inherit",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem 0.75rem", alignItems: "center" }}>
          <strong style={{ fontSize: "1.05rem" }}>{member.displayName}</strong>
          <span className={member.isSiteAdmin || member.memberApprovalStatus === "pending" ? "tag tag-teal" : "tag"}>
            {status}
          </span>
          {member.isModerator ? <span className="tag">Moderator</span> : null}
          {member.showInDirectory ? <span className="tag">Public directory listing</span> : null}
        </div>
        <p style={{ margin: "0.35rem 0 0", fontSize: "0.92rem", color: "var(--color-ink-muted)" }}>
          {member.email} {member.phone?.trim() ? ` · ${member.phone.trim()}` : ""}
        </p>
        <p style={{ margin: "0.45rem 0 0", fontSize: "0.84rem", fontWeight: 700, color: "var(--color-purple)" }}>
          {expanded ? "Hide account details" : "Open account details"}
        </p>
      </button>

      {expanded ? (
        <div
          style={{
            marginTop: "var(--space-md)",
            paddingTop: "var(--space-md)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.65rem 1rem",
              fontSize: "0.92rem",
            }}
          >
            <AdminUserDetailRow label="Name">{member.displayName || <AdminEmptyValue />}</AdminUserDetailRow>
            <AdminUserDetailRow label="Email">
              {member.email ? <a href={`mailto:${member.email}`}>{member.email}</a> : <AdminEmptyValue />}
            </AdminUserDetailRow>
            <AdminUserDetailRow label="Phone">
              {member.phone?.trim() ? (
                <a href={`tel:${member.phone.replace(/\s/g, "")}`}>{member.phone.trim()}</a>
              ) : (
                <AdminEmptyValue />
              )}
            </AdminUserDetailRow>
            <AdminUserDetailRow label="Address" preLine>
              {member.address?.trim() ? member.address.trim() : <AdminEmptyValue />}
            </AdminUserDetailRow>
            <AdminUserDetailRow label="City">
              {member.city?.trim() ? member.city.trim() : <AdminEmptyValue />}
            </AdminUserDetailRow>
            <AdminUserDetailRow label="Birthday">
              {member.birthdateISO ? <time dateTime={member.birthdateISO}>{member.birthdateISO}</time> : <AdminEmptyValue />}
            </AdminUserDetailRow>
            <AdminUserDetailRow label="Approval">{member.memberApprovalStatus ?? "approved"}</AdminUserDetailRow>
            <AdminUserDetailRow label="Onboarding">{member.onboardingComplete ? "Complete" : "Incomplete"}</AdminUserDetailRow>
            <AdminUserDetailRow label="Roles">
              {[member.isSiteAdmin ? "Site admin" : null, member.isModerator ? "Moderator" : null]
                .filter(Boolean)
                .join(", ") || "Member"}
            </AdminUserDetailRow>
            <AdminUserDetailRow label="Directory visibility">
              {member.showInDirectory ? "Listed publicly to members" : "Hidden from member directory"}
            </AdminUserDetailRow>
            <AdminUserDetailRow label="Created">
              <time dateTime={member.createdAt}>{new Date(member.createdAt).toLocaleString()}</time>
            </AdminUserDetailRow>
            <AdminUserDetailRow label="User ID">
              <code style={{ fontSize: "0.78rem" }}>{member.id}</code>
            </AdminUserDetailRow>
          </div>

          <div style={{ marginTop: "var(--space-md)", display: "grid", gap: "0.5rem", fontSize: "0.92rem" }}>
            <AdminUserDetailRow label="Bio">{member.bio?.trim() ? member.bio.trim() : <AdminEmptyValue />}</AdminUserDetailRow>
            <AdminUserDetailRow label="Directory headline">
              {member.directoryHeadline?.trim() ? member.directoryHeadline.trim() : <AdminEmptyValue />}
            </AdminUserDetailRow>
            <AdminUserDetailRow label="Directory offer">
              {member.directoryOffer?.trim() ? member.directoryOffer.trim() : <AdminEmptyValue />}
            </AdminUserDetailRow>
          </div>

          {interests.length > 0 ? (
            <p className="pill-row" style={{ margin: "var(--space-sm) 0 0" }}>
              {interests.map((interest) => (
                <span key={interest} className="tag">
                  {interest}
                </span>
              ))}
            </p>
          ) : null}

          {joinedLabels.length > 0 ? (
            <p className="pill-row" style={{ margin: "var(--space-sm) 0 0" }}>
              {joinedLabels.map((label) => (
                <span key={label} className="tag">
                  {label}
                </span>
              ))}
            </p>
          ) : null}

          {onApprove || onDecline ? (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "var(--space-md)" }}>
              {onApprove ? (
                <button type="button" className="btn btn-primary" onClick={onApprove}>
                  Approve membership
                </button>
              ) : null}
              {onDecline ? (
                <button type="button" className="btn btn-secondary" onClick={onDecline}>
                  Decline
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function SiteAdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [expandedAdminMemberId, setExpandedAdminMemberId] = useState<string | null>(null);
  const [refreshKey, bump] = useState(0);
  const refresh = useCallback(() => bump((n) => n + 1), []);

  const requests = useMemo(() => getNeighborhoodGroupRequests(), [refreshKey]);
  const groups = useMemo(() => getNeighborhoodGroups(), [refreshKey]);
  const adminNotifications = useMemo(() => getAdminNotifications(), [refreshKey]);
  const unreadAdminNotifications = useMemo(() => adminNotifications.filter((n) => !n.readAt), [adminNotifications]);

  const approveRequest = (req: NeighborhoodGroupRequest) => {
    if (req.status !== "pending") return;
    const nextGroups: NeighborhoodGroup[] = [
      {
        id: crypto.randomUUID?.() ?? `ng_${Date.now()}`,
        slug: req.proposedSlug || slugifyForumSlug(req.proposedName),
        name: req.proposedName.trim(),
        description: req.description.trim(),
        approvedAt: new Date().toISOString(),
        approvedFromRequestId: req.id,
      },
      ...getNeighborhoodGroups(),
    ];
    saveNeighborhoodGroups(nextGroups);
    saveNeighborhoodGroupRequests(
      getNeighborhoodGroupRequests().map((r) => (r.id === req.id ? { ...r, status: "approved" as const } : r)),
    );
    refresh();
  };

  const declineRequest = (id: string) => {
    saveNeighborhoodGroupRequests(
      getNeighborhoodGroupRequests().map((r) => (r.id === id ? { ...r, status: "declined" as const } : r)),
    );
    refresh();
  };

  const approveMember = (userId: string) => {
    const u = getUsers()[userId];
    if (!u || u.isSiteAdmin || u.id === PREVIEW_USER_ID) return;
    saveUser({ ...u, memberApprovalStatus: "approved" });
    refresh();
  };

  const declineMember = (userId: string) => {
    const u = getUsers()[userId];
    if (!u || u.isSiteAdmin || u.id === PREVIEW_USER_ID) return;
    saveUser({ ...u, memberApprovalStatus: "declined" });
    refresh();
  };

  const markNotificationRead = (id: string) => {
    markAdminNotificationRead(id);
    refresh();
  };

  const markEveryNotificationRead = () => {
    markAllAdminNotificationsRead();
    refresh();
  };

  const [evTitle, setEvTitle] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evDesc, setEvDesc] = useState("");
  const [evLocation, setEvLocation] = useState("Online");
  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim() || !evDate) return;
    const id = crypto.randomUUID?.() ?? `ev_${Date.now()}`;
    const next = [
      ...getEvents(),
      {
        id,
        title: evTitle.trim(),
        dateISO: new Date(evDate).toISOString(),
        location: evLocation.trim() || "TBA",
        virtual: /zoom|online|virtual/i.test(evLocation),
        description: evDesc.trim() || "Details coming soon.",
        rsvpUserIds: [] as string[],
        registrationMode: "rsvp" as const,
      },
    ];
    saveEvents(next);
    setEvTitle("");
    setEvDate("");
    setEvDesc("");
    setEvLocation("Online");
    refresh();
  };

  const removeEvent = (id: string) => {
    saveEvents(getEvents().filter((x) => x.id !== id));
    refresh();
  };

  const [galTitle, setGalTitle] = useState("");
  const [galCaption, setGalCaption] = useState("");
  const onGalleryFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (dataUrl.length > 1_200_000) {
        alert("Image too large for demo storage — try under ~800KB.");
        return;
      }
      const list = getEventGalleryPhotos();
      const photo: EventGalleryPhoto = {
        id: crypto.randomUUID?.() ?? `g_${Date.now()}`,
        title: galTitle.trim() || "Event moment",
        caption: galCaption.trim(),
        imageDataUrl: dataUrl,
        sortOrder: list.length,
        createdAt: new Date().toISOString(),
      };
      saveEventGalleryPhotos([photo, ...list]);
      setGalTitle("");
      setGalCaption("");
      refresh();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeGallery = (id: string) => {
    saveEventGalleryPhotos(getEventGalleryPhotos().filter((p) => p.id !== id));
    refresh();
  };

  const adminBlogs = useMemo(() => getAdminCrownBlogPosts(), [refreshKey]);

  const adminMemberList = useMemo(
    () =>
      Object.values(getUsers()).sort((a, b) =>
        a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }),
      ),
    [refreshKey],
  );

  const pendingMembers = useMemo(
    () =>
      adminMemberList.filter(
        (u) => u.memberApprovalStatus === "pending" && u.id !== PREVIEW_USER_ID && u.isSiteAdmin !== true,
      ),
    [adminMemberList],
  );

  const activeMembers = useMemo(
    () => adminMemberList.filter((u) => hasApprovedMembership(u) && u.onboardingComplete),
    [adminMemberList],
  );

  const incompleteMembers = useMemo(
    () => adminMemberList.filter((u) => hasApprovedMembership(u) && !u.onboardingComplete),
    [adminMemberList],
  );

  const directorySpotlights = useMemo(() => getDirectorySpotlights(), [refreshKey]);

  const forumRoomKeys = useMemo(() => Object.keys(CATEGORY_META) as ForumCategorySlug[], []);

  const forumParticipation = useMemo(
    () =>
      forumRoomKeys.map((slug) => ({
        slug,
        title: CATEGORY_META[slug].title,
        count: activeMembers.filter((u) => u.joinedCategories?.includes(slug)).length,
      })),
    [activeMembers, forumRoomKeys],
  );

  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("From the circle");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogRelease, setBlogRelease] = useState("");
  const [blogReadMins, setBlogReadMins] = useState("10");
  const [blogBody, setBlogBody] = useState("");
  const [blogTips, setBlogTips] = useState("");
  const [blogAlt, setBlogAlt] = useState("");
  const [blogHeroDataUrl, setBlogHeroDataUrl] = useState<string | null>(null);

  const uniqueBlogSlug = (title: string) => {
    const taken = new Set(getAllCrownBlogSlugs());
    let base = slugifyForumSlug(title);
    if (base.length < 2) base = "blog-post";
    if (!taken.has(base)) return base;
    let n = 2;
    while (taken.has(`${base}-${n}`)) n += 1;
    return `${base}-${n}`;
  };

  const onBlogHeroFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (dataUrl.length > 1_200_000) {
        alert("Image too large for browser storage — try under ~800KB.");
        return;
      }
      setBlogHeroDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const addAdminBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogRelease || !blogBody.trim()) return;
    const paragraphs = blogBody
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (paragraphs.length === 0) return;
    const releaseDateISO = blogRelease;
    const [y, m, d] = releaseDateISO.split("-").map(Number);
    const dateLabel = new Date(y, m - 1, d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const tips = blogTips
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
    const slug = uniqueBlogSlug(blogTitle);
    const id = crypto.randomUUID?.() ?? `admin_blog_${Date.now()}`;
    const post: CrownBlogPost = {
      id,
      slug,
      releaseDateISO,
      dateISO: releaseDateISO,
      dateLabel,
      category: blogCategory.trim() || "From the circle",
      title: blogTitle.trim(),
      excerpt: blogExcerpt.trim() || paragraphs[0].slice(0, 220),
      readMins: Math.min(120, Math.max(1, Math.round(Number(blogReadMins)) || 10)),
      src: blogHeroDataUrl ?? CROWN_BLOG_DEFAULT_HERO_SENTINEL,
      alt: blogAlt.trim() || `Blog: ${blogTitle.trim()}`,
      paragraphs,
      tips: tips.length > 0 ? tips : undefined,
    };
    saveAdminCrownBlogPosts([post, ...getAdminCrownBlogPosts()]);
    setBlogTitle("");
    setBlogCategory("From the circle");
    setBlogExcerpt("");
    setBlogRelease("");
    setBlogReadMins("10");
    setBlogBody("");
    setBlogTips("");
    setBlogAlt("");
    setBlogHeroDataUrl(null);
    refresh();
  };

  const removeAdminBlog = (id: string) => {
    saveAdminCrownBlogPosts(getAdminCrownBlogPosts().filter((p) => p.id !== id));
    refresh();
  };

  const [adminSecret, setAdminSecret] = useState(() => sessionStorage.getItem("mic_admin_secret") ?? "");
  const persistSecret = (v: string) => {
    setAdminSecret(v);
    sessionStorage.setItem("mic_admin_secret", v);
  };

  const [bccText, setBccText] = useState("");
  const [subj, setSubj] = useState("Inner Circle update");
  const [htmlBody, setHtmlBody] = useState("<p>Hello {{name}},</p><p>Thanks for being in the circle.</p>");
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  const sendBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendStatus(null);
    const bccRecipients = bccText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await apiBulkEmail(adminSecret, { bccRecipients, subject: subj, htmlBody });
    setSendStatus(res.ok ? `Simulated send to ${bccRecipients.length} addresses (see API logs).` : res.error ?? "Failed");
  };

  const runBirthdays = async () => {
    setSendStatus(null);
    const res = await apiBirthdaySweep(adminSecret);
    setSendStatus(res.ok ? "Birthday sweep complete (see API logs)." : "Birthday sweep failed");
  };

  if (!user?.isSiteAdmin) return null;

  return (
    <div>
      <h1 className="page-title">Site admin</h1>
      <p className="lede">
        Operational cockpit for calendars, neighborhood approvals, gallery drops, and communications test hooks. Pair with
        the local API (`npm run dev` runs it) and set <code>MIC_ADMIN_SECRET</code> on the server to match the token you
        paste below.
      </p>

      <section
        className="surface"
        style={{ padding: "var(--space-md)", marginBottom: "var(--space-md)", borderLeft: "4px solid var(--color-teal)" }}
      >
        <h2 style={{ fontSize: "1rem", margin: "0 0 0.5rem" }}>Administrator account</h2>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Signed in as {user.displayName} · <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.92rem", color: "var(--color-ink-muted)" }}>
          Seeded demo site admin (after reset / first load):{" "}
          <strong>{DEMO_SITE_ADMIN_DISPLAY_NAME}</strong> —{" "}
          <code>{DEMO_SITE_ADMIN_EMAIL}</code> / <code>{DEMO_SITE_ADMIN_PASSWORD}</code>
        </p>
      </section>

      <div className="admin-tabs surface" style={{ padding: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
        {(
          [
            ["overview", "Overview"],
            ["notifications", `Notifications${unreadAdminNotifications.length ? ` (${unreadAdminNotifications.length})` : ""}`],
            ["neighborhood", "Neighborhood"],
            ["directory", "Directory"],
            ["events", "Events"],
            ["gallery", "Gallery"],
            ["blog", "Blog space"],
            ["email", "Email / jobs"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? "btn btn-primary" : "btn btn-secondary"}
            style={{ margin: "0.15rem" }}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <section className="surface" style={{ padding: "var(--space-lg)" }}>
          <h2 style={{ fontSize: "1.1rem" }}>At a glance</h2>
          <ul>
            <li>
              <Link to="/moderation">Open moderation queue</Link>
            </li>
            <li>
              <button type="button" className="btn btn-ghost" style={{ padding: "0.15rem 0" }} onClick={() => setTab("notifications")}>
                Admin notifications ({unreadAdminNotifications.length} unread)
              </button>
            </li>
            <li>
              <button type="button" className="btn btn-ghost" style={{ padding: "0.15rem 0" }} onClick={() => setTab("directory")}>
                Member directory
              </button>
            </li>
            <li>Pending member approvals: {pendingMembers.length}</li>
            <li>Pending circle requests: {requests.filter((r) => r.status === "pending").length}</li>
            <li>Live circles: {groups.length}</li>
            <li>Members (local): {Object.keys(getUsers()).length}</li>
            <li>Admin-authored blog posts (local): {adminBlogs.length}</li>
          </ul>
          <h3 style={{ fontSize: "1rem", marginTop: "var(--space-lg)" }}>Public site QR</h3>
          <QrInline value={PUBLIC_WEBSITE_URL} caption="Scan to visit myinnercircleinc.org" />
        </section>
      )}

      {tab === "notifications" && (
        <section className="surface" style={{ padding: "var(--space-lg)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Admin notifications</h2>
              <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "0.92rem" }}>
                Site attention items from signups, support forms, reports, circle requests, and member-submitted listings.
              </p>
            </div>
            {unreadAdminNotifications.length > 0 ? (
              <button type="button" className="btn btn-secondary" onClick={markEveryNotificationRead}>
                Mark all reviewed
              </button>
            ) : null}
          </div>

          {adminNotifications.length === 0 ? (
            <p className="empty-state" style={{ marginTop: "var(--space-lg)" }}>
              No admin notifications yet.
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: "var(--space-lg) 0 0", padding: 0, display: "grid", gap: "var(--space-sm)" }}>
              {adminNotifications.map((n) => (
                <li
                  key={n.id}
                  className="surface"
                  style={{
                    padding: "var(--space-md)",
                    margin: 0,
                    borderLeft: n.readAt ? "1px solid var(--color-border)" : "4px solid var(--color-teal)",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 0.65rem", alignItems: "center" }}>
                    <strong style={{ fontSize: "1rem" }}>{n.title}</strong>
                    <span className={n.readAt ? "tag" : "tag tag-teal"}>{n.readAt ? "Reviewed" : "Unread"}</span>
                    <span className="tag">{n.kind.replaceAll("_", " ")}</span>
                  </div>
                  <p style={{ margin: "0.45rem 0 0", color: "var(--color-ink-muted)" }}>{n.body}</p>
                  <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "var(--color-ink-muted)" }}>
                    {n.actorName ? `${n.actorName} · ` : ""}
                    <time dateTime={n.createdAt}>{new Date(n.createdAt).toLocaleString()}</time>
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.65rem" }}>
                    {n.href ? (
                      <Link className="btn btn-secondary" to={n.href} onClick={() => markNotificationRead(n.id)}>
                        Open
                      </Link>
                    ) : null}
                    {!n.readAt ? (
                      <button type="button" className="btn btn-primary" onClick={() => markNotificationRead(n.id)}>
                        Mark reviewed
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "neighborhood" && (
        <section className="surface" style={{ padding: "var(--space-lg)" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Circle requests</h2>
          {requests.filter((r) => r.status === "pending").length === 0 ? (
            <p className="empty-state">No pending requests.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {requests
                .filter((r) => r.status === "pending")
                .map((r) => (
                  <li key={r.id} className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-sm)" }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>{r.proposedName}</p>
                    <p style={{ margin: "0.35rem 0", color: "var(--color-ink-muted)" }}>{r.description}</p>
                    <p style={{ fontSize: "0.85rem" }}>
                      Slug: <code>{r.proposedSlug}</code> · Requested by {r.requestedByName}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                      <button type="button" className="btn btn-primary" onClick={() => approveRequest(r)}>
                        Approve &amp; create silo
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => declineRequest(r.id)}>
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}

      {tab === "directory" && (
        <section className="surface" style={{ padding: "var(--space-lg)" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Member directory</h2>
          <p style={{ color: "var(--color-ink-muted)", maxWidth: "46rem", marginBottom: "var(--space-lg)" }}>
            Operational view of accounts and group spaces stored on this device. Emails are sensitive — use only for
            authorized support and planning. Public{" "}
            <Link to="/directory">member directory</Link> still only shows members who opt in. Approve or decline new
            signups in <strong>Pending approval</strong> before they can use the app.
          </p>

          <h3 style={{ fontSize: "1rem", margin: "0 0 var(--space-sm)" }}>
            Pending approval ({pendingMembers.length})
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", marginTop: 0 }}>
            These accounts submitted the signup form and are waiting for you. The local API logs an{" "}
            <code>admin_pending_member</code> line when signup runs with the server.
          </p>
          {pendingMembers.length === 0 ? (
            <p className="empty-state" style={{ marginBottom: "var(--space-xl)" }}>
              No pending applications.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
              {pendingMembers.map((m) => (
                <AdminMemberCard
                  key={m.id}
                  member={m}
                  expanded={expandedAdminMemberId === m.id}
                  onToggle={() => setExpandedAdminMemberId((id) => (id === m.id ? null : m.id))}
                  onApprove={() => {
                    approveMember(m.id);
                    setExpandedAdminMemberId(null);
                  }}
                  onDecline={() => {
                    declineMember(m.id);
                    setExpandedAdminMemberId(null);
                  }}
                />
              ))}
            </div>
          )}

          <h3 style={{ fontSize: "1rem", margin: "0 0 var(--space-sm)" }}>
            Single members — active ({activeMembers.length})
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", marginTop: 0 }}>
            Completed onboarding. Roles and forum rooms are shown below.
          </p>
          <div style={{ display: "grid", gap: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
            {activeMembers.map((m) => (
              <AdminMemberCard
                key={m.id}
                member={m}
                expanded={expandedAdminMemberId === m.id}
                onToggle={() => setExpandedAdminMemberId((id) => (id === m.id ? null : m.id))}
              />
            ))}
          </div>

          {incompleteMembers.length > 0 ? (
            <>
              <h3 style={{ fontSize: "1rem", margin: "0 0 var(--space-sm)" }}>
                Single members — onboarding incomplete ({incompleteMembers.length})
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", marginTop: 0 }}>
                Approved accounts that have not finished setup; they may not see the full app yet.
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "var(--space-xl)" }}>
                {incompleteMembers.map((m) => (
                  <li key={m.id} style={{ marginBottom: "var(--space-sm)" }}>
                    <AdminMemberCard
                      member={m}
                      expanded={expandedAdminMemberId === m.id}
                      onToggle={() => setExpandedAdminMemberId((id) => (id === m.id ? null : m.id))}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <h3 style={{ fontSize: "1rem", margin: "0 0 var(--space-sm)" }}>
            Groups — neighborhood circles ({groups.length})
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", marginTop: 0 }}>
            Approved subgroup forums (each has its own thread silo).
          </p>
          {groups.length === 0 ? (
            <p className="empty-state" style={{ marginBottom: "var(--space-xl)" }}>
              No live circles yet. Approve requests in the Neighborhood tab.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "var(--space-xl)" }}>
              {groups.map((g: NeighborhoodGroup) => (
                <li key={g.id} className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-sm)" }}>
                  <strong>{g.name}</strong>{" "}
                  <span style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)" }}>
                    · slug <code>{g.slug}</code>
                  </span>
                  <p style={{ margin: "0.35rem 0" }}>{g.description}</p>
                  <p style={{ margin: 0, fontSize: "0.88rem" }}>
                    <Link to={`/forum/group/${g.slug}`}>Open group forum</Link>
                    {" · "}
                    <span>
                      Approved{" "}
                      <time dateTime={g.approvedAt}>{new Date(g.approvedAt).toLocaleString()}</time>
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}

          <h3 style={{ fontSize: "1rem", margin: "0 0 var(--space-sm)" }}>
            Groups — spotlight listings ({directorySpotlights.length})
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", marginTop: 0 }}>
            Curated orgs and circles surfaced on the public directory page.
          </p>
          {directorySpotlights.length === 0 ? (
            <p className="empty-state" style={{ marginBottom: "var(--space-xl)" }}>
              No spotlight entries in seed data.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "var(--space-xl)" }}>
              {directorySpotlights.map((s: DirectorySpotlight) => (
                <li key={s.id} className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-sm)" }}>
                  <span className="tag tag-teal">Spotlight</span>
                  <h4 style={{ margin: "0.5rem 0 0.35rem", fontSize: "1.05rem" }}>{s.name}</h4>
                  <p style={{ fontWeight: 600, margin: "0 0 0.35rem", color: "var(--color-purple)" }}>{s.headline}</p>
                  <p style={{ margin: "0 0 0.5rem", color: "var(--color-ink-muted)" }}>{s.description}</p>
                  <p className="pill-row" style={{ marginBottom: "0.35rem" }}>
                    {s.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </p>
                  {s.linkUrl && s.linkLabel ? (
                    <a href={s.linkUrl} className="btn btn-secondary" target="_blank" rel="noreferrer">
                      {s.linkLabel}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          <h3 style={{ fontSize: "1rem", margin: "0 0 var(--space-sm)" }}>Forum rooms — join snapshot</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", marginTop: 0 }}>
            How many <em>active</em> members include each main forum category on their profile (not neighborhood silos).
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "grid",
              gap: "0.35rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {forumParticipation.map((row) => (
              <li key={row.slug} className="surface" style={{ padding: "var(--space-sm) var(--space-md)", margin: 0 }}>
                <strong style={{ fontSize: "0.92rem" }}>{row.title}</strong>
                <p style={{ margin: "0.2rem 0 0", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-teal-dark)" }}>
                  {row.count}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "events" && (
        <section className="surface" style={{ padding: "var(--space-lg)" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Curate calendar (admin-only)</h2>
          <form onSubmit={addEvent} style={{ marginBottom: "var(--space-lg)" }}>
            <div className="field">
              <label className="label" htmlFor="ev-title">
                Title
              </label>
              <input id="ev-title" className="input" value={evTitle} onChange={(e) => setEvTitle(e.target.value)} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="ev-when">
                Start (local)
              </label>
              <input
                id="ev-when"
                className="input"
                type="datetime-local"
                value={evDate}
                onChange={(e) => setEvDate(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="ev-loc">
                Location
              </label>
              <input id="ev-loc" className="input" value={evLocation} onChange={(e) => setEvLocation(e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="ev-desc">
                Description
              </label>
              <textarea id="ev-desc" className="textarea" value={evDesc} onChange={(e) => setEvDesc(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">
              Publish event
            </button>
          </form>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {getEvents()
              .slice()
              .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
              .map((ev) => (
                <li key={ev.id} className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-sm)" }}>
                  <strong>{ev.title}</strong>
                  <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "var(--color-ink-muted)" }}>
                    {new Date(ev.dateISO).toLocaleString()}
                  </p>
                  <button type="button" className="btn btn-secondary" onClick={() => removeEvent(ev.id)}>
                    Remove
                  </button>
                </li>
              ))}
          </ul>
        </section>
      )}

      {tab === "gallery" && (
        <section className="surface" style={{ padding: "var(--space-lg)" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Event gallery (admin)</h2>
          <div className="field">
            <label className="label" htmlFor="gal-title">
              Title
            </label>
            <input id="gal-title" className="input" value={galTitle} onChange={(e) => setGalTitle(e.target.value)} />
          </div>
          <div className="field">
            <label className="label" htmlFor="gal-cap">
              Caption
            </label>
            <input id="gal-cap" className="input" value={galCaption} onChange={(e) => setGalCaption(e.target.value)} />
          </div>
          <div className="field">
            <label className="label" htmlFor="gal-file">
              Photo upload
            </label>
            <input id="gal-file" type="file" accept="image/*" onChange={onGalleryFile} />
          </div>
          <div style={{ display: "grid", gap: "var(--space-md)", marginTop: "var(--space-lg)" }}>
            {getEventGalleryPhotos().map((p) => (
              <figure key={p.id} className="surface" style={{ padding: "var(--space-md)", margin: 0 }}>
                {p.imageDataUrl ? <img src={p.imageDataUrl} alt="" style={{ maxWidth: "100%", borderRadius: 8 }} /> : null}
                <figcaption style={{ marginTop: "0.35rem" }}>
                  <strong>{p.title}</strong>
                  <p style={{ margin: "0.25rem 0" }}>{p.caption}</p>
                  <button type="button" className="btn btn-secondary" onClick={() => removeGallery(p.id)}>
                    Remove
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {tab === "blog" && (
        <section className="surface" style={{ padding: "var(--space-lg)" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Blog Space (admin)</h2>
          <p style={{ color: "var(--color-ink-muted)", maxWidth: "40rem" }}>
            Add long-form posts for <Link to="/crown">/crown</Link>. Each entry stays hidden until local midnight on the
            release date. Slugs must stay unique — duplicates against the built-in schedule are blocked by auto-suffixing.
            Images are stored as data URLs in this browser (about 800KB max recommended).
          </p>

          <form onSubmit={addAdminBlog} style={{ marginTop: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
            <div className="field">
              <label className="label" htmlFor="blog-title">
                Title
              </label>
              <input
                id="blog-title"
                className="input"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="blog-cat">
                Category / tag line
              </label>
              <input
                id="blog-cat"
                className="input"
                value={blogCategory}
                onChange={(e) => setBlogCategory(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="blog-excerpt">
                Excerpt (card preview)
              </label>
              <textarea
                id="blog-excerpt"
                className="textarea"
                rows={2}
                value={blogExcerpt}
                onChange={(e) => setBlogExcerpt(e.target.value)}
                placeholder="Optional; defaults to start of body"
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="blog-release">
                Release date (public from this date, local)
              </label>
              <input
                id="blog-release"
                className="input"
                type="date"
                value={blogRelease}
                onChange={(e) => setBlogRelease(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="blog-read">
                Read time (minutes)
              </label>
              <input
                id="blog-read"
                className="input"
                type="number"
                min={1}
                max={120}
                value={blogReadMins}
                onChange={(e) => setBlogReadMins(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="blog-body">
                Body — paragraphs separated by a blank line
              </label>
              <textarea
                id="blog-body"
                className="textarea"
                rows={14}
                value={blogBody}
                onChange={(e) => setBlogBody(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="blog-tips">
                Quick tips (optional, one per line)
              </label>
              <textarea
                id="blog-tips"
                className="textarea"
                rows={3}
                value={blogTips}
                onChange={(e) => setBlogTips(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="blog-alt">
                Hero image alt text
              </label>
              <input id="blog-alt" className="input" value={blogAlt} onChange={(e) => setBlogAlt(e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="blog-hero">
                Hero image (optional)
              </label>
              <input id="blog-hero" type="file" accept="image/*" onChange={onBlogHeroFile} />
              {blogHeroDataUrl ? (
                <p style={{ fontSize: "0.88rem", marginTop: "0.35rem" }}>
                  Custom image attached.{" "}
                  <button type="button" className="btn btn-ghost" onClick={() => setBlogHeroDataUrl(null)}>
                    Use default hero instead
                  </button>
                </p>
              ) : null}
            </div>
            <button type="submit" className="btn btn-primary">
              Save blog post
            </button>
          </form>

          <h3 style={{ fontSize: "1rem" }}>Admin posts on this device</h3>
          {adminBlogs.length === 0 ? (
            <p className="empty-state">No admin posts yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {adminBlogs
                .slice()
                .sort((a, b) => b.releaseDateISO.localeCompare(a.releaseDateISO))
                .map((p) => (
                  <li key={p.id} className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-sm)" }}>
                    <strong>{p.title}</strong>
                    <p style={{ margin: "0.35rem 0", fontSize: "0.9rem", color: "var(--color-ink-muted)" }}>
                      Releases {p.dateLabel} · {p.readMins} min · slug <code>{p.slug}</code>
                    </p>
                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.88rem" }}>
                      <Link to={`/crown/blog/${p.slug}`}>Open public URL</Link>
                      {!isCrownBlogReleased(p) ? <span> (hidden until release)</span> : null}
                    </p>
                    <button type="button" className="btn btn-secondary" onClick={() => removeAdminBlog(p.id)}>
                      Remove from this browser
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}

      {tab === "email" && (
        <section className="surface" style={{ padding: "var(--space-lg)" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Communications test bench</h2>
          <div className="field">
            <label className="label" htmlFor="admin-secret">
              API secret (Bearer)
            </label>
            <input
              id="admin-secret"
              className="input"
              autoComplete="off"
              value={adminSecret}
              onChange={(e) => persistSecret(e.target.value)}
              placeholder="Matches MIC_ADMIN_SECRET on server"
            />
          </div>
          <form onSubmit={sendBulk}>
            <div className="field">
              <label className="label" htmlFor="bcc">
                BCC list (comma or newline)
              </label>
              <textarea id="bcc" className="textarea" value={bccText} onChange={(e) => setBccText(e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="subj">
                Subject
              </label>
              <input id="subj" className="input" value={subj} onChange={(e) => setSubj(e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="html">
                HTML body
              </label>
              <textarea id="html" className="textarea" rows={6} value={htmlBody} onChange={(e) => setHtmlBody(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">
              Simulate BCC broadcast
            </button>
          </form>
          <p style={{ marginTop: "var(--space-md)" }}>
            <button type="button" className="btn btn-secondary" onClick={runBirthdays}>
              Run birthday sweep (logs only)
            </button>
          </p>
          {sendStatus && <p role="status">{sendStatus}</p>}
        </section>
      )}
    </div>
  );
}
