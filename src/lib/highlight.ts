// Small C++ syntax highlighter → tokens per line.
// Blanks for fill-in questions are written as [[1]], [[2]] … in the source.

export interface HTok {
  text: string;
  cls: string;
}

const CONTROL = new Set(['if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'using', 'namespace', 'goto']);
const TYPES = new Set(['int', 'double', 'float', 'char', 'bool', 'void', 'long', 'short', 'unsigned', 'signed', 'const', 'auto', 'string', 'static_cast', 'sizeof']);
const LITS = new Set(['true', 'false', 'nullptr']);
const IO = new Set(['cout', 'cin', 'cerr', 'endl', 'std', 'getline', 'setw', 'setprecision', 'setfill', 'fixed', 'left', 'right', 'boolalpha', 'showpoint', 'flush', 'scientific']);

const TOKEN_RE =
  /(\[\[\d+\]\])|(\/\/[^\n]*)|(\/\*[\s\S]*?(?:\*\/|$))|(^[ \t]*#[^\n]*)|("(?:\\.|[^"\\\n])*"?)|('(?:\\.|[^'\\\n])*'?)|(\b\d[\d.']*(?:[eE][+-]?\d+)?[uUlLfF]*\b|\.\d+\b)|([A-Za-z_]\w*)|(<<=|>>=|<<|>>|\+\+|--|&&|\|\||==|!=|<=|>=|[-+*/%=<>!&|^~?:])|([{}()[\];,.])|(\n)|([ \t]+)|(\uE000[\uE100-\uE1FF]|.)/gm;

function splitString(s: string, cls: 'str' | 'chr'): HTok[] {
  const out: HTok[] = [];
  const re = /\\(?:x[0-9a-fA-F]+|[0-7]{1,3}|.)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index), cls });
    out.push({ text: m[0], cls: 'esc' });
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ text: s.slice(last), cls });
  return out;
}

// Blanks are swapped for private-use characters before tokenising, so a blank can sit
// anywhere — even inside a string literal — without breaking the token around it.
const BLANK_START = '\uE000';
const BLANK_BASE = 0xe100;

export function highlight(src0: string, opts: { blanks?: boolean } = {}): HTok[][] {
  const src = opts.blanks === false ? src0 : src0.replace(/\[\[(\d+)\]\]/g, (_, n) => BLANK_START + String.fromCharCode(BLANK_BASE + Number(n)));
  const lines: HTok[][] = [[]];
  const pushOne = (text: string, cls: string) => {
    const parts = text.split('\n');
    parts.forEach((p, i) => {
      if (i > 0) lines.push([]);
      if (p) lines[lines.length - 1].push({ text: p, cls });
    });
  };
  const push = (t: HTok) => {
    if (!t.text.includes(BLANK_START)) return pushOne(t.text, t.cls);
    const re = /\uE000([\uE100-\uE1FF])/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(t.text))) {
      if (m.index > last) pushOne(t.text.slice(last, m.index), t.cls);
      lines[lines.length - 1].push({ text: String(m[1].charCodeAt(0) - BLANK_BASE), cls: 'blank' });
      last = re.lastIndex;
    }
    if (last < t.text.length) pushOne(t.text.slice(last), t.cls);
  };
  const re = new RegExp(TOKEN_RE.source, 'gm');
  let m: RegExpExecArray | null;
  let prevWord = '';
  while ((m = re.exec(src))) {
    const [all, blank, lc, bc, pp, str, chr, num, word, op, pun, nl, ws] = m;
    if (blank) push(opts.blanks === false ? { text: blank, cls: 'pun' } : { text: blank.slice(2, -2), cls: 'blank' });
    else if (lc || bc) push({ text: all, cls: 'com' });
    else if (pp) {
      const mm = /^([ \t]*#\s*\w+)(.*)$/.exec(pp);
      if (mm) {
        push({ text: mm[1], cls: 'pp' });
        if (mm[2]) push({ text: mm[2], cls: 'ppf' });
      } else push({ text: pp, cls: 'pp' });
    } else if (str) splitString(str, 'str').forEach(push);
    else if (chr) splitString(chr, 'chr').forEach(push);
    else if (num) push({ text: num, cls: 'num' });
    else if (word) {
      let cls = 'id';
      if (CONTROL.has(word)) cls = 'kw';
      else if (TYPES.has(word)) cls = 'ty';
      else if (LITS.has(word)) cls = 'lit';
      else if (IO.has(word)) cls = 'io';
      else if (word === 'main') cls = 'fn';
      else if (/^\s*\(/.test(src.slice(re.lastIndex))) cls = 'fn';
      push({ text: word, cls });
      prevWord = word;
    } else if (op) push({ text: op, cls: 'op' });
    else if (pun) push({ text: pun, cls: 'pun' });
    else if (nl) lines.push([]);
    else if (ws) push({ text: ws, cls: 'ws' });
    else push({ text: all, cls: 'id' });
  }
  void prevWord;
  return lines;
}

/** Plain text of a code snippet with blanks replaced. */
export function fillBlanks(src: string, values: string[]): string {
  return src.replace(/\[\[(\d+)\]\]/g, (_, n) => values[Number(n) - 1] ?? '');
}
