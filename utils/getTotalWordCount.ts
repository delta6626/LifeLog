import { EntryMetaData } from "../types/EntryMetaData";

export const getTotalWordCount = (metaDataList: EntryMetaData[]) => {
  let totalWords = 0;

  metaDataList.forEach((entry) => {
    totalWords += entry.wordCount;
  });

  return totalWords;
};
