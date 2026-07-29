import type { Metadata } from "next";
import { ChainDirectory } from "@/components/chain-directory";
import { getChains } from "@/lib/data";

export const metadata: Metadata = {
  title: "EVM Testnet RPCs",
  description: "Find testnet RPC URLs, chain IDs, explorers, and wallet setup details.",
  alternates: { canonical: "/testnets" },
  openGraph: { url: "/testnets" },
};
export default function TestnetsPage() {
  const chains = getChains().filter((chain) => chain.networkType === "testnet");
  return (
    <div className="page-wrap">
      <ChainDirectory
        chains={chains.slice(0, 40)}
        totalCount={chains.length}
        initialFilter="testnet"
        title="Testnet RPC directory"
      />
    </div>
  );
}
