/**
 * React Query Configuration
 * 
 * Centralized configuration for data fetching and caching
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Cache time: Data stays in cache for 10 minutes after becoming unused
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch on window focus by default (can be overridden per query)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

/**
 * Query Keys Factory
 * Centralized query key management for consistency
 */
export const queryKeys = {
  // Events
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.events.lists(), filters] as const,
    details: () => [...queryKeys.events.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.events.details(), id] as const,
  },
  
  // Organizations
  organizations: {
    all: ['organizations'] as const,
    lists: () => [...queryKeys.organizations.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.organizations.lists(), filters] as const,
    details: () => [...queryKeys.organizations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.organizations.details(), id] as const,
  },
  
  // Registrations
  registrations: {
    all: ['registrations'] as const,
    lists: () => [...queryKeys.registrations.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.registrations.lists(), filters] as const,
    details: () => [...queryKeys.registrations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.registrations.details(), id] as const,
  },
  
  // User
  user: {
    current: ['user', 'current'] as const,
    profile: ['user', 'profile'] as const,
  },
  
  // Tenants
  tenants: {
    all: ['tenants'] as const,
    current: ['tenants', 'current'] as const,
  },
};
