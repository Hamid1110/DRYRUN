import type { Level, Unit } from '../types';
import { cpp, prog } from '../helpers';

// ------------------------------------------------------------------ Level 10: cin
const L10: Level = {
  id: 'reading-input',
  kind: 'lesson',
  title: 'Reading one value with cin',
  tagline: '`cin` is the keyboard. `>>` takes what the user typed and drops it into a variable. Now your program can work with any value.',
  minutes: 20,
  objectives: [
    'Read a value into a variable with `cin >>`',
    'Always show a prompt before reading',
    'Follow the Input → Process → Output pattern',
  ],
  learn: [
    { t: 'p', text: 'Until now the values were fixed in the code. With `cin` (say *see-in*) the **user** types them while the program runs. The program stops and **waits** at every `cin` until the user presses Enter.' },
    { t: 'syntax', title: 'Reading a value', code: 'cin >> age;', parts: [
      { token: 'cin', text: 'console input — the keyboard' },
      { token: '>>', text: 'the arrows point **into the variable**: the value flows from the keyboard to the box' },
      { token: 'age', text: 'the variable that receives the value. It must already be declared' },
    ] },
    { t: 'compare', items: [
      { title: 'cout: data goes to the screen', code: 'cout << age;' },
      { title: 'cin: data comes from the keyboard', code: 'cin >> age;' },
    ] },
    { t: 'viz', title: 'Watch the keyboard input flow into the box', code: prog(cpp`
    int age;
    cout << "Enter your age: ";
    cin >> age;
    cout << "Next year you will be " << age + 1 << endl;`), input: '19\n' },
    { t: 'callout', tone: 'tip', title: 'Change the input', text: 'In the dry run, press **Change** in the *Keyboard input* panel, type another age and run again. Same code, new result — that is the power of input.' },
    { t: 'h', text: 'Input → Process → Output' },
    { t: 'list', ordered: true, items: [
      '**Input**: declare the variables and read them with `cin` (with a prompt first).',
      '**Process**: calculate what you need.',
      '**Output**: print the result with a clear label.',
    ] },
    { t: 'callout', tone: 'warn', title: 'Always prompt first', text: 'Without a `cout` prompt, the program just sits there with a blinking cursor and the user has no idea what to type.' },
    { t: 'table', head: ['Variable type', 'User types', 'Stored'], rows: [
      ['`int`', '`25`', '25'],
      ['`double`', '`3.75`', '3.75'],
      ['`char`', '`y`', "'y'"],
      ['`string`', '`Ahmed`', '"Ahmed" (one word only — see level 12)'],
    ] },
  ],
  ways: {
    goal: 'Read a number and print its double. For input `7` the output must be `Double: 14`.',
    items: [
      { title: 'Calculate inside cout', code: prog(cpp`
    int n;
    cout << "Number: ";
    cin >> n;
    cout << endl << "Double: " << n * 2;`), input: '7\n' },
      { title: 'Store the result first', code: prog(cpp`
    int n;
    cout << "Number: ";
    cin >> n;
    int twice = n * 2;
    cout << endl << "Double: " << twice;`), input: '7\n' },
      { title: 'Add it to itself', code: prog(cpp`
    int n;
    cout << "Number: ";
    cin >> n;
    cout << endl << "Double: " << n + n;`), input: '7\n' },
      { title: 'Change the variable', code: prog(cpp`
    int n;
    cout << "Number: ";
    cin >> n;
    n = n * 2;
    cout << endl << "Double: " << n;`), input: '7\n', note: 'Works, but the original value is lost.' },
    ],
    takeaway: 'Input is always the same (`cin >> n;`). The processing can be written in many ways.',
  },
  watch: [
    { title: 'Area of a rectangle', code: prog(cpp`
    int length, width;
    cout << "Length: ";
    cin >> length;
    cout << "Width: ";
    cin >> width;
    int area = length * width;
    cout << "Area = " << area << endl;`), input: '6\n4\n' },
    { title: 'Reading a character', code: prog(cpp`
    char grade;
    cout << "Your grade: ";
    cin >> grade;
    cout << "You got " << grade << "!" << endl;`), input: 'A\n' },
  ],
  think: {
    title: 'Celsius to Fahrenheit',
    problem: 'Read a temperature in Celsius and print it in Fahrenheit. Formula: **F = C × 9 / 5 + 32**. For 40 °C the output is `104 F`.',
    steps: [
      { text: 'Input: make a box for Celsius (decimals possible → `double`).', lines: [5] },
      { text: 'Ask the user and read the value.', lines: [6, 7] },
      { text: 'Process: calculate F with the formula.', lines: [8] },
      { text: 'Output: print F with a label.', lines: [9] },
    ],
    code: prog(cpp`
    double c;
    cout << "Celsius: ";
    cin >> c;
    double f = c * 9 / 5 + 32;
    cout << f << " F" << endl;`),
    input: '40\n',
    why: 'Using `double` avoids integer-division surprises: with int, 37 × 9 / 5 would lose the decimal part.',
    yourTurn: {
      id: 'l10-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the input 25. Fill in the variables and the output.',
      code: prog(cpp`
    double c;
    cout << "Celsius: ";
    cin >> c;
    double f = c * 9 / 5 + 32;
    cout << f << " F" << endl;`),
      input: '25\n',
      hints: ['25 × 9 = 225, 225 / 5 = 45, 45 + 32 = ?'],
      explain: '25 °C = 77 F.',
    },
  },
  practice: [
    { id: 'l10-q1', kind: 'mcq', prompt: 'Which line reads a number into `marks`?', options: ['`cin >> marks;`', '`cin << marks;`', '`cout >> marks;`', '`marks >> cin;`'], answer: 0, explain: 'Input arrows point from cin INTO the variable.' },
    { id: 'l10-q2', kind: 'predict', prompt: 'The user types 12. What does the program print?', code: prog(cpp`
    int n;
    cin >> n;
    cout << n * n;`), input: '12\n', explain: '12 × 12 = 144.' },
    { id: 'l10-q3', kind: 'bug', prompt: 'This does not compile. Find the mistake.', code: prog(cpp`
    int age;
    cout << "Age: ";
    cin << age;
    cout << age;`), bugLine: 7, options: ['Use `>>` with cin: `cin >> age;`', 'Use `cout` instead of `cin`', 'Declare age after line 7', 'Put age in quotes'], answer: 0, fixed: prog(cpp`
    int age;
    cout << "Age: ";
    cin >> age;
    cout << age;`), input: '20\n', explain: 'cin reads, so its arrows point into the variable: `>>`.' },
    { id: 'l10-q4', kind: 'blanks', prompt: 'Complete the program: read the price of one pen and print the price of 5 pens. For input 30 it prints `5 pens: 150`.', code: prog(cpp`
    int price;
    cout << "Price: ";
    [[1]] >> [[2]];
    cout << endl << "5 pens: " << [[3]];`), blanks: [{ answers: ['cin'] }, { answers: ['price'] }, { answers: ['price * 5', '5 * price', 'price*5', '5*price'] }], chips: ['cin', 'cout', 'price', '*', '5'], input: '30\n', explain: 'Read into price, then multiply by 5.' },
    { id: 'l10-q5', kind: 'trace', mode: 'vars', prompt: 'Dry run with input `8 3`. Fill in each value and the output.', code: prog(cpp`
    int a, b;
    cin >> a;
    cin >> b;
    int diff = a - b;
    cout << "Difference: " << diff;`), input: '8 3\n', explain: 'a = 8, b = 3, diff = 5.' },
    { id: 'l10-q6', kind: 'mcq', prompt: 'What happens when the program reaches `cin >> x;`?', options: ['It stops and waits until the user types a value and presses Enter', 'It prints the value of x', 'It sets x to 0', 'It skips the line if nothing was typed yet'], answer: 0, explain: 'cin waits for the user.' },
    { id: 'l10-q7', kind: 'parsons', prompt: 'Build a program that reads the radius of a circle and prints its area (use 3.14). Arrange the lines.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    double r;', '    cout << "Radius: ";', '    cin >> r;', '    cout << "Area: " << 3.14 * r * r;', '    return 0;', '}'], distractors: ['    cin >> "r";'], input: '2\n', explain: 'Declare → prompt → read → calculate and print.' },
    { id: 'l10-q8', kind: 'predict', tag: 'real life', prompt: 'A petrol pump program. The user types 12 (litres). Petrol costs 265 per litre. What is printed?', code: prog(cpp`
    int litres;
    cout << "Litres: ";
    cin >> litres;
    cout << endl << "Pay Rs. " << litres * 265;`), input: '12\n', explain: '12 × 265 = 3180. (The screen would also show the typed 12, but here you write only what the program prints.)' },
  ],
  cheatsheet: [
    { code: 'cin >> x;', text: 'wait for the user and store the value in x' },
    { code: 'cout << "prompt"; cin >> x;', text: 'always prompt before reading' },
    { code: 'Input → Process → Output', text: 'the shape of most programs' },
  ],
};

// ------------------------------------------------------------------ Level 11: many values & buffer
const L11: Level = {
  id: 'input-buffer',
  kind: 'lesson',
  title: 'Many values and the input buffer',
  tagline: 'The user can type several values on one line. `cin` takes them one at a time from a waiting line called the input buffer.',
  minutes: 20,
  objectives: [
    'Read several values with one `cin` chain',
    'Understand the input buffer: values wait there until a `cin` takes them',
    'Predict what happens with decimals in an int, or letters in a number',
  ],
  learn: [
    { t: 'p', text: 'Everything the user types goes into a waiting line called the **input buffer**. Each `>>` takes the **next** value from the front of that line, skipping spaces and Enters. The *Keyboard input* panel in the dry run shows the buffer: used values are crossed out and the caret shows where the next read starts.' },
    { t: 'viz', title: 'One line of input, three variables', code: prog(cpp`
    int a, b, c;
    cout << "Enter three numbers: ";
    cin >> a >> b >> c;
    cout << "Sum = " << a + b + c << endl;`), input: '4 9 2\n', fine: true },
    { t: 'callout', tone: 'key', title: 'Spaces or Enters — it does not matter', text: '`4 9 2` on one line or on three lines gives the same result. `cin >>` skips all spaces, tabs and Enters before a value.' },
    { t: 'h', text: 'Surprises in the buffer' },
    { t: 'table', head: ['Code', 'User types', 'Result'], rows: [
      ['`int n; cin >> n;`', '`3.7`', 'n = 3, and `.7` **stays in the buffer** for the next read'],
      ['`int n; cin >> n;`', '`abc`', 'the read **fails**: n becomes 0 and cin stops reading'],
      ['`char c; cin >> c;`', '`yes`', "c = 'y', and `es` stays in the buffer"],
      ['`string s; cin >> s;`', '`Ali Khan`', 's = "Ali" — `>>` stops at the space'],
    ] },
    { t: 'viz', title: 'A decimal typed into an int', code: prog(cpp`
    int whole;
    double rest;
    cin >> whole;
    cin >> rest;
    cout << whole << " and " << rest << endl;`), input: '3.75\n' },
  ],
  watch: [
    { title: 'Values on separate lines', code: prog(cpp`
    int day, month, year;
    cout << "Date (day month year): ";
    cin >> day >> month >> year;
    cout << day << "/" << month << "/" << year << endl;`), input: '14\n8\n1947\n' },
    { title: 'When input goes wrong', intro: 'The user typed letters where a number was expected.', code: prog(cpp`
    int age;
    int year;
    cin >> age;
    cin >> year;
    cout << age << " " << year << endl;`), input: 'twenty 2005\n' },
  ],
  think: {
    title: 'Average of three test marks',
    problem: 'Read three test marks on one line and print their average with decimals. Input `70 85 90` → `Average: 81.6667`.',
    steps: [
      { text: 'Make three boxes for the marks.', lines: [5] },
      { text: 'Prompt, then read all three in one chain.', lines: [6, 7] },
      { text: 'Add them and divide by **3.0** so the answer keeps its decimals.', lines: [8] },
      { text: 'Print the average.', lines: [9] },
    ],
    code: prog(cpp`
    int m1, m2, m3;
    cout << "Marks: ";
    cin >> m1 >> m2 >> m3;
    double avg = (m1 + m2 + m3) / 3.0;
    cout << "Average: " << avg << endl;`),
    input: '70 85 90\n',
    why: 'Brackets first (the sum), then divide. Dividing by `3` instead of `3.0` would throw the decimals away.',
    yourTurn: {
      id: 'l11-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the input `60 75 80`.',
      code: prog(cpp`
    int m1, m2, m3;
    cout << "Marks: ";
    cin >> m1 >> m2 >> m3;
    double avg = (m1 + m2 + m3) / 3.0;
    cout << "Average: " << avg << endl;`),
      input: '60 75 80\n',
      hints: ['60 + 75 + 80 = 215.', '215 / 3.0 = 71.666…, and cout shows 6 significant digits.'],
      explain: 'avg = 71.6667.',
    },
  },
  practice: [
    { id: 'l11-q1', kind: 'predict', prompt: 'The user types `5 10`. What is printed?', code: prog(cpp`
    int x, y;
    cin >> x >> y;
    cout << y << " " << x;`), input: '5 10\n', explain: 'x = 5, y = 10, printed in the order y then x.' },
    { id: 'l11-q2', kind: 'mcq', tag: 'tricky', prompt: 'The user types `8.9` for `int n; cin >> n;`. What is stored in n?', options: ['8', '9', '8.9', '0'], answer: 0, explain: 'An int stops reading at the dot. `.9` stays in the buffer.' },
    { id: 'l11-q3', kind: 'trace', mode: 'vars', prompt: 'Input: `2 3` on the first line and `4` on the second. Dry run it.', code: prog(cpp`
    int a, b, c;
    cin >> a >> b;
    cin >> c;
    cout << a * b * c;`), input: '2 3\n4\n', explain: 'The second cin takes 4 from the next line. 2 × 3 × 4 = 24.' },
    { id: 'l11-q4', kind: 'predict', prompt: 'The user types `Ali Raza`. What is printed?', code: prog(cpp`
    string first, last;
    cin >> first >> last;
    cout << last << ", " << first;`), input: 'Ali Raza\n', explain: 'Each `>>` reads one word.' },
    { id: 'l11-q5', kind: 'blanks', prompt: 'Read length, width and height in one line and print the volume. Input `2 3 4` → `Volume: 24`.', code: prog(cpp`
    int l, w, h;
    cin >> l [[1]] w >> [[2]];
    cout << "Volume: " << [[3]];`), blanks: [{ answers: ['>>'] }, { answers: ['h'] }, { answers: ['l * w * h', 'l*w*h'] }], chips: ['>>', '<<', 'h', '*'], input: '2 3 4\n', explain: 'One chain reads all three values.' },
    { id: 'l11-q6', kind: 'mcq', prompt: 'The user types `abc` for `int n; cin >> n;`. What happens?', options: ['The read fails, n becomes 0 and later reads are skipped', 'n becomes 97', 'The program asks again', 'n becomes "abc"'], answer: 0, explain: 'cin goes into a failed state. Later reads do nothing until it is reset.' },
    { id: 'l11-q7', kind: 'predict', tag: 'real life', prompt: 'A cricket score: the user types runs and balls `45 30`. What is the strike rate printed?', code: prog(cpp`
    int runs, balls;
    cin >> runs >> balls;
    double sr = runs * 100.0 / balls;
    cout << "Strike rate: " << sr;`), input: '45 30\n', explain: '45 × 100 / 30 = 150.' },
  ],
  cheatsheet: [
    { code: 'cin >> a >> b >> c;', text: 'read three values, left to right' },
    { code: 'input buffer', text: 'typed values wait here until a cin takes them' },
    { code: 'int ← "3.7"', text: 'reads 3, leaves .7 waiting' },
  ],
};

// ------------------------------------------------------------------ Level 12: getline
const L12: Level = {
  id: 'getline',
  kind: 'lesson',
  title: 'Text input: cin vs getline',
  tagline: '`cin >>` stops at the first space. `getline` reads a whole line. Mixing them has one famous trap — and one simple fix.',
  minutes: 20,
  objectives: [
    'Read a full name or sentence with `getline(cin, s)`',
    'Explain why getline sometimes reads an empty line after `cin >>`',
    'Fix it with `cin.ignore()`',
  ],
  learn: [
    { t: 'compare', items: [
      { title: 'cin >> stops at a space', code: cpp`
string name;
cin >> name;           // name = "Ali"`, note: 'The rest, ` Khan`, stays in the buffer.' },
      { title: 'getline reads the whole line', good: true, code: cpp`
string name;
getline(cin, name);    // name = "Ali Khan"` },
    ] },
    { t: 'callout', tone: 'info', title: 'The input for both', text: 'The user typed `Ali Khan` and pressed Enter. The dry runs below show both cases step by step.' },
    { t: 'syntax', title: 'getline', code: 'getline(cin, fullName);', parts: [
      { token: 'getline', text: 'read everything up to the Enter key (spaces included)' },
      { token: 'cin', text: 'from the keyboard' },
      { token: 'fullName', text: 'a `string` variable that receives the line' },
    ] },
    { t: 'h', text: 'The trap: getline after cin >>' },
    { t: 'p', text: 'When the user types `20` and presses Enter, `cin >> age` takes `20` but **leaves the Enter** in the buffer. The next `getline` sees that Enter immediately and reads an **empty line**.' },
    { t: 'viz', title: 'The empty-line bug', code: prog(cpp`
    int age;
    string name;
    cout << "Age: ";
    cin >> age;
    cout << "Full name: ";
    getline(cin, name);
    cout << "[" << name << "]" << endl;`), input: '20\nAli Khan\n' },
    { t: 'callout', tone: 'key', title: 'The fix: cin.ignore()', text: 'Put `cin.ignore();` between the `cin >>` and the `getline`. It throws away the leftover Enter.' },
    { t: 'viz', title: 'Fixed with cin.ignore()', code: prog(cpp`
    int age;
    string name;
    cout << "Age: ";
    cin >> age;
    cin.ignore();
    cout << "Full name: ";
    getline(cin, name);
    cout << "[" << name << "]" << endl;`), input: '20\nAli Khan\n' },
  ],
  watch: [
    { title: 'A full address', code: prog(cpp`
    string city, address;
    cout << "City: ";
    cin >> city;
    cin.ignore();
    cout << "Address: ";
    getline(cin, address);
    cout << address << ", " << city << endl;`), input: 'Lahore\nHouse 12, Street 5, Model Town\n' },
  ],
  practice: [
    { id: 'l12-q1', kind: 'predict', prompt: 'The user types `Hello World`. What is printed?', code: prog(cpp`
    string s;
    cin >> s;
    cout << s;`), input: 'Hello World\n', explain: '`>>` stops at the space: `Hello`.' },
    { id: 'l12-q2', kind: 'predict', prompt: 'The user types `Hello World`. What is printed now?', code: prog(cpp`
    string s;
    getline(cin, s);
    cout << s;`), input: 'Hello World\n', explain: 'getline keeps the spaces.' },
    { id: 'l12-q3', kind: 'bug', prompt: 'The user types `19` then `Sara Ahmed`, but the name prints as empty. Find the line where the fix belongs and choose it.', code: prog(cpp`
    int age;
    string name;
    cin >> age;
    getline(cin, name);
    cout << name << " is " << age;`), input: '19\nSara Ahmed\n', bugLine: 8, options: ['Add `cin.ignore();` before the getline on line 8', 'Change getline to `cin >> name;`', 'Read the name first', 'Declare name as char'], answer: 0, fixed: prog(cpp`
    int age;
    string name;
    cin >> age;
    cin.ignore();
    getline(cin, name);
    cout << name << " is " << age;`), explain: 'The Enter after 19 was still waiting, so getline read an empty line. `cin.ignore()` removes it.' },
    { id: 'l12-q4', kind: 'mcq', prompt: 'Which is the right way to read a full name with spaces?', options: ['`getline(cin, name);`', '`cin >> name;`', '`getline(name, cin);`', '`cin.getline >> name;`'], answer: 0, explain: 'getline(cin, variable).' },
    { id: 'l12-q5', kind: 'blanks', prompt: 'Complete it so that input `3` then `Blue Area, Islamabad` prints `Blue Area, Islamabad (3)`.', code: prog(cpp`
    int n;
    string place;
    cin >> n;
    [[1]];
    [[2]](cin, place);
    cout << place << " (" << n << ")";`), blanks: [{ answers: ['cin.ignore()'] }, { answers: ['getline'] }], chips: ['cin.ignore()', 'getline', 'cin >>'], input: '3\nBlue Area, Islamabad\n', explain: 'Throw away the Enter, then read the whole line.' },
  ],
  cheatsheet: [
    { code: 'cin >> s;', text: 'one word (stops at a space)' },
    { code: 'getline(cin, s);', text: 'the whole line' },
    { code: 'cin.ignore();', text: 'use between cin >> and getline' },
  ],
};

// ------------------------------------------------------------------ Checkpoint 3
const C3: Level = {
  id: 'checkpoint-input',
  kind: 'revision',
  title: 'Input',
  tagline: '**Checkpoint 3**: programs that read, calculate and print — Input → Process → Output. Score 70% to clear it.',
  minutes: 20,
  objectives: [],
  practice: [
    { id: 'c3-q1', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'Electricity bill: units × 35 + a fixed charge of 250. Dry run with the input 120.', code: prog(cpp`
    int units;
    cout << "Units: ";
    cin >> units;
    int bill = units * 35 + 250;
    cout << "Bill: Rs. " << bill;`), input: '120\n', hints: ['Multiplication first: 120 × 35 = 4200.'], explain: '4200 + 250 = 4450.' },
    { id: 'c3-q2', kind: 'predict', prompt: 'The user types `7 2`. Predict the output.', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    cout << a / b << " " << a % b << " " << (double)a / b;`), input: '7 2\n', explain: '7 / 2 = 3, remainder 1, and as decimals 3.5.' },
    { id: 'c3-q3', kind: 'parsons', prompt: 'Build: read the minutes and print hours and minutes. Input `135` → `2 h 15 min`.', lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    int total;', '    cin >> total;', '    cout << total / 60 << " h " << total % 60 << " min";', '    return 0;', '}'], distractors: ['    cout << total % 60 << " h " << total / 60 << " min";'], input: '135\n', explain: '/ 60 gives the hours, % 60 the minutes left over.' },
    { id: 'c3-q4', kind: 'blanks', tag: 'real life', prompt: 'Read the price and quantity and print the bill. Input `250 4` → `Bill: 1000`.', code: prog(cpp`
    int price, qty;
    [[1]] >> price >> qty;
    cout << "Bill: " << [[2]];`), blanks: [{ answers: ['cin'] }, { answers: ['price * qty', 'qty * price', 'price*qty', 'qty*price'] }], chips: ['cin', 'cout', 'price', 'qty', '*'], input: '250 4\n', explain: 'Read both, multiply.' },
    { id: 'c3-q5', kind: 'mcq', prompt: 'The user types `12.5` for `int n; double d; cin >> n >> d;`. What are n and d?', options: ['n = 12, d = 0.5', 'n = 12, d = 12.5', 'n = 13, d = 0', 'the program crashes'], answer: 0, explain: 'n takes 12 and stops at the dot; `.5` is still in the buffer, so d reads 0.5.' },
    { id: 'c3-q6', kind: 'bug', prompt: 'The name is always empty. Find the line to fix.', code: prog(cpp`
    int roll;
    string name;
    cin >> roll;
    getline(cin, name);
    cout << roll << ": " << name;`), input: '7\nHina Ali\n', bugLine: 8, options: ['Add `cin.ignore();` before getline', 'Use `cin >> name;` twice', 'Swap lines 7 and 8', 'Make roll a string'], answer: 0, fixed: prog(cpp`
    int roll;
    string name;
    cin >> roll;
    cin.ignore();
    getline(cin, name);
    cout << roll << ": " << name;`), explain: 'The leftover Enter must be removed first.' },
    { id: 'c3-q7', kind: 'predict', tag: 'real life', prompt: 'Split the bill: the user types the total and the number of friends `1000 3`.', code: prog(cpp`
    int total, people;
    cin >> total >> people;
    cout << "Each: " << total / people << endl;
    cout << "Left: " << total % people << endl;`), input: '1000 3\n', explain: '333 each, 1 left over.' },
  ],
  exam: {
    title: 'Exam Challenge: Input',
    intro: '**State the output of the following code for the given input. If there is an error, write it explicitly** (choose "It does not compile" and the line). Trace the input buffer character by character: where does each `cin >>` stop, and what is left behind for the next read?',
    questions: [
      { id: 'checkpoint-input-x1', kind: 'predict', tag: 'exam', prompt: 'The user types `12.75 3` and presses Enter. State the output.', code: prog(cpp`
    int a;
    double b;
    int c;
    cin >> a >> b >> c;
    cout << a << " " << b << " " << a + b * c;`), input: '12.75 3\n',
        hints: ['`cin >>` into an `int` stops at the first character that cannot be part of a whole number.', 'The `.75` is still waiting in the buffer.'],
        explain: 'Buffer: `12.75 3⏎`.\n`cin >> a` reads `12` and stops at the dot (an int has no decimals). The buffer still holds `.75 3⏎`.\n`cin >> b` reads `.75` → `b = 0.75`.\n`cin >> c` skips the space and reads `3`.\n`a + b * c` = `12 + 0.75 * 3` = `12 + 2.25` = `14.25`.\nOutput: `12 0.75 14.25`' },
      { id: 'checkpoint-input-x2', kind: 'predict', tag: 'exam', prompt: 'The user types `21`, Enter, `Ali Khan`, Enter. State the output.', code: prog(cpp`
    int age;
    string name;
    cin >> age;
    getline(cin, name);
    cout << "[" << name << "]" << age;`), input: '21\nAli Khan\n',
        hints: ['After `cin >> age`, what is the very next character in the buffer?'],
        explain: 'Buffer: `21⏎Ali Khan⏎`.\n`cin >> age` reads `21` and **leaves the Enter** (⏎) in the buffer.\n`getline` reads up to the next Enter — and the next character IS that Enter. So `name` is an **empty** string, and `Ali Khan` is never read.\nOutput: `[]21`\nFix: `cin.ignore();` between line 7 and line 8.' },
      { id: 'checkpoint-input-x3', kind: 'predict', tag: 'exam', prompt: 'The user types `Ali Raza Khan 20` and presses Enter. State the output (the `|` marks show where each string starts and ends).', code: prog(cpp`
    string first, last, rest;
    cin >> first >> last;
    getline(cin, rest);
    cout << last << "|" << rest << "|" << first;`), input: 'Ali Raza Khan 20\n',
        hints: ['`cin >>` into a string stops at a space; `getline` keeps spaces.', 'Does the space after `Raza` get thrown away?'],
        explain: '`cin >> first` → `Ali` (stops at the space). `cin >> last` skips the space and reads `Raza`, stopping at the next space.\n`getline` takes **everything** left on the line, starting with that space: `rest` = ` Khan 20` (with a leading space).\nOutput: `Raza| Khan 20|Ali`' },
      { id: 'checkpoint-input-x4', kind: 'predict', tag: 'exam', prompt: 'The user types `25` and presses Enter. State the output.', code: prog(cpp`
    char c;
    int n;
    cin >> c >> n;
    cout << c << n << " " << c + n;`), input: '25\n',
        hints: ['A `char` takes exactly ONE character from the buffer.', "`'2'` in a calculation is its ASCII code, 50."],
        explain: '`cin >> c` reads one character: `\'2\'`. `cin >> n` reads what is left: `5`.\n`cout << c << n` prints `2` and `5` → `25`.\n`c + n` is arithmetic: the char `\'2\'` is ASCII 50, so `50 + 5` = `55`.\nOutput: `25 55`' },
      { id: 'checkpoint-input-x5', kind: 'predict', tag: 'exam', prompt: 'The user types `8`. State the output. If there is an error, write it explicitly.', code: prog(cpp`
    int x;
    cout << "Enter x: ";
    cin << x;
    cout << x * x;`), input: '8\n',
        hints: ['Which way do the arrows point for `cout`, and which way for `cin`?'],
        explain: 'It does **not compile**. Line 7 uses `<<` with `cin`. Input flows *from* `cin` *into* the variable, so it must be `cin >> x;`. g++ reports `no match for \'operator<<\'` on **line 7**.\nFix: `cin >> x;`. Then the output would be `Enter x: 64`.' },
      { id: 'checkpoint-input-x6', kind: 'predict', tag: 'exam', prompt: 'The user types `19`. State the output. If there is an error, write it explicitly.', code: prog(cpp`
    int age;
    cout << "Age: ";
    getline(cin, age);
    cout << age + 1;`), input: '19\n',
        hints: ['What type of box can `getline` fill?'],
        explain: 'It does **not compile**. `getline(cin, …)` reads a whole line of text, so its box must be a `string`. `age` is an `int`, and g++ reports `no matching function for call to \'getline\'` on **line 7**.\nFix: `cin >> age;`. Then the output would be `Age: 20`.' },
      { id: 'checkpoint-input-x7', kind: 'predict', tag: 'exam', prompt: 'The user types `5`. State the output. If there is an error, write it explicitly.', code: prog(cpp`
    int n;
    cout << "n = ";
    cin >> n >> endl;
    cout << n * 10;`), input: '5\n',
        hints: ['`endl` is something you can print. Can you *read into* it?'],
        explain: 'It does **not compile**. `cin >>` needs a variable to store the value in. `endl` is not a variable, it is an instruction for output, so `cin >> endl` makes no sense. g++ reports `no match for \'operator>>\'` on **line 7**.\nFix: `cin >> n;` (the user presses Enter anyway). Then the output would be `n = 50`.' },
      { id: 'checkpoint-input-x8', kind: 'count', tag: 'exam', prompt: 'The input is two lines: `*  *` and `** *`. How many `*` appear in the output?', code: prog(cpp`
    string line;
    char a, b;
    getline(cin, line);
    cin >> a >> b;
    cout << line << a << b << a;`), input: '*  *\n** *\n',
        count: { text: '*' },
        unit: 'stars',
        hints: ['`getline` takes the whole first line, spaces included.', 'Each `char` takes one character (spaces are skipped), and `a` is printed twice.'],
        explain: '`getline` reads the first line `*  *` — **2** stars (and 2 spaces).\n`cin >> a` reads the first `*` of the second line, `cin >> b` the second `*`. The last ` *` is never read.\nPrinting `line`, `a`, `b`, `a` → `*  *` + `*` + `*` + `*`.\nTotal: 2 + 3 = **5** stars.' },
      { id: 'checkpoint-input-x9', kind: 'count', tag: 'exam', prompt: 'The user types `Ali`, Enter, `Ali Ali`, Enter. How many times does `Ali` appear in the output?', code: prog(cpp`
    string a, b;
    cin >> a;
    getline(cin, b);
    cout << a << b << endl;
    cin >> b;
    cout << b << a;`), input: 'Ali\nAli Ali\n',
        count: { text: 'Ali' },
        hints: ['What does `getline` find right after `cin >> a`?', '`cin >> b` stops at the space.'],
        explain: '`cin >> a` → `Ali`, leaving the Enter behind. `getline(cin, b)` reads that Enter → `b` is empty. Line 8 prints `Ali` and a newline (**1**).\nLine 9: `cin >> b` reads the next word, `Ali` (stops at the space). Line 10 prints `AliAli` (**2** more).\nThe last `Ali` in the input is never read. Total: **3**.' },
      { id: 'checkpoint-input-x10', kind: 'blanks', tag: 'exam', prompt: 'Complete the program. The user types the roll number, Enter, and the full name, Enter (`17` then `Sara Ahmed`). It must print EXACTLY `17: Sara Ahmed`.', code: prog(cpp`
    int roll;
    string name;
    cin >> [[1]];
    cin.[[2]]();
    getline([[3]], name);
    cout << roll << ": " << name;`), input: '17\nSara Ahmed\n',
        blanks: [{ answers: ['roll'] }, { answers: ['ignore'] }, { answers: ['cin'] }],
        chips: ['roll', 'name', 'ignore', 'get', 'cin', 'cout'],
        output: '17: Sara Ahmed',
        hints: ['The Enter after `17` must be thrown away before `getline`.'],
        explain: '`cin >> roll` reads 17 and leaves the Enter. `cin.ignore()` throws that Enter away, so `getline(cin, name)` reads the whole second line, spaces included: `Sara Ahmed`.' },
    ],
  },
};

export const unit3: Unit = {
  id: 'u3',
  num: 3,
  title: 'Input with cin',
  summary: 'Let the user type values into your program: numbers, words and whole lines.',
  levels: [L10, L11, L12, C3],
};
