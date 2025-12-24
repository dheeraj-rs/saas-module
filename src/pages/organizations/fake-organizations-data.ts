import type { Organization } from './types';
import { fakeEvents } from '../events/fake-events-data';

// Calculate event counts and registration counts dynamically from actual events
const calculateOrgStats = () => {
  const stats: Record<string, { eventsCount: number; registrationsCount: number }> = {};
  
  fakeEvents.forEach(event => {
    if (!stats[event.organization_id]) {
      stats[event.organization_id] = { eventsCount: 0, registrationsCount: 0 };
    }
    stats[event.organization_id].eventsCount++;
    stats[event.organization_id].registrationsCount += event.registered;
  });
  
  return stats;
};

const orgStats = calculateOrgStats();

export const fakeOrganizations: Organization[] = [
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c101',
    name: 'Medical Conference Association',
    role: 'admin',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c101']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c101']?.registrationsCount || 0,
    created_at: new Date('2023-01-15').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c102',
    name: 'Healthcare Events Ltd',
    role: 'member',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c102']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c102']?.registrationsCount || 0,
    created_at: new Date('2023-03-20').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c103',
    name: 'Tech Summit Group',
    role: 'admin',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c103']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c103']?.registrationsCount || 0,
    created_at: new Date('2023-06-10').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c104',
    name: 'Global Education Forum',
    role: 'member',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c104']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c104']?.registrationsCount || 0,
    created_at: new Date('2023-08-05').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c105',
    name: 'Innovation Workshop Series',
    role: 'member',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c105']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c105']?.registrationsCount || 0,
    created_at: new Date('2023-02-28').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c106',
    name: 'Design Leadership Council',
    role: 'admin',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c106']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c106']?.registrationsCount || 0,
    created_at: new Date('2023-11-12').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c107',
    name: 'Business Excellence Network',
    role: 'admin',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c107']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c107']?.registrationsCount || 0,
    created_at: new Date('2023-04-18').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c108',
    name: 'Finance Professionals Group',
    role: 'member',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c108']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c108']?.registrationsCount || 0,
    created_at: new Date('2023-07-22').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c109',
    name: 'Arts & Culture Foundation',
    role: 'member',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c109']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c109']?.registrationsCount || 0,
    created_at: new Date('2023-05-30').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c110',
    name: 'Sports & Recreation Alliance',
    role: 'admin',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c110']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c110']?.registrationsCount || 0,
    created_at: new Date('2023-09-14').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c111',
    name: 'Community Development Hub',
    role: 'member',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c111']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c111']?.registrationsCount || 0,
    created_at: new Date('2023-10-08').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c112',
    name: 'Environmental Action Group',
    role: 'admin',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c112']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c112']?.registrationsCount || 0,
    created_at: new Date('2023-12-03').toISOString(),
  },
  {
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c113',
    name: 'Research & Development Institute',
    role: 'member',
    eventsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c113']?.eventsCount || 0,
    registrationsCount: orgStats['018f012c-6b3c-7455-a9e8-9a12e7c8c113']?.registrationsCount || 0,
    created_at: new Date('2024-01-20').toISOString(),
  },
];
