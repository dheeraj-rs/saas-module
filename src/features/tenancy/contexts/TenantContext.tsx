/**
 * Tenant Context
 *
 * Provides tenant information throughout the application
 * Automatically detects tenant from organization route or user's first organization
 */

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import type { Tenant, TenantContextValue } from '../types/tenant.types';
import { useUser } from '@/contexts/UserContext';
import { getTenantById, getUserTenants } from '../services/tenant.service';

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const location = useLocation();
  const params = useParams();

  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load user's tenants (organizations they have access to)
   */
  const loadTenants = useCallback(async () => {
    if (!user) {
      setTenants([]);
      setCurrentTenant(null);
      setIsLoading(false);
      return;
    }

    try {
      const userTenants = await getUserTenants(user.organization_ids);
      setTenants(userTenants);

      // Auto-select tenant based on route or default to first
      const orgId = params.orgId;
      if (orgId) {
        const tenant = userTenants.find((t) => t.id === orgId);
        if (tenant) {
          setCurrentTenant(tenant);
        }
      } else if (userTenants.length > 0 && !currentTenant) {
        setCurrentTenant(userTenants[0]);
      }
    } catch (error) {
      console.error('Failed to load tenants:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, params.orgId, currentTenant]);

  /**
   * Switch to a different tenant
   */
  const switchTenant = useCallback(async (tenantId: string) => {
    setIsLoading(true);
    try {
      const tenant = await getTenantById(tenantId);
      if (tenant) {
        setCurrentTenant(tenant);
      }
    } catch (error) {
      console.error('Failed to switch tenant:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh current tenant data
   */
  const refreshTenant = useCallback(async () => {
    if (!currentTenant) return;

    setIsLoading(true);
    try {
      const tenant = await getTenantById(currentTenant.id);
      if (tenant) {
        setCurrentTenant(tenant);
      }
    } catch (error) {
      console.error('Failed to refresh tenant:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentTenant]);

  // Load tenants when user changes
  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  // Update current tenant when route changes
  useEffect(() => {
    const orgId = params.orgId;
    if (orgId && tenants.length > 0) {
      const tenant = tenants.find((t) => t.id === orgId);
      if (tenant && tenant.id !== currentTenant?.id) {
        setCurrentTenant(tenant);
      }
    }
  }, [params.orgId, tenants, currentTenant]);

  const value: TenantContextValue = {
    currentTenant,
    tenants,
    isLoading,
    switchTenant,
    refreshTenant,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenantContext() {
  const context = React.useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantContext must be used within TenantProvider');
  }
  return context;
}
