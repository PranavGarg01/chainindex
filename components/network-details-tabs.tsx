"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { Chain, RpcEndpoint } from "@/lib/types";
import { AddWalletButton } from "./add-wallet-button";
import { CopyableValue } from "./copyable-value";

type Tab = "rpcs" | "explorers";
type ProbeResult = {
  state: "checking" | "available" | "unavailable" | "wrong-chain";
  latency?: number;
  height?: number;
};
type RpcScore = "green" | "yellow" | "red";

const REFRESH_INTERVAL = 60_000;
const PROBE_TIMEOUT = 6_500;

async function jsonRpcRequest(url: string, method: string, params: unknown[], signal: AbortSignal) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error("Request failed");
  const body = await response.json();
  if (body.error || body.result == null) throw new Error("Invalid response");
  return body.result;
}

async function probeRpc(
  rpc: RpcEndpoint,
  expectedChainId: number,
  parentSignal: AbortSignal,
): Promise<ProbeResult> {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  const timeout = window.setTimeout(cancel, PROBE_TIMEOUT);
  parentSignal.addEventListener("abort", cancel, { once: true });

  try {
    // Warm up DNS/TLS/CORS and verify that the endpoint belongs to this chain.
    const chainIdHex = await jsonRpcRequest(rpc.url, "eth_chainId", [], controller.signal);
    const chainId = Number.parseInt(chainIdHex, 16);
    if (!Number.isFinite(chainId)) throw new Error("Invalid response");
    if (chainId !== expectedChainId) return { state: "wrong-chain" };

    // Measure a second request so connection setup does not inflate the result.
    const started = performance.now();
    const block = await jsonRpcRequest(
      rpc.url,
      "eth_getBlockByNumber",
      ["latest", false],
      controller.signal,
    );
    const latency = Math.round(performance.now() - started);
    const height = Number.parseInt(block?.number ?? "", 16);
    if (!Number.isFinite(height)) throw new Error("Invalid block response");

    return { state: "available", latency, height };
  } catch {
    return { state: "unavailable" };
  } finally {
    window.clearTimeout(timeout);
    parentSignal.removeEventListener("abort", cancel);
  }
}

function scoreRpc(result: ProbeResult | undefined, best: ProbeResult | undefined): RpcScore {
  if (
    result?.state !== "available" ||
    result.latency == null ||
    result.height == null ||
    best?.latency == null ||
    best.height == null
  )
    return "red";
  const blockLag = best.height - result.height;
  const latencyGap = result.latency - best.latency;
  if (blockLag > 3 || latencyGap > 5_000) return "red";
  if (blockLag < 2 && latencyGap < 600) return "green";
  return "yellow";
}

function compareRpcResults(a: RpcEndpoint, b: RpcEndpoint, results: Record<string, ProbeResult>) {
  const aResult = results[a.url];
  const bResult = results[b.url];
  const aAvailable = aResult?.state === "available";
  const bAvailable = bResult?.state === "available";
  if (aAvailable !== bAvailable) return aAvailable ? -1 : 1;
  if (aAvailable && bAvailable) {
    const heightDifference = (bResult.height ?? 0) - (aResult.height ?? 0);
    if (heightDifference) return heightDifference;
    const latencyDifference =
      (aResult.latency ?? Number.MAX_SAFE_INTEGER) - (bResult.latency ?? Number.MAX_SAFE_INTEGER);
    if (latencyDifference) return latencyDifference;
  }
  return 0;
}

function LatencyValue({ result, best }: { result?: ProbeResult; best?: ProbeResult }) {
  if (!result) return <span className="endpoint-latency is-idle">Not checked</span>;
  if (result.state === "checking")
    return <span className="endpoint-latency is-checking">Checking…</span>;
  if (result.state !== "available" || result.latency == null)
    return (
      <span className="endpoint-latency is-error">
        {result.state === "wrong-chain" ? "Wrong chain" : "Unavailable"}
      </span>
    );
  const score = scoreRpc(result, best);
  const blockLag =
    best?.height != null && result.height != null ? Math.max(0, best.height - result.height) : 0;
  const detail = `Latest block ${result.height?.toLocaleString()}${blockLag ? ` · ${blockLag} blocks behind` : ""}`;
  return (
    <span className={`endpoint-latency is-${score}`} title={detail}>
      {result.latency} ms
    </span>
  );
}

export function NetworkDetailsTabs({
  chain,
  className = "",
  panelId,
}: {
  chain: Chain;
  className?: string;
  panelId?: string;
}) {
  const [tab, setTab] = useState<Tab>("rpcs");
  const [autoCheckLatency, setAutoCheckLatency] = useState(true);
  const [sortRpcs, setSortRpcs] = useState(true);
  const [latencyResults, setLatencyResults] = useState<Record<string, ProbeResult>>({});
  const generatedId = useId();
  const id = panelId ?? generatedId;
  const info: Array<[string, string, string]> = [
    ["Chain ID", String(chain.chainId), "Chain ID"],
    ["Hex chain ID", `0x${chain.chainId.toString(16)}`, "Hex chain ID"],
    ["Native currency", chain.nativeCurrency.symbol, "Currency"],
    ["Decimals", String(chain.nativeCurrency.decimals), "Decimals"],
    ["Status", chain.status, "Status"],
  ];

  useEffect(() => {
    if (!autoCheckLatency) {
      const timer = window.setTimeout(() => setLatencyResults({}), 0);
      return () => window.clearTimeout(timer);
    }

    const controller = new AbortController();
    const runChecks = () => {
      setLatencyResults((current) =>
        Object.keys(current).length
          ? current
          : Object.fromEntries(chain.rpc.map((rpc) => [rpc.url, { state: "checking" as const }])),
      );
      void Promise.all(
        chain.rpc.map(
          async (rpc) => [rpc.url, await probeRpc(rpc, chain.chainId, controller.signal)] as const,
        ),
      ).then((results) => {
        if (!controller.signal.aborted) setLatencyResults(Object.fromEntries(results));
      });
    };
    const timer = window.setTimeout(runChecks, 0);
    const interval = window.setInterval(runChecks, REFRESH_INTERVAL);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
      controller.abort();
    };
  }, [autoCheckLatency, chain.chainId, chain.rpc]);

  const availableResults = Object.values(latencyResults)
    .filter(
      (result) => result.state === "available" && result.height != null && result.latency != null,
    )
    .sort((a, b) => (b.height ?? 0) - (a.height ?? 0) || (a.latency ?? 0) - (b.latency ?? 0));
  const bestResult = availableResults[0];
  const displayedRpcs = useMemo(() => {
    if (!sortRpcs) return chain.rpc;
    return chain.rpc
      .map((rpc, index) => ({ rpc, index }))
      .sort((a, b) => compareRpcResults(a.rpc, b.rpc, latencyResults) || a.index - b.index)
      .map(({ rpc }) => rpc);
  }, [chain.rpc, latencyResults, sortRpcs]);

  return (
    <div
      className={`network-detail-tabs ${className}`}
      id={panelId}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="expanded-network-layout">
        <aside className="chain-information-panel" aria-label={`${chain.name} chain information`}>
          <h3>Chain information</h3>
          <dl>
            {info.map(([label, value, copyLabel]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  <CopyableValue
                    value={value}
                    label={copyLabel}
                    showCopyIcon
                    copyIconPosition="left"
                  >
                    {value}
                  </CopyableValue>
                </dd>
              </div>
            ))}
          </dl>
          {/* {(chain.website || chain.docs) && <div className="network-resource-links">{chain.website && <a href={chain.website} target="_blank" rel="noreferrer">Website ↗</a>}{chain.docs && <a href={chain.docs} target="_blank" rel="noreferrer">Docs ↗</a>}</div>} */}
        </aside>
        <section className="expanded-network-primary">
          <div
            className="network-tab-list"
            role="tablist"
            aria-label={`${chain.name} network details`}
          >
            <button
              id={`${id}-rpcs-tab`}
              role="tab"
              aria-selected={tab === "rpcs"}
              aria-controls={`${id}-rpcs-panel`}
              className={tab === "rpcs" ? "active" : ""}
              onClick={() => setTab("rpcs")}
            >
              RPCs
            </button>
            <button
              id={`${id}-explorers-tab`}
              role="tab"
              aria-selected={tab === "explorers"}
              aria-controls={`${id}-explorers-panel`}
              className={tab === "explorers" ? "active" : ""}
              onClick={() => setTab("explorers")}
            >
              Explorers
            </button>
          </div>

          {tab === "rpcs" && (
            <div id={`${id}-rpcs-panel`} role="tabpanel" aria-labelledby={`${id}-rpcs-tab`}>
              <div className="endpoint-check-controls">
                <div className="endpoint-toggle-group">
                  <label className="latency-auto-toggle">
                    <input
                      type="checkbox"
                      checked={sortRpcs}
                      onChange={(event) => setSortRpcs(event.target.checked)}
                    />
                    <span aria-hidden="true" />
                    <strong>Sort RPCs</strong>
                  </label>
                  <label className="latency-auto-toggle">
                    <input
                      type="checkbox"
                      checked={autoCheckLatency}
                      onChange={(event) => setAutoCheckLatency(event.target.checked)}
                    />
                    <span aria-hidden="true" />
                    <strong>Auto-check latency</strong>
                  </label>
                </div>
              </div>
              <div className="endpoint-detail-list">
                <div className="endpoint-detail-head">
                  <span>Endpoint</span>
                  <span>Latency</span>
                  <span>Add</span>
                </div>
                {displayedRpcs.map((rpc) => (
                  <div className="endpoint-detail-row" key={rpc.url}>
                    <CopyableValue
                      value={rpc.url}
                      label="RPC"
                      variant="table"
                      code
                      truncate
                      showCopyIcon
                    />
                    <LatencyValue result={latencyResults[rpc.url]} best={bestResult} />
                    <AddWalletButton
                      chain={chain}
                      rpcUrl={rpc.url}
                      compact
                      iconOnly
                      label={`Add ${chain.name} using this RPC`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "explorers" && (
            <div
              id={`${id}-explorers-panel`}
              role="tabpanel"
              aria-labelledby={`${id}-explorers-tab`}
              className="minimal-value-list explorer-value-list"
            >
              {chain.explorers.length ? (
                chain.explorers.map((explorer) => (
                  <div className="minimal-explorer-item" key={explorer.url}>
                    <strong>{explorer.name}</strong>
                    <div>
                      <a
                        className="explorer-link"
                        href={explorer.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${explorer.name}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <code>{explorer.url}</code>
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M5 11 11 5M6 5h5v5" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="tab-empty">No explorer is listed for this network.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
