/**
 * Role Definitions
 * 
 * Defines roles and their associated permissions
 * Supports hierarchical roles and scoped permissions
 */

import { PERMISSIONS, WILDCARD_PERMISSION } from './definitions';

export type RoleName =
  | 'super_admin'
  | 'org_admin'
  | 'org_manager'
  | 'event_manager'
  | 'event_staff'
  | 'viewer';

export interface Role {
  name: RoleName;
  displayName: string;
  description: string;
  permissions: string[];
  inherits?: RoleName[]; // Roles this role inherits from
}

/**
 * Role Definitions
 */
export const ROLES: Record<RoleName, Role> = {
  /**
   * Super Admin - Full system access
   */
  super_admin: {
    name: 'super_admin',
    displayName: 'Super Admin',
    description: 'Full access to all features and organizations',
    permissions: [WILDCARD_PERMISSION],
  },

  /**
   * Organization Admin - Full access within organization
   */
  org_admin: {
    name: 'org_admin',
    displayName: 'Organization Admin',
    description: 'Full access to organization and all its events',
    permissions: [
      // Organizations
      PERMISSIONS.ORGANIZATIONS.VIEW,
      PERMISSIONS.ORGANIZATIONS.EDIT,
      PERMISSIONS.ORGANIZATIONS.MANAGE_MEMBERS,
      PERMISSIONS.ORGANIZATIONS.MANAGE_SETTINGS,
      
      // Events - Full access
      'events.*',
      
      // Registrations - Full access
      'registrations.*',
      
      // Users
      PERMISSIONS.USERS.VIEW,
      PERMISSIONS.USERS.INVITE,
      PERMISSIONS.USERS.EDIT,
      PERMISSIONS.USERS.MANAGE_ROLES,
      
      // Dashboard
      'dashboard.*',
      
      // Settings
      'settings.*',
    ],
  },

  /**
   * Organization Manager - Manage events and registrations
   */
  org_manager: {
    name: 'org_manager',
    displayName: 'Organization Manager',
    description: 'Manage events and registrations within organization',
    permissions: [
      // Organizations - View only
      PERMISSIONS.ORGANIZATIONS.VIEW,
      
      // Events - Full management
      PERMISSIONS.EVENTS.VIEW,
      PERMISSIONS.EVENTS.VIEW_ALL,
      PERMISSIONS.EVENTS.CREATE,
      PERMISSIONS.EVENTS.EDIT,
      PERMISSIONS.EVENTS.PUBLISH,
      PERMISSIONS.EVENTS.MANAGE_REGISTRATIONS,
      
      // Registrations - Full access
      'registrations.*',
      
      // Users - View only
      PERMISSIONS.USERS.VIEW,
      
      // Dashboard
      PERMISSIONS.DASHBOARD.VIEW,
      PERMISSIONS.DASHBOARD.VIEW_ANALYTICS,
      
      // Settings - View only
      PERMISSIONS.SETTINGS.VIEW,
    ],
  },

  /**
   * Event Manager - Manage specific events
   */
  event_manager: {
    name: 'event_manager',
    displayName: 'Event Manager',
    description: 'Manage assigned events and their registrations',
    permissions: [
      // Events - Manage assigned events
      PERMISSIONS.EVENTS.VIEW,
      PERMISSIONS.EVENTS.EDIT,
      PERMISSIONS.EVENTS.MANAGE_REGISTRATIONS,
      
      // Registrations
      PERMISSIONS.REGISTRATIONS.VIEW,
      PERMISSIONS.REGISTRATIONS.VIEW_ALL,
      PERMISSIONS.REGISTRATIONS.CREATE,
      PERMISSIONS.REGISTRATIONS.EDIT,
      PERMISSIONS.REGISTRATIONS.EXPORT,
      
      // Dashboard
      PERMISSIONS.DASHBOARD.VIEW,
      
      // Settings - View only
      PERMISSIONS.SETTINGS.VIEW,
    ],
  },

  /**
   * Event Staff - Basic event access
   */
  event_staff: {
    name: 'event_staff',
    displayName: 'Event Staff',
    description: 'View and manage registrations for assigned events',
    permissions: [
      // Events - View only
      PERMISSIONS.EVENTS.VIEW,
      
      // Registrations - Basic management
      PERMISSIONS.REGISTRATIONS.VIEW,
      PERMISSIONS.REGISTRATIONS.CREATE,
      PERMISSIONS.REGISTRATIONS.EDIT,
      
      // Dashboard - View only
      PERMISSIONS.DASHBOARD.VIEW,
    ],
  },

  /**
   * Viewer - Read-only access
   */
  viewer: {
    name: 'viewer',
    displayName: 'Viewer',
    description: 'Read-only access to events and registrations',
    permissions: [
      // Events - View only
      PERMISSIONS.EVENTS.VIEW,
      
      // Registrations - View only
      PERMISSIONS.REGISTRATIONS.VIEW,
      
      // Dashboard - View only
      PERMISSIONS.DASHBOARD.VIEW,
    ],
  },
};

/**
 * Get all permissions for a role (including inherited)
 */
export function getRolePermissions(roleName: RoleName): string[] {
  const role = ROLES[roleName];
  if (!role) return [];

  const permissions = new Set(role.permissions);

  // Add inherited permissions
  if (role.inherits) {
    role.inherits.forEach(inheritedRole => {
      const inheritedPermissions = getRolePermissions(inheritedRole);
      inheritedPermissions.forEach(p => permissions.add(p));
    });
  }

  return Array.from(permissions);
}

/**
 * Get role by name
 */
export function getRole(roleName: RoleName): Role | undefined {
  return ROLES[roleName];
}

/**
 * Get all available roles
 */
export function getAllRoles(): Role[] {
  return Object.values(ROLES);
}
