import { useState } from "react";

export function PublicContact() {
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <article className="legal-page surface">
      <h1>Contact us</h1>
      <p>
        Reach the Inner Circle team for general questions, partnerships, or accessibility needs. Members who are
        signed in can also use <strong>Support</strong> inside the app for account-specific help.
      </p>
      <p>
        <strong>Email (placeholder):</strong>{" "}
        <a href="mailto:hello@myinnercircle.example">hello@myinnercircle.example</a>
      </p>

      <h2>Send a message</h2>
      {sent && (
        <p role="status" className="legal-page__ok">
          Thanks — this demo doesn’t send email yet. Connect your form to your inbox or CRM in production.
        </p>
      )}
      <form className="legal-page__form" onSubmit={submit}>
        <div className="field">
          <label className="label" htmlFor="pub-name">
            Name
          </label>
          <input id="pub-name" className="input" required autoComplete="name" />
        </div>
        <div className="field">
          <label className="label" htmlFor="pub-email">
            Email
          </label>
          <input id="pub-email" className="input" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label className="label" htmlFor="pub-msg">
            Message
          </label>
          <textarea id="pub-msg" className="textarea" required rows={5} />
        </div>
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </article>
  );
}
