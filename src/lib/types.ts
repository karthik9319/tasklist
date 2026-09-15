export type RecurrenceFreq = "daily" | "weekly" | "monthly";

export interface Recurrence {
  freq: RecurrenceFreq;
  interval: number;
}

export interface List {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
}

export interface Task {
  id: string;
  title: string;
  notes?: string | null;
  listId: string | null;
  parentTaskId: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
  recurrence?: Recurrence | null;
  completed: boolean;
  completedAt?: number | null;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
}
