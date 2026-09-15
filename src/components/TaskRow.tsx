import { formatTime12h } from "../lib/date";
import type { Task } from "../lib/types";
import { CheckboxIcon } from "./icons";

interface TaskRowProps {
  task: Task;
  subtaskProgress?: { completed: number; total: number };
  selected?: boolean;
  onToggle: () => void;
  onOpen: () => void;
}

export function TaskRow({ task, subtaskProgress, selected, onToggle, onOpen }: TaskRowProps) {
  const classNames = ["task-card"];
  if (selected) classNames.push("task-card--selected");
  if (task.completed) classNames.push("task-card--completed");

  return (
    <div
      className={classNames.join(" ")}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen();
      }}
    >
      <button
        className="task-card__checkbox"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        <CheckboxIcon checked={task.completed} />
      </button>
      <div className="task-card__title">{task.title}</div>
      {subtaskProgress && subtaskProgress.total > 0 && (
        <div className="task-card__meta">
          {subtaskProgress.completed}/{subtaskProgress.total}
        </div>
      )}
      {task.dueTime && <div className="task-card__time-badge">{formatTime12h(task.dueTime)}</div>}
    </div>
  );
}
