"use client";
import * as React from 'react';
import { ThemeProvider } from 'next-themes';
import { usePlanner } from '@/lib/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  const setHasHydrated = usePlanner((s) => s.setHasHydrated);
  React.useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

