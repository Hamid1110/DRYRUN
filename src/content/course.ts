import type { Course, Level, Unit } from './types';
import type { ProgressState } from '@/lib/progress';
import { unit0 } from './unit0';
import { unit1 } from './unit1';
import { unit2 } from './unit2';
import { unit3 } from './unit3';
import { unit4 } from './unit4';
import { unit5 } from './unit5';
import { unit6 } from './unit6';
import { unit7 } from './unit7';
import { unit8 } from './unit8';
import { unit9 } from './unit9';
import { unit10 } from './unit10';
import { unit11 } from './unit11';

import { OOP_COURSE } from './oop';
import { DSA_COURSE } from './dsa';
import { PAPERS } from './papers';

export type CourseTrack = 'pf' | 'oop' | 'dsa';

export interface TrackInfo {
  id: CourseTrack;
  label: string;
  shortLabel: string;
  icon: string;
  desc: string;
}

export const COURSE_TRACKS: TrackInfo[] = [
  {
    id: 'pf',
    label: 'Programming Fundamentals',
    shortLabel: 'PF',
    icon: 'terminal',
    desc: 'Flowcharts, variables, conditions, loops, functions, arrays, pointers and structs',
  },
  {
    id: 'oop',
    label: 'Object Oriented Programming',
    shortLabel: 'OOP',
    icon: 'code',
    desc: 'Classes, encapsulation, constructors, deep copy, operator overloading, inheritance, and polymorphism',
  },
  {
    id: 'dsa',
    label: 'Data Structures',
    shortLabel: 'DSA',
    icon: 'grid',
    desc: 'Big-O complexity, singly & doubly linked lists, stacks, queues, and binary search trees',
  },
];

// ------------------------------------------------------------------ withPapers
function withPapers(units: Unit[]): Unit[] {
  for (const u of units) {
    const cp = u.levels.find((l) => l.kind === 'revision');
    if (!cp) continue;
    const extra = PAPERS.flatMap((p) => p.questions.filter((x) => x.unit === u.num).map((x) => ({ ...x.q, source: x.q.source ?? p.title })));
    if (!extra.length) continue;
    const own = cp.exam?.questions ?? [];
    cp.exam = { ...(cp.exam ?? {}), questions: [...own, ...extra.filter((q) => !own.some((o) => o.id === q.id))] };
  }
  return units;
}

// ------------------------------------------------------------------ Courses
export const PF_COURSE: Course = {
  id: 'pf',
  title: 'Programming Fundamentals',
  lang: 'C++',
  units: withPapers([unit0, unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9, unit10, unit11]),
};

export const COURSES: Record<CourseTrack, Course> = {
  pf: PF_COURSE,
  oop: OOP_COURSE,
  dsa: DSA_COURSE,
};

// Default course for backward compatibility
export const COURSE: Course = PF_COURSE;

// ------------------------------------------------------------------ Lookups

export interface LevelRef {
  level: Level;
  unit: Unit;
  track: CourseTrack;
  /** position in that specific course (0-based, lessons and checkpoints) */
  order: number;
  /** "Level 3" number for lessons, checkpoint number for revisions */
  num: number;
}

export const LEVELS: LevelRef[] = (() => {
  const out: LevelRef[] = [];
  (Object.keys(COURSES) as CourseTrack[]).forEach((trackKey) => {
    const course = COURSES[trackKey];
    let lesson = 0;
    let cp = 0;
    let trackOrder = 0;
    course.units.forEach((unit) => {
      unit.levels.forEach((level) => {
        const num = level.kind === 'revision' ? ++cp : ++lesson;
        out.push({ level, unit, track: trackKey, order: trackOrder++, num });
      });
    });
  });
  return out;
})();

export function findLevel(id: string): LevelRef | undefined {
  return LEVELS.find((l) => l.level.id === id);
}

export function levelLabel(ref: LevelRef): string {
  return ref.level.kind === 'revision' ? `Checkpoint ${ref.num}` : `Level ${ref.num}`;
}

export function isUnlocked(p: ProgressState, id: string): boolean {
  if (p.unlockAll) return true;
  const ref = findLevel(id);
  if (!ref || ref.order === 0) return true;
  const courseLevels = LEVELS.filter((l) => l.track === ref.track);
  const prev = courseLevels[ref.order - 1];
  return !!p.levels[prev.level.id]?.done;
}

export function nextLevel(id: string): LevelRef | undefined {
  const ref = findLevel(id);
  if (!ref) return undefined;
  const courseLevels = LEVELS.filter((l) => l.track === ref.track);
  return courseLevels[ref.order + 1];
}

export function prevLevel(id: string): LevelRef | undefined {
  const ref = findLevel(id);
  if (!ref || ref.order <= 0) return undefined;
  const courseLevels = LEVELS.filter((l) => l.track === ref.track);
  return courseLevels[ref.order - 1];
}

/** first level that is not done yet in the specified course track */
export function resumeLevel(p: ProgressState, track: CourseTrack = 'pf'): LevelRef {
  const courseLevels = LEVELS.filter((l) => l.track === track);
  return courseLevels.find((l) => !p.levels[l.level.id]?.done) ?? courseLevels[courseLevels.length - 1];
}
