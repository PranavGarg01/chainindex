"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Chain } from "@/lib/types";
import { getRecommendedRpc } from "@/lib/rpc";
import { ChainLogo } from "./chain-logo";
import { CopyableValue } from "./copyable-value";
import { NetworkBadge } from "./network-badge";

export function FeaturedNetworkCard({ chain }: { chain: Chain }) {
  const router = useRouter();
  const rpc = getRecommendedRpc(chain);
  const navigate = () => router.push(`/chains/${chain.slug}`);
  const navigateDesktop = () => {
    if (!window.matchMedia("(max-width: 680px)").matches) navigate();
  };
  return (
    <article
      className="featured-network-card"
      role="link"
      tabIndex={0}
      onClick={navigateDesktop}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigateDesktop();
        }
      }}
      aria-label={`Open ${chain.name}`}
    >
      <header>
        <ChainLogo chain={chain} />
        <div>
          <span className="featured-card-name">{chain.name}</span>
          <NetworkBadge type={chain.networkType} />
        </div>
      </header>
      <p className="featured-card-meta">
        Chain ID{" "}
        <CopyableValue value={String(chain.chainId)} label="Chain ID" variant="plain" code>
          {chain.chainId}
        </CopyableValue>
        <span>·</span>
        {chain.nativeCurrency.symbol}
      </p>
      <CopyableValue value={rpc.url} label="RPC" variant="field" code truncate showCopyIcon />
      <Link
        className="featured-details-link"
        href={`/chains/${chain.slug}`}
        prefetch={false}
        onClick={(event) => event.stopPropagation()}
      >
        View details →
      </Link>
      {/* <p className="featured-card-footer">{chain.rpc.length} RPC{chain.rpc.length === 1 ? "" : "s"}</p> */}
    </article>
  );
}
