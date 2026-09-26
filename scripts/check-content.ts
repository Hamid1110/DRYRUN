// Validates every level: code compiles, answers exist, line references are in range,
// blanks are consistent, trace tables have rows, parsons programs run.
// Usage: npx tsx scripts/check-content.ts [--verbose] [--file=src/content/unit7/index.ts]
//   --file checks only the unit exported by that file (it does not need to be in course.ts yet)
import type { Question } from '../src/content/types';
import { loadUnits } from './load-units';
import { runProgram } from '../src/engine';
import { buildTable } from '../src/components/practice/Trace';
import { fillBlanks } from '../src/lib/highlight';
import { countAnswer } from '../src/lib/count';

const verbose = process.argv.includes('--verbose');
let problems = 0;
const ids = new Set<string>();
const bad = (where: string, msg: string) => {
  problems++;
  console.log(`✗ ${where}: ${msg}`);
};
const info = (msg: string) => verbose && console.log(msg);

function mustCompile(where: string, code: string, input = '') {
  const r = runProgram(code, { input });
  if (r.compileErrors.length) bad(where, `does not compile: ${r.compileErrors[0].line}:${r.compileErrors[0].col} ${r.compileErrors[0].msg}`);
  else if (r.runtimeError) bad(where, `runtime error: ${r.runtimeError.msg}`);
  else if (r.needsInput) bad(where, 'needs more input');
  else if (r.truncated) bad(where, 'step limit reached');
  return r;
}

function lineCount(code: string) {
  return code.replace(/\n$/, '').split('\n').length;
}

function checkQ(where: string, q: Question) {
  if (ids.has(q.id)) bad(where, `duplicate question id ${q.id}`);
  ids.add(q.id);
  switch (q.kind) {
    case 'mcq':
      if (q.answer < 0 || q.answer >= q.options.length) bad(where, 'answer index out of range');
      if (q.code && /\bmain\s*\(/.test(q.code)) {
        const r = mustCompile(where, q.code, q.input);
        info(`  ${where} output: ${JSON.stringify(r.stdout)}`);
      }
      break;
    case 'predict': {
      const r0 = runProgram(q.code, { input: q.input });
      if (r0.compileErrors.length) {
        info(`  ${where} expected: COMPILE ERROR line ${r0.compileErrors[0].line}: ${r0.compileErrors[0].msg}`);
        break;
      }
      const r = mustCompile(where, q.code, q.input);
      info(`  ${where} expected: ${JSON.stringify(r.stdout)}`);
      break;
    }
    case 'task': {
      if (!q.tests.length) bad(where, 'task has no tests');
      q.tests.forEach((t, i) => {
        const r = runProgram(q.solution, { input: t.input ?? '', maxSteps: 20000 });
        if (r.compileErrors.length) bad(where, `solution does not compile: ${r.compileErrors[0].line}: ${r.compileErrors[0].msg}`);
        else if (r.runtimeError || r.needsInput || r.truncated) bad(where, `solution fails on test ${i + 1}: ${r.runtimeError?.msg ?? (r.needsInput ? 'needs more input' : 'too many steps')}`);
        else info(`  ${where} test ${i + 1}: ${JSON.stringify(r.stdout)}`);
      });
      if (!q.steps.length) bad(where, 'task has no guided steps');
      break;
    }
    case 'count': {
      const r = mustCompile(where, q.code, q.input);
      const n = countAnswer(q, r);
      if ('line' in q.count && (q.count.line < 1 || q.count.line > lineCount(q.code))) bad(where, 'count line out of range');
      if ('checks' in q.count && (q.count.checks < 1 || q.count.checks > lineCount(q.code))) bad(where, 'count line out of range');
      info(`  ${where} answer: ${n}`);
      break;
    }
    case 'blanks': {
      const markers = (q.code.match(/\[\[(\d+)\]\]/g) ?? []).length;
      if (markers !== q.blanks.length) bad(where, `${markers} markers but ${q.blanks.length} blanks`);
      const code = fillBlanks(q.code, q.blanks.map((b) => b.answers[0]));
      const r = mustCompile(where, code, q.input);
      if (q.output !== undefined && r.stdout !== q.output) bad(where, `output ${JSON.stringify(r.stdout)} != expected ${JSON.stringify(q.output)}`);
      info(`  ${where} solution prints: ${JSON.stringify(r.stdout)}`);
      break;
    }
    case 'trace': {
      const r = mustCompile(where, q.code, q.input);
      const t = buildTable(q, r);
      if (!t.rows.length) bad(where, 'trace table has no rows');
      (q.given ?? []).forEach((g) => g >= t.rows.length && bad(where, `given row ${g} out of range`));
      info(`  ${where} rows: ${t.rows.map((row) => Object.values(row.cells).filter(Boolean).map((c) => JSON.stringify(c!.answer)).join('|')).join('  ')}`);
      break;
    }
    case 'parsons': {
      const r = mustCompile(where, q.lines.join('\n') + '\n', q.input);
      (q.distractors ?? []).forEach((d) => q.lines.includes(d) && bad(where, `distractor equals a real line: ${d}`));
      info(`  ${where} prints: ${JSON.stringify(r.stdout)}`);
      break;
    }
    case 'bug': {
      const r = runProgram(q.code, { input: q.input });
      if (q.bugLine < 1 || q.bugLine > lineCount(q.code)) bad(where, 'bugLine out of range');
      if (q.answer < 0 || q.answer >= q.options.length) bad(where, 'answer index out of range');
      if (r.compileErrors.length) info(`  ${where} error ${r.compileErrors[0].line}: ${r.compileErrors[0].msg} (bug line ${q.bugLine})`);
      else info(`  ${where} compiles, prints ${JSON.stringify(r.stdout)}`);
      const f = mustCompile(`${where} (fixed)`, q.fixed, q.input);
      if (!r.compileErrors.length && f.stdout === r.stdout) bad(where, 'fixed program prints the same as the buggy one');
      break;
    }
    case 'paths': {
      mustCompile(where, q.code, q.start ?? '');
      const n = lineCount(q.code);
      q.paths.forEach((p) => (p.line < 1 || p.line > n) && bad(where, `path line ${p.line} out of range`));
      break;
    }
  }
}

async function main() {
const units = await loadUnits();
const levelIds = new Set<string>();
for (const unit of units) {
  for (const level of unit.levels) {
    if (levelIds.has(level.id)) bad(level.id, 'duplicate level id');
    levelIds.add(level.id);
    const L = `${level.id}`;
    info(`\n== ${L}`);
    level.learn?.forEach((b, i) => {
      if (b.t === 'code' && /\bmain\s*\(/.test(b.code)) mustCompile(`${L} learn#${i}`, b.code, b.input);
      if (b.t === 'viz') mustCompile(`${L} learn#${i} viz`, b.code, b.input);
      if (b.t === 'anatomy') b.notes.forEach((n) => n.lines.forEach((ln) => ln > lineCount(b.code) && bad(`${L} anatomy`, `line ${ln} out of range`)));
      if (b.t === 'compare') b.items.forEach((it, k) => it.good !== false && /\bmain\s*\(/.test(it.code) && mustCompile(`${L} compare#${i}.${k}`, it.code));
    });
    level.ways?.items.forEach((w, i) => {
      const r = mustCompile(`${L} way#${i + 1}`, w.code, w.input);
      info(`  way ${i + 1}: ${JSON.stringify(r.stdout)}`);
    });
    if (level.ways?.check) checkQ(`${L} ways-check`, level.ways.check);
    level.watch?.forEach((d, i) => {
      const r = runProgram(d.code, { input: d.input });
      if (r.compileErrors.length && !/not compile|error/i.test(d.title)) bad(`${L} demo#${i + 1}`, `does not compile: ${r.compileErrors[0].msg}`);
      if (r.needsInput) bad(`${L} demo#${i + 1}`, 'needs more input');
    });
    if (level.think) {
      const t = level.think;
      mustCompile(`${L} think`, t.code, t.input);
      const n = lineCount(t.code);
      t.steps.forEach((s, i) => s.lines?.forEach((ln) => ln > n && bad(`${L} think step ${i + 1}`, `line ${ln} out of range`)));
      if (t.yourTurn) checkQ(`${L} think-yourTurn`, t.yourTurn);
    }
    if (!level.practice.length) bad(L, 'no practice questions');
    level.exam?.questions.forEach((q, i) => checkQ(`${L} EXAM${i + 1} (${q.kind})`, q));
    level.practice.forEach((q, i) => checkQ(`${L} Q${i + 1} (${q.kind})`, q));
  }
}

console.log(problems ? `\n${problems} problem(s)` : '\nall content OK');
process.exit(problems ? 1 : 0);
}
void main();
