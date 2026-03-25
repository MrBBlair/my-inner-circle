export function TermsOfService() {
  return (
    <article className="legal-page surface">
      <h1>Terms of use</h1>
      <p className="legal-page__updated">
        <strong>Effective date:</strong> {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
      </p>
      <p className="legal-page__notice">
        These <strong>sample terms</strong> are for demonstration only. They are not legal advice. Have counsel review
        them before launch.
      </p>

      <h2>1. Agreement</h2>
      <p>
        By accessing or using The My Inner Circle App (the “Service”), you agree to these Terms of Use and our{" "}
        <a href="/privacy">Privacy policy</a> and <a href="/guidelines">Community guidelines</a>. If you do not
        agree, do not use the Service.
      </p>

      <h2>2. The Service</h2>
      <p>
        We provide an online community platform, including discussion spaces, events information, wellness content,
        and related features. We may change, suspend, or discontinue features at any time. The Service may be offered
        in tiers with different capabilities.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must meet any minimum age and eligibility requirements we specify and have authority to enter this
        agreement. You may not use the Service if you are prohibited from doing so under applicable law.
      </p>

      <h2>4. Accounts</h2>
      <p>
        You are responsible for safeguarding your credentials and for activity under your account. Notify us
        promptly of unauthorized use. We may suspend or terminate accounts that violate these Terms or threaten
        community safety.
      </p>

      <h2>5. Community conduct</h2>
      <p>
        You agree to follow our <a href="/guidelines">Community guidelines</a>. Harassment, hate, illegal activity,
        non-consensual intimate imagery, spam, scams, and other harmful behavior are prohibited. We may remove
        content, issue warnings, or ban accounts.
      </p>

      <h2>6. Your content</h2>
      <p>
        You retain ownership of content you post. You grant us a non-exclusive, worldwide, royalty-free license to
        host, store, display, reproduce, and distribute your content solely to operate, promote, and improve the
        Service and enforce our policies — unless a narrower license is required by law.
      </p>
      <p>
        You represent that you have the rights to grant this license and that your content does not violate third-party
        rights or law.
      </p>

      <h2>7. Moderation &amp; reporting</h2>
      <p>
        We may moderate the Service using automated tools, human review, and member reports. We are not obligated to
        monitor all content. Our actions are not endorsement of any post.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
        WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.
      </p>
      <p>
        Content on the Service (including wellness or health-related posts) is informational and not professional
        medical, legal, or therapeutic advice. Seek qualified professionals for personal decisions.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND SUPPLIERS
        WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
        PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. OUR AGGREGATE LIABILITY FOR CLAIMS RELATING
        TO THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID US IN THE TWELVE MONTHS BEFORE THE
        CLAIM OR (B) ONE HUNDRED U.S. DOLLARS, UNLESS APPLICABLE LAW REQUIRES OTHERWISE.
      </p>

      <h2>10. Indemnity</h2>
      <p>
        You will defend and indemnify us against claims, damages, losses, and expenses (including reasonable attorneys’
        fees) arising from your content, your use of the Service, or your breach of these Terms — subject to
        procedures your counsel may require for your jurisdiction.
      </p>

      <h2>11. Termination</h2>
      <p>
        You may stop using the Service at any time. We may suspend or terminate access for violations, risk, or
        operational reasons. Provisions that by their nature should survive (including licenses to the extent content
        remains displayed, disclaimers, limitations, indemnity) survive termination.
      </p>

      <h2>12. Governing law &amp; disputes</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction you designate for your organization, excluding
        conflict-of-law rules. Courts in that jurisdiction have exclusive venue unless mandatory consumer protections
        apply elsewhere. You may have mandatory rights in your country of residence.
      </p>

      <h2>13. Changes</h2>
      <p>
        We may modify these Terms. We will post the updated Terms and update the effective date. If changes are
        material, we may provide additional notice. Continued use after the effective date constitutes acceptance unless
        law requires otherwise.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions: <a href="/contact">Contact us</a>.
      </p>
    </article>
  );
}
