import type { Level } from '../types';
import { cpp, prog } from '../helpers';

export const L4: Level = {
  id: 'escape-sequences',
  kind: 'lesson',
  title: 'Special characters: \\t \\" \\\\',
  tagline: 'How do you print a quote mark, a backslash or neat columns? With escape sequences — a backslash plus one letter.',
  minutes: 20,
  objectives: [
    'Print double quotes, single quotes and backslashes inside text',
    'Line up simple columns with the tab `\\t` — and know when tabs break the columns',
    'Read an escape sequence as ONE character',
  ],

  learn: [
    {
      t: 'p',
      text: 'Some characters cannot be typed directly inside a string. A `"` would **end** the string, and a new line cannot be typed inside quotes. C++ solves this with **escape sequences**: a backslash `\\` followed by one character. Together they mean *one* special character.',
    },
    {
      t: 'table',
      head: ['Escape', 'Name', 'What it prints'],
      rows: [
        ['`\\n`', 'newline', 'moves to the start of the next line'],
        ['`\\t`', 'tab', 'jumps to the next *tab stop* (every 8 columns)'],
        ['`\\"`', 'double quote', 'a `"` that does NOT end the string'],
        ["`\\'`", 'single quote', "a `'` (needed inside single quotes: `'\\''`)"],
        ['`\\\\`', 'backslash', 'one `\\`'],
      ],
    },
    {
      t: 'callout',
      tone: 'key',
      title: 'Two characters in the code, one on the screen',
      text: 'In the code `"\\t"` you see two characters: `\\` and `t`. On the screen it is **one** tab. That is why the dry run shows escape sequences in orange.',
    },
    { t: 'h', text: 'Quotes inside quotes' },
    {
      t: 'compare',
      items: [
        {
          title: 'Breaks the string',
          good: false,
          code: prog(cpp`
    cout << "She said "Hi"";`),
          note: 'The second `"` ends the string early, and the compiler gets confused by `Hi`.',
        },
        {
          title: 'Escaped quotes',
          good: true,
          code: prog(cpp`
    cout << "She said \"Hi\"";`),
        },
      ],
    },
    { t: 'h', text: 'Backslashes: file paths' },
    {
      t: 'p',
      text: 'Because `\\` starts an escape sequence, a single backslash must be written as `\\\\`. Windows paths need this all the time:',
    },
    {
      t: 'code',
      code: prog(cpp`
    cout << "C:\\Users\\Ali\\notes.txt";`),
      caption: 'Each `\\\\` in the code prints one `\\`.',
    },
    { t: 'h', text: 'Tabs and columns' },
    {
      t: 'p',
      text: 'The console has invisible **tab stops** every 8 columns (at columns 8, 16, 24 …). A `\\t` moves the cursor to the **next** tab stop. Short words line up nicely — but a word of 8 characters or more pushes past the stop, and the column breaks.',
    },
    {
      t: 'viz',
      title: 'Why does the last row not line up?',
      code: prog(cpp`
    cout << "Name\tMarks\n";
    cout << "Ali\t85\n";
    cout << "Fatima\t92\n";
    cout << "Muhammad\t77\n";`),
    },
    {
      t: 'callout',
      tone: 'tip',
      title: 'Why Muhammad breaks the column',
      text: '`Muhammad` has 8 letters, so it already reaches column 8. The tab jumps to the **next** stop, column 16. Later you will learn `setw()`, which gives exact column widths.',
    },
  ],

  ways: {
    goal: 'Print exactly: `He said "Hi"`',
    items: [
      { title: 'Escape both quotes', code: prog(cpp`
    cout << "He said \"Hi\"";`) },
      { title: 'Quotes as separate pieces', code: prog(cpp`
    cout << "He said " << "\"" << "Hi" << "\"";`) },
      { title: 'A quote as a single character', code: prog(cpp`
    cout << "He said " << '"' << "Hi" << '"';`), note: "Inside single quotes, `\"` needs no backslash: `'\"'` is one double-quote character." },
      { title: 'Hex code of the quote (for the curious)', code: prog(cpp`
    cout << "He said \x22Hi\x22";`), note: '`\\x22` is the ASCII code of `"` written in hexadecimal. You will rarely need this.' },
    ],
    takeaway: 'Inside `"..."`, a double quote must be escaped: `\\"`. Inside `\'...\'`, a single quote must be escaped: `\'\\\'\'`.',
    check: {
      id: 'l4-ways-check',
      kind: 'mcq',
      prompt: 'Which statement prints `It\'s "OK"`?',
      options: ['`cout << "It\'s \\"OK\\"";`', '`cout << "It\'s "OK"";`', '`cout << \'It\'s "OK"\';`', '`cout << "It\\\'s /"OK/"";`'],
      answer: 0,
      explain: 'Inside double quotes, the single quote needs no escape, but each double quote does: `\\"`.',
    },
  },

  watch: [
    {
      title: 'Escapes, one at a time',
      intro: 'Step through and read what each escape becomes. Turn on **Show spaces & new lines** to see the tabs as `→`.',
      code: prog(cpp`
    cout << "Tab:\t|" << endl;
    cout << "Quote: \"" << endl;
    cout << "Backslash: \\" << endl;
    cout << "Single: " << '\'' << endl;`),
    },
    {
      title: 'A tiny table with tabs',
      code: prog(cpp`
    cout << "Item\tQty\tPrice\n";
    cout << "Pen\t3\t60\n";
    cout << "Copy\t2\t180\n";`),
    },
  ],

  think: {
    title: 'A file path',
    problem: 'Print this path exactly: `C:\\Games\\Chess\\save.dat`',
    steps: [
      { text: 'Write the text inside double quotes.', lines: [5] },
      { text: 'Every single backslash on screen needs **two** backslashes in the code.', lines: [5] },
      { text: 'There are 3 backslashes in the path, so the code needs 6.', lines: [5] },
      { text: 'End with `endl` so the cursor goes to a new line.', lines: [5] },
    ],
    code: prog(cpp`
    cout << "C:\\Games\\Chess\\save.dat" << endl;`),
    why: 'Count before you type: 3 backslashes on screen → 6 in the code.',
    yourTurn: {
      id: 'l4-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'Dry run it. Write what each line prints. Type `\\t` for a tab and `\\n` for a new line, and write a backslash as `\\\\`.',
      code: prog(cpp`
    cout << "Path: D:\\PF\n";
    cout << "Say \"yes\"\n";
    cout << "A\tB\n";`),
      given: [0],
      hints: ['On screen, `\\"` is just `"`.', 'Line 7: A, then a tab, then B, then a newline.'],
      explain: 'On screen: `Path: D:\\PF`, then `Say "yes"`, then `A` and `B` separated by a tab.',
    },
  },

  practice: [
    {
      id: 'l4-q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: prog(cpp`
    cout << "Pakistan \"Zindabad\"";`),
      explain: 'Each `\\"` prints one `"`: `Pakistan "Zindabad"`.',
    },
    {
      id: 'l4-q2',
      kind: 'mcq',
      prompt: 'How many backslashes appear on the screen?',
      code: prog(cpp`
    cout << "a\\b\\\\c";`),
      options: ['1', '2', '3', '6'],
      answer: 2,
      explain: '`\\\\` prints one backslash. The code has one `\\\\` and then `\\\\\\\\` (two of them), so 3 backslashes appear: `a\\b\\\\c`.',
    },
    {
      id: 'l4-q3',
      kind: 'bug',
      prompt: 'This should print `Title: "C++ Basics"` but it does not compile.',
      code: prog(cpp`
    cout << "Title: "C++ Basics"";`),
      bugLine: 5,
      options: ['Write each inner quote as `\\"`', 'Use single quotes around the whole text', 'Add a space before `C++`', 'Write `/"` instead of `"`'],
      answer: 0,
      fixed: prog(cpp`
    cout << "Title: \"C++ Basics\"";`),
      hints: ['Where does the compiler think the first string ends?'],
      explain: 'The inner `"` ended the string after `Title: `. Escaping it as `\\"` makes it part of the text.',
    },
    {
      id: 'l4-q4',
      kind: 'blanks',
      prompt: 'Complete the code so it prints the path `C:\\Temp` (one backslash).',
      code: prog(cpp`
    cout << "C:[[1]]Temp";`),
      blanks: [{ answers: ['\\\\'] }],
      chips: ['\\', '\\\\', '/', '\\t'],
      output: 'C:\\Temp',
      hints: ['A single `\\` starts an escape sequence. How do you print one real backslash?'],
      explain: '`\\\\` prints exactly one backslash. With a single `\\`, C++ would read `\\T` as an (unknown) escape.',
    },
    {
      id: 'l4-q5',
      kind: 'predict',
      tag: 'tricky',
      prompt: 'Type the output. Tabs line up to columns 8, 16, … — you can type spaces instead of tabs.',
      code: prog(cpp`
    cout << "ID\tName\n";
    cout << "7\tSana\n";`),
      hints: ['After `ID` (2 characters) the tab jumps to column 8, so 6 spaces appear.', 'After `7` (1 character), 7 spaces appear.'],
      explain: 'Both names start at column 8 because the tab jumps to the same stop on each line.',
    },
    {
      id: 'l4-q6',
      kind: 'mcq',
      prompt: "How do you print a single quote using a `char` (single quotes)?",
      options: ["`cout << '\\'';`", "`cout << ''';`", "`cout << '\"';`", "`cout << \"'\\\"'\";`"],
      answer: 0,
      explain: "Inside single quotes, a single quote must be escaped: `'\\''`. (`''` is an empty char — a compile error.)",
    },
    {
      id: 'l4-q7',
      kind: 'trace',
      mode: 'output',
      prompt: 'Dry run the table. Write what each line prints (`\\t` for tab, `\\n` for new line).',
      code: prog(cpp`
    cout << "Day\tTemp\n";
    cout << "Mon\t31\n";
    cout << "Tue\t" << 29 << endl;`),
      hints: ['Line 7 prints `Tue`, a tab, the number 29, and a newline from `endl`.'],
      explain: 'Short words, so both columns line up at the first tab stop.',
    },
    {
      id: 'l4-q8',
      kind: 'parsons',
      prompt: 'Build a program that prints:\n`Book: "Harry"`\n`Path: C:\\Books`',
      lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    cout << "Book: \\"Harry\\"" << endl;', '    cout << "Path: C:\\\\Books" << endl;', '    return 0;', '}'],
      distractors: ['    cout << "Book: "Harry"" << endl;', '    cout << "Path: C:\\Books" << endl;'],
      hints: ['Quotes inside the text need `\\"`.', 'One backslash on screen needs `\\\\` in the code.'],
      explain: 'Escape every inner quote and double every backslash.',
    },
    {
      id: 'l4-q9',
      kind: 'mcq',
      prompt: 'What does `cout << "a\\qb";` print? (`\\q` is not a real escape sequence.)',
      code: prog(cpp`
    cout << "a\qb";`),
      options: ['`aqb` — and the compiler shows a warning', '`a\\qb`', 'A compile error, nothing runs', '`ab`'],
      answer: 0,
      explain: 'g++ warns `unknown escape sequence: \'\\q\'` and simply prints `q`. It is a warning, not an error, so the program still runs.',
    },
    {
      id: 'l4-q10',
      kind: 'mcq',
      tag: 'real life',
      prompt: 'A shop prints a bill with tabs. Which name will push its price out of line?',
      code: prog(cpp`
    cout << "Soap\t50\n";
    cout << "Toothpaste\t120\n";
    cout << "Oil\t400\n";`),
      options: ['`Toothpaste` — it is longer than 8 characters', '`Soap` — it is too short', '`Oil` — it has only 3 letters', 'None, tabs always line up'],
      answer: 0,
      explain: '`Toothpaste` is 10 characters, past the stop at column 8, so its tab jumps to column 16 and its price sits further right.',
    },
  ],

  cheatsheet: [
    { code: '\\n', text: 'new line' },
    { code: '\\t', text: 'tab — jump to the next multiple of 8' },
    { code: '\\"', text: 'a double quote inside a string' },
    { code: "\\'", text: "a single quote inside a char: '\\''" },
    { code: '\\\\', text: 'one backslash' },
  ],
};
