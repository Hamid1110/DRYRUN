// Runs every complete program found in the course content through the engine AND g++.
// Usage: npx tsx scripts/content-vs-gpp.ts [--file=src/content/unit7/index.ts]
import { loadUnits } from './load-units';
import { fillBlanks } from '../src/lib/highlight';
import { runCases, type Case } from './engine-test';
import { runProgram } from '../src/engine';

const cases: Case[] = [];
// demos that print an uninitialized variable on purpose: the value is garbage in both, so skip
const GARBAGE = new Set(['variables/demo2', 'input-buffer/demo2']);
const add = (name: string, code: string, input?: string) => {
  if (!/\bmain\s*\(/.test(code) || GARBAGE.has(name)) return;
  cases.push({ name, code, input });
};
async function main() {
const units = await loadUnits();
for (const u of units)
  for (const l of u.levels) {
    l.learn?.forEach((b, i) => {
      if (b.t === 'code' || b.t === 'viz') add(`${l.id}/learn${i}`, b.code, b.input);
      if (b.t === 'compare') b.items.forEach((it, k) => add(`${l.id}/cmp${i}.${k}`, it.code));
    });
    l.ways?.items.forEach((w, i) => add(`${l.id}/way${i + 1}`, w.code, w.input));
    l.watch?.forEach((d, i) => add(`${l.id}/demo${i + 1}`, d.code, d.input));
    if (l.think) add(`${l.id}/think`, l.think.code, l.think.input);
    const qs = [...l.practice, ...(l.exam?.questions ?? []), ...(l.think?.yourTurn ? [l.think.yourTurn] : []), ...(l.ways?.check ? [l.ways.check] : [])];
    qs.forEach((q) => {
      if (q.kind === 'predict' || q.kind === 'trace' || q.kind === 'paths' || q.kind === 'count') add(`${l.id}/${q.id}`, q.code, q.kind === 'paths' ? q.start : q.input);
      if (q.kind === 'mcq' && q.code) add(`${l.id}/${q.id}`, q.code, q.input);
      if (q.kind === 'task') q.tests.forEach((t, k) => add(`${l.id}/${q.id}#${k + 1}`, q.solution, t.input));
      if (q.kind === 'bug') {
        add(`${l.id}/${q.id}`, q.code, q.input);
        add(`${l.id}/${q.id}-fixed`, q.fixed, q.input);
      }
      if (q.kind === 'blanks') add(`${l.id}/${q.id}`, fillBlanks(q.code, q.blanks.map((b) => b.answers[0])), q.input);
      if (q.kind === 'parsons') add(`${l.id}/${q.id}`, q.lines.join('\n') + '\n', q.input);
    });
  }
// programs that intentionally fail to compile must fail in g++ on the same line
for (const c of cases) {
  const r = runProgram(c.code, { input: c.input });
  if (r.compileErrors.length) c.compileErrorLine = r.compileErrors[0].line;
}
const fails = runCases(cases, false);
process.exit(fails ? 1 : 0);
}
void main();
