"use client";
import * as React from 'react';
import { usePlanner } from '@/lib/store';
import type { Experiment, ExperimentStage } from '@/lib/types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { uid } from '@/lib/utils';

export function ExperimentTable() {
  const { experiments, addExperiment, updateExperiment, changeExperimentStage } = usePlanner((s) => ({
    experiments: s.experiments,
    addExperiment: s.addExperiment,
    updateExperiment: s.updateExperiment,
    changeExperimentStage: s.changeExperimentStage
  }));
  const [stageFilter, setStageFilter] = React.useState<ExperimentStage | 'all'>('all');
  const [q, setQ] = React.useState('');

  const list = experiments.filter((e) => (stageFilter === 'all' ? true : e.stage === stageFilter)).filter((e) => !q || e.hypothesis.toLowerCase().includes(q.toLowerCase()));

  const add = () => {
    const e: Experiment = { id: uid('exp'), hypothesis: 'Nueva hipótesis…', stage: 'idea' };
    addExperiment(e);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <select className="h-10 rounded-2xl border bg-background px-3 py-2 text-sm" value={stageFilter} onChange={(e) => setStageFilter(e.target.value as any)}>
          <option value="all">All stages</option>
          <option value="idea">idea</option>
          <option value="draft">draft</option>
          <option value="running">running</option>
          <option value="completed">completed</option>
        </select>
        <Input placeholder="Filter…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button onClick={add}>New</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3">Hypothesis</th>
              <th className="py-2 pr-3">Stage</th>
              <th className="py-2 pr-3">Outcome</th>
              <th className="py-2 pr-3">KR</th>
              <th className="py-2 pr-3">Evidence</th>
            </tr>
          </thead>
          <tbody className="align-top">
            {list.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="py-2 pr-3 min-w-[240px]">
                  <Input value={e.hypothesis} onChange={(ev) => updateExperiment(e.id, { hypothesis: ev.target.value })} />
                </td>
                <td className="py-2 pr-3">
                  <select className="h-9 rounded-xl border bg-background px-2" value={e.stage} onChange={(ev) => changeExperimentStage(e.id, ev.target.value as ExperimentStage)}>
                    <option value="idea">idea</option>
                    <option value="draft">draft</option>
                    <option value="running">running</option>
                    <option value="completed">completed</option>
                  </select>
                </td>
                <td className="py-2 pr-3">
                  <select className="h-9 rounded-xl border bg-background px-2" value={e.outcome || ''} onChange={(ev) => updateExperiment(e.id, { outcome: (ev.target.value || undefined) as any })}>
                    <option value="">—</option>
                    <option value="win">win</option>
                    <option value="neutral">neutral</option>
                    <option value="loss">loss</option>
                  </select>
                </td>
                <td className="py-2 pr-3 text-xs text-muted-foreground">{e.krId || '—'}</td>
                <td className="py-2 pr-3 min-w-[240px]">
                  <textarea className="w-full h-16 rounded-xl border bg-background px-2 py-1 text-sm" value={e.evidence || ''} onChange={(ev) => updateExperiment(e.id, { evidence: ev.target.value })} />
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td className="py-4 text-xs text-muted-foreground" colSpan={5}>No experiments</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

