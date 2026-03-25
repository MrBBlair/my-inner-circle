import { Link } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo-link" aria-label="The My Inner Circle App — home">
            <BrandLogo variant="full" size="md" />
          </Link>
          <p>A digital safe space for women to grow, connect, and move forward with purpose.</p>
        </div>
        <div className="site-footer__cols">
          <div className="site-footer__col">
            <h2 className="site-footer__heading">Legal &amp; safety</h2>
            <ul className="site-footer__list">
              <li>
                <Link to="/privacy">Privacy policy</Link>
              </li>
              <li>
                <Link to="/privacy#cookies">Cookies &amp; storage</Link>
              </li>
              <li>
                <Link to="/terms">Terms of use</Link>
              </li>
              <li>
                <Link to="/guidelines">Community guidelines</Link>
              </li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h2 className="site-footer__heading">Connect</h2>
            <ul className="site-footer__list">
              <li>
                <Link to="/contact">Contact us</Link>
              </li>
              <li>
                <Link to="/login">Member sign in</Link>
              </li>
              <li>
                <Link to="/signup">Create an account</Link>
              </li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h2 className="site-footer__heading">Crisis resources</h2>
            <p className="site-footer__fine">
              If you are in immediate danger, call <strong>911</strong>. For mental health support, call or
              text <strong>988</strong> (US). See our{" "}
              <a href="https://988lifeline.org/" target="_blank" rel="noreferrer">
                988 Lifeline
              </a>
              .
            </p>
          </div>
        </div>
        <p className="site-footer__copy">
          © {year} The My Inner Circle App. All rights reserved. This site is a demo; policies are templates
          for review with your attorney.
        </p>
      </div>
      <style>{`
        .site-footer {
          background: linear-gradient(180deg, #ebe4dc 0%, #e3dcd6 100%);
          border-top: 1px solid var(--color-border);
          padding: var(--space-xl) var(--space-md) var(--space-lg);
          margin-top: auto;
        }
        .site-footer__inner {
          max-width: 1120px;
          margin: 0 auto;
        }
        .site-footer__brand {
          margin-bottom: var(--space-lg);
          max-width: 36rem;
        }
        .site-footer__logo-link {
          display: inline-flex;
          line-height: 0;
          margin-bottom: var(--space-sm);
          text-decoration: none;
          color: inherit;
        }
        .site-footer__logo-link:hover {
          opacity: 0.92;
        }
        .site-footer__brand p {
          margin: 0;
          font-size: 0.92rem;
          color: var(--color-ink-muted);
          line-height: 1.5;
        }
        .site-footer__cols {
          display: grid;
          gap: var(--space-lg);
          margin-bottom: var(--space-lg);
        }
        @media (min-width: 640px) {
          .site-footer__cols {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .site-footer__heading {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-purple);
          margin: 0 0 var(--space-sm);
        }
        .site-footer__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .site-footer__list li {
          margin-bottom: 0.4rem;
        }
        .site-footer__list a {
          font-weight: 600;
          font-size: 0.95rem;
        }
        .site-footer__fine {
          margin: 0;
          font-size: 0.88rem;
          color: var(--color-ink-muted);
          line-height: 1.5;
        }
        .site-footer__copy {
          margin: 0;
          padding-top: var(--space-md);
          border-top: 1px solid rgba(45, 42, 50, 0.1);
          font-size: 0.8rem;
          color: var(--color-ink-muted);
          line-height: 1.45;
        }
      `}</style>
    </footer>
  );
}
