import { describe, expect, it } from "@jest/globals";
import { EntryMetaData } from "../types/EntryMetaData";
import { filterEntries } from "../utils/filterEntries";

describe("filterEntries", () => {
  const mockEntries: EntryMetaData[] = [
    {
      id: "1",
      title: "First Entry",
      preview: "Preview 1",
      wordCount: 10,
      isFavorite: false,
      createdAt: new Date(2026, 6, 24, 10, 0).getTime(), // July 24, 2026
      updatedAt: new Date(2026, 6, 24, 10, 0).getTime(),
    },
    {
      id: "2",
      title: "Second Entry",
      preview: "Preview 2",
      wordCount: 20,
      isFavorite: true,
      createdAt: new Date(2026, 6, 25, 11, 0).getTime(), // July 25, 2026
      updatedAt: new Date(2026, 6, 25, 11, 0).getTime(),
    },
    {
      id: "3",
      title: "Another First Day",
      preview: "Preview 3",
      wordCount: 30,
      isFavorite: false,
      createdAt: new Date(2026, 6, 24, 15, 0).getTime(), // July 24, 2026
      updatedAt: new Date(2026, 6, 24, 15, 0).getTime(),
    },
  ];

  it("should return empty array if search query is empty and no date is provided", () => {
    expect(filterEntries(mockEntries, "")).toEqual([]);
    expect(filterEntries(mockEntries, "   ")).toEqual([]);
  });

  it("should filter entries by title case-insensitively", () => {
    const results = filterEntries(mockEntries, "first");
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.id)).toEqual(["1", "3"]);
  });

  it("should filter entries by date", () => {
    const filterDate = new Date(2026, 6, 24);
    const results = filterEntries(mockEntries, "", filterDate);
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.id)).toEqual(["1", "3"]);
  });

  it("should filter entries by both title and date", () => {
    const filterDate = new Date(2026, 6, 24);
    const results = filterEntries(mockEntries, "another", filterDate);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("3");
  });

  it("should return empty array if no match is found", () => {
    const results = filterEntries(mockEntries, "Does not exist");
    expect(results).toEqual([]);
  });
});
