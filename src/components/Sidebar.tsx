import { useState } from "react";
import { createList } from "../lib/mutations";
import { activeLists, tasksDueLater, tasksDueToday, tasksInInbox, tasksInList } from "../lib/queries";
import { computeStreak } from "../lib/streak";
import type { List, Task } from "../lib/types";
import type { View } from "../lib/view";
import { FlameIcon, InboxIcon, PlusIcon, TodayIcon, UpcomingIcon } from "./icons";

interface SidebarProps {
  tasks: Task[];
  lists: List[];
  view: View;
  onSelectView: (view: View) => void;
}

export function Sidebar({ tasks, lists, view, onSelectView }: SidebarProps) {
  const [addingList, setAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");

  const inboxCount = tasksInInbox(tasks).filter((t) => !t.completed).length;
  const todayCount = tasksDueToday(tasks).filter((t) => !t.completed).length;
  const upcomingCount = tasksDueLater(tasks).filter((t) => !t.completed).length;
  const streak = computeStreak(tasks);

  async function submitNewList() {
    const name = newListName.trim();
    if (name) await createList(name);
    setNewListName("");
    setAddingList(false);
  }

  return (
    <div className="sidebar">
      <div className="sidebar__brand">Tasklist</div>

      <div className="nav-list">
        <button
          className={`nav-item ${view.type === "inbox" ? "nav-item--active" : ""}`}
          onClick={() => onSelectView({ type: "inbox" })}
        >
          <InboxIcon />
          <span className="nav-item__label">Inbox</span>
          <span className="nav-item__count">{inboxCount}</span>
        </button>
        <button
          className={`nav-item ${view.type === "today" ? "nav-item--active" : ""}`}
          onClick={() => onSelectView({ type: "today" })}
        >
          <TodayIcon />
          <span className="nav-item__label">Today</span>
          <span className="nav-item__count">{todayCount}</span>
        </button>
        <button
          className={`nav-item ${view.type === "upcoming" ? "nav-item--active" : ""}`}
          onClick={() => onSelectView({ type: "upcoming" })}
        >
          <UpcomingIcon />
          <span className="nav-item__label">Upcoming</span>
          <span className="nav-item__count">{upcomingCount}</span>
        </button>
      </div>

      <div className="sidebar__divider" />
      <div className="sidebar__section-label">Lists</div>

      <div className="nav-list">
        {activeLists(lists).map((list) => {
          const count = tasksInList(tasks, list.id).filter((t) => !t.completed).length;
          return (
            <button
              key={list.id}
              className={`nav-item ${view.type === "list" && view.listId === list.id ? "nav-item--active" : ""}`}
              onClick={() => onSelectView({ type: "list", listId: list.id })}
            >
              <span className="list-item__dot" style={{ background: list.color }} />
              <span className="nav-item__label">{list.name}</span>
              <span className="nav-item__count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar__spacer" />

      {streak > 0 && (
        <div className="streak-badge">
          <FlameIcon size={17} />
          {streak} day streak
        </div>
      )}

      {addingList ? (
        <input
          autoFocus
          className="new-list-input"
          value={newListName}
          onChange={(event) => setNewListName(event.target.value)}
          onBlur={submitNewList}
          onKeyDown={(event) => {
            if (event.key === "Enter") submitNewList();
            if (event.key === "Escape") {
              setNewListName("");
              setAddingList(false);
            }
          }}
          placeholder="List name"
        />
      ) : (
        <button className="new-list-row" onClick={() => setAddingList(true)}>
          <PlusIcon />
          New List
        </button>
      )}
    </div>
  );
}
