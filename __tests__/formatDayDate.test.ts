import { formatDayDate } from "../utils/formatDayDate";

describe("formatDayDate", () => {
  it("should format epoch timestamp into day of the week, day, and month in en-GB format", () => {
    // July 24, 2026 is a Friday
    const date = new Date(2026, 6, 24, 12, 0, 0);
    const result = formatDayDate(date.getTime());

    expect(result).toBe("Friday 24 July");
  });

  it("should handle leap year dates correctly", () => {
    // February 29, 2028 is a Tuesday
    const date = new Date(2028, 1, 29, 12, 0, 0);
    const result = formatDayDate(date.getTime());

    expect(result).toBe("Tuesday 29 February");
  });
});
