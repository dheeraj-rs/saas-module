/**
 * Permission Gate Component
 *
 * Conditionally renders children based on permissions
 * Usage:
 *   <PermissionGate permission="events.create">
 *     <CreateEventButton />
 *   </PermissionGate>
 */

import React from 'react';
import {
  usePermission,
  useAllPermissions,
  useAnyPermission,
} from '../hooks/usePermissions';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // If true, requires ALL permissions; if false, requires ANY
  fallback?: React.ReactNode;
}

export function PermissionGate({
  children,
  permission,
  permissions,
  requireAll = true,
  fallback = null,
}: PermissionGateProps) {
  // Single permission check
  const hasSinglePermission = usePermission(permission ?? '');

  // Multiple permissions check
  const hasAllPerms = useAllPermissions(permissions ?? []);
  const hasAnyPerm = useAnyPermission(permissions ?? []);

  // Determine if user has required permissions
  let hasAccess = false;

  if (permission) {
    hasAccess = hasSinglePermission;
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll ? hasAllPerms : hasAnyPerm;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
