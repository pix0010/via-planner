import type { Experiment, KeyResult, OKR, Objective, PlannerState, StrategicTheme } from './types';

export function calcKRProgress(kr: KeyResult): number {
  const tNum = typeof kr.target === 'number' ? kr.target : NaN;
  const cNum = typeof kr.current === 'number' ? kr.current : NaN;
  if (Number.isNaN(tNum) || tNum === 0 || Number.isNaN(cNum)) return 0;
  const ratio = Math.max(0, Math.min(1, cNum / tNum));
  return ratio;
}

export function calcOKRProgress(okr: OKR): number {
  const parts = okr.keyResults.map(calcKRProgress);
  if (!parts.length) return 0;
  const ratio = parts.reduce((s, r) => s + r, 0) / parts.length;
  return ratio;
}

export function calcThemeProgress(theme: StrategicTheme): number {
  if (!theme.okrs.length) return 0;
  const parts = theme.okrs.map(calcOKRProgress);
  return parts.reduce((s, r) => s + r, 0) / parts.length;
}

export function calcAlignmentScore(state: PlannerState): number {
  const allTasks = state.objectives.flatMap((o) => o.milestones.flatMap((m) => m.tasks));
  const total = allTasks.length;
  if (total === 0) return 0;
  const aligned = allTasks.filter((t) => t.okrId || t.experimentId).length;
  return aligned / total;
}

export function pipelineCounts(experiments: Experiment[]) {
  const idea = experiments.filter((e) => e.stage === 'idea').length;
  const pilot = experiments.filter((e) => e.stage === 'running').length;
  const validated = experiments.filter((e) => e.stage === 'completed' && e.outcome === 'win').length;
  const paid = experiments.filter(
    (e) => e.stage === 'completed' && e.outcome === 'win' && !!e.objectiveId
  ).length;
  return { idea, pilot, validated, paid } as const;
}

