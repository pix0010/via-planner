"use client";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Experiment,
  ExperimentStage,
  KeyResult,
  Milestone,
  Objective,
  OKR,
  PlannerState,
  StrategicTheme,
  Strategy,
  Task
} from './types';
import { APP_CONFIG } from '@/config/app';
import { uid } from './utils';

const PERSIST_KEY = 'via_planner_state_v2';
const VERSION = 2;

type Actions = {
  setHasHydrated: (v: boolean) => void;
  reset: () => void;
  resetStrategy: () => void;
  selectObjective: (id?: string) => void;
  setFilters: (filters: Partial<PlannerState['filters']>) => void;
  setZoom: (z: PlannerState['zoom']) => void;

  addObjective: (obj: Objective) => void;
  updateObjective: (id: string, patch: Partial<Objective>) => void;
  deleteObjective: (id: string) => void;

  addMilestone: (objectiveId: string, ms: Milestone) => void;
  updateMilestone: (
    objectiveId: string,
    milestoneId: string,
    patch: Partial<Milestone>
  ) => void;
  deleteMilestone: (objectiveId: string, milestoneId: string) => void;
  reorderMilestones: (objectiveId: string, fromIndex: number, toIndex: number) => void;

  addTask: (objectiveId: string, milestoneId: string, task: Task) => void;
  updateTask: (
    objectiveId: string,
    milestoneId: string,
    taskId: string,
    patch: Partial<Task>
  ) => void;
  deleteTask: (objectiveId: string, milestoneId: string, taskId: string) => void;
  reorderTasks: (
    objectiveId: string,
    milestoneId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  moveTask: (args: {
    fromObjectiveId: string;
    fromMilestoneId: string;
    toObjectiveId: string;
    toMilestoneId: string;
    taskId: string;
    toIndex?: number;
  }) => void;
  linkTaskToKR: (objectiveId: string, milestoneId: string, taskId: string, krId?: string) => void;
  linkTaskToExperiment: (
    objectiveId: string,
    milestoneId: string,
    taskId: string,
    experimentId?: string
  ) => void;

  // Strategy layer
  setStrategy: (partial: Partial<Strategy>) => void;
  addTheme: (theme: StrategicTheme) => void;
  updateTheme: (id: string, patch: Partial<StrategicTheme>) => void;
  addOKR: (themeId: string, okr: OKR) => void;
  updateOKR: (themeId: string, okrId: string, patch: Partial<OKR>) => void;
  addKR: (themeId: string, okrId: string, kr: KeyResult) => void;
  updateKR: (themeId: string, okrId: string, krId: string, patch: Partial<KeyResult>) => void;

  addExperiment: (exp: Experiment) => void;
  updateExperiment: (id: string, patch: Partial<Experiment>) => void;
  changeExperimentStage: (id: string, stage: ExperimentStage) => void;

  exportJson: () => string;
  importJson: (json: string) => { ok: boolean; error?: string };
};

const seedObjective = (): Objective => ({
  id: 'obj-via-q4',
  title: 'Запуск пилотов VIA: флаер + лендинг (Q4 2025)',
  why:
    'Получить 2–3 пилота у локальных салонов (Valencia). Упростить вход: проф. флаер, демо-номер, одностраничник.',
  owner: 'Anton',
  start: '2025-11-03',
  end: '2025-11-15',
  status: 'in_progress',
  metrics: [
    { id: 'm1', name: 'Pilots scheduled', target: 3, current: 0, unit: '' },
    { id: 'm2', name: 'Flyers printed', target: 500, current: 0, unit: 'pcs' }
  ],
  milestones: [
    {
      id: 'ms-flyer',
      title: 'Флаер: проф. вёрстка и печать',
      due: '2025-11-06',
      tasks: [
        {
          id: 't-brief',
          title: 'Собрать бриф и материалы для дизайнера (тексты, номера, QR, рефы)',
          status: 'done',
          tags: ['flyer']
        },
        {
          id: 't-fiverr',
          title: 'Выбрать дизайнера на Fiverr (3 кандидата → 1)',
          status: 'in_progress',
          tags: ['flyer']
        },
        { id: 't-iterate', title: 'Итерация макета (1–2 круга)', status: 'todo', tags: ['flyer'] },
        {
          id: 't-prepress',
          title: 'Готовность к печати: PDF/X-1a, CMYK, 300dpi, вылеты 3 мм',
          status: 'todo',
          tags: ['flyer']
        },
        {
          id: 't-qr',
          title: `QR: ${APP_CONFIG.phoneTel}, WhatsApp:${APP_CONFIG.phoneWhatsApp} (префилл); тест с 3–4 м`,
          status: 'todo',
          tags: ['flyer']
        },
        {
          id: 't-print',
          title: 'Отправить в печать (A5 двусторонний, 500–1000 шт)',
          status: 'todo',
          tags: ['flyer']
        }
      ]
    },
    {
      id: 'ms-landing',
      title: 'Одностраничник v1',
      due: '2025-11-07',
      tasks: [
        {
          id: 't-hero',
          title: 'Герой+CTA: tel/WA, «Tu administrador telefónico»',
          status: 'in_progress',
          tags: ['landing']
        },
        { id: 't-benefits', title: 'Tríada de beneficios (3 карточки)', status: 'todo', tags: ['landing'] },
        {
          id: 't-how',
          title: 'Секция «Cómo empezar»: демо, 1 día, recepción paralela',
          status: 'todo',
          tags: ['landing']
        },
        {
          id: 't-analytics',
          title: 'Подключить Plausible/GA4, события по кликам tel/WA',
          status: 'todo',
          tags: ['landing']
        },
        { id: 't-seo', title: 'SEO/OG: мета-теги, фавикон, OpenGraph', status: 'todo', tags: ['landing'] },
        {
          id: 't-deploy',
          title: 'Деплой (временный домен; via-demo.es — позже)',
          status: 'todo',
          tags: ['landing']
        }
      ]
    },
    {
      id: 'ms-field',
      title: 'Полевой запуск',
      due: '2025-11-10',
      tasks: [
        {
          id: 't-list',
          title: 'Список салонов (40–60) + приоритизация по трафику',
          status: 'todo',
          tags: ['field']
        },
        {
          id: 't-visit',
          title: 'Визиты 10–15: демо 90 сек, оставить флаер',
          status: 'todo',
          tags: ['field']
        },
        {
          id: 't-follow',
          title: 'Фоллоу-апы в WhatsApp с ссылками/слотами',
          status: 'todo',
          tags: ['field']
        },
        {
          id: 't-pilots',
          title: 'Назначить 2–3 пилота (слоты на установку)',
          status: 'todo',
          tags: ['field']
        }
      ]
    }
  ]
});

type Store = PlannerState & Actions;

const seedStrategy = (): Strategy => ({
  id: 'strat-2025',
  thesis:
    'VIA — teléfono siempre atendido para SMB: reservas al instante, sin esperas.',
  mission:
    'Automatizar la administración telefónica **sin perder el toque humano**: atender, reservar, confirmar y reprogramar 24/7.',
  vision:
    'Ser el proveedor de confianza de agentes de voz para SMB en la Comunitat Valenciana y, después, en toda España.',
  horizon: { h1_year: 2025, h2_year: 2026, h3_year: 2028 },
  northStar: {
    id: 'nsm',
    name: 'Reservas confirmadas por VIA (mensuales)',
    target: 200,
    current: 0,
    unit: 'res/mes'
  },
  guardrails: [
    { id: 'g1', name: 'Tiempo medio de respuesta', target: 2, current: 0, unit: 's', leading: true },
    { id: 'g2', name: 'CSAT post-llamada', target: 4.6, current: 0, unit: '/5' },
    { id: 'g3', name: 'Costo por reserva', target: 0.35, current: 0, unit: '€' }
  ],
  themes: [
    { id: 'th1', title: 'Pilotos y casos de éxito', narrative: 'Стабильные пилоты, публичные кейсы, social proof.', okrs: [] },
    { id: 'th2', title: 'Producto y calidad', narrative: 'NPS/CSAT, точность, тёплый перевод, гарантия SLA.', okrs: [] },
    { id: 'th3', title: 'Go-To-Market', narrative: 'Флаеры, лендинги, партнёрки, соцсети, рефералки.', okrs: [] },
    { id: 'th4', title: 'Infraestructura y coste', narrative: 'Низкая себестоимость минуты, телко и TTS/STT оптимизация.', okrs: [] }
  ]
});

const initial: PlannerState = {
  version: VERSION,
  strategy: seedStrategy(),
  objectives: [],
  experiments: [],
  zoom: 'H0',
  selectedObjectiveId: undefined,
  filters: { objectiveId: undefined, themeId: undefined, okrId: undefined, experimentId: undefined, tags: [] },
  hasHydrated: false
};

export const usePlanner = create<Store>()(
  persist(
    (set, get) => ({
      ...initial,

      setHasHydrated: (v) => set({ hasHydrated: v }),
      reset: () => set({ ...initial, objectives: [seedObjective()] }),
      resetStrategy: () => set({ strategy: seedStrategy() }),
      selectObjective: (id) => set({ selectedObjectiveId: id }),
      setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
      setZoom: (z) => set({ zoom: z }),

      addObjective: (obj) => set({ objectives: [...get().objectives, obj] }),
      updateObjective: (id, patch) =>
        set({
          objectives: get().objectives.map((o) => (o.id === id ? { ...o, ...patch } : o))
        }),
      deleteObjective: (id) => set({ objectives: get().objectives.filter((o) => o.id !== id) }),

      addMilestone: (objectiveId, ms) =>
        set({
          objectives: get().objectives.map((o) =>
            o.id === objectiveId ? { ...o, milestones: [...o.milestones, ms] } : o
          )
        }),
      updateMilestone: (objectiveId, milestoneId, patch) =>
        set({
          objectives: get().objectives.map((o) =>
            o.id !== objectiveId
              ? o
              : {
                  ...o,
                  milestones: o.milestones.map((m) => (m.id === milestoneId ? { ...m, ...patch } : m))
                }
          )
        }),
      deleteMilestone: (objectiveId, milestoneId) =>
        set({
          objectives: get().objectives.map((o) =>
            o.id !== objectiveId
              ? o
              : { ...o, milestones: o.milestones.filter((m) => m.id !== milestoneId) }
          )
        }),
      reorderMilestones: (objectiveId, fromIndex, toIndex) =>
        set({
          objectives: get().objectives.map((o) => {
            if (o.id !== objectiveId) return o;
            const arr = [...o.milestones];
            const [it] = arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, it);
            return { ...o, milestones: arr };
          })
        }),

      addTask: (objectiveId, milestoneId, task) =>
        set({
          objectives: get().objectives.map((o) =>
            o.id !== objectiveId
              ? o
              : {
                  ...o,
                  milestones: o.milestones.map((m) =>
                    m.id === milestoneId ? { ...m, tasks: [...m.tasks, task] } : m
                  )
                }
          )
        }),
      updateTask: (objectiveId, milestoneId, taskId, patch) =>
        set({
          objectives: get().objectives.map((o) =>
            o.id !== objectiveId
              ? o
              : {
                  ...o,
                  milestones: o.milestones.map((m) =>
                    m.id !== milestoneId
                      ? m
                      : {
                          ...m,
                          tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t))
                        }
                  )
                }
          )
        }),
      deleteTask: (objectiveId, milestoneId, taskId) =>
        set({
          objectives: get().objectives.map((o) =>
            o.id !== objectiveId
              ? o
              : {
                  ...o,
                  milestones: o.milestones.map((m) =>
                    m.id !== milestoneId ? m : { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) }
                  )
                }
          )
        }),
      reorderTasks: (objectiveId, milestoneId, fromIndex, toIndex) =>
        set({
          objectives: get().objectives.map((o) => {
            if (o.id !== objectiveId) return o;
            return {
              ...o,
              milestones: o.milestones.map((m) => {
                if (m.id !== milestoneId) return m;
                const arr = [...m.tasks];
                const [it] = arr.splice(fromIndex, 1);
                arr.splice(toIndex, 0, it);
                return { ...m, tasks: arr };
              })
            };
          })
        }),
      moveTask: ({ fromObjectiveId, fromMilestoneId, toObjectiveId, toMilestoneId, taskId, toIndex }) => {
        moveTaskHelper({ fromObjectiveId, fromMilestoneId, toObjectiveId, toMilestoneId, taskId, toIndex });
      },
      linkTaskToKR: (objectiveId, milestoneId, taskId, krId) =>
        set({
          objectives: get().objectives.map((o) =>
            o.id !== objectiveId
              ? o
              : {
                  ...o,
                  milestones: o.milestones.map((m) =>
                    m.id === milestoneId
                      ? { ...m, tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, okrId: krId } : t)) }
                      : m
                  )
                }
          )
        }),
      linkTaskToExperiment: (objectiveId, milestoneId, taskId, experimentId) =>
        set({
          objectives: get().objectives.map((o) =>
            o.id !== objectiveId
              ? o
              : {
                  ...o,
                  milestones: o.milestones.map((m) =>
                    m.id === milestoneId
                      ? {
                          ...m,
                          tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, experimentId } : t))
                        }
                      : m
                  )
                }
          )
        }),

      // Strategy ops
      setStrategy: (partial) => set({ strategy: { ...get().strategy, ...partial } }),
      addTheme: (theme) => set({ strategy: { ...get().strategy, themes: [...get().strategy.themes, theme] } }),
      updateTheme: (id, patch) =>
        set({
          strategy: {
            ...get().strategy,
            themes: get().strategy.themes.map((t) => (t.id === id ? { ...t, ...patch } : t))
          }
        }),
      addOKR: (themeId, okr) =>
        set({
          strategy: {
            ...get().strategy,
            themes: get().strategy.themes.map((t) => (t.id === themeId ? { ...t, okrs: [...t.okrs, okr] } : t))
          }
        }),
      updateOKR: (themeId, okrId, patch) =>
        set({
          strategy: {
            ...get().strategy,
            themes: get().strategy.themes.map((t) =>
              t.id !== themeId
                ? t
                : { ...t, okrs: t.okrs.map((o) => (o.id === okrId ? { ...o, ...patch } : o)) }
            )
          }
        }),
      addKR: (themeId, okrId, kr) =>
        set({
          strategy: {
            ...get().strategy,
            themes: get().strategy.themes.map((t) =>
              t.id !== themeId ? t : { ...t, okrs: t.okrs.map((o) => (o.id === okrId ? { ...o, keyResults: [...o.keyResults, kr] } : o)) }
            )
          }
        }),
      updateKR: (themeId, okrId, krId, patch) =>
        set({
          strategy: {
            ...get().strategy,
            themes: get().strategy.themes.map((t) =>
              t.id !== themeId
                ? t
                : {
                    ...t,
                    okrs: t.okrs.map((o) =>
                      o.id !== okrId
                        ? o
                        : { ...o, keyResults: o.keyResults.map((k) => (k.id === krId ? { ...k, ...patch } : k)) }
                    )
                  }
            )
          }
        }),

      addExperiment: (exp) => set({ experiments: [...get().experiments, exp] }),
      updateExperiment: (id, patch) =>
        set({ experiments: get().experiments.map((e) => (e.id === id ? { ...e, ...patch } : e)) }),
      changeExperimentStage: (id, stage) =>
        set({ experiments: get().experiments.map((e) => (e.id === id ? { ...e, stage } : e)) }),

      exportJson: () => {
        const data = {
          version: get().version,
          strategy: get().strategy,
          objectives: get().objectives,
          experiments: get().experiments
        };
        return JSON.stringify(data, null, 2);
      },
      importJson: (json: string) => {
        try {
          const data = JSON.parse(json);
          if (!data) return { ok: false, error: 'Invalid JSON' };
          set({
            strategy: data.strategy ?? get().strategy,
            objectives: Array.isArray(data.objectives) ? data.objectives : get().objectives,
            experiments: Array.isArray(data.experiments) ? data.experiments : get().experiments
          });
          return { ok: true };
        } catch (e: any) {
          return { ok: false, error: e?.message || 'Invalid JSON' };
        }
      }
    }),
    {
      name: PERSIST_KEY,
      version: VERSION,
      storage:
        typeof window !== 'undefined'
          ? createJSONStorage(() => localStorage)
          : undefined,
      migrate: (persisted, version) => {
        if (!persisted) return { ...initial, objectives: [seedObjective()] } as any;
        if (version < 2) {
          // v1 -> v2: add strategy, experiments, zoom, filters
          const p: any = persisted as any;
          return {
            ...initial,
            objectives: p.objectives ?? [seedObjective()],
            strategy: p.strategy ?? seedStrategy(),
            experiments: p.experiments ?? [],
            zoom: p.zoom ?? 'H0'
          } as any;
        }
        return persisted as any;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        const st = state as Store;
        // If v2 store empty but legacy v1 exists, migrate from old key
        try {
          if (typeof window !== 'undefined') {
            const keyV1 = 'via_planner_state_v1';
            const raw = localStorage.getItem(keyV1);
            if (raw && st.objectives.length === 0) {
              const parsed = JSON.parse(raw);
              const inner = parsed?.state ?? parsed; // adapt wrapper
              if (inner?.objectives) {
                st.setStrategy(inner.strategy ?? seedStrategy());
                st.importJson(JSON.stringify({
                  strategy: inner.strategy ?? seedStrategy(),
                  objectives: inner.objectives,
                  experiments: inner.experiments ?? []
                }));
              } else if (!st.objectives.length) {
                st.reset();
              }
            }
          }
        } catch {}
        if (st && st.objectives.length === 0) {
          st.reset();
        }
      }
    }
  )
);

// Implement moveTask with a helper to avoid deep nested set logic
usePlanner.subscribe(() => {}); // ensure module evaluated

export function moveTaskHelper(args: {
  fromObjectiveId: string;
  fromMilestoneId: string;
  toObjectiveId: string;
  toMilestoneId: string;
  taskId: string;
  toIndex?: number;
}) {
  const { fromObjectiveId, fromMilestoneId, toObjectiveId, toMilestoneId, taskId, toIndex } = args;
  usePlanner.setState((state) => {
    const s: any = state as any;
    const objectives = s.objectives.map((o: any) => ({ ...o, milestones: o.milestones.map((m: any) => ({ ...m, tasks: [...m.tasks] })) }));
    // remove
    const fromObj = objectives.find((o: any) => o.id === fromObjectiveId);
    const toObj = objectives.find((o: any) => o.id === toObjectiveId);
    if (!fromObj || !toObj) return {} as any;
    const fromMs = fromObj.milestones.find((m: any) => m.id === fromMilestoneId);
    const toMs = toObj.milestones.find((m: any) => m.id === toMilestoneId);
    if (!fromMs || !toMs) return {} as any;
    const idx = fromMs.tasks.findIndex((t: any) => t.id === taskId);
    if (idx === -1) return {} as any;
    const [task] = fromMs.tasks.splice(idx, 1);
    const insertAt = toIndex ?? toMs.tasks.length;
    toMs.tasks.splice(insertAt, 0, task);
    return { objectives } as any;
  });
}

// Convenience creators for UI
export function newTask(title: string): Task {
  return { id: uid('t'), title, status: 'todo', tags: [] };
}
export function newMilestone(title: string, dueIso: string): Milestone {
  return { id: uid('ms'), title, due: dueIso, tasks: [] };
}
export function newObjective(title: string, why: string): Objective {
  return { id: uid('obj'), title, why, milestones: [] };
}
