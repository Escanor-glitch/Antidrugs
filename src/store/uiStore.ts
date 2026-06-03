import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FilterOptions {
  search?: string;
  status?: string;
  sectorId?: string;
  neighborhoodId?: string;
  [key: string]: string | undefined;
}

interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalType: string | null;
  filters: FilterOptions;
  selectedItemId: string | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (type: string) => void;
  closeModal: () => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  clearFilters: () => void;
  setSelectedItemId: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools((set) => ({
    isSidebarOpen: false,
    isModalOpen: false,
    modalType: null,
    filters: {},
    selectedItemId: null,

    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    setSidebarOpen: (open) =>
      set({ isSidebarOpen: open }),

    openModal: (type) =>
      set({ isModalOpen: true, modalType: type }),

    closeModal: () =>
      set({ isModalOpen: false, modalType: null }),

    setFilters: (newFilters) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),

    clearFilters: () =>
      set({ filters: {} }),

    setSelectedItemId: (id) =>
      set({ selectedItemId: id }),
  }))
);
