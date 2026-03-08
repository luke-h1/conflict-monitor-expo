export interface MonitorSignal {
  id: string;
  event_id?: string;
  content: string;
  source?: string;
  source_type?: string;
  created_at: string;
}
