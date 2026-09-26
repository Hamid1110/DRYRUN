// Shared types for the DryRun C++ engine.
import type { Layouts } from './ty';
// The engine understands a beginner-friendly subset of C++ and records
// every step of execution so the UI can replay it (like Python Tutor).

export type BaseType =
  | 'bool'
  | 'char' | 'signed char' | 'unsigned char'
  | 'short' | 'unsigned short'
  | 'int' | 'unsigned int'
  | 'long' | 'unsigned long'
  | 'long long' | 'unsigned long long'
  | 'float' | 'double' | 'long double'
  | 'string' | 'void' | 'auto' | 'struct';

/** Runtime/static value types. `cstr` is a string literal (const char[N]). */
export type ValType =
  | Exclude<BaseType, 'auto' | 'struct'>
  | 'cstr' | 'ostream' | 'istream' | 'manip' | 'ptr' | 'st';

/** A full C++ type: primitives are plain strings, compound types are objects. */
export type Ty = Exclude<ValType, 'ptr' | 'st'> | PtrTy | ArrTy | StructTy;
export interface PtrTy { k: 'ptr'; to: Ty; /** the pointed-to value is const */ cto?: boolean }
export interface ArrTy { k: 'arr'; of: Ty; n: number | null }
export interface StructTy { k: 'st'; name: string }

/** value of a whole struct (copied around by value): leaves in layout order */
export interface StructVal { name: string; cells: (RV | null)[] }

export interface Manip {
  name: string;
  arg?: number | string;
}

/** A runtime value. Integers (and chars) are stored as bigint so overflow behaves like real C++. */
export interface RV {
  t: ValType;
  v: bigint | number | boolean | string | Manip | StructVal | null;
  /** value came from an uninitialised variable */
  garbage?: boolean;
  /** pointers: the type pointed to (v is the address as a number, 0 = nullptr) */
  pt?: Ty;
  /** pointers: the pointed-to value is const */
  cto?: boolean;
  /** struct values: the struct name */
  sname?: string;
}

// ---------------------------------------------------------------- AST

export interface Span {
  line: number;
  col: number;
  start: number;
  end: number;
}

export interface TypeSpec {
  base: BaseType;
  /** base === 'struct' */
  sname?: string;
  isConst: boolean;
  text: string;
  span: Span;
}

interface ExprBase {
  id: number;
  span: Span;
}

export interface LitExpr extends ExprBase { k: 'lit'; v: RV; raw: string }
export interface IdExpr extends ExprBase { k: 'id'; name: string; qual: boolean; /** ::name — the global variable */ global?: boolean }
export interface ParenExpr extends ExprBase { k: 'paren'; e: Expr }
export interface UnExpr extends ExprBase { k: 'un'; op: string; e: Expr; postfix: boolean }
export interface BinExpr extends ExprBase { k: 'bin'; op: string; l: Expr; r: Expr; opSpan: Span }
export interface AsgExpr extends ExprBase { k: 'asg'; op: string; l: Expr; r: Expr; opSpan: Span }
export interface CondExpr extends ExprBase { k: 'cond'; c: Expr; a: Expr; b: Expr }
export interface CallExpr extends ExprBase { k: 'call'; name: string; qual: boolean; args: Expr[]; nameSpan: Span; /** set by the checker: index into Program.funcs */ fn?: number }
export interface MCallExpr extends ExprBase { k: 'mcall'; obj: Expr; name: string; args: Expr[] }
export interface IdxExpr extends ExprBase { k: 'idx'; obj: Expr; i: Expr }
export interface CastExpr extends ExprBase { k: 'cast'; ty: TypeSpec; e: Expr; style: 'c' | 'static' | 'func' }
export interface SizeofExpr extends ExprBase { k: 'sizeof'; ty: TypeSpec | null; tyPtr?: number; e: Expr | null }
/** { 1, 2, 3 } — only as an initializer */
export interface ListExpr extends ExprBase { k: 'list'; items: Expr[] }
/** s.name  or  p->name */
export interface MemExpr extends ExprBase { k: 'mem'; obj: Expr; name: string; arrow: boolean; nameSpan: Span }
/** new int, new int(5), new int[n], new Student */
export interface NewExpr extends ExprBase { k: 'new'; ty: TypeSpec; ptr: number; dim: Expr | null; init: Expr | null }
/** Only exists in display trees while an expression is being reduced. */
export interface ValExpr extends ExprBase { k: 'val'; v: RV; raw?: string }

export type Expr =
  | LitExpr | IdExpr | ParenExpr | UnExpr | BinExpr | AsgExpr | CondExpr
  | CallExpr | MCallExpr | IdxExpr | CastExpr | SizeofExpr | ValExpr | ListExpr | MemExpr | NewExpr;

interface StmtBase {
  id: number;
  line: number;
  span: Span;
}

export interface BlockStmt extends StmtBase { s: 'block'; body: Stmt[]; endLine: number }
export interface Declarator {
  name: string;
  span: Span;
  init: Expr | null;
  style: '=' | '{}' | '()' | null;
  /** number of * in front of the name */
  ptr: number;
  /** int* const p */
  cptr?: boolean;
  /** int& r */
  ref: boolean;
  /** array sizes: int a[3][4] → [3, 4]; int a[] → [null] */
  dims: (Expr | null)[];
}
export interface DeclStmt extends StmtBase { s: 'decl'; ty: TypeSpec; items: Declarator[] }
export interface ExprStmt extends StmtBase { s: 'expr'; e: Expr }
export interface IfStmt extends StmtBase { s: 'if'; c: Expr; then: Stmt; els: Stmt | null; elseLine: number | null }
export interface WhileStmt extends StmtBase { s: 'while'; c: Expr; body: Stmt }
export interface DoStmt extends StmtBase { s: 'do'; body: Stmt; c: Expr; whileLine: number }
export interface ForStmt extends StmtBase { s: 'for'; init: Stmt | null; c: Expr | null; step: Expr | null; body: Stmt }
export interface SwitchStmt extends StmtBase { s: 'switch'; e: Expr; body: BlockStmt }
export interface CaseStmt extends StmtBase { s: 'case'; value: Expr | null }
export interface JumpStmt extends StmtBase { s: 'break' | 'continue' }
export interface ReturnStmt extends StmtBase { s: 'return'; e: Expr | null }
export interface EmptyStmt extends StmtBase { s: 'empty' }
export interface DeleteStmt extends StmtBase { s: 'delete'; e: Expr; arr: boolean }
/** for (int x : arr) */
export interface RangeForStmt extends StmtBase { s: 'rfor'; decl: DeclStmt; e: Expr; body: Stmt }

export type Stmt =
  | BlockStmt | DeclStmt | ExprStmt | IfStmt | WhileStmt | DoStmt | ForStmt
  | SwitchStmt | CaseStmt | JumpStmt | ReturnStmt | EmptyStmt | DeleteStmt | RangeForStmt;

export interface Include { name: string; line: number }
export interface Param {
  ty: TypeSpec;
  name: string;
  ref: boolean;
  ptr: number;
  /** int a[] / int m[][3] */
  dims: (Expr | null)[];
  def: Expr | null;
  span: Span;
}
export interface FuncDef {
  name: string;
  ret: TypeSpec;
  /** int* f() */
  retPtr: number;
  retRef: boolean;
  params: Param[];
  /** null for a prototype (declaration only) */
  body: BlockStmt | null;
  line: number;
  span: Span;
}
export interface StructField { ty: TypeSpec; name: string; ptr: number; dims: (Expr | null)[]; init: Expr | null; line: number; span: Span }
export interface StructDef { name: string; fields: StructField[]; line: number; endLine: number }

export interface Program {
  includes: Include[];
  usingStd: boolean;
  usingLine: number | null;
  globals: DeclStmt[];
  /** functions with a body, in source order */
  funcs: FuncDef[];
  /** prototypes (no body) */
  protos: FuncDef[];
  structs: StructDef[];
  /** globals, functions, prototypes and structs in source order (for "declared before use" checks) */
  order: { kind: 'global' | 'func' | 'proto' | 'struct'; name: string; line: number }[];
  src: string;
  lines: string[];
  /** filled in by the checker: struct layouts */
  layouts?: Layouts;
}

// ---------------------------------------------------------------- diagnostics

export interface Diag {
  kind: 'error' | 'warning' | 'note';
  line: number;
  col: number;
  msg: string;
  /** Plain-English explanation for beginners (our addition, not from g++). */
  help?: string;
}

export class CompileError extends Error {
  diags: Diag[];
  constructor(diags: Diag[]) {
    super(diags[0]?.msg ?? 'compile error');
    this.diags = diags;
  }
}

// ---------------------------------------------------------------- trace

/** One box in the memory view. Compound values (arrays, structs) have items. */
export interface MemVal {
  kind: 'prim' | 'ptr' | 'arr' | 'struct';
  type: string;
  /** hex address, e.g. 0x61fe14 */
  addr: string;
  /** one-line value, e.g. 5, "Ali", {1, 2, 3}, 0x61fe10 */
  display: string;
  sub?: string;
  uninit: boolean;
  /** ptr: hex address it holds (null = nullptr / garbage) */
  target?: string | null;
  /** ptr: what it points to, e.g. arr[2] */
  targetLabel?: string;
  /** ptr points to deleted / dead memory */
  dangling?: boolean;
  /** arr elements (label = index) or struct fields (label = field name) */
  items?: { label: string; val: MemVal }[];
}

export interface VarSnap {
  key: string;
  name: string;
  type: string;
  display: string;
  /** extra detail such as the ASCII code of a char */
  sub?: string;
  uninit: boolean;
  depth: number;
  scopeLabel?: string;
  addr: string;
  size: number;
  isConst: boolean;
  /** full structure for arrays / structs / pointers */
  val?: MemVal;
  /** reference variable: it is another name for this box */
  refTo?: string;
  refLabel?: string;
}

export interface FrameSnap {
  fn: string;
  vars: VarSnap[];
  /** line the function was called from */
  callLine?: number;
  /** value being returned (shown just before the frame disappears) */
  ret?: string;
}

export interface CalcLine {
  text: string;
  note?: string;
}

export interface Calc {
  label?: string;
  lines: CalcLine[];
}

export type StepKind =
  | 'compile' | 'start' | 'decl' | 'assign' | 'expr' | 'out' | 'in'
  | 'cond' | 'loop' | 'switch' | 'jump' | 'return' | 'end' | 'error' | 'wait' | 'call' | 'new' | 'delete';

export interface Step {
  i: number;
  kind: StepKind;
  /** line that just executed (null = nothing yet / program over) */
  line: number | null;
  /** next line to execute */
  next: number | null;
  /** explanation (mini markdown: **bold**, `code`) */
  text: string;
  calcs: Calc[];
  frames: FrameSnap[];
  globals: VarSnap[];
  /** blocks made with new (still alive) */
  heap: VarSnap[];
  /** hex addresses of memory cells that changed in this step */
  changedAddrs: string[];
  consoleLen: number;
  stdinPos: number;
  changed: string[];
  group: number;
  sub: boolean;
  /** source character range to highlight inside the executed line */
  hl?: { start: number; end: number };
  branch?: { result: boolean | string; target: string };
  warn?: string;
}

export interface ConsoleSeg {
  text: string;
  kind: 'out' | 'in' | 'err';
  step: number;
}

export interface RunResult {
  ok: boolean;
  compileErrors: Diag[];
  warnings: Diag[];
  steps: Step[];
  console: ConsoleSeg[];
  stdout: string;
  exitCode: number | null;
  runtimeError: { line: number | null; msg: string } | null;
  needsInput: boolean;
  truncated: boolean;
  executedLines: number[];
  lines: string[];
}

export interface RunOptions {
  input?: string;
  maxSteps?: number;
  /** add steps that explain #include / using / main before running */
  explainSetup?: boolean;
}
