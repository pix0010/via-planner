"use client";
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { usePlanner } from '@/lib/store';

export function JsonImportExport() {
  const { exportJson, importJson, reset } = usePlanner((s) => ({
    exportJson: s.exportJson,
    importJson: s.importJson,
    reset: s.reset
  }));
  const [msg, setMsg] = React.useState<string | undefined>();

  const onExport = React.useCallback(() => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'via_planner_export.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [exportJson]);

  const onImport = (file: File) => {
    const fr = new FileReader();
    fr.onload = () => {
      const res = importJson(String(fr.result));
      setMsg(res.ok ? 'Import successful' : `Import failed: ${res.error}`);
    };
    fr.readAsText(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button onClick={onExport}>Export JSON</Button>
        <label className="inline-flex items-center gap-2">
          <span className="text-sm">Import JSON</span>
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files && e.target.files[0] && onImport(e.target.files[0])}
          />
        </label>
        <Button variant="destructive" onClick={() => reset()}>Reset to defaults</Button>
      </div>
      {msg && <div className="text-xs text-muted-foreground">{msg}</div>}
    </div>
  );
}

