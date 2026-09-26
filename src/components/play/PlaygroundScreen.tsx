'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Visualizer } from '@/components/viz/Visualizer';
import { CodeEditor } from '@/components/ui/CodeEditor';

const STARTER = `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cout << "Enter two numbers: ";
    cin >> a >> b;

    int sum = a + b;
    cout << "Sum = " << sum << endl;

    if (sum % 2 == 0)
        cout << "The sum is even" << endl;
    else
        cout << "The sum is odd" << endl;
    return 0;
}
`;

export function PlaygroundScreen() {
  const [code, setCode] = useState(STARTER);
  const [input, setInput] = useState('4 9');
  const [run, setRun] = useState({ code: STARTER, input: '4 9\n', n: 0 });

  const go = () => setRun((r) => ({ code, input: input.trim() ? input.replace(/\n?$/, '\n') : '', n: r.n + 1 }));

  return (
    <div className="play">
      <header className="lvl-head">
        <div className="lvl-meta">
          <span className="pill pill-accent">Sandbox</span>
        </div>
        <h1 className="lvl-title">Dry-run your own code</h1>
        <p className="lvl-tagline">
          Write any beginner C++ program — variables, <code className="ic">cout</code>/<code className="ic">cin</code>, operators, if/else, switch, loops and
          strings — and watch it run line by line.
        </p>
      </header>
      <div className="play-grid">
        <div className="play-field">
          <span className="field-label">Your program</span>
          <CodeEditor className="code-editor" value={code} onChange={setCode} onRun={go} />
        </div>
        <div className="play-side">
          <label className="play-field">
            <span className="field-label">Input (what the user types)</span>
            <textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} rows={3} spellCheck={false} placeholder="e.g. 4 9" />
          </label>
          <button className="btn btn-primary btn-lg" onClick={go}>
            <Icon name="play" /> Run &amp; dry run
          </button>
          <p className="muted small">Tip: Ctrl + Enter runs it. Tab inserts 4 spaces.</p>
        </div>
      </div>
      <Visualizer key={run.n} code={run.code} input={run.input} />
    </div>
  );
}
