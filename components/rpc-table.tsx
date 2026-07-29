"use client";

import { useState } from "react";
import type { Chain, RpcEndpoint } from "@/lib/types";
import { CopyableValue } from "./copyable-value";

type Result = {
  state: "checking" | "available" | "unavailable" | "wrong-chain";
  latency?: number;
};

async function probe(rpc: RpcEndpoint, expectedChainId: number): Promise<Result> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6500);
  const started = performance.now();
  try {
    const response = await fetch(rpc.url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_chainId",
        params: [],
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Request failed");
    const body = await response.json();
    const chainId = Number.parseInt(body.result ?? "", 16);
    if (!Number.isFinite(chainId)) throw new Error("Invalid response");
    return {
      state: chainId === expectedChainId ? "available" : "wrong-chain",
      latency: Math.round(performance.now() - started),
    };
  } catch {
    return { state: "unavailable" };
  } finally {
    window.clearTimeout(timeout);
  }
}

export function RpcTable({ chain }: { chain: Chain }) {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [checking, setChecking] = useState(false);
  const checkOne = async (rpc: RpcEndpoint) => {
    setResults((current) => ({
      ...current,
      [rpc.url]: { state: "checking" },
    }));
    const result = await probe(rpc, chain.chainId);
    setResults((current) => ({ ...current, [rpc.url]: result }));
  };
  const checkAll = async () => {
    setChecking(true);
    setResults(Object.fromEntries(chain.rpc.map((rpc) => [rpc.url, { state: "checking" }])));
    const settled = await Promise.all(
      chain.rpc.map(async (rpc) => [rpc.url, await probe(rpc, chain.chainId)] as const),
    );
    setResults(Object.fromEntries(settled));
    setChecking(false);
  };
  return (
    <section className="rpc-section browser-only">
      <div className="rpc-heading">
        <p>Requests run locally from this browser.</p>
        <button className="button secondary" onClick={checkAll} disabled={checking}>
          {checking ? "Checking…" : "Check all"}
        </button>
      </div>
      <div className="rpc-check-list">
        {chain.rpc.map((rpc) => {
          const result = results[rpc.url];
          return (
            <div key={rpc.url}>
              <CopyableValue value={rpc.url} label="RPC" code showCopyIcon />
              {result ? (
                <span className={`status ${result.state}`}>
                  <i />
                  {result.state === "available"
                    ? `${result.latency} ms`
                    : result.state.replace("-", " ")}
                </span>
              ) : (
                <button className="check-link" onClick={() => checkOne(rpc)}>
                  Check
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="rpc-disclaimer">
        Browser checks may fail because of CORS and do not prove that an RPC is globally
        unavailable.
      </p>
    </section>
  );
}
