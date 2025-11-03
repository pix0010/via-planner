"use client";
import * as React from 'react';
import { ProgressRing } from './progress-ring';
import type { Metric } from '@/lib/types';

export function NSMCard({ metric }: { metric: Metric }) {
  const ratio = metric.target === 0 ? 0 : Math.max(0, Math.min(1, metric.current / metric.target));
  return (
    <div className="card p-5 flex items-center gap-4">
      <ProgressRing ratio={ratio} size={96} />
      <div>
        <div className="text-sm text-muted-foreground">North Star Metric</div>
        <div className="font-semibold">{metric.name}</div>
        <div className="text-sm">{metric.current} / {metric.target} {metric.unit || ''}</div>
      </div>
    </div>
  );
}

