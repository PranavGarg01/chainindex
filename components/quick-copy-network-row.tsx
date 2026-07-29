"use client";

import { useRouter } from "next/navigation";
import type { Chain } from "@/lib/types";
import { getRecommendedRpc } from "@/lib/rpc";
import { AddWalletButton } from "./add-wallet-button";
import { ChainLogo } from "./chain-logo";
import { CopyableValue } from "./copyable-value";

export function QuickCopyNetworkRow({
  chain,
  searchResult = false,
}: {
  chain: Chain;
  searchResult?: boolean;
}) {
  const router = useRouter();
  const rpc = getRecommendedRpc(chain);
  const openChain = () => router.push(`/chains/${chain.slug}`);
  return (
    <article
      className={`quick-network-row ${searchResult ? "search-result-row" : ""}`}
      data-chain-slug={chain.slug}
      role="link"
      tabIndex={0}
      onClick={openChain}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openChain();
        }
      }}
    >
      <div className="quick-network-name">
        <ChainLogo chain={chain} size="small" />
        <div>
          <strong>{chain.name}</strong>
          <span className="quick-network-meta">
            <span>Chain ID</span>
            <CopyableValue value={String(chain.chainId)} message="Chain ID copied">
              {chain.chainId}
            </CopyableValue>
          </span>
        </div>
      </div>
      {/* <span className="quick-network-badge"><NetworkBadge type={chain.networkType} /></span> */}
      <div className="quick-network-rpc">
        <CopyableValue value={rpc.url} message="RPC copied" code showCopyIcon />
      </div>
      <div className="quick-network-actions">
        <AddWalletButton chain={chain} rpcUrl={rpc.url} compact label="" />
      </div>
    </article>
  );
}
