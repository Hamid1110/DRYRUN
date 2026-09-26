'use client';

import { useMemo, useState } from 'react';
import type { Parsons } from '@/content/types';
import { runProgram, type RunResult } from '@/engine';
import { highlight } from '@/lib/highlight';
import { Icon } from '@/components/ui/Icon';
import { Tokens } from '@/components/ui/Code';
import { CompilerOutput } from '@/components/viz/Visualizer';
import { OutputView } from './Predict';
import type { QCtx } from './QuestionCard';

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

interface PLine {
  id: number;
  text: string;
}

function LineCode({ text }: { text: string }) {
  const toks = useMemo(() => highlight(text)[0] ?? [], [text]);
  return (
    <code className="pz-code">
      <Tokens toks={toks} />
    </code>
  );
}

export function ParsonsWidget({ q, ctx }: { q: Parsons; ctx: QCtx }) {
  const pool = useMemo<PLine[]>(() => {
    const all = [...q.lines.map((t, i) => ({ id: i, text: t })), ...(q.distractors ?? []).map((t, i) => ({ id: 1000 + i, text: t }))];
    const rnd = seeded(q.id);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }, [q]);
  const byId = (id: number) => pool.find((l) => l.id === id)!;
  const [prog, setProg] = useState<number[]>([]);
  const [wrongAt, setWrongAt] = useState<number | null>(null);
  const [run, setRun] = useState<RunResult | null>(null);
  const shownProg = ctx.status === 'revealed' ? q.lines.map((_, i) => i) : prog;
  const bank = pool.filter((l) => !shownProg.includes(l.id));

  const edit = (next: number[]) => {
    setProg(next);
    setWrongAt(null);
    setRun(null);
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= prog.length) return;
    const next = [...prog];
    [next[i], next[j]] = [next[j], next[i]];
    edit(next);
  };

  const check = () => {
    const got = prog.map((id) => byId(id).text.trimEnd());
    const want = q.lines.map((l) => l.trimEnd());
    const k = want.findIndex((w, i) => got[i] !== w);
    if (k < 0 && got.length === want.length) return ctx.right();
    if (k < 0 || k >= got.length) {
      setWrongAt(null);
      return ctx.wrong(<><Icon name="info" size={16} /> Everything so far is in the right order — but the program is not finished. Add the missing lines.</>);
    }
    setWrongAt(k);
    const usedDistractor = prog.some((id) => id >= 1000);
    ctx.wrong(
      <>
        <Icon name="x-circle" size={16} /> Line {k + 1} of your program is not right{usedDistractor ? ' — and at least one line you used does not belong in this program at all' : ''}.
      </>,
    );
  };

  const tryRun = () => setRun(runProgram(prog.map((id) => byId(id).text).join('\n') + '\n', { input: q.input }));

  return (
    <div className="parsons">
      <div className="pz-cols">
        <div className="pz-col">
          <div className="pz-title">
            <Icon name="list" size={15} /> Line bank <span>tap a line to add it</span>
          </div>
          <ul className="pz-list">
            {bank.map((l) => (
              <li key={l.id}>
                <button className="pz-line" onClick={() => edit([...prog, l.id])} disabled={ctx.done}>
                  <Icon name="plus" size={14} />
                  <LineCode text={l.text.trim()} />
                </button>
              </li>
            ))}
            {bank.length === 0 && <li className="pz-empty">All lines used</li>}
          </ul>
        </div>
        <div className="pz-col">
          <div className="pz-title">
            <Icon name="code" size={15} /> Your program <span>{shownProg.length} / {q.lines.length} lines</span>
          </div>
          <ol className="pz-list is-prog">
            {shownProg.map((id, i) => (
              <li key={`${id}-${i}`} className={`pz-row${wrongAt === i ? ' is-wrong' : ''}${ctx.done ? ' is-done' : ''}`}>
                <span className="pz-ln tnum">{i + 1}</span>
                <LineCode text={byId(id).text} />
                {!ctx.done && (
                  <span className="pz-tools">
                    <button className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                      <Icon name="up" size={15} />
                    </button>
                    <button className="icon-btn" onClick={() => move(i, 1)} disabled={i === prog.length - 1} aria-label="Move down">
                      <Icon name="down" size={15} />
                    </button>
                    <button className="icon-btn" onClick={() => edit(prog.filter((_, k) => k !== i))} aria-label="Remove line">
                      <Icon name="x" size={15} />
                    </button>
                  </span>
                )}
              </li>
            ))}
            {shownProg.length === 0 && <li className="pz-empty">Your program is empty — start with the first line.</li>}
          </ol>
        </div>
      </div>
      {!ctx.done && (
        <div className="q-actions">
          <button className="btn btn-primary" onClick={check} disabled={!prog.length}>
            <Icon name="check" /> Check order
          </button>
          <button className="btn" onClick={tryRun} disabled={!prog.length}>
            <Icon name="play" /> Run my program
          </button>
        </div>
      )}
      {run && !ctx.done && (run.compileErrors.length ? <CompilerOutput res={run} /> : <OutputView text={run.stdout} label="Your program prints" />)}
      {ctx.done && <OutputView text={runProgram(q.lines.join('\n') + '\n', { input: q.input }).stdout} label="The finished program prints" />}
    </div>
  );
}
