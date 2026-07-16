import { create } from "zustand";

interface DeleteEntryModalStore {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export const useDeleteEntryModalStore = create<DeleteEntryModalStore>(
  (set) => ({
    isVisible: false,
    setIsVisible: (isVisible) => set({ isVisible: isVisible }),
  }),
);
