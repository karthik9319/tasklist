import { describe, expect, it } from "vitest";
import { nextDueDate } from "./recurrence";

describe("nextDueDate", () => {
  it("advances daily recurrence by the interval", () => {
    expect(nextDueDate("2026-03-10", { freq: "daily", interval: 1 })).toBe("2026-03-11");
    expect(nextDueDate("2026-03-10", { freq: "daily", interval: 3 })).toBe("2026-03-13");
  });

  it("advances weekly recurrence by whole weeks", () => {
    expect(nextDueDate("2026-03-10", { freq: "weekly", interval: 1 })).toBe("2026-03-17");
    expect(nextDueDate("2026-03-10", { freq: "weekly", interval: 2 })).toBe("2026-03-24");
  });

  it("advances monthly recurrence by the interval", () => {
    expect(nextDueDate("2026-03-10", { freq: "monthly", interval: 1 })).toBe("2026-04-10");
  });

  it("rolls monthly recurrence into the next month when the day doesn't exist", () => {
    // Jan 31 + 1 month has no Feb 31, so it lands on Mar 3 (2027 is not a leap year).
    expect(nextDueDate("2027-01-31", { freq: "monthly", interval: 1 })).toBe("2027-03-03");
  });
});
