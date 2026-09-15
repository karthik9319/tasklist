import { db } from "./db";
import { nextDueDate } from "./recurrence";
import type { Task } from "./types";

export interface NewTaskInput {
  title: string;
  listId?: string | null;
  parentTaskId?: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
}

export async function createTask(input: NewTaskInput): Promise<string> {
  const now = Date.now();
  const id = crypto.randomUUID();
  const parentTaskId = input.parentTaskId ?? null;

  const siblingCount = (await db.tasks.toArray()).filter(
    (t) => !t.deletedAt && t.parentTaskId === parentTaskId,
  ).length;

  await db.tasks.add({
    id,
    title: input.title,
    notes: null,
    listId: input.listId ?? null,
    parentTaskId,
    dueDate: input.dueDate ?? null,
    dueTime: input.dueTime ?? null,
    recurrence: null,
    completed: false,
    completedAt: null,
    sortOrder: siblingCount,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

export async function toggleTaskCompletion(task: Task): Promise<void> {
  const now = Date.now();
  const completed = !task.completed;

  await db.tasks.update(task.id, {
    completed,
    completedAt: completed ? now : null,
    updatedAt: now,
  });

  if (completed && task.recurrence && task.dueDate) {
    await db.tasks.add({
      ...task,
      id: crypto.randomUUID(),
      dueDate: nextDueDate(task.dueDate, task.recurrence),
      completed: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function updateTaskNotes(taskId: string, notes: string): Promise<void> {
  await db.tasks.update(taskId, { notes, updatedAt: Date.now() });
}

export async function createList(name: string): Promise<string> {
  const now = Date.now();
  const id = crypto.randomUUID();
  const existing = await db.lists.toArray();
  const palette = ["var(--list-work)", "var(--list-personal)", "var(--list-home)"];

  await db.lists.add({
    id,
    name,
    color: palette[existing.length % palette.length],
    sortOrder: existing.length,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}
