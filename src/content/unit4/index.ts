import type { Level, Unit } from '../types';
import { cpp, prog } from '../helpers';

const IOM = '#include <iomanip>\n';

// ------------------------------------------------------------------ Level 13: precedence
const L13: Level = {
  id: 'precedence',
  kind: 'lesson',
  title: 'Arithmetic and precedence',
  tagline: 'Which operation happens first? Learn the precedence ladder, left-to-right rules and how brackets change everything.',
  minutes: 20,
  objectives: [
    'Evaluate long expressions in the order C++ uses',
    'Use brackets to force the order you want',
    'Turn a maths formula into a correct C++ expression',
  ],
  learn: [
    { t: 'table', head: ['Level', 'Operators', 'Direction'], rows: [
      ['1 (first)', '`( )` brackets', 'innermost first'],
      ['2', '`*`  `/`  `%`', 'left to right'],
      ['3', '`+`  `-`', 'left to right'],
      ['4 (last)', '`=` assignment', 'right side first, then store'],
    ] },
    { t: 'callout', tone: 'key', title: 'Same level → left to right', text: '`20 / 4 * 2` is `(20 / 4) * 2 = 10`, not `20 / 8`. `10 - 3 - 2` is `(10 - 3) - 2 = 5`.' },
    { t: 'viz', title: 'The breakdown shows the order', code: prog(cpp`
    int a = 2 + 3 * 4 - 6 / 2;
    int b = (2 + 3) * (4 - 6) / 2;
    int c = 20 / 4 * 2 + 10 % 4;
    cout << a << " " << b << " " << c << endl;`) },
    { t: 'h', text: 'Formulas from maths class' },
    { t: 'table', head: ['Maths', 'C++', 'Common mistake'], rows: [
      ['(a + b) ÷ 2', '`(a + b) / 2.0`', '`a + b / 2` divides only b'],
      ['2πr', '`2 * PI * r`', '`2PI r` — no implicit multiplication in C++'],
      ['a²', '`a * a`', '`a^2` is NOT a power in C++'],
      ['(x − y) / (x + y)', '`(x - y) / (x + y)`', 'forgetting the second bracket'],
    ] },
    { t: 'callout', tone: 'warn', title: 'Unary minus', text: '`-a * b` means `(-a) * b`. A minus sign in front of a value is done before `*`.' },
  ],
  ways: {
    goal: 'Calculate the average of 70 and 81 and print `75.5`.',
    items: [
      { title: 'Brackets and 2.0', code: prog(cpp`
    cout << (70 + 81) / 2.0;`) },
      { title: 'Multiply by 0.5', code: prog(cpp`
    cout << (70 + 81) * 0.5;`) },
      { title: 'Variables', code: prog(cpp`
    double a = 70, b = 81;
    cout << (a + b) / 2;`), note: 'a and b are doubles, so / 2 is decimal division.' },
      { title: 'Divide each part', code: prog(cpp`
    cout << 70 / 2.0 + 81 / 2.0;`) },
      { title: 'A cast', code: prog(cpp`
    int sum = 70 + 81;
    cout << (double)sum / 2;`) },
    ],
    takeaway: 'Two things must be right: the ORDER (brackets around the sum) and the TYPE (at least one decimal so nothing is thrown away).',
    check: { id: 'l13-ways-check', kind: 'mcq', prompt: 'Which one prints `110.5` instead of the average?', options: ['`cout << 70 + 81 / 2.0;`', '`cout << (70 + 81) / 2.0;`', '`cout << (70 + 81) * 0.5;`', '`cout << 70 / 2.0 + 81 / 2.0;`'], answer: 0, explain: 'Without brackets only 81 is divided: 70 + 40.5 = 110.5.' },
  },
  watch: [
    { title: 'Step by step through a long expression', code: prog(cpp`
    int x = 5, y = 3;
    int r = x * 2 + y * y - (x - y) * 4;
    cout << r << endl;`) },
  ],
  think: {
    title: 'Simple interest',
    problem: 'Read principal P, rate R (% per year) and time T (years). Print the simple interest **SI = P × R × T / 100**. Input `50000 8 3` → `Interest: 12000`.',
    steps: [
      { text: 'Make boxes for P, R and T and read them.', lines: [5, 6] },
      { text: 'Translate the formula: `P * R * T / 100`. Left to right: multiply first, then divide.', lines: [7] },
      { text: 'Print the interest with a label.', lines: [8] },
    ],
    code: prog(cpp`
    double p, r, t;
    cin >> p >> r >> t;
    double si = p * r * t / 100;
    cout << "Interest: " << si << endl;`),
    input: '50000 8 3\n',
    yourTurn: {
      id: 'l13-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with input `20000 5 2`.',
      code: prog(cpp`
    double p, r, t;
    cin >> p >> r >> t;
    double si = p * r * t / 100;
    cout << "Interest: " << si << endl;`),
      input: '20000 5 2\n',
      hints: ['20000 × 5 = 100000, × 2 = 200000, / 100 = ?'],
      explain: 'SI = 2000.',
    },
  },
  practice: [
    { id: 'l13-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    cout << 3 + 4 * 2 << " " << (3 + 4) * 2 << " " << 24 / 4 / 2;`), explain: '3 + 8 = 11; 7 × 2 = 14; (24 / 4) / 2 = 3.' },
    { id: 'l13-q2', kind: 'mcq', prompt: 'What is `18 - 6 / 3 * 2`?', options: ['14', '8', '17', '4'], answer: 0, explain: '6 / 3 = 2, 2 × 2 = 4, 18 − 4 = 14.' },
    { id: 'l13-q3', kind: 'blanks', prompt: 'Complete the formula for the perimeter of a rectangle, 2 × (length + width). Input `5 3` → `16`.', code: prog(cpp`
    int l, w;
    cin >> l >> w;
    cout << 2 * [[1]]l + w[[2]];`), blanks: [{ answers: ['('] }, { answers: [')'] }], chips: ['(', ')', '*', '+'], input: '5 3\n', explain: 'Without brackets it would be 2 × 5 + 3 = 13.' },
    { id: 'l13-q4', kind: 'bug', prompt: 'The average of 60 and 90 should be 75, but the program prints 105. Find the line and fix it.', code: prog(cpp`
    int a = 60, b = 90;
    int avg = a + b / 2;
    cout << avg;`), bugLine: 6, options: ['Add brackets: `(a + b) / 2`', 'Use `%` instead of `/`', 'Swap a and b', 'Change `int` to `char`'], answer: 0, fixed: prog(cpp`
    int a = 60, b = 90;
    int avg = (a + b) / 2;
    cout << avg;`), explain: 'Division happens first: 60 + 45 = 105. Brackets make the addition happen first.' },
    { id: 'l13-q5', kind: 'trace', mode: 'vars', prompt: 'Dry run and fill in each variable.', code: prog(cpp`
    int x = 10;
    int y = x / 3 * 3;
    int z = x - y * 2;
    cout << y << " " << z;`), hints: ['10 / 3 is whole-number division.'], explain: 'y = 3 × 3 = 9, z = 10 − 18 = −8.' },
    { id: 'l13-q6', kind: 'mcq', tag: 'real life', prompt: 'A shop gives 10% discount on a price. Which expression gives the price after discount?', options: ['`price - price * 10 / 100`', '`price - price * 10 / 100.0 * 0`', '`(price - price) * 10 / 100`', '`price - 10 / 100 * price`'], answer: 0, explain: 'D fails: 10 / 100 is 0 in whole numbers, so nothing is subtracted.' },
  ],
  cheatsheet: [
    { code: '( )', text: 'first' },
    { code: '* / %', text: 'next, left to right' },
    { code: '+ -', text: 'then, left to right' },
    { code: 'a*a', text: 'square (^ is NOT power)' },
  ],
};

// ------------------------------------------------------------------ Level 14: / and %
const L14: Level = {
  id: 'division-remainder',
  kind: 'lesson',
  title: 'Integer division and %',
  tagline: '`/` with whole numbers throws the decimals away and `%` keeps the remainder. Together they split numbers into digits, minutes into hours, and more.',
  minutes: 25,
  objectives: [
    'Predict `/` and `%` with whole numbers, including negatives',
    'Extract digits from a number with `% 10` and `/ 10`',
    'Convert units: seconds → minutes, days → weeks',
  ],
  learn: [
    { t: 'p', text: 'Think back to primary school: 17 ÷ 5 = **3 remainder 2**. In C++, `17 / 5` gives the **3** and `17 % 5` gives the **2**.' },
    { t: 'table', head: ['Expression', 'Result', 'Why'], rows: [
      ['`17 / 5`', '3', 'how many whole 5s fit into 17'],
      ['`17 % 5`', '2', 'what is left over'],
      ['`5 / 17`', '0', '17 does not fit into 5 even once'],
      ['`5 % 17`', '5', 'nothing was taken away'],
      ['`-17 / 5`', '-3', 'the decimal is thrown away toward 0'],
      ['`-17 % 5`', '-2', 'the remainder has the sign of the left number'],
    ] },
    { t: 'callout', tone: 'key', title: 'Two famous patterns', text: '`n % 10` is the **last digit** of n. `n / 10` **removes** the last digit. `n % 2 == 0` means n is **even**.' },
    { t: 'viz', title: 'Taking a number apart', code: prog(cpp`
    int n = 4729;
    int ones = n % 10;
    int tens = n / 10 % 10;
    int hundreds = n / 100 % 10;
    int thousands = n / 1000;
    cout << thousands << " " << hundreds << " " << tens << " " << ones << endl;`) },
    { t: 'h', text: 'Unit conversion' },
    { t: 'code', code: prog(cpp`
    int seconds = 3725;
    int h = seconds / 3600;
    int m = seconds % 3600 / 60;
    int s = seconds % 60;
    cout << h << ":" << m << ":" << s << endl;`), caption: '3725 seconds = 1 hour, 2 minutes, 5 seconds.' },
    { t: 'callout', tone: 'warn', title: '% only works with whole numbers', text: '`7.5 % 2` does not compile. And `x / 0` or `x % 0` with whole numbers **crashes** the program.' },
  ],
  ways: {
    goal: 'Print the last digit of 385, which is 5.',
    items: [
      { title: '% 10', code: prog(cpp`
    int n = 385;
    cout << n % 10;`) },
      { title: 'Subtract the rest', code: prog(cpp`
    int n = 385;
    cout << n - n / 10 * 10;`), note: '385 − 380 = 5.' },
      { title: 'Two steps', code: prog(cpp`
    int n = 385;
    int rest = n / 10;
    cout << n - rest * 10;`) },
    ],
    takeaway: '`% 10` is the shortest way, but all three rely on integer division throwing the decimal away.',
  },
  watch: [
    { title: 'Even or odd with %', code: prog(cpp`
    int n;
    cin >> n;
    cout << n << " % 2 = " << n % 2 << endl;
    cout << "(0 means even, 1 means odd)" << endl;`), input: '37\n' },
    { title: 'Reverse a 3-digit number', code: prog(cpp`
    int n = 472;
    int a = n % 10;
    int b = n / 10 % 10;
    int c = n / 100;
    int rev = a * 100 + b * 10 + c;
    cout << rev << endl;`) },
  ],
  think: {
    title: 'Sum of digits',
    problem: 'Read a 3-digit number and print the sum of its digits. Input `582` → `Sum of digits: 15`.',
    steps: [
      { text: 'Read the number.', lines: [5, 6] },
      { text: 'Last digit: `n % 10`.', lines: [7] },
      { text: 'Middle digit: remove the last digit, then take the new last digit: `n / 10 % 10`.', lines: [8] },
      { text: 'First digit: `n / 100`.', lines: [9] },
      { text: 'Add them and print.', lines: [10] },
    ],
    code: prog(cpp`
    int n;
    cin >> n;
    int ones = n % 10;
    int tens = n / 10 % 10;
    int hundreds = n / 100;
    cout << "Sum of digits: " << ones + tens + hundreds << endl;`),
    input: '582\n',
    yourTurn: {
      id: 'l14-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the input 907.',
      code: prog(cpp`
    int n;
    cin >> n;
    int ones = n % 10;
    int tens = n / 10 % 10;
    int hundreds = n / 100;
    cout << "Sum of digits: " << ones + tens + hundreds << endl;`),
      input: '907\n',
      hints: ['907 / 10 = 90, and 90 % 10 = 0.'],
      explain: '7 + 0 + 9 = 16.',
    },
  },
  practice: [
    { id: 'l14-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    cout << 23 / 4 << " " << 23 % 4 << " " << 4 / 23 << " " << 4 % 23;`), explain: '5, 3, 0, 4.' },
    { id: 'l14-q2', kind: 'mcq', prompt: 'Which expression gives the tens digit of `n = 8364`?', options: ['`n / 10 % 10`', '`n % 10`', '`n % 100`', '`n / 100`'], answer: 0, explain: '8364 / 10 = 836, and 836 % 10 = 6.' },
    { id: 'l14-q3', kind: 'trace', mode: 'vars', prompt: 'Convert 200 minutes. Dry run it.', code: prog(cpp`
    int total = 200;
    int hours = total / 60;
    int mins = total % 60;
    cout << hours << " h " << mins << " min";`), explain: '3 hours (180 minutes) and 20 left.' },
    { id: 'l14-q4', kind: 'blanks', prompt: 'Complete so that it prints the number of full weeks and the extra days in 45 days: `6 weeks 3 days`.', code: prog(cpp`
    int days = 45;
    cout << days [[1]] 7 << " weeks " << days [[2]] 7 << " days";`), blanks: [{ answers: ['/'] }, { answers: ['%'] }], chips: ['/', '%', '*'], output: '6 weeks 3 days', explain: '45 / 7 = 6 full weeks, 45 % 7 = 3 days left.' },
    { id: 'l14-q5', kind: 'predict', tag: 'tricky', prompt: 'Negative numbers! Predict the output.', code: prog(cpp`
    cout << -7 / 2 << " " << -7 % 2 << " " << 7 % -2;`), explain: 'The decimal is thrown away toward zero (−3), and the remainder takes the sign of the LEFT number: −1 and 1.' },
    { id: 'l14-q6', kind: 'bug', prompt: 'This does not compile. Why?', code: prog(cpp`
    double money = 125.5;
    cout << money % 10;`), bugLine: 6, options: ['`%` only works with whole numbers — use an int', 'Put 10 in quotes', 'Use `//` instead of `%`', 'Add brackets around money'], answer: 0, fixed: prog(cpp`
    int money = 125;
    cout << money % 10;`), explain: '`invalid operands of types \'double\' and \'int\' to binary \'operator%\'`.' },
    { id: 'l14-q7', kind: 'predict', tag: 'real life', prompt: 'An ATM only has Rs. 500 notes. For Rs. 2300, how many notes and how much is left?', code: prog(cpp`
    int amount = 2300;
    cout << amount / 500 << " notes, " << amount % 500 << " left";`), explain: '4 notes (2000) and 300 left.' },
  ],
  cheatsheet: [
    { code: 'a / b', text: 'whole-number division (decimal thrown away)' },
    { code: 'a % b', text: 'remainder' },
    { code: 'n % 10', text: 'last digit' },
    { code: 'n / 10', text: 'remove the last digit' },
    { code: 'n % 2 == 0', text: 'n is even' },
  ],
};

// ------------------------------------------------------------------ Level 15: casting
const L15: Level = {
  id: 'casting',
  kind: 'lesson',
  title: 'Mixing types and casting',
  tagline: 'When an int meets a double, C++ converts one of them. Learn the rules, force a conversion with a cast, and print decimals exactly with fixed and setprecision.',
  minutes: 25,
  objectives: [
    'Predict the type and value of mixed expressions',
    'Use `(double)` and `static_cast<double>()` to avoid integer division',
    'Print a fixed number of decimals with `fixed` and `setprecision`',
  ],
  learn: [
    { t: 'callout', tone: 'key', title: 'The rule', text: 'If **either** side of an operator is a `double`, the other side is turned into a double first and the answer is a double. Only int ⊕ int gives an int.' },
    { t: 'table', head: ['Expression', 'Type', 'Value'], rows: [
      ['`7 / 2`', 'int', '3'],
      ['`7.0 / 2`', 'double', '3.5'],
      ['`7 / 2.0`', 'double', '3.5'],
      ['`(double)7 / 2`', 'double', '3.5 — the cast happens first'],
      ['`(double)(7 / 2)`', 'double', '3.0 — too late, 7 / 2 was already 3'],
      ['`(int)3.99`', 'int', '3 — cut off, not rounded'],
    ] },
    { t: 'viz', title: 'Casts step by step', code: prog(cpp`
    int total = 7, count = 2;
    cout << total / count << endl;
    cout << (double)total / count << endl;
    cout << static_cast<double>(total) / count << endl;
    cout << (double)(total / count) << endl;`) },
    { t: 'h', text: 'Printing a fixed number of decimals' },
    { t: 'code', code: prog(cpp`
    double price = 1234.5;
    cout << price << endl;
    cout << fixed << setprecision(2) << price << endl;`, IOM), caption: '`fixed` + `setprecision(2)` always shows exactly 2 decimals. It needs `#include <iomanip>` and stays on for all later numbers.' },
    { t: 'callout', tone: 'tip', title: 'Rounding to the nearest whole number', text: '`(int)(x + 0.5)` rounds a positive x to the nearest whole number, or use `round(x)` from `<cmath>`.' },
  ],
  watch: [
    { title: 'Percentage', code: prog(cpp`
    int obtained = 437, total = 550;
    double pct = obtained * 100.0 / total;
    cout << fixed << setprecision(1) << pct << "%" << endl;`, IOM) },
  ],
  think: {
    title: 'Fuel average',
    problem: 'A car travels a whole number of kilometres on a whole number of litres. Print km per litre with 2 decimals. Input `425 32` → `13.28 km/l`.',
    steps: [
      { text: 'Read km and litres as ints.', lines: [6, 7] },
      { text: 'Divide as decimals: cast one side to double.', lines: [8] },
      { text: 'Print with exactly 2 decimals.', lines: [9] },
    ],
    code: prog(cpp`
    int km, litres;
    cin >> km >> litres;
    double avg = (double)km / litres;
    cout << fixed << setprecision(2) << avg << " km/l" << endl;`, IOM),
    input: '425 32\n',
    yourTurn: {
      id: 'l15-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with input `300 40`.',
      code: prog(cpp`
    int km, litres;
    cin >> km >> litres;
    double avg = (double)km / litres;
    cout << fixed << setprecision(2) << avg << " km/l" << endl;`, IOM),
      input: '300 40\n',
      hints: ['300.0 / 40 = 7.5, printed with 2 decimals.'],
      explain: '`7.50 km/l`.',
    },
  },
  practice: [
    { id: 'l15-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int a = 9, b = 4;
    cout << a / b << " " << (double)a / b << " " << (double)(a / b);`), explain: '2, 2.25, and 2 (the cast came after the integer division; 2.0 prints as 2).' },
    { id: 'l15-q2', kind: 'mcq', prompt: 'Which expression gives 2.5?', options: ['`5 / 2.0`', '`5 / 2`', '`(double)(5 / 2)`', '`(int)5.0 / 2`'], answer: 0, explain: 'Only A has a double in the division itself.' },
    { id: 'l15-q3', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    double x = 3.14159;
    cout << fixed << setprecision(3) << x << " " << setprecision(0) << x;`, IOM), explain: '3.142 (rounded) and 3.' },
    { id: 'l15-q4', kind: 'blanks', prompt: 'Complete so the percentage for 45/60 prints `75.0`.', code: prog(cpp`
    int got = 45, total = 60;
    cout << [[1]] << setprecision(1) << [[2]]got * 100 / total;`, IOM), blanks: [{ answers: ['fixed'] }, { answers: ['(double)', 'static_cast<double>'] }], chips: ['fixed', '(double)', '(int)', 'endl'], output: '75.0', explain: 'Cast first, then fixed + 1 decimal.' },
    { id: 'l15-q5', kind: 'bug', prompt: 'The average of 5 and 6 should be 5.5 but prints 5. Find the line.', code: prog(cpp`
    int a = 5, b = 6;
    double avg = (a + b) / 2;
    cout << avg;`), bugLine: 6, options: ['Divide by 2.0 (or cast the sum to double)', 'Change avg to int', 'Remove the brackets', 'Print avg with endl'], answer: 0, fixed: prog(cpp`
    int a = 5, b = 6;
    double avg = (a + b) / 2.0;
    cout << avg;`), explain: 'The right side is int / int = 5 BEFORE it is stored in the double.' },
    { id: 'l15-q6', kind: 'mcq', prompt: 'What is `(int)7.9 + (int)2.6`?', options: ['9', '11', '10', '10.5'], answer: 0, explain: '7 + 2 = 9 — casts cut off, they do not round.' },
  ],
  cheatsheet: [
    { code: 'int ⊕ double', text: 'becomes double' },
    { code: '(double)x', text: 'cast before dividing' },
    { code: '(int)3.9', text: '3 — cut off' },
    { code: 'fixed << setprecision(2)', text: 'exactly 2 decimals (#include <iomanip>)' },
  ],
};

// ------------------------------------------------------------------ Level 16: compound assignment
const L16: Level = {
  id: 'compound-assignment',
  kind: 'lesson',
  title: 'Shortcuts: += -= *= /= %=',
  tagline: 'Updating a variable with its own value is so common that C++ has a shortcut for every operator.',
  minutes: 15,
  objectives: ['Rewrite `x = x + 5` as `x += 5` and back', 'Trace a variable through several compound assignments'],
  learn: [
    { t: 'table', head: ['Shortcut', 'Means', 'If x = 20'], rows: [
      ['`x += 5`', '`x = x + 5`', '25'],
      ['`x -= 5`', '`x = x - 5`', '15'],
      ['`x *= 5`', '`x = x * 5`', '100'],
      ['`x /= 5`', '`x = x / 5`', '4'],
      ['`x %= 3`', '`x = x % 3`', '2'],
    ] },
    { t: 'callout', tone: 'warn', title: 'The whole right side goes first', text: '`x *= 2 + 3` means `x = x * (2 + 3)`, not `x * 2 + 3`.' },
    { t: 'viz', title: 'A wallet over one day', code: prog(cpp`
    int wallet = 1000;
    wallet -= 150;
    wallet -= 60;
    wallet += 500;
    wallet *= 2;
    cout << "Wallet: " << wallet << endl;`) },
  ],
  watch: [
    { title: 'Shortcut with an expression on the right', code: prog(cpp`
    int x = 4;
    x *= 2 + 3;
    cout << x << endl;`) },
  ],
  practice: [
    { id: 'l16-q1', kind: 'trace', mode: 'vars', prompt: 'Dry run: write the new value of n after each line.', code: prog(cpp`
    int n = 10;
    n += 6;
    n /= 4;
    n *= 3;
    n %= 5;
    cout << n;`), explain: '16, 4, 12, 2.' },
    { id: 'l16-q2', kind: 'mcq', prompt: 'Which line means `total = total - discount;`?', options: ['`total -= discount;`', '`total =- discount;`', '`total - = discount;`', '`discount -= total;`'], answer: 0, explain: '`=-` would store MINUS discount.' },
    { id: 'l16-q3', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    int x = 3;
    x *= 2 + 1;
    x -= x / 3;
    cout << x;`), explain: 'x = 3 × 3 = 9, then 9 − 3 = 6.' },
    { id: 'l16-q4', kind: 'blanks', tag: 'real life', prompt: 'A savings account: start with 2000, deposit 500, then the bank doubles it. Output `5000`.', code: prog(cpp`
    int savings = 2000;
    savings [[1]] 500;
    savings [[2]] 2;
    cout << savings;`), blanks: [{ answers: ['+='] }, { answers: ['*='] }], chips: ['+=', '-=', '*=', '/='], output: '5000', explain: '2500, then 5000.' },
  ],
  cheatsheet: [{ code: 'x op= y', text: 'x = x op (y)' }],
};

// ------------------------------------------------------------------ Level 17: ++ --
const L17: Level = {
  id: 'increment',
  kind: 'lesson',
  title: '++ and -- (before vs after)',
  tagline: '`x++` and `++x` both add 1 — but inside an expression one hands over the OLD value and the other the NEW one.',
  minutes: 20,
  objectives: ['Use `++` and `--` as statements', 'Predict the difference between `x++` and `++x` inside an expression'],
  learn: [
    { t: 'p', text: 'On its own line, `x++;` and `++x;` do exactly the same thing: add 1 to x. The difference only shows when the value is **used** in the same expression.' },
    { t: 'table', head: ['Code (x starts at 5)', 'y gets', 'x becomes'], rows: [
      ['`y = x++;`', '5 (old value)', '6'],
      ['`y = ++x;`', '6 (new value)', '6'],
      ['`y = x--;`', '5', '4'],
      ['`y = --x;`', '4', '4'],
    ] },
    { t: 'callout', tone: 'key', title: 'Memory trick', text: '**x++**: the `x` comes first → you get x first, then it grows. **++x**: the `++` comes first → it grows first, then you get it.' },
    { t: 'viz', title: 'Before vs after', code: prog(cpp`
    int x = 5;
    int a = x++;
    int b = ++x;
    cout << a << " " << b << " " << x << endl;`) },
    { t: 'callout', tone: 'warn', title: 'Do not use x twice', text: 'Something like `x++ + x++` or `x = x++` has no reliable answer in C++. Never write that in real code.' },
  ],
  watch: [
    { title: 'Counting down', code: prog(cpp`
    int lives = 3;
    lives--;
    cout << "Lives: " << lives << endl;
    --lives;
    cout << "Lives: " << lives << endl;`) },
  ],
  practice: [
    { id: 'l17-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int x = 10;
    int y = x++;
    cout << x << " " << y;`), explain: 'y gets the old 10, then x becomes 11.' },
    { id: 'l17-q2', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int x = 10;
    int y = ++x;
    cout << x << " " << y;`), explain: 'x becomes 11 first, and y gets 11.' },
    { id: 'l17-q3', kind: 'trace', mode: 'vars', prompt: 'Dry run carefully.', code: prog(cpp`
    int a = 3;
    int b = a++ * 2;
    int c = --a + b;
    cout << a << " " << b << " " << c;`), hints: ['Line 6 uses the OLD a (3), then a becomes 4.', 'Line 7: a becomes 3 first, then 3 + 6.'], explain: 'b = 6, a = 4 → 3, c = 9.' },
    { id: 'l17-q4', kind: 'mcq', prompt: 'After `int k = 7; k--; k--; ++k;` what is k?', options: ['6', '5', '7', '8'], answer: 0, explain: '7 → 6 → 5 → 6.' },
    { id: 'l17-q5', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    int n = 5;
    cout << n++ << " ";
    cout << n << " ";
    cout << ++n;`), explain: 'Prints the old 5 (n becomes 6), then 6, then n becomes 7 and prints 7.' },
  ],
  cheatsheet: [
    { code: 'x++', text: 'use x, then add 1' },
    { code: '++x', text: 'add 1, then use x' },
    { code: 'x--  --x', text: 'same idea, subtract 1' },
  ],
};

// ------------------------------------------------------------------ Checkpoint 4
const C4: Level = {
  id: 'checkpoint-operators',
  kind: 'revision',
  title: 'Operators',
  tagline: '**Checkpoint 4**: precedence, `/` and `%`, casts, shortcuts and `++`. Real formulas, real bugs. Score 70% to clear it.',
  minutes: 25,
  objectives: [],
  practice: [
    { id: 'c4-q1', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'A parking meter charges Rs. 50 per started hour. Dry run for 130 minutes.', code: prog(cpp`
    int minutes = 130;
    int hours = minutes / 60;
    int extra = minutes % 60;
    int fee = (hours + (extra + 59) / 60) * 50;
    cout << "Fee: " << fee;`), hints: ['(extra + 59) / 60 is 1 when extra > 0 and 0 when extra is 0.'], explain: '2 full hours and 10 minutes → 3 started hours → Rs. 150.' },
    { id: 'c4-q2', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int a = 17, b = 5;
    cout << a / b * b + a % b << " " << (double)a / b;`), explain: '3 × 5 + 2 = 17 (always the original number!) and 3.4.' },
    { id: 'c4-q3', kind: 'bug', prompt: 'The percentage of 45 out of 60 prints 0. Find the line.', code: prog(cpp`
    int got = 45, total = 60;
    double pct = got / total * 100;
    cout << pct;`), bugLine: 6, options: ['Write `got * 100.0 / total`', 'Make pct an int', 'Use % instead of /', 'Put brackets around 100'], answer: 0, fixed: prog(cpp`
    int got = 45, total = 60;
    double pct = got * 100.0 / total;
    cout << pct;`), explain: '45 / 60 is 0 in whole numbers, and 0 × 100 = 0.' },
    { id: 'c4-q4', kind: 'blanks', prompt: 'Reverse a 2-digit number: input `47` → `74`.', code: prog(cpp`
    int n;
    cin >> n;
    cout << n [[1]] 10 * 10 + n [[2]] 10;`), blanks: [{ answers: ['%'] }, { answers: ['/'] }], chips: ['%', '/', '*', '+'], input: '47\n', explain: 'Last digit × 10 plus the first digit: 7 × 10 + 4.' },
    { id: 'c4-q5', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    int y = 10;
    y /= 3;
    y *= 3;
    cout << y;`), explain: 'Only y is printed: 10 / 3 = 3, then × 3 = 9 — the lost remainder does not come back.' },
    { id: 'c4-q6', kind: 'mcq', tag: 'real life', prompt: 'Which expression gives the number of 8-seat vans needed for 50 students (the last van may be partly empty)?', options: ['`(50 + 7) / 8`', '`50 / 8`', '`50 % 8`', '`50 / 8.0`'], answer: 0, explain: '57 / 8 = 7 vans. `50 / 8` = 6 would leave 2 students behind.' },
    { id: 'c4-q7', kind: 'parsons', prompt: 'Arrange: read a temperature in Fahrenheit and print Celsius with 1 decimal. Input `98.6` → `37.0`.', lines: ['#include <iostream>', '#include <iomanip>', 'using namespace std;', 'int main() {', '    double f;', '    cin >> f;', '    double c = (f - 32) * 5 / 9;', '    cout << fixed << setprecision(1) << c;', '    return 0;', '}'], distractors: ['    double c = f - 32 * 5 / 9;'], input: '98.6\n', explain: 'Brackets around f − 32 are essential.' },
  ],
  exam: {
    title: 'Exam Challenge: Operators',
    intro: '**State the output of the following code. If there is an error, write it explicitly** (choose "It does not compile" and the line). Work each expression out by hand in the right order: brackets, unary `-` `++` `--` and casts, then `* / %`, then `+ -`, then `<< >>`, then comparisons `< >`, then `&`, `^`, `|`, and assignments last (right to left). A comparison gives `1` (true) or `0` (false).',
    questions: [
      { id: 'checkpoint-operators-x1', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code.', code: prog(cpp`
    int a = 10, b = 30;
    double c = 37;
    b = c - b - a;
    b =- 10;
    cout << b << " " << c / 2 - b << " " << -b % 3 * 2;`),
        hints: ['`=-` is not an operator. Read `b =- 10;` as `b = -10;`.', '`-b` is worked out before `%` and `*`.'],
        explain: 'Line 7: `37.0 - 30 - 10` = `-3.0`, stored in the int `b` → `-3`.\nLine 8: `b =- 10` is really `b = -10` (assignment of minus ten), NOT `b -= 10`. So `b` = `-10`.\nLine 9: `c / 2 - b` = `18.5 - (-10)` = `28.5`. Then `-b` = `10`, `10 % 3` = `1`, `1 * 2` = `2`.\nOutput: `-10 28.5 2`' },
      { id: 'checkpoint-operators-x2', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it explicitly.', code: prog(cpp`
    double x = static_cast<int>(7.7);
    int y = 3;
    cout << x % y;`),
        hints: ['What is the TYPE of `x`? The cast on line 5 does not change that.'],
        explain: 'It does **not compile**. The cast turns 7.7 into the int 7, but it is then stored in `x`, which is still a `double` (7.0). The `%` operator only works with whole-number types, so `x % y` is an error on **line 7**: `invalid operands of types \'double\' and \'int\' to binary \'operator%\'`.\nFix: `static_cast<int>(x) % y`, which prints `1`.' },
      { id: 'checkpoint-operators-x3', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code.', code: prog(cpp`
    int a = 5, b = 15, c = 4, d = 1;
    a += b > c > d;
    b -= c < d + 4;
    c *= 2 + 3 % 2;
    cout << a << " " << b << " " << c;`),
        hints: ['`b > c > d` is NOT "b is bigger than c and c is bigger than d". It goes left to right: `(b > c) > d`.', '`+` is done before `<`, and the whole right side is done before `+=`, `-=`, `*=`.'],
        explain: 'Line 6: `b > c` → `15 > 4` → `1`. Then `1 > d` → `1 > 1` → `0`. So `a += 0` → `a` stays `5`.\nLine 7: `d + 4` = 5 first, then `c < 5` → `4 < 5` → `1`. `b -= 1` → `14`.\nLine 8: `3 % 2` = 1, `2 + 1` = 3, then `c *= 3` → `12` (not `4 * 2 + 1`).\nOutput: `5 14 12`' },
      { id: 'checkpoint-operators-x4', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it explicitly.', code: prog(cpp`
    int a, b, c, d, e;
    a = b = c * 3 = d + 5 = e = 10;
    cout << a << b << c << d << e;`),
        hints: ['Chained `=` works from right to left. What is on the LEFT of each `=`?'],
        explain: 'It does **not compile**. Assignment runs right to left: `e = 10` is fine, but next comes `d + 5 = …`. The left side of `=` must be a variable (a box), and `d + 5` is just a calculated value with no box. g++ reports `lvalue required as left operand of assignment` on **line 6**.\nFix: only variables on the left, e.g. `a = b = c = d = e = 10;` (then it would print `1010101010`).' },
      { id: 'checkpoint-operators-x5', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code.', code: prog(cpp`
    double x = 5.5;
    cout << static_cast<int>(x) % 3 + x * 2 << " ";
    cout << (int)(x * 3) / 2 << " ";
    cout << (double)(7 / 2) << " " << (double)7 / 2;`),
        hints: ['A cast in front of brackets converts the RESULT of the brackets.', '`(double)7 / 2` converts only the 7, before the division.'],
        explain: 'Line 6: `static_cast<int>(5.5)` = 5, `5 % 3` = 2, `x * 2` = 11.0, so `2 + 11.0` = `13`.\nLine 7: `x * 3` = 16.5, cast to int → 16, `16 / 2` = `8`.\nLine 8: `(double)(7 / 2)` — the brackets go first: `7 / 2` = 3, THEN it becomes 3.0 → prints `3`. But `(double)7 / 2` = `7.0 / 2` = `3.5`.\nOutput: `13 8 3 3.5`' },
      { id: 'checkpoint-operators-x6', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code.', code: prog(cpp`
    int x = 4, y = 6;
    x += y -= 3;
    y *= x-- - 5;
    int z = ++x * 2 + y--;
    cout << x << " " << y << " " << z;`),
        hints: ['`x += y -= 3` runs right to left: first `y -= 3`, then `x += (the new y)`.', '`x--` hands over the OLD value; `++x` hands over the NEW value.'],
        explain: 'Line 6: `y -= 3` → `y = 3`, then `x += 3` → `x = 7`.\nLine 7: `x--` gives the old 7 (x becomes 6). `7 - 5` = 2, so `y *= 2` → `y = 6`.\nLine 8: `++x` makes x `7` and gives 7. `7 * 2` = 14. `y--` gives the old 6 (y becomes 5). `z = 14 + 6` = `20`.\nOutput: `7 5 20`' },
      { id: 'checkpoint-operators-x7', kind: 'predict', tag: 'exam', prompt: 'Bitwise operators work on the binary digits: `&` (AND), `|` (OR), `^` (XOR). State the output of the following code. If there is an error, write it explicitly.', code: prog(cpp`
    int a = 6, b = 3;
    cout << (a | b) << " " << (a ^ b) << " ";
    cout << a & b << endl;`),
        hints: ['`<<` has a HIGHER precedence than `&`. How does line 7 group without brackets?'],
        explain: 'It does **not compile**. Because `<<` is stronger than `&`, line 7 is read as `(cout << a) & (b << endl)`. `b << endl` (shift an int by `endl`) and `cout & …` make no sense, so g++ reports an error on **line 7**.\nFix: brackets, `cout << (a & b) << endl;`.\nWith the fix: 6 = `110`, 3 = `011`. `a | b` = `111` = 7, `a ^ b` = `101` = 5, `a & b` = `010` = 2. The output would be `7 5 2`.' },
      { id: 'checkpoint-operators-x8', kind: 'count', tag: 'exam', prompt: 'How many times does the digit `7` appear in the output?', code: prog(cpp`
    int x = 7;
    cout << x++;
    cout << x;
    cout << --x;
    cout << x--;
    cout << x + 1;
    cout << 77 / 10 << 7 % 10 << 17 / 2.0;`),
        count: { text: '7' },
        hints: ['Keep a note of x after every line: post-`++` prints the old value, pre-`--` the new one.', '`17 / 2.0` has a decimal part.'],
        explain: 'Line 6 prints `7` (x becomes 8). Line 7 prints `8`. Line 8: x becomes 7, prints `7`. Line 9 prints `7` (x becomes 6). Line 10 prints `6 + 1` = `7`. Line 11: `77 / 10` = `7`, `7 % 10` = `7`, `17 / 2.0` = `8.5`.\nThe output is `78777778.5` → **6** sevens.' },
      { id: 'checkpoint-operators-x9', kind: 'count', tag: 'exam', prompt: 'How many times does the digit `1` appear in the output?', code: prog(cpp`
    int n = 1234;
    cout << n % 10 << n / 10 % 10 << n / 100 % 10 << n / 1000 << endl;
    n /= 10;
    n *= 10;
    n += 1;
    cout << n << " " << n % 2 << " " << 11 % 5 << " " << -11 / 10;`),
        count: { text: '1' },
        hints: ['`n % 10` is the last digit, `n / 10` removes it.', '`n /= 10` then `n *= 10` does not give 1234 back.'],
        explain: 'Line 6 prints the digits backwards: `4`, `3`, `2`, `1` → `4321` (**1** one).\nLines 7–9: `1234 / 10` = 123, `* 10` = 1230, `+ 1` = 1231.\nLine 10: `1231` (**2** ones), `1231 % 2` = `1`, `11 % 5` = `1`, `-11 / 10` = `-1` (cut toward zero) → **3** more.\nOutput `4321` / `1231 1 1 -1` → **6** ones.' },
      { id: 'checkpoint-operators-x10', kind: 'blanks', tag: 'exam', prompt: 'Complete the program so it converts seconds into hours, minutes and seconds. For the input `3725` it must print EXACTLY `1h 2m 5s`.', code: prog(cpp`
    int total;
    cin >> total;
    int h = total [[1]] 3600;
    total [[2]] 3600;
    int m = total / 60;
    int s = total [[3]] 60;
    cout << h << "h " << m << "m " << s << "s";`), input: '3725\n',
        blanks: [{ answers: ['/'] }, { answers: ['%='] }, { answers: ['%'] }],
        chips: ['/', '%', '/=', '%=', '*', '-='],
        output: '1h 2m 5s',
        hints: ['Hours = how many whole 3600s fit. Then keep only the seconds that are left over.'],
        explain: '`3725 / 3600` = 1 hour. `total %= 3600` keeps the rest: 125. `125 / 60` = 2 minutes, `125 % 60` = 5 seconds.' },
    ],
  },
};

export const unit4: Unit = {
  id: 'u4',
  num: 4,
  title: 'Operators',
  summary: 'Arithmetic, precedence and the tricks behind / and %.',
  levels: [L13, L14, L15, L16, L17, C4],
};
