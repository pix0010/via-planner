"use client";
import { AppShell } from '@/components/layout/app-shell';
import { JsonImportExport } from '@/components/json-import-export';
import { ThemeToggle } from '@/components/theme-toggle';
import { APP_CONFIG } from '@/config/app';
import { usePlanner } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function Page() {
  const { strategy, setStrategy, resetStrategy } = usePlanner((s) => ({ strategy: s.strategy, setStrategy: s.setStrategy, resetStrategy: s.resetStrategy }));
  const exportStrategy = () => {
    const blob = new Blob([JSON.stringify({ strategy }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'via_strategy_export.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const importStrategy = (file: File) => {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const data = JSON.parse(String(fr.result));
        if (data.strategy) setStrategy(data.strategy);
      } catch {}
    };
    fr.readAsText(file);
  };
  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Settings</h1>
        <section className="card p-6 space-y-3">
          <div className="font-semibold">Theme</div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">Toggle light/dark (system default)</span>
          </div>
        </section>

        <section className="card p-6 space-y-3">
          <div className="font-semibold">Import / Export</div>
          <JsonImportExport />
        </section>

        <section className="card p-6 space-y-3">
          <div className="font-semibold">Strategy Import / Export</div>
          <div className="flex items-center gap-2">
            <Button onClick={exportStrategy}>Export Strategy JSON</Button>
            <label className="inline-flex items-center gap-2 text-sm">
              Import
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files && e.target.files[0] && importStrategy(e.target.files[0])} />
            </label>
            <Button variant="destructive" onClick={() => resetStrategy()}>Reset Strategy</Button>
          </div>
        </section>

        <section className="card p-6 space-y-3">
          <div className="font-semibold">Contact config</div>
          <div className="text-sm text-muted-foreground">
            Calls: {APP_CONFIG.phoneTel} • WhatsApp: {APP_CONFIG.phoneWhatsApp}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
