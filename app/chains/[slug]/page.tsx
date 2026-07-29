import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddWalletButton } from "@/components/add-wallet-button";
import { ChainLogo } from "@/components/chain-logo";
import { NetworkBadge } from "@/components/network-badge";
import { NetworkDetailsTabs } from "@/components/network-details-tabs";
import { getChain, getChains } from "@/lib/data";
import { getRecommendedRpc } from "@/lib/rpc";

const seoOverrides: Record<string, { title: string; description: string }> = {
  ethereum: {
    title: "Ethereum RPC URL & Chain ID (1)",
    description:
      "Find public Ethereum RPC URLs, verify Ethereum Mainnet Chain ID 1 (0x1), view explorer links, and add Ethereum to a compatible wallet.",
  },
  polygon: {
    title: "Polygon RPC URL & Chain ID (137)",
    description:
      "Find public Polygon PoS RPC URLs, verify Chain ID 137 (0x89), view explorer links, and add Polygon to a compatible wallet.",
  },
  "arbitrum-one": {
    title: "Arbitrum RPC URL & Chain ID (42161)",
    description:
      "Find public Arbitrum One RPC URLs, verify Chain ID 42161 (0xa4b1), view explorer links, and add Arbitrum to a compatible wallet.",
  },
  "bnb-smart-chain": {
    title: "BSC RPC URL & Chain ID (56)",
    description:
      "Find public BNB Smart Chain (BSC) RPC URLs, verify Chain ID 56 (0x38), view explorer links, and add BSC to a compatible wallet.",
  },
  base: {
    title: "Base RPC URL & Chain ID (8453)",
    description:
      "Find public Base RPC URLs, verify Base Mainnet Chain ID 8453 (0x2105), view explorer links, and add Base to a compatible wallet.",
  },
  op: {
    title: "Optimism RPC URL & Chain ID (10)",
    description:
      "Find public Optimism (OP Mainnet) RPC URLs, verify Chain ID 10 (0xa), view explorer links, and add Optimism to a compatible wallet.",
  },
  gnosis: {
    title: "Gnosis Chain RPC URL & Chain ID (100)",
    description:
      "Find public Gnosis Chain RPC URLs, verify Chain ID 100 (0x64), view explorer links, and add Gnosis to a compatible wallet.",
  },
  linea: {
    title: "Linea RPC URL & Chain ID (59144)",
    description:
      "Find public Linea RPC URLs, verify Chain ID 59144 (0xe708), view explorer links, and add Linea to a compatible wallet.",
  },
  hyperevm: {
    title: "HyperEVM RPC URL & Chain ID (999)",
    description:
      "Find public HyperEVM RPC URLs, verify Chain ID 999 (0x3e7), view explorer links, and add HyperEVM to a compatible wallet.",
  },
  doma: {
    title: "Doma RPC URL & Chain ID (97477)",
    description:
      "Find public Doma RPC URLs, verify Chain ID 97477 (0x17cc5), view explorer links, and add Doma to a compatible wallet.",
  },
};

export const dynamicParams = false;
export function generateStaticParams() {
  return getChains().map((chain) => ({ slug: chain.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chain = getChain(slug);
  if (!chain) return {};
  const override = seoOverrides[chain.slug];
  const title = override?.title ?? `${chain.name} RPC URL & Chain ID (${chain.chainId})`;
  const description =
    override?.description ??
    `Find public ${chain.name} RPC URLs, verify Chain ID ${chain.chainId} (0x${chain.chainId.toString(16)}), view explorer links, and add the network to a compatible wallet.`;
  const url = `/chains/${chain.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function ChainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chain = getChain(slug);
  if (!chain) notFound();
  const recommended = getRecommendedRpc(chain);
  const related = getChains()
    .filter((item) => item.slug !== chain.slug && item.networkType === chain.networkType)
    .slice(0, 5);
  const faq = [
    {
      q: `What is the RPC URL for ${chain.name}?`,
      a: `${recommended.url} is the recommended endpoint in this directory. Multiple alternatives are listed above in case an endpoint is unavailable from your region.`,
    },
    {
      q: `What is the ${chain.name} chain ID?`,
      a: `${chain.name} uses chain ID ${chain.chainId} (0x${chain.chainId.toString(16)} in hexadecimal).`,
    },
    {
      q: `How do I add ${chain.name} to my wallet?`,
      a: "Use the Add to wallet button above. Your wallet will ask you to review and approve the network details.",
    },
    {
      q: "Are public RPC endpoints safe?",
      a: "Treat public RPCs as infrastructure operated by third parties. They can observe requests, rate-limit traffic, or be unavailable. Never send private keys or seed phrases to an RPC.",
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <div className="chain-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="breadcrumbs">
        <Link href="/chains">Networks</Link>
        <span>/</span>
        <span>{chain.name}</span>
      </div>
      <section className="utility-chain-hero">
        <div className="chain-title">
          <ChainLogo chain={chain} size="large" />
          <div>
            <div className="chain-kicker">
              <NetworkBadge type={chain.networkType} />
              <span>
                Chain ID {chain.chainId} · {chain.nativeCurrency.symbol}
              </span>
            </div>
            <h1>{chain.name}</h1>
            <p>Public RPC endpoints and wallet configuration for {chain.name}.</p>
          </div>
        </div>
        <div className="chain-header-actions">
          {chain.website && (
            <a href={chain.website} target="_blank" rel="noreferrer">
              Website ↗
            </a>
          )}
          {chain.docs && (
            <a href={chain.docs} target="_blank" rel="noreferrer">
              Docs ↗
            </a>
          )}
          <AddWalletButton chain={chain} rpcUrl={recommended.url} compact label="Add to wallet" />
        </div>
      </section>
      <section className="chain-primary-data">
        <h2>Network endpoints</h2>
        <NetworkDetailsTabs chain={chain} className="detail-page-tabs" />
      </section>
      <section className="chain-guide-grid" aria-label={`${chain.name} setup guidance`}>
        <article>
          <span>01</span>
          <h2>What is a {chain.name} RPC?</h2>
          <p>
            An RPC endpoint connects wallets and applications to {chain.name}. Use the endpoints
            above for JSON-RPC requests, and keep alternatives available for regional endpoint
            failures or rate limits.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Add {chain.name} to MetaMask</h2>
          <p>
            Use “Add to wallet” to request the network configuration. Always verify chain ID{" "}
            {chain.chainId}, currency {chain.nativeCurrency.symbol}, and the selected RPC before
            approving.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Public RPC safety</h2>
          <p>
            Public endpoints are third-party infrastructure. They may log requests, enforce limits,
            or become unavailable. Never place private keys, seed phrases, or secrets in an RPC
            request.
          </p>
        </article>
        <article>
          <span>04</span>
          <h2>Common RPC errors</h2>
          <p>
            Rate limits, browser CORS rules, network mismatch, and temporary provider failures are
            common. Try another listed endpoint and verify the returned chain ID.
          </p>
        </article>
      </section>
      <section className="faq-section">
        <span className="eyebrow">Common questions</span>
        <h2>{chain.name} RPC FAQ</h2>
        <div>
          {faq.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <span>+</span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="source-strip">
        <div>
          <strong>Found an issue?</strong>
          <p>Help keep network data current through a community contribution.</p>
        </div>
        <Link href="/submit">Report a broken RPC →</Link>
      </section>
      {related.length > 0 && (
        <section className="related-networks">
          <h2>Related networks</h2>
          <div>
            {related.map((item) => (
              <Link href={`/chains/${item.slug}`} key={item.slug}>
                {item.name}
                <span>Chain ID {item.chainId}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
