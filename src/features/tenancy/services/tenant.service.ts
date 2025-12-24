/**
 * Tenant Service
 * 
 * Handles tenant data fetching and management
 * Works with fake API for now, ready for real API integration
 */

import type { Tenant } from '../types/tenant.types';
import { fakeOrganizations } from '@/pages/organizations/fake-organizations-data';

/**
 * Get tenant by ID
 * Maps organization data to tenant structure
 */
export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const org = fakeOrganizations.find((o: any) => o.id === tenantId);
  if (!org) return null;

  return {
    id: org.id,
    name: org.name,
    slug: org.name.toLowerCase().replace(/\s+/g, '-'),
    status: 'active',
    createdAt: org.created_at,
    settings: {
      branding: {
        name: org.name,
      },
    },
  };
}

/**
 * Get all tenants for a user
 * Based on organization IDs from user profile
 */
export async function getUserTenants(organizationIds: string[]): Promise<Tenant[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const tenants: Tenant[] = [];

  for (const orgId of organizationIds) {
    const org = fakeOrganizations.find((o: any) => o.id === orgId);
    if (org) {
      tenants.push({
        id: org.id,
        name: org.name,
        slug: org.name.toLowerCase().replace(/\s+/g, '-'),
        status: 'active',
        createdAt: org.created_at,
        settings: {
          branding: {
            name: org.name,
          },
        },
      });
    }
  }

  return tenants;
}

/**
 * Filter data by tenant
 * Generic utility for tenant-aware data filtering
 */
export function filterByTenant<T extends { organization_id?: string }>(
  data: T[],
  tenantId: string | null
): T[] {
  if (!tenantId) return [];
  return data.filter(item => item.organization_id === tenantId);
}
