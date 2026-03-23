import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canPost, getDonations, saveDonations } from "../lib/storage";
import type { DonationKind } from "../types";

export function GivePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<DonationKind>("clothes");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [logistics, setLogistics] = useState("");
  const [, bump] = useState(0);

  if (!user) return null;

  const allowList = canPost(user.tier);

  const list = useMemo(() => {
    return getDonations()
      .filter((d) => d.kind === tab)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [tab, bump]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowList || !title.trim() || !description.trim() || !logistics.trim()) return;
    const item = {
      id: crypto.randomUUID?.() ?? `don_${Date.now()}`,
      kind: tab,
      title: title.trim(),
      description: description.trim(),
      logistics: logistics.trim(),
      authorId: user.id,
      authorName: user.displayName,
      createdAt: new Date().toISOString(),
    };
    saveDonations([item, ...getDonations()]);
    setTitle("");
    setDescription("");
    setLogistics("");
    bump((n) => n + 1);
  };

  return (
    <div>
      <h1 className="page-title">Give &amp; receive</h1>
      <p className="lede">
        Offer gently used clothes and essentials, or neighborly services (skills, swaps, sliding-scale
        help). Always meet safely; Inner Circle doesn’t handle shipping or payments in this demo.
      </p>

      <div className="circle-tabs" role="tablist" aria-label="Donation type">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "clothes"}
          className={"circle-tab" + (tab === "clothes" ? " circle-tab--on" : "")}
          onClick={() => setTab("clothes")}
        >
          Clothes &amp; items
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "services"}
          className={"circle-tab" + (tab === "services" ? " circle-tab--on" : "")}
          onClick={() => setTab("services")}
        >
          Services &amp; skills
        </button>
      </div>

      {!allowList && (
        <div className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-md)" }}>
          <strong>Seedling tier:</strong> you can browse offers. Upgrade to <strong>Bloom</strong> or{" "}
          <strong>Inner Circle</strong> to post donations or services.
        </div>
      )}

      {allowList && (
        <section className="surface" style={{ padding: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
          <h2 className="h-section">List something</h2>
          <form onSubmit={submit}>
            <div className="field">
              <label className="label" htmlFor="give-title">
                Title
              </label>
              <input
                id="give-title"
                className="input"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={tab === "clothes" ? "e.g. Winter coats, size L" : "e.g. 1:1 budgeting chat"}
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="give-desc">
                Description
              </label>
              <textarea
                id="give-desc"
                className="textarea"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="give-log">
                Pickup / delivery / how to connect
              </label>
              <textarea
                id="give-log"
                className="textarea"
                required
                value={logistics}
                onChange={(e) => setLogistics(e.target.value)}
                placeholder="Neighborhood, public meetup spot, or virtual only — never share your full home address publicly."
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Post to {tab === "clothes" ? "items" : "services"}
            </button>
          </form>
        </section>
      )}

      <section aria-label="Listings">
        <h2 className="h-section">Open listings</h2>
        <div className="card-list">
          {list.length === 0 ? (
            <div className="empty-state">Nothing listed here yet — be the first to share.</div>
          ) : (
            list.map((d) => (
              <article key={d.id} className="surface" style={{ padding: "var(--space-md)" }}>
                <span className="tag tag-teal">{d.kind === "clothes" ? "Items" : "Service"}</span>
                <h3 style={{ margin: "0.5rem 0 0.35rem", fontSize: "1.1rem" }}>{d.title}</h3>
                <p style={{ margin: "0 0 0.5rem", color: "var(--color-ink-muted)" }}>{d.description}</p>
                <p style={{ margin: "0 0 0.35rem", fontSize: "0.9rem" }}>
                  <strong>Logistics:</strong> {d.logistics}
                </p>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-ink-muted)" }}>
                  {d.authorName} · {new Date(d.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))
          )}
        </div>
      </section>

      <p style={{ fontSize: "0.88rem", color: "var(--color-ink-muted)", marginTop: "var(--space-lg)" }}>
        Safety tip: meet in public places for exchanges; verify identity in the neighborhood forum when
        unsure. Report scams via <Link to="/support">Support</Link>.
      </p>

      <style>{`
        .circle-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: var(--space-md);
          flex-wrap: wrap;
        }
        .circle-tab {
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font: inherit;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          color: var(--color-ink-muted);
        }
        .circle-tab--on {
          background: var(--color-teal-soft);
          border-color: var(--color-teal);
          color: var(--color-teal-dark);
        }
        .h-section {
          font-size: 1.1rem;
          margin: 0 0 var(--space-md);
        }
      `}</style>
    </div>
  );
}
