export type BrainStatus = "AWAKE" | "THINKING" | "SLEEPING" | "HALTED";

export interface TokenSummary {
  mint: string;
  name: string;
  symbol: string;
  mark: string;
  status: "ACTIVE" | "LAUNCHING";
  brainStatus: BrainStatus;
  model: string;
  marketCap: string;
  volume: string;
  holders: string;
  fees: string;
  age: string;
  change: number;
  activity: number;
}

export const demoTokens: TokenSummary[] = [
  {
    mint: "Fons7uHjY5Kp9V2Demo11111111111111111111",
    name: "Fons Protocol",
    symbol: "FONS",
    mark: "F",
    status: "ACTIVE",
    brainStatus: "THINKING",
    model: "Claude Sonnet",
    marketCap: "$842.4K",
    volume: "$126.8K",
    holders: "1,284",
    fees: "24.6 SOL",
    age: "14h",
    change: 18.4,
    activity: 91,
  },
  {
    mint: "Nexa2QpkR8Lm4T6Demo22222222222222222222",
    name: "Nexa",
    symbol: "NEXA",
    mark: "N",
    status: "ACTIVE",
    brainStatus: "AWAKE",
    model: "GPT",
    marketCap: "$418.9K",
    volume: "$82.1K",
    holders: "796",
    fees: "11.2 SOL",
    age: "7h",
    change: 7.2,
    activity: 78,
  },
  {
    mint: "Drift9QpkR8Lm4T6Demo3333333333333333333",
    name: "Driftmind",
    symbol: "DRIFT",
    mark: "D",
    status: "ACTIVE",
    brainStatus: "SLEEPING",
    model: "Gemini",
    marketCap: "$196.2K",
    volume: "$31.4K",
    holders: "412",
    fees: "4.8 SOL",
    age: "2d",
    change: -3.1,
    activity: 42,
  },
  {
    mint: "Mira4QpkR8Lm4T6Demo44444444444444444444",
    name: "Mira",
    symbol: "MIRA",
    mark: "M",
    status: "LAUNCHING",
    brainStatus: "SLEEPING",
    model: "Grok",
    marketCap: "—",
    volume: "—",
    holders: "—",
    fees: "—",
    age: "3m",
    change: 0,
    activity: 0,
  },
];

export const demoEvents = [
  { time: "12:31:29", symbol: "FONS", type: "SETTLED", text: "Treasury action confirmed on-chain." },
  { time: "12:31:21", symbol: "NEXA", type: "DECISION", text: "Maintaining reserves after impact analysis." },
  { time: "12:31:16", symbol: "FONS", type: "RESEARCH", text: "Studying the latest holder-retention signal." },
  { time: "12:31:09", symbol: "DRIFT", type: "OBSERVED", text: "Holder concentration decreased by 2.1%." },
  { time: "12:31:04", symbol: "NEXA", type: "POLICY", text: "Reward proposal passed deterministic checks." },
];

export const demoStats = [
  { label: "Total tokens", value: "128", delta: "+12 this week" },
  { label: "Active minds", value: "94", delta: "73.4% awake" },
  { label: "Total volume", value: "$4.82M", delta: "indexed 4s ago" },
  { label: "Fees generated", value: "412 SOL", delta: "confirmed only" },
  { label: "Rewards distributed", value: "86.4 SOL", delta: "42 rounds" },
  { label: "Active programs", value: "31", delta: "across 18 tokens" },
];
