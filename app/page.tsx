"use client";
import { AppShell } from '@/components/layout/app-shell';
import { ProgressRing } from '@/components/progress-ring';
import { ObjectiveCard } from '@/components/objective-card';
import { usePlanner } from '@/lib/store';
import { overallProgress } from '@/lib/progress';
import { MetricChip } from '@/components/metric-chip';
import { humanDate } from '@/lib/utils';
import Link from 'next/link';

export default function Page() {
  return (
    <AppShell>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <Overview />
        <Objectives />
        <Deadlines />
      </div>
    </AppShell>
  );
}

function Overview() {
  const objectives = usePlanner((s) => s.objectives);
  const p = overallProgress(objectives);
  const metrics = objectives.flatMap((o) => o.metrics || []).slice(0, 4);
  return (
    <section className="card p-6 flex flex-col items-center gap-4">
      <div className="text-sm text-muted-foreground">Overall progress</div>
      <ProgressRing ratio={p.ratio} />
      <div className="mt-2 grid grid-cols-2 gap-2 w-full">
        {metrics.map((m) => (
          <MetricChip key={m.id} metric={m} />
        ))}
      </div>
    </section>
  );
}

function Objectives() {
  const objectives = usePlanner((s) => s.objectives);
  return (
    <section className="xl:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Objectives</h2>
        <Link href="/roadmap" className="text-sm text-primary underline">Ver roadmap</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objectives.map((o) => (
          <ObjectiveCard key={o.id} objective={o} />
        ))}
      </div>
    </section>
  );
}

function Deadlines() {
  const objectives = usePlanner((s) => s.objectives);
  const nearest = objectives
    .flatMap((o) => o.milestones.map((m) => ({ ...m, objective: o.title })))
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 6);
  return (
    <section className="card p-6">
      <div className="text-base font-semibold mb-3">Próximos plazos</div>
      <div className="space-y-2">
        {nearest.map((m) => (
          <div key={`${m.objective}-${m.id}`} className="flex items-center justify-between text-sm">
            <div className="truncate">
              <div className="font-medium truncate">{m.title}</div>
              <div className="text-xs text-muted-foreground truncate">{m.objective}</div>
            </div>
            <div className="text-xs text-muted-foreground">{humanDate(m.due)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
