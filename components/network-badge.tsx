import type { NetworkType } from "@/lib/types";

export function NetworkBadge({ type }: { type: NetworkType }) {
  if (type === "mainnet") return null;
  return <span className={`badge ${type}`}>{type}</span>;
}
