import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  detailPanelOpen: boolean;
  legendVisible: boolean;
  controlsVisible: boolean;

  toggleSidebar: () => void;
  setDetailPanelOpen: (open: boolean) => void;
  toggleLegend: () => void;
  toggleControls: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  detailPanelOpen: false,
  legendVisible: true,
  controlsVisible: true,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
  toggleLegend: () => set((state) => ({ legendVisible: !state.legendVisible })),
  toggleControls: () => set((state) => ({ controlsVisible: !state.controlsVisible })),
}));
