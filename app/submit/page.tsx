import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribute RPC Data",
  description: "Add a chain, submit a public RPC, or report a broken endpoint to ChainIndex.",
  alternates: { canonical: "/submit" },
  openGraph: { url: "/submit" },
};

const contributionTypes = [
  {
    number: "01",
    title: "Add an RPC",
    copy: "Add a public HTTPS RPC endpoint for an existing chain.",
    action: "Open PR",
  },
  {
    number: "02",
    title: "Add a chain",
    copy: "Add a new chain with its RPCs, explorer, currency and metadata.",
    action: "Open PR",
  },
  {
    number: "03",
    title: "Report a broken RPC",
    copy: "Share the endpoint, the error you saw, and how you tested it.",
    action: "Report",
  },
];

export default function SubmitPage() {
  return (
    <div className="page-wrap content-page submit-page">
      <header className="documentation-hero">
        <span className="eyebrow">Open Source</span>
        <h1>Contribute to ChainIndex</h1>
        <p className="lede">
          Every chain is stored as JSON. Keep changes small, verifiable, and easy to review.
        </p>
      </header>

      <section className="contribution-list" aria-label="Contribution options">
        {contributionTypes.map((item) => (
          <article key={item.number}>
            <span>{item.number}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </div>
            <a href="https://github.com/PranavGarg01/chainindex" target="_blank" rel="noreferrer">
              {item.action} ↗
            </a>
          </article>
        ))}
      </section>

      <div className="contribution-doc-grid">
        <section>
          {/* <span className="eyebrow">Contribution requirements</span> */}
          <h2>Contribution checklist</h2>
          <ul>
            <li>Public HTTPS endpoint (no API key)</li>
            <li>Returns the correct chain ID</li>
            <li>One chain per file</li>
          </ul>
          <p className="contribution-warning">
            <strong>Never submit secrets.</strong> API keys, tokens, private endpoints, seed
            phrases, and wallet credentials do not belong in a public registry.
          </p>
        </section>
        <section className="schema-example">
          <div>
            <span className="eyebrow">Example</span>
            <h2>Keep records minimal</h2>
            <p>Only include data that can be verified by anyone.</p>
          </div>
          <pre>
            <code>{`{
  "url": "https://example-rpc.com",
  "isRecommended": true
}`}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
