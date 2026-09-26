'use client';

import { createContext, useContext, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';

// A tiny navigation abstraction so the same UI runs inside Next.js (real URLs)
// and inside the single-file preview build (hash URLs).

export type Route = { name: 'home' } | { name: 'level'; id: string; stage?: string } | { name: 'playground' };

export interface Nav {
  route: Route;
  href(r: Route): string;
  go(r: Route, opts?: { replace?: boolean }): void;
}

export const NavContext = createContext<Nav | null>(null);

export function useNav(): Nav {
  const n = useContext(NavContext);
  if (!n) throw new Error('NavContext missing');
  return n;
}

export function pathOf(r: Route): string {
  if (r.name === 'home') return '/';
  if (r.name === 'playground') return '/playground';
  return `/learn/${r.id}`;
}

export function routeOfPath(path: string): Route {
  const m = /^\/learn\/([\w-]+)/.exec(path);
  if (m) return { name: 'level', id: m[1] };
  if (path.startsWith('/playground')) return { name: 'playground' };
  return { name: 'home' };
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: Route; children: ReactNode };

export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const nav = useNav();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    nav.go(to);
  };
  return (
    <a href={nav.href(to)} onClick={handle} {...rest}>
      {children}
    </a>
  );
}

// ---------------------------------------------------------------- opening a level at a given stage
let pendingStage: string | null = null;

/** ask the level screen to open a stage (e.g. the gold "exam" box) */
export function requestStage(stage: string) {
  pendingStage = stage;
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('dryrun:stage', { detail: stage }));
}

export function takePendingStage(): string | null {
  const s = pendingStage;
  pendingStage = null;
  return s;
}
