"use client";

import { useState } from "react";
import type { Chain } from "@/lib/types";
import { getRecommendedRpc } from "@/lib/rpc";
import { AddWalletButton } from "./add-wallet-button";
import { CopyableValue } from "./copyable-value";
import { ExpandedRpcPanel } from "./expanded-rpc-panel";
import { NetworkBadge } from "./network-badge";

export function ExpandableNetwork({
  chain,
  variant = "row",
}: {
  chain: Chain;
  variant?: "row" | "card";
}) {
  const [open, setOpen] = useState(false);
  const rpc = getRecommendedRpc(chain);
  return (
    <article
      className={`expandable-network ${variant} ${open ? "expanded" : ""}`}
      data-chain-slug={chain.slug}
      onClick={() => setOpen((value) => !value)}
    >
      <div className="expandable-network-main">
        <div className="expandable-network-title">
          <div className="chain-icon">{chain.nativeCurrency.symbol.slice(0, 2)}</div>
          <div>
            <strong>{chain.name}</strong>
            <span>
              Chain ID{" "}
              <CopyableValue value={String(chain.chainId)} message="Chain ID copied">
                {chain.chainId}
              </CopyableValue>{" "}
              · {chain.nativeCurrency.symbol}
            </span>
          </div>
        </div>
        <div className="network-card-top-actions">
          <NetworkBadge type={chain.networkType} />
          <AddWalletButton chain={chain} rpcUrl={rpc.url} compact label="Add wallet" />
        </div>
        <div className="expandable-network-endpoint">
          <CopyableValue value={rpc.url} message="RPC copied" code showCopyIcon />
        </div>
        <div className="expandable-network-actions">
          <button
            className="chevron-button"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((value) => !value);
            }}
            aria-label={open ? "Collapse network" : "Expand network"}
            aria-expanded={open}
          >
            {open ? "⌃" : "⌄"}
          </button>
        </div>
      </div>
      {open && <ExpandedRpcPanel chain={chain} compact={variant === "card"} />}
    </article>
  );
}
