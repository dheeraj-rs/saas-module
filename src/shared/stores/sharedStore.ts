/**
 * Shared Store
 * 
 * Global UI state and shared application state
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SharedState {
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: number;
}

export const useSharedStore = create<SharedState>()(
  devtools(
    persist(
      (set) => ({
        // UI State
        sidebarOpen: true,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        // Loading
        globalLoading: false,
        setGlobalLoading: (loading) => set({ globalLoading: loading }),

        // Notifications
        notifications: [],
        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id: Math.random().toString(36).substring(7),
                timestamp: Date.now(),
              },
            ],
          })),
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'shared-storage',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'SharedStore' }
  )
);
