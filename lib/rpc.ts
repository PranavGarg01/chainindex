import type { Chain, RpcEndpoint } from "./types";
import { compareByPopularity } from "./chain-order";

export function getRecommendedRpc(chain: Chain): RpcEndpoint {
  return chain.rpc.find((rpc) => rpc.isRecommended) ?? chain.rpc[0];
}

export function getRpcLabel(rpc: RpcEndpoint): string {
  try {
    return new URL(rpc.url).hostname.replace(/^www\./, "");
  } catch {
    return rpc.url;
  }
}

export function rankChains(chains: Chain[], query: string): Chain[] {
  const needle = query.trim().toLowerCase();
  const testnetIntent = /testnet|sepolia|goerli|holesky|amoy/.test(needle);
  return chains
    .filter((chain) => {
      if (!needle) return true;
      return [
        chain.name,
        chain.slug,
        chain.chainId,
        chain.nativeCurrency.name,
        chain.nativeCurrency.symbol,
        chain.aliases?.join(" "),
        chain.website,
        chain.docs,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    })
    .sort((a, b) => {
      const score = (chain: Chain) => {
        let value = 0;
        if (String(chain.chainId) === needle) value += 1_000_000;
        if (chain.name.toLowerCase() === needle) value += 500_000;
        if (!testnetIntent && chain.networkType === "mainnet") value += 100_000;
        if (testnetIntent && chain.networkType === "testnet") value += 100_000;
        if (chain.name.toLowerCase().startsWith(needle)) value += 10_000;
        return value;
      };
      return score(b) - score(a) || compareByPopularity(a, b);
    });
}
