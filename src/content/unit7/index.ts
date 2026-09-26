import type { Level, Unit } from '../types';
import { cpp, prog, progF } from '../helpers';

// ------------------------------------------------------------------ Level: functions-intro
const F1: Level = {
  id: 'functions-intro',
  kind: 'lesson',
  title: 'Your first function',
  tagline: 'Give a piece of code a name, then run it again and again with one short line. Watch execution jump into the function and come back.',
  minutes: 20,
  objectives: [
    'You can write a `void` function and call it from `main`',
    'You can follow the jump into a function and back on the call stack',
    'You can count how many times a function is called',
  ],
  learn: [
    { t: 'p', text: 'Think of a **tea recipe card**. You write the steps once. Every time a guest comes you do not rewrite the recipe — you just say *"make tea"* and follow the card. A **function** is a recipe card for code: a group of statements with a **name**. Writing the name with `()` — a **call** — runs all of those statements.' },
    { t: 'syntax', title: 'A function that does one job', code: 'void greet() {\n    cout << "Hello!" << endl;\n}', parts: [
      { token: 'void', text: 'the function gives **nothing back** — it only does a job (Level 2 shows functions that give a value back)' },
      { token: 'greet', text: 'the **name**. Same rules as variable names; a verb is a good choice: `greet`, `printLine`, `showMenu`' },
      { token: '()', text: 'the brackets. Empty here: this function needs no information from outside' },
      { token: '{ … }', text: 'the **body**: the statements that run every time the function is called' },
    ] },
    { t: 'viz', title: 'Calling the same function twice', code: progF(cpp`
void greet() {
    cout << "Hello!" << endl;
    cout << "Welcome to DryRun" << endl;
}`, cpp`
    cout << "Start" << endl;
    greet();
    greet();
    cout << "End" << endl;`) },
    { t: 'callout', tone: 'key', title: 'Jump in, jump back', text: 'A program always starts in `main`. At `greet();` execution **jumps** to the first line of `greet`, and a new **frame** for `greet` appears on the call stack. At the closing `}` the frame disappears and execution goes **back to the line right after the call**. Step through it and watch the stack.' },
    { t: 'terms', items: [
      { term: 'definition', def: 'the whole function: header + body. It says *what* the function does.' },
      { term: 'call', def: '`greet();` — the name with brackets. It says *do it now*.' },
      { term: 'call stack', def: 'the pile of functions that are running right now. `main` is at the bottom; each call puts a new frame on top.' },
      { term: 'frame', def: 'the memory for one running call. It is made at the call and removed when the function ends.' },
    ] },
    { t: 'h', text: 'Why bother with functions?' },
    { t: 'list', items: [
      '**Reuse** — write the code once, call it as many times as you like.',
      '**Readability** — `printReceipt();` tells the reader *what* happens without showing *how*.',
      '**One job each** — small functions are easy to test. If the receipt is wrong, you know where to look.',
      '**Fix once** — a bug inside a function is fixed for every call at the same time.',
    ] },
    { t: 'callout', tone: 'warn', title: 'Write it above main', text: 'C++ reads your file from top to bottom. When it meets `greet();` inside `main`, it must already know `greet`. So write the function **above** `main` (or put a *prototype* above main — Level 5).' },
    { t: 'compare', items: [
      { title: 'Function below main', good: false, code: cpp`#include <iostream>
using namespace std;

int main() {
    greet();
    return 0;
}

void greet() {
    cout << "Hello!" << endl;
}
`, note: "Error on line 5: `'greet' was not declared in this scope`." },
      { title: 'Function above main', good: true, code: cpp`#include <iostream>
using namespace std;

void greet() {
    cout << "Hello!" << endl;
}

int main() {
    greet();
    return 0;
}
`, note: 'C++ already knows `greet` when it reaches the call.' },
    ] },
  ],
  ways: {
    goal: 'Print a title between two lines of dashes:\n`----------` / `REPORT CARD` / `----------`.',
    items: [
      { title: 'No function (repeat the code)', code: prog(cpp`
    cout << "----------" << endl;
    cout << "REPORT CARD" << endl;
    cout << "----------" << endl;`), note: 'Works, but the dash line is written twice.' },
      { title: 'A line() function called twice', code: progF(cpp`
void line() {
    cout << "----------" << endl;
}`, cpp`
    line();
    cout << "REPORT CARD" << endl;
    line();`) },
      { title: 'line() uses a loop inside', code: progF(cpp`
void line() {
    for (int i = 0; i < 10; i++) {
        cout << "-";
    }
    cout << endl;
}`, cpp`
    line();
    cout << "REPORT CARD" << endl;
    line();`), note: 'The caller does not care HOW the line is printed.' },
      { title: 'A function that calls another function', code: progF(cpp`
void line() {
    cout << "----------" << endl;
}

void header() {
    line();
    cout << "REPORT CARD" << endl;
    line();
}`, cpp`
    header();`), note: '`main` calls `header`, `header` calls `line`: the stack is 3 frames tall at its highest.' },
    ],
    takeaway: 'Same output every time. Functions do not change *what* the program prints — they make the code shorter, clearer and easier to change (change `line` once, and both lines change).',
    check: { id: 'functions-intro-ways-check', kind: 'mcq', prompt: 'You have `void line() { … }` above main. Which statement in main does NOT print a line?', options: ['`line;`', '`line();`', '`for (int i = 0; i < 1; i++) line();`', '`{ line(); }`'], answer: 0, explain: 'Without `()` there is no call. `line;` only names the function and does nothing (g++ gives a warning). A call always needs the brackets.' },
  },
  watch: [
    { title: 'A function inside a function', intro: 'Watch the stack grow to three frames: main → header → line, then shrink back.', code: progF(cpp`
void line() {
    cout << "==========" << endl;
}

void header() {
    line();
    cout << "  MENU" << endl;
    line();
}`, cpp`
    header();
    cout << "1. Tea" << endl;
    cout << "2. Coffee" << endl;`) },
    { title: 'Calling from a loop', intro: 'How many times does the frame for `clap` appear? Count them.', code: progF(cpp`
void clap() {
    cout << "clap! ";
}`, cpp`
    for (int i = 1; i <= 3; i++) {
        clap();
    }
    cout << endl << "Done" << endl;`) },
  ],
  think: {
    title: 'Birthday song',
    problem: 'Print the birthday song for Sara:\n`Happy birthday to you` (twice), then `Happy birthday dear Sara`, then `Happy birthday to you` once more. Do not type the repeated line more than once.',
    steps: [
      { text: 'Spot the line that repeats. Give it a name: a `void` function `happyLine` that prints it.', lines: [4, 5, 6] },
      { text: 'In main, call it for the first two lines.', lines: [9, 10] },
      { text: 'The special line is printed only once, so main prints it directly.', lines: [11] },
      { text: 'Call the function one last time.', lines: [12] },
    ],
    code: progF(cpp`
void happyLine() {
    cout << "Happy birthday to you" << endl;
}`, cpp`
    happyLine();
    happyLine();
    cout << "Happy birthday dear Sara" << endl;
    happyLine();`),
    why: '`happyLine` is called **3 times**, so its frame appears 3 times on the stack. If you want to change the words, you change them in one place.',
    yourTurn: {
      id: 'functions-intro-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'Now a match is won. Write what each line prints. How many times is `cheer()` called?',
      code: progF(cpp`
void cheer() {
    cout << "Pakistan Zindabad!" << endl;
}`, cpp`
    cout << "Match won" << endl;
    for (int i = 0; i < 2; i++) {
        cheer();
    }
    cout << "Go home" << endl;`),
      hints: ['The loop runs for i = 0 and i = 1.', 'Each time, execution jumps into `cheer` and prints its line.'],
      explain: '`cheer()` is called 2 times, so its line is printed twice between `Match won` and `Go home`.',
    },
  },
  practice: [
    { id: 'functions-intro-q1', kind: 'mcq', prompt: 'How many times is `greet()` called?', code: progF(cpp`
void greet() {
    cout << "Hi ";
}`, cpp`
    greet();
    for (int i = 1; i <= 3; i++) {
        greet();
    }
    greet();`), options: ['2', '3', '4', '5'], answer: 3, hints: ['Count the calls outside the loop first.', 'The loop runs 3 times and calls greet each time.'], explain: '1 call before the loop + 3 inside the loop + 1 after = **5** calls. The output is `Hi Hi Hi Hi Hi `.' },
    { id: 'functions-intro-q2', kind: 'predict', tag: 'tricky', prompt: 'Follow the jumps. Predict the output.', code: progF(cpp`
void a() {
    cout << "A";
}

void b() {
    cout << "B";
    a();
    cout << "b";
}`, cpp`
    a();
    b();
    cout << "!";`), hints: ['`b` prints B, then calls `a`, then continues with its own next line.'], explain: 'main calls `a` → `A`. main calls `b` → `B`, then `b` calls `a` → `A`, back in `b` → `b`. Back in main → `!`. Output: `ABAb!`.' },
    { id: 'functions-intro-q3', kind: 'bug', prompt: 'This does not compile. Which line does g++ complain about, and what is the fix?', code: cpp`#include <iostream>
using namespace std;

int main() {
    cout << "Welcome" << endl;
    showMenu();
    return 0;
}

void showMenu() {
    cout << "1. Burger" << endl;
    cout << "2. Pizza" << endl;
}
`, bugLine: 6, options: ['Move `showMenu` above `main` (or add the prototype `void showMenu();` above main)', 'Write `showMenu;` without brackets', 'Change `void` to `int`', 'Add `return 0;` inside `showMenu`'], answer: 0, fixed: cpp`#include <iostream>
using namespace std;

void showMenu() {
    cout << "1. Burger" << endl;
    cout << "2. Pizza" << endl;
}

int main() {
    cout << "Welcome" << endl;
    showMenu();
    return 0;
}
`, hints: ['C++ reads from top to bottom.', 'When line 6 is read, has C++ seen `showMenu` yet?'], explain: 'At line 6, C++ has not met `showMenu` yet: *`showMenu` was not declared in this scope*. Define it above main (or declare a prototype there).' },
    { id: 'functions-intro-q4', kind: 'blanks', prompt: 'Complete the function and the second call. Output: a line, `Lahore Qalandars`, a line.', code: progF(cpp`
[[1]] line() {
    cout << "==========" << endl;
}`, cpp`
    line();
    cout << "Lahore Qalandars" << endl;
    [[2]];`), blanks: [{ answers: ['void'] }, { answers: ['line()'] }], chips: ['void', 'int', 'line()', 'line', 'main()'], output: '==========\nLahore Qalandars\n==========\n', hints: ['The function gives nothing back.', 'A call needs the name AND the brackets.'], explain: '`void line()` defines it; `line();` calls it.' },
    { id: 'functions-intro-q5', kind: 'trace', mode: 'output', prompt: 'Write the text each line prints.', code: progF(cpp`
void dash() {
    cout << "-";
}`, cpp`
    for (int i = 1; i <= 3; i++) {
        cout << i;
        dash();
    }`), hints: ['Each loop turn prints the number first, then jumps into `dash`.'], explain: 'The prints alternate between main and `dash`: `1-2-3-`. `dash` is called 3 times.' },
    { id: 'functions-intro-q6', kind: 'parsons', prompt: 'Arrange the program: a function `stars` prints `*****`, and main calls it twice with `Eid Mubarak` in between.', lines: ['#include <iostream>', 'using namespace std;', 'void stars() {', '    cout << "*****" << endl;', '}', 'int main() {', '    stars();', '    cout << "Eid Mubarak" << endl;', '    stars();', '    return 0;', '}'], distractors: ['    stars;', 'void stars();'], hints: ['The function goes above main.', 'A call has brackets and a semicolon; a definition header has no semicolon.'], explain: 'Definition first (no `;` after the header), then main with two calls.' },
    { id: 'functions-intro-q7', kind: 'bug', prompt: 'This does not compile. Find the line with the mistake.', code: progF(cpp`
void hello(); {
    cout << "Hello" << endl;
}`, cpp`
    hello();
    hello();`), bugLine: 4, options: ['Remove the `;` after `void hello()` — a definition header has no semicolon', 'Add a `;` after the `}` on line 6', 'Write `hello;` instead of `hello();`', 'Change `void` to `int`'], answer: 0, fixed: progF(cpp`
void hello() {
    cout << "Hello" << endl;
}`, cpp`
    hello();
    hello();`), hints: ['Look at the very end of line 4.'], explain: 'With the `;`, line 4 is only a *declaration* (a prototype). The `{ … }` below it then belongs to no function: *expected unqualified-id before \'{\' token*. Calls end with `;` — definition headers do not.' },
    { id: 'functions-intro-q8', kind: 'mcq', prompt: 'Which one is NOT a good reason to use functions?', options: ['Functions make every program run faster automatically', 'You can reuse the same code many times', 'A name like `printBill()` makes main easier to read', 'A bug inside a function is fixed for every call at once'], answer: 0, hints: ['Think about what a call really costs.'], explain: 'Functions are about organising code. A call even costs a little extra work (making a frame). The benefits are reuse, readability and easy fixing.' },
  ],
  cheatsheet: [
    { code: 'void name() { … }', text: 'define a function that does a job and returns nothing' },
    { code: 'name();', text: 'call it — execution jumps in, then comes back to the next line' },
    { code: 'name;', text: 'NOT a call — brackets are required' },
    { code: 'above main', text: 'define (or declare) a function before the first call' },
  ],
};

// ------------------------------------------------------------------ Level: params-return
const F2: Level = {
  id: 'params-return',
  kind: 'lesson',
  title: 'Parameters and return values',
  tagline: 'Send values into a function, get one value back. The call is then replaced by its answer — like a juice machine: fruit in, juice out.',
  minutes: 25,
  objectives: [
    'You can tell parameters from arguments',
    'You can return a value and use the call inside an expression or a `cout`',
    'You can explain why `return` ends a function immediately',
  ],
  learn: [
    { t: 'p', text: 'A juice machine has a **slot** for fruit and a **spout** for juice. You put in a mango and get back mango juice. A function can work the same way: **parameters** are the slots, the **return value** is the juice.' },
    { t: 'syntax', title: 'A function that gives back a value', code: 'int square(int n) {\n    return n * n;\n}', parts: [
      { token: 'int', text: 'the **return type**: the kind of value that comes back' },
      { token: 'square', text: 'the name' },
      { token: '(int n)', text: 'a **parameter**: a new box `n` that is filled with the value sent by the caller' },
      { token: 'return n * n;', text: 'work out `n * n`, send it back to the caller, and **end** the function' },
    ] },
    { t: 'viz', title: 'The call is replaced by its answer', code: progF(cpp`
int square(int n) {
    int result = n * n;
    return result;
}`, cpp`
    int a = square(4);
    int b = square(a - 10);
    cout << a << " " << b << endl;
    cout << square(3) + square(2) << endl;`) },
    { t: 'callout', tone: 'key', title: 'Watch the frame', text: 'At `square(4)` a frame appears with `n = 4`. At `return` you see the badge **returns 16**, the frame disappears, and `square(4)` in main is replaced by `16`. In `square(3) + square(2)` two separate calls happen, one after the other: `9 + 4`.' },
    { t: 'terms', items: [
      { term: 'parameter', def: 'the variable in the function header: `n` in `int square(int n)`.' },
      { term: 'argument', def: 'the value you send in the call: `4` in `square(4)`, or `a - 10` in `square(a - 10)`.' },
      { term: 'return value', def: 'the answer sent back by `return`. The call expression becomes this value.' },
      { term: 'return type', def: 'written before the name: `int`, `double`, `bool`, `char`, `string` … or `void` for *nothing*.' },
    ] },
    { t: 'callout', tone: 'warn', title: 'return ends the function NOW', text: 'As soon as a `return` runs, the function is finished. Lines after it are skipped. That is why a function can have several `return`s — only the first one reached counts.' },
    { t: 'viz', title: 'A bool function with an early return', code: progF(cpp`
bool isEven(int n) {
    if (n % 2 == 0) {
        return true;
    }
    return false;
}`, cpp`
    cout << isEven(10) << " " << isEven(7) << endl;
    if (isEven(4)) {
        cout << "4 is even" << endl;
    }`) },
    { t: 'table', head: ['', '`void` function', 'non-void function (`int`, `bool`, …)'], rows: [
      ['gives back', 'nothing', 'exactly one value'],
      ['`return`', 'optional, and only `return;`', 'must `return` a value on every path'],
      ['typical call', '`printBill(500);` as its own statement', '`total = price(3) + 50;` or `cout << price(3);`'],
      ['`cout << f();`', 'does NOT compile', 'prints the returned value'],
    ] },
    { t: 'compare', items: [
      { title: 'Answer thrown away', good: false, code: progF(cpp`
int square(int n) {
    return n * n;
}`, cpp`
    square(5);
    cout << "done";`), note: 'The function runs and returns 25 — but nobody uses it. Nothing about 25 is printed.' },
      { title: 'Answer used', good: true, code: progF(cpp`
int square(int n) {
    return n * n;
}`, cpp`
    int s = square(5);
    cout << s << " done";`), note: 'Store it, print it, or use it in an expression.' },
    ] },
  ],
  ways: {
    goal: 'Write a function `larger(a, b)` that gives back the bigger number, and print `Larger: 15` for 15 and 9.',
    items: [
      { title: 'if-else with two returns', code: progF(cpp`
int larger(int a, int b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}`, cpp`
    cout << "Larger: " << larger(15, 9) << endl;`) },
      { title: 'Early return, no else', code: progF(cpp`
int larger(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}`, cpp`
    cout << "Larger: " << larger(15, 9) << endl;`), note: 'If `return a` runs, the function is already over — the `else` is not needed.' },
      { title: 'One variable, one return', code: progF(cpp`
int larger(int a, int b) {
    int big = b;
    if (a > b) {
        big = a;
    }
    return big;
}`, cpp`
    cout << "Larger: " << larger(15, 9) << endl;`) },
      { title: 'Return a ternary', code: progF(cpp`
int larger(int a, int b) {
    return (a > b) ? a : b;
}`, cpp`
    cout << "Larger: " << larger(15, 9) << endl;`) },
      { title: 'Store the result first', code: progF(cpp`
int larger(int a, int b) {
    return max(a, b);
}`, cpp`
    int x = 15, y = 9;
    int big = larger(x, y);
    cout << "Larger: " << big << endl;`), note: 'The arguments can be variables. Their names (x, y) do not have to match the parameter names (a, b).' },
    ],
    takeaway: 'Inside, the function can decide in many ways. Outside, the caller only sees one thing: the value that comes back.',
    check: { id: 'params-return-ways-check', kind: 'mcq', prompt: 'Which version of `larger` does NOT work with `cout << larger(15, 9);`?', options: ['`void larger(int a, int b) { cout << max(a, b); }`', '`int larger(int a, int b) { return max(a, b); }`', '`int larger(int a, int b) { if (a > b) return a; return b; }`', '`int larger(int x, int y) { return x > y ? x : y; }`'], answer: 0, explain: 'A `void` function gives nothing back, so there is nothing for `cout` to print: it does not compile. Parameter names (`x`, `y`) can be anything.' },
  },
  watch: [
    { title: 'isPrime: a loop with an early return', intro: 'For 8 the function returns `false` at the first divisor. For 7 the loop finishes and the last line returns `true`.', code: progF(cpp`
bool isPrime(int n) {
    if (n < 2) {
        return false;
    }
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return false;
        }
    }
    return true;
}`, cpp`
    for (int x = 7; x <= 10; x++) {
        cout << x << ": " << isPrime(x) << endl;
    }`) },
    { title: 'Returned values inside a bigger sum', intro: 'A shop bill: two calls to `cost`, then plus delivery.', code: progF(cpp`
int cost(int price, int qty) {
    return price * qty;
}`, cpp`
    int bill = cost(120, 2) + cost(45, 4) + 150;
    cout << "Bill: Rs " << bill << endl;`) },
  ],
  think: {
    title: 'Average of three marks',
    problem: 'Read three marks and print their average using a function `average(a, b, c)`. Input `70 80 90` → `Average: 80`.',
    steps: [
      { text: 'Decide the header: three whole numbers go in, a decimal comes out → `double average(int a, int b, int c)`.', lines: [4] },
      { text: 'Inside: add the three parameters.', lines: [5] },
      { text: 'Divide by `3.0` (not 3, so the decimal part is kept) and return it.', lines: [6] },
      { text: 'In main: read the marks.', lines: [10, 11] },
      { text: 'Call the function with the three marks as arguments and store the answer.', lines: [12] },
      { text: 'Print it.', lines: [13] },
    ],
    code: progF(cpp`
double average(int a, int b, int c) {
    int sum = a + b + c;
    return sum / 3.0;
}`, cpp`
    int m1, m2, m3;
    cin >> m1 >> m2 >> m3;
    double avg = average(m1, m2, m3);
    cout << "Average: " << avg << endl;`),
    input: '70 80 90\n',
    why: 'The values of `m1, m2, m3` are **copied** into `a, b, c` in the new frame. The function does not know or care what the caller called them.',
    yourTurn: {
      id: 'params-return-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the marks `50 65 71`.',
      code: progF(cpp`
double average(int a, int b, int c) {
    int sum = a + b + c;
    return sum / 3.0;
}`, cpp`
    int m1, m2, m3;
    cin >> m1 >> m2 >> m3;
    double avg = average(m1, m2, m3);
    cout << "Average: " << avg << endl;`),
      input: '50 65 71\n',
      vars: ['m1', 'm2', 'm3', 'sum', 'avg'],
      hints: ['50 + 65 + 71 = 186.', '186 / 3.0 = 62.'],
      explain: '`sum` = 186 inside `average`, it returns 62, and main stores it in `avg`. Output: `Average: 62`.',
    },
  },
  practice: [
    { id: 'params-return-q1', kind: 'predict', prompt: 'Predict the output.', code: progF(cpp`
int twice(int x) {
    return x * 2;
}`, cpp`
    cout << twice(3) << " " << twice(twice(3)) << " " << twice(3) + 1;`), hints: ['`twice(twice(3))`: the inner call is done first.'], explain: '`6`, then `twice(6)` = `12`, then `6 + 1` = `7`. Output: `6 12 7`.' },
    { id: 'params-return-q2', kind: 'mcq', tag: 'tricky', prompt: 'Same program. How many times is `twice` called in total?', code: progF(cpp`
int twice(int x) {
    return x * 2;
}`, cpp`
    cout << twice(3) << " " << twice(twice(3)) << " " << twice(3) + 1;`), options: ['3', '4', '5', '6'], answer: 1, hints: ['`twice(twice(3))` contains two calls.'], explain: '1 + 2 + 1 = **4** calls. Step through it: the frame for `twice` appears four times.' },
    { id: 'params-return-q3', kind: 'predict', prompt: '`return` ends the function at once. Predict the output.', code: progF(cpp`
int check(int n) {
    cout << "A";
    if (n > 5) {
        return 1;
    }
    cout << "B";
    return 0;
}`, cpp`
    int r1 = check(8);
    int r2 = check(2);
    cout << " " << r1 << r2;`), hints: ['For 8, `return 1` runs, so `cout << "B"` is skipped.'], explain: '`check(8)` prints `A` and returns 1. `check(2)` prints `A`, then `B`, and returns 0. Output: `AAB 10`.' },
    { id: 'params-return-q4', kind: 'bug', prompt: 'This does not compile. Find the line g++ complains about.', code: progF(cpp`
void area(int w, int h) {
    return w * h;
}`, cpp`
    int a = area(4, 5);
    cout << a;`), bugLine: 5, options: ['The return type must be `int`, not `void`', 'Remove the `return`', 'Use `area(4 5)` without a comma', 'Parameters need `&`'], answer: 0, fixed: progF(cpp`
int area(int w, int h) {
    return w * h;
}`, cpp`
    int a = area(4, 5);
    cout << a;`), hints: ['What does `void` promise about the value that comes back?'], explain: 'A `void` function cannot return a value (*return-statement with a value, in function returning void*). The answer is a whole number, so the return type is `int`.' },
    { id: 'params-return-q5', kind: 'blanks', prompt: 'Complete `isEven` and the call. Input `14` → `14 is even`.', code: progF(cpp`
bool isEven(int n) {
    return n % 2 [[1]] 0;
}`, cpp`
    int num;
    cin >> num;
    if ([[2]](num)) {
        cout << num << " is even";
    } else {
        cout << num << " is odd";
    }`), blanks: [{ answers: ['=='] }, { answers: ['isEven'] }], chips: ['==', '=', '!=', 'isEven', 'bool'], input: '14\n', hints: ['`n % 2 == 0` is already true or false, so you can return it directly.'], explain: '`return n % 2 == 0;` gives back true or false. The call `isEven(num)` can go straight into the `if`.' },
    { id: 'params-return-q6', kind: 'bug', prompt: 'This does not compile. Find the line.', code: progF(cpp`
int add(int a, int b) {
    return a + b;
}`, cpp`
    int x = 4;
    cout << add(x) << endl;`), bugLine: 10, options: ['`add` needs two arguments, e.g. `add(x, 6)`', 'Change `int add` to `void add`', 'Rename `x` to `a`', 'Remove `endl`'], answer: 0, fixed: progF(cpp`
int add(int a, int b) {
    return a + b;
}`, cpp`
    int x = 4;
    cout << add(x, 6) << endl;`), hints: ['Count the parameters, then count the arguments.'], explain: 'Two parameters → two arguments: *too few arguments to function*. The argument names do not have to match (`x` is fine for `a`).' },
    { id: 'params-return-q7', kind: 'paths', prompt: 'A grade function with three `return`s. Find an input for every return.', code: progF(cpp`
char grade(int m) {
    if (m >= 80) {
        return 'A';
    } else if (m >= 60) {
        return 'B';
    }
    return 'C';
}`, cpp`
    int m;
    cin >> m;
    cout << "Grade " << grade(m);`), paths: [{ label: 'returns `A`', line: 6 }, { label: 'returns `B`', line: 8 }, { label: 'returns `C`', line: 10 }], start: '65', hints: ['Only ONE return runs per call.'], explain: 'e.g. 85 → A, 65 → B, 40 → C. The first `return` reached ends the call.' },
    { id: 'params-return-q8', kind: 'parsons', tag: 'real life', prompt: 'A cube-shaped water tank has side 3 m. Build a program with `cube(n)` that prints `Volume: 27`.', lines: ['#include <iostream>', 'using namespace std;', 'int cube(int n) {', '    return n * n * n;', '}', 'int main() {', '    int side = 3;', '    cout << "Volume: " << cube(side) << endl;', '    return 0;', '}'], distractors: ['void cube(int n) {', '    return;'], hints: ['The function gives back a whole number.'], explain: '`int cube(int n)` returns `n * n * n`; main prints the call directly.' },
  ],
  cheatsheet: [
    { code: 'int f(int a, int b) { return a + b; }', text: 'parameters in, one value out' },
    { code: 'x = f(2, 3) * 10;', text: 'the call is replaced by its return value' },
    { code: 'return', text: 'ends the function immediately' },
    { code: 'bool isEven(int n)', text: 'yes/no functions return true or false — use them straight in an `if`' },
  ],
};

// ------------------------------------------------------------------ Level: pass-by-reference
const F3: Level = {
  id: 'pass-by-reference',
  kind: 'lesson',
  title: 'Pass by value vs by reference',
  tagline: 'By value the function gets a photocopy. By reference (`&`) it gets the original box. See the arrow in the visualizer.',
  minutes: 25,
  objectives: [
    'You can predict why a change to a value parameter does not come back',
    'You can use `&` to let a function change the caller’s variable (swap, two results)',
    'You can pass text cheaply with `const string&`',
  ],
  learn: [
    { t: 'p', text: 'You lend your class notes to a friend. **By value**: you give a *photocopy*. Your friend can scribble on it — your notes stay clean. **By reference**: you give the *original notebook*. Whatever your friend writes, you will see it.' },
    { t: 'viz', title: 'By value: the function changes a copy', code: progF(cpp`
void addBonus(int marks) {
    marks = marks + 5;
    cout << "Inside: " << marks << endl;
}`, cpp`
    int m = 70;
    addBonus(m);
    cout << "Outside: " << m << endl;`) },
    { t: 'callout', tone: 'info', title: 'Two boxes', text: 'The frame for `addBonus` has its **own** box `marks` with a copy of 70. It becomes 75, and when the function ends that box is thrown away. `m` in main never changed.' },
    { t: 'syntax', title: 'A reference parameter', code: 'void addBonus(int &marks)', parts: [
      { token: 'int &marks', text: '`&` means *`marks` is another name for the caller’s box*. No copy is made' },
    ] },
    { t: 'viz', title: 'By reference: the same box', code: progF(cpp`
void addBonus(int &marks) {
    marks = marks + 5;
    cout << "Inside: " << marks << endl;
}`, cpp`
    int m = 70;
    addBonus(m);
    cout << "Outside: " << m << endl;`) },
    { t: 'callout', tone: 'key', title: 'The arrow', text: 'In the call stack a reference parameter is drawn as an **arrow** to the caller’s variable. Changing `marks` changes `m`, because they are the same box.' },
    { t: 'compare', items: [
      { title: 'swap by value — does nothing', good: false, code: progF(cpp`
void swapNums(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}`, cpp`
    int x = 3, y = 8;
    swapNums(x, y);
    cout << x << " " << y;`), note: 'Prints `3 8`: only the copies were swapped.' },
      { title: 'swap by reference — works', good: true, code: progF(cpp`
void swapNums(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}`, cpp`
    int x = 3, y = 8;
    swapNums(x, y);
    cout << x << " " << y;`), note: 'Prints `8 3`: `a` IS x and `b` IS y.' },
    ] },
    { t: 'callout', tone: 'tip', title: 'Two answers from one function', text: '`return` can send back only ONE value. Need two (like the smallest AND the largest)? Give the function two reference parameters and let it fill them in. See the *Watch* demo `minMax`.' },
    { t: 'table', head: ['Parameter', 'Copy made?', 'Can change the caller’s variable?', 'Can you pass `70` or `"Ali"`?'], rows: [
      ['`int marks`', 'yes', 'no', 'yes'],
      ['`int &marks`', 'no', '**yes**', 'no — it needs a variable'],
      ['`const string &name`', 'no', 'no (read only)', 'yes'],
    ] },
    { t: 'callout', tone: 'warn', title: 'A reference needs a variable', text: 'With `void addBonus(int &marks)`, the call `addBonus(70);` does not compile: there is no box called 70 to point at.' },
    { t: 'callout', tone: 'info', title: 'const string& — cheap and safe', text: 'Copying a long string takes time. `const string &name` passes the original (no copy) and `const` promises the function will not change it. Use it for text you only read.' },
  ],
  ways: {
    goal: 'Double the number `n = 6` with the help of a function, so that main prints `12`.',
    items: [
      { title: 'Return the new value', code: progF(cpp`
int doubled(int x) {
    return x * 2;
}`, cpp`
    int n = 6;
    n = doubled(n);
    cout << n << endl;`), note: 'By value; main stores the answer back into n.' },
      { title: 'Change it by reference', code: progF(cpp`
void doubleIt(int &x) {
    x = x * 2;
}`, cpp`
    int n = 6;
    doubleIt(n);
    cout << n << endl;`) },
      { title: 'Reference with a compound operator', code: progF(cpp`
void doubleIt(int &x) {
    x *= 2;
}`, cpp`
    int n = 6;
    doubleIt(n);
    cout << n << endl;`) },
      { title: 'Reference + returned value', code: progF(cpp`
int doubled(int x) {
    return x + x;
}

void doubleIt(int &x) {
    x = doubled(x);
}`, cpp`
    int n = 6;
    doubleIt(n);
    cout << n << endl;`), note: 'One function can use another.' },
    ],
    takeaway: 'Two honest designs: *return the answer* (the caller decides where to put it) or *take a reference* (the function changes the box itself). Returning is usually clearer; references are for swap-like jobs and for more than one result.',
    check: { id: 'pass-by-reference-ways-check', kind: 'mcq', prompt: 'With `int n = 6;`, which one leaves `n` still 6?', options: ['`void doubleIt(int x) { x = x * 2; }` then `doubleIt(n);`', '`void doubleIt(int &x) { x = x * 2; }` then `doubleIt(n);`', '`int doubled(int x) { return x * 2; }` then `n = doubled(n);`', '`void doubleIt(int &x) { x += x; }` then `doubleIt(n);`'], answer: 0, explain: 'Without `&`, `x` is a copy. It becomes 12 and is thrown away when the function ends.' },
  },
  watch: [
    { title: 'minMax: two results through references', intro: 'Watch `lo` and `hi` — they are arrows to `small` and `big` in main.', code: progF(cpp`
void minMax(int a, int b, int c, int &lo, int &hi) {
    lo = a;
    hi = a;
    if (b < lo) lo = b;
    if (c < lo) lo = c;
    if (b > hi) hi = b;
    if (c > hi) hi = c;
}`, cpp`
    int small = 0, big = 0;
    minMax(7, 2, 9, small, big);
    cout << "Min " << small << ", Max " << big << endl;`) },
    { title: 'const string&: read the name, do not copy it', intro: 'A literal like `"Hamza"` works too, because the parameter is `const`.', code: progF(cpp`
void badge(const string &name, int roll) {
    cout << "[" << roll << "] " << name << endl;
}`, cpp`
    string a = "Ayesha", b = "Bilal";
    badge(a, 1);
    badge(b, 2);
    badge("Hamza", 3);`) },
  ],
  think: {
    title: 'Minutes to hours',
    problem: 'A bus journey takes some minutes. Write `split(total, h, m)` that turns total minutes into hours and minutes, and print them. Input `135` → `2 h 15 min`.',
    steps: [
      { text: 'Two answers (hours AND minutes) → one `return` is not enough. Use two reference parameters `&h` and `&m`.', lines: [4] },
      { text: 'Hours = total / 60 (whole division).', lines: [5] },
      { text: 'Minutes left over = total % 60.', lines: [6] },
      { text: 'In main: read the total and make two boxes for the answers.', lines: [10, 11, 12] },
      { text: 'Call `split` — `h` and `m` become arrows to `hours` and `mins`.', lines: [13] },
      { text: 'Print the two boxes, now filled in.', lines: [14] },
    ],
    code: progF(cpp`
void split(int total, int &h, int &m) {
    h = total / 60;
    m = total % 60;
}`, cpp`
    int total;
    cin >> total;
    int hours = 0, mins = 0;
    split(total, hours, mins);
    cout << hours << " h " << mins << " min" << endl;`),
    input: '135\n',
    why: '`total` is a copy (the function only reads it). `h` and `m` are references because the function must write into main’s boxes.',
    yourTurn: {
      id: 'pass-by-reference-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with 200 minutes. Watch `hours` and `mins` change while `split` is running.',
      code: progF(cpp`
void split(int total, int &h, int &m) {
    h = total / 60;
    m = total % 60;
}`, cpp`
    int total;
    cin >> total;
    int hours = 0, mins = 0;
    split(total, hours, mins);
    cout << hours << " h " << mins << " min" << endl;`),
      input: '200\n',
      vars: ['total', 'hours', 'mins'],
      hints: ['200 / 60 = 3 (whole division).', '200 % 60 = 20.'],
      explain: 'Writing to `h` writes to `hours` (3); writing to `m` writes to `mins` (20). Output: `3 h 20 min`.',
    },
  },
  practice: [
    { id: 'pass-by-reference-q1', kind: 'predict', prompt: 'One value parameter, one reference parameter. Predict the output.', code: progF(cpp`
void f(int a, int &b) {
    a = a + 10;
    b = b + 10;
}`, cpp`
    int x = 1, y = 1;
    f(x, y);
    cout << x << " " << y;`), hints: ['Which parameter has the `&`?'], explain: '`a` is a copy of x, so x stays 1. `b` is y itself, so y becomes 11. Output: `1 11`.' },
    { id: 'pass-by-reference-q2', kind: 'bug', prompt: 'Two marks should be put in order (smaller first), but it prints `90 45`. Find the line.', code: progF(cpp`
void order(int a, int b) {
    if (a > b) {
        int t = a;
        a = b;
        b = t;
    }
}`, cpp`
    int m1 = 90, m2 = 45;
    order(m1, m2);
    cout << m1 << " " << m2;`), bugLine: 4, options: ['The parameters need `&`: `void order(int &a, int &b)`', 'Change `a > b` to `a < b`', 'Remove the variable `t`', 'Call it as `order(m2, m1)`'], answer: 0, fixed: progF(cpp`
void order(int &a, int &b) {
    if (a > b) {
        int t = a;
        a = b;
        b = t;
    }
}`, cpp`
    int m1 = 90, m2 = 45;
    order(m1, m2);
    cout << m1 << " " << m2;`), hints: ['The swap inside is correct. Does it reach main?'], explain: 'The swap works on copies. Without `&` the changes stay in the frame of `order` and vanish at `}`.' },
    { id: 'pass-by-reference-q3', kind: 'blanks', prompt: 'Complete the swap function. Output: `5 3`.', code: progF(cpp`
void swapNums(int [[1]]a, int [[2]]b) {
    int temp = a;
    a = [[3]];
    b = temp;
}`, cpp`
    int x = 3, y = 5;
    swapNums(x, y);
    cout << x << " " << y;`), blanks: [{ answers: ['&'] }, { answers: ['&'] }, { answers: ['b'] }], chips: ['&', '*', 'a', 'b', 'temp'], output: '5 3', hints: ['Both parameters must be the caller’s boxes.', 'Save a in temp first, then a takes b’s value.'], explain: '`int &a, int &b`, then the three-step swap with `temp`.' },
    { id: 'pass-by-reference-q4', kind: 'mcq', prompt: 'Given `void addOne(int &x) { x++; }` and `int n = 5;`, which call does NOT compile?', options: ['`addOne(5);`', '`addOne(n);`', '`addOne(n); addOne(n);`', '`{ int k = 1; addOne(k); }`'], answer: 0, hints: ['A reference must point at a real box.'], explain: '`5` is not a variable, so there is no box for `x` to refer to (*cannot bind non-const lvalue reference to an rvalue*).' },
    { id: 'pass-by-reference-q5', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'Add sales tax to two prices. Dry run.', code: progF(cpp`
void addTax(double &price, double rate) {
    price = price + price * rate / 100;
}`, cpp`
    double a = 200, b = 500;
    addTax(a, 10);
    addTax(b, 5);
    cout << a << " " << b;`), vars: ['a', 'b', 'rate'], hints: ['200 + 200 × 10 / 100 = 220.', '`price` is an arrow — which box does it point to in each call?'], explain: 'First call: `price` is a → 220. Second call: `price` is b → 525. Output: `220 525`.' },
    { id: 'pass-by-reference-q6', kind: 'predict', prompt: 'How many times is `grow` called, and what is printed?', code: progF(cpp`
void grow(int &n) {
    n = n * 2;
}`, cpp`
    int k = 3;
    grow(k);
    grow(k);
    grow(k);
    cout << k;`), hints: ['Each call doubles the SAME box.'], explain: '3 calls: 3 → 6 → 12 → 24. Output: `24`. Without `&` it would print 3.' },
    { id: 'pass-by-reference-q7', kind: 'parsons', prompt: 'Build a program where `addBonus` really changes the marks: 70 → prints `75`.', lines: ['#include <iostream>', 'using namespace std;', 'void addBonus(int &marks) {', '    marks = marks + 5;', '}', 'int main() {', '    int m = 70;', '    addBonus(m);', '    cout << m << endl;', '    return 0;', '}'], distractors: ['void addBonus(int marks) {', '    addBonus(70);'], hints: ['For the change to come back, the parameter must be a reference.', 'A reference cannot take a literal like 70.'], explain: '`int &marks` makes `marks` another name for `m`.' },
    { id: 'pass-by-reference-q8', kind: 'bug', prompt: 'This does not compile. Find the line.', code: progF(cpp`
void shout(const string &s) {
    s = s + "!";
    cout << s << endl;
}`, cpp`
    string msg = "Goal";
    shout(msg);`), bugLine: 5, options: ['`s` is `const` — make a new string instead: `cout << s + "!"`', 'Remove the `&`', 'Use `\'!\'` instead of `"!"`', 'Pass `"Goal"` directly'], answer: 0, fixed: progF(cpp`
void shout(const string &s) {
    cout << s + "!" << endl;
}`, cpp`
    string msg = "Goal";
    shout(msg);`), hints: ['What does `const` promise?'], explain: '`const` means read only: assigning to `s` is an error. Build the new text in the `cout` instead. (Removing `const` would compile too — but then the function would change `msg` in main.)' },
  ],
  cheatsheet: [
    { code: 'void f(int x)', text: 'by value — x is a copy; changes do not come back' },
    { code: 'void f(int &x)', text: 'by reference — x IS the caller’s box (an arrow in the stack)' },
    { code: 'void f(int a, int &lo, int &hi)', text: 'more than one result → reference parameters' },
    { code: 'void f(const string &s)', text: 'no copy, read only — the best way to pass text you only read' },
  ],
};

// ------------------------------------------------------------------ Level: scope-lifetime
const F4: Level = {
  id: 'scope-lifetime',
  kind: 'lesson',
  title: 'Scope and lifetime',
  tagline: 'Where can a variable be seen, and how long does it live? Every call gets fresh boxes that disappear at `}`.',
  minutes: 20,
  objectives: [
    'You can tell local variables from global variables',
    'You can explain why the same name in two functions means two different boxes',
    'You can say when a variable is destroyed, and why globals are risky',
  ],
  learn: [
    { t: 'p', text: 'Every classroom has its own whiteboard. What you write on the board in Room 1 cannot be seen in Room 2, and it is wiped at the end of the lesson. A **local variable** is like that board: it belongs to one function (one block `{ }`), and it is wiped when that block ends. A **global variable** is like the notice board in the corridor: everyone can read it — and everyone can scribble on it.' },
    { t: 'viz', title: 'Same name, three different boxes', code: progF(cpp`
void kitchen() {
    int count = 3;
    cout << "kitchen count = " << count << endl;
}

void bedroom() {
    int count = 10;
    cout << "bedroom count = " << count << endl;
}`, cpp`
    int count = 1;
    kitchen();
    bedroom();
    cout << "main count = " << count << endl;`) },
    { t: 'callout', tone: 'key', title: 'Scope = where; lifetime = how long', text: '**Scope**: a local variable can only be used inside the `{ }` where it was made. **Lifetime**: it is created when that line runs and destroyed at the closing `}`. In the dry run, watch the frame of `kitchen` disappear together with its `count`.' },
    { t: 'viz', title: 'A local variable starts again on every call', code: progF(cpp`
void visit() {
    int visits = 0;
    visits++;
    cout << "visits = " << visits << endl;
}`, cpp`
    visit();
    visit();
    visit();`) },
    { t: 'compare', items: [
      { title: 'Local counter', good: false, code: progF(cpp`
void visit() {
    int visits = 0;
    visits++;
    cout << visits << " ";
}`, cpp`
    visit();
    visit();
    visit();`), note: 'Prints `1 1 1 `: a new box is made — and set to 0 — at every call.' },
      { title: 'Global counter', good: true, code: progF(cpp`
int visits = 0;

void visit() {
    visits++;
    cout << visits << " ";
}`, cpp`
    visit();
    visit();
    visit();`), note: 'Prints `1 2 3 `: the box lives for the whole program.' },
    ] },
    { t: 'h', text: 'Shadowing' },
    { t: 'p', text: 'If a function makes a local variable with the **same name** as a global one, the local one *hides* (shadows) the global inside that function. The global box is still there — it just cannot be reached by that name.' },
    { t: 'table', head: ['Kind', 'Made where', 'Who can use it', 'Destroyed when'], rows: [
      ['local variable', 'inside a function or block', 'only code inside that `{ }`', 'the block ends'],
      ['parameter', 'in the function header', 'only that function', 'the function returns'],
      ['global variable', 'outside all functions (top of file)', 'every function below it', 'the program ends'],
    ] },
    { t: 'callout', tone: 'warn', title: 'Why globals are risky', text: 'Any function can change a global. When its value is wrong, the bug could be *anywhere*. Functions that use globals are also hard to reuse. Prefer **parameters in, return value out**; use a global only for true constants like `const double PI = 3.14159;`.' },
    { t: 'callout', tone: 'info', title: 'Blocks count too', text: 'A variable made inside a loop or an `if` block dies at that block’s `}`. `for (int i = 0; …)` — the `i` does not exist after the loop.' },
  ],
  ways: {
    goal: 'Call `order()` three times and print `Orders: 3` at the end.',
    items: [
      { title: 'Reference parameter', code: progF(cpp`
void order(int &count) {
    count++;
}`, cpp`
    int count = 0;
    order(count);
    order(count);
    order(count);
    cout << "Orders: " << count << endl;`), note: 'main owns the counter and lends it to the function.' },
      { title: 'Return the new count', code: progF(cpp`
int order(int count) {
    return count + 1;
}`, cpp`
    int count = 0;
    count = order(count);
    count = order(count);
    count = order(count);
    cout << "Orders: " << count << endl;`) },
      { title: 'Main counts the calls', code: progF(cpp`
void order() {
    cout << "Order placed" << endl;
}`, cpp`
    int count = 0;
    for (int i = 0; i < 3; i++) {
        order();
        count++;
    }
    cout << "Orders: " << count << endl;`) },
      { title: 'A global counter', code: progF(cpp`
int count = 0;

void order() {
    count++;
}`, cpp`
    order();
    order();
    order();
    cout << "Orders: " << count << endl;`), note: 'Works, but any other function could also change `count`.' },
    ],
    takeaway: 'The counter must live somewhere that survives between calls: in main (passed by reference or returned) or globally. A local inside `order` would be reset every time.',
    check: { id: 'scope-lifetime-ways-check', kind: 'mcq', prompt: 'Which design can NOT give `Orders: 3`?', options: ['`order()` makes `int count = 0; count++;` and main prints `count`', 'main has `int count = 0;` and calls `order(count)` with `int &count`', 'main does `count = order(count);` three times', 'a global `int count = 0;` increased inside `order()`'], answer: 0, explain: 'That `count` is local to `order`: it is reset to 0 on every call and destroyed at `}`. main cannot even see it — it does not compile.' },
  },
  watch: [
    { title: 'Global vs a shadowing local', intro: '`bonus` changes the global `score`. `show` makes its own local `score` that hides the global one.', code: progF(cpp`
int score = 50;

void bonus() {
    score = score + 10;
}

void show() {
    int score = 5;
    cout << "local score: " << score << endl;
}`, cpp`
    bonus();
    show();
    cout << "global score: " << score << endl;`) },
    { title: 'Block scope inside a loop', intro: '`square` is created and destroyed on every turn of the loop; `i` dies when the loop ends.', code: prog(cpp`
    int total = 0;
    for (int i = 1; i <= 3; i++) {
        int square = i * i;
        total += square;
    }
    cout << "total = " << total << endl;`) },
  ],
  think: {
    title: 'Two boxes named total',
    problem: 'A shop bill has two lines: 2 items at Rs 120 and 3 items at Rs 50. Use `lineTotal(price, qty)` for each line and add them into a grand total in main. Both functions may use the name `total`.',
    steps: [
      { text: 'The helper works out one line of the bill in its OWN local `total` and returns it.', lines: [4, 5, 6] },
      { text: 'main has a different `total` for the grand total, starting at 0.', lines: [10] },
      { text: 'Add the first line: the call makes a frame, returns 240, the frame (and its `total`) is destroyed.', lines: [11] },
      { text: 'Same for the second line: a brand-new frame returns 150.', lines: [12] },
      { text: 'Print main’s `total`.', lines: [13] },
    ],
    code: progF(cpp`
int lineTotal(int price, int qty) {
    int total = price * qty;
    return total;
}`, cpp`
    int total = 0;
    total += lineTotal(120, 2);
    total += lineTotal(50, 3);
    cout << "Grand total: " << total << endl;`),
    why: 'The two `total`s never mix: one lives in main’s frame for the whole program, the other is created and destroyed on each call.',
    yourTurn: {
      id: 'scope-lifetime-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Now the bill is 3 × Rs 80 and 4 × Rs 25. The `total` column shows whichever `total` is in the top frame at that moment.',
      code: progF(cpp`
int lineTotal(int price, int qty) {
    int total = price * qty;
    return total;
}`, cpp`
    int total = 0;
    total += lineTotal(80, 3);
    total += lineTotal(25, 4);
    cout << "Grand total: " << total << endl;`),
      vars: ['price', 'qty', 'total'],
      hints: ['Inside the first call, the local `total` is 240. Back in main, main’s `total` becomes 0 + 240.', 'The second call has a NEW local `total` = 100.'],
      explain: 'Local totals 240 and 100; main’s total goes 0 → 240 → 340. Output: `Grand total: 340`.',
    },
  },
  practice: [
    { id: 'scope-lifetime-q1', kind: 'predict', tag: 'tricky', prompt: 'A global and a local with the same name. Predict the output.', code: progF(cpp`
int x = 10;

void f() {
    int x = 20;
    x++;
}

void g() {
    x++;
}`, cpp`
    f();
    g();
    cout << x;`), hints: ['Inside `f`, which `x` does `x++` change?'], explain: '`f` changes its own local x (20 → 21), then that box is destroyed. `g` has no local x, so it changes the global: 10 → 11. Output: `11`.' },
    { id: 'scope-lifetime-q2', kind: 'bug', prompt: 'This does not compile. Find the line.', code: progF(cpp`
void setScore() {
    int score = 90;
}`, cpp`
    setScore();
    cout << score;`), bugLine: 9, options: ['`score` is local to `setScore`; return it instead and print `getScore()`', 'Add `int` before `setScore();`', 'Move `cout` inside `setScore` below main', 'Write `score()`'], answer: 0, fixed: progF(cpp`
int getScore() {
    int score = 90;
    return score;
}`, cpp`
    cout << getScore();`), hints: ['Where was `score` made, and when was it destroyed?'], explain: '`score` only exists inside `setScore`, and it is gone after the call: *`score` was not declared in this scope*. Send it out with `return`.' },
    { id: 'scope-lifetime-q3', kind: 'predict', prompt: 'Predict the output. How many times does `int n = 0;` run?', code: progF(cpp`
void tick() {
    int n = 0;
    n++;
    cout << n;
}`, cpp`
    for (int i = 0; i < 3; i++) {
        tick();
    }`), hints: ['Each call makes a new `n`.'], explain: '`int n = 0;` runs 3 times — once per call — so every call prints 1: `111`.' },
    { id: 'scope-lifetime-q4', kind: 'mcq', prompt: 'When is the variable `t` destroyed?', code: progF(cpp`
int addTen(int v) {
    int t = v + 10;
    return t;
}`, cpp`
    int r = addTen(5);
    cout << r;`), options: ['When `addTen` returns (its frame is removed)', 'At the end of the program', 'Never — it stays in memory', 'When main starts'], answer: 0, hints: ['`t` is a local variable of `addTen`.'], explain: '`t` lives in the frame of `addTen`. Its VALUE (15) is copied back to main as the return value; the box itself is destroyed.' },
    { id: 'scope-lifetime-q5', kind: 'bug', prompt: 'We want to print how many numbers were counted. This does not compile. Find the line.', code: prog(cpp`
    for (int i = 0; i < 5; i++) {
        cout << i << " ";
    }
    cout << endl << "Counted: " << i;`), bugLine: 8, options: ['`i` only lives inside the loop; declare it before the loop', 'Add a `;` after the for', 'Change `i < 5` to `i <= 5`', 'Remove `endl`'], answer: 0, fixed: prog(cpp`
    int i;
    for (i = 0; i < 5; i++) {
        cout << i << " ";
    }
    cout << endl << "Counted: " << i;`), hints: ['Where was `i` created?'], explain: '`for (int i …)` makes `i` inside the loop’s scope. Declared before the loop, it survives and holds 5 at the end.' },
    { id: 'scope-lifetime-q6', kind: 'trace', mode: 'vars', prompt: 'A global `coins` and a local `coins`. Dry run.', code: progF(cpp`
int coins = 5;

void spend(int n) {
    coins = coins - n;
}

void earn() {
    int coins = 100;
    coins = coins + 1;
}`, cpp`
    spend(2);
    earn();
    spend(1);
    cout << coins;`), vars: ['coins', 'n'], hints: ['`spend` has no local `coins` → it changes the global.', '`earn` makes its own local `coins` — the global is untouched.'], explain: 'Global: 5 → 3. In `earn` a local goes 100 → 101 and is destroyed. Global: 3 → 2. Output: `2`.' },
    { id: 'scope-lifetime-q7', kind: 'mcq', prompt: 'Why do programmers avoid global variables?', options: ['Any function can change them, so a wrong value could come from anywhere', 'They do not compile in C++', 'They are slower than local variables', 'They are destroyed after each call'], answer: 0, hints: ['Think about finding a bug in a program with 30 functions.'], explain: 'Globals compile and live for the whole program. The problem is control: you cannot tell which function changed them. Parameters and return values make the flow of data visible.' },
    { id: 'scope-lifetime-q8', kind: 'blanks', prompt: 'Remove the global: main owns `points` and lends it to `addPoint`. Output: `2`.', code: progF(cpp`
void addPoint([[1]] points) {
    points = points + 1;
}`, cpp`
    int points = 0;
    addPoint(points);
    addPoint(points);
    cout << points;`), blanks: [{ answers: ['int &', 'int&'] }], chips: ['int', 'int &', 'const int &', 'void'], output: '2', hints: ['The function must change main’s box.'], explain: '`int &points` — a reference. With plain `int` it would print 0; with `const int &` it would not compile.' },
  ],
  cheatsheet: [
    { code: '{ int x; }', text: 'x is local: seen only inside these braces, destroyed at `}`' },
    { code: 'same name in 2 functions', text: 'two different boxes' },
    { code: 'int g = 0; // above all functions', text: 'global: lives the whole program — use rarely' },
    { code: 'local with a global’s name', text: 'shadows (hides) the global inside that block' },
  ],
};

// ------------------------------------------------------------------ Level: overload-default
const F5: Level = {
  id: 'overload-default',
  kind: 'lesson',
  title: 'Prototypes, default arguments and overloading',
  tagline: 'Put main first with prototypes, leave out arguments with defaults, and give one name to several related functions.',
  minutes: 25,
  objectives: [
    'You can declare a prototype above main and define the function below',
    'You can give parameters default values and predict which values are used',
    'You can write overloaded functions and predict which one C++ picks',
  ],
  learn: [
    { t: 'h', text: '1. Prototypes' },
    { t: 'p', text: 'A **prototype** is the function header followed by `;`. It is a promise to the compiler: *a function with this name, these parameters and this return type exists — its body comes later*. Then main can come first and the details can go below it, like a book’s table of contents.' },
    { t: 'syntax', title: 'A prototype', code: 'int cube(int n);', parts: [
      { token: 'int cube(int n)', text: 'the same header as the definition' },
      { token: ';', text: 'a semicolon instead of a body. Parameter names are optional here: `int cube(int);` also works' },
    ] },
    { t: 'viz', title: 'main first, functions below', code: cpp`#include <iostream>
using namespace std;

int cube(int n);
void line(int len);

int main() {
    line(6);
    cout << cube(3) << endl;
    line(6);
    return 0;
}

int cube(int n) {
    return n * n * n;
}

void line(int len) {
    for (int i = 0; i < len; i++) {
        cout << "-";
    }
    cout << endl;
}
` },
    { t: 'callout', tone: 'warn', title: '"was not declared in this scope"', text: 'This error at a call means C++ has not seen the function yet. Fix: move the definition above main, or add a prototype above main.' },
    { t: 'h', text: '2. Default arguments' },
    { t: 'viz', title: 'Leave out the discount → 0 is used', code: progF(cpp`
double price(double amount, double discount = 0) {
    return amount - amount * discount / 100;
}`, cpp`
    cout << price(1000) << endl;
    cout << price(1000, 20) << endl;`) },
    { t: 'list', items: [
      'A default is used only when the caller leaves that argument out.',
      'Arguments fill parameters **from the left**. So defaults must be at the **right end**: `void f(int a, int b = 2, int c = 3)` is fine, `void f(int a = 1, int b)` does not compile.',
      'With a prototype, write the default **in the prototype only**, not again in the definition.',
    ] },
    { t: 'h', text: '3. Overloading' },
    { t: 'viz', title: 'Three functions called area', code: progF(cpp`
int area(int side) {
    return side * side;
}

int area(int w, int h) {
    return w * h;
}

double area(double r) {
    return 3.14 * r * r;
}`, cpp`
    cout << area(4) << endl;
    cout << area(3, 5) << endl;
    cout << area(2.0) << endl;`) },
    { t: 'table', head: ['How C++ picks an overload', 'Example'], rows: [
      ['1. the number of arguments', '`area(3, 5)` → the one with two parameters'],
      ['2. the types of the arguments — an exact match wins', '`area(2.0)` → `double`; `area(4)` → `int`'],
      ['3. otherwise the closest conversion', '`area(\'A\')` → `int` (a char is promoted to int)'],
      ['the return type does NOT count', '`int f(int)` and `double f(int)` together do not compile'],
    ] },
    { t: 'callout', tone: 'info', title: 'Ambiguous calls', text: 'If two overloads fit equally well, g++ stops with *call of overloaded … is ambiguous*. Example: `f(long)` and `f(double)` called with an `int`. Keep overloads clearly different.' },
  ],
  ways: {
    goal: 'Make `line()` print 10 dashes and `line(4)` print 4 dashes.',
    items: [
      { title: 'A default argument', code: progF(cpp`
void line(int n = 10) {
    for (int i = 0; i < n; i++) {
        cout << "-";
    }
    cout << endl;
}`, cpp`
    line();
    line(4);`) },
      { title: 'Two overloads', code: progF(cpp`
void line(int n) {
    for (int i = 0; i < n; i++) {
        cout << "-";
    }
    cout << endl;
}

void line() {
    line(10);
}`, cpp`
    line();
    line(4);`), note: 'The version without parameters just calls the other one.' },
      { title: 'Prototype with the default, body below main', code: cpp`#include <iostream>
using namespace std;

void line(int n = 10);

int main() {
    line();
    line(4);
    return 0;
}

void line(int n) {
    for (int i = 0; i < n; i++) {
        cout << "-";
    }
    cout << endl;
}
`, note: 'The default lives in the prototype only.' },
      { title: 'Two prototypes (overloads) above main', code: cpp`#include <iostream>
using namespace std;

void line();
void line(int n);

int main() {
    line();
    line(4);
    return 0;
}

void line() {
    line(10);
}

void line(int n) {
    for (int i = 0; i < n; i++) {
        cout << "-";
    }
    cout << endl;
}
` },
    ],
    takeaway: 'A default argument is the shortest way when one value is "usually" the same. Overloads are better when the versions do really different work.',
    check: { id: 'overload-default-ways-check', kind: 'mcq', prompt: 'Which one does NOT compile?', options: ['Prototype `void line(int n = 10);` AND definition `void line(int n = 10) { … }`', 'Prototype `void line(int n = 10);` and definition `void line(int n) { … }`', '`void line(int n = 10) { … }` above main, no prototype', 'Two overloads `void line()` and `void line(int n)`'], answer: 0, explain: 'The default may be given only once. Writing it in both places gives *default argument given for parameter 1*.' },
  },
  watch: [
    { title: 'Which show() is called?', intro: 'Four overloads; C++ picks one by the argument type. Watch which frame appears.', code: progF(cpp`
void show(int x) {
    cout << "int: " << x << endl;
}

void show(double x) {
    cout << "double: " << x << endl;
}

void show(char c) {
    cout << "char: " << c << endl;
}

void show(string s) {
    cout << "string: " << s << endl;
}`, cpp`
    show(7);
    show(7.5);
    show('K');
    string city = "Karachi";
    show(city);`) },
    { title: 'Defaults filled in from the left', intro: 'Watch the frame: which parameters get the caller’s values, and which get defaults?', code: progF(cpp`
void ticket(string city, int seats = 1, char cls = 'E') {
    cout << city << " x" << seats << " class " << cls << endl;
}`, cpp`
    ticket("Lahore");
    ticket("Karachi", 3);
    ticket("Quetta", 2, 'B');`) },
  ],
  think: {
    title: 'Order total with optional extras',
    problem: 'An online shop: `total(price, qty, delivery)`. Usually `qty` is 1 and delivery is Rs 150. Write main first, with a prototype, and print three orders.',
    steps: [
      { text: 'Prototype above main, with the usual values as defaults (right end only).', lines: [4] },
      { text: 'Only the price → qty = 1, delivery = 150.', lines: [7] },
      { text: 'Price and qty → delivery = 150.', lines: [8] },
      { text: 'All three given → no defaults used (free delivery).', lines: [9] },
      { text: 'The definition below main — no defaults written again.', lines: [13, 14, 15] },
    ],
    code: cpp`#include <iostream>
using namespace std;

double total(double price, int qty = 1, double delivery = 150);

int main() {
    cout << total(500) << endl;
    cout << total(500, 3) << endl;
    cout << total(500, 3, 0) << endl;
    return 0;
}

double total(double price, int qty, double delivery) {
    return price * qty + delivery;
}
`,
    why: 'The caller can only leave arguments out *from the right*. To change the delivery you must also give the qty.',
    yourTurn: {
      id: 'overload-default-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'New prices. Write what each line prints.',
      code: cpp`#include <iostream>
using namespace std;

double total(double price, int qty = 1, double delivery = 150);

int main() {
    cout << total(200) << endl;
    cout << total(200, 2) << endl;
    cout << total(1000, 1, 0) << endl;
    return 0;
}

double total(double price, int qty, double delivery) {
    return price * qty + delivery;
}
`,
      hints: ['`total(200)` → 200 × 1 + 150.', '`total(200, 2)` → 200 × 2 + 150.'],
      explain: '350, 550, 1000.',
    },
  },
  practice: [
    { id: 'overload-default-q1', kind: 'bug', prompt: 'This does not compile. Find the line and the smallest fix.', code: cpp`#include <iostream>
using namespace std;

int main() {
    cout << twice(21) << endl;
    return 0;
}

int twice(int x) {
    return 2 * x;
}
`, bugLine: 5, options: ['Add the prototype `int twice(int x);` above main', 'Add `;` after `int twice(int x)` on line 9', 'Change `int main` to `void main`', 'Write `twice 21`'], answer: 0, fixed: cpp`#include <iostream>
using namespace std;

int twice(int x);

int main() {
    cout << twice(21) << endl;
    return 0;
}

int twice(int x) {
    return 2 * x;
}
`, hints: ['The function exists — but where?'], explain: 'At line 5 C++ has not seen `twice` yet. A prototype above main is the promise it needs.' },
    { id: 'overload-default-q2', kind: 'predict', prompt: 'Default arguments. Predict the output.', code: progF(cpp`
void show(int a, int b = 2, int c = 3) {
    cout << a << b << c << " ";
}`, cpp`
    show(1);
    show(1, 5);
    show(7, 8, 9);`), hints: ['Arguments fill parameters from the left; the rest take defaults.'], explain: '`123 `, `153 `, `789 `. Output: `123 153 789 `.' },
    { id: 'overload-default-q3', kind: 'mcq', prompt: 'Which `area` runs for `area(2.5)`?', code: progF(cpp`
int area(int side) {
    return side * side;
}

double area(double r) {
    return 3.14 * r * r;
}

int area(int w, int h) {
    return w * h;
}`, cpp`
    cout << area(2.5);`), options: ['`double area(double r)`', '`int area(int side)`', '`int area(int w, int h)`', 'It does not compile: ambiguous'], answer: 0, hints: ['One argument → two candidates. Which type matches `2.5` exactly?'], explain: '`2.5` is a double — an exact match. It prints `19.625`.' },
    { id: 'overload-default-q4', kind: 'bug', prompt: 'A default argument lets you pass FEWER arguments. This does not compile. Find the line.', code: progF(cpp`
void greet(string name = "Guest") {
    cout << "Hi " << name << endl;
}`, cpp`
    greet();
    greet("Ali", 2);`), bugLine: 10, options: ['`greet` has only one parameter — call `greet("Ali");`', 'Remove the default `= "Guest"`', 'Change line 9 to `greet("");`', 'Make the parameter `string &name`'], answer: 0, fixed: progF(cpp`
void greet(string name = "Guest") {
    cout << "Hi " << name << endl;
}`, cpp`
    greet();
    greet("Ali");`), hints: ['Count the parameters of `greet`. Count the arguments on each call.'], explain: 'A default can fill in a MISSING argument, but it cannot make room for an extra one: *too many arguments to function*. `greet()` is fine (prints `Hi Guest`).' },
    { id: 'overload-default-q5', kind: 'blanks', prompt: 'Complete the prototype and the definition. Output: `7.5`.', code: cpp`#include <iostream>
using namespace std;

[[1]] half(int n)[[2]]

int main() {
    cout << half(15) << endl;
    return 0;
}

double half(int n) {
    return n / [[3]];
}
`, blanks: [{ answers: ['double'] }, { answers: [';'] }, { answers: ['2.0', '2.0f'] }], chips: ['double', 'int', 'void', ';', '{', '2', '2.0'], output: '7.5\n', hints: ['The prototype must match the definition’s header.', 'A prototype ends with a semicolon.', '15 / 2 would be 7 — integer division.'], explain: '`double half(int n);` — and `n / 2.0` keeps the .5.' },
    { id: 'overload-default-q6', kind: 'predict', tag: 'tricky', prompt: 'Overloading with a char and a text literal. Predict the output.', code: progF(cpp`
void print(int x) {
    cout << "int ";
}

void print(double x) {
    cout << "double ";
}

void print(string s) {
    cout << "string ";
}`, cpp`
    print(5);
    print(5.0);
    print("5");
    print('5');`), hints: ['`\'5\'` is a char. Which is the closest: int or double?', '`"5"` is text — only one overload takes text.'], explain: '`int double string int `. A char is *promoted* to int (a better match than converting it to double).' },
    { id: 'overload-default-q7', kind: 'mcq', prompt: 'Which pair of functions can NOT live together in one program?', options: ['`int f(int x)` and `double f(int x)`', '`int f(int x)` and `int f(double x)`', '`int f(int x)` and `int f(int x, int y)`', '`void f()` and `void f(string s)`'], answer: 0, hints: ['What does C++ look at to choose an overload?'], explain: 'Overloads must differ in their **parameters**. Only the return type differs in the first pair, so a call `f(3)` could not choose.' },
    { id: 'overload-default-q8', kind: 'mcq', tag: 'tricky', prompt: 'How many calls to `biggest` happen in total (count every frame)?', code: progF(cpp`
int biggest(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}

int biggest(int a, int b, int c) {
    return biggest(biggest(a, b), c);
}`, cpp`
    cout << biggest(4, 9) << " " << biggest(7, 3, 5);`), options: ['2', '3', '4', '5'], answer: 2, hints: ['The 3-parameter version calls the 2-parameter version twice.'], explain: '`biggest(4, 9)`: 1 call. `biggest(7, 3, 5)`: 1 call + 2 inner calls = 3. Total **4**. Output: `9 7`.' },
  ],
  cheatsheet: [
    { code: 'int f(int x);', text: 'prototype: declare above main, define below' },
    { code: 'void f(int a, int b = 2);', text: 'default argument — only at the right end, only once' },
    { code: 'int area(int); int area(int, int);', text: 'overloads: same name, different parameters' },
    { code: 'picking an overload', text: 'number of arguments, then exact type, then closest conversion; return type ignored' },
  ],
};

// ------------------------------------------------------------------ Level: recursion
const F6: Level = {
  id: 'recursion',
  kind: 'lesson',
  title: 'Recursion',
  tagline: 'A function that calls itself on a smaller problem. Watch the stack grow frame by frame, hit the base case, and shrink back.',
  minutes: 30,
  objectives: [
    'You can name the base case and the recursive step of a recursive function',
    'You can trace a recursive call on the stack and predict the result',
    'You can count how many calls a recursive function makes',
  ],
  learn: [
    { t: 'p', text: 'You stand in a long queue and want to know your position. You ask the person in front: *"What is your position?"* They ask the person in front of them … until the **first** person says *"1 — nobody is in front of me"*. Then every answer comes back: *"then I am 2"*, *"then I am 3"* … That is **recursion**: solve a problem by asking the *same question* about a *smaller* problem, until it is so small that the answer is obvious.' },
    { t: 'anatomy', code: cpp`int factorial(int n) {
    if (n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`, notes: [
      { lines: [2, 3, 4], label: 'base case', text: 'the smallest problem, answered directly. Without it the calls never stop.' },
      { lines: [5], label: 'recursive step', text: 'solve a smaller problem (`n - 1`) with the same function, then build the answer from it.' },
    ] },
    { t: 'viz', title: 'factorial(4): the stack grows, then shrinks', code: progF(cpp`
int factorial(int n) {
    if (n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`, cpp`
    int f = factorial(4);
    cout << "4! = " << f << endl;`) },
    { t: 'table', head: ['Frame', 'waits for', 'returns'], rows: [
      ['`factorial(4)`', '`4 * factorial(3)`', '4 × 6 = **24**'],
      ['`factorial(3)`', '`3 * factorial(2)`', '3 × 2 = 6'],
      ['`factorial(2)`', '`2 * factorial(1)`', '2 × 1 = 2'],
      ['`factorial(1)`', 'nothing — base case', '**1**'],
    ], caption: 'Read DOWN for the calls going in (the stack grows to 4 frames plus main), then UP for the answers coming back.' },
    { t: 'callout', tone: 'key', title: 'Every call has its own n', text: 'There are four different boxes called `n` at the same time — one in each frame. Each frame waits at its `return` line until the call it made comes back with a value.' },
    { t: 'viz', title: 'Countdown: a void recursive function', code: progF(cpp`
void countdown(int n) {
    if (n == 0) {
        cout << "Go!" << endl;
        return;
    }
    cout << n << " ";
    countdown(n - 1);
}`, cpp`
    countdown(3);`) },
    { t: 'callout', tone: 'warn', title: 'No base case = stack overflow', text: 'If the base case is missing (or the step never gets closer to it, like `factorial(n)` inside `factorial`), the function calls itself forever. Each call adds a frame, memory for the stack runs out, and the program **crashes** (*stack overflow* / *segmentation fault*). Always check: *does every call get closer to the base case?*' },
    { t: 'compare', items: [
      { title: 'Loop version', good: true, code: progF(cpp`
int factorial(int n) {
    int f = 1;
    for (int i = 2; i <= n; i++) {
        f *= i;
    }
    return f;
}`, cpp`
    cout << factorial(5);`), note: 'One frame, a loop inside.' },
      { title: 'Recursive version', good: true, code: progF(cpp`
int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`, cpp`
    cout << factorial(5);`), note: 'Five frames on the stack at the deepest point.' },
    ] },
    { t: 'h', text: 'Two calls in one step: Fibonacci' },
    { t: 'p', text: 'Fibonacci numbers: 0, 1, 1, 2, 3, 5, 8 … each is the sum of the two before it. `fib(n) = fib(n - 1) + fib(n - 2)`. Every call makes **two** more calls, so the number of calls grows very fast: `fib(4)` already makes **9** calls, and `fib(4)` computes `fib(2)` twice. Step through the Watch demo and count the frames.' },
  ],
  ways: {
    goal: 'Add the numbers 1 + 2 + … + n for n = 5 and print `15`.',
    items: [
      { title: 'A loop', code: progF(cpp`
int sumTo(int n) {
    int s = 0;
    for (int i = 1; i <= n; i++) {
        s += i;
    }
    return s;
}`, cpp`
    cout << sumTo(5) << endl;`) },
      { title: 'Recursion, base case 0', code: progF(cpp`
int sumTo(int n) {
    if (n == 0) {
        return 0;
    }
    return n + sumTo(n - 1);
}`, cpp`
    cout << sumTo(5) << endl;`) },
      { title: 'Recursion, base case 1', code: progF(cpp`
int sumTo(int n) {
    if (n == 1) {
        return 1;
    }
    return n + sumTo(n - 1);
}`, cpp`
    cout << sumTo(5) << endl;`), note: 'One call fewer — but `sumTo(0)` would now never stop!' },
      { title: 'Recursion with a ternary', code: progF(cpp`
int sumTo(int n) {
    return (n == 0) ? 0 : n + sumTo(n - 1);
}`, cpp`
    cout << sumTo(5) << endl;`) },
      { title: 'The maths formula', code: progF(cpp`
int sumTo(int n) {
    return n * (n + 1) / 2;
}`, cpp`
    cout << sumTo(5) << endl;`), note: 'No loop and no recursion — the fastest.' },
    ],
    takeaway: 'Anything a simple loop can do, recursion can do too. The recursive version needs a base case and a step that gets smaller.',
    check: { id: 'recursion-ways-check', kind: 'mcq', prompt: 'Which version of `sumTo` would NEVER stop (do not run it!)?', options: ['`if (n == 0) return 0; return n + sumTo(n);`', '`if (n == 0) return 0; return n + sumTo(n - 1);`', '`if (n <= 0) return 0; return n + sumTo(n - 1);`', '`return n == 0 ? 0 : n + sumTo(n - 1);`'], answer: 0, explain: '`sumTo(n)` calls `sumTo(n)` with the SAME n: it never gets closer to the base case. The stack overflows.' },
  },
  watch: [
    { title: 'Sum of digits', intro: '`472 % 10` is the last digit, `472 / 10` removes it.', code: progF(cpp`
int digitSum(int n) {
    if (n < 10) {
        return n;
    }
    return n % 10 + digitSum(n / 10);
}`, cpp`
    cout << digitSum(472) << endl;`) },
    { title: 'fib(4): count the calls', intro: 'Count how many frames for `fib` appear. (Answer: 9.)', code: progF(cpp`
int fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}`, cpp`
    cout << "fib(4) = " << fib(4) << endl;`) },
    { title: 'Print before or after the call?', intro: '`up` prints AFTER its recursive call returns, so the numbers come out in reverse.', code: progF(cpp`
void down(int n) {
    if (n == 0) {
        return;
    }
    cout << n << " ";
    down(n - 1);
}

void up(int n) {
    if (n == 0) {
        return;
    }
    up(n - 1);
    cout << n << " ";
}`, cpp`
    down(3);
    cout << "| ";
    up(3);`) },
  ],
  think: {
    title: 'Power without pow()',
    problem: 'Read a base and an exponent and print base^exp using recursion. Input `2 4` → `16`.',
    steps: [
      { text: 'Smallest problem: anything to the power 0 is 1. That is the base case.', lines: [5, 6, 7] },
      { text: 'Bigger problem: base^exp = base × base^(exp − 1). The exponent gets smaller each call.', lines: [8] },
      { text: 'In main: read the two numbers.', lines: [12, 13] },
      { text: 'Call and print.', lines: [14] },
    ],
    code: progF(cpp`
int power(int base, int exp) {
    if (exp == 0) {
        return 1;
    }
    return base * power(base, exp - 1);
}`, cpp`
    int b, e;
    cin >> b >> e;
    cout << power(b, e) << endl;`),
    input: '2 4\n',
    why: '`power(2, 4)` makes 5 calls: exp = 4, 3, 2, 1, 0. The answers come back 1 → 2 → 4 → 8 → 16.',
    yourTurn: {
      id: 'recursion-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with `3 3`. The `exp` column shows the exp of the newest frame.',
      code: progF(cpp`
int power(int base, int exp) {
    if (exp == 0) {
        return 1;
    }
    return base * power(base, exp - 1);
}`, cpp`
    int b, e;
    cin >> b >> e;
    cout << power(b, e) << endl;`),
      input: '3 3\n',
      vars: ['exp'],
      hints: ['The calls go in with exp = 3, 2, 1, 0.', 'Coming back: 1, 3, 9, 27.'],
      explain: '4 calls to `power`; the base case is reached at exp = 0. Output: `27`.',
    },
  },
  practice: [
    { id: 'recursion-q1', kind: 'mcq', tag: 'tricky', prompt: 'How many times is `fib` called in total when main calls `fib(4)`?', code: progF(cpp`
int fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}`, cpp`
    cout << fib(4);`), options: ['4', '5', '8', '9'], answer: 3, hints: ['Draw a tree: fib(4) → fib(3) and fib(2).', 'fib(3) → fib(2), fib(1). Each fib(2) → fib(1), fib(0).'], explain: 'fib(4) 1, fib(3) 1, fib(2) 2, fib(1) 3, fib(0) 2 → **9** calls. The answer printed is 3.' },
    { id: 'recursion-q2', kind: 'predict', prompt: 'The print is AFTER the recursive call. Predict the output.', code: progF(cpp`
void show(int n) {
    if (n == 0) {
        return;
    }
    show(n - 1);
    cout << n << " ";
}`, cpp`
    show(3);`), hints: ['show(3) must wait for show(2) to finish before it prints.'], explain: 'The deepest call prints first on the way back: `1 2 3 `.' },
    { id: 'recursion-q3', kind: 'bug', prompt: '`factorial(4)` should be 24, but this prints 0. Find the line.', code: progF(cpp`
int factorial(int n) {
    if (n == 0) {
        return 0;
    }
    return n * factorial(n - 1);
}`, cpp`
    cout << factorial(4);`), bugLine: 6, options: ['The base case must return 1, not 0', 'Change `n - 1` to `n + 1`', 'Change `n == 0` to `n == 4`', 'Remove the `return` on line 8'], answer: 0, fixed: progF(cpp`
int factorial(int n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}`, cpp`
    cout << factorial(4);`), hints: ['Everything gets multiplied by what the base case returns.'], explain: '4 × 3 × 2 × 1 × **0** = 0. `0! = 1`, so the base case must return 1.' },
    { id: 'recursion-q4', kind: 'blanks', prompt: 'Complete the recursive digit sum. Output: `13` (4 + 7 + 2).', code: progF(cpp`
int digitSum(int n) {
    if (n [[1]] 10) {
        return n;
    }
    return n % 10 + digitSum(n [[2]] 10);
}`, cpp`
    cout << digitSum(472);`), blanks: [{ answers: ['<'] }, { answers: ['/'] }], chips: ['<', '>', '%', '/', '=='], output: '13', hints: ['A single digit is its own digit sum.', 'Which operator removes the last digit?'], explain: 'Base case `n < 10`; the step adds the last digit (`n % 10`) to the digit sum of the rest (`n / 10`).' },
    { id: 'recursion-q5', kind: 'trace', mode: 'vars', prompt: 'Dry run `factorial(3)`. The `n` column shows the n of the newest frame.', code: progF(cpp`
int factorial(int n) {
    if (n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`, cpp`
    int f = factorial(3);
    cout << f;`), vars: ['n', 'f'], hints: ['The calls go in with n = 3, 2, 1.', 'n == 1 is the base case: it returns 1 straight away.'], explain: 'Answers come back 1 → 2 → 6, and main stores `f = 6`.' },
    { id: 'recursion-q6', kind: 'mcq', prompt: 'What happens when a recursive function has no base case?', options: ['It keeps calling itself, the stack fills up and the program crashes (stack overflow)', 'C++ adds a base case automatically', 'It returns 0', 'It stops after 100 calls'], answer: 0, hints: ['Each call adds a frame. Is there ever a call that does not?'], explain: 'Nothing stops the calls. Each one needs a new frame, memory runs out and the program crashes.' },
    { id: 'recursion-q7', kind: 'parsons', prompt: 'Build a recursive countdown that prints `3 2 1 Go!`.', lines: ['#include <iostream>', 'using namespace std;', 'void countdown(int n) {', '    if (n == 0) {', '        cout << "Go!";', '        return;', '    }', '    cout << n << " ";', '    countdown(n - 1);', '}', 'int main() {', '    countdown(3);', '    return 0;', '}'], distractors: ['    countdown(n);', '    countdown(n + 1);'], hints: ['The base case prints Go! and stops.', 'Print the number BEFORE the smaller call.'], explain: 'Base case first; then print n and call with `n - 1` — the only step that gets closer to 0.' },
    { id: 'recursion-q8', kind: 'predict', tag: 'tricky', prompt: 'The step jumps by 2. Predict the output.', code: progF(cpp`
int f(int n) {
    if (n <= 0) {
        return 0;
    }
    return n + f(n - 2);
}`, cpp`
    cout << f(7);`), hints: ['7 → 5 → 3 → 1 → -1.', 'Why is the base case `n <= 0` and not `n == 0`?'], explain: '7 + 5 + 3 + 1 + 0 = `16` (5 calls). With `n == 0`, the value -1 would skip the base case and never stop.' },
  ],
  cheatsheet: [
    { code: 'if (small) return answer;', text: 'base case — stops the recursion' },
    { code: 'return n * f(n - 1);', text: 'recursive step — must get closer to the base case' },
    { code: 'fib(n-1) + fib(n-2)', text: 'two calls per step → the number of calls explodes' },
    { code: 'no base case', text: 'stack overflow: the program crashes' },
  ],
};

// ------------------------------------------------------------------ Checkpoint
const C7: Level = {
  id: 'checkpoint-functions',
  kind: 'revision',
  title: 'Functions',
  tagline: '**Checkpoint 7.** Real problems solved with functions: bills, grades, temperatures, bank accounts. Count the calls, follow the references, and finish with a small report-card program.',
  minutes: 35,
  objectives: [
    'You can design a function’s header from a problem',
    'You can predict outputs through calls, references, scope and recursion',
    'You can build a small program out of several functions',
  ],
  practice: [
    { id: 'checkpoint-functions-q1', kind: 'blanks', tag: 'real life', prompt: 'A restaurant adds 16% tax to the bill. Complete the function. Output: `Total: 1160`.', code: progF(cpp`
double withTax(double amount) {
    [[1]] amount + amount * 16 / 100;
}`, cpp`
    double bill = 1000;
    cout << "Total: " << [[2]](bill) << endl;`), blanks: [{ answers: ['return'] }, { answers: ['withTax'] }], chips: ['return', 'cout <<', 'withTax', 'bill', 'void'], output: 'Total: 1160\n', hints: ['The function must SEND the answer back.'], explain: '`return amount + amount * 16 / 100;` and the call `withTax(bill)` inside the cout.' },
    { id: 'checkpoint-functions-q2', kind: 'paths', tag: 'real life', prompt: 'A grade function for marks out of 100. Find a mark for every grade.', code: progF(cpp`
string grade(int marks) {
    if (marks >= 85) {
        return "A";
    } else if (marks >= 70) {
        return "B";
    } else if (marks >= 50) {
        return "C";
    }
    return "F";
}`, cpp`
    int m;
    cin >> m;
    cout << "Grade: " << grade(m) << endl;`), paths: [{ label: '`A`', line: 6 }, { label: '`B`', line: 8 }, { label: '`C`', line: 10 }, { label: '`F`', line: 12 }], start: '72', hints: ['One mark from each range: 85+, 70–84, 50–69, below 50.'], explain: 'e.g. 90 → A, 72 → B, 55 → C, 30 → F. Each call reaches exactly one `return`.' },
    { id: 'checkpoint-functions-q3', kind: 'predict', tag: 'real life', prompt: 'Temperature conversion. Predict the output.', code: progF(cpp`
double toF(double c) {
    return c * 9 / 5 + 32;
}`, cpp`
    cout << toF(0) << " " << toF(37) << " " << toF(-40) << endl;`), hints: ['37 × 9 / 5 = 66.6.'], explain: '`32 98.6 -40`. At −40 both scales agree!' },
    { id: 'checkpoint-functions-q4', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'Simple interest on Rs 10000 at 5% for 1, 2 and 3 years. Dry run.', code: progF(cpp`
double interest(double p, double r, int t) {
    return p * r * t / 100;
}`, cpp`
    for (int year = 1; year <= 3; year++) {
        cout << year << ": " << interest(10000, 5, year) << endl;
    }`), vars: ['year', 't'], hints: ['10000 × 5 × 1 / 100 = 500.'], explain: '`t` is a copy of `year` in each call: 500, 1000, 1500. `interest` is called 3 times.' },
    { id: 'checkpoint-functions-q5', kind: 'bug', tag: 'real life', prompt: 'A bank withdrawal should reduce the balance to 3000, but it stays 5000. Find the line.', code: progF(cpp`
bool withdraw(int balance, int amount) {
    if (amount > balance) {
        return false;
    }
    balance = balance - amount;
    return true;
}`, cpp`
    int myBalance = 5000;
    if (withdraw(myBalance, 2000)) {
        cout << "Done. Balance: " << myBalance << endl;
    }`), bugLine: 4, options: ['`balance` must be a reference: `int &balance`', 'The function must be `void`', '`amount` must be a reference', 'Change `>` to `<`'], answer: 0, fixed: progF(cpp`
bool withdraw(int &balance, int amount) {
    if (amount > balance) {
        return false;
    }
    balance = balance - amount;
    return true;
}`, cpp`
    int myBalance = 5000;
    if (withdraw(myBalance, 2000)) {
        cout << "Done. Balance: " << myBalance << endl;
    }`), hints: ['The function returns true — so it thinks it worked. Where did the new balance go?'], explain: 'By value, only a copy of the balance was reduced. With `int &balance` the change reaches `myBalance`. (`amount` is only read, so a copy is fine.)' },
    { id: 'checkpoint-functions-q6', kind: 'mcq', tag: 'real life', prompt: 'A cricket app needs a function that gives back the run rate (runs per over, maybe with decimals) from runs and overs. Which header fits best?', options: ['`double runRate(int runs, int overs)`', '`void runRate(int runs, int overs)`', '`int runRate(double runs)`', '`double runRate()`'], answer: 0, hints: ['What goes in? What comes out, and can it have decimals?'], explain: 'Two whole numbers in, one decimal answer out. A `void` function could only print it, not give it back.' },
    { id: 'checkpoint-functions-q7', kind: 'bug', prompt: 'This does not compile. Find the line.', code: progF(cpp`
void printBill(int amount) {
    cout << "Bill: Rs " << amount << endl;
}`, cpp`
    cout << printBill(500);`), bugLine: 9, options: ['`printBill` is void — call it on its own: `printBill(500);`', 'Add `return amount;` to the void function', 'Put 500 in quotes', 'Add `&` to the parameter'], answer: 0, fixed: progF(cpp`
void printBill(int amount) {
    cout << "Bill: Rs " << amount << endl;
}`, cpp`
    printBill(500);`), hints: ['What value does a `void` function give to `cout`?'], explain: 'A void function returns nothing, so there is nothing for `cout <<` to print. It already prints by itself — just call it.' },
    { id: 'checkpoint-functions-q8', kind: 'predict', tag: 'tricky', prompt: 'Scope and references mixed. Predict the output.', code: progF(cpp`
int total = 100;

void addA(int total) {
    total = total + 1;
}

void addB(int &t) {
    t = t + 10;
}`, cpp`
    int total = 5;
    addA(total);
    addB(total);
    cout << total;`), hints: ['Inside main, `total` means main’s local total (it shadows the global).', '`addA` changes only its copy.'], explain: 'main’s `total` is 5. `addA` changes a copy. `addB` changes main’s total to 15. The global 100 is never touched. Output: `15`.' },
    { id: 'checkpoint-functions-q9', kind: 'mcq', prompt: 'Which `bonus` is called by `bonus(80, 10.0)`?', code: progF(cpp`
double bonus(int marks) {
    return marks * 0.1;
}

double bonus(int marks, int extra) {
    return marks + extra;
}

double bonus(int marks, double percent) {
    return marks * percent / 100;
}`, cpp`
    cout << bonus(80, 10.0);`), options: ['`bonus(int marks, double percent)`', '`bonus(int marks, int extra)`', '`bonus(int marks)`', 'It does not compile'], answer: 0, hints: ['Two arguments; the second is `10.0` — which type is that?'], explain: 'Two arguments rule out the first one. `10.0` is a double — an exact match for the third. It prints `8`.' },
    { id: 'checkpoint-functions-q10', kind: 'blanks', prompt: 'Recursive sum 1 + 2 + … + n. Complete it. Output: `55` for n = 10.', code: progF(cpp`
int sumTo(int n) {
    if (n == [[1]]) {
        return 0;
    }
    return n + sumTo([[2]]);
}`, cpp`
    cout << sumTo(10);`), blanks: [{ answers: ['0'] }, { answers: ['n - 1', 'n-1'] }], chips: ['0', '1', 'n', 'n - 1', 'n + 1'], output: '55', hints: ['Which n gives the sum 0?', 'Each call must get closer to the base case.'], explain: 'Base case `n == 0` → 0; step `n + sumTo(n - 1)`. 11 calls in total.' },
    { id: 'checkpoint-functions-q11', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'Bus seats: `book` takes seats from the free count if possible. Dry run.', code: progF(cpp`
bool book(int &freeSeats, int want) {
    if (want > freeSeats) {
        return false;
    }
    freeSeats -= want;
    return true;
}`, cpp`
    int seats = 5;
    cout << book(seats, 3);
    cout << book(seats, 4);
    cout << book(seats, 2) << " left: " << seats;`), vars: ['seats', 'want'], hints: ['After the first booking, 2 seats are free.', 'A booking of 4 is refused — nothing changes.'], explain: '5 → 2 (true), 4 > 2 refused (false), 2 → 0 (true). Output: `101 left: 0`.' },
    { id: 'checkpoint-functions-q12', kind: 'parsons', tag: 'real life', prompt: 'Build a program that converts Rs to dollars with a function (1 dollar = Rs 280). Output for Rs 1400: `5 dollars`.', lines: ['#include <iostream>', 'using namespace std;', 'double toDollars(double rupees) {', '    return rupees / 280;', '}', 'int main() {', '    double rs = 1400;', '    cout << toDollars(rs) << " dollars" << endl;', '    return 0;', '}'], distractors: ['void toDollars(double rupees) {', '    return rupees * 280;'], hints: ['The function must give back a decimal value.', 'Rupees → dollars means dividing.'], explain: '`double toDollars(double rupees)` returns `rupees / 280`.' },
    { id: 'checkpoint-functions-q13', kind: 'blanks', tag: 'real life', prompt: '**Capstone: report card.** Three functions work together. Complete them. Input `Sana 80 90 70` →\n`Sana: average 80, grade A`.', code: progF(cpp`
double average(int a, int b, int c) {
    return (a + b + c) / [[1]];
}

char gradeOf(double avg) {
    if (avg >= 75) {
        return 'A';
    } else if (avg >= 50) {
        return 'B';
    }
    [[2]] 'F';
}

void report(const string [[3]]name, int a, int b, int c) {
    double avg = [[4]](a, b, c);
    cout << name << ": average " << avg << ", grade " << gradeOf(avg) << endl;
}`, cpp`
    string name;
    int m1, m2, m3;
    cin >> name >> m1 >> m2 >> m3;
    [[5]](name, m1, m2, m3);`), blanks: [{ answers: ['3.0', '3.0f'] }, { answers: ['return'] }, { answers: ['&'] }, { answers: ['average'] }, { answers: ['report'] }], chips: ['3', '3.0', 'return', 'cout <<', '&', '*', 'average', 'gradeOf', 'report'], input: 'Sana 80 90 70\n', output: 'Sana: average 80, grade A\n', hints: ['Divide by a decimal so the average keeps its fraction.', 'Every path of a non-void function must give back a value.', 'Pass the name without copying it.'], explain: 'main calls `report`; `report` calls `average` and `gradeOf`. At the deepest point the stack is main → report → gradeOf. For `Sana 80 90 70`: average 80 → grade A.' },
  ],
  cheatsheet: [
    { code: 'type name(params) { … return value; }', text: 'the shape of every function' },
    { code: 'T x / T &x / const T &x', text: 'copy / same box / same box, read only' },
    { code: 'prototype; default args; overloads', text: 'main first; optional arguments; one name, many parameter lists' },
    { code: 'base case + smaller step', text: 'the two parts of every recursive function' },
  ],
  exam: {
    title: 'Exam Challenge: Functions',
    intro: '**State the output of the following code. If there is an error, write it explicitly** (which line, and why). Draw the call stack on paper: one box per call, with its own parameters. Watch for reference parameters (`&`), early `return`, calls before the function is known, default arguments that clash with an overload, and recursion that adds something *after* the call comes back.',
    questions: [
      { id: 'checkpoint-functions-x1', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: cpp`
#include <iostream>
using namespace std;

void fun3(int x, int &sum);
void fun2(int x, int &sum);
void fun1(int x, int &sum);

int main() {
    int total = 1;
    fun1(3, total);
    cout << total;
    return 0;
}

void fun3(int x, int &sum) {
    if (x == 6)
        return;
    sum *= 2;
    return;
    sum += 20;
}
void fun2(int x, int &sum) {
    fun3(x + 1, sum);
    sum += 4;
    fun3(x, sum);
}
void fun1(int x, int &sum) {
    fun2(x + 2, sum);
    sum += 3;
}
`, hints: ['`sum` is a reference in every function — they all change `total` in main.', 'A `return` ends the function at once; line 20 can never run.'], explain: 'It compiles: the prototypes on lines 4–6 let `main` call functions written below it.\n`sum` is always an arrow to `total` (starts at 1).\n• `fun1(3)` calls `fun2(5)`.\n• `fun2(5)` calls `fun3(6)`: x == 6 → `return` at once, nothing changes.\n• back in fun2: `sum += 4` → total = 5.\n• `fun3(5)`: x is not 6 → `sum *= 2` → total = 10, then `return` (line 20 `sum += 20` is never reached).\n• back in fun1: `sum += 3` → total = 13.\nOutput: **`13`**' },
      { id: 'checkpoint-functions-x2', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: progF(cpp`
void addBonus(int &marks, int bonus = 5) {
    marks += bonus;
}`, cpp`
    int m = 60;
    addBonus(m);
    addBonus(m, 10);
    addBonus(75);
    cout << m;`), hints: ['What must you pass to an `int &` parameter?', 'Is `75` a box in memory?'], explain: '**Compile error on line 12: cannot bind a non-const reference `int&` to the value `75`.**\n`int &marks` must become another name for an existing **variable**. Lines 10 and 11 are fine (`m` is a variable; the default `bonus = 5` fills in the missing argument). But `75` is just a value — there is no box for `marks` to point at.\nFix: remove line 12, or pass a variable. Without line 12 it would print `75` (60 + 5 + 10).' },
      { id: 'checkpoint-functions-x3', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: progF(cpp`
int calc(int x, int s) {
    if (x <= 1)
        return s;
    if (x % 2 == 0)
        return calc(x / 2, s + x);
    else
        return calc(3 * x + 1, s - 1) + x;
}`, cpp`
    cout << "Final Result: " << calc(6, 0) << endl;`), hints: ['Write the calls going down: calc(6,0) → calc(3,6) → …', 'The odd branch adds `x` AFTER the inner call returns. Collect those on the way back up.'], explain: 'Going down (even → halve and add x to s; odd → 3x+1 and s − 1):\ncalc(6, 0) → calc(3, 6) → calc(10, 5) **+ 3** → calc(5, 15) → calc(16, 14) **+ 5** → calc(8, 30) → calc(4, 38) → calc(2, 42) → calc(1, 44).\nBase case: calc(1, 44) returns **44**.\nComing back up, only the odd calls add something: calc(5, 15) = 44 + 5 = 49, calc(3, 6) = 49 + 3 = 52. The even calls pass the value on unchanged.\nOutput: **`Final Result: 52`**' },
      { id: 'checkpoint-functions-x4', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: progF(cpp`
int g = 2;
int f(int &a, int b) {
    a += b;
    b = a * g;
    g++;
    return b - a;
}`, cpp`
    int p = 3, q = 4;
    int r = f(p, q);
    cout << p << " " << q << " " << r << " " << g << endl;
    r = f(q, p);
    cout << p << " " << q << " " << r << " " << g;`), hints: ['`a` is the caller’s variable; `b` is only a copy.', '`g` is global: every call sees (and changes) the same g.'], explain: 'Call 1, `f(p, q)`: a → p (3), b = 4 (copy). p = 3 + 4 = **7**; b = 7 × 2 = 14; g = **3**; return 14 − 7 = **7**. q is still 4 (b was a copy).\nLine 1: `7 4 7 3`.\nCall 2, `f(q, p)`: a → q (4), b = 7 (copy of p). q = 4 + 7 = **11**; b = 11 × 3 = 33; g = **4**; return 33 − 11 = **22**. p stays 7.\nLine 2: `7 11 22 4`.\nOutput:\n`7 4 7 3`\n`7 11 22 4`' },
      { id: 'checkpoint-functions-x5', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int a = 4;
    cout << twice(a) + 1;
    return 0;
}

int twice(int n) {
    return 2 * n;
}
`, hints: ['The compiler reads the file from top to bottom.', 'What does it know about `twice` when it reaches line 6?'], explain: '**Compile error on line 6: `twice` was not declared in this scope.**\nC++ reads the file top to bottom. On line 6 it meets the call `twice(a)`, but the function is written only on line 10 and there is no prototype above `main`, so the name is still unknown.\nFix: add the prototype `int twice(int n);` above `main` (or move the function above main). Then it prints `9`.' },
      { id: 'checkpoint-functions-x6', kind: 'predict', tag: 'exam', prompt: 'Overloading and default arguments. State the output. If there is an error, write it.', code: progF(cpp`
void show(int a, int b = 10) { cout << "I" << a + b << " "; }
void show(double a) { cout << "D" << a * 2 << " "; }
void show(char c) { cout << "C" << c << " "; }`, cpp`
    show(3);
    show(3.5);
    show('A');
    show('A', 1);
    show(7 / 2);
    show(7 / 2.0);`), hints: ['C++ picks the version whose parameter types match the arguments best.', '`7 / 2` is an int; `7 / 2.0` is a double. With two arguments only the first version fits.'], explain: '• `show(3)`: an int → version 1 with b = 10 → `I13`.\n• `show(3.5)`: a double → version 2 → 3.5 × 2 = `D7`.\n• `show(\'A\')`: a char → version 3 → `CA`.\n• `show(\'A\', 1)`: two arguments — only version 1 takes two. `\'A\'` becomes the int 65 → 65 + 1 → `I66`.\n• `show(7 / 2)`: integer division = 3 (int) → `I13`.\n• `show(7 / 2.0)`: 3.5 (double) → `D7`.\nOutput: **`I13 D7 CA I66 I13 D7 `** (each followed by a space).' },
      { id: 'checkpoint-functions-x7', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: progF(cpp`
int area(int s) {
    return s * s;
}
int area(int l, int w = 2) {
    return l * w;
}`, cpp`
    cout << area(4, 3) << endl;
    cout << area(5) << endl;`), hints: ['Line 12 is fine — only one version takes two arguments.', 'For `area(5)`, how many versions could be called?'], explain: '**Compile error on line 13: call of overloaded `area(int)` is ambiguous.**\n`area(4, 3)` on line 12 is clear (only the second version takes two ints). But `area(5)` fits BOTH: the first version `area(int s)`, and the second one with the default `w = 2`. Both are equally good, so the compiler refuses to guess.\nFix: remove the default argument (`int area(int l, int w)`) or give the functions different names. Nothing is printed — not even line 12 — because the program never compiles.' },
      { id: 'checkpoint-functions-x8', kind: 'count', tag: 'exam', count: { calls: 'fib' }, unit: 'calls', prompt: 'How many times is `fib()` called in total (count the first call from `main` too)?', code: progF(cpp`
int fib(int n) {
    if (n <= 2)
        return 1;
    return fib(n - 1) + fib(n - 2);
}`, cpp`
    cout << fib(6);`), hints: ['Let C(n) be the number of calls for fib(n). C(1) = C(2) = 1.', 'C(n) = 1 + C(n − 1) + C(n − 2).'], explain: 'Each call that is not a base case makes two more calls. Count from the bottom:\nC(1) = 1, C(2) = 1,\nC(3) = 1 + C(2) + C(1) = 3,\nC(4) = 1 + 3 + 1 = 5,\nC(5) = 1 + 5 + 3 = 9,\nC(6) = 1 + 9 + 5 = **15 calls**.\nThe program prints `8` (the 6th Fibonacci number) — but it needs 15 calls to get there, because fib(4), fib(3) … are computed again and again.' },
      { id: 'checkpoint-functions-x9', kind: 'count', tag: 'exam', count: { calls: 'check' }, unit: 'calls', prompt: 'A function call inside a condition. How many times is `check()` called?', code: progF(cpp`
bool check(int n) {
    cout << "?";
    return n % 3 == 0;
}`, cpp`
    for (int i = 1; i <= 6; i++) {
        if (i % 2 == 0 || check(i))
            cout << i;
    }`), hints: ['`||` does not look at the right side when the left side is already true.', 'For which i is `i % 2 == 0` false?'], explain: 'For even i the left side `i % 2 == 0` is true, so `||` **never calls** `check`. It is called only for odd i: 1, 3 and 5 → **3 calls**.\n• i = 1: `?`, 1 % 3 ≠ 0 → nothing printed.\n• i = 2: `2`. • i = 3: `?`, true → `3`. • i = 4: `4`. • i = 5: `?`, false. • i = 6: `6`.\nOutput: `?2?34?6` — three `?`, one per call.' },
      { id: 'checkpoint-functions-x10', kind: 'blanks', tag: 'exam', prompt: '**Complete the program.** `digitSum` adds the digits of n with recursion, and counts the digits through a reference parameter. It must print `19 4` for 4096.', code: progF(cpp`
int digitSum(int n, int [[1]]count) {
    if (n == 0)
        return [[2]];
    [[3]];
    return n % 10 + digitSum([[4]], count);
}`, cpp`
    int c = 0;
    int s = digitSum(4096, c);
    cout << s << " " << c;`), output: '19 4', blanks: [{ answers: ['&'], hint: 'main must see the count change.' }, { answers: ['0'] }, { answers: ['count++', '++count', 'count += 1', 'count = count + 1'] }, { answers: ['n / 10', 'n/10'] }], chips: ['&', '*', '0', '1', 'count++', 'n / 10', 'n % 10', 'n - 1'], hints: ['Base case: no digits left → the sum of no digits.', 'Take the last digit with `% 10`, pass the rest with `/ 10`.'], explain: '`int &count` makes `count` the same box as `c` in main. Base case: n == 0 → return 0. Otherwise count this digit (`count++`), and return the last digit plus the digit sum of the rest (`n / 10`).\n4096 → 6 + digitSum(409) → 9 + digitSum(40) → 0 + digitSum(4) → 4 + digitSum(0) = 0.\nSum = 6 + 9 + 0 + 4 = **19**, 4 digits counted → `19 4`.' },
    ],
  },
};

export const unit7: Unit = {
  id: 'u7',
  num: 7,
  title: 'Functions: build your own tools',
  summary: 'Split a program into named pieces, pass values in and out, and watch the call stack grow and shrink.',
  levels: [F1, F2, F3, F4, F5, F6, C7],
};
