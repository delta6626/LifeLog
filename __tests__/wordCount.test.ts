import { describe, expect, it } from "@jest/globals";
import { EntryMetaData } from "../types/EntryMetaData";
import { getFormattedWordCount, getTotalWordCount } from "../utils/wordCount";

describe("wordCount utilities", () => {
  describe("getTotalWordCount", () => {
    const mockEntries: EntryMetaData[] = [
      {
        id: "1",
        title: "Entry 1",
        preview: "Preview 1",
        wordCount: 150,
        isFavorite: false,
        createdAt: 1000,
        updatedAt: 1000,
      },
      {
        id: "2",
        title: "Entry 2",
        preview: "Preview 2",
        wordCount: 250,
        isFavorite: false,
        createdAt: 2000,
        updatedAt: 2000,
      },
      {
        id: "3",
        title: "Entry 3",
        preview: "Preview 3",
        wordCount: 0,
        isFavorite: false,
        createdAt: 3000,
        updatedAt: 3000,
      },
    ];

    it("should return the sum of word counts from all entries", () => {
      expect(getTotalWordCount(mockEntries)).toBe(400);
    });

    it("should return 0 for empty list", () => {
      expect(getTotalWordCount([])).toBe(0);
    });
  });

  describe("getFormattedWordCount", () => {
    it("should format counts less than 1,000 as is", () => {
      expect(getFormattedWordCount(0)).toBe("0");
      expect(getFormattedWordCount(999)).toBe("999");
    });

    it("should format counts between 1,000 and 1,000,000 with 'K'", () => {
      expect(getFormattedWordCount(1000)).toBe("1K");
      expect(getFormattedWordCount(1500)).toBe("1.5K");
      expect(getFormattedWordCount(999900)).toBe("999.9K");
    });

    it("should format counts between 1,000,000 and 1,000,000,000 with 'M'", () => {
      expect(getFormattedWordCount(1000000)).toBe("1M");
      expect(getFormattedWordCount(2300000)).toBe("2.3M");
      expect(getFormattedWordCount(999900000)).toBe("999.9M");
    });

    it("should format counts greater than or equal to 1,000,000,000 with 'B'", () => {
      expect(getFormattedWordCount(1000000000)).toBe("1B");
      expect(getFormattedWordCount(5700000000)).toBe("5.7B");
    });
  });
});
