import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { getGreetingText } from "../utils/getGreetingText";

describe("getGreetingText", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return 'Good morning' when current hour is before 12", () => {
    jest.setSystemTime(new Date("2026-07-24T09:00:00")); // 9 AM
    expect(getGreetingText()).toBe("Good morning");

    jest.setSystemTime(new Date("2026-07-24T11:59:59")); // 11:59:59 AM
    expect(getGreetingText()).toBe("Good morning");
  });

  it("should return 'Good afternoon' when current hour is between 12 and 17 (inclusive)", () => {
    jest.setSystemTime(new Date("2026-07-24T12:00:00")); // 12 PM
    expect(getGreetingText()).toBe("Good afternoon");

    jest.setSystemTime(new Date("2026-07-24T17:59:59")); // 5:59:59 PM
    expect(getGreetingText()).toBe("Good afternoon");
  });

  it("should return 'Good evening' when current hour is 18 or later", () => {
    jest.setSystemTime(new Date("2026-07-24T18:00:00")); // 6 PM
    expect(getGreetingText()).toBe("Good evening");

    jest.setSystemTime(new Date("2026-07-24T23:59:59")); // 11:59:59 PM
    expect(getGreetingText()).toBe("Good evening");

    jest.setSystemTime(new Date("2026-07-24T00:00:00")); // 12:00 AM
    expect(getGreetingText()).toBe("Good morning");
  });
});
