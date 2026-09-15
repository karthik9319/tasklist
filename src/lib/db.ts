import Dexie, { type Table } from "dexie";
import type { List, Task } from "./types";

class StillDB extends Dexie {
  tasks!: Table<Task, string>;
  lists!: Table<List, string>;

  constructor() {
    super("still");
    this.version(1).stores({
      tasks: "id, listId, parentTaskId, dueDate, completed, deletedAt",
      lists: "id, sortOrder, deletedAt",
    });
  }
}

export const db = new StillDB();

const DEFAULT_LISTS: Array<Pick<List, "name" | "color">> = [
  { name: "Work", color: "var(--list-work)" },
  { name: "Personal", color: "var(--list-personal)" },
  { name: "Home", color: "var(--list-home)" },
];

export async function seedDefaultListsIfEmpty(): Promise<void> {
  // Wrapped in a transaction so two concurrent calls (e.g. React StrictMode's
  // double-invoked effect in dev) can't both see an empty table and double-seed.
  await db.transaction("rw", db.lists, async () => {
    const count = await db.lists.count();
    if (count > 0) return;
    const now = Date.now();
    await db.lists.bulkAdd(
      DEFAULT_LISTS.map((list, index) => ({
        id: crypto.randomUUID(),
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
        ...list,
      })),
    );
  });
}
