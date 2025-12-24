import type { User } from '@/config/api.config';
import type { Organization } from '@/pages/organizations/types';
import type { Event } from '@/pages/events/types';

/**
 * Filter organizations based on user's organization_ids
 */
export function filterOrganizationsByUser(
  organizations: Organization[],
  user: User | null | undefined
): Organization[] {
  if (!user || !user.organization_ids || user.organization_ids.length === 0) {
    return [];
  }

  return organizations.filter((org) =>
    user.organization_ids.includes(org.id)
  );
}

/**
 * Filter events based on user's event_ids and organization_ids
 * Users can see events if:
 * 1. The event is in their event_ids, OR
 * 2. The event belongs to an organization in their organization_ids
 */
export function filterEventsByUser(
  events: Event[],
  user: User | null | undefined
): Event[] {
  if (!user) {
    return [];
  }

  const userEventIds = user.event_ids || [];
  const userOrgIds = user.organization_ids || [];

  // If user has no events and no organizations, return empty
  if (userEventIds.length === 0 && userOrgIds.length === 0) {
    return [];
  }

  return events.filter(
    (event) =>
      userEventIds.includes(event.id) ||
      userOrgIds.includes(event.organization_id)
  );
}

/**
 * Get organization IDs that the user has access to
 */
export function getUserOrganizationIds(user: User | null | undefined): string[] {
  return user?.organization_ids || [];
}

/**
 * Get event IDs that the user has access to
 */
export function getUserEventIds(user: User | null | undefined): string[] {
  return user?.event_ids || [];
}

/**
 * Check if user has access to a specific organization
 */
export function hasOrganizationAccess(
  user: User | null | undefined,
  organizationId: string
): boolean {
  return user?.organization_ids?.includes(organizationId) || false;
}

/**
 * Check if user has access to a specific event
 */
export function hasEventAccess(
  user: User | null | undefined,
  eventId: string,
  organizationId?: string
): boolean {
  if (!user) return false;

  // Check if user has direct access to the event
  if (user.event_ids?.includes(eventId)) return true;

  // Check if user has access through organization
  if (organizationId && user.organization_ids?.includes(organizationId)) {
    return true;
  }

  return false;
}
