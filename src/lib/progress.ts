'use client';

import { useSyncExternalStore } from 'react';

// Learner progress, kept in this browser (localStorage).
// Later this can be swapped for a database without touching components.

export interface QResult {
  ok: boolean;
  tries: number;
  hints: number;
  revealed: boolean;
  score: number; // 0..1
}

export interface LevelProgress {
  visited: string[];
  qs: Record<string, QResult>;
  done: boolean;
  stars: number;
  best: number; // best practice score 0..100
}

export interface ProgressState {
  v: 1;
  levels: Record<string, LevelProgress>;
  xp: number;
  streak: { days: number; last: string };
  unlockAll: boolean;
}

/** While the course is being built every level is open. Set to false for the guided path. */
export const DEFAULT_UNLOCK_ALL = true;

const KEY = 'dryrun.progress.v1';

const EMPTY: ProgressState = Object.freeze({
  v: 1,
  levels: {},
  xp: 0,
  streak: { days: 0, last: '' },
  unlockAll: DEFAULT_UNLOCK_ALL,
}) as ProgressState;

function load(): ProgressState {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as ProgressState;
    if (parsed?.v !== 1) return EMPTY;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

let state: ProgressState = load();
const listeners = new Set<() => void>();

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — progress lives in memory only */
  }
}

export function getProgress(): ProgressState {
  return state;
}

function getServer(): ProgressState {
  return EMPTY;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function updateProgress(fn: (s: ProgressState) => ProgressState) {
  state = fn(state);
  save();
  listeners.forEach((l) => l());
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getProgress, getServer);
}

export function levelProgress(s: ProgressState, id: string): LevelProgress {
  return s.levels[id] ?? { visited: [], qs: {}, done: false, stars: 0, best: 0 };
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function bumpStreak(s: ProgressState): ProgressState['streak'] {
  const t = today();
  if (s.streak.last === t) return s.streak;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterday = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
  return { days: s.streak.last === yesterday ? s.streak.days + 1 : 1, last: t };
}

export function markVisited(levelId: string, stage: string) {
  const cur = levelProgress(getProgress(), levelId);
  if (cur.visited.includes(stage)) return;
  updateProgress((s) => ({
    ...s,
    levels: { ...s.levels, [levelId]: { ...cur, visited: [...cur.visited, stage] } },
  }));
}

export function recordAnswer(levelId: string, qid: string, r: QResult, xp: number) {
  updateProgress((s) => {
    const cur = levelProgress(s, levelId);
    const prev = cur.qs[qid];
    const gained = prev ? Math.max(0, xp - Math.round((prev.score || 0) * 10)) : xp;
    return {
      ...s,
      xp: s.xp + gained,
      streak: bumpStreak(s),
      levels: { ...s.levels, [levelId]: { ...cur, qs: { ...cur.qs, [qid]: prev && prev.score >= r.score ? prev : r } } },
    };
  });
}

export function completeLevel(levelId: string, scorePct: number) {
  const stars = scorePct >= 90 ? 3 : scorePct >= 70 ? 2 : 1;
  updateProgress((s) => {
    const cur = levelProgress(s, levelId);
    return {
      ...s,
      streak: bumpStreak(s),
      levels: {
        ...s.levels,
        [levelId]: { ...cur, done: true, stars: Math.max(cur.stars, stars), best: Math.max(cur.best, scorePct) },
      },
    };
  });
}

export function resetLevelPractice(levelId: string) {
  updateProgress((s) => {
    const cur = levelProgress(s, levelId);
    return { ...s, levels: { ...s.levels, [levelId]: { ...cur, qs: {} } } };
  });
}

export function setUnlockAll(on: boolean) {
  updateProgress((s) => ({ ...s, unlockAll: on }));
}

export function resetAll() {
  updateProgress(() => ({ ...EMPTY, levels: {} }));
}
