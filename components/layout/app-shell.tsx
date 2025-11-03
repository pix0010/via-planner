import * as React from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Topbar />
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[288px_1fr] gap-0">
        <Sidebar />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

