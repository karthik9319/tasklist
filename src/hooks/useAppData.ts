import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";
import type { List, Task } from "../lib/types";

export function useAllTasks(): Task[] | undefined {
  return useLiveQuery(() => db.tasks.toArray(), []);
}

export function useAllLists(): List[] | undefined {
  return useLiveQuery(() => db.lists.toArray(), []);
}
