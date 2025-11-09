'use client';

export function Providers({ children }: { children: React.ReactNode }) {
  // Theme provider removed - app uses dark mode only
  return <>{children}</>;
}