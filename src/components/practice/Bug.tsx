'use client';

import { useMemo, useState } from 'react';
import type { Bug } from '@/content/types';
import { highlight } from '@/lib/highlight';
import { Md } from '@/lib/md';
import { Icon } from '@/components/ui/Icon';
import { Tokens } from '@/components/ui/Code';
import { RunnableCode } from '@/components/level/Blocks';
import { formatDiag, useRun } from '@/components/viz/Visualizer';
import { OutputView } from './Predict';
import type { QCtx } from './QuestionCard';

export function BugWidget({ q, ctx }: { q: Bug; ctx: QCtx }) {
  const res = useRun(q.code, q.input ?? '');
  const lines = useMemo(() => highlight(q.code.replace(/\n$/, '')), [q.code]);
  const [found, setFound] = useState(false);
  const [badLines, setBadLines] = useState<number[]>([]);
  const [badOpts, setBadOpts] = useState<number[]>([]);
  const stage = ctx.done ? 'done' : found ? 'fix' : 'line';

  const pickLine = (n: number) => {
    if (stage !== 'line') return;
    if (n === q.bugLine) {
      setFound(true);
      ctx.clear();
      return;
    }
    setBadLines((b) => [...b, n]);
    const err = res.compileErrors[0];
    ctx.wrong(
      <>
        <Icon name="x-circle" size={16} /> Line {n} is fine.{' '}
        {err && err.line !== q.bugLine
          ? `Careful: the compiler noticed the problem on line ${err.line}, but the mistake can be just before that.`
          : 'Read the compiler message again — it names a line and a column.'}
      </>,
    );
  };

  const pickFix = (k: number) => {
    if (stage !== 'fix' || badOpts.includes(k)) return;
    if (k === q.answer) ctx.right();
    else {
      setBadOpts((b) => [...b, k]);
      ctx.wrong();
    }
  };

  return (
    <div className="bug">
      {res.compileErrors.length > 0 ? (
        <div className="compiler">
          <div className="compiler-head">
            <Icon name="x-circle" />
            <span>The compiler refuses to build this program</span>
          </div>
          <pre className="compiler-out">
            {"main.cpp: In function 'int main()':\n"}
            {res.compileErrors.filter((d) => d.kind !== 'note').map((d) => formatDiag(d, res.lines)).join('\n')}
          </pre>
        </div>
      ) : (
        <OutputView text={res.stdout} label="It compiles, but it prints" />
      )}

      <div className="bug-steps">
        <span className={`bug-step${stage === 'line' ? ' is-on' : ' is-done'}`}>1 · Click the line with the mistake</span>
        <span className={`bug-step${stage === 'fix' ? ' is-on' : stage === 'done' ? ' is-done' : ''}`}>2 · Choose the fix</span>
      </div>

      <div className="code bug-code">
        <div className="code-scroll">
          {lines.map((toks, i) => {
            const n = i + 1;
            const cls = `bug-line${badLines.includes(n) ? ' is-wrong' : ''}${(found || ctx.done) && n === q.bugLine ? ' is-found' : ''}`;
            return (
              <button key={i} className={cls} onClick={() => pickLine(n)} disabled={stage !== 'line'} aria-label={`Line ${n}`}>
                <span className="ln">{n}</span>
                <span className="lc">
                  <Tokens toks={toks} />
                  {toks.length === 0 ? ' ' : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {stage !== 'line' && (
        <div className="opts">
          {q.options.map((o, k) => {
            const isRight = ctx.done && k === q.answer;
            const isWrong = badOpts.includes(k);
            return (
              <button key={k} className={`opt${isRight ? ' is-right' : ''}${isWrong ? ' is-wrong' : ''}`} onClick={() => pickFix(k)} disabled={ctx.done || isWrong}>
                <span className="opt-key">{isRight ? <Icon name="check" size={14} /> : isWrong ? <Icon name="x" size={14} /> : 'ABCDEF'[k]}</span>
                <span className="opt-text">
                  <Md text={o} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {ctx.done && (
        <div className="bug-fixed">
          <div className="field-label">The fixed program</div>
          <RunnableCode code={q.fixed} input={q.input} highlight={[q.bugLine]} />
        </div>
      )}
    </div>
  );
}
