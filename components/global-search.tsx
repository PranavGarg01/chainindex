"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Chain } from "@/lib/types";
import { getRecommendedRpc, rankChains } from "@/lib/rpc";
import { QuickCopyNetworkRow } from "./quick-copy-network-row";

function SearchResults({
  chains,
  query,
  limit = 8,
  selectedIndex = -1,
}: {
  chains: Chain[];
  query: string;
  limit?: number;
  selectedIndex?: number;
}) {
  const results = rankChains(chains, query).slice(0, limit);
  return (
    <div className="global-search-results">
      {results.length ? (
        results.map((chain, index) => (
          <div className={selectedIndex === index ? "selected-search-result" : ""} key={chain.slug}>
            <QuickCopyNetworkRow chain={chain} searchResult />
          </div>
        ))
      ) : (
        <p className="search-empty">No network matches “{query}”.</p>
      )}
    </div>
  );
}

export function CommandPalette({ chains }: { chains: Chain[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "/" && !typing) {
        event.preventDefault();
        const mainSearch = document.querySelector<HTMLInputElement>("[data-main-search]");
        if (mainSearch) mainSearch.focus();
        else setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);
  const results = rankChains(chains, query).slice(0, 8);
  const onSearchKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => Math.min(index + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter" && results[selectedIndex]) {
      event.preventDefault();
      if (event.metaKey || event.ctrlKey)
        await navigator.clipboard.writeText(getRecommendedRpc(results[selectedIndex]).url);
      else window.location.assign(`/chains/${results[selectedIndex].slug}`);
    }
  };
  return (
    <>
      <button className="command-trigger" onClick={() => setOpen(true)}>
        <span>Search networks</span>
        <kbd>⌘ K</kbd>
      </button>
      {open && (
        <div
          className="command-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
        >
          <section
            className="command-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Search networks"
          >
            <div className="command-input">
              <span>⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={onSearchKeyDown}
                placeholder="Search name, chain ID, or symbol…"
              />
              <kbd>Esc</kbd>
            </div>
            <SearchResults chains={chains} query={query} selectedIndex={selectedIndex} />
            <p className="command-help">↑↓ select · Enter details · Cmd/Ctrl+Enter copy RPC</p>
          </section>
        </div>
      )}
    </>
  );
}

export function InlineGlobalSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [chains, setChains] = useState<Chain[] | null>(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadChains = useCallback(async () => {
    if (chains || loading) return;
    setLoading(true);
    try {
      const records = (await import("@/data/chains.index.json")).default as unknown as Chain[];
      setChains(records);
    } finally {
      setLoading(false);
    }
  }, [chains, loading]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    const clearSearch = () => {
      setQuery("");
      setFocused(false);
    };
    window.addEventListener("chainindex:clear-search", clearSearch);
    return () => window.removeEventListener("chainindex:clear-search", clearSearch);
  }, []);

  const clearSearch = () => {
    setQuery("");
    setFocused(false);
    inputRef.current?.focus();
  };

  return (
    <div className="inline-global-search" ref={searchRef}>
      <div className="inline-search-field">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5" />
          <path d="m12.3 12.3 4 4" />
        </svg>
        <label className="sr-only" htmlFor="global-chain-search">
          Search networks
        </label>
        <input
          id="global-chain-search"
          ref={inputRef}
          data-main-search
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            setFocused(true);
            void loadChains();
          }}
          placeholder="Search chains, IDs, symbols, or aliases…"
        />
        {query && (
          <button
            className="search-clear"
            type="button"
            onClick={clearSearch}
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
      {focused && query && (
        <div className="inline-results" onClick={() => setFocused(false)}>
          {chains ? (
            <SearchResults chains={chains} query={query} limit={6} />
          ) : (
            <p className="search-empty">{loading ? "Loading chains…" : "Search is unavailable."}</p>
          )}
        </div>
      )}
    </div>
  );
}
