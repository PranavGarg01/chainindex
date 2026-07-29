import Link from "next/link";
import Image from "next/image";
import { HomeLogoLink } from "./home-logo-link";
import { ThemeToggle } from "./theme-toggle";

export function EditorialSidebar() {
  return (
    <aside className="editorial-sidebar">
      <div>
        <div className="editorial-brand-row">
          <HomeLogoLink>
            <Image
              className="atlas-mark"
              src="/chainindex-pixel-mark.svg"
              alt=""
              width={36}
              height={36}
              priority
            />
            <strong>
              <span className="brand-mono">Chain</span>
              <span className="brand-sans">Index</span>
            </strong>
          </HomeLogoLink>
          <div className="editorial-controls">
            <a
              className="icon-button"
              href="https://github.com/PranavGarg01/chainindex"
              target="_blank"
              rel="noreferrer"
              aria-label="ChainIndex on GitHub"
              title="GitHub"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 19c-4 .9-4-2-5-2m10 4v-3.9a3.4 3.4 0 0 0-.9-2.6c3 0 6.1-1.5 6.1-6.5a5 5 0 0 0-1.3-3.5 4.7 4.7 0 0 0-.1-3.5s-1-.3-3.5 1.3a12 12 0 0 0-6.4 0C5.4.7 4.4 1 4.4 1a4.7 4.7 0 0 0-.1 3.5A5 5 0 0 0 3 8c0 5 3.1 6.5 6.1 6.5a3.4 3.4 0 0 0-.9 2.6V21" />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
        <div className="editorial-intro">
          {/* <span className="editorial-kicker">Open developer index</span> */}
          <p className="editorial-title">Public RPCs for every chain</p>
          <p className="editorial-copy">
            Discover public RPC endpoints, chain IDs, explorers, and network details across EVM
            chains. Search any chain and add to wallet instantly.
          </p>
        </div>
        <div className="editorial-actions">
          <Link className="button primary" href="/submit">
            Submit RPC <span>→</span>
          </Link>
          {/* <button className="button secondary" type="button" aria-label="API coming soon">API <span>→</span></button> */}
        </div>
      </div>
      <div className="editorial-sidebar-footer">
        <nav>
          <Link href="/about">About</Link>
          <Link href="/submit">Contribute</Link>
        </nav>
      </div>
    </aside>
  );
}
