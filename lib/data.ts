import "server-only";
import chainIndex from "@/data/chains.index.json";
import { compareByPopularity } from "./chain-order";
import type { Chain } from "./types";

const chains = (chainIndex as unknown as Chain[]).slice().sort(compareByPopularity);
const featuredChainIds = [1, 8453, 4663, 999];

export function getChains(): Chain[] {
  return chains;
}

export function getChain(slug: string): Chain | undefined {
  return getChains().find((chain) => chain.slug === slug);
}

export function getFeaturedChains(): Chain[] {
  const chainsById = new Map(getChains().map((chain) => [chain.chainId, chain]));
  return featuredChainIds
    .map((chainId) => chainsById.get(chainId))
    .filter((chain): chain is Chain => Boolean(chain));
}
