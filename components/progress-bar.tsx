import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { formatPercent } from '@/lib/utils';

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const ratio = total === 0 ? 0 : done / total;
  return (
    <div className="flex items-center gap-3">
      <Progress value={ratio * 100} className="h-3 flex-1" />
      <div className="text-xs tabular-nums min-w-[90px] text-right">
        {formatPercent(ratio)} • {done}/{total}
      </div>
    </div>
  );
}

