import { EntryMetaData } from "../types/EntryMetaData";

export const getTotalWordCount = (metaDataList: EntryMetaData[]) => {
  let totalWords = 0;

  metaDataList.forEach((entry) => {
    totalWords += entry.wordCount;
  });

  return totalWords;
};

export const getFormattedWordCount = (count: number) => {
  if (count < 1_000) {
    return count.toString();
  }

  if (count < 1_000_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  if (count < 1_000_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  return `${(count / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
};
