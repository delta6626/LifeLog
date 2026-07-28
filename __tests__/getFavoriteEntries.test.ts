import { describe, expect, it } from "@jest/globals";
import { EntryMetaData } from "../types/EntryMetaData";
import { getFavoriteEntries } from "../utils/getFavoriteEntries";

describe("getFavoriteEntries", () => {
  const mockEntries: EntryMetaData[] = [
    {
      id: "1",
      title: "Favorite Entry",
      preview: "Preview 1",
      wordCount: 10,
      isFavorite: true,
      createdAt: 1000,
      updatedAt: 1000,
    },
    {
      id: "2",
      title: "Not a Favorite Entry",
      preview: "Preview 2",
      wordCount: 20,
      isFavorite: false,
      createdAt: 2000,
      updatedAt: 2000,
    },
    {
      id: "3",
      title: "Another Favorite Entry",
      preview: "Preview 3",
      wordCount: 30,
      isFavorite: true,
      createdAt: 3000,
      updatedAt: 3000,
    },
  ];

  it("should return only entries where isFavorite is true", () => {
    const results = getFavoriteEntries(mockEntries);
    expect(results).toHaveLength(2);
    expect(results.map((e) => e.id)).toEqual(["1", "3"]);
  });

  it("should return an empty array if entryList is empty", () => {
    expect(getFavoriteEntries([])).toEqual([]);
  });

  it("should return an empty array if no entries are favorited", () => {
    const noFavorites = mockEntries.filter((e) => !e.isFavorite);
    expect(getFavoriteEntries(noFavorites)).toEqual([]);
  });
});
