/**
 * Permission Check Utilities
 * 
 * Helper functions for checking permissions
 */

import { matchesPermission } from './definitions';
import type { RoleName } from './roles';
import { getRolePermissions } from './roles';

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  return userPermissions.some(userPerm =>
    matchesPermission(userPerm, requiredPermission)
  );
}

/**
 * Check if user has ALL of the required permissions
 */
export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every(required =>
    hasPermission(userPermissions, required)
  );
}

/**
 * Check if user has ANY of the required permissions
 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some(required =>
    hasPermission(userPermissions, required)
  );
}

/**
 * Check if role has a specific permission
 */
export function roleHasPermission(
  roleName: RoleName,
  requiredPermission: string
): boolean {
  const rolePermissions = getRolePermissions(roleName);
  return hasPermission(rolePermissions, requiredPermission);
}

/**
 * Get user's effective permissions from their roles
 */
export function getUserPermissions(roles: RoleName[]): string[] {
  const permissions = new Set<string>();

  roles.forEach(roleName => {
    const rolePermissions = getRolePermissions(roleName);
    rolePermissions.forEach(p => permissions.add(p));
  });

  return Array.from(permissions);
}
