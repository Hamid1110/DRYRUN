import type { Level } from '../types';
import { cpp, prog } from '../helpers';

export const L5: Level = {
  id: 'text-vs-numbers',
  kind: 'lesson',
  title: 'Text vs numbers: cout can calculate',
  tagline: '`cout << 5 + 3` and `cout << "5 + 3"` print different things. Learn when C++ calculates and when it just copies.',
  minutes: 25,
  objectives: [
    'Tell text (in quotes) apart from expressions (no quotes) and predict both',
    'Work out `+ - * /` in the right order, including whole-number division',
    'Mix labels and calculated results in one line',
  ],

  learn: [
    {
      t: 'p',
      text: 'Everything inside double quotes is **copied** to the screen character by character. Everything **without** quotes that looks like maths is an **expression**: C++ first **works it out**, then prints the answer.',
    },
    {
      t: 'compare',
      items: [
        { title: 'An expression: calculated', code: prog(cpp`
    cout << 5 + 3;`) },
        { title: 'Text: copied as it is', code: prog(cpp`
    cout << "5 + 3";`) },
      ],
    },
    { t: 'h', text: 'The arithmetic operators' },
    {
      t: 'table',
      head: ['Operator', 'Meaning', 'Example', 'Result'],
      rows: [
        ['`+`', 'add', '`7 + 2`', '9'],
        ['`-`', 'subtract', '`7 - 2`', '5'],
        ['`*`', 'multiply (not x)', '`7 * 2`', '14'],
        ['`/`', 'divide', '`7 / 2`', '**3** (both whole numbers → whole answer)'],
        ['`/`', 'divide', '`7.0 / 2`', '3.5 (a decimal is involved)'],
        ['`%`', 'remainder', '`7 % 2`', '1'],
      ],
    },
    {
      t: 'callout',
      tone: 'warn',
      title: 'Whole ÷ whole = whole',
      text: 'When **both** numbers are whole (no decimal point), C++ does *integer division*: the answer is a whole number and the decimal part is **thrown away** — not rounded. `7 / 2` is `3`, and `9 / 10` is `0`. Write one of them with a decimal point (`7.0 / 2`) to get `3.5`.',
    },
    { t: 'h', text: 'Order of operations' },
    {
      t: 'p',
      text: 'Just like in maths class: `*`, `/` and `%` are done **before** `+` and `-`. Operators of the same level go left to right. Brackets `( )` come first of all. The dry run shows each step — the highlighted part is what C++ works out next.',
    },
    {
      t: 'viz',
      title: 'Watch C++ work out the expressions',
      code: prog(cpp`
    cout << 10 - 2 * 3 << endl;
    cout << (10 - 2) * 3 << endl;
    cout << 20 / 4 * 2 << endl;
    cout << 7 / 2 << " and " << 7.0 / 2 << endl;`),
    },
    { t: 'h', text: 'Labels and results in one line' },
    {
      t: 'p',
      text: 'The most common pattern: a **text label** in quotes, followed by an **expression** without quotes.',
    },
    {
      t: 'code',
      code: prog(cpp`
    cout << "3 notebooks cost Rs. " << 3 * 45 << endl;
    cout << "Average of 80 and 91 = " << (80 + 91) / 2.0 << endl;`),
    },
    {
      t: 'callout',
      tone: 'tip',
      title: 'How cout prints decimals',
      text: 'cout shows at most **6 significant digits** and drops a trailing `.0`: `2.50` prints as `2.5`, `3.0` prints as `3`, and `10.0 / 3` prints as `3.33333`. (Unit 4 shows how to control this.)',
    },
    {
      t: 'table',
      head: ['Code', 'Prints', 'Why'],
      rows: [
        ['`cout << "5" << 3;`', '53', 'text `5`, then the number 3 — nothing is added'],
        ['`cout << 5 << 3;`', '53', 'two numbers pushed one after the other'],
        ['`cout << 5 + 3;`', '8', 'one expression: added first'],
        ['`cout << (5 > 3);`', '1', 'a true/false question prints 1 (true) or 0 (false)'],
      ],
    },
  ],

  ways: {
    goal: 'Print exactly `Total: 8` — but let C++ produce the 8 in different ways.',
    items: [
      { title: 'Everything as text', code: prog(cpp`
    cout << "Total: 8";`) },
      { title: 'Label + number', code: prog(cpp`
    cout << "Total: " << 8;`) },
      { title: 'Label + addition', code: prog(cpp`
    cout << "Total: " << 5 + 3;`) },
      { title: 'Label + multiplication', code: prog(cpp`
    cout << "Total: " << 2 * 4;`) },
      { title: 'Label + division', code: prog(cpp`
    cout << "Total: " << 16 / 2;`) },
      { title: 'Brackets first', code: prog(cpp`
    cout << "Total: " << (10 - 2);`) },
      { title: 'Integer division (surprise!)', code: prog(cpp`
    cout << "Total: " << 17 / 2;`), note: '17 ÷ 2 = 8.5, but both are whole numbers, so the .5 is thrown away.' },
      { title: 'A decimal that prints like a whole number', code: prog(cpp`
    cout << "Total: " << 8.0;`), note: 'cout drops the `.0`.' },
    ],
    takeaway: 'The screen only shows the **final answer** of an expression. Many different calculations can print the same thing — the dry run shows you how each one got there.',
    check: {
      id: 'l5-ways-check',
      kind: 'mcq',
      prompt: 'Which one does NOT print `Total: 8`?',
      options: ['`cout << "Total: " << "5 + 3";`', '`cout << "Total: " << 24 / 3;`', '`cout << "Total: " << 2 * 2 * 2;`', '`cout << "Total: " << 9 - 1;`'],
      answer: 0,
      explain: '`"5 + 3"` is in quotes, so it is copied as text: `Total: 5 + 3`.',
    },
  },

  watch: [
    {
      title: 'Precedence, step by step',
      intro: 'Each line of the breakdown does one operation. The highlighted part is what C++ calculates next.',
      code: prog(cpp`
    cout << 2 + 3 * 4 << endl;
    cout << (2 + 3) * 4 << endl;
    cout << 100 / 10 / 2 << endl;
    cout << 8 - 3 - 2 << endl;`),
    },
    {
      title: 'Whole-number division',
      code: prog(cpp`
    cout << 7 / 2 << endl;
    cout << 7.0 / 2 << endl;
    cout << 1 / 3 << endl;
    cout << 1.0 / 3 << endl;
    cout << 10 % 3 << endl;`),
    },
    {
      title: 'Text or expression?',
      code: prog(cpp`
    cout << "10 + 5" << endl;
    cout << 10 + 5 << endl;
    cout << "10" << 5 << endl;`),
      fine: true,
    },
  ],

  think: {
    title: 'The canteen bill',
    problem: 'A student buys **3** samosas at **Rs. 40** each and **1** juice at **Rs. 70**. Print `Bill: Rs. 190`, but let C++ calculate the 190.',
    steps: [
      { text: 'Print the label `Bill: Rs. ` (with the space at the end).', lines: [5] },
      { text: 'The samosas cost 3 × 40 → in C++: `3 * 40`.', lines: [5] },
      { text: 'Add the juice: `+ 70`. Multiplication happens first, so no brackets are needed.', lines: [5] },
      { text: 'Put the expression **without quotes** after `<<`, then end the line.', lines: [5] },
    ],
    code: prog(cpp`
    cout << "Bill: Rs. " << 3 * 40 + 70 << endl;`),
    why: 'Write the maths in English first ("three times forty, plus seventy"), then translate each word into an operator.',
    yourTurn: {
      id: 'l5-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'Dry run the bill for a different order. Work out each expression yourself and write what each line prints.',
      code: prog(cpp`
    cout << "Samosas: " << 5 * 40 << endl;
    cout << "Juice: " << 2 * 70 << endl;
    cout << "Bill: " << 5 * 40 + 2 * 70;`),
      given: [0],
      hints: ['Line 6: 2 × 70.', 'Line 7: do both multiplications first, then add.'],
      explain: '200 + 140 = 340. Multiplication before addition — the dry run shows every step.',
    },
  },

  practice: [
    {
      id: 'l5-q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: prog(cpp`
    cout << 5 + 3 << endl;
    cout << "5 + 3" << endl;`),
      explain: 'Line 1 is calculated (8). Line 2 is text, copied exactly (`5 + 3`).',
    },
    {
      id: 'l5-q2',
      kind: 'mcq',
      prompt: 'What does `cout << 10 + 2 * 5;` print?',
      options: ['60', '20', '17', '1025'],
      answer: 1,
      explain: 'Multiplication first: 2 * 5 = 10, then 10 + 10 = 20.',
      hints: ['Which happens first: `+` or `*`?'],
    },
    {
      id: 'l5-q3',
      kind: 'predict',
      tag: 'tricky',
      prompt: 'Whole numbers only. What does this print?',
      code: prog(cpp`
    cout << 9 / 2 << " " << 9 % 2 << " " << 2 / 5;`),
      hints: ['Whole ÷ whole: throw away the decimal part.', '2 ÷ 5 = 0.4 → ?'],
      explain: '9 / 2 = 4 (4.5 without the .5), 9 % 2 = 1 (the remainder), 2 / 5 = 0.',
    },
    {
      id: 'l5-q4',
      kind: 'predict',
      prompt: 'Now with decimals. What does this print?',
      code: prog(cpp`
    cout << 9.0 / 2 << " " << 2.50 << " " << 6.0 / 2;`),
      hints: ['cout drops a trailing `.0` and trailing zeros.'],
      explain: '9.0 / 2 = 4.5. `2.50` prints as `2.5`. 6.0 / 2 = 3.0, printed as `3`.',
    },
    {
      id: 'l5-q5',
      kind: 'blanks',
      prompt: 'A cinema ticket costs Rs. 350. Complete the code so it **calculates** the price of 4 tickets and prints `4 tickets: Rs. 1400`.',
      code: prog(cpp`
    cout << "4 tickets: Rs. " << [[1]];`),
      blanks: [{ answers: ['4 * 350', '350 * 4', '4*350', '350*4'] }],
      chips: ['*', '+', 'x', '350', '4'],
      output: '4 tickets: Rs. 1400',
      hints: ['The multiplication sign in C++ is `*`, not `x`.'],
      explain: '`4 * 350` is worked out to 1400 before printing. Writing `1400` directly would also print it, but then C++ is not doing the calculation.',
    },
    {
      id: 'l5-q6',
      kind: 'mcq',
      prompt: 'Which line prints `2.5`?',
      options: ['`cout << 5 / 2;`', '`cout << 5.0 / 2;`', '`cout << "5 / 2";`', '`cout << 5 % 2;`'],
      answer: 1,
      explain: '`5 / 2` is whole-number division (2). `5.0 / 2` involves a decimal, so the answer is 2.5.',
    },
    {
      id: 'l5-q7',
      kind: 'bug',
      prompt: 'This should print the average of 7 and 8, which is 7.5 — but it prints 7. Find the line with the mistake and fix it.',
      code: prog(cpp`
    cout << "Average: ";
    cout << (7 + 8) / 2;`),
      bugLine: 6,
      options: ['Divide by `2.0` instead of `2`', 'Remove the brackets', 'Put the expression in quotes', 'Use `%` instead of `/`'],
      answer: 0,
      fixed: prog(cpp`
    cout << "Average: ";
    cout << (7 + 8) / 2.0;`),
      hints: ['15 / 2 — both whole numbers. What kind of division is that?'],
      explain: '`(7 + 8) / 2` is 15 / 2 with whole numbers, which gives 7. Dividing by `2.0` makes it a decimal division: 7.5.',
    },
    {
      id: 'l5-q8',
      kind: 'trace',
      mode: 'output',
      prompt: 'Dry run it. Work out each expression and write what each line prints.',
      code: prog(cpp`
    cout << 4 + 6 / 2 << endl;
    cout << (4 + 6) / 2 << endl;
    cout << "4 + 6" << endl;`),
      hints: ['Line 5: division before addition.', 'Line 7 is text in quotes.'],
      explain: '4 + 3 = 7; then 10 / 2 = 5; then the text is copied: `4 + 6`.',
    },
    {
      id: 'l5-q9',
      kind: 'mcq',
      tag: 'real life',
      prompt: 'A fruit seller wants to print the cost of 3 kg apples at Rs. 280/kg **plus** 2 kg bananas at Rs. 150/kg. Which line is correct?',
      options: [
        '`cout << "Cost: " << 3 * 280 + 2 * 150;`',
        '`cout << "Cost: " << 3 * (280 + 2) * 150;`',
        '`cout << "Cost: 3 * 280 + 2 * 150";`',
        '`cout << "Cost: " << 3 x 280 + 2 x 150;`',
      ],
      answer: 0,
      explain: '840 + 300 = 1140. The multiplications happen first, so no brackets are needed. Option C prints the formula as text; D uses `x`, which is not an operator.',
    },
    {
      id: 'l5-q10',
      kind: 'predict',
      prompt: 'Text or number? Predict the output.',
      code: prog(cpp`
    cout << "1" << 2 << "3" << 4 + 5;`),
      hints: ['Only `4 + 5` is calculated. Everything else is printed one after another.'],
      explain: '`1`, `2`, `3`, then 4 + 5 = 9 → `1239`.',
    },
    {
      id: 'l5-q11',
      kind: 'blanks',
      prompt: 'Fill in the operators so the program prints `Remainder of 17 / 5 is 2`.',
      code: prog(cpp`
    cout << "Remainder of 17 / 5 is " << 17 [[1]] 5;`),
      blanks: [{ answers: ['%'] }],
      chips: ['/', '%', '*', '-'],
      output: 'Remainder of 17 / 5 is 2',
      hints: ['Which operator gives the remainder?'],
      explain: '`%` gives the remainder: 17 = 3 × 5 + **2**. Note that the `/` inside the quotes is just text.',
    },
  ],

  cheatsheet: [
    { code: '"5 + 3"', text: 'text: copied as it is → 5 + 3' },
    { code: '5 + 3', text: 'expression: calculated → 8' },
    { code: '* / %  before  + -', text: 'order of operations; brackets first' },
    { code: '7 / 2', text: '3 — whole ÷ whole throws the decimal away' },
    { code: '7.0 / 2', text: '3.5' },
    { code: '7 % 2', text: '1 — the remainder' },
  ],
};
