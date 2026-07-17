// This utility function is responsible for the following:
// 1. Sort entries by createdAt descending
// 2. Group them by month/year
// 3. Return an array of groups

import { EntryMetaData } from "../types/EntryMetaData";

export interface EntryGroup {
  title: string;
  entries: EntryMetaData[];
}

export const groupEntriesByMonth = (entries: EntryMetaData[]): EntryGroup[] => {
  const sortedEntries = [...entries].sort((a, b) => b.createdAt - a.createdAt);

  const groups = new Map<string, EntryGroup>();

  for (const entry of sortedEntries) {
    const date = new Date(entry.createdAt);

    const groupTitle = new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(date);

    if (!groups.has(groupTitle)) {
      groups.set(groupTitle, {
        title: groupTitle,
        entries: [],
      });
    }

    groups.get(groupTitle)!.entries.push(entry);
  }

  return Array.from(groups.values());
};
