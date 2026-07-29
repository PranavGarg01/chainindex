import "server-only";
import chainIndex from "@/data/chains.index.json";
import { compareByPopularity } from "./chain-order";
import type { Chain } from "./types";

const chains = (chainIndex as unknown as Chain[]).slice().sort(compareByPopularity);

export function getChains(): Chain[] {
  return chains;
}

export function getChain(slug: string): Chain | undefined {
  return getChains().find((chain) => chain.slug === slug);
}
