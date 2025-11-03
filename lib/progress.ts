import type { Milestone, Objective, Task } from './types';

export function milestoneProgress(ms: Milestone): { done: number; total: number; ratio: number } {
  const total = ms.tasks.length;
  const done = ms.tasks.filter((t) => t.status === 'done').length;
  const ratio = total === 0 ? 0 : done / total;
  return { done, total, ratio };
}

export function objectiveProgress(obj: Objective): { done: number; total: number; ratio: number } {
  if (!obj.milestones.length) return { done: 0, total: 0, ratio: 0 };
  const parts = obj.milestones.map(milestoneProgress);
  const ratio = parts.reduce((s, p) => s + p.ratio, 0) / parts.length;
  const done = parts.reduce((s, p) => s + p.done, 0);
  const total = parts.reduce((s, p) => s + p.total, 0);
  return { done, total, ratio };
}

export function overallProgress(objs: Objective[]) {
  if (!objs.length) return { ratio: 0 } as const;
  const ratios = objs.map(objectiveProgress).map((p) => p.ratio);
  const ratio = ratios.reduce((s, r) => s + r, 0) / ratios.length;
  return { ratio } as const;
}

export function allTags(tasks: Task[]): string[] {
  const s = new Set<string>();
  tasks.forEach((t) => t.tags?.forEach((tag) => s.add(tag)));
  return Array.from(s).sort();
}

