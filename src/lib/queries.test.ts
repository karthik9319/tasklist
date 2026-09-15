import { describe, expect, it } from "vitest";
import { addDays, toDateString } from "./date";
import {
  groupByList,
  subtasksOf,
  tasksDueLater,
  tasksDueToday,
  tasksInInbox,
  tasksInList,
} from "./queries";
import type { List, Task } from "./types";

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: crypto.randomUUID(),
    title: "task",
    listId: null,
    parentTaskId: null,
    completed: false,
    sortOrder: 0,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

function makeList(overrides: Partial<List>): List {
  return {
    id: crypto.randomUUID(),
    name: "List",
    color: "red",
    sortOrder: 0,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

const today = toDateString(new Date());
const tomorrow = toDateString(addDays(new Date(), 1));

describe("tasksDueToday / tasksDueLater", () => {
  const tasks = [
    makeTask({ id: "a", dueDate: today }),
    makeTask({ id: "b", dueDate: tomorrow }),
    makeTask({ id: "c", dueDate: null }),
    makeTask({ id: "d", parentTaskId: "a", dueDate: today }),
  ];

  it("only includes top-level tasks due today", () => {
    expect(tasksDueToday(tasks).map((t) => t.id)).toEqual(["a"]);
  });

  it("only includes top-level tasks due after today", () => {
    expect(tasksDueLater(tasks).map((t) => t.id)).toEqual(["b"]);
  });
});

describe("tasksInInbox / tasksInList", () => {
  const tasks = [
    makeTask({ id: "a", listId: null }),
    makeTask({ id: "b", listId: "work" }),
    makeTask({ id: "c", listId: "work", parentTaskId: "b" }),
  ];

  it("finds top-level tasks with no list", () => {
    expect(tasksInInbox(tasks).map((t) => t.id)).toEqual(["a"]);
  });

  it("finds top-level tasks in a given list, excluding subtasks", () => {
    expect(tasksInList(tasks, "work").map((t) => t.id)).toEqual(["b"]);
  });
});

describe("subtasksOf", () => {
  it("returns children sorted by sortOrder", () => {
    const parent = makeTask({ id: "p" });
    const tasks = [
      parent,
      makeTask({ id: "s2", parentTaskId: "p", sortOrder: 1 }),
      makeTask({ id: "s1", parentTaskId: "p", sortOrder: 0 }),
    ];
    expect(subtasksOf(tasks, "p").map((t) => t.id)).toEqual(["s1", "s2"]);
  });
});

describe("groupByList", () => {
  it("orders groups by list sortOrder and puts ungrouped tasks last", () => {
    const lists = [makeList({ id: "personal", sortOrder: 1 }), makeList({ id: "work", sortOrder: 0 })];
    const tasks = [
      makeTask({ id: "a", listId: "personal" }),
      makeTask({ id: "b", listId: "work" }),
      makeTask({ id: "c", listId: null }),
    ];

    const groups = groupByList(tasks, lists);

    expect(groups.map((g) => g.list?.id ?? "inbox")).toEqual(["work", "personal", "inbox"]);
  });

  it("omits lists that have no matching tasks", () => {
    const lists = [makeList({ id: "work" }), makeList({ id: "empty-list" })];
    const tasks = [makeTask({ id: "a", listId: "work" })];

    const groups = groupByList(tasks, lists);

    expect(groups.map((g) => g.list?.id)).toEqual(["work"]);
  });
});
