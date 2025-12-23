export type OrganizationRole = 'admin' | 'member';

export type ViewMode = 'grid' | 'table';

export interface Organization {
  id: string;
  name: string;
  role: OrganizationRole;
  eventsCount: number;
  registrationsCount: number;
  created_at: string;
}
