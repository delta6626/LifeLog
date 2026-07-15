import { create } from "zustand";
import { Entry } from "../types/Entry";

interface CurrentEntryStore {
  currentEntryId: Entry["id"] | null;
  setCurrentEntryId: (id: string | null) => void;
}

export const useCurrentEntryStore = create<CurrentEntryStore>((set) => ({
  currentEntryId: null,

  setCurrentEntryId: (id) => {
    set({ currentEntryId: id });
  },
}));
