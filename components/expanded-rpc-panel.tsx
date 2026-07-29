"use client";

import type { Chain } from "@/lib/types";
import { NetworkDetailsTabs } from "./network-details-tabs";

export function ExpandedRpcPanel({
  chain,
  compact = false,
  panelId,
}: {
  chain: Chain;
  compact?: boolean;
  panelId?: string;
}) {
  return (
    <NetworkDetailsTabs chain={chain} className={compact ? "compact" : ""} panelId={panelId} />
  );
}
