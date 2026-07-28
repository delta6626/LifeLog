import { describe, expect, it } from "@jest/globals";
import { getEntryPlainTextContent } from "../utils/getEntryPlainTextContent";

describe("getEntryPlainTextContent", () => {
  it("should strip HTML tags from the content", () => {
    const html = "<p>Hello <strong>World</strong>!</p>";
    expect(getEntryPlainTextContent(html).trim()).toBe("Hello  World !");
  });

  it("should replace &nbsp; with spaces", () => {
    const html = "Hello&nbsp;world";
    expect(getEntryPlainTextContent(html)).toBe("Hello world");
  });

  it("should return the same content if no HTML tag or &nbsp; is present", () => {
    const text = "Hello world!";
    expect(getEntryPlainTextContent(text)).toBe("Hello world!");
  });

  it("should handle empty string correctly", () => {
    expect(getEntryPlainTextContent("")).toBe("");
  });
});
