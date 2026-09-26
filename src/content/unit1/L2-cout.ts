import type { Level } from '../types';
import { cpp, prog } from '../helpers';

export const L2: Level = {
  id: 'cout-basics',
  kind: 'lesson',
  title: 'Printing with cout and <<',
  tagline: '`cout` is the screen and `<<` pushes things onto it. Chain many pieces in one line and predict exactly what appears.',
  minutes: 20,
  objectives: [
    'Print text, whole numbers, decimals and single characters with `cout`',
    'Chain several pieces with `<<` in one statement',
    'Predict the output exactly — including spaces and where the next `cout` continues',
  ],

  learn: [
    {
      t: 'p',
      text: 'Think of `cout` (say *see-out*) as the **screen**, and `<<` as an **arrow** that pushes whatever is on its right onto the screen. The arrow always points **toward** `cout` — the data flows into it.',
    },
    {
      t: 'syntax',
      title: 'The cout statement',
      code: 'cout << "Hello";',
      parts: [
        { token: 'cout', text: '**c**onsole **out**put — the screen' },
        { token: '<<', text: 'the *insertion operator*: push the next thing onto the screen' },
        { token: '"Hello"', text: 'a *string literal*: text inside double quotes is printed exactly as written, without the quotes' },
        { token: ';', text: 'ends the statement' },
      ],
    },
    { t: 'h', text: 'Chaining: one cout, many pieces' },
    {
      t: 'p',
      text: 'You can push many pieces in one statement. They are printed **left to right**, one after another, with **nothing added** in between.',
    },
    {
      t: 'code',
      code: prog(cpp`
    cout << "Ali" << " is " << 20 << " years old";`),
      caption: 'Four pieces: text, text, a number, text. The spaces come from inside the quotes.',
    },
    {
      t: 'callout',
      tone: 'warn',
      title: 'cout never adds spaces or new lines by itself',
      text: 'If you want a space, it must be inside the quotes: `"Ali "` or `" is "`. Forget it and the words stick together: `"Ali" << "Khan"` prints `AliKhan`.',
    },
    { t: 'h', text: 'What can you print?' },
    {
      t: 'table',
      head: ['You write', 'Screen shows', 'Why'],
      rows: [
        ['`cout << "Hello";`', 'Hello', 'Text in double quotes is copied exactly (without the quotes)'],
        ['`cout << 25;`', '25', 'A number without quotes is printed as a number'],
        ['`cout << -3;`', '-3', 'Negative numbers work too'],
        ['`cout << 3.75;`', '3.75', 'Decimal numbers'],
        ["`cout << 'A';`", 'A', 'Single quotes hold exactly ONE character'],
        ['`cout << "25";`', '25', 'Looks the same… but this is **text**, not a number'],
      ],
    },
    {
      t: 'callout',
      tone: 'tip',
      title: 'Why does "25" vs 25 matter?',
      text: 'On the screen they look the same. But C++ can **calculate** with the number `25` and cannot calculate with the text `"25"`. You will see this in Level 5.',
    },
    { t: 'h', text: 'Many couts, one line' },
    {
      t: 'p',
      text: 'The **cursor** is the invisible position where the next character will appear. After a `cout` finishes, the cursor stays right after the last character. The next `cout` continues from there — on the **same line**.',
    },
    {
      t: 'viz',
      title: 'Watch the cursor: three couts, one line',
      code: prog(cpp`
    cout << "Score: ";
    cout << 90;
    cout << "/100";`),
    },
    { t: 'h', text: 'A long chain can span several lines' },
    {
      t: 'code',
      code: prog(cpp`
    cout << "Name: Sara"
         << ", Class: 9"
         << ", Roll No: "
         << 14;`),
      caption: 'This is still **one** statement (only one `;`). Splitting it across lines only makes it easier to read — the output stays on one line.',
    },
  ],

  ways: {
    goal: 'Print exactly `Hello World` (one space between the words).',
    items: [
      { title: 'One string', code: prog(cpp`
    cout << "Hello World";`) },
      { title: 'Two pieces, space inside the second', code: prog(cpp`
    cout << "Hello" << " World";`) },
      { title: 'The space as its own piece', code: prog(cpp`
    cout << "Hello" << " " << "World";`) },
      { title: 'Two separate statements', code: prog(cpp`
    cout << "Hello ";
    cout << "World";`), note: 'The second `cout` continues on the same line.' },
      { title: 'Characters and strings mixed', code: prog(cpp`
    cout << 'H' << "ello" << ' ' << "World";`), note: "`' '` is a single space character." },
      { title: 'One chain over two lines', code: prog(cpp`
    cout << "Hello"
         << " World";`) },
      { title: 'Two literals glued together', code: prog(cpp`
    cout << "Hello " "World";`), note: 'Two string literals written next to each other are joined into one by the compiler. Rarely used, but legal.' },
      { title: 'The full name std::cout', code: cpp`
#include <iostream>

int main() {
    std::cout << "Hello" << " World";
    return 0;
}
` },
    ],
    takeaway: 'Eight different programs, **one identical output**. What matters is the exact sequence of characters that reaches the screen — letters, spaces and all.',
    check: {
      id: 'l2-ways-check',
      kind: 'mcq',
      prompt: 'Which statement does NOT print `Hello World`?',
      options: ['`cout << "Hello" << "World";`', '`cout << "Hello " << "World";`', "`cout << \"Hello\" << ' ' << \"World\";`", '`cout << "Hello World";`'],
      answer: 0,
      explain: 'No piece contains a space, so the words stick together: `HelloWorld`.',
    },
  },

  watch: [
    {
      title: 'Chaining, one push at a time',
      intro: 'This demo starts with **Step into every <<** switched on, so each push is its own step. Watch the output grow piece by piece.',
      code: prog(cpp`
    cout << "Ali" << " scored " << 95 << " marks";`),
      fine: true,
    },
    {
      title: 'Text, number, character',
      intro: 'Three kinds of values in one chain. The explanation says what kind each one is.',
      code: prog(cpp`
    cout << "Grade: " << 'A' << ", marks: " << 87.5;`),
      fine: true,
    },
    {
      title: 'Where does the second cout start?',
      code: prog(cpp`
    cout << "Pen";
    cout << " x" << 3;
    cout << " = Rs. " << 60;`),
    },
  ],

  think: {
    title: 'A receipt line',
    problem: 'A stationery shop prints this line on every receipt: `Pen x3 = Rs. 60`. Print it with **one** `cout`, where the quantity `3` and the price `60` are written as **numbers**, not text.',
    steps: [
      { text: 'Only output is needed, so use the usual skeleton.', lines: [1, 2, 4, 7] },
      { text: 'Push the item name as text: `"Pen"`.', lines: [5] },
      { text: 'Push the text `" x"` (with its space), then the number `3`.', lines: [5] },
      { text: 'Push `" = Rs. "` (spaces included), then the number `60`.', lines: [5] },
      { text: 'Finish the statement with `;` and end the program.', lines: [5, 6] },
    ],
    code: prog(cpp`
    cout << "Pen" << " x" << 3 << " = Rs. " << 60;`),
    why: 'Plan the spaces before you type. A good trick: write the target line on paper and mark every space with a dot: `Pen·x3·=·Rs.·60`.',
    yourTurn: {
      id: 'l2-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'Dry run this receipt. For each line, write exactly what it adds to the screen. Spaces count!',
      code: prog(cpp`
    cout << "Tea x" << 2;
    cout << " = Rs. ";
    cout << 120;`),
      given: [0],
      hints: ['Line 6 prints only what is inside its quotes: a space, `=`, a space, `Rs.` and a space.', 'Line 7 prints a number with no spaces around it.'],
      explain: 'The three lines build one line on the screen: `Tea x2 = Rs. 120`.',
    },
  },

  practice: [
    {
      id: 'l2-q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: prog(cpp`
    cout << "Ali" << "Khan";`),
      hints: ['Is there a space inside either pair of quotes?'],
      explain: '`AliKhan` — `cout` never adds a space between pieces.',
    },
    {
      id: 'l2-q2',
      kind: 'predict',
      prompt: 'What does this print?',
      code: prog(cpp`
    cout << "Score: " << 50 << "/" << 100;`),
      explain: 'The pieces are glued in order: `Score: ` + `50` + `/` + `100` = `Score: 50/100`.',
    },
    {
      id: 'l2-q3',
      kind: 'mcq',
      prompt: 'In `cout << "Hi";`, what does `<<` do?',
      options: ['Compares two values', 'Pushes the value on its right onto the screen', 'Reads a value from the keyboard', 'Moves the text two places to the left'],
      answer: 1,
      explain: '`<<` is the insertion operator: it inserts (pushes) the value on its right into `cout`, the screen.',
    },
    {
      id: 'l2-q4',
      kind: 'blanks',
      prompt: 'Fill the blanks so the program prints `I love C++`.',
      code: prog(cpp`
    cout [[1]] "I love " [[2]] "C++";`),
      blanks: [{ answers: ['<<'] }, { answers: ['<<'] }],
      chips: ['<<', '>>', '<', ';'],
      output: 'I love C++',
      hints: ['Every piece needs its own push operator in front of it.'],
      explain: 'Each piece is pushed with its own `<<`.',
    },
    {
      id: 'l2-q5',
      kind: 'blanks',
      prompt: 'The school wants `Total students: 45`, where 45 is a **number** (no quotes). Complete the line.',
      code: prog(cpp`
    cout << "Total students: " << [[1]];`),
      blanks: [{ answers: ['45'], hint: 'a number, so no quotes' }],
      output: 'Total students: 45',
      hints: ['Write the number exactly as it should appear.'],
      explain: 'Numbers are written without quotes. The space before 45 already comes from the text `"Total students: "`.',
    },
    {
      id: 'l2-q6',
      kind: 'bug',
      prompt: 'This program does not compile. Find the line and pick the fix.',
      code: prog(cpp`
    cout >> "Hello";`),
      bugLine: 5,
      options: ['Change `>>` to `<<`', 'Change `cout` to `cin`', 'Remove the quotes', 'Add a third `>`'],
      answer: 0,
      fixed: prog(cpp`
    cout << "Hello";`),
      hints: ['Which way should the arrows point: toward the screen, or away from it?'],
      explain: 'Output flows **into** `cout`, so the arrows point toward it: `cout << ...`. `>>` is used with `cin` for input.',
    },
    {
      id: 'l2-q7',
      kind: 'bug',
      prompt: 'Another compile error. What is wrong?',
      code: prog(cpp`
    cout << "Marks: " << ;`),
      bugLine: 5,
      options: ['There is a `<<` with nothing after it', 'Text cannot end with a space', '`Marks` must be in capitals', 'The line needs two semicolons'],
      answer: 0,
      fixed: prog(cpp`
    cout << "Marks: " << 88;`),
      hints: ['Every `<<` must be followed by something to print.'],
      explain: 'The compiler says `expected primary-expression before \';\' token`: after the last `<<` it expected a value and found `;` instead.',
    },
    {
      id: 'l2-q8',
      kind: 'parsons',
      prompt: 'Arrange the lines so the program prints exactly `Sara is 19`.',
      lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    cout << "Sara";', '    cout << " is ";', '    cout << 19;', '    return 0;', '}'],
      hints: ['The name comes first, then the text with spaces on both sides, then the number.'],
      explain: 'Each `cout` continues where the previous one stopped, so the order of the three statements is the order on screen.',
    },
    {
      id: 'l2-q9',
      kind: 'mcq',
      tag: 'real life',
      prompt: 'A cashier program prints `Total:500`, but the manager wants `Total: 500` (with a space). Which line is correct?',
      options: ['`cout << "Total: " << 500;`', '`cout << "Total:" << 500 << " ";`', '`cout << " Total:" << 500;`', '`cout << "Total:" << " 500 ";`'],
      answer: 0,
      explain: 'The space must come right after the colon. Option B puts the space at the end, C puts it at the start, and D adds an extra space at the end.',
    },
    {
      id: 'l2-q10',
      kind: 'trace',
      mode: 'output',
      prompt: 'Dry run it: what does each line add to the screen?',
      code: prog(cpp`
    cout << "Room " << 204;
    cout << ", Floor " << 2;
    cout << '!';`),
      hints: ['Line 5 prints `Room `, then the number, with no space after it.'],
      explain: 'The screen ends up showing `Room 204, Floor 2!` on one line.',
    },
    {
      id: 'l2-q11',
      kind: 'mcq',
      prompt: 'What is the difference between `cout << 25;` and `cout << "25";`?',
      options: [
        'The first prints 25, the second prints "25" with the quotes',
        'Both show 25 on the screen, but the first is a number and the second is text',
        'The second one is a compile error',
        'The first one prints 2 and 5 on separate lines',
      ],
      answer: 1,
      explain: 'The quotes are never printed. The difference is what C++ knows: `25` is a number it can calculate with, `"25"` is just two characters.',
    },
  ],

  cheatsheet: [
    { code: 'cout << x;', text: 'print x on the screen' },
    { code: '<<', text: 'push the next piece onto the screen, left to right' },
    { code: '"text"', text: 'printed exactly, without the quotes' },
    { code: "'A'", text: 'exactly one character' },
    { code: '25, 3.75', text: 'numbers — no quotes' },
    { code: '(nothing)', text: 'cout never adds spaces or new lines for you' },
  ],
};
