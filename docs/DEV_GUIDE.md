VIA Planner — Руководство разработчика
=====================================

Цель документа: помочь быстро ориентироваться в проекте при новом запуске редактора. Краткая карта архитектуры, стора, роутов и сценариев работы.

Технологии
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (компоненты в `components/ui/*`)
- Zustand (persist, ключ `via_planner_state_v2`)
- Recharts (мини‑чарты), Framer Motion (лёгкие анимации)
- next-themes (light/dark, system)

Команды
- `pnpm dev` — локальная разработка (http://localhost:3000)
- `pnpm build` / `pnpm start` — прод сборка/запуск
- `pnpm lint` — ESLint
- `pnpm typecheck` — проверка типов

Структура проекта (основное)
- Роуты (App Router):
  - `app/page.tsx` — Dashboard (глобальные метрики, Zoom, цели, дедлайны)
  - `app/roadmap/page.tsx` — Roadmap (квартальные полосы + lanes по задачам)
  - `app/board/page.tsx` — Kanban (todo/in_progress/blocked/done)
  - `app/strategy/page.tsx` — Strategy Canvas (Vision/Mission/Thesis, NSM, Themes, OKR, Experiments)
  - `app/settings/page.tsx` — настройки, импорт/экспорт стор/стратегии
- Стили/тема: `app/globals.css`, `tailwind.config.ts`, `components/theme-toggle.tsx`
- Лейаут: `components/layout/{app-shell.tsx,sidebar.tsx,topbar.tsx}`
- UI (vendorized): `components/ui/{button.tsx,dialog.tsx,input.tsx,select.tsx,progress.tsx}`
- Домен: `lib/types.ts`, `lib/store.ts` (Zustand), `lib/progress.ts`, `lib/metrics.ts`, `config/app.ts`
- Стратегия/компоненты: см. раздел ниже

Конфигурация
- Конфиг приложения: `config/app.ts:1` (название, локаль, CTA, телефоны — не хардкодить в UI)
- Next.js: `next.config.mjs:1` (typedRoutes, outputFileTracingRoot)
- Tailwind: `tailwind.config.ts:1`

Модель данных (кратко)
- Типы в `lib/types.ts:1`:
  - `Strategy` (thesis, mission, vision, horizon, `northStar`, `guardrails`, `themes`)
  - `StrategicTheme` → массив `okrs: OKR[]`
  - `OKR` (objective, quarter, `keyResults: KeyResult[]`)
  - `KeyResult` (target/current — число или строка)
  - `Experiment` (stage/outcome, evidence)
  - `Objective`/`Milestone`/`Task` с привязками вверх: `themeId`, `okrId`, `experimentId`

Zustand‑стор (v2)
- Файл: `lib/store.ts:1`
- Ключ persist: `via_planner_state_v2`, `version = 2`
- Состояние: `PlannerState`
  - `strategy: Strategy`
  - `objectives: Objective[]`
  - `experiments: Experiment[]`
  - `zoom: 'H0' | 'H1' | 'H2' | 'H3'`
  - `filters: { objectiveId?, themeId?, okrId?, experimentId?, tags: string[] }`
- Сидинг: `seedStrategy()` + `seedObjective()` (при пустом сторе)
- Миграции:
  - v1 → v2: перенос objectives, подстановка стратегии и полей по умолчанию
  - При ре-гидратации пытается читать старый ключ `via_planner_state_v1` и импортировать
- Основные экшены:
  - глобальные: `reset`, `resetStrategy`, `setZoom`, `setFilters`, `selectObjective`
  - objectives/milestones/tasks: `add/update/delete`, `reorder*`, `moveTask`
  - привязки: `linkTaskToKR`, `linkTaskToExperiment`
  - стратегия: `setStrategy`, `addTheme/updateTheme`, `addOKR/updateOKR`, `addKR/updateKR`
  - эксперименты: `addExperiment`, `updateExperiment`, `changeExperimentStage`
  - импорт/экспорт: `exportJson`, `importJson`

Вычисления
- `lib/progress.ts:1` — прогресс по задачам: milestone/objective/overall
- `lib/metrics.ts:1` — стратегические метрики:
  - `calcKRProgress(kr)` → % по числовым KR
  - `calcOKRProgress(okr)` → среднее по KR
  - `calcThemeProgress(theme)` → среднее по OKR
  - `calcAlignmentScore(state)` → доля задач с `okrId` или `experimentId`
  - `pipelineCounts(experiments)` → Idea/Pilot/Validated/Paid

Стратегический слой — UI
- `/strategy` (`app/strategy/page.tsx:1`):
  - Canvas: `components/markdown-editor.tsx:1` (Mission/Vision), Thesis (input)
  - NSM: `components/nsm-card.tsx:1`, Guardrails: `components/guardrail-chip.tsx:1`
  - Themes: `components/theme-card.tsx:1`
  - OKR панель: `components/okr-list.tsx:1` (создание OKR, inline редактирование KR)
  - Experiments: `components/experiment-table.tsx:1` (фильтры по stage, outcome/evidence)
  - Alignment: `components/alignment-stat.tsx:1`

Dashboard — глобальный блок
- Компонент: `app/page.tsx:1` → секция Global
  - NSM + Guardrails + Alignment
  - Zoom `components/zoom-toggle.tsx:1`: H0/H1/H2/H3
    - H2 → показываются Themes (агрегаты)
    - H3 → краткое Vision (первое предложение)
  - Path to scale: счетчики из Experiments (`pipelineCounts`)

Roadmap / Board
- Roadmap: `app/roadmap/page.tsx:1`
  - Фильтры по Theme/OKR
  - Карточки `milestone` и `task` показывают KR/EXP бейджи (см. `components/milestone-card.tsx:1`, `components/task-card.tsx:1`)
  - DnD (hello-pangea/dnd) — перенос даты в таймлайне меняет `due`
- Board: `components/kanban-board.tsx:1`
  - Фильтры: Objective / Theme / OKR / Experiment / Tags
  - Контекстное меню задачи: привязка к KR/Experiment (Radix Dropdown Menu)

Импорт/Экспорт
- Глобальный стор: Settings → `components/json-import-export.tsx:1` (включает strategy/experiments/objectives)
- Только Strategy:
  - `/strategy` (кнопка Export Strategy JSON)
  - Settings → секция Strategy Import/Export (`app/settings/page.tsx:1`)

Темизация
- Тема — system по умолчанию. Toggle: `components/theme-toggle.tsx:1`
- Цвета/радиусы — через CSS-переменные в `app/globals.css:1`

DRAG & DROP
- Kanban: `@hello-pangea/dnd` (перетаскивание между колонками меняет `Task.status`)
- Roadmap Timeline: перенос milestone между кварталами обновляет `due` на 10 число первого месяца квартала
- Roadmap Task Lanes: `components/roadmap-task-lanes.tsx:1` — перенос между вехами внутри Objective

Быстрые сценарии
- Добавить OKR к теме: `/strategy` → блок OKR → “New OKR” → добавить KR
- Привязать задачу к KR: `/board` → ПКМ по карточке → “Link to KR…”
- Привязать задачу к Experiment: `/board` → ПКМ → “Link to Experiment…”
- Изменить Vision/Mission: `/strategy` → Strategy Canvas (Markdown)
- Экспорт стратегии: `/strategy` → “Export Strategy JSON”

Код‑стайл и оговорки
- Файлы и имена — только ASCII
- UI: большие скругления, мягкие тени, шрифты Inter/Manrope
- Компоненты shadcn/ui — вендоризированы в `components/ui/*`
- Recharts подключены динамически на клиенте

Известные ограничения
- Привязки KR/Experiment отображаются id (минимальная версия). Можно улучшить до читаемых имен/ссылок.
- Валидация форм — базовая, без zod/react-hook-form.

Где менять что
- Телефоны/CTA: `config/app.ts:1`
- Сид стратегии: `lib/store.ts:~80` (функция `seedStrategy`)
- Сид цели (Objective): `lib/store.ts:~20` (`seedObjective`)
- Миграции persist: `lib/store.ts:~250` (`migrate`, `onRehydrateStorage`)

Полезные ссылки внутри кода
- State и actions: `lib/store.ts:1`
- Типы домена: `lib/types.ts:1`
- Метрики/прогресс: `lib/metrics.ts:1`, `lib/progress.ts:1`
- Strategy Canvas: `app/strategy/page.tsx:1`
- Dashboard Global: `app/page.tsx:1`

