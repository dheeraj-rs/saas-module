/**
 * Refine Access Control Provider
 * 
 * Integrates RBAC system with Refine's access control
 */

import type { AccessControlProvider } from '@refinedev/core';
import { getUserPermissions, hasPermission } from '../permissions/checks';
import type { RoleName } from '../permissions/roles';

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    // Get user from params (passed by Refine)
    const user = params?.user;
    
    if (!user) {
      return { can: false };
    }

    // Get user's permissions from their role
    const roles: RoleName[] = user.role ? [user.role as RoleName] : [];
    const userPermissions = getUserPermissions(roles);

    // Map Refine actions to our permission format
    const permissionMap: Record<string, string> = {
      list: 'view',
      show: 'view',
      create: 'create',
      edit: 'edit',
      delete: 'delete',
      clone: 'create',
    };

    const permissionAction = permissionMap[action] || action;
    const requiredPermission = `${resource}.${permissionAction}`;

    // Check if user has the required permission
    const can = hasPermission(userPermissions, requiredPermission);

    return {
      can,
      reason: can ? undefined : 'You do not have permission to perform this action',
    };
  },

  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  },
};
