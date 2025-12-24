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
];
