'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import type { CourseTrack } from '@/content/course';

const STORAGE_KEY = 'dryrun.activeTrack';

let currentTrack: CourseTrack = 'pf';
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function getActiveTrack(): CourseTrack {
  if (typeof window === 'undefined') return currentTrack;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'pf' || saved === 'oop' || saved === 'dsa') {
      currentTrack = saved;
    }
  } catch {
    /* ignore */
  }
  return currentTrack;
}

export function setActiveTrack(track: CourseTrack): void {
  if (currentTrack === track) return;
  currentTrack = track;
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, track);
    }
  } catch {
    /* ignore */
  }
  notify();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useActiveTrack(): [CourseTrack, (track: CourseTrack) => void] {
  const track = useSyncExternalStore<CourseTrack>(subscribe, getActiveTrack, () => 'pf');
  return [track, setActiveTrack];
}
