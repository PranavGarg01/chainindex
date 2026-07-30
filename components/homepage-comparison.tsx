import type { Chain } from "@/lib/types";
import { ChainDirectory } from "./chain-directory";

export function HomepageComparison({
  chains,
  totalCount,
}: {
  chains: Chain[];
  totalCount: number;
}) {
  return (
    <div className="editorial-home">
      <h1 className="sr-only">Public EVM RPC list and chain IDs</h1>
      <ChainDirectory chains={chains} totalCount={totalCount} homepage />
    </div>
  );
}
