import { addDays, toDateString } from "./date";
import type { Task } from "./types";

/** Consecutive days (walking back from `today`, inclusive) with at least one completed task. */
export function computeStreak(tasks: Task[], today: Date = new Date()): number {
  const completedDates = new Set(
    tasks
      .filter((t) => t.completed && t.completedAt != null)
      .map((t) => toDateString(new Date(t.completedAt as number))),
  );

  let streak = 0;
  let cursor = today;

  while (completedDates.has(toDateString(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}
