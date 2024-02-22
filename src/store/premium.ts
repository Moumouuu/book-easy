import { create } from "zustand";

type IIsPremium = {
  isPremium: boolean;
  setPremium: (premium: boolean) => void;
};

export const storeIsPremium = create<IIsPremium>()((set) => ({
  isPremium: false,
  setPremium: (premium) => set({ isPremium: premium }),
}));
