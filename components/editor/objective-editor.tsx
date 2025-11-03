"use client";
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlanner, newObjective } from '@/lib/store';
import type { Objective } from '@/lib/types';

export function ObjectiveEditor({ existing }: { existing?: Objective }) {
  const { addObjective, updateObjective } = usePlanner((s) => ({
    addObjective: s.addObjective,
    updateObjective: s.updateObjective
  }));
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(existing?.title || '');
  const [why, setWhy] = React.useState(existing?.why || '');
  const [owner, setOwner] = React.useState(existing?.owner || '');
  const [start, setStart] = React.useState(existing?.start || '');
  const [end, setEnd] = React.useState(existing?.end || '');

  React.useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setWhy(existing.why);
      setOwner(existing.owner || '');
      setStart(existing.start || '');
      setEnd(existing.end || '');
    }
  }, [existing]);

  const onSubmit = () => {
    if (!title.trim() || !why.trim()) return;
    if (existing) {
      updateObjective(existing.id, { title: title.trim(), why: why.trim(), owner, start, end });
    } else {
      const obj = newObjective(title.trim(), why.trim());
      obj.owner = owner || undefined;
      obj.start = start || undefined;
      obj.end = end || undefined;
      addObjective(obj);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={existing ? 'outline' : 'default'}>{existing ? 'Edit objective' : 'New objective'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit Objective' : 'Create Objective'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <div className="text-sm mb-1">Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <div className="text-sm mb-1">Why</div>
            <Input value={why} onChange={(e) => setWhy(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="text-sm mb-1">Owner</div>
              <Input value={owner} onChange={(e) => setOwner(e.target.value)} />
            </div>
            <div>
              <div className="text-sm mb-1">Start</div>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <div className="text-sm mb-1">End</div>
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
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

