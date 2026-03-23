import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canPost, getVendors, saveVendors } from "../lib/storage";

export function VendorsPage() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [contactNote, setContactNote] = useState("");
  const [, bump] = useState(0);

  if (!user) return null;

  const allowList = canPost(user.tier);

  const list = useMemo(() => {
    return [...getVendors()].sort((a, b) => {
      if (a.circlePartner !== b.circlePartner) return a.circlePartner ? -1 : 1;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
  }, [bump]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowList || !businessName.trim() || !category.trim() || !description.trim() || !contactNote.trim())
      return;
    const item = {
      id: crypto.randomUUID?.() ?? `ven_${Date.now()}`,
      businessName: businessName.trim(),
      category: category.trim(),
      description: description.trim(),
      websiteUrl: websiteUrl.trim() || undefined,
      contactNote: contactNote.trim(),
      circlePartner: false,
      authorId: user.id,
      authorName: user.displayName,
      createdAt: new Date().toISOString(),
    };
    saveVendors([item, ...getVendors()]);
    setBusinessName("");
    setCategory("");
    setDescription("");
    setWebsiteUrl("");
    setContactNote("");
    bump((n) => n + 1);
  };

  return (
    <div>
      <h1 className="page-title">Vendor space</h1>
      <p className="lede">
        Black-owned and aligned businesses can share offerings here. “Circle partner” badges are added by
        moderators in production; this demo lists sample partners and your submissions.
      </p>

      {!allowList && (
        <div className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-md)" }}>
          <strong>Seedling:</strong> browse vendors. <strong>Bloom+</strong> can submit a listing.
        </div>
      )}

      {allowList && (
        <section className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
          <h2 className="h-section">Submit your business</h2>
          <form onSubmit={submit}>
            <div className="field">
              <label className="label" htmlFor="ven-name">
                Business name
              </label>
              <input
                id="ven-name"
                className="input"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="ven-cat">
                Category
              </label>
              <input
                id="ven-cat"
                className="input"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Beauty, Food, Coaching, Wellness"
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="ven-desc">
                Description
              </label>
              <textarea id="ven-desc" className="textarea" required value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="ven-web">
                Website or social (optional)
              </label>
              <input
                id="ven-web"
                className="input"
                type="url"
                placeholder="https://"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="ven-contact">
                How members should reach you
              </label>
              <textarea
                id="ven-contact"
                className="textarea"
                required
                value={contactNote}
                onChange={(e) => setContactNote(e.target.value)}
                placeholder="Email, booking link, or Instagram handle — avoid posting personal phone publicly if you prefer."
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Publish listing
            </button>
          </form>
        </section>
      )}

      <section aria-label="Vendor listings">
        <h2 className="h-section">Directory</h2>
        <div className="card-list">
          {list.map((v) => (
            <article key={v.id} className="surface" style={{ padding: "var(--space-md)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                <h3 style={{ margin: 0, flex: "1 1 200px" }}>{v.businessName}</h3>
                {v.circlePartner && <span className="tag tag-teal">Circle partner</span>}
                <span className="tag">{v.category}</span>
              </div>
              <p style={{ margin: "0.75rem 0", color: "var(--color-ink-muted)" }}>{v.description}</p>
              <p style={{ margin: "0 0 0.35rem", fontSize: "0.92rem" }}>
                <strong>Contact:</strong> {v.contactNote}
              </p>
              {v.websiteUrl && (
                <p style={{ margin: 0 }}>
                  <a href={v.websiteUrl} target="_blank" rel="noreferrer">
                    Visit site →
                  </a>
                </p>
              )}
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", color: "var(--color-ink-muted)" }}>
                Listed by {v.authorName} · {new Date(v.createdAt).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      </section>

      <p style={{ fontSize: "0.88rem", color: "var(--color-ink-muted)", marginTop: "var(--space-lg)" }}>
        Inner Circle does not endorse every vendor; members should do their own diligence. Report concerns via{" "}
        <Link to="/support">Support</Link>.
      </p>

      <style>{`
        .h-section {
          font-size: 1.1rem;
          margin: 0 0 var(--space-md);
        }
      `}</style>
    </div>
  );
}
