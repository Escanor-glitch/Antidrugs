import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Page =
  | 'dashboard'
  | 'volunteers'
  | 'volunteer-profile'
  | 'achievements'
  | 'events'
  | 'event-detail'
  | 'attendance'
  | 'evaluations'
  | 'sectors'
  | 'neighborhoods';

interface NavigationState {
  currentPage: Page;
  volunteerId: string | null;
  eventId: string | null;

  // Actions
  navigateTo: (page: Page, extras?: { volunteerId?: string; eventId?: string }) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  devtools((set, get) => ({
    currentPage: 'dashboard',
    volunteerId: null,
    eventId: null,

    navigateTo: (page, extras) =>
      set({
        currentPage: page,
        volunteerId: extras?.volunteerId ?? null,
        eventId: extras?.eventId ?? null,
      }),

    goBack: () => {
      const { currentPage } = get();

      // Simple back navigation logic
      const backMap: Record<Page, Page> = {
        'volunteer-profile': 'volunteers',
        'achievements': 'volunteers',
        'event-detail': 'events',
        'dashboard': 'dashboard',
        'volunteers': 'dashboard',
        'events': 'dashboard',
        'attendance': 'dashboard',
        'evaluations': 'dashboard',
        'sectors': 'dashboard',
        'neighborhoods': 'dashboard',
      };

      const previousPage = backMap[currentPage] || 'dashboard';
      set({ currentPage: previousPage, volunteerId: null, eventId: null });
    },
  }))
);
