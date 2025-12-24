import type { User } from '@/config/api.config';

export function useUser() {
  throw new Error('useUser must be used within a UserProvider');
}

export type { User };
