// Helpers for full C++ types (primitives, pointers, arrays, structs) and memory layout.

import type { ArrTy, PtrTy, StructTy, Ty, ValType } from './types';
import { gxxTypeName, isArith, sizeOf as primSize } from './values';

export const isPtr = (t: unknown): t is PtrTy => typeof t === 'object' && t !== null && (t as PtrTy).k === 'ptr';
export const isArr = (t: unknown): t is ArrTy => typeof t === 'object' && t !== null && (t as ArrTy).k === 'arr';
export const isStructT = (t: unknown): t is StructTy => typeof t === 'object' && t !== null && (t as StructTy).k === 'st';
export const isPrimT = (t: unknown): t is Exclude<ValType, 'ptr' | 'st'> => typeof t === 'string';

export const ptrTo = (to: Ty, cto?: boolean): PtrTy => (cto ? { k: 'ptr', to, cto } : { k: 'ptr', to });
export const arrOf = (of: Ty, n: number | null): ArrTy => ({ k: 'arr', of, n });

export function tyEq(a: Ty, b: Ty): boolean {
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  if (a.k !== b.k) return false;
  if (a.k === 'ptr') return tyEq(a.to, (b as PtrTy).to);
  if (a.k === 'arr') return a.n === (b as ArrTy).n && tyEq(a.of, (b as ArrTy).of);
  return a.name === (b as StructTy).name;
}

/** element type for [] and unary * */
export function elemOf(t: Ty): Ty | null {
  if (isArr(t)) return t.of;
  if (isPtr(t)) return t.to;
  return null;
}

/** array-to-pointer decay */
export function decay(t: Ty): Ty {
  return isArr(t) ? ptrTo(t.of) : t;
}

/** is it a scalar that can be tested as true/false */
export function isScalarT(t: Ty): boolean {
  return isPtr(t) || (typeof t === 'string' && isArith(t));
}

/** g++-style type name, e.g. int*, int [5], int (*)[3], const char*, Student */
export function tyName(t: Ty | 'unknown', len?: number): string {
  if (t === 'unknown') return 'unknown';
  if (typeof t === 'string') return gxxTypeName(t, len);
  if (t.k === 'st') return t.name;
  if (t.k === 'ptr') {
    if (isArr(t.to)) {
      const { base, dims } = arrParts(t.to);
      return `${tyName(base)} (*)${dims}`;
    }
    const inner = tyName(t.to);
    return (t.cto && typeof t.to === 'string' ? 'const ' : '') + inner + '*';
  }
  const { base, dims } = arrParts(t);
  return `${tyName(base)} ${dims}`;
}

function arrParts(t: Ty): { base: Ty; dims: string } {
  let dims = '';
  let cur = t;
  while (isArr(cur)) {
    dims += `[${cur.n ?? ''}]`;
    cur = cur.of;
  }
  return { base: cur, dims };
}

/** short label for memory boxes: int, int*, int[5], int[2][3], Student */
export function tyLabel(t: Ty): string {
  if (typeof t === 'string') {
    if (t === 'cstr') return 'const char*';
    return t;
  }
  if (t.k === 'st') return t.name;
  if (t.k === 'ptr') return (t.cto && typeof t.to === 'string' ? 'const ' : '') + (isArr(t.to) ? `${tyLabel(arrParts(t.to).base)}(*)${arrParts(t.to).dims}` : tyLabel(t.to) + '*');
  const { base, dims } = arrParts(t);
  return tyLabel(base) + dims;
}

// ---------------------------------------------------------------- layout

export interface FieldInfo {
  name: string;
  ty: Ty;
  off: number;
}

export interface Leaf {
  off: number;
  ty: Ty; // primitive or pointer
  path: string;
}

export class Layouts {
  private cache = new Map<string, { size: number; align: number; fields: FieldInfo[] }>();
  constructor(private defs: Map<string, { name: string; ty: Ty }[]>) {}

  has(name: string): boolean {
    return this.defs.has(name);
  }

  struct(name: string): { size: number; align: number; fields: FieldInfo[] } {
    const hit = this.cache.get(name);
    if (hit) return hit;
    const def = this.defs.get(name) ?? [];
    let off = 0;
    let align = 1;
    const fields: FieldInfo[] = [];
    for (const f of def) {
      const a = this.align(f.ty);
      off = Math.ceil(off / a) * a;
      fields.push({ name: f.name, ty: f.ty, off });
      off += this.size(f.ty);
      align = Math.max(align, a);
    }
    const size = Math.max(1, Math.ceil(off / align) * align);
    const out = { size, align, fields };
    this.cache.set(name, out);
    return out;
  }

  size(t: Ty): number {
    if (typeof t === 'string') return primSize(t);
    if (t.k === 'ptr') return 8;
    if (t.k === 'arr') return (t.n ?? 0) * this.size(t.of);
    return this.struct(t.name).size;
  }

  align(t: Ty): number {
    if (typeof t === 'string') return t === 'string' ? 8 : Math.min(primSize(t), 16);
    if (t.k === 'ptr') return 8;
    if (t.k === 'arr') return this.align(t.of);
    return this.struct(t.name).align;
  }

  field(sname: string, name: string): FieldInfo | undefined {
    return this.struct(sname).fields.find((f) => f.name === name);
  }

  /** every primitive / pointer box inside a value of type t */
  leaves(t: Ty, off = 0, path = ''): Leaf[] {
    if (typeof t === 'string' || t.k === 'ptr') return [{ off, ty: t, path }];
    if (t.k === 'arr') {
      const out: Leaf[] = [];
      const es = this.size(t.of);
      for (let i = 0; i < (t.n ?? 0); i++) out.push(...this.leaves(t.of, off + i * es, `${path}[${i}]`));
      return out;
    }
    const out: Leaf[] = [];
    for (const f of this.struct(t.name).fields) out.push(...this.leaves(f.ty, off + f.off, `${path}.${f.name}`));
    return out;
  }
}

/** the type named by a TypeSpec (without *, & or [] from the declarator) */
export function baseTy(ts: { base: string; sname?: string }): Ty {
  if (ts.base === 'struct') return { k: 'st', name: ts.sname ?? '?' };
  if (ts.base === 'auto') return 'int';
  return ts.base as Ty;
}

/** wrap a base type with pointer levels and array dimensions (outermost first) */
export function declTy(base: Ty, ptr: number, dims: (number | null)[], cto = false): Ty {
  let t: Ty = base;
  for (let k = 0; k < ptr; k++) t = ptrTo(t, k === 0 ? cto : false);
  for (let k = dims.length - 1; k >= 0; k--) t = arrOf(t, dims[k]);
  return t;
}
