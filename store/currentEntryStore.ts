import { create } from "zustand";
import { CurrentEntry } from "../types/CurrentEntry";

interface CurrentEntryStore {
  currentEntry: CurrentEntry | null;
  setCurrentEntry: (currentEntry: CurrentEntry) => void;
}

export const useCurrentEntryStore = create<CurrentEntryStore>((set) => ({
  currentEntry: null,
  setCurrentEntry: (currentEntry) => {
    set({ currentEntry: currentEntry });
  },
}));
