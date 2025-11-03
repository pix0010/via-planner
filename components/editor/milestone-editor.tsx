"use client";
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlanner, newMilestone } from '@/lib/store';
import type { Milestone } from '@/lib/types';

export function MilestoneEditor({ objectiveId, existing }: { objectiveId: string; existing?: Milestone }) {
  const { addMilestone, updateMilestone } = usePlanner((s) => ({
    addMilestone: s.addMilestone,
    updateMilestone: s.updateMilestone
  }));
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(existing?.title || '');
  const [due, setDue] = React.useState(existing?.due || '');

  React.useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDue(existing.due);
    }
  }, [existing]);

  const onSubmit = () => {
    if (!title.trim() || !due) return;
    if (existing) {
      updateMilestone(objectiveId, existing.id, { title: title.trim(), due });
    } else {
      addMilestone(objectiveId, newMilestone(title.trim(), due));
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={existing ? 'outline' : 'default'}>{existing ? 'Edit milestone' : 'New milestone'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit Milestone' : 'Create Milestone'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <div className="text-sm mb-1">Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <div className="text-sm mb-1">Due date</div>
            <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} required />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>{existing ? 'Save' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

