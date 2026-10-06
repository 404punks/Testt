import { ArrowDown, ArrowRight, BrainCircuit, Check, Coins, LockKeyhole, Radar, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { demoStats, demoTokens } from "@/lib/demo-data";
import { BrainFeed } from "./brain-feed";
import { BrainOrbit } from "./brain-orbit";
import { TokenTable } from "./token-table";

export function HomePage({ demoMode }: { demoMode: boolean }) {
  const stats = demoMode ? demoStats : [
    { label: "Total tokens", value: "—", delta: "Awaiting indexer" },
    { label: "Active minds", value: "—", delta: "Awaiting indexer" },
    { label: "Total volume", value: "—", delta: "Awaiting indexer" },
    { label: "Fees generated", value: "—", delta: "Confirmed only" },
    { label: "Rewards distributed", value: "—", delta: "Confirmed only" },
    { label: "Active programs", value: "—", delta: "Awaiting indexer" },
  ];

  return (
    <main>
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow"><Sparkles size={13} /> Autonomous token infrastructure</span>
          <h1><span>Every token</span><br />has a brain.</h1>
          <p>Launch an autonomous token with its own AI mind, treasury, strategy and community economy.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/launch">Launch token <ArrowRight size={16} /></Link>
            <Link className="button button-secondary" href="/explore">Explore tokens</Link>
          </div>
          <div className="hero-proof">
            <span><Check size={13} /> Non-custodial launch</span>
            <span><Check size={13} /> Deterministic policy</span>
            <span><Check size={13} /> On-chain settlement</span>
          </div>
        </div>
        <div className="hero-art"><BrainOrbit /></div>
        <a className="scroll-cue" href="#network"><ArrowDown size={14} /> Discover the network</a>
      </section>

      {demoMode && <div className="demo-banner"><span>DEMO ENVIRONMENT</span> All values and activity below are clearly isolated sample data—not blockchain state.</div>}

      <section className="stats-strip" id="network">
        {stats.map((stat) => <div className="stat" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.delta}</small></div>)}
      </section>

      <section className="section section-feed">
        <div className="section-intro">
          <span className="section-number">01 / INTELLIGENCE</span>
          <h2>A network that<br />thinks in public.</h2>
          <p>Every observation, decision and settled action is visible. Financial events are linked to confirmed chain state.</p>
        </div>
        <BrainFeed enabled={demoMode} />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <span className="section-number">02 / ECOSYSTEM</span>
            <h2>Living tokens.</h2>
          </div>
          <Link href="/explore" className="text-link">Explore all tokens <ArrowRight size={15} /></Link>
        </div>
        <TokenTable tokens={demoMode ? demoTokens.slice(0, 3) : []} compact />
      </section>

      <section className="section architecture-section">
        <div className="architecture-copy">
          <span className="section-number">03 / CONTROL</span>
          <h2>Autonomous by design.<br /><em>Bounded by code.</em></h2>
          <p>The Brain can think and propose. It can never hold a key, choose an arbitrary recipient, or bypass deterministic limits.</p>
          <Link className="text-link" href="/docs#security">Read the security architecture <ArrowRight size={15} /></Link>
        </div>
        <div className="security-flow">
          {[
            { icon: BrainCircuit, step: "01", title: "AI Brain", text: "Observes context and emits a typed proposal." },
            { icon: Radar, step: "02", title: "Policy engine", text: "Applies budgets, allowlists and impact limits." },
            { icon: LockKeyhole, step: "03", title: "Isolated signer", text: "Rebuilds, simulates and validates independently." },
            { icon: Coins, step: "04", title: "Solana", text: "Finalized chain state settles the ledger." },
          ].map(({ icon: Icon, step, title, text }) => (
            <div className="flow-card" key={step}>
              <span className="flow-step">{step}</span><Icon size={21} />
              <strong>{title}</strong><p>{text}</p>
            </div>
          ))}
          <div className="flow-line" />
        </div>
      </section>

      <section className="section principles">
        <article><ShieldCheck /><span>AI never signs</span><p>Models have no key material and no network path to the signer.</p></article>
        <article><LockKeyhole /><span>Fail closed</span><p>Ambiguous inputs, stale state, and failed checks stop execution.</p></article>
        <article><Coins /><span>Confirmed truth</span><p>Only finalized on-chain outcomes update treasury accounting.</p></article>
      </section>

      <section className="final-cta">
        <div><span className="eyebrow">The next token is alive</span><h2>Give your token<br />a mind of its own.</h2></div>
        <Link className="button button-light" href="/launch">Start building <ArrowRight size={16} /></Link>
      </section>
    </main>
  );
}
