'use client';

import { useState } from 'react';
import type { MCQ } from '@/content/types';
import { Md } from '@/lib/md';
import { Icon } from '@/components/ui/Icon';
import { QCode } from '@/components/viz/QCode';
import type { QCtx } from './QuestionCard';

export function McqWidget({ q, ctx }: { q: MCQ; ctx: QCtx }) {
  const [wrong, setWrong] = useState<number[]>([]);
  const pick = (k: number) => {
    if (ctx.done || wrong.includes(k)) return;
    if (k === q.answer) ctx.right();
    else {
      setWrong((w) => [...w, k]);
      ctx.wrong();
    }
  };
  return (
    <div className="mcq">
      {q.code && <QCode code={q.code} input={q.input} view={q.view} showOutput={ctx.done} allowRun={ctx.done} />}
      {q.input && (
        <p className="q-input-note">
          <Icon name="keyboard" size={15} /> The user types: <code className="ic">{q.input.trim()}</code>
        </p>
      )}
      <div className="opts" role="list">
        {q.options.map((o, k) => {
          const isRight = ctx.done && k === q.answer;
          const isWrong = wrong.includes(k);
          return (
            <button
              key={k}
              role="listitem"
              className={`opt${isRight ? ' is-right' : ''}${isWrong ? ' is-wrong' : ''}`}
              onClick={() => pick(k)}
              disabled={ctx.done || isWrong}
            >
              <span className="opt-key">{isRight ? <Icon name="check" size={14} /> : isWrong ? <Icon name="x" size={14} /> : 'ABCDEF'[k]}</span>
              <span className="opt-text">
                <Md text={o} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
