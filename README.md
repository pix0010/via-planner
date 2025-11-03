VIA Planner
=================

Modern planning and progress tracking panel built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui (vendorized), Zustand (persist), Recharts, and Framer Motion.

Quick start
- Prereqs: Node 18+, pnpm
- Install and run:
  - `pnpm i`
  - `pnpm dev`
- Open http://localhost:3000

Scripts
- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm start` — run production
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript

Architecture
- App Router at `app/`
- UI components in `components/` (shadcn/ui vendorized under `components/ui`)
- Domain types and helpers in `lib/`
- App config in `config/app.ts` (phones/CTA)

State and persistence
- Zustand store with `persist` in localStorage key `via_planner_state_v1` (see `lib/store.ts`)
- Includes `reset()` and simple schema migration/versioning
- Seeds a default Objective with Q4 2025 tasks on first run

Data model (TypeScript)
- See `lib/types.ts` for `Status`, `Metric`, `Task`, `Milestone`, `Objective`.

Pages
- `/` — Dashboard: overall ring, objectives with progress bars, nearest deadlines, metric mini-charts
- `/roadmap` — Timeline by quarters; drag milestones between quarters; inline due-date edit; quick create
- `/board` — Kanban (todo/in_progress/blocked/done) with filters by objective and tags; drag tasks between columns
- `/settings` — Import/Export JSON, Reset to defaults, Theme toggle

Key components
- `ProgressBar` (Radix Progress)
- `ProgressRing` (SVG ring)
- `ObjectiveCard`, `MilestoneCard`, `TaskCard`
- `RoadmapTimeline`, `KanbanBoard`
- `MetricChip` (Recharts sparkline)
- `QuickAdd` (Cmd/Ctrl+K command palette)
- `JsonImportExport`
- Editor dialogs: `components/editor/*`

Theming
- Uses `next-themes` with system default; toggle in topbar/settings

Import/Export
- In Settings page:
  - Export: downloads `via_planner_export.json`
  - Import: select a JSON file previously exported (or same schema)
  - Reset: resets store to seeded defaults

Editing and creating entities
- Objectives: Roadmap page → “New objective” button (dialog). Edit via same component.
- Milestones: Roadmap page (needs a target objective) → “New milestone”. Inline edit due-date.
- Tasks: Use command palette (Cmd/Ctrl+K) for quick add into selected milestone or task dialogs.

Notes
- Phone numbers and CTA copy are centralized in `config/app.ts`. Do not hardcode in components.
- Status colors: todo (neutral), in_progress (primary), blocked (warning), done (success).

Directory structure
```
app/
  layout.tsx
  globals.css
  providers.tsx
  page.tsx
  board/page.tsx
  roadmap/page.tsx
  settings/page.tsx
components/
  layout/{app-shell.tsx,sidebar.tsx,topbar.tsx}
  ui/{button.tsx,dialog.tsx,input.tsx,label.tsx,select.tsx,progress.tsx}
  {progress-bar.tsx,progress-ring.tsx,objective-card.tsx,milestone-card.tsx,task-card.tsx}
  {roadmap-timeline.tsx,kanban-board.tsx,metric-chip.tsx,quick-add.tsx,json-import-export.tsx}
  editor/{objective-editor.tsx,milestone-editor.tsx,task-editor.tsx}
config/app.ts
lib/{types.ts,store.ts,progress.ts,utils.ts}
public/favicon.svg
```

