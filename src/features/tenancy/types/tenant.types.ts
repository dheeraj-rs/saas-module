/**
 * Tenant Type Definitions
 * 
 * Core types for multi-tenancy support
 */

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
  settings?: TenantSettings;
}

export interface TenantSettings {
  branding?: {
    logo?: string;
    primaryColor?: string;
    name?: string;
  };
  features?: {
    maxEvents?: number;
    maxUsers?: number;
    customDomain?: boolean;
  };
}

export interface TenantContextValue {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  isLoading: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  refreshTenant: () => Promise<void>;
}
