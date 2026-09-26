'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { TaskQ } from '@/content/types';
import { compileOnly, runProgram, type Diag, type RunResult } from '@/engine';
import { Md, inline } from '@/lib/md';
import { Icon } from '@/components/ui/Icon';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { CodeBlock } from '@/components/ui/Code';
import { Visualizer } from '@/components/viz/Visualizer';
import { OutputView, normOut } from './Predict';
import type { QCtx } from './QuestionCard';

export const TASK_STARTER = `#include <iostream>
using namespace std;

int main() {


    return 0;
}
`;

const MAX_STEPS = 20000;

// ---------------------------------------------------------------- comparing outputs

function nums(s: string): number[] {
  return (s.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
}

function squash(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** does the learner's output match the solution's output? */
export function sameOutput(mine: string, want: string, mode: TaskQ['compare']): boolean {
  const m = mode ?? (/\d/.test(want) ? 'numbers' : 'lines');
  if (m === 'exact') return normOut(mine) === normOut(want);
  if (m === 'numbers') {
    const a = nums(mine);
    const b = nums(want);
    return a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < 1e-6);
  }
  const lines = want.split('\n').map(squash).filter(Boolean);
  const hay = squash(mine);
  let at = 0;
  for (const l of lines) {
    const k = hay.indexOf(l, at);
    if (k < 0) return false;
    at = k + l.length;
  }
  return true;
}

// ---------------------------------------------------------------- live syntax check

interface Live {
  state: 'ok' | 'typing' | 'error';
  diag?: Diag;
  okUpTo: number;
}

/** check only the lines the learner has already finished (above the cursor) */
function liveCheck(code: string, cursorLine: number): Live {
  const { errors } = compileOnly(code);
  const first = errors.find((d) => d.kind === 'error');
  const total = code.split('\n').length;
  if (!first) return { state: 'ok', okUpTo: total };
  const atEnd = /at end of input/.test(first.msg);
  if (first.line >= cursorLine || atEnd) return { state: 'typing', okUpTo: Math.max(0, Math.min(first.line, cursorLine) - 1) };
  return { state: 'error', diag: first, okUpTo: first.line - 1 };
}

// ---------------------------------------------------------------- widget

interface TestResult {
  label: string;
  input: string;
  want: string;
  got: string;
  ok: boolean;
  problem?: string;
}

export function TaskWidget({ q, ctx, storeKey }: { q: TaskQ; ctx: QCtx; storeKey?: string }) {
  const key = storeKey ? `dryrun.task.${storeKey}` : null;
  const [code, setCode] = useState(q.starter ?? TASK_STARTER);
  const [cursor, setCursor] = useState(1);
  const [live, setLive] = useState<Live>({ state: 'ok', okUpTo: 0 });
  const [input, setInput] = useState(q.tests[0]?.input ?? '');
  const [run, setRun] = useState<RunResult | null>(null);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [hints, setHints] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const ed = useRef<HTMLTextAreaElement>(null);

  // restore a saved draft
  useEffect(() => {
    if (!key) return;
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) setCode(saved);
    } catch {
      /* ignore */
    }
  }, [key]);
  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, code);
    } catch {
      /* ignore */
    }
  }, [key, code]);

  // live syntax check a moment after typing stops
  useEffect(() => {
    const t = setTimeout(() => setLive(liveCheck(code, cursor)), 350);
    return () => clearTimeout(t);
  }, [code, cursor]);

  const trackCursor = () => {
    const el = ed.current;
    if (!el) return;
    setCursor(el.value.slice(0, el.selectionStart).split('\n').length);
  };

  const expected = useMemo(
    () => q.tests.map((t) => runProgram(q.solution, { input: t.input ?? '', maxSteps: MAX_STEPS }).stdout),
    [q.solution, q.tests],
  );

  const solLines = useMemo(() => q.solution.replace(/\n$/, '').split('\n'), [q.solution]);
  // after the guided steps, each extra hint reveals the next meaningful line of the solution
  const codeHintLines = useMemo(
    () => solLines.map((l, i) => ({ l, i })).filter(({ l }) => l.trim() && !/^\s*(#include|using namespace|int main\(\)|return 0;|[{}]\s*$)/.test(l)),
    [solLines],
  );
  const hintCount = q.steps.length + codeHintLines.length;

  const runMine = () => {
    const r = runProgram(code, { input: input && !input.endsWith('\n') ? input + '\n' : input, maxSteps: MAX_STEPS });
    setRun(r);
  };

  const check = () => {
    const out: TestResult[] = q.tests.map((t, i) => {
      const inp = t.input ?? '';
      const r = runProgram(code, { input: inp, maxSteps: MAX_STEPS });
      const label = t.label ?? `Test ${i + 1}`;
      if (r.compileErrors.length) return { label, input: inp, want: expected[i], got: '', ok: false, problem: `does not compile (line ${r.compileErrors[0].line}: ${r.compileErrors[0].msg})` };
      if (r.runtimeError) return { label, input: inp, want: expected[i], got: r.stdout, ok: false, problem: `crashed: ${r.runtimeError.msg}` };
      if (r.needsInput) return { label, input: inp, want: expected[i], got: r.stdout, ok: false, problem: 'reads more input than the test gives (check how many values you cin)' };
      if (r.truncated) return { label, input: inp, want: expected[i], got: r.stdout, ok: false, problem: 'runs too long — is there an endless loop?' };
      return { label, input: inp, want: expected[i], got: r.stdout, ok: sameOutput(r.stdout, expected[i], q.compare) };
    });
    setResults(out);
    if (out.every((t) => t.ok)) ctx.right();
    else {
      const bad = out.filter((t) => !t.ok).length;
      ctx.wrong(
        <>
          <Icon name="x-circle" size={16} /> {bad} of {out.length} test{out.length === 1 ? '' : 's'} failed. Compare your output with the expected output below, then fix the logic.
        </>,
      );
    }
  };

  const giveUp = () => {
    setShowSol(true);
    ctx.reveal();
  };

  return (
    <div className="task">
      {q.source && (
        <div className="task-source">
          <Icon name="book" size={14} /> {q.source}
        </div>
      )}
      {q.tests[0] && (
        <div className="task-sample">
          <div>
            <span className="field-label">Example input</span>
            <pre>{q.tests[0].input?.trim() || '(no input)'}</pre>
          </div>
          <div>
            <span className="field-label">Expected output</span>
            <pre>{expected[0] || '(nothing)'}</pre>
          </div>
        </div>
      )}

      <div className="task-grid">
        <div className="task-editor">
          <div className="cmp-editor-bar">
            <span className="mono">solution.cpp</span>
            <button className="btn btn-sm btn-ghost" onClick={() => setCode(q.starter ?? TASK_STARTER)} disabled={ctx.done}>
              <Icon name="undo" /> Start over
            </button>
          </div>
          <div onKeyUp={trackCursor} onClick={trackCursor}>
            <CodeEditor ref={ed} value={code} onChange={setCode} onRun={check} className="task-ced" label="Your program" />
          </div>
        </div>

        <div className="task-side">
          <div className={`task-live is-${live.state}`} aria-live="polite">
            <div className="task-live-head">
              <Icon name={live.state === 'error' ? 'alert' : live.state === 'ok' ? 'check-circle' : 'pencil'} size={16} />
              {live.state === 'ok' && <strong>No syntax errors so far</strong>}
              {live.state === 'typing' && <strong>Looks fine up to line {live.okUpTo} — keep writing…</strong>}
              {live.state === 'error' && <strong>Syntax problem on line {live.diag!.line}</strong>}
            </div>
            {live.state === 'error' && live.diag && (
              <div className="task-live-body">
                <code className="task-live-msg">{live.diag.msg}</code>
                {live.diag.help && <p>{inline(live.diag.help)}</p>}
              </div>
            )}
            <p className="task-live-note">Syntax is checked as you finish each line. The logic is checked when you press <strong>Check my solution</strong>.</p>
          </div>

          <label className="play-field">
            <span className="field-label">Try your own input</span>
            <textarea className="textarea" rows={2} value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
          </label>
          <div className="task-buttons">
            <button className="btn" onClick={runMine}>
              <Icon name="play" /> Run
            </button>
            <button className="btn btn-primary" onClick={check} disabled={ctx.done}>
              <Icon name="check" /> Check my solution
            </button>
            <button
              className={`btn ${showSol ? 'btn-warn' : 'btn-ghost'}`}
              onClick={() => setShowSol(!showSol)}
              type="button"
              title="Toggle reference solution and interactive dry run"
            >
              <Icon name={showSol ? 'eye' : 'terminal'} /> {showSol ? 'Hide Solution' : 'Show Solution & Dry Run'}
            </button>
          </div>
          {run && (
            <div className="task-run">
              {run.compileErrors.length ? (
                <div className="task-err">
                  <Icon name="alert" size={15} /> Line {run.compileErrors[0].line}: {run.compileErrors[0].msg}
                </div>
              ) : (
                <OutputView text={run.stdout + (run.runtimeError ? `\n[crashed: ${run.runtimeError.msg}]` : run.needsInput ? '\n[waiting for more input…]' : '')} label="Your program prints" />
              )}
            </div>
          )}
        </div>
      </div>

      {results && (
        <div className="task-tests">
          {results.map((t, i) => (
            <details key={i} className={`task-test ${t.ok ? 'is-ok' : 'is-bad'}`} open={!t.ok}>
              <summary>
                <Icon name={t.ok ? 'check-circle' : 'x-circle'} size={16} /> {inline(t.label)} {t.ok ? 'passed' : t.problem ? `— ${t.problem}` : 'failed'}
              </summary>
              <div className="task-test-body">
                {t.input && (
                  <div>
                    <span className="field-label">Input</span>
                    <pre>{t.input}</pre>
                  </div>
                )}
                <div>
                  <span className="field-label">Expected</span>
                  <pre>{t.want || '(nothing)'}</pre>
                </div>
                <div>
                  <span className="field-label">Yours</span>
                  <pre>{t.got || '(nothing)'}</pre>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}

      {!ctx.done && (
        <div className="task-hints">
          {Array.from({ length: hints }, (_, k) => (
            <div className="hint" key={k}>
              <span className="hint-num">Step {k + 1}</span>
              <span>
                {k < q.steps.length ? (
                  <Md text={q.steps[k]} />
                ) : (
                  <>
                    One line of a working solution (line {codeHintLines[k - q.steps.length].i + 1}): <code className="ic">{codeHintLines[k - q.steps.length].l.trim()}</code>
                  </>
                )}
              </span>
            </div>
          ))}
          <div className="task-hint-row">
            {hints < hintCount ? (
              <button className="btn btn-sm btn-ghost hint-btn" onClick={() => setHints((h) => h + 1)}>
                <Icon name="bulb" /> {hints === 0 ? 'Show a hint' : 'Next hint'}
                <span className="hint-left">{hints < q.steps.length ? 'guided steps' : 'now showing solution lines'} · unlimited</span>
              </button>
            ) : (
              <span className="muted small">That was every hint.</span>
            )}
            <button className="btn btn-sm btn-ghost" onClick={() => setShowSol(!showSol)}>
              <Icon name="terminal" /> {showSol ? 'Hide solution' : 'Show solution & dry run'}
            </button>
          </div>
        </div>
      )}

      {(ctx.done || showSol) && (
        <div className="task-solution">
          <div className="task-sol-head">
            <div className="eyebrow">Model solution & step-by-step dry run</div>
            <button className="btn btn-sm btn-ghost" onClick={() => setShowSol(false)}>
              <Icon name="x" /> Hide
            </button>
          </div>
          <CodeBlock code={q.solution} />
          <div className="task-sol-viz">
            <Visualizer code={q.solution} input={q.tests[0]?.input ?? ''} />
          </div>
        </div>
      )}
    </div>
  );
}
