"use client";

import Link from "next/link";
import type { Chain } from "@/lib/types";
import { getRecommendedRpc } from "@/lib/rpc";
import { ChainLogo } from "./chain-logo";
import { CopyableValue } from "./copyable-value";
import { ExpandedRpcPanel } from "./expanded-rpc-panel";
import { NetworkBadge } from "./network-badge";
import { Button } from "./ui/primitives";

function ExpandButton({
  expanded,
  onToggle,
  controls,
}: {
  expanded: boolean;
  onToggle: () => void;
  controls: string;
}) {
  return (
    <Button
      variant="ghost"
      className="row-expand-button"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-label={expanded ? "Collapse network" : "Expand network"}
      aria-expanded={expanded}
      aria-controls={controls}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path className="chevron-desktop" d="M6 4 L10 8 L6 12" />
        <path className="chevron-mobile" d={expanded ? "M4 10 L8 6 L12 10" : "M4 6 L8 10 L12 6"} />
      </svg>
    </Button>
  );
}

export function CompactChainRow({
  chain,
  expanded,
  onToggle,
}: {
  chain: Chain;
  expanded: boolean;
  onToggle: () => void;
}) {
  const rpc = getRecommendedRpc(chain);
  const explorer = chain.explorers[0]?.url;
  const panelId = `chain-details-desktop-${chain.slug}`;
  return (
    <>
      <tr
        className={`compact-chain-row ${expanded ? "expanded" : ""}`}
        data-chain-slug={chain.slug}
        onClick={onToggle}
      >
        <td>
          <div className="table-network">
            <ExpandButton expanded={expanded} onToggle={onToggle} controls={panelId} />
            <ChainLogo chain={chain} size="normal" />
            <div>
              <Link
                href={`/chains/${chain.slug}`}
                prefetch={false}
                onClick={(event) => event.stopPropagation()}
              >
                {chain.name}
              </Link>
              <span>
                {/* <small>{chain.slug}</small> */}
                <NetworkBadge type={chain.networkType} />
              </span>
            </div>
          </div>
        </td>
        <td>
          <CopyableValue
            value={String(chain.chainId)}
            label="Chain ID"
            variant="table"
            code
            showCopyIcon
          >
            {chain.chainId}
          </CopyableValue>
        </td>
        <td>{chain.nativeCurrency.symbol}</td>
        <td>
          {explorer ? (
            <a
              className="directory-explorer-link"
              href={explorer}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              <code>{explorer}</code>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M5 11 11 5M6 5h5v5" />
              </svg>
            </a>
          ) : (
            <span className="directory-url-empty">—</span>
          )}
        </td>
        <td>
          <CopyableValue value={rpc.url} label="RPC" variant="table" code truncate showCopyIcon />
        </td>
      </tr>
      {expanded && (
        <tr className="chain-expanded-table-row">
          <td colSpan={5}>
            <ExpandedRpcPanel chain={chain} panelId={panelId} />
          </td>
        </tr>
      )}
    </>
  );
}

export function CompactChainCard({
  chain,
  expanded,
  onToggle,
}: {
  chain: Chain;
  expanded: boolean;
  onToggle: () => void;
}) {
  const rpc = getRecommendedRpc(chain);
  const panelId = `chain-details-mobile-${chain.slug}`;
  return (
    <article
      className={`compact-chain-card ${expanded ? "expanded" : ""}`}
      data-chain-slug={chain.slug}
    >
      <header>
        <ChainLogo chain={chain} />
        <div>
          <Link
            href={`/chains/${chain.slug}`}
            prefetch={false}
            onClick={(event) => event.stopPropagation()}
          >
            {chain.name}
          </Link>
          <span>
            Chain ID{" "}
            <CopyableValue value={String(chain.chainId)} label="Chain ID">
              {chain.chainId}
            </CopyableValue>{" "}
            · {chain.nativeCurrency.symbol}
          </span>
        </div>
        <NetworkBadge type={chain.networkType} />
        <ExpandButton expanded={expanded} onToggle={onToggle} controls={panelId} />
      </header>
      <CopyableValue value={rpc.url} label="RPC" variant="field" code truncate showCopyIcon />
      <div className="mobile-network-signals">
        <Link className="mobile-details-link" href={`/chains/${chain.slug}`} prefetch={false}>
          View details →
        </Link>
      </div>
      {expanded && <ExpandedRpcPanel chain={chain} compact panelId={panelId} />}
    </article>
  );
}
