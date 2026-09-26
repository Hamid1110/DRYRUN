import type { Level, Unit } from '../types';
import { cpp, prog } from '../helpers';

// ------------------------------------------------------------------ Level 6: variables
const L6: Level = {
  id: 'variables',
  kind: 'lesson',
  title: 'Variables: boxes in memory',
  tagline: 'A variable is a named box in memory that holds one value. Create it, fill it, read it — and watch the box in the memory panel.',
  minutes: 20,
  objectives: [
    'Declare a variable with a type and a name',
    'Give it a value with `=` and print the value (not the name)',
    'Explain what "garbage" means for a variable with no value',
  ],
  learn: [
    { t: 'p', text: 'So far every value was typed straight into `cout`. Real programs need to **remember** values: a price, a score, a name. A **variable** is a labelled box in the computer\'s memory that holds one value.' },
    {
      t: 'syntax',
      title: 'Declaring a variable',
      code: 'int age = 20;',
      parts: [
        { token: 'int', text: 'the **type**: what kind of value the box can hold (here: whole numbers)' },
        { token: 'age', text: 'the **name** of the box — you choose it' },
        { token: '= 20', text: 'the starting value (optional). `=` means **store**, not "is equal"' },
        { token: ';', text: 'ends the statement' },
      ],
    },
    {
      t: 'viz',
      title: 'Watch the boxes appear in memory',
      code: prog(cpp`
    int age = 20;
    int year;
    year = 2026;
    cout << "Age: " << age << endl;
    cout << "Year: " << year << endl;`),
    },
    { t: 'callout', tone: 'key', title: 'Name vs value', text: '`cout << age;` prints the **value inside** the box (20). `cout << "age";` prints the **word** age. Quotes make all the difference.' },
    { t: 'h', text: 'A box without a value holds garbage' },
    { t: 'p', text: 'If you declare `int x;` without a value, the box contains whatever bits were left in that part of memory — **garbage**. Printing it gives an unpredictable number. Always give a variable a value before you read it.' },
    { t: 'code', code: prog(cpp`
    int x;
    int y = 0;
    cout << y << endl;`), caption: '`x` holds garbage (shown as `?` in the memory panel). `y` is safe: it starts at 0.' },
    { t: 'h', text: 'Naming rules' },
    {
      t: 'table',
      head: ['Rule', 'OK', 'Not allowed'],
      rows: [
        ['Letters, digits and `_` only', '`total_marks`', '`total-marks`, `my marks`'],
        ['Must not start with a digit', '`marks2`', '`2marks`'],
        ['Not a C++ keyword', '`count`', '`int`, `return`, `if`'],
        ['Case-sensitive', '`Age` and `age` are different', '—'],
      ],
    },
    { t: 'callout', tone: 'tip', title: 'Good names', text: 'Use names that say what the box holds: `price`, `studentCount`, `totalMarks` — not `a`, `x1`, `temp2`.' },
  ],
  ways: {
    goal: 'Store the number 15 in a variable called `n` and print `n = 15`.',
    items: [
      { title: 'Declare with a value', code: prog(cpp`
    int n = 15;
    cout << "n = " << n;`) },
      { title: 'Declare first, assign later', code: prog(cpp`
    int n;
    n = 15;
    cout << "n = " << n;`) },
      { title: 'Brace initialisation', code: prog(cpp`
    int n{15};
    cout << "n = " << n;`), note: 'Modern C++ style. It also refuses to squeeze a decimal into an int.' },
      { title: 'Calculated value', code: prog(cpp`
    int n = 10 + 5;
    cout << "n = " << n;`), note: 'The right side is worked out first, then stored.' },
      { title: 'Copied from another variable', code: prog(cpp`
    int m = 15;
    int n = m;
    cout << "n = " << n;`), note: 'The VALUE of m is copied. m and n are still two separate boxes.' },
      { title: 'Two variables in one line', code: prog(cpp`
    int n = 15, m = 4;
    cout << "n = " << n;`) },
    ],
    takeaway: 'However you create it, the box ends up holding 15. The memory panel in each dry run shows the moment it gets its value.',
    check: {
      id: 'l6-ways-check',
      kind: 'mcq',
      prompt: 'Which program prints `n = 15`?',
      options: ['`int n = 15; cout << "n = " << n;`', '`int n = 15; cout << "n = " << "n";`', '`int n; cout << "n = " << n; n = 15;`', '`n = 15; int n; cout << "n = " << n;`'],
      answer: 0,
      explain: 'B prints the letter n. C prints before storing 15 (garbage). D uses n before it is declared — a compile error.',
    },
  },
  watch: [
    { title: 'Declare, assign, print', code: prog(cpp`
    int apples = 5;
    int oranges;
    oranges = 3;
    int fruit = apples + oranges;
    cout << "Fruit: " << fruit << endl;`) },
    { title: 'Reading a box before it has a value', intro: 'Look at the warning when `total` is printed.', code: prog(cpp`
    int total;
    cout << "Total: " << total << endl;
    total = 50;
    cout << "Total: " << total << endl;`) },
  ],
  think: {
    title: 'Pocket money',
    problem: 'Ali gets Rs. 300 from his father and Rs. 200 from his mother. Store both amounts in variables, add them into a third variable `total`, and print `Total: 500`.',
    steps: [
      { text: 'Make a box `fromFather` holding 300.', lines: [5] },
      { text: 'Make a box `fromMother` holding 200.', lines: [6] },
      { text: 'Make a box `total` holding the sum of the two boxes.', lines: [7] },
      { text: 'Print the label and the value of `total`.', lines: [8] },
    ],
    code: prog(cpp`
    int fromFather = 300;
    int fromMother = 200;
    int total = fromFather + fromMother;
    cout << "Total: " << total << endl;`),
    why: 'Each piece of information gets its own box with a clear name. Then the calculation reads almost like English.',
    yourTurn: {
      id: 'l6-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run this version. For each step, write the value that goes into the box, and what is printed.',
      code: prog(cpp`
    int a = 150;
    int b = 75;
    int total = a + b;
    cout << "Total: " << total << endl;`),
      given: [0],
      hints: ['Line 7: add the two values that are already in the boxes.', 'The output is the label, the value and a newline (`\\n`).'],
      explain: '150 + 75 = 225 goes into `total`, then `Total: 225` is printed.',
    },
  },
  practice: [
    { id: 'l6-q1', kind: 'predict', prompt: 'What does this print?', code: prog(cpp`
    int marks = 88;
    cout << "marks" << endl;
    cout << marks << endl;`), explain: 'With quotes: the word `marks`. Without quotes: the value 88.' },
    { id: 'l6-q2', kind: 'mcq', prompt: 'Which is a valid variable name?', options: ['`student_count`', '`2ndPlace`', '`total marks`', '`int`'], answer: 0, explain: 'Names use letters, digits and `_`, cannot start with a digit, cannot contain spaces and cannot be keywords.' },
    { id: 'l6-q3', kind: 'blanks', prompt: 'Complete the code so it prints `Price: 250`.', code: prog(cpp`
    [[1]] price = 250;
    cout << "Price: " << [[2]];`), blanks: [{ answers: ['int'] }, { answers: ['price'] }], chips: ['int', 'price', '"price"', '='], output: 'Price: 250', explain: 'The type `int`, then later the name without quotes to print its value.' },
    { id: 'l6-q4', kind: 'bug', prompt: 'This program does not compile. Find the mistake.', code: prog(cpp`
    cout << score << endl;
    int score = 90;`), bugLine: 5, options: ['`score` is used before it is declared — swap the two lines', '`score` must be in quotes', '90 is too big for an int', '`endl` is not allowed after a variable'], answer: 0, fixed: prog(cpp`
    int score = 90;
    cout << score << endl;`), hints: ['C++ reads top to bottom. On line 5, does `score` exist yet?'], explain: 'A variable exists only from the line where it is declared. Line 5 uses it too early: `\'score\' was not declared in this scope`.' },
    { id: 'l6-q5', kind: 'trace', mode: 'vars', prompt: 'Dry run: write the value stored at each step and the output.', code: prog(cpp`
    int x = 4;
    int y = x + 3;
    x = 10;
    cout << x << " " << y;`), hints: ['On line 6, y gets x + 3 using the value of x at THAT moment.', 'Changing x later does not change y.'], explain: 'y was calculated when x was 4, so y stays 7 even after x becomes 10.' },
    { id: 'l6-q6', kind: 'mcq', tag: 'tricky', prompt: 'What is printed?', code: prog(cpp`
    int a = 5;
    int b = a;
    a = 9;
    cout << b;`), options: ['5', '9', '14', 'garbage'], answer: 0, explain: '`b = a` copies the value 5. After that, a and b are separate boxes.' },
    { id: 'l6-q7', kind: 'bug', prompt: 'The program should print `Name: Sara` but it does not compile.', code: prog(cpp`
    string name = "Sara";
    string name = "Ali";
    cout << "Name: " << name;`), bugLine: 6, options: ['Delete line 6 (the second declaration)', 'Change line 6 to `string name2 = "Sara";`', 'Put `name` in quotes on line 7', 'Use single quotes around Sara'], answer: 0, fixed: prog(cpp`
    string name = "Sara";
    cout << "Name: " << name;`), explain: 'You cannot create two boxes with the same name in the same block: `redeclaration of \'std::string name\'`.' },
    { id: 'l6-q8', kind: 'parsons', prompt: 'Arrange the lines so the program prints `Area: 24` (length 6, width 4).', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int length = 6;', '    int width = 4;', '    int area = length * width;', '    cout << "Area: " << area;', '    return 0;', '}'], hints: ['A variable must be created before it is used in a calculation.'], explain: 'length and width must exist before area uses them, and area must exist before it is printed.' },
    { id: 'l6-q9', kind: 'mcq', tag: 'real life', prompt: 'A shop program stores a price and a quantity. Which line stores the bill in a variable?', options: ['`int bill = price * quantity;`', '`int bill == price * quantity;`', '`price * quantity = int bill;`', '`int "bill" = price * quantity;`'], answer: 0, explain: '`=` stores the value of the right side in the box on the left. `==` compares; it does not store.' },
  ],
  cheatsheet: [
    { code: 'int x = 5;', text: 'create box x and store 5' },
    { code: 'x = 9;', text: 'replace the value in x' },
    { code: 'cout << x;', text: 'print the value, not the name' },
    { code: 'int y;', text: 'no value → garbage until you assign one' },
  ],
};

// ------------------------------------------------------------------ Level 7: data types
const L7: Level = {
  id: 'data-types',
  kind: 'lesson',
  title: 'Data types and their sizes',
  tagline: 'Whole numbers, decimals, characters, true/false and text each need a different kind of box. Pick the right type and know how big it is.',
  minutes: 25,
  objectives: [
    'Choose between `int`, `double`, `char`, `bool` and `string`',
    'Know the size of each type in bytes and use `sizeof`',
    'Predict what happens when a value is stored in the wrong type',
  ],
  learn: [
    {
      t: 'table',
      head: ['Type', 'Holds', 'Example', 'Size'],
      rows: [
        ['`int`', 'whole numbers', '`int age = 19;`', '4 bytes (about ±2.1 billion)'],
        ['`double`', 'decimal numbers', '`double price = 99.5;`', '8 bytes'],
        ['`float`', 'decimals, less precise', '`float t = 36.6f;`', '4 bytes'],
        ['`char`', 'ONE character', "`char grade = 'A';`", '1 byte'],
        ['`bool`', 'true or false', '`bool passed = true;`', '1 byte'],
        ['`string`', 'text', '`string name = "Ali";`', 'grows with the text'],
        ['`long long`', 'very big whole numbers', '`long long pop = 240000000;`', '8 bytes'],
      ],
    },
    { t: 'callout', tone: 'tip', title: 'See it yourself', text: 'In any dry run, switch on **Addresses & sizes**: every box shows its address in memory and how many bytes it uses.' },
    {
      t: 'viz',
      title: 'Five types, five boxes',
      code: prog(cpp`
    int age = 19;
    double cgpa = 3.45;
    char grade = 'A';
    bool hostel = false;
    string name = "Hira";
    cout << name << " " << age << " " << cgpa << " " << grade << " " << hostel;`),
    },
    { t: 'h', text: 'The wrong type changes the value' },
    {
      t: 'table',
      head: ['Code', 'Stored', 'Why'],
      rows: [
        ['`int n = 3.99;`', '3', 'an int cannot hold decimals — the part after the point is **cut off** (not rounded)'],
        ['`double d = 7;`', '7.0', 'a whole number fits happily in a double'],
        ["`char c = 66;`", "'B'", 'a char stores a number: the **ASCII code**. 66 is B'],
        ["`int code = 'a';`", '97', "the ASCII code of 'a'"],
        ['`bool b = 5;`', 'true', 'any non-zero value becomes true'],
      ],
    },
    { t: 'callout', tone: 'warn', title: 'char vs string', text: "`'A'` (single quotes) is one `char`. `\"A\"` (double quotes) is a string. `char c = \"A\";` does not compile." },
    { t: 'h', text: 'sizeof' },
    { t: 'code', code: prog(cpp`
    cout << sizeof(int) << " " << sizeof(double) << " " << sizeof(char) << " " << sizeof(bool);`), caption: '`sizeof` tells you how many bytes a type (or a variable) uses.' },
    { t: 'callout', tone: 'info', title: 'Overflow', text: 'An `int` can hold at most 2147483647. Go one higher and the value **wraps around** to a huge negative number. Use `long long` for bigger numbers.' },
  ],
  ways: {
    goal: 'Print the letter `B` — using different types.',
    items: [
      { title: 'A char', code: prog(cpp`
    char c = 'B';
    cout << c;`) },
      { title: 'A string', code: prog(cpp`
    string s = "B";
    cout << s;`) },
      { title: 'A char from its ASCII code', code: prog(cpp`
    char c = 66;
    cout << c;`), note: '66 is the ASCII code of B.' },
      { title: 'char arithmetic', code: prog(cpp`
    char c = 'A' + 1;
    cout << c;`), note: "'A' is 65, plus 1 is 66, stored in a char → B." },
      { title: 'A cast', code: prog(cpp`
    int code = 66;
    cout << (char)code;`), note: '`(char)` tells C++ to treat the number as a character.' },
    ],
    takeaway: 'A `char` is really a small number. What you see depends on the TYPE: as a char, 66 prints as B; as an int, it prints as 66.',
    check: {
      id: 'l7-ways-check',
      kind: 'mcq',
      prompt: "What does `cout << 'A' + 1;` print?",
      options: ['66', 'B', 'A1', "'B'"],
      answer: 0,
      explain: "`'A' + 1` is worked out as a number (65 + 1 = 66), and the result is an int, so cout prints 66. Store it in a char to see B.",
    },
  },
  watch: [
    { title: 'Storing values in the "wrong" type', code: prog(cpp`
    int n = 3.99;
    double d = 7;
    char c = 66;
    int code = 'a';
    bool b = 5;
    cout << n << " " << d << " " << c << " " << code << " " << b;`) },
    { title: 'Overflow: the int odometer', code: prog(cpp`
    int big = 2147483647;
    cout << big << endl;
    big = big + 1;
    cout << big << endl;
    long long safe = 2147483647;
    safe = safe + 1;
    cout << safe << endl;`) },
  ],
  think: {
    title: 'A student record',
    problem: 'Store a student record and print it: name **Usman**, roll number **42**, CGPA **3.7**, section **B**, and whether he lives in the hostel (**yes**). Choose the right type for each.',
    steps: [
      { text: 'The name is text → `string`.', lines: [5] },
      { text: 'The roll number is a whole number → `int`.', lines: [6] },
      { text: 'The CGPA has a decimal point → `double`.', lines: [7] },
      { text: 'The section is one letter → `char` (single quotes).', lines: [8] },
      { text: 'Hostel is yes/no → `bool`.', lines: [9] },
      { text: 'Print everything with labels.', lines: [10, 11] },
    ],
    code: prog(cpp`
    string name = "Usman";
    int roll = 42;
    double cgpa = 3.7;
    char section = 'B';
    bool hostel = true;
    cout << name << " (" << roll << ") " << section << endl;
    cout << "CGPA " << cgpa << ", hostel " << hostel << endl;`),
    why: 'Ask one question per value: *is it text, a whole number, a decimal, one character, or yes/no?* The answer is the type.',
    yourTurn: {
      id: 'l7-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run: what value is actually stored in each box? Careful with the types!',
      code: prog(cpp`
    int items = 7.8;
    double half = 7 / 2;
    char letter = 67;
    bool ok = 0;
    cout << items << " " << half << " " << letter << " " << ok;`),
      hints: ['An int cuts off the decimal part.', '7 / 2 is worked out with whole numbers BEFORE it is stored in the double.', 'ASCII 67 is C.'],
      explain: 'items = 7 (cut off), half = 3.0 (integer division happened first), letter = \'C\', ok = false. Output: `7 3 C 0`.',
    },
  },
  practice: [
    { id: 'l7-q1', kind: 'mcq', prompt: 'Which type should store a phone battery percentage like 87.5?', options: ['`double`', '`int`', '`char`', '`bool`'], answer: 0, explain: 'It has a decimal part, so `double`.' },
    { id: 'l7-q2', kind: 'predict', prompt: 'What does this print?', code: prog(cpp`
    int a = 9.99;
    double b = 9;
    cout << a << " " << b;`), explain: 'a gets 9 (decimal cut off). b holds 9.0, and cout prints it as 9.' },
    { id: 'l7-q3', kind: 'predict', tag: 'tricky', prompt: 'What does this print?', code: prog(cpp`
    char c = 'a';
    cout << c << " " << c + 1 << " " << (char)(c + 1);`), explain: "`c` prints a. `c + 1` is the number 98. Cast back to char it is b." },
    { id: 'l7-q4', kind: 'bug', prompt: 'This does not compile. What is wrong?', code: prog(cpp`
    int age = "20";
    cout << age;`), bugLine: 5, options: ['Remove the quotes: `int age = 20;`', 'Use single quotes: `\'20\'`', 'Change `int` to `char`', 'Add `endl`'], answer: 0, fixed: prog(cpp`
    int age = 20;
    cout << age;`), explain: '"20" is text. An int box only takes numbers: `invalid conversion from \'const char*\' to \'int\'`.' },
    { id: 'l7-q5', kind: 'blanks', prompt: 'Choose the right types so the program compiles and prints `Zara A 3.9`.', code: prog(cpp`
    [[1]] name = "Zara";
    [[2]] grade = 'A';
    [[3]] gpa = 3.9;
    cout << name << " " << grade << " " << gpa;`), blanks: [{ answers: ['string'] }, { answers: ['char'] }, { answers: ['double', 'float'] }], chips: ['int', 'double', 'char', 'string', 'bool'], output: 'Zara A 3.9', explain: 'Text → string, one letter → char, decimal → double.' },
    { id: 'l7-q6', kind: 'mcq', prompt: 'How many bytes does an `int` use (on Dev-C++, Code::Blocks and Visual Studio)?', options: ['4', '1', '2', '8'], answer: 0, explain: '`sizeof(int)` is 4 bytes = 32 bits.' },
    { id: 'l7-q7', kind: 'trace', mode: 'vars', prompt: 'Dry run the types: write what is stored and printed.', code: prog(cpp`
    double avg = (5 + 6) / 2;
    double avg2 = (5 + 6) / 2.0;
    cout << avg << " " << avg2;`), hints: ['Line 5: 11 / 2 with two whole numbers.', 'Line 6: 11 / 2.0 is decimal division.'], explain: 'The type of the BOX does not change how the right side is calculated: 11 / 2 = 5 first, then stored as 5.0.' },
    { id: 'l7-q8', kind: 'predict', prompt: 'What does this print?', code: prog(cpp`
    bool a = true;
    bool b = 0;
    bool c = -3;
    cout << a << b << c;`), explain: 'true prints 1, 0 is false (0), and any non-zero (even -3) is true (1): `101`.' },
    { id: 'l7-q9', kind: 'mcq', tag: 'real life', prompt: "Pakistan's population is about 240,000,000. The code `int pop = 240000000; pop = pop * 10;` gives a strange negative number. Why?", options: ['2,400,000,000 is bigger than an int can hold, so it overflows', 'int cannot hold zeros', 'You must use double for all numbers', 'Multiplication by 10 is not allowed'], answer: 0, explain: 'An int holds up to about 2.1 billion. Use `long long` for bigger whole numbers.' },
  ],
  cheatsheet: [
    { code: 'int', text: 'whole numbers, 4 bytes' },
    { code: 'double', text: 'decimals, 8 bytes' },
    { code: 'char', text: "one character in 'single quotes', 1 byte" },
    { code: 'bool', text: 'true / false, prints 1 / 0' },
    { code: 'string', text: 'text in "double quotes"' },
    { code: 'sizeof(x)', text: 'bytes used by x' },
  ],
};

// ------------------------------------------------------------------ Level 8: changing values
const L8: Level = {
  id: 'changing-values',
  kind: 'lesson',
  title: 'Changing values and swapping',
  tagline: 'Assignment replaces what is in a box. Learn to update a variable using its own value — and to swap two boxes without losing anything.',
  minutes: 20,
  objectives: [
    'Read `x = x + 1` correctly: take the old value, calculate, store the new one',
    'Trace a variable that changes many times',
    'Swap two variables using a third box',
  ],
  learn: [
    { t: 'p', text: '`=` does **not** mean "is equal to". It means: **work out the right side, then put the result into the box on the left**. The old value is thrown away.' },
    { t: 'callout', tone: 'key', title: 'x = x + 1 is not maths — it is an instruction', text: 'Read it from right to left: *take the value in x, add 1, and put the answer back into x*. If x was 5, it becomes 6.' },
    {
      t: 'viz',
      title: 'One box, many values',
      code: prog(cpp`
    int score = 10;
    score = score + 5;
    score = score * 2;
    score = score - 7;
    cout << "Final score: " << score << endl;`),
    },
    { t: 'h', text: 'Swapping two boxes' },
    { t: 'p', text: 'You have two glasses: one with milk, one with juice. To swap them you need a **third, empty glass**. Variables are the same.' },
    {
      t: 'compare',
      items: [
        { title: 'Wrong: a value is lost', good: false, code: prog(cpp`
    int a = 3, b = 8;
    a = b;
    b = a;
    cout << a << " " << b;`), note: 'After `a = b`, the 3 is gone forever. Both boxes end up 8.' },
        { title: 'Right: use a temp box', good: true, code: prog(cpp`
    int a = 3, b = 8;
    int temp = a;
    a = b;
    b = temp;
    cout << a << " " << b;`) },
      ],
    },
    { t: 'callout', tone: 'tip', title: 'Shortcut', text: 'C++ also has `swap(a, b);` which does exactly the temp trick for you. Learn the temp version first — exams ask for it.' },
  ],
  ways: {
    goal: 'Start with `x = 10` and end with `x` holding 11.',
    items: [
      { title: 'x = x + 1', code: prog(cpp`
    int x = 10;
    x = x + 1;
    cout << x;`) },
      { title: 'x += 1', code: prog(cpp`
    int x = 10;
    x += 1;
    cout << x;`), note: 'Short for x = x + 1 (Unit 4 covers these).' },
      { title: 'x++', code: prog(cpp`
    int x = 10;
    x++;
    cout << x;`), note: 'Adds exactly 1.' },
      { title: 'Overwrite with a new value', code: prog(cpp`
    int x = 10;
    x = 11;
    cout << x;`), note: 'Works, but the program no longer depends on the old value.' },
      { title: 'Through another variable', code: prog(cpp`
    int x = 10;
    int y = x + 1;
    x = y;
    cout << x;`) },
    ],
    takeaway: 'Every version stores 11 in x. The dry run shows the old value being replaced.',
  },
  watch: [
    { title: 'Swap with a temp box', code: prog(cpp`
    int a = 3, b = 8;
    int temp = a;
    a = b;
    b = temp;
    cout << "a = " << a << ", b = " << b << endl;`) },
    { title: 'A running total', code: prog(cpp`
    int total = 0;
    total = total + 120;
    total = total + 80;
    total = total + 50;
    cout << "Total: " << total << endl;`) },
  ],
  think: {
    title: 'Swap two test scores',
    problem: 'The teacher typed the scores of two students the wrong way round: `first = 72`, `second = 95`. Swap them so that `first` holds 95 and `second` holds 72, then print both.',
    steps: [
      { text: 'Create both boxes with their (wrong) values.', lines: [5, 6] },
      { text: 'Save a copy of `first` in a spare box `temp`, so it is not lost.', lines: [7] },
      { text: 'Put the value of `second` into `first`.', lines: [8] },
      { text: 'Put the saved copy from `temp` into `second`.', lines: [9] },
      { text: 'Print both.', lines: [10] },
    ],
    code: prog(cpp`
    int first = 72;
    int second = 95;
    int temp = first;
    first = second;
    second = temp;
    cout << first << " " << second << endl;`),
    why: 'The order matters: save → overwrite → restore. Change the order and a value disappears.',
    yourTurn: {
      id: 'l8-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run the swap with different values. Fill in each box as it changes.',
      code: prog(cpp`
    int first = 40;
    int second = 65;
    int temp = first;
    first = second;
    second = temp;
    cout << first << " " << second;`),
      given: [0, 1],
      hints: ['temp copies the value of first at that moment.', 'After line 8, first and second are equal for a moment — that is why temp is needed.'],
      explain: 'temp = 40, first = 65, second = 40. Output: `65 40`.',
    },
  },
  practice: [
    { id: 'l8-q1', kind: 'predict', prompt: 'What does this print?', code: prog(cpp`
    int n = 4;
    n = n * 3;
    n = n - 2;
    cout << n;`), explain: '4 × 3 = 12, then 12 − 2 = 10.' },
    { id: 'l8-q2', kind: 'trace', mode: 'vars', prompt: 'Dry run: fill in the value of each variable when it changes.', code: prog(cpp`
    int x = 2;
    int y = 5;
    x = x + y;
    y = x - y;
    x = x - y;
    cout << x << " " << y;`), hints: ['Line 7 uses the NEW x from line 6.'], explain: 'x = 7, y = 2, x = 5 → the values were swapped without a temp box (a famous trick).' },
    { id: 'l8-q3', kind: 'mcq', prompt: 'After `int a = 3, b = 8; a = b; b = a;` what are a and b?', options: ['8 and 8', '8 and 3', '3 and 8', '3 and 3'], answer: 0, explain: 'After `a = b`, a is 8 and the 3 is gone. Then `b = a` copies 8 back into b.' },
    { id: 'l8-q4', kind: 'blanks', prompt: 'Complete the swap so it prints `9 4`.', code: prog(cpp`
    int a = 4, b = 9;
    int temp = [[1]];
    a = [[2]];
    b = [[3]];
    cout << a << " " << b;`), blanks: [{ answers: ['a'] }, { answers: ['b'] }, { answers: ['temp'] }], chips: ['a', 'b', 'temp'], output: '9 4', explain: 'Save a in temp, copy b into a, then give b the saved value.' },
    { id: 'l8-q5', kind: 'parsons', prompt: 'Arrange the swap correctly. The program must print `20 10`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int p = 10, q = 20;', '    int temp = p;', '    p = q;', '    q = temp;', '    cout << p << " " << q;', '    return 0;', '}'], distractors: ['    q = p;'], explain: 'Save p first. `q = p` would copy the new p (20) instead of the old one.' },
    { id: 'l8-q6', kind: 'bug', prompt: 'This should print the total of all three prices (450) but prints 200. Find the wrong line.', code: prog(cpp`
    int total = 0;
    total = total + 150;
    total = 100;
    total = total + 100;
    cout << total;`), bugLine: 7, options: ['Line 7 should be `total = total + 100;`', 'Line 5 should be `int total;`', 'Line 9 should print `"total"`', 'Line 6 should be `total = 150;`'], answer: 0, fixed: prog(cpp`
    int total = 0;
    total = total + 150;
    total = total + 100;
    total = total + 200;
    cout << total;`), explain: '`total = 100;` throws away the running total and starts again from 100.' },
    { id: 'l8-q7', kind: 'mcq', tag: 'real life', prompt: 'A bank account starts with 5000. Which line correctly deposits 1500?', options: ['`balance = balance + 1500;`', '`balance + 1500;`', '`1500 = balance;`', '`balance == balance + 1500;`'], answer: 0, explain: 'Take the old balance, add 1500, store it back. B calculates but stores nothing, C is a compile error, D only compares.' },
    { id: 'l8-q8', kind: 'predict', prompt: 'What does this print?', code: prog(cpp`
    int a = 1, b = 2, c = 3;
    a = b;
    b = c;
    c = a;
    cout << a << b << c;`), explain: 'a = 2, b = 3, c = 2 (the new a) → `232`.' },
  ],
  cheatsheet: [
    { code: 'x = expr;', text: 'work out expr, replace the value in x' },
    { code: 'x = x + 1;', text: 'use the old value to make the new one' },
    { code: 'temp = a; a = b; b = temp;', text: 'swap two variables' },
  ],
};

// ------------------------------------------------------------------ Level 9: const & scope
const L9: Level = {
  id: 'constants',
  kind: 'lesson',
  title: 'Constants and where variables live',
  tagline: '`const` locks a value so nobody can change it by mistake. And a variable only lives inside the `{ }` block where it was born.',
  minutes: 15,
  objectives: [
    'Create constants with `const` and explain why they help',
    'Know that a variable exists only inside its own block',
  ],
  learn: [
    { t: 'syntax', title: 'A constant', code: 'const double PI = 3.14159;', parts: [
      { token: 'const', text: 'this value can never change after it is created' },
      { token: 'PI', text: 'constants are often written in CAPITALS so they stand out' },
      { token: '= 3.14159', text: 'a constant MUST get its value when it is created' },
    ] },
    { t: 'code', code: prog(cpp`
    const double PI = 3.14159;
    double r = 2;
    cout << "Area: " << PI * r * r << endl;`) },
    { t: 'compare', items: [
      { title: 'Changing a constant', good: false, code: prog(cpp`
    const int MAX_MARKS = 100;
    MAX_MARKS = 150;`), note: 'The compiler refuses: `assignment of read-only variable \'MAX_MARKS\'`.' },
    ] },
    { t: 'callout', tone: 'tip', title: 'Why use const?', text: 'Values like the number of days in a week, a tax rate or maximum marks should never change. `const` turns an accidental change into a compile error instead of a wrong answer.' },
    { t: 'h', text: 'Scope: where a variable lives' },
    { t: 'p', text: 'A variable created inside `{ }` exists only until that block closes. Watch the memory panel: when the block ends, the box disappears.' },
    { t: 'viz', title: 'A box that disappears', code: prog(cpp`
    int outside = 1;
    {
        int inside = 2;
        cout << outside + inside << endl;
    }
    cout << outside << endl;`) },
  ],
  watch: [
    { title: 'Constants in a real calculation', code: prog(cpp`
    const int DAYS_IN_WEEK = 7;
    int weeks = 5;
    int days = weeks * DAYS_IN_WEEK;
    cout << weeks << " weeks = " << days << " days" << endl;`) },
  ],
  practice: [
    { id: 'l9-q1', kind: 'mcq', prompt: 'What happens when you compile `const int X = 5; X = 6;`?', options: ['Compile error: X is read-only', 'X becomes 6', 'X becomes 11', 'The program crashes while running'], answer: 0, explain: 'A const can never be changed. The compiler stops you before the program even runs.' },
    { id: 'l9-q2', kind: 'bug', prompt: 'Find the line that does not compile.', code: prog(cpp`
    const double TAX = 0.17;
    double price = 1000;
    TAX = 0.2;
    cout << price * TAX;`), bugLine: 7, options: ['Delete line 7 — a const cannot be changed', 'Remove `const` from line 7', 'Change 0.2 to 20', 'Write TAX in lowercase'], answer: 0, fixed: prog(cpp`
    const double TAX = 0.17;
    double price = 1000;
    cout << price * TAX;`), explain: 'Line 7 tries to change a constant.' },
    { id: 'l9-q3', kind: 'bug', prompt: 'Why does this not compile?', code: prog(cpp`
    {
        int bonus = 50;
    }
    cout << bonus;`), bugLine: 8, options: ['`bonus` only exists inside the braces, so line 8 cannot see it', '50 needs quotes', 'You cannot use braces inside main', 'bonus must be const'], answer: 0, fixed: prog(cpp`
    int bonus = 50;
    cout << bonus;`), explain: 'The block closed on line 7, and bonus was destroyed with it: `\'bonus\' was not declared in this scope`.' },
    { id: 'l9-q4', kind: 'predict', prompt: 'What does this print?', code: prog(cpp`
    const int PRICE = 40;
    int qty = 3;
    cout << "Bill: " << PRICE * qty;`), explain: '40 × 3 = 120.' },
    { id: 'l9-q5', kind: 'mcq', prompt: 'Which declaration is NOT allowed?', options: ['`const int SIZE;`', '`const int SIZE = 10;`', '`const double G = 9.8;`', '`const char YES = \'y\';`'], answer: 0, explain: 'A constant must get its value when it is created.' },
  ],
  cheatsheet: [
    { code: 'const int MAX = 100;', text: 'a value that can never change' },
    { code: '{ int x; }', text: 'x exists only inside these braces' },
  ],
};

// ------------------------------------------------------------------ Checkpoint 2
const C2: Level = {
  id: 'checkpoint-variables',
  kind: 'revision',
  title: 'Variables',
  tagline: '**Checkpoint 2** mixes variables, types, assignment, swapping and constants — plus everything from Unit 1. Score 70% to clear it.',
  minutes: 20,
  objectives: [],
  practice: [
    { id: 'c2-q1', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'A canteen till. Dry run it: fill in the variables and the output.', code: prog(cpp`
    int samosa = 40;
    int qty = 3;
    int bill = samosa * qty;
    bill = bill + 70;
    cout << "Bill: " << bill << endl;`), hints: ['Line 8 adds a juice to the bill that is already there.'], explain: '120, then 190. Output `Bill: 190`.' },
    { id: 'c2-q2', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    double avg = (7 + 8) / 2;
    int n = 7.9;
    char c = 'A' + 2;
    cout << avg << " " << n << " " << c;`), hints: ['(7 + 8) / 2 uses whole numbers.'], explain: 'avg = 7 (15 / 2 is 7 before it is stored), n = 7, c = \'C\'.' },
    { id: 'c2-q3', kind: 'blanks', prompt: 'Complete the program so it prints `Circle area: 12.5664` (radius 2).', code: prog(cpp`
    [[1]] double PI = 3.14159265;
    double r = 2;
    double area = PI * r [[2]] r;
    cout << "Circle area: " << [[3]];`), blanks: [{ answers: ['const'] }, { answers: ['*'] }, { answers: ['area'] }], chips: ['const', '*', '+', 'area', '"area"'], output: 'Circle area: 12.5664', explain: 'πr² = π × r × r; cout prints 6 significant digits.' },
    { id: 'c2-q4', kind: 'mcq', prompt: 'Which type is best for storing whether a student has paid the fee?', options: ['`bool`', '`int`', '`string`', '`double`'], answer: 0, explain: 'Paid / not paid is true / false.' },
    { id: 'c2-q5', kind: 'parsons', prompt: 'Arrange a program that swaps `x = 1` and `y = 2` and prints `2 1`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int x = 1, y = 2;', '    int t = x;', '    x = y;', '    y = t;', '    cout << x << " " << y;', '    return 0;', '}'], distractors: ['    y = x;'], explain: 'Save x in t, copy y into x, restore t into y.' },
    { id: 'c2-q6', kind: 'bug', prompt: 'This should print `Total: 30` but does not compile.', code: prog(cpp`
    int a = 10;
    int b = 20
    int total = a + b;
    cout << "Total: " << total;`), bugLine: 6, options: ['Add `;` at the end of line 6', 'Add `;` at the start of line 7', 'Remove `int` from line 7', 'Put 20 in quotes'], answer: 0, fixed: prog(cpp`
    int a = 10;
    int b = 20;
    int total = a + b;
    cout << "Total: " << total;`), explain: 'g++ says `expected \',\' or \';\' before \'int\'` — the declaration on line 6 never ended.' },
    { id: 'c2-q7', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    int a = 5;
    int b = a;
    a = a * 2;
    b = b + a;
    cout << a << " " << b;`), explain: 'a = 10, b = 5 + 10 = 15.' },
    { id: 'c2-q8', kind: 'mcq', tag: 'real life', prompt: 'A school stores the number of students in Pakistan (about 26,000,000) and multiplies it by the fee (Rs. 5,000). Which type avoids overflow for the result?', options: ['`long long`', '`int`', '`char`', '`bool`'], answer: 0, explain: '26 million × 5000 = 130 billion, far beyond the int limit of about 2.1 billion.' },
  ],
  exam: {
    title: 'Exam Challenge: Variables & types',
    intro: '**State the output of the following code. If there is an error, write it explicitly** (choose "It does not compile" and the line). Past FAST PF papers love ASCII arithmetic, values that do not fit their type, and assignments that look legal but are not. Useful ranges: `char` −128 … 127, `short` −32768 … 32767 (a `short` is 2 bytes).',
    questions: [
      { id: 'checkpoint-variables-x1', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code.', code: prog(cpp`
    int easy = 3 * (-48 + 16 + 'a' / 2);
    char c = 'a' - 32 + 2;
    int code = c;
    cout << easy << " " << c << " " << code;`),
        hints: ["A `char` in a calculation is its ASCII code: `'a'` is 97, `'A'` is 65.", "`97 / 2` is whole-number division."],
        explain: "Line 5: `'a' / 2` = `97 / 2` = `48` (the .5 is thrown away). Brackets: `-48 + 16 + 48` = `16`. Then `3 * 16` = `48`.\nLine 6: `97 - 32 + 2` = `67`, stored in a char → `'C'` (small letters are 32 after the capitals).\nLine 7: `code` gets the ASCII code of `'C'`, which is `67`.\nOutput: `48 C 67`" },
      { id: 'checkpoint-variables-x2', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code.', code: prog(cpp`
    short int s = 65536;
    bool b = s;
    bool t = -0.5;
    cout << s << " " << b << " " << t << " " << sizeof(s) + sizeof(b);`),
        hints: ['A `short` has 16 bits, so it can only keep the value modulo 65536.', 'A `bool` is `false` only for zero; anything else (even negative or a fraction) is `true`.'],
        explain: '`65536` is 2¹⁶ — exactly one full turn of a 2-byte `short`, so it **wraps around** to `0` (like an odometer going from 99999 to 00000).\n`b = s` → `s` is 0, so `b` is `false`, printed as `0`.\n`t = -0.5` → not zero, so `true`, printed as `1`.\n`sizeof(s)` is 2 bytes and `sizeof(b)` is 1 byte → `3`.\nOutput: `0 0 1 3`' },
      { id: 'checkpoint-variables-x3', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code.', code: prog(cpp`
    short s = 32767;
    s = s + 1;
    char c = 300;
    char d = 'A' + 200;
    cout << s << " " << c << " " << (int)c << " " << (int)d;`),
        hints: ['When a value does not fit, subtract (or add) the number of possible values: 65536 for `short`, 256 for `char`.', 'Which character has ASCII code 44?'],
        explain: 'Line 6: `32767 + 1` = `32768`, which is one more than a `short` can hold, so it wraps to `32768 - 65536` = `-32768`.\nLine 7: `300` does not fit in a char: `300 - 256` = `44`, the ASCII code of `,` (a comma).\nLine 8: `65 + 200` = `265` → `265 - 256` = `9`.\nPrinting: `s` → `-32768`, `c` as a char → `,`, `(int)c` → `44`, `(int)d` → `9`.\nOutput: `-32768 , 44 9`' },
      { id: 'checkpoint-variables-x4', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it explicitly.', code: prog(cpp`
    const int MAX = 100;
    int marks = MAX;
    marks = marks + 5;
    MAX = marks;
    cout << MAX << " " << marks;`),
        hints: ['Lines 5–7 only read `MAX`. Which line tries to change it?'],
        explain: 'It does **not compile**. Reading a constant is fine (lines 6 and 7), but line 8 tries to store a new value in `MAX`, which is `const`. g++: `assignment of read-only variable \'MAX\'` on **line 8**.\nFix: remove line 8 (or store the value in a normal variable). Without line 8 the output would be `100 105`.' },
      { id: 'checkpoint-variables-x5', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it explicitly.', code: prog(cpp`
    int a = b = c = 10;
    a = a + b + c;
    cout << a << b << c;`),
        hints: ['In a declaration, only the name right after `int` is created.'],
        explain: 'It does **not compile**. `int a = b = c = 10;` creates only `a`. Its starting value is the expression `b = c = 10`, but `b` and `c` were never declared. g++: `\'b\' was not declared in this scope` on **line 5**.\nFix: declare all of them first — `int a, b, c;` then `a = b = c = 10;` (chained assignment works right to left). Then line 6 gives `a = 30` and the output would be `301010`.' },
      { id: 'checkpoint-variables-x6', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code. If there is an error, write it explicitly.', code: prog(cpp`
    int outside = 4;
    {
        int inside = outside * 2;
        outside = inside + 1;
    }
    cout << outside << " " << inside;`),
        hints: ['A variable lives only until the `}` of the block where it was created.'],
        explain: 'It does **not compile**. `inside` was created on line 7, inside the `{ }` block, and it disappears at the `}` on line 9. Line 10 uses it outside the block: g++ reports `\'inside\' was not declared in this scope` on **line 10**.\nFix: print only `outside` (it was changed to `4 * 2 + 1` = 9 inside the block), or declare `inside` before the block.' },
      { id: 'checkpoint-variables-x7', kind: 'count', tag: 'exam', prompt: 'How many times does the digit `1` appear in the output?', code: prog(cpp`
    bool ok = -5;
    char one = '1';
    int n = one;
    short s = 65537;
    cout << ok << one << n << s << "1" << '1' + 0 << endl;`),
        count: { text: '1' },
        hints: ["`'1'` the character has ASCII code 49.", '`65537` is one more than a full turn of a `short`.'],
        explain: 'Print piece by piece:\n`ok` → true → `1` (**1**)\n`one` is the char `\'1\'` → `1` (**2**)\n`n` holds the ASCII code of `\'1\'` → `49` (no 1)\n`s` = `65537 - 65536` = `1` (**3**)\n`"1"` → `1` (**4**)\n`\'1\' + 0` is a number calculation → `49` (no 1).\nThe output is `11491149`, which has **4** ones.' },
      { id: 'checkpoint-variables-x8', kind: 'count', tag: 'exam', prompt: 'How many times does the letter `A` (capital) appear in the output?', code: prog(cpp`
    char a = 'A', b = 'B';
    char t = a;
    a = b;
    b = t;
    cout << a << b << t << 'A' + 0 << "A" << (char)('a' - 32) << endl;`),
        count: { text: 'A' },
        hints: ['Lines 6–8 are the classic swap with a temp box. What is in `a`, `b` and `t` at the end?', "`'A' + 0` is a number, not a letter."],
        explain: 'After the swap: `t` = `\'A\'`, `a` = `\'B\'`, `b` = `\'A\'`.\nPrinting: `a` → `B`, `b` → `A`, `t` → `A`, `\'A\' + 0` → `65` (a number), `"A"` → `A`, `(char)(97 - 32)` = `(char)65` → `A`.\nThe output is `BAA65AA`: **4** capital A\'s.' },
      { id: 'checkpoint-variables-x9', kind: 'predict', tag: 'exam', prompt: 'State the output of the following code.', code: prog(cpp`
    int a = 5, b = 8;
    a = a + b;
    b = a - b;
    a = a - b;
    double avg = (a + b) / 2;
    int n = 9.99 + 0.5;
    cout << a << " " << b << " " << avg << " " << n;`),
        hints: ['Lines 6–8 swap two numbers without a temp box.', '`(a + b) / 2` is calculated with ints BEFORE it is stored in the double.'],
        explain: 'Line 6: `a = 13`. Line 7: `b = 13 - 8 = 5`. Line 8: `a = 13 - 5 = 8`. The values are swapped.\nLine 9: `(8 + 5) / 2` = `13 / 2` = `6` (int ÷ int), then stored as `6.0`, printed as `6`.\nLine 10: `9.99 + 0.5` = `10.49`, cut (not rounded) to `10`.\nOutput: `8 5 6 10`' },
      { id: 'checkpoint-variables-x10', kind: 'blanks', tag: 'exam', prompt: 'Complete the program. A bus has a fixed 40 seats that must never change; 43 tickets were booked. It must print EXACTLY `Extra: 3 Row: D` (the extra passengers go to row `A` + extra).', code: prog(cpp`
    [[1]] int SEATS = 40;
    int booked = 43;
    int extra = booked [[2]] SEATS;
    [[3]] row = 'A' + extra;
    cout << "Extra: " << extra << " Row: " << [[4]];`),
        blanks: [{ answers: ['const'] }, { answers: ['-'] }, { answers: ['char'] }, { answers: ['row'] }],
        chips: ['const', 'int', 'char', 'string', '-', '+', 'row', '"row"'],
        output: 'Extra: 3 Row: D',
        hints: ['A value that must never change is a constant.', "To print a letter, the box must be a `char`; an `int` would print 68."],
        explain: '`const` locks `SEATS`. `43 - 40` = 3. `\'A\' + 3` = 68, and a `char` box shows it as `D` (an `int` box would print `68`). Print the variable `row`, not the text `"row"`.' },
    ],
  },
};

export const unit2: Unit = {
  id: 'u2',
  num: 2,
  title: 'Variables & data types',
  summary: 'Boxes in memory: create them, fill them, change them.',
  levels: [L6, L7, L8, L9, C2],
};
