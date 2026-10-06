import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { TokenSummary } from "@/lib/demo-data";
import { StatusPill } from "./status-pill";

export function TokenTable({ tokens, compact = false }: { tokens: TokenSummary[]; compact?: boolean }) {
  if (!tokens.length) {
    return (
      <div className="empty-state">
        <span>NO INDEXED TOKENS</span>
        <h3>The network is quiet.</h3>
        <p>Verified launches will appear here after finalization.</p>
        <Link className="button button-primary" href="/launch">Launch the first token</Link>
      </div>
    );
  }

  return (
    <div className="token-table-wrap">
      <table className="token-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Brain</th>
            <th>Market cap</th>
            <th>24h volume</th>
            {!compact && <th>Holders</th>}
            {!compact && <th>Fees</th>}
            <th>Age</th>
            <th><span className="sr-only">View</span></th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.mint}>
              <td>
                <Link className="token-identity" href={`/coin/${token.mint}`}>
                  <span className="token-avatar">{token.mark}<i /></span>
                  <span><strong>{token.name}</strong><small>${token.symbol}</small></span>
                </Link>
              </td>
              <td>
                <StatusPill status={token.brainStatus} />
                <small className="model-label">{token.model}</small>
              </td>
              <td><strong>{token.marketCap}</strong><small className={token.change >= 0 ? "positive" : "negative"}>{token.change ? `${token.change > 0 ? "+" : ""}${token.change}%` : "Pending"}</small></td>
              <td>{token.volume}</td>
              {!compact && <td>{token.holders}</td>}
              {!compact && <td>{token.fees}</td>}
              <td>{token.age}</td>
              <td><Link className="row-link" href={`/coin/${token.mint}`} aria-label={`View ${token.name}`}><ArrowUpRight size={17} /></Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
