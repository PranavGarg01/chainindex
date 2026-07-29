"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Chain } from "@/lib/types";
import { compareByPopularity } from "@/lib/chain-order";
import { rankChains } from "@/lib/rpc";
import { CompactChainCard, CompactChainRow } from "./compact-chain-row";
import { FeaturedNetworkCard } from "./featured-network-card";

type Filter = "all" | "mainnet" | "testnet";
type Sort = "popular" | "alphabetical" | "chainId";

const featuredSlugs = ["ethereum", "bnb-smart-chain", "polygon", "avalanche-c-chain"];
const NETWORK_BATCH_SIZE = 40;

export function ChainDirectory({
  chains,
  totalCount = chains.length,
  initialFilter = "all",
  title,
  homepage = false,
}: {
  chains: Chain[];
  totalCount?: number;
  initialFilter?: Filter;
  title?: string;
  homepage?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [sort, setSort] = useState<Sort>("popular");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [allChains, setAllChains] = useState<Chain[] | null>(null);
  const [loadedChains, setLoadedChains] = useState(chains);
  const [visibleCount, setVisibleCount] = useState(NETWORK_BATCH_SIZE);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [isMobileLayout, setIsMobileLayout] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const allChainsPromiseRef = useRef<Promise<Chain[]> | null>(null);
  const sourceChains = allChains ?? loadedChains;

  const loadAllChains = useCallback(async () => {
    if (allChains) return allChains;
    if (!allChainsPromiseRef.current) {
      allChainsPromiseRef.current = import("@/data/chains.index.json").then(
        (module) => module.default as unknown as Chain[],
      );
    }
    setLoadingAll(true);
    try {
      const records = await allChainsPromiseRef.current;
      setAllChains(records);
      return records;
    } finally {
      setLoadingAll(false);
    }
  }, [allChains]);

  useEffect(() => {
    const focus = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focus);
    return () => window.removeEventListener("keydown", focus);
  }, []);

  useEffect(() => {
    const clearSearch = () => {
      setQuery("");
      setExpandedSlug(null);
      setVisibleCount(NETWORK_BATCH_SIZE);
    };
    window.addEventListener("chainindex:clear-search", clearSearch);
    return () => window.removeEventListener("chainindex:clear-search", clearSearch);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const updateLayout = () => setIsMobileLayout(media.matches);
    updateLayout();
    media.addEventListener("change", updateLayout);
    return () => media.removeEventListener("change", updateLayout);
  }, []);

  const visible = useMemo(() => {
    const filtered = rankChains(sourceChains, query).filter((chain) => {
      if (filter === "mainnet" || filter === "testnet") return chain.networkType === filter;
      return true;
    });
    return filtered.sort((a, b) => {
      if (sort === "alphabetical") return a.name.localeCompare(b.name) || a.chainId - b.chainId;
      if (sort === "chainId") return a.chainId - b.chainId;
      return compareByPopularity(a, b);
    });
  }, [sourceChains, filter, query, sort]);
  const displayed = visible.slice(0, visibleCount);
  const resultCount = allChains ? visible.length : totalCount;
  const canLoadMore = allChains ? displayed.length < visible.length : totalCount > displayed.length;

  const featured = featuredSlugs
    .map((slug) => sourceChains.find((chain) => chain.slug === slug))
    .filter((chain): chain is Chain => Boolean(chain));
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "mainnet", label: "Mainnets" },
    { id: "testnet", label: "Testnets" },
  ];

  const toggleRow = (slug: string) => {
    setExpandedSlug((current) => (current === slug ? null : slug));
  };
  const resetVisibleCount = () => setVisibleCount(NETWORK_BATCH_SIZE);
  const selectFilter = (nextFilter: Filter) => {
    setFilter(nextFilter);
    resetVisibleCount();
    if (!allChains && nextFilter !== initialFilter) void loadAllChains();
  };
  const selectSort = (nextSort: Sort) => {
    setSort(nextSort);
    resetVisibleCount();
    if (!allChains && nextSort !== "popular") void loadAllChains();
  };
  const loadMore = async () => {
    if (allChains) {
      setVisibleCount((current) => current + NETWORK_BATCH_SIZE);
      return;
    }

    setLoadingAll(true);
    setLoadError("");
    try {
      const batchNumber = Math.floor(loadedChains.length / NETWORK_BATCH_SIZE);
      const directory = initialFilter === "testnet" ? "testnets" : "chains";
      const response = await fetch(`/data/directory/${directory}/${batchNumber}`);
      if (!response.ok) throw new Error(`Directory batch failed: ${response.status}`);
      const nextChains = (await response.json()) as Chain[];
      setLoadedChains((current) => [...current, ...nextChains]);
      setVisibleCount((current) => current + NETWORK_BATCH_SIZE);
    } catch {
      setLoadError("Could not load more networks. Please try again.");
    } finally {
      setLoadingAll(false);
    }
  };

  return (
    <section className={`directory-section ${homepage ? "homepage-directory" : ""}`}>
      {title && (
        <div className="section-heading directory-heading">
          <div>
            <span className="eyebrow">Directory</span>
            <h1>{title}</h1>
          </div>
          <p>{resultCount} networks</p>
        </div>
      )}

      <div className="directory-search-row">
        <div className="search-field">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5" />
            <path d="m12.3 12.3 4 4" />
          </svg>
          <label className="sr-only" htmlFor="directory-chain-search">
            Search chains
          </label>
          <input
            id="directory-chain-search"
            ref={inputRef}
            data-main-search
            value={query}
            onFocus={() => {
              if (!allChains && totalCount > chains.length) void loadAllChains();
            }}
            onChange={(event) => {
              setQuery(event.target.value);
              resetVisibleCount();
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setQuery("");
                resetVisibleCount();
                event.currentTarget.blur();
              }
            }}
            placeholder="Search chains, IDs, symbols, or aliases…"
          />
          {query && (
            <button
              className="search-clear"
              type="button"
              onClick={() => {
                setQuery("");
                resetVisibleCount();
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              title="Clear search"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          )}
          <kbd>/</kbd>
        </div>
        {homepage && <p>Tip: click any RPC URL, chain ID, or explorer URL to copy it.</p>}
      </div>

      {homepage && !query && (
        <section className="featured-section" aria-labelledby="featured-networks-title">
          <div className="directory-subheading">
            <h2 id="featured-networks-title">Featured networks</h2>
          </div>
          <div className="featured-network-grid">
            {featured.map((chain) => (
              <FeaturedNetworkCard chain={chain} key={chain.slug} />
            ))}
          </div>
        </section>
      )}
      <div className="directory-toolbar">
        <div className="filter-tabs" role="group" aria-label="Network filters">
          {filters.map((item) => (
            <button
              className={filter === item.id ? "active" : ""}
              aria-pressed={filter === item.id}
              onClick={() => selectFilter(item.id)}
              key={item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="directory-toolbar-meta">
          <span>
            {resultCount} {resultCount === 1 ? "chain" : "chains"}
          </span>
          <label className="sort-field">
            <span>Sort by:</span>
            <select value={sort} onChange={(event) => selectSort(event.target.value as Sort)}>
              <option value="popular">Popular</option>
              <option value="alphabetical">A–Z</option>
              <option value="chainId">Chain ID</option>
            </select>
          </label>
        </div>
      </div>

      {visible.length ? (
        <>
          {isMobileLayout !== true && (
            <div className="chain-table-wrap">
              <table className="chain-table">
                <thead>
                  <tr>
                    <th>Network</th>
                    <th>Chain ID</th>
                    <th>Currency</th>
                    <th>Explorer URL</th>
                    <th>RPC endpoint</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((chain) => (
                    <Fragment key={chain.slug}>
                      <CompactChainRow
                        chain={chain}
                        expanded={expandedSlug === chain.slug}
                        onToggle={() => toggleRow(chain.slug)}
                      />
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {isMobileLayout !== false && (
            <div className="compact-mobile-list">
              {displayed.map((chain) => (
                <CompactChainCard
                  chain={chain}
                  expanded={expandedSlug === chain.slug}
                  onToggle={() => toggleRow(chain.slug)}
                  key={chain.slug}
                />
              ))}
            </div>
          )}
          {canLoadMore && (
            <div className="directory-load-more">
              <span>
                Showing {displayed.length} of {resultCount} networks
                {" · "}
                <Link href="/chains/all" prefetch={false}>
                  Browse all chain pages
                </Link>
              </span>
              <button
                className="button secondary"
                type="button"
                onClick={() => void loadMore()}
                disabled={loadingAll}
              >
                {loadingAll ? "Loading networks…" : "Load more networks"}
              </button>
              {loadError && (
                <span className="directory-load-error" role="status">
                  {loadError}
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <strong>No matching networks</strong>
          <p>Try a different name, chain ID, endpoint, or filter.</p>
        </div>
      )}
    </section>
  );
}
