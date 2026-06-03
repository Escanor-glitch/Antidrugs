import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { UserRole } from '../types';

interface AuthState {
  userId: string | null;
  role: UserRole | null;
  email: string | null;
  isLoggedIn: boolean;

  // Actions
  setAuth: (userId: string, role: UserRole, email: string) => void;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  governorate_supervisor: 0,
  unit_director: 1,
  evaluation_committee: 2,
  sector_manager: 3,
  neighborhood_coordinator: 4,
  volunteer: 5,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        userId: null,
        role: null,
        email: null,
        isLoggedIn: false,

        setAuth: (userId, role, email) =>
          set({ userId, role, email, isLoggedIn: true }),

        logout: () =>
          set({ userId: null, role: null, email: null, isLoggedIn: false }),

        hasPermission: (requiredRole) => {
          const { role } = get();
          if (!role) return false;

          const userLevel = ROLE_HIERARCHY[role];
          const requiredLevel = ROLE_HIERARCHY[requiredRole];

          return userLevel <= requiredLevel;
        },
      }),
      {
        name: 'auth-store',
      }
    )
  )
);
