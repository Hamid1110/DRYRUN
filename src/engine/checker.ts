// Static checks that mimic the errors & warnings g++ prints for common beginner mistakes.
// Each diagnostic also carries a plain-English `help` line.
// It also resolves which function each call goes to (overloads) and builds struct layouts.

import { commonType, isArith, isCharType, isFloating, isIntegral, promote } from './values';
import { Layouts, arrOf, baseTy, declTy, decay, elemOf, isArr, isPtr, isStructT, ptrTo, tyEq, tyName } from './ty';
import {
  CompileError,
  type Diag,
  type Expr,
  type FuncDef,
  type Program,
  type Stmt,
  type Ty,
  type TypeSpec,
  type ValType,
} from './types';

export type SType = Ty | 'unknown';

/** the type of nullptr (compared by identity) */
const NULLPTR_T: Ty = { k: 'ptr', to: 'void' };

interface VarInfo {
  ty: Ty;
  isConst: boolean;
  isRef: boolean;
  /** array parameter (int a[]) — really a pointer */
  arrParam?: boolean;
  text: string;
  line: number;
  col: number;
  /** compile-time value of a const int (for array sizes / case labels) */
  cval?: number;
}

interface NameInfo {
  type: SType;
  header: string;
  std: boolean;
}

const STD_OBJECTS: Record<string, NameInfo> = {
  cout: { type: 'ostream', header: 'iostream', std: true },
  cerr: { type: 'ostream', header: 'iostream', std: true },
  cin: { type: 'istream', header: 'iostream', std: true },
  endl: { type: 'manip', header: 'iostream', std: true },
  flush: { type: 'manip', header: 'iostream', std: true },
  fixed: { type: 'manip', header: 'iostream', std: true },
  scientific: { type: 'manip', header: 'iostream', std: true },
  defaultfloat: { type: 'manip', header: 'iostream', std: true },
  left: { type: 'manip', header: 'iostream', std: true },
  right: { type: 'manip', header: 'iostream', std: true },
  boolalpha: { type: 'manip', header: 'iostream', std: true },
  noboolalpha: { type: 'manip', header: 'iostream', std: true },
  showpoint: { type: 'manip', header: 'iostream', std: true },
  noshowpoint: { type: 'manip', header: 'iostream', std: true },
  showpos: { type: 'manip', header: 'iostream', std: true },
  noshowpos: { type: 'manip', header: 'iostream', std: true },
};

const MATH1 = ['sqrt', 'cbrt', 'ceil', 'floor', 'round', 'trunc', 'fabs', 'log', 'log10', 'log2', 'exp', 'sin', 'cos', 'tan'];
const CTYPE = ['toupper', 'tolower', 'isdigit', 'isalpha', 'isupper', 'islower', 'isspace', 'isalnum', 'ispunct'];
const CSTRING = ['strlen', 'strcpy', 'strcat', 'strcmp', 'strncpy', 'strncat', 'strncmp'];

interface FnInfo {
  header: string;
  std: boolean; // needs std:: or using namespace std
  arity: [number, number];
}
const FUNCS: Record<string, FnInfo> = {
  setw: { header: 'iomanip', std: true, arity: [1, 1] },
  setprecision: { header: 'iomanip', std: true, arity: [1, 1] },
  setfill: { header: 'iomanip', std: true, arity: [1, 1] },
  getline: { header: 'iostream', std: true, arity: [2, 3] },
  to_string: { header: 'iostream', std: true, arity: [1, 1] },
  stoi: { header: 'iostream', std: true, arity: [1, 1] },
  stod: { header: 'iostream', std: true, arity: [1, 1] },
  max: { header: 'iostream', std: true, arity: [2, 2] },
  min: { header: 'iostream', std: true, arity: [2, 2] },
  swap: { header: 'iostream', std: true, arity: [2, 2] },
  sort: { header: 'algorithm', std: true, arity: [2, 2] },
  reverse: { header: 'algorithm', std: true, arity: [2, 2] },
  abs: { header: 'cmath', std: false, arity: [1, 1] },
  pow: { header: 'cmath', std: false, arity: [2, 2] },
  hypot: { header: 'cmath', std: false, arity: [2, 2] },
  fmod: { header: 'cmath', std: false, arity: [2, 2] },
  ...Object.fromEntries(MATH1.map((n) => [n, { header: 'cmath', std: false, arity: [1, 1] as [number, number] }])),
  ...Object.fromEntries(CTYPE.map((n) => [n, { header: 'iostream', std: false, arity: [1, 1] as [number, number] }])),
  ...Object.fromEntries(CSTRING.map((n) => [n, { header: 'cstring', std: false, arity: (n.startsWith('strn') ? [3, 3] : n === 'strlen' ? [1, 1] : [2, 2]) as [number, number] }])),
};

const STRING_METHODS: Record<string, SType> = {
  length: 'unsigned long long',
  size: 'unsigned long long',
  empty: 'bool',
  at: 'char',
  substr: 'string',
  find: 'unsigned long long',
  append: 'string',
  push_back: 'void',
  pop_back: 'void',
  back: 'char',
  front: 'char',
  clear: 'void',
  insert: 'string',
  erase: 'string',
  c_str: { k: 'ptr', to: 'char', cto: true },
};

const HELP_SPACE = (name: string) => `The compiler does not know any variable called ${name}. Check the spelling (C++ is case-sensitive) and make sure it was declared before this line.`;

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

const unparen = (e: Expr): Expr => (e.k === 'paren' ? unparen(e.e) : e);

interface Sig {
  name: string;
  ret: Ty;
  retRef: boolean;
  params: { ty: Ty; ref: boolean; isConst: boolean; hasDef: boolean; name: string }[];
  line: number;
  /** index into prog.funcs, or -1 for a prototype with no body */
  index: number;
  def: FuncDef;
}

export function check(prog: Program, warnings: Diag[]): void {
  new Checker(prog, warnings).run();
}

class Checker {
  errors: Diag[] = [];
  groups: Diag[][] = [];
  scopes: Map<string, VarInfo>[] = [];
  headers: Set<string>;
  loopDepth = 0;
  switchDepth = 0;
  sigs: Sig[] = [];
  structFields = new Map<string, { name: string; ty: Ty; isConst: boolean }[]>();
  layouts!: Layouts;
  curFn: Sig | null = null;
  curFnLine = 0;

  constructor(private prog: Program, private warnings: Diag[]) {
    this.headers = new Set(prog.includes.map((i) => i.name.replace(/\.h$/, '')));
    // headers that come along with others in libstdc++
    if (this.headers.has('bits/stdc++')) ['iostream', 'iomanip', 'cmath', 'string', 'cctype', 'algorithm', 'cstdlib', 'cstring'].forEach((h) => this.headers.add(h));
    if (this.headers.has('math')) this.headers.add('cmath');
    if (this.headers.has('string.h')) this.headers.add('cstring');
    // <iostream> pulls in <cstring> declarations and std::swap/min/max in libstdc++
    if (this.headers.has('iostream')) this.headers.add('cstring');
  }

  err(line: number, col: number, msg: string, help?: string, notes: Diag[] = []) {
    const d: Diag = { kind: 'error', line, col, msg, help };
    this.errors.push(d);
    this.groups.push([d, ...notes]);
  }
  warn(line: number, col: number, msg: string, help?: string) {
    this.warnings.push({ kind: 'warning', line, col, msg, help });
  }

  run() {
    this.scopes.push(new Map());
    this.buildStructs();
    // global integral consts are needed for array bounds in parameter lists (int m[][MAX])
    for (const g of this.prog.globals) {
      if (g.s !== 'decl' || !g.ty.isConst) continue;
      const d = g;
      for (const it of d.items) if (it.ptr === 0 && !it.dims.length && it.init) {
        const v = this.constEval(it.init);
        if (v !== null) this.preConsts.set(it.name, v);
      }
    }
    this.buildSigs();
    for (const g of this.prog.globals) {
      this.curFnLine = g.line;
      this.stmt(g);
    }
    const main = this.prog.funcs.find((f) => f.name === 'main');
    for (const sig of this.sigs) {
      if (sig.index < 0) continue;
      const f = sig.def;
      this.curFn = sig;
      this.curFnLine = f.line;
      const sc = new Map<string, VarInfo>();
      this.scopes.push(sc);
      f.params.forEach((p, k) => {
        if (!p.name) return;
        const pi = sig.params[k];
        if (sc.has(p.name)) this.err(p.span.line, p.span.col, `redefinition of '${p.ty.text} ${p.name}'`, 'Two parameters have the same name.');
        sc.set(p.name, { ty: pi.ty, isConst: pi.isConst, isRef: p.ref, arrParam: p.dims.length > 0, text: p.ty.text, line: p.span.line, col: p.span.col });
      });
      for (const s of f.body!.body) this.stmt(s);
      this.scopes.pop();
      if (sig.ret !== 'void' && f.name !== 'main' && !this.hasReturn(f.body!.body)) {
        this.warn(f.body!.endLine, 1, 'no return statement in function returning non-void [-Wreturn-type]',
          `${f.name}() promises to give back a ${tyName(sig.ret)}, but it never uses return. Add return value; at the end.`);
      }
    }
    this.curFn = null;
    if (!main && this.errors.length === 0) {
      this.err(1, 1, "undefined reference to `main'", 'Every C++ program needs a main function: int main() { ... }. That is where execution starts.');
    }
    if (this.errors.length) {
      this.groups.sort((a, b) => a[0].line - b[0].line || a[0].col - b[0].col);
      throw new CompileError(this.groups.flat());
    }
    this.prog.layouts = this.layouts;
  }

  hasReturn(list: Stmt[]): boolean {
    const walk = (s: Stmt | null): boolean => {
      if (!s) return false;
      switch (s.s) {
        case 'return': return true;
        case 'block': return s.body.some(walk);
        case 'if': return walk(s.then) || walk(s.els);
        case 'while': case 'do': case 'for': case 'rfor': return walk(s.body);
        case 'switch': return walk(s.body);
        default: return false;
      }
    };
    return list.some(walk);
  }

  // ------------------------------------------------------------ structs & functions
  preConsts = new Map<string, number>();

  constEval(e: Expr | null): number | null {
    if (!e) return null;
    const x = unparen(e);
    if (x.k === 'lit' && typeof x.v.v === 'bigint') return Number(x.v.v);
    if (x.k === 'id') {
      const v = this.lookup(x.name);
      return v?.cval ?? (v ? null : this.preConsts.get(x.name) ?? null);
    }
    if (x.k === 'bin') {
      const a = this.constEval(x.l);
      const b = this.constEval(x.r);
      if (a === null || b === null) return null;
      switch (x.op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b ? Math.trunc(a / b) : null;
        case '%': return b ? a % b : null;
      }
    }
    if (x.k === 'sizeof') return null;
    return null;
  }

  specTy(ts: TypeSpec, line: number, col: number): Ty {
    if (ts.base === 'struct' && ts.sname && !this.structFields.has(ts.sname)) {
      this.err(line, col, `'${ts.sname}' does not name a type`, `There is no struct called ${ts.sname}. Define it above with struct ${ts.sname} { ... };`);
      return 'int';
    }
    if (ts.base === 'string' && !(ts as TypeSpec & { qual?: boolean }).qual && !this.prog.usingStd) {
      this.err(ts.span.line, ts.span.col, "'string' was not declared in this scope", "Add 'using namespace std;' at the top, or write std::string.");
    }
    return baseTy(ts);
  }

  buildStructs() {
    for (const sd of this.prog.structs) {
      if (this.structFields.has(sd.name)) {
        this.err(sd.line, 1, `redefinition of 'struct ${sd.name}'`, `There are two structs called ${sd.name}.`);
        continue;
      }
      const fields: { name: string; ty: Ty; isConst: boolean }[] = [];
      this.structFields.set(sd.name, fields); // allow pointers to itself
      for (const f of sd.fields) {
        if (f.ty.base === 'struct' && f.ty.sname === sd.name && f.ptr === 0) {
          this.err(f.line, f.span.col, `field '${f.name}' has incomplete type '${sd.name}'`, 'A struct cannot contain itself (it would be infinitely big). Use a pointer: ' + sd.name + '* ' + f.name + ';');
          continue;
        }
        if (fields.some((x) => x.name === f.name)) this.err(f.line, f.span.col, `redeclaration of '${f.ty.text} ${sd.name}::${f.name}'`);
        const dims = f.dims.map((d) => this.constEval(d));
        if (dims.some((d) => d === null)) this.err(f.line, f.span.col, `size of array '${f.name}' is not an integral constant-expression`, 'Array sizes inside a struct must be fixed numbers (or const ints).');
        fields.push({ name: f.name, ty: declTy(this.specTy(f.ty, f.line, f.span.col), f.ptr, dims.map((d) => d ?? 1)), isConst: f.ty.isConst });
        if (f.init) this.convCheck(fields[fields.length - 1].ty, this.type(f.init), f.init, 'initialization', '=');
      }
    }
    this.layouts = new Layouts(new Map([...this.structFields].map(([k, v]) => [k, v.map((f) => ({ name: f.name, ty: f.ty }))])));
  }

  paramTy(p: FuncDef['params'][number]): Ty {
    const base = this.specTy(p.ty, p.span.line, p.span.col);
    if (p.dims.slice(1).some((d) => d === null)) {
      this.err(p.span.line, p.span.col, `declaration of '${p.name}' as multidimensional array must have bounds for all dimensions except the first`,
        `Only the first [] may be empty. Write the column size: ${p.ty.text} ${p.name}[][3]`);
    }
    if (p.dims.length) {
      // int a[] → int*, int m[][3] → int (*)[3]
      const inner = p.dims.slice(1).map((d) => this.constEval(d) ?? 1);
      return ptrTo(declTy(base, p.ptr, inner));
    }
    return declTy(base, p.ptr, [], p.ty.isConst);
  }

  buildSigs() {
    const mk = (f: FuncDef, index: number): Sig => ({
      name: f.name,
      ret: declTy(this.specTy(f.ret, f.line, 1), f.retPtr, []),
      retRef: f.retRef,
      params: f.params.map((p) => ({ ty: this.paramTy(p), ref: p.ref, isConst: p.ty.isConst, hasDef: !!p.def, name: p.name })),
      line: f.line,
      index,
      def: f,
    });
    const defs = this.prog.funcs.map((f, i) => mk(f, i));
    const protos = this.prog.protos.map((f) => mk(f, -1));
    const same = (a: Sig, b: Sig) => a.name === b.name && a.params.length === b.params.length && a.params.every((p, k) => tyEq(p.ty, b.params[k].ty) && p.ref === b.params[k].ref);
    for (let i = 0; i < defs.length; i++) {
      const d = defs[i];
      const dup = defs.slice(0, i).find((x) => same(x, d));
      if (dup) {
        this.err(d.line, 1, `redefinition of '${this.sigText(d)}'`, `${d.name}() is written twice with the same parameters.`,
          [{ kind: 'note', line: dup.line, col: 1, msg: `'${this.sigText(dup)}' previously defined here` }]);
      }
      if (d.name === 'main' && d.ret !== 'int') this.err(d.line, 1, "'::main' must return 'int'", 'main must be declared as int main().');
    }
    for (const p of protos) {
      const d = defs.find((x) => same(x, p));
      if (d) {
        if (!tyEq(d.ret, p.ret)) this.err(d.line, 1, `ambiguating new declaration of '${this.sigText(d)}'`, 'The prototype and the definition must have the same return type.');
        // the prototype makes the function visible earlier
        d.line = Math.min(d.line, p.line);
        // default arguments may be given in the prototype
        p.params.forEach((pp, k) => {
          if (pp.hasDef) {
            d.params[k].hasDef = true;
            (d.def.params[k] as { def: Expr | null }).def ??= p.def.params[k].def;
          }
        });
      } else this.sigs.push(p);
    }
    this.sigs.push(...defs);
  }

  sigText(s: Sig): string {
    return `${tyName(s.ret)}${s.retRef ? '&' : ''} ${s.name}(${s.params.map((p) => (p.isConst && !isPtr(p.ty) ? 'const ' : '') + tyName(p.ty) + (p.ref ? '&' : '')).join(', ')})`;
  }

  // ------------------------------------------------------------ scopes
  lookup(name: string): VarInfo | undefined {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const v = this.scopes[i].get(name);
      if (v) return v;
    }
    return undefined;
  }

  allNames(): string[] {
    const out: string[] = [];
    for (const s of this.scopes) out.push(...s.keys());
    return out;
  }

  // ------------------------------------------------------------ statements
  stmt(s: Stmt) {
    switch (s.s) {
      case 'block':
        this.scopes.push(new Map());
        for (const b of s.body) this.stmt(b);
        this.scopes.pop();
        break;
      case 'decl':
        this.decl(s);
        break;
      case 'expr': {
        this.type(s.e);
        const e = unparen(s.e);
        if (e.k === 'bin' && ['==', '!=', '<', '>', '<=', '>=', '+', '-', '*', '/', '%', '&&', '||'].includes(e.op) && !this.isStreamChain(e)) {
          this.warn(e.opSpan.line, e.opSpan.col, 'statement has no effect [-Wunused-value]',
            e.op === '==' ? 'This compares but does not store anything. To assign a value use a single =.' : 'The result of this calculation is not stored anywhere, so the line does nothing.');
        }
        break;
      }
      case 'if': {
        this.cond(s.c, 'if');
        if (s.then.s === 'empty') {
          this.warn(s.then.line, s.then.span.col, "suggest braces around empty body in an 'if' statement [-Wempty-body]",
            'There is a semicolon right after if (...). That ; is the whole if-body, so the block below it ALWAYS runs.');
        }
        this.scoped(s.then);
        if (s.els) this.scoped(s.els);
        break;
      }
      case 'while':
        this.cond(s.c, 'while');
        this.loopDepth++;
        this.scoped(s.body);
        this.loopDepth--;
        break;
      case 'do':
        this.loopDepth++;
        this.scoped(s.body);
        this.loopDepth--;
        this.cond(s.c, 'while');
        break;
      case 'for':
        this.scopes.push(new Map());
        if (s.init) this.stmt(s.init);
        if (s.c) this.cond(s.c, 'for');
        if (s.step) this.type(s.step);
        this.loopDepth++;
        this.scoped(s.body);
        this.loopDepth--;
        this.scopes.pop();
        break;
      case 'rfor': {
        const rt = this.type(s.e);
        this.scopes.push(new Map());
        const it = s.decl.items[0];
        let elem: Ty = 'int';
        if (rt === 'string') elem = 'char';
        else if (rt !== 'unknown' && isArr(rt)) elem = rt.of;
        else if (rt !== 'unknown') {
          this.err(s.e.span.line, s.e.span.col, `'begin' was not declared in this scope`, isPtr(rt)
            ? 'A range-for loop cannot walk over a pointer (it does not know the size). Use a normal for loop with an index.'
            : 'A range-for loop (for (x : ...)) needs an array or a string after the colon.');
        }
        const vt = s.decl.ty.base === 'auto' ? declTy(elem, it.ptr, []) : declTy(this.specTy(s.decl.ty, s.decl.line, 1), it.ptr, []);
        if (s.decl.ty.base !== 'auto' && rt !== 'unknown') this.convCheck(vt, elem, s.e, 'initialization');
        this.scopes[this.scopes.length - 1].set(it.name, { ty: vt, isConst: s.decl.ty.isConst, isRef: it.ref, text: s.decl.ty.text, line: it.span.line, col: it.span.col });
        this.loopDepth++;
        this.scoped(s.body);
        this.loopDepth--;
        this.scopes.pop();
        break;
      }
      case 'switch': {
        const t = this.type(s.e);
        if (t !== 'unknown' && !(typeof t === 'string' && isIntegral(t))) {
          this.err(s.e.span.line, s.e.span.col, 'switch quantity not an integer',
            'switch only works with whole-number types such as int or char. For a string or decimal use if / else if.');
        }
        const seen = new Map<string, number>();
        for (const b of s.body.body) {
          if (b.s === 'case' && b.value) {
            const key = this.constKey(b.value);
            if (key !== null) {
              if (seen.has(key)) this.err(b.value.span.line, b.value.span.col, 'duplicate case value', 'Two case labels have the same value. Each case must be different.');
              seen.set(key, b.line);
            }
          }
        }
        this.switchDepth++;
        this.stmt(s.body);
        this.switchDepth--;
        break;
      }
      case 'case':
        if (this.switchDepth === 0) {
          this.err(s.line, s.span.col, s.value ? `case label '${this.prog.src.slice(s.value.span.start, s.value.span.end)}' not within a switch statement` : "'default' label not within a switch statement");
        } else if (s.value) {
          const t = this.type(s.value);
          if (s.value.k !== 'lit' && !(s.value.k === 'un' && s.value.e.k === 'lit')) {
            const v = s.value.k === 'id' ? this.lookup(s.value.name) : undefined;
            if (!(v && v.isConst)) this.err(s.value.span.line, s.value.span.col, `the value of '${this.prog.src.slice(s.value.span.start, s.value.span.end)}' is not usable in a constant expression`, 'case labels must be fixed values like 1 or \'A\', not variables.');
          } else if (t !== 'unknown' && !(typeof t === 'string' && isIntegral(t))) {
            this.err(s.value.span.line, s.value.span.col, 'case label does not reduce to an integer constant', 'case labels must be whole numbers or characters.');
          }
        }
        break;
      case 'break':
        if (this.loopDepth === 0 && this.switchDepth === 0) this.err(s.line, s.span.col, 'break statement not within loop or switch', 'break can only be used inside a loop or a switch.');
        break;
      case 'continue':
        if (this.loopDepth === 0) this.err(s.line, s.span.col, 'continue statement not within a loop', 'continue can only be used inside a loop.');
        break;
      case 'return': {
        const fn = this.curFn;
        if (s.e) {
          const t = this.type(s.e);
          if (fn && fn.ret === 'void' && t !== 'void') {
            this.err(s.line, s.span.col, `return-statement with a value, in function returning 'void' [-fpermissive]`, `${fn.name}() is void, so it cannot give back a value. Remove the value, or change void to the right type.`);
          } else if (fn && fn.ret !== 'void') {
            if (fn.retRef) this.refBind(fn.ret, s.e, t, false);
            else this.convCheck(fn.ret, t, s.e, 'return');
            const x = unparen(s.e);
            if ((isPtr(fn.ret) || fn.retRef) && ((x.k === 'un' && x.op === '&' && unparen(x.e).k === 'id') || (fn.retRef && x.k === 'id'))) {
              const name = x.k === 'id' ? x.name : (unparen((x as { e: Expr }).e) as { name: string }).name;
              const v = this.scopes.length > 1 ? this.lookupLocal(name) : undefined;
              if (v && !v.isRef && !v.arrParam) this.warn(s.line, s.span.col, `${fn.retRef ? 'reference' : 'address'} of local variable '${name}' returned [-Wreturn-local-addr]`,
                `${name} is destroyed when ${fn.name}() ends, so the caller gets a ${fn.retRef ? 'reference' : 'pointer'} to memory that no longer exists (a dangling ${fn.retRef ? 'reference' : 'pointer'}).`);
            }
          }
        } else if (fn && fn.ret !== 'void' && fn.name !== 'main') {
          this.err(s.line, s.span.col, `return-statement with no value, in function returning '${tyName(fn.ret)}' [-fpermissive]`, `${fn.name}() must give back a ${tyName(fn.ret)}: write return something;`);
        }
        break;
      }
      case 'delete': {
        const t = this.type(s.e);
        if (t !== 'unknown' && !isPtr(t) && !isArr(t)) {
          this.err(s.line, s.span.col, `type '${tyName(t)}' argument given to 'delete', expected pointer`, 'delete only works on a pointer that came from new.');
        } else if (t !== 'unknown' && isArr(t)) {
          this.warn(s.line, s.span.col, `'delete${s.arr ? '[]' : ''}' applied to an array that was not made with new`, 'Only memory from new can be deleted. Normal arrays are freed automatically.');
        }
        break;
      }
      case 'empty':
        break;
    }
  }

  lookupLocal(name: string): VarInfo | undefined {
    for (let i = this.scopes.length - 1; i >= 1; i--) {
      const v = this.scopes[i].get(name);
      if (v) return v;
    }
    return undefined;
  }

  scoped(s: Stmt) {
    if (s.s === 'block') this.stmt(s);
    else {
      this.scopes.push(new Map());
      this.stmt(s);
      this.scopes.pop();
    }
  }

  constKey(e: Expr): string | null {
    if (e.k === 'lit') return String(e.v.v);
    if (e.k === 'un' && e.op === '-' && e.e.k === 'lit') return '-' + String(e.e.v.v);
    return null;
  }

  isStreamChain(e: Expr): boolean {
    if (e.k === 'bin' && (e.op === '<<' || e.op === '>>')) return this.isStreamChain(e.l);
    return e.k === 'id' && (e.name === 'cout' || e.name === 'cin' || e.name === 'cerr');
  }

  cond(c: Expr, where: string) {
    const t = this.type(c);
    if (t === 'string') {
      this.err(c.span.line, c.span.col, `could not convert '${this.src(c)}' from 'std::string' to 'bool'`, 'A condition must be true or false. Compare the string instead, e.g. name == "Ali".');
    } else if (t !== 'unknown' && isStructT(t)) {
      this.err(c.span.line, c.span.col, `could not convert '${this.src(c)}' from '${tyName(t)}' to 'bool'`, 'A whole struct is not true or false. Compare one of its fields instead.');
    } else if (t === 'void') {
      this.err(c.span.line, c.span.col, `could not convert '${this.src(c)}' from 'void' to 'bool'`, 'This function returns nothing (void), so it cannot be used as a condition.');
    }
    const inner = c.k === 'paren' ? null : c;
    const hasBareAssign = (e: Expr | null): boolean => {
      if (!e) return false;
      if (e.k === 'asg' && e.op === '=') return true;
      if (e.k === 'bin' && (e.op === '&&' || e.op === '||')) return hasBareAssign(e.l) || hasBareAssign(e.r);
      return false;
    };
    if (hasBareAssign(inner)) {
      this.warn(c.span.line, c.span.col, 'suggest parentheses around assignment used as truth value [-Wparentheses]',
        `You used = (assign) inside the ${where} condition. To compare use == . With = the variable is changed and the condition becomes true whenever the new value is not 0.`);
    }
  }

  src(e: { span: { start: number; end: number } }): string {
    return this.prog.src.slice(e.span.start, e.span.end);
  }

  // ------------------------------------------------------------ declarations
  decl(s: Extract<Stmt, { s: 'decl' }>) {
    const ty = s.ty;
    const scope = this.scopes[this.scopes.length - 1];
    const isGlobal = this.scopes.length === 1;
    const base = this.specTy(ty, ty.span.line, ty.span.col);
    for (const it of s.items) {
      if (ty.base === 'void' && it.ptr === 0) {
        this.err(it.span.line, it.span.col, `variable or field '${it.name}' declared void`, 'void means "no value", so a variable cannot be void. Use int, double, char, bool or string.');
        continue;
      }
      if (ty.base === 'auto' && !it.init) {
        this.err(it.span.line, it.span.col, `declaration of 'auto ${it.name}' has no initializer`, 'auto needs a starting value so the compiler can work out the type.');
      }
      // array sizes
      const dims: (number | null)[] = [];
      it.dims.forEach((d, k) => {
        if (!d) {
          if (k > 0) this.err(it.span.line, it.span.col, `declaration of '${it.name}' as multidimensional array must have bounds for all dimensions except the first`, 'Only the first [] may be empty: int m[][3] = {...};');
          dims.push(null);
          return;
        }
        const dt = this.type(d);
        if (dt !== 'unknown' && !(typeof dt === 'string' && isIntegral(dt))) {
          this.err(d.span.line, d.span.col, `size of array '${it.name}' has non-integral type '${tyName(dt)}'`, 'The size of an array must be a whole number.');
        }
        const n = this.constEval(d);
        if (n !== null && n <= 0) this.err(d.span.line, d.span.col, n === 0 ? `zero-size array '${it.name}'` : `size of array '${it.name}' is negative`, 'An array needs at least 1 element.');
        if (n === null && isGlobal) this.err(d.span.line, d.span.col, `array bound is not an integer constant before ']' token`, 'A global array needs a fixed size, e.g. const int N = 10; int a[N];');
        dims.push(n);
        if (n === null) (it as { vla?: boolean }).vla = true;
      });
      // an empty first dimension takes its size from the initializer
      if (dims.length && dims[0] === null && !(it as { vla?: boolean }).vla) {
        const init = it.init ? unparen(it.init) : null;
        if (init && init.k === 'list') dims[0] = init.items.length;
        else if (init && init.k === 'lit' && init.v.t === 'cstr' && dims.length === 1) dims[0] = (init.v.v as string).length + 1;
        else {
          this.err(it.span.line, it.span.col, `storage size of '${it.name}' isn't known`, 'An array needs a size: int a[5]; or a list of values: int a[] = {1, 2, 3};');
          dims[0] = 1;
        }
      }
      let vt: Ty = declTy(ty.base === 'auto' ? 'int' : base, it.ptr, dims.map((d) => d), ty.isConst && it.ptr > 0);
      if (it.init) {
        const init = it.init;
        if (ty.base === 'auto') {
          const t = this.type(init);
          if (t !== 'unknown') vt = t === 'cstr' ? ptrTo('char', true) : decay(t);
          if (t === 'void') this.err(it.span.line, it.span.col, `'void' value not ignored as it ought to be`);
        } else if (it.ref) {
          this.refBind(vt, init, this.type(init), ty.isConst);
        } else if (isArr(vt)) {
          if ((it as { vla?: boolean }).vla && init.k === 'list') {
            this.err(it.span.line, it.span.col, `variable-sized object '${it.name}' may not be initialized`, 'When the size comes from a variable, the array cannot get a { } list. Fill it with a loop instead.');
          } else this.listInit(vt, init, it.name);
        } else if (isStructT(vt) && unparen(init).k === 'list') {
          this.listInit(vt, init, it.name);
        } else {
          this.convCheck(vt, this.type(init), init, 'initialization', it.style);
        }
      } else if (it.ref) {
        this.err(it.span.line, it.span.col, `'${it.name}' declared as reference but not initialized`, `A reference must be joined to a variable when it is created: ${ty.text}& ${it.name} = someVariable;`);
      }
      if (ty.isConst && !it.init && ty.base !== 'string' && ty.base !== 'struct' && it.ptr === 0) {
        this.err(it.span.line, it.span.col, `uninitialized 'const ${it.name}' [-fpermissive]`, 'A const must get its value when it is created, e.g. const int MAX = 10;');
      }
      const prev = scope.get(it.name);
      if (prev) {
        this.err(it.span.line, it.span.col, `redeclaration of '${ty.text} ${it.name}'`,
          `A variable called ${it.name} already exists in this block (line ${prev.line}). To change its value, drop the type: ${it.name} = ...;`,
          [{ kind: 'note', line: prev.line, col: prev.col, msg: `'${prev.text} ${it.name}' previously declared here` }]);
      }
      if (isGlobal && this.sigs.some((f) => f.name === it.name)) {
        this.err(it.span.line, it.span.col, `'${ty.text} ${it.name}' redeclared as different kind of entity`, `${it.name} is already the name of a function.`);
      }
      let cval: number | undefined;
      if (ty.isConst && it.ptr === 0 && !it.dims.length && it.init && typeof base === 'string' && isIntegral(base)) cval = this.constEval(it.init) ?? undefined;
      scope.set(it.name, { ty: vt, isConst: ty.isConst && it.ptr === 0, isRef: it.ref, text: ty.text, line: it.span.line, col: it.span.col, cval });
    }
  }

  /** check { ... } against an array or struct type */
  listInit(t: Ty, init: Expr, name: string) {
    const e = unparen(init);
    if (isArr(t)) {
      if (e.k === 'lit' && e.v.t === 'cstr') {
        if (!isCharType(t.of as string)) {
          this.err(e.span.line, e.span.col, `array must be initialized with a brace-enclosed initializer`, 'Only a char array can be filled with text in quotes.');
        } else if (t.n !== null && (e.v.v as string).length + 1 > t.n) {
          this.err(e.span.line, e.span.col, `initializer-string for '${tyName(t)}' is too long [-fpermissive]`,
            `"${e.v.v}" needs ${(e.v.v as string).length + 1} chars (including the hidden '\\0' at the end), but the array only has ${t.n}.`);
        }
        return;
      }
      if (e.k !== 'list') {
        const it = this.type(e);
        if (it !== 'unknown') this.err(e.span.line, e.span.col, `array must be initialized with a brace-enclosed initializer`, 'To copy an array, use a loop. To give starting values, use { }.');
        return;
      }
      const aggElem = isArr(t.of) || isStructT(t.of);
      if (aggElem && e.items.length && e.items.every((it) => unparen(it).k !== 'list') && !(isArr(t.of) && isCharType(t.of.of as string))) {
        // brace elision: int m[2][2] = {1, 2, 3, 4} fills the boxes in order
        const leaves = t.n !== null ? this.layouts.leaves(t) : [];
        if (t.n !== null && e.items.length > leaves.length) {
          this.err(e.items[leaves.length].span.line, e.items[leaves.length].span.col, `too many initializers for '${tyName(t)}'`, `${name} has room for ${leaves.length} values.`);
        }
        e.items.forEach((item, k) => {
          const lt = leaves[k]?.ty ?? (isArr(t.of) ? t.of.of : 'int');
          this.convCheck(lt, this.type(item), item, 'initialization', '{}');
        });
        return;
      }
      if (t.n !== null && e.items.length > t.n) {
        this.err(e.items[t.n].span.line, e.items[t.n].span.col, `too many initializers for '${tyName(t)}'`, `${name} has room for ${t.n} value${t.n === 1 ? '' : 's'}, but the list has ${e.items.length}.`);
      }
      for (const item of e.items) {
        if (isArr(t.of) || (isStructT(t.of) && unparen(item).k === 'list')) this.listInit(t.of, item, name);
        else if (unparen(item).k === 'list') this.err(item.span.line, item.span.col, `braces around scalar initializer for type '${tyName(t.of)}'`, 'Too many { } here: this array has only one dimension.');
        else this.convCheck(t.of, this.type(item), item, 'initialization', '{}');
      }
      return;
    }
    if (isStructT(t)) {
      if (e.k !== 'list') {
        this.convCheck(t, this.type(e), e, 'initialization');
        return;
      }
      const fields = this.structFields.get(t.name) ?? [];
      if (e.items.length > fields.length) {
        this.err(e.items[fields.length].span.line, e.items[fields.length].span.col, `too many initializers for '${t.name}'`, `${t.name} has only ${fields.length} field${fields.length === 1 ? '' : 's'}.`);
      }
      e.items.forEach((item, k) => {
        const f = fields[k];
        if (!f) return;
        if (isArr(f.ty) || (isStructT(f.ty) && unparen(item).k === 'list')) this.listInit(f.ty, item, `${name}.${f.name}`);
        else this.convCheck(f.ty, this.type(item), item, 'initialization', '{}');
      });
    }
  }

  isNullConst(e: Expr): boolean {
    const x = unparen(e);
    return x.k === 'lit' && ((x.v.t === 'ptr') || (typeof x.v.v === 'bigint' && x.v.v === BigInt(0) && x.v.t === 'int'));
  }

  /** binding a reference to an expression */
  refBind(to: Ty, e: Expr, from: SType, isConstRef: boolean) {
    if (from === 'unknown') return;
    const lv = this.isLvalueExpr(e);
    if (!lv && !isConstRef) {
      this.err(e.span.line, e.span.col, `cannot bind non-const lvalue reference of type '${tyName(to)}&' to an rvalue of type '${tyName(from)}'`,
        'A reference (&) must be joined to a real variable, not to a value or a calculation.');
      return;
    }
    if (!tyEq(to, from) && !isConstRef) {
      this.err(e.span.line, e.span.col, `cannot bind reference of type '${tyName(to)}&' to '${tyName(from)}'`, `The reference is ${tyName(to)}&, so it can only join a ${tyName(to)} variable.`);
      return;
    }
    if (isConstRef) this.convCheck(to, from, e, 'initialization');
  }

  isLvalueExpr(e: Expr): boolean {
    const x = unparen(e);
    if (x.k === 'id') return !!this.lookup(x.name);
    if (x.k === 'idx' || x.k === 'mem') return true;
    if (x.k === 'un' && (x.op === '*' || (!x.postfix && (x.op === '++' || x.op === '--')))) return true;
    if (x.k === 'asg') return true;
    if (x.k === 'call' && x.fn !== undefined) return !!this.sigs.find((s) => s.index === x.fn)?.retRef;
    return false;
  }

  convCheck(to: Ty, from0: SType, e: Expr, ctx: 'initialization' | 'assignment' | 'return' | 'argument', style: '=' | '{}' | '()' | null = '=') {
    if (from0 === 'unknown') return;
    const line = e.span.line;
    const col = e.span.col;
    const cctx = ctx === 'argument' ? 'argument passing' : ctx;
    if (from0 === 'void') {
      this.err(line, col, `void value not ignored as it ought to be`, 'This function returns nothing (void), so its result cannot be stored or used.');
      return;
    }
    const from: Ty = from0 === 'cstr' ? from0 : decay(from0);
    const fn = tyName(from0, e.k === 'lit' && e.v.t === 'cstr' ? (e.v.v as string).length : undefined);
    if (to === 'string') {
      if (from === 'string' || from === 'cstr') return;
      if (isPtr(from) && isCharType(from.to as string)) return;
      if (typeof from === 'string' && isArith(from)) {
        if (ctx === 'initialization' && style !== '{}') {
          this.err(line, col, `conversion from '${fn}' to non-scalar type 'std::string' requested`,
            isCharType(from) ? 'A string cannot be created from a single char with =. Use double quotes: string s = "A";' : 'A number is not text. Put it in double quotes, or use to_string(number).');
        }
        return;
      }
      this.err(line, col, `conversion from '${fn}' to non-scalar type 'std::string' requested`);
      return;
    }
    if (typeof to === 'string' && isArith(to)) {
      if (from === 'string') {
        this.err(line, col, `cannot convert 'std::string' to '${to}' in ${cctx}`, `Text cannot be stored in a ${to} variable. Use a string variable, or stoi() to turn digits into a number.`);
      } else if (from === 'cstr') {
        if (to !== 'bool') this.err(line, col, `invalid conversion from 'const char*' to '${to}' [-fpermissive]`, `Anything inside double quotes is text, not a number. Remove the quotes to store a number in a ${to}.`);
      } else if (isPtr(from)) {
        if (to !== 'bool') this.err(line, col, `invalid conversion from '${tyName(from)}' to '${to}' [-fpermissive]`,
          isArr(from0) ? `${this.src(e)} is a whole array. Pick one element with [index].` : `This is an address (a pointer), not a number. Use * to get the value it points to: *${this.src(e)}`);
      } else if (isStructT(from)) {
        this.err(line, col, `cannot convert '${tyName(from)}' to '${to}' in ${cctx}`, `A whole struct cannot be stored in a ${to}. Pick one field, e.g. ${this.src(e)}.fieldName`);
      } else if (from === 'ostream' || from === 'istream' || from === 'manip') {
        this.err(line, col, `cannot convert '${tyName(from)}' to '${to}' in ${cctx}`);
      } else if (style === '{}' && isFloating(from as string) && isIntegral(to)) {
        const lit = e.k === 'lit' || (e.k === 'un' && e.e.k === 'lit');
        if (lit) this.err(line, col, `narrowing conversion of '${this.src(e)}' from '${from}' to '${to}' [-Wnarrowing]`, 'Braces { } do not allow a decimal to be squeezed into an int. Use an int value or a double variable.');
        else this.warn(line, col, `narrowing conversion of '${this.src(e)}' from '${from}' to '${to}' [-Wnarrowing]`, 'The decimal part will be lost.');
      }
      return;
    }
    if (isPtr(to)) {
      if (from === NULLPTR_T || this.isNullConst(e)) return;
      if (from === 'cstr') {
        if (isCharType(to.to as string)) {
          if (!to.cto) this.warn(line, col, `ISO C++ forbids converting a string constant to 'char*' [-Wwrite-strings]`, 'Text in quotes cannot be changed. Use const char* (or better: string).');
          return;
        }
        this.err(line, col, `cannot convert 'const char*' to '${tyName(to)}' in ${cctx}`);
        return;
      }
      if (isPtr(from)) {
        const okTarget = tyEq(to.to, from.to) || to.to === 'void';
        if (!okTarget) {
          this.err(line, col, `cannot convert '${tyName(from0)}' to '${tyName(to)}' in ${cctx}`,
            `A ${tyName(to)} can only hold the address of a ${tyName(to.to)}.`);
        } else if (from.cto && !to.cto) {
          this.err(line, col, `invalid conversion from '${tyName(from)}' to '${tyName(to)}' [-fpermissive]`, 'This address points to a const value, so the pointer must be const too: const ' + tyName(to));
        }
        return;
      }
      if (typeof from === 'string' && isArith(from)) {
        this.err(line, col, `invalid conversion from '${fn}' to '${tyName(to)}' [-fpermissive]`,
          `A pointer stores an ADDRESS, not a number. Use & to take the address of a variable: &${this.src(e)}`);
        return;
      }
      this.err(line, col, `cannot convert '${fn}' to '${tyName(to)}' in ${cctx}`);
      return;
    }
    if (isStructT(to)) {
      if (isStructT(from) && from.name === to.name) return;
      this.err(line, col, `conversion from '${fn}' to non-scalar type '${to.name}' requested`, `Only another ${to.name} (or a { } list) can be stored in a ${to.name} variable.`);
      return;
    }
    if (isArr(to)) {
      this.err(line, col, ctx === 'assignment' ? 'invalid array assignment' : 'array must be initialized with a brace-enclosed initializer',
        'Arrays cannot be copied with =. Copy them element by element with a loop.');
    }
  }

  // ------------------------------------------------------------ expressions
  nameType(e: Extract<Expr, { k: 'id' }>): SType {
    if (e.global) {
      const g = this.scopes[0].get(e.name);
      if (g) return g.ty;
      this.err(e.span.line, e.span.col, `'::${e.name}' has not been declared`, `::${e.name} means the GLOBAL ${e.name}, but there is no global variable with that name.`);
      return 'unknown';
    }
    const v = this.lookup(e.name);
    if (v && !e.qual) return v.ty;
    if (this.sigs.some((s) => s.name === e.name)) {
      this.err(e.span.line, e.span.col, `invalid use of function '${e.name}'`, `${e.name} is a function. To call it, add brackets: ${e.name}(...)`);
      return 'unknown';
    }
    const info = STD_OBJECTS[e.name];
    if (info) {
      if (!this.headers.has(info.header)) {
        this.err(e.span.line, e.span.col, `'${e.qual ? 'std::' : ''}${e.name}' was not declared in this scope`,
          `${e.name} lives in the <${info.header}> library. Add #include <${info.header}> at the top of the file.`,
          [{ kind: 'note', line: 1, col: 1, msg: `'std::${e.name}' is defined in header '<${info.header}>'; did you forget to '#include <${info.header}>'?` }]);
        return 'unknown';
      }
      if (!e.qual && !this.prog.usingStd) {
        this.err(e.span.line, e.span.col, `'${e.name}' was not declared in this scope; did you mean 'std::${e.name}'?`,
          `${e.name} belongs to the std namespace. Add 'using namespace std;' below the #include line, or write std::${e.name}.`);
        return 'unknown';
      }
      return info.type;
    }
    const names = [...this.allNames(), ...Object.keys(STD_OBJECTS)];
    const ci = names.find((n) => n.toLowerCase() === e.name.toLowerCase());
    const close = ci ?? names.find((n) => n.length > 2 && levenshtein(n, e.name) === 1);
    let help = HELP_SPACE(e.name);
    if (ci) help = `C++ is case-sensitive: ${e.name} and ${ci} are different names. Write ${ci}.`;
    else if (close) help = `Did you mean ${close}? Check the spelling.`;
    else if (/^[A-Za-z]+$/.test(e.name) && /^[A-Z]/.test(e.name)) help += ` If ${e.name} is meant to be text, put it in double quotes: "${e.name}".`;
    this.err(e.span.line, e.span.col, `'${e.name}' was not declared in this scope`, help);
    return 'unknown';
  }

  /** is this lvalue read-only? returns a g++-style description or null */
  readOnly(e0: Expr): { what: string; help: string } | null {
    const e = unparen(e0);
    if (e.k === 'id') {
      const v = this.lookup(e.name);
      if (v?.isConst) return { what: `read-only variable '${e.name}'`, help: `${e.name} was declared const, so it cannot be changed after it is created.` };
      return null;
    }
    if (e.k === 'idx') {
      const ot = this.peekType(e.obj);
      if (ot !== 'unknown' && isArr(ot) && this.readOnly(e.obj)) return { what: `read-only location '${this.src(e)}'`, help: 'The array is const, so its elements cannot change.' };
      if (ot !== 'unknown' && isPtr(ot) && ot.cto) return { what: `read-only location '${this.src(e)}'`, help: 'This pointer points to const values, so you cannot change them through it.' };
      return null;
    }
    if (e.k === 'un' && e.op === '*') {
      const pt = this.peekType(e.e);
      if (pt !== 'unknown' && isPtr(pt) && pt.cto) return { what: `read-only location '${this.src(e)}'`, help: 'The pointer was declared as pointing to const, so *p cannot be changed.' };
      return null;
    }
    if (e.k === 'mem') {
      const ot = this.peekType(e.obj);
      if (e.arrow) {
        if (ot !== 'unknown' && isPtr(ot) && ot.cto) return { what: `member '${this.structName(ot.to)}::${e.name}' in read-only object`, help: 'The struct is const here, so its fields cannot change.' };
        return null;
      }
      if (this.readOnly(e.obj)) return { what: `member '${this.structName(ot)}::${e.name}' in read-only object`, help: 'The struct is const here (e.g. a const & parameter), so its fields cannot change.' };
      const sn = this.structName(ot);
      const f = sn ? this.structFields.get(sn)?.find((x) => x.name === e.name) : undefined;
      if (f?.isConst) return { what: `read-only member '${sn}::${e.name}'`, help: `${e.name} is a const field.` };
      return null;
    }
    return null;
  }

  structName(t: SType): string {
    return t !== 'unknown' && isStructT(t) ? t.name : '?';
  }

  /** type without reporting errors (used by readOnly) */
  peekType(e: Expr): SType {
    const n = this.errors.length;
    const g = this.groups.length;
    const w = this.warnings.length;
    const t = this.type(e);
    this.errors.length = n;
    this.groups.length = g;
    this.warnings.length = w;
    return t;
  }

  type(e: Expr): SType {
    switch (e.k) {
      case 'lit':
        if (e.v.t === 'ptr') return NULLPTR_T;
        return e.v.t as Ty;
      case 'val':
        return e.v.t as Ty;
      case 'list':
        e.items.forEach((i) => this.type(i));
        return 'unknown';
      case 'id':
        return this.nameType(e);
      case 'paren':
        return this.type(e.e);
      case 'sizeof':
        if (e.e) {
          const t = this.type(e.e);
          const x = unparen(e.e);
          if (x.k === 'id') {
            const v = this.lookup(x.name);
            if (v?.arrParam && t !== 'unknown') {
              this.warn(e.span.line, e.span.col, `'sizeof' on array function parameter '${x.name}' will return size of '${tyName(t)}' [-Wsizeof-array-argument]`,
                `Inside the function, ${x.name} is really a pointer, so sizeof gives 8 (the size of an address), NOT the size of the array. Pass the size as another parameter.`);
            }
          }
        }
        return 'unsigned long long';
      case 'cast': {
        const t = this.type(e.e);
        if (t === 'string' && isArith(e.ty.base)) {
          this.err(e.span.line, e.span.col, `invalid ${e.style === 'static' ? 'static_cast' : 'cast'} from type 'std::string' to type '${e.ty.base}'`, 'Text cannot be cast to a number. Use stoi() or stod() instead.');
        }
        return baseTy(e.ty);
      }
      case 'new': {
        const bt = this.specTy(e.ty, e.span.line, e.span.col);
        const t = declTy(bt, e.ptr, []);
        if (e.dim) {
          const dt = this.type(e.dim);
          if (dt !== 'unknown' && !(typeof dt === 'string' && isIntegral(dt))) this.err(e.dim.span.line, e.dim.span.col, `size in array new must have integral type`, 'The number of elements must be a whole number.');
          if (e.init) this.listInit(arrOf(t, this.constEval(e.dim)), e.init, 'new array');
        } else if (e.init) {
          if (unparen(e.init).k === 'list') this.listInit(t, e.init, 'new object');
          else this.convCheck(t, this.type(e.init), e.init, 'initialization');
        }
        return ptrTo(t);
      }
      case 'mem': {
        const ot = this.type(e.obj);
        if (ot === 'unknown') return 'unknown';
        let st: Ty | null = null;
        if (e.arrow) {
          if (isPtr(ot) && isStructT(ot.to)) st = ot.to;
          else if (isStructT(ot)) {
            this.err(e.nameSpan.line, e.nameSpan.col, `base operand of '->' has non-pointer type '${tyName(ot)}'`, `${this.src(e.obj)} is a struct, not a pointer. Use a dot: ${this.src(e.obj)}.${e.name}`);
            return 'unknown';
          } else {
            this.err(e.nameSpan.line, e.nameSpan.col, `base operand of '->' is not a pointer`, '-> is only for a pointer to a struct.');
            return 'unknown';
          }
        } else {
          if (isStructT(ot)) st = ot;
          else if (isPtr(ot) && isStructT(ot.to)) {
            this.err(e.nameSpan.line, e.nameSpan.col, `request for member '${e.name}' in '${this.src(e.obj)}', which is of pointer type '${tyName(ot)}' (maybe you meant to use '->' ?)`,
              `${this.src(e.obj)} is a pointer. Use ${this.src(e.obj)}->${e.name}  (or (*${this.src(e.obj)}).${e.name}).`);
            return 'unknown';
          } else {
            this.err(e.nameSpan.line, e.nameSpan.col, `request for member '${e.name}' in '${this.src(e.obj)}', which is of non-class type '${tyName(ot)}'`,
              `Only a struct has fields that you reach with a dot.`);
            return 'unknown';
          }
        }
        const sn = (st as { name: string }).name;
        const fields = this.structFields.get(sn) ?? [];
        const f = fields.find((x) => x.name === e.name);
        if (!f) {
          const near = fields.find((x) => levenshtein(x.name, e.name) <= 2);
          this.err(e.nameSpan.line, e.nameSpan.col, `'struct ${sn}' has no member named '${e.name}'${near ? `; did you mean '${near.name}'?` : ''}`,
            near ? `Spelling: the field is called ${near.name}.` : `${sn} has these fields: ${fields.map((x) => x.name).join(', ')}.`);
          return 'unknown';
        }
        return f.ty;
      }
      case 'un': {
        if (e.op === '&') {
          const t = this.type(e.e);
          if (t === 'unknown') return t;
          const ro = this.readOnly(e.e);
          return ptrTo(t, !!ro);
        }
        const t = this.type(e.e);
        if (e.op === '*') {
          if (t === 'unknown') return t;
          if (isPtr(t)) {
            if (t.to === 'void') {
              this.err(e.span.line, e.span.col, `'void*' is not a pointer-to-object type`, t === NULLPTR_T ? 'nullptr points to nothing, so it cannot be dereferenced.' : undefined);
              return 'unknown';
            }
            return t.to;
          }
          if (isArr(t)) return t.of;
          this.err(e.span.line, e.span.col, `invalid type argument of unary '*' (have '${tyName(t)}')`,
            `* (dereference) only works on a pointer. ${this.src(e.e)} is a ${tyName(t)}, not an address.`);
          return 'unknown';
        }
        if (e.op === '++' || e.op === '--') {
          const word = e.op === '++' ? 'increment' : 'decrement';
          const ro = this.readOnly(e.e);
          if (ro) this.err(e.span.line, e.span.col, `${word} of ${ro.what}`, ro.help);
          else if (t === 'bool') this.err(e.span.line, e.span.col, `use of an operand of type 'bool' in 'operator${e.op}' is forbidden in C++17`, 'You cannot add 1 to a bool. Assign true or false instead.');
          else if (t === 'string') this.err(e.span.line, e.span.col, `no match for 'operator${e.op}' (operand type is 'std::string')`, `${e.op} only works on numbers and chars.`);
          else if (t !== 'unknown' && isArr(t)) this.err(e.span.line, e.span.col, `lvalue required as ${word} operand`, 'An array name always stays at the start of the array. Use a pointer (int* p = arr;) and move p instead.');
          else if (t !== 'unknown' && isStructT(t)) this.err(e.span.line, e.span.col, `no match for 'operator${e.op}' (operand type is '${tyName(t)}')`);
          return t;
        }
        if (e.op === '!' && (t === 'ostream' || t === 'istream')) return 'bool';
        if (t === 'string' || t === 'ostream' || t === 'istream' || (t !== 'unknown' && isStructT(t))) {
          this.err(e.span.line, e.span.col, `no match for 'operator${e.op}' (operand type is '${tyName(t)}')`);
          return 'unknown';
        }
        if (e.op === '!') return 'bool';
        if (t === 'unknown') return t;
        if (isPtr(t) || isArr(t)) {
          this.err(e.span.line, e.span.col, `wrong type argument to unary ${e.op === '-' ? 'minus' : e.op === '+' ? 'plus' : 'complement'}`);
          return 'unknown';
        }
        return typeof t === 'string' && isArith(t) ? promote(t as ValType) as Ty : t;
      }
      case 'bin':
        return this.binType(e);
      case 'asg': {
        const lt = this.type(e.l);
        const rIsList = unparen(e.r).k === 'list';
        const rt = rIsList ? 'unknown' : this.type(e.r);
        const ro = this.readOnly(e.l);
        if (ro) this.err(e.opSpan.line, e.opSpan.col, `assignment of ${ro.what}`, ro.help);
        if (lt === 'ostream' || lt === 'istream') {
          this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator${e.op}' (operand types are '${tyName(lt)}' and '${tyName(rt)}')`);
          return 'unknown';
        }
        if (lt === 'unknown') return lt;
        if (isArr(lt)) {
          this.err(e.opSpan.line, e.opSpan.col, e.op === '=' ? 'invalid array assignment' : `invalid operands to ${e.op}`, 'Arrays cannot be copied or changed as a whole with =. Use a loop to copy them element by element.');
          return 'unknown';
        }
        if (e.op === '=') {
          if (rIsList) {
            if (isStructT(lt)) this.listInit(lt, e.r, this.src(e.l));
          } else if (lt !== 'cstr') this.convCheck(lt, rt, e.r, 'assignment');
        } else {
          const bop = e.op.slice(0, -1);
          if (lt === 'string') {
            if (bop !== '+') this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator${e.op}' (operand types are 'std::string' and '${tyName(rt)}')`, 'Only += works with strings (it adds text to the end).');
          } else if (isPtr(lt)) {
            if (!(bop === '+' || bop === '-') || !(typeof rt === 'string' && isIntegral(rt))) {
              if (rt !== 'unknown') this.err(e.opSpan.line, e.opSpan.col, `invalid operands of types '${tyName(lt)}' and '${tyName(rt)}' to binary 'operator${bop}'`, 'A pointer can only move forward or back by a whole number: p += 2;');
            }
          } else if (isStructT(lt)) {
            this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator${e.op}' (operand types are '${tyName(lt)}' and '${tyName(rt)}')`, 'Arithmetic does not work on a whole struct. Use one of its fields.');
          } else if (bop === '%' && (isFloating(lt as string) || (typeof rt === 'string' && isFloating(rt)))) {
            this.err(e.opSpan.line, e.opSpan.col, `invalid operands of types '${tyName(lt)}' and '${tyName(rt)}' to binary 'operator%'`, '% (remainder) only works with whole numbers. Use int variables, or fmod() for decimals.');
          } else if (rt === 'string' || rt === 'cstr' || (rt !== 'unknown' && (isPtr(rt) || isArr(rt) || isStructT(rt)))) {
            this.err(e.opSpan.line, e.opSpan.col, `invalid operands to ${e.op}: '${tyName(lt)}' and '${tyName(rt)}'`);
          }
        }
        return lt;
      }
      case 'cond': {
        this.cond(e.c, 'ternary');
        const a = this.type(e.a);
        const b = this.type(e.b);
        if (a === 'unknown' || b === 'unknown') return 'unknown';
        if (typeof a === 'string' && typeof b === 'string' && isArith(a) && isArith(b)) return commonType(a as ValType, b as ValType) as Ty;
        if ((a === 'string' || a === 'cstr') && (b === 'string' || b === 'cstr')) return a === b ? a : 'string';
        return a;
      }
      case 'call':
        return this.callType(e);
      case 'mcall': {
        const ot = this.type(e.obj);
        const at = e.args.map((a) => this.type(a));
        if (ot === 'unknown') return 'unknown';
        if (ot === 'istream' && (e.name === 'ignore' || e.name === 'get')) return e.name === 'get' ? 'int' : 'istream';
        if (ot === 'istream' && e.name === 'getline') {
          const t0 = at[0];
          if (t0 !== 'unknown' && !(isArr(t0) && isCharType(t0.of as string)) && !(isPtr(t0) && isCharType(t0.to as string))) {
            this.err(e.span.line, e.span.col, `no matching function for call to 'std::istream::getline(${at.map((t) => tyName(t)).join(', ')})'`,
              t0 === 'string' ? 'For a string use getline(cin, s); — cin.getline(...) is for char arrays.' : 'cin.getline(arr, size) reads a line into a char array.');
          }
          return 'istream';
        }
        if (ot !== 'string') {
          this.err(e.span.line, e.span.col, `request for member '${e.name}' in '${this.src(e.obj)}', which is of non-class type '${tyName(ot)}'`,
            isArr(ot) || isPtr(ot) ? `An array has no .${e.name}(). Keep the size in a separate variable (or use sizeof(arr) / sizeof(arr[0]) where the array was created).` : `.${e.name}() only works on strings.`);
          return 'unknown';
        }
        const r = STRING_METHODS[e.name];
        if (!r) {
          const near = Object.keys(STRING_METHODS).find((m) => levenshtein(m, e.name) <= 2);
          this.err(e.span.line, e.span.col, `'std::string' has no member named '${e.name}'${near ? `; did you mean '${near}'?` : ''}`, near ? `Spelling: it is .${near}()` : undefined);
          return 'unknown';
        }
        return r;
      }
      case 'idx': {
        const ot = this.type(e.obj);
        const it = this.type(e.i);
        if (it !== 'unknown' && !(typeof it === 'string' && isIntegral(it))) {
          if (ot !== 'unknown') this.err(e.i.span.line, e.i.span.col, `invalid types '${tyName(ot)}[${tyName(it)}]' for array subscript`, 'The index inside [ ] must be a whole number (int), like arr[2] or arr[i].');
          return 'unknown';
        }
        if (ot === 'string') return 'char';
        if (ot === 'cstr') return 'char';
        if (ot !== 'unknown') {
          const el = elemOf(ot);
          if (el) {
            if (el === 'void') {
              this.err(e.span.line, e.span.col, `'void*' is not a pointer-to-object type`);
              return 'unknown';
            }
            const idx = this.constEval(e.i);
            if (isArr(ot) && ot.n !== null && idx !== null && (idx >= ot.n || idx < 0)) {
              this.warn(e.span.line, e.span.col, `array subscript ${idx} is outside array bounds of '${tyName(ot)}' [-Warray-bounds]`,
                `${this.src(e.obj)} has ${ot.n} elements, numbered 0 to ${ot.n - 1}. Index ${idx} does not exist!`);
            }
            return el;
          }
          this.err(e.span.line, e.span.col, `invalid types '${tyName(ot)}[${tyName(it)}]' for array subscript`, `${this.src(e.obj)} is a ${tyName(ot)}, not an array — it holds one value, so it cannot be indexed with [ ].`);
        }
        return 'unknown';
      }
    }
  }

  binType(e: Extract<Expr, { k: 'bin' }>): SType {
    const L = this.type(e.l);
    if (e.op === '>>' && L === 'istream') {
      // cin >> target
      const r = e.r;
      const rt = this.type(r);
      if (rt === 'manip') {
        this.err(e.opSpan.line, e.opSpan.col, "no match for 'operator>>' (operand types are 'std::istream' and '<unresolved overloaded function type>')",
          'endl is only for output (cout). Remove << endl / >> endl from the cin line.');
        return 'istream';
      }
      if (!this.isLvalueExpr(r)) {
        if (rt !== 'unknown') this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator>>' (operand types are 'std::istream' and '${tyName(rt, r.k === 'lit' && r.v.t === 'cstr' ? (r.v.v as string).length : undefined)}')`,
          'cin >> must be followed by a variable name. It stores what the user types into that variable.');
        return 'istream';
      }
      if (rt !== 'unknown') {
        if (isArr(rt) && !isCharType(rt.of as string)) {
          this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator>>' (operand types are 'std::istream' and '${tyName(rt)}')`, `cin cannot read a whole array at once. Read one element at a time in a loop: cin >> ${this.src(r)}[i];`);
        } else if (isPtr(rt) && !isCharType(rt.to as string)) {
          this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator>>' (operand types are 'std::istream' and '${tyName(rt)}')`, `${this.src(r)} is a pointer. To read into the box it points to, write cin >> *${this.src(r)};`);
        } else if (isStructT(rt)) {
          this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator>>' (operand types are 'std::istream' and '${tyName(rt)}')`, `cin cannot read a whole struct. Read each field: cin >> ${this.src(r)}.fieldName;`);
        }
      }
      const ro = this.readOnly(r);
      if (ro) this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator>>' (operand types are 'std::istream' and 'const ${tyName(rt)}')`, `${this.src(r)} is const, so cin cannot store a new value in it.`);
      return 'istream';
    }
    const R = this.type(e.r);
    const src = (x: Expr) => this.src(x);
    const lenOf = (x: Expr) => (x.k === 'lit' && x.v.t === 'cstr' ? (x.v.v as string).length : undefined);
    const tn = (t: SType, x: Expr) => tyName(t, lenOf(x));
    if (L === 'unknown' || R === 'unknown') {
      if (['==', '!=', '<', '>', '<=', '>=', '&&', '||'].includes(e.op)) return 'bool';
      if (e.op === '<<' && L === 'ostream') return 'ostream';
      return 'unknown';
    }
    if (L === 'void' || R === 'void') {
      if (e.op === '<<' && L === 'ostream') {
        this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator<<' (operand types are 'std::ostream' and 'void')`,
          `${src(e.r)} is a void function — it does not give back a value, so there is nothing to print. Call it on its own line instead.`);
        return 'ostream';
      }
      this.err(e.opSpan.line, e.opSpan.col, `void value not ignored as it ought to be`, 'A void function gives back nothing, so it cannot be used in a calculation.');
      return 'unknown';
    }
    const isP = (t: Ty) => isPtr(t) || isArr(t);
    const isInt = (t: Ty) => typeof t === 'string' && isIntegral(t);
    const isNum = (t: Ty) => typeof t === 'string' && isArith(t);
    switch (e.op) {
      case ',':
        return R;
      case '<<':
        if (L === 'ostream') {
          if (R === 'ostream') {
            this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator<<' (operand types are 'std::basic_ostream<char>' and 'std::ostream')`,
              'cout cannot print cout itself. Remove the extra "<< cout" — write the values one after another: cout << a << b;');
          } else if (R === 'istream') {
            this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator<<' (operand types are 'std::ostream' and '${tyName(R)}')`);
          } else if (isStructT(R)) {
            this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator<<' (operand types are 'std::ostream' and '${tyName(R)}')`, `cout does not know how to print a whole struct. Print each field: cout << ${src(e.r)}.fieldName;`);
          }
          return 'ostream';
        }
        if (L === 'istream') {
          this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator<<' (operand types are 'std::istream' and '${tn(R, e.r)}')`,
            'cin reads input, so it uses >> (arrows point INTO the variable): cin >> x;');
          return 'unknown';
        }
        if (isInt(L) && isInt(R)) return promote(L as ValType) as Ty;
        this.err(e.opSpan.line, e.opSpan.col, `invalid operands of types '${tn(L, e.l)}' and '${tn(R, e.r)}' to binary 'operator<<'`);
        return 'unknown';
      case '>>':
        if (L === 'ostream') {
          this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator>>' (operand types are 'std::ostream' and '${tn(R, e.r)}')`,
            'cout prints, so it uses << (arrows point toward cout): cout << "Hi";');
          return 'unknown';
        }
        if (isInt(L) && isInt(R)) return promote(L as ValType) as Ty;
        this.err(e.opSpan.line, e.opSpan.col, `invalid operands of types '${tn(L, e.l)}' and '${tn(R, e.r)}' to binary 'operator>>'`);
        return 'unknown';
      case '+':
        if (L === 'string' || R === 'string') {
          const other = L === 'string' ? R : L;
          if (other === 'string' || other === 'cstr' || isCharType(other as string) || (isP(other) && isCharType(elemOf(other) as string))) return 'string';
          this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator+' (operand types are '${tn(L, e.l)}' and '${tn(R, e.r)}')`,
            'You cannot add a number to a string with +. Use to_string(number), or print them separately with <<.');
          return 'unknown';
        }
        if (L === 'cstr' && R === 'cstr') {
          this.err(e.opSpan.line, e.opSpan.col, `invalid operands of types '${tn(L, e.l)}' and '${tn(R, e.r)}' to binary 'operator+'`,
            'Two text literals cannot be joined with +. Use << between them in cout, or make one of them a string variable.');
          return 'unknown';
        }
        if ((L === 'cstr' && isInt(R)) || (R === 'cstr' && isInt(L))) {
          this.warn(e.opSpan.line, e.opSpan.col, `adding '${L === 'cstr' ? R : L}' to a string does not append to the string [-Wstring-plus-int]`,
            `"text" + number does NOT join them — it skips characters from the start of the text! Use << to print them one after another.`);
          return 'cstr';
        }
        if (isP(L) && isInt(R)) return decay(L);
        if (isInt(L) && isP(R)) return decay(R);
        if (isP(L) && isP(R)) {
          this.err(e.opSpan.line, e.opSpan.col, `invalid operands of types '${tn(L, e.l)}' and '${tn(R, e.r)}' to binary 'operator+'`, 'Two addresses cannot be added. You can subtract them (to count elements between) but not add.');
          return 'unknown';
        }
      // fallthrough
      case '-': case '*': case '/': {
        if (e.op === '-' && isP(L) && isInt(R)) return decay(L);
        if (e.op === '-' && isP(L) && isP(R)) {
          if (!tyEq(elemOf(L)!, elemOf(R)!)) this.err(e.opSpan.line, e.opSpan.col, `invalid operands of types '${tn(L, e.l)}' and '${tn(R, e.r)}' to binary 'operator-'`);
          return 'long long';
        }
        if (!isNum(L) || !isNum(R)) {
          const cls = L === 'string' || R === 'string' || L === 'ostream' || R === 'ostream' || L === 'istream' || R === 'istream' || isStructT(L) || isStructT(R);
          if (cls) this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator${e.op}' (operand types are '${tn(L, e.l)}' and '${tn(R, e.r)}')`,
            L === 'ostream' ? 'Put the calculation in brackets: cout << (a ' + e.op + ' b);' : isStructT(L) || isStructT(R) ? `${e.op} does not work on a whole struct. Use its fields.` : `${e.op} does not work with text.`);
          else this.err(e.opSpan.line, e.opSpan.col, `invalid operands of types '${tn(L, e.l)}' and '${tn(R, e.r)}' to binary 'operator${e.op}'`,
            isP(L) || isP(R) ? `You cannot ${e.op === '*' ? 'multiply' : e.op === '/' ? 'divide' : 'use ' + e.op + ' with'} an address. Use * to get the value first: *p` : `${e.op} only works with numbers.`);
          return 'unknown';
        }
        if ((e.op === '/') && isInt(L) && isInt(R) && e.r.k === 'lit' && e.r.v.v === BigInt(0)) {
          this.warn(e.opSpan.line, e.opSpan.col, 'division by zero [-Wdiv-by-zero]', 'Dividing a whole number by 0 crashes the program.');
        }
        return commonType(L as ValType, R as ValType) as Ty;
      }
      case '%':
        if (!isInt(L) || !isInt(R)) {
          this.err(e.opSpan.line, e.opSpan.col, `invalid operands of types '${tn(L, e.l)}' and '${tn(R, e.r)}' to binary 'operator%'`,
            '% gives the remainder of a WHOLE-number division, so both sides must be int (or char/long). Use fmod() for decimals.');
          return 'unknown';
        }
        if (e.r.k === 'lit' && e.r.v.v === BigInt(0)) this.warn(e.opSpan.line, e.opSpan.col, 'division by zero [-Wdiv-by-zero]');
        return commonType(L as ValType, R as ValType) as Ty;
      case '==': case '!=': case '<': case '>': case '<=': case '>=': {
        if (L === 'ostream' || L === 'istream' || R === 'ostream' || R === 'istream') {
          this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator${e.op}' (operand types are '${L === 'ostream' ? 'std::basic_ostream<char>' : tn(L, e.l)}' and '${tn(R, e.r)}')`,
            L === 'ostream' ? `<< is done before ${e.op}. Put the comparison in brackets: cout << (${src(e.l.k === 'bin' ? e.l.r : e.l)} ${e.op} ${src(e.r)});` : undefined);
          return 'bool';
        }
        if (isStructT(L) || isStructT(R)) {
          this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator${e.op}' (operand types are '${tn(L, e.l)}' and '${tn(R, e.r)}')`, 'Two structs cannot be compared directly. Compare their fields, e.g. a.age == b.age');
          return 'bool';
        }
        if (isP(L) || isP(R) || L === NULLPTR_T || R === NULLPTR_T) {
          const other = isP(L) ? R : L;
          const otherE = isP(L) ? e.r : e.l;
          if (isInt(other) && !this.isNullConst(otherE)) {
            this.err(e.opSpan.line, e.opSpan.col, 'ISO C++ forbids comparison between pointer and integer [-fpermissive]',
              `One side is an address and the other is a number. Did you mean *${src(isP(L) ? e.l : e.r)} (the value it points to)?`);
          } else if (other === 'string' || other === 'cstr') {
            if (!(isCharType(elemOf(isP(L) ? L : R) as string) && other === 'string')) {
              if (other === 'cstr') this.warn(e.opSpan.line, e.opSpan.col, 'comparison with string literal results in unspecified behavior [-Waddress]', 'This compares ADDRESSES, not text. Use strcmp(a, b) == 0 for char arrays, or use string.');
            }
          }
          return 'bool';
        }
        const strL = L === 'string' || L === 'cstr';
        const strR = R === 'string' || R === 'cstr';
        if (strL !== strR) {
          this.err(e.opSpan.line, e.opSpan.col, `no match for 'operator${e.op}' (operand types are '${tn(L, e.l)}' and '${tn(R, e.r)}')`,
            isCharType(L as string) || isCharType(R as string) ? "A char uses single quotes: compare with 'A', not \"A\"." : 'You can only compare text with text, and numbers with numbers.');
          return 'bool';
        }
        if (L === 'cstr' && R === 'cstr') {
          this.warn(e.opSpan.line, e.opSpan.col, 'comparison with string literal results in unspecified behavior [-Waddress]', 'Store the text in a string variable before comparing.');
        }
        const inner = e.l.k === 'bin' && ['<', '>', '<=', '>=', '==', '!='].includes(e.l.op) ? e.l : null;
        if (inner && ['<', '>', '<=', '>='].includes(e.op) && ['<', '>', '<=', '>='].includes(inner.op)) {
          this.warn(e.opSpan.line, e.opSpan.col, "comparisons like 'X<=Y<=Z' do not have their mathematical meaning [-Wparentheses]",
            `C++ checks ${src(inner)} first (true = 1, false = 0) and then compares that 1 or 0 with ${src(e.r)}. Write it with &&: ${src(inner.l)} ${inner.op} ${src(inner.r)} && ${src(inner.r)} ${e.op} ${src(e.r)}`);
        }
        return 'bool';
      }
      case '&&': case '||':
        for (const [t, x] of [[L, e.l], [R, e.r]] as const) {
          if (t === 'string' || isStructT(t)) this.err(x.span.line, x.span.col, `could not convert '${src(x)}' from '${tyName(t)}' to 'bool'`);
        }
        return 'bool';
      case '&': case '|': case '^':
        if (!isInt(L) || !isInt(R)) {
          this.err(e.opSpan.line, e.opSpan.col, `invalid operands of types '${tn(L, e.l)}' and '${tn(R, e.r)}' to binary 'operator${e.op}'`);
          return 'unknown';
        }
        return commonType(L as ValType, R as ValType) as Ty;
    }
    return 'unknown';
  }

  /** how well does an argument of type `from` fit a parameter? lower is better, null = not at all */
  convRank(p: Sig['params'][number], arg: Expr, from0: SType): number | null {
    if (from0 === 'unknown') return 1;
    if (p.ref && !p.isConst) {
      if (!this.isLvalueExpr(arg)) return null;
      return tyEq(p.ty, from0) ? 0 : null;
    }
    if (from0 === 'void') return null;
    const to = p.ty;
    const from: Ty = from0 === 'cstr' ? from0 : decay(from0);
    if (tyEq(to, from)) return 0;
    if (typeof to === 'string' && typeof from === 'string') {
      if (isArith(to) && isArith(from)) return promote(from as ValType) === to || (from === 'float' && to === 'double') ? 1 : 2;
      if (to === 'string' && from === 'cstr') return 2;
      return null;
    }
    if (to === 'string' && isPtr(from) && isCharType(from.to as string)) return 2;
    if (isPtr(to)) {
      if (from === NULLPTR_T || this.isNullConst(arg)) return 2;
      if (from === 'cstr') return isCharType(to.to as string) ? 1 : null;
      if (isPtr(from) && (tyEq(to.to, from.to) || to.to === 'void')) return from.cto && !to.cto ? null : 1;
      return null;
    }
    if (to === 'bool' && isPtr(from)) return 3;
    if (isStructT(to)) return isStructT(from) && from.name === to.name ? 0 : null;
    return null;
  }

  callType(e: Extract<Expr, { k: 'call' }>): SType {
    const local = this.lookup(e.name);
    if (local && !e.qual) {
      e.args.forEach((a) => this.type(a));
      this.err(e.span.line, e.span.col, `'${e.name}' cannot be used as a function`, `${e.name} is a variable, not a function.`);
      return 'unknown';
    }
    const user = this.sigs.filter((s) => s.name === e.name);
    if (user.length && !e.qual) return this.userCall(e, user);
    const argT = e.args.map((a) => this.type(a));
    const info = FUNCS[e.name];
    if (!info) {
      const near = this.sigs.find((s) => levenshtein(s.name, e.name) <= 1 || s.name.toLowerCase() === e.name.toLowerCase());
      this.err(e.span.line, e.span.col, `'${e.name}' was not declared in this scope`, near ? `Did you mean ${near.name}()? Check the spelling (C++ is case-sensitive).` : `There is no function called ${e.name}. Check the spelling.`);
      return 'unknown';
    }
    if (!this.headers.has(info.header)) {
      this.err(e.span.line, e.span.col, `'${e.name}' was not declared in this scope`,
        `${e.name}() comes from the <${info.header}> library. Add #include <${info.header}> at the top.`,
        [{ kind: 'note', line: 1, col: 1, msg: `'std::${e.name}' is defined in header '<${info.header}>'; did you forget to '#include <${info.header}>'?` }]);
      return 'unknown';
    }
    if (info.std && !e.qual && !this.prog.usingStd) {
      this.err(e.span.line, e.span.col, `'${e.name}' was not declared in this scope; did you mean 'std::${e.name}'?`, `Add 'using namespace std;' or write std::${e.name}.`);
      return 'unknown';
    }
    if (e.args.length < info.arity[0] || e.args.length > info.arity[1]) {
      this.err(e.span.line, e.span.col, `no matching function for call to '${e.name}(${argT.map((t) => tyName(t)).join(', ')})'`,
        `${e.name}() takes ${info.arity[0]} value${info.arity[0] === 1 ? '' : 's'} inside the brackets.`);
      return 'unknown';
    }
    const charPtrLike = (t: SType) => t === 'unknown' || t === 'cstr' || ((isArr(t) || isPtr(t)) && isCharType(elemOf(t) as string));
    switch (e.name) {
      case 'setw': case 'setprecision': case 'setfill':
        return 'manip';
      case 'getline':
        if (argT[0] !== 'istream' && argT[0] !== 'unknown') this.err(e.span.line, e.span.col, 'no matching function for call to getline', 'Use getline(cin, variableName);');
        if (argT[1] !== 'string' && argT[1] !== 'unknown') this.err(e.args[1].span.line, e.args[1].span.col, `no matching function for call to 'getline(std::istream&, ${tyName(argT[1])}&)'`,
          isArr(argT[1]) ? 'For a char array use cin.getline(arr, size);' : 'getline reads a whole line of text, so the variable must be a string.');
        return 'istream';
      case 'to_string':
        return 'string';
      case 'stoi':
        return 'int';
      case 'stod':
        return 'double';
      case 'max': case 'min': {
        const [a, b] = argT;
        if (a !== 'unknown' && b !== 'unknown' && !tyEq(a, b) && !(a === 'cstr' && b === 'cstr')) {
          this.err(e.span.line, e.span.col, `no matching function for call to '${e.name}(${tyName(a)}, ${tyName(b)})'`,
            `${e.name}() needs both values to have exactly the same type. Write ${e.name}(2.0, 3.5) or cast one of them.`);
          return 'unknown';
        }
        return a;
      }
      case 'swap':
        e.args.forEach((a) => {
          if (!this.isLvalueExpr(a)) this.err(a.span.line, a.span.col, `cannot bind non-const lvalue reference to an rvalue`, 'swap needs two variables, not values.');
        });
        if (argT[0] !== 'unknown' && argT[1] !== 'unknown' && !tyEq(argT[0], argT[1])) {
          this.err(e.span.line, e.span.col, `no matching function for call to 'swap(${tyName(argT[0])}&, ${tyName(argT[1])}&)'`, 'swap needs two variables of the same type.');
        }
        return 'void';
      case 'sort': case 'reverse':
        return 'void';
      case 'abs':
        return argT[0] !== 'unknown' && typeof argT[0] === 'string' && isFloating(argT[0]) ? 'double' : 'int';
      case 'strlen':
        if (!charPtrLike(argT[0])) this.err(e.span.line, e.span.col, `cannot convert '${tyName(argT[0])}' to 'const char*'`, argT[0] === 'string' ? 'strlen is for char arrays. For a string use s.length().' : 'strlen needs a char array.');
        return 'unsigned long long';
      case 'strcmp': case 'strncmp':
        argT.slice(0, 2).forEach((t, k) => {
          if (!charPtrLike(t)) this.err(e.args[k].span.line, e.args[k].span.col, `cannot convert '${tyName(t)}' to 'const char*'`, t === 'string' ? 'For strings, compare with == or <.' : 'strcmp compares two char arrays.');
        });
        return 'int';
      case 'strcpy': case 'strcat': case 'strncpy': case 'strncat': {
        const [d, s] = argT;
        if (d === 'cstr') this.err(e.args[0].span.line, e.args[0].span.col, `invalid conversion from 'const char*' to 'char*' [-fpermissive]`, 'The first argument is where the text is copied TO, so it must be a char array.');
        else if (!charPtrLike(d)) this.err(e.args[0].span.line, e.args[0].span.col, `cannot convert '${tyName(d)}' to 'char*'`, d === 'string' ? 'For strings just use = or +=.' : 'The destination must be a char array.');
        if (!charPtrLike(s)) this.err(e.args[1].span.line, e.args[1].span.col, `cannot convert '${tyName(s)}' to 'const char*'`);
        return ptrTo('char');
      }
      default:
        if (CTYPE.includes(e.name)) return 'int';
        return 'double';
    }
  }

  userCall(e: Extract<Expr, { k: 'call' }>, cands: Sig[]): SType {
    const argT = e.args.map((a) => this.type(a));
    const visible = cands.filter((s) => s.line <= this.curFnLine || (this.curFn && s.def === this.curFn.def));
    if (!visible.length) {
      this.err(e.span.line, e.span.col, `'${e.name}' was not declared in this scope`,
        `${e.name}() is written BELOW this line, and C++ reads from top to bottom. Move ${e.name}() above main(), or put a prototype at the top: ${this.sigText(cands[0]).replace(/^(\S+) /, '$1 ')};`);
      return 'unknown';
    }
    const scored: { s: Sig; score: number }[] = [];
    for (const s of visible) {
      const min = s.params.filter((p) => !p.hasDef).length;
      if (e.args.length < min || e.args.length > s.params.length) continue;
      let score = 0;
      let ok = true;
      e.args.forEach((a, k) => {
        const r = this.convRank(s.params[k], a, argT[k]);
        if (r === null) ok = false;
        else score += r;
      });
      if (ok) scored.push({ s, score });
    }
    const argText = `${e.name}(${argT.map((t) => tyName(t)).join(', ')})`;
    if (!scored.length) {
      if (visible.length === 1) {
        const s = visible[0];
        const min = s.params.filter((p) => !p.hasDef).length;
        if (e.args.length < min) {
          this.err(e.span.line, e.span.col, `too few arguments to function '${this.sigText(s)}'`, `${e.name}() needs ${min} value${min === 1 ? '' : 's'} in the brackets, but got ${e.args.length}.`,
            [{ kind: 'note', line: s.line, col: 1, msg: 'declared here' }]);
          return s.ret;
        }
        if (e.args.length > s.params.length) {
          this.err(e.span.line, e.span.col, `too many arguments to function '${this.sigText(s)}'`, `${e.name}() takes only ${s.params.length} value${s.params.length === 1 ? '' : 's'}, but got ${e.args.length}.`,
            [{ kind: 'note', line: s.line, col: 1, msg: 'declared here' }]);
          return s.ret;
        }
        // point at the first bad argument
        e.args.forEach((a, k) => {
          const p = s.params[k];
          if (this.convRank(p, a, argT[k]) !== null) return;
          if (p.ref && !p.isConst && !this.isLvalueExpr(a)) {
            this.err(a.span.line, a.span.col, `cannot bind non-const lvalue reference of type '${tyName(p.ty)}&' to an rvalue of type '${tyName(argT[k])}'`,
              `Parameter ${p.name} is a reference (&), so you must pass a variable, not a value.`);
          } else if (p.ref && !p.isConst) {
            this.err(a.span.line, a.span.col, `cannot bind non-const lvalue reference of type '${tyName(p.ty)}&' to a value of type '${tyName(argT[k])}'`,
              `Parameter ${p.name} is ${tyName(p.ty)}&, so the variable passed must be exactly a ${tyName(p.ty)}.`);
          } else this.convCheck(p.ty, argT[k], a, 'argument');
        });
        if (this.errors.length === 0) this.err(e.span.line, e.span.col, `no matching function for call to '${argText}'`);
        return s.ret;
      }
      this.err(e.span.line, e.span.col, `no matching function for call to '${argText}'`,
        `None of the ${visible.length} versions of ${e.name}() takes these values: ${visible.map((s) => this.sigText(s)).join(' | ')}`);
      return 'unknown';
    }
    scored.sort((a, b) => a.score - b.score);
    if (scored.length > 1 && scored[0].score === scored[1].score) {
      this.err(e.span.line, e.span.col, `call of overloaded '${argText}' is ambiguous`, `More than one version of ${e.name}() fits equally well: ${scored.slice(0, 2).map((x) => this.sigText(x.s)).join(' and ')}.`);
      return scored[0].s.ret;
    }
    const best = scored[0].s;
    // real conversion diagnostics (narrowing warnings etc.)
    e.args.forEach((a, k) => {
      const p = best.params[k];
      if (!p.ref) this.convCheck(p.ty, argT[k], a, 'argument');
    });
    if (best.index < 0) {
      const def = this.sigs.find((s) => s.index >= 0 && s.name === best.name && s.params.length === best.params.length && s.params.every((p, k) => tyEq(p.ty, best.params[k].ty)));
      if (!def) {
        this.err(e.span.line, e.span.col, `undefined reference to '${this.sigText(best)}'`, `There is a prototype for ${e.name}(), but the function itself (with its { body }) was never written.`);
        return best.ret;
      }
      e.fn = def.index;
    } else e.fn = best.index;
    return best.ret;
  }
}
