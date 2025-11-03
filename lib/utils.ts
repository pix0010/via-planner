import { type ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(v: number) {
  return `${Math.round(v * 100)}%`;
}

export function statusColor(status: 'todo' | 'in_progress' | 'blocked' | 'done') {
  switch (status) {
    case 'todo':
      return 'bg-muted text-foreground';
    case 'in_progress':
      return 'bg-blue-500 text-white';
    case 'blocked':
      return 'bg-amber-500 text-black';
    case 'done':
      return 'bg-emerald-500 text-white';
  }
}

export function humanDate(iso: string | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(d);
}

export function quarterLabel(due: string) {
  const d = new Date(due);
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}

export function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

