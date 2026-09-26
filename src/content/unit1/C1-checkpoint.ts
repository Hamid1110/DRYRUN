import type { Level } from '../types';
import { cpp, prog } from '../helpers';

export const C1: Level = {
  id: 'checkpoint-output',
  kind: 'revision',
  title: 'Output',
  tagline: '**Checkpoint 1** mixes everything from Unit 1 — cout, `<<`, new lines, escape sequences and calculations — in real-life programs. Score 70% or more to clear it. Hints cost a little score; they never cost you the answer.',
  minutes: 25,
  objectives: [
    'Predict the exact output of programs that mix text, numbers, new lines and escapes',
    'Build and repair real-life printouts: tickets, receipts, tables',
  ],
  practice: [
    {
      id: 'c1-q1',
      kind: 'predict',
      tag: 'mixed',
      prompt: 'A student ID card. Predict the output exactly (tabs jump to columns 8, 16, …; you may type spaces).',
      code: prog(cpp`
    cout << "Name:\tAyesha\n";
    cout << "Marks: " << 45 + 40 << "/100" << endl;
    cout << "Grade: \"A\"";`),
      hints: ['After `Name:` (5 characters) the tab moves to column 8, so 3 spaces appear.', '45 + 40 is calculated because it has no quotes.'],
      explain: 'Line 1: `Name:` + tab + `Ayesha`. Line 2: the sum 85. Line 3: the escaped quotes print as `"A"`.',
    },
    {
      id: 'c1-q2',
      kind: 'parsons',
      tag: 'real life',
      prompt: 'Build the train ticket. It must print exactly:\n`Karachi -> Lahore`\n`Seat: 12B`\n`Fare: Rs. 4500`',
      lines: [
        '#include <iostream>',
        'using namespace std;',
        'int main() {',
        '    cout << "Karachi -> Lahore" << endl;',
        '    cout << "Seat: 12B" << endl;',
        '    cout << "Fare: Rs. " << 4500 << endl;',
        '    return 0;',
        '}',
      ],
      distractors: ['    cout << "Seat: 12B/n";', '    cout << "Fare: Rs. " + 4500 << endl;'],
      hints: ['The ticket is printed top to bottom, in the same order as the lines on paper.', 'A number is joined to a label with `<<`, not `+`.'],
      explain: 'One `cout` per line of the ticket, each ending with `endl`.',
    },
    {
      id: 'c1-q3',
      kind: 'blanks',
      tag: 'real life',
      prompt: 'Mobile top-up: the balance was Rs. 500 and a package costs Rs. 120. Complete the code so it prints `Balance left: Rs. 380` and then moves to a new line.',
      code: prog(cpp`
    cout << "Balance left: Rs. " << 500 [[1]] 120 << [[2]];`),
      blanks: [{ answers: ['-'] }, { answers: ['endl', '"\\n"', "'\\n'"] }],
      chips: ['+', '-', '*', 'endl', '"/n"'],
      output: 'Balance left: Rs. 380\n',
      hints: ['Money left = balance minus cost.'],
      explain: '`500 - 120` is calculated to 380; `endl` finishes the line.',
    },
    {
      id: 'c1-q4',
      kind: 'bug',
      tag: 'real life',
      prompt: 'The program should print the path `C:\\new\\files`, but the output looks broken. Run your eyes over it, find the line, and choose the fix.',
      code: prog(cpp`
    cout << "Saved in: ";
    cout << "C:\new\files" << endl;`),
      bugLine: 6,
      options: ['Double every backslash: `"C:\\\\new\\\\files"`', 'Use forward slashes inside `endl`', 'Put the path in single quotes', 'Add a space after each backslash'],
      answer: 0,
      fixed: prog(cpp`
    cout << "Saved in: ";
    cout << "C:\\new\\files" << endl;`),
      hints: ['Look at the letters right after each backslash: `\\n` and `\\f`. What do those mean to C++?'],
      explain: 'In C++, `\\n` in `"C:\\new"` is a newline, and `\\f` is another special character. To print a real backslash, write `\\\\`.',
    },
    {
      id: 'c1-q5',
      kind: 'trace',
      mode: 'output',
      prompt: 'Dry run this shop receipt. Write what each line prints (`\\t` tab, `\\n` new line).',
      code: prog(cpp`
    cout << "Item\tPrice\n";
    cout << "Bread\t" << 150 << endl;
    cout << "Milk\t" << 2 * 110 << endl;
    cout << "Total\t" << 150 + 2 * 110;`),
      given: [0],
      hints: ['Line 7 multiplies before printing.', 'Line 8: multiplication before addition.'],
      explain: 'The receipt: Bread 150, Milk 220, Total 370.',
    },
    {
      id: 'c1-q6',
      kind: 'predict',
      tag: 'real life',
      prompt: 'Three friends split a Rs. 1000 dinner bill. Predict what this prints.',
      code: prog(cpp`
    cout << "Each pays: " << 1000 / 3 << endl;
    cout << "Left over: " << 1000 % 3 << endl;`),
      hints: ['1000 and 3 are both whole numbers.'],
      explain: 'Whole-number division gives 333, and the remainder `%` shows the 1 rupee that is left over.',
    },
    {
      id: 'c1-q7',
      kind: 'predict',
      prompt: 'Draw with text! Predict the shape exactly.',
      code: prog(cpp`
    cout << "  *\n";
    cout << " ***\n";
    cout << "*****" << endl;`),
      hints: ['Count the spaces before each group of stars.'],
      explain: 'Leading spaces are printed too, which is what makes the triangle.',
    },
    {
      id: 'c1-q8',
      kind: 'mcq',
      prompt: 'How many lines does this program print (count the empty ones too)?',
      code: prog(cpp`
    cout << "A" << endl << endl;
    cout << "B\n";
    cout << "C";`),
      options: ['3', '4', '5', '2'],
      answer: 1,
      explain: '`A`, an empty line, `B`, `C` — 4 lines.',
      hints: ['Two `endl` in a row leave one empty line.'],
    },
    {
      id: 'c1-q9',
      kind: 'blanks',
      prompt: 'Complete the dialogue so it prints exactly: `Teacher: "Open your books."`',
      code: prog(cpp`
    cout << "Teacher: [[1]]Open your books.[[2]]";`),
      blanks: [{ answers: ['\\"'] }, { answers: ['\\"'] }],
      chips: ['"', '\\"', "'", '\\\\'],
      output: 'Teacher: "Open your books."',
      hints: ['A double quote inside a string must be escaped.'],
      explain: 'Each `\\"` prints one `"` without ending the string.',
    },
    {
      id: 'c1-q10',
      kind: 'bug',
      prompt: 'This does not compile. Find the line and choose the fix.',
      code: prog(cpp`
    cout << "Price: " << 250
    cout << "Tax: " << 25 << endl;`),
      bugLine: 5,
      options: ['Add `;` at the end of line 5', 'Add `<<` at the start of line 6', 'Change `250` to `"250"`', 'Remove `endl` from line 6'],
      answer: 0,
      fixed: prog(cpp`
    cout << "Price: " << 250;
    cout << "Tax: " << 25 << endl;`),
      hints: ['The compiler complains about line 6, but the missing thing belongs at the end of line 5.'],
      explain: 'Line 5 is a complete statement without its `;`. The compiler only notices at the next `cout`.',
    },
    {
      id: 'c1-q11',
      kind: 'mcq',
      tag: 'real life',
      prompt: 'An exam system prints the percentage for 45 marks out of 60. Which line prints `Percent: 75`?',
      options: ['`cout << "Percent: " << 45 * 100 / 60;`', '`cout << "Percent: " << 45 / 60 * 100;`', '`cout << "Percent: " << "45 / 60 * 100";`', '`cout << "Percent: " << 45 % 60 * 100;`'],
      answer: 0,
      explain: 'Left to right: 45 * 100 = 4500, then 4500 / 60 = 75. In option B, 45 / 60 is whole-number division = 0, so the answer is 0.',
      hints: ['Work each option out left to right, remembering that whole ÷ whole throws away the decimal.'],
    },
    {
      id: 'c1-q12',
      kind: 'trace',
      mode: 'output',
      prompt: 'Final dry run. Write what each line prints.',
      code: prog(cpp`
    cout << "Day " << 1 << ": ";
    cout << 8 * 60 << " minutes\n";
    cout << "Say \"done\"" << endl;`),
      hints: ['Line 5 has no newline — the cursor stays on the same line.', 'Line 6: 8 × 60, then text that ends with `\\n`.'],
      explain: 'Screen: `Day 1: 480 minutes` then `Say "done"`.',
    },
  ],
  exam: {
    title: 'Exam Challenge: Output',
    intro: '**State the output of the following code. If there is an error, write it explicitly** (choose "It does not compile" and the line). These are written like FAST PF sessional questions: short, dense and full of traps. No hints on the real paper — try each one on paper first.',
    questions: [
      {
        id: 'checkpoint-output-x1',
        kind: 'predict',
        tag: 'exam',
        prompt: 'State the output of the following code.',
        code: prog(cpp`
    cout << "5" << 5 << "5 + 5" << 5 + 5 << endl;
    cout << 10 / 4 * 4 << " " << 10 * 4 / 4 << " " << 10 % 4 * 4 << endl;
    cout << 2 + 3 * 4 - 12 / 5 % 2;`),
        hints: ['Anything inside quotes is copied as it is; anything without quotes is calculated.', '`*`, `/` and `%` have the same level and go left to right, before `+` and `-`.'],
        explain: 'Line 5: `"5"` is text, `5` is a number, `"5 + 5"` is text (copied, not added), and `5 + 5` is calculated to `10`. Nothing adds spaces, so the line is `555 + 510`.\nLine 6: `10 / 4 * 4` = `2 * 4` = `8` (whole-number division throws away .5). `10 * 4 / 4` = `40 / 4` = `10`. `10 % 4 * 4` = `2 * 4` = `8`. Line: `8 10 8`.\nLine 7: `3 * 4` = 12, then `12 / 5 % 2` = `2 % 2` = 0, so `2 + 12 - 0` = `14`.\nOutput:\n`555 + 510`\n`8 10 8`\n`14`',
      },
      {
        id: 'checkpoint-output-x2',
        kind: 'predict',
        tag: 'exam',
        prompt: 'State the output of the following code. If there is an error, write it explicitly.',
        code: prog(cpp`
    cout << "Total:\t" << 25 * 4 << "/n";
    cout << "Done" << cout << endl;`),
        hints: ['Look at every piece after each `<<`. Is each one something that can be printed?'],
        explain: 'It does **not compile**. Line 6 tries to print `cout` itself: `cout << "Done" << cout`. `cout` is the screen, not a value, so `<<` has no way to print it and g++ reports an error on **line 6**.\nFix: delete `<< cout` (write `cout << "Done" << endl;`).\nTrap on line 5: `"/n"` has a forward slash, so even after the fix it would print the two characters `/n`, not a new line.',
      },
      {
        id: 'checkpoint-output-x3',
        kind: 'predict',
        tag: 'exam',
        prompt: 'State the output of the following code. If there is an error, write it explicitly.',
        code: prog(cpp`
    cout << "Saved in:" << endl;
    cout << "C:\new\" << endl;
    cout << "OK";`),
        hints: ['Read line 6 one character at a time. What does `\\"` mean?'],
        explain: 'It does **not compile**. On line 6, `\\n` is a newline (fine), but `\\"` is an *escaped quote*: it prints a `"` and does **not** end the string. So the string never closes on line 6 — g++ reports `missing terminating " character` on **line 6**.\nFix: to print a backslash, write two: `"C:\\\\new\\\\"`. Then the output would be `Saved in:` and `C:\\new\\` and `OK`.',
      },
      {
        id: 'checkpoint-output-x4',
        kind: 'predict',
        tag: 'exam',
        prompt: 'State the output of the following code. If there is an error, write it explicitly.',
        code: prog(cpp`
    cout << "Line 1" << endl
         << "Line 2" << endl;
    cout << "Line 3" << endl
    cout << "Line 4";`),
        hints: ['A `cout` chain may continue on the next line, but only while the next line starts with `<<`.'],
        explain: 'It does **not compile**. Lines 5–6 are fine: the chain continues because line 6 starts with `<<`, and the `;` ends it.\nLine 7 has no `;`, and line 8 starts with `cout`, not `<<`, so `endl cout` makes no sense. g++ reports `expected \';\' before \'cout\'` and points at the end of **line 7**.\nFix: add `;` after `endl` on line 7. Then it would print four lines, `Line 1` to `Line 4`.',
      },
      {
        id: 'checkpoint-output-x5',
        kind: 'count',
        tag: 'exam',
        prompt: 'How many `*` characters appear in the output?',
        code: prog(cpp`
    cout << "*\t**\n";
    cout << "***" << "\"*\"" << endl;
    cout << "\\*/" << '*' << "*/n*";
    cout << 3 * 3 << endl;`),
        count: { text: '*' },
        unit: 'stars',
        hints: ['Escapes like `\\"` and `\\\\` print one character, and it is never a star.', 'Line 8 has no quotes: what does `3 * 3` print?'],
        explain: 'Line 5 prints `*`, a tab, `**` → **3** stars.\nLine 6 prints `***` and then `"*"` (the `\\"` are quote marks) → **4** stars.\nLine 7 prints `\\*/` (one backslash), then the char `*`, then `*/n*` → 1 + 1 + 2 = **4** stars.\nLine 8 calculates `3 * 3` and prints `9` — **no** star.\nTotal: 3 + 4 + 4 = **11** stars.',
      },
      {
        id: 'checkpoint-output-x6',
        kind: 'predict',
        tag: 'exam',
        prompt: 'State the output of the following code (a tab jumps to the next column 8, 16, …).',
        code: prog(cpp`
    cout << "Name\tAge\n";
    cout << "Hina\t19\n";
    cout << "C:\\new\\" << "table\" \\n" << endl;`),
        hints: ['`\\\\` prints one backslash, so `\\\\n` is a backslash followed by the letter n — not a newline.'],
        explain: 'Line 5: `Name`, then the tab jumps to column 8, then `Age`.\nLine 6: `Hina`, tab to column 8, `19`.\nLine 7: `\\\\` → `\\`, so `"C:\\\\new\\\\"` prints `C:\\new\\`. The next piece: `table`, `\\"` → `"`, a space, and `\\\\n` → `\\n` (two ordinary characters). Then `endl`.\nOutput:\n`Name    Age`\n`Hina    19`\n`C:\\new\\table" \\n`',
      },
      {
        id: 'checkpoint-output-x7',
        kind: 'predict',
        tag: 'exam',
        prompt: 'State the output of the following code.',
        code: prog(cpp`
    cout << 7 / 2 * 2.0 << " " << 7 / 2.0 * 2 << endl;
    cout << 1 / 3 * 3 << " " << 10.0 / 4 << " " << 22.0 / 7 << endl;
    cout << -7 / 2 << " " << -7 % 3 << " " << 7 % -3;`),
        hints: ['Whole ÷ whole gives a whole number; as soon as one side has a decimal point, the answer keeps its decimals.', 'Whole-number division cuts toward zero, and the sign of `%` follows the LEFT number.'],
        explain: 'Line 5: `7 / 2` = 3 (both whole), then `3 * 2.0` = 6.0, which cout prints as `6`. But `7 / 2.0` = 3.5, then `* 2` = `7`.\nLine 6: `1 / 3` = 0, so `0 * 3` = `0`. `10.0 / 4` = `2.5`. `22.0 / 7` = 3.142857…, and cout shows 6 significant digits: `3.14286`.\nLine 7: `-7 / 2` = -3.5, cut toward zero → `-3`. `-7 % 3` = `-1` (sign of the left number). `7 % -3` = `1`.\nOutput:\n`6 7`\n`0 2.5 3.14286`\n`-3 -1 1`',
      },
      {
        id: 'checkpoint-output-x8',
        kind: 'count',
        tag: 'exam',
        prompt: 'How many times does the text `ha` appear in the output?',
        code: prog(cpp`
    cout << "ha" << "ha" "ha" << "h" << "a\n";
    cout << "h\ta" << "\"ha\"" << "HA" << endl;`),
        count: { text: 'ha' },
        hints: ['Two string literals written next to each other (`"ha" "ha"`) are glued into one.', 'Look at what actually reaches the screen, not at how the code is split.'],
        explain: 'Line 5 prints `ha`, `haha` (the two literals are glued), `h` and `a` + newline — on screen that is `hahahaha`: **4** times, because the separate `"h"` and `"a"` land next to each other.\nLine 6 prints `h`, a tab, `a` (not `ha` — the tab is between them), then `"ha"` → **1** more, then `HA` (capital letters are different characters).\nTotal: **5**.',
      },
      {
        id: 'checkpoint-output-x9',
        kind: 'predict',
        tag: 'exam',
        prompt: 'State the output of the following code. Write empty lines too.',
        code: prog(cpp`
    cout << "A\n\nB" << endl << "\tC\\n" << "D";
    cout << endl << "E/nF" << '\n' << "G";`),
        hints: ['`\\n\\n` right after each other leave one empty line.', '`/n` is not a newline, and `\\\\n` is a backslash followed by n.'],
        explain: '`A`, newline, newline (an empty line), `B`, `endl`. Then a tab, `C`, `\\n` as two ordinary characters (because `\\\\` is one backslash), then `D` on the same line.\nLine 6: `endl` ends that line, `E/nF` prints as it is, `\'\\n\'` is a newline, then `G`.\nOutput:\n`A`\n(empty line)\n`B`\n`        C\\nD`\n`E/nF`\n`G`',
      },
      {
        id: 'checkpoint-output-x10',
        kind: 'blanks',
        tag: 'exam',
        prompt: 'Complete the program so that it prints EXACTLY:\n`Bill for "Ali"`\n`Tea` (tab) `x3` (tab) `= 150`\n`Path: D:\\bills`',
        code: prog(cpp`
    cout << "Bill for [[1]]Ali[[2]]" << endl;
    cout << "Tea[[3]]x3\t= " << 3 [[4]] 50 << [[5]];
    cout << "Path: D:[[6]]bills";`),
        blanks: [
          { answers: ['\\"'] },
          { answers: ['\\"'] },
          { answers: ['\\t'] },
          { answers: ['*'] },
          { answers: ['endl', '"\\n"', "'\\n'"] },
          { answers: ['\\\\'] },
        ],
        chips: ['\\"', '"', '\\t', '/t', '*', '+', 'endl', '"/n"', '\\\\', '\\'],
        output: 'Bill for "Ali"\nTea\tx3\t= 150\nPath: D:\\bills',
        hints: ['A quote inside a string, a tab and a backslash each need an escape sequence.', '150 must be calculated from 3 and 50.'],
        explain: '`\\"` prints a quote without ending the string (blanks 1 and 2). `\\t` is the tab (blank 3). `3 * 50` = 150 (blank 4). `endl` (or `"\\n"`) ends line 2 (blank 5). `\\\\` prints one backslash (blank 6) — a single `\\b` would be a special character, not a backslash.',
      },
    ],
  },
};
