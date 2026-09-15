import { useState } from "react";
import { formatDueLabel } from "../lib/date";
import type { List, Task } from "../lib/types";
import { CheckboxIcon, ClockIcon, CloseIcon, PlusIcon } from "./icons";

interface TaskDetailPanelProps {
  task: Task;
  list: List | null;
  subtasks: Task[];
  onClose: () => void;
  onToggleTask: () => void;
  onToggleSubtask: (subtask: Task) => void;
  onAddSubtask: (title: string) => void;
  onNotesChange: (notes: string) => void;
}

export function TaskDetailPanel({
  task,
  list,
  subtasks,
  onClose,
  onToggleTask,
  onToggleSubtask,
  onAddSubtask,
  onNotesChange,
}: TaskDetailPanelProps) {
  const [notesDraft, setNotesDraft] = useState(task.notes ?? "");
  const [newStep, setNewStep] = useState("");
  const [addingStep, setAddingStep] = useState(false);

  const completedSteps = subtasks.filter((s) => s.completed).length;
  const progress = subtasks.length > 0 ? completedSteps / subtasks.length : 0;

  function submitNewStep() {
    const title = newStep.trim();
    if (title) onAddSubtask(title);
    setNewStep("");
    setAddingStep(false);
  }

  return (
    <div className="detail-panel">
      <div className="detail-panel__header">
        <div className="task-group__label" style={{ marginBottom: 0 }}>
          {list && <span className="task-group__dot" style={{ background: list.color }} />}
          <span>{list ? list.name : "Inbox"}</span>
        </div>
        <button className="detail-panel__close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
      </div>

      <div className="detail-panel__title-row">
        <button
          className="detail-panel__checkbox"
          onClick={onToggleTask}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          <CheckboxIcon checked={task.completed} size={23} />
        </button>
        <div className="detail-panel__title">{task.title}</div>
      </div>

      {task.dueDate && (
        <div className="detail-panel__due-badge">
          <ClockIcon size={15} />
          {formatDueLabel(task.dueDate, task.dueTime)}
        </div>
      )}

      <div className="detail-panel__section">
        <div className="detail-panel__section-label" style={{ marginBottom: 10 }}>
          Notes
        </div>
        <textarea
          className="detail-panel__notes"
          value={notesDraft}
          placeholder="Add notes..."
          onChange={(event) => setNotesDraft(event.target.value)}
          onBlur={() => onNotesChange(notesDraft)}
        />
      </div>

      <div className="detail-panel__section">
        <div className="detail-panel__section-header">
          <div className="detail-panel__section-label">Steps</div>
          {subtasks.length > 0 && (
            <div className="detail-panel__progress-count">
              {completedSteps}/{subtasks.length}
            </div>
          )}
        </div>

        {subtasks.length > 0 && (
          <div className="detail-panel__progress-bar">
            <div className="detail-panel__progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        )}

        <div className="checklist">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className={`checklist-row ${subtask.completed ? "checklist-row--completed" : ""}`}
            >
              <button
                className="checklist-row__checkbox"
                onClick={() => onToggleSubtask(subtask)}
                aria-label={subtask.completed ? "Mark step incomplete" : "Mark step complete"}
              >
                <CheckboxIcon checked={subtask.completed} size={18} />
              </button>
              <div className="checklist-row__title">{subtask.title}</div>
            </div>
          ))}

          {addingStep ? (
            <input
              autoFocus
              className="checklist-add-input"
              value={newStep}
              onChange={(event) => setNewStep(event.target.value)}
              onBlur={submitNewStep}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitNewStep();
                if (event.key === "Escape") {
                  setNewStep("");
                  setAddingStep(false);
                }
              }}
              placeholder="Step name"
            />
          ) : (
            <button className="checklist-row__add" onClick={() => setAddingStep(true)}>
              <PlusIcon size={15} />
              Add step
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
