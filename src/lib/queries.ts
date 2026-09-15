import { todayString } from "./date";
import type { List, Task } from "./types";

export function activeLists(lists: List[]): List[] {
  return lists.filter((l) => !l.deletedAt).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function topLevelTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.deletedAt && !t.parentTaskId);
}

export function tasksDueToday(tasks: Task[]): Task[] {
  const today = todayString();
  return topLevelTasks(tasks).filter((t) => t.dueDate === today);
}

export function tasksDueLater(tasks: Task[]): Task[] {
  const today = todayString();
  return topLevelTasks(tasks)
    .filter((t): t is Task & { dueDate: string } => !!t.dueDate && t.dueDate > today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function tasksInInbox(tasks: Task[]): Task[] {
  return topLevelTasks(tasks).filter((t) => !t.listId);
}

export function tasksInList(tasks: Task[], listId: string): Task[] {
  return topLevelTasks(tasks).filter((t) => t.listId === listId);
}

export function subtasksOf(tasks: Task[], parentTaskId: string): Task[] {
  return tasks
    .filter((t) => !t.deletedAt && t.parentTaskId === parentTaskId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export interface TaskGroup {
  list: List | null;
  tasks: Task[];
}

/** Groups tasks by list, ordered by each list's sortOrder, with ungrouped (Inbox) tasks last. */
export function groupByList(tasks: Task[], lists: List[]): TaskGroup[] {
  const byListId = new Map<string | null, Task[]>();
  for (const task of tasks) {
    const key = task.listId;
    const group = byListId.get(key) ?? [];
    group.push(task);
    byListId.set(key, group);
  }

  const bySortOrder = (a: Task, b: Task) => a.sortOrder - b.sortOrder;
  const ordered: TaskGroup[] = [];

  for (const list of activeLists(lists)) {
    const group = byListId.get(list.id);
    if (group) ordered.push({ list, tasks: [...group].sort(bySortOrder) });
  }

  const inbox = byListId.get(null);
  if (inbox) ordered.push({ list: null, tasks: [...inbox].sort(bySortOrder) });

  return ordered;
}
