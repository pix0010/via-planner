"use client";
import { AppShell } from '@/components/layout/app-shell';
import { RoadmapTimeline } from '@/components/roadmap-timeline';
import { ObjectiveEditor } from '@/components/editor/objective-editor';
import { MilestoneEditor } from '@/components/editor/milestone-editor';
import { usePlanner } from '@/lib/store';
import { RoadmapTaskLanes } from '@/components/roadmap-task-lanes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Page() {
  const { objectives, strategy, filters, setFilters } = usePlanner((s) => ({
    objectives: s.objectives,
    strategy: s.strategy,
    filters: s.filters,
    setFilters: s.setFilters
  }));
  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-xl font-semibold">Roadmap</h1>
        <ObjectiveEditor />
        <div className="ml-auto flex items-center gap-2">
          <Select value={filters.themeId || 'all'} onValueChange={(v) => setFilters({ themeId: v === 'all' ? undefined : v })}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Theme" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All themes</SelectItem>
              {strategy.themes.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.okrId || 'all'} onValueChange={(v) => setFilters({ okrId: v === 'all' ? undefined : v })}>
            <SelectTrigger className="w-48"><SelectValue placeholder="OKR" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All OKR</SelectItem>
              {strategy.themes.flatMap((t) => t.okrs).map((o) => (
                <SelectItem key={o.id} value={o.id}>{o.objective}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {objectives.length > 0 && (
        <div className="mb-4">
          <MilestoneEditor objectiveId={objectives[0].id} />
        </div>
      )}
      <RoadmapTimeline />
      <div className="mt-8 space-y-8">
        {objectives.map((o) => (
          <RoadmapTaskLanes key={o.id} objective={o} />
        ))}
      </div>
    </AppShell>
  );
}
