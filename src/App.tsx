import { useEffect, useState } from "react";
import { ProgressRing } from "./components/ProgressRing";
import { QuickAddModal } from "./components/QuickAddModal";
import { Sidebar } from "./components/Sidebar";
import { TaskDetailPanel } from "./components/TaskDetailPanel";
import { TaskRow } from "./components/TaskRow";
import { PlusIcon } from "./components/icons";
import { useAllLists, useAllTasks } from "./hooks/useAppData";
import { seedDefaultListsIfEmpty } from "./lib/db";
import { createTask, toggleTaskCompletion, updateTaskNotes } from "./lib/mutations";
import {
  activeLists,
  groupByList,
  subtasksOf,
  tasksDueLater,
  tasksDueToday,
  tasksInInbox,
  tasksInList,
} from "./lib/queries";
import type { List, Task } from "./lib/types";
import type { View } from "./lib/view";

const TODAY_LABEL = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function App() {
  const tasks = useAllTasks();
  const lists = useAllLists();
  const [view, setView] = useState<View>({ type: "today" });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  useEffect(() => {
    void seedDefaultListsIfEmpty();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (event.key === "Escape") {
        setSelectedTaskId(null);
        setQuickAddOpen(false);
        return;
      }

      if (!isTyping && (event.key === "a" || event.key === "n")) {
        event.preventDefault();
        setQuickAddOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!tasks || !lists) {
    return <div className="app-shell" />;
  }

  const viewTasks = getViewTasks(view, tasks);
  const selectedTask = selectedTaskId ? (tasks.find((t) => t.id === selectedTaskId) ?? null) : null;
  const selectedList = selectedTask ? (lists.find((l) => l.id === selectedTask.listId) ?? null) : null;
  const selectedSubtasks = selectedTask ? subtasksOf(tasks, selectedTask.id) : [];

  const completedCount = viewTasks.filter((t) => t.completed).length;
  const totalCount = viewTasks.length;
  const groups = groupByList(viewTasks, lists);
  const defaultListId = view.type === "list" ? view.listId : null;

  return (
    <div className="app-shell">
      <Sidebar
        tasks={tasks}
        lists={lists}
        view={view}
        onSelectView={(next) => {
          setView(next);
          setSelectedTaskId(null);
        }}
      />

      <div className="content">
        <div className="content__scroll">
          <div className="view-header">
            <div>
              <div className="view-header__title">{viewTitle(view, lists)}</div>
              <div className="view-header__subtitle">
                {view.type === "today"
                  ? `${TODAY_LABEL} · ${totalCount - completedCount} left`
                  : `${totalCount} task${totalCount === 1 ? "" : "s"}`}
              </div>
            </div>
            {view.type === "today" && totalCount > 0 && (
              <ProgressRing completed={completedCount} total={totalCount} />
            )}
          </div>

          {groups.length === 0 ? (
            <div className="empty-state">Nothing here yet.</div>
          ) : (
            <div className="task-groups">
              {groups.map(({ list, tasks: groupTasks }) => (
                <div key={list ? list.id : "inbox"}>
                  {view.type !== "list" && (
                    <div className="task-group__label">
                      <span
                        className="task-group__dot"
                        style={{ background: list ? list.color : "var(--text-faint)" }}
                      />
                      {list ? list.name : "Inbox"}
                    </div>
                  )}
                  <div className="task-group__rows">
                    {groupTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        subtaskProgress={subtaskProgress(tasks, task.id)}
                        selected={task.id === selectedTaskId}
                        onToggle={() => toggleTaskCompletion(task)}
                        onOpen={() => setSelectedTaskId(task.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="fab" onClick={() => setQuickAddOpen(true)} aria-label="Add task">
            <PlusIcon size={23} />
          </button>
        </div>

        {selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            list={selectedList}
            subtasks={selectedSubtasks}
            onClose={() => setSelectedTaskId(null)}
            onToggleTask={() => toggleTaskCompletion(selectedTask)}
            onToggleSubtask={(subtask) => toggleTaskCompletion(subtask)}
            onAddSubtask={(title) => createTask({ title, parentTaskId: selectedTask.id })}
            onNotesChange={(notes) => updateTaskNotes(selectedTask.id, notes)}
          />
        )}

        {quickAddOpen && (
          <QuickAddModal
            lists={activeLists(lists)}
            defaultListId={defaultListId}
            onClose={() => setQuickAddOpen(false)}
            onSubmit={async (input) => {
              await createTask(input);
              setQuickAddOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function getViewTasks(view: View, tasks: Task[]): Task[] {
  switch (view.type) {
    case "today":
      return tasksDueToday(tasks);
    case "upcoming":
      return tasksDueLater(tasks);
    case "inbox":
      return tasksInInbox(tasks);
    case "list":
      return tasksInList(tasks, view.listId);
  }
}

function viewTitle(view: View, lists: List[]): string {
  switch (view.type) {
    case "today":
      return "Today";
    case "upcoming":
      return "Upcoming";
    case "inbox":
      return "Inbox";
    case "list":
      return lists.find((l) => l.id === view.listId)?.name ?? "List";
  }
}

function subtaskProgress(tasks: Task[], parentId: string): { completed: number; total: number } | undefined {
  const subtasks = subtasksOf(tasks, parentId);
  if (subtasks.length === 0) return undefined;
  return { completed: subtasks.filter((s) => s.completed).length, total: subtasks.length };
}
