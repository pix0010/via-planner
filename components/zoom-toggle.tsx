"use client";
import * as React from 'react';
import { usePlanner } from '@/lib/store';

const options: { id: 'H0' | 'H1' | 'H2' | 'H3'; label: string }[] = [
  { id: 'H0', label: 'H0 · Tasks' },
  { id: 'H1', label: 'H1 · OKR' },
  { id: 'H2', label: 'H2 · Themes' },
  { id: 'H3', label: 'H3 · Vision' }
];

export function ZoomToggle() {
  const { zoom, setZoom } = usePlanner((s) => ({ zoom: s.zoom, setZoom: s.setZoom }));
  return (
    <div className="inline-flex overflow-hidden rounded-xl border bg-background">
      {options.map((o) => (
        <button
          key={o.id}
          className={`px-3 py-1.5 text-xs ${zoom === o.id ? 'bg-accent' : ''}`}
          onClick={() => setZoom(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

