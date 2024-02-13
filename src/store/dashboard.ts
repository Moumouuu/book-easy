import { create } from "zustand";

type IDashboard = {
  dashboardId: string | null;
  setDashboardId: (id: string) => void;
};

export const useDashboard = create<IDashboard>()((set) => ({
  dashboardId: null,
  setDashboardId: (id: string) => set({ dashboardId: id }),
}));
