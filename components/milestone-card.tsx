import * as React from 'react';
import { motion } from 'framer-motion';
import type { Milestone } from '@/lib/types';
import { ProgressBar } from './progress-bar';
import { milestoneProgress } from '@/lib/progress';
import { humanDate } from '@/lib/utils';

export function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const p = milestoneProgress(milestone);
  return (
    <motion.div className="card p-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold leading-tight">{milestone.title}</div>
          <div className="text-xs text-muted-foreground">Due: {humanDate(milestone.due)}</div>
        </div>
      </div>
      <div className="mt-3">
        <ProgressBar done={p.done} total={p.total} />
      </div>
    </motion.div>
  );
}
