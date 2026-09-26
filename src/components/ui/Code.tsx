'use client';

import { useMemo, type ReactNode } from 'react';
import { highlight, type HTok } from '@/lib/highlight';

export function Tokens({ toks }: { toks: HTok[] }) {
  return (
    <>
      {toks.map((t, i) =>
        t.cls === 'ws' || t.cls === 'id' ? (
          <span key={i}>{t.text}</span>
        ) : (
          <span key={i} className={`t-${t.cls}`}>
            {t.text}
          </span>
        ),
      )}
    </>
  );
}

/** Make whitespace in program output visible: spaces ·, tabs →, newlines ↵ */
export function Visible({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let buf = '';
  const flush = (k: number) => {
    if (buf) parts.push(<span key={`b${k}`}>{buf}</span>);
    buf = '';
  };
  [...text].forEach((ch, i) => {
    if (ch === ' ') {
      flush(i);
      parts.push(<span key={i} className="inv">·</span>);
    } else if (ch === '\t') {
      flush(i);
      parts.push(<span key={i} className="inv">→{'\t'}</span>);
    } else if (ch === '\n') {
      flush(i);
      parts.push(<span key={i} className="inv">↵{'\n'}</span>);
    } else buf += ch;
  });
  flush(text.length);
  return <>{parts}</>;
}

export function CodeBlock({
  code,
  highlightLines = [],
  caption,
  output,
  actions,
  startLine = 1,
  className,
  showOutputInvisibles = false,
}: {
  code: string;
  highlightLines?: number[];
  caption?: ReactNode;
  output?: string | null;
  actions?: ReactNode;
  startLine?: number;
  className?: string;
  showOutputInvisibles?: boolean;
}) {
  const lines = useMemo(() => highlight(code.replace(/\n$/, '')), [code]);
  return (
    <div className={`code ${className ?? ''}`}>
      {actions && <div className="code-actions">{actions}</div>}
      <div className="code-scroll">
        <div className="code-table">
          {lines.map((toks, i) => (
            <div key={i} className={`cl${highlightLines.includes(i + startLine) ? ' is-hl' : ''}`}>
              <span className="ln">{i + startLine}</span>
              <span className="lc">
                <Tokens toks={toks} />
                {toks.length === 0 ? ' ' : null}
              </span>
            </div>
          ))}
        </div>
      </div>
      {output !== undefined && output !== null && (
        <div className="code-out">
          <div className="label">Output</div>
          <pre>{showOutputInvisibles ? <Visible text={output} /> : output || ' '}</pre>
        </div>
      )}
      {caption && <div className="code-caption">{caption}</div>}
    </div>
  );
}
