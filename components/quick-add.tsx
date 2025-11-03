"use client";
import * as React from 'react';
import { Command } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePlanner, newTask } from '@/lib/store';
import type { Objective } from '@/lib/types';
import { APP_CONFIG } from '@/config/app';

export function QuickAdd() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Command className="h-4 w-4" />
          Cmd/Ctrl K
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick actions</DialogTitle>
        </DialogHeader>
        <QuickAddBody onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function QuickAddBody({ onDone }: { onDone: () => void }) {
  const { objectives, addTask } = usePlanner((s) => ({ objectives: s.objectives, addTask: s.addTask }));
  const [q, setQ] = React.useState('');
  const [target, setTarget] = React.useState<{ obj?: Objective; msId?: string }>({});
  const list = React.useMemo(() => {
    const items: { id: string; title: string; objectiveId: string; milestoneId: string }[] = [];
    objectives.forEach((o) =>
      o.milestones.forEach((m) =>
        m.tasks.forEach((t) => {
          if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return;
          items.push({ id: t.id, title: t.title, objectiveId: o.id, milestoneId: m.id });
        })
      )
    );
    return items.slice(0, 8);
  }, [objectives, q]);

  React.useEffect(() => {
    if (!target.obj && objectives[0]) {
      setTarget({ obj: objectives[0], msId: objectives[0].milestones[0]?.id });
    }
  }, [objectives, target.obj]);

  const onAdd = () => {
    if (!q.trim() || !target.obj || !target.msId) return;
    addTask(target.obj.id, target.msId, newTask(q.trim()));
    setQ('');
    onDone();
  };

  return (
    <div className="space-y-4">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={APP_CONFIG.cta.quickAddPlaceholder}
        autoFocus
      />
      <div className="flex items-center gap-2 text-xs">
        <span>Target:</span>
        <select
          className="h-8 rounded-xl border bg-background px-2"
          value={target.obj?.id || ''}
          onChange={(e) => {
            const obj = objectives.find((o) => o.id === e.target.value);
            setTarget({ obj, msId: obj?.milestones[0]?.id });
          }}
        >
          {objectives.map((o) => (
            <option key={o.id} value={o.id}>
              {o.title}
            </option>
          ))}
        </select>
        {target.obj && (
          <select
            className="h-8 rounded-xl border bg-background px-2"
            value={target.msId}
            onChange={(e) => setTarget((t) => ({ ...t, msId: e.target.value }))}
          >
            {target.obj.milestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        )}
        <Button size="sm" onClick={onAdd}>
          Add
        </Button>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-2">Search results</div>
        <div className="grid gap-2">
          {list.map((it) => (
            <div key={it.id} className="text-sm">
              {it.title}
            </div>
          ))}
          {list.length === 0 && <div className="text-xs text-muted-foreground">No results</div>}
        </div>
      </div>
    </div>
  );
}

