import { fetch } from "expo/fetch";

import type { MonitorEvent } from "@/types/events";
import type { MonitorSignal } from "@/types/signals";

const BASE =
  process.env.EXPO_PUBLIC_API_BASE ?? "https://monitor-the-situation.com/api";
const EVENTS_API = `${BASE}/events`;
const SIGNALS_API = `${BASE}/signals`;

export async function fetchEvents(): Promise<MonitorEvent[]> {
  const response = await fetch(EVENTS_API, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid events response");
  }
  return data as MonitorEvent[];
}

export async function fetchSignalsFromAPI(): Promise<MonitorSignal[]> {
  const response = await fetch(SIGNALS_API, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return data as MonitorSignal[];
}

function eventsToSignals(events: MonitorEvent[]): MonitorSignal[] {
  return events.map((e) => ({
    id: e.id,
    event_id: e.id,
    content: e.summary,
    source: e.title,
    source_type: e.source_types,
    created_at: e.updated_at,
  }));
}

export async function fetchSignals(): Promise<MonitorSignal[]> {
  const fromApi = await fetchSignalsFromAPI();
  if (fromApi.length > 0) return fromApi;
  const events = await fetchEvents();
  return eventsToSignals(events);
}
