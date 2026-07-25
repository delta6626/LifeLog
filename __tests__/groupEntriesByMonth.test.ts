import { EntryMetaData } from "../types/EntryMetaData";
import { groupEntriesByMonth } from "../utils/groupEntriesByMonth";

describe("groupEntriesByMonth", () => {
  const mockEntries: EntryMetaData[] = [
    {
      id: "1",
      title: "July Entry 1",
      preview: "Preview 1",
      wordCount: 10,
      isFavorite: false,
      createdAt: new Date("2026-07-15T10:00:00Z").getTime(),
      updatedAt: 1000,
    },
    {
      id: "2",
      title: "August Entry 1",
      preview: "Preview 2",
      wordCount: 15,
      isFavorite: false,
      createdAt: new Date("2026-08-01T12:00:00Z").getTime(),
      updatedAt: 1000,
    },
    {
      id: "3",
      title: "July Entry 2 earlier than entry 1",
      preview: "Preview 3",
      wordCount: 20,
      isFavorite: false,
      createdAt: new Date("2026-07-01T08:00:00Z").getTime(),
      updatedAt: 1000,
    },
    {
      id: "4",
      title: "July 2025 Entry",
      preview: "Preview 4",
      wordCount: 25,
      isFavorite: false,
      createdAt: new Date("2025-07-20T14:00:00Z").getTime(),
      updatedAt: 1000,
    },
  ];

  it("should sort entries by createdAt descending and group them by month and year", () => {
    const results = groupEntriesByMonth(mockEntries);

    // Group 1 should be August 2026 (latest entry)
    // Group 2 should be July 2026
    // Group 3 should be July 2025
    expect(results).toHaveLength(3);

    // August 2026 Group
    const august2026 = results[0];
    expect(august2026.title.replace(/\u202f|\u00a0/g, " ")).toBe("August 2026");
    expect(august2026.entries).toHaveLength(1);
    expect(august2026.entries[0].id).toBe("2");

    // July 2026 Group
    const july2026 = results[1];
    expect(july2026.title.replace(/\u202f|\u00a0/g, " ")).toBe("July 2026");
    expect(july2026.entries).toHaveLength(2);
    // Should be sorted descending by createdAt, so July 15 first, then July 1
    expect(july2026.entries[0].id).toBe("1");
    expect(july2026.entries[1].id).toBe("3");

    // July 2025 Group
    const july2025 = results[2];
    expect(july2025.title.replace(/\u202f|\u00a0/g, " ")).toBe("July 2025");
    expect(july2025.entries).toHaveLength(1);
    expect(july2025.entries[0].id).toBe("4");
  });

  it("should return an empty array if inputs are empty", () => {
    expect(groupEntriesByMonth([])).toEqual([]);
  });
});
