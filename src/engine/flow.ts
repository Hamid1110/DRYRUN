// Turns a C++ main() into a flowchart (nodes + orthogonal edges with coordinates).
// The flowchart is only a *view*: the dry run still uses the real engine, and each
// flowchart box remembers the source line it came from so the running box can be lit up.
//
// Labels come from the code (cin → "Input …", cout → "Display …", i++ → "i = i + 1" …)
// and can be overridden with a comment on the same line:   x = x * 2;   // @ Double x
// A blank in fill-in questions ([[1]]) turns that box into an empty numbered box.

import { parse } from './parser';
import type { Diag, Expr, Program, Stmt } from './types';

export type FlowKind = 'start' | 'end' | 'process' | 'input' | 'output' | 'decision' | 'call';

export interface FlowNode {
  id: number;
  kind: FlowKind;
  label: string[];
  line: number | null;
  /** for-loop parts share one line: which part is this box */
  role?: 'init' | 'update';
  /** fill-in box number */
  blank?: number;
  x: number; // centre
  y: number; // top
  w: number;
  h: number;
}

export interface FlowEdge {
  points: [number, number][];
  label?: 'Yes' | 'No';
  /** ends with an arrow head */
  arrow: boolean;
}

export interface FlowGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
  width: number;
  height: number;
}

// ---------------------------------------------------------------- element tree

type El =
  | { k: 'node'; n: FlowNode; stop?: boolean; jump?: 'break' | 'continue' }
  | { k: 'seq'; items: El[] }
  | { k: 'if'; d: FlowNode; then: El; els: El | null }
  | { k: 'while'; d: FlowNode; body: El; init: FlowNode | null; update: FlowNode | null; doWhile: boolean };

const GAP = 30;
const SIDE = 26;
const CHAR = 7.3;

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

function wrap(text: string, max = 26): string[] {
  if (text.length <= max) return [text];
  const words = text.split(' ');
  const out: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) out.push(cur);
  return out.slice(0, 3);
}

class Builder {
  nodes: FlowNode[] = [];
  edges: FlowEdge[] = [];
  private nid = 0;
  private overrides = new Map<number, string>();
  private blanks = new Map<number, number>();

  constructor(private prog: Program, original: string) {
    original.split('\n').forEach((l, i) => {
      const m = /\/\/\s*@\s*(.*)$/.exec(l);
      if (m) this.overrides.set(i + 1, m[1].trim());
      const b = /\[\[(\d+)\]\]/.exec(l);
      if (b) this.blanks.set(i + 1, Number(b[1]));
    });
  }

  src(x: { span: { start: number; end: number } }): string {
    return norm(this.prog.src.slice(x.span.start, x.span.end));
  }

  node(kind: FlowKind, text: string, line: number | null, role?: FlowNode['role']): FlowNode {
    const override = line !== null && !role ? this.overrides.get(line) : undefined;
    const blank = line !== null && !role ? this.blanks.get(line) : undefined;
    const label = blank !== undefined ? [''] : wrap(override ?? text);
    const longest = Math.max(...label.map((l) => l.length), blank !== undefined ? 6 : 0);
    let w = Math.max(96, longest * CHAR + 30);
    let h = 22 + label.length * 17;
    if (kind === 'decision') {
      w = Math.max(130, longest * CHAR + 70);
      h = Math.max(62, 36 + label.length * 17);
    }
    if (kind === 'input' || kind === 'output') w += 26;
    if (kind === 'start' || kind === 'end') w = Math.max(90, w);
    const n: FlowNode = { id: this.nid++, kind, label, line, role, blank, x: 0, y: 0, w, h };
    this.nodes.push(n);
    return n;
  }

  // ------------------------------------------------------------ AST → elements
  seq(list: Stmt[]): El {
    const items: El[] = [];
    for (const s of list) {
      const e = this.stmt(s);
      if (e) items.push(e);
    }
    return { k: 'seq', items };
  }

  body(s: Stmt): El {
    return s.s === 'block' ? this.seq(s.body) : this.seq([s]);
  }

  exprLabel(e0: Expr): { kind: FlowKind; text: string } {
    const e = e0.k === 'paren' ? e0.e : e0;
    const chain = (x: Expr, op: string): Expr[] => (x.k === 'bin' && x.op === op ? [...chain(x.l, op), x.r] : [x]);
    if (e.k === 'bin' && e.op === '<<') {
      const parts = chain(e, '<<');
      if (parts[0].k === 'id' && (parts[0].name === 'cout' || parts[0].name === 'cerr')) {
        const items = parts.slice(1).filter((p) => !(p.k === 'id' && (p.name === 'endl' || p.name === 'fixed')) && !(p.k === 'call' && /^set/.test(p.name)));
        const shown = items.map((p) => (p.k === 'lit' && p.v.t === 'cstr' && p.v.v === '\n' ? 'new line' : this.src(p)));
        return { kind: 'output', text: shown.length ? 'Display ' + shown.join(', ') : 'Display new line' };
      }
    }
    if (e.k === 'bin' && e.op === '>>') {
      const parts = chain(e, '>>');
      if (parts[0].k === 'id' && parts[0].name === 'cin') return { kind: 'input', text: 'Input ' + parts.slice(1).map((p) => this.src(p)).join(', ') };
    }
    if (e.k === 'call' && e.name === 'getline') return { kind: 'input', text: 'Input a line → ' + this.src(e.args[1]) };
    if (e.k === 'un' && (e.op === '++' || e.op === '--')) {
      const t = this.src(e.e);
      return { kind: 'process', text: `${t} = ${t} ${e.op === '++' ? '+' : '-'} 1` };
    }
    if (e.k === 'asg' && e.op !== '=') {
      const t = this.src(e.l);
      return { kind: 'process', text: `${t} = ${t} ${e.op.slice(0, -1)} ${this.src(e.r)}` };
    }
    if (e.k === 'call') return { kind: 'call', text: this.src(e) };
    return { kind: 'process', text: this.src(e) };
  }

  stmt(s: Stmt): El | null {
    switch (s.s) {
      case 'block':
        return this.seq(s.body);
      case 'decl': {
        const parts = s.items.map((it) => (it.init ? `${it.name}${it.dims.length ? '[]' : ''} = ${this.src(it.init)}` : `${it.name}${it.dims.map((d) => (d ? `[${this.src(d)}]` : '[]')).join('')}`));
        const allInit = s.items.every((it) => it.init);
        return { k: 'node', n: this.node('process', allInit ? parts.join(', ') : 'Declare ' + parts.join(', '), s.line) };
      }
      case 'expr': {
        const { kind, text } = this.exprLabel(s.e);
        return { k: 'node', n: this.node(kind, text, s.line) };
      }
      case 'if': {
        const d = this.node('decision', this.src(s.c) + ' ?', s.line);
        return { k: 'if', d, then: this.body(s.then), els: s.els ? this.body(s.els) : null };
      }
      case 'while': {
        const d = this.node('decision', this.src(s.c) + ' ?', s.line);
        return { k: 'while', d, body: this.body(s.body), init: null, update: null, doWhile: false };
      }
      case 'do': {
        const body = this.body(s.body);
        const d = this.node('decision', this.src(s.c) + ' ?', s.whileLine);
        return { k: 'while', d, body, init: null, update: null, doWhile: true };
      }
      case 'for': {
        let init: FlowNode | null = null;
        if (s.init) {
          if (s.init.s === 'decl') {
            const parts = s.init.items.map((it) => (it.init ? `${it.name} = ${this.src(it.init)}` : it.name));
            init = this.node('process', parts.join(', '), s.line, 'init');
          } else if (s.init.s === 'expr') init = this.node('process', this.exprLabel(s.init.e).text, s.line, 'init');
        }
        const d = this.node('decision', (s.c ? this.src(s.c) : 'true') + ' ?', s.line);
        const update = s.step ? this.node('process', this.exprLabel(s.step).text, s.line, 'update') : null;
        return { k: 'while', d, body: this.body(s.body), init, update, doWhile: false };
      }
      case 'rfor': {
        const d = this.node('decision', `next ${s.decl.items[0].name} in ${this.src(s.e)} ?`, s.line);
        return { k: 'while', d, body: this.body(s.body), init: null, update: null, doWhile: false };
      }
      case 'return':
        return { k: 'node', n: this.node('end', 'Stop', s.line), stop: true };
      case 'break':
        return { k: 'node', n: this.node('process', 'break', s.line), jump: 'break' };
      case 'continue':
        return { k: 'node', n: this.node('process', 'continue', s.line), jump: 'continue' };
      case 'switch':
        return { k: 'node', n: this.node('process', `switch (${this.src(s.e)})`, s.line) };
      case 'delete':
        return { k: 'node', n: this.node('process', this.src(s), s.line) };
      default:
        return null;
    }
  }

  // ------------------------------------------------------------ measuring
  /** extents to the left / right of the centre line, and height */
  measure(e: El): { L: number; R: number; h: number } {
    switch (e.k) {
      case 'node':
        return { L: e.n.w / 2, R: e.n.w / 2, h: e.n.h };
      case 'seq': {
        let L = 0;
        let R = 0;
        let h = 0;
        e.items.forEach((it, i) => {
          const m = this.measure(it);
          L = Math.max(L, m.L);
          R = Math.max(R, m.R);
          h += m.h + (i ? GAP : 0);
        });
        return { L, R, h };
      }
      case 'if': {
        const t = this.measure(e.then);
        const dL = e.d.w / 2;
        const L = Math.max(dL, t.L);
        if (e.els) {
          const f = this.measure(e.els);
          const xNo = Math.max(dL, t.R) + SIDE + f.L;
          return { L, R: xNo + f.R, h: e.d.h + GAP + Math.max(t.h, f.h) + GAP };
        }
        return { L, R: Math.max(dL, t.R) + SIDE + 6, h: e.d.h + GAP + t.h + GAP };
      }
      case 'while': {
        const b = this.measure(e.body);
        const u = e.update ? { w: e.update.w, h: e.update.h } : null;
        const bodyL = Math.max(b.L, u ? u.w / 2 : 0);
        const bodyR = Math.max(b.R, u ? u.w / 2 : 0);
        const bodyH = b.h + (u ? (b.h ? GAP : 0) + u.h : 0);
        const init = e.init ? e.init.h + GAP : 0;
        return {
          L: Math.max(e.d.w / 2, bodyL, e.init ? e.init.w / 2 : 0) + SIDE + 4,
          R: Math.max(e.d.w / 2, bodyR, e.init ? e.init.w / 2 : 0) + SIDE + 4,
          h: init + e.d.h + GAP + bodyH + GAP,
        };
      }
    }
  }

  // ------------------------------------------------------------ placing
  edge(points: [number, number][], arrow = true, label?: 'Yes' | 'No') {
    this.edges.push({ points, arrow, label });
  }

  private loops: { breakX: number; breakYs: [number, number][]; contX: number; conts: [number, number][] }[] = [];

  /** place element with its centre line at cx and top at y. Returns the exit point (or null if it stops). */
  place(e: El, cx: number, y: number): { exit: [number, number] | null; bottom: number } {
    switch (e.k) {
      case 'node': {
        e.n.x = cx;
        e.n.y = y;
        const bottom = y + e.n.h;
        if (e.stop) return { exit: null, bottom };
        if (e.jump && this.loops.length) {
          const lp = this.loops[this.loops.length - 1];
          if (e.jump === 'break') lp.breakYs.push([cx + e.n.w / 2, y + e.n.h / 2]);
          else lp.conts.push([cx - e.n.w / 2, y + e.n.h / 2]);
          return { exit: null, bottom };
        }
        return { exit: [cx, bottom], bottom };
      }
      case 'seq': {
        let cur = y;
        let exit: [number, number] | null = [cx, y];
        let first = true;
        for (const it of e.items) {
          if (!first) cur += GAP;
          const top = cur;
          if (!first && exit) this.edge([exit, [cx, top]]);
          const r = this.place(it, cx, top);
          exit = r.exit;
          cur = r.bottom;
          first = false;
          if (!exit) {
            // anything after a return/break is never reached — still draw it below, unconnected
          }
        }
        return { exit: e.items.length ? exit : [cx, y], bottom: cur };
      }
      case 'if': {
        const d = e.d;
        d.x = cx;
        d.y = y;
        const dBottom = y + d.h;
        const mid = y + d.h / 2;
        const t = this.measure(e.then);
        const topBranch = dBottom + GAP;
        const yesRes = this.place(e.then, cx, topBranch);
        const hasYes = (e.then as { items?: El[] }).items?.length !== 0;
        if (hasYes) this.edge([[cx, dBottom], [cx, topBranch]], true, 'Yes');
        let noRes: { exit: [number, number] | null; bottom: number };
        let xNo: number;
        if (e.els) {
          const f = this.measure(e.els);
          xNo = cx + Math.max(d.w / 2, t.R) + SIDE + f.L;
          this.edge([[cx + d.w / 2, mid], [xNo, mid], [xNo, topBranch]], true, 'No');
          noRes = this.place(e.els, xNo, topBranch);
        } else {
          xNo = cx + Math.max(d.w / 2, t.R) + SIDE;
          noRes = { exit: [xNo, topBranch], bottom: topBranch };
          this.edge([[cx + d.w / 2, mid], [xNo, mid], [xNo, topBranch]], false, 'No');
        }
        const bottom = Math.max(yesRes.bottom, noRes.bottom) + GAP;
        const exits = [hasYes ? yesRes.exit : [cx, dBottom] as [number, number], noRes.exit].filter(Boolean) as [number, number][];
        if (!exits.length) return { exit: null, bottom };
        for (const [x0, y0] of exits) {
          if (x0 === cx) this.edge([[x0, y0], [cx, bottom]], false);
          else this.edge([[x0, y0], [x0, bottom], [cx, bottom]], false);
        }
        return { exit: [cx, bottom], bottom };
      }
      case 'while': {
        const m = this.measure(e);
        let top = y;
        if (e.init) {
          e.init.x = cx;
          e.init.y = y;
          top = y + e.init.h + GAP;
          this.edge([[cx, y + e.init.h], [cx, top]]);
        }
        const d = e.d;
        const leftX = cx - m.L + 2;
        const rightX = cx + m.R - 2;
        if (e.doWhile) {
          // body first, then the question; Yes goes back up on the left
          const bodyTop = top;
          this.loops.push({ breakX: rightX, breakYs: [], contX: leftX, conts: [] });
          const b = this.place(e.body, cx, bodyTop);
          const lp = this.loops.pop()!;
          const dTop = b.bottom + GAP;
          if (b.exit) this.edge([b.exit, [cx, dTop]]);
          d.x = cx;
          d.y = dTop;
          const mid = dTop + d.h / 2;
          this.edge([[cx - d.w / 2, mid], [leftX, mid], [leftX, bodyTop - GAP / 2], [cx, bodyTop - GAP / 2]], true, 'Yes');
          const bottom = dTop + d.h + GAP;
          this.edge([[cx, dTop + d.h], [cx, bottom]], false, 'No');
          for (const [bx, by] of lp.breakYs) this.edge([[bx, by], [rightX, by], [rightX, bottom], [cx, bottom]], false);
          return { exit: [cx, bottom], bottom };
        }
        d.x = cx;
        d.y = top;
        const mid = top + d.h / 2;
        const bodyTop = top + d.h + GAP;
        this.loops.push({ breakX: rightX, breakYs: [], contX: leftX, conts: [] });
        const b = this.place(e.body, cx, bodyTop);
        const hasBody = (e.body as { items?: El[] }).items?.length !== 0;
        this.edge([[cx, top + d.h], [cx, bodyTop]], hasBody, 'Yes');
        let end = b.exit;
        let endY = b.bottom;
        if (e.update) {
          const uTop = (hasBody ? b.bottom + GAP : bodyTop);
          e.update.x = cx;
          e.update.y = uTop;
          if (b.exit && hasBody) this.edge([b.exit, [cx, uTop]]);
          end = [cx, uTop + e.update.h];
          endY = uTop + e.update.h;
        }
        const lp = this.loops.pop()!;
        const backY = endY + GAP / 2;
        if (end) this.edge([end, [cx, backY], [leftX, backY], [leftX, mid], [cx - d.w / 2, mid]]);
        for (const [x0, y0] of lp.conts) this.edge([[x0, y0], [leftX, y0]], false);
        const bottom = backY + GAP / 2;
        this.edge([[cx + d.w / 2, mid], [rightX, mid], [rightX, bottom], [cx, bottom]], false, 'No');
        for (const [bx, by] of lp.breakYs) this.edge([[bx, by], [rightX, by]], false);
        return { exit: [cx, bottom], bottom };
      }
    }
  }
}

/** Build the flowchart of main(). Returns null if the code does not parse. */
export function buildFlow(code: string, original = code): FlowGraph | null {
  let prog: Program;
  try {
    const w: Diag[] = [];
    prog = parse(code, w);
  } catch {
    return null;
  }
  const main = prog.funcs.find((f) => f.name === 'main');
  if (!main?.body) return null;
  const b = new Builder(prog, original);
  const body = main.body.body.slice();
  // a final `return 0;` is just the Stop box
  const last = body[body.length - 1];
  if (last && last.s === 'return') body.pop();
  const start = b.node('start', 'Start', null);
  const inner = b.seq(body);
  const end = b.node('end', 'Stop', main.body.endLine);
  const all: El = { k: 'seq', items: [{ k: 'node', n: start }, inner, { k: 'node', n: end, stop: true }] };
  const m = b.measure(all);
  const pad = 24;
  const cx = pad + m.L;
  b.place(all, cx, pad);
  // drop "start → empty seq" artefacts: nothing to do, edges are only drawn between real items
  const width = Math.ceil(pad * 2 + m.L + m.R);
  const height = Math.ceil(pad * 2 + m.h);
  return { nodes: b.nodes, edges: b.edges, width, height };
}

/** which box is running in a dry-run step */
export function flowNodeFor(g: FlowGraph, step: { kind: string; line: number | null }): FlowNode | null {
  if (step.kind === 'start') return g.nodes.find((n) => n.kind === 'start') ?? null;
  if (step.kind === 'end') return [...g.nodes].reverse().find((n) => n.kind === 'end') ?? null;
  const here = g.nodes.filter((n) => n.line === step.line);
  if (!here.length) return null;
  if (step.kind === 'cond' || step.kind === 'loop') return here.find((n) => n.kind === 'decision') ?? here[0];
  if (step.kind === 'decl') return here.find((n) => n.role === 'init') ?? here.find((n) => n.kind !== 'decision') ?? here[0];
  if (step.kind === 'assign') return here.find((n) => n.role === 'update') ?? here.find((n) => n.kind !== 'decision' && !n.role) ?? here[0];
  if (step.kind === 'return') return here.find((n) => n.kind === 'end') ?? here[0];
  return here.find((n) => n.kind !== 'decision' && !n.role) ?? here[0];
}
