import { lex, type Token } from './lexer';
import { isIntegral } from './values';
import {
  CompileError,
  type BaseType,
  type BlockStmt,
  type DeclStmt,
  type Declarator,
  type Diag,
  type Expr,
  type FuncDef,
  type Include,
  type Param,
  type Program,
  type RV,
  type Span,
  type Stmt,
  type StructDef,
  type StructField,
  type TypeSpec,
} from './types';

const TYPE_KWS = new Set(['int', 'double', 'float', 'char', 'bool', 'void', 'long', 'short', 'unsigned', 'signed', 'const', 'auto']);
const CAST_KWS = new Set(['int', 'double', 'float', 'char', 'bool', 'long', 'short', 'unsigned', 'signed']);
const ASSIGN_OPS = new Set(['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=']);
const PREC: Record<string, number> = {
  '||': 1, '&&': 2, '|': 3, '^': 4, '&': 5,
  '==': 6, '!=': 6, '<': 7, '>': 7, '<=': 7, '>=': 7,
  '<<': 8, '>>': 8, '+': 9, '-': 9, '*': 10, '/': 10, '%': 10,
};

export function parse(src: string, warnings: Diag[]): Program {
  const toks = lex(src, warnings);
  return new Parser(src, toks).program();
}

export function describeTok(t: Token): string {
  switch (t.t) {
    case 'eof': return 'end of input';
    case 'op': return `'${t.v}' token`;
    case 'num': return 'numeric constant';
    case 'str': return 'string constant';
    case 'char': return 'character constant';
    case 'pp': return `'#' token`;
    default: return `'${t.v}'`;
  }
}

class Parser {
  private i = 0;
  private nid = 1;
  private structNames = new Set<string>();
  constructor(private src: string, private toks: Token[]) {}

  // ------------------------------------------------------------ token helpers
  private get cur(): Token {
    return this.toks[this.i];
  }
  private peek(k = 1): Token {
    return this.toks[Math.min(this.i + k, this.toks.length - 1)];
  }
  private atEof(): boolean {
    return this.toks[this.i].t === 'eof';
  }
  private get prev(): Token {
    return this.toks[Math.max(0, this.i - 1)];
  }
  private next(): Token {
    const t = this.toks[this.i];
    if (t.t !== 'eof') this.i++;
    return t;
  }
  private isOp(v: string, k = 0): boolean {
    const t = k ? this.peek(k) : this.cur;
    return t.t === 'op' && t.v === v;
  }
  private isKw(v: string, k = 0): boolean {
    const t = k ? this.peek(k) : this.cur;
    return t.t === 'kw' && t.v === v;
  }
  private accept(v: string): boolean {
    const t = this.cur;
    if ((t.t === 'op' || t.t === 'kw') && t.v === v) {
      this.next();
      return true;
    }
    return false;
  }
  private fail(tok: Token, msg: string, help?: string, extra: Diag[] = []): never {
    throw new CompileError([{ kind: 'error', line: tok.line, col: tok.col, msg, help }, ...extra]);
  }
  private expect(v: string, help?: string): Token {
    if (this.cur.t === 'op' && this.cur.v === v) return this.next();
    if (this.cur.t === 'eof') this.fail(this.cur, `expected '${v}' at end of input`, help);
    return this.fail(this.cur, `expected '${v}' before ${describeTok(this.cur)}`, help);
  }
  private expectSemi(help?: string): void {
    if (this.isOp(';')) {
      this.next();
      return;
    }
    const p = this.prev;
    const where = this.cur.t === 'eof' ? 'at end of input' : `before ${describeTok(this.cur)}`;
    throw new CompileError([
      {
        kind: 'error',
        line: p.endLine,
        col: p.endCol,
        msg: `expected ';' ${where}`,
        help: help ?? 'Every statement must end with a semicolon ; — the compiler only noticed when it reached the next word.',
      },
    ]);
  }
  private expectIdent(): Token {
    if (this.cur.t === 'id') return this.next();
    if (this.cur.t === 'kw' && !TYPE_KWS.has(this.cur.v)) {
      this.fail(this.cur, `expected unqualified-id before '${this.cur.v}'`, `'${this.cur.v}' is a reserved C++ keyword, so it cannot be used as a name.`);
    }
    return this.fail(this.cur, `expected unqualified-id before ${describeTok(this.cur)}`, 'A variable name is missing here.');
  }
  private span(from: Token, to: Token = this.prev): Span {
    return { line: from.line, col: from.col, start: from.start, end: Math.max(from.end, to.end) };
  }
  private spanE(a: { span: Span }, b: { span: Span }): Span {
    return { line: a.span.line, col: a.span.col, start: a.span.start, end: b.span.end };
  }

  // ------------------------------------------------------------ program
  program(): Program {
    const includes: Include[] = [];
    let usingStd = false;
    let usingLine: number | null = null;
    const globals: DeclStmt[] = [];
    const funcs: FuncDef[] = [];
    const protos: FuncDef[] = [];
    const structs: StructDef[] = [];
    const order: Program['order'] = [];

    while (this.cur.t !== 'eof') {
      const t = this.cur;
      if (t.t === 'pp') {
        const m = /^#\s*include\s*[<"]\s*([^>"\s]+)\s*[>"]/.exec(t.v);
        if (m) includes.push({ name: m[1], line: t.line });
        else if (/^#\s*include/.test(t.v)) this.fail(t, '#include expects "FILENAME" or <FILENAME>', 'Write it like this: #include <iostream>');
        this.next();
        continue;
      }
      if (this.isKw('using')) {
        this.next();
        if (this.accept('namespace')) {
          const name = this.expectIdent();
          if (name.v === 'std') {
            usingStd = true;
            usingLine = t.line;
          }
          this.expectSemi();
        } else {
          // using std::cout;  -> treat as using the std namespace for that name (good enough for beginners)
          while (!this.isOp(';') && !this.atEof()) this.next();
          usingStd = true;
          usingLine = t.line;
          this.expectSemi();
        }
        continue;
      }
      if (this.isOp(';')) {
        this.next();
        continue;
      }
      if ((this.isKw('struct') || this.isKw('class')) && this.peek().t === 'id' && (this.isOp('{', 2) || this.isOp(';', 2))) {
        const sd = this.structDef();
        if (sd) {
          structs.push(sd);
          order.push({ kind: 'struct', name: sd.name, line: sd.line });
        }
        continue;
      }
      if (t.t === 'id' && t.v === 'main' && this.isOp('(', 1)) {
        this.fail(t, "ISO C++ forbids declaration of 'main' with no type", 'main needs a return type: write int main()');
      }
      if (this.startsType()) {
        const ty = this.parseType();
        let ptr = 0;
        let ref = false;
        while (this.isOp('*')) {
          this.next();
          ptr++;
        }
        if (this.isOp('&')) {
          this.next();
          ref = true;
        }
        const name = this.expectIdent();
        if (this.isOp('(')) {
          const f = this.funcRest(ty, name, ptr, ref);
          if (f.body) funcs.push(f);
          else protos.push(f);
          order.push({ kind: f.body ? 'func' : 'proto', name: f.name, line: f.line });
        } else {
          const d = this.declRest(ty, name, t, ptr, ref);
          globals.push(d);
          for (const it of d.items) order.push({ kind: 'global', name: it.name, line: it.span.line });
        }
        continue;
      }
      if (t.t === 'id') {
        this.fail(t, `'${t.v}' does not name a type`, 'Statements like this must be inside a function such as main() { ... }.');
      }
      if (t.t === 'op' && t.v === '}') {
        this.fail(t, "expected declaration before '}' token", 'There is an extra closing brace } here.');
      }
      this.fail(t, `expected unqualified-id before ${describeTok(t)}`);
    }

    return { includes, usingStd, usingLine, globals, funcs, protos, structs, order, src: this.src, lines: this.src.split('\n') };
  }

  private structDef(): StructDef | null {
    const kw = this.next();
    const nameTok = this.next();
    this.structNames.add(nameTok.v);
    if (this.isOp(';')) {
      this.next();
      return null;
    }
    this.expect('{');
    const fields: StructField[] = [];
    while (!this.isOp('}')) {
      if (this.atEof()) this.fail(this.cur, `expected '}' at end of input`, `The struct ${nameTok.v} is missing its closing }; .`);
      if (this.isKw('public') || this.isKw('private') || this.isKw('protected')) {
        this.next();
        this.expect(':');
        continue;
      }
      if (!this.startsType()) this.fail(this.cur, `'${this.cur.v}' does not name a type`, 'Inside a struct, list the fields like: string name; int age;');
      const ty = this.parseType();
      for (;;) {
        let ptr = 0;
        while (this.isOp('*')) {
          this.next();
          ptr++;
        }
        const n = this.expectIdent();
        if (this.isOp('(')) this.fail(n, 'functions inside a struct are not supported yet', 'Member functions arrive in the OOP course. For now, write the function outside the struct.');
        const dims = this.dims();
        let init: Expr | null = null;
        if (this.accept('=')) init = this.isOp('{') ? this.initList() : this.assignExpr();
        else if (this.isOp('{')) init = this.initList();
        fields.push({ ty, name: n.v, ptr, dims, init, line: n.line, span: this.span(n, n) });
        if (this.accept(',')) continue;
        this.expectSemi();
        break;
      }
    }
    const close = this.next();
    if (!this.isOp(';')) {
      throw new CompileError([{ kind: 'error', line: close.endLine, col: close.endCol, msg: `expected ';' after struct definition`, help: 'A struct definition must end with }; — the semicolon after the brace is easy to forget.' }]);
    }
    this.next();
    void kw;
    return { name: nameTok.v, fields, line: nameTok.line, endLine: close.line };
  }

  private funcRest(ret: TypeSpec, name: Token, retPtr: number, retRef: boolean): FuncDef {
    this.expect('(');
    const params: Param[] = [];
    if (!this.isOp(')')) {
      if (this.isKw('void') && this.isOp(')', 1)) this.next();
      else {
        do {
          const pstart = this.cur;
          if (!this.startsType()) this.fail(this.cur, `'${this.cur.v}' has not been declared`, 'Each parameter needs a type before its name, e.g. int a, int b.');
          const ty = this.parseType();
          let ptr = 0;
          while (this.isOp('*')) {
            this.next();
            ptr++;
          }
          if (this.isKw('const')) this.next();
          const ref = this.accept('&');
          const pn = this.cur.t === 'id' ? this.next() : null;
          const dims = this.dims();
          let def: Expr | null = null;
          if (this.accept('=')) def = this.assignExpr();
          params.push({ ty, name: pn ? pn.v : '', ref, ptr, dims, def, span: this.span(pstart) });
        } while (this.accept(','));
      }
    }
    this.expect(')');
    if (this.isOp(';')) {
      this.next();
      return { name: name.v, ret, retPtr, retRef, params, body: null, line: name.line, span: this.span(name) };
    }
    if (!this.isOp('{')) {
      this.fail(this.cur, `expected initializer before ${describeTok(this.cur).replace(/ token$/, '')}`,
        name.v === 'main' ? 'The function body must start with an opening brace { right after int main().' : `The body of ${name.v}() must start with {. (A prototype ends with ; instead.)`);
    }
    const body = this.block();
    return { name: name.v, ret, retPtr, retRef, params, body, line: name.line, span: this.span(name) };
  }

  /** [3][4] or [] after a name */
  private dims(): (Expr | null)[] {
    const out: (Expr | null)[] = [];
    while (this.isOp('[')) {
      this.next();
      if (this.isOp(']')) {
        this.next();
        out.push(null);
        continue;
      }
      out.push(this.expr());
      this.expect(']');
    }
    return out;
  }

  // ------------------------------------------------------------ types
  private isStructName(t: Token): boolean {
    return t.t === 'id' && this.structNames.has(t.v);
  }

  private startsType(): boolean {
    const t = this.cur;
    if (t.t === 'kw' && TYPE_KWS.has(t.v)) return true;
    if (t.t === 'kw' && (t.v === 'struct' || t.v === 'class') && this.peek().t === 'id') return true;
    if (t.t === 'id' && t.v === 'string' && (this.peek().t === 'id' || this.isOp('&', 1) || this.isOp('*', 1))) return true;
    if (t.t === 'id' && t.v === 'std' && this.isOp('::', 1) && this.peek(2).t === 'id' && this.peek(2).v === 'string') return true;
    if (this.isStructName(t) && (this.peek().t === 'id' || this.isOp('*', 1) || this.isOp('&', 1))) return true;
    return false;
  }

  parseType(): TypeSpec {
    const start = this.cur;
    let isConst = false;
    let sign: 'signed' | 'unsigned' | null = null;
    let longs = 0;
    let isShort = false;
    let base: string | null = null;
    let sname: string | undefined;
    let qual = false;
    for (;;) {
      const t = this.cur;
      if (t.t === 'kw' && t.v === 'const') isConst = true;
      else if (t.t === 'kw' && (t.v === 'unsigned' || t.v === 'signed')) sign = t.v;
      else if (t.t === 'kw' && t.v === 'long') longs++;
      else if (t.t === 'kw' && t.v === 'short') isShort = true;
      else if (t.t === 'kw' && ['int', 'char', 'double', 'float', 'bool', 'void', 'auto'].includes(t.v)) {
        if (base) break;
        base = t.v;
      } else if (t.t === 'kw' && (t.v === 'struct' || t.v === 'class') && !base && this.peek().t === 'id') {
        this.next();
        base = 'struct';
        sname = this.cur.v;
        this.structNames.add(sname);
      } else if (t.t === 'id' && this.structNames.has(t.v) && !base && !sign && !longs) {
        base = 'struct';
        sname = t.v;
      } else if (t.t === 'id' && t.v === 'string' && !base && !sign && !longs) base = 'string';
      else if (t.t === 'id' && t.v === 'std' && this.isOp('::', 1) && this.peek(2).v === 'string' && !base) {
        this.next();
        this.next();
        base = 'string';
        qual = true;
      } else break;
      this.next();
    }
    let canon: BaseType;
    if (base === 'double') canon = longs ? 'long double' : 'double';
    else if (base === 'char') canon = sign === 'unsigned' ? 'unsigned char' : sign === 'signed' ? 'signed char' : 'char';
    else if (isShort) canon = sign === 'unsigned' ? 'unsigned short' : 'short';
    else if (longs >= 2) canon = sign === 'unsigned' ? 'unsigned long long' : 'long long';
    else if (longs === 1) canon = sign === 'unsigned' ? 'unsigned long' : 'long';
    else if (base === null || base === 'int') {
      if (base === null && !sign) this.fail(this.cur, `expected type before ${describeTok(this.cur)}`);
      canon = sign === 'unsigned' ? 'unsigned int' : 'int';
    } else canon = base as BaseType;
    const text = this.src.slice(start.start, this.prev.end).replace(/\s+/g, ' ');
    const ts: TypeSpec & { qual?: boolean } = { base: canon, isConst, text, span: this.span(start) };
    if (sname) ts.sname = sname;
    if (qual) ts.qual = true;
    return ts;
  }

  // ------------------------------------------------------------ statements
  private block(): BlockStmt {
    const open = this.expect('{');
    const body: Stmt[] = [];
    while (!this.isOp('}')) {
      if (this.cur.t === 'eof') {
        throw new CompileError([
          { kind: 'error', line: this.prev.endLine, col: this.prev.endCol, msg: "expected '}' at end of input", help: 'A closing brace } is missing. Every { needs a matching }.' },
          { kind: 'note', line: open.line, col: open.col, msg: "to match this '{'" },
        ]);
      }
      body.push(this.statement());
    }
    const close = this.next();
    return { s: 'block', body, line: open.line, endLine: close.line, span: this.span(open, close), id: this.nid++ };
  }

  private statement(): Stmt {
    const t = this.cur;
    if (t.t === 'pp') this.fail(t, 'preprocessor directives must be at the top of the file', 'Put #include lines at the very top, before int main().');
    if (this.isOp('{')) return this.block();
    if (this.isOp(';')) {
      this.next();
      return { s: 'empty', line: t.line, span: this.span(t), id: this.nid++ };
    }
    if (t.t === 'kw') {
      switch (t.v) {
        case 'if': return this.ifStmt();
        case 'while': {
          this.next();
          this.expect('(');
          const c = this.expr();
          this.expect(')');
          const body = this.statement();
          return { s: 'while', c, body, line: t.line, span: this.span(t), id: this.nid++ };
        }
        case 'do': {
          this.next();
          const body = this.statement();
          const w = this.cur;
          if (!this.isKw('while')) this.fail(w, `expected 'while' before ${describeTok(w)}`);
          this.next();
          this.expect('(');
          const c = this.expr();
          this.expect(')');
          this.expectSemi();
          return { s: 'do', body, c, whileLine: w.line, line: t.line, span: this.span(t), id: this.nid++ };
        }
        case 'for': {
          this.next();
          this.expect('(');
          let init: Stmt | null = null;
          if (this.isOp(';')) this.next();
          else if (this.startsType()) {
            const dstart = this.cur;
            const ty = this.parseType();
            let ptr = 0;
            while (this.isOp('*')) {
              this.next();
              ptr++;
            }
            const ref = this.accept('&');
            const name = this.expectIdent();
            if (this.isOp(':')) {
              this.next();
              const e = this.expr();
              this.expect(')');
              const body = this.statement();
              const decl: DeclStmt = {
                s: 'decl', ty, items: [{ name: name.v, span: this.span(name, name), init: null, style: null, ptr, ref, dims: [] }],
                line: dstart.line, span: this.span(dstart, name), id: this.nid++,
              };
              return { s: 'rfor', decl, e, body, line: t.line, span: this.span(t), id: this.nid++ };
            }
            init = this.declRest(ty, name, dstart, ptr, ref);
          } else {
            const e = this.expr();
            this.expectSemi();
            init = { s: 'expr', e, line: e.span.line, span: e.span, id: this.nid++ };
          }
          const c = this.isOp(';') ? null : this.expr();
          this.expect(';');
          const step = this.isOp(')') ? null : this.expr();
          this.expect(')');
          const body = this.statement();
          return { s: 'for', init, c, step, body, line: t.line, span: this.span(t), id: this.nid++ };
        }
        case 'switch': {
          this.next();
          this.expect('(');
          const e = this.expr();
          this.expect(')');
          let body: BlockStmt;
          if (this.isOp(';')) {
            // switch (x);  → legal C++: the switch has an empty body
            const semi = this.next();
            body = { s: 'block', body: [], line: semi.line, endLine: semi.line, span: this.span(semi), id: this.nid++ };
          } else {
            if (!this.isOp('{')) this.fail(this.cur, `expected '{' before ${describeTok(this.cur)}`);
            body = this.block();
          }
          return { s: 'switch', e, body, line: t.line, span: this.span(t), id: this.nid++ };
        }
        case 'case': {
          this.next();
          const value = this.condExpr();
          if (!this.isOp(':')) this.fail(this.cur, `expected ':' before ${describeTok(this.cur)}`, 'A case label ends with a colon, e.g. case 1:');
          this.next();
          return { s: 'case', value, line: t.line, span: this.span(t), id: this.nid++ };
        }
        case 'default': {
          this.next();
          if (!this.isOp(':')) this.fail(this.cur, `expected ':' before ${describeTok(this.cur)}`, 'Write default: with a colon.');
          this.next();
          return { s: 'case', value: null, line: t.line, span: this.span(t), id: this.nid++ };
        }
        case 'break':
        case 'continue': {
          this.next();
          this.expectSemi();
          return { s: t.v, line: t.line, span: this.span(t), id: this.nid++ };
        }
        case 'return': {
          this.next();
          const e = this.isOp(';') ? null : this.expr();
          this.expectSemi();
          return { s: 'return', e, line: t.line, span: this.span(t), id: this.nid++ };
        }
        case 'delete': {
          this.next();
          let arr = false;
          if (this.isOp('[')) {
            this.next();
            this.expect(']');
            arr = true;
          }
          const e = this.expr();
          this.expectSemi();
          return { s: 'delete', e, arr, line: t.line, span: this.span(t), id: this.nid++ };
        }
        case 'else':
          this.fail(t, "'else' without a previous 'if'", 'An else must come right after the closing } of an if block. Check for a stray ; after the if.');
      }
    }
    if (this.startsType()) return this.declaration();
    const e = this.expr();
    this.expectSemi();
    return { s: 'expr', e, line: t.line, span: this.span(t), id: this.nid++ };
  }

  private ifStmt(): Stmt {
    const t = this.next();
    if (!this.isOp('(')) this.fail(this.cur, `expected '(' before ${describeTok(this.cur)}`, 'The condition of an if must be inside round brackets: if (x > 5)');
    this.next();
    const c = this.expr();
    this.expect(')', 'The condition needs a closing bracket ) before the { of the block.');
    const then = this.statement();
    let els: Stmt | null = null;
    let elseLine: number | null = null;
    if (this.isKw('else')) {
      elseLine = this.cur.line;
      this.next();
      els = this.statement();
    }
    return { s: 'if', c, then, els, elseLine, line: t.line, span: this.span(t), id: this.nid++ };
  }

  private declaration(): DeclStmt {
    const start = this.cur;
    const ty = this.parseType();
    let ptr = 0;
    let cptr = false;
    while (this.isOp('*')) {
      this.next();
      ptr++;
      if (this.isKw('const')) {
        this.next();
        cptr = true;
      }
    }
    const ref = this.accept('&');
    const name = this.expectIdent();
    return this.declRest(ty, name, start, ptr, ref, cptr);
  }

  private initList(): Expr {
    const open = this.expect('{');
    const items: Expr[] = [];
    while (!this.isOp('}')) {
      items.push(this.isOp('{') ? this.initList() : this.assignExpr());
      if (!this.accept(',')) break;
    }
    this.expect('}', 'An initializer list { ... } must be closed with }.');
    return { k: 'list', items, span: this.span(open), id: this.nid++ };
  }

  private declRest(ty: TypeSpec, first: Token, start: Token, firstPtr = 0, firstRef = false, firstCptr = false): DeclStmt {
    const items: Declarator[] = [];
    let nameTok: Token | null = first;
    let ptr = firstPtr;
    let ref = firstRef;
    for (;;) {
      let cptr = nameTok ? firstCptr : false;
      if (!nameTok) {
        ptr = 0;
        while (this.isOp('*')) {
          this.next();
          ptr++;
          if (this.isKw('const')) {
            this.next();
            cptr = true;
          }
        }
        ref = this.accept('&');
      }
      const nt = nameTok ?? this.expectIdent();
      nameTok = null;
      const dims = this.dims();
      const compound = dims.length > 0 || (ty.base === 'struct' && ptr === 0);
      let init: Expr | null = null;
      let style: Declarator['style'] = null;
      if (this.accept('=')) {
        if (this.isOp('{')) {
          const l = this.initList() as Extract<Expr, { k: 'list' }>;
          init = compound ? l : l.items.length ? l.items[0] : null;
          if (!compound && l.items.length > 1) this.fail(this.prev, `scalar object '${nt.v}' requires one element in initializer`, 'Only arrays and structs can take a list of values in { }.');
          style = '{}';
        } else {
          init = this.assignExpr();
          style = '=';
        }
      } else if (this.isOp('{')) {
        const l = this.initList() as Extract<Expr, { k: 'list' }>;
        init = compound ? l : l.items.length ? l.items[0] : null;
        style = '{}';
      } else if (this.isOp('(')) {
        this.next();
        init = this.assignExpr();
        this.expect(')');
        style = '()';
      }
      items.push({ name: nt.v, span: this.span(nt, nt), init, style, ptr, cptr, ref, dims });
      if (this.accept(',')) continue;
      if (this.isOp(';')) {
        this.next();
        break;
      }
      if (this.cur.t === 'eof') this.fail(this.cur, "expected ',' or ';' at end of input");
      this.fail(this.cur, `expected ',' or ';' before ${describeTok(this.cur)}`,
        'The declaration on the line above is missing its semicolon ; (or a comma between variables).');
    }
    return { s: 'decl', ty, items, line: start.line, span: this.span(start), id: this.nid++ };
  }

  // ------------------------------------------------------------ expressions
  expr(): Expr {
    let e = this.assignExpr();
    while (this.isOp(',')) {
      const op = this.next();
      const r = this.assignExpr();
      e = { k: 'bin', op: ',', l: e, r, opSpan: this.span(op, op), span: this.spanE(e, r), id: this.nid++ };
    }
    return e;
  }

  private isLvalue(e: Expr): boolean {
    if (e.k === 'id' || e.k === 'idx' || e.k === 'mem') return true;
    if (e.k === 'paren') return this.isLvalue(e.e);
    if (e.k === 'un' && !e.postfix && (e.op === '++' || e.op === '--' || e.op === '*')) return true;
    if (e.k === 'asg') return true;
    if (e.k === 'call') return true; // may return a reference; the checker decides
    return false;
  }

  assignExpr(): Expr {
    const l = this.condExpr();
    if (this.cur.t === 'op' && ASSIGN_OPS.has(this.cur.v)) {
      const opTok = this.next();
      const r = this.isOp('{') ? this.initList() : this.assignExpr();
      if (!this.isLvalue(l)) {
        this.fail(opTok, 'lvalue required as left operand of assignment',
          'The left side of = must be a variable. To compare two values use == instead.');
      }
      return { k: 'asg', op: opTok.v, l, r, opSpan: this.span(opTok, opTok), span: this.spanE(l, r), id: this.nid++ };
    }
    return l;
  }

  private condExpr(): Expr {
    const c = this.binary(1);
    if (this.isOp('?')) {
      this.next();
      const a = this.expr();
      if (!this.isOp(':')) this.fail(this.cur, `expected ':' before ${describeTok(this.cur)}`, 'The ternary operator needs both parts: condition ? valueIfTrue : valueIfFalse');
      this.next();
      const b = this.assignExpr();
      return { k: 'cond', c, a, b, span: this.spanE(c, b), id: this.nid++ };
    }
    return c;
  }

  private binary(minPrec: number): Expr {
    let left = this.unary();
    for (;;) {
      const t = this.cur;
      if (t.t !== 'op') break;
      const prec = PREC[t.v];
      if (!prec || prec < minPrec) break;
      this.next();
      const right = this.binary(prec + 1);
      left = { k: 'bin', op: t.v, l: left, r: right, opSpan: this.span(t, t), span: this.spanE(left, right), id: this.nid++ };
    }
    return left;
  }

  private startsCast(): boolean {
    if (!this.isOp('(')) return false;
    let k = 1;
    let sawType = false;
    for (;;) {
      const t = this.peek(k);
      if (t.t === 'kw' && (CAST_KWS.has(t.v) || t.v === 'const')) {
        sawType = true;
        k++;
        continue;
      }
      break;
    }
    return sawType && this.isOp(')', k);
  }

  private unary(): Expr {
    const t = this.cur;
    if (t.t === 'op' && (t.v === '++' || t.v === '--')) {
      this.next();
      const e = this.unary();
      if (!this.isLvalue(e)) this.fail(t, `lvalue required as ${t.v === '++' ? 'increment' : 'decrement'} operand`, `${t.v} only works on a variable, not on a value.`);
      return { k: 'un', op: t.v, e, postfix: false, span: { ...this.span(t), end: e.span.end }, id: this.nid++ };
    }
    if (t.t === 'op' && (t.v === '+' || t.v === '-' || t.v === '!' || t.v === '~' || t.v === '*' || t.v === '&')) {
      this.next();
      const e = this.unary();
      if (t.v === '&' && !this.isLvalue(e)) this.fail(t, "lvalue required as unary '&' operand", '& gives the address of a variable, so it needs a variable after it, not a value.');
      return { k: 'un', op: t.v, e, postfix: false, span: { ...this.span(t), end: e.span.end }, id: this.nid++ };
    }
    if (t.t === 'kw' && t.v === 'new') {
      this.next();
      if (!this.startsType() && !(this.cur.t === 'id' && this.structNames.has(this.cur.v)) && !(this.cur.t === 'kw' && TYPE_KWS.has(this.cur.v)) && !(this.cur.t === 'id' && this.cur.v === 'string')) {
        this.fail(this.cur, `expected type-specifier before ${describeTok(this.cur)}`, 'After new write a type, e.g. new int or new int[5].');
      }
      const ty = this.parseType();
      let ptr = 0;
      while (this.isOp('*')) {
        this.next();
        ptr++;
      }
      let dim: Expr | null = null;
      let init: Expr | null = null;
      if (this.isOp('[')) {
        this.next();
        dim = this.expr();
        this.expect(']');
        if (this.isOp('{')) init = this.initList();
      } else if (this.isOp('(')) {
        const open = this.next();
        // new int() → value-initialised (0): an empty list means "zero it"
        init = this.isOp(')') ? { k: 'list', items: [], span: this.span(open), id: this.nid++ } : this.assignExpr();
        this.expect(')');
      } else if (this.isOp('{')) init = this.initList();
      return { k: 'new', ty, ptr, dim, init, span: this.span(t), id: this.nid++ };
    }
    if (t.t === 'kw' && t.v === 'sizeof') {
      this.next();
      if (this.isOp('(') && ((this.peek().t === 'kw' && TYPE_KWS.has(this.peek().v)) || (this.peek().t === 'id' && (this.peek().v === 'string' || this.structNames.has(this.peek().v))))) {
        this.next();
        const ty = this.parseType();
        let ptr = 0;
        while (this.isOp('*')) {
          this.next();
          ptr++;
        }
        this.expect(')');
        return { k: 'sizeof', ty, tyPtr: ptr, e: null, span: this.span(t), id: this.nid++ };
      }
      const e = this.unary();
      return { k: 'sizeof', ty: null, e, span: { ...this.span(t), end: e.span.end }, id: this.nid++ };
    }
    if (this.startsCast()) {
      this.next();
      const ty = this.parseType();
      this.expect(')');
      const e = this.unary();
      return { k: 'cast', ty, e, style: 'c', span: { ...this.span(t), end: e.span.end }, id: this.nid++ };
    }
    return this.postfix();
  }

  private postfix(): Expr {
    let e = this.primary();
    for (;;) {
      const t = this.cur;
      if (t.t !== 'op') break;
      if (t.v === '++' || t.v === '--') {
        if (!this.isLvalue(e)) this.fail(t, `lvalue required as ${t.v === '++' ? 'increment' : 'decrement'} operand`);
        this.next();
        e = { k: 'un', op: t.v, e, postfix: true, span: { ...e.span, end: t.end }, id: this.nid++ };
      } else if (t.v === '[') {
        this.next();
        const i = this.expr();
        const close = this.expect(']');
        e = { k: 'idx', obj: e, i, span: { ...e.span, end: close.end }, id: this.nid++ };
      } else if (t.v === '.' || t.v === '->') {
        this.next();
        const name = this.expectIdent();
        if (this.isOp('(') && t.v === '.') {
          const args = this.args();
          e = { k: 'mcall', obj: e, name: name.v, args, span: { ...e.span, end: this.prev.end }, id: this.nid++ };
        } else {
          e = { k: 'mem', obj: e, name: name.v, arrow: t.v === '->', nameSpan: this.span(name, name), span: { ...e.span, end: name.end }, id: this.nid++ };
        }
      } else if (t.v === '(' && e.k === 'id') {
        const args = this.args();
        e = { k: 'call', name: e.name, qual: e.qual, args, nameSpan: e.span, span: { ...e.span, end: this.prev.end }, id: this.nid++ };
      } else break;
    }
    return e;
  }

  private args(): Expr[] {
    this.expect('(');
    const out: Expr[] = [];
    if (!this.isOp(')')) {
      do out.push(this.assignExpr());
      while (this.accept(','));
    }
    this.expect(')');
    return out;
  }

  private primary(): Expr {
    const t = this.cur;
    switch (t.t) {
      case 'num': {
        this.next();
        return { k: 'lit', v: parseNumber(t), raw: t.v, span: this.span(t, t), id: this.nid++ };
      }
      case 'str': {
        let text = t.sv ?? '';
        this.next();
        while (this.cur.t === 'str') {
          text += this.cur.sv ?? '';
          this.next();
        }
        return { k: 'lit', v: { t: 'cstr', v: text }, raw: this.src.slice(t.start, this.prev.end), span: this.span(t), id: this.nid++ };
      }
      case 'char': {
        this.next();
        const s = t.sv ?? '';
        let v: RV;
        if (s.length <= 1) v = { t: 'char', v: BigInt(s.charCodeAt(0) & 0xff) };
        else {
          let code = 0;
          for (const ch of s) code = code * 256 + (ch.charCodeAt(0) & 0xff);
          v = { t: 'int', v: BigInt.asIntN(32, BigInt(code)) };
        }
        return { k: 'lit', v, raw: t.v, span: this.span(t, t), id: this.nid++ };
      }
      case 'kw': {
        if (t.v === 'true' || t.v === 'false') {
          this.next();
          return { k: 'lit', v: { t: 'bool', v: t.v === 'true' }, raw: t.v, span: this.span(t, t), id: this.nid++ };
        }
        if (t.v === 'nullptr') {
          this.next();
          return { k: 'lit', v: { t: 'ptr', v: 0, pt: 'void' }, raw: 'nullptr', span: this.span(t, t), id: this.nid++ };
        }
        if (t.v === 'static_cast') {
          this.next();
          this.expect('<');
          const ty = this.parseType();
          this.expect('>');
          this.expect('(');
          const e = this.expr();
          this.expect(')');
          return { k: 'cast', ty, e, style: 'static', span: this.span(t), id: this.nid++ };
        }
        if (CAST_KWS.has(t.v) && this.isOp('(', 1)) {
          const ty = this.parseType();
          this.expect('(');
          const e = this.expr();
          this.expect(')');
          return { k: 'cast', ty, e, style: 'func', span: this.span(t), id: this.nid++ };
        }
        return this.fail(t, `expected primary-expression before '${t.v}'`,
          TYPE_KWS.has(t.v) ? 'A type name cannot appear in the middle of an expression. Declare the variable on its own line first.' : undefined);
      }
      case 'id': {
        if (t.v === 'std' && this.isOp('::', 1)) {
          this.next();
          this.next();
          const name = this.expectIdent();
          return { k: 'id', name: name.v, qual: true, span: this.span(t, name), id: this.nid++ };
        }
        if (t.v === 'NULL') {
          this.next();
          return { k: 'lit', v: { t: 'int', v: BigInt(0) }, raw: 'NULL', span: this.span(t, t), id: this.nid++ };
        }
        this.next();
        return { k: 'id', name: t.v, qual: false, span: this.span(t, t), id: this.nid++ };
      }
      case 'op': {
        if (t.v === '::' && this.peek().t === 'id') {
          this.next();
          const name = this.expectIdent();
          return { k: 'id', name: name.v, qual: false, global: true, span: this.span(t, name), id: this.nid++ };
        }
        if (t.v === '(') {
          this.next();
          const e = this.expr();
          this.expect(')', 'A bracket ( was opened but never closed with ).');
          return { k: 'paren', e, span: this.span(t), id: this.nid++ };
        }
        break;
      }
    }
    if (t.t === 'eof') this.fail(t, 'expected primary-expression at end of input');
    return this.fail(t, `expected primary-expression before ${describeTok(t)}`,
      t.v === ';' || t.v === ')' ? 'Something is missing here — a value or variable was expected.' : undefined);
  }
}

export function parseNumber(t: Token): RV {
  const raw = t.v.replace(/'/g, '');
  const suffix = (/[uUlLfF]*$/.exec(raw)?.[0] ?? '').toLowerCase();
  const body = raw.slice(0, raw.length - suffix.length);
  const isHex = /^0[xX]/.test(body);
  const isFloat = !isHex && /[.eE]/.test(body);
  if (isFloat) {
    const x = parseFloat(body.startsWith('.') ? '0' + body : body);
    if (suffix.includes('f')) return { t: 'float', v: Math.fround(x) };
    if (suffix.includes('l')) return { t: 'long double', v: x };
    return { t: 'double', v: x };
  }
  let big: bigint;
  if (isHex || /^0[bB]/.test(body)) big = BigInt(body);
  else if (/^0[0-7]+$/.test(body)) big = BigInt('0o' + body.slice(1));
  else big = BigInt(body);
  const unsigned = suffix.includes('u');
  const longs = (suffix.match(/l/g) ?? []).length;
  const fits = (max: bigint) => big <= max;
  const I32 = BigInt(2147483647);
  const U32 = BigInt(4294967295);
  let t2: RV['t'];
  if (longs >= 2) t2 = unsigned ? 'unsigned long long' : 'long long';
  else if (unsigned) t2 = fits(U32) ? (longs ? 'unsigned long' : 'unsigned int') : 'unsigned long long';
  else if (longs === 1) t2 = fits(I32) ? 'long' : 'long long';
  else t2 = fits(I32) ? 'int' : isHex && fits(U32) ? 'unsigned int' : 'long long';
  if (!isIntegral(t2)) t2 = 'int';
  return { t: t2, v: big };
}
