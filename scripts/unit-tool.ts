// Helper for writing course content.
//   npx tsx scripts/unit-tool.ts --file=src/content/unit7/index.ts list
//   ... lines <id>          numbered code of a question / "levelId:think" / "levelId:watch1" / "levelId:learn3" / "levelId:way2"
//   ... run <id> [input]    output + a compact list of the dry-run steps
//   ... trace <id>          the answer rows of a trace-table question
//   ... paths <id> <input>…  which path lines each input reaches
import type { Level, Question } from '../src/content/types';
import { loadUnits } from './load-units';
import { runProgram } from '../src/engine';
import { buildTable } from '../src/components/practice/Trace';
import { fillBlanks } from '../src/lib/highlight';
import { countAnswer } from '../src/lib/count';

async function main() {
  const file = process.argv.find((a) => a.startsWith('--file='))?.slice(7);
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const [cmd, id, ...rest] = args;
  const units = await loadUnits(file);
  const levels: Level[] = units.flatMap((u) => u.levels);

  const questions = (l: Level): Question[] => [...l.practice, ...(l.exam?.questions ?? []), ...(l.think?.yourTurn ? [l.think.yourTurn] : []), ...(l.ways?.check ? [l.ways.check] : [])];
  const find = (key: string): { code: string; input?: string; q?: Question } | null => {
    const [lid, part] = key.split(':');
    if (part) {
      const l = levels.find((x) => x.id === lid);
      if (!l) return null;
      if (part === 'think' && l.think) return { code: l.think.code, input: l.think.input };
      let m = /^watch(\d+)$/.exec(part);
      if (m && l.watch?.[+m[1] - 1]) return { code: l.watch[+m[1] - 1].code, input: l.watch[+m[1] - 1].input };
      m = /^way(\d+)$/.exec(part);
      if (m && l.ways?.items[+m[1] - 1]) return { code: l.ways.items[+m[1] - 1].code, input: l.ways.items[+m[1] - 1].input };
      m = /^learn(\d+)$/.exec(part);
      const b = m ? l.learn?.[+m[1]] : undefined;
      if (b && 'code' in b) return { code: b.code, input: (b as { input?: string }).input };
      return null;
    }
    for (const l of levels)
      for (const q of questions(l))
        if (q.id === key) {
          let code = 'code' in q ? (q as { code: string }).code : '';
          if (q.kind === 'parsons') code = q.lines.join('\n') + '\n';
          if (q.kind === 'blanks') code = fillBlanks(q.code, q.blanks.map((b) => b.answers[0]));
          const input = q.kind === 'paths' ? q.start : (q as { input?: string }).input;
          return { code, input, q };
        }
    return null;
  };

  if (cmd === 'list') {
    for (const l of levels) {
      console.log(`${l.id}  (${l.kind}) ${l.title}`);
      for (const q of questions(l)) console.log(`   ${q.id.padEnd(22)} ${q.kind}`);
    }
    return;
  }
  const hit = id ? find(id) : null;
  if (!hit) {
    console.log(`not found: ${id}`);
    process.exit(1);
  }
  if (cmd === 'lines') {
    hit.code.replace(/\n$/, '').split('\n').forEach((l, i) => console.log(String(i + 1).padStart(3) + ' | ' + l));
    return;
  }
  const input = rest[0] !== undefined ? rest[0].replace(/\\n/g, '\n') : hit.input ?? '';
  if (cmd === 'run') {
    const r = runProgram(hit.code, { input });
    if (r.compileErrors.length) return console.log('COMPILE ERROR (a predict question accepts "does not compile" on this line)', r.compileErrors.map((d) => `${d.line}:${d.col} ${d.msg}`));
    for (const s of r.steps) console.log(`L${s.line ?? '-'} [${s.kind}] ${s.text.replace(/\n/g, ' // ').slice(0, 160)}`);
    console.log('OUTPUT:', JSON.stringify(r.stdout), r.runtimeError ? 'RUNTIME ERROR: ' + r.runtimeError.msg : '');
    if (hit.q?.kind === 'count') console.log('COUNT ANSWER:', countAnswer(hit.q, r));
    return;
  }
  if (cmd === 'trace') {
    if (hit.q?.kind !== 'trace') return console.log('not a trace question');
    const r = runProgram(hit.code, { input });
    const t = buildTable(hit.q, r);
    console.log(t.cols.map((c) => c.label).join(' | '));
    t.rows.forEach((row, i) => console.log(`${i}: L${row.line} ${row.code}  =>  ` + t.cols.map((c) => (row.cells[c.key] ? JSON.stringify(row.cells[c.key]!.answer) : '·')).join(' | ')));
    return;
  }
  if (cmd === 'paths') {
    if (hit.q?.kind !== 'paths') return console.log('not a paths question');
    const q = hit.q;
    for (const inp of rest) {
      const r = runProgram(hit.code, { input: inp.replace(/\\n/g, '\n') + '\n' });
      const reached = q.paths.filter((p) => r.executedLines.includes(p.line)).map((p) => `${p.line}:${p.label}`);
      console.log(`${JSON.stringify(inp)} → ${reached.join(', ') || 'no path'}   output ${JSON.stringify(r.stdout)}`);
    }
    return;
  }
  console.log('commands: list | lines <id> | run <id> [input] | trace <id> | paths <id> <input>...');
}
void main();
