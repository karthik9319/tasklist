# Design notes

## Scope

Tasklist is deliberately a **bare-minimum MVP**, aimed at calm personal use (not teams). Things included, and things left out on purpose:

**In v1**
- Quick add with natural-language dates
- Lists, due dates, Today/Upcoming views
- Subtasks (one level deep)
- Basic recurrence (daily/weekly/monthly)
- Keyboard shortcuts
- Local-first storage, synced later

**Deliberately out of v1** (revisit only once the core loop feels solid)
- Collaboration / sharing / assignees
- Tags/labels, priority levels
- Pomodoro timer, habit tracker, kanban board
- Attachments, email/chat integrations

## Data model

```
Task
├─ id            uuid
├─ title         string
├─ notes         string?
├─ listId        FK → List, nullable   (null = "Inbox")
├─ parentTaskId  FK → Task, nullable   (set = this is a subtask)
├─ dueDate       date?
├─ dueTime       time?
├─ recurrence    json?                 ({freq: daily|weekly|monthly, interval: n})
├─ completed     bool
├─ completedAt   timestamp?
├─ sortOrder     int
├─ createdAt     timestamp
├─ updatedAt     timestamp             (drives sync/conflict resolution)
└─ deletedAt     timestamp?            (soft delete, needed for sync)

List
├─ id          uuid
├─ name        string
├─ sortOrder   int
├─ createdAt   timestamp
├─ updatedAt   timestamp
└─ deletedAt   timestamp?
```

Key decisions:

- **Subtasks are just `Task` rows with `parentTaskId` set** — no separate checklist table. Only one level of nesting is allowed.
- **Recurrence generates a new `Task` row on completion**, rather than one task representing infinite future occurrences. Keeps "Today"/"Upcoming" queries a plain filter, no RRULE expansion needed.
- **`updatedAt` + soft delete (`deletedAt`) on every row**, even though multi-device sync isn't built yet — retrofitting these later usually means a data migration; adding them now is free.
- **No `tags`, `priority`, or `assignee` fields** in v1, matching the scope decision above.

Views map directly to queries:
- *Today*: `dueDate = today AND completed = false`
- *Upcoming*: `dueDate > today AND completed = false`, grouped by date
- *Inbox*: `listId IS NULL`
- *List view*: `listId = X`, ordered by `sortOrder`

## UI direction

Warm, motivating aesthetic: cream background, coral-to-amber gradient accent, a completion progress ring and streak counter on the Today view, and a small celebratory flourish on completed tasks. See the published design canvas for the full screen set (desktop + iPhone).
