import type { Chain } from "@/lib/types";
import { ChainDirectory } from "./chain-directory";

export function HomepageComparison({
  chains,
  featuredChains,
  totalCount,
}: {
  chains: Chain[];
  featuredChains: Chain[];
  totalCount: number;
}) {
  return (
    <div className="editorial-home">
      <h1 className="sr-only">Public EVM RPC list and chain IDs</h1>
      <ChainDirectory
        chains={chains}
        featuredChains={featuredChains}
        totalCount={totalCount}
        homepage
      />
    </div>
  );
}
