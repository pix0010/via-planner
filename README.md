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

Документация
- Быстрый ориентир для редактора: `docs/DEV_GUIDE.md`
 
Upgrade: Strategy Layer (v2)
- State key: `via_planner_state_v2` with migration from v1.
- Added entities (see `lib/types.ts`):
  - `Strategy` (thesis, mission, vision, horizon, NSM, guardrails, themes)
  - `StrategicTheme`, `OKR`, `KeyResult`, `Experiment` (+ stages/outcomes)
  - Links: `Task.okrId`, `Task.experimentId`, `Milestone.okrId`, `Objective.themeId`
- Store additions (see `lib/store.ts`):
  - `strategy`, `experiments`, `zoom` (H0/H1/H2/H3)
  - Actions: `setStrategy()`, `addTheme/updateTheme`, `addOKR/updateOKR`, `addKR/updateKR`
  - Experiments: `addExperiment/updateExperiment/changeExperimentStage`
  - Linking: `linkTaskToKR`, `linkTaskToExperiment`
  - Import/Export now includes strategy + experiments
 
New route
- `/strategy` — Strategy Canvas & Global controls:
  - Edit Thesis (text), Mission/Vision (Markdown with preview)
  - NSM ring + guardrails chips
  - Themes grid with progress (avg OKR)
  - OKR panel for selected theme (create/edit OKR and KRs)
  - Experiments table with stage/outcome and evidence
  - Import/Export Strategy JSON
  - Alignment score (доля задач, привязанных к KR/Experiments)

Dashboard (`/`) updates
- Top “Global”: NSM ring, guardrails, Alignment score, Zoom (H0/H1/H2/H3)
  - H2: shows Themes progress
  - H3: shows Vision (1 предложение)
- “Path to scale” (Idea → Pilot → Validated → Paid) из Experiments

Roadmap (`/roadmap`) updates
- Filters by Theme and OKR
- Milestone/Task badges for linked KR/Experiment

Board (`/board`) updates
- Filters: Objective, Theme, OKR, Experiment, Tags
- Context menu on task: “Link to KR…”, “Link to Experiment…”

Strategy usage
- Edit global strategy at `/strategy`. All changes persist.
- Link tasks to KRs/Experiments via Board context menu.
- Zoom selector (H0/H1/H2/H3) affects global block on Dashboard.

Import/Export
- App-wide (state) — Settings → Import/Export
- Strategy-only — Settings → Strategy Import/Export, либо на `/strategy`

Metrics calculations (`lib/metrics.ts`)
- `calcKRProgress(kr)` — процент выполнения KR (числовые цели)
- `calcOKRProgress(okr)` — среднее по KR
- `calcThemeProgress(theme)` — среднее по OKR
- `calcAlignmentScore(store)` — доля задач с `okrId` или `experimentId`

Migration
- Хранилище обновлено до `via_planner_state_v2` (версии 2).
- При первом запуске попытается перенести данные из `via_planner_state_v1` автоматически.

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
