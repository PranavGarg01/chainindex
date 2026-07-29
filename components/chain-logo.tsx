"use client";

import type { Chain } from "@/lib/types";
import NetworkEthereum from "@web3icons/react/icons/networks/NetworkEthereum";
import styles from "./chain-logo.module.css";
import { networkIconByChainId } from "./network-icon-map";

export function ChainLogo({
  chain,
  size = "normal",
}: {
  chain: Chain;
  size?: "small" | "normal" | "large";
}) {
  const Icon = networkIconByChainId[chain.chainId];
  const c = chain.chainId === 8453 ? "branded" : "background";

  return (
    <span
      className={`${styles.logo} ${size === "small" ? styles.small : size === "large" ? styles.large : ""}`}
      aria-hidden="true"
    >
      {Icon ? (
        <Icon variant={c} size="100%" className={styles.icon} />
      ) : (
        <span className={styles.fallback}>
          <NetworkEthereum variant="mono" size="68%" className={styles.fallbackIcon} />
        </span>
      )}
    </span>
  );
}
