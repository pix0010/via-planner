"use client";
import * as React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { usePlanner } from '@/lib/store';
import type { Objective, Status, Task } from '@/lib/types';
import { TaskCard } from './task-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLUMNS: { id: Status; title: string }[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'blocked', title: 'Blocked' },
  { id: 'done', title: 'Done' }
];

function collectTasksByStatus(objectives: Objective[], objectiveId?: string, tags: string[] = []) {
  const tasks: Record<Status, Task[]> = { todo: [], in_progress: [], blocked: [], done: [] };
  objectives
    .filter((o) => !objectiveId || o.id === objectiveId)
    .forEach((o) =>
      o.milestones.forEach((m) =>
        m.tasks.forEach((t) => {
          const tagOK = tags.length === 0 || (t.tags || []).some((x) => tags.includes(x));
          if (tagOK) tasks[t.status].push(t);
        })
      )
    );
  return tasks;
}

export function KanbanBoard() {
  const { objectives, filters, setFilters, updateTask } = usePlanner((s) => ({
    objectives: s.objectives,
    filters: s.filters,
    setFilters: s.setFilters,
    updateTask: s.updateTask
  }));
  const allTags = React.useMemo(() => {
    const s = new Set<string>();
    objectives.forEach((o) => o.milestones.forEach((m) => m.tasks.forEach((t) => t.tags?.forEach((x) => s.add(x)))));
    return Array.from(s).sort();
  }, [objectives]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const destCol = destination.droppableId as Status;
    const srcCol = source.droppableId as Status;
    if (destCol === srcCol) return;
    // Update the first matching task with id draggableId
    const obj = objectives.find((o) =>
      o.milestones.some((m) => m.tasks.some((t) => t.id === draggableId))
    );
    if (!obj) return;
    const ms = obj.milestones.find((m) => m.tasks.some((t) => t.id === draggableId));
    if (!ms) return;
    updateTask(obj.id, ms.id, draggableId, { status: destCol });
  };

  const tasksByColumn = collectTasksByStatus(objectives, filters.objectiveId, filters.tags);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.objectiveId || 'all'}
          onValueChange={(v) => setFilters({ objectiveId: v === 'all' ? undefined : v })}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Objective" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All objectives</SelectItem>
            {objectives.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {allTags.length > 0 && (
          <select
            multiple
            value={filters.tags}
            onChange={(e) =>
              setFilters({ tags: Array.from(e.target.selectedOptions).map((o) => o.value) })
            }
            className="h-10 min-w-[200px] rounded-2xl border bg-background px-3 py-2 text-sm"
            aria-label="Filter by tags"
          >
            {allTags.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {COLUMNS.map((col) => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="card p-3 min-h-[200px]">
                  <div className="mb-2 text-sm font-semibold">{col.title}</div>
                  <div className="space-y-2">
                    {tasksByColumn[col.id].map((t, idx) => (
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
