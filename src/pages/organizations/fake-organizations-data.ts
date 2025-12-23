import type { Organization } from './types';

export const fakeOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Medical Conference Association',
    role: 'admin',
    eventsCount: 12,
    registrationsCount: 2456,
    created_at: new Date('2023-01-15').toISOString(),
  },
  {
    id: 'org-2',
    name: 'Healthcare Events Ltd',
    role: 'member',
    eventsCount: 8,
    registrationsCount: 1234,
    created_at: new Date('2023-03-20').toISOString(),
  },
  {
    id: 'org-3',
    name: 'Tech Summit Group',
    role: 'admin',
    eventsCount: 5,
    registrationsCount: 890,
    created_at: new Date('2023-06-10').toISOString(),
  },
  {
    id: 'org-4',
    name: 'Global Education Forum',
    role: 'member',
    eventsCount: 3,
    registrationsCount: 450,
    created_at: new Date('2023-08-05').toISOString(),
  },
  {
    id: 'org-5',
    name: 'Innovation Workshop Series',
    role: 'member',
    eventsCount: 15,
    registrationsCount: 3200,
    created_at: new Date('2023-02-28').toISOString(),
  },
  {
    id: 'org-6',
    name: 'Design Leadership Council',
    role: 'admin',
    eventsCount: 6,
    registrationsCount: 670,
    created_at: new Date('2023-11-12').toISOString(),
  },
];
