# Security threat model

## Trust boundaries

Untrusted: browsers, wallets, model output, external text, market APIs, RPC responses before finality, queue payloads, and administrators requesting actions.

Trusted only for narrow duties: policy service, canonical transaction builder, PostgreSQL ledger, and isolated signer. No single component—including admin tooling—can both invent an intent and move funds.

## Primary threats and controls

| Threat | Required control |
| --- | --- |
| Compromised model requests arbitrary transfer | Closed action schemas contain no recipient; unknown fields rejected |
| Prompt injection / encoded instructions | Unicode normalization, invisible removal, decoding checks, wallet/key/seed detectors, two independent classifiers, fail closed |
| Worker compromise reaches keys | Separate network/identity; worker has no signer route or credential |
| Malicious transaction substitution | Intent digest binding; signer reconstructs or byte-compares canonical message |
| Unexpected program/CPI/authority | Per-action allowlist, static account validation, signer-owned simulation |
| Cross-token treasury spend | Token-scoped authority and atomic ledger reservation |
| Overspend / replay | Per-action/hour/day caps, nonce/idempotency key, unique intent digest, fixed signed bytes on retry |
| Quote presented as balance | Finalized-chain settlement only |
| Reward recipient injection | Fresh holder snapshot; reward engine computes recipients; signer rechecks holdings |
| RPC equivocation or outage | Multiple providers for critical reads, commitment thresholds, stale state, fail closed |
| Admin backdoor | Admins may pause/tighten controls, never bypass policy or signer |
| Secret leakage | KMS/HSM signer, secret manager, redacted structured logs, no keys in web/runtime |

## Signer invariants

The signer accepts a narrow typed intent plus a canonical transaction reference. It independently verifies identity, freshness, idempotency, reservation, allowed programs/accounts, treasury authority, simulated balance deltas, spend ceilings, slippage/price impact, and destination constraints. Any parse ambiguity, simulation warning, stale blockhash, or dependency failure rejects signing.

## Incident behavior

Circuit breakers pause a token after anomalous deltas, repeated failures, accounting mismatch, stale market data, RPC disagreement, or signer health loss. Pausing blocks new value-moving intents but preserves indexing and settlement. Recovery requires reconciling finalized chain state and an audited operator action; it cannot retroactively alter the public feed.

## Required adversarial suite

Tests must assume a fully compromised model and cover arbitrary recipients, unknown fields, key/seed requests, wrong programs/creator/fees, overspend, slippage, price impact, duplicate/replay, payout ineligibility, malformed instructions, failed confirmation, delayed indexers, RPC/signing failures, and hallucinated signatures.
