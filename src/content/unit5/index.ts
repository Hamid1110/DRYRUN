import type { Level, Unit } from '../types';
import { cpp, prog } from '../helpers';

// ------------------------------------------------------------------ Level 18: comparisons
const L18: Level = {
  id: 'comparisons',
  kind: 'lesson',
  title: 'Comparisons and bool',
  tagline: 'Every decision starts with a yes/no question. `>`, `<`, `==` and friends turn a question into `true` or `false`.',
  minutes: 20,
  objectives: [
    'Use the six relational operators and read them in English',
    'Know that a comparison gives a `bool` that prints as 1 or 0',
    'Never confuse `=` (store) with `==` (compare)',
  ],
  learn: [
    { t: 'table', head: ['Operator', 'English', 'Example (a = 7, b = 4)', 'Result'], rows: [
      ['`==`', 'is equal to', '`a == b`', 'false'],
      ['`!=`', 'is not equal to', '`a != b`', 'true'],
      ['`>`', 'is greater than', '`a > b`', 'true'],
      ['`<`', 'is less than', '`a < b`', 'false'],
      ['`>=`', 'is at least', '`a >= 7`', 'true'],
      ['`<=`', 'is at most', '`b <= 3`', 'false'],
    ] },
    { t: 'callout', tone: 'warn', title: '= stores, == compares', text: '`x = 5` puts 5 into x. `x == 5` asks *is x equal to 5?* Mixing them up is the number-one if/else bug.' },
    { t: 'viz', title: 'Comparisons give true / false', code: prog(cpp`
    int age = 17;
    bool adult = age >= 18;
    bool teen = age > 12;
    cout << adult << " " << teen << endl;
    cout << boolalpha << adult << " " << teen << endl;`) },
    { t: 'callout', tone: 'tip', title: '1 and 0', text: 'cout prints `true` as **1** and `false` as **0**. Put `boolalpha` into cout once to see the words instead.' },
    { t: 'h', text: 'Comparing characters and text' },
    { t: 'table', head: ['Code', 'Result', 'Why'], rows: [
      ["`'A' < 'B'`", 'true', 'characters compare by ASCII code: 65 < 66'],
      ["`'a' < 'B'`", 'false', "lowercase letters come after capitals: 'a' is 97"],
      ['`name == "Ali"`', 'true if name holds Ali', 'strings compare letter by letter'],
    ] },
  ],
  ways: {
    goal: 'Check whether `marks` (72) is a pass — at least 50 — and print 1 for yes.',
    items: [
      { title: 'At least 50', code: prog(cpp`
    int marks = 72;
    cout << (marks >= 50);`) },
      { title: 'More than 49', code: prog(cpp`
    int marks = 72;
    cout << (marks > 49);`), note: 'Same meaning for whole numbers.' },
      { title: 'Not less than 50', code: prog(cpp`
    int marks = 72;
    cout << !(marks < 50);`), note: '`!` flips true and false.' },
      { title: '50 is at most marks', code: prog(cpp`
    int marks = 72;
    cout << (50 <= marks);`) },
      { title: 'Store the answer in a bool', code: prog(cpp`
    int marks = 72;
    bool pass = marks >= 50;
    cout << pass;`) },
    ],
    takeaway: 'One question can be written many ways. Pick the one that reads most like your English sentence.',
    check: { id: 'l18-ways-check', kind: 'mcq', prompt: 'Which one does NOT mean "marks is at least 50"?', options: ['`marks > 50`', '`marks >= 50`', '`!(marks < 50)`', '`50 <= marks`'], answer: 0, explain: '`marks > 50` is false when marks is exactly 50.' },
  },
  watch: [
    { title: 'Why cout needs brackets around a comparison', code: prog(cpp`
    int a = 5, b = 9;
    cout << (a < b) << endl;
    cout << (a == b) << endl;
    cout << (a != b) << endl;`) },
  ],
  practice: [
    { id: 'l18-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int x = 10, y = 20;
    cout << (x < y) << (x == y) << (x != y) << (y >= 20);`), explain: '1, 0, 1, 1.' },
    { id: 'l18-q2', kind: 'mcq', prompt: 'How do you write "age is at least 18" in C++?', options: ['`age >= 18`', '`age => 18`', '`age > 18`', '`age = 18`'], answer: 0, explain: '`>=` (the = comes second). `=>` is not an operator.' },
    { id: 'l18-q3', kind: 'bug', prompt: 'This does not compile. Why?', code: prog(cpp`
    int a = 3, b = 4;
    cout << a < b;`), bugLine: 6, options: ['Put the comparison in brackets: `cout << (a < b);`', 'Use `=<` instead of `<`', 'Declare b as bool', 'Remove `cout`'], answer: 0, fixed: prog(cpp`
    int a = 3, b = 4;
    cout << (a < b);`), explain: '`<<` is done before `<`, so C++ tries `(cout << a) < b`. Brackets fix the order.' },
    { id: 'l18-q4', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    char c = 'a';
    cout << (c > 'Z') << (c == 97) << ('5' > 5);`), explain: "'a' (97) > 'Z' (90) → 1; 97 == 97 → 1; '5' is ASCII 53 > 5 → 1." },
    { id: 'l18-q5', kind: 'blanks', prompt: 'Complete so it prints `1` when the temperature is below 0.', code: prog(cpp`
    int temp = -4;
    bool freezing = temp [[1]] 0;
    cout << freezing;`), blanks: [{ answers: ['<'] }], chips: ['<', '>', '==', '='], output: '1', explain: 'Below 0 means less than 0.' },
  ],
  cheatsheet: [
    { code: '== !=', text: 'equal / not equal' },
    { code: '< > <= >=', text: 'order' },
    { code: 'true false', text: 'print as 1 0 (boolalpha shows words)' },
    { code: '=', text: 'stores — never use it to compare' },
  ],
};

// ------------------------------------------------------------------ Level 19: if
const L19: Level = {
  id: 'if-statement',
  kind: 'lesson',
  title: 'if: run code only sometimes',
  tagline: 'An `if` asks a question. If the answer is true, the block runs. If not, it is skipped completely.',
  minutes: 20,
  objectives: ['Write an `if` with a condition and a block', 'Trace which lines run and which are skipped', 'Avoid the stray `;` after `if (...)`'],
  learn: [
    { t: 'syntax', title: 'The if statement', code: 'if (marks >= 50) {\n    cout << "Pass";\n}', parts: [
      { token: 'if', text: 'the keyword' },
      { token: '(marks >= 50)', text: 'the **condition** in round brackets: a yes/no question' },
      { token: '{ … }', text: 'the **block**: runs only when the condition is true' },
    ] },
    { t: 'viz', title: 'True → run it; false → skip it', code: prog(cpp`
    int marks;
    cin >> marks;
    if (marks >= 50) {
        cout << "Pass" << endl;
    }
    cout << "Done" << endl;`), input: '64\n' },
    { t: 'callout', tone: 'tip', title: 'Try the other path', text: 'Change the input to 30 in the dry run: line 8 is skipped and the arrow jumps straight to line 10.' },
    { t: 'callout', tone: 'warn', title: 'The stray semicolon', text: '`if (marks >= 50);` — that `;` IS the whole if-body (an empty statement). The block below it then runs **always**. No semicolon after `if (...)`.' },
    { t: 'compare', items: [
      { title: 'Stray ;', good: false, code: prog(cpp`
    int marks = 30;
    if (marks >= 50);
    {
        cout << "Pass";
    }`), note: 'Prints Pass even for 30!' },
      { title: 'Correct', good: true, code: prog(cpp`
    int marks = 30;
    if (marks >= 50)
    {
        cout << "Pass";
    }`), note: 'Prints nothing for 30.' },
    ] },
    { t: 'callout', tone: 'info', title: 'Braces', text: 'Without `{ }`, only the **one** statement right after the if belongs to it. Use braces always — it prevents a whole family of bugs.' },
  ],
  watch: [
    { title: 'Two independent ifs', code: prog(cpp`
    int n;
    cin >> n;
    if (n > 0) {
        cout << "positive" << endl;
    }
    if (n % 2 == 0) {
        cout << "even" << endl;
    }`), input: '8\n' },
  ],
  think: {
    title: 'Free delivery',
    problem: 'An online shop gives free delivery on orders of Rs. 2000 or more. Read the order amount; if it qualifies, print `Free delivery!`. Always print `Thank you` at the end.',
    steps: [
      { text: 'Read the amount.', lines: [5, 6] },
      { text: 'Ask the yes/no question: *is the amount at least 2000?* → `amount >= 2000`.', lines: [7] },
      { text: 'If yes, print the offer.', lines: [8] },
      { text: 'After the if (for everybody) print Thank you.', lines: [10] },
    ],
    code: prog(cpp`
    int amount;
    cin >> amount;
    if (amount >= 2000) {
        cout << "Free delivery!" << endl;
    }
    cout << "Thank you" << endl;`),
    input: '2500\n',
    yourTurn: {
      id: 'l19-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with an order of 1800. Which lines run?',
      code: prog(cpp`
    int amount;
    cin >> amount;
    if (amount >= 2000) {
        cout << "Free delivery!" << endl;
    }
    cout << "Thank you" << endl;`),
      input: '1800\n',
      hints: ['1800 >= 2000 is false, so the block is skipped.'],
      explain: 'Only `Thank you` is printed.',
    },
  },
  practice: [
    { id: 'l19-q1', kind: 'predict', prompt: 'The user types 5. Predict the output.', code: prog(cpp`
    int n;
    cin >> n;
    if (n > 10) {
        cout << "big ";
    }
    cout << "end";`), input: '5\n', explain: '5 > 10 is false, so only `end` prints.' },
    { id: 'l19-q2', kind: 'paths', prompt: 'This program can print different things. Find an input for **each** path.', code: prog(cpp`
    int n;
    cin >> n;
    if (n < 0) {
        cout << "negative ";
    }
    if (n % 2 == 0) {
        cout << "even";
    }`), paths: [{ label: 'prints `negative`', line: 8 }, { label: 'prints `even`', line: 11 }], start: '3', hints: ['Try a negative number.', 'Try an even number.'], explain: 'The two ifs are independent — an input like -4 even takes both at once.' },
    { id: 'l19-q3', kind: 'bug', prompt: 'It prints `Discount!` even for 300. Find the line.', code: prog(cpp`
    int bill = 300;
    if (bill > 1000);
    {
        cout << "Discount!";
    }`), bugLine: 6, options: ['Remove the `;` after `if (bill > 1000)`', 'Change `>` to `>=`', 'Remove the braces', 'Put 1000 in quotes'], answer: 0, fixed: prog(cpp`
    int bill = 300;
    if (bill > 1000)
    {
        cout << "Discount!";
    }`), explain: 'The `;` ended the if. The block after it is just an ordinary block that always runs.' },
    { id: 'l19-q4', kind: 'blanks', prompt: 'Print `Heat alert` only when the temperature is above 40. Input `44` → `Heat alert`.', code: prog(cpp`
    int t;
    cin >> t;
    [[1]] (t [[2]] 40) {
        cout << "Heat alert";
    }`), blanks: [{ answers: ['if'] }, { answers: ['>'] }], chips: ['if', 'else', '>', '>=', '<'], input: '44\n', explain: '`if (t > 40)`.' },
    { id: 'l19-q5', kind: 'mcq', prompt: 'Without braces, which lines belong to the if?', code: prog(cpp`
    int x = 1;
    if (x > 5)
        cout << "A";
        cout << "B";`), options: ['Only `cout << "A";` — B always prints', 'Both lines', 'None', 'Only `cout << "B";`'], answer: 0, explain: 'Indentation does not matter to C++. Without braces only the next statement belongs to the if. Output: `B`.' },
  ],
  cheatsheet: [{ code: 'if (condition) { … }', text: 'runs the block only when the condition is true' }, { code: 'if (…);', text: 'BUG — the ; is the whole body' }],
};

// ------------------------------------------------------------------ Level 20: if-else
const L20: Level = {
  id: 'if-else',
  kind: 'lesson',
  title: 'if … else: two paths',
  tagline: 'With `else`, exactly one of two blocks runs — never both, never neither.',
  minutes: 20,
  objectives: ['Write if-else for two outcomes', 'Trace which branch runs for a given input', 'Find an input for every path'],
  learn: [
    { t: 'syntax', title: 'if … else', code: 'if (n % 2 == 0) {\n    cout << "Even";\n} else {\n    cout << "Odd";\n}', parts: [
      { token: 'if (…) { }', text: 'runs when the condition is true' },
      { token: 'else { }', text: 'runs when it is false. `else` has NO condition of its own' },
    ] },
    { t: 'viz', title: 'Even or odd', code: prog(cpp`
    int n;
    cout << "Enter a number: ";
    cin >> n;
    if (n % 2 == 0) {
        cout << n << " is Even" << endl;
    } else {
        cout << n << " is Odd" << endl;
    }`), input: '7\n' },
    { t: 'callout', tone: 'key', title: 'Exactly one path', text: 'Two outcomes → if-else. Test your program with one value for **each** path: here one even and one odd number.' },
    { t: 'callout', tone: 'warn', title: 'else never gets a condition', text: '`else (n % 2 != 0)` does not compile. The else already means *everything the if did not catch*.' },
  ],
  ways: {
    goal: 'Print the larger of `a = 15` and `b = 9`: `Larger: 15`.',
    items: [
      { title: 'if-else', code: prog(cpp`
    int a = 15, b = 9;
    if (a > b) {
        cout << "Larger: " << a;
    } else {
        cout << "Larger: " << b;
    }`) },
      { title: 'Store the larger in a variable', code: prog(cpp`
    int a = 15, b = 9;
    int big = b;
    if (a > b) {
        big = a;
    }
    cout << "Larger: " << big;`), note: 'Assume one answer, then correct it with a single if.' },
      { title: 'Ternary (Level 25)', code: prog(cpp`
    int a = 15, b = 9;
    cout << "Larger: " << (a > b ? a : b);`) },
      { title: 'max()', code: prog(cpp`
    int a = 15, b = 9;
    cout << "Larger: " << max(a, b);`) },
    ],
    takeaway: 'Different code, same decision: *is a bigger than b?*',
  },
  watch: [
    { title: 'Voting eligibility', code: prog(cpp`
    int age;
    cin >> age;
    if (age >= 18) {
        cout << "You can vote" << endl;
    } else {
        cout << "Wait " << 18 - age << " more year(s)" << endl;
    }`), input: '15\n' },
  ],
  think: {
    title: 'Pass or fail',
    problem: 'Read marks out of 100. Print `Pass` if the marks are 40 or more, otherwise `Fail`.',
    steps: [
      { text: 'Input: read the marks.', lines: [5, 6] },
      { text: 'Two outcomes → if-else. Question: *are the marks at least 40?* → `marks >= 40`.', lines: [7] },
      { text: 'True → print Pass.', lines: [8] },
      { text: 'Otherwise → print Fail.', lines: [9, 10] },
    ],
    code: prog(cpp`
    int marks;
    cin >> marks;
    if (marks >= 40) {
        cout << "Pass" << endl;
    } else {
        cout << "Fail" << endl;
    }`),
    input: '52\n',
    yourTurn: {
      id: 'l20-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with marks = 39. Write the condition result and the output.',
      code: prog(cpp`
    int marks;
    cin >> marks;
    if (marks >= 40) {
        cout << "Pass" << endl;
    } else {
        cout << "Fail" << endl;
    }`),
      input: '39\n',
      hints: ['39 >= 40?'],
      explain: 'false → the else runs → `Fail`.',
    },
  },
  practice: [
    { id: 'l20-q1', kind: 'paths', prompt: 'Find an input for both paths.', code: prog(cpp`
    int n;
    cin >> n;
    if (n > 100) {
        cout << "large";
    } else {
        cout << "small";
    }`), paths: [{ label: '`large`', line: 8 }, { label: '`small`', line: 10 }], start: '5', explain: 'Any number above 100, and any number up to 100.' },
    { id: 'l20-q2', kind: 'predict', prompt: 'Input: 0. Predict the output.', code: prog(cpp`
    int n;
    cin >> n;
    if (n > 0) {
        cout << "positive";
    } else {
        cout << "not positive";
    }`), input: '0\n', explain: '0 > 0 is false.' },
    { id: 'l20-q3', kind: 'blanks', prompt: 'Print `Leap-day possible` if the day number is 29, else `Normal day`. Input `29`.', code: prog(cpp`
    int d;
    cin >> d;
    if (d [[1]] 29) {
        cout << "Leap-day possible";
    } [[2]] {
        cout << "Normal day";
    }`), blanks: [{ answers: ['=='] }, { answers: ['else'] }], chips: ['==', '=', 'else', 'if'], input: '29\n', explain: '`==` compares; `else` catches the rest.' },
    { id: 'l20-q4', kind: 'bug', prompt: 'It always prints `Correct PIN`, even for a wrong PIN. Find the line.', code: prog(cpp`
    int pin;
    cin >> pin;
    if (pin = 1234) {
        cout << "Correct PIN";
    } else {
        cout << "Wrong PIN";
    }`), input: '1111\n', bugLine: 7, options: ['Use `==` instead of `=`', 'Use `!=` instead of `=`', 'Put 1234 in quotes', 'Remove the else'], answer: 0, fixed: prog(cpp`
    int pin;
    cin >> pin;
    if (pin == 1234) {
        cout << "Correct PIN";
    } else {
        cout << "Wrong PIN";
    }`), explain: '`pin = 1234` STORES 1234 in pin, and 1234 counts as true. The compiler even warns about it.' },
    { id: 'l20-q5', kind: 'trace', mode: 'vars', prompt: 'Largest of two. Dry run with input `6 11`.', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    if (a > b) {
        cout << "Larger number is " << a << endl;
    } else {
        cout << "Larger number is " << b << endl;
    }`), input: '6 11\n', explain: '6 > 11 is false → else → prints 11.' },
    { id: 'l20-q6', kind: 'mcq', tag: 'real life', prompt: 'A mobile package costs 500. Which program prints `Recharge failed` when the balance is too low?', options: ['`if (balance >= 500) { cout << "Done"; } else { cout << "Recharge failed"; }`', '`if (balance >= 500) { cout << "Recharge failed"; } else { cout << "Done"; }`', '`if (balance < 500) cout << "Done"; else cout << "Recharge failed";`', '`else (balance < 500) cout << "Recharge failed";`'], answer: 0, explain: 'Enough balance → Done; otherwise → failed.' },
  ],
  cheatsheet: [{ code: 'if (c) { A } else { B }', text: 'exactly one of A or B runs' }],
};

// ------------------------------------------------------------------ Level 21: else-if ladder
const L21: Level = {
  id: 'else-if',
  kind: 'lesson',
  title: 'else-if ladders: many paths',
  tagline: 'Three or more outcomes? Chain the checks. C++ stops at the first true condition — so the order of the rungs matters.',
  minutes: 25,
  objectives: ['Build an else-if ladder for ranges such as grades', 'Order the conditions so each range is caught correctly', 'Find an input for every rung'],
  learn: [
    { t: 'viz', title: 'A grade ladder', code: prog(cpp`
    int marks;
    cin >> marks;
    if (marks >= 80) {
        cout << "A" << endl;
    } else if (marks >= 70) {
        cout << "B" << endl;
    } else if (marks >= 60) {
        cout << "C" << endl;
    } else {
        cout << "F" << endl;
    }`), input: '72\n' },
    { t: 'callout', tone: 'key', title: 'First true wins', text: 'For 72: `72 >= 80` false → move down; `72 >= 70` true → print B and **skip the rest** of the ladder. The later conditions are never even checked.' },
    { t: 'callout', tone: 'warn', title: 'Order matters', text: 'Put `marks >= 60` first and 95 would get a C: it is true for 95 too, and the ladder stops there. With `>=`, test the **highest** range first.' },
    { t: 'compare', items: [
      { title: 'Wrong order', good: false, code: prog(cpp`
    int marks = 95;
    if (marks >= 60) {
        cout << "C";
    } else if (marks >= 80) {
        cout << "A";
    }`) },
      { title: 'Right order', good: true, code: prog(cpp`
    int marks = 95;
    if (marks >= 80) {
        cout << "A";
    } else if (marks >= 60) {
        cout << "C";
    }`) },
    ] },
  ],
  watch: [
    { title: 'Positive, negative or zero', code: prog(cpp`
    int n;
    cin >> n;
    if (n > 0) {
        cout << "Positive";
    } else if (n < 0) {
        cout << "Negative";
    } else {
        cout << "Zero";
    }`), input: '-6\n' },
  ],
  think: {
    title: 'BMI category',
    problem: 'Read a BMI value. Print `Underweight` below 18.5, `Normal` below 25, `Overweight` below 30, otherwise `Obese`.',
    steps: [
      { text: 'Decimals are possible → read into a `double`.', lines: [5, 6] },
      { text: 'Four outcomes → an else-if ladder with three conditions and an else.', lines: [7, 9, 11, 13] },
      { text: 'Test from the smallest range up, using `<`: below 18.5 first.', lines: [7] },
      { text: 'Reaching the second rung already means BMI ≥ 18.5, so `< 25` is enough.', lines: [9] },
      { text: 'Everything left over is Obese.', lines: [13, 14] },
    ],
    code: prog(cpp`
    double bmi;
    cin >> bmi;
    if (bmi < 18.5) {
        cout << "Underweight" << endl;
    } else if (bmi < 25) {
        cout << "Normal" << endl;
    } else if (bmi < 30) {
        cout << "Overweight" << endl;
    } else {
        cout << "Obese" << endl;
    }`),
    input: '27.3\n',
    why: 'Each rung only runs when every rung above it was false. That is why the lower bound never needs to be written again.',
    yourTurn: {
      id: 'l21-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with BMI = 18.5 exactly. Write each condition result.',
      code: prog(cpp`
    double bmi;
    cin >> bmi;
    if (bmi < 18.5) {
        cout << "Underweight" << endl;
    } else if (bmi < 25) {
        cout << "Normal" << endl;
    } else if (bmi < 30) {
        cout << "Overweight" << endl;
    } else {
        cout << "Obese" << endl;
    }`),
      input: '18.5\n',
      hints: ['18.5 < 18.5 is false — a number is not less than itself.'],
      explain: 'false, then 18.5 < 25 true → `Normal`. The third condition is never checked.',
    },
  },
  practice: [
    { id: 'l21-q1', kind: 'paths', prompt: 'Grade ladder: find an input for every grade.', code: prog(cpp`
    int m;
    cin >> m;
    if (m >= 80) {
        cout << "A";
    } else if (m >= 70) {
        cout << "B";
    } else if (m >= 60) {
        cout << "C";
    } else {
        cout << "F";
    }`), paths: [{ label: '`A`', line: 8 }, { label: '`B`', line: 10 }, { label: '`C`', line: 12 }, { label: '`F`', line: 14 }], start: '65', explain: 'Pick one value from each range: 80+, 70–79, 60–69, below 60.' },
    { id: 'l21-q2', kind: 'predict', prompt: 'Input 100. Predict the output.', code: prog(cpp`
    int m;
    cin >> m;
    if (m >= 50) {
        cout << "Pass";
    } else if (m >= 90) {
        cout << "Distinction";
    } else {
        cout << "Fail";
    }`), input: '100\n', explain: 'The first rung is already true for 100 — Distinction can never be reached. The order is wrong!' },
    { id: 'l21-q3', kind: 'trace', mode: 'vars', prompt: 'Largest of three. Dry run with `3 8 8`.', code: prog(cpp`
    int a, b, c;
    cin >> a >> b >> c;
    if (a >= b && a >= c) {
        cout << "Largest is " << a << endl;
    } else if (b >= c) {
        cout << "Largest is " << b << endl;
    } else {
        cout << "Largest is " << c << endl;
    }`), input: '3 8 8\n', hints: ['3 >= 8 is false, so the whole && is false.', '8 >= 8 is true.'], explain: 'The else-if catches it: `Largest is 8`.' },
    { id: 'l21-q4', kind: 'parsons', prompt: 'Arrange the ladder so 85 → `A`, 72 → `B`, others → `C`. (Input for the check: 72.)', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int m;', '    cin >> m;', '    if (m >= 80) {', '        cout << "A";', '    } else if (m >= 70) {', '        cout << "B";', '    } else {', '        cout << "C";', '    }', '    return 0;', '}'], distractors: ['    } else if (m >= 90) {'], input: '72\n', explain: 'Highest range first.' },
    { id: 'l21-q5', kind: 'blanks', tag: 'real life', prompt: 'Electricity slabs: up to 100 units → Rs 10/unit, up to 300 → Rs 15/unit, above → Rs 20/unit. Input `250` → `3750`.', code: prog(cpp`
    int u;
    cin >> u;
    if (u <= 100) {
        cout << u * 10;
    } [[1]] (u [[2]] 300) {
        cout << u * 15;
    } else {
        cout << u * 20;
    }`), blanks: [{ answers: ['else if'] }, { answers: ['<='] }], chips: ['else if', 'if', 'else', '<=', '>='], input: '250\n', explain: 'The second rung only runs when u > 100 already.' },
  ],
  cheatsheet: [{ code: 'if … else if … else', text: 'first true condition wins; the rest are skipped' }, { code: '>= ranges', text: 'test the highest first' }],
};

// ------------------------------------------------------------------ Level 22: logic
const L22: Level = {
  id: 'logical-operators',
  kind: 'lesson',
  title: 'Combining conditions: && || !',
  tagline: '"AND", "OR" and "NOT" join small questions into one. Learn the truth tables and the short-circuit trick.',
  minutes: 25,
  objectives: ['Translate "and", "or" and "not" into `&&`, `||` and `!`', 'Write range checks like 10 ≤ x ≤ 20 correctly', 'Explain short-circuit evaluation'],
  learn: [
    { t: 'table', head: ['A', 'B', 'A && B', 'A || B'], rows: [
      ['true', 'true', 'true', 'true'],
      ['true', 'false', 'false', 'true'],
      ['false', 'true', 'false', 'true'],
      ['false', 'false', 'false', 'false'],
    ], caption: '`&&` needs BOTH. `||` needs AT LEAST ONE. `!` flips: `!true` is false.' },
    { t: 'callout', tone: 'warn', title: 'Ranges need &&', text: 'Maths writes 10 ≤ x ≤ 20. C++ needs two comparisons: `x >= 10 && x <= 20`. Writing `10 <= x <= 20` compiles but is always true!' },
    { t: 'viz', title: 'Short-circuit: C++ stops as soon as it knows', code: prog(cpp`
    int age = 15;
    bool hasId = true;
    if (age >= 18 && hasId) {
        cout << "Enter" << endl;
    } else {
        cout << "Not allowed" << endl;
    }`) },
    { t: 'callout', tone: 'key', title: 'Short-circuit', text: 'For `&&`: if the left side is false, the answer is false — the right side is **not even checked**. For `||`: if the left side is true, the answer is true. The breakdown in the dry run shows it.' },
    { t: 'table', head: ['English', 'C++'], rows: [
      ['x is between 1 and 10', '`x >= 1 && x <= 10`'],
      ['ch is a vowel', "`ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'`"],
      ['child or senior', '`age <= 12 || age >= 60`'],
      ['not a weekend', '`!(day == 6 || day == 7)`'],
    ] },
  ],
  ways: {
    goal: 'Print `Valid` when n is between 1 and 100 (inclusive). n = 50.',
    items: [
      { title: '&& with two comparisons', code: prog(cpp`
    int n = 50;
    if (n >= 1 && n <= 100) cout << "Valid";`) },
      { title: 'NOT outside', code: prog(cpp`
    int n = 50;
    if (!(n < 1 || n > 100)) cout << "Valid";`), note: 'De Morgan: *not (too small or too big)* = *big enough and small enough*.' },
      { title: 'Nested ifs', code: prog(cpp`
    int n = 50;
    if (n >= 1) {
        if (n <= 100) cout << "Valid";
    }`) },
      { title: 'Strict comparisons', code: prog(cpp`
    int n = 50;
    if (n > 0 && n < 101) cout << "Valid";`), note: 'Same for whole numbers.' },
    ],
    takeaway: 'Four shapes, one condition. The && version is the clearest.',
    check: { id: 'l22-ways-check', kind: 'mcq', prompt: 'Which condition is ALWAYS true (a bug)?', options: ['`1 <= n <= 100`', '`n >= 1 && n <= 100`', '`!(n < 1 || n > 100)`', '`n > 0 && n < 101`'], answer: 0, explain: '`1 <= n` gives 0 or 1, and 0 or 1 is always ≤ 100.' },
  },
  watch: [
    { title: 'Leap year', code: prog(cpp`
    int y;
    cin >> y;
    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
        cout << y << " is a leap year" << endl;
    } else {
        cout << y << " is not a leap year" << endl;
    }`), input: '1900\n' },
    { title: 'Vowel check', code: prog(cpp`
    char ch;
    cin >> ch;
    if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
        cout << "Vowel";
    } else {
        cout << "Consonant";
    }`), input: 'o\n' },
  ],
  think: {
    title: 'Free entry',
    problem: 'A museum is free for children (12 or younger) and seniors (60 or older). Read the age and print `Free` or `Rs. 500`.',
    steps: [
      { text: 'Read the age.', lines: [5, 6] },
      { text: '"child OR senior" → two comparisons joined by `||`.', lines: [7] },
      { text: 'True → Free. Otherwise → the ticket price.', lines: [8, 9, 10] },
    ],
    code: prog(cpp`
    int age;
    cin >> age;
    if (age <= 12 || age >= 60) {
        cout << "Free" << endl;
    } else {
        cout << "Rs. 500" << endl;
    }`),
    input: '65\n',
    yourTurn: {
      id: 'l22-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with age 30.',
      code: prog(cpp`
    int age;
    cin >> age;
    if (age <= 12 || age >= 60) {
        cout << "Free" << endl;
    } else {
        cout << "Rs. 500" << endl;
    }`),
      input: '30\n',
      hints: ['30 <= 12 false, 30 >= 60 false → false || false.'],
      explain: 'Both false → the else → `Rs. 500`.',
    },
  },
  practice: [
    { id: 'l22-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int x = 7;
    cout << (x > 5 && x < 10) << (x < 5 || x > 10) << !(x == 7);`), explain: '1, 0, 0.' },
    { id: 'l22-q2', kind: 'paths', prompt: 'Movie ratings: find an input (rating and age) for every path. Type both values, e.g. `P 12`.', code: prog(cpp`
    char rating;
    int age;
    cin >> rating >> age;
    if (rating == 'A' && age >= 18) {
        cout << "Allowed (adult film)";
    } else if (rating == 'P' || rating == 'U') {
        cout << "Allowed";
    } else {
        cout << "Denied";
    }`), paths: [{ label: 'adult film allowed', line: 9 }, { label: '`Allowed`', line: 11 }, { label: '`Denied`', line: 13 }], start: 'A 16', explain: 'A with 18+; P or U with any age; A under 18 (or any other letter) is denied.' },
    { id: 'l22-q3', kind: 'blanks', prompt: 'Valid triangle: every two sides must add up to more than the third. Input `3 4 5` → `Valid`.', code: prog(cpp`
    int a, b, c;
    cin >> a >> b >> c;
    if (a + b > c [[1]] a + c > b [[2]] b + c > a) {
        cout << "Valid";
    } else {
        cout << "Invalid";
    }`), blanks: [{ answers: ['&&'] }, { answers: ['&&'] }], chips: ['&&', '||', '!'], input: '3 4 5\n', explain: 'ALL three rules must hold → `&&`.' },
    { id: 'l22-q4', kind: 'bug', prompt: 'Scores from 10 to 20 should print `In range`, but 50 also prints it. Find the line.', code: prog(cpp`
    int s = 50;
    if (10 <= s <= 20) {
        cout << "In range";
    }`), bugLine: 6, options: ['Write `s >= 10 && s <= 20`', 'Write `10 <= s || s <= 20`', 'Use `==` instead of `<=`', 'Remove the braces'], answer: 0, fixed: prog(cpp`
    int s = 50;
    if (s >= 10 && s <= 20) {
        cout << "In range";
    }`), explain: '`10 <= 50` is 1, and `1 <= 20` is true. g++ even warns: comparisons like X<=Y<=Z do not have their mathematical meaning.' },
    { id: 'l22-q5', kind: 'trace', mode: 'vars', prompt: 'Divisible by 3 and/or 5. Dry run with 10.', code: prog(cpp`
    int n;
    cin >> n;
    if (n % 3 == 0 && n % 5 == 0) {
        cout << "FizzBuzz";
    } else if (n % 3 == 0) {
        cout << "Fizz";
    } else if (n % 5 == 0) {
        cout << "Buzz";
    } else {
        cout << n;
    }`), input: '10\n', hints: ['10 % 3 is 1, so the first && is already false (short-circuit).'], explain: 'false, false, true → `Buzz`.' },
    { id: 'l22-q6', kind: 'mcq', prompt: 'In `if (x != 0 && 10 / x > 2)`, what happens when x is 0?', options: ['The left side is false, so `10 / x` is never evaluated — no crash', 'The program crashes dividing by zero', 'It prints an error', 'The condition is true'], answer: 0, explain: 'Short-circuit protects the division. Swap the two sides and it would crash.' },
  ],
  cheatsheet: [
    { code: 'a && b', text: 'both true' },
    { code: 'a || b', text: 'at least one true' },
    { code: '!a', text: 'flip' },
    { code: 'x >= lo && x <= hi', text: 'a range' },
  ],
};

// ------------------------------------------------------------------ Level 23: nested
const L23: Level = {
  id: 'nested-if',
  kind: 'lesson',
  title: 'Nested decisions',
  tagline: 'A decision inside a decision: first choose the category, then ask a second question only inside it.',
  minutes: 20,
  objectives: ['Write and trace an if inside an if', 'Decide when to nest and when to use &&'],
  learn: [
    { t: 'p', text: 'Sometimes the second question only makes sense after the first one: *is the account active?* — only then *is there enough money?*' },
    { t: 'viz', title: 'ATM withdrawal', code: prog(cpp`
    int balance = 5000, amount;
    cin >> amount;
    if (amount % 500 == 0) {
        if (amount <= balance) {
            balance -= amount;
            cout << "Take your cash. Balance: " << balance << endl;
        } else {
            cout << "Not enough balance" << endl;
        }
    } else {
        cout << "Amount must be a multiple of 500" << endl;
    }`), input: '2000\n' },
    { t: 'callout', tone: 'key', title: 'Read the braces', text: 'The inner if-else lives entirely inside the outer if-block. The outer else belongs to the outer if. Indentation helps humans see this; braces tell C++.' },
    { t: 'callout', tone: 'tip', title: 'Nest or &&?', text: 'If the inner question has its own else with a different message (like *Not enough balance*), nest. If you only need "both true", `&&` is simpler.' },
  ],
  watch: [
    { title: 'Character classifier', code: prog(cpp`
    char ch;
    cin >> ch;
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
        if (ch >= 'A' && ch <= 'Z') {
            cout << "Uppercase letter";
        } else {
            cout << "Lowercase letter";
        }
    } else if (ch >= '0' && ch <= '9') {
        cout << "Digit";
    } else {
        cout << "Special character";
    }`), input: 'G\n' },
  ],
  practice: [
    { id: 'l23-q1', kind: 'paths', prompt: 'ATM: find an input for every message.', code: prog(cpp`
    int balance = 5000, amount;
    cin >> amount;
    if (amount % 500 == 0) {
        if (amount <= balance) {
            cout << "Take your cash";
        } else {
            cout << "Not enough balance";
        }
    } else {
        cout << "Multiple of 500 only";
    }`), paths: [{ label: '`Take your cash`', line: 9 }, { label: '`Not enough balance`', line: 11 }, { label: '`Multiple of 500 only`', line: 14 }], start: '1000', explain: 'e.g. 1000, 6000 and 750.' },
    { id: 'l23-q2', kind: 'trace', mode: 'vars', prompt: 'Dry run the classifier with `7`.', code: prog(cpp`
    char ch;
    cin >> ch;
    if (ch >= 'A' && ch <= 'Z') {
        cout << "Upper";
    } else if (ch >= 'a' && ch <= 'z') {
        cout << "Lower";
    } else if (ch >= '0' && ch <= '9') {
        cout << "Digit";
    } else {
        cout << "Special";
    }`), input: '7\n', hints: ["'7' is ASCII 55; 'A' is 65, so the first check is false."], explain: '→ `Digit`.' },
    { id: 'l23-q3', kind: 'predict', prompt: 'x = 5, y = -2. Predict the output.', code: prog(cpp`
    int x = 5, y = -2;
    if (x > 0) {
        if (y > 0) {
            cout << "Quadrant 1";
        } else {
            cout << "Quadrant 4";
        }
    } else {
        cout << "Left side";
    }`), explain: 'x > 0 → inside; y > 0 false → `Quadrant 4`.' },
    { id: 'l23-q4', kind: 'mcq', prompt: 'Which condition is equivalent to `if (a > 0) { if (b > 0) { cout << "both"; } }`?', options: ['`if (a > 0 && b > 0) cout << "both";`', '`if (a > 0 || b > 0) cout << "both";`', '`if (!(a > 0)) cout << "both";`', '`if (a > 0) cout << "both"; if (b > 0) cout << "both";`'], answer: 0, explain: 'Both conditions must hold → &&.' },
  ],
  cheatsheet: [{ code: 'if (A) { if (B) {…} else {…} }', text: 'the inner question is asked only when A is true' }],
};

// ------------------------------------------------------------------ Level 24: switch
const L24: Level = {
  id: 'switch',
  kind: 'lesson',
  title: 'switch: many exact choices',
  tagline: 'When one value is compared against a list of exact options, `switch` is cleaner than a long else-if ladder. Just never forget `break`.',
  minutes: 20,
  objectives: ['Write a switch with cases, break and default', 'Predict fall-through when a break is missing', 'Know that switch only works with int and char'],
  learn: [
    { t: 'viz', title: 'A simple calculator', code: prog(cpp`
    double a, b;
    char op;
    cin >> a >> op >> b;
    switch (op) {
        case '+': cout << a + b; break;
        case '-': cout << a - b; break;
        case '*': cout << a * b; break;
        case '/': cout << a / b; break;
        default: cout << "Unknown operator";
    }`), input: '12 * 3\n' },
    { t: 'list', items: [
      '`switch (value)` jumps straight to the `case` with the same value.',
      '`break` leaves the switch. Without it, execution **falls through** into the next case.',
      '`default` runs when no case matches (like the final else).',
      'Cases must be fixed whole numbers or characters: `case 3:`, `case \'y\':` — not ranges, not strings.',
    ] },
    { t: 'viz', title: 'Fall-through: a missing break', code: prog(cpp`
    int day = 3;
    switch (day) {
        case 1: cout << "Mon"; break;
        case 2: cout << "Tue"; break;
        case 3: cout << "Wed";
        case 4: cout << "Thu"; break;
        default: cout << "?";
    }`) },
    { t: 'callout', tone: 'tip', title: 'Fall-through on purpose', text: 'Stacking cases lets several values share one action: `case \'a\': case \'e\': case \'i\': case \'o\': case \'u\': cout << "vowel"; break;`' },
  ],
  watch: [
    { title: 'Vowels with stacked cases', code: prog(cpp`
    char ch;
    cin >> ch;
    switch (ch) {
        case 'a':
        case 'e':
        case 'i':
        case 'o':
        case 'u':
            cout << "Vowel";
            break;
        default:
            cout << "Consonant";
    }`), input: 'e\n' },
  ],
  practice: [
    { id: 'l24-q1', kind: 'predict', prompt: 'Predict the output (look for missing breaks).', code: prog(cpp`
    int n = 2;
    switch (n) {
        case 1: cout << "one ";
        case 2: cout << "two ";
        case 3: cout << "three "; break;
        case 4: cout << "four ";
    }`), explain: 'Jump to case 2, then fall through into case 3 until the break: `two three `.' },
    { id: 'l24-q2', kind: 'paths', prompt: 'Menu: find an input for every choice.', code: prog(cpp`
    int choice;
    cin >> choice;
    switch (choice) {
        case 1:
            cout << "Tea";
            break;
        case 2:
            cout << "Coffee";
            break;
        default:
            cout << "Invalid choice";
    }`), paths: [{ label: '`Tea`', line: 9 }, { label: '`Coffee`', line: 12 }, { label: '`Invalid choice`', line: 15 }], start: '1', explain: '1, 2 and anything else.' },
    { id: 'l24-q3', kind: 'bug', prompt: 'For choice 1 it prints `TeaCoffee`. Find the line where a break is missing.', code: prog(cpp`
    int choice = 1;
    switch (choice) {
        case 1: cout << "Tea";
        case 2: cout << "Coffee"; break;
        default: cout << "Invalid";
    }`), bugLine: 7, options: ['Add `break;` after `cout << "Tea";`', 'Remove the default', 'Change `case 2` to `case 1`', 'Put 1 in quotes'], answer: 0, fixed: prog(cpp`
    int choice = 1;
    switch (choice) {
        case 1: cout << "Tea"; break;
        case 2: cout << "Coffee"; break;
        default: cout << "Invalid";
    }`), explain: 'Without break, case 1 falls through into case 2.' },
    { id: 'l24-q4', kind: 'mcq', prompt: 'Which one does NOT compile?', options: ['`switch (name) { case "Ali": … }` with `string name`', '`switch (grade) { case \'A\': … }` with `char grade`', '`switch (n) { case 1: case 2: … }` with `int n`', '`switch (n % 3) { case 0: … }`'], answer: 0, explain: 'switch only works with whole numbers and characters, not strings.' },
    { id: 'l24-q5', kind: 'blanks', prompt: 'Complete: 1 → `Mon`, 2 → `Tue`, anything else → `?`. Input `2`.', code: prog(cpp`
    int d;
    cin >> d;
    switch (d) {
        [[1]] 1: cout << "Mon"; [[2]];
        case 2: cout << "Tue"; break;
        [[3]]: cout << "?";
    }`), blanks: [{ answers: ['case'] }, { answers: ['break'] }, { answers: ['default'] }], chips: ['case', 'break', 'default', 'else'], input: '2\n', explain: 'case, break, default.' },
  ],
  cheatsheet: [{ code: 'switch (x) { case v: …; break; default: … }', text: 'jump to the matching case' }, { code: 'no break', text: 'falls through into the next case' }],
};

// ------------------------------------------------------------------ Level 25: ternary
const L25: Level = {
  id: 'ternary',
  kind: 'lesson',
  title: 'The ternary operator ?:',
  tagline: 'A tiny if-else that gives back a value: `condition ? valueIfTrue : valueIfFalse`.',
  minutes: 15,
  objectives: ['Read and write `c ? a : b`', 'Use it inside cout and assignments', 'Know when an if-else is clearer'],
  learn: [
    { t: 'syntax', title: 'The conditional operator', code: 'int big = (a > b) ? a : b;', parts: [
      { token: '(a > b)', text: 'the question' },
      { token: '? a', text: 'the value when true' },
      { token: ': b', text: 'the value when false' },
    ] },
    { t: 'viz', title: 'Two ternaries', code: prog(cpp`
    int n = 7;
    string kind = (n % 2 == 0) ? "even" : "odd";
    int absVal = (n < 0) ? -n : n;
    cout << n << " is " << kind << ", |n| = " << absVal << endl;`) },
    { t: 'callout', tone: 'warn', title: 'Keep it short', text: 'A ternary is great for picking one of two values. For actions or long logic, use if-else — nested ternaries are hard to read.' },
  ],
  practice: [
    { id: 'l25-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    int a = 4, b = 9;
    cout << (a > b ? a : b) << " " << (a % 2 == 0 ? "even" : "odd");`), explain: '9 even.' },
    { id: 'l25-q2', kind: 'blanks', prompt: 'Print `Pass` or `Fail` with one ternary. Input `45` → `Pass`.', code: prog(cpp`
    int m;
    cin >> m;
    cout << (m >= 40 [[1]] "Pass" [[2]] "Fail");`), blanks: [{ answers: ['?'] }, { answers: [':'] }], chips: ['?', ':', ';', '||'], input: '45\n', explain: 'condition ? true-value : false-value.' },
    { id: 'l25-q3', kind: 'mcq', prompt: 'Which if-else is the same as `x = (n > 0) ? 1 : -1;`?', options: ['`if (n > 0) x = 1; else x = -1;`', '`if (n > 0) x = -1; else x = 1;`', '`if (n < 0) x = 1; else x = -1;`', '`x = 1; if (n > 0) x = -1;`'], answer: 0, explain: 'True → the value before the colon.' },
    { id: 'l25-q4', kind: 'trace', mode: 'vars', prompt: 'Dry run.', code: prog(cpp`
    int t = 38;
    string s = t > 35 ? "hot" : "fine";
    int fee = t > 35 ? 200 : 100;
    cout << s << " " << fee;`), explain: 'hot 200.' },
  ],
  cheatsheet: [{ code: 'c ? a : b', text: 'a if c is true, otherwise b' }],
};

// ------------------------------------------------------------------ Checkpoint 5 + capstone
const C5: Level = {
  id: 'checkpoint-decisions',
  kind: 'revision',
  title: 'Decisions (capstone)',
  tagline: '**Checkpoint 5 — the capstone.** Real problems that need everything: input, operators, ladders, logic, nesting and switch. Find every path, trace every table. Score 70% to finish the course so far.',
  minutes: 35,
  objectives: [],
  practice: [
    { id: 'c5-q1', kind: 'paths', tag: 'real life', prompt: 'Ticket pricing: base 500. Student AND weekday → 40% off; student OR weekday → 20% off; else full price. Type `1 0` style input (1 = yes). Find every path.', code: prog(cpp`
    double base = 500;
    bool student, weekday;
    cin >> student >> weekday;
    if (student && weekday) {
        cout << base * 0.6;
    } else if (student || weekday) {
        cout << base * 0.8;
    } else {
        cout << base;
    }`), paths: [{ label: '40% off (300)', line: 9 }, { label: '20% off (400)', line: 11 }, { label: 'full price (500)', line: 13 }], start: '1 0', explain: '1 1, then 1 0 or 0 1, then 0 0.' },
    { id: 'c5-q2', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'Grace marks: 40+ passes; 33–39 passes with grace (marks become 40) if attendance ≥ 75. Dry run with `36 80`.', code: prog(cpp`
    int marks, att;
    cin >> marks >> att;
    if (marks >= 40) {
        cout << "Pass " << marks;
    } else if (marks >= 33 && att >= 75) {
        marks = 40;
        cout << "Pass (grace) " << marks;
    } else {
        cout << "Fail";
    }`), input: '36 80\n', hints: ['36 >= 40 is false.', '36 >= 33 true and 80 >= 75 true.'], explain: 'Second rung: marks becomes 40 → `Pass (grace) 40`.' },
    { id: 'c5-q3', kind: 'blanks', prompt: 'Leap year: divisible by 4 but not by 100, or divisible by 400. Input `2000` → `Leap`.', code: prog(cpp`
    int y;
    cin >> y;
    if ((y % 4 == 0 [[1]] y % 100 != 0) [[2]] y % 400 == 0) {
        cout << "Leap";
    } else {
        cout << "Not leap";
    }`), blanks: [{ answers: ['&&'] }, { answers: ['||'] }], chips: ['&&', '||', '!'], input: '2000\n', explain: '(4 AND not 100) OR 400.' },
    { id: 'c5-q4', kind: 'predict', prompt: 'Predict the output for input `7`.', code: prog(cpp`
    int n;
    cin >> n;
    if (n > 5)
        cout << "A";
    if (n > 6)
        cout << "B";
    else
        cout << "C";
    switch (n % 3) {
        case 0: cout << "X";
        case 1: cout << "Y";
        case 2: cout << "Z"; break;
    }`), input: '7\n', hints: ['The two ifs are separate.', '7 % 3 = 1 → case 1, then fall through.'], explain: 'A, B, then case 1 falls into case 2: `ABYZ`.' },
    { id: 'c5-q5', kind: 'bug', prompt: 'A shipping program: weight up to 1 kg costs 200, up to 5 kg 500, more costs 1000. A 3 kg parcel is charged 200. Find the line.', code: prog(cpp`
    double kg = 3;
    int cost;
    if (kg <= 5) {
        cost = 200;
    } else if (kg <= 1) {
        cost = 500;
    } else {
        cost = 1000;
    }
    cout << cost;`), bugLine: 7, options: ['Line 7 should check `kg <= 1` (smallest range first) and swap the costs', 'Change `double` to `int`', 'Remove the else', 'Use `>=` everywhere without changing the order'], answer: 0, fixed: prog(cpp`
    double kg = 3;
    int cost;
    if (kg <= 1) {
        cost = 200;
    } else if (kg <= 5) {
        cost = 500;
    } else {
        cost = 1000;
    }
    cout << cost;`), explain: 'With `<=` ranges, test the smallest first. As written, `kg <= 5` catches 3 kg with the wrong price.' },
    { id: 'c5-q6', kind: 'parsons', prompt: 'Build a traffic fine program: over 80 km/h → Rs 2000 fine; no helmet → Rs 500 more (both can apply). Input `90 0` → `2500`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int speed, helmet;', '    cin >> speed >> helmet;', '    int fine = 0;', '    if (speed > 80) {', '        fine += 2000;', '    }', '    if (helmet == 0) {', '        fine += 500;', '    }', '    cout << fine;', '    return 0;', '}'], distractors: ['    } else if (helmet == 0) {'], input: '90 0\n', explain: 'Two independent ifs, because both fines can apply together — an else-if would stop after the first.' },
    { id: 'c5-q7', kind: 'mcq', tag: 'real life', prompt: 'A login needs the right username AND the right PIN; after 3 wrong tries the card is blocked. Which condition allows login?', options: ['`user == "ali" && pin == 4321 && tries < 3`', '`user == "ali" || pin == 4321`', '`!(user == "ali") && pin == 4321`', '`user = "ali" && pin = 4321`'], answer: 0, explain: 'All three must be true.' },
  ],
  exam: {
    title: 'Exam Challenge: Decisions',
    intro: '**State the output of the following code. If there is an error, write it explicitly** (which line, and why). No compiler, no dry-run button — trace it on paper first, exactly like the PF sessional. Watch for `=` inside an `if`, a stray `;`, the `else` that belongs to the nearest `if`, short-circuit `&&` / `||`, and `switch` fall-through.',
    questions: [
      { id: 'checkpoint-decisions-x1', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int x = 3, y = 4;
    if (y = 0)
        cout << "P";
    else if (y || (x = 7))
        cout << "Q"; cout << "R";
    if (x > 5); else cout << "S";
    if (x < 5 && y < x || y == 0) cout << "T";
    if (x < 0);
    {
        cout << "U";
    }`), hints: ['`y = 0` stores 0 in y, and the value of the whole assignment is 0 (false).', 'Without braces an `if` owns only ONE statement. A `;` right after `if (...)` is an empty body.'], explain: 'Line 6: `y = 0` is an **assignment**: y becomes 0 and the condition is 0 → false, so `P` is skipped.\nLine 8: `y || (x = 7)`: y is 0, so `||` must look at the right side: x becomes 7 (non-zero → true). `Q` is printed.\nLine 9: `cout << "R";` is NOT part of the else-if (no braces), so `R` is always printed.\nLine 10: `x > 5` (7 > 5) is true → the empty statement `;` runs; the `else` is skipped, no `S`.\nLine 11: `&&` is done before `||`: `(x < 5 && y < x)` is false, `y == 0` is true → `T`.\nLine 12: `if (x < 0);` has an empty body. The block `{ cout << "U"; }` is a normal block that always runs → `U`.\nOutput: **`QRTU`**' },
      { id: 'checkpoint-decisions-x2', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it. (Look carefully at the indentation — the compiler does not.)', code: prog(cpp`
    int a = 17 / 4 + 17 % 4;
    int b = a * 3 / 2;
    if (a < b && b % a != 0)
        if (b - a > 1)
            cout << a + b;
            cout << b - a;
    else
        cout << a * b;`), hints: ['Without braces, the inner `if` owns only line 9.', 'Line 10 is a new statement. Can an `else` follow it?'], explain: '**Compile error on line 11: `else` without a previous `if`.**\nThe indentation lies. Without braces the inner `if (b - a > 1)` owns only line 9, and the outer `if` owns only that inner if. So the if-statement ends after line 9. Line 10 `cout << b - a;` is a separate statement. Now the `else` on line 11 comes after a plain `cout` statement — there is no `if` directly before it to attach to, so g++ stops.\n(The values do not matter: a = 4 + 1 = 5, b = 15 / 2 = 7.)\nFix: put braces around the body of the outer if: `if (a < b && b % a != 0) { if (b - a > 1) cout << a + b; cout << b - a; } else cout << a * b;`' },
      { id: 'checkpoint-decisions-x3', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int x = 6, y = 9, z = 2, u = 3;
    if ((y -= 4) < (x += 1) && (z += 2) <= y - 1) {
        if (x > y || (u += 5) <= y)
            cout << x + y * z - z % u << endl;
        cout << z / u << endl;
    }
    cout << x << y << endl << z << u << endl;`), hints: ['The assignments inside the condition really change the variables.', 'Once the left side of `||` is true, the right side (`u += 5`) is NOT done.'], explain: 'Line 6: `y -= 4` → y = 5, `x += 1` → x = 7. `5 < 7` is true, so `&&` checks the right side: `z += 2` → z = 4, and `4 <= 5 - 1` (4 <= 4) is true. We enter the block.\nLine 7: `x > y` (7 > 5) is true → **short-circuit**: `u += 5` never runs, u stays 3.\nLine 8: `x + y * z - z % u` = 7 + 5 × 4 − 4 % 3 = 7 + 20 − 1 = **26**.\nLine 9: `z / u` = 4 / 3 = **1** (integer division).\nLine 11: prints x and y with no space (`75`), a newline, then z and u (`43`).\nOutput:\n`26`\n`1`\n`75`\n`43`' },
      { id: 'checkpoint-decisions-x4', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    double price = 250;
    int qty = 3;
    double total = price * qty;
    if (total > 500)
        total -= 50;
    cout << total << " " << total % 100;`), hints: ['What type is `total`?', 'Which operator only works with whole numbers?'], explain: '**Compile error on line 10: invalid operands of types `double` and `int` to `operator%`.**\nThe `%` (remainder) operator works only with whole-number types (`int`, `char`, `long long` …). `total` is a `double`, so `total % 100` does not compile — even though its value (700) happens to be whole. Nothing is printed, because the program never compiles.\nFix: cast it first, `static_cast<int>(total) % 100` (gives 0), or use `fmod(total, 100)` from `<cmath>`.' },
      { id: 'checkpoint-decisions-x5', kind: 'predict', tag: 'exam', prompt: 'A teacher wrote this grade program. State the output. If there is an error, write it.', code: prog(cpp`
    int marks = 75;
    if (marks >= 50) cout << "D ";
        if (marks >= 60) cout << "C ";
            if (marks >= 70) cout << "B ";
                if (marks >= 80) cout << "A ";
                    if (marks >= 90) cout << "A+ ";
    else cout << "Failed";`), hints: ['Each `if (...) cout << ...;` is complete on its own line — the ifs are NOT nested.', 'An `else` belongs to the nearest `if` above it that has no else yet.'], explain: 'It compiles. The indentation suggests nesting, but each line `if (...) cout << ...;` is a complete, separate if-statement. So there are five independent ifs.\nThe `else` on line 11 belongs to the **nearest** if: `if (marks >= 90)` (dangling else).\nmarks = 75: `>= 50` → `D `, `>= 60` → `C `, `>= 70` → `B `, `>= 80` false, `>= 90` false → its else runs → `Failed`.\nOutput: **`D C B Failed`**' },
      { id: 'checkpoint-decisions-x6', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    char grade = 'B' + 1;
    int bonus = 0;
    switch (grade - 'A') {
        case 1: bonus += 10;
        case 2: bonus += 20;
        case 3: bonus += 30; break;
        default: bonus += 100;
        case 4: bonus += 40;
    }
    cout << grade << " " << bonus << endl;
    switch (bonus % 4) {
        default: cout << "D";
        case 1: cout << "X";
        case 3: cout << "Y"; break;
        case 0: cout << "Z";
    }`), hints: ["`'B' + 1` is the next letter. `grade - 'A'` is its distance from A.", 'A case without `break` falls into the next case. `default` can stand anywhere — it is only chosen when no case matches.'], explain: "Line 5: `'B' + 1` = 66 + 1 = 67 = `'C'`.\nLine 7: `grade - 'A'` = 67 − 65 = 2 → jump to `case 2`: bonus = 20, no break → fall into `case 3`: bonus = 50, `break`.\nLine 14 prints `C 50`.\nLine 15: `50 % 4` = 2. There is no `case 2`, so the jump goes to `default` (even though it is written first): `D`, no break → `case 1`: `X` → `case 3`: `Y`, `break`. `case 0` is never reached.\nOutput:\n`C 50`\n`DXY`" },
      { id: 'checkpoint-decisions-x7', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it.', code: prog(cpp`
    int a = 78, b = 91;
    double avg = (a + b) / 2;
    cout << avg << endl;
    switch (avg) {
        case 84: cout << "B+"; break;
        case 85: cout << "A-"; break;
        default: cout << "?";
    }`), hints: ['What type does `switch` need?', 'Is it enough that the VALUE of avg is a whole number?'], explain: '**Compile error on line 8: switch quantity not an integer.**\nA `switch` works only with whole-number types (`int`, `char`, `long long`, `bool` …). `avg` is declared `double`, so `switch (avg)` does not compile — the type matters, not the value. (Line 6 would have stored 84, because `169 / 2` is integer division, but the program never runs.)\nFix: `switch (static_cast<int>(avg))` or make avg an `int`.' },
      { id: 'checkpoint-decisions-x8', kind: 'count', tag: 'exam', unit: 'stars', count: { text: '*' }, prompt: '`cout << "*"` can be used as a condition: it prints first, and then counts as **true**. How many `*` does this program print?', code: prog(cpp`
    int n = 0;
    if (cout << "*") n++;
    if (n > 0 || cout << "*") n++;
    if (n > 5 && cout << "*") n++;
    if (n == 2 && cout << "*") n++;
    cout << endl << n;`), hints: ['`||` stops as soon as the left side is true; `&&` stops as soon as the left side is false.', 'A `cout` that is skipped by short-circuit prints nothing.'], explain: 'Line 6: the `cout` runs → `*` (1), the condition is true, n = 1.\nLine 7: `n > 0` is true, so `||` skips the right side — no star. n = 2.\nLine 8: `n > 5` is false, so `&&` skips the right side — no star.\nLine 9: `n == 2` is true, so `&&` must check the right side: the `cout` runs → `*` (2), true, n = 3.\nOutput `**`, then a new line and `3`. **2 stars.**' },
      { id: 'checkpoint-decisions-x9', kind: 'count', tag: 'exam', count: { text: '#' }, unit: 'hashes', prompt: 'Short-circuit and `++`/`--` together. How many `#` characters does this program print?', code: prog(cpp`
    int x = 2;
    if (x++ >= 2 && ++x < 5) cout << "#";
    if (x-- == 4 || x++ == 3) cout << "##";
    if (--x == 2 && x-- == 3) cout << "#";
    else cout << "###";
    switch (x) {
        case 1: cout << "#";
        case 2: cout << "##"; break;
        case 3: cout << "#";
    }
    cout << endl << x;`), hints: ['`x++` compares the OLD value, `++x` the NEW value.', 'Keep a small box for x and update it after every `++`/`--` that really runs.'], explain: 'Line 6: `x++ >= 2` → 2 >= 2 true, x = 3; `++x < 5` → x = 4, 4 < 5 true → `#` (1).\nLine 7: `x-- == 4` → 4 == 4 true, x = 3; `||` skips `x++` → `##` (3).\nLine 8: `--x == 2` → x = 2, true; `x-- == 3` → 2 == 3 false, x = 1. The whole `&&` is false → else, line 9: `###` (6).\nLine 10: x = 1 → `case 1`: `#` (7), no break → `case 2`: `##` (9), break.\nThen x = 1 is printed on a new line. **9 hashes.**' },
      { id: 'checkpoint-decisions-x10', kind: 'blanks', tag: 'exam', prompt: '**Complete the program.** Cinema tickets: children under 12 pay Rs 300, people aged 60 or more pay Rs 400, everyone else Rs 600. On Saturday (`S`) or Sunday (`U`) add Rs 100; on Monday (`M`) take Rs 50 off. Any ticket above Rs 500 then gets Rs 50 discount. Input `65 S` must print `Rs 500`.', code: prog(cpp`
    int age;
    char day;
    cin >> age >> day;
    int price;
    if (age [[1]] 12)
        price = 300;
    else if (age >= 60)
        price = 400;
    else
        price = 600;
    switch ([[2]]) {
        case 'S':
        case 'U': price += 100; [[3]];
        case 'M': price -= 50; break;
    }
    cout << "Rs " << (price > 500 [[4]] price - 50 : price);`), input: '65 S\n', output: 'Rs 500', blanks: [{ answers: ['<'] }, { answers: ['day'] }, { answers: ['break'], hint: 'Without it, a weekend ticket also gets the Monday discount.' }, { answers: ['?'] }], chips: ['<', '<=', '>', 'day', 'age', 'break', 'continue', '?', ':'], hints: ['Two cases can share one body: `case \'S\': case \'U\': …`.', 'The last line uses the ternary operator `condition ? a : b`.'], explain: '`age < 12` (under 12 means 11 or less). `switch (day)` picks the day letter. `case \'S\':` is empty and falls into `case \'U\':`, which adds 100 and must `break` — otherwise it falls into `case \'M\'` and wrongly takes 50 off. The last line is `price > 500 ? price - 50 : price`.\nFor `65 S`: 65 ≥ 60 → 400; Saturday → 500; 500 > 500 is false → **Rs 500**.' },
    ],
  },
};

export const unit5: Unit = {
  id: 'u5',
  num: 5,
  title: 'Decisions: if / else',
  summary: 'Make the program choose — and find every path it can take.',
  levels: [L18, L19, L20, L21, L22, L23, L24, L25, C5],
};
