import type { Metadata } from "next";
import Link from "next/link";
import { getChains } from "@/lib/data";

export const metadata: Metadata = {
  title: "All EVM Chains",
  description:
    "Browse every EVM chain indexed by ChainIndex, with direct links to chain IDs, RPC endpoints, explorers, and wallet configuration details.",
  alternates: { canonical: "/chains/all" },
  openGraph: { url: "/chains/all" },
};

export default function AllChainsPage() {
  const chains = getChains()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name) || a.chainId - b.chainId);

  return (
    <main className="page-wrap all-chains-page">
      <header className="all-chains-heading">
        <span className="eyebrow">Complete directory</span>
        <h1>All EVM chains</h1>
        <p>
          Browse all {chains.length} networks indexed by ChainIndex. Each link opens a dedicated
          page with RPC endpoints, chain IDs, explorers, and wallet details.
        </p>
      </header>
      <nav className="all-chains-list" aria-label="All indexed EVM chains">
        {chains.map((chain) => (
          <Link href={`/chains/${chain.slug}`} prefetch={false} key={chain.slug}>
            <span>{chain.name}</span>
            <small>Chain ID {chain.chainId}</small>
          </Link>
        ))}
      </nav>
    </main>
  );
}
