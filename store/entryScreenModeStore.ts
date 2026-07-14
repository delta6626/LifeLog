import { create } from "zustand";
import { EntryScreenMode } from "../types/EntryScreenMode";

interface EntryScreenModeStore {
  entryScreenMode: EntryScreenMode;
  setEntryScreenMode: (entryScreenMode: EntryScreenMode) => void;
}

export const useEntryScreenModeStore = create<EntryScreenModeStore>((set) => ({
  entryScreenMode: "read", // Default mode
  setEntryScreenMode: (entryScreenMode) =>
    set({ entryScreenMode: entryScreenMode }),
}));
