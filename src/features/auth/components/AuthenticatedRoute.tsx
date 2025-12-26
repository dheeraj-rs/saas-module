import { useIsAuthenticated } from '@refinedev/core';
import { Navigate } from 'react-router';
import type { PropsWithChildren } from 'react';

/**
 * AuthenticatedRoute Component
 *
 * Wraps routes that require authentication (logged in user).
 * This is different from ProtectedRoute which checks permissions.
 *
 * Features:
 * - Uses Refine's useIsAuthenticated hook for auth checks
 * - Shows loading state while checking authentication
 * - Redirects to /login if not authenticated
 * - Renders children if authenticated
 *
 * @example
 * ```tsx
 * <Route element={<AuthenticatedRoute><Layout><Outlet /></Layout></AuthenticatedRoute>}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 * ```
 */
export function AuthenticatedRoute({ children }: PropsWithChildren) {
  const { isLoading, data } = useIsAuthenticated();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!data?.authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
}

AuthenticatedRoute.displayName = 'AuthenticatedRoute';
