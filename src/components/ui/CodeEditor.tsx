'use client';

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, type KeyboardEvent } from 'react';
import { highlight } from '@/lib/highlight';
import { Tokens } from '@/components/ui/Code';

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** Ctrl/Cmd + Enter */
  onRun?: () => void;
  className?: string;
  label?: string;
}

const INDENT = '    ';

/**
 * Code editor with live C++ colours.
 * A transparent <textarea> sits exactly on top of a highlighted <pre>; both live in the
 * same grid cell of one scroll box, so they always line up (no scroll syncing needed).
 * Tab indents, Enter keeps the indentation (+4 after `{`), `}` on an empty line un-indents.
 */
export const CodeEditor = forwardRef<HTMLTextAreaElement | null, Props>(function CodeEditor({ value, onChange, onRun, className, label = 'C++ code' }, ref) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => taRef.current as HTMLTextAreaElement);
  const lines = useMemo(() => highlight(value, { blanks: false }), [value]);

  // caret position to restore after a programmatic edit (applied before paint, so fast
  // typing never lands in the wrong place)
  const pending = useRef<number | null>(null);
  useLayoutEffect(() => {
    const el = taRef.current;
    if (el && pending.current !== null) {
      el.setSelectionRange(pending.current, pending.current);
      pending.current = null;
    }
  }, [value]);

  const replace = (el: HTMLTextAreaElement, from: number, to: number, text: string) => {
    pending.current = from + text.length;
    onChange(value.slice(0, from) + text + value.slice(to));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const s = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onRun?.();
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      replace(el, s, end, INDENT);
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      const lead = /^ {1,4}/.exec(value.slice(lineStart))?.[0] ?? '';
      if (lead) {
        pending.current = Math.max(lineStart, s - lead.length);
        onChange(value.slice(0, lineStart) + value.slice(lineStart + lead.length));
      }
    } else if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      const indent = /^[ \t]*/.exec(value.slice(lineStart))![0];
      const before = value.slice(lineStart, s).trimEnd();
      const extra = before.endsWith('{') ? INDENT : '';
      replace(el, s, end, '\n' + indent + extra);
    } else if (e.key === '}' && s === end && /^[ \t]+$/.test(value.slice(lineStart, s))) {
      e.preventDefault();
      const cur = value.slice(lineStart, s);
      replace(el, lineStart, s, cur.slice(0, Math.max(0, cur.length - INDENT.length)) + '}');
    }
  };

  return (
    <div className={`ced ${className ?? ''}`}>
      <div className="ced-inner">
        <div className="ced-lines" aria-hidden="true">
          {lines.map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <div className="ced-code">
          <pre className="ced-pre" aria-hidden="true">
            {lines.map((toks, i) => (
              <span key={i}>
                {i > 0 ? '\n' : null}
                <Tokens toks={toks} />
              </span>
            ))}
            {/* keeps the last (possibly empty) line as tall as the textarea's */}
            {' '}
          </pre>
          <textarea
            ref={taRef}
            className="ced-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            wrap="off"
            aria-label={label}
          />
        </div>
      </div>
    </div>
  );
});
