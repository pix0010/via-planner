"use client";
import * as React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { usePlanner } from '@/lib/store';
import { MilestoneCard } from './milestone-card';
import { quarterLabel } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export function RoadmapTimeline() {
  const { objectives, updateMilestone } = usePlanner((s) => ({
    objectives: s.objectives,
    updateMilestone: s.updateMilestone
  }));

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const [objId, msId] = draggableId.split('__');
    const destQuarter = destination.droppableId; // quarter label string
    const obj = objectives.find((o) => o.id === objId);
    if (!obj) return;
    // Inline move between quarters = change due date to a representative date
    // For simplicity, set to first month of quarter at day 10
    const [qStr, yStr] = destQuarter.split(' ');
    const q = Number(qStr.replace('Q', ''));
    const year = Number(yStr);
    const month = (q - 1) * 3; // 0-based
    const due = new Date(Date.UTC(year, month, 10)).toISOString().slice(0, 10);
    updateMilestone(objId, msId, { due });
  };

  const quarters = React.useMemo(() => {
    const qs = new Set<string>();
    objectives.forEach((o) => o.milestones.forEach((m) => qs.add(quarterLabel(m.due))));
    // ensure at least the next two quarters
    const now = new Date();
    const qNow = Math.floor(now.getMonth() / 3) + 1;
    const base = `Q${qNow} ${now.getFullYear()}`;
    qs.add(base);
    const nextQ = qNow === 4 ? 1 : qNow + 1;
    const nextY = qNow === 4 ? now.getFullYear() + 1 : now.getFullYear();
    qs.add(`Q${nextQ} ${nextY}`);
    return Array.from(qs).sort();
  }, [objectives]);

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {quarters.map((q) => (
            <Droppable droppableId={q} key={q}>
              {(provided) => (
                <div className="space-y-3" ref={provided.innerRef} {...provided.droppableProps}>
                  <div className="text-sm font-semibold">{q}</div>
                  {objectives.map((o) => (
                    <div className="card p-3" key={o.id}>
                      <div className="text-sm font-medium mb-3">{o.title}</div>
                      <div className="space-y-2">
                        {o.milestones
                          .filter((m) => quarterLabel(m.due) === q)
                          .map((m, idx) => (
                            <Draggable draggableId={`${o.id}__${m.id}`} index={idx} key={m.id}>
                              {(prov) => (
                                <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                                  <MilestoneEditable milestoneId={m.id} objectiveId={o.id} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                      </div>
                    </div>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

function MilestoneEditable({ objectiveId, milestoneId }: { objectiveId: string; milestoneId: string }) {
  const { objectives, updateMilestone } = usePlanner((s) => ({
    objectives: s.objectives,
    updateMilestone: s.updateMilestone
  }));
  const obj = objectives.find((o) => o.id === objectiveId)!;
  const ms = obj.milestones.find((m) => m.id === milestoneId)!;
  const [due, setDue] = React.useState(ms.due);
  return (
    <div className="space-y-2">
      <MilestoneCard milestone={ms} />
      <div className="flex items-center gap-2 text-xs">
        <span>Due:</span>
        <Input
          type="date"
          className="h-8 w-44"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          onBlur={() => updateMilestone(objectiveId, milestoneId, { due })}
        />
      </div>
    </div>
  );
}
