/**
 * Permission Hooks
 * 
 * React hooks for checking permissions in components
 */

import { useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import type { RoleName } from '../permissions/roles';
import { getUserPermissions } from '../permissions/checks';
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
} from '../permissions/checks';

/**
 * Get user's effective permissions
 */
export function usePermissions(): string[] {
  const { user } = useUser();

  return useMemo(() => {
    if (!user) return [];

    // Get permissions from user's role
    const roles: RoleName[] = user.role ? [user.role as RoleName] : [];
    return getUserPermissions(roles);
  }, [user]);
}

/**
 * Check if user has a specific permission
 */
export function usePermission(requiredPermission: string): boolean {
  const permissions = usePermissions();

  return useMemo(
    () => hasPermission(permissions, requiredPermission),
    [permissions, requiredPermission]
  );
}

/**
 * Check if user has ALL required permissions
 */
export function useAllPermissions(requiredPermissions: string[]): boolean {
  const permissions = usePermissions();

  return useMemo(
    () => hasAllPermissions(permissions, requiredPermissions),
    [permissions, requiredPermissions]
  );
}

/**
 * Check if user has ANY of the required permissions
 */
export function useAnyPermission(requiredPermissions: string[]): boolean {
  const permissions = usePermissions();

  return useMemo(
    () => hasAnyPermission(permissions, requiredPermissions),
    [permissions, requiredPermissions]
  );
}

/**
 * Get user's role
 */
export function useRole(): RoleName | null {
  const { user } = useUser();
  return (user?.role as RoleName) ?? null;
}

/**
 * Check if user has a specific role
 */
export function useHasRole(roleName: RoleName): boolean {
  const userRole = useRole();
  return userRole === roleName;
}
