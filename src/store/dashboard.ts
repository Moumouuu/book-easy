import { create } from "zustand";

type ICompany = {
  companyId: string | string[] | null;
  setCompanyId: (id: string | string[]) => void;
};

export const useCompany = create<ICompany>()((set) => ({
  companyId: null,
  setCompanyId: (id: string | string[]) => set({ companyId: id }),
}));
