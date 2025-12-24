/**
 * Tenant Hooks
 * 
 * Convenient hooks for accessing tenant information
 */

import { useTenantContext } from '../contexts/TenantContext';

/**
 * Get current tenant information
 */
export function useTenant() {
  return useTenantContext();
}

/**
 * Get current tenant ID (convenience hook)
 */
export function useTenantId() {
  const { currentTenant } = useTenantContext();
  return currentTenant?.id ?? null;
}

/**
 * Check if user has access to multiple tenants
 */
export function useIsMultiTenant() {
  const { tenants } = useTenantContext();
  return tenants.length > 1;
}
