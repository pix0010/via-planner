"use client";
import { AppShell } from '@/components/layout/app-shell';
import { JsonImportExport } from '@/components/json-import-export';
import { ThemeToggle } from '@/components/theme-toggle';
import { APP_CONFIG } from '@/config/app';

export default function Page() {
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
          <div className="font-semibold">Contact config</div>
          <div className="text-sm text-muted-foreground">
            Calls: {APP_CONFIG.phoneTel} • WhatsApp: {APP_CONFIG.phoneWhatsApp}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
