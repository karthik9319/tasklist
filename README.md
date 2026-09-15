# Tasklist

A calm, minimal to-do list app for people who want a task manager that gets out of the way.

Built for web and desktop (via [Tauri](https://tauri.app)) from one React codebase. Local-first — your tasks live on your device, no account required.

## Features

- **Quick add with natural language** — type "call dentist tomorrow 3pm" and the due date/time is parsed automatically
- **Lists** — organize tasks into a handful of named lists (Work, Personal, Home, ...)
- **Today / Upcoming views** — see what's due now and what's coming up
- **Subtasks / checklists** — break a task into steps, one level deep
- **Recurring tasks** — daily, weekly, or monthly repeats
- **Keyboard-first** — quick add, complete, and navigate without leaving the keyboard
- **Local-first storage** — works offline, no account, no server round-trips for basic use

See [`DESIGN.md`](./DESIGN.md) for the data model and the feature decisions behind v1 (what's in, and what's deliberately left out).

## Tech stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vitejs.dev)
- [Tauri](https://tauri.app) for the native desktop shell (macOS / Windows / Linux)
- [Dexie](https://dexie.org) (IndexedDB) for local-first storage — same storage layer on web and desktop
- [chrono-node](https://github.com/wanasit/chrono) for natural-language date parsing
- [Vitest](https://vitest.dev) for unit tests

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [Rust](https://www.rust-lang.org/tools/install) (only needed to build/run the desktop app via Tauri)

### Development

```bash
npm install

# Web only, in the browser
npm run dev

# Desktop app (requires Rust toolchain)
npm run tauri dev
```

### Building

```bash
# Web build
npm run build

# Desktop app installer/binary
npm run tauri build
```

### Tests

```bash
npm test
```

## Project structure

```text
src/                  React app (shared by web + desktop)
  components/         UI components
  lib/                Data layer (Dexie), recurrence logic, NL date parsing
  hooks/               React hooks for tasks/lists
src-tauri/            Tauri (Rust) desktop shell — window config, native bits
```

## Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
