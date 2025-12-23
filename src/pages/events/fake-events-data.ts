import type { Event, Organization } from './types';

// Fake organizations
export const fakeOrganizations: Organization[] = [
  { id: 'org-1', name: 'Medical Conference Association' },
  { id: 'org-2', name: 'Healthcare Events Ltd' },
  { id: 'org-3', name: 'Tech Summit Group' },
  { id: 'org-4', name: 'Global Education Forum' },
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

  for (let i = 0; i < count; i++) {
    const org = fakeOrganizations[i % fakeOrganizations.length];
    const status = statuses[i % statuses.length];
    const capacity = Math.floor(Math.random() * 400) + 100;
    const registered = Math.floor(Math.random() * capacity);

    // Generate dates based on status
    let startDate: Date;
    let endDate: Date;
    const now = new Date();

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
