import * as chrono from "chrono-node";
import { toDateString } from "./date";

export interface ParsedQuickAdd {
  title: string;
  dueDate: string | null;
  dueTime: string | null;
}

export function parseQuickAdd(input: string, referenceDate: Date = new Date()): ParsedQuickAdd {
  const results = chrono.parse(input, referenceDate);

  if (results.length === 0) {
    return { title: input.trim(), dueDate: null, dueTime: null };
  }

  const result = results[0];
  const parsedDate = result.start.date();
  const hasTime = result.start.isCertain("hour");

  const title = (input.slice(0, result.index) + input.slice(result.index + result.text.length))
    .replace(/\s+/g, " ")
    .trim();

  return {
    title: title || input.trim(),
    dueDate: toDateString(parsedDate),
    dueTime: hasTime ? formatTimeValue(parsedDate) : null,
  };
}

function formatTimeValue(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
