'use client';

import { useEffect, useRef } from 'react';
import type { FlowGraph, FlowNode } from '@/engine';

const CIRCLED = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];

function Shape({ n }: { n: FlowNode }) {
  const x = n.x - n.w / 2;
  const y = n.y;
  const { w, h } = n;
  switch (n.kind) {
    case 'start':
    case 'end':
      return <rect x={x} y={y} width={w} height={h} rx={h / 2} className="fc-shape" />;
    case 'decision':
      return <path d={`M${n.x},${y} L${x + w},${y + h / 2} L${n.x},${y + h} L${x},${y + h / 2} Z`} className="fc-shape" />;
    case 'input':
    case 'output': {
      const s = 14;
      return <path d={`M${x + s},${y} L${x + w},${y} L${x + w - s},${y + h} L${x},${y + h} Z`} className="fc-shape" />;
    }
    case 'call':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="fc-shape" />
          <path d={`M${x + 8},${y} V${y + h} M${x + w - 8},${y} V${y + h}`} className="fc-inner" />
        </>
      );
    default:
      return <rect x={x} y={y} width={w} height={h} rx={3} className="fc-shape" />;
  }
}

export function FlowChart({
  g,
  active,
  visited,
  blanks,
  className = '',
}: {
  g: FlowGraph;
  active?: number | null;
  visited?: Set<number>;
  /** text typed into fill-in boxes, by blank number */
  blanks?: Record<number, string>;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  // keep the running box in view
  useEffect(() => {
    const el = box.current?.querySelector<SVGGElement>('.fc-node.is-active');
    const host = box.current;
    if (!el || !host) return;
    const r = el.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    if (r.top < hr.top + 10 || r.bottom > hr.bottom - 10) host.scrollBy({ top: r.top - hr.top - hr.height / 3, behavior: 'smooth' });
  }, [active]);

  return (
    <div className={`fc ${className}`} ref={box}>
      <svg viewBox={`0 0 ${g.width} ${g.height}`} width={g.width} height={g.height} role="img" aria-label="Flowchart">
        <defs>
          <marker id="fc-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fc-headpath" />
          </marker>
        </defs>
        {g.edges.map((e, i) => {
          const d = 'M' + e.points.map((p) => `${p[0]},${p[1]}`).join(' L');
          const [a, b] = e.points;
          const lx = b ? (a[0] === b[0] ? a[0] + 6 : (a[0] + b[0]) / 2) : a[0];
          const ly = b ? (a[0] === b[0] ? a[1] + 14 : a[1] - 6) : a[1];
          return (
            <g key={i}>
              <path d={d} className="fc-edge" markerEnd={e.arrow ? 'url(#fc-head)' : undefined} />
              {e.label && (
                <text x={lx} y={ly} className={`fc-elabel is-${e.label.toLowerCase()}`} textAnchor={a[0] === b?.[0] ? 'start' : 'middle'}>
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {g.nodes.map((n) => {
          const cls = `fc-node kind-${n.kind}${active === n.id ? ' is-active' : ''}${visited?.has(n.id) ? ' is-visited' : ''}${n.blank !== undefined ? ' is-blank' : ''}`;
          const typed = n.blank !== undefined ? blanks?.[n.blank] : undefined;
          const lines = n.blank !== undefined ? [typed?.trim() ? typed : `${CIRCLED[n.blank] ?? n.blank}  ?`] : n.label;
          const top = n.y + n.h / 2 - ((lines.length - 1) * 17) / 2 + 5;
          return (
            <g key={n.id} className={cls} data-line={n.line ?? undefined}>
              <Shape n={n} />
              {lines.map((l, k) => (
                <text key={k} x={n.x} y={top + k * 17} textAnchor="middle" className="fc-text">
                  {l}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
