'use client';

import { useState } from 'react';
import type { PathHunt } from '@/content/types';
import { runProgram, type RunResult } from '@/engine';
import { Md } from '@/lib/md';
import { CodeBlock } from '@/components/ui/Code';
import { Icon } from '@/components/ui/Icon';
import { OutputView } from './Predict';
import type { QCtx } from './QuestionCard';

export function PathsWidget({ q, ctx }: { q: PathHunt; ctx: QCtx }) {
  const [inp, setInp] = useState(q.start ?? '');
  const [found, setFound] = useState<number[]>([]);
  const [last, setLast] = useState<RunResult | null>(null);
  const [lastInput, setLastInput] = useState('');

  const run = () => {
    const input = inp.trim() ? inp.trim().replace(/\s*,\s*/g, ' ') + '\n' : '';
    const r = runProgram(q.code, { input });
    setLast(r);
    setLastInput(inp.trim());
    if (r.needsInput) return ctx.say(<><Icon name="keyboard" size={16} /> The program wants more input values. Type one value for every <code className="ic">cin</code>.</>);
    const hit = q.paths.map((p, i) => (r.executedLines.includes(p.line) ? i : -1)).filter((i) => i >= 0);
    const fresh = hit.filter((i) => !found.includes(i));
    const all = Array.from(new Set([...found, ...hit]));
    setFound(all);
    if (all.length === q.paths.length) return ctx.right();
    if (fresh.length) {
      ctx.say(
        <>
          <Icon name="check-circle" size={16} /> New path found! {q.paths.length - all.length} still hidden — find an input that goes somewhere else.
        </>,
      );
    } else {
      ctx.say(<><Icon name="undo" size={16} /> That input takes a path you already found. Think: which value would make the condition come out differently?</>);
    }
  };

  const hitLines = last ? q.paths.filter((p) => last.executedLines.includes(p.line)).map((p) => p.line) : [];

  return (
    <div className="paths">
      <CodeBlock code={q.code} highlightLines={hitLines} />
      <div className="paths-bar">
        <label className="paths-input">
          <span>Input</span>
          <input
            value={inp}
            onChange={(e) => setInp(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="e.g. 7   (several values: 3 8)"
            spellCheck={false}
            disabled={ctx.done}
          />
        </label>
        <button className="btn btn-primary" onClick={run} disabled={ctx.done}>
          <Icon name="play" /> Run
        </button>
        <span className="paths-count tnum">
          {found.length} / {q.paths.length} paths found
        </span>
      </div>
      <ul className="path-list">
        {q.paths.map((p, i) => (
          <li key={i} className={found.includes(i) ? 'is-found' : ''}>
            <Icon name={found.includes(i) ? 'check-circle' : 'circle'} size={18} />
            <span>
              <Md text={p.label} />
            </span>
            <span className="path-line mono">line {p.line}</span>
          </li>
        ))}
      </ul>
      {last && !last.compileErrors.length && <OutputView text={last.stdout} label={`Output for input “${lastInput}”`} />}
    </div>
  );
}
