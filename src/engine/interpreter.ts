// Executes a parsed program and records a replayable trace.
// Every recorded Step says which line just ran, what memory looks like,
// what is on the console and — in plain English — what happened.
//
// Memory model: every variable is an object at an address. Objects are made of
// "cells" (one per primitive / pointer / string box). Arrays and structs are
// several cells in a row, so pointer arithmetic works like in real C++.

import { parse } from './parser';
import { check } from './checker';
import * as V from './values';
import { Layouts, arrOf, baseTy, declTy, isArr, isPtr, isStructT, ptrTo, tyEq, tyLabel } from './ty';
import {
  CompileError,
  type BlockStmt,
  type Calc,
  type CalcLine,
  type ConsoleSeg,
  type DeclStmt,
  type Diag,
  type Expr,
  type FrameSnap,
  type FuncDef,
  type IfStmt,
  type MemVal,
  type Program,
  type RunOptions,
  type RunResult,
  type RV,
  type Span,
  type Step,
  type StepKind,
  type Stmt,
  type StructVal,
  type Ty,
  type ValType,
  type VarSnap,
} from './types';

// ---------------------------------------------------------------- helpers & errors

class StopRun extends Error {
  constructor(public reason: 'limit' | 'input' | 'error') {
    super(reason);
  }
}
class RuntimeErr extends Error {
  constructor(msg: string, public line: number | null, public consoleMsg: string) {
    super(msg);
  }
}

type Signal = 'normal' | 'break' | 'continue' | 'return';

interface Obj {
  id: number;
  key: string;
  name: string;
  ty: Ty;
  addr: number;
  size: number;
  region: 'stack' | 'global' | 'heap' | 'rodata';
  alive: boolean;
  isConst: boolean;
  /** heap: made with new[] */
  isArrNew?: boolean;
}

interface Cell {
  ty: Ty; // primitive or pointer
  value: RV | null;
  obj: Obj;
  path: string;
}

interface Var {
  key: string;
  name: string;
  ty: Ty;
  addr: number;
  obj: Obj;
  isConst: boolean;
  isRef: boolean;
  /** int a[] parameter: really a pointer */
  arrParam?: boolean;
}

interface Scope {
  vars: Var[];
  map: Map<string, Var>;
  label?: string;
  sp: number;
}

interface Frame {
  fn: string;
  scopes: Scope[];
  callLine?: number;
  base: number;
  ret?: string;
  def?: FuncDef;
}

/** a place in memory that can be read / written */
interface Loc {
  addr: number;
  ty: Ty;
  label: string;
  isConst?: boolean;
  /** one character inside a std::string */
  str?: { loc: Loc; i: number };
  /** index was outside the array */
  oob?: string;
}

const MANIP_NAMES = new Set(['endl', 'flush', 'fixed', 'scientific', 'defaultfloat', 'left', 'right', 'boolalpha', 'noboolalpha', 'showpoint', 'noshowpoint', 'showpos', 'noshowpos']);
const MANIP_CALLS = new Set(['setw', 'setprecision', 'setfill']);
const LV_BUILTINS = new Set(['swap', 'getline']);
const B0 = BigInt(0);
const B1 = BigInt(1);

// mutable display tree node (clone of Expr where literals become `val` nodes)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = any;

const GARBAGE_INT = [32767, 4200096, -858993460, 21845, 16, 4194432, 1970170187];

function hashStr(s: string): number {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const hex = (a: number) => '0x' + a.toString(16);

function unparen(e: Expr): Expr {
  return e.k === 'paren' ? unparen(e.e) : e;
}

function clone(e: Expr): D {
  const walk = (n: D): D => {
    if (n === null || typeof n !== 'object') return n;
    if (Array.isArray(n)) return n.map(walk);
    if (n.k === 'lit') return { k: 'val', v: n.v, raw: n.raw, span: n.span, id: n.id };
    const out: D = {};
    for (const key of Object.keys(n)) {
      const val = n[key];
      out[key] = key === 'span' || key === 'opSpan' || key === 'nameSpan' || key === 'ty' ? val : walk(val);
    }
    return out;
  };
  return walk(e);
}

function isNegNum(v: RV): boolean {
  if (typeof v.v === 'bigint') return v.v < B0;
  if (typeof v.v === 'number') return v.v < 0 || Object.is(v.v, -0);
  return false;
}

function render(n: D, focus: D | null, parent: D | null = null, side: 'l' | 'r' | 'u' | null = null): string {
  let s: string;
  switch (n.k) {
    case 'val':
      s = n.raw ?? V.displayRV(n.v);
      if (parent && (side === 'r' || side === 'u') && isNegNum(n.v)) s = `(${s})`;
      break;
    case 'loc':
      s = n.loc.label;
      break;
    case 'id':
      s = (n.qual ? 'std::' : n.global ? '::' : '') + n.name;
      break;
    case 'paren':
      s = '(' + render(n.e, focus, n) + ')';
      break;
    case 'un':
      s = n.postfix ? render(n.e, focus, n, 'u') + n.op : n.op + render(n.e, focus, n, 'u');
      break;
    case 'bin':
      s = render(n.l, focus, n, 'l') + (n.op === ',' ? ', ' : ` ${n.op} `) + render(n.r, focus, n, 'r');
      break;
    case 'asg':
      s = render(n.l, focus, n, 'l') + ` ${n.op} ` + render(n.r, focus, n, 'r');
      break;
    case 'cond':
      s = `${render(n.c, focus, n)} ? ${render(n.a, focus, n)} : ${render(n.b, focus, n)}`;
      break;
    case 'call':
      s = (n.qual ? 'std::' : '') + n.name + '(' + n.args.map((a: D) => render(a, focus, n)).join(', ') + ')';
      break;
    case 'mcall':
      s = render(n.obj, focus, n) + '.' + n.name + '(' + n.args.map((a: D) => render(a, focus, n)).join(', ') + ')';
      break;
    case 'mem':
      s = render(n.obj, focus, n, 'u') + (n.arrow ? '->' : '.') + n.name;
      break;
    case 'idx':
      s = render(n.obj, focus, n) + '[' + render(n.i, focus, n) + ']';
      break;
    case 'list':
      s = '{' + n.items.map((a: D) => render(a, focus, n)).join(', ') + '}';
      break;
    case 'new':
      s = 'new ' + n.ty.text + '*'.repeat(n.ptr) + (n.dim ? '[' + render(n.dim, focus, n) + ']' : '') + (n.init ? (n.init.k === 'list' ? render(n.init, focus, n) : '(' + render(n.init, focus, n) + ')') : '');
      break;
    case 'cast':
      if (n.style === 'c') s = '(' + n.ty.text + ')' + render(n.e, focus, n, 'u');
      else if (n.style === 'static') s = `static_cast<${n.ty.text}>(${render(n.e, focus, n)})`;
      else s = `${n.ty.text}(${render(n.e, focus, n)})`;
      break;
    case 'sizeof':
      s = n.ty ? `sizeof(${n.ty.text}${'*'.repeat(n.tyPtr ?? 0)})` : `sizeof(${render(n.e, focus, n)})`;
      break;
    default:
      s = '?';
  }
  return n === focus ? '\u0001' + s + '\u0002' : s;
}

function flattenChain(e: Expr, op: '<<' | '>>'): { base: Expr; items: { e: Expr; opSpan: Span }[] } {
  const items: { e: Expr; opSpan: Span }[] = [];
  let cur = e;
  while (cur.k === 'bin' && cur.op === op) {
    items.unshift({ e: cur.r, opSpan: cur.opSpan });
    cur = cur.l;
  }
  return { base: cur, items };
}

function chainBase(e: Expr): string | null {
  if (e.k === 'bin' && (e.op === '<<' || e.op === '>>')) return chainBase(e.l);
  if (e.k === 'id') return e.name;
  return null;
}

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
const isCharT = (t: Ty) => typeof t === 'string' && V.isCharType(t);

// ---------------------------------------------------------------- public API

export function runProgram(src: string, opts: RunOptions = {}): RunResult {
  const warnings: Diag[] = [];
  let prog: Program;
  try {
    prog = parse(src, warnings);
    check(prog, warnings);
  } catch (e) {
    if (e instanceof CompileError) {
      return {
        ok: false,
        compileErrors: e.diags,
        warnings,
        steps: [],
        console: [],
        stdout: '',
        exitCode: null,
        runtimeError: null,
        needsInput: false,
        truncated: false,
        executedLines: [],
        lines: src.split('\n'),
      };
    }
    throw e;
  }
  return new Machine(prog, opts).run(warnings);
}

/** compile only (no run): the errors and warnings g++ would print */
export function compileOnly(src: string): { errors: Diag[]; warnings: Diag[] } {
  const warnings: Diag[] = [];
  try {
    const prog = parse(src, warnings);
    check(prog, warnings);
    return { errors: [], warnings };
  } catch (e) {
    if (e instanceof CompileError) return { errors: e.diags, warnings };
    throw e;
  }
}

// ---------------------------------------------------------------- machine

class Machine {
  steps: Step[] = [];
  segs: ConsoleSeg[] = [];
  stdout = '';
  input: string;
  inPos = 0;
  inFail = false;
  echoedTo = 0;
  frames: Frame[] = [];
  globals: Scope = { vars: [], map: new Map(), label: 'globals', sp: 0 };
  changed = new Set<string>();
  changedAddrs = new Set<number>();
  notes: string[] = [];
  group = 0;
  curGroup: number | null = null;
  executed = new Set<number>();
  keyCounter = 0;
  out = V.defaultOutState();
  maxSteps: number;
  exitCode: number | null = null;
  runtimeError: { line: number | null; msg: string } | null = null;
  needsInput = false;
  truncated = false;
  breakTargets: ('loop' | 'switch')[] = [];
  stepWarn: string | undefined;
  calcNotes: string[] = [];
  L: Layouts;
  // memory
  cells = new Map<number, Cell>();
  objs: Obj[] = [];
  objId = 0;
  sp = 0x61fe20;
  gp = 0x408020;
  hp = 0xa01510;
  rp = 0x405064;
  heapCount = 0;
  retVal: RV | null = null;
  retLoc: Loc | null = null;
  literals = new Map<string, number>();

  constructor(private prog: Program, private opts: RunOptions) {
    this.input = opts.input ?? '';
    this.maxSteps = opts.maxSteps ?? 1500;
    this.L = prog.layouts ?? new Layouts(new Map());
  }

  src(x: { span: Span }): string {
    return norm(this.prog.src.slice(x.span.start, x.span.end));
  }

  // ------------------------------------------------------------ recording
  rec(kind: StepKind, line: number | null, text: string, extra: Partial<Step> = {}): Step {
    if (this.steps.length >= this.maxSteps) {
      this.truncated = true;
      throw new StopRun('limit');
    }
    const pre = this.notes.length ? this.notes.join(' ') + '\n' : '';
    this.notes = [];
    const step: Step = {
      i: this.steps.length,
      kind,
      line,
      next: null,
      text: pre + text,
      calcs: extra.calcs ?? [],
      frames: this.snapFrames(),
      globals: this.globals.vars.map((v) => this.snapVar(v, 0)),
      heap: this.snapHeap(),
      changedAddrs: [...this.changedAddrs].map(hex),
      consoleLen: this.segs.length,
      stdinPos: this.inPos,
      changed: [...this.changed],
      group: extra.group ?? this.curGroup ?? ++this.group,
      sub: false,
      hl: extra.hl,
      branch: extra.branch,
      warn: extra.warn ?? this.stepWarn,
    };
    this.stepWarn = undefined;
    this.changed.clear();
    this.changedAddrs.clear();
    if (line !== null) this.executed.add(line);
    this.steps.push(step);
    return step;
  }

  write(text: string, kind: ConsoleSeg['kind'] = 'out') {
    if (!text) return;
    this.segs.push({ text, kind, step: this.steps.length });
    if (kind === 'out') this.stdout += text;
  }

  // ------------------------------------------------------------ snapshots
  snapVar(v: Var, depth: number, label?: string): VarSnap {
    const val = this.memVal(v.addr, v.ty);
    const snap: VarSnap = {
      key: v.key,
      name: v.name,
      type: (v.isConst ? 'const ' : '') + tyLabel(v.ty) + (v.isRef ? '&' : ''),
      display: val.display,
      sub: val.sub,
      uninit: val.uninit,
      depth,
      scopeLabel: label,
      addr: hex(v.addr),
      size: this.L.size(v.ty),
      isConst: v.isConst,
      val,
    };
    if (v.isRef) {
      snap.refTo = hex(v.addr);
      snap.refLabel = this.labelAt(v.addr, v.ty);
    }
    return snap;
  }

  snapFrames(): FrameSnap[] {
    return this.frames.filter((f) => f.fn !== 'globals').map((f) => ({
      fn: f.fn,
      vars: f.scopes.flatMap((s, d) => s.vars.map((v) => this.snapVar(v, d, s.label))),
      callLine: f.callLine,
      ret: f.ret,
    }));
  }

  snapHeap(): VarSnap[] {
    return this.objs.filter((o) => o.region === 'heap' && o.alive).map((o) => {
      const val = this.memVal(o.addr, o.ty);
      return {
        key: o.key,
        name: o.name,
        type: tyLabel(o.ty),
        display: val.display,
        sub: val.sub,
        uninit: val.uninit,
        depth: 0,
        addr: hex(o.addr),
        size: o.size,
        isConst: false,
        val,
      };
    });
  }

  memVal(addr: number, ty: Ty): MemVal {
    if (isArr(ty)) {
      const es = this.L.size(ty.of);
      const items = Array.from({ length: ty.n ?? 0 }, (_, i) => ({ label: String(i), val: this.memVal(addr + i * es, ty.of) }));
      let display = '{' + items.map((it) => it.val.display).join(', ') + '}';
      if (isCharT(ty.of)) {
        const txt = this.cstrAt(addr, ty.n ?? 0);
        if (txt !== null) display = V.quoteStr(txt);
      }
      return { kind: 'arr', type: tyLabel(ty), addr: hex(addr), display, uninit: items.every((it) => it.val.uninit), items };
    }
    if (isStructT(ty)) {
      const items = this.L.struct(ty.name).fields.map((f) => ({ label: f.name, val: this.memVal(addr + f.off, f.ty) }));
      return {
        kind: 'struct', type: ty.name, addr: hex(addr),
        display: '{' + items.map((it) => it.val.display).join(', ') + '}',
        uninit: items.every((it) => it.val.uninit), items,
      };
    }
    const cell = this.cells.get(addr);
    const v = cell?.value ?? null;
    if (isPtr(ty)) {
      if (!v) return { kind: 'ptr', type: tyLabel(ty), addr: hex(addr), display: '?', uninit: true, target: null };
      const a = v.v as number;
      if (a === 0) return { kind: 'ptr', type: tyLabel(ty), addr: hex(addr), display: 'nullptr', uninit: false, target: null };
      const o = this.objAt(a);
      return {
        kind: 'ptr', type: tyLabel(ty), addr: hex(addr), display: hex(a), uninit: false,
        target: hex(a), targetLabel: o ? this.labelAt(a, ty.to) : undefined,
        dangling: !o || !o.alive,
        sub: o ? (o.alive ? `→ ${this.labelAt(a, ty.to)}` : `→ deleted memory!`) : '→ ???',
      };
    }
    return {
      kind: 'prim', type: tyLabel(ty), addr: hex(addr),
      display: v ? V.displayRV(v) : '?', sub: v ? V.asciiNote(v) : undefined, uninit: !v,
    };
  }

  /** text in a char array (up to '\0'), or null if there is no '\0' */
  cstrAt(addr: number, max: number): string | null {
    let s = '';
    for (let i = 0; i < max; i++) {
      const c = this.cells.get(addr + i);
      if (!c || !c.value) return null;
      const code = Number(V.toBig(c.value)) & 0xff;
      if (code === 0) return s;
      s += String.fromCharCode(code);
    }
    return null;
  }

  // ------------------------------------------------------------ memory
  get frame(): Frame {
    return this.frames[this.frames.length - 1];
  }

  pushScope(label?: string) {
    this.frame.scopes.push({ vars: [], map: new Map(), label, sp: this.sp });
  }

  popScope() {
    const s = this.frame.scopes.pop();
    if (s && s.vars.length) {
      const names = s.vars.map((v) => `\`${v.name}\``).join(', ');
      this.notes.push(`(The block ended, so ${names} ${s.vars.length === 1 ? 'was' : 'were'} removed from memory.)`);
      for (const v of s.vars) if (!v.isRef) this.kill(v.obj);
    }
    if (s) this.sp = s.sp;
  }

  kill(o: Obj) {
    o.alive = false;
  }

  alloc(name: string, ty: Ty, region: Obj['region'], isConst = false): Obj {
    const size = Math.max(1, this.L.size(ty));
    const align = Math.min(this.L.align(ty), 16);
    let addr: number;
    if (region === 'stack') {
      this.sp -= size;
      this.sp -= this.sp % Math.max(align, size >= 16 ? 16 : align);
      addr = this.sp;
    } else if (region === 'global') {
      this.gp = Math.ceil(this.gp / align) * align;
      addr = this.gp;
      this.gp += size;
    } else if (region === 'heap') {
      addr = this.hp;
      this.hp += Math.ceil((size + 16) / 16) * 16;
    } else {
      addr = this.rp;
      this.rp += size;
    }
    const o: Obj = { id: ++this.objId, key: `${name}#${++this.keyCounter}`, name, ty, addr, size, region, alive: true, isConst };
    this.objs.push(o);
    for (const lf of this.L.leaves(ty)) {
      this.cells.set(addr + lf.off, { ty: lf.ty, value: lf.ty === 'string' ? V.mkStr('') : null, obj: o, path: lf.path });
    }
    return o;
  }

  /** the (alive, else most recent) object that contains address a */
  objAt(a: number): Obj | undefined {
    let dead: Obj | undefined;
    for (let i = this.objs.length - 1; i >= 0; i--) {
      const o = this.objs[i];
      if (a >= o.addr && a < o.addr + o.size) {
        if (o.alive) return o;
        dead ??= o;
      }
    }
    return dead;
  }

  /** readable name for the box at address a, e.g. arr[2], s.age, heap#1[0] */
  labelAt(a: number, want?: Ty): string {
    const o = this.objAt(a);
    if (!o) return hex(a);
    let path = o.name;
    let cur: Ty = o.ty;
    let off = a - o.addr;
    for (let guard = 0; guard < 20; guard++) {
      if (off === 0 && (!want || tyEq(cur, want) || !(isArr(cur) || isStructT(cur)))) break;
      if (isArr(cur)) {
        const es = this.L.size(cur.of);
        const i = Math.floor(off / es);
        path += `[${i}]`;
        off -= i * es;
        cur = cur.of;
      } else if (isStructT(cur)) {
        const f = [...this.L.struct(cur.name).fields].reverse().find((x) => x.off <= off);
        if (!f) break;
        path += `.${f.name}`;
        off -= f.off;
        cur = f.ty;
      } else break;
    }
    return path;
  }

  declare(name: string, ty: Ty, isConst: boolean, scope?: Scope, region: Obj['region'] = 'stack'): Var {
    const o = this.alloc(name, ty, region, isConst);
    const v: Var = { key: o.key, name, ty, addr: o.addr, obj: o, isConst, isRef: false };
    const sc = scope ?? this.frame.scopes[this.frame.scopes.length - 1];
    sc.vars.push(v);
    sc.map.set(name, v);
    this.changed.add(v.key);
    return v;
  }

  declareRef(name: string, loc: Loc, isConst: boolean): Var {
    const o = this.objAt(loc.addr)!;
    const v: Var = { key: `${name}#${++this.keyCounter}`, name, ty: loc.ty, addr: loc.addr, obj: o, isConst, isRef: true };
    const sc = this.frame.scopes[this.frame.scopes.length - 1];
    sc.vars.push(v);
    sc.map.set(name, v);
    this.changed.add(v.key);
    return v;
  }

  lookup(name: string): Var | undefined {
    const f = this.frames[this.frames.length - 1];
    if (f) {
      for (let i = f.scopes.length - 1; i >= 0; i--) {
        const v = f.scopes[i].map.get(name);
        if (v) return v;
      }
    }
    return this.globals.map.get(name);
  }

  mustVar(name: string, line: number): Var {
    const v = this.lookup(name);
    if (!v) throw new RuntimeErr(`'${name}' is not a variable`, line, '');
    return v;
  }

  varLoc(v: Var): Loc {
    return { addr: v.addr, ty: v.ty, label: v.isRef ? this.labelAt(v.addr, v.ty) : v.name, isConst: v.isConst };
  }

  garbageFor(ty: Ty, seed: string): RV {
    const h = hashStr(seed);
    if (isPtr(ty)) return { t: 'ptr', v: [0x10, 0x4015c0, 0x7ffd, 0x1][h % 4], pt: ty.to, garbage: true };
    const t = ty as ValType;
    if (V.isFloating(t)) return { t, v: [0, 6.95335e-310, -1.28823e-231, 4.2e-314][h % 4], garbage: true };
    if (t === 'bool') return { t: 'bool', v: h % 2 === 0, garbage: true };
    if (V.isCharType(t)) return { t, v: BigInt([0, 64, 16, 1][h % 4]), garbage: true };
    if (t === 'string') return { t, v: '', garbage: true };
    return { t, v: V.wrap(t, BigInt(GARBAGE_INT[h % GARBAGE_INT.length])), garbage: true };
  }

  zeroOf(ty: Ty): RV {
    if (isPtr(ty)) return { t: 'ptr', v: 0, pt: ty.to };
    const t = ty as ValType;
    if (t === 'string') return { t, v: '' };
    if (t === 'bool') return { t, v: false };
    if (V.isFloating(t)) return { t, v: 0 };
    return { t, v: B0 };
  }

  /** read the value stored at a location */
  read(loc: Loc, line: number | null = null): RV {
    if (loc.str) {
      const s = this.read(loc.str.loc, line).v as string;
      const i = loc.str.i;
      if (i < 0 || i > s.length) {
        this.calcNotes.push(`position ${i} is OUTSIDE the text (valid: 0 to ${s.length - 1}) → garbage!`);
        return { t: 'char', v: B0, garbage: true };
      }
      return { t: 'char', v: BigInt(i === s.length ? 0 : s.charCodeAt(i) & 0xff) };
    }
    const ty = loc.ty;
    if (isArr(ty)) return { t: 'ptr', v: loc.addr, pt: ty.of };
    if (isStructT(ty)) {
      const cells = this.L.leaves(ty).map((lf) => this.readCell(loc.addr + lf.off, lf.ty, loc.label + lf.path, line));
      return { t: 'st', v: { name: ty.name, cells } as StructVal, sname: ty.name };
    }
    if (loc.oob) {
      this.stepWarn = loc.oob;
      this.calcNotes.push(`${loc.label} is outside the array → garbage!`);
      const c = this.cells.get(loc.addr);
      return c?.value ? { ...c.value, garbage: true } : this.garbageFor(ty, loc.label);
    }
    return this.readCell(loc.addr, ty, loc.label, line) ?? this.garbageFor(ty, loc.label);
  }

  readCell(addr: number, ty: Ty, label: string, line: number | null): RV {
    if (addr === 0) throw new RuntimeErr('the pointer is nullptr (address 0). There is no box there to read, so the program crashes.', line, '[Program crashed: segmentation fault]');
    const c = this.cells.get(addr);
    if (!c) throw new RuntimeErr(`address ${hex(addr)} is not a valid box in memory. Reading it crashes the program (segmentation fault).`, line, '[Program crashed: segmentation fault]');
    if (!c.obj.alive) {
      this.stepWarn = `\`${label}\` no longer exists (its memory was ${c.obj.region === 'heap' ? 'deleted' : 'freed when its function/block ended'}). Using it is a **dangling pointer** bug — the value is unpredictable.`;
    }
    if (!c.value) {
      const g = this.garbageFor(ty, label);
      this.stepWarn = `\`${label}\` was used before it got a value, so it contains garbage (unpredictable).`;
      this.calcNotes.push(`${label} has no value yet → garbage!`);
      return g;
    }
    if (typeof ty === 'string' && c.value.t !== ty && c.value.t !== 'ptr') return V.convert(c.value, ty as ValType);
    return c.value;
  }

  /** store a value at a location (with implicit conversion) */
  store(loc: Loc, value: RV, line: number | null = null) {
    if (loc.str) {
      const cur = this.read(loc.str.loc, line);
      const s = (cur.v as string) ?? '';
      const i = loc.str.i;
      if (i < 0 || i >= s.length) {
        throw new RuntimeErr(`index ${i} is outside the string "${s}" (valid positions are 0 to ${s.length - 1}).`, line, '[Program crashed: string index out of range]');
      }
      this.store(loc.str.loc, V.mkStr(s.slice(0, i) + V.charOf(V.convert(value, 'char')) + s.slice(i + 1)), line);
      return;
    }
    if (loc.oob) {
      throw new RuntimeErr(`${loc.oob} Writing there overwrites memory that belongs to something else (or crashes).`, line, '[Program crashed: wrote outside an array]');
    }
    const ty = loc.ty;
    if (isStructT(ty)) {
      const sv = value.v as StructVal;
      this.L.leaves(ty).forEach((lf, k) => this.writeCell(loc.addr + lf.off, lf.ty, sv.cells[k] ?? null, line));
      return;
    }
    if (isArr(ty)) throw new RuntimeErr('arrays cannot be assigned as a whole', line, '');
    this.writeCell(loc.addr, ty, this.conv(value, ty), line);
  }

  writeCell(addr: number, ty: Ty, value: RV | null, line: number | null) {
    if (addr === 0) throw new RuntimeErr('the pointer is nullptr (address 0). There is no box there to write into, so the program crashes.', line, '[Program crashed: segmentation fault]');
    const c = this.cells.get(addr);
    if (!c) throw new RuntimeErr(`address ${hex(addr)} is not a valid box in memory. Writing there crashes the program (segmentation fault).`, line, '[Program crashed: segmentation fault]');
    if (c.obj.region === 'rodata') throw new RuntimeErr('text in double quotes is read-only memory — it cannot be changed. Copy it into a char array first.', line, '[Program crashed: segmentation fault]');
    if (!c.obj.alive) this.stepWarn = 'Writing into memory that no longer exists (dangling pointer)! This can silently damage other data.';
    c.value = value ? (typeof ty === 'string' && value.t !== 'ptr' && value.t !== 'st' ? { ...V.convert(value, ty as ValType), garbage: undefined } : { ...value, garbage: undefined }) : null;
    this.changedAddrs.add(addr);
    this.changed.add(c.obj.key);
    for (const f of this.frames) for (const s of f.scopes) for (const v of s.vars) if (v.isRef && v.obj === c.obj) this.changed.add(v.key);
  }

  /** implicit conversion to a full type */
  conv(value: RV, ty: Ty): RV {
    if (isPtr(ty)) {
      if (value.t === 'ptr') return { t: 'ptr', v: value.v, pt: ty.to, garbage: value.garbage };
      if (value.t === 'cstr') return { t: 'ptr', v: this.literal(value.v as string), pt: ty.to };
      return { t: 'ptr', v: Number(V.toBig(value)), pt: ty.to };
    }
    if (isStructT(ty)) return value;
    if (ty === 'bool' && value.t === 'ptr') return V.mkBool((value.v as number) !== 0);
    if (ty === 'string' && value.t === 'ptr') return V.mkStr(this.cstrFrom(value.v as number));
    return V.convert(value, ty as ValType);
  }

  /** store a string literal in read-only memory (once) and return its address */
  literal(s: string): number {
    const hit = this.literals.get(s);
    if (hit !== undefined) return hit;
    const o = this.alloc(V.quoteStr(s), arrOf('char', s.length + 1), 'rodata', true);
    for (let i = 0; i <= s.length; i++) this.cells.get(o.addr + i)!.value = { t: 'char', v: BigInt(i < s.length ? s.charCodeAt(i) & 0xff : 0) };
    this.literals.set(s, o.addr);
    return o.addr;
  }

  /** read a C-string starting at address a */
  cstrFrom(a: number, line: number | null = null): string {
    if (a === 0) throw new RuntimeErr('the char pointer is nullptr, so there is no text to read.', line, '[Program crashed: segmentation fault]');
    let s = '';
    for (let i = 0; i < 100000; i++) {
      const c = this.cells.get(a + i);
      if (!c) {
        this.stepWarn = "The text has no '\\0' at the end, so C++ keeps reading past the array into other memory (garbage!).";
        return s;
      }
      const code = c.value ? Number(V.toBig(c.value)) & 0xff : 0;
      if (!c.value) this.stepWarn = 'Part of this char array was never filled, so it contains garbage.';
      if (code === 0) return s;
      s += String.fromCharCode(code);
    }
    return s;
  }

  // ------------------------------------------------------------ run
  run(warnings: Diag[]): RunResult {
    const main = this.prog.funcs.find((f) => f.name === 'main')!;
    try {
      this.frames.push({ fn: 'globals', scopes: [this.globals], base: this.sp });
      if (this.opts.explainSetup) this.setupSteps(main.line);
      for (const g of this.prog.globals) this.execDecl(g, true);
      this.frames.pop();
      this.frames.push({ fn: 'main', scopes: [{ vars: [], map: new Map(), sp: this.sp }], base: this.sp, def: main });
      this.rec('start', null, 'The program starts. Execution always begins at the first line inside `main()`.');
      const sig = this.execStmts(main.body!.body);
      const leaks = this.objs.filter((o) => o.region === 'heap' && o.alive);
      const leakNote = leaks.length
        ? `\n\n⚠ **Memory leak:** ${leaks.map((o) => `\`${o.name}\` (${tyLabel(o.ty)})`).join(', ')} ${leaks.length === 1 ? 'was' : 'were'} made with \`new\` but never deleted. Always \`delete\` what you \`new\`.`
        : '';
      if (sig !== 'return') {
        this.exitCode = 0;
        this.rec('end', main.body!.endLine, 'Reached the closing `}` of `main()`, so the program ends. (`main` returns 0 automatically.)' + leakNote);
      } else {
        this.rec('end', null, `Program finished with exit code ${this.exitCode ?? 0}.` + leakNote);
      }
    } catch (e) {
      if (e instanceof StopRun) {
        if (e.reason === 'limit') {
          this.steps[this.steps.length - 1].text += `\n\n**Stopped after ${this.maxSteps} steps.** The program may be stuck in an endless loop.`;
        }
      } else if (e instanceof RuntimeErr) {
        this.runtimeError = { line: e.line, msg: e.message };
        this.write(e.consoleMsg, 'err');
        this.maxSteps += 1;
        this.curGroup = null;
        this.rec('error', e.line, `**Runtime error:** ${e.message}`);
      } else throw e;
    }
    for (let i = 0; i < this.steps.length; i++) this.steps[i].next = this.steps[i + 1]?.line ?? null;
    return {
      ok: !this.runtimeError && !this.truncated && !this.needsInput,
      compileErrors: [],
      warnings,
      steps: this.steps,
      console: this.segs,
      stdout: this.stdout,
      exitCode: this.exitCode,
      runtimeError: this.runtimeError,
      needsInput: this.needsInput,
      truncated: this.truncated,
      executedLines: [...this.executed].sort((a, b) => a - b),
      lines: this.prog.lines,
    };
  }

  setupSteps(mainLine: number) {
    for (const inc of this.prog.includes) {
      const what: Record<string, string> = {
        iostream: 'It contains `cout` (output) and `cin` (input).',
        iomanip: 'It contains output formatting tools like `setw` and `setprecision`.',
        cmath: 'It contains maths functions like `sqrt` and `pow`.',
        string: 'It contains the `string` type for text.',
        cstring: 'It contains functions for char arrays like `strlen` and `strcpy`.',
      };
      this.rec('compile', inc.line,
        `**Before the program runs**, the preprocessor copies the \`${inc.name}\` library into your file. ${what[inc.name] ?? ''}`.trim(), { calcs: [] });
    }
    if (this.prog.usingLine) {
      this.rec('compile', this.prog.usingLine, '`using namespace std;` lets you write `cout` instead of the full name `std::cout`.');
    }
    this.rec('compile', mainLine, 'Every C++ program starts running at `main()`. The `{` opens its body and the matching `}` closes it.');
  }

  // ------------------------------------------------------------ statements
  execStmts(list: Stmt[]): Signal {
    for (const s of list) {
      const sig = this.exec(s);
      if (sig !== 'normal') return sig;
    }
    return 'normal';
  }

  execBlock(b: BlockStmt, label?: string): Signal {
    this.pushScope(label);
    try {
      return this.execStmts(b.body);
    } finally {
      this.popScope();
    }
  }

  execScoped(s: Stmt, label: string): Signal {
    if (s.s === 'block') return this.execBlock(s, label);
    this.pushScope(label);
    try {
      return this.exec(s);
    } finally {
      this.popScope();
    }
  }

  exec(s: Stmt): Signal {
    switch (s.s) {
      case 'block':
        return this.execBlock(s, `block (line ${s.line})`);
      case 'decl':
        this.execDecl(s);
        return 'normal';
      case 'expr':
        this.execExprStmt(s.e, s.line);
        return 'normal';
      case 'if':
        return this.execIf(s, false);
      case 'while':
        return this.execWhile(s);
      case 'do':
        return this.execDo(s);
      case 'for':
        return this.execFor(s);
      case 'rfor':
        return this.execRangeFor(s);
      case 'switch':
        return this.execSwitch(s);
      case 'case':
        return 'normal';
      case 'break':
        this.rec('jump', s.line, this.breakTargets[this.breakTargets.length - 1] === 'switch'
          ? '`break` → leave the `switch` right now.'
          : '`break` → exit the loop immediately.');
        return 'break';
      case 'continue':
        this.rec('jump', s.line, '`continue` → skip the rest of this round and go straight to the next loop check.');
        return 'continue';
      case 'return':
        return this.execReturn(s);
      case 'delete':
        this.execDelete(s);
        return 'normal';
      case 'empty':
        return 'normal';
    }
  }

  execReturn(s: Extract<Stmt, { s: 'return' }>): Signal {
    const f = this.frame;
    if (f.fn === 'main') {
      const c = s.e ? this.calc(s.e) : null;
      const code = c ? Number(V.toBig(V.convert(c.value, 'int'))) : 0;
      this.exitCode = code;
      const text = code === 0
        ? `\`return 0;\` ends \`main()\`. The 0 tells the operating system the program finished **successfully**.`
        : `\`return ${code};\` ends \`main()\` with exit code **${code}** (a non-zero code usually means something went wrong).`;
      this.rec('return', s.line, text, { calcs: this.calcs(c) });
      return 'return';
    }
    const def = f.def!;
    const back = f.callLine ? ` and go back to line ${f.callLine}` : '';
    if (!s.e) {
      this.retVal = null;
      f.ret = 'void';
      this.rec('return', s.line, `\`return;\` leaves \`${f.fn}()\` right now${back}.`);
      return 'return';
    }
    const retTy = declTy(baseTy(def.ret), def.retPtr, []);
    if (def.retRef) {
      const r = this.locate(s.e);
      this.retLoc = r.loc;
      this.retVal = this.read(r.loc, s.line);
      f.ret = `→ ${r.loc.label}`;
      this.rec('return', s.line, `Return a **reference** to \`${r.loc.label}\` (not a copy)${back}.`, { calcs: this.calcs({ lines: r.lines }) });
      return 'return';
    }
    const c = this.calc(s.e);
    const v = this.conv(c.value, retTy);
    this.retVal = v;
    this.retLoc = null;
    const shown = this.showVal(v);
    f.ret = shown;
    const ue = unparen(s.e);
    let text = ue.k === 'lit'
      ? `Return **${shown}**${back}.`
      : ue.k === 'id'
        ? `Return the value of \`${ue.name}\`, which is **${shown}**${back}.`
        : `Work out \`${this.src(s.e)}\` → **${shown}** and return it${back}.`;
    text += ` The frame of \`${f.fn}\` (its variables) is removed.`;
    const conv = this.convNote(c.value, v);
    if (conv) text += ' ' + conv;
    this.rec('return', s.line, text, { calcs: this.calcs(c), hl: { start: s.e.span.start, end: s.e.span.end } });
    return 'return';
  }

  /** value as shown in explanations (pointers also say what they point to) */
  showVal(v: RV): string {
    if (v.t === 'ptr') {
      const a = v.v as number;
      if (a === 0) return 'nullptr';
      const o = this.objAt(a);
      return o ? `${hex(a)} (address of ${this.labelAt(a, v.pt)})` : hex(a);
    }
    if (v.t === 'st') return this.structText(v);
    return V.displayRV(v);
  }

  structText(v: RV): string {
    const sv = v.v as StructVal;
    return '{' + sv.cells.map((c) => (c ? this.showVal(c) : '?')).join(', ') + '}';
  }

  calcs(c: { lines: CalcLine[] } | null, label?: string): Calc[] {
    if (!c || c.lines.length < 2) return [];
    // a lone variable (e.g. `n` → 7) is already explained in the text
    if (c.lines.length === 2 && /^[A-Za-z_]\w*$/.test(c.lines[0].text) && !c.lines[1].note && !c.lines[0].note) return [];
    return [{ label, lines: c.lines }];
  }

  // ------------------------------------------------------------ declarations
  dimValue(d: Expr, calcs: Calc[], name: string): number {
    const c = this.calc(d);
    calcs.push(...this.calcs(c, `size of ${name}`));
    const n = Number(V.toBig(c.value));
    if (n <= 0) throw new RuntimeErr(`the size of array ${name} is ${n}. An array needs at least 1 element.`, d.span.line, "terminate called after throwing an instance of 'std::bad_array_new_length'");
    return n;
  }

  /** value-initialise (zero) or default-initialise a whole object */
  initObject(loc: Loc, zero: boolean) {
    const ty = loc.ty;
    if (isArr(ty)) {
      const es = this.L.size(ty.of);
      for (let i = 0; i < (ty.n ?? 0); i++) this.initObject({ addr: loc.addr + i * es, ty: ty.of, label: `${loc.label}[${i}]` }, zero);
      return;
    }
    if (isStructT(ty)) {
      const def = this.prog.structs.find((d) => d.name === ty.name);
      for (const f of this.L.struct(ty.name).fields) {
        const fl: Loc = { addr: loc.addr + f.off, ty: f.ty, label: `${loc.label}.${f.name}` };
        const init = def?.fields.find((x) => x.name === f.name)?.init;
        if (init && unparen(init).k !== 'list') this.store(fl, this.calc(init).value);
        else if (init) this.fillList(fl, init, []);
        else this.initObject(fl, zero);
      }
      return;
    }
    const c = this.cells.get(loc.addr);
    if (!c) return;
    if (zero) c.value = this.zeroOf(ty);
    else if (ty === 'string') c.value = V.mkStr('');
  }

  /** fill an array / struct from a { ... } list (or a "text" for char arrays) */
  fillList(loc: Loc, init: Expr, calcs: Calc[]) {
    const ty = loc.ty;
    const e = unparen(init);
    if (isArr(ty) && e.k === 'lit' && e.v.t === 'cstr') {
      const s = e.v.v as string;
      for (let i = 0; i < (ty.n ?? 0); i++) {
        const code = i < s.length ? s.charCodeAt(i) & 0xff : 0;
        this.writeCell(loc.addr + i, 'char', { t: 'char', v: BigInt(code) }, init.span.line);
      }
      return;
    }
    if (e.k !== 'list') {
      const c = this.calc(e);
      calcs.push(...this.calcs(c, loc.label));
      this.store(loc, c.value, init.span.line);
      return;
    }
    this.initObject(loc, true);
    if (isArr(ty)) {
      const es = this.L.size(ty.of);
      const aggElem = isArr(ty.of) || isStructT(ty.of);
      if (aggElem && e.items.length && e.items.every((it) => unparen(it).k !== 'list') && !(isArr(ty.of) && isCharT((ty.of as { of: Ty }).of))) {
        // brace elision: int m[2][2] = {1, 2, 3, 4}
        const leaves = this.L.leaves(ty);
        e.items.forEach((it, k) => {
          const lf = leaves[k];
          if (!lf) return;
          const c = this.calc(it);
          calcs.push(...this.calcs(c, loc.label + lf.path));
          this.store({ addr: loc.addr + lf.off, ty: lf.ty, label: loc.label + lf.path }, c.value, it.span.line);
        });
        return;
      }
      e.items.forEach((it, i) => {
        if (i >= (ty.n ?? 0)) return;
        this.fillList({ addr: loc.addr + i * es, ty: ty.of, label: `${loc.label}[${i}]` }, it, calcs);
      });
      return;
    }
    if (isStructT(ty)) {
      const fields = this.L.struct(ty.name).fields;
      e.items.forEach((it, k) => {
        const f = fields[k];
        if (!f) return;
        this.fillList({ addr: loc.addr + f.off, ty: f.ty, label: `${loc.label}.${f.name}` }, it, calcs);
      });
      return;
    }
    if (e.items.length) this.fillList(loc, e.items[0], calcs);
  }

  execDecl(s: DeclStmt, isGlobal = false) {
    const parts: string[] = [];
    const calcs: Calc[] = [];
    const scope = isGlobal ? this.globals : undefined;
    const region = isGlobal ? 'global' : 'stack';
    for (const it of s.items) {
      const cst = s.ty.isConst && it.ptr === 0 ? 'the constant ' : '';
      // ---- references
      if (it.ref) {
        const r = this.locate(it.init!);
        calcs.push(...this.calcs({ lines: r.lines }, it.name));
        this.declareRef(it.name, r.loc, s.ty.isConst);
        parts.push(`**\`${it.name}\`** is a **reference**: another name for **\`${r.loc.label}\`**. No new box is made — \`${it.name}\` and \`${r.loc.label}\` are the SAME box, so changing one changes the other.`);
        continue;
      }
      // ---- the type
      let base: Ty = baseTy(s.ty);
      let preValue: { value: RV; lines: CalcLine[] } | null = null;
      if (s.ty.base === 'auto' && it.init) {
        preValue = this.calc(it.init);
        const v = preValue.value;
        base = v.t === 'cstr' ? ptrTo('char', true) : v.t === 'ptr' ? ptrTo(v.pt ?? 'int') : v.t === 'st' ? { k: 'st', name: v.sname! } : (v.t as Ty);
      }
      const dims: (number | null)[] = it.dims.map((d) => (d ? this.dimValue(d, calcs, it.name) : null));
      if (dims.length && dims[0] === null) {
        const init = it.init ? unparen(it.init) : null;
        dims[0] = init && init.k === 'list' ? init.items.length : init && init.k === 'lit' && init.v.t === 'cstr' ? (init.v.v as string).length + 1 : 1;
      }
      const ty = declTy(base, it.ptr, dims as number[], s.ty.isConst && it.ptr > 0);
      const tname = (s.ty.isConst && it.ptr === 0 ? 'const ' : '') + (s.ty.base === 'auto' ? `auto → ${tyLabel(ty)}` : tyLabel(ty));
      const bytes = this.L.size(ty);
      let sentence: string;
      // ---- arrays
      if (isArr(ty)) {
        const v = this.declare(it.name, ty, s.ty.isConst, scope, region);
        const loc = this.varLoc(v);
        const n = ty.n ?? 0;
        const is2D = isArr(ty.of);
        const what = is2D
          ? `a 2D array **\`${it.name}\`** with ${n} rows and ${(ty.of as { n: number }).n} columns (${n * ((ty.of as { n: number }).n ?? 0)} \`${tyLabel((ty.of as { of: Ty }).of)}\` boxes, ${bytes} bytes)`
          : `array **\`${it.name}\`** with ${n} \`${tyLabel(ty.of)}\` boxes (numbered 0 to ${n - 1}, ${bytes} bytes)`;
        if (it.init) {
          const init = unparen(it.init);
          this.fillList(loc, it.init, calcs);
          if (init.k === 'lit' && init.v.t === 'cstr') {
            sentence = `Create char ${what} and copy ${V.quoteStr(init.v.v as string)} into it, plus a hidden \`'\\0'\` that marks where the text ends.`;
          } else {
            const given = init.k === 'list' ? init.items.length : 0;
            sentence = `Create ${what} and fill it: ${this.memVal(loc.addr, ty).display}.`;
            if (init.k === 'list' && !is2D && given < n) sentence += given === 0 ? ' Empty braces { } set every box to 0.' : ` Boxes without a value in the list get **0**.`;
          }
        } else if (isGlobal) {
          this.initObject(loc, true);
          sentence = `Create ${what}. Global arrays always start filled with 0.`;
        } else {
          this.initObject(loc, false);
          sentence = `Create ${what}. They are not filled yet, so they hold **garbage** (shown as ?) until you store values.`;
        }
        parts.push(sentence);
        continue;
      }
      // ---- structs
      if (isStructT(ty)) {
        const v = this.declare(it.name, ty, s.ty.isConst, scope, region);
        const loc = this.varLoc(v);
        const fields = this.L.struct(ty.name).fields.map((f) => f.name).join(', ');
        if (it.init) {
          const init = unparen(it.init);
          if (init.k === 'list') this.fillList(loc, it.init, calcs);
          else {
            const c = preValue ?? this.calc(it.init);
            calcs.push(...this.calcs(c, it.name));
            this.store(loc, c.value, s.line);
          }
          sentence = `Create **\`${it.name}\`**, a \`${ty.name}\` (fields: ${fields}), and fill it: ${this.memVal(loc.addr, ty).display}.`;
          if (init.k !== 'list') sentence += ` (Every field is **copied**.)`;
        } else {
          this.initObject(loc, isGlobal);
          sentence = `Create **\`${it.name}\`**, a \`${ty.name}\` with the fields ${fields}. ${isGlobal ? 'Global structs start with every field 0.' : 'Fields without a starting value hold garbage (?).'}`;
        }
        parts.push(sentence);
        continue;
      }
      // ---- single values and pointers (the starting value is worked out first)
      const pre = it.init ? preValue ?? this.calc(it.init) : null;
      const v = this.declare(it.name, ty, s.ty.isConst, scope, region);
      const loc = this.varLoc(v);
      if (it.init) {
        const c = pre!;
        const value = this.conv(c.value, ty);
        this.store(loc, value, s.line);
        calcs.push(...this.calcs(c, it.name));
        const shown = V.displayRV(this.read(loc));
        const init = unparen(it.init);
        const isSimple = init.k === 'lit' || (init.k === 'un' && init.op === '-' && unparen(init.e).k === 'lit');
        if (isPtr(ty)) {
          sentence = `Create pointer **\`${it.name}\`** (\`${tname}\`, 8 bytes) and store ${this.ptrStory(value, it.init)}.`;
        } else {
          sentence = isSimple
            ? `Create ${cst}**\`${it.name}\`** (\`${tname}\`, ${plural(bytes, 'byte')}) and store **${shown}** in it.`
            : `Create ${cst}**\`${it.name}\`** (\`${tname}\`) and store the value of \`${this.src(it.init)}\`, which is **${shown}**.`;
          const conv = this.convNote(c.value, this.read(loc));
          if (conv) sentence += ' ' + conv;
        }
      } else if (it.style === '{}' || isGlobal || ty === 'string') {
        this.initObject(loc, true);
        const shown = V.displayRV(this.read(loc));
        sentence = ty === 'string'
          ? `Create **\`${it.name}\`** (\`string\`). A new string starts empty: "".`
          : isPtr(ty)
            ? `Create pointer **\`${it.name}\`** (\`${tname}\`) set to **nullptr** — it points to nothing yet.`
            : `Create **\`${it.name}\`** (\`${tname}\`) with the starting value **${shown}**${isGlobal ? ' (global variables always start at 0)' : ''}.`;
      } else if (isPtr(ty)) {
        sentence = `Create pointer **\`${it.name}\`** (\`${tname}\`, 8 bytes). It has no address yet, so it holds a **garbage address** — using \`*${it.name}\` now would crash. Give it an address (or nullptr) first.`;
      } else {
        sentence = `Create **\`${it.name}\`** (\`${tname}\`, ${plural(bytes, 'byte')}). It has no starting value, so it holds **garbage** (shown as ?).`;
      }
      parts.push(sentence);
    }
    this.rec('decl', s.line, parts.join('\n'), { calcs, hl: { start: s.span.start, end: s.span.end } });
  }

  /** "the address of x (0x61fe14) → p points to x" */
  ptrStory(value: RV, init?: Expr): string {
    const a = value.v as number;
    if (a === 0) return '**nullptr** (address 0) → it points to **nothing**';
    const o = this.objAt(a);
    const label = this.labelAt(a, value.pt);
    const e = init ? unparen(init) : null;
    if (e && e.k === 'new') return `the address of a new box on the **heap** (${hex(a)}) → it points to \`${label}\``;
    if (o?.region === 'rodata') return `the address of the text ${o.name} (${hex(a)})`;
    if (e && e.k === 'id' && isArr(this.lookup(e.name)?.ty ?? 'int')) return `the address of the first element of \`${e.name}\` (${hex(a)}) → it points to **\`${label}\`**`;
    return `the address of \`${label}\` (${hex(a)}) → it now **points to \`${label}\`**`;
  }

  convNote(from: RV, to: RV): string | undefined {
    if (from.t === to.t) return undefined;
    if (to.t === 'ptr' || from.t === 'ptr' || to.t === 'st') return undefined;
    if (V.isFloating(from.t) && V.isIntegral(to.t) && to.t !== 'bool' && !V.isCharType(to.t)) {
      const x = from.v as number;
      if (x !== Math.trunc(x)) return `An \`${to.t}\` cannot hold decimals, so ${V.displayRV(from)} is **cut down** to ${V.displayRV(to)}.`;
    }
    if (V.isIntegral(from.t) && V.isFloating(to.t) && !V.isCharType(from.t) && from.t !== 'bool') return `(${V.displayRV(from)} is stored as the decimal ${V.displayRV(to)}.)`;
    if (V.isCharType(to.t) && !V.isCharType(from.t) && V.isIntegral(from.t)) {
      if (V.toBig(from) !== V.toBig(to)) return `**Overflow!** A \`${to.t}\` only holds ${to.t === 'unsigned char' ? '0 to 255' : '-128 to 127'}, so ${V.displayRV(from)} wraps around to ${V.toBig(to)}, which is the character ${V.displayRV(to)}.`;
      return `(The number ${V.displayRV(from)} is the ASCII code of ${V.displayRV(to)}.)`;
    }
    if (to.t === 'bool' && from.t !== 'bool') return `(Any non-zero value becomes \`true\`; 0 becomes \`false\`.)`;
    if (V.isIntegral(from.t) && V.isIntegral(to.t) && V.toBig(from) !== V.toBig(to) && !V.isCharType(from.t)) {
      return `**Overflow!** ${V.displayRV(from)} does not fit in a \`${to.t}\`, so it wraps around to ${V.displayRV(to)}.`;
    }
    return undefined;
  }

  // ------------------------------------------------------------ delete
  execDelete(s: Extract<Stmt, { s: 'delete' }>) {
    const c = this.calc(s.e);
    const p = c.value;
    const a = p.v as number;
    const what = this.src(s.e);
    if (p.garbage) throw new RuntimeErr(`\`${what}\` holds a garbage address (it was never given memory from new), so delete crashes.`, s.line, 'free(): invalid pointer');
    if (a === 0) {
      this.rec('delete', s.line, `\`${what}\` is nullptr, so \`delete\` does nothing (this is safe).`);
      return;
    }
    const o = this.objAt(a);
    if (!o || o.addr !== a || o.region !== 'heap') {
      throw new RuntimeErr(`\`${what}\` does not point to the start of memory made with \`new\`. Only addresses returned by new can be deleted.`, s.line, 'free(): invalid pointer');
    }
    if (!o.alive) throw new RuntimeErr(`this memory was ALREADY deleted. Deleting it twice (double free) crashes the program.`, s.line, 'free(): double free detected in tcache 2');
    o.alive = false;
    this.changed.add(o.key);
    let text = `\`delete${s.arr ? '[]' : ''} ${what}\` gives the heap memory \`${o.name}\` (${tyLabel(o.ty)}) back to the system.`;
    if (o.isArrNew && !s.arr) text += ' ⚠ It was made with `new[]`, so it must be freed with `delete[]` (with brackets).';
    if (!o.isArrNew && s.arr) text += ' ⚠ It was made with plain `new`, so use `delete` without brackets.';
    const ue = unparen(s.e);
    if (ue.k === 'id') text += ` \`${what}\` still holds the old address ${hex(a)} — it is now a **dangling pointer**. Tip: set \`${what} = nullptr;\` next.`;
    this.rec('delete', s.line, text, { calcs: this.calcs(c) });
  }

  // ------------------------------------------------------------ expression statements
  /** extra sentence explaining WHICH box an lvalue like *p, p->x or p[i] is */
  lvNote(e0: Expr, loc: Loc): string | undefined {
    const e = unparen(e0);
    if (e.k === 'un' && e.op === '*') return `\`${this.src(e)}\` means *the box that \`${this.src(e.e)}\` points to* — that is **\`${loc.label}\`**.`;
    if (e.k === 'mem' && e.arrow) return `\`${this.src(e)}\` is the field \`${e.name}\` of the struct that \`${this.src(e.obj)}\` points to: **\`${loc.label}\`**.`;
    if (e.k === 'idx') {
      const o = unparen(e.obj);
      if (o.k === 'id') {
        const v = this.lookup(o.name);
        if (v && isPtr(v.ty) && !loc.str) {
          return this.src(e.i) === '0'
            ? `\`${this.src(e)}\` is the box that \`${o.name}\` points to: **\`${loc.label}\`**.`
            : `\`${this.src(e)}\`: start where \`${o.name}\` points and move ${this.src(e.i)} box(es) forward → **\`${loc.label}\`**.`;
        }
      }
    }
    if (e.k === 'id') {
      const v = this.lookup(e.name);
      if (v?.isRef) return `\`${e.name}\` is a reference (another name) for **\`${loc.label}\`**, so this changes \`${loc.label}\` itself.`;
    }
    return undefined;
  }

  execExprStmt(e0: Expr, line: number) {
    const e = unparen(e0);
    const base = chainBase(e);
    if (e.k === 'bin' && e.op === '<<' && (base === 'cout' || base === 'cerr') && !this.lookup(base)) return this.execCout(e, base === 'cerr');
    if (e.k === 'bin' && e.op === '>>' && base === 'cin' && !this.lookup('cin')) return this.execCin(e);
    if (e.k === 'call' && e.name === 'getline' && e.fn === undefined) return this.execGetline(e, line);
    if (e.k === 'mcall' && unparen(e.obj).k === 'id' && (unparen(e.obj) as { name: string }).name === 'cin') {
      if (e.name === 'ignore') {
        const s = this.input;
        const before = this.inPos;
        if (this.inPos < s.length) {
          const nl = s.indexOf('\n', this.inPos);
          this.inPos = nl === -1 ? s.length : nl + 1;
        }
        const skipped = s.slice(before, this.inPos);
        this.rec('in', line, skipped === '\n'
          ? '`cin.ignore()` throws away the leftover Enter key, so the next `getline` reads a fresh line.'
          : `\`cin.ignore()\` skips ${V.quoteStr(skipped)} in the input.`);
        return;
      }
      if (e.name === 'getline') return this.execCinGetline(e, line);
    }
    const hl = { start: e0.span.start, end: e0.span.end };
    if (e.k === 'asg') {
      const r = this.locate(e.l);
      const loc = r.loc;
      const calcs: Calc[] = [...this.calcs({ lines: r.lines }, 'which box?')];
      const note = this.lvNote(e.l, loc);
      const oldCell = !isArr(loc.ty) && !isStructT(loc.ty) && !loc.str && !loc.oob ? this.cells.get(loc.addr)?.value ?? null : null;
      const before = oldCell ? this.showVal(oldCell) : null;
      let text: string;
      if (e.op === '=') {
        if (unparen(e.r).k === 'list') {
          this.fillList(loc, e.r, calcs);
          text = `Store ${this.memVal(loc.addr, loc.ty).display} in **\`${loc.label}\`** (every field is replaced).`;
        } else {
          const c = this.calc(e.r);
          calcs.push(...this.calcs(c));
          this.store(loc, c.value, line);
          const stored = this.read(loc, line);
          const now = this.showVal(stored);
          const simple = unparen(e.r).k === 'lit';
          if (isPtr(loc.ty)) {
            text = `Store ${this.ptrStory(stored, e.r)} in **\`${loc.label}\`**.`;
          } else if (isStructT(loc.ty)) {
            text = `Copy every field of \`${this.src(e.r)}\` into **\`${loc.label}\`** → ${now}.`;
          } else if (loc.str) {
            text = `Store **${V.displayRV(V.convert(c.value, 'char'))}** at position ${loc.str.i} of **\`${loc.str.loc.label}\`** → now ${V.displayRV(this.read(loc.str.loc))}.`;
          } else {
            text = simple
              ? `Store **${now}** in **\`${loc.label}\`**`
              : `Work out the right side \`${this.src(e.r)}\` → **${this.showVal(c.value)}**, then store it in **\`${loc.label}\`**`;
            text += before === null ? '.' : before === now ? ` (it already was ${before}).` : ` (the old value ${before} is replaced).`;
            const conv = this.convNote(c.value, stored);
            if (conv) text += ' ' + conv;
          }
        }
      } else {
        const bop = e.op.slice(0, -1);
        const tree: D = { k: 'bin', op: bop, l: { k: 'loc', loc, span: e.l.span }, r: clone(e.r), opSpan: e.opSpan, span: e.span, id: -1 };
        const rr0 = unparen(e.r);
        const c = this.calcTree(tree, `${this.src(e.l)} ${bop} ${rr0.k === 'bin' || rr0.k === 'cond' || rr0.k === 'asg' ? `(${this.src(e.r)})` : this.src(e.r)}`);
        this.store(loc, c.value, line);
        calcs.push(...this.calcs(c));
        const shown = this.showVal(this.read(loc, line));
        const rr = unparen(e.r);
        const rhs = rr.k === 'bin' || rr.k === 'cond' || rr.k === 'asg' ? `(${this.src(e.r)})` : this.src(e.r);
        text = `\`${this.src(e)}\` is short for \`${this.src(e.l)} = ${this.src(e.l)} ${bop} ${rhs}\` → **\`${loc.label}\`** becomes **${shown}**.`;
        if (rr.k === 'bin' || rr.k === 'asg') text += ' (The whole right side is worked out FIRST.)';
        if (isPtr(loc.ty)) text += ` (A pointer moves in steps of whole ${tyLabel(loc.ty.to)}s.)`;
      }
      if (note) text = note + ' ' + text;
      this.rec('assign', line, text, { calcs, hl });
      return;
    }
    if (e.k === 'un' && (e.op === '++' || e.op === '--')) {
      const r = this.locate(e.e);
      const loc = r.loc;
      const before = this.showVal(this.read(loc, line));
      const old = this.read(loc, line);
      const res = this.arith(e.op === '++' ? '+' : '-', old, { t: 'int', v: B1 }, line);
      this.store(loc, res.v, line);
      const now = this.read(loc, line);
      const note = this.lvNote(e.e, loc);
      let text: string;
      if (isPtr(loc.ty)) {
        const a = now.v as number;
        text = `\`${this.src(e)}\` moves pointer **\`${loc.label}\`** ${e.op === '++' ? 'forward' : 'back'} by one ${tyLabel(loc.ty.to)} (${this.L.size(loc.ty.to)} bytes): ${before.split(' ')[0]} → ${hex(a)}` +
          (this.objAt(a)?.alive && this.cells.has(a) ? ` → now it points to **\`${this.labelAt(a, loc.ty.to)}\`**.` : ' → it now points PAST the end of the data (do not read it!).');
      } else {
        text = `\`${this.src(e)}\` ${e.op === '++' ? 'adds 1 to' : 'subtracts 1 from'} **\`${loc.label}\`**: ${before} → **${this.showVal(now)}**.`;
      }
      if (note) text = note + ' ' + text;
      this.rec('assign', line, text, { calcs: this.calcs({ lines: r.lines }, 'which box?'), hl });
      return;
    }
    const c = this.calc(e);
    if (e.k === 'call' && e.fn !== undefined) {
      if (c.value.t === 'void') return;
      this.rec('expr', line, `\`${e.name}()\` gave back **${this.showVal(c.value)}**, but the value is not stored anywhere, so it is lost.`, { calcs: this.calcs(c) });
      return;
    }
    let text = `Work out \`${this.src(e)}\` → **${this.showVal(c.value)}**. The result is not stored anywhere, so this line changes nothing.`;
    if (e.k === 'call' && e.name === 'swap') text = `\`swap\` exchanges the values of the two variables.`;
    else if (e.k === 'call' && (e.name === 'strcpy' || e.name === 'strncpy')) text = `\`${e.name}\` copies the text (and its \`'\\0'\`) into \`${this.src(e.args[0])}\`.`;
    else if (e.k === 'call' && (e.name === 'strcat' || e.name === 'strncat')) text = `\`${e.name}\` adds the text to the end of \`${this.src(e.args[0])}\`.`;
    else if (e.k === 'call' && (e.name === 'sort' || e.name === 'reverse')) text = e.name === 'sort' ? '`sort` arranges the elements in increasing order.' : '`reverse` turns the elements around.';
    else if (e.k === 'mcall') text = `Call \`.${e.name}()\` on **\`${this.src(e.obj)}\`**.`;
    this.rec('expr', line, text, { calcs: this.calcs(c) });
  }

  // ------------------------------------------------------------ cout
  coutRaw(val: RV): string {
    if (val.t === 'ptr') {
      const a = val.v as number;
      if (val.pt && isCharT(val.pt)) return this.cstrFrom(a);
      return a === 0 ? '0' : hex(a);
    }
    return V.coutText(val, this.out);
  }

  execCout(e: Expr, isErr: boolean) {
    const { items } = flattenChain(e, '<<');
    const g = ++this.group;
    this.curGroup = g;
    const first = this.steps.length;
    try {
      for (const it of items) {
        const ex = unparen(it.e);
        const hl = { start: it.opSpan.start, end: it.e.span.end };
        const line = it.e.span.line;
        if (ex.k === 'id' && MANIP_NAMES.has(ex.name) && !this.lookup(ex.name)) {
          const text = this.applyManip(ex.name);
          this.rec('out', line, text, { hl });
          continue;
        }
        if (ex.k === 'call' && MANIP_CALLS.has(ex.name) && ex.fn === undefined) {
          const arg = this.calc(ex.args[0]).value;
          const text = this.applyManip(ex.name, arg);
          this.rec('out', line, text, { hl });
          continue;
        }
        const c = this.calc(it.e);
        this.curGroup = g;
        const val = c.value;
        const hadWidth = this.out.width;
        const raw = this.coutRaw(val);
        const printed = V.applyWidth(raw, this.out);
        this.out.width = 0;
        this.write(printed, isErr ? 'err' : 'out');
        const text = this.describeOut(ex, val, printed, raw, hadWidth);
        this.rec('out', line, text, { hl, calcs: this.calcs(c) });
      }
    } finally {
      this.curGroup = null;
    }
    for (let k = first; k < this.steps.length - 1; k++) if (this.steps[k].group === g) this.steps[k].sub = true;
  }

  describeOut(ex: Expr, val: RV, printed: string, raw: string, width: number): string {
    const shown = V.quoteStr(printed);
    let t: string;
    if (val.t === 'ptr') {
      const isChar = val.pt && isCharT(val.pt);
      const v = ex.k === 'id' ? this.lookup(ex.name) : undefined;
      if (isChar) t = `\`${this.src(ex)}\` is text in a char array, so cout prints the characters until the hidden \`'\\0'\`: ${V.quoteStr(raw)}.`;
      else if (v && isArr(v.ty)) t = `\`${ex.k === 'id' ? ex.name : ''}\` is a whole array — cout prints its **address** (${raw}), not the numbers inside! To print the elements, use a loop: \`cout << ${ex.k === 'id' ? ex.name : 'arr'}[i]\`.`;
      else t = `Print the **address** stored in \`${this.src(ex)}\`: ${raw}. (cout shows a pointer as a hex address. Use \`*${this.src(ex)}\` to print the value it points to.)`;
      return t;
    }
    if (ex.k === 'lit' && ex.v.t === 'cstr') {
      const s = ex.v.v as string;
      if (s === '\n') t = 'Print `"\\n"` → the cursor moves to the start of the next line.';
      else {
        t = `Print the text ${shown}.`;
        const extras: string[] = [];
        if (s.includes('\n')) extras.push('each `\\n` inside moves the cursor to a new line');
        if (s.includes('\t')) extras.push('`\\t` jumps to the next tab stop');
        if (s.includes('\\')) extras.push('`\\\\` prints a single backslash');
        if (s.includes('"')) extras.push('`\\"` prints a double quote');
        if (extras.length) t += ' Here ' + extras.join(', ') + '.';
      }
    } else if (ex.k === 'lit' && V.isCharType(ex.v.t)) {
      t = raw === '\n' ? "Print `'\\n'` → the cursor moves to the next line." : `Print the single character ${V.displayRV(val)}.`;
    } else if (ex.k === 'lit') {
      t = `Print the number **${raw}**.`;
    } else if (ex.k === 'id') {
      const v = this.lookup(ex.name);
      const via = v?.isRef ? ` (a reference to \`${this.labelAt(v.addr, v.ty)}\`)` : '';
      t = `Print the value stored in **\`${ex.name}\`**${via}: ${val.t === 'string' ? shown : `**${raw}**`}.`;
    } else if (ex.k === 'call' && ex.fn !== undefined) {
      t = `\`${ex.name}(...)\` gave back **${V.displayRV(val)}** — print it${V.isStringy(val.t) ? '' : `: **${raw}**`}.`;
    } else {
      t = `Work out \`${this.src(ex)}\` → **${V.displayRV(val)}** and print it${V.isStringy(val.t) ? '' : `: **${raw}**`}.`;
    }
    if (val.t === 'bool' && !this.out.boolalpha) t += ` (cout prints \`${val.v ? 'true' : 'false'}\` as **${raw}**.)`;
    if (V.isFloating(val.t) && this.out.floatfield === 'none' && V.displayRV(val) !== raw && !raw.includes('e')) {
      const d = V.displayRV(val);
      if (d.endsWith('.0')) t += ` (cout drops the \`.0\`, so ${d} appears as **${raw}**.)`;
      else if (d !== raw) t += ` (cout shows at most 6 significant digits.)`;
    }
    if (V.isFloating(val.t) && this.out.floatfield === 'fixed') t += ` (\`fixed\` + precision ${this.out.precision} → exactly ${plural(this.out.precision, 'digit')} after the point.)`;
    if (width > raw.length) t += ` \`setw(${width})\` pads it to ${width} characters.`;
    return t;
  }

  applyManip(name: string, arg?: RV): string {
    const o = this.out;
    switch (name) {
      case 'endl':
        this.write('\n');
        return '`endl` ends the line: the cursor moves to the start of the next line.';
      case 'flush':
        return '`flush` pushes any waiting output to the screen (nothing visible changes).';
      case 'fixed':
        o.floatfield = 'fixed';
        return `\`fixed\`: from now on decimals are printed with exactly ${o.precision} digits after the point.`;
      case 'scientific':
        o.floatfield = 'scientific';
        return '`scientific`: decimals are now printed in e-notation (like 1.5e+03).';
      case 'defaultfloat':
        o.floatfield = 'none';
        return '`defaultfloat`: back to the normal way of printing decimals.';
      case 'left':
        o.adjust = 'left';
        return '`left`: padded values will now line up on the left.';
      case 'right':
        o.adjust = 'right';
        return '`right`: padded values will now line up on the right.';
      case 'boolalpha':
        o.boolalpha = true;
        return '`boolalpha`: bools will now print as `true` / `false` instead of 1 / 0.';
      case 'noboolalpha':
        o.boolalpha = false;
        return '`noboolalpha`: bools print as 1 / 0 again.';
      case 'showpoint':
        o.showpoint = true;
        return '`showpoint`: decimals keep their trailing zeros.';
      case 'noshowpoint':
        o.showpoint = false;
        return '`noshowpoint`: trailing zeros are dropped again.';
      case 'showpos':
        o.showpos = true;
        return '`showpos`: positive numbers now get a + sign.';
      case 'noshowpos':
        o.showpos = false;
        return '`noshowpos`: no more + signs.';
      case 'setw': {
        o.width = Number(V.toBig(arg!));
        return `\`setw(${o.width})\`: the NEXT value printed will take at least ${o.width} characters (extra space is filled with '${o.fill}').`;
      }
      case 'setprecision': {
        o.precision = Number(V.toBig(arg!));
        return o.floatfield === 'fixed'
          ? `\`setprecision(${o.precision})\`: with \`fixed\`, decimals now show exactly ${plural(o.precision, 'digit')} after the point.`
          : `\`setprecision(${o.precision})\`: decimals now show at most ${plural(o.precision, 'significant digit')}.`;
      }
      case 'setfill': {
        o.fill = V.charOf(arg!);
        return `\`setfill('${o.fill}')\`: empty space made by setw will be filled with '${o.fill}'.`;
      }
    }
    return '';
  }

  // ------------------------------------------------------------ cin
  echoUpTo(p: number) {
    const s = this.input;
    let lineEnd = s.indexOf('\n', p);
    if (lineEnd === -1) lineEnd = s.length;
    if (this.echoedTo <= lineEnd && this.echoedTo < s.length) {
      const text = s.slice(this.echoedTo, lineEnd);
      this.write(text + '\n', 'in');
      this.echoedTo = lineEnd + 1;
    }
  }

  readInto(loc: Loc, line: number, hl?: { start: number; end: number }) {
    const name = loc.label;
    if (this.inFail) {
      this.rec('in', line, `\`cin\` is in a **failed state** (an earlier read went wrong), so this read is skipped and **\`${name}\`** keeps its value.`, { hl });
      return;
    }
    const s = this.input;
    let p = this.inPos;
    while (p < s.length && /\s/.test(s[p])) p++;
    if (p >= s.length) {
      this.needsInput = true;
      this.inPos = p;
      this.rec('wait', line, `The program is **waiting** for you to type a value for **\`${name}\`**, but there is no more input.\nAdd another value in the **Input** box and run again.`, { hl });
      throw new StopRun('input');
    }
    this.echoUpTo(p);
    const rest = s.slice(p);
    const t = loc.ty;
    let text: string;
    if (isArr(t) && isCharT(t.of)) {
      const word = /^\S+/.exec(rest)![0];
      const n = t.n ?? 0;
      if (word.length + 1 > n) {
        throw new RuntimeErr(`the word "${word}" needs ${word.length + 1} chars (with '\\0') but ${name} has room for only ${n}. cin writes past the end of the array (buffer overflow).`, line, '*** stack smashing detected ***: terminated');
      }
      for (let i = 0; i <= word.length; i++) this.writeCell(loc.addr + i, 'char', { t: 'char', v: BigInt(i < word.length ? word.charCodeAt(i) & 0xff : 0) }, line);
      this.inPos = p + word.length;
      this.rec('in', line, `Read the word ${V.quoteStr(word)} into the char array **\`${name}\`** (one letter per box, then \`'\\0'\` to mark the end).`, { hl });
      return;
    }
    if (V.isCharType(t as string)) {
      this.store(loc, { t: 'char', v: BigInt(s.charCodeAt(p) & 0xff) }, line);
      this.inPos = p + 1;
      text = `Read ONE character from the keyboard: ${V.displayRV(this.read(loc))} → store it in **\`${name}\`**.`;
      if (/^\S\S/.test(rest)) text += ` (The rest, "${/^\S+/.exec(rest)![0].slice(1)}", stays waiting in the input.)`;
    } else if (t === 'string') {
      const word = /^\S+/.exec(rest)![0];
      this.store(loc, { t: 'string', v: word }, line);
      this.inPos = p + word.length;
      text = `Read the word ${V.quoteStr(word)} from the keyboard → store it in **\`${name}\`**.`;
      if (/^[ \t]+\S/.test(s.slice(this.inPos).split('\n')[0] ?? '')) text += ' (`cin >>` stops at a space. Use `getline` to read a full line.)';
    } else if (V.isFloating(t as string)) {
      const m = /^[+-]?(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)/.exec(rest);
      if (!m) return this.failRead(loc, rest, 'number', line, hl);
      this.store(loc, { t: 'double', v: parseFloat(m[0]) }, line);
      this.inPos = p + m[0].length;
      text = `Read **${m[0]}** from the keyboard → store it in **\`${name}\`** (${V.displayRV(this.read(loc))}).`;
    } else {
      const tt = t as ValType;
      const m = /^[+-]?\d+/.exec(rest);
      if (!m) return this.failRead(loc, rest, 'whole number', line, hl);
      let big = BigInt(m[0]);
      const lim = V.intLimits(tt);
      if (tt === 'bool') {
        if (big !== B0 && big !== B1) {
          this.inPos = p + m[0].length;
          return this.failRead(loc, rest, '0 or 1', line, hl);
        }
        this.store(loc, { t: 'bool', v: big === B1 }, line);
      } else {
        if (lim && (big < lim[0] || big > lim[1])) {
          big = big < lim[0] ? lim[0] : lim[1];
          this.store(loc, { t: tt, v: big }, line);
          this.inFail = true;
          this.inPos = p + m[0].length;
          this.rec('in', line, `${m[0]} is too big for an \`${tt}\`. cin stores the limit ${big} in **\`${name}\`** and goes into a **failed state**.`, { hl });
          return;
        }
        this.store(loc, { t: tt, v: big }, line);
      }
      this.inPos = p + m[0].length;
      text = `Read **${m[0]}** from the keyboard → store it in **\`${name}\`**.`;
      if (/^\.\d/.test(s.slice(this.inPos))) text += ` An \`${tt}\` cannot hold decimals, so cin stopped at the dot — "${/^\.\d+/.exec(s.slice(this.inPos))![0]}" is left waiting in the input.`;
    }
    this.rec('in', line, text, { hl });
  }

  failRead(loc: Loc, rest: string, what: string, line: number, hl?: { start: number; end: number }) {
    const got = /^\S*/.exec(rest)![0];
    this.inFail = true;
    if (!V.isStringy(loc.ty as string)) this.store(loc, this.zeroOf(loc.ty), line);
    this.rec('in', line, `cin expected a ${what} but found "${got}". The read **fails**: **\`${loc.label}\`** becomes ${V.displayRV(this.read(loc))} and cin stops reading from now on.`, { hl });
  }

  execCin(e: Expr) {
    const { items } = flattenChain(e, '>>');
    const g = ++this.group;
    this.curGroup = g;
    const first = this.steps.length;
    try {
      for (const it of items) {
        const hl = { start: it.opSpan.start, end: it.e.span.end };
        const r = this.locate(it.e);
        this.curGroup = g;
        this.readInto(r.loc, it.e.span.line, hl);
      }
    } finally {
      this.curGroup = null;
    }
    for (let k = first; k < this.steps.length - 1; k++) if (this.steps[k].group === g) this.steps[k].sub = true;
  }

  /** read a whole line (without its \n); null if there is no input left */
  takeLine(): string | null {
    const s = this.input;
    if (this.inPos >= s.length) return null;
    this.echoUpTo(this.inPos);
    const nl = s.indexOf('\n', this.inPos);
    const text = nl === -1 ? s.slice(this.inPos) : s.slice(this.inPos, nl);
    this.inPos = nl === -1 ? s.length : nl + 1;
    return text;
  }

  execGetline(e: Extract<Expr, { k: 'call' }>, line: number) {
    const loc = this.locate(e.args[1]).loc;
    if (this.inFail) {
      this.rec('in', line, '`cin` is in a failed state, so getline reads nothing.');
      return;
    }
    const text = this.takeLine();
    if (text === null) {
      this.needsInput = true;
      this.rec('wait', line, `The program is **waiting** for you to type a line for **\`${loc.label}\`**, but there is no more input.`);
      throw new StopRun('input');
    }
    this.store(loc, { t: 'string', v: text }, line);
    this.rec('in', line, text === ''
      ? `\`getline\` read an **empty line**! The Enter key from the previous \`cin >>\` was still waiting in the input, so getline grabbed it. (Fix: add \`cin.ignore();\` before getline.)`
      : `\`getline\` reads the WHOLE line ${V.quoteStr(text)} (spaces included) → store it in **\`${loc.label}\`**.`);
  }

  execCinGetline(e: Extract<Expr, { k: 'mcall' }>, line: number) {
    const loc = this.locate(e.args[0]).loc;
    const n = Number(V.toBig(this.calc(e.args[1]).value));
    if (this.inFail) {
      this.rec('in', line, '`cin` is in a failed state, so getline reads nothing.');
      return;
    }
    let base = loc.addr;
    let label = loc.label;
    if (isPtr(loc.ty)) {
      base = this.read(loc, line).v as number;
      label = this.labelAt(base);
    }
    const text = this.takeLine();
    if (text === null) {
      this.needsInput = true;
      this.rec('wait', line, `The program is **waiting** for you to type a line for **\`${label}\`**, but there is no more input.`);
      throw new StopRun('input');
    }
    const kept = text.slice(0, Math.max(0, n - 1));
    for (let i = 0; i <= kept.length; i++) this.writeCell(base + i, 'char', { t: 'char', v: BigInt(i < kept.length ? kept.charCodeAt(i) & 0xff : 0) }, line);
    let msg = `\`cin.getline\` reads the line ${V.quoteStr(text)} into the char array **\`${label}\`** (at most ${n - 1} chars + \`'\\0'\`).`;
    if (kept.length < text.length) {
      this.inFail = true;
      msg += ` The line was too long, so only ${V.quoteStr(kept)} fits and cin goes into a **failed state**.`;
    }
    this.rec('in', line, msg);
  }

  // ------------------------------------------------------------ control flow
  condInfo(c: Expr): { r: boolean; calcs: Calc[]; shown: string } {
    const res = this.calc(c);
    const r = res.value.t === 'ptr' ? (res.value.v as number) !== 0 : V.truthy(res.value);
    let shown = `**${r}**`;
    if (res.value.t === 'ostream') shown = '`cout` printed its value and is still working, and a working stream counts as **true** (the printing itself happens as a side effect!)';
    else if (res.value.t === 'istream') shown = r ? '`cin` read a value successfully → **true**' : '`cin` could not read (no more input, or wrong kind of input) → **false**';
    else if (res.value.t === 'ptr') shown = `${this.showVal(res.value)} → **${r}** (${r ? 'a non-null pointer counts as true' : 'nullptr counts as false'})`;
    else if (res.value.t !== 'bool') shown = `${V.displayRV(res.value)} → **${r}** (${r ? 'any non-zero value counts as true' : '0 counts as false'})`;
    return { r, calcs: this.calcs(res), shown };
  }

  execIf(s: IfStmt, isElseIf: boolean): Signal {
    const { r, calcs, shown } = this.condInfo(s.c);
    const cond = `\`${this.src(s.c)}\``;
    let text = isElseIf
      ? `The condition above was false, so now check the \`else if\`: ${cond} → ${shown}.`
      : `Check the condition ${cond} → ${shown}.`;
    if (r) text += ' So the code inside this block **runs**.';
    else if (s.els) text += s.els.s === 'if' ? ' So skip this block and move to the `else if` below.' : ' So skip this block and **jump to `else`**.';
    else text += ' There is no `else`, so the whole block is **skipped**.';
    this.rec('cond', s.line, text, { calcs, hl: { start: s.c.span.start, end: s.c.span.end }, branch: { result: r, target: r ? 'then' : s.els ? 'else' : 'skip' } });
    if (r) return this.execScoped(s.then, `if-block (line ${s.line})`);
    if (s.els) {
      if (s.els.s === 'if') return this.execIf(s.els, true);
      return this.execScoped(s.els, `else-block (line ${s.elseLine ?? s.line})`);
    }
    return 'normal';
  }

  loopCheck(c: Expr, line: number, round: number): boolean {
    const { r, calcs, shown } = this.condInfo(c);
    const text = r
      ? `Loop check \`${this.src(c)}\` → ${shown} → run the loop body (round ${round}).`
      : `Loop check \`${this.src(c)}\` → ${shown} → the loop **ends**; continue after it.`;
    this.rec('loop', line, text, { calcs, hl: { start: c.span.start, end: c.span.end }, branch: { result: r, target: r ? 'body' : 'exit' } });
    return r;
  }

  execWhile(s: Extract<Stmt, { s: 'while' }>): Signal {
    this.breakTargets.push('loop');
    try {
      for (let round = 1; ; round++) {
        if (!this.loopCheck(s.c, s.line, round)) break;
        const sig = this.execScoped(s.body, `while body (line ${s.line})`);
        if (sig === 'break') break;
        if (sig === 'return') return 'return';
      }
    } finally {
      this.breakTargets.pop();
    }
    return 'normal';
  }

  execDo(s: Extract<Stmt, { s: 'do' }>): Signal {
    this.breakTargets.push('loop');
    try {
      for (let round = 1; ; round++) {
        const sig = this.execScoped(s.body, `do body (line ${s.line})`);
        if (sig === 'break') break;
        if (sig === 'return') return 'return';
        if (!this.loopCheck(s.c, s.whileLine, round + 1)) break;
      }
    } finally {
      this.breakTargets.pop();
    }
    return 'normal';
  }

  execFor(s: Extract<Stmt, { s: 'for' }>): Signal {
    this.breakTargets.push('loop');
    this.pushScope(`for loop (line ${s.line})`);
    try {
      if (s.init) {
        this.notes.push('**Loop setup** (runs only once):');
        this.exec(s.init);
      }
      for (let round = 1; ; round++) {
        if (s.c && !this.loopCheck(s.c, s.line, round)) break;
        const sig = this.execScoped(s.body, `for body (line ${s.line})`);
        if (sig === 'break') break;
        if (sig === 'return') return 'return';
        if (s.step) {
          const c = this.calc(s.step);
          const st = unparen(s.step);
          let who = '';
          const target = st.k === 'un' ? unparen(st.e) : st.k === 'asg' ? unparen(st.l) : null;
          if (target && target.k === 'id') {
            const v = this.lookup(target.name);
            if (v) who = ` → \`${target.name}\` is now **${this.showVal(this.read(this.varLoc(v)))}**`;
          }
          this.rec('assign', s.line, `Loop update: \`${this.src(s.step)}\`${who}.`, { calcs: this.calcs(c), hl: { start: s.step.span.start, end: s.step.span.end } });
        }
      }
    } finally {
      this.popScope();
      this.breakTargets.pop();
    }
    return 'normal';
  }

  execRangeFor(s: Extract<Stmt, { s: 'rfor' }>): Signal {
    const r = this.locate(s.e);
    const coll = r.loc;
    const it = s.decl.items[0];
    let count: number;
    let elemLoc: (i: number) => Loc;
    let elemTy: Ty;
    if (coll.ty === 'string') {
      count = (this.read(coll).v as string).length;
      elemTy = 'char';
      elemLoc = (i) => ({ addr: coll.addr, ty: 'char', label: `${coll.label}[${i}]`, str: { loc: coll, i } });
    } else if (isArr(coll.ty)) {
      const at = coll.ty;
      count = at.n ?? 0;
      elemTy = at.of;
      const es = this.L.size(at.of);
      elemLoc = (i) => ({ addr: coll.addr + i * es, ty: at.of, label: `${coll.label}[${i}]` });
    } else throw new RuntimeErr('a range-for loop needs an array or a string', s.line, '');
    const vty: Ty = s.decl.ty.base === 'auto' ? declTy(elemTy, it.ptr, []) : declTy(baseTy(s.decl.ty), it.ptr, []);
    this.breakTargets.push('loop');
    this.pushScope(`for loop (line ${s.line})`);
    try {
      for (let i = 0; ; i++) {
        if (i >= count) {
          this.rec('loop', s.line, `All ${count} elements of \`${coll.label}\` have been visited, so the loop **ends**.`, { branch: { result: false, target: 'exit' } });
          break;
        }
        this.pushScope(`for body (line ${s.line})`);
        let sig: Signal;
        try {
          const el = elemLoc(i);
          if (it.ref && !el.str) {
            this.declareRef(it.name, el, s.decl.ty.isConst);
            this.rec('loop', s.line, `Round ${i + 1}: \`${it.name}\` becomes another name for **\`${el.label}\`** (a reference — changing \`${it.name}\` changes the array).`, { branch: { result: true, target: 'body' } });
          } else {
            const v = this.declare(it.name, vty, s.decl.ty.isConst);
            const val = this.read(el);
            this.store(this.varLoc(v), val, s.line);
            this.rec('loop', s.line, `Round ${i + 1}: copy **\`${el.label}\`** = ${this.showVal(val)} into \`${it.name}\`.`, { branch: { result: true, target: 'body' } });
          }
          sig = s.body.s === 'block' ? this.execStmts(s.body.body) : this.exec(s.body);
        } finally {
          this.popScope();
        }
        if (sig === 'break') break;
        if (sig === 'return') return 'return';
      }
    } finally {
      this.popScope();
      this.breakTargets.pop();
    }
    return 'normal';
  }

  execSwitch(s: Extract<Stmt, { s: 'switch' }>): Signal {
    const c = this.calc(s.e);
    const v = c.value;
    const body = s.body.body;
    let idx = -1;
    let deflt = -1;
    for (let k = 0; k < body.length; k++) {
      const st = body[k];
      if (st.s !== 'case') continue;
      if (st.value === null) deflt = k;
      else {
        const cv = this.calc(st.value).value;
        if (V.toBig(cv) === V.toBig(V.convert(v, V.promote(v.t)))) {
          idx = k;
          break;
        }
      }
    }
    const matched = idx >= 0;
    if (!matched) idx = deflt;
    const labelOf = (k: number) => {
      const st = body[k] as Extract<Stmt, { s: 'case' }>;
      return st.value ? `case ${this.src(st.value)}:` : 'default:';
    };
    const shown = V.displayRV(v);
    const text = idx < 0
      ? `\`switch (${this.src(s.e)})\`: the value is **${shown}**. No case matches and there is no \`default\`, so the whole switch is skipped.`
      : `\`switch (${this.src(s.e)})\`: the value is **${shown}** → ${matched ? '' : 'no case matches, so '}jump to \`${labelOf(idx)}\`.`;
    this.rec('switch', s.line, text, { calcs: this.calcs(c), branch: { result: shown, target: idx < 0 ? 'skip' : labelOf(idx) } });
    if (idx < 0) return 'normal';
    this.breakTargets.push('switch');
    this.pushScope(`switch (line ${s.line})`);
    try {
      for (let k = idx; k < body.length; k++) {
        const st = body[k];
        if (st.s === 'case') {
          if (k !== idx) this.notes.push(`(No \`break\` before \`${labelOf(k)}\`, so execution **falls through** into it.)`);
          continue;
        }
        const sig = this.exec(st);
        if (sig === 'break') break;
        if (sig !== 'normal') return sig;
      }
    } finally {
      this.popScope();
      this.breakTargets.pop();
    }
    return 'normal';
  }

  // ------------------------------------------------------------ expression evaluation with visible steps
  calc(e: Expr): { value: RV; lines: CalcLine[] } {
    return this.calcTree(clone(e), norm(this.prog.src.slice(e.span.start, e.span.end)));
  }

  calcTree(tree: D, original: string): { value: RV; lines: CalcLine[] } {
    const lines: CalcLine[] = [];
    this.calcNotes = [];
    if (!this.hasSideEffects(tree)) {
      const changed = this.substitute(tree, false);
      if (changed) lines.push({ text: original || render(tree, null) });
    }
    const root = { k: 'root', e: tree } as D;
    this.collapse(root);
    let focus = this.findNext(root.e);
    lines.push({ text: render(root.e, focus), note: this.takeNotes() });
    let guard = 0;
    while (focus) {
      if (++guard > 5000) break;
      const note = this.reduce(focus);
      this.collapse(root);
      focus = this.findNext(root.e);
      const extra = this.takeNotes();
      lines.push({ text: render(root.e, focus), note: [note, extra].filter(Boolean).join(' ') || undefined });
    }
    let value: RV;
    if (root.e.k === 'val') value = root.e.v;
    else if (root.e.k === 'loc') value = this.read(root.e.loc);
    else throw new RuntimeErr('could not evaluate expression', tree.span?.line ?? null, '');
    // drop consecutive duplicates (e.g. when parentheses disappear)
    const dedup: CalcLine[] = [];
    for (const l of lines) {
      const prev = dedup[dedup.length - 1];
      if (prev && prev.text.replace(/[\u0001\u0002]/g, '') === l.text.replace(/[\u0001\u0002]/g, '')) {
        if (l.note) prev.note = [prev.note, l.note].filter(Boolean).join(' ');
        prev.text = l.text;
      } else dedup.push(l);
    }
    return { value, lines: dedup };
  }

  /** find the memory location an lvalue expression refers to (evaluating any [index] inside) */
  locate(e: Expr): { loc: Loc; lines: CalcLine[] } {
    const tree = clone(e);
    const root = { k: 'root', e: tree } as D;
    const lines: CalcLine[] = [];
    this.calcNotes = [];
    let focus = this.findNextLv(root.e);
    if (focus) lines.push({ text: render(root.e, focus) });
    let guard = 0;
    while (focus) {
      if (++guard > 2000) break;
      const note = this.reduce(focus);
      this.collapse(root);
      focus = this.findNextLv(root.e);
      lines.push({ text: render(root.e, focus), note: [note, this.takeNotes()].filter(Boolean).join(' ') || undefined });
    }
    const loc = this.locOf(root.e, e.span.line);
    return { loc, lines: lines.length > 1 ? lines : [] };
  }

  takeNotes(): string | undefined {
    if (!this.calcNotes.length) return undefined;
    const s = this.calcNotes.join(' ');
    this.calcNotes = [];
    return s;
  }

  hasSideEffects(n: D): boolean {
    if (!n || typeof n !== 'object') return false;
    if (n.k === 'asg' || n.k === 'new') return true;
    if (n.k === 'un' && (n.op === '++' || n.op === '--')) return true;
    if (n.k === 'call' && (n.fn !== undefined || ['swap', 'getline', 'strcpy', 'strcat', 'strncpy', 'strncat', 'sort', 'reverse'].includes(n.name))) return true;
    if (n.k === 'mcall' && ['append', 'push_back', 'pop_back', 'clear', 'insert', 'erase', 'get', 'ignore', 'getline'].includes(n.name)) return true;
    if (n.k === 'bin' && (n.op === '<<' || n.op === '>>') && n.l?.k === 'id' && ['cout', 'cin', 'cerr'].includes(n.l.name)) return true;
    for (const key of ['e', 'l', 'r', 'c', 'a', 'b', 'obj', 'i', 'dim', 'init']) if (n[key] && this.hasSideEffects(n[key])) return true;
    if (Array.isArray(n.args) && n.args.some((a: D) => this.hasSideEffects(a))) return true;
    if (Array.isArray(n.items) && n.items.some((a: D) => this.hasSideEffects(a))) return true;
    return false;
  }

  /** replace every variable that is only READ with its value. Returns true if anything changed. */
  substitute(n: D, lv: boolean): boolean {
    if (!n || typeof n !== 'object') return false;
    const any = (...xs: boolean[]) => xs.some(Boolean);
    switch (n.k) {
      case 'val': case 'loc': case 'sizeof':
        return false;
      case 'id': {
        if (lv) return false;
        const v = n.global ? this.globals.map.get(n.name) : this.lookup(n.name);
        if (!v || isArr(v.ty) || isStructT(v.ty)) return false;
        const val = this.read(this.varLoc(v));
        const span = n.span;
        for (const key of Object.keys(n)) delete n[key];
        Object.assign(n, { k: 'val', v: val, span });
        return true;
      }
      case 'asg':
        return any(this.substitute(n.l, true), this.substitute(n.r, false));
      case 'un':
        return this.substitute(n.e, ['++', '--', '&', '*'].includes(n.op));
      case 'idx':
        return any(this.substitute(n.obj, true), this.substitute(n.i, false));
      case 'mem':
        return this.substitute(n.obj, true);
      case 'mcall':
        return any(this.substitute(n.obj, true), ...n.args.map((a: D) => this.substitute(a, false)));
      case 'call': {
        const def = n.fn !== undefined ? this.prog.funcs[n.fn] : null;
        return any(...n.args.map((a: D, k: number) => this.substitute(a, def ? !!def.params[k]?.ref : LV_BUILTINS.has(n.name))));
      }
      case 'bin':
        return any(this.substitute(n.l, false), this.substitute(n.r, false));
      case 'cond':
        return any(this.substitute(n.c, false), this.substitute(n.a, false), this.substitute(n.b, false));
      case 'paren': case 'cast':
        return this.substitute(n.e, false);
      case 'list':
        return any(...n.items.map((a: D) => this.substitute(a, false)));
      case 'new':
        return any(this.substitute(n.dim, false), this.substitute(n.init, false));
    }
    return false;
  }

  collapse(n: D) {
    if (!n || typeof n !== 'object') return;
    for (const key of ['e', 'l', 'r', 'c', 'a', 'b', 'obj', 'i', 'dim', 'init']) {
      const child = n[key];
      if (child && typeof child === 'object') {
        this.collapse(child);
        if (child.k === 'paren' && child.e?.k === 'val') n[key] = child.e;
      }
    }
    for (const arr of [n.args, n.items]) {
      if (!Array.isArray(arr)) continue;
      arr.forEach((a: D, i: number) => {
        this.collapse(a);
        if (a.k === 'paren' && a.e?.k === 'val') arr[i] = a.e;
      });
    }
  }

  findNextList(n: D): D | null {
    for (const it of n.items) {
      const f = it.k === 'list' ? this.findNextList(it) : this.findNext(it);
      if (f) return f;
    }
    return null;
  }

  /** next reducible node inside an lvalue WITHOUT turning the lvalue itself into a value */
  findNextLv(x: D): D | null {
    switch (x.k) {
      case 'id': case 'loc': case 'val':
        return null;
      case 'paren':
        return this.findNextLv(x.e);
      case 'idx':
        return this.findNextLv(x.obj) ?? this.findNext(x.i);
      case 'mem':
        return x.arrow ? this.findNext(x.obj) : this.findNextLv(x.obj);
      case 'un':
        if (x.op === '*') return this.findNext(x.e);
        return this.findNext(x);
      default:
        return this.findNext(x);
    }
  }

  findNext(n: D): D | null {
    switch (n.k) {
      case 'val':
        return null;
      case 'loc':
      case 'id':
        return n;
      case 'paren':
        return this.findNext(n.e);
      case 'un':
        if (n.op === '++' || n.op === '--' || n.op === '&') return this.findNextLv(n.e) ?? n;
        return this.findNext(n.e) ?? n;
      case 'cast':
        return this.findNext(n.e) ?? n;
      case 'sizeof':
        return n;
      case 'list':
        return this.findNextList(n);
      case 'new':
        return (n.dim && this.findNext(n.dim)) || (n.init && (n.init.k === 'list' ? this.findNextList(n.init) : this.findNext(n.init))) || n;
      case 'bin': {
        if (n.op === '&&' || n.op === '||') {
          const l = this.findNext(n.l);
          if (l) return l;
          const lt = V.truthy(n.l.v);
          if ((n.op === '&&' && !lt) || (n.op === '||' && lt)) return n;
          return this.findNext(n.r) ?? n;
        }
        if ((n.op === '<<' || n.op === '>>') && n.l.k === 'id' && ['cout', 'cin', 'cerr'].includes(n.l.name) && !this.lookup(n.l.name)) {
          return n.op === '<<' ? this.findNext(n.r) ?? n : this.findNextLv(n.r) ?? n;
        }
        return this.findNext(n.l) ?? this.findNext(n.r) ?? n;
      }
      case 'asg':
        return this.findNextLv(n.l) ?? (n.r.k === 'list' ? this.findNextList(n.r) : this.findNext(n.r)) ?? n;
      case 'cond':
        return this.findNext(n.c) ?? n;
      case 'call': {
        const def = n.fn !== undefined ? this.prog.funcs[n.fn] : null;
        for (let k = 0; k < n.args.length; k++) {
          const a = n.args[k];
          const lv = def ? !!def.params[k]?.ref : LV_BUILTINS.has(n.name);
          const f = lv ? this.findNextLv(a) : this.findNext(a);
          if (f) return f;
        }
        return n;
      }
      case 'mcall': {
        const o = unparen(n.obj);
        if (!(o.k === 'id' && o.name === 'cin' && !this.lookup('cin'))) {
          const f = this.findNextLv(n.obj);
          if (f) return f;
        }
        const lvArgs = o.k === 'id' && o.name === 'cin' && n.name === 'getline';
        for (let k = 0; k < n.args.length; k++) {
          const f = lvArgs && k === 0 ? this.findNextLv(n.args[k]) : this.findNext(n.args[k]);
          if (f) return f;
        }
        return n;
      }
      case 'idx':
        return this.findNextLv(n.obj) ?? this.findNext(n.i) ?? n;
      case 'mem':
        return (n.arrow ? this.findNext(n.obj) : this.findNextLv(n.obj)) ?? n;
    }
    return null;
  }

  replace(n: D, v: RV) {
    const span = n.span;
    for (const key of Object.keys(n)) delete n[key];
    Object.assign(n, { k: 'val', v, span });
  }

  replaceLoc(n: D, loc: Loc) {
    const span = n.span;
    for (const key of Object.keys(n)) delete n[key];
    Object.assign(n, { k: 'loc', loc, span });
  }

  /** put the value of a location into the tree (or the location itself for arrays / structs) */
  replaceFromLoc(n: D, loc: Loc, line: number) {
    if (isArr(loc.ty) || isStructT(loc.ty)) this.replaceLoc(n, loc);
    else this.replace(n, this.read(loc, line));
  }

  line(n: D): number {
    return n.span?.line ?? 0;
  }

  /** original source text of a display node (falls back to how it is drawn now) */
  srcOf(n: D): string {
    return n?.span ? norm(this.prog.src.slice(n.span.start, n.span.end)) : render(n, null);
  }

  // ------------------------------------------------------------ locations
  locOf(x: D, line: number): Loc {
    switch (x.k) {
      case 'paren':
        return this.locOf(x.e, line);
      case 'loc':
        return x.loc;
      case 'id':
        return this.varLoc(x.global ? this.globals.map.get(x.name)! : this.mustVar(x.name, line));
      case 'idx':
        return this.idxLoc(x, line);
      case 'mem':
        return this.memLoc(x, line);
      case 'un':
        if (x.op === '*') return this.derefLoc(x.e.v, line, this.srcOf(x.e));
        break;
    }
    throw new RuntimeErr(`\`${render(x, null)}\` is not a variable, so it has no place in memory`, line, '');
  }

  derefLoc(pv: RV, line: number, what: string): Loc {
    if (!pv || pv.t !== 'ptr') throw new RuntimeErr(`\`${what}\` is not a pointer`, line, '');
    if (pv.garbage) {
      throw new RuntimeErr(`\`${what}\` was never given an address — it holds a garbage address, so \`*${what}\` points to a random place in memory. The program crashes (segmentation fault).`, line, '[Program crashed: segmentation fault]');
    }
    const a = pv.v as number;
    if (a === 0) throw new RuntimeErr(`\`${what}\` is **nullptr** — it points to nothing, so there is no box to use. The program crashes (segmentation fault).`, line, '[Program crashed: segmentation fault]');
    const o = this.objAt(a);
    if (!o) throw new RuntimeErr(`\`${what}\` holds ${hex(a)}, which is not a valid address. The program crashes (segmentation fault).`, line, '[Program crashed: segmentation fault]');
    const ty = pv.pt ?? 'int';
    if (!o.alive) {
      this.stepWarn = `\`${what}\` points to memory that was already ${o.region === 'heap' ? 'deleted' : 'destroyed (its function ended)'} — a **dangling pointer**. The value there is unpredictable.`;
    }
    return { addr: a, ty, label: this.labelAt(a, ty), isConst: pv.cto };
  }

  /** element [i] of an array / pointer / string */
  idxLoc(n: D, line: number): Loc {
    const i = Number(V.toBig(n.i.v));
    const obj = unparen(n.obj);
    let base: Loc | null = null;
    let pv: RV | null = null;
    let via = '';
    if (obj.k === 'val') {
      pv = obj.v;
      via = this.srcOf(obj);
    } else {
      base = this.locOf(obj, line);
      if (isPtr(base.ty)) {
        pv = this.read(base, line);
        via = base.label;
        base = null;
      }
    }
    if (base) {
      if (base.ty === 'string') return { addr: base.addr, ty: 'char', label: `${base.label}[${i}]`, str: { loc: base, i } };
      if (isArr(base.ty)) {
        const at = base.ty;
        const es = this.L.size(at.of);
        const loc: Loc = { addr: base.addr + i * es, ty: at.of, label: `${base.label}[${i}]`, isConst: base.isConst };
        if (i < 0 || i >= (at.n ?? 0)) loc.oob = `\`${base.label}\` has ${at.n} elements (positions 0 to ${(at.n ?? 0) - 1}), so \`${base.label}[${i}]\` is **outside the array**!`;
        return loc;
      }
      throw new RuntimeErr(`\`${base.label}\` cannot be indexed with [ ]`, line, '');
    }
    if (!pv) throw new RuntimeErr('bad index', line, '');
    if (pv.t === 'string') throw new RuntimeErr('cannot change a temporary string', line, '');
    const start = this.derefLoc(pv, line, via);
    const es = this.L.size(start.ty);
    const addr = start.addr + i * es;
    const home = this.objAt(start.addr);
    const loc: Loc = { addr, ty: start.ty, label: this.labelAt(addr, start.ty), isConst: pv.cto };
    const there = this.objAt(addr);
    if (!there || there !== home) loc.oob = `\`${via}[${i}]\` goes outside the memory that \`${via}\` points into!`;
    return loc;
  }

  memLoc(n: D, line: number): Loc {
    let base: Loc;
    if (n.arrow) base = this.derefLoc(n.obj.v, line, this.srcOf(n.obj));
    else base = this.locOf(n.obj, line);
    if (!isStructT(base.ty)) throw new RuntimeErr(`\`${base.label}\` is not a struct`, line, '');
    const f = this.L.field(base.ty.name, n.name);
    if (!f) throw new RuntimeErr(`no field ${n.name}`, line, '');
    return { addr: base.addr + f.off, ty: f.ty, label: `${base.label}.${n.name}`, isConst: base.isConst };
  }

  /** static type of an expression node without evaluating it (for sizeof) */
  typeOfNode(x: D): Ty {
    switch (x.k) {
      case 'paren':
        return this.typeOfNode(x.e);
      case 'id': {
        const v = this.lookup(x.name);
        return v ? v.ty : 'int';
      }
      case 'loc':
        return x.loc.ty;
      case 'val':
        return x.v.t === 'ptr' ? ptrTo(x.v.pt ?? 'int') : x.v.t === 'cstr' ? arrOf('char', (x.v.v as string).length + 1) : (x.v.t as Ty);
      case 'idx': {
        const t = this.typeOfNode(x.obj);
        if (t === 'string') return 'char';
        return isArr(t) ? t.of : isPtr(t) ? t.to : 'int';
      }
      case 'un':
        if (x.op === '*') {
          const t = this.typeOfNode(x.e);
          return isArr(t) ? t.of : isPtr(t) ? t.to : 'int';
        }
        if (x.op === '&') return ptrTo(this.typeOfNode(x.e));
        return this.typeOfNode(x.e);
      case 'mem': {
        let t = this.typeOfNode(x.obj);
        if (x.arrow && isPtr(t)) t = t.to;
        if (isStructT(t)) return this.L.field(t.name, x.name)?.ty ?? 'int';
        return 'int';
      }
      case 'cast':
        return baseTy(x.ty);
      case 'bin':
        return ['==', '!=', '<', '>', '<=', '>=', '&&', '||'].includes(x.op) ? 'bool' : this.typeOfNode(x.l);
    }
    return 'int';
  }

  // ------------------------------------------------------------ one reduction step
  /** perform ONE evaluation step on node n (its children are already values). Returns a teaching note. */
  reduce(n: D): string | undefined {
    const line = this.line(n);
    switch (n.k) {
      case 'loc': {
        const loc: Loc = n.loc;
        if (isArr(loc.ty)) {
          this.replace(n, { t: 'ptr', v: loc.addr, pt: loc.ty.of });
          return `${loc.label} (an array) gives the address of its first element`;
        }
        this.replace(n, this.read(loc, line));
        return undefined;
      }
      case 'id': {
        const v = n.global ? this.globals.map.get(n.name) : this.lookup(n.name);
        if (!v) throw new RuntimeErr(`'${n.name}' is not a variable`, line, '');
        const nm = n.name;
        if (isArr(v.ty)) {
          this.replace(n, { t: 'ptr', v: v.addr, pt: v.ty.of });
          return `${nm} (an array) turns into the address of its first element, ${nm}[0] (${hex(v.addr)})`;
        }
        this.replace(n, this.read(this.varLoc(v), line));
        return v.isRef ? `${nm} is a reference to ${this.labelAt(v.addr, v.ty)}` : undefined;
      }
      case 'sizeof': {
        const t: Ty = n.ty ? declTy(baseTy(n.ty), n.tyPtr ?? 0, []) : this.typeOfNode(n.e);
        const size = this.L.size(t);
        this.replace(n, { t: 'unsigned long long', v: BigInt(size) });
        const ue = n.e ? unparen(n.e) : null;
        const pv = ue && ue.k === 'id' ? this.lookup(ue.name) : undefined;
        if (pv?.arrParam) return `inside the function ${(ue as { name: string }).name} is really a POINTER, so sizeof gives 8 — not the array size!`;
        if (isArr(t)) return `${t.n} × ${this.L.size(t.of)} bytes = ${size} bytes`;
        if (isPtr(t)) return 'a pointer (an address) always takes 8 bytes';
        return `a ${tyLabel(t)} takes ${plural(size, 'byte')}`;
      }
      case 'cast': {
        const from: RV = n.e.v;
        const to = V.convert(from, baseTy(n.ty) as ValType);
        this.replace(n, to);
        if (V.isFloating(from.t) && V.isIntegral(to.t)) return `converting to ${to.t} cuts off the decimal part`;
        if (V.isIntegral(from.t) && V.isFloating(to.t)) return `${V.displayRV(from)} becomes the decimal ${V.displayRV(to)}`;
        if (V.isCharType(to.t) && !V.isCharType(from.t)) return `ASCII code ${V.displayRV(from)} is ${V.displayRV(to)}`;
        if (V.isCharType(from.t) && !V.isCharType(to.t)) return `${V.displayRV(from)} has ASCII code ${V.displayRV(to)}`;
        return undefined;
      }
      case 'un': {
        if (n.op === '++' || n.op === '--') {
          const loc = this.locOf(n.e, line);
          const old = this.read(loc, line);
          const res = this.arith(n.op === '++' ? '+' : '-', old, { t: 'int', v: B1 }, line).v;
          this.store(loc, res, line);
          const now = this.read(loc, line);
          const name = loc.label;
          const op = n.op;
          if (n.postfix) {
            this.replace(n, old);
            return `${name}${op} gives the OLD value ${this.showVal(old)}, then ${name} becomes ${this.showVal(now)}`;
          }
          this.replace(n, now);
          return `${op}${name} changes ${name} to ${this.showVal(now)} FIRST, then uses it`;
        }
        if (n.op === '&') {
          const loc = this.locOf(n.e, line);
          const target = loc.str ? loc.str.loc : loc;
          this.replace(n, { t: 'ptr', v: target.addr, pt: target.ty, cto: loc.isConst });
          return `&${loc.label} is the ADDRESS of ${loc.label}: ${hex(target.addr)}`;
        }
        if (n.op === '*') {
          const loc = this.derefLoc(n.e.v, line, this.srcOf(n.e));
          this.replaceFromLoc(n, loc, line);
          return `*${render({ k: 'val', v: loc.addr ? { t: 'ptr', v: loc.addr } : n.e.v }, null)} → go to that address and take what is in the box: ${loc.label}`;
        }
        const a: RV = n.e.v;
        if (n.op === '!') {
          this.replace(n, V.mkBool(!V.truthy(a)));
          return a.t === 'bool' ? undefined : a.t === 'ptr' ? `a ${(a.v as number) === 0 ? 'nullptr' : 'non-null pointer'} counts as ${V.truthy(a)}` : `${V.displayRV(a)} counts as ${V.truthy(a)}`;
        }
        if (n.op === '-' || n.op === '+') {
          const pt = V.promote(a.t);
          if (V.isFloating(pt)) this.replace(n, { t: pt, v: n.op === '-' ? -(a.v as number) : (a.v as number) });
          else this.replace(n, { t: pt, v: V.wrap(pt, n.op === '-' ? -V.toBig(a) : V.toBig(a)) });
          return V.isCharType(a.t) ? `${V.displayRV(a)} is used as its ASCII number` : undefined;
        }
        if (n.op === '~') {
          const pt = V.promote(a.t);
          this.replace(n, { t: pt, v: V.wrap(pt, ~V.toBig(a)) });
          return undefined;
        }
        return undefined;
      }
      case 'bin': {
        if (n.op === '&&' || n.op === '||') {
          const lt = V.truthy(n.l.v);
          if (n.op === '&&' && !lt) {
            this.replace(n, V.mkBool(false));
            return 'false && anything is false → the right side is not even checked (short-circuit)';
          }
          if (n.op === '||' && lt) {
            this.replace(n, V.mkBool(true));
            return 'true || anything is true → the right side is not even checked (short-circuit)';
          }
          this.replace(n, V.mkBool(V.truthy(n.r.v)));
          return undefined;
        }
        if (n.op === ',') {
          this.replace(n, n.r.v);
          return undefined;
        }
        if (n.op === '<<' && n.l.k === 'id' && ['cout', 'cerr'].includes(n.l.name)) {
          const val: RV = n.r.v;
          const txt = V.applyWidth(this.coutRaw(val), this.out);
          this.out.width = 0;
          this.write(txt, n.l.name === 'cerr' ? 'err' : 'out');
          this.replace(n, { t: 'ostream', v: null });
          return `prints ${V.quoteStr(txt)}`;
        }
        if (n.op === '>>' && n.l.k === 'id' && n.l.name === 'cin') {
          const loc = this.locOf(n.r, line);
          const s = this.input;
          let p = this.inPos;
          while (p < s.length && /\s/.test(s[p])) p++;
          if (p >= s.length || this.inFail) {
            this.inPos = p;
            this.inFail = true;
            this.replace(n, { t: 'istream', v: false });
            return 'no more input → cin fails (counts as false)';
          }
          this.readInto(loc, line);
          this.replace(n, { t: 'istream', v: !this.inFail });
          return this.inFail ? 'the read failed → false' : `read a value into ${loc.label} → cin is still OK (true)`;
        }
        const res = this.arith(n.op, n.l.v, n.r.v, line);
        this.replace(n, res.v);
        return res.note;
      }
      case 'asg': {
        const loc = this.locOf(n.l, line);
        let res: RV;
        if (n.r.k === 'list') {
          this.fillList(loc, n.r, []);
          this.replaceFromLoc(n, loc, line);
          return `${loc.label} is filled from the list`;
        }
        const r: RV = n.r.v;
        if (n.op === '=') res = r;
        else res = this.arith(n.op.slice(0, -1), this.read(loc, line), r, line).v;
        this.store(loc, res, line);
        const stored = isStructT(loc.ty) ? res : this.read(loc, line);
        this.replace(n, stored);
        return `${loc.label} is set to ${this.showVal(stored)}`;
      }
      case 'cond': {
        const r = V.truthy(n.c.v);
        const chosen = r ? n.a : n.b;
        const span = n.span;
        for (const key of Object.keys(n)) delete n[key];
        Object.assign(n, chosen);
        if (!n.span) n.span = span;
        return r ? 'condition is true → take the value before the :' : 'condition is false → take the value after the :';
      }
      case 'call':
        if (n.fn !== undefined) return this.callUser(n, line);
        return this.callBuiltin(n, line);
      case 'mcall':
        return this.callMethod(n, line);
      case 'new':
        return this.doNew(n, line);
      case 'idx': {
        const obj = unparen(n.obj);
        const i = Number(V.toBig(n.i.v));
        if (obj.k === 'val' && (obj.v.t === 'cstr' || obj.v.t === 'string')) {
          const s = String((obj as D).v.v);
          if (i < 0 || i > s.length) {
            this.replace(n, { t: 'char', v: B0, garbage: true });
            return `position ${i} is OUTSIDE the text (valid: 0 to ${s.length - 1}) → garbage!`;
          }
          this.replace(n, { t: 'char', v: BigInt(i === s.length ? 0 : s.charCodeAt(i) & 0xff) });
          return `position ${i} of ${V.quoteStr(s)} (counting from 0)`;
        }
        const loc = this.idxLoc(n, line);
        this.replaceFromLoc(n, loc, line);
        if (loc.str) return `position ${i} of ${V.quoteStr(String(this.read(loc.str.loc).v))} (counting from 0)`;
        if (loc.oob) return undefined;
        return obj.k === 'val' ? `${render(obj, null)}[${i}] → ${i} step${i === 1 ? '' : 's'} after that address: ${loc.label}` : `${loc.label} (position ${i}, counting from 0)`;
      }
      case 'mem': {
        if (!n.arrow && n.obj.k === 'val' && n.obj.v.t === 'st') {
          const sv = n.obj.v as RV;
          const leaves = this.L.leaves({ k: 'st', name: sv.sname! });
          const k = leaves.findIndex((lf) => lf.path === '.' + n.name);
          const cell = k >= 0 ? (sv.v as StructVal).cells[k] : null;
          this.replace(n, cell ?? this.garbageFor(leaves[k]?.ty ?? 'int', n.name));
          return undefined;
        }
        const loc = this.memLoc(n, line);
        this.replaceFromLoc(n, loc, line);
        return n.arrow ? `${render(n.obj, null)}->${n.name}: go to the struct at that address and take its field ${n.name} (${loc.label})` : undefined;
      }
    }
    return undefined;
  }

  // ------------------------------------------------------------ arithmetic
  arith(op: string, a: RV, b: RV, line: number): { v: RV; note?: string } {
    // --- a char array next to a std::string counts as text
    if (a.t === 'string' && b.t === 'ptr' && b.pt && isCharT(b.pt)) b = V.mkStr(this.cstrFrom(b.v as number, line));
    if (b.t === 'string' && a.t === 'ptr' && a.pt && isCharT(a.pt)) a = V.mkStr(this.cstrFrom(a.v as number, line));
    // --- pointers
    if (a.t === 'ptr' || b.t === 'ptr') return this.ptrArith(op, a, b, line);
    // --- text
    if (op === '+' && (a.t === 'string' || b.t === 'string')) {
      const part = (x: RV) => (V.isStringy(x.t) ? (x.v as string) : V.charOf(x));
      return { v: V.mkStr(part(a) + part(b)), note: 'joining text' };
    }
    if (op === '+' && (a.t === 'cstr' || b.t === 'cstr')) {
      const [s, k] = a.t === 'cstr' ? [a.v as string, Number(V.toBig(b))] : [b.v as string, Number(V.toBig(a))];
      const out = k >= 0 && k <= s.length ? s.slice(k) : '';
      return { v: { t: 'cstr', v: out }, note: `adding ${k} to a text literal SKIPS ${plural(k, 'character')} (it does not join!)` };
    }
    if (V.isStringy(a.t) && V.isStringy(b.t)) {
      const x = a.v as string;
      const y = b.v as string;
      const cmp: Record<string, boolean> = { '==': x === y, '!=': x !== y, '<': x < y, '>': x > y, '<=': x <= y, '>=': x >= y };
      if (op in cmp) return { v: V.mkBool(cmp[op]), note: op === '==' || op === '!=' ? undefined : 'text is compared letter by letter (dictionary order, by ASCII)' };
    }
    const ct = V.commonType(a.t, b.t);
    const notes: string[] = [];
    if ((V.isCharType(a.t) || V.isCharType(b.t)) && ['+', '-', '*', '/', '%'].includes(op)) {
      const c = V.isCharType(a.t) ? a : b;
      notes.push(`${V.displayRV(c)} is ${V.toBig(c)} in ASCII`);
    }
    if (V.isFloating(ct)) {
      const x = V.toNum(a);
      const y = V.toNum(b);
      if (!V.isFloating(a.t) !== !V.isFloating(b.t) && ['+', '-', '*', '/'].includes(op)) {
        const intSide = V.isFloating(a.t) ? b : a;
        notes.push(`the int ${V.displayRV(intSide)} is turned into ${V.fmtDoubleDisplay(V.toNum(intSide))} first`);
      }
      let r: number | boolean;
      switch (op) {
        case '+': r = x + y; break;
        case '-': r = x - y; break;
        case '*': r = x * y; break;
        case '/':
          r = x / y;
          if (y === 0) notes.push('dividing a decimal by 0 gives inf (infinity), not a crash');
          break;
        case '==': r = x === y; break;
        case '!=': r = x !== y; break;
        case '<': r = x < y; break;
        case '>': r = x > y; break;
        case '<=': r = x <= y; break;
        case '>=': r = x >= y; break;
        default: throw new RuntimeErr(`operator ${op} does not work with decimals`, line, '');
      }
      if (typeof r === 'boolean') return { v: V.mkBool(r), note: notes.join('; ') || undefined };
      if (ct === 'float') r = Math.fround(r);
      return { v: { t: ct, v: r }, note: notes.join('; ') || undefined };
    }
    // integers (after usual arithmetic conversions)
    const x = V.wrap(ct, V.toBig(a));
    const y = V.wrap(ct, V.toBig(b));
    if (V.toBig(a) !== x || V.toBig(b) !== y) notes.push(`a negative number mixed with an unsigned value turns into a huge positive number!`);
    let exact: bigint;
    switch (op) {
      case '+': exact = x + y; break;
      case '-': exact = x - y; break;
      case '*': exact = x * y; break;
      case '/':
      case '%':
        if (y === B0) throw new RuntimeErr(`${op === '/' ? 'integer division' : 'modulo'} by zero. Whole numbers cannot be divided by 0, so the program crashes.`, line, '[Program crashed: division by zero]');
        exact = op === '/' ? x / y : x % y;
        if (op === '/' && x % y !== B0) notes.push(`int ÷ int gives an int: the decimal part is thrown away (not rounded)`);
        if (op === '%') notes.push(`remainder of ${x} ÷ ${y}`);
        break;
      case '<<': exact = x << y; break;
      case '>>': exact = x >> y; break;
      case '&': exact = x & y; break;
      case '|': exact = x | y; break;
      case '^': exact = x ^ y; break;
      case '==': return { v: V.mkBool(x === y), note: notes.join('; ') || undefined };
      case '!=': return { v: V.mkBool(x !== y), note: notes.join('; ') || undefined };
      case '<': return { v: V.mkBool(x < y), note: notes.join('; ') || undefined };
      case '>': return { v: V.mkBool(x > y), note: notes.join('; ') || undefined };
      case '<=': return { v: V.mkBool(x <= y), note: notes.join('; ') || undefined };
      case '>=': return { v: V.mkBool(x >= y), note: notes.join('; ') || undefined };
      default: throw new RuntimeErr(`unknown operator ${op}`, line, '');
    }
    const wrapped = V.wrap(ct, exact);
    if (wrapped !== exact) {
      const lim = V.intLimits(ct);
      notes.push(`OVERFLOW! the real answer ${exact} does not fit in ${ct === 'int' ? 'an' : 'a'} ${ct}${lim ? ` (max ${lim[1]})` : ''}, so it wraps around`);
    }
    return { v: { t: ct, v: wrapped }, note: notes.join('; ') || undefined };
  }

  ptrArith(op: string, a: RV, b: RV, line: number): { v: RV; note?: string } {
    const addr = (x: RV) => (x.t === 'ptr' ? (x.v as number) : Number(V.toBig(x)));
    if (['==', '!=', '<', '>', '<=', '>='].includes(op)) {
      const x = addr(a);
      const y = addr(b);
      const r = { '==': x === y, '!=': x !== y, '<': x < y, '>': x > y, '<=': x <= y, '>=': x >= y }[op as '=='];
      const note = (op === '==' || op === '!=') && (x === 0 || y === 0) ? `checking whether the pointer is nullptr` : 'comparing two addresses';
      return { v: V.mkBool(r), note };
    }
    if ((op === '+' || op === '-') && a.t === 'ptr' && b.t !== 'ptr') {
      const k = Number(V.toBig(b));
      const es = this.L.size(a.pt ?? 'int');
      const to = addr(a) + (op === '+' ? k : -k) * es;
      const lbl = this.objAt(to) && this.cells.has(to) ? ` → ${this.labelAt(to, a.pt)}` : '';
      return { v: { t: 'ptr', v: to, pt: a.pt, cto: a.cto }, note: `${op === '+' ? 'forward' : 'back'} ${k} × ${es} bytes (one ${tyLabel(a.pt ?? 'int')} each)${lbl}` };
    }
    if (op === '+' && b.t === 'ptr' && a.t !== 'ptr') return this.ptrArith('+', b, a, line);
    if (op === '-' && a.t === 'ptr' && b.t === 'ptr') {
      const es = this.L.size(a.pt ?? 'int');
      const d = Math.trunc((addr(a) - addr(b)) / es);
      return { v: { t: 'long long', v: BigInt(d) }, note: `${d} element${Math.abs(d) === 1 ? '' : 's'} apart` };
    }
    throw new RuntimeErr(`operator ${op} does not work with pointers`, line, '');
  }

  // ------------------------------------------------------------ user functions
  paramTy(p: FuncDef['params'][number]): Ty {
    const base = baseTy(p.ty);
    if (p.dims.length) {
      const inner = p.dims.slice(1).map((d) => (d && unparen(d).k === 'lit' ? Number(V.toBig((unparen(d) as { v: RV }).v)) : this.constOf(d)));
      return ptrTo(declTy(base, p.ptr, inner));
    }
    return declTy(base, p.ptr, [], p.ty.isConst);
  }

  constOf(d: Expr | null): number {
    if (!d) return 1;
    const x = unparen(d);
    if (x.k === 'id') {
      const v = this.globals.map.get(x.name);
      if (v) return Number(V.toBig(this.read(this.varLoc(v))));
    }
    return 1;
  }

  callUser(n: D, line: number): string | undefined {
    const def: FuncDef = this.prog.funcs[n.fn];
    if (this.frames.length > 200) {
      throw new RuntimeErr(`Too many function calls inside each other (${this.frames.length} frames). \`${def.name}()\` probably keeps calling itself forever — a recursive function needs a **base case** that stops it.`, line, '[Program crashed: stack overflow]');
    }
    const saved = { notes: this.calcNotes, group: this.curGroup, warn: this.stepWarn, pre: this.notes, breaks: this.breakTargets, retVal: this.retVal, retLoc: this.retLoc };
    this.curGroup = null;
    this.breakTargets = [];
    // argument values (or locations for reference parameters), worked out in the caller
    const args: { val?: RV; loc?: Loc; text: string }[] = def.params.map((p, k) => {
      const a = n.args[k];
      if (!a) {
        const c = this.calc(p.def!);
        return { val: c.value, text: `${this.showVal(c.value)} (default)` };
      }
      if (p.ref && a.k !== 'val') {
        const loc = this.locOf(a, line);
        return { loc, text: loc.label };
      }
      const v: RV = a.k === 'val' ? a.v : this.read(this.locOf(a, line), line);
      return { val: v, text: this.showVal(v) };
    });
    this.calcNotes = [];
    this.notes = [];
    const callText = `${def.name}(${args.map((a) => (a.loc ? a.loc.label : a.val ? V.displayRV(a.val) : '?')).join(', ')})`;
    const frame: Frame = { fn: def.name, scopes: [{ vars: [], map: new Map(), sp: this.sp }], callLine: line, base: this.sp, def };
    this.frames.push(frame);
    const descs: string[] = [];
    def.params.forEach((p, k) => {
      const a = args[k];
      if (!p.name) return;
      if (p.ref && a.loc) {
        this.declareRef(p.name, a.loc, p.ty.isConst);
        descs.push(`\`${p.name}\` becomes another name for **\`${a.loc.label}\`** (a reference — no copy is made)`);
        return;
      }
      const pty = this.paramTy(p);
      const v = this.declare(p.name, pty, p.ty.isConst && !isPtr(pty));
      if (p.dims.length) v.arrParam = true;
      this.store(this.varLoc(v), a.val!, line);
      const got = this.read(this.varLoc(v), line);
      if (p.dims.length) descs.push(`\`${p.name}\` gets the ADDRESS ${this.showVal(got)} — the array itself is NOT copied`);
      else if (isPtr(pty)) descs.push(`\`${p.name}\` gets the address ${this.showVal(got)}`);
      else descs.push(`\`${p.name}\` = **${this.showVal(got)}** (a copy)`);
    });
    const intro = `Call **\`${callText}\`** (from line ${line}). A new **frame** — a fresh box of memory for \`${def.name}\` — is made${descs.length ? ': ' + descs.join('; ') + '.' : '. It has no parameters.'}`;
    this.rec('call', def.line, intro);
    this.retVal = null;
    this.retLoc = null;
    const retTy = declTy(baseTy(def.ret), def.retPtr, []);
    let sig: Signal;
    try {
      sig = this.execStmts(def.body!.body);
    } catch (e) {
      throw e;
    }
    if (sig !== 'return') {
      if (retTy === 'void') {
        frame.ret = 'void';
        this.rec('return', def.body!.endLine, `Reached the closing \`}\` of \`${def.name}()\`. The function is finished, so its frame is removed and we go back to line ${line}.`);
      } else {
        this.retVal = this.garbageFor(retTy, def.name);
        frame.ret = '?';
        this.rec('return', def.body!.endLine, `\`${def.name}()\` reached its end without a \`return\`! It should give back a ${tyLabel(retTy)}, so the caller gets **garbage**.`, { warn: `${def.name}() has no return statement for this path.` });
      }
    }
    const result: RV = this.retVal ?? { t: 'void', v: null };
    const rloc = this.retLoc as Loc | null;
    // remove the frame
    for (const sc of frame.scopes) for (const v of sc.vars) if (!v.isRef) this.kill(v.obj);
    this.frames.pop();
    // (the stack pointer is NOT moved back up, so a later call never reuses these
    //  addresses — that keeps pointers to dead locals recognisable as dangling)
    this.calcNotes = saved.notes;
    this.curGroup = saved.group;
    this.stepWarn = saved.warn;
    this.notes = saved.pre;
    this.breakTargets = saved.breaks;
    this.retVal = saved.retVal;
    this.retLoc = saved.retLoc;
    if (rloc) {
      this.replaceFromLoc(n, rloc, line);
      return `${def.name}() gave back a reference to ${rloc.label}`;
    }
    this.replace(n, result);
    return result.t === 'void' ? `${def.name}() finished (void: nothing comes back)` : `${def.name}(...) returned ${this.showVal(result)}`;
  }

  // ------------------------------------------------------------ new
  doNew(n: D, line: number): string {
    const t = declTy(baseTy(n.ty), n.ptr, []);
    const name = `heap#${++this.heapCount}`;
    if (n.dim) {
      const cnt = Number(V.toBig(n.dim.v));
      if (cnt < 0) throw new RuntimeErr(`new[] was asked for ${cnt} elements. The size cannot be negative.`, line, "terminate called after throwing an instance of 'std::bad_array_new_length'");
      const aty = arrOf(t, cnt);
      const o = this.alloc(name, aty, 'heap');
      o.isArrNew = true;
      const loc: Loc = { addr: o.addr, ty: aty, label: name };
      if (n.init) this.fillList(loc, n.init, []);
      else this.initObject(loc, false);
      this.replace(n, { t: 'ptr', v: o.addr, pt: t });
      return `new makes ${cnt} ${tyLabel(t)} boxes on the HEAP (${name}, starting at ${hex(o.addr)}) and gives back the address of the first one`;
    }
    const o = this.alloc(name, t, 'heap');
    const loc: Loc = { addr: o.addr, ty: t, label: name };
    const hadInit = !!n.init;
    if (n.init) {
      if (n.init.k === 'list') this.fillList(loc, n.init, []);
      else this.store(loc, n.init.v, line);
    } else this.initObject(loc, false);
    this.replace(n, { t: 'ptr', v: o.addr, pt: t });
    return `new makes one ${tyLabel(t)} box on the HEAP (${name} at ${hex(o.addr)})${hadInit ? '' : ' — it holds garbage until you store something'} and gives back its address`;
  }

  // ------------------------------------------------------------ built-in functions
  /** read n chars starting at address a (for cstring functions) */
  charsAt(p: RV, line: number, what: string): { addr: number; text: string } {
    if (p.t === 'cstr') {
      const a = this.literal(p.v as string);
      return { addr: a, text: p.v as string };
    }
    if (p.t === 'string') return { addr: 0, text: p.v as string };
    const loc = this.derefLoc(p, line, what);
    return { addr: loc.addr, text: this.cstrFrom(loc.addr, line) };
  }

  writeChars(addr: number, text: string, line: number, what: string) {
    const o = this.objAt(addr);
    const room = o ? o.addr + o.size - addr : 0;
    if (text.length + 1 > room) {
      throw new RuntimeErr(`${what} needs ${text.length + 1} chars (with '\\0') but there is room for only ${room}. Writing past the end of the array is a **buffer overflow**.`, line, '*** stack smashing detected ***: terminated');
    }
    for (let i = 0; i <= text.length; i++) this.writeCell(addr + i, 'char', { t: 'char', v: BigInt(i < text.length ? text.charCodeAt(i) & 0xff : 0) }, line);
  }

  callBuiltin(n: D, line: number): string | undefined {
    if (LV_BUILTINS.has(n.name)) {
      if (n.name === 'swap') {
        const la = this.locOf(n.args[0], line);
        const lb = this.locOf(n.args[1], line);
        const va = this.read(la, line);
        const vb = this.read(lb, line);
        this.store(la, vb, line);
        this.store(lb, va, line);
        this.replace(n, { t: 'void', v: null });
        return `${la.label} and ${lb.label} exchange values`;
      }
      throw new RuntimeErr(`${n.name}() cannot be used inside a bigger expression here. Put it on its own line.`, line, '');
    }
    const args: RV[] = n.args.map((a: D) => a.v);
    const num = (i: number) => V.toNum(args[i]);
    const dbl = (x: number, note?: string) => {
      this.replace(n, V.mkDouble(x));
      return note;
    };
    switch (n.name) {
      case 'pow': return dbl(Math.pow(num(0), num(1)), `${V.displayRV(args[0])} to the power ${V.displayRV(args[1])} (pow always gives a double)`);
      case 'sqrt': return dbl(Math.sqrt(num(0)), num(0) < 0 ? 'square root of a negative number is nan (not a number)' : `square root (always a double)`);
      case 'cbrt': return dbl(Math.cbrt(num(0)));
      case 'ceil': return dbl(Math.ceil(num(0)), 'ceil rounds UP to a whole number');
      case 'floor': return dbl(Math.floor(num(0)), 'floor rounds DOWN to a whole number');
      case 'round': return dbl(num(0) < 0 ? -Math.round(-num(0)) : Math.round(num(0)), 'round goes to the nearest whole number (.5 goes away from zero)');
      case 'trunc': return dbl(Math.trunc(num(0)), 'trunc chops off the decimal part');
      case 'fabs': return dbl(Math.abs(num(0)));
      case 'log': return dbl(Math.log(num(0)));
      case 'log10': return dbl(Math.log10(num(0)));
      case 'log2': return dbl(Math.log2(num(0)));
      case 'exp': return dbl(Math.exp(num(0)));
      case 'sin': return dbl(Math.sin(num(0)), 'angles are in radians');
      case 'cos': return dbl(Math.cos(num(0)), 'angles are in radians');
      case 'tan': return dbl(Math.tan(num(0)), 'angles are in radians');
      case 'hypot': return dbl(Math.hypot(num(0), num(1)));
      case 'fmod': return dbl(num(0) % num(1), 'remainder for decimals');
      case 'abs': {
        const a = args[0];
        if (V.isFloating(a.t)) return dbl(Math.abs(a.v as number));
        const pt = V.promote(a.t);
        const x = V.toBig(a);
        this.replace(n, { t: pt, v: V.wrap(pt, x < B0 ? -x : x) });
        return 'absolute value (distance from 0)';
      }
      case 'max': case 'min': {
        const [a, b] = args;
        if (V.isStringy(a.t)) {
          const s = (a.v as string) >= (b.v as string) ? a : b;
          this.replace(n, n.name === 'max' ? s : s === a ? b : a);
        } else {
          const bigger = V.toNum(a) >= V.toNum(b) ? a : b;
          const smaller = bigger === a ? b : a;
          this.replace(n, n.name === 'max' ? bigger : smaller);
        }
        return n.name === 'max' ? 'the larger of the two' : 'the smaller of the two';
      }
      case 'toupper': case 'tolower': {
        const c = Number(V.toBig(args[0]));
        const ch = String.fromCharCode(c);
        const r = n.name === 'toupper' ? ch.toUpperCase() : ch.toLowerCase();
        this.replace(n, { t: 'int', v: BigInt(r.length === 1 ? r.charCodeAt(0) : c) });
        return `${n.name} returns an int (the ASCII code ${r.charCodeAt(0)}), not a char`;
      }
      case 'isdigit': case 'isalpha': case 'isupper': case 'islower': case 'isspace': case 'isalnum': case 'ispunct': {
        const ch = String.fromCharCode(Number(V.toBig(args[0])));
        const tests: Record<string, RegExp> = { isdigit: /[0-9]/, isalpha: /[A-Za-z]/, isupper: /[A-Z]/, islower: /[a-z]/, isspace: /\s/, isalnum: /[A-Za-z0-9]/, ispunct: /[!-/:-@[-`{-~]/ };
        const ok = tests[n.name].test(ch);
        this.replace(n, { t: 'int', v: ok ? B1 : B0 });
        return `${ok ? 'non-zero (true)' : '0 (false)'}`;
      }
      case 'to_string': {
        const a = args[0];
        const s = V.isFloating(a.t) ? V.fmtFixed(a.v as number, 6) : V.coutText(V.convert(a, V.promote(a.t)), V.defaultOutState());
        this.replace(n, V.mkStr(s));
        return V.isFloating(a.t) ? 'to_string always writes 6 decimal places' : 'the number becomes text';
      }
      case 'stoi': case 'stod': {
        const s = String(args[0].v).trimStart();
        const m = n.name === 'stoi' ? /^[+-]?\d+/.exec(s) : /^[+-]?(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+)/.exec(s);
        if (!m) throw new RuntimeErr(`${n.name} could not find a number at the start of "${args[0].v}"`, line, `terminate called after throwing an instance of 'std::invalid_argument'\n  what():  ${n.name}`);
        this.replace(n, n.name === 'stoi' ? V.mkInt(BigInt(m[0])) : V.mkDouble(parseFloat(m[0])));
        return 'text turned into a number';
      }
      case 'strlen': {
        const { text } = this.charsAt(args[0], line, this.srcOf(n.args[0]));
        this.replace(n, { t: 'unsigned long long', v: BigInt(text.length) });
        return `count the characters before '\\0' → ${text.length}`;
      }
      case 'strcmp': case 'strncmp': {
        let a = this.charsAt(args[0], line, this.srcOf(n.args[0])).text;
        let b = this.charsAt(args[1], line, this.srcOf(n.args[1])).text;
        if (n.name === 'strncmp') {
          const k = Number(V.toBig(args[2]));
          a = a.slice(0, k);
          b = b.slice(0, k);
        }
        const r = a === b ? 0 : a < b ? -1 : 1;
        this.replace(n, V.mkInt(r));
        return r === 0 ? 'the texts are equal → 0' : r < 0 ? `${V.quoteStr(a)} comes first in dictionary (ASCII) order → negative` : `${V.quoteStr(a)} comes after ${V.quoteStr(b)} → positive`;
      }
      case 'strcpy': case 'strncpy': case 'strcat': case 'strncat': {
        const dest = args[0];
        const dl = this.derefLoc(dest, line, this.srcOf(n.args[0]));
        let src = this.charsAt(args[1], line, this.srcOf(n.args[1])).text;
        if (n.name === 'strncpy' || n.name === 'strncat') src = src.slice(0, Number(V.toBig(args[2])));
        const cat = n.name.startsWith('strcat') || n.name === 'strncat';
        const old = cat ? this.cstrFrom(dl.addr, line) : '';
        const text = old + src;
        this.writeChars(dl.addr, text, line, V.quoteStr(text));
        this.replace(n, dest);
        return cat ? `${V.quoteStr(src)} is added after ${V.quoteStr(old)} → ${V.quoteStr(text)}` : `${V.quoteStr(src)} is copied into ${dl.label.replace(/\[0\]$/, '')}`;
      }
      case 'sort': case 'reverse': {
        const a = args[0].v as number;
        const b = args[1].v as number;
        const pt = args[0].pt ?? 'int';
        const es = this.L.size(pt);
        const cnt = Math.round((b - a) / es);
        const locs: Loc[] = Array.from({ length: cnt }, (_, i) => ({ addr: a + i * es, ty: pt, label: this.labelAt(a + i * es, pt) }));
        const vals = locs.map((l) => this.read(l, line));
        if (n.name === 'reverse') vals.reverse();
        else vals.sort((x, y) => (V.isStringy(x.t) ? ((x.v as string) < (y.v as string) ? -1 : (x.v as string) > (y.v as string) ? 1 : 0) : V.toNum(x) - V.toNum(y)));
        locs.forEach((l, i) => this.store(l, vals[i], line));
        this.replace(n, { t: 'void', v: null });
        return n.name === 'sort' ? `the ${cnt} elements are now in increasing order` : `the ${cnt} elements are now in reverse order`;
      }
      case 'setw': case 'setprecision':
        this.replace(n, { t: 'manip', v: { name: n.name, arg: Number(V.toBig(args[0])) } });
        return undefined;
      case 'setfill':
        this.replace(n, { t: 'manip', v: { name: n.name, arg: V.charOf(args[0]) } });
        return undefined;
    }
    throw new RuntimeErr(`calling ${n.name}() is not supported in the visualizer yet`, line, '');
  }

  callMethod(n: D, line: number): string | undefined {
    const obj = unparen(n.obj);
    const args: RV[] = n.args.map((a: D) => a.v);
    if (obj.k === 'id' && obj.name === 'cin' && !this.lookup('cin')) {
      if (n.name === 'get') {
        const s = this.input;
        if (this.inPos >= s.length) {
          this.replace(n, V.mkInt(-1));
          return 'no more input → -1 (EOF)';
        }
        this.echoUpTo(this.inPos);
        const c = s.charCodeAt(this.inPos++);
        this.replace(n, V.mkInt(c));
        return `cin.get() reads ONE character (even a space or Enter): ${V.quoteChar(String.fromCharCode(c))}`;
      }
      if (n.name === 'ignore') {
        const nl = this.input.indexOf('\n', this.inPos);
        this.inPos = nl === -1 ? this.input.length : nl + 1;
        this.replace(n, { t: 'istream', v: true });
        return 'skip the rest of the line';
      }
      throw new RuntimeErr(`cin.${n.name}() cannot be used inside a bigger expression here. Put it on its own line.`, line, '');
    }
    const loc = obj.k === 'val' ? null : this.locOf(obj, line);
    const s = loc ? ((this.read(loc, line).v as string) ?? '') : String((obj as D).v.v);
    const size = (k: number): RV => ({ t: 'unsigned long long', v: BigInt(k) });
    const set = (v: string) => {
      if (!loc) throw new RuntimeErr('cannot change a temporary string', line, '');
      this.store(loc, V.mkStr(v), line);
    };
    const name = loc ? loc.label : 'the string';
    switch (n.name) {
      case 'length': case 'size':
        this.replace(n, size(s.length));
        return `${V.quoteStr(s)} has ${plural(s.length, 'character')}`;
      case 'empty':
        this.replace(n, V.mkBool(s.length === 0));
        return undefined;
      case 'at': case 'front': case 'back': {
        const i = n.name === 'at' ? Number(V.toBig(args[0])) : n.name === 'front' ? 0 : s.length - 1;
        if (i < 0 || i >= s.length) throw new RuntimeErr(`.at(${i}) is outside the string (valid positions 0 to ${s.length - 1})`, line, `terminate called after throwing an instance of 'std::out_of_range'`);
        this.replace(n, { t: 'char', v: BigInt(s.charCodeAt(i) & 0xff) });
        return `position ${i} (counting from 0)`;
      }
      case 'substr': {
        const pos = Number(V.toBig(args[0] ?? V.mkInt(0)));
        const len = args[1] ? Number(V.toBig(args[1])) : s.length;
        if (pos > s.length) throw new RuntimeErr(`substr start ${pos} is past the end of "${s}"`, line, `terminate called after throwing an instance of 'std::out_of_range'`);
        this.replace(n, V.mkStr(s.substr(pos, len)));
        return `${args[1] ? plural(len, 'character') : 'everything'} starting at position ${pos}`;
      }
      case 'find': {
        const needle = V.isStringy(args[0].t) ? (args[0].v as string) : V.charOf(args[0]);
        const from = args[1] ? Number(V.toBig(args[1])) : 0;
        const k = s.indexOf(needle, from);
        this.replace(n, k < 0 ? { t: 'unsigned long long', v: BigInt('18446744073709551615') } : size(k));
        return k < 0 ? 'not found → string::npos (a huge number)' : `found at position ${k}`;
      }
      case 'append': case 'push_back': {
        const add = V.isStringy(args[0].t) ? (args[0].v as string) : V.charOf(args[0]);
        set(s + add);
        this.replace(n, n.name === 'append' ? V.mkStr(s + add) : { t: 'void', v: null });
        return `${name} is now ${V.quoteStr(s + add)}`;
      }
      case 'insert': {
        const pos = Number(V.toBig(args[0]));
        const add = V.isStringy(args[1].t) ? (args[1].v as string) : V.charOf(args[1]);
        if (pos > s.length) throw new RuntimeErr(`insert position ${pos} is past the end of "${s}"`, line, `terminate called after throwing an instance of 'std::out_of_range'`);
        const r = s.slice(0, pos) + add + s.slice(pos);
        set(r);
        this.replace(n, V.mkStr(r));
        return `${name} is now ${V.quoteStr(r)}`;
      }
      case 'erase': {
        const pos = Number(V.toBig(args[0] ?? V.mkInt(0)));
        const len = args[1] ? Number(V.toBig(args[1])) : s.length;
        if (pos > s.length) throw new RuntimeErr(`erase position ${pos} is past the end of "${s}"`, line, `terminate called after throwing an instance of 'std::out_of_range'`);
        const r = s.slice(0, pos) + s.slice(pos + len);
        set(r);
        this.replace(n, V.mkStr(r));
        return `${name} is now ${V.quoteStr(r)}`;
      }
      case 'pop_back':
        set(s.slice(0, -1));
        this.replace(n, { t: 'void', v: null });
        return 'last character removed';
      case 'clear':
        set('');
        this.replace(n, { t: 'void', v: null });
        return 'string emptied';
      case 'c_str':
        this.replace(n, { t: 'ptr', v: this.literal(s), pt: 'char', cto: true });
        return 'the text as a C-style char array';
    }
    throw new RuntimeErr(`.${n.name}() is not supported yet`, line, '');
  }
}
