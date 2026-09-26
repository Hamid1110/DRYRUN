import type { Level, Unit } from '../types';
import { cpp, prog, progF } from '../helpers';

const ALG = '#include <algorithm>\n';

// ------------------------------------------------------------------ Level: arrays-intro
const L1: Level = {
  id: 'arrays-intro',
  kind: 'lesson',
  title: 'Arrays: a row of boxes',
  tagline: 'Five students, five variables? Sixty students, sixty variables? No — one **array** holds the whole list under one name, and each box has a number.',
  minutes: 25,
  objectives: [
    'Declare an array, give it starting values, and reach any box with `a[index]`',
    'Know that indexes go from `0` to `size - 1` and that the size is fixed',
    'Explain why garbage values and out-of-bounds indexes are dangerous, and count elements with `sizeof`',
  ],
  learn: [
    { t: 'p', text: 'Imagine you must store the marks of 5 students. So far you would need five boxes: `marks1`, `marks2` … `marks5`. Now imagine 60 students: 60 names, 60 `cin`s, and no way to loop over them. An **array** is *one name for a whole row of boxes* — like the numbered lockers in a school corridor: one corridor, many lockers, and every locker has its own number.' },
    { t: 'compare', items: [
      { title: 'Five separate variables', good: false, code: prog(cpp`
    int marks1 = 72, marks2 = 85, marks3 = 60, marks4 = 90, marks5 = 48;
    cout << marks1 + marks2 + marks3 + marks4 + marks5;`), note: 'Works for 5, but every new student means a new name and more typing. A loop cannot walk over names.' },
      { title: 'One array', good: true, code: prog(cpp`
    int marks[5] = {72, 85, 60, 90, 48};
    cout << marks[0] + marks[1] + marks[2] + marks[3] + marks[4];`), note: 'One name. The box number can be a variable, so in the next level one loop will visit every box.' },
    ] },
    { t: 'syntax', title: 'Declaring an array', code: 'int marks[5] = {72, 85, 60, 90, 48};', parts: [
      { token: 'int', text: 'the type of **every** box — all elements of an array have the same type' },
      { token: 'marks', text: 'the one name for the whole row' },
      { token: '[5]', text: 'the **size**: how many boxes. It must be a constant and it can never change later' },
      { token: '{72, 85, 60, 90, 48}', text: 'the **initializer list**: starting values, first box first' },
    ] },
    { t: 'viz', title: 'Reading and changing single boxes', code: prog(cpp`
    int marks[5] = {72, 85, 60, 90, 48};
    cout << "First: " << marks[0] << endl;
    cout << "Last: " << marks[4] << endl;
    marks[2] = 65;
    marks[4] = marks[4] + 5;
    int i = 1;
    cout << "marks[" << i << "] = " << marks[i] << endl;`) },
    { t: 'callout', tone: 'key', title: 'Counting starts at 0', text: 'The first box is `marks[0]` and the last is `marks[4]` — always **size − 1**. Think of the index as *how many steps from the start*: the first box is 0 steps away. There is no `marks[5]` in an array of 5.' },
    { t: 'table', head: ['Declaration', 'The boxes', 'Why'], rows: [
      ['`int a[5] = {4, 7, 1, 8, 2};`', '4 7 1 8 2', 'one value per box'],
      ['`int a[5] = {4, 7};`', '4 7 0 0 0', 'missing values become **0**'],
      ['`int a[5] = {};`', '0 0 0 0 0', 'the easy way to start with all zeros'],
      ['`int a[] = {4, 7, 1};`', '4 7 1', 'no size written → C++ counts the list: size **3**'],
      ['`int a[5];`', '? ? ? ? ?', 'no list → **garbage** (see below)'],
      ['`int a[3] = {1, 2, 3, 4};`', '—', 'compile error: too many initializers'],
    ], caption: 'Five ways to start an array, and one that does not compile.' },
    { t: 'callout', tone: 'warn', title: 'Garbage values', text: '`int a[5];` inside `main` only *reserves* five boxes. Nobody cleans them, so they hold whatever bits were left in that memory before — **garbage**. The value can be different on every run. Reading a box before you store something in it is a bug. Start with `= {}` or fill every box (with `cin` or a loop) before you read it.' },
    { t: 'callout', tone: 'warn', title: 'Out of bounds: the silent killer', text: '`marks[5]` or `marks[-1]` is **out of bounds**. C++ does NOT check the index for you. It compiles, and at run time it quietly reads or overwrites memory that belongs to something else — maybe another variable. The program may print nonsense, change a different variable, or crash, and it may even *seem* to work today and fail tomorrow. Keeping every index between `0` and `size - 1` is **your** job.' },
    { t: 'callout', tone: 'info', title: 'Fixed size, and sizeof', text: 'Once `int a[5]` exists it can never grow or shrink. The size must be a constant: a number or a `const int N = 5;`. To count the elements, divide the bytes of the whole array by the bytes of one box: `sizeof(a) / sizeof(a[0])`. For 5 ints that is 20 / 4 = **5**.' },
  ],
  ways: {
    goal: 'Make an array that holds `10 20 30 40` and print its **third** element: `30`.',
    items: [
      { title: 'Size and list', code: prog(cpp`
    int a[4] = {10, 20, 30, 40};
    cout << a[2];`), note: 'Third element = index 2.' },
      { title: 'Let C++ count the size', code: prog(cpp`
    int a[] = {10, 20, 30, 40};
    cout << a[2];`) },
      { title: 'Declare, then fill box by box', code: prog(cpp`
    int a[4];
    a[0] = 10;
    a[1] = 20;
    a[2] = 30;
    a[3] = 40;
    cout << a[2];`), note: 'Safe: every box gets a value before anything is read.' },
      { title: 'Start at zero, fill with a loop', code: prog(cpp`
    int a[4] = {};
    for (int i = 0; i < 4; i++) {
        a[i] = (i + 1) * 10;
    }
    cout << a[2];`), note: 'The index can be a variable — the start of every array program.' },
      { title: 'A constant size and a variable index', code: prog(cpp`
    const int N = 4;
    int a[N] = {10, 20, 30, 40};
    int k = 2;
    cout << a[k];`) },
    ],
    takeaway: 'The third element is always index **2**, because counting starts at 0. The size can be written by you or counted by C++, and the index can be a number, a variable, or any whole-number expression.',
    check: { id: 'arrays-intro-ways-check', kind: 'mcq', prompt: 'Which one does NOT print `30`?', options: ['`int a[] = {10, 20, 30, 40}; cout << a[3];`', '`int a[4] = {10, 20, 30, 40}; cout << a[2];`', '`int a[4] = {10, 20, 30}; cout << a[2];`', '`int a[] = {10, 20, 30}; cout << a[1] + a[0];`'], answer: 0, hints: ['Which index is the third element?'], explain: '`a[3]` is the **fourth** box, 40. In C the missing fourth value is 0, but `a[2]` is still 30; and D prints 20 + 10 = 30.' },
  },
  watch: [
    { title: 'Missing values become zero', intro: 'Watch the memory view: every box that the list does not reach gets 0.', code: prog(cpp`
    int a[5] = {4, 7};
    int b[4] = {};
    int c[] = {9, 8, 7};
    cout << a[0] << " " << a[1] << " " << a[2] << " " << a[4] << endl;
    cout << b[0] << " " << b[3] << endl;
    cout << c[2] << endl;`) },
    { title: 'Counting elements with sizeof', intro: '`sizeof` measures bytes. Divide the whole by one box to get the count.', code: prog(cpp`
    int a[] = {3, 1, 4, 1, 5, 9};
    cout << "bytes in a: " << sizeof(a) << endl;
    cout << "bytes in one box: " << sizeof(a[0]) << endl;
    int n = sizeof(a) / sizeof(a[0]);
    cout << "elements: " << n << endl;
    cout << "last: " << a[n - 1] << endl;`) },
  ],
  think: {
    title: 'Cricket innings',
    problem: 'A batter played 4 innings. Read the 4 scores into an array. Print the first score, the last score and the total. Input `45 12 78 30`.',
    steps: [
      { text: 'Four values of the same kind → one array of size 4 (indexes 0 to 3).', lines: [5] },
      { text: 'Read one value into each box. The boxes hold garbage right now, but `cin` overwrites every one before we read it.', lines: [6] },
      { text: 'Add up the four boxes.', lines: [7] },
      { text: 'First = index 0. Last = index size − 1 = 3.', lines: [8, 9] },
      { text: 'Print the total.', lines: [10] },
    ],
    code: prog(cpp`
    int runs[4];
    cin >> runs[0] >> runs[1] >> runs[2] >> runs[3];
    int total = runs[0] + runs[1] + runs[2] + runs[3];
    cout << "First: " << runs[0] << endl;
    cout << "Last: " << runs[3] << endl;
    cout << "Total: " << total << endl;`),
    input: '45 12 78 30\n',
    why: 'Writing `runs[0]`, `runs[1]` … by hand still works only for 4 innings. In the next level a loop replaces them — and then the same code works for 4 innings or 400.',
    yourTurn: {
      id: 'arrays-intro-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the scores `20 0 65 15`. Fill in each box and the total.',
      vars: ['runs[0]', 'runs[1]', 'runs[2]', 'runs[3]', 'total'],
      code: prog(cpp`
    int runs[4];
    cin >> runs[0] >> runs[1] >> runs[2] >> runs[3];
    int total = runs[0] + runs[1] + runs[2] + runs[3];
    cout << "First: " << runs[0] << endl;
    cout << "Last: " << runs[3] << endl;
    cout << "Total: " << total << endl;`),
      input: '20 0 65 15\n',
      hints: ['`cin` fills the boxes left to right: runs[0] gets the first number.', '20 + 0 + 65 + 15 = ?'],
      explain: 'The boxes become 20, 0, 65, 15; total = 100. First 20, last 15.',
    },
  },
  practice: [
    { id: 'arrays-intro-q1', kind: 'mcq', prompt: 'A week of temperatures is stored in `int temps[7];`. How many boxes are there, and which indexes are valid?', options: ['7 boxes, indexes 0 to 6', '7 boxes, indexes 1 to 7', '8 boxes, indexes 0 to 7', '6 boxes, indexes 0 to 6'], answer: 0, hints: ['The number in the brackets is the count of boxes.', 'The first index is 0, so the last is size − 1.'], explain: '`[7]` makes 7 boxes: `temps[0]` (Monday) up to `temps[6]` (Sunday). `temps[7]` would be out of bounds.' },
    { id: 'arrays-intro-q2', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int a[6] = {5, 3};
    a[3] = a[0] + a[1];
    cout << a[0] << " " << a[1] << " " << a[2] << " " << a[3] << " " << a[5];`), hints: ['The list only fills the first two boxes. What goes in the rest?'], explain: 'The list fills a[0] = 5 and a[1] = 3; boxes 2 to 5 become 0. Then a[3] = 5 + 3 = 8. Output: `5 3 0 8 0`.' },
    { id: 'arrays-intro-q3', kind: 'trace', mode: 'vars', prompt: 'Dry run. Fill in each box whenever it changes.', vars: ['a[0]', 'a[1]', 'a[2]'], given: [0], code: prog(cpp`
    int a[3] = {6, 1, 4};
    a[0] = a[1] + a[2];
    a[2] = a[0] * 2;
    a[1]++;
    cout << a[0] + a[1] + a[2];`), hints: ['Always use the values the boxes have *right now*.', 'After line 6, a[0] is 5 — use that in line 7.'], explain: 'a[0] = 1 + 4 = 5; a[2] = 5 × 2 = 10; a[1] = 2. The sum is 5 + 2 + 10 = **17**.' },
    { id: 'arrays-intro-q4', kind: 'bug', tag: 'real life', prompt: 'A shop wants to store 4 prices, but this does not compile. Find the line.', code: prog(cpp`
    int prices[3] = {120, 80, 45, 60};
    cout << "Last price: " << prices[3];`), bugLine: 5, options: ['The size is 3 but the list has 4 values — make it `prices[4]`', 'Prices must be written in quotes', 'Line 6 should use `prices[4]`', 'Arrays cannot be printed with cout'], answer: 0, hints: ['Count the values in the list.'], fixed: prog(cpp`
    int prices[4] = {120, 80, 45, 60};
    cout << "Last price: " << prices[3];`), explain: 'g++: *too many initializers for int [3]*. With size 4 the last index is 3, so line 6 is then correct.' },
    { id: 'arrays-intro-q5', kind: 'bug', tag: 'tricky', prompt: 'We want `b` to be a copy of `a`. The program does not compile. Which line, and how do you copy an array?', code: prog(cpp`
    int a[3] = {4, 5, 6};
    int b[3];
    b = a;
    cout << b[0] << b[1] << b[2];`), bugLine: 7, options: ['You cannot assign a whole array with `=` — copy it box by box with a loop', 'Write `b[3] = a[3];`', 'Declare b as `int b[] = a;`', 'Add `&` in front of a'], answer: 0, hints: ['An array name is not an ordinary variable you can assign to.'], fixed: prog(cpp`
    int a[3] = {4, 5, 6};
    int b[3];
    for (int i = 0; i < 3; i++) {
        b[i] = a[i];
    }
    cout << b[0] << b[1] << b[2];`), explain: 'g++ says *invalid array assignment*. Arrays cannot be copied, compared or assigned as a whole — you work with them one element at a time. (`b[3] = a[3]` would even be out of bounds!)' },
    { id: 'arrays-intro-q6', kind: 'blanks', prompt: 'Let C++ count the months in the list. It should print `6 months`.', code: prog(cpp`
    int days[] = {31, 28, 31, 30, 31, 30};
    int n = sizeof([[1]]) / sizeof([[2]]);
    cout << n << " months";`), blanks: [{ answers: ['days'] }, { answers: ['days[0]', 'int', 'days[1]'] }], chips: ['days', 'days[0]', 'n', '6'], output: '6 months', hints: ['The bytes of the whole array, divided by…', '…the bytes of ONE box.'], explain: '`sizeof(days)` is 24 bytes, `sizeof(days[0])` is 4 bytes → 24 / 4 = 6.' },
    { id: 'arrays-intro-q7', kind: 'mcq', tag: 'tricky', prompt: '`int a[5] = {1, 2, 3, 4, 5};` and then `a[5] = 99;`. What happens?', options: ['It compiles. At run time it writes outside the array: undefined behaviour — it may change another variable or crash', 'Compile error: index out of range', '`a[4]` becomes 99', 'The array grows to 6 boxes'], answer: 0, hints: ['What is the last valid index of a 5-box array?', 'Does C++ check indexes for you?'], explain: 'The last valid box is `a[4]`. C++ does not check indexes, so `a[5] = 99` silently writes into memory that is not part of the array. Arrays never grow.' },
    { id: 'arrays-intro-q8', kind: 'mcq', prompt: 'Inside `main`: `int a[3]; cout << a[1];` What is printed?', options: ['Nobody knows — `a[1]` was never given a value, so it holds garbage', 'Always 0', 'Always 1', 'A compile error'], answer: 0, hints: ['Was any value stored in `a[1]`?'], explain: 'Without an initializer the boxes are not cleaned. It compiles, but the value is garbage and can change from run to run. Use `int a[3] = {};` to start with zeros.' },
  ],
  cheatsheet: [
    { code: 'int a[5] = {1, 2};', text: '5 boxes: 1 2 0 0 0 (missing values become 0)' },
    { code: 'int a[] = {4, 7, 1};', text: 'size counted from the list (3)' },
    { code: 'a[0] … a[size-1]', text: 'the only valid indexes — anything else is out of bounds' },
    { code: 'sizeof(a) / sizeof(a[0])', text: 'number of elements (only where the array was declared)' },
  ],
};

// ------------------------------------------------------------------ Level: array-loops
const L2: Level = {
  id: 'array-loops',
  kind: 'lesson',
  title: 'Walking an array with a loop',
  tagline: 'The index can be a variable — so a `for` loop with `i` = 0, 1, 2 … visits every box. Read, print, reverse, add up, find the biggest: all with one loop.',
  minutes: 30,
  objectives: [
    'Read, print and reverse-print an array with a `for` loop that runs exactly n times',
    'Compute sum, average, max/min and its position, and count values that match a rule',
    'Use range-for: `for (int x : a)` to read, `for (int &x : a)` to change',
  ],
  learn: [
    { t: 'p', text: 'Picture a teacher walking along a row of desks, collecting one copy at each desk. The desk number goes 0, 1, 2, … — exactly the job of a loop variable. Put `a[i]` inside a `for` loop and one line of code touches every box.' },
    { t: 'syntax', title: 'The standard array loop', code: 'for (int i = 0; i < n; i++) {\n    cout << a[i];\n}', parts: [
      { token: 'int i = 0', text: 'start at the first index' },
      { token: 'i < n', text: 'stop BEFORE n — the last turn has `i = n - 1`, the last box' },
      { token: 'i++', text: 'move to the next box' },
      { token: 'a[i]', text: 'the box for this turn' },
    ] },
    { t: 'viz', title: 'Read 4 values, print them forwards and backwards', code: prog(cpp`
    int a[4];
    for (int i = 0; i < 4; i++) {
        cin >> a[i];
    }
    for (int i = 0; i < 4; i++) {
        cout << a[i] << " ";
    }
    cout << endl;
    for (int i = 3; i >= 0; i--) {
        cout << a[i] << " ";
    }`), input: '8 3 6 1\n' },
    { t: 'compare', items: [
      { title: '<= : one turn too many', good: false, code: 'for (int i = 0; i <= 5; i++) {\n    cout << a[i];\n}', note: 'For `int a[5]` this runs **6** times. The last turn reads `a[5]` — out of bounds!' },
      { title: '< : exactly n turns', good: true, code: 'for (int i = 0; i < 5; i++) {\n    cout << a[i];\n}', note: 'Runs 5 times: i = 0, 1, 2, 3, 4.' },
    ] },
    { t: 'table', head: ['Task', 'Before the loop', 'Inside the loop'], rows: [
      ['sum', '`int sum = 0;`', '`sum += a[i];`'],
      ['average', '(sum first)', 'after the loop: `(double)sum / n`'],
      ['maximum', '`int mx = a[0];`', '`if (a[i] > mx) mx = a[i];`'],
      ['position of max', '`int pos = 0;`', 'also `pos = i;` inside the if'],
      ['count by a rule', '`int count = 0;`', '`if (a[i] >= 50) count++;`'],
    ], caption: 'Five patterns you will use again and again.' },
    { t: 'viz', title: 'The biggest value and where it is', code: prog(cpp`
    int a[5] = {34, 81, 17, 81, 52};
    int mx = a[0], pos = 0;
    for (int i = 1; i < 5; i++) {
        if (a[i] > mx) {
            mx = a[i];
            pos = i;
        }
    }
    cout << "max " << mx << " at index " << pos << endl;`) },
    { t: 'callout', tone: 'warn', title: 'Start max at a[0], not at 0', text: 'For winter temperatures `{-5, -2, -9}`, starting with `mx = 0` gives the answer 0 — a value that is not even in the list! Start with the first element and loop from index 1. Note also: `>` keeps the **first** 81 (index 1); `>=` would move to the last one.' },
    { t: 'syntax', title: 'Range-for: no index needed', code: 'for (int x : a)   // x is a COPY of each element\nfor (int &x : a)  // x IS each element', parts: [
      { token: 'int x : a', text: 'read it as *for each x in a*. Good for printing, adding, counting' },
      { token: 'int &x : a', text: 'with `&`, x is another name for the real box — changing x changes the array' },
    ] },
    { t: 'compare', items: [
      { title: 'Copy: the array does not change', good: false, code: prog(cpp`
    int a[3] = {1, 2, 3};
    for (int x : a) {
        x = x * 10;
    }
    cout << a[0] << " " << a[1] << " " << a[2];`) },
      { title: 'Reference: the array changes', good: true, code: prog(cpp`
    int a[3] = {1, 2, 3};
    for (int &x : a) {
        x = x * 10;
    }
    cout << a[0] << " " << a[1] << " " << a[2];`) },
    ] },
  ],
  ways: {
    goal: 'Add up `int a[5] = {4, 9, 2, 7, 3}` and print `25`.',
    items: [
      { title: 'for with an index', code: prog(cpp`
    int a[5] = {4, 9, 2, 7, 3};
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += a[i];
    }
    cout << sum;`) },
      { title: 'while loop', code: prog(cpp`
    int a[5] = {4, 9, 2, 7, 3};
    int sum = 0, i = 0;
    while (i < 5) {
        sum += a[i];
        i++;
    }
    cout << sum;`) },
      { title: 'Range-for', code: prog(cpp`
    int a[5] = {4, 9, 2, 7, 3};
    int sum = 0;
    for (int x : a) {
        sum += x;
    }
    cout << sum;`), note: 'No index to get wrong — but also no index if you need the position.' },
      { title: 'Backwards', code: prog(cpp`
    int a[5] = {4, 9, 2, 7, 3};
    int sum = 0;
    for (int i = 4; i >= 0; i--) {
        sum += a[i];
    }
    cout << sum;`), note: 'Addition does not care about the order.' },
      { title: 'Size from sizeof', code: prog(cpp`
    int a[] = {4, 9, 2, 7, 3};
    int n = sizeof(a) / sizeof(a[0]);
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += a[i];
    }
    cout << sum;`), note: 'Add a value to the list and the loop still fits.' },
    ],
    takeaway: 'Every version visits each of the 5 boxes exactly once. The classic `for (int i = 0; i < n; i++)` is the one to know by heart; range-for is shortest when you do not need `i`.',
    check: { id: 'array-loops-ways-check', kind: 'mcq', prompt: 'Which loop does NOT add all five elements correctly?', options: ['`for (int i = 1; i <= 5; i++) sum += a[i];`', '`for (int i = 0; i < 5; i++) sum += a[i];`', '`for (int x : a) sum += x;`', '`for (int i = 4; i >= 0; i--) sum += a[i];`'], answer: 0, hints: ['Which boxes does `i = 1 … 5` visit?'], explain: 'It skips `a[0]` and reads `a[5]`, which is out of bounds. Indexes go 0 … 4.' },
  },
  watch: [
    { title: 'Sum and average of n marks', intro: 'The array has room for 8 marks, but we only use the first n. Watch `sum` grow.', code: prog(cpp`
    int marks[8];
    int n;
    cin >> n;
    int sum = 0;
    for (int i = 0; i < n; i++) {
        cin >> marks[i];
        sum += marks[i];
    }
    double avg = (double)sum / n;
    cout << "Sum: " << sum << endl;
    cout << "Average: " << avg << endl;`), input: '4\n70 85 62 91\n' },
    { title: 'Count with range-for, then change with &', intro: 'First count who passed, then give everyone 2 grace marks.', code: prog(cpp`
    int marks[5] = {45, 38, 72, 50, 39};
    int pass = 0;
    for (int m : marks) {
        if (m >= 40) {
            pass++;
        }
    }
    cout << "Passed: " << pass << endl;
    for (int &m : marks) {
        m += 2;
    }
    for (int m : marks) {
        cout << m << " ";
    }`) },
  ],
  think: {
    title: 'Coldest day',
    problem: 'Read the temperatures of 5 days (they can be negative). Print the lowest temperature and the day number (1 to 5) it happened on. Input `4 -2 7 -5 0`.',
    steps: [
      { text: 'Five values → an array of 5. Fill it with a loop that runs 5 times.', lines: [5, 6, 7] },
      { text: 'Assume day 1 (index 0) is the coldest. Do NOT start at 0 degrees — 0 might not even be in the list.', lines: [9] },
      { text: 'Visit the other days, index 1 to 4.', lines: [10] },
      { text: 'If today is colder, remember its temperature AND its index.', lines: [11, 12, 13] },
      { text: 'People count days from 1, arrays from 0 → print `day + 1`.', lines: [16] },
    ],
    code: prog(cpp`
    int t[5];
    for (int i = 0; i < 5; i++) {
        cin >> t[i];
    }
    int low = t[0], day = 0;
    for (int i = 1; i < 5; i++) {
        if (t[i] < low) {
            low = t[i];
            day = i;
        }
    }
    cout << "Coldest: " << low << " on day " << day + 1 << endl;`),
    input: '4 -2 7 -5 0\n',
    why: 'Keeping the *index* instead of only the value answers both questions at once: `t[day]` is the value, and `day + 1` is the day number.',
    yourTurn: {
      id: 'array-loops-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Same idea with 4 days already in the array. Dry run it: when do `low` and `day` change?',
      vars: ['i', 'low', 'day'],
      code: prog(cpp`
    int t[4] = {3, -1, 6, -4};
    int low = t[0], day = 0;
    for (int i = 1; i < 4; i++) {
        if (t[i] < low) {
            low = t[i];
            day = i;
        }
    }
    cout << low << " on day " << day + 1;`),
      hints: ['Start: low = 3, day = 0.', 'Is -1 < 3? Is 6 < -1? Is -4 < -1?'],
      explain: 'low changes to -1 (day 1), is not changed by 6, then changes to -4 (day 3). Output: `-4 on day 4`.',
    },
  },
  practice: [
    { id: 'array-loops-q1', kind: 'predict', prompt: 'Predict the output. How many times does the loop run?', code: prog(cpp`
    int a[5] = {2, 4, 6, 8, 10};
    for (int i = 4; i >= 0; i -= 2) {
        cout << a[i] << " ";
    }`), hints: ['i takes the values 4, 2, 0.'], explain: 'Three turns (i = 4, 2, 0): `10 6 2 `.' },
    { id: 'array-loops-q2', kind: 'mcq', prompt: 'How many times does `count++` run, and what is printed?', code: prog(cpp`
    int a[6] = {5, 12, 7, 20, 3, 15};
    int count = 0;
    for (int i = 0; i < 6; i++) {
        if (a[i] > 6) {
            count++;
        }
    }
    cout << count;`), options: ['4 times — prints 4', '6 times — prints 6', '3 times — prints 3', '2 times — prints 2'], answer: 0, hints: ['The loop runs 6 times, but the if is true only sometimes.', 'Which values are greater than 6?'], explain: '12, 7, 20 and 15 are greater than 6 → 4. The loop body runs 6 times, `count++` only 4.' },
    { id: 'array-loops-q3', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'A shopping bill: add up three prices. Dry run it.', vars: ['i', 'bill'], code: prog(cpp`
    int price[3] = {120, 45, 80};
    int bill = 0;
    for (int i = 0; i < 3; i++) {
        bill += price[i];
    }
    cout << "Bill: Rs " << bill;`), hints: ['bill starts at 0.', 'After each turn: 120, then 165, then …'], explain: 'bill: 0 → 120 → 165 → 245. The condition `i < 3` is checked 4 times (the last check is false). Output: `Bill: Rs 245`.' },
    { id: 'array-loops-q4', kind: 'blanks', prompt: 'Find the highest score. It should print `45`.', code: prog(cpp`
    int a[5] = {12, 45, 7, 45, 30};
    int mx = [[1]];
    for (int i = 1; i < 5; i++) {
        if (a[i] [[2]] mx) {
            mx = a[i];
        }
    }
    cout << mx;`), blanks: [{ answers: ['a[0]'] }, { answers: ['>', '>='] }], chips: ['a[0]', '0', '>', '<', '=='], output: '45', hints: ['Start with a value that is really in the array.', 'Replace mx when the new box is bigger.'], explain: 'Start `mx = a[0]`, and replace it when `a[i] > mx`.' },
    { id: 'array-loops-q5', kind: 'bug', prompt: 'The total of the five marks should be 350, but the program prints 300. Find the line.', code: prog(cpp`
    int marks[5] = {50, 60, 70, 80, 90};
    int total = 0;
    for (int i = 1; i < 5; i++) {
        total += marks[i];
    }
    cout << total;`), bugLine: 7, options: ['The loop must start at `i = 0`', 'Use `i <= 5`', 'total must start at 1', 'Use `total = marks[i]`'], answer: 0, hints: ['Which box is never added?'], fixed: prog(cpp`
    int marks[5] = {50, 60, 70, 80, 90};
    int total = 0;
    for (int i = 0; i < 5; i++) {
        total += marks[i];
    }
    cout << total;`), explain: 'Starting at 1 skips `marks[0]` (50): 350 − 50 = 300. Changing to `i <= 5` would be worse — out of bounds.' },
    { id: 'array-loops-q6', kind: 'parsons', prompt: 'Build a program that reads 5 numbers into an array and prints how many are even. Input `4 7 10 3 8` → `Even numbers: 3`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int a[5];', '    int evens = 0;', '    for (int i = 0; i < 5; i++) {', '        cin >> a[i];', '        if (a[i] % 2 == 0) {', '            evens++;', '        }', '    }', '    cout << "Even numbers: " << evens;', '    return 0;', '}'], distractors: ['    for (int i = 0; i <= 5; i++) {', '        if (a[i] % 2 == 1) {'], input: '4 7 10 3 8\n', hints: ['Set the counter to 0 before the loop.', 'Read and check in the same loop.'], explain: '4, 10 and 8 are even. `i <= 5` would run 6 times and go out of bounds.' },
    { id: 'array-loops-q7', kind: 'mcq', prompt: 'Which loop gives every element 5 bonus marks (really changing the array)?', options: ['`for (int &x : a) x += 5;`', '`for (int x : a) x += 5;`', '`for (int x : a) a[x] += 5;`', '`for (int i = 0; i <= n; i++) a[i] += 5;`'], answer: 0, hints: ['Without `&`, x is only a copy.'], explain: 'Only `int &x` makes x the real element. B changes copies; C uses the *values* as indexes; D runs one time too many.' },
    { id: 'array-loops-q8', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    int a[4] = {1, 2, 3, 4};
    for (int x : a) {
        x = x * x;
    }
    for (int &x : a) {
        x = x + 1;
    }
    cout << a[0] << a[1] << a[2] << a[3];`), hints: ['The first loop has no `&`.'], explain: 'The first loop squares copies — the array stays 1 2 3 4. The second loop really adds 1: `2345`.' },
  ],
  cheatsheet: [
    { code: 'for (int i = 0; i < n; i++)', text: 'visits a[0] … a[n-1] — exactly n times' },
    { code: 'for (int i = n - 1; i >= 0; i--)', text: 'backwards' },
    { code: 'mx = a[0]; pos = 0; if (a[i] > mx) { mx = a[i]; pos = i; }', text: 'maximum and its position' },
    { code: 'for (int x : a) / for (int &x : a)', text: 'read a copy / change the real element' },
  ],
};

// ------------------------------------------------------------------ Level: searching
const L3: Level = {
  id: 'searching',
  kind: 'lesson',
  title: 'Searching an array',
  tagline: 'Is the value there, and where? Check box after box (linear search) — or, if the array is sorted, cut it in half again and again (binary search).',
  minutes: 30,
  objectives: [
    'Write linear search that returns the index or `-1`, for the first or the last match, and count matches',
    'Trace binary search with `low`, `high` and `mid` on a sorted array',
    'Count how many comparisons each search needs in the worst case',
  ],
  learn: [
    { t: 'p', text: 'Looking for your friend on a bus: you check seat 1, seat 2, seat 3 … until you find them or reach the last seat. That is **linear search**: compare the key with each box in order.' },
    { t: 'viz', title: 'Linear search with a -1 signal', code: prog(cpp`
    int roll[6] = {14, 27, 8, 31, 27, 5};
    int key = 31;
    int pos = -1;
    for (int i = 0; i < 6; i++) {
        if (roll[i] == key) {
            pos = i;
            break;
        }
    }
    if (pos == -1) {
        cout << key << " not found" << endl;
    } else {
        cout << key << " found at index " << pos << endl;
    }`) },
    { t: 'callout', tone: 'key', title: 'Why -1?', text: 'Every real index is 0 or more, so `-1` can never be a real position. Start with `pos = -1` (*not found yet*) and change it only when you find the key. After the loop, `pos == -1` means the key is not there.' },
    { t: 'table', head: ['You want', 'Inside the if', 'Why'], rows: [
      ['the **first** match', '`pos = i; break;`', 'stop at the first one'],
      ['the **last** match', '`pos = i;` (no break)', 'keep going; each later match overwrites pos'],
      ['**how many** matches', '`count++;` (no break)', 'you must see every box'],
    ] },
    { t: 'compare', items: [
      { title: 'Deciding inside the loop', good: false, code: prog(cpp`
    int a[4] = {5, 9, 2, 7};
    int key = 2;
    for (int i = 0; i < 4; i++) {
        if (a[i] == key) {
            cout << "found ";
        } else {
            cout << "not found ";
        }
    }`), note: 'Prints a verdict for EVERY box. One box not matching does not mean the key is missing.' },
      { title: 'Decide after the loop', good: true, code: prog(cpp`
    int a[4] = {5, 9, 2, 7};
    int key = 2;
    bool found = false;
    for (int i = 0; i < 4; i++) {
        if (a[i] == key) {
            found = true;
        }
    }
    if (found) {
        cout << "found";
    } else {
        cout << "not found";
    }`), note: '"Not found" is only known after checking all the boxes.' },
    ] },
    { t: 'h', text: 'Binary search: the dictionary trick' },
    { t: 'p', text: 'If the array is **sorted**, you can do much better. Open a dictionary in the middle: your word is on this page, or before it, or after it — one look throws away half the book. Binary search keeps two markers, `low` and `high`, looks at the middle box, and throws away the half that cannot hold the key.' },
    { t: 'viz', title: 'Binary search for 42', code: prog(cpp`
    int a[8] = {3, 8, 15, 21, 30, 42, 56, 70};
    int key = 42;
    int low = 0, high = 7, pos = -1, steps = 0;
    while (low <= high) {
        int mid = (low + high) / 2;
        steps++;
        if (a[mid] == key) {
            pos = mid;
            break;
        } else if (a[mid] < key) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    cout << "index " << pos << " after " << steps << " comparisons" << endl;`) },
    { t: 'table', head: ['Elements', 'Linear search (worst)', 'Binary search (worst)'], rows: [
      ['8', '8', '4'],
      ['100', '100', '7'],
      ['1000', '1000', '10'],
      ['1 000 000', '1 000 000', '20'],
    ], caption: 'Binary search halves the range each time: 1000 → 500 → 250 → … → 1 takes about 10 steps. But it ONLY works on sorted data.' },
  ],
  ways: {
    goal: 'Is 7 in `int a[5] = {4, 7, 1, 7, 9}`? Print `yes` or `no`.',
    items: [
      { title: 'A bool flag', code: prog(cpp`
    int a[5] = {4, 7, 1, 7, 9};
    bool found = false;
    for (int i = 0; i < 5; i++) {
        if (a[i] == 7) {
            found = true;
            break;
        }
    }
    cout << (found ? "yes" : "no");`) },
      { title: 'An index that starts at -1', code: prog(cpp`
    int a[5] = {4, 7, 1, 7, 9};
    int pos = -1;
    for (int i = 0; i < 5; i++) {
        if (a[i] == 7) {
            pos = i;
            break;
        }
    }
    cout << (pos != -1 ? "yes" : "no");`), note: 'Also tells you WHERE (index 1).' },
      { title: 'Count the matches', code: prog(cpp`
    int a[5] = {4, 7, 1, 7, 9};
    int count = 0;
    for (int i = 0; i < 5; i++) {
        if (a[i] == 7) {
            count++;
        }
    }
    cout << (count > 0 ? "yes" : "no");`), note: 'Checks all 5 boxes — slower, but also tells you how many (2).' },
      { title: 'while that stops at the key', code: prog(cpp`
    int a[5] = {4, 7, 1, 7, 9};
    int i = 0;
    while (i < 5 && a[i] != 7) {
        i++;
    }
    cout << (i < 5 ? "yes" : "no");`), note: 'Short-circuit: when i reaches 5, `a[5]` is never read.' },
      { title: 'Range-for', code: prog(cpp`
    int a[5] = {4, 7, 1, 7, 9};
    bool found = false;
    for (int x : a) {
        if (x == 7) {
            found = true;
        }
    }
    cout << (found ? "yes" : "no");`) },
    ],
    takeaway: 'All five ask the same question — *is any box equal to 7?* — and none of them says "no" until every box has been checked.',
    check: { id: 'searching-ways-check', kind: 'mcq', prompt: 'Which loop gives the WRONG answer for `{4, 7, 1, 7, 9}` and key 7?', options: ['`for (...) { if (a[i] == 7) found = true; else found = false; }`', '`for (...) { if (a[i] == 7) { found = true; break; } }`', '`for (...) { if (a[i] == 7) count++; }`', '`while (i < 5 && a[i] != 7) i++;`'], answer: 0, hints: ['What does the LAST box (9) do to `found`?'], explain: 'The else sets found back to false for every non-matching box. After the last box (9) found is false: "no" — wrong.' },
  },
  watch: [
    { title: 'First, last and count in one walk', intro: 'No break — the loop sees every box.', code: prog(cpp`
    int a[7] = {5, 2, 9, 2, 7, 2, 4};
    int key = 2;
    int first = -1, last = -1, count = 0;
    for (int i = 0; i < 7; i++) {
        if (a[i] == key) {
            if (first == -1) {
                first = i;
            }
            last = i;
            count++;
        }
    }
    cout << "first " << first << ", last " << last << ", count " << count << endl;`) },
    { title: 'Binary search: not found', intro: 'Look for 25. Watch low and high move towards each other until they cross.', code: prog(cpp`
    int a[8] = {3, 8, 15, 21, 30, 42, 56, 70};
    int key = 25;
    int low = 0, high = 7, pos = -1, steps = 0;
    while (low <= high) {
        int mid = (low + high) / 2;
        steps++;
        if (a[mid] == key) {
            pos = mid;
            break;
        } else if (a[mid] < key) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    cout << "pos " << pos << " after " << steps << " comparisons" << endl;`) },
  ],
  think: {
    title: 'Library check',
    problem: 'A library keeps the IDs of the 6 books that are checked out. Read a book ID. Print `Checked out (slot k)` if it is in the list, otherwise `Available`. Input `305`.',
    steps: [
      { text: 'Store the list of IDs.', lines: [5] },
      { text: 'Read the ID we are looking for.', lines: [6, 7] },
      { text: 'Nothing found yet → `pos = -1`.', lines: [8] },
      { text: 'Check every slot, one by one.', lines: [9, 10] },
      { text: 'A match: remember the slot and stop — no need to look further.', lines: [11, 12] },
      { text: 'Only AFTER the loop decide which message to print.', lines: [15, 16, 17, 18] },
    ],
    code: prog(cpp`
    int out[6] = {112, 460, 87, 305, 221, 98};
    int id;
    cin >> id;
    int pos = -1;
    for (int i = 0; i < 6; i++) {
        if (out[i] == id) {
            pos = i;
            break;
        }
    }
    if (pos != -1) {
        cout << "Checked out (slot " << pos << ")" << endl;
    } else {
        cout << "Available" << endl;
    }`),
    input: '305\n',
    why: 'With `break`, the search stops after 4 comparisons for 305. For an ID that is not there, all 6 slots must be checked — that is the worst case.',
    yourTurn: {
      id: 'searching-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the ID `87`. How many comparisons until it stops?',
      vars: ['id', 'i', 'pos'],
      code: prog(cpp`
    int out[6] = {112, 460, 87, 305, 221, 98};
    int id;
    cin >> id;
    int pos = -1;
    for (int i = 0; i < 6; i++) {
        if (out[i] == id) {
            pos = i;
            break;
        }
    }
    if (pos != -1) {
        cout << "Checked out (slot " << pos << ")" << endl;
    } else {
        cout << "Available" << endl;
    }`),
      input: '87\n',
      hints: ['87 is in slot 2.', 'After `break` the loop condition is not checked again.'],
      explain: 'Three comparisons (112, 460, 87). pos becomes 2, break leaves the loop: `Checked out (slot 2)`.',
    },
  },
  practice: [
    { id: 'searching-q1', kind: 'predict', prompt: 'The program counts its own comparisons. Predict the output.', code: prog(cpp`
    int a[6] = {4, 1, 7, 9, 3, 9};
    int key = 9, checks = 0, pos = -1;
    for (int i = 0; i < 6; i++) {
        checks++;
        if (a[i] == key) {
            pos = i;
            break;
        }
    }
    cout << pos << " " << checks;`), hints: ['Where is the FIRST 9?', 'break stops the loop right there.'], explain: 'The first 9 is at index 3, found on the 4th comparison: `3 4`.' },
    { id: 'searching-q2', kind: 'mcq', prompt: 'An array has 50 elements and the key is NOT in it. How many comparisons does linear search make?', options: ['50', '25', '1', '6'], answer: 0, hints: ['When can linear search say "not found"?'], explain: 'It can only give up after checking every box: 50 comparisons. This is the worst case.' },
    { id: 'searching-q3', kind: 'mcq', tag: 'tricky', prompt: 'A **sorted** array has 64 elements. At most how many middle elements does binary search look at?', options: ['7', '6', '32', '64'], answer: 0, hints: ['Each look halves the range: 64 → 32 → 16 → …', 'Count the looks until only 1 element is left — and look at that one too.'], explain: 'Ranges of 64, 32, 16, 8, 4, 2, 1 → 7 looks. Linear search could need 64.' },
    { id: 'searching-q4', kind: 'trace', mode: 'vars', prompt: 'Binary search for 9. Dry run `low`, `high`, `mid` and `pos`.', vars: ['low', 'high', 'mid', 'pos'], code: prog(cpp`
    int a[7] = {2, 5, 9, 14, 20, 27, 33};
    int key = 9;
    int low = 0, high = 6, pos = -1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (a[mid] == key) {
            pos = mid;
            break;
        } else if (a[mid] < key) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    cout << pos;`), hints: ['First mid = (0 + 6) / 2 = 3 and a[3] = 14.', '14 > 9, so the key must be on the left: high = mid − 1.'], explain: 'mid 3 (14 > 9) → high 2; mid 1 (5 < 9) → low 2; mid 2 (9) → found. Output `2` after 3 looks.' },
    { id: 'searching-q5', kind: 'bug', prompt: 'We want the LAST position of 2 (index 4), but it prints 1. Find the line.', code: prog(cpp`
    int a[6] = {7, 2, 4, 9, 2, 1};
    int last = -1;
    for (int i = 0; i < 6; i++) {
        if (a[i] == 2) {
            last = i;
            break;
        }
    }
    cout << "last 2 at index " << last;`), bugLine: 10, options: ['Remove the `break` so later matches can overwrite `last`', 'Start `last` at 0', 'Loop from `i = 1`', 'Use `=` instead of `==`'], answer: 0, hints: ['After the first 2 is found, does the loop keep looking?'], fixed: prog(cpp`
    int a[6] = {7, 2, 4, 9, 2, 1};
    int last = -1;
    for (int i = 0; i < 6; i++) {
        if (a[i] == 2) {
            last = i;
        }
    }
    cout << "last 2 at index " << last;`), explain: '`break` gives the FIRST match. Without it, index 4 overwrites index 1. (Or loop backwards from the end and keep the break.)' },
    { id: 'searching-q6', kind: 'blanks', tag: 'real life', prompt: 'How many students got full marks? It should print `3 students got 100`.', code: prog(cpp`
    int marks[7] = {100, 85, 100, 92, 67, 100, 74};
    int full = [[1]];
    for (int i = 0; i < 7; i++) {
        if (marks[i] [[2]] 100) {
            [[3]];
        }
    }
    cout << full << " students got 100";`), blanks: [{ answers: ['0'] }, { answers: ['=='] }, { answers: ['full++', '++full', 'full += 1', 'full = full + 1'] }], chips: ['0', '-1', '==', '=', 'full++', 'break'], output: '3 students got 100', hints: ['Counting starts at 0.', 'Compare with `==`, and do not break — you need every match.'], explain: 'Counting needs every box, so no break: indexes 0, 2 and 5 match.' },
    { id: 'searching-q7', kind: 'paths', prompt: 'Find an input (the key) for every message.', code: prog(cpp`
    int a[5] = {12, 7, 30, 7, 18};
    int key;
    cin >> key;
    int count = 0;
    for (int i = 0; i < 5; i++) {
        if (a[i] == key) {
            count++;
        }
    }
    if (count == 0) {
        cout << "not found";
    } else if (count == 1) {
        cout << "found once";
    } else {
        cout << "found " << count << " times";
    }`), paths: [{ label: '`not found`', line: 15 }, { label: '`found once`', line: 17 }, { label: '`found … times`', line: 19 }], start: '12', hints: ['Pick a number that is not in the list.', 'Which number appears twice?'], explain: 'e.g. 5 → not found; 12, 30 or 18 → found once; 7 → found 2 times.' },
    { id: 'searching-q8', kind: 'mcq', tag: 'tricky', prompt: 'Someone runs binary search for 4 on the UNSORTED array `{9, 2, 7, 4, 1}`. What goes wrong?', options: ['The middle is 7; since 4 < 7 it throws away the right half — exactly where 4 is — and reports "not found"', 'It finds 4 at index 3 as normal', 'Compile error: the array is not sorted', 'It loops forever'], answer: 0, hints: ['The first mid is index 2.'], explain: 'Binary search trusts that everything right of the middle is bigger. On unsorted data that is false, so it can discard the key. Sort first, or use linear search.' },
  ],
  cheatsheet: [
    { code: 'pos = -1; … if (a[i] == key) { pos = i; break; }', text: 'linear search: first match, -1 if missing' },
    { code: 'no break', text: 'last match / count all matches' },
    { code: 'mid = (low + high) / 2; low = mid + 1 / high = mid - 1', text: 'binary search — SORTED arrays only' },
    { code: 'n vs about log₂ n', text: 'worst-case comparisons: linear vs binary (1000 → 10)' },
  ],
};

// ------------------------------------------------------------------ Level: sorting
const L4: Level = {
  id: 'sorting',
  kind: 'lesson',
  title: 'Sorting: bubble and selection',
  tagline: 'Put the values in order by comparing and swapping. Count the passes, the comparisons and the swaps — then meet `sort()`.',
  minutes: 30,
  objectives: [
    'Swap two elements with a `temp` box',
    'Trace bubble sort and selection sort pass by pass',
    'Count passes and comparisons for n elements, and use `sort(a, a + n)`',
  ],
  learn: [
    { t: 'p', text: 'A PT teacher lines students up by height: look at two neighbours; if the taller one is in front, swap them; move one place along; repeat. After one walk down the line, the tallest student has *bubbled* to the end. That is **bubble sort**.' },
    { t: 'callout', tone: 'key', title: 'Swapping needs a third box', text: 'To swap the juice in two glasses you need an empty third glass. `a[i] = a[i + 1];` alone destroys the old `a[i]`. So: `int temp = a[i]; a[i] = a[i + 1]; a[i + 1] = temp;` — or use `swap(a[i], a[i + 1]);`.' },
    { t: 'viz', title: 'Bubble sort, printing after every pass', code: prog(cpp`
    int a[4] = {7, 3, 9, 2};
    int n = 4;
    for (int pass = 1; pass < n; pass++) {
        for (int i = 0; i < n - pass; i++) {
            if (a[i] > a[i + 1]) {
                int temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
            }
        }
        cout << "after pass " << pass << ": ";
        for (int i = 0; i < n; i++) {
            cout << a[i] << " ";
        }
        cout << endl;
    }`) },
    { t: 'table', head: ['Pass', 'Compares', 'Array after the pass', 'Now in place'], rows: [
      ['1', '3', '3 7 2 **9**', '9'],
      ['2', '2', '3 2 **7 9**', '7'],
      ['3', '1', '**2 3 7 9**', 'all'],
    ], caption: 'Each pass puts one more big value at the end, so the next pass can stop one box earlier (`i < n - pass`).' },
    { t: 'callout', tone: 'info', title: 'How many?', text: 'For n elements: **n − 1 passes** and (n−1) + (n−2) + … + 1 = **n(n−1)/2 comparisons**. 4 elements → 6, 5 → 10, 8 → 28. The number of **swaps** depends on the data: 0 for an already sorted array, and one for every comparison when it is sorted backwards.' },
    { t: 'h', text: 'Selection sort' },
    { t: 'p', text: 'Another idea: *select* the smallest value of the unsorted part and swap it to the front. Pass 1 puts the smallest at index 0, pass 2 the next smallest at index 1, and so on. Fewer swaps than bubble sort — at most one per pass.' },
    { t: 'viz', title: 'Selection sort', code: prog(cpp`
    int a[5] = {29, 10, 14, 37, 13};
    int n = 5;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] < a[minIdx]) {
                minIdx = j;
            }
        }
        int temp = a[i];
        a[i] = a[minIdx];
        a[minIdx] = temp;
    }
    for (int x : a) {
        cout << x << " ";
    }`) },
    { t: 'callout', tone: 'tip', title: 'In real programs: sort()', text: '`#include <algorithm>` and write `sort(a, a + n);` — it sorts the first n elements from small to big. `a` means *start here*, `a + n` means *stop before box n*. Still learn bubble and selection sort: exams ask you to trace them, and they train your loop thinking.' },
  ],
  ways: {
    goal: 'Sort `{5, 1, 4, 2}` so it prints `1 2 4 5 `.',
    items: [
      { title: 'Bubble sort with temp', code: prog(cpp`
    int a[4] = {5, 1, 4, 2};
    for (int pass = 1; pass < 4; pass++) {
        for (int i = 0; i < 4 - pass; i++) {
            if (a[i] > a[i + 1]) {
                int temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
            }
        }
    }
    for (int x : a) cout << x << " ";`) },
      { title: 'Bubble sort with swap()', code: prog(cpp`
    int a[4] = {5, 1, 4, 2};
    for (int pass = 1; pass < 4; pass++) {
        for (int i = 0; i < 4 - pass; i++) {
            if (a[i] > a[i + 1]) {
                swap(a[i], a[i + 1]);
            }
        }
    }
    for (int x : a) cout << x << " ";`, ALG) },
      { title: 'Selection sort', code: prog(cpp`
    int a[4] = {5, 1, 4, 2};
    for (int i = 0; i < 3; i++) {
        int m = i;
        for (int j = i + 1; j < 4; j++) {
            if (a[j] < a[m]) {
                m = j;
            }
        }
        swap(a[i], a[m]);
    }
    for (int x : a) cout << x << " ";`, ALG) },
      { title: 'sort() from <algorithm>', code: prog(cpp`
    int a[4] = {5, 1, 4, 2};
    sort(a, a + 4);
    for (int x : a) cout << x << " ";`, ALG), note: 'One line. Use it whenever the task does not say *write your own sort*.' },
    ],
    takeaway: 'Bubble sort swaps neighbours many times; selection sort finds the minimum and swaps once per pass; `sort()` does it for you. Same result.',
    check: { id: 'sorting-ways-check', kind: 'mcq', prompt: 'Which change makes bubble sort sort from BIGGEST to smallest (`5 4 2 1`)?', options: ['`if (a[i] < a[i + 1])` — swap when the left one is smaller', '`for (int i = 4; i >= 0; i--)`', '`if (a[i] > a[i + 1])` with `pass < 5`', 'Remove the temp box'], answer: 0, hints: ['Which pair counts as "in the wrong order" now?'], explain: 'For descending order a pair is wrong when the left value is smaller, so flip the comparison.' },
  },
  watch: [
    { title: 'Counting comparisons and swaps', intro: 'Two counters tell you how much work bubble sort did.', code: prog(cpp`
    int a[5] = {4, 1, 3, 5, 2};
    int n = 5, comparisons = 0, swaps = 0;
    for (int pass = 1; pass < n; pass++) {
        for (int i = 0; i < n - pass; i++) {
            comparisons++;
            if (a[i] > a[i + 1]) {
                swap(a[i], a[i + 1]);
                swaps++;
            }
        }
    }
    for (int x : a) cout << x << " ";
    cout << endl << comparisons << " comparisons, " << swaps << " swaps" << endl;`, ALG) },
    { title: 'sort() and reverse()', intro: 'Sort prices from low to high, then flip for high to low.', code: prog(cpp`
    int price[6] = {450, 120, 999, 75, 300, 120};
    sort(price, price + 6);
    for (int p : price) cout << p << " ";
    cout << endl;
    cout << "cheapest " << price[0] << ", dearest " << price[5] << endl;
    reverse(price, price + 6);
    for (int p : price) cout << p << " ";`, ALG) },
  ],
  think: {
    title: 'Top 3 quiz scores',
    problem: 'Read 5 quiz scores. Sort them from HIGH to low with bubble sort and print the top 3. Input `6 9 4 10 7`.',
    steps: [
      { text: 'Read the 5 scores into an array.', lines: [5, 6, 7, 8] },
      { text: '5 elements → 4 passes.', lines: [9] },
      { text: 'Each pass compares neighbours up to the end of the unsorted part.', lines: [10] },
      { text: 'High to low → a pair is wrong when the LEFT one is smaller.', lines: [11] },
      { text: 'Swap with a temp box.', lines: [12, 13, 14] },
      { text: 'The top 3 are now at indexes 0, 1, 2.', lines: [18] },
    ],
    code: prog(cpp`
    int s[5];
    for (int i = 0; i < 5; i++) {
        cin >> s[i];
    }
    for (int pass = 1; pass < 5; pass++) {
        for (int i = 0; i < 5 - pass; i++) {
            if (s[i] < s[i + 1]) {
                int temp = s[i];
                s[i] = s[i + 1];
                s[i + 1] = temp;
            }
        }
    }
    cout << "Top 3: " << s[0] << " " << s[1] << " " << s[2] << endl;`),
    input: '6 9 4 10 7\n',
    why: 'With `<` instead of `>`, each pass sinks the SMALLEST value to the end, so the biggest values collect at the front.',
    yourTurn: {
      id: 'sorting-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'The same high-to-low bubble sort on 3 scores. Dry run the three boxes.',
      vars: ['s[0]', 's[1]', 's[2]'],
      given: [0],
      code: prog(cpp`
    int s[3] = {4, 9, 7};
    for (int pass = 1; pass < 3; pass++) {
        for (int i = 0; i < 3 - pass; i++) {
            if (s[i] < s[i + 1]) {
                int temp = s[i];
                s[i] = s[i + 1];
                s[i + 1] = temp;
            }
        }
    }
    cout << s[0] << " " << s[1] << " " << s[2];`),
      hints: ['Pass 1 compares (s[0], s[1]) then (s[1], s[2]).', '4 < 9 → swap. Then 4 < 7 → swap.'],
      explain: 'Pass 1: 9 4 7 → 9 7 4. Pass 2 compares 9 and 7 only — no swap. Output `9 7 4`: 3 comparisons, 2 swaps.',
    },
  },
  practice: [
    { id: 'sorting-q1', kind: 'mcq', prompt: 'Bubble sort (our version with `i < n - pass`) on 6 elements. How many passes and how many comparisons?', options: ['5 passes, 15 comparisons', '6 passes, 36 comparisons', '5 passes, 30 comparisons', '6 passes, 15 comparisons'], answer: 0, hints: ['Passes = n − 1.', 'Comparisons = 5 + 4 + 3 + 2 + 1.'], explain: 'n − 1 = 5 passes and 5 + 4 + 3 + 2 + 1 = 15 = 6 × 5 / 2 comparisons.' },
    { id: 'sorting-q2', kind: 'trace', mode: 'vars', prompt: 'ONE pass of bubble sort. Dry run the four boxes.', vars: ['a[0]', 'a[1]', 'a[2]', 'a[3]'], given: [0], code: prog(cpp`
    int a[4] = {8, 5, 6, 1};
    for (int i = 0; i < 3; i++) {
        if (a[i] > a[i + 1]) {
            int temp = a[i];
            a[i] = a[i + 1];
            a[i + 1] = temp;
        }
    }
    cout << a[0] << " " << a[1] << " " << a[2] << " " << a[3];`), hints: ['Follow the 8: it keeps moving right.'], explain: '8 > 5 swap → 5 8 6 1; 8 > 6 swap → 5 6 8 1; 8 > 1 swap → 5 6 1 8. The biggest value bubbled to the end: `5 6 1 8`.' },
    { id: 'sorting-q3', kind: 'bug', prompt: 'This should swap the two values into `4 9`, but it prints `4 4`. Find the line.', code: prog(cpp`
    int a[2] = {9, 4};
    if (a[0] > a[1]) {
        a[0] = a[1];
        a[1] = a[0];
    }
    cout << a[0] << " " << a[1];`), bugLine: 7, options: ['Line 7 destroys the 9 — save it first in a temp box', 'Use `<` instead of `>`', 'Swap lines 7 and 8', 'Add `break`'], answer: 0, hints: ['What is in a[0] after line 7?'], fixed: prog(cpp`
    int a[2] = {9, 4};
    if (a[0] > a[1]) {
        int temp = a[0];
        a[0] = a[1];
        a[1] = temp;
    }
    cout << a[0] << " " << a[1];`), explain: 'After `a[0] = a[1]` both boxes hold 4 and the 9 is gone forever. Swapping the two lines just loses the 4 instead. A third box saves the old value.' },
    { id: 'sorting-q4', kind: 'predict', prompt: 'Selection sort, but only the first 2 passes. Predict the output.', code: prog(cpp`
    int a[5] = {29, 10, 14, 37, 13};
    for (int i = 0; i < 2; i++) {
        int m = i;
        for (int j = i + 1; j < 5; j++) {
            if (a[j] < a[m]) {
                m = j;
            }
        }
        int temp = a[i];
        a[i] = a[m];
        a[m] = temp;
    }
    for (int x : a) cout << x << " ";`), hints: ['Pass 1: the smallest (10) swaps with a[0].', 'Pass 2: the smallest of the rest (13) swaps with a[1].'], explain: 'Pass 1: 10 29 14 37 13. Pass 2: 10 13 14 37 29. Output `10 13 14 37 29 `.' },
    { id: 'sorting-q5', kind: 'blanks', tag: 'real life', prompt: 'Sort the week’s temperatures and print the coolest and hottest. It should print `Coolest: 22, hottest: 35`.', code: prog(cpp`
    int t[5] = {31, 27, 35, 22, 29};
    sort([[1]], [[2]]);
    cout << "Coolest: " << t[0] << ", hottest: " << t[4];`, ALG), blanks: [{ answers: ['t'] }, { answers: ['t + 5', 't+5', '5 + t'] }], chips: ['t', 't + 5', 't + 4', 't[5]'], output: 'Coolest: 22, hottest: 35', hints: ['Where to start, and where to stop.', 'The end is one step PAST the last box.'], explain: '`sort(t, t + 5)` sorts all 5. `t + 4` would leave the last box out of the sorting.' },
    { id: 'sorting-q6', kind: 'parsons', prompt: 'Arrange a bubble sort that prints `2 3 7 9 `.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int a[4] = {7, 3, 9, 2};', '    for (int pass = 1; pass < 4; pass++) {', '        for (int i = 0; i < 4 - pass; i++) {', '            if (a[i] > a[i + 1]) {', '                int temp = a[i];', '                a[i] = a[i + 1];', '                a[i + 1] = temp;', '            }', '        }', '    }', '    for (int x : a) cout << x << " ";', '    return 0;', '}'], distractors: ['            if (a[i] < a[i + 1]) {', '                a[i + 1] = a[i];'], hints: ['Outer loop = passes, inner loop = neighbours.', 'The swap has three lines and starts by saving a[i].'], explain: 'Passes outside, neighbours inside, swap with temp when the left is bigger.' },
    { id: 'sorting-q7', kind: 'mcq', prompt: 'Bubble sort runs on `{1, 2, 3, 4, 5}`, which is already sorted. How many swaps and comparisons does our version make?', options: ['0 swaps, but still 10 comparisons', '0 swaps and 0 comparisons', '10 swaps and 10 comparisons', '4 swaps and 4 comparisons'], answer: 0, hints: ['The loops do not know the array is sorted.'], explain: 'Every pair is already in order, so nothing is swapped — but the loops still compare 4 + 3 + 2 + 1 = 10 pairs. (For `{5, 4, 3, 2, 1}` it would be 10 swaps.)' },
    { id: 'sorting-q8', kind: 'mcq', tag: 'real life', prompt: 'A teacher wants to print the marks from highest to lowest. Which plan works?', options: ['`sort(m, m + n);` then print from index `n - 1` down to `0`', '`sort(m, m + n - 1);` then print from 0', '`sort(m + n, m);`', '`sort(m, m + n);` then print from index 0 up to `n - 1`'], answer: 0, hints: ['sort() always goes from small to big.'], explain: 'sort() puts the smallest first, so walk it backwards (or call `reverse(m, m + n)`). B leaves the last mark unsorted; C has start and end swapped.' },
  ],
  cheatsheet: [
    { code: 'int temp = a[i]; a[i] = a[j]; a[j] = temp;', text: 'swap two boxes (or `swap(a[i], a[j])`)' },
    { code: 'for (pass = 1; pass < n; pass++) for (i = 0; i < n - pass; i++)', text: 'bubble sort: n−1 passes, n(n−1)/2 comparisons' },
    { code: 'minIdx = i; … swap(a[i], a[minIdx]);', text: 'selection sort: smallest of the rest to the front' },
    { code: 'sort(a, a + n);', text: '<algorithm>: small to big; `reverse(a, a + n)` flips it' },
  ],
};

// ------------------------------------------------------------------ Level: arrays-functions
const L5: Level = {
  id: 'arrays-functions',
  kind: 'lesson',
  title: 'Arrays and functions',
  tagline: 'Hand a whole list to a function: `sumOf(marks, 5)`. The function works on the SAME boxes — and it always needs the size.',
  minutes: 25,
  objectives: [
    'Write functions with an `int a[]` parameter and always pass the size',
    'Explain why a function can change the caller’s array, and use `const` to prevent it',
    'Avoid the `sizeof`-inside-a-function trap',
  ],
  learn: [
    { t: 'p', text: 'Sum of marks, highest sale, "fill with zeros" — these are jobs you want to write once and use for any array. The parameter is written `int a[]` (empty brackets), and you **always pass the number of elements too**, because the function cannot find out the size by itself.' },
    { t: 'syntax', title: 'An array parameter', code: 'int sumOf(const int a[], int n)', parts: [
      { token: 'const', text: 'promise: this function only READS the array' },
      { token: 'int a[]', text: 'an array of ints — no size inside the brackets' },
      { token: 'int n', text: 'how many elements to use' },
      { token: 'sumOf(marks, 5)', text: 'the call: the array name WITHOUT brackets, then the size' },
    ] },
    { t: 'viz', title: 'sumOf and indexOfMax', code: progF(cpp`
int sumOf(const int a[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}

int indexOfMax(const int a[], int n) {
    int best = 0;
    for (int i = 1; i < n; i++) {
        if (a[i] > a[best]) {
            best = i;
        }
    }
    return best;
}`, cpp`
    int sales[5] = {120, 340, 90, 410, 275};
    cout << "Total: " << sumOf(sales, 5) << endl;
    int d = indexOfMax(sales, 5);
    cout << "Best day: " << d + 1 << " (" << sales[d] << ")" << endl;`) },
    { t: 'callout', tone: 'key', title: 'The SAME array, not a copy', text: 'When you pass an `int`, the function gets a copy. When you pass an array, the function only gets the **address of the first box** (the memory view draws it as an arrow). So `a[i]` in the function IS `sales[i]` in main — any change is visible to the caller, without `&`.' },
    { t: 'compare', items: [
      { title: 'An int: the function gets a copy', good: true, code: progF(cpp`
void addBonus(int m) {
    m = m + 5;
}`, cpp`
    int marks = 60;
    addBonus(marks);
    cout << marks;`), note: 'Prints 60 — only the copy changed.' },
      { title: 'An array: the function gets the real boxes', good: true, code: progF(cpp`
void addBonus(int m[], int n) {
    for (int i = 0; i < n; i++) {
        m[i] = m[i] + 5;
    }
}`, cpp`
    int marks[3] = {60, 70, 80};
    addBonus(marks, 3);
    cout << marks[0] << " " << marks[1] << " " << marks[2];`), note: 'Prints 65 75 85 — main’s array changed.' },
    ] },
    { t: 'callout', tone: 'info', title: 'const = read-only', text: 'Because a function *can* change your array, mark read-only parameters `const int a[]`. Then an accidental `a[i] = 0;` inside the function is a **compile error** (*assignment of read-only location*) instead of a hidden bug. Leave `const` out only when changing the array is the function’s job (fill, sort, addBonus).' },
    { t: 'callout', tone: 'warn', title: 'The sizeof trap', text: 'Inside the function `a` is really just an address (a pointer). `sizeof(a)` measures that address — 8 bytes on most computers — not the array. So `sizeof(a) / sizeof(a[0])` gives **2** for every array. g++ even warns: *sizeof on array function parameter a will return size of int\\**. Count the elements in `main`, where the array was declared, and pass that number.' },
  ],
  ways: {
    goal: 'Add up `{4, 8, 15, 16}` in a function and print `43`.',
    items: [
      { title: 'Return the sum', code: progF(cpp`
int sumOf(const int a[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}`, cpp`
    int a[4] = {4, 8, 15, 16};
    cout << sumOf(a, 4);`) },
      { title: 'Without const', code: progF(cpp`
int sumOf(int a[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}`, cpp`
    int a[4] = {4, 8, 15, 16};
    cout << sumOf(a, 4);`), note: 'Works too — but nothing stops the function from changing the array by mistake.' },
      { title: 'Answer through a reference parameter', code: progF(cpp`
void sumOf(const int a[], int n, int &total) {
    total = 0;
    for (int i = 0; i < n; i++) {
        total += a[i];
    }
}`, cpp`
    int a[4] = {4, 8, 15, 16};
    int t;
    sumOf(a, 4, t);
    cout << t;`) },
      { title: 'Size counted in main', code: progF(cpp`
int sumOf(const int a[], int n) {
    int s = 0;
    for (int i = n - 1; i >= 0; i--) {
        s += a[i];
    }
    return s;
}`, cpp`
    int a[] = {4, 8, 15, 16};
    int n = sizeof(a) / sizeof(a[0]);
    cout << sumOf(a, n);`), note: '`sizeof` works in main, where the array lives — then pass the count.' },
      { title: 'Recursive', code: progF(cpp`
int sumOf(const int a[], int n) {
    if (n == 0) {
        return 0;
    }
    return sumOf(a, n - 1) + a[n - 1];
}`, cpp`
    int a[4] = {4, 8, 15, 16};
    cout << sumOf(a, 4);`), note: 'Sum of n = sum of the first n − 1, plus the last one.' },
    ],
    takeaway: 'Every version gets the array AND its size. How the answer comes back (return value or reference) is your choice.',
    check: { id: 'arrays-functions-ways-check', kind: 'mcq', prompt: 'Which header does NOT work for the call `sumOf(a, 4)` with `int a[4]`?', options: ['`int sumOf(int a, int n)`', '`int sumOf(int a[], int n)`', '`int sumOf(const int a[], int n)`', '`int sumOf(const int a[4], int n)`'], answer: 0, hints: ['Which one takes a single int instead of an array?'], explain: '`int a` is one number, not an array → compile error. A size inside the brackets (D) is allowed but ignored.' },
  },
  watch: [
    { title: "A function changes the caller's array", intro: 'fill() writes into main’s boxes. Pass a smaller n to work on the first part only.', code: progF(cpp`
void fill(int a[], int n, int value) {
    for (int i = 0; i < n; i++) {
        a[i] = value;
    }
}

void show(const int a[], int n) {
    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";
    }
    cout << endl;
}`, cpp`
    int seats[5] = {1, 0, 1, 1, 0};
    show(seats, 5);
    fill(seats, 5, 0);
    show(seats, 5);
    fill(seats, 2, 1);
    show(seats, 5);`) },
    { title: 'The sizeof trap', intro: 'The same expression gives 6 in main and 2 in the function. (g++ prints a warning for this code.)', code: progF(cpp`
int countWrong(int a[]) {
    return sizeof(a) / sizeof(a[0]);
}`, cpp`
    int a[6] = {1, 2, 3, 4, 5, 6};
    cout << "in main: " << sizeof(a) / sizeof(a[0]) << endl;
    cout << "in function: " << countWrong(a) << endl;`) },
  ],
  think: {
    title: 'Class results',
    problem: 'Write `countPass(m, n, passMark)` that returns how many of the n marks are at least `passMark`. In main, use it for 6 students with pass mark 50 and print passed and failed.',
    steps: [
      { text: 'Header: a read-only array, its size, and the pass mark. It returns a count → `int`.', lines: [4] },
      { text: 'The counter starts at 0.', lines: [5] },
      { text: 'Visit every mark.', lines: [6] },
      { text: 'Count it when it is at least the pass mark.', lines: [7, 8] },
      { text: 'Give the count back.', lines: [11] },
      { text: 'In main: pass the array name (no brackets) and the size.', lines: [16] },
      { text: 'Failed = everyone else.', lines: [17] },
    ],
    code: progF(cpp`
int countPass(const int m[], int n, int passMark) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        if (m[i] >= passMark) {
            c++;
        }
    }
    return c;
}`, cpp`
    int marks[6] = {45, 78, 50, 32, 91, 66};
    int p = countPass(marks, 6, 50);
    cout << p << " passed, " << 6 - p << " failed" << endl;`),
    why: 'The pass mark is a parameter, so the same function answers "how many got 80+?" with `countPass(marks, 6, 80)`.',
    yourTurn: {
      id: 'arrays-functions-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Four students this time. Dry run `i` and `c` inside the function, and `p` in main.',
      vars: ['i', 'c', 'p'],
      code: progF(cpp`
int countPass(const int m[], int n, int passMark) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        if (m[i] >= passMark) {
            c++;
        }
    }
    return c;
}`, cpp`
    int marks[4] = {50, 49, 80, 12};
    int p = countPass(marks, 4, 50);
    cout << p << " passed";`),
      hints: ['50 >= 50 is true — exactly the pass mark counts.', '49 >= 50 is false.'],
      explain: 'Counted: 50 and 80 → c = 2, so p = 2: `2 passed`.',
    },
  },
  practice: [
    { id: 'arrays-functions-q1', kind: 'mcq', prompt: 'How do you call `int sumOf(const int a[], int n)` for `int marks[5]`?', options: ['`sumOf(marks, 5)`', '`sumOf(marks[], 5)`', '`sumOf(marks[5], 5)`', '`sumOf(int marks[], 5)`'], answer: 0, hints: ['In a call you write only the name of the array.'], explain: 'Just the name. `marks[5]` would be one (out-of-bounds) element, not the array.' },
    { id: 'arrays-functions-q2', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: progF(cpp`
void doubleAll(int a[], int n) {
    for (int i = 0; i < n; i++) {
        a[i] *= 2;
    }
}

void addOne(int x) {
    x = x + 1;
}`, cpp`
    int a[3] = {1, 5, 10};
    doubleAll(a, 3);
    addOne(a[0]);
    cout << a[0] << " " << a[1] << " " << a[2];`), hints: ['doubleAll gets the real array.', 'addOne gets a copy of ONE element.'], explain: 'doubleAll changes main’s array to 2 10 20. addOne changes only its copy. Output `2 10 20`.' },
    { id: 'arrays-functions-q3', kind: 'blanks', tag: 'real life', prompt: 'Five shops sell the same phone cover. Complete `indexOfMin` so it prints `Cheapest shop: 4 (Rs 150)`.', code: progF(cpp`
int indexOfMin(const int a[], int n) {
    int best = [[1]];
    for (int i = 1; i < n; i++) {
        if (a[i] [[2]] a[best]) {
            best = [[3]];
        }
    }
    return best;
}`, cpp`
    int price[5] = {250, 180, 320, 150, 210};
    int k = indexOfMin(price, 5);
    cout << "Cheapest shop: " << k + 1 << " (Rs " << price[k] << ")";`), blanks: [{ answers: ['0'] }, { answers: ['<'] }, { answers: ['i'] }], chips: ['0', '1', '<', '>', 'i', 'a[i]'], output: 'Cheapest shop: 4 (Rs 150)', hints: ['`best` is an INDEX, not a price.', 'Remember the position of the cheaper price.'], explain: 'Start with index 0; whenever `a[i]` is cheaper than `a[best]`, remember `i`. The function returns 3; main prints 3 + 1.' },
    { id: 'arrays-functions-q4', kind: 'bug', prompt: 'The bill should total 500, but the program prints 350. Find the line.', code: progF(cpp`
int total(const int a[]) {
    int n = sizeof(a) / sizeof(a[0]);
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}`, cpp`
    int bill[5] = {100, 250, 80, 40, 30};
    cout << total(bill);`), bugLine: 5, options: ['`sizeof(a)` measures an address here, not the array — pass the size as a parameter', 'Start the loop at 1', 'Remove `const`', 'Use `<=` in the loop'], answer: 0, hints: ['Only 100 + 250 were added. How many turns did the loop run?'], fixed: progF(cpp`
int total(const int a[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}`, cpp`
    int bill[5] = {100, 250, 80, 40, 30};
    cout << total(bill, 5);`), explain: 'Inside the function `sizeof(a)` is 8 (an address), so n = 8 / 4 = 2 and only two items are added. g++ warns about exactly this line.' },
    { id: 'arrays-functions-q5', kind: 'trace', mode: 'vars', prompt: '`reverseArr` works on main’s array through `arr`. Dry run main’s boxes.', vars: ['i', 'a[0]', 'a[1]', 'a[2]', 'a[3]'], code: progF(cpp`
void reverseArr(int arr[], int n) {
    for (int i = 0; i < n / 2; i++) {
        int temp = arr[i];
        arr[i] = arr[n - 1 - i];
        arr[n - 1 - i] = temp;
    }
}`, cpp`
    int a[4] = {1, 2, 3, 4};
    reverseArr(a, 4);
    cout << a[0] << a[1] << a[2] << a[3];`), given: [0], hints: ['The loop runs n / 2 = 2 times.', 'Turn i = 0 swaps boxes 0 and 3; i = 1 swaps boxes 1 and 2.'], explain: 'Only 2 swaps are needed for 4 boxes. Because `arr` is main’s array, main prints `4321`.' },
    { id: 'arrays-functions-q6', kind: 'mcq', prompt: 'What does `const` do in `int sumOf(const int a[], int n)`?', options: ['The function promises not to change the elements — `a[0] = 5;` inside it would not compile', 'The caller must pass a `const` array', 'The array is copied, so changes are lost', 'The size can no longer change'], answer: 0, hints: ['Who is protected by the promise?'], explain: 'It makes the parameter read-only. Normal (non-const) arrays can still be passed to it.' },
    { id: 'arrays-functions-q7', kind: 'parsons', prompt: 'Arrange a program with a `show` function. It should print `7 3 9 `.', lines: ['#include <iostream>', 'using namespace std;', 'void show(const int a[], int n) {', '    for (int i = 0; i < n; i++) {', '        cout << a[i] << " ";', '    }', '}', 'int main() {', '    int marks[3] = {7, 3, 9};', '    show(marks, 3);', '    return 0;', '}'], distractors: ['    show(marks[], 3);', 'void show(const int a, int n) {'], hints: ['The function goes above main.', 'In the call, use only the array name.'], explain: 'Parameter `const int a[]` plus the size; call with `show(marks, 3)`.' },
    { id: 'arrays-functions-q8', kind: 'mcq', tag: 'tricky', prompt: 'Inside `void f(int a[])`, g++ warns: *sizeof on array function parameter a will return size of int\\**. Why?', options: ['The function only receives the address of the first element, so sizeof measures that address, not the array', 'Arrays cannot be passed to functions', 'sizeof only works on doubles', 'The array was copied and the copy is empty'], answer: 0, hints: ['What does the function actually receive?'], explain: 'An array parameter is really a pointer to the first box. That is why the function can change the caller’s array — and why it cannot know the size.' },
  ],
  cheatsheet: [
    { code: 'int f(const int a[], int n)', text: 'read-only array + its size' },
    { code: 'f(marks, 5)', text: 'call with the name only — no brackets' },
    { code: 'void fill(int a[], int n, int v)', text: 'changes are visible in the caller (same boxes)' },
    { code: 'sizeof(a) in a function', text: 'TRAP — size of an address; pass n instead' },
  ],
};

// ------------------------------------------------------------------ Level: arrays-2d
const L6: Level = {
  id: 'arrays-2d',
  kind: 'lesson',
  title: '2D arrays: tables and grids',
  tagline: 'A marks sheet, cinema seats, a chess board — rows × columns. A 2D array is an array of rows, walked with two nested loops.',
  minutes: 30,
  objectives: [
    'Declare and initialise `int m[rows][cols]` and reach a box with `m[r][c]`',
    'Walk a table with nested loops and compute row sums and column sums',
    'Count boxes (rows × columns) and solve grid problems like seats, matrix addition and transpose',
  ],
  learn: [
    { t: 'p', text: 'Many things are tables: marks of students (rows) in subjects (columns), seats in a cinema (rows and seat numbers), a timetable. `int m[3][4]` is a table with **3 rows** and **4 columns**: 3 × 4 = **12** boxes. The first index is the row, the second the column, and both start at 0 — the last box is `m[2][3]`.' },
    { t: 'syntax', title: 'Declaring a 2D array', code: 'int m[2][3] = {{1, 2, 3}, {4, 5, 6}};', parts: [
      { token: '[2]', text: 'number of rows' },
      { token: '[3]', text: 'number of columns (boxes in each row)' },
      { token: '{1, 2, 3}', text: 'row 0: `m[0][0]`, `m[0][1]`, `m[0][2]`' },
      { token: '{4, 5, 6}', text: 'row 1: `m[1][0]` … `m[1][2]`' },
    ] },
    { t: 'viz', title: 'Marks table: total for each student', code: prog(cpp`
    int marks[3][4] = {
        {72, 65, 80, 91},
        {55, 48, 62, 70},
        {88, 92, 79, 85}
    };
    for (int r = 0; r < 3; r++) {
        int total = 0;
        for (int c = 0; c < 4; c++) {
            total += marks[r][c];
        }
        cout << "Student " << r + 1 << ": " << total << endl;
    }`) },
    { t: 'callout', tone: 'key', title: 'Nested loops', text: 'The outer loop picks a row; the inner loop walks across that row. The inner loop runs **completely** for every row, so the body runs rows × columns = 3 × 4 = 12 times. For a **row** sum the row loop is outside; for a **column** sum put the column loop outside.' },
    { t: 'table', head: ['Declaration', 'The table', 'Rule'], rows: [
      ['`int m[2][3] = {{1, 2, 3}, {4, 5, 6}};`', '1 2 3 / 4 5 6', 'one inner list per row'],
      ['`int m[2][3] = {1, 2, 3, 4, 5, 6};`', '1 2 3 / 4 5 6', 'a flat list fills row by row'],
      ['`int m[2][3] = {{1}, {4, 5}};`', '1 0 0 / 4 5 0', 'missing values in each row become 0'],
      ['`int m[2][3] = {};`', '0 0 0 / 0 0 0', 'all zeros'],
      ['`int m[][3] = {{1, 2, 3}, {4, 5, 6}};`', '2 rows', 'only the ROW count may be left out'],
    ] },
    { t: 'callout', tone: 'warn', title: 'Two sets of brackets', text: 'Write `m[1][2]`, never `m[1, 2]` (that compiles but means something else). And both indexes must stay in range: in `int m[3][4]` the row goes 0–2 and the column 0–3. Swapping the loop limits (`r < 4`, `c < 3`) walks off the table.' },
  ],
  ways: {
    goal: 'Print the total of all numbers in `int m[2][3] = {{1, 2, 3}, {4, 5, 6}}`: `21`.',
    items: [
      { title: 'Rows outside, columns inside', code: prog(cpp`
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int sum = 0;
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            sum += m[r][c];
        }
    }
    cout << sum;`) },
      { title: 'Columns outside, rows inside', code: prog(cpp`
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int sum = 0;
    for (int c = 0; c < 3; c++) {
        for (int r = 0; r < 2; r++) {
            sum += m[r][c];
        }
    }
    cout << sum;`), note: 'Different visiting order, same boxes.' },
      { title: 'One loop with / and %', code: prog(cpp`
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int sum = 0;
    for (int k = 0; k < 6; k++) {
        sum += m[k / 3][k % 3];
    }
    cout << sum;`), note: 'Box number k lives in row k / 3, column k % 3.' },
      { title: 'Row sums first', code: prog(cpp`
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int rowSum[2] = {};
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            rowSum[r] += m[r][c];
        }
    }
    cout << rowSum[0] + rowSum[1];`), note: 'Handy when you also need each row’s total.' },
    ],
    takeaway: 'Any order works as long as every box is visited exactly once: 2 × 3 = 6 visits.',
    check: { id: 'arrays-2d-ways-check', kind: 'mcq', prompt: 'For `int m[2][3]`, which loop pair is WRONG?', options: ['`for (r = 0; r < 3; r++) for (c = 0; c < 2; c++) … m[r][c]`', '`for (r = 0; r < 2; r++) for (c = 0; c < 3; c++) … m[r][c]`', '`for (c = 0; c < 3; c++) for (r = 0; r < 2; r++) … m[r][c]`', '`for (k = 0; k < 6; k++) … m[k / 3][k % 3]`'], answer: 0, hints: ['How many rows are there?'], explain: 'It uses r = 2, a row that does not exist (out of bounds), and never reaches column 2.' },
  },
  watch: [
    { title: 'Cinema seats', intro: "'O' is free, 'X' is booked. Book row 2, seat 3, then print the hall and count free seats.", code: prog(cpp`
    char seat[3][4] = {
        {'O', 'X', 'X', 'O'},
        {'X', 'X', 'O', 'O'},
        {'O', 'O', 'O', 'X'}
    };
    seat[1][2] = 'X';
    int freeSeats = 0;
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < 4; c++) {
            cout << seat[r][c] << " ";
            if (seat[r][c] == 'O') {
                freeSeats++;
            }
        }
        cout << endl;
    }
    cout << "Free seats: " << freeSeats << endl;`) },
    { title: 'Matrix addition and transpose', intro: 'Add two tables box by box, and flip one: row r, column c goes to row c, column r.', code: prog(cpp`
    int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int b[2][3] = {{10, 20, 30}, {40, 50, 60}};
    int sum[2][3];
    int t[3][2];
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            sum[r][c] = a[r][c] + b[r][c];
            t[c][r] = a[r][c];
        }
    }
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            cout << sum[r][c] << " ";
        }
        cout << endl;
    }
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < 2; c++) {
            cout << t[r][c] << " ";
        }
        cout << endl;
    }`) },
  ],
  think: {
    title: 'Subject totals',
    problem: 'A table holds the marks of 3 students (rows) in 4 subjects (columns). Print each subject’s total and average.',
    steps: [
      { text: 'Rows = students, columns = subjects → `int m[3][4]`.', lines: [5, 6, 7, 8, 9] },
      { text: 'A subject is a COLUMN, so the column loop goes outside.', lines: [10] },
      { text: 'Start a new total for every subject.', lines: [11] },
      { text: 'Walk DOWN the column: every row, same c.', lines: [12, 13] },
      { text: 'Print the total and the average (divide by 3.0 to keep decimals).', lines: [15] },
    ],
    code: prog(cpp`
    int m[3][4] = {
        {72, 65, 80, 91},
        {55, 48, 62, 70},
        {88, 92, 79, 85}
    };
    for (int c = 0; c < 4; c++) {
        int total = 0;
        for (int r = 0; r < 3; r++) {
            total += m[r][c];
        }
        cout << "Subject " << c + 1 << ": total " << total << ", average " << total / 3.0 << endl;
    }`),
    why: 'Compare with the student totals in Learn: same table, the two loops just swapped places. Ask yourself "is my answer about a row or a column?" and put that loop outside.',
    yourTurn: {
      id: 'arrays-2d-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'Two shops (rows), three days (columns) of sales. What does each line print?',
      code: prog(cpp`
    int s[2][3] = {
        {5, 8, 2},
        {3, 1, 9}
    };
    for (int c = 0; c < 3; c++) {
        int total = 0;
        for (int r = 0; r < 2; r++) {
            total += s[r][c];
        }
        cout << "Day " << c + 1 << ": " << total << endl;
    }`),
      hints: ['Day 1 is column 0: 5 + 3.'],
      explain: 'Column totals: 5 + 3 = 8, 8 + 1 = 9, 2 + 9 = 11.',
    },
  },
  practice: [
    { id: 'arrays-2d-q1', kind: 'mcq', prompt: '`int m[3][4];` How many boxes does it have, and which is the last one?', options: ['12 boxes, the last is `m[2][3]`', '12 boxes, the last is `m[3][4]`', '7 boxes, the last is `m[2][3]`', '12 boxes, the last is `m[3][2]`'], answer: 0, hints: ['rows × columns.', 'Both indexes start at 0.'], explain: '3 × 4 = 12. Rows 0–2, columns 0–3, so the last box is `m[2][3]`.' },
    { id: 'arrays-2d-q2', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int m[2][3] = {{1}, {4, 5}};
    int k[2][2] = {1, 2, 3};
    cout << m[0][0] << m[0][1] << m[1][0] << m[1][1] << m[1][2] << " ";
    cout << k[1][0] << k[1][1];`), hints: ['Missing values in each inner list become 0.', 'A flat list fills row 0 first, then row 1.'], explain: 'm is 1 0 0 / 4 5 0 → `10450`. k is 1 2 / 3 0 → `30`. Output `10450 30`.' },
    { id: 'arrays-2d-q3', kind: 'trace', mode: 'vars', prompt: 'Dry run the four boxes.', vars: ['m[0][0]', 'm[0][1]', 'm[1][0]', 'm[1][1]'], given: [0], code: prog(cpp`
    int m[2][2] = {{1, 2}, {3, 4}};
    m[0][1] = m[1][0] + m[1][1];
    m[1][0] = m[0][0] * 10;
    int temp = m[0][0];
    m[0][0] = m[1][1];
    m[1][1] = temp;
    cout << m[0][0] << " " << m[0][1] << " " << m[1][0] << " " << m[1][1];`), hints: ['m[1][0] is row 1, column 0: the 3.'], explain: 'm[0][1] = 3 + 4 = 7; m[1][0] = 1 × 10 = 10; then the corners swap: m[0][0] = 4, m[1][1] = 1. Output `4 7 10 1`.' },
    { id: 'arrays-2d-q4', kind: 'blanks', tag: 'real life', prompt: 'Weekly sales: 3 shops (rows) × 4 days (columns). Print each shop’s total.', code: prog(cpp`
    int sales[3][4] = {{5, 8, 2, 6}, {3, 3, 9, 1}, {7, 0, 4, 4}};
    for (int s = 0; s < [[1]]; s++) {
        int total = 0;
        for (int d = 0; d < [[2]]; d++) {
            total += [[3]];
        }
        cout << "Shop " << s + 1 << ": " << total << endl;
    }`), blanks: [{ answers: ['3'] }, { answers: ['4'] }, { answers: ['sales[s][d]'] }], chips: ['3', '4', 'sales[s][d]', 'sales[d][s]'], output: 'Shop 1: 21\nShop 2: 16\nShop 3: 15\n', hints: ['s counts shops (rows), d counts days (columns).', 'Row index first.'], explain: 'Shops are rows (3), days are columns (4): `sales[s][d]`.' },
    { id: 'arrays-2d-q5', kind: 'bug', prompt: 'It should print the COLUMN totals `12 15 18`, but prints `6 15 24`. Find the line.', code: prog(cpp`
    int m[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    for (int c = 0; c < 3; c++) {
        int total = 0;
        for (int r = 0; r < 3; r++) {
            total += m[c][r];
        }
        cout << total << " ";
    }`), bugLine: 9, options: ['The indexes are swapped — it must be `m[r][c]`', 'The outer loop must be the row loop', 'total must be declared before the outer loop', 'Use `r <= 3`'], answer: 0, hints: ['6 is the total of row 0. Why?'], fixed: prog(cpp`
    int m[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    for (int c = 0; c < 3; c++) {
        int total = 0;
        for (int r = 0; r < 3; r++) {
            total += m[r][c];
        }
        cout << total << " ";
    }`), explain: 'The row index always comes first. `m[c][r]` walks along row c, so it computes row sums. (On a non-square table it would even go out of bounds.)' },
    { id: 'arrays-2d-q6', kind: 'mcq', tag: 'real life', prompt: 'A cinema is `char seats[5][8]` (5 rows, 8 seats each). How do you reach the 3rd seat of the 2nd row?', options: ['`seats[1][2]`', '`seats[2][3]`', '`seats[2][1]`', '`seats[1, 2]`'], answer: 0, hints: ['Row first, and subtract 1 from both because indexes start at 0.'], explain: '2nd row → index 1; 3rd seat → index 2.' },
    { id: 'arrays-2d-q7', kind: 'predict', prompt: 'Predict the output. How many times does the inner body run?', code: prog(cpp`
    int count = 0;
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < 4; c++) {
            if (r == c) {
                cout << "*";
            } else {
                cout << ".";
            }
            count++;
        }
        cout << endl;
    }
    cout << count;`), hints: ['A star only where the row number equals the column number.', '3 rows × 4 columns.'], explain: 'Stars on the diagonal (0,0), (1,1), (2,2). The body runs 3 × 4 = 12 times.' },
    { id: 'arrays-2d-q8', kind: 'parsons', prompt: 'Find the highest mark in the whole table and where it is. It should print `92 at row 2, col 1`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int m[2][3] = {{72, 65, 80}, {88, 92, 79}};', '    int best = m[0][0], br = 0, bc = 0;', '    for (int r = 0; r < 2; r++) {', '        for (int c = 0; c < 3; c++) {', '            if (m[r][c] > best) {', '                best = m[r][c];', '                br = r;', '                bc = c;', '            }', '        }', '    }', '    cout << best << " at row " << br + 1 << ", col " << bc;', '    return 0;', '}'], distractors: ['        for (int c = 0; c < 2; c++) {', '    int best = 0, br = 0, bc = 0;'], hints: ['Start `best` with a box that really exists.', 'Remember BOTH indexes when you find a bigger mark.'], explain: 'The max pattern from Level 2, with two loops and two remembered indexes. 92 is at `m[1][1]` → row 2 (printed as br + 1), column index 1.' },
  ],
  cheatsheet: [
    { code: 'int m[R][C];', text: 'R rows × C columns = R·C boxes; last box m[R-1][C-1]' },
    { code: '{{1, 2, 3}, {4, 5, 6}}', text: 'one inner list per row; missing values → 0' },
    { code: 'for r … for c … m[r][c]', text: 'row loop outside → row sums' },
    { code: 'for c … for r … m[r][c]', text: 'column loop outside → column sums' },
  ],
};

// ------------------------------------------------------------------ Checkpoint
const C8: Level = {
  id: 'checkpoint-arrays',
  kind: 'revision',
  title: 'Arrays',
  tagline: '**Checkpoint 8.** Real lists and tables: weekly sales, class results, temperatures, shopping bills and cinema seats. Loop, search, sort, pass to functions — then build a complete results program.',
  minutes: 35,
  objectives: [
    'Solve real problems with 1D and 2D arrays',
    'Count loop turns, comparisons and swaps',
    'Build a complete program with array functions',
  ],
  practice: [
    { id: 'checkpoint-arrays-q1', kind: 'mcq', tag: 'real life', prompt: 'A shop stores its sales for Monday to Sunday in `int sales[7]`. Which expression is Sunday’s sale?', options: ['`sales[6]`', '`sales[7]`', '`sales[0]`', '`sales[-1]`'], answer: 0, hints: ['Monday is index 0.'], explain: 'Seven days → indexes 0 to 6. `sales[7]` is out of bounds.' },
    { id: 'checkpoint-arrays-q2', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'Temperatures in Lahore for 4 days. How many were hotter than 35? Dry run it.', vars: ['i', 'hot'], code: prog(cpp`
    int t[4] = {33, 36, 38, 30};
    int hot = 0;
    for (int i = 0; i < 4; i++) {
        if (t[i] > 35) {
            hot++;
        }
    }
    cout << hot << " hot days";`), hints: ['Check 33, 36, 38, 30 one by one.'], explain: '36 and 38 are above 35 → `2 hot days`.' },
    { id: 'checkpoint-arrays-q3', kind: 'predict', tag: 'real life', prompt: 'Class results: the average, and how many students are above it. Predict the output.', code: prog(cpp`
    int m[5] = {60, 75, 40, 90, 85};
    int sum = 0;
    for (int x : m) {
        sum += x;
    }
    double avg = sum / 5.0;
    int above = 0;
    for (int x : m) {
        if (x > avg) {
            above++;
        }
    }
    cout << "avg " << avg << ", above " << above;`), hints: ['sum = 350.', 'Which marks are greater than 70?'], explain: 'avg = 350 / 5.0 = 70; 75, 90 and 85 are above → `avg 70, above 3`. Two loops are needed: you cannot know who is above the average before you know the average.' },
    { id: 'checkpoint-arrays-q4', kind: 'bug', tag: 'real life', prompt: 'Winter nights in Skardu. The warmest night was -3, but the program prints 0. Find the line.', code: prog(cpp`
    int t[4] = {-8, -3, -11, -5};
    int warm = 0;
    for (int i = 0; i < 4; i++) {
        if (t[i] > warm) {
            warm = t[i];
        }
    }
    cout << "Warmest: " << warm;`), bugLine: 6, options: ['Start with `warm = t[0]` — 0 is warmer than every night', 'Use `<` instead of `>`', 'Start the loop at `i = 1`', 'Use `t[i] >= warm`'], answer: 0, hints: ['Is any temperature bigger than 0?'], fixed: prog(cpp`
    int t[4] = {-8, -3, -11, -5};
    int warm = t[0];
    for (int i = 1; i < 4; i++) {
        if (t[i] > warm) {
            warm = t[i];
        }
    }
    cout << "Warmest: " << warm;`), explain: 'No night beats 0, so `warm` never changes. Start with a real element, `t[0]`.' },
    { id: 'checkpoint-arrays-q5', kind: 'blanks', tag: 'real life', prompt: 'Shopping list: find the FIRST item that costs Rs 300 and print its position (counting from 1). It should print `item 3`.', code: prog(cpp`
    int price[5] = {120, 45, 300, 60, 300};
    int want = 300;
    int pos = [[1]];
    for (int i = 0; i < 5; i++) {
        if (price[i] == want) {
            pos = i;
            [[2]];
        }
    }
    if (pos == -1) {
        cout << "none";
    } else {
        cout << "item " << pos + 1;
    }`), blanks: [{ answers: ['-1'] }, { answers: ['break'] }], chips: ['-1', '0', 'break', 'continue'], output: 'item 3', hints: ['Which value means "not found yet"?', 'Without stopping, the second 300 would win.'], explain: 'Start at -1 and break on the first match (index 2 → item 3).' },
    { id: 'checkpoint-arrays-q6', kind: 'paths', tag: 'real life', prompt: 'Attendance for 6 days: 1 = present, 0 = absent. Type 6 values (e.g. `1 1 0 1 1 1`) and find an input for every message.', code: prog(cpp`
    int att[6];
    int absent = 0;
    for (int i = 0; i < 6; i++) {
        cin >> att[i];
        if (att[i] == 0) {
            absent++;
        }
    }
    if (absent == 0) {
        cout << "Full attendance!";
    } else if (absent <= 2) {
        cout << "Absent " << absent << " day(s)";
    } else {
        cout << "Warning: short attendance";
    }`), paths: [{ label: '`Full attendance!`', line: 14 }, { label: '`Absent … day(s)`', line: 16 }, { label: '`Warning: short attendance`', line: 18 }], start: '1 1 0 1 1 1', hints: ['How many zeros for each message?'], explain: 'No zeros (`1 1 1 1 1 1`); one or two zeros (`1 1 0 1 1 1`); three or more (`0 0 0 1 1 1`).' },
    { id: 'checkpoint-arrays-q7', kind: 'mcq', prompt: 'A college keeps 1000 roll numbers in a SORTED array. In the worst case, how many comparisons do linear search and binary search need?', options: ['Linear 1000, binary about 10', 'Both 1000', 'Linear 500, binary 500', 'Linear 10, binary 1000'], answer: 0, hints: ['Binary search halves the range each time: 1000, 500, 250, …'], explain: 'Linear search may check every roll number. Binary search needs about log₂ 1000 ≈ 10 looks.' },
    { id: 'checkpoint-arrays-q8', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'Cinema booking: three requests (row, seat). Book a free seat, or print `taken`. Dry run it.', vars: ['k', 's[0][1]', 'booked'], code: prog(cpp`
    char s[2][3] = {{'O', 'O', 'X'}, {'X', 'O', 'O'}};
    int wantR[3] = {0, 1, 0};
    int wantC[3] = {1, 0, 1};
    int booked = 0;
    for (int k = 0; k < 3; k++) {
        int r = wantR[k], c = wantC[k];
        if (s[r][c] == 'O') {
            s[r][c] = 'X';
            booked++;
        } else {
            cout << "taken ";
        }
    }
    cout << booked << " booked";`), hints: ['Request 1 is s[0][1], request 2 is s[1][0], request 3 is s[0][1] again.', 'After request 1, s[0][1] is no longer free.'], explain: 'Request 1 books s[0][1]; request 2 finds s[1][0] already X; request 3 asks for s[0][1], now taken. Output `taken taken 1 booked`.' },
    { id: 'checkpoint-arrays-q9', kind: 'predict', tag: 'real life', prompt: 'A batter’s scores in 6 matches. Predict the output.', code: prog(cpp`
    int runs[6] = {45, 102, 12, 67, 0, 88};
    sort(runs, runs + 6);
    cout << "Top 3: " << runs[5] << " " << runs[4] << " " << runs[3] << endl;
    cout << "Lowest: " << runs[0];`, ALG), hints: ['After sort: 0 12 45 67 88 102.'], explain: 'Sorted small to big, so the top 3 are at the end: `Top 3: 102 88 67`, `Lowest: 0`.' },
    { id: 'checkpoint-arrays-q10', kind: 'mcq', prompt: 'What does this program print?', code: progF(cpp`
void reset(int a[], int n) {
    for (int i = 0; i < n; i++) {
        a[i] = 0;
    }
}`, cpp`
    int score[4] = {7, 8, 9, 10};
    reset(score, 2);
    cout << score[0] + score[1] + score[2] + score[3];`), options: ['19', '0', '34', '17'], answer: 0, hints: ['The function changes main’s array — but only the first n boxes.'], explain: 'score becomes 0 0 9 10 → 19.' },
    { id: 'checkpoint-arrays-q11', kind: 'bug', prompt: 'This does not compile. Find the line.', code: progF(cpp`
int sumOf(const int a[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}`, cpp`
    int marks[5] = {60, 70, 80, 90, 50};
    cout << sumOf(marks[5], 5);`), bugLine: 14, options: ['Pass the array by name: `sumOf(marks, 5)`', 'Remove `const` from the function', 'Change the size to `marks[6]`', 'sumOf must return void'], answer: 0, hints: ['`marks[5]` is one int (and out of bounds!), not the array.'], fixed: progF(cpp`
int sumOf(const int a[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}`, cpp`
    int marks[5] = {60, 70, 80, 90, 50};
    cout << sumOf(marks, 5);`), explain: 'g++: *invalid conversion from int to const int\\**. The function wants an array (an address); `marks[5]` is a single int.' },
    { id: 'checkpoint-arrays-q12', kind: 'predict', tag: 'tricky', prompt: 'Count the pairs of equal values. How many comparisons does it make? Predict the output.', code: prog(cpp`
    int a[6] = {3, 7, 3, 1, 7, 3};
    int pairs = 0, checks = 0;
    for (int i = 0; i < 6; i++) {
        for (int j = i + 1; j < 6; j++) {
            checks++;
            if (a[i] == a[j]) {
                pairs++;
            }
        }
    }
    cout << pairs << " pairs, " << checks << " comparisons";`), hints: ['j always starts AFTER i, so each pair is checked once: 5 + 4 + 3 + 2 + 1.', 'Three 3s make 3 pairs; two 7s make 1 pair.'], explain: 'Comparisons: 5 + 4 + 3 + 2 + 1 = 15 (= 6 × 5 / 2, like bubble sort). Pairs: 3 of 3s + 1 of 7s = 4. Output `4 pairs, 15 comparisons`.' },
    { id: 'checkpoint-arrays-q13', kind: 'blanks', prompt: '**Capstone: class results.** Read 5 marks, sort them, and print the average, the highest mark and how many passed (50 or more). Input `67 45 88 50 72` → `Average: 64.4`, `Highest: 88`, `Passed: 4`.', code: progF(cpp`
double average(const int a[], int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += [[1]];
    }
    return [[2]];
}

int countAtLeast(const int a[], int n, int limit) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] >= limit) {
            c++;
        }
    }
    return c;
}`, cpp`
    const int N = 5;
    int marks[N];
    for (int i = 0; i < N; i++) {
        cin >> [[3]];
    }
    sort(marks, [[4]]);
    cout << "Average: " << average(marks, N) << endl;
    cout << "Highest: " << marks[N - 1] << endl;
    cout << "Passed: " << countAtLeast(marks, N, [[5]]) << endl;`, ALG), blanks: [
      { answers: ['a[i]'] },
      { answers: ['(double)sum / n', 'sum / (double)n', 'double(sum) / n', 'sum / double(n)', '1.0 * sum / n', 'sum * 1.0 / n', 'static_cast<double>(sum) / n'], hint: 'Avoid whole-number division.' },
      { answers: ['marks[i]'] },
      { answers: ['marks + N', 'marks + 5', 'N + marks'] },
      { answers: ['50'] },
    ], chips: ['a[i]', 'marks[i]', '(double)sum / n', 'sum / n', 'marks + N', 'marks + N - 1', '50'], input: '67 45 88 50 72\n', output: 'Average: 64.4\nHighest: 88\nPassed: 4\n', hints: ['Inside the functions the array is called `a`; in main it is `marks`.', '`sum / n` with two ints would give 64, not 64.4.', 'After sorting small to big, the highest mark is the last box.'], explain: 'Sum = 322 → 322 / 5.0 = 64.4. After `sort(marks, marks + N)` the last box is 88. 67, 88, 50 and 72 are at least 50 → 4. Everything from this unit in one program: reading with a loop, sorting, and array functions with the size passed in.' },
  ],
  cheatsheet: [
    { code: 'a[0] … a[n-1]', text: 'indexes; loop with `i < n`' },
    { code: 'pos = -1 … break', text: 'linear search; binary search needs sorted data' },
    { code: 'sort(a, a + n)', text: 'small to big (<algorithm>)' },
    { code: 'f(const int a[], int n)', text: 'arrays go to functions by name, with the size' },
    { code: 'm[r][c]', text: 'row first; rows × cols boxes' },
  ],
  exam: {
    title: 'Exam Challenge: Arrays',
    intro: '**State the output of the following code. If there is an error, write it explicitly** (which line, and why). Draw the array as a row of boxes (or a grid for 2D) and update it on paper after every change — exactly like the PF sessional. Watch for binary-search `low/high/mid`, sorting passes, arrays changed inside functions, missing values that become 0, and rules that arrays break (no `=` between arrays, no extra initializers, sizes for every dimension except the first).',
    questions: [
      { id: 'checkpoint-arrays-x1', kind: 'predict', tag: 'exam', prompt: 'Binary search for a key that is NOT in the array. State the output. If there is an error, write it.', code: prog(cpp`
    int a[] = {3, 8, 14, 21, 35, 42, 57};
    int l = 0, h = 6, k = 40, ans = -1;
    while (l <= h) {
        int m = (l + h) / 2;
        cout << a[m] << " ";
        if (a[m] == k) {
            ans = m;
            break;
        }
        if (k < a[m])
            h = m - 1;
        else
            l = m + 1;
    }
    cout << endl << ans << " " << l << " " << h;`), hints: ['Make a table with columns l, h, m, a[m].', 'The loop stops when l becomes bigger than h.'], explain: '| l | h | m | a[m] | action |\n• 0, 6 → m = 3, a[3] = 21: 40 > 21 → l = 4.\n• 4, 6 → m = 5, a[5] = 42: 40 < 42 → h = 4.\n• 4, 4 → m = 4, a[4] = 35: 40 > 35 → l = 5.\n• l = 5 > h = 4 → the loop ends. 40 was never found, so ans stays -1.\nOutput:\n`21 42 35 ` (a space after each)\n`-1 5 4`' },
      { id: 'checkpoint-arrays-x2', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int a[4] = {10, 20, 30, 40};
    int b[4];
    b = a;
    b[0] = 99;
    cout << a[0] << " " << b[0];`), hints: ['Can a whole array be copied with one `=`?'], explain: '**Compile error on line 7: invalid array assignment.**\nAn array name is not one box you can overwrite — C++ does not allow `=` between two arrays, even when they have the same type and size.\nFix: copy element by element: `for (int i = 0; i < 4; i++) b[i] = a[i];`. Then it would print `10 99` (b is a separate copy, so changing b[0] does not touch a[0]).' },
      { id: 'checkpoint-arrays-x3', kind: 'predict', tag: 'exam', prompt: 'Bubble sort that stops early. State the output. If there is an error, write it.', code: prog(cpp`
    int a[5] = {5, 1, 4, 2, 8};
    for (int pass = 1; pass <= 4; pass++) {
        bool swapped = false;
        for (int j = 0; j < 5 - pass; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j];
                a[j] = a[j + 1];
                a[j + 1] = t;
                swapped = true;
            }
        }
        for (int j = 0; j < 5; j++)
            cout << a[j];
        cout << endl;
        if (!swapped)
            break;
    }`), hints: ['In each pass, compare neighbours from left to right and swap when the left one is bigger.', 'The array is printed after EVERY pass — also after the pass with no swap.'], explain: 'Pass 1 (j = 0..3): 5>1 swap → 1 5 4 2 8; 5>4 swap → 1 4 5 2 8; 5>2 swap → 1 4 2 5 8; 5<8 no. Print `14258`.\nPass 2 (j = 0..2): 1<4 no; 4>2 swap → 1 2 4 5 8; 4<5 no. Print `12458`.\nPass 3 (j = 0..1): no swaps. Print `12458`, then `swapped` is false → `break` (pass 4 never runs).\nOutput:\n`14258`\n`12458`\n`12458`' },
      { id: 'checkpoint-arrays-x4', kind: 'predict', tag: 'exam', prompt: 'An array and two ints go into a function. State the output. If there is an error, write it.', code: progF(cpp`
void addAll(int a[], int n, int x) {
    for (int i = 0; i < n; i++)
        a[i] += x;
    x = 100;
    n = 0;
}`, cpp`
    int arr[4] = {1, 2, 3};
    int n = 4, x = 5;
    addAll(arr, n - 1, x);
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";
    cout << "| " << n << " " << x;`), hints: ['`int arr[4] = {1, 2, 3};` — what is in the 4th box?', 'The function works on the REAL array, but `n` and `x` are copies.'], explain: 'Line 12: the missing 4th value becomes **0** → {1, 2, 3, 0}.\nLine 14 passes n − 1 = **3**, so only the first 3 boxes change. An array parameter works on the caller’s array itself: {6, 7, 8, 0}.\nInside, `x = 100;` and `n = 0;` change only the function’s own copies — main’s n (4) and x (5) stay the same.\nOutput: **`6 7 8 0 | 4 5`**' },
      { id: 'checkpoint-arrays-x5', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int m[3][3] = {{1, 2}, {3}, {4, 5, 6}};
    int d = 0, s = 0;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (i == j) d += m[i][j];
            if (i + j == 2) s += m[i][j];
        }
    }
    cout << d << " " << s << " " << m[1][0] * m[2][1];`), hints: ['Each inner `{ }` is one row. Missing values in a row become 0.', '`i == j` is the main diagonal; `i + j == 2` is the other diagonal.'], explain: 'The grid is:\n`1 2 0`\n`3 0 0`\n`4 5 6`\nMain diagonal (i == j): m[0][0] + m[1][1] + m[2][2] = 1 + 0 + 6 = **7**.\nOther diagonal (i + j == 2): m[0][2] + m[1][1] + m[2][0] = 0 + 0 + 4 = **4**.\n`m[1][0] * m[2][1]` = 3 × 5 = **15**.\nOutput: **`7 4 15`**' },
      { id: 'checkpoint-arrays-x6', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: progF(cpp`
void show(int m[][4], int rows) {
    for (int r = 0; r < rows; r++)
        cout << m[r][0] << " ";
}`, cpp`
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    show(m, 2);`), hints: ['To find `m[r][0]`, the function must know how long one row is.', 'Compare the column size in the parameter with the column size of the real array.'], explain: '**Compile error on line 11: cannot convert `int [2][3]` to `int (*)[4]`** (the argument does not match the parameter).\nA 2D array is stored row after row. The parameter `int m[][4]` says *every row has 4 columns*, but the array in main has rows of **3**. With the wrong row length the function would jump to the wrong boxes, so C++ refuses the call. Only the FIRST size (the number of rows) may be left empty or differ; every other size must match exactly.\nFix: `void show(int m[][3], int rows)`. Then it prints `1 4 ` (the first value of each row).' },
      { id: 'checkpoint-arrays-x7', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int marks[3] = {70, 85, 90, 65};
    int sum = 0;
    for (int i = 0; i < 3; i++)
        sum += marks[i];
    cout << sum;`), hints: ['Count the values in the list, and compare with the size in `[ ]`.'], explain: '**Compile error on line 5: too many initializers for `int [3]`.**\nThe array has room for 3 ints, but the list gives 4 values. Fewer values are fine (the rest become 0), but more values than boxes do not compile.\nFix: `int marks[4] = {70, 85, 90, 65};` (and loop to 4), or remove 65. With only the first three values it would print `245`.' },
      { id: 'checkpoint-arrays-x8', kind: 'count', tag: 'exam', count: { line: 13 }, unit: 'swaps', prompt: 'Selection sort swaps only when the smallest value is not already in place. How many times does line 13 (`int t = a[i];`) run?', code: prog(cpp`
    int a[6] = {2, 9, 4, 7, 1, 8};
    for (int i = 0; i < 5; i++) {
        int mn = i;
        for (int j = i + 1; j < 6; j++) {
            if (a[j] < a[mn])
                mn = j;
        }
        if (mn != i) {
            int t = a[i];
            a[i] = a[mn];
            a[mn] = t;
        }
    }
    for (int i = 0; i < 6; i++)
        cout << a[i] << " ";`), hints: ['In round i, find the smallest value from position i to the end.', 'If it is already at position i, there is no swap.'], explain: '• i = 0: smallest of {2, 9, 4, 7, 1, 8} is 1 (index 4) → swap → {1, 9, 4, 7, 2, 8}. (1)\n• i = 1: smallest of {9, 4, 7, 2, 8} is 2 (index 4) → swap → {1, 2, 4, 7, 9, 8}. (2)\n• i = 2: smallest of {4, 7, 9, 8} is 4 — already at index 2, no swap.\n• i = 3: smallest of {7, 9, 8} is 7 — already in place, no swap.\n• i = 4: smallest of {9, 8} is 8 (index 5) → swap → {1, 2, 4, 7, 8, 9}. (3)\nLine 13 runs **3 times**. The program prints `1 2 4 7 8 9 `.' },
      { id: 'checkpoint-arrays-x9', kind: 'count', tag: 'exam', count: { text: '*' }, unit: 'stars', prompt: 'Each cell of the grid says how many stars to print. How many `*` does this program print?', code: prog(cpp`
    int g[3][4] = {{1, 0, 2, 0}, {0, 3, 0, 0}, {4, 0, 0, 5}};
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < 4; c++) {
            if (g[r][c] == 0) continue;
            if (g[r][c] > 3) break;
            for (int k = 0; k < g[r][c]; k++)
                cout << "*";
        }
        cout << endl;
    }`), hints: ['`continue` skips a 0 cell; `break` ends only the current ROW.', 'Look at the first cell of row 2.'], explain: '• Row 0: 1 → `*`, 0 skipped, 2 → `**`, 0 skipped → 3 stars.\n• Row 1: 0, 3 → `***`, 0, 0 → 3 stars.\n• Row 2: the first cell is 4 > 3 → `break` leaves the `c` loop at once — the 5 is never reached. 0 stars (just the `endl`).\nTotal **6 stars**. Output: `***`, `***` and an empty line.' },
      { id: 'checkpoint-arrays-x10', kind: 'blanks', tag: 'exam', prompt: '**Complete the program:** binary search for `48` in the sorted array. It must print `Found at 6`.', code: prog(cpp`
    int a[8] = {5, 12, 19, 23, 31, 40, 48, 56};
    int key = 48, low = 0, high = [[1]];
    int pos = -1;
    while (low [[2]] high) {
        int mid = [[3]];
        if (a[mid] == key) {
            pos = mid;
            break;
        } else if (a[mid] < key) {
            low = [[4]];
        } else {
            high = mid - 1;
        }
    }
    cout << "Found at " << pos;`), output: 'Found at 6', blanks: [{ answers: ['7', '8 - 1'], hint: 'The index of the LAST box.' }, { answers: ['<='] }, { answers: ['(low + high) / 2', '(low+high)/2', '(low + high)/2', '(high + low) / 2', 'low + (high - low) / 2'] }, { answers: ['mid + 1', 'mid+1'] }], chips: ['7', '8', '<=', '<', '(low + high) / 2', 'mid + 1', 'mid', 'mid - 1'], hints: ['`high` starts at the last index, not at the size.', 'If the middle value is too small, the key is to the RIGHT of mid.'], explain: '`high = 7` (8 boxes → last index 7). Loop while `low <= high` (with `<` a one-box range would be skipped). `mid = (low + high) / 2`. If `a[mid] < key`, throw away the left half including mid: `low = mid + 1`.\nTrace: mid = 3 (23 < 48) → low = 4; mid = 5 (40 < 48) → low = 6; mid = 6 (48) → found → **`Found at 6`**.' },
    ],
  },
};

export const unit8: Unit = {
  id: 'u8',
  num: 8,
  title: 'Arrays: many values, one name',
  summary: 'Store a list of values, loop over it, search it, sort it — and build 2D tables.',
  levels: [L1, L2, L3, L4, L5, L6, C8],
};
