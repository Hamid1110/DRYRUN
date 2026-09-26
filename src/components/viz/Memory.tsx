'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { FrameSnap, MemVal, Step, VarSnap } from '@/engine';

// ---------------------------------------------------------------- helpers

const PRIM = /^(const )?(unsigned |signed )?(int|double|char|bool|float|long|short|string|long long|long double|unsigned|signed)$/;

/** does a pointer of this type point at a single box (leaf) or at a whole array / struct (obj)? */
function targetKind(ptrType: string): 'leaf' | 'obj' {
  const to = ptrType.replace(/\*$/, '').trim();
  if (to.endsWith('*') || PRIM.test(to)) return 'leaf';
  return 'obj';
}

/** 'A' → A,  '\0' → \0 (for char array boxes) */
function charFace(display: string): string {
  const m = /^'(.*)'$/.exec(display);
  return m ? m[1] : display;
}

interface Ctx {
  changed: Set<string>;
  showAddr: boolean;
}

// ---------------------------------------------------------------- boxes

function Cell({ val, ctx, face, cls = '' }: { val: MemVal; ctx: Ctx; face?: string; cls?: string }) {
  const changed = ctx.changed.has(val.addr);
  if (val.kind === 'ptr') {
    const isNull = val.display === 'nullptr';
    const bad = val.dangling || val.uninit;
    return (
      <span
        className={`mb-cell mb-ptr${changed ? ' is-changed' : ''}${val.uninit ? ' is-garbage' : ''}${isNull ? ' is-null' : ''}${val.dangling ? ' is-dangling' : ''} ${cls}`}
        data-addr={val.addr}
        data-leaf=""
        data-target={val.target && !val.uninit ? val.target : undefined}
        data-tk={targetKind(val.type)}
        title={val.uninit ? 'Garbage address — this pointer has not been given an address yet' : val.targetLabel ? `points to ${val.targetLabel}` : undefined}
      >
        {isNull ? (
          <span className="mb-null">nullptr</span>
        ) : val.uninit ? (
          '?'
        ) : (
          <>
            <span className="mb-dot" aria-hidden="true" />
            <span className="mb-ptrtext">{val.display}</span>
          </>
        )}
        {bad && val.dangling && <span className="mb-bad" aria-hidden="true">✕</span>}
      </span>
    );
  }
  return (
    <span
      className={`mb-cell${changed ? ' is-changed' : ''}${val.uninit ? ' is-garbage' : ''} ${cls}`}
      data-addr={val.addr}
      data-leaf=""
      title={val.uninit ? 'Garbage: no value has been stored here yet' : val.sub}
    >
      {face ?? val.display}
    </span>
  );
}

const MAX_ITEMS = 60;

function ArrBox({ val, ctx }: { val: MemVal; ctx: Ctx }) {
  const items = val.items ?? [];
  const first = items[0]?.val;
  // 2D: rows of cells
  if (first && first.kind === 'arr' && (first.items ?? []).every((c) => c.val.kind === 'prim' || c.val.kind === 'ptr')) {
    const cols = first.items?.length ?? 0;
    const isChar = /char/.test(first.type);
    return (
      <div className="mb-grid" data-addr={val.addr} data-obj="" style={{ gridTemplateColumns: `auto repeat(${cols}, max-content)` }}>
        <span />
        {Array.from({ length: cols }, (_, c) => (
          <span className="mb-idx mb-colidx" key={`h${c}`}>{c}</span>
        ))}
        {items.map((row) => (
          <Row key={row.label} row={row.val} label={row.label} ctx={ctx} isChar={isChar} />
        ))}
      </div>
    );
  }
  // array of structs / arrays: a list
  if (first && (first.kind === 'struct' || first.kind === 'arr')) {
    return (
      <div className="mb-list" data-addr={val.addr} data-obj="">
        {items.slice(0, MAX_ITEMS).map((it) => (
          <div className="mb-listrow" key={it.label}>
            <span className="mb-idx">[{it.label}]</span>
            <MemBox val={it.val} ctx={ctx} />
          </div>
        ))}
        {items.length > MAX_ITEMS && <span className="mb-more">… {items.length - MAX_ITEMS} more</span>}
      </div>
    );
  }
  const isChar = /^(const )?(unsigned |signed )?char\[/.test(val.type);
  return (
    <div className={`mb-arr${isChar ? ' is-chars' : ''}`} data-addr={val.addr} data-obj="">
      {items.slice(0, MAX_ITEMS).map((it) => (
        <span className="mb-el" key={it.label}>
          <Cell val={it.val} ctx={ctx} face={isChar ? charFace(it.val.display) : undefined} cls={isChar && it.val.display === "'\\0'" ? 'is-nul' : ''} />
          <span className="mb-idx">{it.label}</span>
        </span>
      ))}
      {items.length > MAX_ITEMS && <span className="mb-more">… {items.length - MAX_ITEMS} more</span>}
    </div>
  );
}

function Row({ row, label, ctx, isChar }: { row: MemVal; label: string; ctx: Ctx; isChar: boolean }) {
  return (
    <>
      <span className="mb-idx mb-rowidx" data-addr={row.addr} data-obj="">
        {label}
      </span>
      {(row.items ?? []).map((c) => (
        <Cell key={c.label} val={c.val} ctx={ctx} face={isChar ? charFace(c.val.display) : undefined} />
      ))}
    </>
  );
}

function StructBox({ val, ctx }: { val: MemVal; ctx: Ctx }) {
  return (
    <div className="mb-struct" data-addr={val.addr} data-obj="">
      <span className="mb-stype">{val.type}</span>
      {(val.items ?? []).map((f) => (
        <div className="mb-field" key={f.label}>
          <span className="mb-fname">.{f.label}</span>
          <MemBox val={f.val} ctx={ctx} />
        </div>
      ))}
    </div>
  );
}

export function MemBox({ val, ctx }: { val: MemVal; ctx: Ctx }): ReactNode {
  if (val.kind === 'arr') return <ArrBox val={val} ctx={ctx} />;
  if (val.kind === 'struct') return <StructBox val={val} ctx={ctx} />;
  return <Cell val={val} ctx={ctx} />;
}

// ---------------------------------------------------------------- variables & frames

function VarLine({ v, ctx, changedVar }: { v: VarSnap; ctx: Ctx; changedVar: boolean }) {
  const val = v.val;
  const compound = val && (val.kind === 'arr' || val.kind === 'struct');
  return (
    <div className={`mv${compound ? ' is-compound' : ''}${changedVar && !compound && !v.refTo ? ' is-changed' : ''}`}>
      <span className="mv-type">{v.type}</span>
      <span className="mv-name">{v.name}</span>
      <span className="mv-val">
        {v.refTo ? (
          <span className="mb-cell mb-ref" data-target={v.refTo} data-tk="obj" data-ref="" title={`${v.name} is another name for ${v.refLabel}`}>
            <span className="mb-dot" aria-hidden="true" />
            <span className="mb-reftext">same box as {v.refLabel}</span>
          </span>
        ) : val ? (
          <MemBox val={val} ctx={ctx} />
        ) : (
          <span className="mb-cell">{v.display}</span>
        )}
        {v.sub && !v.refTo && val?.kind === 'prim' && <span className="mv-sub">{v.sub}</span>}
        {val?.kind === 'ptr' && val.targetLabel && !val.dangling && <span className="mv-sub">→ {val.targetLabel}</span>}
        {val?.kind === 'ptr' && val.dangling && <span className="mv-sub is-bad">→ memory that no longer exists!</span>}
      </span>
      {ctx.showAddr && !v.refTo && (
        <span className="mv-addr">
          {v.addr} · {v.size} {v.size === 1 ? 'byte' : 'bytes'}
        </span>
      )}
    </div>
  );
}

export function MemFrame({ name, vars, ctx, changedKeys, active, frame }: { name: string; vars: VarSnap[]; ctx: Ctx; changedKeys: Set<string>; active?: boolean; frame?: FrameSnap }) {
  const groups: { label?: string; depth: number; vars: VarSnap[] }[] = [];
  vars.forEach((v) => {
    const g = groups[groups.length - 1];
    if (g && g.depth === v.depth && g.label === v.scopeLabel) g.vars.push(v);
    else groups.push({ label: v.scopeLabel, depth: v.depth, vars: [v] });
  });
  return (
    <div className={`frame${active ? ' is-active' : ''}${frame?.ret !== undefined ? ' is-returning' : ''}`}>
      <div className="frame-head">
        <span className="frame-name">{name}</span>
        {frame?.ret !== undefined ? (
          <span className="frame-ret">{frame.ret === 'void' ? 'finished' : `returns ${frame.ret}`}</span>
        ) : active ? (
          <span className="frame-tag">running</span>
        ) : frame?.callLine ? (
          <span className="frame-tag is-waiting">waiting</span>
        ) : null}
      </div>
      <div className="frame-body">
        {vars.length === 0 && <div className="frame-empty">No variables yet</div>}
        {groups.map((g, gi) => (
          <div className={`scope${g.depth > 0 ? ' is-inner' : ''}`} key={gi} style={{ marginLeft: Math.min(g.depth, 4) * 10 }}>
            {g.depth > 0 && g.label && <div className="scope-label">{g.label}</div>}
            {g.vars.map((v) => (
              <VarLine key={v.key} v={v} ctx={ctx} changedVar={changedKeys.has(v.key)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- arrows

interface ArrowPath {
  d: string;
  ref: boolean;
  bad: boolean;
}

function Arrows({ host, dep }: { host: React.RefObject<HTMLDivElement | null>; dep: unknown }) {
  const [paths, setPaths] = useState<ArrowPath[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const compute = () => {
    const box = host.current;
    if (!box) return;
    const base = box.getBoundingClientRect();
    const ox = -base.left + box.scrollLeft;
    const oy = -base.top + box.scrollTop;
    const out: ArrowPath[] = [];
    box.querySelectorAll<HTMLElement>('[data-target]').forEach((src) => {
      const addr = src.dataset.target!;
      const tk = src.dataset.tk;
      const all = Array.from(box.querySelectorAll<HTMLElement>(`[data-addr="${addr}"]`)).filter((el) => el !== src && !src.contains(el));
      const tgt = (tk === 'leaf' ? all.find((el) => el.hasAttribute('data-leaf')) : all.find((el) => el.hasAttribute('data-obj'))) ?? all[0];
      if (!tgt) return;
      // start at the dot inside the pointer box (like Python Tutor)
      const dot = src.querySelector<HTMLElement>('.mb-dot') ?? src;
      const a = dot.getBoundingClientRect();
      const b = tgt.getBoundingClientRect();
      const sx = a.left + a.width / 2 + ox;
      const sy = a.top + a.height / 2 + oy;
      const bl = b.left + ox;
      const bt = b.top + oy;
      const bb = b.bottom + oy;
      let d: string;
      if (bl > sx + 40 && Math.abs(bt + b.height / 2 - sy) < 60) {
        // target on the same level, to the right
        const ex = bl - 2;
        const ey = bt + b.height / 2;
        const dx = Math.max(24, (ex - sx) / 2);
        d = `M${sx},${sy} C${sx + dx},${sy} ${ex - dx},${ey} ${ex},${ey}`;
      } else {
        // go straight up / down from the dot and come into the target from below / above
        const below = bt > sy;
        const ex = Math.min(Math.max(sx, bl + 10), b.right + ox - 10);
        const ey = below ? bt - 1 : bb + 1;
        const k = Math.max(18, Math.abs(ey - sy) / 2.2);
        d = below ? `M${sx},${sy} C${sx},${sy + k} ${ex},${ey - k} ${ex},${ey}` : `M${sx},${sy} C${sx},${sy - k} ${ex},${ey + k} ${ex},${ey}`;
      }
      out.push({ d, ref: src.hasAttribute('data-ref'), bad: src.classList.contains('is-dangling') });
    });
    setPaths(out);
    setSize({ w: box.scrollWidth, h: box.scrollHeight });
  };

  useLayoutEffect(compute, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const box = host.current;
    if (!box || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => compute());
    ro.observe(box);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!paths.length) return null;
  return (
    <svg className="mb-arrows" width={size.w} height={size.h} aria-hidden="true">
      <defs>
        <marker id="mb-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="mb-headpath" />
        </marker>
        <marker id="mb-head-bad" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="mb-headpath is-bad" />
        </marker>
      </defs>
      {paths.map((p, i) => (
        <path key={i} d={p.d} className={`mb-line${p.ref ? ' is-ref' : ''}${p.bad ? ' is-bad' : ''}`} markerEnd={`url(#${p.bad ? 'mb-head-bad' : 'mb-head'})`} />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------- the whole memory view

export function MemoryView({ step, changedKeys, changedAddrs, showAddr, finished }: { step: Step; changedKeys: Set<string>; changedAddrs: Set<string>; showAddr: boolean; finished: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const ctx: Ctx = { changed: changedAddrs, showAddr };
  const frames = step.frames;
  const heap = step.heap ?? [];
  return (
    <div className="vz-mem-body" ref={host}>
      {step.globals.length > 0 && <MemFrame name="Global variables" vars={step.globals} ctx={ctx} changedKeys={changedKeys} />}
      {frames.length === 0 && step.globals.length === 0 && (
        <div className="frame-empty">{step.kind === 'compile' ? 'Nothing in memory yet — the program has not started.' : 'No variables yet.'}</div>
      )}
      {frames.length > 1 && <div className="mem-sect">Stack · one frame per function call</div>}
      {frames.map((f, i) => (
        <MemFrame key={i} name={`${f.fn}()`} vars={f.vars} ctx={ctx} changedKeys={changedKeys} active={i === frames.length - 1 && !finished} frame={f} />
      ))}
      {heap.length > 0 && (
        <div className="heap">
          <div className="mem-sect">Heap · memory made with new</div>
          {heap.map((h) => (
            <div className="heap-obj" key={h.key}>
              <div className="heap-head">
                <span className="mv-name">{h.name}</span>
                <span className="mv-type">{h.type}</span>
                {showAddr && <span className="mv-addr">{h.addr} · {h.size} bytes</span>}
              </div>
              {h.val ? <MemBox val={h.val} ctx={ctx} /> : <span className="mb-cell">{h.display}</span>}
            </div>
          ))}
        </div>
      )}
      <Arrows host={host} dep={step} />
    </div>
  );
}
