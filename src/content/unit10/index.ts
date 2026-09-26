import type { Level, Unit } from '../types';
import { cpp, prog, progF } from '../helpers';

// NOTE for authors: real g++ prints a different address on every run, so no program in this unit
// ever prints a pointer, an address or an int array name. Addresses are shown by the memory view
// ("Addresses & sizes" toggle) and by the step explanations instead.

// ------------------------------------------------------------------ Level: memory & addresses
const LAddr: Level = {
  id: 'addresses',
  kind: 'lesson',
  title: 'Memory: numbered boxes',
  tagline: 'Every variable lives in a box in memory, and every box has a number — its **address**. Pointers are built on this one idea.',
  minutes: 20,
  objectives: [
    'You can explain memory as a long row of numbered boxes (bytes)',
    'You can get the address of a variable with `&x` and its size with `sizeof`',
    'You can say why the address is different every time the program runs',
  ],
  learn: [
    { t: 'p', text: 'Think of memory as one very long street of tiny houses. Each house holds **one byte** and has a **house number** — its **address**. A variable is a group of neighbouring houses: an `int` uses 4 houses, a `double` uses 8, a `char` uses 1. The *name* of the variable is for you; the computer only uses the address.' },
    { t: 'terms', items: [
      { term: 'byte', def: 'the smallest box in memory. One `char` fits in one byte.' },
      { term: 'address', def: 'the number of the first byte of a variable, usually written in hexadecimal like `0x61fe1c`.' },
      { term: '`&x`', def: '"the address of x" — where x lives in memory.' },
      { term: '`sizeof(x)`', def: 'how many bytes x uses.' },
    ] },
    { t: 'viz', title: 'Four variables, four sizes', code: prog(cpp`
    int marks = 72;
    double price = 99.5;
    char grade = 'A';
    bool passed = true;
    cout << sizeof(marks) << " " << sizeof(price) << " ";
    cout << sizeof(grade) << " " << sizeof(passed) << endl;`) },
    { t: 'callout', tone: 'tip', title: 'Turn on "Addresses & sizes"', text: 'In the dry run, switch on **Addresses & sizes**. Every box now shows its address and how many bytes it uses. Notice that the variables sit close together — they are neighbours in memory.' },
    { t: 'table', head: ['Type', '`sizeof`', 'Example'], rows: [
      ['`char`, `bool`', '1 byte', "`'A'`, `true`"],
      ['`int`, `float`', '4 bytes', '`72`, `2.5f`'],
      ['`double`, `long long`', '8 bytes', '`99.5`, `3000000000`'],
      ['any pointer (`int*`, `char*` …)', '8 bytes', 'an address (next level)'],
    ], caption: 'Sizes with g++ on a normal 64-bit computer.' },
    { t: 'viz', title: 'An array is a row of neighbouring boxes', code: prog(cpp`
    int temps[4] = {31, 35, 29, 40};
    int n = sizeof(temps) / sizeof(temps[0]);
    cout << "temps uses " << sizeof(temps) << " bytes" << endl;
    cout << "It has " << n << " boxes" << endl;`) },
    { t: 'callout', tone: 'key', title: 'Array boxes are exactly one element apart', text: 'With addresses on, look at `temps`: if `temps[0]` starts at some address A, then `temps[1]` is at A + 4, `temps[2]` at A + 8, `temps[3]` at A + 12. No gaps. This is why `sizeof(temps) / sizeof(temps[0])` counts the boxes: 16 / 4 = 4.' },
    { t: 'callout', tone: 'warn', title: 'Addresses change every run', text: 'On your own computer `cout << &marks;` prints something like `0x7ffd5c3a8e4c` — and a **different** number next time. The operating system places your program somewhere new each run (for safety). So never write a program whose answer depends on the exact address. In this course we never print addresses; the memory view shows them instead.' },
  ],
  ways: {
    goal: 'Count the boxes in `int marks[5] = {70, 82, 64, 91, 55};` and print `5` — without typing the number 5 in the cout.',
    items: [
      { title: 'Whole array ÷ one element', code: prog(cpp`
    int marks[5] = {70, 82, 64, 91, 55};
    cout << sizeof(marks) / sizeof(marks[0]);`), note: '20 bytes ÷ 4 bytes = 5. Works for any element type.' },
      { title: 'Whole array ÷ size of the type', code: prog(cpp`
    int marks[5] = {70, 82, 64, 91, 55};
    cout << sizeof(marks) / sizeof(int);`), note: 'Correct, but if you later change the array to `double` you must remember to change `int` too.' },
      { title: 'Store the count in a variable', code: prog(cpp`
    int marks[5] = {70, 82, 64, 91, 55};
    int n = sizeof(marks) / sizeof(marks[0]);
    cout << n;`) },
      { title: 'sizeof without brackets', code: prog(cpp`
    int marks[5] = {70, 82, 64, 91, 55};
    cout << sizeof marks / sizeof marks[0];`), note: 'For a variable (not a type) the brackets are optional. Most people still write them.' },
    ],
    takeaway: '`sizeof` counts **bytes**, not elements. Divide by the size of one element to get the number of elements.',
    check: { id: 'addresses-ways-check', kind: 'mcq', prompt: 'Which one does NOT print 5 for `int marks[5]`?', options: ['`cout << sizeof(marks);`', '`cout << sizeof(marks) / sizeof(marks[0]);`', '`cout << sizeof(marks) / sizeof(int);`', '`cout << sizeof(marks) / 4;`'], answer: 0, explain: '`sizeof(marks)` is the number of **bytes**: 5 × 4 = 20.' },
  },
  watch: [
    { title: 'Where do my variables live?', intro: 'Switch on **Addresses & sizes** and watch each new box appear next to the others. The char array uses 7 bytes: 6 letters plus the hidden `\'\\0\'`.', code: prog(cpp`
    int roll = 42;
    double cgpa = 3.4;
    char city[] = "Lahore";
    cout << roll << " " << cgpa << " " << city << endl;
    cout << sizeof(roll) + sizeof(cgpa) + sizeof(city) << " bytes" << endl;`) },
    { title: 'A function gets NEW boxes', intro: 'The parameter `m` is a different box (a different address) from `marks`. Changing `m` cannot change `marks` — pointers will fix this in Level 4.', code: progF(cpp`
void addBonus(int m) {
    m = m + 5;
    cout << "inside: " << m << endl;
}`, cpp`
    int marks = 60;
    addBonus(marks);
    cout << "outside: " << marks << endl;`) },
  ],
  think: {
    title: 'How much memory does the class use?',
    problem: 'A class stores the marks (`int`) and the fees (`double`) of its 5 students in two arrays. Count the students from the array itself, and print how many bytes both arrays use together.',
    steps: [
      { text: 'Store the data in two arrays.', lines: [5, 6] },
      { text: 'Number of students = bytes of the whole array ÷ bytes of one box.', lines: [7] },
      { text: 'Total bytes = bytes of `marks` + bytes of `fees` (5 × 4 + 5 × 8).', lines: [8] },
      { text: 'Print both answers.', lines: [9, 10] },
    ],
    code: prog(cpp`
    int marks[5] = {72, 65, 90, 48, 81};
    double fees[5] = {1500.5, 1200, 1800, 900, 2000};
    int n = sizeof(marks) / sizeof(marks[0]);
    int total = sizeof(marks) + sizeof(fees);
    cout << n << " students" << endl;
    cout << total << " bytes" << endl;`),
    why: '`sizeof` is worked out from the **type**, so you never need to count by hand — and the answer stays right if the array size changes.',
    yourTurn: {
      id: 'addresses-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['n', 'total'],
      prompt: 'Now the class has 6 students with a `char` grade and an `int` roll number each. Dry run it.',
      code: prog(cpp`
    char grade[6] = {'A', 'B', 'A', 'C', 'B', 'A'};
    int roll[6] = {1, 2, 3, 4, 5, 6};
    int n = sizeof(roll) / sizeof(roll[0]);
    int total = sizeof(grade) + sizeof(roll);
    cout << n << " students" << endl;
    cout << total << " bytes" << endl;`),
      hints: ['`sizeof(roll)` is 6 × 4 = 24.', 'A `char` is 1 byte, so `sizeof(grade)` is 6.'],
      explain: 'n = 24 / 4 = **6**; total = 6 + 24 = **30** bytes.',
    },
  },
  practice: [
    { id: 'addresses-q1', kind: 'mcq', prompt: 'After `int x = 7;`, what does `&x` give you?', options: ['The address of x — the number of the box where x lives', 'The value 7', 'A copy of x', 'The number of bytes x uses'], answer: 0, hints: ['Read `&` as "address of".'], explain: '`&x` is *where* x is, not *what* is inside. The value is `x`; the size is `sizeof(x)`.' },
    { id: 'addresses-q2', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    cout << sizeof(int) + sizeof(char) << " ";
    cout << sizeof(double) * 2 << endl;`), hints: ['int is 4 bytes, char is 1, double is 8.'], explain: '4 + 1 = **5**, and 8 × 2 = **16**: `5 16`.' },
    { id: 'addresses-q3', kind: 'mcq', tag: 'tricky', prompt: 'Your friend runs `cout << &x;` and sees `0x7ffe4a10`. You run the same program and see `0x7ffc91b8`. Why?', options: ['The operating system puts the program at a different place in memory on every run', 'One of you has a bug', 'Your x holds a different value', '`&x` prints a random number on purpose'], answer: 0, hints: ['Did the value of x change, or only its place?'], explain: 'The value is the same; only the *location* changed. That is why this course never prints addresses — the answer would change every run.' },
    { id: 'addresses-q4', kind: 'blanks', prompt: 'Count how many days of temperatures are stored. It should print `7 days`.', code: prog(cpp`
    double temps[7] = {31.5, 33, 35.2, 30, 29.8, 32, 34};
    int days = [[1]](temps) / sizeof([[2]]);
    cout << days << " days";`), blanks: [{ answers: ['sizeof'] }, { answers: ['temps[0]', 'double', 'temps [0]'] }], chips: ['sizeof', 'temps[0]', 'double', 'int', '&temps'], output: '7 days', hints: ['Bytes of the whole array ÷ bytes of one element.', 'One element is `temps[0]` — a double.'], explain: '56 bytes ÷ 8 bytes = 7. `sizeof(int)` would give 14 — wrong, because the elements are doubles.' },
    { id: 'addresses-q5', kind: 'mcq', prompt: '`int a[4]` starts at address 1000 (written in normal decimal numbers to keep it easy). What is the address of `a[3]`?', options: ['1012', '1003', '1004', '1016'], answer: 0, hints: ['Each int takes 4 bytes.', 'a[0] at 1000, a[1] at 1004 …'], explain: 'a[3] is 3 boxes after a[0]: 1000 + 3 × 4 = **1012**. (1016 is the first byte *after* the array.)' },
    { id: 'addresses-q6', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    char city[] = "Karachi";
    cout << sizeof(city) << " " << sizeof(city[0]);`), hints: ['Count the letters of Karachi, then remember the hidden character at the end.'], explain: '7 letters + the hidden `\'\\0\'` = **8** bytes; one char is **1** byte: `8 1`.' },
    { id: 'addresses-q7', kind: 'bug', prompt: 'The average of 80, 70 and 90 should be 80, but this prints `Average: 20`. Find the line.', code: prog(cpp`
    int marks[3] = {80, 70, 90};
    int sum = marks[0] + marks[1] + marks[2];
    int avg = sum / sizeof(marks);
    cout << "Average: " << avg;`), bugLine: 7, options: ['`sizeof(marks)` is 12 bytes, not 3 elements — divide by `sizeof(marks) / sizeof(marks[0])`', 'The sum is wrong', '`avg` must be a double', 'Arrays cannot be used with sizeof'], answer: 0, fixed: prog(cpp`
    int marks[3] = {80, 70, 90};
    int sum = marks[0] + marks[1] + marks[2];
    int avg = sum / (sizeof(marks) / sizeof(marks[0]));
    cout << "Average: " << avg;`), hints: ['What number is `sizeof(marks)`?'], explain: '240 / 12 = 20. `sizeof` counts bytes; the number of elements is 12 / 4 = 3, and 240 / 3 = 80.' },
  ],
  cheatsheet: [
    { code: '&x', text: 'the address of x (where it lives)' },
    { code: 'sizeof(x)', text: 'bytes used by x: char 1, int 4, double 8, pointer 8' },
    { code: 'sizeof(a) / sizeof(a[0])', text: 'number of elements in an array' },
    { code: '0x61fe1c', text: 'addresses are written in hex and change every run — never print them' },
  ],
};

// ------------------------------------------------------------------ Level: pointer basics
const LBasics: Level = {
  id: 'pointer-basics',
  kind: 'lesson',
  title: 'Pointers: variables that hold an address',
  tagline: 'A pointer is a box that holds an address. Follow the arrow with `*` and you reach another variable — and you can read or change it.',
  minutes: 25,
  objectives: [
    'You can declare `int* p = &x;` and read and write `*p`',
    'You can move a pointer to another variable and use `nullptr` safely',
    'You can tell `*` in a declaration from `*` in an expression',
  ],
  learn: [
    { t: 'p', text: 'A **pointer** is a variable whose value is an **address**. Think of a slip of paper with a house number written on it. The slip is not the house — but by following it you reach the house. In the dry run a pointer is drawn as a box with a dot and an **arrow** to the box it points to.' },
    { t: 'syntax', title: 'Declare a pointer', code: 'int* p = &x;', parts: [
      { token: 'int*', text: 'the type: "pointer to int". It may only point to `int` boxes.' },
      { token: 'p', text: 'the name of the pointer (it is a variable too, 8 bytes)' },
      { token: '&x', text: 'the address of `x` — now `p` **points to** x' },
    ] },
    { t: 'viz', title: 'Follow the arrow', code: prog(cpp`
    int x = 10;
    int* p = &x;
    cout << *p << endl;
    *p = 25;
    cout << x << endl;
    int y = 7;
    p = &y;
    *p = *p + 1;
    cout << x << " " << y << endl;`) },
    { t: 'callout', tone: 'key', title: 'p is the arrow, *p is the box at the end', text: '`*p` means *the box that p points to*. On line 8, `*p = 25` changes **x**, because the arrow goes to x. On line 11, `p = &y` moves the arrow; x is not touched. Changing `*p` changes the target; changing `p` changes where the arrow goes.' },
    { t: 'table', head: ['Code', 'Where', 'Meaning'], rows: [
      ['`int* p`', 'declaration', '`p` **is a pointer** to int'],
      ['`*p`', 'expression', '**the box p points to** (read it or store into it)'],
      ['`&x`', 'expression', '**the address of** x'],
      ['`int& r = x`', 'declaration', '`r` is a **reference** — another name for x (no arrow)'],
      ['`a * b`', 'between two values', 'plain multiplication'],
    ], caption: 'The same symbol means different things in different places.' },
    { t: 'viz', title: 'nullptr: pointing at nothing (on purpose)', code: prog(cpp`
    int* p = nullptr;
    if (p != nullptr) {
        cout << "Score: " << *p << endl;
    } else {
        cout << "No score yet" << endl;
    }
    int score = 88;
    p = &score;
    if (p != nullptr) {
        cout << "Score: " << *p << endl;
    }`) },
    { t: 'compare', items: [
      { title: 'Uninitialised pointer — dangerous', good: false, code: cpp`
int* p;     // holds a garbage address
*p = 5;     // writes 5 to a random place: crash!`, note: '`p` was never given an address. `*p` follows the garbage address to a random place in memory. The program usually crashes (segmentation fault).' },
      { title: 'Start with nullptr, then point', good: true, code: cpp`
int* p = nullptr;   // points to nothing, and we KNOW it
int x = 0;
p = &x;
*p = 5;             // safe: x becomes 5`, note: 'Always give a pointer a value when you create it: an address, or `nullptr`. Check `p != nullptr` before using `*p`.' },
    ] },
    { t: 'callout', tone: 'warn', title: '`int* a, b;` makes only ONE pointer', text: 'The `*` belongs to the name, not to the type. `int* a, b;` makes `a` a pointer and `b` a plain int. To get two pointers write `int *a, *b;` — or better, one pointer per line.' },
  ],
  ways: {
    goal: '`score` is 40. Use a pointer to add 5, so that `cout << score;` prints `45`.',
    items: [
      { title: 'Point, then change *p', code: prog(cpp`
    int score = 40;
    int* p = &score;
    *p = *p + 5;
    cout << score;`) },
      { title: 'Short form +=', code: prog(cpp`
    int score = 40;
    int* p = &score;
    *p += 5;
    cout << score;`) },
      { title: 'Start at nullptr, point later', code: prog(cpp`
    int score = 40;
    int* p = nullptr;
    p = &score;
    *p += 5;
    cout << score;`), note: 'The safe habit: a pointer is never left with a garbage address.' },
      { title: 'Add 1, five times', code: prog(cpp`
    int score = 40;
    int* p = &score;
    for (int i = 0; i < 5; i++) {
        (*p)++;
    }
    cout << score;`), note: 'The brackets matter: `(*p)++` adds 1 to the box. How many times does the loop run? 5.' },
      { title: 'A pointer to the pointer', code: prog(cpp`
    int score = 40;
    int* p = &score;
    int** pp = &p;
    **pp += 5;
    cout << score;`), note: '`*pp` is p, and `**pp` is the box p points to: score.' },
    ],
    takeaway: 'Every version changes `*p` (the box at the end of the arrow) — never `p` itself.',
    check: { id: 'pointer-basics-ways-check', kind: 'mcq', prompt: 'With `int* p = &score;`, which line does NOT add 5 to score?', options: ['`p += 5;`', '`*p += 5;`', '`*p = *p + 5;`', '`(*p) += 5;`'], answer: 0, hints: ['Is the change made to the arrow or to the box?'], explain: '`p += 5` moves the **arrow** 5 ints further in memory. score stays 40 (and p now points somewhere it should not).' },
  },
  watch: [
    { title: 'Two pointers, one box', intro: 'p and q both point to x. A change through q is seen through p — there is only one box.', code: prog(cpp`
    int x = 3;
    int* p = &x;
    int* q = p;
    *q = 50;
    cout << x << " " << *p << endl;`) },
    { title: 'Move the arrow to the bigger number', intro: 'Pick a target first, then change it through the pointer.', code: prog(cpp`
    int a = 14, b = 22;
    int* big = &a;
    if (b > a) {
        big = &b;
    }
    *big = 0;
    cout << a << " " << b << endl;`) },
    { title: 'A pointer to a pointer', intro: '`pp` points to `p`, which points to `x`. Two arrows in a row: `**pp` is x.', code: prog(cpp`
    int x = 5;
    int* p = &x;
    int** pp = &p;
    **pp = 9;
    cout << x << " " << *p << " " << **pp << endl;`) },
  ],
  think: {
    title: 'Top up the poorer counter',
    problem: 'A shop has two cash counters. Read the cash in each (`c1`, `c2`). Use ONE pointer `low` that points to the counter with less cash, and add a Rs. 500 top-up through the pointer. Print both counters.',
    steps: [
      { text: 'Read the two amounts.', lines: [5, 6] },
      { text: 'Guess that counter 1 has less: point `low` at c1.', lines: [7] },
      { text: 'If counter 2 has even less, move the arrow to c2.', lines: [8, 9] },
      { text: 'Add 500 to *the box low points to* — we do not care which one it is.', lines: [11] },
      { text: 'Print both counters.', lines: [12] },
    ],
    code: prog(cpp`
    int c1, c2;
    cin >> c1 >> c2;
    int* low = &c1;
    if (c2 < c1) {
        low = &c2;
    }
    *low = *low + 500;
    cout << c1 << " " << c2 << endl;`),
    input: '1200 800\n',
    why: 'The pointer lets one line (line 11) change *either* variable. The decision (which one?) and the action (add 500) are kept apart.',
    yourTurn: {
      id: 'pointer-basics-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['c1', 'c2'],
      prompt: 'Dry run with the input `300 900`. Which counter gets the top-up?',
      code: prog(cpp`
    int c1, c2;
    cin >> c1 >> c2;
    int* low = &c1;
    if (c2 < c1) {
        low = &c2;
    }
    *low = *low + 500;
    cout << c1 << " " << c2 << endl;`),
      input: '300 900\n',
      hints: ['900 < 300 is false, so the arrow stays on c1.', 'Line 11 changes the box low points to: c1.'],
      explain: 'low keeps pointing to c1, so c1 becomes 800. Output: `800 900`.',
    },
  },
  practice: [
    { id: 'pointer-basics-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int a = 4, b = 9;
    int* p = &a;
    *p = *p * 2;
    p = &b;
    *p = *p - a;
    cout << a << " " << b;`), hints: ['After line 7, a is 8.', 'Line 9: b = 9 − 8.'], explain: 'a becomes 8, then p moves to b and b becomes 9 − 8 = 1: `8 1`.' },
    { id: 'pointer-basics-q2', kind: 'mcq', prompt: 'In `int* p = &x;` and later `*p = 3;` — what does each `*` mean?', options: ['First: "p is a pointer". Second: "the box p points to"', 'Both mean multiply', 'First: "the box p points to". Second: "p is a pointer"', 'Both mean "address of"'], answer: 0, hints: ['One `*` is in a declaration, the other in an expression.'], explain: 'In a declaration `*` makes a pointer type. In an expression `*p` follows the arrow (dereference).' },
    { id: 'pointer-basics-q3', kind: 'bug', prompt: 'This does not compile. Find the line.', code: prog(cpp`
    int age = 19;
    int* p = age;
    cout << *p;`), bugLine: 6, options: ['A pointer needs an address: write `int* p = &age;`', 'Write `int p = age;`', 'Write `*p = age;` on this line', 'Remove the `*` from `cout << *p`'], answer: 0, fixed: prog(cpp`
    int age = 19;
    int* p = &age;
    cout << *p;`), hints: ['What type is `age`? What type does `p` want?'], explain: '`age` is an int (19), not an address. g++: *invalid conversion from int to int\\**. `&age` gives the address.' },
    { id: 'pointer-basics-q4', kind: 'bug', tag: 'tricky', prompt: 'The programmer wanted two pointers. It does not compile. Find the line.', code: prog(cpp`
    int x = 1, y = 2;
    int* a = &x, b = &y;
    cout << *a + *b;`), bugLine: 6, options: ['Only `a` is a pointer; write `int *a = &x, *b = &y;`', 'Write `&x, &y` without names', 'Pointers cannot be declared on one line at all', '`y` must be declared first'], answer: 0, fixed: prog(cpp`
    int x = 1, y = 2;
    int *a = &x, *b = &y;
    cout << *a + *b;`), hints: ['Which name does the `*` belong to?'], explain: 'The `*` belongs to `a` only, so `b` is a plain int and cannot hold `&y`. Each pointer name needs its own `*`.' },
    { id: 'pointer-basics-q5', kind: 'trace', mode: 'vars', vars: ['x', 'y'], prompt: 'Dry run. Fill in x and y whenever they change.', code: prog(cpp`
    int x = 2, y = 5;
    int* p = &x;
    int* q = &y;
    *p = *q + 1;
    p = q;
    *p = *p * 2;
    cout << x << " " << y;`), hints: ['Line 8 changes x (p points to x).', 'After line 9, p points to y.'], explain: 'x = 5 + 1 = 6. Then p moves to y and y = 5 × 2 = 10. Output `6 10`.' },
    { id: 'pointer-basics-q6', kind: 'blanks', prompt: 'Make `best` point to nothing at first, then to `marks` if the student passed. Print through it only when it is safe. Expected: `Best: 77`.', code: prog(cpp`
    int* best = [[1]];
    int marks = 77;
    if (marks >= 50) {
        best = [[2]]marks;
    }
    if (best [[3]] nullptr) {
        cout << "Best: " << *best;
    }`), blanks: [{ answers: ['nullptr', 'NULL', '0'] }, { answers: ['&'] }, { answers: ['!='] }], chips: ['nullptr', '&', '*', '!=', '=='], output: 'Best: 77', hints: ['Which value means "points to nothing"?', 'A pointer stores an address.'], explain: '`nullptr` first, `&marks` to point, and `!= nullptr` before using `*best`.' },
    { id: 'pointer-basics-q7', kind: 'mcq', tag: 'tricky', prompt: 'What happens here?\n`int* p;`\n`*p = 10;`', options: ['p holds a garbage address, so 10 is written to a random place — usually a crash', 'p becomes 10', 'p points to a new box holding 10', 'It does not compile'], answer: 0, hints: ['What address is inside p before anything is stored in it?'], explain: 'It compiles, but p was never given an address. The dry run stops with a runtime error; a real program may crash or silently damage other data. Always start with `nullptr` or a real address.' },
    { id: 'pointer-basics-q8', kind: 'paths', prompt: 'Bus booking: `row` points to the chosen row counter. Find an input for every path.', code: prog(cpp`
    int front = 0, back = 0;
    int* row = nullptr;
    int choice;
    cin >> choice;
    if (choice == 1) {
        row = &front;
    } else if (choice == 2) {
        row = &back;
    }
    if (row != nullptr) {
        *row = *row + 1;
        cout << "Booked: " << front << " " << back;
    } else {
        cout << "Invalid choice";
    }`), paths: [{ label: '`row` points to `front`', line: 10 }, { label: '`row` points to `back`', line: 12 }, { label: '`Invalid choice` (row stays nullptr)', line: 18 }], start: '1', hints: ['Which choice leaves row as nullptr?'], explain: '`1` → front, `2` → back, any other number (e.g. `7`) → row stays nullptr → `Invalid choice`. Three paths, three inputs.' },
  ],
  cheatsheet: [
    { code: 'int* p = &x;', text: 'p points to x' },
    { code: '*p = 5;', text: 'store 5 in the box p points to (x)' },
    { code: 'p = &y;', text: 'move the arrow to y' },
    { code: 'int* p = nullptr;  if (p != nullptr) …', text: 'point to nothing; check before using *p' },
  ],
};

// ------------------------------------------------------------------ Level: pointers & arrays
const LArrays: Level = {
  id: 'pointers-arrays',
  kind: 'lesson',
  title: 'Pointers and arrays',
  tagline: 'An array name is the address of its first box. Add 1 to a pointer and it jumps to the next element — so a pointer can walk along an array.',
  minutes: 25,
  objectives: [
    'You can explain why `p + 1` moves one whole element (not one byte)',
    'You can read `*(p + i)`, `p[i]` and `p - a` and walk an array with a pointer',
    'You can walk a C-string with `char*` until `\'\\0\'`',
  ],
  learn: [
    { t: 'p', text: 'The boxes of an array are neighbours. When you use the array name `arr` in an expression, C++ turns it into **the address of `arr[0]`**. So `int* p = arr;` is the same as `int* p = &arr[0];` — the arrow goes to the first box.' },
    { t: 'viz', title: 'Moving along an array', code: prog(cpp`
    int arr[5] = {10, 20, 30, 40, 50};
    int* p = arr;
    cout << *p << endl;
    p = p + 2;
    cout << *p << endl;
    cout << *(p + 1) << " " << p[1] << endl;
    cout << p - arr << endl;`) },
    { t: 'table', head: ['Code', 'Means', 'Here (after line 8)'], rows: [
      ['`p + 1`', 'the address one **element** further', 'address of arr[3]'],
      ['`*(p + 1)`', 'the box one element further', 'arr[3] = 40'],
      ['`p[1]`', 'exactly the same as `*(p + 1)`', '40'],
      ['`p - arr`', 'how many elements apart', '2 (p points to arr[2])'],
      ['`arr[i]`', 'is really `*(arr + i)`', ''],
    ] },
    { t: 'callout', tone: 'key', title: 'p + 1 is NOT one byte further', text: 'A pointer moves in steps of **its type**: `int*` jumps 4 bytes, `double*` 8 bytes, `char*` 1 byte. Switch on **Addresses & sizes** and watch the address grow by `sizeof(int)` = 4.' },
    { t: 'viz', title: 'Walk the array with a pointer', code: prog(cpp`
    int marks[4] = {70, 85, 60, 90};
    int total = 0;
    for (int* p = marks; p < marks + 4; p++) {
        total = total + *p;
    }
    cout << "Total: " << total << endl;`) },
    { t: 'h', text: 'Walking a C-string' },
    { t: 'viz', title: 'Count letters until the hidden \'\\0\'', code: prog(cpp`
    char city[] = "Multan";
    char* c = city;
    int len = 0;
    while (*c != '\0') {
        len++;
        c++;
    }
    cout << city << " has " << len << " letters" << endl;`) },
    { t: 'callout', tone: 'warn', title: 'Two rules', text: '1) The array name is **fixed**: `arr++` or `arr = arr + 1` does not compile — copy it into a pointer and move the pointer. 2) Stop at the end: `p < marks + 4`, not `<=`. `marks + 4` is the address just *after* the last box; you may compare with it but never read `*` there.' },
  ],
  ways: {
    goal: 'Add up `int a[4] = {3, 8, 1, 6};` and print `18`.',
    items: [
      { title: 'Index with a[i]', code: prog(cpp`
    int a[4] = {3, 8, 1, 6};
    int sum = 0;
    for (int i = 0; i < 4; i++) {
        sum += a[i];
    }
    cout << sum;`) },
      { title: 'Pointer arithmetic *(a + i)', code: prog(cpp`
    int a[4] = {3, 8, 1, 6};
    int sum = 0;
    for (int i = 0; i < 4; i++) {
        sum += *(a + i);
    }
    cout << sum;`), note: 'This is what `a[i]` means inside the compiler.' },
      { title: 'Move a pointer with p++', code: prog(cpp`
    int a[4] = {3, 8, 1, 6};
    int sum = 0;
    for (int* p = a; p < a + 4; p++) {
        sum += *p;
    }
    cout << sum;`) },
      { title: 'Index a pointer with p[i]', code: prog(cpp`
    int a[4] = {3, 8, 1, 6};
    int* p = a;
    int sum = 0;
    for (int i = 0; i < 4; i++) {
        sum += p[i];
    }
    cout << sum;`), note: 'A pointer can use `[ ]` just like an array.' },
      { title: 'while with an end pointer', code: prog(cpp`
    int a[4] = {3, 8, 1, 6};
    int* p = a;
    int* end = a + 4;
    int sum = 0;
    while (p != end) {
        sum += *p;
        p++;
    }
    cout << sum;`), note: '`end` points just past the last box — we stop there and never read it.' },
    ],
    takeaway: '`a[i]`, `*(a + i)`, `p[i]` and walking `*p` are the same boxes reached in different ways.',
    check: { id: 'pointers-arrays-ways-check', kind: 'mcq', prompt: 'Inside `for (int i = 0; i < 4; i++)`, which line does NOT add the element `a[i]`?', options: ['`sum += *a + i;`', '`sum += *(a + i);`', '`sum += a[i];`', '`sum += p[i];` (with `int* p = a;`)'], answer: 0, hints: ['`*` is done before `+`.'], explain: '`*a + i` means `(*a) + i` = 3 + i: the first element plus the index. The brackets in `*(a + i)` move first, then follow the arrow.' },
  },
  watch: [
    { title: 'double steps are 8 bytes', intro: 'Turn on **Addresses & sizes**: each `p++` adds 8 to the address, because a double is 8 bytes.', code: prog(cpp`
    double price[3] = {99.5, 150, 20.25};
    double* p = price;
    p++;
    cout << *p << endl;
    p++;
    cout << *p << endl;`) },
    { title: 'Backwards with a pointer', intro: 'Start just after the last box, step back first, then read. How many numbers are printed? 5.', code: prog(cpp`
    int a[5] = {1, 2, 3, 4, 5};
    int* p = a + 5;
    while (p != a) {
        p--;
        cout << *p << " ";
    }
    cout << endl;`) },
    { title: 'Where is the first negative balance?', intro: '`p - bal` turns a pointer back into an index.', code: prog(cpp`
    int bal[6] = {500, 200, 0, -150, 300, -20};
    int* p = bal;
    while (*p >= 0) {
        p++;
    }
    cout << "First negative: " << *p << " at index " << p - bal << endl;`) },
  ],
  think: {
    title: 'Count the vowels in a name',
    problem: 'Read one word (a name). Walk through it with a `char*` and count the lowercase vowels a, e, i, o, u.',
    steps: [
      { text: 'Make room for the name and read it.', lines: [5, 6] },
      { text: 'Start the count at 0 and point `c` at the first letter.', lines: [7, 8] },
      { text: 'Repeat until `c` reaches the hidden `\'\\0\'`.', lines: [9] },
      { text: 'If the letter `*c` is a vowel, count it.', lines: [10, 11] },
      { text: 'Move `c` to the next letter.', lines: [13] },
      { text: 'Print the answer.', lines: [15] },
    ],
    code: prog(cpp`
    char name[20];
    cin >> name;
    int count = 0;
    char* c = name;
    while (*c != '\0') {
        if (*c == 'a' || *c == 'e' || *c == 'i' || *c == 'o' || *c == 'u') {
            count++;
        }
        c++;
    }
    cout << name << " has " << count << " vowels" << endl;`),
    input: 'Faisal\n',
    why: 'We do not need the length first: the `\'\\0\'` at the end tells the pointer where to stop.',
    yourTurn: {
      id: 'pointers-arrays-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['count'],
      prompt: 'Dry run with the name `Ali`. Careful with the capital letter!',
      code: prog(cpp`
    char name[20];
    cin >> name;
    int count = 0;
    char* c = name;
    while (*c != '\0') {
        if (*c == 'a' || *c == 'e' || *c == 'i' || *c == 'o' || *c == 'u') {
            count++;
        }
        c++;
    }
    cout << name << " has " << count << " vowels" << endl;`),
      input: 'Ali\n',
      hints: ["`'A'` is not the same as `'a'`.", 'The loop runs 3 times, then `*c` is the hidden `\'\\0\'`.'],
      explain: "'A' is uppercase, so only 'i' counts: `Ali has 1 vowels`.",
    },
  },
  practice: [
    { id: 'pointers-arrays-q1', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    int a[5] = {2, 4, 6, 8, 10};
    int* p = a + 1;
    cout << *p << " " << *(p + 2) << " " << p[3] << " " << *p + 2;`), hints: ['p points to a[1].', '`*p + 2` adds 2 to the value, it does not move.'], explain: '*p = a[1] = 4; *(p+2) = a[3] = 8; p[3] = a[4] = 10; *p + 2 = 4 + 2 = 6 → `4 8 10 6`.' },
    { id: 'pointers-arrays-q2', kind: 'mcq', prompt: '`double d[4]` starts at address 2000 (decimal). `double* p = d;` What address is `p + 3`?', options: ['2024', '2003', '2012', '2032'], answer: 0, hints: ['A double is 8 bytes.'], explain: 'p + 3 moves 3 doubles: 2000 + 3 × 8 = **2024** — the address of d[3].' },
    { id: 'pointers-arrays-q3', kind: 'trace', mode: 'vars', vars: ['sum'], prompt: 'The pointer jumps 2 elements each time. Dry run — how many times does the loop body run?', code: prog(cpp`
    int a[6] = {1, 2, 3, 4, 5, 6};
    int sum = 0;
    for (int* p = a; p < a + 6; p += 2) {
        sum += *p;
    }
    cout << sum;`), hints: ['p visits a[0], a[2], a[4], then a + 6 stops it.'], explain: 'The body runs 3 times: 1 + 3 + 5 = **9**.' },
    { id: 'pointers-arrays-q4', kind: 'blanks', prompt: 'Find the top score with a pointer walk. Expected: `Top score: 78`.', code: prog(cpp`
    int runs[5] = {45, 12, 78, 33, 60};
    int best = runs[0];
    for (int* p = runs; p [[1]] runs + 5; [[2]]) {
        if ([[3]] > best) {
            best = *p;
        }
    }
    cout << "Top score: " << best;`), blanks: [{ answers: ['<', '!='] }, { answers: ['p++', '++p', 'p += 1', 'p = p + 1'] }, { answers: ['*p', 'p[0]'] }], chips: ['<', '<=', 'p++', '*p', 'p', '&p'], output: 'Top score: 78', hints: ['`runs + 5` is just past the end — stop before it.', 'Compare the value, not the address.'], explain: '`p < runs + 5`, `p++`, and `*p` for the value p points to.' },
    { id: 'pointers-arrays-q5', kind: 'bug', prompt: 'This does not compile. Find the line.', code: prog(cpp`
    int a[3] = {7, 8, 9};
    int total = 0;
    for (int i = 0; i < 3; i++) {
        total += *a;
        a++;
    }
    cout << total;`), bugLine: 9, options: ['An array name cannot move: use `int* p = a;` and move `p`', 'Write `*a++` instead', 'Use `<=` in the loop', '`total` must be a pointer'], answer: 0, fixed: prog(cpp`
    int a[3] = {7, 8, 9};
    int* p = a;
    int total = 0;
    for (int i = 0; i < 3; i++) {
        total += *p;
        p++;
    }
    cout << total;`), hints: ['Is `a` a variable you can change?'], explain: 'An array name always means its first box; it cannot be changed. g++: *lvalue required as increment operand*. A pointer copy can move.' },
    { id: 'pointers-arrays-q6', kind: 'predict', tag: 'tricky', prompt: 'Predict the output. (Note: for a `char*`, cout prints the **text** from that point until `\'\\0\'` — not an address.)', code: prog(cpp`
    char word[] = "pakistan";
    char* p = word;
    while (*p != 's') {
        p++;
    }
    cout << p - word << " " << p;`), hints: ["Count the letters before the 's': p-a-k-i.", 'Printing a char* prints the rest of the text.'], explain: "The 's' is at index 4, and from there the text is `stan`: `4 stan`." },
    { id: 'pointers-arrays-q7', kind: 'parsons', prompt: 'Build a program that counts the letters of "Quetta" with a `char*` walk and prints `6`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    char s[] = "Quetta";', '    char* p = s;', '    int len = 0;', "    while (*p != '\\0') {", '        len++;', '        p++;', '    }', '    cout << len;', '    return 0;', '}'], distractors: ['    char* p = &s;', '    p = p + len;'], hints: ['Point p at the first letter, then loop until the hidden end marker.'], explain: 'Each round counts one letter and moves p one char forward; the loop stops at `\'\\0\'`.' },
    { id: 'pointers-arrays-q8', kind: 'mcq', prompt: 'With `int a[5]` and `int* p = a;`, which one is NOT the same box as `a[3]`?', options: ['`*a + 3`', '`*(a + 3)`', '`p[3]`', '`*(p + 3)`'], answer: 0, hints: ['Look for the missing brackets.'], explain: '`*a + 3` is the **value** a[0] plus 3. The others all reach the 4th box.' },
  ],
  cheatsheet: [
    { code: 'int* p = arr;', text: 'same as `&arr[0]`' },
    { code: 'p + i,  *(p + i),  p[i]', text: 'i elements further (i × sizeof bytes)' },
    { code: 'p - arr', text: 'index of the box p points to' },
    { code: "while (*c != '\\0') c++;", text: 'walk a C-string to its end' },
  ],
};

// ------------------------------------------------------------------ Level: pointers & functions
const LFunc: Level = {
  id: 'pointers-functions',
  kind: 'lesson',
  title: 'Pointers and functions',
  tagline: 'Give a function the **address** of your variable and it can reach back and change it. A function can also hand back a pointer — as long as it points somewhere that still exists.',
  minutes: 25,
  objectives: [
    'You can write a function that changes the caller\'s variables through pointers (and compare it with references)',
    'You can explain why an array parameter is really a pointer',
    'You can return a pointer safely and read `const int*` vs `int* const`',
  ],
  learn: [
    { t: 'p', text: 'Normally a function gets a **copy** of each argument (you saw this in Level 1: `addBonus` could not change `marks`). If you pass `&x` instead, the function gets the **address**. Inside, `*p` follows the arrow back into the caller\'s frame and changes the real x.' },
    { t: 'viz', title: 'Swap two players\' scores through pointers', code: progF(cpp`
void swapScores(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`, cpp`
    int ali = 45, sara = 72;
    swapScores(&ali, &sara);
    cout << "Ali: " << ali << ", Sara: " << sara << endl;`) },
    { t: 'compare', items: [
      { title: 'With pointers', good: true, code: progF(cpp`
void swapP(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}`, cpp`
    int x = 1, y = 2;
    swapP(&x, &y);
    cout << x << y;`), note: 'The call shows `&` — the reader can see x and y may change. Inside you must write `*a`.' },
      { title: 'With references', good: true, code: progF(cpp`
void swapR(int& a, int& b) {
    int t = a;
    a = b;
    b = t;
}`, cpp`
    int x = 1, y = 2;
    swapR(x, y);
    cout << x << y;`), note: 'Shorter: `a` is just another name for x. No arrows, no `*`, and it can never be nullptr.' },
    ] },
    { t: 'table', head: ['', 'By value `int v`', 'By reference `int& r`', 'By pointer `int* p`'], rows: [
      ['Call', '`f(x)`', '`f(x)`', '`f(&x)`'],
      ['Inside', '`v` is a copy', '`r` IS x', '`*p` is x'],
      ['Changes the caller?', 'no', 'yes', 'yes'],
      ['Can mean "nothing"?', '—', 'no', 'yes: `nullptr`'],
    ] },
    { t: 'callout', tone: 'info', title: 'Array parameters are pointers', text: 'In `void f(int a[], int n)`, `a` is really an `int*`: only the address of the first box is passed, the array is NOT copied. That is why a function can change your array, and why you must pass `n` — inside the function `sizeof(a)` is just 8, the size of a pointer.' },
    { t: 'viz', title: 'Return a pointer to the most expensive item', code: progF(cpp`
int* findMax(int a[], int n) {
    int* best = &a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] > *best) {
            best = &a[i];
        }
    }
    return best;
}`, cpp`
    int price[5] = {350, 1200, 800, 1500, 90};
    int* top = findMax(price, 5);
    cout << "Most expensive: " << *top << " at index " << top - price << endl;
    *top = *top - 100;
    cout << "After discount: " << price[3] << endl;`) },
    { t: 'compare', items: [
      { title: 'Never return the address of a local', good: false, code: cpp`
int* makeScore() {
    int s = 90;
    return &s;   // s dies when the function ends!
}`, note: 'When the function returns, its frame (and `s`) is removed. The caller gets a **dangling** pointer to a box that no longer exists. g++ warns: *address of local variable returned*.' },
      { title: 'Return a pointer into the caller\'s array (or heap memory)', good: true, code: cpp`
int* findMax(int a[], int n) {
    int* best = &a[0];
    ...
    return best;  // points into the CALLER's array: still alive
}`, note: 'The array belongs to `main`, so it still exists after `findMax` ends. (Heap memory from `new` — next level — also stays alive.)' },
    ] },
    { t: 'table', head: ['Declaration', 'Change `*p`?', 'Move `p`?', 'Read it as'], rows: [
      ['`const int* p`', 'no', 'yes', '"pointer to a constant int" — look, don\'t touch'],
      ['`int* const p`', 'yes', 'no', '"constant pointer to int" — the arrow is glued'],
      ['`const int* const p`', 'no', 'no', 'both locked'],
    ], caption: 'Read right-to-left: `int* const p` = "p is a const pointer to int".' },
  ],
  ways: {
    goal: 'A function should double the caller\'s `n`: `n` is 6, the program prints `12`.',
    items: [
      { title: 'Pointer parameter', code: progF(cpp`
void twice(int* p) {
    *p = *p * 2;
}`, cpp`
    int n = 6;
    twice(&n);
    cout << n;`) },
      { title: 'Reference parameter', code: progF(cpp`
void twice(int& r) {
    r = r * 2;
}`, cpp`
    int n = 6;
    twice(n);
    cout << n;`), note: 'No `&` at the call — the reference does the work.' },
      { title: 'Return the new value', code: progF(cpp`
int twice(int v) {
    return v * 2;
}`, cpp`
    int n = 6;
    n = twice(n);
    cout << n;`), note: 'The simplest: no pointer at all. The caller decides to store the answer.' },
      { title: 'Pass a pointer variable', code: progF(cpp`
void twice(int* p) {
    *p += *p;
}`, cpp`
    int n = 6;
    int* q = &n;
    twice(q);
    cout << n;`), note: '`q` already holds `&n`, so we pass `q` (a copy of the address — it still points to n).' },
    ],
    takeaway: 'To change the caller\'s variable, the function needs its **address** (pointer) or an **alias** (reference) — or it can return the new value.',
    check: { id: 'pointers-functions-ways-check', kind: 'mcq', prompt: 'Which function does NOT change n when called as shown?', options: ['`void twice(int v) { v = v * 2; }` called as `twice(n);`', '`void twice(int* p) { *p *= 2; }` called as `twice(&n);`', '`void twice(int& r) { r *= 2; }` called as `twice(n);`', '`int twice(int v) { return v * 2; }` called as `n = twice(n);`'], answer: 0, hints: ['Which one only changes a copy and throws it away?'], explain: '`v` is a copy of n. Doubling the copy does nothing to n, and nothing is returned.' },
  },
  watch: [
    { title: 'Two answers from one function', intro: 'A function can return only one value — but through pointers it can fill in as many boxes as you give it.', code: progF(cpp`
void minMax(int a[], int n, int* lo, int* hi) {
    *lo = a[0];
    *hi = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] < *lo) {
            *lo = a[i];
        }
        if (a[i] > *hi) {
            *hi = a[i];
        }
    }
}`, cpp`
    int temps[4] = {31, 24, 38, 29};
    int low, high;
    minMax(temps, 4, &low, &high);
    cout << "Min " << low << ", Max " << high << endl;`) },
    { title: 'The function changes the caller\'s array', intro: 'Only the address of `marks[0]` is passed; `m[i]` reaches the real boxes in main.', code: progF(cpp`
void addBonus(int* m, int n) {
    for (int i = 0; i < n; i++) {
        m[i] = m[i] + 5;
    }
}`, cpp`
    int marks[3] = {40, 55, 70};
    addBonus(marks, 3);
    cout << marks[0] << " " << marks[1] << " " << marks[2] << endl;`) },
    { title: 'const int*: look, but do not touch', intro: 'The function promises not to change the runs. The pointer itself can still move.', code: progF(cpp`
void show(const int* a, int n) {
    for (const int* p = a; p < a + n; p++) {
        cout << *p << " ";
    }
    cout << endl;
}`, cpp`
    int runs[4] = {12, 0, 45, 7};
    show(runs, 4);`) },
  ],
  think: {
    title: 'Split the bill',
    problem: 'Friends share a restaurant bill equally in whole rupees. Write `split(total, people, &share, &extra)` that fills in each person\'s share and the rupees left over. Read the bill and the number of friends.',
    steps: [
      { text: 'The function needs 2 inputs (by value) and 2 outputs (pointers).', lines: [4] },
      { text: 'Store the share in the box `each` points to.', lines: [5] },
      { text: 'Store the leftover in the box `left` points to.', lines: [6] },
      { text: 'In main: read the bill and the number of friends.', lines: [10, 11] },
      { text: 'Make two empty boxes for the answers, and pass their addresses.', lines: [12, 13] },
      { text: 'Print the answers.', lines: [14] },
    ],
    code: progF(cpp`
void split(int total, int people, int* each, int* left) {
    *each = total / people;
    *left = total % people;
}`, cpp`
    int bill, friends;
    cin >> bill >> friends;
    int share, extra;
    split(bill, friends, &share, &extra);
    cout << "Each pays " << share << ", left over " << extra << endl;`),
    input: '2350 4\n',
    why: 'Watch the arrows from `each` and `left` go back into main\'s frame: the function writes straight into `share` and `extra`.',
    yourTurn: {
      id: 'pointers-functions-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['bill', 'friends', 'share', 'extra'],
      prompt: 'Dry run with a bill of 1000 shared by 3 friends.',
      code: progF(cpp`
void split(int total, int people, int* each, int* left) {
    *each = total / people;
    *left = total % people;
}`, cpp`
    int bill, friends;
    cin >> bill >> friends;
    int share, extra;
    split(bill, friends, &share, &extra);
    cout << "Each pays " << share << ", left over " << extra << endl;`),
      input: '1000 3\n',
      hints: ['1000 / 3 in whole numbers is 333.', '1000 % 3 is 1.'],
      explain: 'share = 333 and extra = 1 are written by the function through the pointers: `Each pays 333, left over 1`.',
    },
  },
  practice: [
    { id: 'pointers-functions-q1', kind: 'predict', prompt: 'Predict the output.', code: progF(cpp`
void update(int* p, int q) {
    *p = *p + 10;
    q = q + 10;
}`, cpp`
    int a = 1, b = 1;
    update(&a, b);
    cout << a << " " << b;`), hints: ['Which argument is an address, and which is a copy?'], explain: 'a is changed through the pointer; b was copied into q. Output `11 1`.' },
    { id: 'pointers-functions-q2', kind: 'bug', prompt: 'This does not compile. Find the line.', code: progF(cpp`
void swapScores(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}`, cpp`
    int x = 10, y = 20;
    swapScores(x, y);
    cout << x << " " << y;`), bugLine: 12, options: ['Pass the addresses: `swapScores(&x, &y);`', 'Write `swapScores(*x, *y);`', 'Change the parameters to `int a, int b`', 'Remove `int t`'], answer: 0, fixed: progF(cpp`
void swapScores(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}`, cpp`
    int x = 10, y = 20;
    swapScores(&x, &y);
    cout << x << " " << y;`), hints: ['The function wants `int*` — what are x and y?'], explain: 'x and y are ints; the function needs their addresses. (Changing the parameters to plain ints would compile, but then the swap would not reach main.)' },
    { id: 'pointers-functions-q3', kind: 'mcq', prompt: 'Given `int a = 1, b = 2;`, `const int* p = &a;` and `int* const q = &a;` — which line does NOT compile?', options: ['`*p = 5;`', '`p = &b;`', '`*q = 5;`', '`cout << *p + *q;`'], answer: 0, hints: ['`const int*`: the int is read-only through p.'], explain: 'p may move but may not change the box it points to. q is the opposite: it may change `*q` but may never move (so `q = &b;` would be the error for q).' },
    { id: 'pointers-functions-q4', kind: 'bug', prompt: 'The function should only add up the marks, but someone added a line that does not compile. Find it.', code: progF(cpp`
int total(const int* a, int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
        a[i] = 0;
    }
    return s;
}`, cpp`
    int marks[3] = {15, 20, 25};
    cout << total(marks, 3);`), bugLine: 8, options: ['`a` points to const ints — the function may not change them; remove this line', 'Change `s += a[i]` to `s = a[i]`', 'Return `a` instead of `s`', 'Start the loop at 1'], answer: 0, fixed: progF(cpp`
int total(const int* a, int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}`, cpp`
    int marks[3] = {15, 20, 25};
    cout << total(marks, 3);`), hints: ['What does `const` in the parameter promise?'], explain: 'g++: *assignment of read-only location*. `const int*` is a promise to the caller: "I will only read your array". The fixed program prints 60.' },
    { id: 'pointers-functions-q5', kind: 'blanks', tag: 'real life', prompt: 'Return a pointer to the cheapest item. Expected: `Cheapest: 120 (item 1)`.', code: progF(cpp`
int* cheapest(int a[], int n) {
    int* best = [[1]];
    for (int i = 1; i < n; i++) {
        if (a[i] < [[2]]) {
            best = [[3]];
        }
    }
    return best;
}`, cpp`
    int price[4] = {450, 120, 300, 999};
    int* c = cheapest(price, 4);
    cout << "Cheapest: " << *c << " (item " << c - price << ")";`), blanks: [{ answers: ['&a[0]', 'a', 'a + 0'] }, { answers: ['*best', 'best[0]'] }, { answers: ['&a[i]', 'a + i'] }], chips: ['&a[0]', 'a[0]', '*best', 'best', '&a[i]', 'a[i]'], output: 'Cheapest: 120 (item 1)', hints: ['best is a pointer, so it needs an address.', 'Compare the price with the value best points to.'], explain: 'Start at `&a[0]`, compare with `*best`, and move the arrow with `best = &a[i]`.' },
    { id: 'pointers-functions-q6', kind: 'trace', mode: 'vars', vars: ['marks[0]', 'marks[1]', 'marks[2]'], prompt: 'Every mark below 50 is raised to 50 inside the function. Dry run.', code: progF(cpp`
void fix(int* m, int n) {
    for (int i = 0; i < n; i++) {
        if (m[i] < 50) {
            m[i] = 50;
        }
    }
}`, cpp`
    int marks[3] = {45, 72, 38};
    fix(marks, 3);
    cout << marks[0] << " " << marks[1] << " " << marks[2];`), hints: ['`m` points to marks[0], so `m[i]` IS `marks[i]`.'], explain: 'marks[0] and marks[2] are raised; the function changed main\'s array. Output `50 72 50`.' },
    { id: 'pointers-functions-q7', kind: 'mcq', tag: 'tricky', prompt: '`int* getBonus() { int b = 500; return &b; }` — what is wrong?', options: ['b is destroyed when the function ends, so the returned pointer dangles', 'Functions cannot return pointers', 'It returns 500, not an address', 'Nothing is wrong'], answer: 0, hints: ['Where does `b` live, and for how long?'], explain: '`b` lives in the function\'s frame, which is removed at `return`. Reading `*getBonus()` is undefined — it may even seem to work, which makes the bug hard to find.' },
    { id: 'pointers-functions-q8', kind: 'paths', prompt: '`findRoll` returns a pointer to the matching roll number, or `nullptr`. Find an input for every path.', code: progF(cpp`
int* findRoll(int a[], int n, int roll) {
    for (int i = 0; i < n; i++) {
        if (a[i] == roll) {
            return &a[i];
        }
    }
    return nullptr;
}`, cpp`
    int rolls[4] = {101, 105, 110, 123};
    int r;
    cin >> r;
    int* hit = findRoll(rolls, 4, r);
    if (hit != nullptr) {
        cout << "Found at seat " << hit - rolls;
    } else {
        cout << "Not in class";
    }`), paths: [{ label: '`Found at seat …`', line: 18 }, { label: '`Not in class`', line: 20 }], start: '105', hints: ['Try a number that is not in the list.'], explain: 'Any of 101, 105, 110, 123 is found (e.g. 105 → seat 1). Any other number (e.g. 200) makes the function return `nullptr`.' },
  ],
  cheatsheet: [
    { code: 'void f(int* p) { *p = …; }   f(&x);', text: 'the function changes the caller\'s x' },
    { code: 'void f(int a[], int n)', text: '`a` is really `int*` — the array is not copied' },
    { code: 'return &a[i];', text: 'OK: points into the caller\'s array. Never `return &local;`' },
    { code: 'const int* p  /  int* const p', text: 'read-only target  /  arrow cannot move' },
  ],
};

// ------------------------------------------------------------------ Level: new & delete
const LDyn: Level = {
  id: 'dynamic-memory',
  kind: 'lesson',
  title: 'Dynamic memory: new and delete',
  tagline: 'Some memory you ask for yourself, while the program runs, as big as you need. `new` gives it to you on the **heap**; `delete` gives it back.',
  minutes: 30,
  objectives: [
    'You can explain the difference between the stack and the heap',
    'You can use `new` / `delete` and `new int[n]` / `delete[]` correctly',
    'You can spot a memory leak and fix it',
  ],
  learn: [
    { t: 'p', text: 'So far every variable lived on the **stack**: it is made when its line runs and removed automatically when its block or function ends. The **heap** is a separate storage room. You ask for a box with `new`, you get back its **address** (so you need a pointer to hold it), and the box stays until **you** return it with `delete`. In the dry run, heap boxes appear in their own **Heap** section, named `heap#1`, `heap#2` …' },
    { t: 'table', head: ['', 'Stack', 'Heap'], rows: [
      ['How you get a box', 'declare a variable: `int x;`', '`new int` — returns an address'],
      ['Size', 'must be known when you write the code', 'can be decided while running (`new int[n]`)'],
      ['When it disappears', 'automatically, at the end of the block', 'only when you `delete` it'],
      ['Has a name?', 'yes (`x`)', 'no — only a pointer leads to it'],
    ] },
    { t: 'viz', title: 'Two heap boxes', code: prog(cpp`
    int* p = new int;
    *p = 40;
    int* q = new int(5);
    *p = *p + *q;
    cout << *p << endl;
    delete p;
    p = nullptr;
    delete q;
    q = nullptr;`) },
    { t: 'syntax', title: 'An array whose size you learn at run time', code: 'int* a = new int[n];\n…\ndelete[] a;', parts: [
      { token: 'new int[n]', text: 'make n int boxes side by side on the heap; gives the address of the first' },
      { token: 'a[i]', text: 'use it exactly like an array (`a[i]` is `*(a + i)`)' },
      { token: 'delete[] a', text: 'give the WHOLE array back — with `[]` because it was made with `new[]`' },
    ] },
    { t: 'viz', title: 'As many marks as the user wants', code: prog(cpp`
    int n;
    cout << "How many students? ";
    cin >> n;
    int* marks = new int[n];
    int sum = 0;
    for (int i = 0; i < n; i++) {
        cin >> marks[i];
        sum += marks[i];
    }
    cout << "Average: " << sum / n << endl;
    delete[] marks;
    marks = nullptr;`), input: '3\n70 85 91\n' },
    { t: 'callout', tone: 'key', title: 'The three rules', text: '1) Every `new` needs exactly one `delete`; every `new[]` needs exactly one `delete[]`. 2) After deleting, set the pointer to `nullptr` — it still holds the old address (a **dangling** pointer, drawn in red). 3) Never lose the last pointer to a heap box before you delete it.' },
    { t: 'viz', title: 'A dynamic 2D array: rows of bus seats', code: prog(cpp`
    int rows = 2, cols = 3;
    int** seat = new int*[rows];
    for (int r = 0; r < rows; r++) {
        seat[r] = new int[cols];
        for (int c = 0; c < cols; c++) {
            seat[r][c] = r * cols + c + 1;
        }
    }
    cout << "Last seat: " << seat[1][2] << endl;
    for (int r = 0; r < rows; r++) {
        delete[] seat[r];
    }
    delete[] seat;`) },
    { t: 'callout', tone: 'warn', title: 'Memory leaks', text: 'If you forget `delete`, the box stays taken until the program ends — a **memory leak**. One leak is small, but a leak inside a loop (or in a program that runs for days, like a server) eats more and more memory. At the end of every dry run, DryRun lists any heap box that was never deleted.' },
  ],
  ways: {
    goal: 'Put 10, 20 and 30 on the heap, print their sum `60`, and give the memory back.',
    items: [
      { title: 'new int[3], fill one by one', code: prog(cpp`
    int* a = new int[3];
    a[0] = 10;
    a[1] = 20;
    a[2] = 30;
    cout << a[0] + a[1] + a[2];
    delete[] a;`) },
      { title: 'new with a list of values', code: prog(cpp`
    int* a = new int[3]{10, 20, 30};
    cout << a[0] + a[1] + a[2];
    delete[] a;`) },
      { title: 'Fill and add with a loop', code: prog(cpp`
    int* a = new int[3];
    int sum = 0;
    for (int i = 0; i < 3; i++) {
        a[i] = (i + 1) * 10;
        sum += a[i];
    }
    cout << sum;
    delete[] a;`) },
      { title: 'Size typed by the user', code: prog(cpp`
    int n;
    cin >> n;
    int* a = new int[n];
    int sum = 0;
    for (int i = 0; i < n; i++) {
        a[i] = (i + 1) * 10;
        sum += a[i];
    }
    cout << sum;
    delete[] a;`), input: '3\n', note: 'This is the real reason for `new[]`: the size is not known until the program runs.' },
      { title: 'Three single boxes', code: prog(cpp`
    int* x = new int(10);
    int* y = new int(20);
    int* z = new int(30);
    cout << *x + *y + *z;
    delete x;
    delete y;
    delete z;`), note: 'Three `new` → three `delete` (no brackets, because these are single boxes).' },
    ],
    takeaway: 'However you make it, count them: each `new` has one `delete`, each `new[]` has one `delete[]`.',
    check: { id: 'dynamic-memory-ways-check', kind: 'mcq', prompt: 'Which one does NOT give the memory back correctly?', options: ['`int* a = new int[3]{10, 20, 30};` … `delete a;`', '`int* a = new int[3];` … `delete[] a;`', '`int* x = new int(10);` … `delete x;`', '`int* a = new int[3]{10, 20, 30};` … `delete[] a; a = nullptr;`'], answer: 0, hints: ['Look at how it was made and how it is deleted.'], explain: 'Made with `new[]`, so it must be freed with `delete[]`. Plain `delete` on an array is undefined behaviour.' },
  },
  watch: [
    { title: 'A memory leak (look at the end!)', intro: 'Line 7 points `p` at a NEW box — the first box has no pointer left and can never be deleted. The final step lists the leak.', code: prog(cpp`
    int* p = new int(10);
    cout << *p << endl;
    p = new int(20);
    cout << *p << endl;
    delete p;`) },
    { title: 'Growing a class list from 3 to 4 students', intro: 'Arrays cannot grow. So: make a bigger one, copy, delete the old one, move the pointer.', code: prog(cpp`
    int n = 3;
    int* list = new int[n]{101, 102, 103};
    int* bigger = new int[n + 1];
    for (int i = 0; i < n; i++) {
        bigger[i] = list[i];
    }
    bigger[n] = 104;
    delete[] list;
    list = bigger;
    n++;
    cout << "Last roll number: " << list[n - 1] << endl;
    delete[] list;
    list = nullptr;`) },
    { title: 'A function that makes an array for you', intro: 'Heap memory survives the end of the function — so returning its address is fine. The caller must delete it.', code: progF(cpp`
int* makeTable(int n) {
    int* t = new int[n];
    for (int i = 0; i < n; i++) {
        t[i] = (i + 1) * 5;
    }
    return t;
}`, cpp`
    int* five = makeTable(4);
    cout << five[0] << " " << five[3] << endl;
    delete[] five;
    five = nullptr;`) },
  ],
  think: {
    title: 'Hot days',
    problem: 'Read how many days of temperatures there are, then the temperatures. Store them in a heap array of exactly that size. Print how many days were hotter than the (whole-number) average. Give the memory back.',
    steps: [
      { text: 'Read the number of days.', lines: [5, 6] },
      { text: 'Ask the heap for exactly `days` int boxes.', lines: [7] },
      { text: 'Read each temperature and add it to the sum.', lines: [9, 10, 11] },
      { text: 'Work out the average.', lines: [13] },
      { text: 'Walk the array again and count the days above the average.', lines: [15, 16, 17] },
      { text: 'Print the answer, then `delete[]` the array.', lines: [20, 21] },
    ],
    code: prog(cpp`
    int days;
    cin >> days;
    int* temp = new int[days];
    int sum = 0;
    for (int i = 0; i < days; i++) {
        cin >> temp[i];
        sum += temp[i];
    }
    int avg = sum / days;
    int hot = 0;
    for (int i = 0; i < days; i++) {
        if (temp[i] > avg) {
            hot++;
        }
    }
    cout << hot << " hot days (average " << avg << ")" << endl;
    delete[] temp;`),
    input: '5\n30 34 29 38 35\n',
    why: 'We need the temperatures twice (once for the average, once to compare), so we must store them — and we do not know how many until the program runs. That is exactly the job of `new int[days]`.',
    yourTurn: {
      id: 'dynamic-memory-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['sum', 'avg', 'hot'],
      prompt: 'Dry run with 2 days: 31 and 35.',
      code: prog(cpp`
    int days;
    cin >> days;
    int* temp = new int[days];
    int sum = 0;
    for (int i = 0; i < days; i++) {
        cin >> temp[i];
        sum += temp[i];
    }
    int avg = sum / days;
    int hot = 0;
    for (int i = 0; i < days; i++) {
        if (temp[i] > avg) {
            hot++;
        }
    }
    cout << hot << " hot days (average " << avg << ")" << endl;
    delete[] temp;`),
      input: '2\n31 35\n',
      hints: ['sum = 31 + 35 = 66.', 'Only 35 is above 33.'],
      explain: 'avg = 66 / 2 = 33; only 35 > 33, so `1 hot days (average 33)`.',
    },
  },
  practice: [
    { id: 'dynamic-memory-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int* a = new int(7);
    int* b = new int(3);
    *a = *a * *b;
    *b = *a - 1;
    cout << *a << " " << *b << endl;
    delete a;
    delete b;`), hints: ['`*a * *b` is 7 × 3.'], explain: '*a = 21, then *b = 20: `21 20`.' },
    { id: 'dynamic-memory-q2', kind: 'mcq', prompt: 'How many heap boxes are created in total, and how many exist at the same time at most?', code: prog(cpp`
    for (int i = 0; i < 4; i++) {
        int* p = new int(i * i);
        cout << *p << " ";
        delete p;
    }`), options: ['4 created, at most 1 at a time', '1 created, reused 4 times', '4 created, all 4 at the same time', '0 — p is a stack variable'], answer: 0, hints: ['The loop runs 4 times; each round has one `new` and one `delete`.'], explain: 'Each round makes a box and deletes it before the next round: 4 boxes in total, never more than 1 alive. Step through it and watch the Heap section.' },
    { id: 'dynamic-memory-q3', kind: 'blanks', prompt: 'Make exactly `n` boxes on the heap, fill them, and free them correctly. Input `4` → `80`.', code: prog(cpp`
    int n;
    cin >> n;
    int* marks = [[1]] int[[[2]]];
    for (int i = 0; i < n; i++) {
        marks[i] = 50 + i * 10;
    }
    cout << marks[n - 1] << endl;
    [[3]] marks;
    marks = nullptr;`), blanks: [{ answers: ['new'] }, { answers: ['n'] }, { answers: ['delete[]', 'delete []'] }], chips: ['new', 'n', '4', 'delete', 'delete[]'], input: '4\n', hints: ['The size comes from the user.', 'It was made with `new[]`.'], explain: '`new int[n]` … `delete[] marks;`. marks[3] = 50 + 30 = 80.' },
    { id: 'dynamic-memory-q4', kind: 'bug', prompt: 'This does not compile. Find the line.', code: prog(cpp`
    int n = 3;
    int* price = new int[n]{250, 400, 150};
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += price[i];
    }
    cout << sum << endl;
    delete price[];`), bugLine: 12, options: ['The brackets go right after delete: `delete[] price;`', 'Write `delete price;`', 'Write `delete[n] price;`', 'Heap arrays cannot be deleted'], answer: 0, fixed: prog(cpp`
    int n = 3;
    int* price = new int[n]{250, 400, 150};
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += price[i];
    }
    cout << sum << endl;
    delete[] price;`), hints: ['Where do the `[]` go?'], explain: 'The syntax is `delete[] pointer;` — the brackets belong to `delete`, not to the name.' },
    { id: 'dynamic-memory-q5', kind: 'trace', mode: 'output', prompt: 'Write what each print step shows.', code: prog(cpp`
    int n = 4;
    int* sq = new int[n];
    for (int i = 0; i < n; i++) {
        sq[i] = i * i;
    }
    for (int i = n - 1; i >= 0; i--) {
        cout << sq[i] << " ";
    }
    delete[] sq;`), hints: ['The boxes hold 0, 1, 4, 9.', 'The second loop goes backwards.'], explain: 'It prints `9 4 1 0 ` — each element followed by a space.' },
    { id: 'dynamic-memory-q6', kind: 'parsons', prompt: 'Read n and then n numbers into a heap array; print them in reverse and free the memory. Input `3` and `4 8 15` → `15 8 4 `.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int n;', '    cin >> n;', '    int* a = new int[n];', '    for (int i = 0; i < n; i++) {', '        cin >> a[i];', '    }', '    for (int i = n - 1; i >= 0; i--) {', '        cout << a[i] << " ";', '    }', '    delete[] a;', '    return 0;', '}'], distractors: ['    int a[n];', '    delete a;'], input: '3\n4 8 15\n', hints: ['Read n BEFORE making the array.', 'Memory from `new[]` is freed with `delete[]`.'], explain: 'The size comes first, then `new int[n]`, then the loops, and finally `delete[] a;`.' },
    { id: 'dynamic-memory-q7', kind: 'mcq', prompt: 'A function runs `int x = 5;` and `int* h = new int(5);` and then returns (without delete). What still exists after it returns?', options: ['Only the heap box (5) — x and h were on the stack and are gone', 'Only x', 'Both x and the heap box', 'Nothing'], answer: 0, hints: ['Stack boxes disappear at the end of the function. Heap boxes do not.'], explain: 'The heap box stays — but with h gone, nobody knows its address anymore: a memory leak. The function should return h or delete it.' },
    { id: 'dynamic-memory-q8', kind: 'predict', tag: 'tricky', prompt: 'Two pointers, one heap box. Predict the output.', code: prog(cpp`
    int* a = new int(4);
    int* b = a;
    *b = *b + 6;
    cout << *a << endl;
    delete a;
    a = nullptr;
    b = nullptr;`), hints: ['`int* b = a;` copies the address, not the box.'], explain: 'Both point to heap#1, so changing *b changes *a: `10`. There is one box, so there is exactly one `delete`.' },
  ],
  cheatsheet: [
    { code: 'int* p = new int(5);  …  delete p;', text: 'one heap box' },
    { code: 'int* a = new int[n];  …  delete[] a;', text: 'a heap array of any size' },
    { code: 'p = nullptr;', text: 'right after delete: no dangling pointer' },
    { code: 'new without delete', text: 'memory leak' },
  ],
};

// ------------------------------------------------------------------ Level: pointer bugs
const LBugs: Level = {
  id: 'pointer-bugs',
  kind: 'lesson',
  title: 'Pointer bugs and how to avoid them',
  tagline: 'Pointer bugs are famous because the program often *seems* to work. Learn the six classic mistakes, how to spot them, and the habits that prevent them.',
  minutes: 25,
  objectives: [
    'You can name and spot dangling pointers, leaks, nullptr use, double delete, returning a local\'s address and a missing `[]`',
    'You can fix each one',
    'You can follow five habits that prevent them',
  ],
  learn: [
    { t: 'table', head: ['Bug', 'What goes wrong', 'Fix'], rows: [
      ['**Dangling pointer**', 'using `*p` after the box was deleted (or its function ended)', 'set `p = nullptr` after delete; do not keep old addresses'],
      ['**Memory leak**', '`new` without `delete`; or the last pointer to a box is lost', 'one `delete` per `new`; delete before re-pointing'],
      ['**nullptr use**', '`*p` when p is `nullptr` → crash', '`if (p != nullptr)` before `*p`'],
      ['**Uninitialised pointer**', '`int* p; *p = 5;` → random address', 'always start with an address or `nullptr`'],
      ['**Double delete**', 'deleting the same box twice → crash', 'set `p = nullptr` after delete (deleting nullptr is harmless)'],
      ['**Address of a local**', '`return &local;` → dangles at once', 'return the value, or use the caller\'s array, or `new`'],
      ['**Missing []**', '`new int[n]` freed with `delete`', '`new[]` ↔ `delete[]`'],
    ] },
    { t: 'compare', items: [
      { title: 'Dangling: used after delete', good: false, code: cpp`
int* p = new int(50);
delete p;
cout << *p;   // the box is gone!`, note: 'It may print 50, or garbage, or crash — *undefined behaviour*. The worst part: it often seems fine in testing.' },
      { title: 'Use first, then delete and forget', good: true, code: cpp`
int* p = new int(50);
cout << *p;    // use it while it exists
delete p;
p = nullptr;   // nobody can use the old address`, note: 'After `p = nullptr`, a mistaken `*p` becomes a clear crash instead of a silent wrong value.' },
    ] },
    { t: 'compare', items: [
      { title: 'Double delete', good: false, code: cpp`
int* p = new int(8);
delete p;
// ... many lines later ...
delete p;      // same box again: crash`, note: 'The second delete frees memory that is not yours anymore.' },
      { title: 'nullptr after delete', good: true, code: cpp`
int* p = new int(8);
delete p;
p = nullptr;
// ... many lines later ...
delete p;      // delete nullptr does nothing: safe`, note: 'This is why the `p = nullptr;` habit matters.' },
    ] },
    { t: 'compare', items: [
      { title: 'Dereferencing nullptr', good: false, code: cpp`
int* found = nullptr;   // search found nothing
cout << *found;         // crash (segmentation fault)`, note: 'nullptr means "no box". There is nothing to read.' },
      { title: 'Check first', good: true, code: cpp`
int* found = nullptr;
if (found != nullptr) {
    cout << *found;
} else {
    cout << "Not found";
}` },
    ] },
    { t: 'compare', items: [
      { title: 'new[] with delete', good: false, code: cpp`
int* a = new int[5];
delete a;       // wrong form!`, note: 'Undefined behaviour. It may seem to work with `int`, and break badly with other types.' },
      { title: 'new[] with delete[]', good: true, code: cpp`
int* a = new int[5];
delete[] a;
a = nullptr;` },
    ] },
    { t: 'viz', title: 'Watch three leaks happen', code: prog(cpp`
    for (int day = 1; day <= 3; day++) {
        int* sales = new int(day * 100);
        cout << "Day " << day << ": " << *sales << endl;
    }`) },
    { t: 'callout', tone: 'warn', title: 'Why that leaks', text: '`sales` is a stack variable inside the loop body: it is destroyed at the end of every round. The heap box it pointed to is NOT. After 3 rounds, 3 boxes are stranded with no pointer to them. Fix: `delete sales;` as the last line of the loop body.' },
    { t: 'callout', tone: 'key', title: 'Five habits', text: '1) Give every pointer a value when you create it (`nullptr` if nothing yet). 2) Check `p != nullptr` before `*p`. 3) Pair every `new` with one `delete`, every `new[]` with one `delete[]`. 4) Right after `delete p;` write `p = nullptr;`. 5) Never return or keep the address of a local variable.' },
  ],
  ways: {
    goal: 'Use a heap box holding a score of 75: print `75`, free it, and make sure nothing can use it afterwards — then print `safe`.',
    items: [
      { title: 'delete, then nullptr, then check', code: prog(cpp`
    int* s = new int(75);
    cout << *s << endl;
    delete s;
    s = nullptr;
    if (s == nullptr) {
        cout << "safe" << endl;
    }`) },
      { title: 'A helper that frees and resets', code: progF(cpp`
void release(int*& p) {
    delete p;
    p = nullptr;
}`, cpp`
    int* s = new int(75);
    cout << *s << endl;
    release(s);
    if (s == nullptr) {
        cout << "safe" << endl;
    }`), note: '`int*& p` is a reference to the pointer, so the function can set the caller\'s `s` to nullptr.' },
      { title: 'A second delete is now harmless', code: prog(cpp`
    int* s = new int(75);
    cout << *s << endl;
    delete s;
    s = nullptr;
    delete s;
    cout << "safe" << endl;`), note: '`delete nullptr` does nothing. Without line 8, line 9 would be a double delete.' },
      { title: 'No heap at all', code: prog(cpp`
    int s = 75;
    cout << s << endl;
    cout << "safe" << endl;`), note: 'The safest pointer is the one you do not need. Use `new` only when the size or lifetime really requires it.' },
    ],
    takeaway: '`delete p; p = nullptr;` — two lines that always go together.',
    check: { id: 'pointer-bugs-ways-check', kind: 'mcq', prompt: 'Which sequence is NOT safe? (`s` was made with `new int(75)`.)', options: ['`delete s; cout << *s;`', '`cout << *s; delete s; s = nullptr;`', '`delete s; s = nullptr; delete s;`', '`delete s; s = nullptr; if (s != nullptr) cout << *s;`'], answer: 0, hints: ['Which one reads the box after it was given back?'], explain: 'Reading `*s` after `delete s` uses a dangling pointer. The other three never touch freed memory.' },
  },
  watch: [
    { title: 'Leak: the pointer moves on', intro: 'Line 7 re-points `p`. heap#1 has no pointer anymore — look at the warning in the last step.', code: prog(cpp`
    int* p = new int(10);
    cout << *p << endl;
    p = new int(20);
    cout << *p << endl;
    delete p;
    p = nullptr;`) },
    { title: 'Fixed: delete in every round', intro: 'Same loop as in Learn, with one extra line. The heap is empty at the end — no leak.', code: prog(cpp`
    for (int day = 1; day <= 3; day++) {
        int* sales = new int(day * 100);
        cout << "Day " << day << ": " << *sales << endl;
        delete sales;
    }`) },
    { title: 'Two pointers, one deleted box', intro: 'After `delete a`, **b** also dangles (drawn in red) — it still holds the old address. Both must be reset.', code: prog(cpp`
    int* a = new int(8);
    int* b = a;
    cout << *b << endl;
    delete a;
    a = nullptr;
    b = nullptr;
    if (b == nullptr) {
        cout << "b is safe now" << endl;
    }`) },
  ],
  think: {
    title: 'Fix the leaking billing loop',
    problem: 'For each customer the program makes a heap array for 2 item prices, reads them and prints the bill. The first version never deleted anything — one leak per customer. Write it so that the heap is empty at the end.',
    steps: [
      { text: 'Read the number of customers.', lines: [5, 6] },
      { text: 'For each customer …', lines: [7] },
      { text: '… get 2 boxes on the heap.', lines: [8] },
      { text: 'Read the two prices and add them.', lines: [9, 10] },
      { text: 'Print the bill.', lines: [11] },
      { text: 'Give the boxes back **before the round ends** — after `}` the pointer `item` is gone and the boxes could never be freed.', lines: [12] },
    ],
    code: prog(cpp`
    int customers;
    cin >> customers;
    for (int c = 1; c <= customers; c++) {
        int* item = new int[2];
        cin >> item[0] >> item[1];
        int bill = item[0] + item[1];
        cout << "Customer " << c << " pays " << bill << endl;
        delete[] item;
    }`),
    input: '2\n100 250\n80 40\n',
    why: 'Count them: the loop runs `customers` times, so there are `customers` × `new[]` — and the same number of `delete[]`.',
    yourTurn: {
      id: 'pointer-bugs-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['c', 'bill'],
      prompt: 'Dry run with 3 customers: `10 20`, `5 5`, `1 2`. How many times does `delete[]` run?',
      code: prog(cpp`
    int customers;
    cin >> customers;
    for (int c = 1; c <= customers; c++) {
        int* item = new int[2];
        cin >> item[0] >> item[1];
        int bill = item[0] + item[1];
        cout << "Customer " << c << " pays " << bill << endl;
        delete[] item;
    }`),
      input: '3\n10 20\n5 5\n1 2\n',
      hints: ['The loop runs 3 times.', 'bill is 30, then 10, then 3.'],
      explain: 'Three rounds → three `new[]` and three `delete[]`. Bills: 30, 10, 3.',
    },
  },
  practice: [
    { id: 'pointer-bugs-q1', kind: 'mcq', prompt: 'Which bug is this?\n`int* p = new int(3);`\n`int* q = p;`\n`delete p;`\n`p = nullptr;`\n`cout << *q;`', options: ['Dangling pointer — q still points to the deleted box', 'Memory leak', 'nullptr dereference', 'Double delete'], answer: 0, hints: ['p was reset — but what about q?'], explain: 'Setting p to nullptr does not change q. q still holds the old address of a box that was given back.' },
    { id: 'pointer-bugs-q2', kind: 'mcq', prompt: 'How many heap boxes are leaked (never deleted)?', code: prog(cpp`
    for (int i = 0; i < 4; i++) {
        int* p = new int(i);
        if (i % 2 == 0) {
            delete p;
        }
    }`), options: ['2', '0', '1', '4'], answer: 0, hints: ['The loop runs 4 times: i = 0, 1, 2, 3.', 'Only even i values delete.'], explain: '4 boxes are made; i = 0 and 2 delete theirs; the boxes from i = 1 and i = 3 leak. The dry run lists both at the end.' },
    { id: 'pointer-bugs-q3', kind: 'bug', tag: 'tricky', prompt: 'score is nullptr, so it should print `No score yet` — but it prints `Score found`. Find the line.', code: prog(cpp`
    int* score = nullptr;
    if (score = nullptr) {
        cout << "No score yet";
    } else {
        cout << "Score found";
    }`), bugLine: 6, options: ['`=` stores nullptr (false); compare with `==`', 'Use `NULL` instead of nullptr', 'Write `*score == nullptr`', 'Swap the two cout lines'], answer: 0, fixed: prog(cpp`
    int* score = nullptr;
    if (score == nullptr) {
        cout << "No score yet";
    } else {
        cout << "Score found";
    }`), hints: ['One `=` or two?'], explain: '`score = nullptr` stores nullptr and the value of the whole thing is nullptr, which counts as false — so the else runs. (g++ -Wall warns about it.)' },
    { id: 'pointer-bugs-q4', kind: 'bug', tag: 'tricky', prompt: 'It should add 1 like and print `6`, but it prints `5`. Find the line.', code: prog(cpp`
    int likes = 5;
    int* p = &likes;
    *p++;
    cout << likes;`), bugLine: 7, options: ['`*p++` moves the pointer; write `(*p)++`', 'Write `p++` instead', 'Write `*p = 1`', '`likes` must be a pointer'], answer: 0, fixed: prog(cpp`
    int likes = 5;
    int* p = &likes;
    (*p)++;
    cout << likes;`), hints: ['`++` is done before `*`.'], explain: '`*p++` means `*(p++)`: it moves p to the next address and reads the old value — likes is never changed. `(*p)++` adds 1 to the box.' },
    { id: 'pointer-bugs-q5', kind: 'bug', prompt: 'A "backup" of the marks should keep the old value 60, but it prints `Backup: 0`. Find the line.', code: prog(cpp`
    int* original = new int[3]{60, 70, 80};
    int* backup = original;
    original[0] = 0;
    cout << "Backup: " << backup[0] << endl;
    delete[] original;`), bugLine: 6, options: ['This copies only the address — make a new array and copy the elements', 'Use `backup = &original;`', 'Delete `original` before changing it', 'Write `backup[0] = 60;` on line 8'], answer: 0, fixed: prog(cpp`
    int* original = new int[3]{60, 70, 80};
    int* backup = new int[3];
    for (int i = 0; i < 3; i++) {
        backup[i] = original[i];
    }
    original[0] = 0;
    cout << "Backup: " << backup[0] << endl;
    delete[] original;
    delete[] backup;`), hints: ['After line 6, how many heap arrays are there?'], explain: 'Both pointers lead to the SAME heap array, so changing it through `original` changes "backup" too. A real copy needs its own `new[]` (and its own `delete[]`).' },
    { id: 'pointer-bugs-q6', kind: 'mcq', prompt: '`int* a = new int[100];` … `delete a;` — what is the problem?', options: ['Memory made with `new[]` must be freed with `delete[]`', 'Nothing — delete frees everything', 'It does not compile', 'It leaks only a[0]'], answer: 0, hints: ['How was it made?'], explain: 'Mixing `new[]` with plain `delete` is undefined behaviour. Match the forms: `new` ↔ `delete`, `new[]` ↔ `delete[]`.' },
    { id: 'pointer-bugs-q7', kind: 'mcq', prompt: 'Which condition is safe when `p` might be nullptr?', options: ['`if (p != nullptr && *p > 0)`', '`if (*p > 0 && p != nullptr)`', '`if (*p != nullptr)`', '`if (*p > 0)`'], answer: 0, hints: ['`&&` stops as soon as the left side is false.'], explain: 'Short-circuit: if p is nullptr, the left side is false and `*p` is never evaluated. In the second option `*p` runs first and crashes.' },
    { id: 'pointer-bugs-q8', kind: 'mcq', tag: 'tricky', prompt: 'A student says: "My function returns `&total` where `total` is a local variable, and it printed the right answer — so it is fine." What do you say?', options: ['It is still a bug: total is gone after the return, the value just has not been overwritten yet', 'They are right', 'It only works for int', 'It is fine if the function is short'], answer: 0, hints: ['Does "worked once" mean "correct"?'], explain: 'The frame is removed at `return`; the old bytes may survive for a moment. The next function call reuses that memory and the "answer" changes. Undefined behaviour can look correct.' },
  ],
  cheatsheet: [
    { code: 'delete p; p = nullptr;', text: 'prevents dangling use and double delete' },
    { code: 'if (p != nullptr && *p …)', text: 'check before you follow the arrow' },
    { code: 'new ↔ delete,  new[] ↔ delete[]', text: 'one of each, matching forms' },
    { code: 'return &local;', text: 'never — the local dies at return' },
  ],
};

// ------------------------------------------------------------------ Checkpoint
const CPtr: Level = {
  id: 'checkpoint-pointers',
  kind: 'revision',
  title: 'Pointers & dynamic memory',
  tagline: '**Checkpoint 10.** Addresses, arrows, arrays, functions and the heap — in real problems. Trace every arrow and count every `new`.',
  minutes: 35,
  objectives: [
    'Use pointers to change, find and swap values',
    'Manage heap arrays of any size without leaks',
    'Spot pointer bugs before they crash',
  ],
  practice: [
    { id: 'checkpoint-pointers-q1', kind: 'predict', tag: 'real life', prompt: 'The captain should hold the higher score, so the scores are swapped through pointers when needed. Predict the output.', code: progF(cpp`
void swapScores(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}`, cpp`
    int babar = 56, rizwan = 83;
    if (babar < rizwan) {
        swapScores(&babar, &rizwan);
    }
    cout << "Captain: " << babar << ", other: " << rizwan;`), hints: ['56 < 83 is true.'], explain: 'The swap runs: `Captain: 83, other: 56`.' },
    { id: 'checkpoint-pointers-q2', kind: 'blanks', tag: 'real life', prompt: 'Find the most expensive item through a returned pointer. Expected: `Oil 3L costs Rs. 1900`.', code: progF(cpp`
int* mostExpensive(int price[], int n) {
    int* top = price;
    for (int i = 1; i < n; i++) {
        if (price[i] > [[1]]) {
            top = [[2]];
        }
    }
    return top;
}`, cpp`
    string item[4] = {"Soap", "Rice 5kg", "Oil 3L", "Tea"};
    int price[4] = {180, 1450, 1900, 650};
    int* t = mostExpensive(price, 4);
    int pos = [[3]];
    cout << item[pos] << " costs Rs. " << *t;`), blanks: [{ answers: ['*top', 'top[0]'] }, { answers: ['&price[i]', 'price + i'] }, { answers: ['t - price'] }], chips: ['*top', 'top', '&price[i]', 'price[i]', 't - price', '*t'], output: 'Oil 3L costs Rs. 1900', hints: ['Compare with the value top points to.', 'The index is the distance from the start of the array.'], explain: '`*top`, `&price[i]`, and `t - price` turns the pointer back into index 2 for the item name.' },
    { id: 'checkpoint-pointers-q3', kind: 'trace', mode: 'vars', vars: ['balance'], tag: 'real life', prompt: 'A bank account changed through pointer functions. Dry run.', code: progF(cpp`
void deposit(int* bal, int amt) {
    *bal = *bal + amt;
}

bool withdraw(int* bal, int amt) {
    if (amt > *bal) {
        return false;
    }
    *bal = *bal - amt;
    return true;
}`, cpp`
    int balance = 1000;
    deposit(&balance, 500);
    if (!withdraw(&balance, 2000)) {
        cout << "Not enough" << endl;
    }
    withdraw(&balance, 300);
    cout << balance;`), hints: ['After the deposit the balance is 1500.', '2000 > 1500, so that withdrawal is refused.'], explain: '1000 → 1500 → (2000 refused) → 1200. Output: `Not enough` then `1200`.' },
    { id: 'checkpoint-pointers-q4', kind: 'paths', tag: 'real life', prompt: 'Bus seat booking with a pointer into the seats array (1 = taken). Find an input for every path.', code: prog(cpp`
    int seats[5] = {1, 0, 1, 1, 0};
    int k;
    cin >> k;
    if (k < 0 || k >= 5) {
        cout << "No such seat";
    } else {
        int* p = seats + k;
        if (*p == 1) {
            cout << "Seat " << k << " is taken";
        } else {
            *p = 1;
            cout << "Seat " << k << " booked";
        }
    }`), paths: [{ label: '`No such seat`', line: 9 }, { label: '`… is taken`', line: 13 }, { label: '`… booked`', line: 16 }], start: '0', hints: ['Seats 1 and 4 are free.', 'Try a number outside 0–4.'], explain: 'e.g. `9` (or `-1`) → no such seat; `0`, `2` or `3` → taken; `1` or `4` → booked. The range check comes first, so `seats + k` never points outside the array.' },
    { id: 'checkpoint-pointers-q5', kind: 'mcq', prompt: 'In `double d[10];`, how many bytes apart are `&d[1]` and `&d[4]`?', options: ['24', '3', '12', '32'], answer: 0, hints: ['3 elements apart, each 8 bytes.'], explain: '(4 − 1) × 8 = **24** bytes. As pointers, `&d[4] - &d[1]` is 3 (elements).' },
    { id: 'checkpoint-pointers-q6', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int a[6] = {3, 6, 9, 12, 15, 18};
    int* p = a + 2;
    int* q = a + 5;
    cout << *p + *q << " " << q - p << " " << p[1] << " " << *(q - 4);`), hints: ['p points to a[2], q to a[5].'], explain: '9 + 18 = 27; q − p = 3; p[1] = a[3] = 12; *(q − 4) = a[1] = 6 → `27 3 12 6`.' },
    { id: 'checkpoint-pointers-q7', kind: 'bug', prompt: 'This does not compile. Find the line.', code: prog(cpp`
    double price[3] = {99.5, 250, 40};
    int* p = price;
    cout << *p;`), bugLine: 6, options: ['The pointer type must match: `double* p = price;`', 'Write `int* p = &price;`', 'Arrays cannot be pointed to', 'Write `*price`'], answer: 0, fixed: prog(cpp`
    double price[3] = {99.5, 250, 40};
    double* p = price;
    cout << *p;`), hints: ['What kind of boxes does price have?'], explain: 'An `int*` may only point to ints; `price` gives a `double*`. With `double* p` it prints 99.5.' },
    { id: 'checkpoint-pointers-q8', kind: 'mcq', prompt: 'A dynamic 2D array was made with `int** g = new int*[3];` and `g[r] = new int[4];` for each of the 3 rows. How many `delete[]` statements must run to free it all?', options: ['4', '1', '3', '12'], answer: 0, hints: ['Count the `new[]` calls.'], explain: '3 row arrays + 1 array of row pointers = 4 `new[]` → 4 `delete[]` (rows first, then `g`).' },
    { id: 'checkpoint-pointers-q9', kind: 'predict', tag: 'real life', prompt: 'Average temperature from a heap array. Predict the output.', code: prog(cpp`
    int n = 4;
    double* t = new double[n]{31.5, 29, 35.5, 32};
    double sum = 0;
    for (double* p = t; p < t + n; p++) {
        sum += *p;
    }
    cout << "Average: " << sum / n << endl;
    delete[] t;`), hints: ['31.5 + 29 + 35.5 + 32 = 128.'], explain: '128 / 4 = 32, and cout prints a whole double without `.0`: `Average: 32`.' },
    { id: 'checkpoint-pointers-q10', kind: 'mcq', prompt: 'You want a pointer that must ALWAYS point to `total` (it can never be moved), but it may change total\'s value. Which declaration?', options: ['`int* const p = &total;`', '`const int* p = &total;`', '`const int* const p = &total;`', '`int* p = &total;`'], answer: 0, hints: ['Read right-to-left.'], explain: '"p is a const pointer to int": the arrow is fixed, the int is not.' },
    { id: 'checkpoint-pointers-q11', kind: 'bug', tag: 'tricky', prompt: 'Both players scored 50, so it should print `Same score`. Find the line.', code: prog(cpp`
    int a = 50, b = 50;
    int* p = &a;
    int* q = &b;
    if (p == q) {
        cout << "Same score";
    } else {
        cout << "Different score";
    }`), bugLine: 8, options: ['`p == q` compares addresses; compare values with `*p == *q`', 'Use `=` instead of `==`', 'Write `&p == &q`', 'Point both at a'], answer: 0, fixed: prog(cpp`
    int a = 50, b = 50;
    int* p = &a;
    int* q = &b;
    if (*p == *q) {
        cout << "Same score";
    } else {
        cout << "Different score";
    }`), hints: ['Do p and q point to the same box?'], explain: 'a and b are two different boxes, so their addresses differ even though the values are equal. `*p == *q` compares the scores.' },
    { id: 'checkpoint-pointers-q12', kind: 'parsons', tag: 'real life', prompt: 'Build a program that adds 12 bonus runs to Shadab\'s 38 through a pointer function. Output: `Runs: 50`.', lines: ['#include <iostream>', 'using namespace std;', 'void addBonus(int* runs, int bonus) {', '    *runs = *runs + bonus;', '}', 'int main() {', '    int shadab = 38;', '    addBonus(&shadab, 12);', '    cout << "Runs: " << shadab;', '    return 0;', '}'], distractors: ['    addBonus(shadab, 12);', '    runs = runs + bonus;'], hints: ['The function needs an address.', 'Change the box, not the arrow.'], explain: 'Pass `&shadab`; inside, `*runs` is shadab.' },
    { id: 'checkpoint-pointers-q13', kind: 'blanks', tag: 'real life', prompt: '**Capstone — a growing class list.** Roll numbers are read until 0. When the heap array is full, it doubles: make a bigger array, copy, free the old one and move the pointer. Input `11 12 13 0` → `3 students, room for 4`.', code: prog(cpp`
    int cap = 2, n = 0;
    int* roll = new int[cap];
    int r;
    cin >> r;
    while (r != 0) {
        if (n == cap) {
            int* bigger = [[1]] int[cap * 2];
            for (int i = 0; i < n; i++) {
                bigger[i] = roll[i];
            }
            [[2]] roll;
            roll = [[3]];
            cap = cap * 2;
        }
        roll[n] = r;
        n++;
        cin >> r;
    }
    cout << n << " students, room for " << cap << endl;
    [[4]] roll;`), blanks: [{ answers: ['new'] }, { answers: ['delete[]', 'delete []'] }, { answers: ['bigger'] }, { answers: ['delete[]', 'delete []'] }], chips: ['new', 'delete', 'delete[]', 'bigger', '&bigger', '*bigger'], input: '11 12 13 0\n', output: '3 students, room for 4\n', hints: ['The old array must be freed BEFORE `roll` is moved — otherwise it leaks.', 'After the move, roll and bigger point to the same array.', 'Step through it: how many times does the array grow for 3 students? Once.'], explain: '`new int[cap * 2]`, `delete[] roll;`, `roll = bigger;` and a final `delete[] roll;`. With 3 students the array grows once (2 → 4). Watch the dry run: heap#1 is freed, heap#2 takes over, and the heap is empty at the end.' },
  ],
  cheatsheet: [
    { code: '&x  *p  p + i  p - a', text: 'address, target, move, distance' },
    { code: 'f(&x) with void f(int* p)', text: 'change the caller\'s variable' },
    { code: 'new / delete,  new[] / delete[]', text: 'heap memory — always paired' },
    { code: 'delete p; p = nullptr;', text: 'no dangling pointers' },
  ],
  exam: {
    title: 'Exam Challenge: Pointers & dynamic memory',
    intro: '**Instructions:** State the output of each program below. If there is an error, write it explicitly and give the line number. Assume all the required headers are included. Draw boxes and arrows on your rough sheet: every time a pointer moves, move its arrow; every time `*p` changes, change the box it points to.',
    questions: [
      { id: 'checkpoint-pointers-x1', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: prog(cpp`
    int a[5] = {10, 20, 30, 40, 50};
    int* p = a;
    cout << *(p + 2) << " " << p[1] << " " << *p + 1 << endl;
    p += 3;
    cout << *p << " " << p[-1] << " " << p - a << endl;
    cout << *(a + 4) - *p / 4 << endl;`), hints: ['`*p + 1` is `(*p) + 1`, not `*(p + 1)`.', 'After `p += 3`, `p[-1]` is the box just before the one `p` points at.'], explain: 'Line 1: `*(p + 2)` = `a[2]` = 30, `p[1]` = `a[1]` = 20, `*p + 1` = 10 + 1 = 11 (the `*` happens first) → `30 20 11`.\n\n`p += 3` moves the arrow to `a[3]`.\n\nLine 2: `*p` = 40, `p[-1]` = `a[2]` = 30, `p - a` = the distance in **boxes** = 3 → `40 30 3`.\n\nLine 3: `*(a + 4)` = 50, `*p / 4` = 40 / 4 = 10 → `40`.' },
      { id: 'checkpoint-pointers-x2', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: prog(cpp`
    int a[] = {5, 10, 15};
    int* p = a;
    cout << *p++ << " ";
    cout << (*p)++ << " ";
    cout << ++*p << " ";
    cout << *++p << endl;
    cout << a[0] << a[1] << a[2];`), hints: ['`*p++` means `*(p++)`: read the box, then move the **pointer**.', '`(*p)++` changes the **value** in the box; the pointer stays.'], explain: '- `*p++`: prints `a[0]` = `5`, then `p` moves to `a[1]`.\n- `(*p)++`: prints `10`, then `a[1]` becomes 11 (post-increment of the value).\n- `++*p`: `a[1]` becomes 12 first, prints `12`.\n- `*++p`: `p` moves to `a[2]` first, prints `15`.\n\nLine 1: `5 10 12 15`. The array is now {5, 12, 15}, printed without spaces → `51215`.' },
      { id: 'checkpoint-pointers-x3', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it (with the line number).', code: prog(cpp`
    int x = 5;
    int* q = &x;
    *q = *q * 2;
    int* p = x;
    cout << *p << " " << x;`), hints: ['What must be on the right of `int* p =`: a value or an address?'], explain: '**Compile error on line 8:** `invalid conversion from \'int\' to \'int*\'`.\n\nA pointer stores an **address**. `x` is an `int` value (10 at that moment), not an address, so it cannot be stored in `int* p`. Lines 5–7 are fine.\n\n**Fix:** `int* p = &x;` → then it prints `10 10`.' },
      { id: 'checkpoint-pointers-x4', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it (with the line number).', code: prog(cpp`
    int x = 5, y = 9;
    const int* p = &x;
    int* const q = &y;
    p = &y;
    *q = 1;
    *p = 7;
    q = &x;
    cout << x << y;`), hints: ['Read from right to left: `const int* p` is a pointer to a **const int**; `int* const q` is a **const pointer** to an int.', 'Which one may move, and which one may change the box?'], explain: '**Compile error on line 10:** `assignment of read-only location \'* p\'`.\n\n- `const int* p`: the **value** is read-only through `p`, but `p` can move → line 8 `p = &y;` is OK.\n- `int* const q`: `q` can never move, but the value can change → line 9 `*q = 1;` is OK.\n- Line 10 `*p = 7;` tries to change a value through a pointer-to-const → **error** (the first one g++ reports).\n- Line 11 `q = &x;` is a second error (`assignment of read-only variable \'q\'`).\n\n**Fix:** delete lines 10 and 11 → it prints `51`.' },
      { id: 'checkpoint-pointers-x5', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: prog(cpp`
    int x = 3, y = 7;
    int* p = &x;
    int** pp = &p;
    **pp = *p * 4;
    *pp = &y;
    *p += x;
    int* h = new int(**pp - x);
    cout << x << " " << y << " " << *h << endl;
    delete h;`), hints: ['`**pp` is the box that `p` points at. `*pp` **is** `p`.', 'After `*pp = &y;` the arrow of `p` points at `y`.'], explain: '- `**pp = *p * 4`: both mean `x`, so `x` = 3 × 4 = 12.\n- `*pp = &y`: this changes `p` itself — now `p` → `y`.\n- `*p += x`: `y` = 7 + 12 = 19.\n- `new int(**pp - x)`: a new heap box with 19 − 12 = 7.\n\nOutput: `12 19 7`. Then `delete h;` frees the heap box (no leak).' },
      { id: 'checkpoint-pointers-x6', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: progF(cpp`
void f(int* a, int b, int& c) {
    *a += b;
    b = *a * 2;
    c = b - c;
    a = &c;
    *a += 1;
}`, cpp`
    int x = 2, y = 3, z = 4;
    f(&x, y, z);
    f(&z, x, y);
    cout << x << " " << y << " " << z;`), hints: ['`a` is a copy of an address: `*a` changes the caller\'s box; `a = &c` only moves the local arrow.', '`b` is a copy — changing it changes nothing in `main`. `c` is another name for the caller\'s variable.'], explain: '**Call 1** `f(&x, y, z)`: `a` → `x`, `b` = 3, `c` is `z`.\n- `*a += b` → x = 5\n- `b = 5 × 2` = 10 (local only)\n- `c = 10 − 4` → z = 6\n- `a = &c` → `a` now points at `z`; `*a += 1` → z = 7\n\n**Call 2** `f(&z, x, y)`: `a` → `z`, `b` = 5, `c` is `y`.\n- `*a += 5` → z = 12\n- `b` = 24\n- `c = 24 − 3` → y = 21\n- `a = &c` → `a` points at `y`; y = 22\n\nOutput: `5 22 12`.' },
      { id: 'checkpoint-pointers-x7', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it (with the line number).', code: prog(cpp`
    int a[4] = {2, 4, 6, 8};
    int sum = 0;
    for (int i = 0; i < 4; i++) {
        sum += *a;
        a++;
    }
    cout << sum;`), hints: ['An array name behaves like an address — but can you **move** it?'], explain: '**Compile error on line 9:** `lvalue required as increment operand`.\n\nThe name `a` is the fixed address of the first box. You can read `*a` or `*(a + i)`, but you cannot change `a` itself with `a++` — an array cannot be moved or assigned.\n\n**Fix:** use a separate pointer: `int* p = a;` before the loop, then `sum += *p; p++;` → prints `20`.' },
      { id: 'checkpoint-pointers-x8', kind: 'count', tag: 'exam', prompt: 'How many times is `total` called in total (count the first call from `main` too)? What does the program print?', code: progF(cpp`
int total(int* p, int n) {
    if (n == 1) return *p;
    return total(p, n / 2) + total(p + n / 2, n - n / 2);
}`, cpp`
    int a[5] = {1, 2, 3, 4, 5};
    cout << total(a, 5);`), count: { calls: 'total' }, hints: ['Each call with `n > 1` splits into two calls: the first half (`n / 2` boxes) and the rest.', 'Draw the tree: 5 → 2 + 3, 2 → 1 + 1, 3 → 1 + 2, 2 → 1 + 1.'], explain: 'The call tree (by `n`):\n- `5` → `2` and `3`\n- `2` → `1` and `1`\n- `3` → `1` and `2`; that `2` → `1` and `1`\n\nCount: 1 (n=5) + 1 (n=2) + 2 (n=1) + 1 (n=3) + 1 (n=1) + 1 (n=2) + 2 (n=1) = **9** calls. Each `n = 1` call returns one box, and together the 5 leaves cover all 5 boxes, so it prints `15`.' },
      { id: 'checkpoint-pointers-x9', kind: 'count', tag: 'exam', prompt: 'How many times is the condition `*p != \'\\0\'` on line 8 checked? What does the program print?', code: prog(cpp`
    char s[] = "PF2026";
    char* p = s;
    int d = 0;
    while (*p != '\0') {
        if (*p >= '0' && *p <= '9') d++;
        p += 2;
    }
    cout << d;`), count: { checks: 8 }, hints: ['The pointer jumps **2** characters at a time.', 'Positions: P0 F1 2₂ 0₃ 2₄ 6₅, and `\\0` at 6.'], explain: '`p` visits positions 0 (`P`), 2 (`2`), 4 (`2`), then 6 (`\\0`). The condition is checked at 0, 2, 4 (true) and at 6 (false) → **4** checks. Digits seen: positions 2 and 4 → it prints `2`.\n\n(With an odd length, `p += 2` would jump **over** the `\\0` and run off the array — a real exam trap.)' },
      { id: 'checkpoint-pointers-x10', kind: 'blanks', tag: 'exam', prompt: 'Complete the program: `reversed` returns a **new** heap array with the elements in reverse order. `main` reads `n` numbers into a heap array, prints the reversed copy and frees all heap memory. Input `4` / `3 8 1 6` → `6 1 8 3 `.', code: progF(cpp`
int* reversed(const int* a, int n) {
    int* r = [[1]] int[n];
    for (int i = 0; i < n; i++) {
        r[i] = [[2]];
    }
    return r;
}`, cpp`
    int n;
    cin >> n;
    int* a = new int[n];
    for (int i = 0; i < n; i++) {
        cin >> *(a + i);
    }
    int* b = reversed(a, n);
    for (int i = 0; i < n; i++) {
        cout << b[i] << " ";
    }
    [[3]] a;
    [[4]] b;`), blanks: [{ answers: ['new'] }, { answers: ['a[n - 1 - i]', 'a[n-1-i]', 'a[n - i - 1]', 'a[n-i-1]', '*(a + n - 1 - i)', '*(a+n-1-i)', '*(a + n - i - 1)', '*(a+n-i-1)'] }, { answers: ['delete[]', 'delete []'] }, { answers: ['delete[]', 'delete []'] }], chips: ['new', 'delete', 'delete[]', 'a[n - 1 - i]', 'a[n - i]', 'a[i]'], input: '4\n3 8 1 6\n', output: '6 1 8 3 ', hints: ['`r[0]` gets the last box `a[n - 1]`; `r[1]` gets `a[n - 2]` …', 'Two arrays were made with `new[]` — both need `delete[]`.'], explain: '`r = new int[n]` makes the new heap array. `r[i] = a[n - 1 - i]`: for n = 4, `r[0] = a[3]` = 6, `r[1] = a[2]` = 1, `r[2] = a[1]` = 8, `r[3] = a[0]` = 3 → `6 1 8 3 `. Two `new[]` → two `delete[]` (plain `delete` on an array is wrong).' },
    ],
  },
};

export const unit10: Unit = {
  id: 'u10',
  num: 10,
  title: 'Pointers & dynamic memory',
  summary: 'Addresses, pointers, arrays in memory — and memory you create yourself with `new`.',
  levels: [LAddr, LBasics, LArrays, LFunc, LDyn, LBugs, CPtr],
};
