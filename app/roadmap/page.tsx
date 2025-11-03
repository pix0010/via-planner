import { AppShell } from '@/components/layout/app-shell';
import { RoadmapTimeline } from '@/components/roadmap-timeline';
import { ObjectiveEditor } from '@/components/editor/objective-editor';
import { MilestoneEditor } from '@/components/editor/milestone-editor';
import { usePlanner } from '@/lib/store';
import { RoadmapTaskLanes } from '@/components/roadmap-task-lanes';

export default function Page() {
  const objectives = usePlanner((s) => s.objectives);
  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Roadmap</h1>
        <ObjectiveEditor />
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
"use client";
