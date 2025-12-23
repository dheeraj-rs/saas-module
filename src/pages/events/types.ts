export type EventStatus = 'active' | 'upcoming' | 'past' | 'cancelled';

export type ViewMode = 'grid' | 'table';

export interface Event {
  id: string;
  name: string;
  organization_id: string;
  organization_name: string;
  start_date: string;
  end_date: string;
  status: EventStatus;
  capacity: number;
  registered: number;
  fill_percentage: number;
  description?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface EventFilters {
  status?: EventStatus[];
  organization?: string[];
  search?: string;
}

export interface Organization {
  id: string;
  name: string;
}
