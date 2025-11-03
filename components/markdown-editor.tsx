"use client";
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
};

export function MarkdownEditor({ label, value, onChange, placeholder, rows = 6, className }: Props) {
  return (
    <div className={cn('grid gap-2', className)}>
      <div className="text-sm font-medium">{label}</div>
      <textarea
        className="min-h-[120px] w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="text-xs text-muted-foreground">Preview</div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || '—'}</ReactMarkdown>
      </div>
    </div>
  );
}

