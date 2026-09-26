'use client';

import { useMemo, useState } from 'react';
import type { Block } from '@/content/types';
import { buildFlow, runProgram } from '@/engine';
import { FlowChart } from '@/components/viz/FlowChart';
import { Md, inline } from '@/lib/md';
import { CodeBlock } from '@/components/ui/Code';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { Visualizer } from '@/components/viz/Visualizer';

const TONE_ICON: Record<string, string> = { tip: 'bulb', warn: 'alert', info: 'info', key: 'star' };

/** Output of a snippet, computed by the engine so it is always correct. */
export function useOutput(code: string, input = ''): { out: string | null; error: string | null } {
  return useMemo(() => {
    if (!/\bmain\s*\(/.test(code)) return { out: null, error: null };
    const r = runProgram(code, { input });
    if (r.compileErrors.length) return { out: null, error: r.compileErrors[0].msg };
    return { out: r.stdout, error: null };
  }, [code, input]);
}

function StaticFlow({ code, caption }: { code: string; caption?: string }) {
  const g = useMemo(() => buildFlow(code), [code]);
  return (
    <figure className="b-flow">
      {g ? <FlowChart g={g} /> : <pre>{code}</pre>}
      {caption && (
        <figcaption>
          <Md text={caption} />
        </figcaption>
      )}
    </figure>
  );
}

export function RunnableCode({
  code,
  input,
  caption,
  output,
  title,
  highlight,
  showOutput = true,
  allowRun = true,
}: {
  code: string;
  input?: string;
  caption?: string;
  output?: string;
  title?: string;
  highlight?: number[];
  showOutput?: boolean;
  allowRun?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const computed = useOutput(code, input);
  const out = output ?? computed.out;
  const runnable = allowRun && (computed.out !== null || computed.error !== null);
  return (
    <>
      <CodeBlock
        code={code}
        highlightLines={highlight}
        output={computed.error || !showOutput ? undefined : out}
        showOutputInvisibles={false}
        caption={
          caption || computed.error ? (
            <>
              {computed.error && (
                <span className="code-err">
                  <Icon name="x-circle" size={14} /> Does not compile: <code>{computed.error}</code>
                </span>
              )}
              {caption && <Md text={caption} />}
            </>
          ) : undefined
        }
        actions={
          runnable ? (
            <button className="btn btn-sm" onClick={() => setOpen(true)}>
              <Icon name="eye" /> Dry run
            </button>
          ) : undefined
        }
      />
      {open && (
        <Modal title={title ?? 'Dry run'} onClose={() => setOpen(false)}>
          <Visualizer code={code} input={input} />
        </Modal>
      )}
    </>
  );
}

function Anatomy({ code, notes }: { code: string; notes: { lines: number[]; label: string; text: string }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="anatomy">
      <CodeBlock code={code} highlightLines={notes[active]?.lines ?? []} />
      <ol className="anatomy-notes">
        {notes.map((n, i) => (
          <li key={i}>
            <button className={`anatomy-note${i === active ? ' is-on' : ''}`} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              <span className="anatomy-lines mono">line {n.lines.join(', ')}</span>
              <strong>
                <Md text={n.label} />
              </strong>
              <span className="anatomy-text">
                <Md text={n.text} />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="blocks">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'p':
            return (
              <p key={i} className="b-p">
                {inline(b.text)}
              </p>
            );
          case 'h':
            return (
              <h3 key={i} className="b-h">
                {inline(b.text)}
              </h3>
            );
          case 'list': {
            const L = b.ordered ? 'ol' : 'ul';
            return (
              <L key={i} className="b-list">
                {b.items.map((it, k) => (
                  <li key={k}>{inline(it)}</li>
                ))}
              </L>
            );
          }
          case 'code':
            return <RunnableCode key={i} code={b.code} input={b.input} caption={b.caption} output={b.output} />;
          case 'callout':
            return (
              <div key={i} className={`callout tone-${b.tone}`}>
                <Icon name={TONE_ICON[b.tone]} className="callout-icon" />
                <div>
                  {b.title && (
                    <div className="callout-title">
                      <Md text={b.title} />
                    </div>
                  )}
                  <div className="callout-text">{inline(b.text)}</div>
                </div>
              </div>
            );
          case 'table':
            return (
              <div key={i} className="b-table-wrap">
                <table className="b-table">
                  <thead>
                    <tr>
                      {b.head.map((h, k) => (
                        <th key={k}>{inline(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, k) => (
                      <tr key={k}>
                        {r.map((c, j) => (
                          <td key={j}>{inline(c)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {b.caption && <p className="b-table-cap">{inline(b.caption)}</p>}
              </div>
            );
          case 'syntax':
            return (
              <div key={i} className="syntax">
                <div className="syntax-title">
                  <Icon name="code" size={16} /> <Md text={b.title} />
                </div>
                <CodeBlock code={b.code} />
                <dl className="syntax-parts">
                  {b.parts.map((pt, k) => (
                    <div key={k} className="syntax-part">
                      <dt>
                        <code>{pt.token}</code>
                      </dt>
                      <dd>{inline(pt.text)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          case 'anatomy':
            return <Anatomy key={i} code={b.code} notes={b.notes} />;
          case 'flow':
            return <Visualizer key={i} code={b.code} input={b.input} view="flow" title={b.title ? <Md text={b.title} /> : undefined} />;
          case 'flowchart':
            return <StaticFlow key={i} code={b.code} caption={b.caption} />;
          case 'viz':
            return <Visualizer key={i} code={b.code} input={b.input} setup={b.setup} fine={b.fine} title={b.title ? <Md text={b.title} /> : undefined} />;
          case 'compare':
            return (
              <div key={i} className="compare">
                {b.items.map((it, k) => (
                  <div key={k} className={`compare-item${it.good === true ? ' is-good' : it.good === false ? ' is-bad' : ''}`}>
                    <div className="compare-title">
                      {it.good === true && <Icon name="check-circle" size={16} />}
                      {it.good === false && <Icon name="x-circle" size={16} />}
                      <Md text={it.title} />
                    </div>
                    <RunnableCode code={it.code} output={it.output} />
                    {it.note && (
                      <p className="compare-note">
                        <Md text={it.note} />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          case 'terms':
            return (
              <dl key={i} className="terms">
                {b.items.map((t, k) => (
                  <div key={k} className="term">
                    <dt>{inline(t.term)}</dt>
                    <dd>{inline(t.def)}</dd>
                  </div>
                ))}
              </dl>
            );
        }
      })}
    </div>
  );
}
