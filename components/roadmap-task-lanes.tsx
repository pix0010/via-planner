"use client";
import * as React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import type { Objective } from '@/lib/types';
import { usePlanner } from '@/lib/store';
import { TaskCard } from './task-card';

export function RoadmapTaskLanes({ objective }: { objective: Objective }) {
  const { moveTask, reorderTasks } = usePlanner((s) => ({
    moveTask: s.moveTask,
    reorderTasks: s.reorderTasks
  }));

  const onDragEnd = (res: DropResult) => {
    const { destination, source, draggableId } = res;
    if (!destination) return;
    const fromMilestoneId = source.droppableId;
    const toMilestoneId = destination.droppableId;
    if (fromMilestoneId === toMilestoneId && source.index !== destination.index) {
      reorderTasks(objective.id, fromMilestoneId, source.index, destination.index);
      return;
    }
    if (fromMilestoneId !== toMilestoneId) {
      moveTask({
        fromObjectiveId: objective.id,
        fromMilestoneId,
        toObjectiveId: objective.id,
        toMilestoneId,
        taskId: draggableId,
        toIndex: destination.index
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">{objective.title} — tasks by milestone</div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {objective.milestones.map((m) => (
            <Droppable droppableId={m.id} key={m.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="card p-3 min-h-[200px]">
                  <div className="mb-2 text-sm font-medium">{m.title}</div>
                  <div className="space-y-2">
                    {m.tasks.map((t, idx) => (
                      <Draggable draggableId={t.id} index={idx} key={t.id}>
                        {(prov) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                            <TaskCard task={t} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

