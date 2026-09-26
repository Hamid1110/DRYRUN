import type { Level, Unit } from '../types';
import { cpp, prog } from '../helpers';

const IOM = '#include <iomanip>\n';

// ------------------------------------------------------------------ Level 26: while
const LWhile: Level = {
  id: 'while-loop',
  kind: 'lesson',
  title: 'while: repeat while it is true',
  tagline: 'A `while` loop asks the same yes/no question again and again. As long as the answer is true, the block runs one more time.',
  minutes: 25,
  objectives: [
    'Write a `while` loop with a start value, a condition and an update',
    'Count how many times a loop runs — and how many times its condition is checked',
    'Spot a loop that never stops (an infinite loop) before you run it',
  ],
  learn: [
    { t: 'p', text: 'Think of washing dishes: *while there are plates in the sink, wash one plate.* You do not know the number in advance — you just keep checking. Every time you finish a plate, you look at the sink again. When it is empty, you stop.' },
    { t: 'syntax', title: 'The while loop', code: 'int i = 1;\nwhile (i <= 5) {\n    cout << i << " ";\n    i++;\n}', parts: [
      { token: 'int i = 1;', text: 'the **start**: a counter box made before the loop' },
      { token: 'while (i <= 5)', text: 'the **check**: asked BEFORE every round. True → run the block. False → jump past the loop' },
      { token: '{ … }', text: 'the **body**: the work done in one round (one *iteration*)' },
      { token: 'i++;', text: 'the **update**: changes the counter so the check will be false one day' },
    ] },
    { t: 'viz', title: 'Counting from 1 to 5', code: prog(cpp`
    int i = 1;
    while (i <= 5) {
        cout << i << " ";
        i++;
    }
    cout << endl << "Done, i = " << i << endl;`) },
    { t: 'table', head: ['Round', 'i before the check', '`i <= 5`', 'prints'], rows: [
      ['1', '1', 'true', '`1 `'],
      ['2', '2', 'true', '`2 `'],
      ['3', '3', 'true', '`3 `'],
      ['4', '4', 'true', '`4 `'],
      ['5', '5', 'true', '`5 `'],
      ['—', '6', 'false', 'loop ends'],
    ], caption: 'The body runs **5** times, but the condition is checked **6** times. The last check is the one that says "stop". After the loop, `i` is 6.' },
    { t: 'callout', tone: 'key', title: 'How many times?', text: 'Counting up by 1 from `a` while `i <= b` runs **b − a + 1** times (1 to 5 → 5 times). If the condition is false at the very start, the body runs **0** times — a while loop may never run at all.' },
    { t: 'h', text: 'A running sum' },
    { t: 'viz', title: 'Add 1 + 2 + … + n', code: prog(cpp`
    int n, sum = 0, i = 1;
    cin >> n;
    while (i <= n) {
        sum += i;
        i++;
    }
    cout << "Sum = " << sum << endl;`), input: '4\n' },
    { t: 'callout', tone: 'warn', title: 'The infinite loop', text: 'Forget the update and `i` stays 1 forever. `1 <= 5` is true every time, so the loop never ends and the program "hangs". We do **not** run such a loop here — just read it and see why it cannot stop.' },
    { t: 'compare', items: [
      { title: 'No update — never stops', good: false, code: 'int i = 1;\nwhile (i <= 5) {\n    cout << i << " ";\n}', note: 'Prints `1 1 1 1 …` forever. Nothing inside the body changes `i`.' },
      { title: 'Update inside the body', good: true, code: 'int i = 1;\nwhile (i <= 5) {\n    cout << i << " ";\n    i++;\n}', note: 'Every round moves `i` one step closer to 6.' },
    ] },
    { t: 'terms', items: [
      { term: 'iteration', def: 'one round of the loop body' },
      { term: 'loop counter', def: 'a variable that counts the rounds, like `i`' },
      { term: 'sentinel', def: 'a special input value that means "stop", like 0 or -1' },
      { term: 'infinite loop', def: 'a loop whose condition never becomes false' },
    ] },
  ],
  ways: {
    goal: 'Print `1 2 3 4 5 ` with a while loop.',
    items: [
      { title: '`<=` the last value', code: prog(cpp`
    int i = 1;
    while (i <= 5) {
        cout << i << " ";
        i++;
    }`) },
      { title: '`<` one past the end', code: prog(cpp`
    int i = 1;
    while (i < 6) {
        cout << i << " ";
        i++;
    }`), note: 'For whole numbers `i < 6` means the same as `i <= 5`.' },
      { title: 'Start at 0, print i + 1', code: prog(cpp`
    int i = 0;
    while (i < 5) {
        cout << i + 1 << " ";
        i++;
    }`), note: 'Programmers often count from 0. `i < 5` with a start of 0 also runs 5 times.' },
      { title: 'Long form of the update', code: prog(cpp`
    int i = 1;
    while (i <= 5) {
        cout << i << " ";
        i = i + 1;
    }`), note: '`i = i + 1`, `i += 1`, `i++` and `++i` all add one here.' },
      { title: 'Print, then increase, in one line', code: prog(cpp`
    int i = 1;
    while (i <= 5) {
        cout << i++ << " ";
    }`), note: '`i++` gives the OLD value to cout, then adds 1. Short, but harder to read.' },
    ],
    takeaway: 'Every correct version has the same three jobs: a start, a check that becomes false, and an update. Change one and you usually must change another.',
    check: { id: 'while-loop-ways-check', kind: 'mcq', prompt: 'Which loop does NOT print `1 2 3 4 5 `?', options: ['`int i = 1; while (i < 5) { cout << i << " "; i++; }`', '`int i = 1; while (i <= 5) { cout << i << " "; i++; }`', '`int i = 0; while (i < 5) { i++; cout << i << " "; }`', '`int i = 1; while (i != 6) { cout << i << " "; i++; }`'], answer: 0, hints: ['Try the last round of each loop: what is i when the check becomes false?'], explain: '`i < 5` stops when i reaches 5, so it prints only `1 2 3 4 `. The third option adds 1 *before* printing, so 0 → prints 1 … 4 → prints 5.' },
  },
  watch: [
    { title: 'Countdown', intro: 'The counter can go down. The update is `n--`.', code: prog(cpp`
    int n = 5;
    while (n > 0) {
        cout << n << " ";
        n--;
    }
    cout << "Go!" << endl;`) },
    { title: 'How many days until the money passes 100?', intro: 'We do not know the number of rounds in advance — that is exactly when `while` shines.', code: prog(cpp`
    int money = 1, days = 0;
    while (money < 100) {
        money = money * 2;
        days++;
    }
    cout << days << " days, Rs " << money << endl;`) },
    { title: 'Read numbers until the user types 0', intro: 'A **sentinel** loop: read once before the loop, and read again at the end of every round.', code: prog(cpp`
    int x, total = 0;
    cin >> x;
    while (x != 0) {
        total += x;
        cin >> x;
    }
    cout << "Total: " << total << endl;`), input: '5 8 2 0\n' },
  ],
  think: {
    title: 'Count the digits',
    problem: 'Read a positive whole number and print how many digits it has. Input `4721` → `Digits: 4`.',
    steps: [
      { text: 'Make a box for the number and a counter that starts at 0. Read the number.', lines: [5, 6] },
      { text: 'We do not know how many digits there are, so repeat *while there are digits left* → `n > 0`.', lines: [7] },
      { text: 'Dividing a whole number by 10 throws away its last digit: 4721 → 472.', lines: [8] },
      { text: 'Each time we throw away a digit, count it.', lines: [9] },
      { text: 'When n becomes 0, no digits are left. Print the counter.', lines: [11] },
    ],
    code: prog(cpp`
    int n, digits = 0;
    cin >> n;
    while (n > 0) {
        n = n / 10;
        digits++;
    }
    cout << "Digits: " << digits << endl;`),
    input: '4721\n',
    why: 'Integer division by 10 removes exactly one digit each round, so the number of rounds IS the number of digits. (For the input 0 this loop runs 0 times and says 0 digits — the do…while level fixes that.)',
    yourTurn: {
      id: 'while-loop-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['n', 'digits'],
      prompt: 'Dry run the digit counter with the input `305`. Fill in every change.',
      code: prog(cpp`
    int n, digits = 0;
    cin >> n;
    while (n > 0) {
        n = n / 10;
        digits++;
    }
    cout << "Digits: " << digits << endl;`),
      input: '305\n',
      hints: ['305 / 10 is 30 (whole-number division).', 'The zero in the middle still counts: 30 / 10 = 3, then 3 / 10 = 0.'],
      explain: 'n goes 305 → 30 → 3 → 0 and digits goes 1 → 2 → 3. The 4th check `0 > 0` is false, so it prints `Digits: 3`.',
    },
  },
  practice: [
    { id: 'while-loop-q1', kind: 'mcq', prompt: 'How many times does the body of this loop run?', code: prog(cpp`
    int i = 3;
    while (i <= 9) {
        cout << i << " ";
        i += 2;
    }`), options: ['4', '3', '5', '7'], answer: 0, hints: ['Write the values of i: 3, 5, …', 'Stop when i is no longer ≤ 9.'], explain: 'i takes 3, 5, 7, 9 → 4 rounds. Then i is 11 and `11 <= 9` is false. It prints `3 5 7 9 `.' },
    { id: 'while-loop-q2', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int i = 10;
    while (i > 0) {
        cout << i << " ";
        i -= 3;
    }`), hints: ['Subtract 3 each round: 10, 7, …', 'Is -2 greater than 0?'], explain: '10, 7, 4, 1 are printed. Then i becomes -2 and `-2 > 0` is false: `10 7 4 1 `.' },
    { id: 'while-loop-q3', kind: 'trace', mode: 'vars', vars: ['i', 'sum'], prompt: 'Sum of the even numbers 2 + 4 + 6. Dry run it.', code: prog(cpp`
    int i = 2, sum = 0;
    while (i <= 6) {
        sum += i;
        i += 2;
    }
    cout << sum;`), hints: ['The check happens before each round: 2 <= 6, 4 <= 6, 6 <= 6, 8 <= 6.'], explain: 'sum: 2 → 6 → 12. i: 4 → 6 → 8. Three rounds, four checks. Prints `12`.' },
    { id: 'while-loop-q4', kind: 'bug', tag: 'tricky', prompt: 'It should print `1 2 3 4 5` but prints only `1 2 3 4`. Find the line.', code: prog(cpp`
    int i = 1;
    while (i < 5) {
        cout << i << " ";
        i++;
    }`), bugLine: 6, options: ['Use `i <= 5` (or `i < 6`) in the condition', 'Start with `i = 0`', 'Use `i--` instead of `i++`', 'Move `i++` above the cout'], answer: 0, fixed: prog(cpp`
    int i = 1;
    while (i <= 5) {
        cout << i << " ";
        i++;
    }`), hints: ['What is i on the round that should print 5?', 'Is `5 < 5` true?'], explain: 'An **off-by-one** error: `5 < 5` is false, so the round for 5 never happens. Starting at 0 would print `0 1 2 3 4`, and moving `i++` up would print `2 3 4 5`.' },
    { id: 'while-loop-q5', kind: 'blanks', tag: 'real life', prompt: 'A teacher types marks one by one and types `-1` when finished. Count how many marks were entered. Input `70 85 40 -1` → `3`.', code: prog(cpp`
    int m, count = 0;
    cin >> m;
    while (m [[1]] -1) {
        count++;
        cin >> [[2]];
    }
    cout << count;`), blanks: [{ answers: ['!='] }, { answers: ['m'] }], chips: ['!=', '==', '<', 'm', 'count'], input: '70 85 40 -1\n', output: '3', hints: ['Keep going while the mark is NOT the sentinel.', 'At the end of each round, read the next mark into the same box.'], explain: '`-1` is the sentinel. Reading again at the end of the body is what moves the loop forward — it is the "update" of a sentinel loop.' },
    { id: 'while-loop-q6', kind: 'mcq', tag: 'tricky', prompt: 'Which loop NEVER stops?', options: ['`int i = 1; while (i <= 5) { cout << i; }`', '`int i = 1; while (i <= 5) { cout << i; i++; }`', '`int i = 5; while (i > 0) { cout << i; i--; }`', '`int i = 9; while (i < 5) { cout << i; }`'], answer: 0, hints: ['Look for a loop where the condition is true AND nothing changes i.'], explain: 'In the first loop i stays 1, so `1 <= 5` is true forever. The last one looks dangerous too, but `9 < 5` is false at the start, so its body runs 0 times.' },
    { id: 'while-loop-q7', kind: 'mcq', prompt: 'How many times is `Hello` printed?', code: prog(cpp`
    int n = 10;
    while (n < 5) {
        cout << "Hello" << endl;
        n++;
    }
    cout << "End";`), options: ['0', '1', '5', '10'], answer: 0, hints: ['Check the condition before the first round.'], explain: '`10 < 5` is false immediately, so the body is skipped. A while loop checks first — it can run zero times. Only `End` is printed.' },
    { id: 'while-loop-q8', kind: 'parsons', prompt: 'Build a countdown that prints `3 2 1 Go!`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int n = 3;', '    while (n >= 1) {', '        cout << n << " ";', '        n--;', '    }', '    cout << "Go!";', '    return 0;', '}'], distractors: ['        n++;', '    while (n >= 0) {'], hints: ['Counting down means the update is `n--`.', '`n >= 0` would also print 0.'], explain: 'Start 3, check `n >= 1`, print, then `n--`. After 1 is printed, n becomes 0 and the loop ends.' },
  ],
  cheatsheet: [
    { code: 'while (cond) { … }', text: 'check first; repeat while true; may run 0 times' },
    { code: 'start · check · update', text: 'the three jobs of every counting loop' },
    { code: 'i from a to b, i <= b, i++', text: 'runs b − a + 1 times; the check runs once more' },
    { code: 'cin >> x; while (x != 0) { …; cin >> x; }', text: 'sentinel loop: read before, read again at the end' },
  ],
};

// ------------------------------------------------------------------ Level 27: for
const LFor: Level = {
  id: 'for-loop',
  kind: 'lesson',
  title: 'for: the counting loop',
  tagline: 'When you know how many rounds you need, `for` packs the start, the check and the update into one line.',
  minutes: 25,
  objectives: [
    'Name the three parts of a `for` header and the order they run in',
    'Predict the number of rounds for `<`, `<=`, steps of 2 and counting down',
    'Know that a loop variable declared in the header only exists inside the loop',
  ],
  learn: [
    { t: 'p', text: 'A `while` loop spreads its three jobs over three lines. A `for` loop writes them together in the header, so you can see at a glance where the counter starts, where it stops and how it moves.' },
    { t: 'syntax', title: 'The for loop', code: 'for (int i = 1; i <= 5; i++) {\n    cout << i << " ";\n}', parts: [
      { token: 'int i = 1', text: '**setup**: runs ONCE, before everything else' },
      { token: 'i <= 5', text: '**check**: asked before EVERY round. False → leave the loop' },
      { token: 'i++', text: '**update**: runs at the END of every round, then the check comes again' },
      { token: '{ … }', text: 'the **body**' },
    ] },
    { t: 'list', ordered: true, items: [
      'Setup: `int i = 1`',
      'Check `i <= 5` → true → run the body',
      'Update `i++` → back to the check',
      '… repeat 2 and 3 …',
      'Check is false → jump to the first line after the loop',
    ] },
    { t: 'viz', title: 'The table of 3', code: prog(cpp`
    for (int i = 1; i <= 4; i++) {
        cout << "3 x " << i << " = " << 3 * i << endl;
    }
    cout << "End of table" << endl;`) },
    { t: 'h', text: 'All the headers you will meet' },
    { t: 'table', head: ['Header', 'Values of i', 'Rounds'], rows: [
      ['`for (int i = 1; i <= 5; i++)`', '1 2 3 4 5', '5'],
      ['`for (int i = 0; i < 5; i++)`', '0 1 2 3 4', '5'],
      ['`for (int i = 0; i <= 5; i++)`', '0 1 2 3 4 5', '**6**'],
      ['`for (int i = 2; i <= 10; i += 2)`', '2 4 6 8 10', '5'],
      ['`for (int i = 5; i >= 1; i--)`', '5 4 3 2 1', '5'],
      ['`for (int i = 1; i <= 100; i *= 2)`', '1 2 4 8 16 32 64', '7'],
    ] },
    { t: 'callout', tone: 'key', title: 'The iteration-count rule', text: 'Going up by 1: `i = a; i <= b` runs **b − a + 1** times; `i = a; i < b` runs **b − a** times. So `0 … < n` and `1 … <= n` both run exactly **n** times. With a step of `s`, count the values by hand or use (last − first) / s + 1.' },
    { t: 'callout', tone: 'warn', title: 'i lives only inside the loop', text: 'A variable made in the header (`int i = 1`) is created when the loop starts and **destroyed** when it ends. Using `i` after the loop is a compile error. Need it later? Declare it before the loop.' },
    { t: 'compare', items: [
      { title: 'i is gone after the loop', good: false, code: prog(cpp`
    for (int i = 1; i <= 3; i++) {
        cout << i << " ";
    }
    cout << "last: " << i;`), note: "g++: `'i' was not declared in this scope`." },
      { title: 'Declare i before the loop', good: true, code: prog(cpp`
    int i;
    for (i = 1; i <= 3; i++) {
        cout << i << " ";
    }
    cout << "last: " << i;`), note: 'Prints `1 2 3 last: 4` — the loop stopped because i became 4.' },
    ] },
    { t: 'callout', tone: 'warn', title: 'No semicolon after the header', text: '`for (int i = 0; i < 5; i++);` — that `;` is an empty body. The loop spins 5 times doing nothing, and the block under it is NOT part of the loop.' },
  ],
  ways: {
    goal: 'Print the even numbers `2 4 6 8 10 `.',
    items: [
      { title: 'Step by 2', code: prog(cpp`
    for (int i = 2; i <= 10; i += 2) {
        cout << i << " ";
    }`) },
      { title: 'Count 1 to 5, print double', code: prog(cpp`
    for (int i = 1; i <= 5; i++) {
        cout << 2 * i << " ";
    }`), note: 'The counter counts rounds; the value printed is calculated from it.' },
      { title: 'Check every number', code: prog(cpp`
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) {
            cout << i << " ";
        }
    }`), note: '10 rounds instead of 5, but it works for any rule, not just "every second number".' },
      { title: 'The same loop as a while', code: prog(cpp`
    int i = 2;
    while (i <= 10) {
        cout << i << " ";
        i += 2;
    }`), note: 'Same three jobs, spread over three lines.' },
      { title: '`<` and a long update', code: prog(cpp`
    for (int i = 2; i < 11; i = i + 2) {
        cout << i << " ";
    }`) },
    ],
    takeaway: 'Any for loop can be written as a while loop and back. Choose `for` when the number of rounds is known from the start.',
    check: { id: 'for-loop-ways-check', kind: 'mcq', prompt: 'Which loop does NOT print `2 4 6 8 10 `?', options: ['`for (int i = 0; i <= 10; i += 2) cout << i << " ";`', '`for (int i = 2; i <= 10; i += 2) cout << i << " ";`', '`for (int i = 1; i <= 5; i++) cout << 2 * i << " ";`', '`for (int i = 10; i >= 2; i -= 2) cout << 12 - i << " ";`'], answer: 0, hints: ['Look at the first value each loop prints.'], explain: 'Starting at 0 prints `0 2 4 6 8 10 ` — six numbers. The last option counts down, but `12 - i` turns 10, 8, … into 2, 4, ….' },
  },
  watch: [
    { title: 'Counting down', intro: 'Start high, check `>=`, update with `--`.', code: prog(cpp`
    for (int i = 5; i >= 1; i--) {
        cout << i << " ";
    }
    cout << "Lift off!" << endl;`) },
    { title: 'Read n numbers and add them', intro: 'A box made inside the body (`x`) is created fresh in every round.', code: prog(cpp`
    int n, total = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        total += x;
    }
    cout << "Total = " << total << endl;`), input: '3\n40 25 35\n' },
    { title: 'Doubling steps', intro: 'The update can be any change — here `p *= 2`.', code: prog(cpp`
    for (int p = 1; p <= 100; p *= 2) {
        cout << p << " ";
    }`) },
  ],
  think: {
    title: 'A multiplication table',
    problem: 'Read a number n and print its table from 1 to 5, like `7 x 1 = 7`.',
    steps: [
      { text: 'Read n.', lines: [5, 6] },
      { text: 'We need exactly 5 rows, numbered 1 to 5 → a `for` loop with `i` from 1, `i <= 5`, `i++`.', lines: [7] },
      { text: 'In each round print one row using n, i and their product.', lines: [8] },
    ],
    code: prog(cpp`
    int n;
    cin >> n;
    for (int i = 1; i <= 5; i++) {
        cout << n << " x " << i << " = " << n * i << endl;
    }`),
    input: '7\n',
    why: 'The counter `i` does two jobs: it counts the rounds AND it is the number we multiply by.',
    yourTurn: {
      id: 'for-loop-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'Run the same program with the input `9`. Write what every line prints.',
      code: prog(cpp`
    int n;
    cin >> n;
    for (int i = 1; i <= 5; i++) {
        cout << n << " x " << i << " = " << n * i << endl;
    }`),
      input: '9\n',
      given: [0],
      hints: ['Each round prints one full line ending in a newline.'],
      explain: '9 x 1 = 9, 9 x 2 = 18, 9 x 3 = 27, 9 x 4 = 36, 9 x 5 = 45.',
    },
  },
  practice: [
    { id: 'for-loop-q1', kind: 'mcq', prompt: 'How many times does this loop run?', code: prog(cpp`
    for (int i = 0; i <= 10; i++) {
        cout << "*";
    }`), options: ['11', '10', '9', '12'], answer: 0, hints: ['Use the rule b − a + 1 for `<=`.'], explain: 'i takes 0, 1, …, 10: that is 10 − 0 + 1 = **11** values. It prints 11 stars.' },
    { id: 'for-loop-q2', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    for (int i = 1; i <= 20; i *= 3) {
        cout << i << " ";
    }`), hints: ['The update multiplies by 3.', 'Is 27 <= 20?'], explain: 'i goes 1, 3, 9, then 27 which is too big: `1 3 9 `.' },
    { id: 'for-loop-q3', kind: 'trace', mode: 'vars', vars: ['i', 'sum'], prompt: 'Add the odd numbers 1 + 3 + 5. Dry run it.', code: prog(cpp`
    int sum = 0;
    for (int i = 1; i <= 5; i += 2) {
        sum += i;
    }
    cout << sum;`), hints: ['Order in one round: check → body → update.'], explain: 'sum 1 → 4 → 9; i 1 → 3 → 5 → 7. `7 <= 5` is false. Prints `9`.' },
    { id: 'for-loop-q4', kind: 'bug', prompt: 'This does not compile. Find the line and the fix.', code: prog(cpp`
    int sum = 0;
    for (int i = 1; i <= 3; i++) {
        sum += i;
    }
    cout << "Last i: " << i << ", sum: " << sum;`), bugLine: 9, options: ['`i` only exists inside the loop — declare `int i;` before the loop', 'Add a `;` after the for header', 'Change `i++` to `++i`', 'sum must be declared inside the loop'], answer: 0, fixed: prog(cpp`
    int sum = 0;
    int i;
    for (i = 1; i <= 3; i++) {
        sum += i;
    }
    cout << "Last i: " << i << ", sum: " << sum;`), hints: ['Where was i created? Where is it used?'], explain: 'The `i` made in the header is destroyed when the loop ends. Declared before the loop, it survives and holds 4 (the value that made the check false).' },
    { id: 'for-loop-q5', kind: 'blanks', prompt: 'Complete the loop so it prints `5 4 3 2 1 `.', code: prog(cpp`
    for (int i = [[1]]; i [[2]] 1; [[3]]) {
        cout << i << " ";
    }`), blanks: [{ answers: ['5'] }, { answers: ['>='] }, { answers: ['i--', '--i', 'i -= 1', 'i = i - 1'] }], chips: ['5', '1', '>=', '<=', 'i--', 'i++'], output: '5 4 3 2 1 ', hints: ['Start at the first number printed.', 'Counting down: keep going while i is at least 1.'], explain: '`for (int i = 5; i >= 1; i--)`. Writing `<=` would make `5 <= 1` false at once — 0 rounds.' },
    { id: 'for-loop-q6', kind: 'mcq', prompt: 'In `for (A; B; C) { D }`, which part runs only once?', options: ['A — the setup', 'B — the check', 'C — the update', 'D — the body'], answer: 0, hints: ['Which part would you not want to repeat every round?'], explain: 'Order: A, then B D C, B D C, … and a final B that is false. So B runs one time more than D and C.' },
    { id: 'for-loop-q7', kind: 'parsons', prompt: 'Build a program that reads n and prints `Sum = ` followed by 1 + 2 + … + n. Input `4` → `Sum = 10`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int n, sum = 0;', '    cin >> n;', '    for (int i = 1; i <= n; i++) {', '        sum += i;', '    }', '    cout << "Sum = " << sum;', '    return 0;', '}'], distractors: ['    for (int i = 1; i < n; i++) {', '        int sum = 0;'], input: '4\n', hints: ['Should n itself be added?', 'Where must sum start at 0 — once, or every round?'], explain: '`i <= n` includes n. `sum` is made once before the loop; making it inside would reset it every round.' },
    { id: 'for-loop-q8', kind: 'mcq', tag: 'real life', prompt: 'A bus has seats numbered 1 to 40. Which loop visits **every** seat exactly once?', options: ['`for (int s = 1; s <= 40; s++)`', '`for (int s = 1; s < 40; s++)`', '`for (int s = 0; s <= 40; s++)`', '`for (int s = 40; s > 1; s--)`'], answer: 0, hints: ['Check the first and the last value of s.'], explain: 'Option 2 misses seat 40, option 3 invents a seat 0, option 4 misses seat 1.' },
  ],
  cheatsheet: [
    { code: 'for (setup; check; update) { body }', text: 'setup once → (check → body → update) … → check false' },
    { code: 'for (int i = 0; i < n; i++)', text: 'n rounds: 0 … n−1' },
    { code: 'for (int i = 1; i <= n; i++)', text: 'n rounds: 1 … n' },
    { code: 'for (int i = …)', text: 'i exists only inside the loop' },
  ],
};

// ------------------------------------------------------------------ Level 28: do-while
const LDo: Level = {
  id: 'do-while',
  kind: 'lesson',
  title: 'do…while: at least once',
  tagline: 'Sometimes you must do the job first and ask questions later — a menu, or asking for input until it is valid. `do…while` checks at the END.',
  minutes: 20,
  objectives: [
    'Write a `do…while` loop (with its semicolon!)',
    'Explain why its body always runs at least once',
    'Use it for menus and for asking again until the input is valid',
  ],
  learn: [
    { t: 'p', text: 'A shopkeeper shows you the menu first and *then* asks "anything else?". The menu is shown at least once, no matter what. That is a `do…while`: do the body, then check.' },
    { t: 'syntax', title: 'The do…while loop', code: 'do {\n    cin >> marks;\n} while (marks < 0 || marks > 100);', parts: [
      { token: 'do', text: 'start the body straight away — no check yet' },
      { token: '{ … }', text: 'the body: always runs at least once' },
      { token: 'while (…)', text: 'the check, AFTER the body. True → go back to `do`' },
      { token: ';', text: 'a do…while ends with a semicolon — forgetting it is a compile error' },
    ] },
    { t: 'viz', title: 'Ask again until the marks are valid', code: prog(cpp`
    int marks;
    do {
        cout << "Enter marks (0-100): ";
        cin >> marks;
    } while (marks < 0 || marks > 100);
    cout << endl << "Saved: " << marks << endl;`), input: '150\n-5\n87\n' },
    { t: 'callout', tone: 'key', title: 'Why do…while fits here', text: 'We cannot check the marks before the user has typed them. So the body (ask + read) must run first. Then the condition decides: invalid → ask again.' },
    { t: 'compare', items: [
      { title: 'while — check first', code: prog(cpp`
    int n = 10;
    while (n < 5) {
        cout << "while ran ";
        n++;
    }
    cout << "end";`), note: '`10 < 5` is false → body runs **0** times.' },
      { title: 'do…while — check last', code: prog(cpp`
    int n = 10;
    do {
        cout << "do ran ";
        n++;
    } while (n < 5);
    cout << "end";`), note: 'The body runs **once**, then `11 < 5` is false.' },
    ] },
    { t: 'table', head: ['', '`while`', '`do…while`'], rows: [
      ['condition checked', 'before each round', 'after each round'],
      ['fewest rounds', '0', '1'],
      ['ends with `;`', 'no', 'yes: `} while (…);`'],
      ['typical use', 'counting, sentinel lists', 'menus, input validation'],
    ] },
    { t: 'callout', tone: 'warn', title: 'The missing semicolon', text: '`} while (n > 0)` without `;` does not compile: g++ says *expected \';\' before …*. A plain `while` loop must NOT have a `;` after its condition, but a do…while MUST.' },
  ],
  ways: {
    goal: 'Keep reading a PIN until the user types `1234`, then print `Welcome`. Input: `1111 2222 1234`.',
    items: [
      { title: 'do…while', code: prog(cpp`
    int pin;
    do {
        cin >> pin;
    } while (pin != 1234);
    cout << "Welcome";`), input: '1111\n2222\n1234\n', note: 'The shortest version: read, then check.' },
      { title: 'while with a first read', code: prog(cpp`
    int pin;
    cin >> pin;
    while (pin != 1234) {
        cin >> pin;
    }
    cout << "Welcome";`), input: '1111\n2222\n1234\n', note: 'The "read before, read again inside" sentinel pattern. `cin >> pin` is written twice.' },
      { title: 'while with a fake start value', code: prog(cpp`
    int pin = 0;
    while (pin != 1234) {
        cin >> pin;
    }
    cout << "Welcome";`), input: '1111\n2222\n1234\n', note: 'Starting with a wrong value forces the first round. Works, but only if 0 can never be the real PIN.' },
      { title: 'for with cin in the header', code: prog(cpp`
    int pin;
    for (cin >> pin; pin != 1234; cin >> pin) {
    }
    cout << "Welcome";`), input: '1111\n2222\n1234\n', note: 'Legal C++, but hard to read. Prefer do…while.' },
    ],
    takeaway: 'When the body must run at least once, `do…while` says so directly. The other versions need a trick: an extra read or a fake start value.',
    check: { id: 'do-while-ways-check', kind: 'mcq', prompt: 'Which one does NOT compile?', options: ['`do { cin >> pin; } while (pin != 1234)`', '`do { cin >> pin; } while (pin != 1234);`', '`while (pin != 1234) { cin >> pin; }`', '`do cin >> pin; while (pin != 1234);`'], answer: 0, hints: ['Look at the very end of each loop.'], explain: 'A do…while must end with `;`. (The last option is fine: like if, a one-statement body does not need braces.)' },
  },
  watch: [
    { title: 'A menu that repeats until 0', intro: 'The menu is printed at least once. The loop ends when the user picks 0.', code: prog(cpp`
    int choice;
    do {
        cout << "1) Tea  2) Coffee  0) Exit" << endl;
        cin >> choice;
        if (choice == 1) {
            cout << "Tea is ready" << endl;
        } else if (choice == 2) {
            cout << "Coffee is ready" << endl;
        }
    } while (choice != 0);
    cout << "Bye" << endl;`), input: '2\n1\n0\n' },
    { title: 'Counting digits — now 0 has 1 digit', intro: 'The while version said 0 has 0 digits. With do…while the body runs once, so 0 counts as 1 digit.', code: prog(cpp`
    int n, digits = 0;
    cin >> n;
    do {
        n = n / 10;
        digits++;
    } while (n > 0);
    cout << "Digits: " << digits << endl;`), input: '0\n' },
  ],
  think: {
    title: 'Shop bill until 0',
    problem: 'A cashier types item prices one by one. Typing `0` means "no more items". Print the bill. Input `250 120 80 0` → `Bill: Rs 450`.',
    steps: [
      { text: 'A box for the price and a total starting at 0.', lines: [5] },
      { text: 'We must read at least one price before we can check anything → do…while. Read a price.', lines: [6, 7] },
      { text: 'Add it. (Adding the final 0 changes nothing, so no special case is needed.)', lines: [8] },
      { text: 'Repeat while the price was not 0.', lines: [9] },
      { text: 'Print the total.', lines: [10] },
    ],
    code: prog(cpp`
    int price, total = 0;
    do {
        cin >> price;
        total += price;
    } while (price != 0);
    cout << "Bill: Rs " << total << endl;`),
    input: '250 120 80 0\n',
    why: 'The check uses `price`, which only has a value after the first read. Checking at the end is exactly right.',
    yourTurn: {
      id: 'do-while-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['price', 'total'],
      prompt: 'Dry run the bill with the input `40 60 0`.',
      code: prog(cpp`
    int price, total = 0;
    do {
        cin >> price;
        total += price;
    } while (price != 0);
    cout << "Bill: Rs " << total << endl;`),
      input: '40 60 0\n',
      hints: ['The body runs first; the check `price != 0` comes after each add.', 'When 0 is read, total does not change, and the check is false.'],
      explain: 'total 40 → 100 → 100. The last check `0 != 0` is false, so it prints `Bill: Rs 100`.',
    },
  },
  practice: [
    { id: 'do-while-q1', kind: 'mcq', prompt: 'What is the smallest number of times the body of a `do…while` loop can run?', options: ['1', '0', '2', 'it depends on the condition'], answer: 0, hints: ['When is the condition checked for the first time?'], explain: 'The first check happens AFTER the first round, so the body always runs at least once.' },
    { id: 'do-while-q2', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    int n = 5;
    do {
        cout << n << " ";
        n++;
    } while (n < 3);
    cout << "end";`), hints: ['The condition is false from the start — but when is it checked?'], explain: 'The body runs once (`5 `), then `6 < 3` is false: `5 end`.' },
    { id: 'do-while-q3', kind: 'trace', mode: 'vars', vars: ['x'], prompt: 'Dry run it.', code: prog(cpp`
    int x = 1;
    do {
        x = x * 3;
        cout << x << " ";
    } while (x < 20);`), hints: ['Multiply first, print, then check.'], explain: 'x: 3 (3 < 20 true), 9 (true), 27 (27 < 20 false). Output `3 9 27 ` — notice 27 is printed even though it is above 20, because the check comes after.' },
    { id: 'do-while-q4', kind: 'bug', tag: 'real life', prompt: 'An age must be between 0 and 120. Input `150 25` should ask again and save 25, but the program accepts 150. Find the line.', code: prog(cpp`
    int age;
    do {
        cin >> age;
    } while (age < 0 && age > 120);
    cout << "Age: " << age;`), input: '150 25\n', bugLine: 8, options: ['Use `||`: an age is wrong if it is too small OR too big', 'Use `age > 0 && age < 120`', 'Change do…while to while', 'Remove the semicolon'], answer: 0, fixed: prog(cpp`
    int age;
    do {
        cin >> age;
    } while (age < 0 || age > 120);
    cout << "Age: " << age;`), hints: ['Can a number be below 0 AND above 120 at the same time?'], explain: 'With `&&` the condition is never true, so the loop never repeats. "Ask again while the age is invalid" = too small **or** too big.' },
    { id: 'do-while-q5', kind: 'blanks', prompt: 'A tea stall menu: keep taking orders until the customer types 0, then print how many orders there were. Input `1 2 2 0` → `Orders: 3`.', code: prog(cpp`
    int c, orders = 0;
    [[1]] {
        cin >> c;
        if (c != 0) {
            orders++;
        }
    } [[2]] (c != 0)[[3]]
    cout << "Orders: " << orders;`), blanks: [{ answers: ['do'] }, { answers: ['while'] }, { answers: [';'] }], chips: ['do', 'while', 'for', ';', '{'], input: '1 2 2 0\n', output: 'Orders: 3', hints: ['The loop starts with a keyword that has no condition.', 'Remember how a do…while must end.'], explain: '`do { … } while (c != 0);`. The `if` stops the 0 itself from being counted as an order.' },
    { id: 'do-while-q6', kind: 'mcq', prompt: 'Which job is the best fit for a `do…while` loop?', options: ['Show a menu, then repeat until the user chooses Exit', 'Print the numbers 1 to 10', 'Add up the prices in a list that might be empty', 'Count down from 10 to 1'], answer: 0, hints: ['Which job must happen at least once?'], explain: 'The menu must appear at least once. Fixed counts suit `for`; a list that might be empty needs a loop that can run 0 times (`while`).' },
    { id: 'do-while-q7', kind: 'paths', prompt: 'Find an input for every path. The program keeps asking while the number is not positive — so you may type several numbers, e.g. `-3 5`.', code: prog(cpp`
    int n;
    do {
        cin >> n;
        if (n <= 0) {
            cout << "Must be positive! ";
        }
    } while (n <= 0);
    if (n % 2 == 0) {
        cout << "Even";
    } else {
        cout << "Odd";
    }`), paths: [{ label: 'the error message', line: 9 }, { label: '`Even`', line: 13 }, { label: '`Odd`', line: 15 }], start: '4', hints: ['To see the message, the first number must be 0 or negative — and then give a good one.'], explain: '`4` → Even, `7` → Odd, `-3 5` → the message, then Odd. The message path needs two numbers, because the loop will not end on a bad one.' },
  ],
  cheatsheet: [
    { code: 'do { … } while (cond);', text: 'body first, check after; runs at least once' },
    { code: 'do { cin >> x; } while (x < 0 || x > 100);', text: 'ask again until the input is valid' },
    { code: '} while (cond);', text: 'the semicolon is required' },
  ],
};

// ------------------------------------------------------------------ Level 29: patterns
const LPatterns: Level = {
  id: 'loop-patterns',
  kind: 'lesson',
  title: 'Accumulate, count, find',
  tagline: 'Most loop problems are the same few patterns in disguise: add things up, count things, find the biggest or smallest, and take a number apart digit by digit.',
  minutes: 30,
  objectives: [
    'Pick the right start value for a sum, a product, a counter, a max and a min',
    'Compute an average without losing the decimals',
    'Take a number apart with `% 10` and `/ 10` (sum of digits, reverse)',
  ],
  learn: [
    { t: 'p', text: 'A loop visits values one by one. The trick is a box *outside* the loop that remembers what we have seen so far — a running total, a count, or the best value yet.' },
    { t: 'table', head: ['Pattern', 'Box before the loop', 'Inside the loop', 'Example'], rows: [
      ['sum', '`sum = 0`', '`sum += x;`', 'bill total'],
      ['product', '`p = 1`', '`p *= x;`', 'factorial'],
      ['count', '`count = 0`', '`if (rule) count++;`', 'how many passed'],
      ['max', '`mx =` first value', '`if (x > mx) mx = x;`', 'highest marks'],
      ['min', '`mn =` first value', '`if (x < mn) mn = x;`', 'coldest day'],
    ] },
    { t: 'viz', title: 'Total and average of 4 marks', code: prog(cpp`
    int n = 4, total = 0;
    for (int i = 1; i <= n; i++) {
        int m;
        cin >> m;
        total += m;
    }
    double avg = (double)total / n;
    cout << "Total: " << total << ", Average: " << avg << endl;`), input: '70 85 64 91\n' },
    { t: 'callout', tone: 'warn', title: 'Start values matter', text: 'A product must start at **1** — starting at 0 keeps it 0 forever. And `total / n` with two ints throws away the decimals: 310 / 4 is 77, not 77.5. Cast one side: `(double)total / n`.' },
    { t: 'viz', title: 'Max and min of 5 temperatures (Murree in winter)', code: prog(cpp`
    int x, mx, mn;
    cin >> x;
    mx = x;
    mn = x;
    for (int i = 2; i <= 5; i++) {
        cin >> x;
        if (x > mx) mx = x;
        if (x < mn) mn = x;
    }
    cout << "Max: " << mx << ", Min: " << mn << endl;`), input: '-3 -8 -1 -5 -2\n' },
    { t: 'callout', tone: 'key', title: 'Start max/min with the first value', text: 'If `mx` started at 0, every negative temperature would lose to it and the "max" would be 0 — a temperature that never happened. The first real value is always a safe start.' },
    { t: 'h', text: 'Digit by digit' },
    { t: 'table', head: ['Expression', 'n = 1234', 'Meaning'], rows: [
      ['`n % 10`', '4', 'the last digit'],
      ['`n / 10`', '123', 'the number without its last digit'],
      ['`rev * 10 + d`', '43 → 432', 'stick digit d on the right of rev'],
    ] },
    { t: 'viz', title: 'Reverse a number', code: prog(cpp`
    int n = 1234, rev = 0;
    while (n > 0) {
        int d = n % 10;
        rev = rev * 10 + d;
        n = n / 10;
    }
    cout << rev << endl;`) },
  ],
  ways: {
    goal: 'Print the sum 1 + 2 + … + 10, which is `55`.',
    items: [
      { title: 'for, counting up', code: prog(cpp`
    int sum = 0;
    for (int i = 1; i <= 10; i++) {
        sum += i;
    }
    cout << sum;`) },
      { title: 'for, counting down', code: prog(cpp`
    int sum = 0;
    for (int i = 10; i >= 1; i--) {
        sum += i;
    }
    cout << sum;`), note: 'Adding in a different order gives the same total.' },
      { title: 'while', code: prog(cpp`
    int sum = 0, i = 1;
    while (i <= 10) {
        sum = sum + i;
        i++;
    }
    cout << sum;`) },
      { title: 'do…while', code: prog(cpp`
    int sum = 0, i = 1;
    do {
        sum += i;
        i++;
    } while (i <= 10);
    cout << sum;`) },
      { title: 'No loop: the formula', code: prog(cpp`
    int n = 10;
    cout << n * (n + 1) / 2;`), note: 'Young Gauss found it: pair 1+10, 2+9, … → 5 pairs of 11. A good problem solver checks if a loop is even needed!' },
    ],
    takeaway: 'Four loops and a formula, one answer. The loop versions work for any list of numbers; the formula only for 1 … n.',
    check: { id: 'loop-patterns-ways-check', kind: 'mcq', prompt: 'Which one does NOT print 55?', options: ['`int sum = 0; for (int i = 1; i < 10; i++) sum += i; cout << sum;`', '`int sum = 0; for (int i = 0; i <= 10; i++) sum += i; cout << sum;`', '`int sum = 0; for (int i = 10; i > 0; i--) sum += i; cout << sum;`', '`cout << 10 * 11 / 2;`'], answer: 0, hints: ['Which loop forgets a number? Adding 0 does not change a sum.'], explain: '`i < 10` stops before 10, giving 45. Starting at 0 adds an extra 0, which changes nothing.' },
  },
  watch: [
    { title: 'Factorial: a product', intro: '5! = 1 × 2 × 3 × 4 × 5. Factorials grow fast, so we use `long long`.', code: prog(cpp`
    int n;
    cin >> n;
    long long f = 1;
    for (int i = 1; i <= n; i++) {
        f *= i;
    }
    cout << n << "! = " << f << endl;`), input: '5\n' },
    { title: 'Count the even numbers', intro: 'A counter goes up only when the rule is true.', code: prog(cpp`
    int evens = 0;
    for (int i = 1; i <= 6; i++) {
        int x;
        cin >> x;
        if (x % 2 == 0) {
            evens++;
        }
    }
    cout << evens << " even numbers" << endl;`), input: '4 7 10 3 8 1\n' },
    { title: 'Sum of digits', intro: 'Take the last digit, add it, drop it.', code: prog(cpp`
    int n = 4096, sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    cout << "Digit sum: " << sum << endl;`) },
  ],
  think: {
    title: 'Who got the top marks?',
    problem: 'Four students (roll numbers 1–4) type their marks in order. Print the highest marks and the roll number of the student who got them. Input `67 88 75 88` → `Top: roll 2 with 88`.',
    steps: [
      { text: 'Two "best so far" boxes: the best marks and whose they are. Marks are never negative, so -1 is a safe start.', lines: [5] },
      { text: 'Visit roll numbers 1 to 4.', lines: [6] },
      { text: 'Read this student\'s marks.', lines: [7, 8] },
      { text: 'Better than the best so far? Then remember the marks AND the roll number.', lines: [9, 10, 11] },
      { text: 'After the loop, the boxes hold the answer.', lines: [14] },
    ],
    code: prog(cpp`
    int best = -1, bestRoll = 0;
    for (int roll = 1; roll <= 4; roll++) {
        int m;
        cin >> m;
        if (m > best) {
            best = m;
            bestRoll = roll;
        }
    }
    cout << "Top: roll " << bestRoll << " with " << best << endl;`),
    input: '67 88 75 88\n',
    why: 'Roll 4 also has 88, but `88 > 88` is false, so the FIRST top student is kept. With `>=` the last one would win.',
    yourTurn: {
      id: 'loop-patterns-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['roll', 'm', 'best', 'bestRoll'],
      prompt: 'A smaller class: 3 students with marks `45 80 60`. Dry run it.',
      code: prog(cpp`
    int best = -1, bestRoll = 0;
    for (int roll = 1; roll <= 3; roll++) {
        int m;
        cin >> m;
        if (m > best) {
            best = m;
            bestRoll = roll;
        }
    }
    cout << "Top: roll " << bestRoll << " with " << best << endl;`),
      input: '45 80 60\n',
      hints: ['45 > -1, so roll 1 becomes the best first.', '60 > 80 is false — nothing changes for roll 3.'],
      explain: 'best: 45 (roll 1) → 80 (roll 2). Roll 3 does not beat 80. Prints `Top: roll 2 with 80`.',
    },
  },
  practice: [
    { id: 'loop-patterns-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int p = 1;
    for (int i = 2; i <= 8; i += 2) {
        p *= i;
    }
    cout << p;`), hints: ['i takes 2, 4, 6, 8.'], explain: '2 × 4 × 6 × 8 = 384.' },
    { id: 'loop-patterns-q2', kind: 'bug', prompt: 'It should print 5! = 120 but prints 0. Find the line.', code: prog(cpp`
    int f = 0;
    for (int i = 1; i <= 5; i++) {
        f *= i;
    }
    cout << f;`), bugLine: 5, options: ['A product must start at 1: `int f = 1;`', 'Use `i < 5`', 'Use `f += i`', 'Start the loop at `i = 0`'], answer: 0, fixed: prog(cpp`
    int f = 1;
    for (int i = 1; i <= 5; i++) {
        f *= i;
    }
    cout << f;`), hints: ['What is 0 times anything?'], explain: '0 × 1 × 2 × … stays 0. Sums start at 0; products start at 1.' },
    { id: 'loop-patterns-q3', kind: 'trace', mode: 'vars', vars: ['n', 'sum'], prompt: 'Sum of the digits of 507. Dry run it.', code: prog(cpp`
    int n = 507, sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    cout << sum;`), hints: ['507 % 10 is 7, then 507 / 10 is 50.', '50 % 10 is 0 — adding 0 is still a round.'], explain: 'sum 7 → 7 → 12; n 50 → 5 → 0. Prints `12`.' },
    { id: 'loop-patterns-q4', kind: 'blanks', prompt: 'Count how many numbers from 1 to 20 are multiples of 3. The program should print `6`.', code: prog(cpp`
    int count = 0;
    for (int i = 1; i <= 20; i++) {
        if (i [[1]] 3 == 0) {
            [[2]];
        }
    }
    cout << count;`), blanks: [{ answers: ['%'] }, { answers: ['count++', '++count', 'count += 1', 'count = count + 1'] }], chips: ['%', '/', 'count++', 'i++'], output: '6', hints: ['"Multiple of 3" = remainder 0 after dividing by 3.'], explain: '3, 6, 9, 12, 15, 18 → 6. (Shortcut check: 20 / 3 = 6.)' },
    { id: 'loop-patterns-q5', kind: 'bug', tag: 'real life', prompt: 'Three winter temperatures `-4 -9 -2` are entered. The warmest should be -2 but the program prints 0. Find the line.', code: prog(cpp`
    int mx = 0;
    for (int i = 1; i <= 3; i++) {
        int t;
        cin >> t;
        if (t > mx) mx = t;
    }
    cout << "Warmest: " << mx;`), input: '-4 -9 -2\n', bugLine: 5, options: ['0 is warmer than every reading — start mx very low (or with the first reading)', 'Use `t < mx`', 'Declare t outside the loop', 'Use `i < 3`'], answer: 0, fixed: prog(cpp`
    int mx = -1000;
    for (int i = 1; i <= 3; i++) {
        int t;
        cin >> t;
        if (t > mx) mx = t;
    }
    cout << "Warmest: " << mx;`), hints: ['Is -4 > 0?'], explain: 'No reading beats 0, so mx never changes. Start with a value lower than any real reading, or read the first value into mx before the loop.' },
    { id: 'loop-patterns-q6', kind: 'parsons', prompt: 'Build a program that reverses 472 and prints `274`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int n = 472, rev = 0;', '    while (n > 0) {', '        rev = rev * 10 + n % 10;', '        n = n / 10;', '    }', '    cout << rev;', '    return 0;', '}'], distractors: ['        rev = rev + n % 10;', '        n = n % 10;'], hints: ['Shift rev left (× 10) before adding the new digit.', 'Dropping the last digit is `/ 10`.'], explain: 'rev: 2 → 27 → 274 while n: 47 → 4 → 0.' },
    { id: 'loop-patterns-q7', kind: 'mcq', prompt: 'total is an `int` holding 7 and n is an `int` holding 2. Which line prints the average `3.5`?', options: ['`cout << (double)total / n;`', '`cout << total / n;`', '`cout << (double)(total / n);`', '`cout << total / n * 1.0;`'], answer: 0, hints: ['The division itself must be a decimal division.'], explain: 'Only option 1 turns total into a double BEFORE dividing. The others divide 7 / 2 = 3 first and then it is too late.' },
    { id: 'loop-patterns-q8', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    int evens = 0, odds = 0;
    for (int i = 1; i <= 9; i++) {
        if (i % 2 == 0) {
            evens += i;
        } else {
            odds++;
        }
    }
    cout << evens << " " << odds;`), hints: ['evens is a SUM, odds is a COUNT.'], explain: 'evens = 2 + 4 + 6 + 8 = 20; odds counts 1, 3, 5, 7, 9 = 5. Output `20 5`.' },
  ],
  cheatsheet: [
    { code: 'sum = 0; sum += x;', text: 'accumulate' },
    { code: 'p = 1; p *= x;', text: 'product (factorial)' },
    { code: 'if (rule) count++;', text: 'count' },
    { code: 'mx = first; if (x > mx) mx = x;', text: 'find the max (min: use <)' },
  ],
};

// ------------------------------------------------------------------ Level 30: break / continue
const LBreak: Level = {
  id: 'break-continue',
  kind: 'lesson',
  title: 'break and continue',
  tagline: '`break` leaves the loop right now. `continue` skips the rest of this round and goes on with the next one.',
  minutes: 20,
  objectives: [
    'Stop a search at the first match with `break`',
    'Skip values you do not want with `continue`',
    'Write a prime check that stops as soon as a divisor is found',
  ],
  learn: [
    { t: 'p', text: 'Looking for your keys in 10 drawers: when you find them in drawer 3, you **stop** — that is `break`. Listening to a playlist and skipping a song you do not like, then going on to the next — that is `continue`.' },
    { t: 'viz', title: 'break: the first multiple of 7 from 50', code: prog(cpp`
    for (int n = 50; n <= 60; n++) {
        if (n % 7 == 0) {
            cout << "Found: " << n << endl;
            break;
        }
    }
    cout << "After the loop" << endl;`) },
    { t: 'callout', tone: 'key', title: 'break', text: 'The loop ends immediately — the update and the check are NOT done again. Execution jumps to the first line after the loop. Here the loop could run 11 times but stops after 7.' },
    { t: 'viz', title: 'continue: skip the multiples of 3', code: prog(cpp`
    for (int i = 1; i <= 7; i++) {
        if (i % 3 == 0) {
            continue;
        }
        cout << i << " ";
    }`) },
    { t: 'callout', tone: 'key', title: 'continue', text: 'The rest of the body is skipped for this round only. In a `for` loop the update (`i++`) still runs, then the check.' },
    { t: 'table', head: ['', '`break`', '`continue`'], rows: [
      ['rest of this round', 'skipped', 'skipped'],
      ['next rounds', 'none — the loop is over', 'yes, the loop goes on'],
      ['typical use', 'stop at the first match', 'ignore bad or unwanted values'],
    ] },
    { t: 'callout', tone: 'warn', title: 'continue in a while loop', text: 'In a `while` loop the update is just a line in the body. If `continue` jumps over it, the counter never changes → infinite loop. Put the update BEFORE the continue, or use a `for` loop.' },
    { t: 'compare', items: [
      { title: 'continue skips i++', good: false, code: 'int i = 0;\nwhile (i < 5) {\n    if (i == 2) continue;\n    cout << i;\n    i++;\n}', note: 'Prints `01`, then i is stuck at 2 forever.' },
      { title: 'Update first', good: true, code: 'int i = 0;\nwhile (i < 5) {\n    i++;\n    if (i == 3) continue;\n    cout << i;\n}', note: 'Prints `1245` and stops.' },
    ] },
    { t: 'callout', tone: 'info', title: 'Only the innermost loop', text: 'With a loop inside a loop (next level), `break` leaves only the loop it sits in.' },
  ],
  ways: {
    goal: 'Find the first number from 1 upwards that is divisible by both 4 and 6. Print `12`.',
    items: [
      { title: 'for + break', code: prog(cpp`
    for (int n = 1; n <= 100; n++) {
        if (n % 4 == 0 && n % 6 == 0) {
            cout << n;
            break;
        }
    }`) },
      { title: 'Keep n after the loop', code: prog(cpp`
    int n;
    for (n = 1; n <= 100; n++) {
        if (n % 4 == 0 && n % 6 == 0) {
            break;
        }
    }
    cout << n;`), note: 'After break, n still holds the value that matched.' },
      { title: 'A found flag', code: prog(cpp`
    int n = 0;
    bool found = false;
    while (!found) {
        n++;
        if (n % 4 == 0 && n % 6 == 0) {
            found = true;
        }
    }
    cout << n;`), note: 'No break: the condition itself says when to stop.' },
      { title: 'Put the search in the condition', code: prog(cpp`
    int n = 1;
    while (n % 4 != 0 || n % 6 != 0) {
        n++;
    }
    cout << n;`), note: '"Keep going while it is NOT a match." De Morgan turns `!(a && b)` into `!a || !b`.' },
    ],
    takeaway: '`break` is one tool for stopping early. A flag or a smarter condition does the same job.',
    check: { id: 'break-continue-ways-check', kind: 'mcq', prompt: 'What does this print? `for (int n = 1; n <= 30; n++) { if (n % 4 == 0 && n % 6 == 0) { cout << n << " "; } }`', options: ['`12 24 `', '`12 `', '`24 `', 'nothing'], answer: 0, hints: ['Is there a break?'], explain: 'Without `break` the loop does not stop at the first match, so it prints every match up to 30.' },
  },
  watch: [
    { title: 'Three tries for the PIN', intro: 'break as soon as the PIN is right; otherwise the loop ends after 3 tries.', code: prog(cpp`
    int pin;
    bool ok = false;
    for (int attempt = 1; attempt <= 3; attempt++) {
        cin >> pin;
        if (pin == 4321) {
            ok = true;
            break;
        }
        cout << "Wrong PIN" << endl;
    }
    cout << (ok ? "Welcome" : "Card blocked") << endl;`), input: '1111\n4321\n' },
    { title: 'Add the positives, stop at 0', intro: '`while (true)` runs forever — only the break can end it. continue skips negative numbers.', code: prog(cpp`
    int x, sum = 0;
    while (true) {
        cin >> x;
        if (x == 0) {
            break;
        }
        if (x < 0) {
            continue;
        }
        sum += x;
    }
    cout << "Sum of positives: " << sum << endl;`), input: '5 -2 8 -1 3 0\n' },
  ],
  think: {
    title: 'Is it prime?',
    problem: 'Read a whole number n. Print whether it is prime (only divisible by 1 and itself). Input `29` → `29 is prime`.',
    steps: [
      { text: 'Read n.', lines: [5, 6] },
      { text: 'Assume it is prime (numbers below 2 are not).', lines: [7] },
      { text: 'Try every possible divisor d from 2. We only need d × d ≤ n: if n = a × b, one of a and b is at most √n.', lines: [8] },
      { text: 'If d divides n, it is not prime — and there is no reason to test more divisors → break.', lines: [9, 10, 11] },
      { text: 'After the loop, print the answer.', lines: [14, 15, 16, 17] },
    ],
    code: prog(cpp`
    int n;
    cin >> n;
    bool prime = n > 1;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            prime = false;
            break;
        }
    }
    if (prime) {
        cout << n << " is prime" << endl;
    } else {
        cout << n << " is not prime" << endl;
    }`),
    input: '29\n',
    why: 'For 29 we test only d = 2, 3, 4, 5 (6 × 6 = 36 > 29): 4 checks instead of 27. For 1 000 003 it is about 1000 checks instead of a million.',
    yourTurn: {
      id: 'break-continue-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['d', 'prime'],
      prompt: 'Dry run the prime check with `35`.',
      code: prog(cpp`
    int n;
    cin >> n;
    bool prime = n > 1;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            prime = false;
            break;
        }
    }
    if (prime) {
        cout << n << " is prime" << endl;
    } else {
        cout << n << " is not prime" << endl;
    }`),
      input: '35\n',
      hints: ['35 % 2, 35 % 3, 35 % 4 are not 0.', 'At d = 5 the remainder is 0 → break. d is never 6.'],
      explain: 'd goes 2, 3, 4, 5. At 5 prime becomes false and break ends the loop at once. Prints `35 is not prime`.',
    },
  },
  practice: [
    { id: 'break-continue-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    for (int i = 1; i <= 10; i++) {
        if (i == 5) {
            break;
        }
        cout << i;
    }`), hints: ['When i is 5, is the cout reached?'], explain: '1, 2, 3, 4 are printed; at 5 the loop ends before printing: `1234`.' },
    { id: 'break-continue-q2', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    for (int i = 1; i <= 6; i++) {
        if (i % 2 == 0) {
            continue;
        }
        cout << i;
    }`), hints: ['Even numbers skip the cout.'], explain: 'Only the odd numbers reach the cout: `135`.' },
    { id: 'break-continue-q3', kind: 'mcq', prompt: 'How many numbers does this print?', code: prog(cpp`
    for (int i = 1; i <= 100; i++) {
        if (i * i > 30) {
            break;
        }
        cout << i << " ";
    }`), options: ['5', '6', '30', '100'], answer: 0, hints: ['5 × 5 = 25, 6 × 6 = 36.'], explain: 'i = 1 … 5 have squares ≤ 30. At i = 6, 36 > 30 → break before printing. Output `1 2 3 4 5 `.' },
    { id: 'break-continue-q4', kind: 'trace', mode: 'vars', vars: ['i', 'sum'], prompt: 'Add 1 … 6, skipping multiples of 3. Dry run it.', code: prog(cpp`
    int sum = 0;
    for (int i = 1; i <= 6; i++) {
        if (i % 3 == 0) {
            continue;
        }
        sum += i;
    }
    cout << sum;`), hints: ['For i = 3 and 6 the add is skipped, but i++ still happens.'], explain: 'sum 1 → 3 → 7 → 12 (3 and 6 skipped). Prints `12`.' },
    { id: 'break-continue-q5', kind: 'bug', tag: 'real life', prompt: 'A sensor sends 5 readings. Print the readings up to the first negative one (an error), then stop. Input `4 9 -1 7 2` should print `4 9 ` but prints `4 9 7 2 `. Find the line.', code: prog(cpp`
    for (int i = 1; i <= 5; i++) {
        int x;
        cin >> x;
        if (x < 0) {
            continue;
        }
        cout << x << " ";
    }`), input: '4 9 -1 7 2\n', bugLine: 10, options: ['Use `break` — continue only skips this reading', 'Use `x <= 0`', 'Move `cout` above the if', 'Use `i < 5`'], answer: 0, fixed: prog(cpp`
    for (int i = 1; i <= 5; i++) {
        int x;
        cin >> x;
        if (x < 0) {
            break;
        }
        cout << x << " ";
    }`), hints: ['"Then stop" — which keyword stops the whole loop?'], explain: '`continue` skips the -1 but carries on with 7 and 2. `break` ends the loop at the first negative.' },
    { id: 'break-continue-q6', kind: 'blanks', prompt: 'Complete the prime check. Input `21` → `not prime`.', code: prog(cpp`
    int n;
    cin >> n;
    bool prime = n > 1;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            prime = [[1]];
            [[2]];
        }
    }
    cout << (prime ? "prime" : "not prime");`), blanks: [{ answers: ['false'] }, { answers: ['break'] }], chips: ['true', 'false', 'break', 'continue'], input: '21\n', output: 'not prime', hints: ['Finding a divisor proves it is NOT prime.', 'One divisor is enough — stop searching.'], explain: '21 % 3 == 0 → prime = false; break. (`continue` would also give the right answer here, just with extra useless checks.)' },
    { id: 'break-continue-q7', kind: 'mcq', tag: 'tricky', prompt: 'What happens when this runs?', code: 'int i = 0;\nwhile (i < 5) {\n    if (i == 2) continue;\n    cout << i;\n    i++;\n}', options: ['It prints `01` and then never stops', 'It prints `0134`', 'It prints `01234`', 'It does not compile'], answer: 0, hints: ['When i is 2, is `i++` reached?'], explain: 'At i = 2 the continue jumps back to the check, skipping `i++`. i stays 2 forever — an infinite loop.' },
    { id: 'break-continue-q8', kind: 'paths', tag: 'tricky', prompt: 'Find an input for every path of the prime check.', code: prog(cpp`
    int n;
    cin >> n;
    bool prime = n > 1;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            prime = false;
            break;
        }
    }
    if (prime) {
        cout << "prime";
    } else {
        cout << "not prime";
    }`), paths: [{ label: 'the `break` runs', line: 11 }, { label: '`prime`', line: 15 }, { label: '`not prime`', line: 17 }], start: '7', hints: ['A prime never reaches the break.', 'Can a number be "not prime" without the loop ever finding a divisor?'], explain: '`7` → prime. `9` → the break runs (d = 3) and it is not prime. The not-prime line is also reached by `1` or `0`: `n > 1` is false and the loop never even starts.' },
  ],
  cheatsheet: [
    { code: 'break;', text: 'leave the loop now' },
    { code: 'continue;', text: 'skip the rest of this round' },
    { code: 'for (d = 2; d * d <= n; d++)', text: 'try divisors up to √n' },
    { code: 'while (true) { … if (done) break; }', text: 'a loop that only break can end' },
  ],
};

// ------------------------------------------------------------------ Level 31: nested
const LNested: Level = {
  id: 'nested-loops',
  kind: 'lesson',
  title: 'Nested loops and patterns',
  tagline: 'A loop inside a loop: for every round of the outer loop, the inner loop runs completely. Rows and columns, tables and star patterns.',
  minutes: 30,
  objectives: [
    'Trace a loop inside a loop and say which variable changes fastest',
    'Print rectangles, triangles and multiplication tables',
    'Count how often the inner body runs: rows × cols, or 1 + 2 + … + n',
  ],
  learn: [
    { t: 'p', text: 'A clock: for every **one** round of the hour hand, the minute hand goes round **60** times. The outer loop is the slow hand; the inner loop is the fast hand.' },
    { t: 'viz', title: '3 rows of 4 stars', code: prog(cpp`
    for (int row = 1; row <= 3; row++) {
        for (int col = 1; col <= 4; col++) {
            cout << "*";
        }
        cout << endl;
    }`) },
    { t: 'callout', tone: 'key', title: 'Inner loop runs completely, every time', text: 'Round 1 of the outer loop: col goes 1, 2, 3, 4. Round 2: col starts at 1 again. So the star line runs **3 × 4 = 12** times. The `endl` sits after the inner loop — once per row.' },
    { t: 'h', text: 'Triangles: the inner loop depends on the outer one' },
    { t: 'viz', title: 'A right triangle', code: prog(cpp`
    for (int i = 1; i <= 4; i++) {
        for (int j = 1; j <= i; j++) {
            cout << "*";
        }
        cout << endl;
    }`) },
    { t: 'table', head: ['Inner loop', 'Inner body runs', 'For n = 4'], rows: [
      ['`for (j = 1; j <= m; j++)`', 'n × m', '4 × m'],
      ['`for (j = 1; j <= i; j++)`', '1 + 2 + … + n = n(n+1)/2', '10'],
      ['`for (j = 1; j < i; j++)`', '0 + 1 + … + (n−1) = n(n−1)/2', '6'],
      ['`for (j = i; j <= n; j++)`', 'n + (n−1) + … + 1', '10'],
    ] },
    { t: 'callout', tone: 'warn', title: 'Two common mistakes', text: 'Use a **different** variable for each loop (i and j). And put `endl` in the right place: inside the inner loop puts every star on its own line.' },
    { t: 'viz', title: 'A small multiplication table', code: prog(cpp`
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 4; j++) {
            cout << setw(4) << i * j;
        }
        cout << endl;
    }`, IOM) },
  ],
  ways: {
    goal: 'Print 3 rows of 4 stars — the line `****` three times.',
    items: [
      { title: 'Two for loops', code: prog(cpp`
    for (int r = 1; r <= 3; r++) {
        for (int c = 1; c <= 4; c++) {
            cout << "*";
        }
        cout << endl;
    }`) },
      { title: 'One loop, whole row at once', code: prog(cpp`
    for (int r = 1; r <= 3; r++) {
        cout << "****" << endl;
    }`), note: 'Fine when the row never changes. A nested loop is needed when the width depends on the row.' },
      { title: 'Two while loops', code: prog(cpp`
    int r = 1;
    while (r <= 3) {
        int c = 1;
        while (c <= 4) {
            cout << "*";
            c++;
        }
        cout << endl;
        r++;
    }`), note: '`c` must be reset to 1 at the start of every row — the for loop does this for you.' },
      { title: 'One loop over all 12 stars', code: prog(cpp`
    for (int k = 1; k <= 12; k++) {
        cout << "*";
        if (k % 4 == 0) {
            cout << endl;
        }
    }`), note: 'After every 4th star, start a new line.' },
    ],
    takeaway: 'Rows × columns is the heart of it. Nested for loops say that most clearly.',
    check: { id: 'nested-loops-ways-check', kind: 'mcq', prompt: 'In the two-while version, what goes wrong if `int c = 1;` is moved ABOVE the outer loop?', options: ['Only the first row gets stars; c stays 5 after it', 'Every row gets 12 stars', 'It does not compile', 'Nothing changes'], answer: 0, hints: ['After the first row, what is c? Is it ever reset?'], explain: 'c is never set back to 1, so for rows 2 and 3 `5 <= 4` is false at once. The output is `****` and two empty lines.' },
  },
  watch: [
    { title: 'Number triangle', intro: 'Print j instead of a star.', code: prog(cpp`
    for (int i = 1; i <= 4; i++) {
        for (int j = 1; j <= i; j++) {
            cout << j << " ";
        }
        cout << endl;
    }`) },
    { title: 'A pyramid: spaces, then stars', intro: 'Two inner loops one after another: first the spaces, then the stars.', code: prog(cpp`
    int n = 4;
    for (int i = 1; i <= n; i++) {
        for (int s = 1; s <= n - i; s++) {
            cout << " ";
        }
        for (int j = 1; j <= 2 * i - 1; j++) {
            cout << "*";
        }
        cout << endl;
    }`) },
  ],
  think: {
    title: 'Cinema seat labels',
    problem: 'A small cinema has rows A, B, C and seats 1 to 4 in each row. Print every seat label, one row per line: `A1 A2 A3 A4`, … How many labels will there be?',
    steps: [
      { text: 'Rows are letters. A `char` can count too: `\'A\'`, `\'B\'`, `\'C\'` (r++ moves to the next letter).', lines: [5] },
      { text: 'For every row, visit seats 1 to 4.', lines: [6] },
      { text: 'Print the row letter and the seat number together.', lines: [7] },
      { text: 'After a row\'s seats are done, start a new line.', lines: [9] },
    ],
    code: prog(cpp`
    for (char r = 'A'; r <= 'C'; r++) {
        for (int s = 1; s <= 4; s++) {
            cout << r << s << " ";
        }
        cout << endl;
    }`),
    why: '3 rows × 4 seats = **12** labels. The seat number changes fastest because it belongs to the inner loop.',
    yourTurn: {
      id: 'nested-loops-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'A smaller hall: rows A and B, seats 1 to 3. Write what every line prints.',
      code: prog(cpp`
    for (char r = 'A'; r <= 'B'; r++) {
        for (int s = 1; s <= 3; s++) {
            cout << r << s << " ";
        }
        cout << endl;
    }`),
      given: [0],
      hints: ['The inner loop finishes all 3 seats before r moves to B.', 'The endl line prints a newline once per row.'],
      explain: '`A1 A2 A3` then a newline, then `B1 B2 B3` and a newline: 2 × 3 = 6 labels.',
    },
  },
  practice: [
    { id: 'nested-loops-q1', kind: 'mcq', prompt: 'How many stars are printed?', code: prog(cpp`
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= 3; j++) {
            cout << "*";
        }
    }`), options: ['15', '8', '5', '3'], answer: 0, hints: ['Outer rounds × inner rounds.'], explain: '5 × 3 = 15.' },
    { id: 'nested-loops-q2', kind: 'mcq', prompt: 'How many stars are printed?', code: prog(cpp`
    for (int i = 1; i <= 6; i++) {
        for (int j = 1; j <= i; j++) {
            cout << "*";
        }
    }`), options: ['21', '36', '6', '15'], answer: 0, hints: ['Row i has i stars: 1 + 2 + … + 6.'], explain: '1 + 2 + 3 + 4 + 5 + 6 = 6 × 7 / 2 = 21.' },
    { id: 'nested-loops-q3', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= i; j++) {
            cout << j;
        }
        cout << " ";
    }`), hints: ['Row i prints 1 up to i, then a space.'], explain: '`1 12 123 `.' },
    { id: 'nested-loops-q4', kind: 'trace', mode: 'vars', vars: ['i', 'j'], prompt: 'Dry run the 2 × 2 table.', code: prog(cpp`
    for (int i = 1; i <= 2; i++) {
        for (int j = 1; j <= 2; j++) {
            cout << i * j << " ";
        }
    }`), hints: ['j starts again at 1 when i becomes 2.', 'There is an inner check that fails (j = 3) for EACH outer round.'], explain: 'Pairs (1,1) (1,2) (2,1) (2,2) → `1 2 2 4 `.' },
    { id: 'nested-loops-q5', kind: 'bug', prompt: 'It should print 2 rows of 3 stars, but every star is on its own line. Find the line.', code: prog(cpp`
    for (int r = 1; r <= 2; r++) {
        for (int c = 1; c <= 3; c++) {
            cout << "*" << endl;
        }
    }`), bugLine: 7, options: ['Remove `endl` here and print it after the inner loop', 'Change `c <= 3` to `c < 3`', 'Use the same variable for both loops', 'Swap the two loops'], answer: 0, fixed: prog(cpp`
    for (int r = 1; r <= 2; r++) {
        for (int c = 1; c <= 3; c++) {
            cout << "*";
        }
        cout << endl;
    }`), hints: ['How many times does line 7 run? How many newlines do we want?'], explain: 'Line 7 runs 6 times, so it prints 6 newlines. We want one newline per ROW, i.e. in the outer loop after the inner one.' },
    { id: 'nested-loops-q6', kind: 'blanks', prompt: 'Complete the triangle. It should print 3 lines: `*`, then `**`, then `***`.', code: prog(cpp`
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j [[1]] i; j++) {
            cout << "*";
        }
        cout << [[2]];
    }`), blanks: [{ answers: ['<='] }, { answers: ['endl', '"\\n"', "'\\n'"] }], chips: ['<=', '<', 'endl', '" "'], output: '*\n**\n***\n', hints: ['Row i needs i stars.', 'Each row ends with a new line.'], explain: '`j <= i` gives 1, 2, 3 stars. With `j < i` the first row would be empty.' },
    { id: 'nested-loops-q7', kind: 'parsons', prompt: 'Build the 3 × 3 multiplication table: `1 2 3`, `2 4 6`, `3 6 9`, one row per line (each number followed by a space).', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    for (int i = 1; i <= 3; i++) {', '        for (int j = 1; j <= 3; j++) {', '            cout << i * j << " ";', '        }', '        cout << endl;', '    }', '    return 0;', '}'], distractors: ['        for (int i = 1; i <= 3; i++) {', '            cout << i + j << " ";'], hints: ['The inner loop needs its own variable.', 'The endl belongs to the outer loop.'], explain: 'Outer i picks the row, inner j the column, and each cell is i × j.' },
    { id: 'nested-loops-q8', kind: 'predict', tag: 'tricky', prompt: 'Predict the output. (Which loop does the break leave?)', code: prog(cpp`
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            if (j == 2) {
                break;
            }
            cout << i << j << " ";
        }
    }`), hints: ['break leaves only the inner loop. The outer loop carries on.'], explain: 'For each i, only j = 1 prints before the inner break: `11 21 31 `.' },
  ],
  cheatsheet: [
    { code: 'for (i …) { for (j …) { … } }', text: 'the inner loop runs completely for every outer round' },
    { code: 'rows × cols', text: 'inner body count for a rectangle' },
    { code: 'j <= i', text: 'triangle: 1 + 2 + … + n = n(n+1)/2' },
    { code: 'cout << endl;', text: 'after the inner loop, once per row' },
  ],
};

// ------------------------------------------------------------------ Level 32: counting ways
const LWays: Level = {
  id: 'counting-ways',
  kind: 'lesson',
  title: 'How many ways? Counting with loops',
  tagline: 'Try every possibility with loops and count the ones that work. Always guess the answer first — then let the computer check you.',
  minutes: 30,
  objectives: [
    'Turn a "how many ways" question into loops, a condition and a counter',
    'Choose loop ranges so every possibility is tried exactly once',
    'Avoid double counting (Ali–Sara is the same handshake as Sara–Ali)',
  ],
  learn: [
    { t: 'p', text: 'Maths class has clever formulas for counting. A programmer has a simpler, very powerful tool: **try them all**. A computer does not get tired of checking 36 or 1000 possibilities. This is called *brute force*.' },
    { t: 'list', ordered: true, items: [
      '**Choices**: what can change? Each choice becomes a loop variable.',
      '**Ranges**: what values can each choice take? These are the loop bounds.',
      '**Rule**: when does a combination count as a valid way? That is the `if`.',
      '**Count**: `ways++` inside the if.',
    ] },
    { t: 'callout', tone: 'tip', title: 'Predict first', text: 'Two dice: how many ways can they add up to 7? Make a guess *before* you step through the dry run below.' },
    { t: 'viz', title: 'Two dice that add up to 7', code: prog(cpp`
    int ways = 0;
    for (int a = 1; a <= 6; a++) {
        for (int b = 1; b <= 6; b++) {
            if (a + b == 7) {
                cout << a << "+" << b << " ";
                ways++;
            }
        }
    }
    cout << endl << "Ways: " << ways << endl;`) },
    { t: 'callout', tone: 'key', title: '36 tries, 6 ways', text: 'The loops try all 6 × 6 = 36 pairs. `1+6` and `6+1` are both counted because the dice are different (a red one and a blue one).' },
    { t: 'viz', title: 'Rs 50 from Rs 10 and Rs 20 notes', code: prog(cpp`
    int ways = 0;
    for (int t = 0; t <= 2; t++) {
        for (int k = 0; k <= 5; k++) {
            if (20 * t + 10 * k == 50) {
                cout << t << " x Rs20 + " << k << " x Rs10" << endl;
                ways++;
            }
        }
    }
    cout << "Ways: " << ways << endl;`) },
    { t: 'callout', tone: 'tip', title: 'Smart ranges', text: 'More than 2 twenties is already over 50, and more than 5 tens too — so the loops stop there. Even smarter: once you choose t, the tens are forced (`(50 - 20 * t) / 10`), so one loop is enough.' },
    { t: 'h', text: 'Pairs without double counting' },
    { t: 'table', head: ['Inner loop for people i and j (n people)', 'What it counts', 'n = 4'], rows: [
      ['`for (j = 1; j <= n; j++)`', 'every ordered pair, even i with itself: n × n', '16'],
      ['`… if (i != j)`', 'ordered pairs of different people: n × (n−1)', '12'],
      ['`for (j = i + 1; j <= n; j++)`', 'each pair once: n × (n−1) / 2', '**6**'],
    ] },
    { t: 'callout', tone: 'warn', title: 'Handshakes', text: 'When Ali shakes hands with Sara, Sara has also shaken hands with Ali — it is **one** handshake. Start the inner loop at `i + 1` so each pair is counted once.' },
  ],
  ways: {
    goal: 'How many numbers from 1 to 100 are divisible by 3 or by 5? (Guess first!) Answer: `47`.',
    items: [
      { title: 'Loop and ||', code: prog(cpp`
    int count = 0;
    for (int i = 1; i <= 100; i++) {
        if (i % 3 == 0 || i % 5 == 0) {
            count++;
        }
    }
    cout << count;`) },
      { title: 'while loop', code: prog(cpp`
    int count = 0, i = 1;
    while (i <= 100) {
        if (i % 3 == 0 || i % 5 == 0) count++;
        i++;
    }
    cout << count;`) },
      { title: 'Skip the others with continue', code: prog(cpp`
    int count = 0;
    for (int i = 1; i <= 100; i++) {
        if (i % 3 != 0 && i % 5 != 0) {
            continue;
        }
        count++;
    }
    cout << count;`) },
      { title: 'No loop: count, add, remove the overlap', code: prog(cpp`
    cout << 100 / 3 + 100 / 5 - 100 / 15;`), note: '33 multiples of 3, 20 of 5, but the 6 multiples of 15 were counted twice: 33 + 20 − 6 = 47.' },
    ],
    takeaway: 'The loop is easy to trust — it checks every number. The formula is faster but you must remember the overlap.',
    check: { id: 'counting-ways-ways-check', kind: 'mcq', prompt: 'Which one gives a WRONG count?', options: ['`cout << 100 / 3 + 100 / 5;`', '`cout << 100 / 3 + 100 / 5 - 100 / 15;`', 'the loop with `if (i % 3 == 0 || i % 5 == 0) count++;`', 'the loop with `if (!(i % 3 != 0 && i % 5 != 0)) count++;`'], answer: 0, hints: ['What about 15, 30, 45 …?'], explain: 'Without `- 100 / 15` the multiples of 15 are counted twice: 53 instead of 47. The last option is the same condition rewritten with De Morgan.' },
  },
  watch: [
    { title: 'Handshakes in a group of 5', intro: 'Guess first: how many handshakes if everyone greets everyone once?', code: prog(cpp`
    int n = 5, count = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            cout << i << "-" << j << " ";
            count++;
        }
    }
    cout << endl << count << " handshakes" << endl;`) },
    { title: 'Two-digit numbers whose digits add up to 9', intro: 'Tens digit 1–9, ones digit 0–9: 90 numbers are checked. Guess how many pass.', code: prog(cpp`
    int count = 0;
    for (int t = 1; t <= 9; t++) {
        for (int u = 0; u <= 9; u++) {
            if (t + u == 9) {
                cout << t << u << " ";
                count++;
            }
        }
    }
    cout << endl << "Count: " << count << endl;`) },
    { title: 'Rs 50 again — with one loop', intro: 'Choose the number of twenties; the tens are then forced.', code: prog(cpp`
    int ways = 0;
    for (int t = 0; 20 * t <= 50; t++) {
        int rest = 50 - 20 * t;
        cout << t << " x Rs20 + " << rest / 10 << " x Rs10" << endl;
        ways++;
    }
    cout << "Ways: " << ways << endl;`) },
  ],
  think: {
    title: 'Pens and notebooks',
    problem: 'A pen costs Rs 20 and a notebook Rs 50. You want to spend **exactly** Rs 200. How many different shopping lists are possible? (Guess first.)',
    steps: [
      { text: 'A counter for the ways.', lines: [5] },
      { text: 'Choice 1: the number of notebooks. 4 notebooks already cost 200, so 0 to 4.', lines: [6] },
      { text: 'Choice 2: the number of pens. 10 pens cost 200, so 0 to 10.', lines: [7] },
      { text: 'Rule: the total must be exactly 200.', lines: [8] },
      { text: 'Count the way, and print the count after all 5 × 11 = 55 tries.', lines: [9, 13] },
    ],
    code: prog(cpp`
    int ways = 0;
    for (int n = 0; n <= 4; n++) {
        for (int p = 0; p <= 10; p++) {
            if (50 * n + 20 * p == 200) {
                ways++;
            }
        }
    }
    cout << "Ways: " << ways << endl;`),
    why: 'The three ways are 0 notebooks + 10 pens, 2 + 5 and 4 + 0. With an odd number of notebooks the rest (150, 50) cannot be paid with Rs 20 pens.',
    yourTurn: {
      id: 'counting-ways-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['n', 'left', 'ways'],
      prompt: 'The smart one-loop version, with only Rs 100 to spend. Choose the notebooks; the money left must be paid in pens. Dry run it.',
      code: prog(cpp`
    int ways = 0;
    for (int n = 0; n <= 2; n++) {
        int left = 100 - 50 * n;
        if (left % 20 == 0) {
            ways++;
        }
    }
    cout << "Ways: " << ways << endl;`),
      hints: ['n = 1 leaves 50. Is 50 a multiple of 20?', '0 is a multiple of 20 (0 pens).'],
      explain: 'left: 100 (yes, 5 pens), 50 (no), 0 (yes, 0 pens). `Ways: 2`.',
    },
  },
  practice: [
    { id: 'counting-ways-q1', kind: 'mcq', prompt: 'Six friends meet and everyone shakes hands with everyone once. What does this program print?', code: prog(cpp`
    int n = 6, count = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            count++;
        }
    }
    cout << count;`), options: ['15', '36', '30', '6'], answer: 0, hints: ['Person 1 shakes 5 hands, person 2 has 4 new ones, …'], explain: '5 + 4 + 3 + 2 + 1 + 0 = 15 = 6 × 5 / 2.' },
    { id: 'counting-ways-q2', kind: 'mcq', prompt: 'In the two-dice program, how many times is the `if (a + b == 7)` condition checked?', code: prog(cpp`
    int ways = 0;
    for (int a = 1; a <= 6; a++) {
        for (int b = 1; b <= 6; b++) {
            if (a + b == 7) {
                ways++;
            }
        }
    }
    cout << ways;`), options: ['36', '6', '12', '7'], answer: 0, hints: ['The if is inside BOTH loops.'], explain: 'It is checked for every pair: 6 × 6 = 36 times. It is TRUE 6 times — that is the printed answer.' },
    { id: 'counting-ways-q3', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    for (int a = 1; a <= 4; a++) {
        for (int b = a + 1; b <= 4; b++) {
            cout << a << b << " ";
        }
    }`), hints: ['b always starts one above a.'], explain: 'Each pair from {1,2,3,4} once: `12 13 14 23 24 34 ` — 6 pairs = 4 × 3 / 2.' },
    { id: 'counting-ways-q4', kind: 'blanks', prompt: 'Count the numbers from 1 to 50 divisible by 3 or by 5. Guess first! The program should print `23`.', code: prog(cpp`
    int count = 0;
    for (int i = 1; i <= 50; i++) {
        if (i % 3 == 0 [[1]] i % 5 == 0) {
            [[2]];
        }
    }
    cout << count;`), blanks: [{ answers: ['||'] }, { answers: ['count++', '++count', 'count += 1', 'count = count + 1'] }], chips: ['||', '&&', 'count++', 'i++'], output: '23', hints: ['"3 or 5" → `||`.'], explain: '16 multiples of 3 + 10 of 5 − 3 of 15 = 23. With `&&` you would count only 15, 30, 45.' },
    { id: 'counting-ways-q5', kind: 'bug', prompt: 'It should count the handshakes among 5 people (10), but prints 20. Find the line.', code: prog(cpp`
    int n = 5, count = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (i != j) {
                count++;
            }
        }
    }
    cout << count;`), bugLine: 7, options: ['Start the inner loop at `j = i + 1` so each pair is counted once', 'Use `i == j`', 'Use `j < n`', 'Start the outer loop at 0'], answer: 0, fixed: prog(cpp`
    int n = 5, count = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            if (i != j) {
                count++;
            }
        }
    }
    cout << count;`), hints: ['Is (1, 2) counted? Is (2, 1) counted too?'], explain: 'Every handshake is counted twice, once from each side: 5 × 4 = 20. With `j = i + 1` only pairs with i < j are counted: 10. (The `if` is then always true and could be removed.)' },
    { id: 'counting-ways-q6', kind: 'trace', mode: 'vars', tag: 'real life', vars: ['f', 'rest', 'ways'], prompt: 'Pay exactly Rs 70 using Rs 50 and Rs 20 notes. Choose the fifties; the rest must be twenties. Dry run it.', code: prog(cpp`
    int ways = 0;
    for (int f = 0; f <= 1; f++) {
        int rest = 70 - 50 * f;
        if (rest % 20 == 0) {
            ways++;
        }
    }
    cout << ways;`), hints: ['70 is not a multiple of 20.', '70 − 50 = 20.'], explain: 'f = 0: rest 70 → no. f = 1: rest 20 → yes. Only 1 way: one fifty and one twenty.' },
    { id: 'counting-ways-q7', kind: 'predict', tag: 'tricky', prompt: 'In how many ways can 3 friends sit on 3 numbered chairs? Each loop picks the chair of one friend; no two may share a chair. Predict the output.', code: prog(cpp`
    int count = 0;
    for (int a = 1; a <= 3; a++) {
        for (int b = 1; b <= 3; b++) {
            for (int c = 1; c <= 3; c++) {
                if (a != b && b != c && a != c) {
                    count++;
                }
            }
        }
    }
    cout << count;`), hints: ['27 combinations are tried.', 'The first friend has 3 choices, the second 2, the last 1.'], explain: '3 × 2 × 1 = 6 (that is 3!). The loops try 3 × 3 × 3 = 27 combinations and 6 of them use three different chairs.' },
    { id: 'counting-ways-q8', kind: 'mcq', tag: 'real life', prompt: 'Sana has 4 shirts and 3 trousers. A program loops over shirts (outer) and trousers (inner) and prints every outfit. How many outfits does it print?', options: ['12', '7', '4', '3'], answer: 0, hints: ['For each shirt, every trouser.'], explain: 'Every shirt goes with every trouser: 4 × 3 = 12. Adding (4 + 3) is the classic mistake.' },
  ],
  cheatsheet: [
    { code: 'for … for … if (rule) ways++;', text: 'try every combination, count the valid ones' },
    { code: 'for (j = i + 1; …)', text: 'each pair once — no double counting' },
    { code: 'n × m, n(n−1)/2, n!', text: 'all pairs, handshakes, seatings' },
    { code: 'guess → run → compare', text: 'always predict the count first' },
  ],
};

// ------------------------------------------------------------------ Checkpoint 6 + capstone
const C6: Level = {
  id: 'checkpoint-loops',
  kind: 'revision',
  title: 'Loops',
  tagline: '**Checkpoint 6.** Bills, attendance, temperatures, cricket and savings — real problems that need while, for, do…while, patterns, break and nested loops. Predict how many times before you run.',
  minutes: 40,
  objectives: [
    'Choose the right loop for a real problem',
    'Trace loops and predict how many times they run',
    'Build a complete loop program on your own',
  ],
  practice: [
    { id: 'checkpoint-loops-q1', kind: 'predict', tag: 'real life', prompt: 'A shop bill: 4 item prices are entered. Orders above Rs 1000 get Rs 100 off. Input `300 450 150 200`. Predict the output.', code: prog(cpp`
    int total = 0;
    for (int i = 1; i <= 4; i++) {
        int price;
        cin >> price;
        total += price;
    }
    if (total > 1000) {
        total -= 100;
    }
    cout << "Pay: Rs " << total;`), input: '300 450 150 200\n', hints: ['Add all four first.', 'Is the total MORE than 1000?'], explain: '300 + 450 + 150 + 200 = 1100 > 1000 → 1000. Output `Pay: Rs 1000`.' },
    { id: 'checkpoint-loops-q2', kind: 'trace', mode: 'vars', tag: 'real life', vars: ['p', 'present'], prompt: 'Attendance for 4 days: 1 = present, 0 = absent. Input `1 0 1 1`. Dry run it.', code: prog(cpp`
    int present = 0;
    for (int day = 1; day <= 4; day++) {
        int p;
        cin >> p;
        if (p == 1) {
            present++;
        }
    }
    cout << present * 100 / 4 << "%";`), input: '1 0 1 1\n', hints: ['present only changes on the days with a 1.'], explain: 'present: 1, 1, 2, 3 → 3 × 100 / 4 = `75%`. (Multiplying by 100 BEFORE dividing keeps integer division from giving 0.)' },
    { id: 'checkpoint-loops-q3', kind: 'mcq', tag: 'real life', prompt: 'A T20 innings has 20 overs of 6 balls. How many times does the inner body run?', code: prog(cpp`
    int balls = 0;
    for (int over = 1; over <= 20; over++) {
        for (int ball = 1; ball <= 6; ball++) {
            balls++;
        }
    }
    cout << balls;`), options: ['120', '26', '20', '126'], answer: 0, hints: ['Outer rounds × inner rounds.'], explain: '20 × 6 = 120 balls.' },
    { id: 'checkpoint-loops-q4', kind: 'blanks', tag: 'real life', prompt: 'Temperature stats for 5 days: print the highest and the lowest. Input `31 27 35 29 33` → `High 35 Low 27`.', code: prog(cpp`
    int t, hi, lo;
    cin >> t;
    hi = t;
    lo = [[1]];
    for (int day = 2; day <= 5; day++) {
        cin >> t;
        if (t [[2]] hi) hi = t;
        if (t [[3]] lo) lo = t;
    }
    cout << "High " << hi << " Low " << lo;`), blanks: [{ answers: ['t'] }, { answers: ['>'] }, { answers: ['<'] }], chips: ['t', '0', '>', '<', '=='], input: '31 27 35 29 33\n', output: 'High 35 Low 27', hints: ['Both hi and lo start with the first reading.', 'A new high is GREATER than the old one.'], explain: 'Start both with the first reading, then update with `>` for the high and `<` for the low.' },
    { id: 'checkpoint-loops-q5', kind: 'bug', tag: 'real life', prompt: 'A cashier adds 3 prices, `100 200 50`. The bill should be 350, but it prints 50. Find the line.', code: prog(cpp`
    int total = 0, price;
    for (int i = 1; i <= 3; i++) {
        cin >> price;
        total = 0;
        total += price;
    }
    cout << total;`), input: '100 200 50\n', bugLine: 8, options: ['Remove `total = 0;` from inside the loop — it resets the total every round', 'Use `i < 3`', 'Use `total = price;`', 'Read the price after adding'], answer: 0, fixed: prog(cpp`
    int total = 0, price;
    for (int i = 1; i <= 3; i++) {
        cin >> price;
        total += price;
    }
    cout << total;`), hints: ['What is total just before the last price is added?'], explain: 'Resetting inside the loop throws away everything collected so far. The start value belongs BEFORE the loop.' },
    { id: 'checkpoint-loops-q6', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    int a = 0, b = 0;
    while (a > 0) {
        cout << "W";
        a--;
    }
    do {
        cout << "D";
        b--;
    } while (b > 0);`), hints: ['Which loop checks first?'], explain: 'The while checks `0 > 0` first → 0 rounds. The do…while runs once, then `-1 > 0` is false. Output `D`.' },
    { id: 'checkpoint-loops-q7', kind: 'parsons', prompt: 'Build a program that reads a number and prints how many digits it has. Input `90210` → `5`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int n, count = 0;', '    cin >> n;', '    do {', '        n = n / 10;', '        count++;', '    } while (n > 0);', '    cout << count;', '    return 0;', '}'], distractors: ['        n = n % 10;', '    } while (n > 0)'], input: '90210\n', hints: ['Dropping a digit is `/ 10`.', 'A do…while ends with `;`.'], explain: 'n: 9021 → 902 → 90 → 9 → 0, count 5. do…while also gives 1 digit for the input 0.' },
    { id: 'checkpoint-loops-q8', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) {
            continue;
        }
        if (i > 7) {
            break;
        }
        cout << i << " ";
    }`), hints: ['Even numbers are skipped.', 'Which odd number is first above 7?'], explain: '1, 3, 5, 7 are printed. 9 > 7 → break. Output `1 3 5 7 `.' },
    { id: 'checkpoint-loops-q9', kind: 'predict', tag: 'tricky', prompt: 'How many numbers from 1 to 100 contain the digit 7? Guess first, then predict what the program prints.', code: prog(cpp`
    int count = 0;
    for (int i = 1; i <= 100; i++) {
        if (i % 10 == 7 || i / 10 == 7) {
            count++;
        }
    }
    cout << count;`), hints: ['7 as the last digit: 7, 17, …, 97.', '7 as the tens digit: 70 … 79. Which number is in both lists?'], explain: '10 numbers end in 7, 10 numbers are in the 70s, and 77 is in both: 10 + 10 − 1 = `19`.' },
    { id: 'checkpoint-loops-q10', kind: 'paths', tag: 'real life', prompt: 'A canteen menu. Find an input (a list of choices, ending with 0) for every path.', code: prog(cpp`
    int c, bill = 0;
    do {
        cin >> c;
        switch (c) {
            case 1: bill += 50; break;
            case 2: bill += 120; break;
            case 0: break;
            default: cout << "Invalid! ";
        }
    } while (c != 0);
    cout << "Bill: " << bill;`), paths: [{ label: 'a samosa (Rs 50)', line: 9 }, { label: 'a burger (Rs 120)', line: 10 }, { label: '`Invalid!`', line: 12 }], start: '0', hints: ['You can visit several paths in one go: `1 2 0`.', 'Any number other than 0, 1, 2 is invalid.'], explain: '`1 0` → samosa, `2 0` → burger, `5 0` → Invalid. `1 2 5 0` reaches all three at once. (The `break` inside the switch leaves the switch, not the loop.)' },
    { id: 'checkpoint-loops-q11', kind: 'trace', mode: 'vars', tag: 'real life', vars: ['year', 'bal'], prompt: 'Savings of Rs 1000 grow by 10% every year (whole rupees). After how many years is the balance at least Rs 1300? Dry run it.', code: prog(cpp`
    int bal = 1000, year = 0;
    while (bal < 1300) {
        bal = bal + bal / 10;
        year++;
    }
    cout << year << " years, Rs " << bal;`), hints: ['1000 + 100 = 1100, then 1100 + 110 = 1210.'], explain: 'bal 1100 → 1210 → 1331; year 1 → 2 → 3. `1331 < 1300` is false: `3 years, Rs 1331`.' },
    { id: 'checkpoint-loops-q12', kind: 'mcq', prompt: 'Match the job with the best loop: (A) print roll numbers 1 to 40, (B) read numbers until the user types 0, (C) show a menu until the user picks Exit.', options: ['A: for, B: while, C: do…while', 'A: while, B: for, C: do…while', 'A: do…while, B: for, C: while', 'A: for, B: do…while, C: for'], answer: 0, hints: ['Known count → for. Might run 0 times → while. Must run once → do…while.'], explain: 'A has a known count (for). B may stop at once if the first number is 0 (while with a first read). C shows the menu at least once (do…while). Other choices also work, but these are the clearest.' },
    { id: 'checkpoint-loops-q13', kind: 'blanks', tag: 'real life', prompt: '**Capstone — checkout counter.** Read prices until 0. Print the number of items, the total and the most expensive item. Input `120 450 80 0` → `Items: 3, Total: 650, Max: 450`.', code: prog(cpp`
    int price, items = 0, total = 0, mx = 0;
    cin >> price;
    while (price [[1]] 0) {
        [[2]];
        total [[3]] price;
        if (price > mx) {
            mx = [[4]];
        }
        cin >> [[5]];
    }
    cout << "Items: " << items << ", Total: " << total << ", Max: " << mx;`), blanks: [{ answers: ['!='] }, { answers: ['items++', '++items', 'items += 1', 'items = items + 1'] }, { answers: ['+='] }, { answers: ['price'] }, { answers: ['price'] }], chips: ['!=', '==', 'items++', '+=', '=', 'price', 'mx'], input: '120 450 80 0\n', output: 'Items: 3, Total: 650, Max: 450', hints: ['A sentinel loop: keep going while the price is not 0.', 'Three patterns in one loop: count, sum, max.', 'Read the next price at the end of the body.'], explain: 'One loop, three patterns: a counter (`items++`), a sum (`total += price`) and a max. Prices are never negative, so `mx = 0` is a safe start here. The last `cin` is the update that moves the loop forward.' },
  ],
  cheatsheet: [
    { code: 'for', text: 'known number of rounds' },
    { code: 'while', text: 'repeat while true; may run 0 times' },
    { code: 'do … while (…);', text: 'at least once' },
    { code: 'break / continue', text: 'leave the loop / skip this round' },
  ],
  exam: {
    title: 'Exam Challenge: Loops',
    intro: '**State the output of the following code. If there is an error, write it explicitly** (which line, and why). Trace on paper with a small table of the variables — exactly like the PF sessional. Watch for a `;` after a loop header, a loop variable used outside its loop, `break` that leaves only the inner loop, `cout` inside a condition, and the comma operator.',
    questions: [
      { id: 'checkpoint-loops-x1', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int rows = 4;
    for (int r = rows; r >= 1; r--) {
        for (int s = 1; s < r; s++)
            cout << "^";
        for (int c = 1; c <= 7; c += 2) {
            if (r == 2 && c > 3)
                break;
            if (r == 3 && c == 3)
                continue;
            cout << "$";
        }
        cout << endl;
    }`), hints: ['The first inner loop prints `r - 1` carets. The second one tries c = 1, 3, 5, 7.', '`break` and `continue` act only on the loop they are in (the `c` loop).'], explain: 'For every row r the `s` loop prints r − 1 `^`, then the `c` loop tries c = 1, 3, 5, 7 (4 values):\nr = 4: `^^^`, no break/continue → `$$$$`.\nr = 3: `^^`, c = 3 is skipped by `continue` → `$$$` (c = 1, 5, 7).\nr = 2: `^`, c = 1 and 3 print, at c = 5 `break` leaves the c loop → `$$`.\nr = 1: no `^` → `$$$$`.\nOutput:\n`^^^$$$$`\n`^^$$$`\n`^$$`\n`$$$$`' },
      { id: 'checkpoint-loops-x2', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int sum = 0;
    for (int i = 1; i <= 10; i += 3) {
        sum += i;
    }
    cout << sum << " " << i;`), hints: ['Where was `i` declared?', 'A variable made in the `for` header lives only inside that loop.'], explain: '**Compile error on line 9: `i` was not declared in this scope.**\n`int i` is declared in the `for` header on line 6, so it exists only inside that loop. After the closing `}` on line 8 it is destroyed, and the name `i` means nothing on line 9.\nFix: declare `int i;` before the loop and write `for (i = 1; i <= 10; i += 3)`. Then it would print `22 13` (1 + 4 + 7 + 10 = 22, and i stops at 13).' },
      { id: 'checkpoint-loops-x3', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int i = 6, counter = 3;
    while (--i > 0 && (counter += 2) < 10) {
    }
    cout << i << " " << counter;`), hints: ['The body is empty — all the work happens inside the condition.', 'When `--i > 0` is false, `counter += 2` is not done (short-circuit).'], explain: 'All changes happen in the condition on line 6:\n• i = 5, 5 > 0 true → counter = 5, 5 < 10 true → loop.\n• i = 4 → counter = 7 → true.\n• i = 3 → counter = 9 → true.\n• i = 2, 2 > 0 true → counter = 11, 11 < 10 **false** → the loop ends.\nOutput: **`2 11`**' },
      { id: 'checkpoint-loops-x4', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int n = 4, f = 1;
    do {
        f *= n;
        n--;
    } while (n > 1)
    cout << f;`), hints: ['How does a do…while end?', 'Compare with a `while` loop: which one needs a `;` after the condition?'], explain: '**Compile error on line 9: expected `;` before `cout`.**\nA `do … while (condition)` is one statement and must end with a semicolon: `} while (n > 1);`. g++ reads on to line 10, finds `cout` where the `;` should be, and reports the error at the end of line 9.\nWith the `;` it would print `24` (f = 4 × 3 × 2).' },
      { id: 'checkpoint-loops-x5', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int i, j;
    for (i = 0, j = 10; cout << i, i < j; i += 3, j -= 2)
        cout << "-";
    cout << endl << i << " " << j;`), hints: ['The comma operator does the left part, throws its value away, and the value of the right part is the result.', 'So the condition first PRINTS i, then checks `i < j`.'], explain: 'The condition `cout << i, i < j` prints i every time it is checked; only `i < j` decides.\n• i = 0, j = 10: print `0`, 0 < 10 → body `-`.\n• i = 3, j = 8: print `3`, true → `-`.\n• i = 6, j = 6: print `6`, 6 < 6 false → stop.\nThen a new line and `6 6`.\nOutput:\n`0-3-6`\n`6 6`' },
      { id: 'checkpoint-loops-x6', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int total = 0;
    for (int i = 1; i <= 4; i++) {
        for (int j = i; j <= 4; j++) {
            if ((i + j) % 3 == 0) break;
            total += j;
        }
        if (total > 8) continue;
        cout << i << ":" << total << " ";
    }
    cout << endl << total;`), hints: ['The inner loop starts at `j = i`.', '`break` leaves only the `j` loop; `continue` skips only the `cout` of this round of `i`.'], explain: '`total` is never reset, so it keeps growing.\n• i = 1: j = 1 (sum 2) → total 1; j = 2 (sum 3) → break. Print `1:1 `.\n• i = 2: j = 2 → total 3; j = 3 → total 6; j = 4 (sum 6) → break. Print `2:6 `.\n• i = 3: j = 3 (sum 6) → break at once. Print `3:6 `.\n• i = 4: j = 4 (sum 8) → total 10. 10 > 8 → `continue`, nothing printed.\nThen a new line and `10`.\nOutput:\n`1:1 2:6 3:6 ` (with a space at the end)\n`10`' },
      { id: 'checkpoint-loops-x7', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int k = 0;
    while (k < 5);
    {
        k++;
        if (k == 3)
            break;
    }
    cout << k;`), hints: ['Look at the end of line 6.', 'What is the body of the `while` now? And where does the `break` stand?'], explain: '**Compile error on line 10: `break` statement not within loop or switch.**\nThe `;` at the end of line 6 is the whole (empty) body of the `while`. The block on lines 7–11 is NOT part of the loop — it is an ordinary block after it. So the `break` on line 10 is not inside any loop or switch, which is not allowed.\n(Even without the `break`, this would be an infinite loop: `k < 5` stays true forever because nothing changes k.)\nFix: remove the `;` after `while (k < 5)`. Then it prints `3`.' },
      { id: 'checkpoint-loops-x8', kind: 'count', tag: 'exam', unit: 'stars', count: { text: '*' }, prompt: '`cout << "*"` inside a loop condition prints every time the condition is checked. How many `*` does this program print?', code: prog(cpp`
    int i = 0;
    while (cout << "*" && i++ < 3)
        cout << i;
    cout << endl << i;`), hints: ['Count how many times the condition is checked — including the last, false check.', '`i++ < 3` compares the old value, then adds 1.'], explain: 'Each check first prints `*` (true), then tests `i++ < 3`:\n• `*`, 0 < 3 true, i = 1 → prints `1`\n• `*`, 1 < 3 true, i = 2 → `2`\n• `*`, 2 < 3 true, i = 3 → `3`\n• `*`, 3 < 3 false, i = 4 → stop.\nOutput `*1*2*3*`, then `4` on the next line. The condition is checked 4 times → **4 stars**.' },
      { id: 'checkpoint-loops-x9', kind: 'count', tag: 'exam', count: { line: 10 }, prompt: 'How many times does line 10 (`c++;`) run?', code: prog(cpp`
    int c = 0;
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) {
            if (j == 4) break;
            if ((i + j) % 2 == 0) continue;
            c++;
        }
    }
    cout << c;`), hints: ['`j` never gets past 3 because of the `break`.', 'Line 10 runs only when `i + j` is odd.'], explain: 'j runs from 1 up to i, but stops at 4 (break). Line 10 runs only when `i + j` is **odd**:\n• i = 1: j = 1 (2 even) → 0\n• i = 2: j = 1 (3 odd) ✓, j = 2 → 1\n• i = 3: j = 2 (5) ✓ → 1\n• i = 4: j = 1 (5) ✓, j = 3 (7) ✓, j = 4 break → 2\n• i = 5: j = 2 (7) ✓, j = 4 break → 1\nTotal **5 times** (the program prints `5`).' },
      { id: 'checkpoint-loops-x10', kind: 'blanks', tag: 'exam', prompt: '**Complete the program** so it prints this pyramid for `n = 4` (spaces before the stars, nothing after them):\n`   *`\n`  ***`\n` *****`\n`*******`', code: prog(cpp`
    int n = 4;
    for (int r = 1; r <= n; r++) {
        for (int s = 1; s <= [[1]]; s++)
            cout << " ";
        for (int k = 1; k <= [[2]]; k++)
            cout << "*";
        cout << [[3]];
    }`), output: '   *\n  ***\n *****\n*******\n', blanks: [{ answers: ['n - r', 'n-r', '4 - r', '4-r'], hint: 'Row 1 has 3 spaces, row 4 has 0.' }, { answers: ['2 * r - 1', '2*r-1', '2*r - 1', 'r * 2 - 1', 'r*2-1', '2 * r-1'], hint: 'Row r has 1, 3, 5, 7 stars.' }, { answers: ['endl', '"\\n"', "'\\n'"] }], chips: ['n - r', 'r', '2 * r - 1', '2 * r', 'endl', 'n'], hints: ['Make a table: row → spaces → stars. Find the rule for each column.', 'Spaces go DOWN by 1, stars go UP by 2.'], explain: 'Table for n = 4: row 1 → 3 spaces, 1 star; row 2 → 2, 3; row 3 → 1, 5; row 4 → 0, 7.\nSpaces = `n - r`, stars = `2 * r - 1`. After each row, `endl` moves to the next line.' },
    ],
  },
};

export const unit6: Unit = {
  id: 'u6',
  num: 6,
  title: 'Loops: repeat without rewriting',
  summary: '`while`, `for` and `do…while` — and how many times a loop really runs.',
  levels: [LWhile, LFor, LDo, LPatterns, LBreak, LNested, LWays, C6],
};
