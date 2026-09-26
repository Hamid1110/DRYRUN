'use client';

import { useMemo, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { NavContext, pathOf, routeOfPath, type Nav } from '@/lib/router';
import { AppShell } from './AppShell';

/** Next.js adapter: real URLs like /learn/cout-basics */
export function NextRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = useMemo<Nav>(
    () => ({
      route: routeOfPath(pathname ?? '/'),
      href: pathOf,
      go: (r, opts) => (opts?.replace ? router.replace(pathOf(r)) : router.push(pathOf(r))),
    }),
    [pathname, router],
  );
  return (
    <NavContext.Provider value={nav}>
      <AppShell>{children}</AppShell>
    </NavContext.Provider>
  );
}
