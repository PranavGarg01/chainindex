import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About",
  description: "Why ChainIndex exists and how its open RPC data works.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};
export default function AboutPage() {
  return (
    <div className="page-wrap content-page prose-page">
      <span className="eyebrow">About ChainIndex</span>
      <h1>Reliable metadata, without the black box.</h1>
      <p className="lede">
        ChainIndex is a frontend-first directory for finding EVM network configuration and public
        endpoints. Public registry data is normalized into reviewable, one-chain-per-file records.
      </p>
      <h2>What browser checks mean</h2>
      <p>
        On-demand checks measure a request from your browser, in your current network and region.
        They are useful for choosing between endpoints right now, but they are not uptime history or
        a global reliability score.
      </p>
      <h2 id="api">API roadmap</h2>
      <p>
        A public read API is planned after the data model and contribution workflow stabilize.
        Future backend work may also add scheduled multi-region checks, block lag, method support,
        and transparent scoring.
      </p>
    </div>
  );
}
