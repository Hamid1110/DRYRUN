import { CompileError, type Diag } from './types';

export type TokType = 'id' | 'kw' | 'num' | 'char' | 'str' | 'op' | 'pp' | 'eof';

export interface Token {
  t: TokType;
  /** raw source text of the token */
  v: string;
  /** decoded value for string / char literals */
  sv?: string;
  line: number;
  col: number;
  start: number;
  end: number;
  /** line/col just after the token (g++ reports missing ';' there) */
  endLine: number;
  endCol: number;
}

export const KEYWORDS = new Set([
  'int', 'double', 'float', 'char', 'bool', 'void', 'long', 'short', 'unsigned', 'signed',
  'const', 'auto', 'if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'return',
  'while', 'do', 'for', 'true', 'false', 'using', 'namespace', 'sizeof', 'static_cast',
  'struct', 'class', 'new', 'delete', 'nullptr', 'goto',
  'public', 'private', 'protected', 'virtual', 'override',
]);

const OPS3 = ['<<=', '>>=', '...'];
const OPS2 = [
  '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '&&', '||', '==', '!=', '<=', '>=',
  '<<', '>>', '->', '::',
];
const OPS1 = '+-*/%<>=!~&|^?:;,.(){}[]';

const isDigit = (c: string | undefined) => c !== undefined && c >= '0' && c <= '9';
const isIdStart = (c: string | undefined) => c !== undefined && /[A-Za-z_]/.test(c);
const isIdChar = (c: string | undefined) => c !== undefined && /[A-Za-z0-9_]/.test(c);

function err(line: number, col: number, msg: string, help?: string): never {
  throw new CompileError([{ kind: 'error', line, col, msg, help }]);
}

export function decodeEscapes(body: string, line: number, col: number, warnings: Diag[]): string {
  let out = '';
  for (let k = 0; k < body.length; k++) {
    const ch = body[k];
    if (ch !== '\\') {
      out += ch;
      continue;
    }
    const e = body[++k];
    switch (e) {
      case 'n': out += '\n'; break;
      case 't': out += '\t'; break;
      case '\\': out += '\\'; break;
      case "'": out += "'"; break;
      case '"': out += '"'; break;
      case '?': out += '?'; break;
      case 'a': out += '\x07'; break;
      case 'b': out += '\b'; break;
      case 'f': out += '\f'; break;
      case 'r': out += '\r'; break;
      case 'v': out += '\v'; break;
      case 'x': {
        let hex = '';
        while (/[0-9a-fA-F]/.test(body[k + 1] ?? '')) hex += body[++k];
        out += String.fromCharCode(parseInt(hex || '0', 16) & 0xff);
        break;
      }
      default:
        if (e !== undefined && /[0-7]/.test(e)) {
          let oct = e;
          while (oct.length < 3 && /[0-7]/.test(body[k + 1] ?? '')) oct += body[++k];
          out += String.fromCharCode(parseInt(oct, 8) & 0xff);
        } else {
          warnings.push({
            kind: 'warning',
            line,
            col,
            msg: `unknown escape sequence: '\\${e ?? ''}'`,
            help: `\\${e ?? ''} is not a real escape sequence, so C++ just prints '${e ?? ''}'. Valid ones: \\n \\t \\\\ \\" \\'.`,
          });
          out += e ?? '';
        }
    }
  }
  return out;
}

export function lex(src: string, warnings: Diag[]): Token[] {
  const toks: Token[] = [];
  const n = src.length;
  let i = 0;
  let line = 1;
  let col = 1;
  let atLineStart = true;

  const adv = (k = 1) => {
    for (let j = 0; j < k && i < n; j++) {
      if (src[i] === '\n') {
        line++;
        col = 1;
        atLineStart = true;
      } else {
        col++;
      }
      i++;
    }
  };

  while (i < n) {
    const c = src[i];
    if (c === '\n' || c === ' ' || c === '\t' || c === '\r' || c === '\f' || c === '\v') {
      adv();
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') adv();
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const sl = line;
      const sc = col;
      adv(2);
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) adv();
      if (i >= n) err(sl, sc, 'unterminated comment', 'A /* comment */ must be closed with */.');
      adv(2);
      continue;
    }

    const sLine = line;
    const sCol = col;
    const start = i;
    const push = (t: TokType, extra?: Partial<Token>) => {
      toks.push({
        t,
        v: src.slice(start, i),
        line: sLine,
        col: sCol,
        start,
        end: i,
        endLine: line,
        endCol: col,
        ...extra,
      });
    };

    if (c === '#' && atLineStart) {
      while (i < n && src[i] !== '\n') adv();
      toks.push({
        t: 'pp',
        v: src.slice(start, i).trim(),
        line: sLine,
        col: sCol,
        start,
        end: i,
        endLine: sLine,
        endCol: col,
      });
      continue;
    }
    atLineStart = false;

    // numbers
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1]))) {
      let j = i;
      if (c === '0' && (src[j + 1] === 'x' || src[j + 1] === 'X')) {
        j += 2;
        while (/[0-9a-fA-F']/.test(src[j] ?? '')) j++;
      } else if (c === '0' && (src[j + 1] === 'b' || src[j + 1] === 'B')) {
        j += 2;
        while (/[01']/.test(src[j] ?? '')) j++;
      } else {
        while (/[0-9']/.test(src[j] ?? '')) j++;
        if (src[j] === '.') {
          j++;
          while (/[0-9']/.test(src[j] ?? '')) j++;
        }
        if (src[j] === 'e' || src[j] === 'E') {
          let k = j + 1;
          if (src[k] === '+' || src[k] === '-') k++;
          if (isDigit(src[k])) {
            j = k;
            while (isDigit(src[j])) j++;
          }
        }
      }
      while (/[uUlLfF]/.test(src[j] ?? '')) j++;
      if (isIdStart(src[j])) {
        let k = j;
        while (isIdChar(src[k])) k++;
        err(sLine, sCol, `invalid suffix "${src.slice(j, k)}" on integer constant`,
          'A name cannot start with a digit, and a number cannot have letters stuck to it.');
      }
      adv(j - i);
      push('num');
      continue;
    }

    if (isIdStart(c)) {
      while (isIdChar(src[i])) adv();
      const word = src.slice(start, i);
      push(KEYWORDS.has(word) ? 'kw' : 'id');
      continue;
    }

    if (c === '"' || c === "'") {
      const q = c;
      adv();
      let body = '';
      let closed = false;
      while (i < n && src[i] !== '\n') {
        if (src[i] === '\\') {
          body += src[i];
          adv();
          if (i < n && src[i] !== '\n') {
            body += src[i];
            adv();
          }
          continue;
        }
        if (src[i] === q) {
          closed = true;
          adv();
          break;
        }
        body += src[i];
        adv();
      }
      if (!closed) {
        err(sLine, sCol, `missing terminating ${q} character`,
          q === '"'
            ? 'Every string must start AND end with a double quote " on the same line.'
            : "A character literal must be closed with a single quote ', like 'A'.");
      }
      const decoded = decodeEscapes(body, sLine, sCol, warnings);
      if (q === "'") {
        if (decoded.length === 0) err(sLine, sCol, 'empty character constant', "A char holds exactly one character, e.g. 'A'. Use \"\" for an empty string.");
        if (decoded.length > 1) {
          warnings.push({
            kind: 'warning',
            line: sLine,
            col: sCol,
            msg: 'multi-character character constant [-Wmultichar]',
            help: "Single quotes hold ONE character. For text with several characters use double quotes: \"" + decoded + '".',
          });
        }
      }
      if (q === '"' && isIdStart(src[i])) {
        // "text"word  -> C++11 user-defined literal suffix, a classic sign of an unescaped quote
        let k = i;
        while (isIdChar(src[k])) k++;
        err(sLine, col, `unable to find string literal operator 'operator""${src.slice(i, k)}' with 'const char [${decoded.length + 1}]', 'long unsigned int' arguments`,
          'A double quote in the middle ended your string early. To print a " inside a string, write \\" (backslash + quote).');
      }
      push(q === '"' ? 'str' : 'char', { sv: decoded });
      continue;
    }

    const three = src.slice(i, i + 3);
    const two = src.slice(i, i + 2);
    if (OPS3.includes(three)) {
      adv(3);
      push('op');
      continue;
    }
    if (OPS2.includes(two)) {
      adv(2);
      push('op');
      continue;
    }
    if (OPS1.includes(c)) {
      adv();
      push('op');
      continue;
    }

    if (c === '“' || c === '”' || c === '‘' || c === '’') {
      err(sLine, sCol, `extended character ${c} is not valid in an identifier`,
        'This is a curly quote (it often comes from Word or WhatsApp). C++ only understands straight quotes: " and \'.');
    }
    err(sLine, sCol, `stray '${c}' in program`, `The character ${c} has no meaning in C++ here.`);
  }

  toks.push({ t: 'eof', v: '', line, col, start: n, end: n, endLine: line, endCol: col });
  return toks;
}
