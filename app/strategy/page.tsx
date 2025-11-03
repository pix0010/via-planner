"use client";
import { AppShell } from '@/components/layout/app-shell';
import { usePlanner } from '@/lib/store';
import { MarkdownEditor } from '@/components/markdown-editor';
import { NSMCard } from '@/components/nsm-card';
import { GuardrailChip } from '@/components/guardrail-chip';
import { ThemeCard } from '@/components/theme-card';
import { OKRList } from '@/components/okr-list';
import { ExperimentTable } from '@/components/experiment-table';
import { AlignmentStat } from '@/components/alignment-stat';
import { Button } from '@/components/ui/button';

export default function Page() {
  const { strategy, setStrategy, exportJson, importJson } = usePlanner((s) => ({
    strategy: s.strategy,
    setStrategy: s.setStrategy,
    exportJson: s.exportJson,
    importJson: s.importJson
  }));

  const onExportStrategy = () => {
    const blob = new Blob([JSON.stringify({ strategy }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'via_strategy_export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportStrategy = (file: File) => {
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
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Strategy</h1>
          <div className="flex items-center gap-2">
            <Button onClick={onExportStrategy}>Export Strategy JSON</Button>
            <label className="text-sm inline-flex items-center gap-2">
              Import Strategy
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files && e.target.files[0] && onImportStrategy(e.target.files[0])} />
            </label>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6 space-y-4">
            <div className="text-sm font-semibold">Strategy Canvas</div>
            <div className="grid gap-4">
              <div>
                <div className="text-sm mb-1">Thesis</div>
                <input className="w-full h-10 rounded-2xl border bg-background px-3 py-2 text-sm" value={strategy.thesis} onChange={(e) => setStrategy({ thesis: e.target.value })} />
              </div>
              <MarkdownEditor label="Mission" value={strategy.mission} onChange={(v) => setStrategy({ mission: v })} />
              <MarkdownEditor label="Vision" value={strategy.vision} onChange={(v) => setStrategy({ vision: v })} />
            </div>
          </div>
          <div className="space-y-4">
            <NSMCard metric={strategy.northStar} />
            <div className="grid grid-cols-2 gap-2">
              {strategy.guardrails.map((g) => (
                <GuardrailChip key={g.id} metric={g} />
              ))}
            </div>
            <AlignmentStat />
          </div>
        </section>

        <section className="space-y-4">
          <div className="text-sm font-semibold">Themes</div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {strategy.themes.map((t) => (
              <ThemeCard key={t.id} theme={t} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {strategy.themes.length > 0 && <OKRList theme={strategy.themes[0]} />}
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Experiments</div>
            <ExperimentTable />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

