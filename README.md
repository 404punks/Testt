# FonsFamily

**Every Token Has a Brain.**

FonsFamily is an AI + Solana platform where models may think and propose while deterministic policy and an isolated signer retain control of every financial action.

## Current delivery

Phase 1 establishes the architecture, PostgreSQL schema, API contracts, threat model, design system, responsive application shell, homepage, Explore experience, demo-data isolation, and production-empty behavior. Pump launch, trading, wallet signing, and financial actions are deliberately not implemented until their current official interfaces are validated in later phases.

## Local development

Requirements: Node.js 22+, npm, and (for future data services) PostgreSQL 16 and Redis 7.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. `DEMO_MODE=true` enables clearly labeled local fixtures. Set both demo variables to `false` to verify production-empty behavior.

Checks:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Database

Create an empty PostgreSQL database, then apply the baseline:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/schema.sql
```

Production migrations will be immutable, numbered files; `schema.sql` is the Phase 1 baseline only.

## Environment

Copy `.env.example` and provide only server-side credentials. Never place private keys, seed phrases, or signer credentials in frontend variables. The web/Brain processes do not receive treasury private keys.

## Devnet / protocol validation

Before enabling launch or trade construction:

1. Pin and audit the current official Pump SDK and public program documentation.
2. Confirm deployed program IDs and instruction/account schemas from official sources.
3. Build canonical transactions against devnet when supported, otherwise use the official supported test path.
4. Parse and independently verify instructions, simulate with a dedicated RPC, and test mutation rejection.
5. Add launch-verifier and adversarial fixtures from real test transactions.

No existing Phase 1 code claims Pump compatibility.

## Mainnet deployment gate

Do not enable mainnet until devnet/test simulations pass, indexer reconciliation is stable, workload/network isolation is enforced, signer keys are HSM/KMS backed, all limits and circuit breakers are configured, adversarial tests pass, dependency and infrastructure reviews are complete, and operational monitoring/runbooks exist.

## Security checklist

- Models never receive keys or direct signer access.
- Financial capabilities use closed schemas with no arbitrary recipient.
- Policy reserves funds atomically and enforces action/hour/day limits.
- Signer independently rebuilds, simulates, checks programs/authorities and bounds deltas.
- Rewards derive recipients from fresh holder snapshots.
- External text is normalized, screened, independently classified, and fails closed.
- Signed bytes are persisted before broadcast; retries never create a new action.
- Only finalized on-chain effects settle the double-entry ledger.
- Admins can pause or tighten policy but cannot bypass it.

## Documents

- [Architecture](docs/ARCHITECTURE.md)
- [API contracts](docs/API.md)
- [Threat model](docs/THREAT_MODEL.md)
- [Database baseline](database/schema.sql)

## Remaining limitations

The current release is the requested Phase 1 foundation, not a production launchpad. Wallet authentication, indexed token/market pages, official Pump transaction construction and verification, blockchain listeners, Brain runtime/provider adapters, firewall classifiers, policy/signer services, trading, rewards, realtime delivery, admin operations, and production deployment are subsequent phases.
