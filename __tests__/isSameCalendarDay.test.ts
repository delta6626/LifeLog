import { describe, expect, it } from "@jest/globals";
import { isSameCalendarDay } from "../utils/isSameCalendarDay";

describe("isSameCalendarDay", () => {
  it("should return true for same calendar days", () => {
    const date1 = new Date(2026, 6, 24, 10, 0, 0); // July 24, 2026
    const date2 = new Date(2026, 6, 24, 23, 59, 59); // July 24, 2026
    expect(isSameCalendarDay(date1, date2)).toBe(true);
  });

  it("should return false for different days in same month and year", () => {
    const date1 = new Date(2026, 6, 24); // July 24, 2026
    const date2 = new Date(2026, 6, 25); // July 25, 2026
    expect(isSameCalendarDay(date1, date2)).toBe(false);
  });

  it("should return false for same day and month but different year", () => {
    const date1 = new Date(2026, 6, 24); // July 24, 2026
    const date2 = new Date(2025, 6, 24); // July 24, 2025
    expect(isSameCalendarDay(date1, date2)).toBe(false);
  });

  it("should return false for same day and year but different month", () => {
    const date1 = new Date(2026, 6, 24); // July 24, 2026
    const date2 = new Date(2026, 5, 24); // June 24, 2026
    expect(isSameCalendarDay(date1, date2)).toBe(false);
  });
});
