import { create } from "zustand";
import { EntryMetaData } from "../types/EntryMetaData";

interface MetaDataStore {
  metaDataList: EntryMetaData[];
  setMetaDataList: (metaDataList: EntryMetaData[]) => void;
}

export const useMetaDataStore = create<MetaDataStore>((set) => ({
  metaDataList: [],
  setMetaDataList: (metaDataList) => {
    set({ metaDataList: metaDataList });
  },
}));
