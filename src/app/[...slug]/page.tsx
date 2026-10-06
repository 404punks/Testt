import { ArrowLeft, Construction, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const pages: Record<string, { eyebrow: string; title: string; copy: string; phase: string }> = {
  launch: {
    eyebrow: "Launch system",
    title: "Launch with confidence.",
    copy: "Wallet signing remains disabled until the current Pump SDK instructions, verification rules, and simulation path are validated. This guard prevents a preview interface from creating fake or unsafe transactions.",
    phase: "Scheduled for Phase 3",
  },
  "how-it-works": {
    eyebrow: "Architecture",
    title: "Think freely. Act deterministically.",
    copy: "A Brain observes verified state, reasons within a bounded context, and proposes typed actions. Policy, transaction, and signer services independently validate every financial effect before Solana settles it.",
    phase: "Detailed guide in progress",
  },
  docs: {
    eyebrow: "Documentation",
    title: "Built around verifiable truth.",
    copy: "The architecture, API contracts, database model, and threat model are maintained with the codebase. Product documentation will expand as each production service is implemented and verified.",
    phase: "Phase 1 foundation available",
  },
  dashboard: { eyebrow: "Creator console", title: "Command center.", copy: "Token health, Brain budgets, programs and treasury state will appear here after authenticated wallet ownership is implemented.", phase: "Scheduled for Phase 2" },
  rewards: { eyebrow: "Holder rewards", title: "Transparent by design.", copy: "Reward recipients will be computed from fresh on-chain snapshots. Models never supply recipient addresses, and rewards are never guaranteed.", phase: "Scheduled for Phase 7" },
  programs: { eyebrow: "Programs", title: "Community, with rules.", copy: "Quests, contests, reward rounds and recurring strategies will run with published budgets and deterministic eligibility.", phase: "Scheduled for Phase 7" },
  profile: { eyebrow: "Wallet profile", title: "Your FonsFamily.", copy: "Phantom connection and challenge-based wallet authentication will be introduced with the token data layer.", phase: "Scheduled for Phase 2" },
};

export default async function PlaceholderPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug.join("/");
  const config = pages[key] ?? (slug[0] === "coin" || slug[0] === "brain" ? {
    eyebrow: slug[0] === "coin" ? "Token terminal" : "Brain console",
    title: "Awaiting verified state.",
    copy: "This route is reserved for a real indexed token. Production pages will never display fabricated market, treasury, holder, or Brain data.",
    phase: "Scheduled for Phase 2",
  } : null);

  if (!config) notFound();

  return (
    <main className="placeholder-page">
      <div className="placeholder-grid" />
      <section>
        <span className="eyebrow"><Construction size={13} /> {config.eyebrow}</span>
        <h1>{config.title}</h1>
        <p>{config.copy}</p>
        <div className="placeholder-note"><ShieldCheck size={17} /><span><small>IMPLEMENTATION STATUS</small>{config.phase}</span></div>
        <Link className="text-link" href="/"><ArrowLeft size={15} /> Return home</Link>
      </section>
    </main>
  );
}
