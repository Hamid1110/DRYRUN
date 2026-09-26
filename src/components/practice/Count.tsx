'use client';

import { useState } from 'react';
import type { CountQ } from '@/content/types';
import { Icon } from '@/components/ui/Icon';
import { Md } from '@/lib/md';
import { Modal } from '@/components/ui/Modal';
import { QCode } from '@/components/viz/QCode';
import { Visualizer, useRun } from '@/components/viz/Visualizer';
import { countAnswer, countWhat } from '@/lib/count';
import type { QCtx } from './QuestionCard';

export function CountWidget({ q, ctx }: { q: CountQ; ctx: QCtx }) {
  const res = useRun(q.code, q.input ?? '');
  const answer = countAnswer(q, res);
  const [text, setText] = useState('');
  const [watch, setWatch] = useState(false);
  const unit = q.unit ?? 'times';
  const line = 'line' in q.count ? q.count.line : 'checks' in q.count ? q.count.checks : undefined;

  const check = () => {
    const n = Number(text.trim());
    if (!/^-?\d+$/.test(text.trim())) return ctx.say(<><Icon name="alert" size={16} /> Type a whole number.</>);
    if (n === answer) return ctx.right();
    const diff = Math.abs(n - answer);
    ctx.wrong(
      <>
        <Icon name="x-circle" size={16} /> Not {n}.{' '}
        {diff === 1 ? 'You are off by exactly one — check the very first and the very last round (is it < or <=? does it start at 0 or 1?).' : n > answer ? 'Too many — does something stop earlier (a break, a false condition, a short-circuit)?' : 'Too few — look for rounds or calls you skipped.'}
      </>,
    );
  };

  return (
    <div className="count-q">
      <QCode code={q.code} input={q.input} view={q.view} highlight={line ? [line] : undefined} />
      {q.input && (
        <p className="q-input-note">
          <Icon name="keyboard" size={15} /> The user types <code className="ic">{q.input.trim().replace(/\n/g, ' ⏎ ')}</code> ⏎.
        </p>
      )}
      <p className="count-what">
        <Icon name="hash" size={16} /> <Md text={countWhat(q)} />
      </p>
      {!ctx.done ? (
        <div className="count-row">
          <input
            className="input count-input tnum"
            inputMode="numeric"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            placeholder="0"
            aria-label="Your count"
          />
          <span className="count-unit">{unit}</span>
          <button className="btn btn-primary" onClick={check} disabled={!text.trim()}>
            <Icon name="check" /> Check
          </button>
        </div>
      ) : (
        <div className="count-done">
          <span className="count-big tnum">{answer}</span> <span className="count-unit">{unit}</span>
          <button className="btn btn-sm" onClick={() => setWatch(true)}>
            <Icon name="eye" /> Watch it run and count along
          </button>
        </div>
      )}
      {watch && (
        <Modal title="Dry run" onClose={() => setWatch(false)}>
          <Visualizer code={q.code} input={q.input} view={q.view} />
        </Modal>
      )}
    </div>
  );
}
