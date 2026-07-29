import chainOrder from "@/data/chain-order.json";
import type { Chain } from "./types";

const rankByChainId = new Map(
  (chainOrder.chainIds as number[]).map((chainId, index) => [chainId, index]),
);

export function getPopularityRank(chainId: number): number {
  return rankByChainId.get(chainId) ?? Number.MAX_SAFE_INTEGER;
}

export function compareByPopularity(a: Chain, b: Chain): number {
  return (
    getPopularityRank(a.chainId) - getPopularityRank(b.chainId) ||
    a.name.localeCompare(b.name) ||
    a.chainId - b.chainId
  );
}
