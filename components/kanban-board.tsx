"use client";
import * as React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { usePlanner } from '@/lib/store';
import type { Objective, Status, Task, OKR, Experiment } from '@/lib/types';
import { TaskCard } from './task-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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
  const { objectives, filters, setFilters, updateTask, strategy, linkTaskToKR, linkTaskToExperiment, experiments } = usePlanner((s) => ({
    objectives: s.objectives,
    filters: s.filters,
    setFilters: s.setFilters,
    updateTask: s.updateTask,
    strategy: s.strategy,
    linkTaskToKR: s.linkTaskToKR,
    linkTaskToExperiment: s.linkTaskToExperiment,
    experiments: s.experiments
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
        <select
          className="h-10 rounded-2xl border bg-background px-3 py-2 text-sm"
          value={filters.themeId || ''}
          onChange={(e) => setFilters({ themeId: e.target.value || undefined })}
        >
          <option value="">All themes</option>
          {strategy.themes.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
        <select
          className="h-10 rounded-2xl border bg-background px-3 py-2 text-sm"
          value={filters.okrId || ''}
          onChange={(e) => setFilters({ okrId: e.target.value || undefined })}
        >
          <option value="">All OKR</option>
          {strategy.themes.flatMap((t) => t.okrs).map((okr) => (
            <option key={okr.id} value={okr.id}>{okr.objective}</option>
          ))}
        </select>
        <select
          className="h-10 rounded-2xl border bg-background px-3 py-2 text-sm"
          value={filters.experimentId || ''}
          onChange={(e) => setFilters({ experimentId: e.target.value || undefined })}
        >
          <option value="">All experiments</option>
          {experiments.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.hypothesis}</option>
          ))}
        </select>
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
                            <TaskContextMenu
                              task={t}
                              linkKR={(okrId) => {
                                const obj = objectives.find((o) => o.milestones.some((m) => m.tasks.some((x) => x.id === t.id)));
                                if (!obj) return;
                                const ms = obj.milestones.find((m) => m.tasks.some((x) => x.id === t.id));
                                if (!ms) return;
                                linkTaskToKR(obj.id, ms.id, t.id, okrId);
                              }}
                              linkExperiment={(expId) => {
                                const obj = objectives.find((o) => o.milestones.some((m) => m.tasks.some((x) => x.id === t.id)));
                                if (!obj) return;
                                const ms = obj.milestones.find((m) => m.tasks.some((x) => x.id === t.id));
                                if (!ms) return;
                                linkTaskToExperiment(obj.id, ms.id, t.id, expId);
                              }}
                              okrs={strategy.themes.flatMap((th) => th.okrs)}
                              experiments={experiments}
                            >
                              <TaskCard task={t} />
                            </TaskContextMenu>
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

function TaskContextMenu({
  children,
  task,
  okrs,
  experiments,
  linkKR,
  linkExperiment
}: {
  children: React.ReactNode;
  task: Task;
  okrs: OKR[];
  experiments: Experiment[];
  linkKR: (id?: string) => void;
  linkExperiment: (id?: string) => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div>{children}</div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="z-50 min-w-[220px] rounded-xl border bg-popover p-1 text-popover-foreground shadow-md">
        <DropdownMenu.Label className="px-2 py-1.5 text-xs">Links</DropdownMenu.Label>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger className="px-2 py-1.5 text-sm rounded hover:bg-accent">Link to KR…</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent className="z-50 min-w-[220px] rounded-xl border bg-popover p-1 text-popover-foreground shadow-md">
            <DropdownMenu.Item className="px-2 py-1.5 text-sm rounded hover:bg-accent" onClick={() => linkKR(undefined)}>— Clear —</DropdownMenu.Item>
            {okrs.map((o) => (
              <DropdownMenu.Item key={o.id} className="px-2 py-1.5 text-sm rounded hover:bg-accent" onClick={() => linkKR(o.id)}>
                {o.objective}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger className="px-2 py-1.5 text-sm rounded hover:bg-accent">Link to Experiment…</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent className="z-50 min-w-[220px] rounded-xl border bg-popover p-1 text-popover-foreground shadow-md">
            <DropdownMenu.Item className="px-2 py-1.5 text-sm rounded hover:bg-accent" onClick={() => linkExperiment(undefined)}>— Clear —</DropdownMenu.Item>
            {experiments.map((e) => (
              <DropdownMenu.Item key={e.id} className="px-2 py-1.5 text-sm rounded hover:bg-accent" onClick={() => linkExperiment(e.id)}>
                {e.hypothesis}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
