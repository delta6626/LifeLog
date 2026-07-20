import { EntryMetaData } from "../types/EntryMetaData";

export const getFavoriteEntries = (entryList: EntryMetaData[]) => {
  const favorites = entryList.filter((entry) => entry.isFavorite);
  return favorites;
};
