"use client";
import { AppShell } from '@/components/layout/app-shell';
import { KanbanBoard } from '@/components/kanban-board';

export default function Page() {
  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Board</h1>
      </div>
      <KanbanBoard />
    </AppShell>
  );
}
