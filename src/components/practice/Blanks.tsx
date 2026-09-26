'use client';

import { useMemo, useRef, useState, type ReactNode } from 'react';
import type { Blanks } from '@/content/types';
import { buildFlow, runProgram } from '@/engine';
import { FlowChart } from '@/components/viz/FlowChart';
import { fillBlanks, highlight } from '@/lib/highlight';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { Visualizer } from '@/components/viz/Visualizer';
import { OutputView } from './Predict';
import type { QCtx } from './QuestionCard';

/** remove spaces that are outside string / char literals */
export function normCode(s: string): string {
  let out = '';
  let quote: string | null = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quote) {
      out += c;
      if (c === '\\') {
        out += s[++i] ?? '';
        continue;
      }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      out += c;
      continue;
    }
    if (/\s/.test(c)) continue;
    out += c;
  }
  return out.replace(/;+$/, '');
}

export function BlanksWidget({ q, ctx }: { q: Blanks; ctx: QCtx }) {
  const n = q.blanks.length;
  const [vals, setVals] = useState<string[]>(() => Array(n).fill(''));
  const [bad, setBad] = useState<number[]>([]);
  const [focus, setFocus] = useState(0);
  const [watch, setWatch] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const lines = useMemo(() => highlight(q.code.replace(/\n$/, '')), [q.code]);
  const solution = useMemo(() => fillBlanks(q.code, q.blanks.map((b) => b.answers[0])), [q]);
  const reference = useMemo(() => runProgram(solution, { input: q.input }), [solution, q.input]);
  const shown = ctx.status === 'revealed' ? q.blanks.map((b) => b.answers[0]) : vals;
  const finalCode = ctx.status === 'revealed' ? solution : fillBlanks(q.code, vals);
  const flowG = useMemo(() => (q.view === 'flow' ? buildFlow(solution, q.code) : null), [q.view, solution, q.code]);

  const setVal = (i: number, v: string) => setVals((old) => old.map((x, k) => (k === i ? v : x)));

  const insert = (chip: string) => {
    const el = refs.current[focus];
    const cur = vals[focus] ?? '';
    const s = el?.selectionStart ?? cur.length;
    const e = el?.selectionEnd ?? cur.length;
    const next = cur.slice(0, s) + chip + cur.slice(e);
    setVal(focus, next);
    requestAnimationFrame(() => {
      el?.focus();
      const pos = s + chip.length;
      el?.setSelectionRange(pos, pos);
    });
  };

  const check = () => {
    const val = (i: number) => (q.view === 'flow' ? vals[i].replace(/\?\s*$/, '') : vals[i]);
    const wrong = q.blanks.map((b, i) => (b.answers.some((a) => normCode(a) === normCode(val(i))) ? -1 : i)).filter((i) => i >= 0);
    if (wrong.length === 0) {
      setBad([]);
      return ctx.right();
    }
    if (vals.some((v) => !v.trim())) {
      setBad(vals.map((v, i) => (v.trim() ? -1 : i)).filter((i) => i >= 0));
      return ctx.say(<><Icon name="info" size={16} /> Fill every blank first.</>);
    }
    const r = runProgram(fillBlanks(q.code, vals.map((_, i) => val(i))), { input: q.input });
    const expected = q.output ?? reference.stdout;
    if (!r.compileErrors.length && !r.runtimeError && r.stdout === expected) {
      setBad([]);
      return ctx.right();
    }
    setBad(wrong);
    let msg: ReactNode;
    if (r.compileErrors.length) {
      msg = (
        <>
          <Icon name="x-circle" size={16} /> With your answers the program does not compile: <code className="ic">{r.compileErrors[0].msg}</code> (line {r.compileErrors[0].line})
        </>
      );
    } else {
      msg = (
        <>
          <Icon name="x-circle" size={16} /> Blank {wrong.map((i) => i + 1).join(' and ')} {wrong.length === 1 ? 'is' : 'are'} not right yet. Your program prints{' '}
          <code className="ic">{JSON.stringify(r.stdout)}</code> but it should print <code className="ic">{JSON.stringify(expected)}</code>.
        </>
      );
    }
    ctx.wrong(msg);
  };

  const renderInput = (i: number) => {
    const longest = Math.max(...q.blanks[i].answers.map((a) => a.length));
                    return (
                      <input
                        key={`b${i}`}
                        ref={(el) => {
                          refs.current[i] = el;
                        }}
                        className={`blank${bad.includes(i) ? ' is-bad' : ''}${ctx.done ? ' is-done' : ''}`}
                        style={{ width: `${Math.max(5, longest + 3)}ch` }}
                        value={shown[i] ?? ''}
                        disabled={ctx.done}
                        onChange={(e) => {
                          setVal(i, e.target.value);
                          if (bad.includes(i)) setBad((b) => b.filter((x) => x !== i));
                        }}
                        onFocus={() => setFocus(i)}
                        onKeyDown={(e) => e.key === 'Enter' && check()}
                        aria-label={`Blank ${i + 1}`}
                        placeholder={String(i + 1)}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoCorrect="off"
                      />
                    );
  };

  let blankNo = 0;
  return (
    <div className="blanks">
      {flowG ? (
        <>
          <FlowChart g={flowG} blanks={Object.fromEntries(shown.map((v, i) => [i + 1, v]))} />
          <div className="flow-blanks">
            {q.blanks.map((_, i) => (
              <label key={i} className="flow-blank">
                <span className="blank-tag">{i + 1}</span> Box {i + 1}:{renderInput(i)}
              </label>
            ))}
          </div>
        </>
      ) : (
      <div className="code blanks-code">
        <div className="code-scroll">
          <div className="code-table">
            {lines.map((toks, li) => (
              <div className="cl" key={li}>
                <span className="ln">{li + 1}</span>
                <span className="lc">
                  {toks.map((t, k) => {
                    if (t.cls !== 'blank') return t.cls === 'ws' || t.cls === 'id' ? <span key={k}>{t.text}</span> : <span key={k} className={`t-${t.cls}`}>{t.text}</span>;
                    const i = Number(t.text) - 1;
                    blankNo++;
                    return renderInput(i);
                  })}
                  {toks.length === 0 ? ' ' : null}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
      <span className="sr-only">{blankNo} blanks</span>
      {q.chips && !ctx.done && (
        <div className="chips" aria-label="Syntax you can use">
          <span className="chips-label">Syntax bank — tap to insert into blank {focus + 1}:</span>
          {q.chips.map((c) => (
            <button key={c} className="chip-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => insert(c)}>
              <code>{c}</code>
            </button>
          ))}
        </div>
      )}
      {q.blanks.some((b) => b.hint) && !ctx.done && (
        <ul className="blank-hints">
          {q.blanks.map((b, i) =>
            b.hint ? (
              <li key={i}>
                <span className="blank-tag">{i + 1}</span> {b.hint}
              </li>
            ) : null,
          )}
        </ul>
      )}
      {!ctx.done && (
        <div className="q-actions">
          <button className="btn btn-primary" onClick={check}>
            <Icon name="check" /> Check
          </button>
        </div>
      )}
      {ctx.done && (
        <div className="predict-done">
          <OutputView text={runProgram(finalCode, { input: q.input }).stdout} label="Your completed program prints" />
          <button className="btn btn-sm" onClick={() => setWatch(true)}>
            <Icon name="eye" /> Watch it run step by step
          </button>
        </div>
      )}
      {watch && (
        <Modal title="Dry run of the completed program" onClose={() => setWatch(false)}>
          <Visualizer code={finalCode} input={q.input} view={q.view} />
        </Modal>
      )}
    </div>
  );
}
