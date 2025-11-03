"use client";
import * as React from 'react';
import { calcAlignmentScore } from '@/lib/metrics';
import { usePlanner } from '@/lib/store';

export function AlignmentStat() {
  const state = usePlanner((s) => s);
  const ratio = calcAlignmentScore(state as any);
  return (
    <div className="card p-4">
      <div className="text-sm text-muted-foreground">Alignment score</div>
      <div className="text-2xl font-semibold">{Math.round(ratio * 100)}%</div>
      <div className="text-xs text-muted-foreground">Доля задач, привязанных к KR/экспериментам</div>
    </div>
  );
}

