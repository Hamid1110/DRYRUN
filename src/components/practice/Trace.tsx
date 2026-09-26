'use client';

import { Fragment, useMemo, useState, type ReactNode } from 'react';
import type { TraceQ } from '@/content/types';
import { buildFlow, flowNodeFor, type MemVal, type RunResult } from '@/engine';
import { inline } from '@/lib/md';
import { CodeBlock, Visible } from '@/components/ui/Code';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { Visualizer, buildView, useRun } from '@/components/viz/Visualizer';
import { QCode } from '@/components/viz/QCode';
import type { QCtx } from './QuestionCard';

// ---------------------------------------------------------------- table model

interface Cell {
  answer: string;
  kind: 'var' | 'cond' | 'out';
  given: boolean;
}

interface Row {
  fine: number;
  /** open the visualizer just before this step happens */
  before: number;
  line: number | null;
  kind?: string;
  code: string;
  cells: Record<string, Cell | null>;
  hint: string;
}

interface Col {
  key: string;
  label: string;
  kind: 'var' | 'cond' | 'out';
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t');

export function buildTable(q: TraceQ, res: RunResult): { cols: Col[]; rows: Row[] } {
  const t = buildTableRaw(q, res);
  if (q.view !== 'flow') return t;
  // flowchart questions: name the box instead of showing C++
  const g = buildFlow(q.code);
  if (g) {
    for (const r of t.rows) {
      const n = flowNodeFor(g, { kind: r.kind ?? 'out', line: r.line });
      r.code = n ? n.label.join(' ') : '';
      r.hint = r.hint.replace(/^Look at line \d+\.?|^Line \d+:/, 'Look at this box:');
    }
  }
  return t;
}

function buildTableRaw(q: TraceQ, res: RunResult): { cols: Col[]; rows: Row[] } {
  const view = buildView(res, false);
  const printedAt = (k: number) => {
    const from = k > 0 ? view[k - 1].step.consoleLen : 0;
    return res.console
      .slice(from, view[k].step.consoleLen)
      .filter((s) => s.kind === 'out')
      .map((s) => s.text)
      .join('');
  };
  const skip = new Set(['start', 'end', 'compile', 'return', 'wait', 'error']);
  const srcLine = (l: number | null) => (l ? (res.lines[l - 1] ?? '').trim() : '');

  if (q.mode === 'output') {
    const cols: Col[] = [{ key: 'out', label: 'Text printed by this line', kind: 'out' }];
    const rows: Row[] = [];
    view.forEach((v, k) => {
      if (skip.has(v.step.kind)) return;
      const out = printedAt(k);
      if (!out) return;
      rows.push({
        fine: v.fineIndex,
        before: Math.max(0, v.firstFine - 1),
        line: v.step.line,
        kind: v.step.kind,
        code: srcLine(v.step.line),
        cells: { out: { answer: out, kind: 'out', given: false } },
        hint: `Look at line ${v.step.line}: what exactly is inside the quotes, and is there an \`endl\` or \`\\n\`?`,
      });
    });
    (q.given ?? []).forEach((r) => rows[r] && Object.values(rows[r].cells).forEach((c) => c && (c.given = true)));
    return { cols, rows };
  }

  // vars mode
  const names = q.vars ?? Array.from(new Set(res.steps.flatMap((s) => s.frames.flatMap((f) => f.vars.map((v) => v.name)))));
  const hasCond = view.some((v) => v.step.kind === 'cond' || v.step.kind === 'loop');
  const cols: Col[] = [
    ...names.map((n) => ({ key: `v:${n}`, label: n, kind: 'var' as const })),
    ...(hasCond ? [{ key: 'cond', label: 'Condition', kind: 'cond' as const }] : []),
    { key: 'out', label: 'Output', kind: 'out' },
  ];
  const rows: Row[] = [];
  view.forEach((v, k) => {
    if (skip.has(v.step.kind)) return;
    const cells: Record<string, Cell | null> = {};
    let any = false;
    const vars = v.step.frames.flatMap((f) => f.vars);
    names.forEach((n) => {
      // a column can be a whole variable (x) or one box inside it (arr[2], m[1][0], s.age)
      const m = /^(\w+)((?:\[\d+\]|\.\w+)+)?$/.exec(n);
      const base = m ? m[1] : n;
      const cand = [...v.step.globals, ...vars].filter((x) => x.name === base);
      const snap = cand[cand.length - 1];
      if (snap && m && m[2]) {
        let val: MemVal | undefined = snap.val;
        for (const part of m[2].match(/\[\d+\]|\.\w+/g) ?? []) {
          const label = part.startsWith('[') ? part.slice(1, -1) : part.slice(1);
          val = val?.items?.find((it) => it.label === label)?.val;
        }
        if (val && v.changedAddrs.includes(val.addr)) {
          cells[`v:${n}`] = { answer: val.display, kind: 'var', given: val.uninit };
          any = true;
        } else cells[`v:${n}`] = null;
        return;
      }
      if (snap && v.changed.includes(snap.key)) {
        cells[`v:${n}`] = { answer: snap.display, kind: 'var', given: snap.uninit };
        any = true;
      } else cells[`v:${n}`] = null;
    });
    if (hasCond) {
      if ((v.step.kind === 'cond' || v.step.kind === 'loop') && v.step.branch) {
        cells.cond = { answer: String(v.step.branch.result), kind: 'cond', given: false };
        any = true;
      } else cells.cond = null;
    }
    const out = printedAt(k);
    cells.out = out ? { answer: out, kind: 'out', given: false } : null;
    if (out) any = true;
    if (!any) return;
    let hint = `Look at line ${v.step.line}.`;
    if (v.step.kind === 'cond') hint = `Line ${v.step.line}: put the current values into the condition, work it out, then decide true or false.`;
    else if (v.step.kind === 'decl' || v.step.kind === 'assign') hint = `Line ${v.step.line}: work out the right-hand side first, then store it.`;
    else if (v.step.kind === 'in') hint = `Line ${v.step.line}: cin takes the next value the user typed.`;
    else if (v.step.kind === 'out') hint = `Line ${v.step.line}: print the text and the current values, in order.`;
    rows.push({ fine: v.fineIndex, before: Math.max(0, v.firstFine - 1), line: v.step.line, kind: v.step.kind, code: srcLine(v.step.line), cells, hint });
  });
  (q.given ?? []).forEach((r) => rows[r] && Object.values(rows[r].cells).forEach((c) => c && (c.given = true)));
  return { cols, rows };
}

// ---------------------------------------------------------------- answer matching

function unq(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1);
  return t;
}

/** what the learner typed, with \n \t \\ \" (and ↵ →) turned into real characters */
export function decodeTyped(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '↵') {
      out += '\n';
      continue;
    }
    if (c === '→') {
      out += '\t';
      continue;
    }
    if (c === '\\' && i + 1 < s.length) {
      const n = s[i + 1];
      const map: Record<string, string> = { n: '\n', t: '\t', '\\': '\\', '"': '"', "'": "'" };
      if (n in map) {
        out += map[n];
        i++;
        continue;
      }
    }
    out += c;
  }
  return out;
}

export function sameCell(input: string, cell: Cell): boolean {
  const raw = input ?? '';
  if (cell.kind === 'out') {
    const typed = decodeTyped(raw);
    return typed === cell.answer || typed.replace(/[ ]+$/g, '') === cell.answer.replace(/[ ]+$/g, '');
  }
  const a = raw.trim().toLowerCase();
  const b = cell.answer.trim().toLowerCase();
  if (a === b) return true;
  if (cell.kind === 'cond' || b === 'true' || b === 'false') {
    const t = ['true', '1', 't', 'yes'];
    const f = ['false', '0', 'f', 'no'];
    return (b === 'true' && t.includes(a)) || (b === 'false' && f.includes(a));
  }
  if (b === '?') return ['?', 'garbage', 'g', '-', ''].includes(a);
  if (unq(a) === unq(b)) return true;
  const na = Number(unq(a));
  const nb = Number(unq(b));
  if (unq(a) !== '' && !Number.isNaN(na) && !Number.isNaN(nb)) return Math.abs(na - nb) < 1e-9;
  return false;
}

function showAnswer(c: Cell): ReactNode {
  if (c.kind === 'out') return <Visible text={c.answer} />;
  return c.answer;
}

// ---------------------------------------------------------------- widget

export function TraceWidget({ q, ctx }: { q: TraceQ; ctx: QCtx }) {
  const res = useRun(q.code, q.input ?? '');
  const { cols, rows } = useMemo(() => buildTable(q, res), [q, res]);
  const needs = (r: Row) => Object.values(r.cells).some((c) => c && !c.given);
  const firstActive = (from: number) => {
    let k = from;
    while (k < rows.length && !needs(rows[k])) k++;
    return k;
  };
  const [cur, setCur] = useState(() => firstActive(0));
  const [vals, setVals] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState<string[]>([]);
  const [rowTries, setRowTries] = useState(0);
  const [watch, setWatch] = useState<number | null>(null);
  const done = ctx.done || cur >= rows.length;

  const key = (r: number, c: string) => `${r}:${c}`;

  const advance = () => {
    const nxt = firstActive(cur + 1);
    setCur(nxt);
    setWrong([]);
    setRowTries(0);
    if (nxt >= rows.length) ctx.right();
    else ctx.clear();
  };

  const checkRow = () => {
    const row = rows[cur];
    const bad: string[] = [];
    cols.forEach((c) => {
      const cell = row.cells[c.key];
      if (cell && !cell.given && !sameCell(vals[key(cur, c.key)] ?? '', cell)) bad.push(c.key);
    });
    if (!bad.length) return advance();
    setWrong(bad);
    setRowTries((t) => t + 1);
    ctx.wrong(
      <>
        <span>
          <Icon name="route" size={16} /> Off track at step {cur + 1}. {inline(row.hint)}
        </span>
        <button className="btn btn-sm" onClick={() => setWatch(row.before)}>
          <Icon name="eye" /> Watch this step
        </button>
      </>,
    );
  };

  const revealRow = () => {
    const row = rows[cur];
    const patch: Record<string, string> = {};
    cols.forEach((c) => {
      const cell = row.cells[c.key];
      if (cell) patch[key(cur, c.key)] = cell.kind === 'out' ? esc(cell.answer) : cell.answer;
    });
    setVals((v) => ({ ...v, ...patch }));
    setWrong([]);
    advance();
  };

  const activeLine = !done ? rows[cur]?.line : null;
  const screen = (() => {
    // output produced by rows that are already solved
    let s = '';
    rows.forEach((r, i) => {
      if (i < cur || done) s += r.cells.out?.answer ?? '';
    });
    return s;
  })();

  return (
    <div className="trace">
      <div className="trace-top">
        <div className="trace-code">
          {q.view === 'flow' ? <QCode code={q.code} view="flow" highlight={activeLine ? [activeLine] : []} /> : <CodeBlock code={q.code} highlightLines={activeLine ? [activeLine] : []} />}
        </div>
        <div className="trace-side">
          {q.input !== undefined && q.input !== '' && (
            <div className="trace-input">
              <Icon name="keyboard" size={15} /> Input: <code className="ic">{q.input.trim().replace(/\n/g, ' ⏎ ')}</code>
            </div>
          )}
          <div className="trace-screen">
            <div className="trace-screen-head">
              <Icon name="terminal" size={14} /> Screen so far
            </div>
            <pre>{screen ? <Visible text={screen} /> : <span className="muted">(empty)</span>}</pre>
          </div>
          <p className="trace-how">
            Fill the <strong>active row</strong> and press <kbd>Enter</kbd>. Leave a cell empty where nothing changes.
            {q.mode === 'output' ? ' Type \\n (or tap ↵) for a new line.' : ' A value in memory, true/false for a condition, and what gets printed.'}
          </p>
        </div>
      </div>

      <div className="tt-wrap">
        <table className="tt">
          <thead>
            <tr>
              <th className="tt-n">#</th>
              <th className="tt-line">{q.view === 'flow' ? '' : 'Line'}</th>
              <th className="tt-code">{q.view === 'flow' ? 'Box' : 'Code'}</th>
              {cols.map((c) => (
                <th key={c.key} className={`tt-h is-${c.kind}`}>
                  {c.kind === 'var' ? <code>{c.label}</code> : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const state = done || i < cur ? 'done' : i === cur ? 'active' : 'todo';
              return (
                <tr key={i} className={`tt-row is-${state}`}>
                  <td className="tt-n tnum">{i + 1}</td>
                  <td className="tt-line tnum">{q.view === 'flow' ? '' : r.line}</td>
                  <td className="tt-code">
                    <code>{r.code}</code>
                  </td>
                  {cols.map((c) => {
                    const cell = r.cells[c.key];
                    if (!cell) return <td key={c.key} className="tt-empty" aria-label="no change" />;
                    const k = key(i, c.key);
                    if (cell.given || state === 'done') {
                      return (
                        <td key={c.key} className={`tt-val${cell.given ? ' is-given' : ''} is-${cell.kind}`}>
                          <span className="tt-ans">{showAnswer(cell)}</span>
                        </td>
                      );
                    }
                    if (state === 'active') {
                      return (
                        <td key={c.key} className={`tt-in is-${cell.kind}`}>
                          <div className="tt-field">
                            <input
                              className={`tt-input${wrong.includes(c.key) ? ' is-bad' : ''}`}
                              value={vals[k] ?? ''}
                              onChange={(e) => {
                                setVals((v) => ({ ...v, [k]: e.target.value }));
                                if (wrong.includes(c.key)) setWrong((w) => w.filter((x) => x !== c.key));
                              }}
                              onKeyDown={(e) => e.key === 'Enter' && checkRow()}
                              aria-label={`Step ${i + 1}, ${c.label}`}
                              placeholder={cell.kind === 'cond' ? 'true / false' : cell.kind === 'out' ? 'printed text' : 'value'}
                              spellCheck={false}
                              autoCapitalize="off"
                              autoCorrect="off"
                            />
                            {cell.kind === 'out' && (
                              <button className="tt-nl" title="Insert a new line (\n)" onClick={() => setVals((v) => ({ ...v, [k]: (v[k] ?? '') + '\\n' }))}>
                                ↵
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={c.key} className="tt-q" aria-label="to do">
                        ?
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!done && rows.length > 0 && (
        <div className="q-actions">
          <button className="btn btn-primary" onClick={checkRow}>
            <Icon name="check" /> Check step {cur + 1}
          </button>
          <button className="btn btn-ghost" onClick={() => setWatch(rows[cur].before)}>
            <Icon name="eye" /> Watch this step
          </button>
          {rowTries >= 2 && (
            <button className="btn btn-ghost" onClick={revealRow}>
              <Icon name="undo" /> Show this row
            </button>
          )}
        </div>
      )}
      {done && (
        <p className="trace-done">
          <Icon name="check-circle" size={16} /> Table complete{' '}
          {res.stdout ? (
            <Fragment>
              — final output: <code className="ic">{JSON.stringify(res.stdout)}</code>
            </Fragment>
          ) : null}
        </p>
      )}
      {watch !== null && (
        <Modal title="Watch the dry run" onClose={() => setWatch(null)}>
          <Visualizer code={q.code} input={q.input} startAt={watch} view={q.view} />
        </Modal>
      )}
    </div>
  );
}
