"use client";

import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { TokenSummary } from "@/lib/demo-data";
import { TokenTable } from "./token-table";

const filters = ["Trending", "New", "Highest volume", "Highest fees", "Most active Brain", "Awake", "Sleeping", "Halted"];

export function ExplorePage({ tokens, demoMode }: { tokens: TokenSummary[]; demoMode: boolean }) {
  const [filter, setFilter] = useState("Trending");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    let result = tokens.filter((token) => `${token.name} ${token.symbol} ${token.mint}`.toLowerCase().includes(query.toLowerCase()));
    if (["Awake", "Sleeping", "Halted"].includes(filter)) result = result.filter((token) => token.brainStatus === filter.toUpperCase());
    if (filter === "Highest volume") result = [...result].sort((a, b) => b.activity - a.activity);
    if (filter === "Most active Brain") result = [...result].sort((a, b) => b.activity - a.activity);
    return result;
  }, [filter, query, tokens]);

  return (
    <main className="explore-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow"><Sparkles size={13} /> Token intelligence network</span>
          <h1>Explore living tokens.</h1>
          <p>Discover verified tokens powered by transparent, bounded AI minds.</p>
        </div>
        <div className="network-pulse"><i /><span><strong>{demoMode ? "94" : "0"}</strong> minds online</span></div>
      </section>
      {demoMode && <div className="demo-banner"><span>DEMO ENVIRONMENT</span> Results below are sample records and are not on-chain assets.</div>}
      <section className="explore-content">
        <div className="explore-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filter tokens">
            {filters.map((item) => <button className={item === filter ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}
          </div>
          <label className="search-box">
            <Search size={16} />
            <span className="sr-only">Search tokens</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, symbol or mint" />
            <SlidersHorizontal size={15} />
          </label>
        </div>
        <div className="result-meta"><span>{visible.length} TOKENS</span><span>INDEXED DATA · CONFIRMED STATE</span></div>
        <TokenTable tokens={visible} />
      </section>
    </main>
  );
}
