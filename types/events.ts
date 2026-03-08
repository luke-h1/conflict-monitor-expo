export interface MonitorEvent {
  id: string;
  title: string;
  summary: string;
  category: string;
  subtype: string;
  severity: number;
  lat: number;
  lng: number;
  location_name: string;
  country: string;
  region: string;
  signal_count: number;
  confidence: number;
  is_active: boolean;
  source_types: string;
  created_at: string;
  updated_at: string;
}

export const EVENT_CATEGORIES = [
  'conflict',
  'political',
  'economic',
  'humanitarian',
  'other',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
