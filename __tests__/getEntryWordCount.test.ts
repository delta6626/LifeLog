import { describe, expect, it } from "@jest/globals";
import { getEntryWordCount } from "../utils/getEntryWordCount";

describe("getEntryWordCount", () => {
  it("should return the correct number of words in a string", () => {
    const text = "Hello world from Jest";
    expect(getEntryWordCount(text)).toBe(4);
  });

  it("should handle multiple consecutive spaces or newlines correctly", () => {
    const text = "   Hello \n \t world   again   ";
    expect(getEntryWordCount(text)).toBe(3);
  });

  it("should return 0 for empty or whitespace-only strings", () => {
    expect(getEntryWordCount("")).toBe(0);
    expect(getEntryWordCount("   \n\t   ")).toBe(0);
  });
});
