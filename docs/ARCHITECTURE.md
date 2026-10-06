# FonsFamily architecture

## Principle

FonsFamily makes a Brain feel autonomous without trusting it. A model can observe, reason, and emit a typed proposal. Deterministic services decide what is allowed, an isolated signer validates the exact transaction, and confirmed Solana state is the source of truth.

## Lifecycle

`Launch → Verify → Earn → Wake → Think → Propose → Authorize → Sign → Settle`

1. **Launch** — the wallet signs a transaction assembled from a validated, current Pump SDK interface.
2. **Verify** — an independent worker parses the confirmed transaction and checks programs, accounts, creator, mint, and fee routing.
3. **Earn** — indexers attribute confirmed fees to the token-specific ledger.
4. **Wake** — bounded event triggers schedule a Brain run if credits and liveness rules permit it.
5. **Think** — the runtime receives structured state and screened, explicitly untrusted external text.
6. **Propose** — the model can only return a strict capability schema; unknown fields fail validation.
7. **Authorize** — policy checks balance reservations, action/hour/day caps, cooldowns, slippage, price impact, and idempotency.
8. **Sign** — a network-isolated signer reconstructs and simulates the transaction, validates authorities and allowlisted programs, and signs only if simulated deltas match the intent.
9. **Settle** — the indexer records finalized chain effects with double-entry ledger postings. Quotes never update balances.

## Deployable boundaries

```text
apps/web                 Next.js public application and read-only BFF
services/launch          launch preparation and on-chain verification
services/indexer         Solana listeners, trades, holders, fees
services/brain           scheduler, context, provider adapters, memory
services/policy          deterministic proposal authorization
services/transactions    canonical instruction construction
services/signer          isolated HSM/KMS-backed signing boundary
services/rewards         snapshots, eligibility, payout rounds
services/firewall        normalization and independent classifiers
services/realtime        authenticated SSE/WebSocket fan-out
packages/contracts       schemas, event envelopes, capability registry
packages/database        migrations, views, repository layer
```

This repository starts as a modular Next.js Phase 1 application. Later services must preserve these process and credential boundaries rather than becoming route handlers inside the web process.

## Data paths

- Solana RPC/WS → indexer → PostgreSQL outbox → queue → market/holder/fee projections.
- Brain trigger → scheduler → context builder → firewall-screened inputs → provider → typed proposal.
- Proposal → policy reservation → transaction builder → signer validation/simulation → Solana.
- Finalized transaction → settlement → ledger/results/memory → realtime event.

All event consumers use stable event IDs and inbox tables. All externally visible financial states derive from finalized records.

## Production gates

Mainnet remains disabled until the current official Pump SDK and protocol documentation have been reviewed, devnet or the closest supported test path has passed simulation tests, signer controls have been independently reviewed, and adversarial suites pass.
