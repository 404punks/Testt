import { Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { demoEvents } from "@/lib/demo-data";

export function BrainFeed({ enabled }: { enabled: boolean }) {
  const events = enabled ? demoEvents : [];

  return (
    <div className="feed-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow"><Activity size={13} /> Network intelligence</span>
          <h3>Live Brain feed</h3>
        </div>
        <span className="live-indicator"><i /> Live</span>
      </div>
      {events.length ? (
        <div className="event-list">
          {events.map((event, index) => (
            <div className="event-row" key={`${event.time}-${event.symbol}`}>
              <span className="event-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="event-time">{event.time}</span>
              <span className="event-symbol">${event.symbol}</span>
              <span className="event-copy"><small>{event.type}</small>{event.text}</span>
              <ArrowUpRight size={15} />
            </div>
          ))}
        </div>
      ) : (
        <div className="feed-empty">
          <p>No confirmed Brain events yet.</p>
          <span>Events appear only when produced by the backend.</span>
        </div>
      )}
      <Link className="panel-link" href="/explore">Open network activity <ArrowUpRight size={15} /></Link>
    </div>
  );
}
