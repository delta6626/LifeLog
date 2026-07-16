import { create } from "zustand";
import { Entry } from "../types/Entry";

interface DeleteEntryModalStore {
  isVisible: boolean;
  idForDeletion: Entry["id"] | null;
  setIsVisible: (isVisible: boolean) => void;
  setIdForDeletion: (id: Entry["id"]) => void;
}

export const useDeleteEntryModalStore = create<DeleteEntryModalStore>(
  (set) => ({
    isVisible: false,
    setIsVisible: (isVisible) => set({ isVisible: isVisible }),
    idForDeletion: null,
    setIdForDeletion: (idForDeletion) => set({ idForDeletion: idForDeletion }),
  }),
);
