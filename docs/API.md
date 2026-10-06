# API contracts

All APIs are versioned under `/api/v1`, return JSON, use wallet-signature challenges for user authentication, and include `requestId`. Monetary quantities are decimal strings or integer base units—never floating point.

## Public reads

| Method | Path | Result |
| --- | --- | --- |
| GET | `/tokens` | Cursor-paginated verified tokens |
| GET | `/tokens/:mint` | Public identity and activation state |
| GET | `/tokens/:mint/market` | Indexed market projection with slot/time |
| GET | `/tokens/:mint/holders` | Aggregate holder projection |
| GET | `/tokens/:mint/brain` | Public Brain state and model identity |
| GET | `/tokens/:mint/activity` | Immutable public event feed |
| GET | `/tokens/:mint/treasury` | Confirmed ledger projection |
| GET | `/tokens/:mint/rewards` | Published programs and rounds |
| GET | `/brain-models` | Currently healthy, selectable models |

Every indexed response includes `asOfSlot`, `asOf`, and `stale`. Production returns unavailable/stale states instead of fixtures.

## Commands

| Method | Path | Input | Output |
| --- | --- | --- | --- |
| POST | `/launch/prepare` | Identity, selected model ID, economics, creator wallet | Canonical unsigned transaction and immutable launch digest |
| POST | `/launch/verify` | Launch ID and transaction signature | `LAUNCHING`; verification stays asynchronous |
| POST | `/brain/:mint/propose` | Internal event ID | Accepted job ID; service authentication required |
| POST | `/rewards/:mint/create` | Typed reward policy, no recipients | Pending program ID |

`/launch/prepare` never accepts a private key. `/launch/verify` never trusts a client-supplied mint or success flag.

## Realtime

`GET /api/v1/events?channels=brain:{mint},market:{mint}` uses SSE initially. Envelopes are:

```json
{
  "id": "evt_...",
  "channel": "brain:<mint>",
  "type": "brain_decision",
  "occurredAt": "2026-01-01T00:00:00Z",
  "asOfSlot": 123,
  "data": {}
}
```

Allowed event types are versioned. Financial events expose an explorer link only after a real signature is confirmed.

## Errors and safety

Errors use `{ "code", "message", "requestId", "details?" }`. Schemas reject unknown fields. Commands require idempotency keys. Rate limits apply per IP, wallet, token, and command. Internal routes use workload identity and are not internet reachable.
