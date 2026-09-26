'use client';

import { useState } from 'react';
import type { Predict } from '@/content/types';
import { Icon } from '@/components/ui/Icon';
import { Visible } from '@/components/ui/Code';
import { Modal } from '@/components/ui/Modal';
import { QCode } from '@/components/viz/QCode';
import { CompilerOutput, Visualizer, useRun } from '@/components/viz/Visualizer';
import type { QCtx } from './QuestionCard';

/** expand tabs to 8-column stops so a learner can type spaces instead of a tab */
function expandTabs(s: string): string {
  return s
    .split('\n')
    .map((line) => {
      let out = '';
      for (const ch of line) {
        if (ch === '\t') out += ' '.repeat(8 - (out.length % 8));
        else out += ch;
      }
      return out;
    })
    .join('\n');
}

export function normOut(s: string): string {
  return expandTabs(s.replace(/\r/g, ''))
    .split('\n')
    .map((l) => l.replace(/[ ]+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

export function OutputView({ text, label = 'Real output' }: { text: string; label?: string }) {
  const [inv, setInv] = useState(true);
  return (
    <div className="outview">
      <div className="outview-head">
        <span>{label}</span>
        <label className="switch">
          <input type="checkbox" checked={inv} onChange={(e) => setInv(e.target.checked)} />
          <span className="track" />
          show spaces &amp; new lines
        </label>
      </div>
      <pre className="outview-body">{text ? inv ? <Visible text={text} /> : text : <span className="muted">(nothing is printed)</span>}</pre>
    </div>
  );
}

export function PredictWidget({ q, ctx }: { q: Predict; ctx: QCtx }) {
  const res = useRun(q.code, q.input ?? '');
  const expected = res.stdout;
  const [text, setText] = useState('');
  const [watch, setWatch] = useState(false);
  const [mode, setMode] = useState<'out' | 'err'>('out');
  const [errPick, setErrPick] = useState('');
  const errLine = res.compileErrors.find((d) => d.kind === 'error')?.line ?? null;
  const nLines = q.code.replace(/\n$/, '').split('\n').length;

  const check = () => {
    if (mode === 'err') {
      if (errLine === null) {
        return ctx.wrong(
          <>
            <Icon name="x-circle" size={16} /> This code compiles fine — every line is legal C++ (even if it looks strange). Work out what it prints.
          </>,
        );
      }
      if (Number(errPick) !== errLine) {
        return ctx.wrong(
          <>
            <Icon name="alert" size={16} /> Yes — it does NOT compile. But the compiler stops at a different line. Read each line as the compiler would.
          </>,
        );
      }
      return ctx.right();
    }
    if (errLine !== null) {
      return ctx.wrong(
        <>
          <Icon name="x-circle" size={16} /> Careful: this program never runs. Something in it breaks a C++ rule, so the compiler refuses it.
        </>,
      );
    }
    const a = normOut(text);
    const b = normOut(expected);
    if (a === b) return ctx.right();
    const squash = (s: string) => s.replace(/\s+/g, '');
    if (squash(a) === squash(b)) {
      return ctx.wrong(
        <>
          <Icon name="alert" size={16} /> So close! All the characters are right, but a <strong>space or line break</strong> is different. Where does
          the cursor go after each <code className="ic">cout</code>?
        </>,
      );
    }
    const al = a.split('\n');
    const bl = b.split('\n');
    let k = 0;
    while (k < Math.max(al.length, bl.length) && al[k] === bl[k]) k++;
    if (al.length !== bl.length && k >= Math.min(al.length, bl.length)) {
      return ctx.wrong(
        <>
          <Icon name="x-circle" size={16} /> The first {k} line{k === 1 ? ' is' : 's are'} right, but the output has {bl.length} line{bl.length === 1 ? '' : 's'} and yours has {al.length}.
        </>,
      );
    }
    return ctx.wrong(
      <>
        <Icon name="x-circle" size={16} /> {k === 0 ? 'The first line is' : `Lines 1–${k} are right. Line ${k + 1} is`} different. Trace it one statement at a time.
      </>,
    );
  };

  const lines = Math.max(3, expected.split('\n').length + 1);

  return (
    <div className="predict">
      <QCode code={q.code} input={q.input} view={q.view} />
      {q.input && (
        <p className="q-input-note">
          <Icon name="keyboard" size={15} /> The user types <code className="ic">{q.input.trim().replace(/\n/g, ' ⏎ ')}</code> ⏎. Write only what the
          program <em>prints</em>.
        </p>
      )}
      {!ctx.done ? (
        <>
          <div className="pred-mode" role="radiogroup" aria-label="Output or error">
            <button role="radio" aria-checked={mode === 'out'} className={`pred-opt${mode === 'out' ? ' is-on' : ''}`} onClick={() => setMode('out')}>
              <Icon name="terminal" size={15} /> It prints…
            </button>
            <button role="radio" aria-checked={mode === 'err'} className={`pred-opt${mode === 'err' ? ' is-on' : ''}`} onClick={() => setMode('err')}>
              <Icon name="alert" size={15} /> It does not compile
            </button>
          </div>
        </>
      ) : null}
      {!ctx.done && mode === 'err' ? (
        <div className="q-actions pred-err">
          <label className="field-label" htmlFor={`pred-line-${q.id}`}>
            Which line does the compiler complain about?
          </label>
          <select id={`pred-line-${q.id}`} className="input" value={errPick} onChange={(e) => setErrPick(e.target.value)}>
            <option value="">choose a line…</option>
            {Array.from({ length: nLines }, (_, k) => (
              <option key={k} value={k + 1}>
                line {k + 1}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={check} disabled={!errPick}>
            <Icon name="check" /> Check
          </button>
        </div>
      ) : !ctx.done ? (
        <>
          <label className="field-label" htmlFor={`pred-${q.id}`}>
            Your prediction — spaces and new lines count
          </label>
          <textarea
            id={`pred-${q.id}`}
            className="textarea predict-area"
            rows={lines}
            value={text}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            onChange={(e) => setText(e.target.value)}
            placeholder="Type exactly what appears on the screen…"
          />
          <div className="q-actions">
            <button className="btn btn-primary" onClick={check} disabled={!text.trim() && expected.trim() !== ''}>
              <Icon name="check" /> Check
            </button>
          </div>
        </>
      ) : (
        <div className="predict-done">
          {errLine !== null ? (
            <CompilerOutput res={res} />
          ) : (
            <>
              {text && ctx.status === 'right' && <OutputView text={text} label="Your answer" />}
              <OutputView text={expected} />
            </>
          )}
          {errLine === null && (
            <button className="btn btn-sm" onClick={() => setWatch(true)}>
              <Icon name="eye" /> Watch it run step by step
            </button>
          )}
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
