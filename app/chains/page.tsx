import type { Metadata } from "next";
import { ChainDirectory } from "@/components/chain-directory";
import { getChains } from "@/lib/data";

export const metadata: Metadata = {
  title: "EVM Chains Directory",
  description:
    "Search public RPC endpoints, chain IDs, explorers, and wallet configurations for EVM networks.",
  alternates: { canonical: "/chains" },
  openGraph: { url: "/chains" },
};
export default function ChainsPage() {
  const chains = getChains();
  return (
    <div className="page-wrap">
      <ChainDirectory
        chains={chains.slice(0, 40)}
        totalCount={chains.length}
        title="EVM chains and networks"
      />
    </div>
  );
}
