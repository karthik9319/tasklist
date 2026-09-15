import { describe, expect, it } from "vitest";
import { parseQuickAdd } from "./nlp";

// A fixed Monday so relative phrases ("tomorrow", "next mon") are deterministic.
const REFERENCE = new Date(2026, 8, 14, 9, 0, 0); // Mon Sep 14, 2026, 9:00am

describe("parseQuickAdd", () => {
  it("returns the raw text with no dates when nothing parses", () => {
    const result = parseQuickAdd("buy milk", REFERENCE);
    expect(result).toEqual({ title: "buy milk", dueDate: null, dueTime: null });
  });

  it("extracts a date and time, stripping it from the title", () => {
    const result = parseQuickAdd("call dentist tomorrow 3pm", REFERENCE);
    expect(result.title).toBe("call dentist");
    expect(result.dueDate).toBe("2026-09-15");
    expect(result.dueTime).toBe("15:00");
  });

  it("extracts a date-only phrase without a time", () => {
    // Reference is Mon Sep 14; chrono resolves "next friday" to the Friday
    // of the *following* week (Sep 25), not this week's Sep 18.
    const result = parseQuickAdd("renew passport next friday", REFERENCE);
    expect(result.title).toBe("renew passport");
    expect(result.dueDate).toBe("2026-09-25");
    expect(result.dueTime).toBeNull();
  });
});
