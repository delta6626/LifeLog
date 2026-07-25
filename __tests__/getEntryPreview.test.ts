import { getEntryPreview } from "../utils/getEntryPreview";

describe("getEntryPreview", () => {
  it("should return the first 100 characters of plain text content", () => {
    const content = "a".repeat(150);
    const expected = "a".repeat(100);
    expect(getEntryPreview(content)).toBe(expected);
  });

  it("should trim surrounding whitespace from the preview", () => {
    const content = "   " + "a".repeat(50) + "   ";
    const expected = "a".repeat(50);
    expect(getEntryPreview(content)).toBe(expected);
  });

  it("should return the full content if it is less than 100 characters", () => {
    const content = "Short content";
    expect(getEntryPreview(content)).toBe("Short content");
  });

  it("should handle empty string correctly", () => {
    expect(getEntryPreview("")).toBe("");
  });
});
