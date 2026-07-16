import { create } from "zustand";
import { EntryMetaData } from "../types/EntryMetaData";
import { getAllEntriesMetaData } from "../utils/crudHelpers";

interface MetaDataStore {
  metaDataList: EntryMetaData[];
  setMetaDataList: (metaDataList: EntryMetaData[]) => void;
  refreshMetaData: () => Promise<void>;
}

export const useMetaDataStore = create<MetaDataStore>((set) => ({
  metaDataList: [],
  setMetaDataList: (metaDataList) => {
    set({ metaDataList: metaDataList });
  },
  refreshMetaData: async () => {
    const metaDataList = await getAllEntriesMetaData();
    set({ metaDataList: metaDataList });
  },
}));
