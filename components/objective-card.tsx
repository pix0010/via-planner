import * as React from 'react';
import { motion } from 'framer-motion';
import type { Objective } from '@/lib/types';
import { objectiveProgress } from '@/lib/progress';
import { ProgressBar } from './progress-bar';
import { MetricChip } from './metric-chip';

export function ObjectiveCard({ objective }: { objective: Objective }) {
  const p = objectiveProgress(objective);
  return (
    <motion.div className="card p-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold leading-tight">{objective.title}</div>
          <div className="text-sm text-muted-foreground">{objective.why}</div>
        </div>
        {objective.owner && <div className="text-sm text-muted-foreground">Owner: {objective.owner}</div>}
      </div>
      <div className="mt-4">
        <ProgressBar done={p.done} total={p.total} />
      </div>
      {objective.metrics && objective.metrics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {objective.metrics.map((m) => (
            <MetricChip key={m.id} metric={m} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
