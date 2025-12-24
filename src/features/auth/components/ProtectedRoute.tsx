/**
 * Protected Route Component
 *
 * Protects routes based on permissions
 * Redirects to unauthorized page if user lacks permission
 */

import React from 'react';
import { Navigate } from 'react-router';
import {
  usePermission,
  useAllPermissions,
  useAnyPermission,
} from '../hooks/usePermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  permission,
  permissions,
  requireAll = true,
  redirectTo = '/unauthorized',
}: ProtectedRouteProps) {
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
  } else {
    // No permissions specified, allow access
    hasAccess = true;
  }

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
