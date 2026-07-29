export function LatencyValue({ latencyMs }: { latencyMs?: number }) {
  return latencyMs == null ? (
    <span className="latency-value is-unchecked" title="Not checked in this browser">
      —
    </span>
  ) : (
    <span className="latency-value">{latencyMs} ms</span>
  );
}
