"use client";
import { AppShell } from '@/components/layout/app-shell';
import { ProgressRing } from '@/components/progress-ring';
import { ObjectiveCard } from '@/components/objective-card';
import { usePlanner } from '@/lib/store';
import { overallProgress } from '@/lib/progress';
import { MetricChip } from '@/components/metric-chip';
import { humanDate } from '@/lib/utils';
import Link from 'next/link';
import { NSMCard } from '@/components/nsm-card';
import { GuardrailChip } from '@/components/guardrail-chip';
import { ZoomToggle } from '@/components/zoom-toggle';
import { AlignmentStat } from '@/components/alignment-stat';
import { ThemeCard } from '@/components/theme-card';
import { pipelineCounts } from '@/lib/metrics';

export default function Page() {
  return (
    <AppShell>
      <Global />
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
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

function Global() {
  const { strategy, zoom, experiments } = usePlanner((s) => ({ strategy: s.strategy, zoom: s.zoom, experiments: s.experiments }));
  const pipeline = pipelineCounts(experiments);
  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      <div className="space-y-4 xl:col-span-2">
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">Global</div>
          <ZoomToggle />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NSMCard metric={strategy.northStar} />
          <AlignmentStat />
        </div>
        {zoom !== 'H0' && (
          <div className="card p-4">
            {zoom === 'H2' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {strategy.themes.map((t) => (
                  <ThemeCard key={t.id} theme={t} />
                ))}
              </div>
            )}
            {zoom === 'H3' && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p><strong>Vision:</strong> {strategy.vision.split('. ')[0]}.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {strategy.guardrails.map((g) => (
            <GuardrailChip key={g.id} metric={g} />
          ))}
        </div>
        <div className="card p-4">
          <div className="text-sm font-semibold mb-2">Path to scale</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Idea</div>
              <div className="text-xl font-semibold">{pipeline.idea}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Pilot</div>
              <div className="text-xl font-semibold">{pipeline.pilot}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Validated</div>
              <div className="text-xl font-semibold">{pipeline.validated}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Paid</div>
              <div className="text-xl font-semibold">{pipeline.paid}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
