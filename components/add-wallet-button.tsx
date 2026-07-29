"use client";

import { useState } from "react";
import type { Chain } from "@/lib/types";

declare global {
  interface Window {
    ethereum?: { request: (request: { method: string; params?: unknown[] }) => Promise<unknown> };
  }
}

function WalletAddIcon() {
  return (
    <svg
      width="25"
      height="26"
      viewBox="0 0 25 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.98 3.82007H17.11C18.81 3.82007 20.19 5.33007 20.19 7.18007"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.75 10.8601V5.89014"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.48 7.18007H7.29C6.44 7.18007 5.75 6.43007 5.75 5.50007C5.75 4.57007 6.44 3.82007 7.29 3.82007H14.48"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.7099 14.1899C19.9916 14.1899 20.2199 13.9616 20.2199 13.6799C20.2199 13.3983 19.9916 13.1699 19.7099 13.1699C19.4283 13.1699 19.2 13.3983 19.2 13.6799C19.2 13.9616 19.4283 14.1899 19.7099 14.1899Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.2695 6.47949C23.2954 6.47949 24.9504 8.1327 24.9404 10.1699V17.1992C24.9404 19.2243 23.2979 20.8799 21.2598 20.8799H12.9971C12.99 20.4017 12.9419 19.9338 12.8545 19.4795H21.2598C22.5216 19.4795 23.54 18.4542 23.54 17.1992V10.165C23.5473 8.90456 22.522 7.87988 21.2695 7.87988H6.4502V13.1328C5.99557 13.0495 5.5278 13.0039 5.0498 13.001V7.17969C5.04997 6.79323 5.3635 6.47949 5.75 6.47949H21.2695Z"
        fill="currentColor"
      />
      <path
        d="M6 16.5V23.5M2.5 20H9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AddWalletButton({
  chain,
  rpcUrl,
  compact = false,
  iconOnly = false,
  label = "Add to wallet",
}: {
  chain: Chain;
  rpcUrl?: string;
  compact?: boolean;
  iconOnly?: boolean;
  label?: string;
}) {
  const [message, setMessage] = useState("");
  const add = async () => {
    if (!window.ethereum) {
      setMessage("No compatible wallet found");
      return;
    }
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chain.chainId.toString(16)}`,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: [rpcUrl ?? chain.rpc[0].url],
            blockExplorerUrls: chain.explorers.map((item) => item.url),
          },
        ],
      });
      setMessage("Network added");
    } catch (error) {
      setMessage(
        error instanceof Error && /reject/i.test(error.message)
          ? "Request rejected"
          : "Could not add network",
      );
    }
  };
  return (
    <div className="wallet-action" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className={`button primary ${compact ? "button-compact" : ""} ${iconOnly ? "wallet-icon-button" : ""}`}
        onClick={add}
        aria-label={iconOnly ? label : undefined}
        title={iconOnly ? label : undefined}
        disabled={!chain.rpc.length || chain.status === "deprecated"}
      >
        {iconOnly ? (
          <WalletAddIcon />
        ) : (
          <>
            <WalletAddIcon />
            {label}
          </>
        )}
      </button>
      {message && <span role="status">{message}</span>}
    </div>
  );
}
