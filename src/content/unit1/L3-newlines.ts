import type { Level } from '../types';
import { cpp, prog } from '../helpers';

export const L3: Level = {
  id: 'new-lines',
  kind: 'lesson',
  title: 'New lines: endl and \\n',
  tagline: 'The cursor never moves down by itself. Learn the two ways to start a new line — and how to count lines exactly.',
  minutes: 20,
  objectives: [
    'Move the cursor to a new line with `endl` or `\\n`',
    'Print blank lines and several lines with a single `cout`',
    'Predict exactly how many lines a program prints and what is on each one',
  ],

  learn: [
    {
      t: 'p',
      text: 'After every `cout`, the **cursor** stays right after the last character. To continue on the next line you must say so. C++ gives you two ways: `endl` and the **newline character** `\\n`.',
    },
    {
      t: 'compare',
      items: [
        {
          title: 'No new line — everything on one line',
          code: prog(cpp`
    cout << "Line one";
    cout << "Line two";`),
        },
        {
          title: 'With endl — two lines',
          good: true,
          code: prog(cpp`
    cout << "Line one" << endl;
    cout << "Line two" << endl;`),
        },
      ],
    },
    {
      t: 'syntax',
      title: 'Way 1: endl (end line)',
      code: 'cout << "Hi" << endl;',
      parts: [
        { token: 'endl', text: 'moves the cursor to the **start of the next line**' },
        { token: '<< endl', text: 'push it like any other piece — usually at the end of a chain' },
      ],
    },
    {
      t: 'syntax',
      title: 'Way 2: \\n (the newline character)',
      code: 'cout << "Hi\\n";',
      parts: [
        { token: '\\n', text: 'a backslash followed by n. It is **one** character that means *go to the next line*' },
        { token: '"Hi\\n"', text: 'it can sit anywhere **inside** the quotes — even in the middle of the text' },
        { token: "'\\n'", text: 'it can also be a single character on its own' },
      ],
    },
    {
      t: 'table',
      head: ['Code', 'What happens', 'Notes'],
      rows: [
        ['`<< endl`', 'new line', 'also *flushes*: forces the text onto the screen right away'],
        ['`<< "\\n"`', 'new line', 'a string that contains only the newline character'],
        ["`<< '\\n'`", 'new line', 'the newline as a single `char`'],
        ['`"A\\nB"`', '`A`, then a new line, then `B`', 'the newline can be in the middle of text'],
        ['`"A\\n\\nB"`', '`A`, an **empty line**, then `B`', 'two newlines in a row = one blank line'],
      ],
      caption: 'For the screen, all of these give the same result. Use whichever reads best.',
    },
    {
      t: 'callout',
      tone: 'warn',
      title: '/n is NOT a new line',
      text: 'The slash must be a **backslash** `\\` (the key above Enter). `"/n"` prints the two characters `/` and `n` — no error, just wrong output.',
    },
    { t: 'h', text: 'Counting lines' },
    {
      t: 'p',
      text: 'To count the lines a program prints, count the newlines — then add one if there is text after the last newline. Turn on **Show spaces & new lines** in the dry run: every newline appears as `↵`.',
    },
    {
      t: 'viz',
      title: 'Watch the cursor jump',
      code: prog(cpp`
    cout << "Name: Hina" << endl;
    cout << "Class: 10\n";
    cout << "\n";
    cout << "Result: Pass";`),
    },
  ],

  ways: {
    goal: 'Print these two lines: `Roll No: 12` and below it `Section: B`.',
    items: [
      { title: 'endl after each line', code: prog(cpp`
    cout << "Roll No: 12" << endl;
    cout << "Section: B" << endl;`) },
      { title: '\\n inside the text', code: prog(cpp`
    cout << "Roll No: 12\n";
    cout << "Section: B\n";`) },
      { title: 'One cout, \\n in the middle', code: prog(cpp`
    cout << "Roll No: 12\nSection: B\n";`), note: 'One statement can print many lines.' },
      { title: "'\\n' as a single character", code: prog(cpp`
    cout << "Roll No: 12" << '\n' << "Section: B" << '\n';`) },
      { title: 'endl in the middle of a chain', code: prog(cpp`
    cout << "Roll No: " << 12 << endl << "Section: B" << endl;`), note: 'The number 12 is printed as a number here.' },
      { title: '"\\n" as its own piece', code: prog(cpp`
    cout << "Roll No: 12" << "\n" << "Section: B" << "\n";`) },
    ],
    takeaway: '`endl`, `"\\n"` and `\'\\n\'` all move the cursor to the start of the next line. The output is identical.',
    check: {
      id: 'l3-ways-check',
      kind: 'mcq',
      prompt: 'Which statement prints everything on ONE line?',
      options: ['`cout << "Roll No: 12/nSection: B";`', '`cout << "Roll No: 12\\nSection: B";`', '`cout << "Roll No: 12" << endl << "Section: B";`', "`cout << \"Roll No: 12\" << '\\n' << \"Section: B\";`"],
      answer: 0,
      explain: '`/n` uses a forward slash, so it is just the two characters `/` and `n`: `Roll No: 12/nSection: B`.',
    },
  },

  watch: [
    {
      title: 'Where does the cursor go?',
      intro: 'Switch on **Show spaces & new lines** to see every `↵`.',
      code: prog(cpp`
    cout << "Line 1";
    cout << " (still line 1)" << endl;
    cout << "Line 2\n";
    cout << "\n";
    cout << "Line 4";`),
    },
    {
      title: 'One cout, three lines',
      code: prog(cpp`
    cout << "Name: Ali\nCity: Lahore\nAge: 20\n";`),
      fine: true,
    },
    {
      title: 'The /n mistake',
      intro: 'This compiles and runs — but the output is not what the programmer wanted.',
      code: prog(cpp`
    cout << "First line/n";
    cout << "Second line";`),
    },
  ],

  think: {
    title: 'A mini report card',
    problem: 'Print this report card exactly — note the **empty line** before *Result*:\n`Name: Hina`\n`Marks: 88`\n(empty line)\n`Result: Pass`',
    steps: [
      { text: 'Print `Name: Hina` and move to the next line.', lines: [5] },
      { text: 'Print `Marks: `, then the number `88`, then move to the next line.', lines: [6] },
      { text: 'Print an empty line: just a new line with nothing before it.', lines: [7] },
      { text: 'Print `Result: Pass` and finish the line.', lines: [8] },
    ],
    code: prog(cpp`
    cout << "Name: Hina" << endl;
    cout << "Marks: " << 88 << endl;
    cout << endl;
    cout << "Result: Pass" << endl;`),
    why: 'An empty line is just a newline with nothing in front of it. Two newlines in a row always leave one blank line.',
    yourTurn: {
      id: 'l3-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'Dry run this version. Write what each line prints — type `\\n` for a new line (or tap ↵).',
      code: prog(cpp`
    cout << "Name: Bilal\n";
    cout << "Marks: " << 74 << endl;
    cout << "\n";
    cout << "Result: Pass";`),
      given: [0],
      hints: ['`endl` is also a new line, so write it as `\\n` in the table.', 'Line 7 prints only a newline.', 'Line 8 has no newline at the end.'],
      explain: 'Four statements, four lines on screen: the third one is empty. The last line has no newline, so the cursor stays after `Pass`.',
    },
  },

  practice: [
    {
      id: 'l3-q1',
      kind: 'predict',
      prompt: 'What does this print? (Press Enter in the box for a new line.)',
      code: prog(cpp`
    cout << "Good" << endl;
    cout << "Morning";`),
      explain: '`endl` ends the first line, so `Morning` starts on line 2.',
    },
    {
      id: 'l3-q2',
      kind: 'mcq',
      prompt: 'How many lines of text does this program show on the screen?',
      code: prog(cpp`
    cout << "A\nB";
    cout << "C" << endl;
    cout << "D";`),
      options: ['2', '3', '4', '1'],
      answer: 1,
      explain: 'Line 1: `A`. Line 2: `BC` (the second cout continues after B). Line 3: `D`. So 3 lines.',
      hints: ['Only `\\n` and `endl` start a new line. The second `cout` continues right after `B`.'],
    },
    {
      id: 'l3-q3',
      kind: 'bug',
      prompt: 'The output should be on two lines, but it is all on one line: `Price: 200/nTax: 20`. Find the mistake.',
      code: prog(cpp`
    cout << "Price: 200/n";
    cout << "Tax: 20";`),
      bugLine: 5,
      options: ['Replace `/n` with `\\n`', 'Replace `/n` with `n/`', 'Add `endl` before `cout` on line 6', 'Put `/n` in single quotes'],
      answer: 0,
      fixed: prog(cpp`
    cout << "Price: 200\n";
    cout << "Tax: 20";`),
      hints: ['The program compiles, so this is a *logic* mistake. Which slash makes a newline?'],
      explain: 'A newline is backslash + n: `\\n`. With a forward slash it is just two ordinary characters.',
    },
    {
      id: 'l3-q4',
      kind: 'blanks',
      prompt: 'Complete the program so it prints `Apples` and `Mangoes` on two separate lines.',
      code: prog(cpp`
    cout << "Apples" << [[1]];
    cout << "Mangoes" << [[2]];`),
      blanks: [{ answers: ['endl', '"\\n"', "'\\n'"] }, { answers: ['endl', '"\\n"', "'\\n'"] }],
      chips: ['endl', '"\\n"', '"/n"', "'\\n'"],
      output: 'Apples\nMangoes\n',
      hints: ['Something that moves the cursor to the next line.'],
      explain: 'Any of `endl`, `"\\n"` or `\'\\n\'` works. `"/n"` would print the characters `/n`.',
    },
    {
      id: 'l3-q5',
      kind: 'predict',
      tag: 'tricky',
      prompt: 'Careful with the blank lines. What does this print?',
      code: prog(cpp`
    cout << "Top\n\n";
    cout << "Middle" << endl << endl;
    cout << "Bottom";`),
      hints: ['Two newlines in a row leave one empty line.'],
      explain: '`Top`, an empty line, `Middle`, an empty line, `Bottom` — five lines in total.',
    },
    {
      id: 'l3-q6',
      kind: 'parsons',
      prompt: 'Arrange the lines to print this short poem, one line each:\n`Twinkle twinkle`\n`little star`',
      lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    cout << "Twinkle twinkle" << endl;', '    cout << "little star" << endl;', '    return 0;', '}'],
      distractors: ['    cout << "Twinkle twinkle/n";'],
      hints: ['`/n` with a forward slash does not start a new line.'],
      explain: 'Each line of the poem needs its own `endl` (or `\\n`).',
    },
    {
      id: 'l3-q7',
      kind: 'mcq',
      prompt: 'Which statement prints `Hello`, then an empty line, then `World`?',
      options: ['`cout << "Hello\\n\\nWorld";`', '`cout << "Hello\\nWorld";`', '`cout << "Hello" << endl << "World";`', '`cout << "Hello" << "\\n" << "World";`'],
      answer: 0,
      explain: 'Two newlines in a row: the first ends the `Hello` line, the second makes an empty line.',
    },
    {
      id: 'l3-q8',
      kind: 'trace',
      mode: 'output',
      prompt: 'Fill the table: what does each statement print? Use `\\n` for new lines.',
      code: prog(cpp`
    cout << "Lahore";
    cout << endl;
    cout << "Karachi\nQuetta";
    cout << endl;`),
      hints: ['A statement that is only `endl` prints just a newline.', 'Line 7 prints two city names with a newline between them.'],
      explain: 'Screen: `Lahore` / `Karachi` / `Quetta`, and the cursor ends on an empty fourth line.',
    },
    {
      id: 'l3-q9',
      kind: 'mcq',
      prompt: 'What is the difference between `endl` and `"\\n"` for a beginner program?',
      options: [
        'None on the screen — both move to the next line (endl also flushes the output right away)',
        '`endl` makes two new lines',
        '`"\\n"` only works at the end of a program',
        '`endl` must always be written inside quotes',
      ],
      answer: 0,
      explain: 'Both give a new line. `endl` also *flushes* — it pushes everything to the screen immediately. You will not see a difference in small programs.',
    },
    {
      id: 'l3-q10',
      kind: 'blanks',
      tag: 'real life',
      prompt: 'An ATM slip must look like this:\n`Withdrawn: 5000`\n`Thank you!`\nComplete the single cout.',
      code: prog(cpp`
    cout << "Withdrawn: " << 5000 << [[1]] << "Thank you!" << [[2]];`),
      blanks: [{ answers: ['endl', '"\\n"', "'\\n'"] }, { answers: ['endl', '"\\n"', "'\\n'"] }],
      chips: ['endl', '"\\n"', '" "'],
      output: 'Withdrawn: 5000\nThank you!\n',
      explain: 'A new line after the amount, and another after the thank-you message.',
    },
  ],

  cheatsheet: [
    { code: '<< endl', text: 'new line (and flush)' },
    { code: '"\\n"', text: 'new line inside or as a string' },
    { code: "'\\n'", text: 'new line as one character' },
    { code: '"\\n\\n"', text: 'one empty line' },
    { code: '"/n"', text: 'WRONG — prints / and n' },
  ],
};
