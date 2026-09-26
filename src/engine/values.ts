import type { BaseType, RV, ValType } from './types';

// ---------------------------------------------------------------- type facts
// We follow the Windows compilers most students use (Dev-C++ / MinGW / MSVC):
// int = 4 bytes, long = 4 bytes, long long = 8 bytes.

const INT_INFO: Record<string, { bits: number; signed: boolean; rank: number }> = {
  bool: { bits: 1, signed: false, rank: 0 },
  char: { bits: 8, signed: true, rank: 0 },
  'signed char': { bits: 8, signed: true, rank: 0 },
  'unsigned char': { bits: 8, signed: false, rank: 0 },
  short: { bits: 16, signed: true, rank: 0 },
  'unsigned short': { bits: 16, signed: false, rank: 0 },
  int: { bits: 32, signed: true, rank: 1 },
  'unsigned int': { bits: 32, signed: false, rank: 1 },
  long: { bits: 32, signed: true, rank: 2 },
  'unsigned long': { bits: 32, signed: false, rank: 2 },
  'long long': { bits: 64, signed: true, rank: 3 },
  'unsigned long long': { bits: 64, signed: false, rank: 3 },
};

export const isIntegral = (t: ValType | string): boolean => t in INT_INFO;
export const isFloating = (t: ValType | string): boolean => t === 'float' || t === 'double' || t === 'long double';
export const isArith = (t: ValType | string): boolean => isIntegral(t) || isFloating(t);
export const isCharType = (t: ValType | string): boolean => t === 'char' || t === 'signed char' || t === 'unsigned char';
export const isStringy = (t: ValType | string): boolean => t === 'string' || t === 'cstr';

export function sizeOf(t: ValType | BaseType): number {
  switch (t) {
    case 'bool': case 'char': case 'signed char': case 'unsigned char': return 1;
    case 'short': case 'unsigned short': return 2;
    case 'int': case 'unsigned int': case 'long': case 'unsigned long': case 'float': return 4;
    case 'long long': case 'unsigned long long': case 'double': return 8;
    case 'long double': return 16;
    case 'string': return 32;
    default: return 8;
  }
}

export function typeLabel(t: ValType | BaseType): string {
  if (t === 'cstr') return 'const char*';
  if (t === 'ostream') return 'std::ostream';
  if (t === 'istream') return 'std::istream';
  return t;
}

/** g++-style name used inside error messages */
export function gxxTypeName(t: ValType | BaseType | 'unknown', len?: number): string {
  if (t === 'string') return "std::string";
  if (t === 'cstr') return len !== undefined ? `const char [${len + 1}]` : 'const char*';
  if (t === 'ostream') return 'std::ostream';
  if (t === 'istream') return 'std::istream';
  if (t === 'manip') return '<unresolved overloaded function type>';
  return t;
}

export function wrap(t: ValType, x: bigint): bigint {
  const info = INT_INFO[t];
  if (!info) return x;
  if (t === 'bool') return x === BigInt(0) ? BigInt(0) : BigInt(1);
  return info.signed ? BigInt.asIntN(info.bits, x) : BigInt.asUintN(info.bits, x);
}

export function intLimits(t: ValType): [bigint, bigint] | null {
  const info = INT_INFO[t];
  if (!info || t === 'bool') return null;
  const b = BigInt(info.bits);
  return info.signed
    ? [-(BigInt(1) << (b - BigInt(1))), (BigInt(1) << (b - BigInt(1))) - BigInt(1)]
    : [BigInt(0), (BigInt(1) << b) - BigInt(1)];
}

/** integral promotion: small types become int */
export function promote(t: ValType): ValType {
  const info = INT_INFO[t];
  if (info && info.rank === 0) return 'int';
  return t;
}

/** "usual arithmetic conversions" */
export function commonType(a: ValType, b: ValType): ValType {
  if (a === 'long double' || b === 'long double') return 'long double';
  if (a === 'double' || b === 'double') return 'double';
  if (a === 'float' || b === 'float') return 'float';
  const pa = promote(a);
  const pb = promote(b);
  if (pa === pb) return pa;
  const ia = INT_INFO[pa];
  const ib = INT_INFO[pb];
  if (!ia || !ib) return pa;
  if (ia.signed === ib.signed) return ia.rank >= ib.rank ? pa : pb;
  const [u, s, iu, is] = ia.signed ? [pb, pa, ib, ia] : [pa, pb, ia, ib];
  if (iu.rank >= is.rank) return u;
  if (is.bits > iu.bits) return s;
  return ('unsigned ' + s) as ValType;
}

// ---------------------------------------------------------------- value helpers

export const mkInt = (x: number | bigint, t: ValType = 'int'): RV => ({ t, v: wrap(t, BigInt(x)) });
export const mkBool = (b: boolean): RV => ({ t: 'bool', v: b });
export const mkDouble = (x: number): RV => ({ t: 'double', v: x });
export const mkStr = (s: string): RV => ({ t: 'string', v: s });

export function toBig(rv: RV): bigint {
  if (rv.t === 'bool') return rv.v ? BigInt(1) : BigInt(0);
  if (typeof rv.v === 'bigint') return rv.v;
  if (typeof rv.v === 'number') return BigInt(Math.trunc(isFinite(rv.v) ? rv.v : 0));
  return BigInt(0);
}

export function toNum(rv: RV): number {
  if (rv.t === 'bool') return rv.v ? 1 : 0;
  if (typeof rv.v === 'bigint') return Number(rv.v);
  if (typeof rv.v === 'number') return rv.v;
  return 0;
}

export function truthy(rv: RV): boolean {
  if (rv.t === 'bool') return rv.v === true;
  if (typeof rv.v === 'bigint') return rv.v !== BigInt(0);
  if (typeof rv.v === 'number') return rv.v !== 0;
  if (rv.t === 'cstr') return true;
  if (rv.t === 'istream') return rv.v !== false;
  if (rv.t === 'ostream') return true;
  return !!rv.v;
}

export function charOf(rv: RV): string {
  return String.fromCharCode(Number(BigInt.asUintN(8, toBig(rv))));
}

/** implicit conversion (initialisation / assignment / argument passing) */
export function convert(rv: RV, to: ValType): RV {
  if (rv.t === to) return { t: to, v: rv.v, garbage: rv.garbage };
  const g = rv.garbage;
  if (to === 'bool') return { t: 'bool', v: truthy(rv), garbage: g };
  if (isIntegral(to)) {
    if (isFloating(rv.t)) {
      const x = rv.v as number;
      const big = isFinite(x) ? BigInt(Math.trunc(x)) : BigInt(0);
      return { t: to, v: wrap(to, big), garbage: g };
    }
    return { t: to, v: wrap(to, toBig(rv)), garbage: g };
  }
  if (isFloating(to)) {
    let x = toNum(rv);
    if (to === 'float') x = Math.fround(x);
    return { t: to, v: x, garbage: g };
  }
  if (to === 'string') {
    if (rv.t === 'cstr' || rv.t === 'string') return { t: 'string', v: rv.v as string };
    if (isArith(rv.t)) return { t: 'string', v: charOf(convert(rv, 'char')) };
  }
  return { t: to, v: rv.v, garbage: g };
}

// ---------------------------------------------------------------- exact decimal formatting
// glibc prints doubles using the exact binary value and rounds ties to even.
// We reproduce that so our console output matches a real compiler digit for digit.

const B0 = BigInt(0);
const B1 = BigInt(1);
const B2 = BigInt(2);
const B5 = BigInt(5);
const B10 = BigInt(10);

function exactDigits(x: number): { neg: boolean; D: bigint; P: number } {
  const neg = x < 0 || Object.is(x, -0);
  x = Math.abs(x);
  if (x === 0) return { neg, D: B0, P: 0 };
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, x);
  const hi = dv.getUint32(0);
  const lo = dv.getUint32(4);
  const expBits = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << BigInt(32)) | BigInt(lo);
  let e: number;
  if (expBits === 0) e = -1074;
  else {
    mant |= B1 << BigInt(52);
    e = expBits - 1075;
  }
  if (e >= 0) return { neg, D: mant << BigInt(e), P: 0 };
  return { neg, D: mant * B5 ** BigInt(-e), P: -e };
}

function pow10(k: number): bigint {
  return B10 ** BigInt(k);
}

/** D / 10^drop rounded half-to-even (drop may be negative = multiply) */
function roundDiv(D: bigint, drop: number): bigint {
  if (drop <= 0) return D * pow10(-drop);
  const div = pow10(drop);
  const q = D / div;
  const r = D % div;
  const twice = r * B2;
  if (twice > div) return q + B1;
  if (twice < div) return q;
  return q % B2 === B0 ? q : q + B1;
}

function stripZeros(s: string): string {
  if (!s.includes('.')) return s;
  s = s.replace(/0+$/, '');
  if (s.endsWith('.')) s = s.slice(0, -1);
  return s;
}

export function fmtFixed(x: number, prec: number, showpoint = false): string {
  if (Number.isNaN(x)) return 'nan';
  if (!Number.isFinite(x)) return x < 0 ? '-inf' : 'inf';
  const { neg, D, P } = exactDigits(x);
  const R = roundDiv(D, P - prec);
  let s = R.toString().padStart(prec + 1, '0');
  if (prec > 0) s = s.slice(0, s.length - prec) + '.' + s.slice(s.length - prec);
  else if (showpoint) s += '.';
  return (neg ? '-' : '') + s;
}

export function fmtSci(x: number, prec: number, showpoint = false): string {
  if (Number.isNaN(x)) return 'nan';
  if (!Number.isFinite(x)) return x < 0 ? '-inf' : 'inf';
  const { neg, D, P } = exactDigits(x);
  const sign = neg ? '-' : '';
  if (D === B0) {
    return sign + '0' + (prec > 0 ? '.' + '0'.repeat(prec) : showpoint ? '.' : '') + 'e+00';
  }
  const nd = D.toString().length;
  let X = nd - 1 - P;
  let R = roundDiv(D, nd - (prec + 1));
  if (R.toString().length > prec + 1) {
    X += 1;
    R = R / B10;
  }
  const digits = R.toString();
  const mant = digits[0] + (prec > 0 ? '.' + digits.slice(1) : showpoint ? '.' : '');
  return sign + mant + 'e' + (X < 0 ? '-' : '+') + String(Math.abs(X)).padStart(2, '0');
}

/** printf("%g") — the default way cout prints double / float */
export function fmtG(x: number, prec = 6, showpoint = false): string {
  if (Number.isNaN(x)) return 'nan';
  if (!Number.isFinite(x)) return x < 0 ? '-inf' : 'inf';
  const p = prec === 0 ? 1 : prec;
  const { neg, D, P } = exactDigits(x);
  const sign = neg ? '-' : '';
  if (D === B0) return sign + (showpoint ? '0.' + '0'.repeat(p - 1) : '0');
  const nd = D.toString().length;
  let X = nd - 1 - P;
  let R = roundDiv(D, nd - p);
  if (R.toString().length > p) {
    X += 1;
    R = R / B10;
  }
  const digits = R.toString();
  if (X < -4 || X >= p) {
    let mant = digits[0] + (p > 1 ? '.' + digits.slice(1) : '');
    if (!showpoint) mant = stripZeros(mant);
    else if (!mant.includes('.')) mant += '.';
    return sign + mant + 'e' + (X < 0 ? '-' : '+') + String(Math.abs(X)).padStart(2, '0');
  }
  const decimals = p - 1 - X;
  let str: string;
  if (decimals > 0) {
    const padded = digits.padStart(decimals + 1, '0');
    str = padded.slice(0, padded.length - decimals) + '.' + padded.slice(padded.length - decimals);
  } else {
    str = digits;
  }
  if (!showpoint) str = stripZeros(str);
  else if (!str.includes('.')) str += '.';
  return sign + str;
}

// ---------------------------------------------------------------- cout formatting

export interface OutState {
  boolalpha: boolean;
  floatfield: 'none' | 'fixed' | 'scientific';
  precision: number;
  width: number;
  fill: string;
  adjust: 'right' | 'left';
  showpoint: boolean;
  showpos: boolean;
}

export const defaultOutState = (): OutState => ({
  boolalpha: false,
  floatfield: 'none',
  precision: 6,
  width: 0,
  fill: ' ',
  adjust: 'right',
  showpoint: false,
  showpos: false,
});

export function fmtFloatOut(x: number, st: OutState): string {
  let s: string;
  if (st.floatfield === 'fixed') s = fmtFixed(x, st.precision, st.showpoint);
  else if (st.floatfield === 'scientific') s = fmtSci(x, st.precision, st.showpoint);
  else s = fmtG(x, st.precision, st.showpoint);
  if (st.showpos && !s.startsWith('-')) s = '+' + s;
  return s;
}

/** Text that `cout << value` produces (before setw padding). */
export function coutText(rv: RV, st: OutState): string {
  switch (rv.t) {
    case 'bool':
      return st.boolalpha ? (rv.v ? 'true' : 'false') : rv.v ? '1' : '0';
    case 'char': case 'signed char': case 'unsigned char':
      return charOf(rv);
    case 'float': case 'double': case 'long double':
      return fmtFloatOut(rv.v as number, st);
    case 'string': case 'cstr':
      return rv.v as string;
    case 'manip': case 'ostream': case 'istream': case 'void':
      return '';
    default: {
      const s = toBig(rv).toString();
      return st.showpos && !s.startsWith('-') ? '+' + s : s;
    }
  }
}

export function applyWidth(text: string, st: OutState): string {
  if (st.width > text.length) {
    const pad = st.fill.repeat(st.width - text.length);
    text = st.adjust === 'left' ? text + pad : pad + text;
  }
  return text;
}

// ---------------------------------------------------------------- display (memory boxes, expression steps)

export function quoteChar(ch: string): string {
  const map: Record<string, string> = { '\n': '\\n', '\t': '\\t', '\0': '\\0', "'": "\\'", '\\': '\\\\', '\r': '\\r', '\x07': '\\a', '\b': '\\b' };
  return "'" + (map[ch] ?? ch) + "'";
}

export function quoteStr(s: string): string {
  return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r') + '"';
}

export function fmtDoubleDisplay(x: number): string {
  const s = fmtG(x, 6);
  if (/^-?\d+$/.test(s)) return s + '.0';
  return s;
}

/** Value as a beginner would write it in C++ (used in memory boxes & expression steps). */
export function displayRV(rv: RV): string {
  switch (rv.t) {
    case 'bool': return rv.v ? 'true' : 'false';
    case 'char': case 'signed char': case 'unsigned char': return quoteChar(charOf(rv));
    case 'float': case 'double': case 'long double': return fmtDoubleDisplay(rv.v as number);
    case 'string': case 'cstr': return quoteStr(rv.v as string);
    case 'manip': {
      const m = rv.v as { name: string; arg?: number | string };
      return m.arg !== undefined ? `${m.name}(${typeof m.arg === 'string' ? quoteChar(m.arg) : m.arg})` : m.name;
    }
    case 'ptr': {
      const a = rv.v as number;
      return rv.garbage ? '?' : a === 0 ? 'nullptr' : '0x' + a.toString(16);
    }
    case 'st': return '{…}';
    case 'ostream': return 'cout';
    case 'istream': return 'cin';
    case 'void': return 'void';
    default: return toBig(rv).toString();
  }
}

export function asciiNote(rv: RV): string | undefined {
  if (isCharType(rv.t)) return 'ASCII ' + Number(BigInt.asUintN(8, toBig(rv)));
  return undefined;
}
