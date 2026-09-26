'use client';

import { useSyncExternalStore } from 'react';

// Per-browser UI preferences: theme + sidebar. Applied to <html> as data attributes
// (an inline script in the layout applies them before first paint).

export type ThemePref = 'system' | 'light' | 'dark';

export interface Prefs {
  theme: ThemePref;
  sidebar: 'open' | 'closed';
}

const KEY = 'dryrun.prefs.v1';
const DEFAULT: Prefs = Object.freeze({ theme: 'system', sidebar: 'open' }) as Prefs;

function load(): Prefs {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...(JSON.parse(raw) as Partial<Prefs>) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

let prefs = load();
const listeners = new Set<() => void>();

export function applyPrefs(p: Prefs) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (p.theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', p.theme);
  root.setAttribute('data-sidebar', p.sidebar);
}

export function setPrefs(patch: Partial<Prefs>) {
  prefs = { ...prefs, ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
  applyPrefs(prefs);
  listeners.forEach((l) => l());
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => prefs,
    () => DEFAULT,
  );
}

/** Mobile drawer (not persisted). */
export function setDrawer(open: boolean) {
  if (typeof document === 'undefined') return;
  if (open) document.documentElement.setAttribute('data-drawer', 'open');
  else document.documentElement.removeAttribute('data-drawer');
}
