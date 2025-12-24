import type { Event } from '@/pages/events/types';

/**
 * Filter events by organization ID
 */
export function filterEventsByOrganization(
  events: Event[],
  organizationId: string
): Event[] {
  return events.filter((event) => event.organization_id === organizationId);
}

/**
 * Calculate event statistics for an organization
 */
export function calculateEventStats(events: Event[]) {
  const total = events.length;
  const active = events.filter((e) => e.status === 'active').length;
  const upcoming = events.filter((e) => e.status === 'upcoming').length;
  const past = events.filter((e) => e.status === 'past').length;
  const cancelled = events.filter((e) => e.status === 'cancelled').length;
  
  const totalRegistrations = events.reduce(
    (sum, event) => sum + event.registered,
    0
  );
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const averageFillRate =
    total > 0
      ? Math.round(
          events.reduce((sum, event) => sum + event.fill_percentage, 0) / total
        )
      : 0;

  return {
    total,
    active,
    upcoming,
    past,
    cancelled,
    totalRegistrations,
    totalCapacity,
    averageFillRate,
  };
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const startFormatted = formatDate(start);
  const endFormatted = formatDate(end);

  if (startFormatted === endFormatted) return startFormatted;
  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Get relative time string (e.g., "in 5 days", "2 days ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Validate date range
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return endDate >= startDate;
}

/**
 * Sort events by a specific field
 */
export function sortEvents(
  events: Event[],
  field: keyof Event,
  direction: 'asc' | 'desc'
): Event[] {
  return [...events].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
}
