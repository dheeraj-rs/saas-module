import type { Event, Organization } from './types';

// Fake organizations (matching UUIDs from fake auth API)
export const fakeOrganizations: Organization[] = [
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c101', name: 'Medical Conference Association' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c102', name: 'Healthcare Events Ltd' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c103', name: 'Tech Summit Group' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c104', name: 'Global Education Forum' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c105', name: 'Innovation Workshop Series' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c106', name: 'Design Leadership Council' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c107', name: 'Business Excellence Network' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c108', name: 'Finance Professionals Group' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c109', name: 'Arts & Culture Foundation' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c110', name: 'Sports & Recreation Alliance' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c111', name: 'Community Development Hub' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c112', name: 'Environmental Action Group' },
  { id: '018f012c-6b3c-7455-a9e8-9a12e7c8c113', name: 'Research & Development Institute' },
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
    'Tech Innovation Showcase',
    'AI & Machine Learning Summit',
    'Cybersecurity Conference',
    'Cloud Computing Workshop',
    'DevOps Excellence Forum',
    'Education Technology Summit',
    'Teaching Excellence Workshop',
    'Student Leadership Conference',
    'Academic Research Symposium',
    'Business Strategy Summit',
    'Leadership Excellence Forum',
    'Entrepreneurship Workshop',
    'Corporate Innovation Conference',
    'Financial Planning Summit',
    'Investment Strategies Forum',
    'Risk Management Workshop',
    'Fintech Innovation Conference',
    'Art Exhibition Gala',
    'Cultural Heritage Festival',
    'Music & Performance Summit',
    'Creative Arts Workshop',
    'Sports Management Conference',
    'Athletic Excellence Summit',
    'Fitness & Wellness Expo',
    'Youth Sports Development Workshop',
    'Community Building Summit',
    'Social Impact Conference',
    'Volunteer Leadership Workshop',
    'Neighborhood Development Forum',
    'Environmental Sustainability Summit',
    'Climate Action Conference',
    'Green Technology Workshop',
    'Conservation Leadership Forum',
    'Research Innovation Summit',
    'Scientific Discovery Conference',
    'R&D Excellence Workshop',
    'Innovation Lab Showcase',
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

  // Event 3: For Emily Rodriguez (specific event access)
  events.push({
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c201',
    name: 'Sports Management Conference 2024',
    organization_id: '018f012c-6b3c-7455-a9e8-9a12e7c8c110',
    organization_name: 'Sports & Recreation Alliance',
    start_date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    capacity: 250,
    registered: 180,
    fill_percentage: 72,
    description: 'Comprehensive conference on sports management and athletic excellence.',
    location: 'Chicago, IL',
    created_at: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Event 4: For Emily Rodriguez (specific event access)
  events.push({
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c202',
    name: 'Community Building Summit 2024',
    organization_id: '018f012c-6b3c-7455-a9e8-9a12e7c8c111',
    organization_name: 'Community Development Hub',
    start_date: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(now.getTime() + 26 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    capacity: 200,
    registered: 150,
    fill_percentage: 75,
    description: 'Summit focused on community development and social impact.',
    location: 'Boston, MA',
    created_at: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Event 5: For Emily Rodriguez (specific event access)
  events.push({
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c203',
    name: 'Athletic Excellence Summit 2024',
    organization_id: '018f012c-6b3c-7455-a9e8-9a12e7c8c110',
    organization_name: 'Sports & Recreation Alliance',
    start_date: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(now.getTime() + 37 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    capacity: 180,
    registered: 120,
    fill_percentage: 67,
    description: 'Summit celebrating athletic excellence and sports innovation.',
    location: 'Seattle, WA',
    created_at: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Event 6: For Lisa Thompson (specific event access)
  events.push({
    id: '018f012c-6b3c-7455-a9e8-9a12e7c8c204',
    name: 'Research Innovation Summit 2024',
    organization_id: '018f012c-6b3c-7455-a9e8-9a12e7c8c113',
    organization_name: 'Research & Development Institute',
    start_date: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(now.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    capacity: 350,
    registered: 280,
    fill_percentage: 80,
    description: 'Summit showcasing cutting-edge research and development innovations.',
    location: 'Austin, TX',
    created_at: new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Generate additional events for the organizations
  for (let i = 6; i < count; i++) {
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
        'Austin, TX',
        'Denver, CO',
        'Miami, FL',
        'Portland, OR',
        'Atlanta, GA',
      ][i % 10],
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
