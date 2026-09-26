'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { runProgram, type Calc, type ConsoleSeg, type Diag, type RunResult, type Step } from '@/engine';
import { highlight, type HTok } from '@/lib/highlight';
import { inline } from '@/lib/md';
import { Tokens, Visible } from '@/components/ui/Code';
import { Icon } from '@/components/ui/Icon';
import { MemoryView } from './Memory';
import { FlowChart } from './FlowChart';
import { buildFlow, flowNodeFor, type FlowGraph, type FlowNode } from '@/engine';

// ---------------------------------------------------------------- data helpers

export interface ViewStep {
  step: Step;
  texts: string[];
  calcs: Calc[];
  fineIndex: number;
  firstFine: number;
  next: number | null;
  changed: string[];
  changedAddrs: string[];
}

export function buildView(res: RunResult, fine: boolean): ViewStep[] {
  const steps = res.steps;
  if (fine) {
    return steps.map((s, i) => ({ step: s, texts: [s.text], calcs: s.calcs, fineIndex: i, firstFine: i, next: s.next, changed: s.changed, changedAddrs: s.changedAddrs ?? [] }));
  }
  const out: ViewStep[] = [];
  let texts: string[] = [];
  let calcs: Calc[] = [];
  let changed: string[] = [];
  let changedAddrs: string[] = [];
  let first = -1;
  steps.forEach((s, i) => {
    if (first < 0) first = i;
    texts.push(s.text);
    calcs = calcs.concat(s.calcs);
    changed = changed.concat(s.changed);
    changedAddrs = changedAddrs.concat(s.changedAddrs ?? []);
    if (!s.sub) {
      out.push({ step: s, texts, calcs, fineIndex: i, firstFine: first, next: null, changed, changedAddrs });
      texts = [];
      calcs = [];
      changed = [];
      changedAddrs = [];
      first = -1;
    }
  });
  out.forEach((v, k) => {
    v.next = out[k + 1]?.step.line ?? null;
  });
  return out;
}

export function useRun(code: string, input: string, setup = false): RunResult {
  return useMemo(() => runProgram(code, { input, explainSetup: setup }), [code, input, setup]);
}

export function usesInput(code: string): boolean {
  return /\bcin\b|getline\s*\(/.test(code);
}

export function formatDiag(d: Diag, lines: string[]): string {
  const head = `main.cpp:${d.line}:${d.col}: ${d.kind}: ${d.msg}`;
  if (d.kind === 'note' && d.line === 1 && d.col === 1) return head;
  const src = lines[d.line - 1] ?? '';
  const num = String(d.line).padStart(5, ' ');
  const pad = ' '.repeat(5);
  const caretPos = Math.max(0, Math.min(d.col - 1, src.length));
  const before = src.slice(0, caretPos).replace(/[^\t]/g, ' ');
  return `${head}\n${num} | ${src}\n${pad} | ${before}^`;
}

function Focus({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\u0001([\s\S]*?)\u0002/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<mark key={k++}>{m[1]}</mark>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function CalcView({ c }: { c: Calc }) {
  return (
    <div className="calc">
      {c.label && <div className="calc-label">Value for <code>{c.label}</code></div>}
      {c.lines.map((l, i) => (
        <div className="calc-line" key={i}>
          <span className="calc-arrow" aria-hidden="true">{i === 0 ? '' : '→'}</span>
          <code className="calc-expr">
            <Focus text={l.text} />
          </code>
          {l.note && <span className="calc-note">{l.note}</span>}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- code panel

function lineOffsets(code: string): number[] {
  const offs = [0];
  for (let i = 0; i < code.length; i++) if (code[i] === '\n') offs.push(i + 1);
  return offs;
}

function HlTokens({ toks, lineStart, hl }: { toks: HTok[]; lineStart: number; hl?: { start: number; end: number } }) {
  if (!hl) return <Tokens toks={toks} />;
  const out: ReactNode[] = [];
  let off = lineStart;
  toks.forEach((t, i) => {
    const a = off;
    const b = off + t.text.length;
    off = b;
    const cls = t.cls === 'ws' || t.cls === 'id' ? undefined : `t-${t.cls}`;
    if (b <= hl.start || a >= hl.end) {
      out.push(<span key={i} className={cls}>{t.text}</span>);
      return;
    }
    const s = Math.max(a, hl.start) - a;
    const e = Math.min(b, hl.end) - a;
    if (s > 0) out.push(<span key={`${i}a`} className={cls}>{t.text.slice(0, s)}</span>);
    out.push(
      <mark key={`${i}m`} className={`vz-hl ${cls ?? ''}`}>
        {t.text.slice(s, e)}
      </mark>,
    );
    if (e < t.text.length) out.push(<span key={`${i}b`} className={cls}>{t.text.slice(e)}</span>);
  });
  return <>{out}</>;
}

function Arrow({ kind }: { kind: 'exec' | 'next' }) {
  return (
    <svg className={`vz-arrow is-${kind}`} viewBox="0 0 22 14" width="22" height="14" aria-hidden="true">
      <path d="M1 5h12V1l8 6-8 6V9H1z" />
    </svg>
  );
}

// ---------------------------------------------------------------- memory panel

// ---------------------------------------------------------------- console

function ConsoleView({ segs, upto, from, showInv, finished, exitCode, crashed }: { segs: ConsoleSeg[]; upto: number; from: number; showInv: boolean; finished: boolean; exitCode: number | null; crashed: boolean }) {
  const ref = useRef<HTMLPreElement>(null);
  const shown = segs.slice(0, upto);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [upto]);
  return (
    <pre className="con" ref={ref}>
      {shown.map((s, i) => (
        <span key={i} className={`con-${s.kind}${i >= from ? ' is-new' : ''}`}>
          {showInv ? <Visible text={s.text} /> : s.text}
        </span>
      ))}
      {!finished && <span className="cursor" />}
      {finished && !crashed && (
        <span className="con-exit">
          {shown.length && !shown[shown.length - 1].text.endsWith('\n') ? '\n' : ''}[Process exited with return value {exitCode ?? 0}]
        </span>
      )}
    </pre>
  );
}

function StdinView({ input, pos }: { input: string; pos: number }) {
  if (!input) return <div className="stdin is-empty">No input given</div>;
  const done = input.slice(0, pos);
  const rest = input.slice(pos);
  return (
    <div className="stdin">
      <span className="stdin-used">
        <Visible text={done} />
      </span>
      <span className="stdin-caret" aria-hidden="true" />
      <span className="stdin-rest">
        <Visible text={rest} />
      </span>
    </div>
  );
}

// ---------------------------------------------------------------- compile errors

export function CompilerOutput({ res }: { res: RunResult }) {
  const errs = res.compileErrors;
  const first = errs.find((d) => d.kind === 'error');
  return (
    <div className="compiler">
      <div className="compiler-head">
        <Icon name="x-circle" />
        <span>The compiler stopped. Nothing ran — fix the error first.</span>
      </div>
      <pre className="compiler-out">
        {"main.cpp: In function 'int main()':\n"}
        {errs.map((d) => formatDiag(d, res.lines)).join('\n')}
      </pre>
      {first?.help && (
        <div className="compiler-help">
          <strong>In plain English:</strong> {inline(first.help)}
        </div>
      )}
    </div>
  );
}

export function WarningsView({ res }: { res: RunResult }) {
  if (!res.warnings.length) return null;
  return (
    <details className="warnings">
      <summary>
        <Icon name="alert" /> Compiler {res.warnings.length === 1 ? 'warning' : 'warnings'} ({res.warnings.length}) — the program still runs
      </summary>
      {res.warnings.map((w, i) => (
        <div key={i} className="warning">
          <pre>{formatDiag(w, res.lines)}</pre>
          {w.help && <p>{inline(w.help)}</p>}
        </div>
      ))}
    </details>
  );
}

// ---------------------------------------------------------------- main component

const SPEEDS = { slow: 1500, normal: 900, fast: 420 } as const;
const KIND_LABEL: Record<string, string> = {
  compile: 'Before running',
  start: 'Start',
  decl: 'New variable',
  assign: 'Change a value',
  expr: 'Expression',
  out: 'Output',
  in: 'Input',
  cond: 'Decision',
  loop: 'Loop check',
  switch: 'switch',
  jump: 'Jump',
  return: 'return',
  end: 'Finished',
  error: 'Runtime error',
  wait: 'Waiting for input',
};

export interface VisualizerProps {
  code: string;
  input?: string;
  title?: ReactNode;
  fine?: boolean;
  setup?: boolean;
  /** fine-grained step index to open at */
  startAt?: number;
  editableInput?: boolean;
  variant?: 'full' | 'hero';
  autoplay?: boolean;
  /** show a flowchart instead of the code */
  view?: 'code' | 'flow';
}

/** plain-language text for a flowchart dry-run step */
function flowText(v: ViewStep, node: FlowNode | null, res: RunResult, prevLen: number): string {
  const s = v.step;
  const label = node ? node.label.join(' ') : '';
  const vars = s.frames.flatMap((f) => f.vars).filter((x) => v.changed.includes(x.key));
  const varText = vars.map((x) => `**${x.name}** = ${x.display}`).join(', ');
  const printed = res.console
    .slice(prevLen, s.consoleLen)
    .filter((c) => c.kind === 'out')
    .map((c) => c.text)
    .join('');
  switch (s.kind) {
    case 'start':
      return 'The algorithm starts at the **Start** box. From here we simply follow the arrows, one box at a time.';
    case 'end':
      return 'We reached the **Stop** box, so the algorithm is finished.' + (s.text.includes('leak') ? '' : '');
    case 'cond':
    case 'loop':
      return `Decision box: **${label}** → the answer is **${s.branch?.result ? 'Yes' : 'No'}**, so we follow the **${s.branch?.result ? 'Yes' : 'No'}** arrow.`;
    case 'in':
      return `Input box: the user types a value, and it is stored: ${varText || label}.`;
    case 'out':
      return printed ? `Output box: the screen shows ${JSON.stringify(printed).replace(/\\n/g, '↵')}.` : `Output box: **${label}**.`;
    case 'wait':
      return 'The algorithm needs another input value, but there is none. Add one in the Input box and run again.';
    case 'error':
      return s.text;
    default:
      return varText ? `Process box: **${label}** → now ${varText}.` : `Process box: **${label}**.`;
  }
}

export function Visualizer({ code, input: input0 = '', title, fine: fine0 = false, setup = false, startAt, editableInput, variant = 'full', autoplay = false, view: mode = 'code' }: VisualizerProps) {
  const [input, setInput] = useState(input0);
  const [draft, setDraft] = useState(input0);
  const [editing, setEditing] = useState(false);
  const [fine, setFine] = useState(fine0);
  const [showInv, setShowInv] = useState(false);
  const [showAddr, setShowAddr] = useState(false);
  const [asFlow, setAsFlow] = useState(mode === 'flow');
  const flow: FlowGraph | null = useMemo(() => (mode === 'flow' ? buildFlow(code) : null), [code, mode]);
  const [playing, setPlaying] = useState(autoplay);
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>(variant === 'hero' ? 'slow' : 'normal');
  const res = useRun(code, input, setup);
  const view = useMemo(() => buildView(res, fine), [res, fine]);
  const initial = useMemo(() => {
    if (startAt === undefined) return 0;
    const k = view.findIndex((v) => v.fineIndex >= startAt);
    return k < 0 ? view.length - 1 : k;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAt, res]);
  const [idx, setIdx] = useState(initial);
  const codeRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hasInput = usesInput(code);
  const canEdit = editableInput ?? hasInput;

  // keep position sensible when the view changes
  const [prevView, setPrevView] = useState(view);
  if (prevView !== view) {
    setPrevView(view);
    const oldFine = prevView[idx]?.fineIndex ?? 0;
    const sameRun = prevView.length && prevView[0].step === view[0]?.step;
    if (sameRun) {
      const k = view.findIndex((v) => v.fineIndex >= oldFine);
      setIdx(k < 0 ? view.length - 1 : k);
    } else setIdx(0);
  }

  const n = view.length;
  const cur = view[Math.min(idx, n - 1)];
  const go = useCallback((k: number) => setIdx(Math.max(0, Math.min(n - 1, k))), [n]);

  // autoplay
  useEffect(() => {
    if (!playing) return;
    if (idx >= n - 1) {
      if (variant === 'hero') {
        const t = setTimeout(() => setIdx(0), 2600);
        return () => clearTimeout(t);
      }
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setIdx((i) => i + 1), SPEEDS[speed]);
    return () => clearTimeout(t);
  }, [playing, idx, n, speed, variant]);

  // keep the running line in view (inside the code panel only)
  useEffect(() => {
    const box = codeRef.current;
    if (!box || !cur) return;
    const el = box.querySelector<HTMLElement>('.vl.is-exec') ?? box.querySelector<HTMLElement>('.vl.is-next');
    if (!el) return;
    const top = el.offsetTop;
    if (top < box.scrollTop + 24 || top > box.scrollTop + box.clientHeight - 48) {
      box.scrollTo({ top: Math.max(0, top - box.clientHeight / 3), behavior: 'smooth' });
    }
  }, [cur]);

  const lines = useMemo(() => highlight(code.replace(/\n$/, '')), [code]);
  const offs = useMemo(() => lineOffsets(code), [code]);

  const onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPlaying(false);
      go(idx + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPlaying(false);
      go(idx - 1);
    } else if (e.key === ' ' && variant === 'full') {
      e.preventDefault();
      setPlaying((p) => !p);
    }
  };

  if (res.compileErrors.length) {
    const errLine = res.compileErrors[0].line;
    return (
      <div className={`viz is-${variant} has-error`}>
        {title && <div className="viz-title">{title}</div>}
        <div className="vz-code is-static">
          {lines.map((toks, i) => (
            <div key={i} className={`vl${i + 1 === errLine ? ' is-error' : ''}`}>
              <span className="vl-arrow" />
              <span className="vl-ln">{i + 1}</span>
              <span className="vl-code">
                <Tokens toks={toks} />
              </span>
            </div>
          ))}
        </div>
        <CompilerOutput res={res} />
      </div>
    );
  }

  const step = cur.step;
  const prevLen = idx > 0 ? view[idx - 1].step.consoleLen : 0;
  const changed = new Set(cur.changed);
  const finished = step.kind === 'end' || step.kind === 'error' || idx === n - 1;
  const frames = step.frames;
  const errorLine = step.kind === 'error' ? step.line : null;

  const flowNode = flow ? flowNodeFor(flow, step) : null;
  const visited = new Set<number>();
  if (flow) for (let k = 0; k <= idx && k < view.length; k++) {
    const nd = flowNodeFor(flow, view[k].step);
    if (nd) visited.add(nd.id);
  }
  const codePanel = flow && asFlow ? (
    <FlowChart g={flow} active={flowNode?.id ?? null} visited={visited} className="vz-flow" />
  ) : (
    <div className="vz-code" ref={codeRef}>
      {lines.map((toks, i) => {
        const ln = i + 1;
        const isExec = step.line === ln && step.kind !== 'start';
        const isNext = cur.next === ln && !finished;
        const cls = `vl${isExec ? ' is-exec' : ''}${isNext ? ' is-next' : ''}${errorLine === ln ? ' is-error' : ''}`;
        return (
          <div key={ln} className={cls}>
            <span className="vl-arrow">
              {isExec && <Arrow kind="exec" />}
              {isNext && !isExec && <Arrow kind="next" />}
              {isNext && isExec && <Arrow kind="next" />}
            </span>
            <span className="vl-ln">{ln}</span>
            <span className="vl-code">
              <HlTokens toks={toks} lineStart={offs[i]} hl={isExec ? step.hl : undefined} />
              {toks.length === 0 ? ' ' : null}
            </span>
          </div>
        );
      })}
    </div>
  );

  const explain = (
    <div className={`vz-explain kind-${step.kind}`} aria-live="polite">
      <div className="vz-explain-head">
        <span className="vz-kind">{KIND_LABEL[step.kind] ?? step.kind}</span>
        {step.line !== null && step.kind !== 'start' && <span className="vz-lineref">line {step.line}</span>}
      </div>
      {flow && asFlow ? (
        <p className="vz-text">{inline(flowText(cur, flowNode, res, prevLen))}</p>
      ) : cur.texts.length > 1 ? (
        <ol className="vz-texts">
          {cur.texts.map((t, i) => (
            <li key={i}>{inline(t)}</li>
          ))}
        </ol>
      ) : (
        <p className="vz-text">{inline(cur.texts[0] ?? '')}</p>
      )}
      {cur.calcs.map((c, i) => (
        <CalcView key={i} c={c} />
      ))}
      {step.warn && (
        <div className="vz-warn">
          <Icon name="alert" /> {inline(step.warn)}
        </div>
      )}
    </div>
  );

  const controls = (
    <div className="vz-ctrl">
      <div className="vz-buttons">
        <button className="icon-btn" onClick={() => { setPlaying(false); go(0); }} disabled={idx === 0} aria-label="First step">
          <Icon name="first" />
        </button>
        <button className="icon-btn" onClick={() => { setPlaying(false); go(idx - 1); }} disabled={idx === 0} aria-label="Previous step">
          <Icon name="prev" />
        </button>
        <button
          className="vz-play"
          onClick={() => {
            if (idx >= n - 1) setIdx(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          <Icon name={playing ? 'pause' : 'play'} />
        </button>
        <button className="vz-next" onClick={() => { setPlaying(false); go(idx + 1); }} disabled={idx >= n - 1} aria-label="Next step">
          <span>Next</span>
          <Icon name="next" />
        </button>
        <button className="icon-btn" onClick={() => { setPlaying(false); go(n - 1); }} disabled={idx >= n - 1} aria-label="Last step">
          <Icon name="last" />
        </button>
      </div>
      <input
        className="vz-slider"
        type="range"
        min={0}
        max={Math.max(0, n - 1)}
        value={idx}
        onChange={(e) => { setPlaying(false); go(Number(e.target.value)); }}
        aria-label="Step"
      />
      <span className="vz-count tnum">
        Step {idx + 1} <span>/ {n}</span>
      </span>
    </div>
  );

  const memory = (
    <div className="vz-panel vz-mem">
      <div className="vz-panel-head">
        <Icon name="cpu" />
        <span>Memory</span>
        <span className="vz-panel-sub">variables live here</span>
      </div>
      <MemoryView step={step} changedKeys={changed} changedAddrs={new Set(cur.changedAddrs)} showAddr={showAddr} finished={finished} />
    </div>
  );

  const consolePanel = (
    <div className="vz-panel vz-con">
      <div className="vz-panel-head is-dark">
        <Icon name="terminal" />
        <span>Output</span>
        <span className="vz-panel-sub">what the screen shows</span>
      </div>
      <ConsoleView
        segs={res.console}
        upto={step.consoleLen}
        from={prevLen}
        showInv={showInv}
        finished={step.kind === 'end' || step.kind === 'error'}
        exitCode={res.exitCode}
        crashed={step.kind === 'error'}
      />
    </div>
  );

  const inputPanel = hasInput || input ? (
    <div className={`vz-panel vz-in${step.kind === 'wait' ? ' is-waiting' : ''}`}>
      <div className="vz-panel-head">
        <Icon name="keyboard" />
        <span>Keyboard input</span>
        <span className="vz-panel-sub">what the user types</span>
        {canEdit && !editing && (
          <button className="btn btn-sm btn-ghost vz-edit" onClick={() => { setDraft(input); setEditing(true); }}>
            <Icon name="pencil" /> Change
          </button>
        )}
      </div>
      {editing ? (
        <div className="vz-in-edit">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            spellCheck={false}
            aria-label="Program input"
            placeholder="Type the values the program will read, e.g. 7"
          />
          <div className="vz-in-actions">
            <button className="btn btn-sm btn-primary" onClick={() => { setInput(draft.endsWith('\n') || !draft ? draft : draft + '\n'); setEditing(false); setIdx(0); }}>
              <Icon name="refresh" /> Run again with this input
            </button>
            <button className="btn btn-sm btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <StdinView input={input} pos={step.stdinPos} />
      )}
    </div>
  ) : null;

  const options = variant === 'full' && (
    <div className="vz-opts">
      {flow && (
        <label className="switch">
          <input type="checkbox" checked={!asFlow} onChange={(e) => setAsFlow(!e.target.checked)} />
          <span className="track" />
          Show the C++ code instead
        </label>
      )}
      <label className="switch">
        <input type="checkbox" checked={fine} onChange={(e) => setFine(e.target.checked)} />
        <span className="track" />
        Step into every <code>&lt;&lt;</code> / <code>&gt;&gt;</code>
      </label>
      <label className="switch">
        <input type="checkbox" checked={showInv} onChange={(e) => setShowInv(e.target.checked)} />
        <span className="track" />
        Show spaces &amp; new lines
      </label>
      <label className="switch">
        <input type="checkbox" checked={showAddr} onChange={(e) => setShowAddr(e.target.checked)} />
        <span className="track" />
        Addresses &amp; sizes
      </label>
      <label className="vz-speed">
        Speed
        <select value={speed} onChange={(e) => setSpeed(e.target.value as keyof typeof SPEEDS)}>
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
      </label>
    </div>
  );

  if (variant === 'hero') {
    return (
      <div className="viz is-hero" ref={rootRef}>
        <div className="vz-hero-grid">
          <div className="vz-hero-code">{codePanel}</div>
          <div className="vz-hero-side">
            {memory}
            {consolePanel}
          </div>
        </div>
        <div className="vz-hero-foot">
          <button className="vz-play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>
            <Icon name={playing ? 'pause' : 'play'} />
          </button>
          <p className="vz-text">{inline(cur.texts[cur.texts.length - 1] ?? '')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="viz is-full" ref={rootRef} tabIndex={0} onKeyDown={onKey} aria-label="Dry run visualizer. Use the arrow keys to step.">
      {title && <div className="viz-title">{title}</div>}
      <WarningsView res={res} />
      <div className="vz-grid">
        <div className="vz-left">
          <div className="vz-codewrap">
            {codePanel}
            {!(flow && asFlow) && (<div className="vz-legend">
              <span><Arrow kind="exec" /> line that just ran</span>
              <span><Arrow kind="next" /> line that runs next</span>
            </div>)}
          </div>
          {controls}
          {explain}
        </div>
        <div className="vz-right">
          {consolePanel}
          {inputPanel}
          {memory}
        </div>
      </div>
      {options}
    </div>
  );
}
