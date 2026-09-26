'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Visualizer, usesInput } from '@/components/viz/Visualizer';
import { CodeEditor } from '@/components/ui/CodeEditor';

export const TEMPLATE = `#include <iostream>
using namespace std;

int main() {
    // write your code here

    return 0;
}
`;

const KEY = 'dryrun.compiler.v1';

function loadSaved(): { code: string; input: string } {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { code: TEMPLATE, input: '' };
}

/** Full-screen C++ compiler: write any program, run it, dry-run it step by step. */
export function CompilerPanel({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState(TEMPLATE);
  const [input, setInput] = useState('');
  const [run, setRun] = useState<{ code: string; input: string; n: number } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [asFlow, setAsFlow] = useState(false);
  const edRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const s = loadSaved();
    setCode(s.code);
    setInput(s.input);
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      const ed = edRef.current;
      if (!ed) return;
      const pos = s.code.indexOf('// write your code here');
      ed.focus();
      if (pos >= 0) ed.setSelectionRange(pos, pos + '// write your code here'.length);
    });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ code, input }));
    } catch {
      /* ignore */
    }
  }, [code, input]);

  const go = () => setRun((r) => ({ code, input: input.trim() ? input.replace(/\n?$/, '\n') : '', n: (r?.n ?? 0) + 1 }));

  const needsInput = usesInput(code);

  return (
    <div className="cmp-scrim" role="dialog" aria-modal="true" aria-label="C++ compiler">
      <div className="cmp">
        <div className="cmp-head">
          <div className="cmp-title">
            <Icon name="terminal" size={18} />
            <strong>C++ Compiler</strong>
            <span className="cmp-sub">write any program · run it · dry-run it line by line</span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close compiler">
            <Icon name="x" />
          </button>
        </div>
        <div className="cmp-body">
          <div className="cmp-grid">
            <div className="cmp-editor">
              <div className="cmp-editor-bar">
                <span className="mono">main.cpp</span>
                <button
                  className={`btn btn-sm ${confirmReset ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => {
                    if (confirmReset) {
                      setCode(TEMPLATE);
                      setRun(null);
                      setConfirmReset(false);
                    } else setConfirmReset(true);
                  }}
                  onBlur={() => setConfirmReset(false)}
                >
                  <Icon name="undo" /> {confirmReset ? 'Click again to reset' : 'New program'}
                </button>
              </div>
              <CodeEditor ref={edRef} className="cmp-edit-wrap" value={code} onChange={setCode} onRun={go} />
            </div>
            <div className="cmp-side">
              <label className="play-field">
                <span className="field-label">Input — what the user types {needsInput ? '(your program uses cin)' : ''}</span>
                <textarea className="textarea" rows={4} value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="e.g. 5 7  (one value per cin)" />
              </label>
              <button className="btn btn-primary btn-lg" onClick={go}>
                <Icon name="play" /> Run &amp; dry run
              </button>
              <label className="switch">
                <input type="checkbox" checked={asFlow} onChange={(e) => setAsFlow(e.target.checked)} />
                <span className="track" />
                Show main() as a flowchart
              </label>
              <p className="muted small">
                <kbd>Ctrl</kbd> + <kbd>Enter</kbd> runs. <kbd>Tab</kbd> indents. Your code is kept in this browser.
              </p>
              <p className="muted small">
                Works with variables, <code className="ic">cout</code>/<code className="ic">cin</code>, if/else, loops, functions (recursion, references),
                arrays &amp; 2D arrays, strings &amp; C-strings, pointers, <code className="ic">new</code>/<code className="ic">delete</code> and structs.
              </p>
            </div>
          </div>
          {run ? (
            <Visualizer key={`${run.n}-${asFlow}`} code={run.code} input={run.input} view={asFlow ? 'flow' : 'code'} />
          ) : (
            <div className="cmp-empty">
              <Icon name="play" size={20} /> Press <strong>Run &amp; dry run</strong> to compile your program and step through it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
