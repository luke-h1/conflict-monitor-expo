import type { MonitorEvent } from "@/types/events";
import type { MonitorSignal } from "@/types/signals";

export function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

function matchText(text: string | undefined, query: string): boolean {
  if (!text) return false;
  return text.toLowerCase().includes(query);
}

export function filterEvents(events: MonitorEvent[], query: string): MonitorEvent[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return events;
  return events.filter(
    (e) =>
      matchText(e.title, normalized) ||
      matchText(e.summary, normalized) ||
      matchText(e.location_name, normalized) ||
      matchText(e.country, normalized) ||
      matchText(e.region, normalized) ||
      matchText(e.category, normalized) ||
      matchText(e.subtype, normalized) ||
      matchText(e.source_types, normalized)
  );
}

export function filterSignals(
  signals: MonitorSignal[],
  query: string
): MonitorSignal[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return signals;
  return signals.filter(
    (s) =>
      matchText(s.content, normalized) ||
      matchText(s.source, normalized) ||
      matchText(s.source_type, normalized)
  );
}
