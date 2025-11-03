"use client";
import * as React from 'react';
import type { StrategicTheme } from '@/lib/types';
import { calcThemeProgress } from '@/lib/metrics';
import { Progress } from './ui/progress';

export function ThemeCard({ theme }: { theme: StrategicTheme }) {
  const ratio = calcThemeProgress(theme);
  return (
    <div className="card p-4">
      <div className="font-semibold mb-1">{theme.title}</div>
      <div className="text-sm text-muted-foreground mb-3">{theme.narrative}</div>
      <Progress value={ratio * 100} />
      <div className="mt-2 text-xs text-muted-foreground">{Math.round(ratio * 100)}% promedio OKR</div>
    </div>
  );
}

