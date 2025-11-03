"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Map, KanbanSquare, Settings } from 'lucide-react';

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/board', label: 'Board', icon: KanbanSquare },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 xl:w-80 flex-col gap-4 border-r border-border p-4">
      <div className="px-2 py-3">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          VIA Planner
        </Link>
        <div className="text-xs text-muted-foreground">Hecho en Valencia</div>
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const ActiveIcon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent',
                active && 'bg-accent text-accent-foreground'
              )}
            >
              <ActiveIcon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto text-xs text-muted-foreground px-2">Q4 2025 Roadmap</div>
    </aside>
  );
}

