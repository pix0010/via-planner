"use client";
import * as React from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { QuickAdd } from '@/components/quick-add';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { usePlanner } from '@/lib/store';

export function Topbar() {
  const exportJson = usePlanner((s) => s.exportJson);
  const onExport = React.useCallback(() => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'via_planner_export.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [exportJson]);
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <span className="font-semibold">VIA Planner</span>
      </div>
      <div className="flex items-center gap-2">
        <QuickAdd />
        <Button variant="ghost" size="icon" aria-label="Export JSON" onClick={onExport} title="Export JSON">
          <Download className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}

