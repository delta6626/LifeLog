import { EntryMetaData } from "../types/EntryMetaData";

export const getEntriesThisYear = (metaDataList: EntryMetaData[]): number => {
  const currentYear = new Date().getFullYear();

  return metaDataList.filter((entry) => {
    return new Date(entry.createdAt).getFullYear() === currentYear;
  }).length;
};
