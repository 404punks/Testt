import type { BrainStatus } from "@/lib/demo-data";

export function StatusPill({ status }: { status: BrainStatus }) {
  return (
    <span className={`status-pill status-${status.toLowerCase()}`}>
      <i />
      {status}
    </span>
  );
}
