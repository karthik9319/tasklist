import { useMemo, useState } from "react";
import { formatDueLabel } from "../lib/date";
import { parseQuickAdd } from "../lib/nlp";
import type { List } from "../lib/types";
import { ClockIcon } from "./icons";

interface QuickAddModalProps {
  lists: List[];
  defaultListId: string | null;
  onSubmit: (input: {
    title: string;
    dueDate: string | null;
    dueTime: string | null;
    listId: string | null;
  }) => void;
  onClose: () => void;
}

export function QuickAddModal({ lists, defaultListId, onSubmit, onClose }: QuickAddModalProps) {
  const [text, setText] = useState("");
  const parsed = useMemo(() => parseQuickAdd(text), [text]);
  const list = lists.find((l) => l.id === defaultListId) ?? null;

  function submit() {
    const title = parsed.title.trim();
    if (!title) return;
    onSubmit({ title, dueDate: parsed.dueDate, dueTime: parsed.dueTime, listId: defaultListId });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="quick-add-modal" onClick={(event) => event.stopPropagation()}>
        <input
          autoFocus
          className="quick-add-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
            if (event.key === "Escape") onClose();
          }}
          placeholder='Add a task... try "tomorrow 3pm"'
        />

        <div className="quick-add-divider" />

        <div className="quick-add-chips">
          {parsed.dueDate && (
            <div className="chip chip--accent">
              <ClockIcon size={14} />
              {formatDueLabel(parsed.dueDate, parsed.dueTime)}
            </div>
          )}
          <div className="chip chip--muted">
            <span className="chip__dot" style={{ background: list?.color ?? "var(--text-faint)" }} />
            {list ? list.name : "Inbox"}
          </div>
        </div>

        <div className="quick-add-footer">
          <div className="quick-add-hint">Type naturally — dates and times parse automatically</div>
          <div className="quick-add-actions">
            <button className="btn-cancel" onClick={onClose}>
              Esc to cancel
            </button>
            <button className="btn-primary" onClick={submit}>
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
