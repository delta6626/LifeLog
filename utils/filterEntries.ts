import type { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { EntryMetaData } from "../types/EntryMetaData";
import { isSameCalendarDay } from "./isSameCalendarDay";

export function filterEntries(
  entries: EntryMetaData[],
  searchTitle: string,
  date?: CalendarDate,
) {
  const trimmedSearch = searchTitle.trim().toLowerCase();

  if (trimmedSearch === "" && !date) {
    return [];
  }

  return entries.filter((entry) => {
    const titleMatches =
      trimmedSearch === "" || entry.title.toLowerCase().includes(trimmedSearch);

    const dateMatches =
      !date || isSameCalendarDay(new Date(entry.createdAt), date);

    return titleMatches && dateMatches;
  });
}
