'use client';

import { useState, type ReactNode } from 'react';
import type { Question } from '@/content/types';
import { Md } from '@/lib/md';
import { levelProgress, recordAnswer, useProgress } from '@/lib/progress';
import { Icon } from '@/components/ui/Icon';
import { McqWidget } from './Mcq';
import { PredictWidget } from './Predict';
import { BlanksWidget } from './Blanks';
import { TraceWidget } from './Trace';
import { ParsonsWidget } from './Parsons';
import { BugWidget } from './Bug';
import { PathsWidget } from './Paths';
import { CountWidget } from './Count';
import { TaskWidget } from './Task';

export interface QCtx {
  status: 'idle' | 'wrong' | 'right' | 'revealed';
  done: boolean;
  tries: number;
  right(): void;
  wrong(msg?: ReactNode): void;
  reveal(): void;
  /** set a message without counting a wrong try */
  say(msg: ReactNode | null): void;
  /** back to neutral (e.g. after a row of a table is fixed) */
  clear(): void;
}

const TYPE: Record<Question['kind'], { label: string; icon: string }> = {
  mcq: { label: 'Choose the answer', icon: 'list' },
  predict: { label: 'Predict the output', icon: 'terminal' },
  blanks: { label: 'Complete the code', icon: 'pencil' },
  trace: { label: 'Dry run table', icon: 'grid' },
  parsons: { label: 'Arrange the lines', icon: 'puzzle' },
  bug: { label: 'Find the bug', icon: 'bug' },
  paths: { label: 'Find every path', icon: 'route' },
  count: { label: 'How many times?', icon: 'hash' },
  task: { label: 'Write the program', icon: 'code' },
};

export function HintLadder({ hints, shown, onMore, locked }: { hints: string[]; shown: number; onMore: () => void; locked: boolean }) {
  if (!hints.length) return null;
  return (
    <div className="hints">
      {hints.slice(0, shown).map((h, i) => (
        <div className="hint" key={i}>
          <span className="hint-num">Hint {i + 1}</span>
          <span>
            <Md text={h} />
          </span>
        </div>
      ))}
      {shown < hints.length && !locked && (
        <button className="btn btn-sm btn-ghost hint-btn" onClick={onMore}>
          <Icon name="bulb" />
          {shown === 0 ? 'Show a hint' : 'Next hint'}
          <span className="hint-left">
            {hints.length - shown} left{shown === hints.length - 1 ? ' — this one gives it away' : ''}
          </span>
        </button>
      )}
    </div>
  );
}

export function QuestionCard({ q, levelId, num, onAnswered }: { q: Question; levelId: string; num?: number; onAnswered?: (ok: boolean) => void }) {
  const p = useProgress();
  const prior = levelProgress(p, levelId).qs[q.id];
  const [status, setStatus] = useState<QCtx['status']>('idle');
  const [tries, setTries] = useState(0);
  const [hints, setHints] = useState(0);
  const [msg, setMsg] = useState<ReactNode | null>(null);

  const finish = (revealed: boolean) => {
    const score = revealed ? 0 : Math.max(0.25, 1 - 0.2 * hints - 0.25 * Math.min(tries, 2));
    recordAnswer(levelId, q.id, { ok: !revealed, tries: tries + 1, hints, revealed, score }, Math.round(score * 10));
    setStatus(revealed ? 'revealed' : 'right');
    setMsg(null);
    onAnswered?.(!revealed);
  };

  const ctx: QCtx = {
    status,
    done: status === 'right' || status === 'revealed',
    tries,
    right: () => finish(false),
    wrong: (m) => {
      setTries((t) => t + 1);
      setStatus('wrong');
      setMsg(m ?? null);
    },
    reveal: () => finish(true),
    say: (m) => setMsg(m),
    clear: () => {
      setStatus('idle');
      setMsg(null);
    },
  };

  const t = TYPE[q.kind];
  let widget: ReactNode = null;
  switch (q.kind) {
    case 'mcq': widget = <McqWidget q={q} ctx={ctx} />; break;
    case 'predict': widget = <PredictWidget q={q} ctx={ctx} />; break;
    case 'blanks': widget = <BlanksWidget q={q} ctx={ctx} />; break;
    case 'trace': widget = <TraceWidget q={q} ctx={ctx} />; break;
    case 'parsons': widget = <ParsonsWidget q={q} ctx={ctx} />; break;
    case 'bug': widget = <BugWidget q={q} ctx={ctx} />; break;
    case 'paths': widget = <PathsWidget q={q} ctx={ctx} />; break;
    case 'count': widget = <CountWidget q={q} ctx={ctx} />; break;
    case 'task': widget = <TaskWidget q={q} ctx={ctx} storeKey={`${levelId}:${q.id}`} />; break;
  }

  return (
    <div className={`qcard is-${status}`}>
      <div className="q-head">
        <span className="q-type">
          <Icon name={t.icon} size={15} />
          {num ? `Q${num} · ` : ''}
          {t.label}
        </span>
        {q.tag && <span className="pill pill-mark">{q.tag}</span>}
        {q.source && (
          <span className="pill pill-gold" title="From a real past paper">
            <Icon name="book" size={12} /> {q.source}
          </span>
        )}
        {prior?.ok && status === 'idle' && (
          <span className="pill pill-ok">
            <Icon name="check" size={12} /> solved before
          </span>
        )}
      </div>
      <div className="q-prompt">
        <Md text={q.prompt} />
      </div>
      {widget}
      {msg && status !== 'right' && status !== 'revealed' && <div className={`q-msg${status === 'wrong' ? ' is-bad' : ''}`}>{msg}</div>}
      {status === 'wrong' && !msg && (
        <div className="q-msg is-bad">
          <Icon name="x-circle" size={16} /> Not quite — look again{q.hints?.length && hints < q.hints.length ? ', or take a hint' : ''}.
        </div>
      )}
      {!ctx.done && <HintLadder hints={q.hints ?? []} shown={hints} onMore={() => setHints((h) => h + 1)} locked={ctx.done} />}
      {!ctx.done && tries >= 2 && (
        <div className="q-giveup">
          <button className="btn btn-sm btn-ghost" onClick={ctx.reveal}>
            <Icon name="eye" /> Show me the answer
          </button>
        </div>
      )}
      {ctx.done && (
        <div className={`q-result ${status === 'right' ? 'is-ok' : 'is-rev'}`}>
          <div className="q-result-head">
            <Icon name={status === 'right' ? 'check-circle' : 'info'} size={18} />
            {status === 'right' ? (tries === 0 && hints === 0 ? 'Correct — first try!' : 'Correct!') : 'Here is the answer. Read why, then try the next one.'}
          </div>
          {q.explain && (
            <div className="q-explain">
              <Md text={q.explain} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
