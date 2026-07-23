import { create } from "zustand";

interface InsertLinkModalStore {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export const useInsertLinkModalStore = create<InsertLinkModalStore>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
