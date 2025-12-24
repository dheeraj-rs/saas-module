import type { Event, Organization } from './types';

// Fake organizations (matching UUIDs from fake auth API)
export const fakeOrganizations: Organization[] = [
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c101', name: 'Medical Conference Association' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c102', name: 'Healthcare Events Ltd' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c103', name: 'Tech Summit Group' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c104', name: 'Global Education Forum' },
];

// Generate fake events
export const generateFakeEvents = (count: number = 50): Event[] => {
  const events: Event[] = [];
  const eventNames = [
    'Annual Medical Conference',
    'Healthcare Innovation Summit',
    'Spring Medical Conference',
    'Summer Medical Symposium',
    'Fall Healthcare Workshop',
    'Winter Health Forum',
    'Digital Health Summit',
    'Clinical Research Symposium',
    'Medical Technology Expo',
    'Healthcare Leadership Conference',
    'Patient Care Excellence Summit',
    'Medical Education Workshop',
    'Health Policy Forum',
    'Telemedicine Conference',
    'Nursing Excellence Summit',
  ];

  const statuses: Array<Event['status']> = [
    'active',
    'upcoming',
    'past',
    'cancelled',
  ];

  // First, create the specific events for Sarah Johnson (user with event access)
  const now = new Date();
  
  // Event 1: For Sarah Johnson
  events.push({
    id: '018f012c-6b3c-7403-a9e8-9a12e7c8c101',
    name: 'Annual Medical Conference 2024',
    organization_id: '018f012c-6b3c-7455-a9e8-9a12e7c8c101',
    organization_name: 'Medical Conference Association',
    start_date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(now.getTime() + 17 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    capacity: 500,
    registered: 342,
    fill_percentage: 68,
    description: 'Join us for an exciting annual medical conference featuring industry leaders and experts.',
    location: 'New York, NY',
    created_at: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Event 2: For Sarah Johnson
  events.push({
    id: '018f0452c-6b3c-7455-a9e8-9a12e7c8c101',
    name: 'Healthcare Innovation Summit 2024',
    organization_id: '018f012c-6b3c-7455-a9e8-9a12e7c8c102',
    organization_name: 'Healthcare Events Ltd',
    start_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    capacity: 300,
    registered: 245,
    fill_percentage: 82,
    description: 'Join us for an exciting healthcare innovation summit featuring industry leaders and experts.',
    location: 'San Francisco, CA',
    created_at: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Generate additional events for the organizations
  for (let i = 2; i < count; i++) {
    const org = fakeOrganizations[i % fakeOrganizations.length];
    const status = statuses[i % statuses.length];
    const capacity = Math.floor(Math.random() * 400) + 100;
    const registered = Math.floor(Math.random() * capacity);

    // Generate dates based on status
    let startDate: Date;
    let endDate: Date;

    switch (status) {
      case 'active':
        startDate = new Date(
          now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
        );
        endDate = new Date(
          startDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000
        );
        break;
      case 'upcoming':
        startDate = new Date(
          now.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000
        );
        endDate = new Date(
          startDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000
        );
        break;
      case 'past':
        endDate = new Date(
          now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000
        );
        startDate = new Date(
          endDate.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000
        );
        break;
      case 'cancelled':
        startDate = new Date(
          now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
        );
        endDate = new Date(
          startDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000
        );
        break;
    }

    events.push({
      id: `event-${i + 1}`,
      name: `${eventNames[i % eventNames.length]} ${
        2024 + Math.floor(i / eventNames.length)
      }`,
      organization_id: org.id,
      organization_name: org.name,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status,
      capacity,
      registered,
      fill_percentage: Math.round((registered / capacity) * 100),
      description: `Join us for an exciting ${eventNames[
        i % eventNames.length
      ].toLowerCase()} featuring industry leaders and experts.`,
      location: [
        'New York, NY',
        'San Francisco, CA',
        'Chicago, IL',
        'Boston, MA',
        'Seattle, WA',
      ][i % 5],
      created_at: new Date(
        now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updated_at: new Date(
        now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }

  return events;
};

export const fakeEvents = generateFakeEvents();
