"use client";
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlanner, newTask } from '@/lib/store';
import type { Task } from '@/lib/types';

export function TaskEditor({ objectiveId, milestoneId, existing }: { objectiveId: string; milestoneId: string; existing?: Task }) {
  const { addTask, updateTask } = usePlanner((s) => ({ addTask: s.addTask, updateTask: s.updateTask }));
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(existing?.title || '');
  const [status, setStatus] = React.useState(existing?.status || 'todo');
  const [tags, setTags] = React.useState((existing?.tags || []).join(','));

  React.useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setStatus(existing.status);
      setTags((existing.tags || []).join(','));
    }
  }, [existing]);

  const onSubmit = () => {
    if (!title.trim()) return;
    const payload = { title: title.trim(), status: status as Task['status'], tags: tags.split(',').map((t) => t.trim()).filter(Boolean) } as Partial<Task> as Task;
    if (existing) {
      const { id } = existing;
      updateTask(objectiveId, milestoneId, id, payload);
    } else {
      const t = newTask(title.trim());
      t.status = status as Task['status'];
      t.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      addTask(objectiveId, milestoneId, t);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={existing ? 'outline' : 'default'}>{existing ? 'Edit task' : 'New task'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <div className="text-sm mb-1">Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-sm mb-1">Status</div>
              <select className="h-10 w-full rounded-2xl border bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="todo">todo</option>
                <option value="in_progress">in_progress</option>
                <option value="blocked">blocked</option>
                <option value="done">done</option>
              </select>
            </div>
            <div>
              <div className="text-sm mb-1">Tags (comma-separated)</div>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>{existing ? 'Save' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

