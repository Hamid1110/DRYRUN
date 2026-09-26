// Loads the course (or one content file) for the checking scripts.
// Lab sheets (arrays of Lab) are turned into a pseudo-unit so their tasks get checked too.
import { resolve } from 'node:path';
import type { Lab, PaperSet, Unit } from '../src/content/types';

function labsUnit(labs: Lab[]): Unit {
  return {
    id: 'labs',
    num: 99,
    title: 'Labs',
    summary: '',
    levels: labs.map((l) => ({ id: `lab-${l.id}`, kind: 'lesson' as const, title: String(l.title), tagline: '', objectives: [], practice: l.tasks })),
  };
}

function paperUnit(ps: PaperSet[]): Unit {
  return {
    id: 'papers',
    num: 98,
    title: 'Past papers',
    summary: '',
    levels: ps.map((p) => ({ id: `paper-${p.id}`, kind: 'lesson' as const, title: p.title, tagline: '', objectives: [], practice: p.questions.map((x) => x.q) })),
  };
}

const isPapers = (x: unknown): x is PaperSet[] => Array.isArray(x) && x.every((p) => p && typeof p === 'object' && Array.isArray((p as PaperSet).questions) && 'year' in (p as PaperSet));
const isPaper = (x: unknown): x is PaperSet => !!x && typeof x === 'object' && !Array.isArray(x) && Array.isArray((x as PaperSet).questions) && 'year' in (x as PaperSet);
const isUnit = (x: unknown): x is Unit => !!x && typeof x === 'object' && Array.isArray((x as Unit).levels);
const isLabs = (x: unknown): x is Lab[] => Array.isArray(x) && x.every((l) => l && typeof l === 'object' && Array.isArray((l as Lab).tasks));

export async function loadUnits(file = process.argv.find((a) => a.startsWith('--file='))?.slice(7)): Promise<Unit[]> {
  if (!file) {
    const { COURSES } = await import('../src/content/course');
    const units = Object.values(COURSES).flatMap((c) => c.units);
    const labs = (await import('../src/content/labs')).LABS;
    return labs.length ? [...units, labsUnit(labs)] : units;
  }
  const mod = (await import(resolve(file))) as Record<string, unknown>;
  const out: Unit[] = [];
  for (const x of Object.values(mod)) {
    if (isUnit(x)) out.push(x);
    else if (isPaper(x)) out.push(paperUnit([x]));
    else if (isPapers(x) && x.length) out.push(paperUnit(x));
    else if (isLabs(x) && x.length) out.push(labsUnit(x));
  }
  return out;
}
