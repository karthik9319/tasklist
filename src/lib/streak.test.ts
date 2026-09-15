import { describe, expect, it } from "vitest";
import { addDays } from "./date";
import { computeStreak } from "./streak";
import type { Task } from "./types";

function completedTaskOn(date: Date): Task {
  return {
    id: crypto.randomUUID(),
    title: "task",
    listId: null,
    parentTaskId: null,
    completed: true,
    completedAt: date.getTime(),
    sortOrder: 0,
    createdAt: date.getTime(),
    updatedAt: date.getTime(),
  };
}

describe("computeStreak", () => {
  it("is zero with no completed tasks", () => {
    expect(computeStreak([])).toBe(0);
  });

  it("counts today alone as a streak of one", () => {
    const today = new Date();
    expect(computeStreak([completedTaskOn(today)], today)).toBe(1);
  });

  it("counts consecutive prior days", () => {
    const today = new Date();
    const tasks = [
      completedTaskOn(today),
      completedTaskOn(addDays(today, -1)),
      completedTaskOn(addDays(today, -2)),
    ];
    expect(computeStreak(tasks, today)).toBe(3);
  });

  it("stops at the first gap", () => {
    const today = new Date();
    const tasks = [completedTaskOn(today), completedTaskOn(addDays(today, -2))];
    expect(computeStreak(tasks, today)).toBe(1);
  });

  it("is zero if today has no completed task, even with a prior streak", () => {
    const today = new Date();
    const tasks = [completedTaskOn(addDays(today, -1)), completedTaskOn(addDays(today, -2))];
    expect(computeStreak(tasks, today)).toBe(0);
  });
});
