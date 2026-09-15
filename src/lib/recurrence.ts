import { toDateString } from "./date";
import type { Recurrence } from "./types";

/**
 * Advances a due date by one recurrence period. Monthly recurrence relies on
 * Date's own month-overflow behavior, so e.g. Jan 31 + 1 month lands on Mar 3
 * (Feb has no 31st) rather than clamping to Feb 28/29.
 */
export function nextDueDate(dueDate: string, recurrence: Recurrence): string {
  const [year, month, day] = dueDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  switch (recurrence.freq) {
    case "daily":
      date.setDate(date.getDate() + recurrence.interval);
      break;
    case "weekly":
      date.setDate(date.getDate() + recurrence.interval * 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + recurrence.interval);
      break;
  }

  return toDateString(date);
}
