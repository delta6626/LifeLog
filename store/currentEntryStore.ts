import { create } from "zustand";
import { Entry } from "../types/Entry";

interface CurrentEntryStore {
  currentEntry: Entry | null;
  setCurrentEntry: (currentEntry: Entry) => void;
}

export const useCurrentEntryStore = create<CurrentEntryStore>((set) => ({
  currentEntry: null,
  setCurrentEntry: (currentEntry) => {
    set({ currentEntry: currentEntry });
  },
}));
