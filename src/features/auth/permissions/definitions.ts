/**
 * Permission Definitions
 * 
 * Centralized permission constants for the entire application
 * Following the pattern: resource.action
 */

export const PERMISSIONS = {
  // Events Management
  EVENTS: {
    VIEW: 'events.view',
    VIEW_ALL: 'events.view_all',
    CREATE: 'events.create',
    EDIT: 'events.edit',
    DELETE: 'events.delete',
    PUBLISH: 'events.publish',
    MANAGE_REGISTRATIONS: 'events.manage_registrations',
  },

  // Organizations Management
  ORGANIZATIONS: {
    VIEW: 'organizations.view',
    VIEW_ALL: 'organizations.view_all',
    CREATE: 'organizations.create',
    EDIT: 'organizations.edit',
    DELETE: 'organizations.delete',
    MANAGE_MEMBERS: 'organizations.manage_members',
    MANAGE_SETTINGS: 'organizations.manage_settings',
  },

  // Registrations
  REGISTRATIONS: {
    VIEW: 'registrations.view',
    VIEW_ALL: 'registrations.view_all',
    CREATE: 'registrations.create',
    EDIT: 'registrations.edit',
    DELETE: 'registrations.delete',
    EXPORT: 'registrations.export',
  },

  // Settings
  SETTINGS: {
    VIEW: 'settings.view',
    EDIT: 'settings.edit',
    MANAGE_BILLING: 'settings.manage_billing',
    MANAGE_INTEGRATIONS: 'settings.manage_integrations',
  },

  // Users & Team
  USERS: {
    VIEW: 'users.view',
    INVITE: 'users.invite',
    EDIT: 'users.edit',
    DELETE: 'users.delete',
    MANAGE_ROLES: 'users.manage_roles',
  },

  // Dashboard & Analytics
  DASHBOARD: {
    VIEW: 'dashboard.view',
    VIEW_ANALYTICS: 'dashboard.view_analytics',
    EXPORT_DATA: 'dashboard.export_data',
  },
} as const;

/**
 * Wildcard permission for super admins
 */
export const WILDCARD_PERMISSION = '*';

/**
 * Helper to check if permission matches pattern
 * Supports wildcards like 'events.*'
 */
export function matchesPermission(
  userPermission: string,
  requiredPermission: string
): boolean {
  // Wildcard grants all permissions
  if (userPermission === WILDCARD_PERMISSION) return true;

  // Exact match
  if (userPermission === requiredPermission) return true;

  // Wildcard pattern matching (e.g., 'events.*' matches 'events.view')
  if (userPermission.endsWith('.*')) {
    const prefix = userPermission.slice(0, -2);
    return requiredPermission.startsWith(prefix + '.');
  }

  return false;
}

/**
 * Get all permission values as an array
 */
export function getAllPermissions(): string[] {
  const permissions: string[] = [];
  
  Object.values(PERMISSIONS).forEach(category => {
    Object.values(category).forEach(permission => {
      permissions.push(permission);
    });
  });

  return permissions;
}
