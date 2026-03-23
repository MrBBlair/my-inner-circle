export function PrivacyPolicy() {
  return (
    <article className="legal-page surface">
      <h1>Privacy policy</h1>
      <p className="legal-page__updated">
        <strong>Effective date:</strong> {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
      </p>
      <p className="legal-page__notice">
        This is a <strong>sample policy</strong> for a demo application. It is not legal advice. Have a qualified attorney
        review and adapt it before you collect real user data or launch publicly.
      </p>

      <h2>1. Who we are</h2>
      <p>
        “The My Inner Circle,” “we,” “us,” and “our” refer to the operator of this website and related services
        (the “Service”). Contact details appear on the <a href="/contact">Contact</a> page.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li>
          <strong>Account information:</strong> such as name, display name, email address, membership tier, profile
          fields (for example bio and interests), and credentials you provide when you create an account.
        </li>
        <li>
          <strong>Community content:</strong> posts, comments, reactions, RSVPs, reports, and similar content you
          submit through the Service.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, device type, browser type, approximate location derived from IP,
          and diagnostic logs — typically processed automatically when you use the site.
        </li>
        <li>
          <strong>Cookies and similar technologies:</strong> we may use cookies or local storage to keep you signed
          in, remember preferences, and understand how the Service is used.
        </li>
      </ul>

      <h2 id="cookies">3. Cookies &amp; local storage</h2>
      <p>
        This demo may store data in your browser (including <code>localStorage</code>) to simulate sign-in and
        community features. In a production deployment, you should disclose specific cookie names, purposes, and
        retention, and obtain consent where required (for example under the GDPR or ePrivacy rules).
      </p>

      <h2>4. How we use information</h2>
      <p>We use information to:</p>
      <ul>
        <li>Provide, secure, and improve the Service;</li>
        <li>Personalize your experience (for example your feed and joined spaces);</li>
        <li>Moderate content, enforce our <a href="/terms">Terms</a> and <a href="/guidelines">Community guidelines</a>, and respond to reports;</li>
        <li>Communicate with you about the Service, safety, or legal notices;</li>
        <li>Comply with law and protect rights, safety, and integrity of members and the public.</li>
      </ul>

      <h2>5. Sharing</h2>
      <p>We may share information:</p>
      <ul>
        <li>With service providers who assist us (hosting, analytics, email) under contractual safeguards;</li>
        <li>With moderators and staff to operate and protect the community;</li>
        <li>When required by law, legal process, or to protect vital interests;</li>
        <li>In connection with a merger, acquisition, or asset sale, with notice as required by law.</li>
      </ul>
      <p>We do not sell your personal information as a product. If you adopt “sale” language for ad tech, update this section.</p>

      <h2>6. Retention</h2>
      <p>
        We retain information as long as your account is active and as needed to provide the Service, comply with law,
        resolve disputes, and enforce our agreements. Specific retention periods should be defined for production.
      </p>

      <h2>7. Your choices &amp; rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, delete, or export personal data, or to
        object to or restrict certain processing. To exercise rights, contact us using the information on the{" "}
        <a href="/contact">Contact</a> page. You may also have the right to lodge a complaint with a supervisory
        authority.
      </p>

      <h2>8. Children</h2>
      <p>
        The Service is not directed to children under 13 (or the minimum age in your jurisdiction). We do not knowingly
        collect personal information from children. If you believe we have, contact us and we will take appropriate
        steps.
      </p>

      <h2>9. International transfers</h2>
      <p>
        If you access the Service from outside the country where servers are located, your information may be
        transferred across borders. Describe safeguards (for example Standard Contractual Clauses) in production.
      </p>

      <h2>10. Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect information. No method of transmission or
        storage is 100% secure.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update this policy from time to time. We will post the updated version and revise the effective date.
        Continued use after changes means you accept the updated policy, unless applicable law requires additional
        consent or notice.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about this policy: see <a href="/contact">Contact</a>.
      </p>
    </article>
  );
}
