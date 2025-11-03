"use client";
import * as React from 'react';
import dynamic from 'next/dynamic';
import type { Metric } from '@/lib/types';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer as any),
  { ssr: false }
) as unknown as React.ComponentType<any>;
const LineChart = (dynamic(() => import('recharts').then((m) => m.LineChart as any), {
  ssr: false
}) as unknown) as React.ComponentType<any>;
const Line = (dynamic(() => import('recharts').then((m) => m.Line as any), {
  ssr: false
}) as unknown) as React.ComponentType<any>;

function seeded(id: string, n = 8) {
  let s = 0;
  for (let i = 0; i < id.length; i++) s = (s * 31 + id.charCodeAt(i)) % 9973;
  const out: { x: number; y: number }[] = [];
  let v = Math.max(0, s % 20);
  for (let i = 0; i < n; i++) {
    v = Math.max(0, Math.min(100, v + ((s % 7) - 3)));
    out.push({ x: i, y: v });
  }
  return out;
}

export function MetricChip({ metric }: { metric: Metric }) {
  const data = React.useMemo(() => seeded(metric.id), [metric.id]);
  return (
    <div className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs">
      <div className="min-w-0">
        <div className="font-medium truncate">{metric.name}</div>
        <div className="text-muted-foreground">
          {metric.current}/{metric.target} {metric.unit || ''}
        </div>
      </div>
      <div className="h-8 w-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
            <Line type="monotone" dataKey="y" stroke="currentColor" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
