import { EntryMetaData } from "../types/EntryMetaData";
import { getEntriesThisYear } from "../utils/getEntriesThisYear";

describe("getEntriesThisYear", () => {
  const mockEntries: EntryMetaData[] = [
    {
      id: "1",
      title: "This year entry 1",
      preview: "Preview 1",
      wordCount: 5,
      isFavorite: false,
      createdAt: new Date("2026-01-01T00:00:00Z").getTime(),
      updatedAt: new Date("2026-01-01T00:00:00Z").getTime(),
    },
    {
      id: "2",
      title: "This year entry 2",
      preview: "Preview 2",
      wordCount: 10,
      isFavorite: true,
      createdAt: new Date("2026-12-31T23:59:59Z").getTime(),
      updatedAt: new Date("2026-12-31T23:59:59Z").getTime(),
    },
    {
      id: "3",
      title: "Last year entry",
      preview: "Preview 3",
      wordCount: 15,
      isFavorite: false,
      createdAt: new Date("2025-12-31T23:59:59Z").getTime(),
      updatedAt: new Date("2025-12-31T23:59:59Z").getTime(),
    },
    {
      id: "4",
      title: "Next year entry",
      preview: "Preview 4",
      wordCount: 20,
      isFavorite: false,
      createdAt: new Date("2027-01-01T00:00:00Z").getTime(),
      updatedAt: new Date("2027-01-01T00:00:00Z").getTime(),
    },
  ];

  it("should return the count of entries created in the current calendar year", () => {
    const count = getEntriesThisYear(mockEntries);
    expect(count).toBe(2); // Only entries 1 and 2 are in 2026
  });

  it("should return 0 if the entry list is empty", () => {
    expect(getEntriesThisYear([])).toBe(0);
  });

  it("should return 0 if there are no entries from the current year", () => {
    const noCurrentYearEntries = mockEntries.filter(
      (entry) => new Date(entry.createdAt).getFullYear() !== 2026,
    );
    expect(getEntriesThisYear(noCurrentYearEntries)).toBe(0);
  });
});
