import * as React from 'react';
import type { Task } from '@/lib/types';
import { cn, statusColor } from '@/lib/utils';

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="card p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium leading-tight break-words">{task.title}</div>
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] uppercase', statusColor(task.status))}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      {(task.okrId || task.experimentId) && (
        <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
          {task.okrId && <span className="rounded-full bg-blue-100/60 dark:bg-blue-900/30 px-2 py-0.5">KR:{task.okrId}</span>}
          {task.experimentId && <span className="rounded-full bg-amber-100/60 dark:bg-amber-900/30 px-2 py-0.5">EXP:{task.experimentId}</span>}
        </div>
      )}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px]">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
