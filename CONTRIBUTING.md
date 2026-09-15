# Contributing

Thanks for considering a contribution to Tasklist.

## Setup

```bash
npm install
npm run dev          # web, in the browser
npm run tauri dev    # desktop app (needs Rust installed)
```

## Before opening a PR

- `npm run lint` — no new lint errors
- `npm test` — tests pass
- Keep PRs focused: one change per PR is easier to review than a bundle of unrelated ones
- For anything beyond a small fix, open an issue first to discuss the approach — see [`DESIGN.md`](./DESIGN.md) for what's intentionally in/out of scope for v1

## Reporting bugs / requesting features

Open a GitHub issue. For feature requests, please check `DESIGN.md` first — some things (collaboration, tags, priorities, integrations) are deliberately deferred past v1 to keep the app calm and simple; that's a scope decision, not an oversight.
