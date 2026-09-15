import { describe, expect, it } from "vitest";
import { addDays, formatDueLabel, formatTime12h, toDateString } from "./date";

describe("toDateString", () => {
  it("pads month and day to two digits", () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("addDays", () => {
  it("rolls over month boundaries", () => {
    const result = addDays(new Date(2026, 0, 31), 1);
    expect(toDateString(result)).toBe("2026-02-01");
  });

  it("supports negative offsets", () => {
    const result = addDays(new Date(2026, 2, 1), -1);
    expect(toDateString(result)).toBe("2026-02-28");
  });
});

describe("formatTime12h", () => {
  it("formats morning times", () => {
    expect(formatTime12h("09:05")).toBe("9:05 AM");
  });

  it("formats noon as 12 PM", () => {
    expect(formatTime12h("12:00")).toBe("12:00 PM");
  });

  it("formats midnight as 12 AM", () => {
    expect(formatTime12h("00:30")).toBe("12:30 AM");
  });

  it("formats afternoon times", () => {
    expect(formatTime12h("15:00")).toBe("3:00 PM");
  });
});

describe("formatDueLabel", () => {
  it("labels today's date as Today", () => {
    const today = toDateString(new Date());
    expect(formatDueLabel(today)).toBe("Today");
  });

  it("labels tomorrow's date as Tomorrow", () => {
    const tomorrow = toDateString(addDays(new Date(), 1));
    expect(formatDueLabel(tomorrow)).toBe("Tomorrow");
  });

  it("appends the time when given", () => {
    const today = toDateString(new Date());
    expect(formatDueLabel(today, "15:00")).toBe("Today, 3:00 PM");
  });
});
