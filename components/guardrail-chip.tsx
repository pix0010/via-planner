"use client";
import * as React from 'react';
import type { Metric } from '@/lib/types';

export function GuardrailChip({ metric }: { metric: Metric }) {
  const ratio = metric.target === 0 ? 0 : Math.max(0, Math.min(1, metric.current / metric.target));
  return (
    <div className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs">
      <div className="min-w-0">
        <div className="font-medium truncate">{metric.name}</div>
        <div className="text-muted-foreground">{metric.current}/{metric.target} {metric.unit || ''}</div>
      </div>
      <div className="ml-auto text-[10px] rounded-full px-2 py-0.5 bg-muted">{Math.round(ratio * 100)}%</div>
    </div>
  );
}

