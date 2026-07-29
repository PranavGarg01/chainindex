export type NetworkType = "mainnet" | "testnet" | "devnet" | "local";
export type ChainStatus = "active" | "deprecated" | "unverified" | "coming_soon";

export interface RpcEndpoint {
  url: string;
  isRecommended: boolean;
}

export interface Chain {
  schemaVersion: 2;
  name: string;
  slug: string;
  chainId: number;
  networkType: NetworkType;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpc: RpcEndpoint[];
  explorers: { name: string; url: string }[];
  docs?: string;
  website?: string;
  status: ChainStatus;
  aliases?: string[];
}
