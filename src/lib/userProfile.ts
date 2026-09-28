'use client';

import { useSyncExternalStore } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  institute?: string;
  joinedAt: number;
  prompted: boolean;
}

const STORAGE_KEY = 'dryrun.profile.v1';

let cachedProfile: UserProfile | null = null;
let initialized = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function generateId(): string {
  return 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return cachedProfile;
  if (!initialized) {
    initialized = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        cachedProfile = JSON.parse(raw);
      }
    } catch {
      /* ignore */
    }
  }
  return cachedProfile;
}

export function saveUserProfile(name: string, institute?: string): UserProfile {
  const current = getUserProfile();
  const id = current?.id || generateId();
  const joinedAt = current?.joinedAt || Date.now();
  const cleanName = name.trim();
  const cleanInst = institute?.trim() || undefined;

  const profile: UserProfile = {
    id,
    name: cleanName || (current?.name ?? 'Anonymous Learner'),
    institute: cleanInst,
    joinedAt,
    prompted: true,
  };

  cachedProfile = profile;
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  } catch {
    /* ignore */
  }
  notify();
  return profile;
}

export function dismissProfilePrompt(): void {
  const current = getUserProfile();
  if (current) {
    saveUserProfile(current.name, current.institute);
    return;
  }
  // User chose to skip or dismiss without entering a custom name
  const id = generateId();
  const profile: UserProfile = {
    id,
    name: 'Learner ' + id.slice(-4).toUpperCase(),
    joinedAt: Date.now(),
    prompted: true,
  };
  cachedProfile = profile;
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  } catch {
    /* ignore */
  }
  notify();
}

export function hasPromptedProfile(): boolean {
  if (typeof window === 'undefined') return true;
  const p = getUserProfile();
  return !!p?.prompted;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useUserProfile(): UserProfile | null {
  return useSyncExternalStore<UserProfile | null>(subscribe, getUserProfile, () => null);
}
