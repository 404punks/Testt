-- FonsFamily PostgreSQL baseline. Apply with psql in an empty database.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE token_status AS ENUM ('LAUNCHING', 'ACTIVE', 'REJECTED', 'PAUSED');
CREATE TYPE brain_status AS ENUM ('AWAKE', 'THINKING', 'SLEEPING', 'HALTED');
CREATE TYPE action_status AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'SIGNING', 'SUBMITTED', 'CONFIRMED', 'FAILED', 'EXPIRED');
CREATE TYPE transaction_status AS ENUM ('BUILT', 'SIMULATED', 'SIGNED', 'SUBMITTED', 'CONFIRMED', 'FAILED', 'EXPIRED');
CREATE TYPE ledger_side AS ENUM ('DEBIT', 'CREDIT');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address text NOT NULL UNIQUE CHECK (length(address) BETWEEN 32 AND 44),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE brain_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  model_key text NOT NULL,
  display_name text NOT NULL,
  supports_tools boolean NOT NULL DEFAULT false,
  enabled boolean NOT NULL DEFAULT false,
  health_checked_at timestamptz,
  UNIQUE (provider, model_key)
);

CREATE TABLE tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mint_address text UNIQUE,
  creator_wallet_id uuid NOT NULL REFERENCES wallets(id),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 64),
  symbol text NOT NULL CHECK (length(symbol) BETWEEN 1 AND 12),
  status token_status NOT NULL DEFAULT 'LAUNCHING',
  created_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  CHECK ((status = 'LAUNCHING' AND activated_at IS NULL) OR status <> 'LAUNCHING')
);
CREATE INDEX tokens_status_created_idx ON tokens(status, created_at DESC);

CREATE TABLE token_metadata (
  token_id uuid PRIMARY KEY REFERENCES tokens(id) ON DELETE CASCADE,
  description text NOT NULL,
  image_url text,
  website_url text,
  x_url text,
  telegram_url text,
  discord_url text,
  personality text NOT NULL,
  screened_at timestamptz
);

CREATE TABLE token_launches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid NOT NULL UNIQUE REFERENCES tokens(id) ON DELETE RESTRICT,
  immutable_digest text NOT NULL UNIQUE,
  expected_creator text NOT NULL,
  prepared_transaction bytea NOT NULL,
  signature text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz
);

CREATE TABLE token_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  launch_id uuid NOT NULL REFERENCES token_launches(id) ON DELETE CASCADE,
  status token_status NOT NULL,
  reason_code text,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  verified_slot bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX token_verifications_launch_created_idx ON token_verifications(launch_id, created_at DESC);

CREATE TABLE brains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid NOT NULL UNIQUE REFERENCES tokens(id) ON DELETE RESTRICT,
  model_id uuid NOT NULL REFERENCES brain_models(id),
  status brain_status NOT NULL DEFAULT 'SLEEPING',
  personality text NOT NULL,
  objective text,
  strategy text,
  credits_microusd bigint NOT NULL DEFAULT 0 CHECK (credits_microusd >= 0),
  next_wake_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE brain_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brain_id uuid NOT NULL REFERENCES brains(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  source_event_id text NOT NULL,
  payload jsonb NOT NULL,
  occurred_at timestamptz NOT NULL,
  processed_at timestamptz,
  UNIQUE (brain_id, source_event_id)
);
CREATE INDEX brain_events_unprocessed_idx ON brain_events(occurred_at) WHERE processed_at IS NULL;

CREATE TABLE brain_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brain_id uuid NOT NULL REFERENCES brains(id) ON DELETE CASCADE,
  kind text NOT NULL,
  summary text NOT NULL,
  importance smallint NOT NULL CHECK (importance BETWEEN 0 AND 100),
  embedding_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX brain_memories_recall_idx ON brain_memories(brain_id, importance DESC, created_at DESC);

CREATE TABLE brain_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brain_id uuid NOT NULL REFERENCES brains(id) ON DELETE CASCADE,
  event_id uuid REFERENCES brain_events(id),
  observation jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE brain_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brain_id uuid NOT NULL REFERENCES brains(id) ON DELETE CASCADE,
  event_id uuid REFERENCES brain_events(id),
  rationale_public text NOT NULL,
  model_usage jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE treasuries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid NOT NULL UNIQUE REFERENCES tokens(id) ON DELETE RESTRICT,
  authority_address text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE brain_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id uuid NOT NULL REFERENCES brain_decisions(id) ON DELETE RESTRICT,
  treasury_id uuid REFERENCES treasuries(id),
  capability text NOT NULL,
  intent jsonb NOT NULL,
  intent_digest text NOT NULL UNIQUE,
  status action_status NOT NULL DEFAULT 'PROPOSED',
  rejection_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX brain_actions_status_created_idx ON brain_actions(status, created_at);

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id uuid UNIQUE REFERENCES brain_actions(id) ON DELETE RESTRICT,
  signature text UNIQUE,
  message_digest text NOT NULL UNIQUE,
  status transaction_status NOT NULL,
  submitted_at timestamptz,
  confirmed_at timestamptz,
  confirmed_slot bigint,
  error_code text
);

CREATE TABLE brain_action_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id uuid NOT NULL UNIQUE REFERENCES brain_actions(id) ON DELETE RESTRICT,
  transaction_id uuid UNIQUE REFERENCES transactions(id),
  result jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE treasury_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  treasury_id uuid NOT NULL REFERENCES treasuries(id) ON DELETE RESTRICT,
  asset_mint text NOT NULL,
  purpose text NOT NULL,
  UNIQUE (treasury_id, asset_mint, purpose)
);

CREATE TABLE treasury_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE RESTRICT,
  account_id uuid NOT NULL REFERENCES treasury_accounts(id) ON DELETE RESTRICT,
  side ledger_side NOT NULL,
  amount_base_units numeric(40,0) NOT NULL CHECK (amount_base_units > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (transaction_id, account_id, side)
);
CREATE INDEX treasury_ledger_account_idx ON treasury_ledger(account_id, created_at DESC);

CREATE TABLE holder_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid NOT NULL REFERENCES tokens(id) ON DELETE RESTRICT,
  slot bigint NOT NULL,
  holders_hash text NOT NULL,
  holder_count integer NOT NULL CHECK (holder_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (token_id, slot)
);

CREATE TABLE holders (
  snapshot_id uuid NOT NULL REFERENCES holder_snapshots(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  amount_base_units numeric(40,0) NOT NULL CHECK (amount_base_units > 0),
  PRIMARY KEY (snapshot_id, wallet_address)
);

CREATE TABLE reward_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid NOT NULL REFERENCES tokens(id) ON DELETE RESTRICT,
  program_type text NOT NULL,
  rules jsonb NOT NULL,
  budget_base_units numeric(40,0) NOT NULL CHECK (budget_base_units > 0),
  asset_mint text NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reward_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES reward_programs(id) ON DELETE RESTRICT,
  snapshot_id uuid NOT NULL REFERENCES holder_snapshots(id) ON DELETE RESTRICT,
  transaction_id uuid UNIQUE REFERENCES transactions(id),
  total_base_units numeric(40,0) NOT NULL CHECK (total_base_units >= 0),
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reward_recipients (
  round_id uuid NOT NULL REFERENCES reward_rounds(id) ON DELETE RESTRICT,
  wallet_address text NOT NULL,
  amount_base_units numeric(40,0) NOT NULL CHECK (amount_base_units > 0),
  verified_at timestamptz,
  PRIMARY KEY (round_id, wallet_address)
);

CREATE TABLE firewall_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL,
  source_ref text NOT NULL,
  decision text NOT NULL CHECK (decision IN ('ALLOW', 'WITHHOLD')),
  reason_codes text[] NOT NULL DEFAULT '{}',
  content_digest text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid REFERENCES tokens(id),
  severity text NOT NULL,
  event_type text NOT NULL,
  details jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX security_events_open_idx ON security_events(severity, created_at DESC);

CREATE TABLE system_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  aggregate_id uuid,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE INDEX system_events_outbox_idx ON system_events(created_at) WHERE published_at IS NULL;
