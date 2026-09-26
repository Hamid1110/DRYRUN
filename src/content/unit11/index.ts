import type { Level, Unit } from '../types';
import { cpp, progF } from '../helpers';

// Shared struct definitions (the `top` part of progF). Line numbers: the struct starts on line 4.
const STUDENT3 = cpp`
struct Student {
    string name;
    int age;
    double gpa;
};`;

const STUDENT_MARKS = cpp`
struct Student {
    string name;
    int marks;
};`;

// ------------------------------------------------------------------ Level: struct basics
const LS1: Level = {
  id: 'struct-basics',
  kind: 'lesson',
  title: 'struct: one name for many values',
  tagline: 'A student has a name, an age and a GPA. A `struct` puts all three into ONE box that you can pass around, copy and store in arrays.',
  minutes: 25,
  objectives: [
    'You can define a `struct` (and never forget the `;` after `}`)',
    'You can create struct variables, fill them with `{…}` and read fields with the dot `.`',
    'You can copy a whole struct with `=` and put a struct inside another struct',
  ],
  learn: [
    { t: 'p', text: 'Think of a student ID card. It has several boxes: **name**, **age**, **GPA**. They belong together. Without a struct you need three separate variables for every student — `name1`, `age1`, `gpa1`, `name2`, `age2`, … For 30 students that is **90** variables, and nothing tells C++ that `age7` belongs to `name7`. A `struct` lets you design your own type — the card — and then make as many cards as you like.' },
    { t: 'syntax', title: 'Defining a struct', code: 'struct Student {\n    string name;\n    int age;\n    double gpa;\n};', parts: [
      { token: 'struct', text: 'the keyword: "I am making a new type"' },
      { token: 'Student', text: 'the name of your new type. Start it with a capital letter' },
      { token: 'string name; int age; double gpa;', text: 'the **fields** (members): the boxes inside every Student' },
      { token: '};', text: 'the closing brace **and a semicolon**. The `;` is required!' },
    ] },
    { t: 'viz', title: 'Two Student cards and the dot operator', code: progF(STUDENT3, cpp`
    Student s1;
    s1.name = "Ayesha";
    s1.age = 19;
    s1.gpa = 3.6;
    Student s2 = {"Bilal", 20, 3.1};
    cout << s1.name << " is " << s1.age << ", GPA " << s1.gpa << endl;
    cout << s2.name << " is " << s2.age << ", GPA " << s2.gpa << endl;`) },
    { t: 'callout', tone: 'key', title: 'Blueprint vs. variable', text: 'The `struct Student {…};` part is only a **blueprint**: it creates no memory. `Student s1;` makes a real box with three smaller boxes inside. Read `s1.age` as *"the age of s1"*. `{"Bilal", 20, 3.1}` fills the fields **in the order they are written** in the struct.' },
    { t: 'callout', tone: 'warn', title: 'The forgotten semicolon', text: 'A struct definition ends with `};` — not `}`. Without the `;` g++ says *expected \';\' after struct definition*. (Function bodies and loops do NOT need it; structs do.)' },
    { t: 'viz', title: 'Default values and copying a whole struct', code: progF(cpp`
struct Account {
    string owner;
    double balance = 0;
    string city = "Lahore";
};`, cpp`
    Account a;
    a.owner = "Hamza";
    Account b = a;
    b.owner = "Zara";
    b.balance = 500;
    cout << a.owner << " " << a.balance << " " << a.city << endl;
    cout << b.owner << " " << b.balance << " " << b.city << endl;`) },
    { t: 'viz', title: 'A struct inside a struct: Date inside Employee', code: progF(cpp`
struct Date {
    int day;
    int month;
    int year;
};

struct Employee {
    string name;
    Date joined;
    double salary;
};`, cpp`
    Employee e = {"Kamran", {15, 8, 2021}, 85000};
    e.joined.year = 2022;
    e.salary = e.salary + 5000;
    cout << e.name << " joined on " << e.joined.day << "/" << e.joined.month << "/" << e.joined.year << endl;
    cout << "Salary: " << e.salary << endl;`) },
    { t: 'compare', items: [
      { title: 'Printing the whole struct', good: false, code: progF(STUDENT3, cpp`
    Student s = {"Ali", 18, 3.2};
    cout << s;`), note: 'Does not compile: cout does not know how to print a Student.' },
      { title: 'Print field by field', good: true, code: progF(STUDENT3, cpp`
    Student s = {"Ali", 18, 3.2};
    cout << s.name << " " << s.age << " " << s.gpa;`), note: 'You decide the format.' },
    ] },
  ],
  ways: {
    goal: 'Make a Student with name `Ayesha`, age `19`, GPA `3.6` and print `Ayesha 19 3.6`.',
    items: [
      { title: 'Declare, then set each field', code: progF(STUDENT3, cpp`
    Student s;
    s.name = "Ayesha";
    s.age = 19;
    s.gpa = 3.6;
    cout << s.name << " " << s.age << " " << s.gpa;`), note: 'Clear and simple. Fields are empty (garbage for int/double) until you set them.' },
      { title: 'Brace initialisation with =', code: progF(STUDENT3, cpp`
    Student s = {"Ayesha", 19, 3.6};
    cout << s.name << " " << s.age << " " << s.gpa;`), note: 'Values go into the fields in order: name, age, gpa.' },
      { title: 'Brace initialisation without =', code: progF(STUDENT3, cpp`
    Student s{"Ayesha", 19, 3.6};
    cout << s.name << " " << s.age << " " << s.gpa;`), note: 'Modern C++ style, same meaning.' },
      { title: 'Copy a ready-made struct', code: progF(STUDENT3, cpp`
    Student first = {"Ayesha", 19, 3.6};
    Student s = first;
    cout << s.name << " " << s.age << " " << s.gpa;`), note: '`=` copies ALL fields at once.' },
      { title: 'Read the fields from input', code: progF(STUDENT3, cpp`
    Student s;
    cin >> s.name >> s.age >> s.gpa;
    cout << s.name << " " << s.age << " " << s.gpa;`), input: 'Ayesha 19 3.6\n', note: 'Each field is an ordinary variable, so `cin >>` works on it.' },
    ],
    takeaway: 'A field like `s.age` behaves exactly like a normal `int` variable. Fill fields one by one, all at once with `{…}`, by copying, or from `cin`.',
    check: { id: 'struct-basics-ways-check', kind: 'mcq', prompt: 'Which line does NOT correctly create Ayesha (name, age, gpa)?', options: ['`Student s = {19, "Ayesha", 3.6};`', '`Student s = {"Ayesha", 19, 3.6};`', '`Student s{"Ayesha", 19, 3.6};`', '`Student s; s.name = "Ayesha"; s.age = 19; s.gpa = 3.6;`'], answer: 0, hints: ['Look at the order of the fields in the struct.'], explain: 'The values fill the fields in order. `19` cannot go into `string name`, so this does not compile.' },
  },
  watch: [
    { title: 'Reading a whole record with getline and cin', intro: 'The name has a space, so it needs `getline`. After `cin >>` we call `cin.ignore()` before the next `getline`.', code: progF(STUDENT3, cpp`
    Student s;
    cout << "Name: ";
    getline(cin, s.name);
    cout << "Age and GPA: ";
    cin >> s.age >> s.gpa;
    cin.ignore();
    string city;
    cout << "City: ";
    getline(cin, city);
    cout << s.name << " (" << s.age << ") GPA " << s.gpa << " from " << city << endl;`), input: 'Ali Raza\n19 3.4\nDera Ghazi Khan\n' },
    { title: 'Swapping two records with a temp struct', intro: 'The same 3-step swap as with ints — but each step moves a whole record.', code: progF(cpp`
struct Player {
    string name;
    int runs;
};`, cpp`
    Player a = {"Babar", 56};
    Player b = {"Rizwan", 71};
    Player temp = a;
    a = b;
    b = temp;
    cout << a.name << " " << a.runs << endl;
    cout << b.name << " " << b.runs << endl;`) },
  ],
  think: {
    title: 'A cricket player card',
    problem: 'Read a batter\'s name, runs and balls faced. Keep them together in one record and print the **strike rate** = runs × 100 ÷ balls.',
    steps: [
      { text: 'Three facts about one player → design a type `Player` with three fields.', lines: [4, 5, 6, 7, 8] },
      { text: 'Make one Player variable.', lines: [11] },
      { text: 'Read straight into the fields with `cin`.', lines: [12] },
      { text: 'Compute: use `100.0` so the division is not an integer division.', lines: [13] },
      { text: 'Print using the fields.', lines: [14] },
    ],
    code: progF(cpp`
struct Player {
    string name;
    int runs;
    int balls;
};`, cpp`
    Player p;
    cin >> p.name >> p.runs >> p.balls;
    double sr = p.runs * 100.0 / p.balls;
    cout << p.name << " strike rate: " << sr << endl;`),
    input: 'Babar 75 50\n',
    why: 'The record keeps name, runs and balls together. Later (next level) we can put 11 of these cards in an array to hold a whole team.',
    yourTurn: {
      id: 'struct-basics-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the input `Rizwan 45 60`. Fill in each field when it changes.',
      code: progF(cpp`
struct Player {
    string name;
    int runs;
    int balls;
};`, cpp`
    Player p;
    cin >> p.name >> p.runs >> p.balls;
    double sr = p.runs * 100.0 / p.balls;
    cout << p.name << " strike rate: " << sr << endl;`),
      input: 'Rizwan 45 60\n',
      vars: ['p.name', 'p.runs', 'p.balls', 'sr'],
      hints: ['`cin` fills the fields from left to right.', '45 × 100.0 = 4500, and 4500 ÷ 60 = 75.'],
      explain: 'name = Rizwan, runs = 45, balls = 60, then sr = 75. Output: `Rizwan strike rate: 75`.',
    },
  },
  practice: [
    { id: 'struct-basics-q1', kind: 'mcq', prompt: 'A program contains only the definition `struct Book { string title; int pages; };` and no variables. How many Book boxes exist in memory?', options: ['None — a struct definition is only a blueprint', 'One', 'Two — one for each field', 'It depends on the number of pages'], answer: 0, hints: ['Does `int;` alone create an int variable?'], explain: 'The definition only describes the type. Memory appears when you create a variable: `Book b;`.' },
    { id: 'struct-basics-q2', kind: 'bug', prompt: 'This does not compile. Find the line g++ complains about.', code: progF(cpp`
struct Book {
    string title;
    int pages;
}`, cpp`
    Book b = {"Raja Gidh", 400};
    cout << b.title << " has " << b.pages << " pages";`), bugLine: 7, options: ['Add `;` after the closing `}` of the struct', 'Change `struct` to `class`', 'Put quotes around 400', 'Add `()` after `Book`'], answer: 0, fixed: progF(cpp`
struct Book {
    string title;
    int pages;
};`, cpp`
    Book b = {"Raja Gidh", 400};
    cout << b.title << " has " << b.pages << " pages";`), hints: ['Look at how the struct definition ends.', 'Structs end with `};`.'], explain: 'g++: *expected \';\' after struct definition*. A struct definition always ends with `};`.' },
    { id: 'struct-basics-q3', kind: 'predict', tag: 'tricky', prompt: 'Predict the output. Remember: `b = a` makes a **copy**.', code: progF(cpp`
struct Point {
    int x;
    int y;
};`, cpp`
    Point a = {2, 3};
    Point b = a;
    b.x = 10;
    a.y = a.y + b.x;
    cout << a.x << " " << a.y << " " << b.x << " " << b.y;`), hints: ['After line 11, b has its own x and y: 2 and 3.', 'Changing b.x does not change a.x.'], explain: 'a = (2, 3), b = copy (2, 3). b.x becomes 10. a.y = 3 + 10 = 13. Output `2 13 10 3`.' },
    { id: 'struct-basics-q4', kind: 'blanks', prompt: 'Complete the program so it prints `Price: 850`.', code: progF(cpp`
[[1]] Book {
    string title;
    int price;
}[[2]]`, cpp`
    Book b = {"Peer-e-Kamil", 850};
    cout << "Price: " << b[[3]]price;`), blanks: [{ answers: ['struct'] }, { answers: [';'] }, { answers: ['.'] }], chips: ['struct', 'class', ';', ':', '.', '->'], output: 'Price: 850', hints: ['Which keyword starts a new record type?', 'What comes after the `}` of a struct?'], explain: '`struct Book { … };` and then `b.price` with the dot operator.' },
    { id: 'struct-basics-q5', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'A shop item with an expiry date inside it. Fill in the fields as they change.', code: progF(cpp`
struct Date {
    int day;
    int month;
};

struct Item {
    string name;
    Date expiry;
    int qty = 10;
};`, cpp`
    Item it;
    it.name = "Milk";
    it.expiry.day = 28;
    it.expiry.month = 3;
    it.qty -= 3;
    it.expiry.day++;
    cout << it.name << " x" << it.qty << " expires " << it.expiry.day << "/" << it.expiry.month;`), vars: ['it.qty', 'it.expiry.day', 'it.expiry.month'], given: [0], hints: ['`qty` starts at 10 because of the default value in the struct.', 'Use two dots to reach a field inside a field: `it.expiry.day`.'], explain: 'qty 10 → 7; day 28 → 29; month 3. Output: `Milk x7 expires 29/3`.' },
    { id: 'struct-basics-q6', kind: 'bug', prompt: 'This does not compile. Find the line.', code: progF(STUDENT3, cpp`
    Student s = {"Hina", 20, 3.8};
    s.gpa = s.gpa - 0.1;
    cout << s.Name << " " << s.gpa;`), bugLine: 13, options: ['The field is called `name`, not `Name` — C++ is case-sensitive', 'You cannot subtract from a double field', 'Use `->` instead of `.`', 'The struct needs a constructor'], answer: 0, fixed: progF(STUDENT3, cpp`
    Student s = {"Hina", 20, 3.8};
    s.gpa = s.gpa - 0.1;
    cout << s.name << " " << s.gpa;`), hints: ['Compare the field names in the struct with the ones used in main.'], explain: 'g++: *\'struct Student\' has no member named \'Name\'; did you mean \'name\'?*' },
    { id: 'struct-basics-q7', kind: 'bug', prompt: 'The programmer wants to print the whole record. Find the line that does not compile.', code: progF(cpp`
struct Car {
    string brand;
    int year;
};`, cpp`
    Car c = {"Suzuki", 2019};
    cout << "My car: ";
    cout << c << endl;`), bugLine: 11, options: ['cout cannot print a whole struct — print `c.brand` and `c.year`', 'Use `endl` before `c`', 'Put `c` in quotes', 'The year must be a string'], answer: 0, fixed: progF(cpp`
struct Car {
    string brand;
    int year;
};`, cpp`
    Car c = {"Suzuki", 2019};
    cout << "My car: ";
    cout << c.brand << " " << c.year << endl;`), hints: ['cout knows ints, doubles, strings… does it know *your* type?'], explain: 'g++: *no match for \'operator<<\'*. cout only knows built-in types. Print the fields one by one.' },
    { id: 'struct-basics-q8', kind: 'parsons', prompt: 'Build a program that stores a car and prints `Honda 2021`.', lines: ['#include <iostream>', 'using namespace std;', 'struct Car {', '    string brand;', '    int year;', '};', 'int main() {', '    Car c;', '    c.brand = "Honda";', '    c.year = 2021;', '    cout << c.brand << " " << c.year;', '    return 0;', '}'], distractors: ['    Car.year = 2021;', '    c->year = 2021;'], hints: ['Define the struct before main.', 'Set the fields of the variable `c`, not of the type `Car`.'], explain: 'The struct comes first, then a variable `c`, then its fields with the dot.' },
  ],
  cheatsheet: [
    { code: 'struct T { int a; string b; };', text: 'define a new type — note the `;` at the end' },
    { code: 'T x = {5, "hi"};', text: 'create and fill in field order' },
    { code: 'x.a = 7;  x.inner.day', text: 'dot operator; two dots for a struct inside a struct' },
    { code: 'T y = x;', text: 'copies every field; y is independent of x' },
  ],
};

// ------------------------------------------------------------------ Level: arrays of structs
const LS2: Level = {
  id: 'struct-arrays',
  kind: 'lesson',
  title: 'Arrays of structs: tables of records',
  tagline: 'One struct is one row. An array of structs is the whole table — a class list, a shopping cart, a cricket team.',
  minutes: 30,
  objectives: [
    'You can create and loop over an array of structs using `list[i].field`',
    'You can find the topper, a total, an average and search by name',
    'You can sort records by one field, swapping **whole** structs',
  ],
  learn: [
    { t: 'p', text: 'A register in school has one **row** per student and one **column** per fact (name, marks). In C++ a row is a struct and the register is an **array of structs**. `cls[1]` is the whole second row; `cls[1].marks` is one cell in that row.' },
    { t: 'viz', title: 'A class list', code: progF(STUDENT_MARKS, cpp`
    Student cls[3] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}};
    for (int i = 0; i < 3; i++) {
        cout << cls[i].name << ": " << cls[i].marks << endl;
    }`) },
    { t: 'callout', tone: 'key', title: 'Read it left to right', text: '`cls[i].marks` → take array `cls`, pick box number `i`, then take its `marks`. First the index, then the dot. `cls.marks[i]` is wrong — the array has no field called marks; each element does.' },
    { t: 'compare', items: [
      { title: 'Parallel arrays', good: true, code: progF('const int N = 3;', cpp`
    string names[N] = {"Ali", "Sara", "Umar"};
    int marks[N] = {72, 88, 65};
    cout << names[1] << " " << marks[1];`), note: 'Works, but nothing ties `names[1]` to `marks[1]`. Sort one array and forget the other → the data is mixed up.' },
      { title: 'Array of structs', good: true, code: progF(STUDENT_MARKS, cpp`
    Student cls[3] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}};
    cout << cls[1].name << " " << cls[1].marks;`), note: 'Name and marks travel together. Move one struct and the whole record moves.' },
    ] },
    { t: 'h', text: 'Find the topper' },
    { t: 'viz', title: 'Remember WHERE the best one is', code: progF(STUDENT_MARKS, cpp`
    Student cls[4] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}, {"Hina", 91}};
    int best = 0;
    for (int i = 1; i < 4; i++) {
        if (cls[i].marks > cls[best].marks) {
            best = i;
        }
    }
    cout << "Topper: " << cls[best].name << " (" << cls[best].marks << ")" << endl;`) },
    { t: 'callout', tone: 'tip', title: 'Keep the index, not only the value', text: 'If you store only the highest marks (91), you lose the name. Store the **index** `best`: then `cls[best]` gives you the whole record — name, marks, everything. The loop compares `3` times for 4 students.' },
    { t: 'callout', tone: 'warn', title: 'Sorting records', text: 'When you sort by marks, swap the **whole struct** (`Student temp = cls[j];`), not just the marks. Swapping only marks gives Ali someone else\'s marks! See the second demo in *Watch*.' },
  ],
  ways: {
    goal: 'Four students have 72, 88, 65 and 91 marks. Print the average: `79`.',
    items: [
      { title: 'Index loop', code: progF(STUDENT_MARKS, cpp`
    Student cls[4] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}, {"Hina", 91}};
    int sum = 0;
    for (int i = 0; i < 4; i++) {
        sum += cls[i].marks;
    }
    cout << sum / 4.0;`) },
      { title: 'Range-for (copies each record)', code: progF(STUDENT_MARKS, cpp`
    Student cls[4] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}, {"Hina", 91}};
    int sum = 0;
    for (Student s : cls) {
        sum += s.marks;
    }
    cout << sum / 4.0;`), note: '`s` is a copy of each element in turn.' },
      { title: 'Range-for with const reference', code: progF(STUDENT_MARKS, cpp`
    Student cls[4] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}, {"Hina", 91}};
    int sum = 0;
    for (const Student &s : cls) {
        sum += s.marks;
    }
    cout << sum / 4.0;`), note: 'No copies: `s` is another name for each element, and `const` promises not to change it.' },
      { title: 'Size from sizeof', code: progF(STUDENT_MARKS, cpp`
    Student cls[] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}, {"Hina", 91}};
    int n = sizeof(cls) / sizeof(cls[0]);
    double sum = 0;
    for (int i = 0; i < n; i++) {
        sum += cls[i].marks;
    }
    cout << sum / n;`), note: 'The count is computed, so adding a fifth student needs no other change.' },
      { title: 'while loop', code: progF(STUDENT_MARKS, cpp`
    Student cls[4] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}, {"Hina", 91}};
    int sum = 0, i = 0;
    while (i < 4) {
        sum += cls[i].marks;
        i++;
    }
    cout << (double) sum / 4;`) },
    ],
    takeaway: 'Every version visits each record once and adds its `marks`. The loop style changes; `…marks` stays the same.',
    check: { id: 'struct-arrays-ways-check', kind: 'mcq', prompt: 'Which loop does NOT add up all four marks correctly?', options: ['`for (int i = 1; i <= 4; i++) sum += cls[i].marks;`', '`for (int i = 0; i < 4; i++) sum += cls[i].marks;`', '`for (Student s : cls) sum += s.marks;`', '`for (const Student &s : cls) sum += s.marks;`'], answer: 0, hints: ['What are the valid indexes of a 4-element array?'], explain: 'Indexes are 0…3. Starting at 1 skips Ali, and `cls[4]` is outside the array (undefined behaviour).' },
  },
  watch: [
    { title: 'Shopping cart bill', intro: 'Each item has a price and a quantity. The bill adds price × qty for every row.', code: progF(cpp`
struct Item {
    string name;
    double price;
    int qty;
};`, cpp`
    Item cart[3] = {{"Milk", 180, 2}, {"Bread", 120, 1}, {"Eggs", 25, 12}};
    double total = 0;
    for (int i = 0; i < 3; i++) {
        double cost = cart[i].price * cart[i].qty;
        cout << cart[i].name << ": " << cost << endl;
        total += cost;
    }
    cout << "Total bill: Rs " << total << endl;`) },
    { title: 'Rank list: bubble sort by marks (high to low)', intro: 'Watch the swap: three lines move a whole record. How many times does the `if` compare? 3 + 2 + 1 = 6.', code: progF(STUDENT_MARKS, cpp`
    Student cls[4] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}, {"Hina", 91}};
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3 - i; j++) {
            if (cls[j].marks < cls[j + 1].marks) {
                Student temp = cls[j];
                cls[j] = cls[j + 1];
                cls[j + 1] = temp;
            }
        }
    }
    for (int i = 0; i < 4; i++) {
        cout << i + 1 << ". " << cls[i].name << " " << cls[i].marks << endl;
    }`) },
  ],
  think: {
    title: 'Search the class list by name',
    problem: 'Read a name. If that student is in the list, print their marks; otherwise print `not found`.',
    steps: [
      { text: 'The data: an array of 4 Student records.', lines: [10] },
      { text: 'Read the name to look for.', lines: [11, 12] },
      { text: 'Start with `pos = -1`, which means "not found yet".', lines: [13] },
      { text: 'Check every record: does its `name` equal the key?', lines: [14, 15] },
      { text: 'If yes, remember the index and stop searching.', lines: [16, 17] },
      { text: 'After the loop, `pos` tells us what happened.', lines: [20, 21, 22, 23] },
    ],
    code: progF(STUDENT_MARKS, cpp`
    Student cls[4] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}, {"Hina", 91}};
    string key;
    cin >> key;
    int pos = -1;
    for (int i = 0; i < 4; i++) {
        if (cls[i].name == key) {
            pos = i;
            break;
        }
    }
    if (pos == -1) {
        cout << key << " not found" << endl;
    } else {
        cout << key << " got " << cls[pos].marks << endl;
    }`),
    input: 'Umar\n',
    why: '`-1` can never be a real index, so it is a safe "not found" signal. `break` stops the loop early — for Umar the loop runs only 3 times instead of 4.',
    yourTurn: {
      id: 'struct-arrays-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the input `Zain`. How many times does the `if` run?',
      code: progF(STUDENT_MARKS, cpp`
    Student cls[4] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}, {"Hina", 91}};
    string key;
    cin >> key;
    int pos = -1;
    for (int i = 0; i < 4; i++) {
        if (cls[i].name == key) {
            pos = i;
            break;
        }
    }
    if (pos == -1) {
        cout << key << " not found" << endl;
    } else {
        cout << key << " got " << cls[pos].marks << endl;
    }`),
      input: 'Zain\n',
      vars: ['key', 'pos', 'i'],
      hints: ['Zain is not in the list, so every `if` is false.', 'The loop stops when `i` becomes 4.'],
      explain: 'All 4 comparisons are false, `pos` stays -1 → `Zain not found`.',
    },
  },
  practice: [
    { id: 'struct-arrays-q1', kind: 'predict', prompt: 'Predict the output.', code: progF(STUDENT_MARKS, cpp`
    Student cls[5] = {{"Ali", 45}, {"Sara", 88}, {"Umar", 50}, {"Hina", 91}, {"Zain", 38}};
    int passed = 0;
    for (int i = 0; i < 5; i++) {
        if (cls[i].marks >= 50) {
            cout << cls[i].name << endl;
            passed++;
        }
    }
    cout << passed << " passed";`), hints: ['50 >= 50 is true.'], explain: 'Sara, Umar (exactly 50) and Hina pass → 3 names, then `3 passed`.' },
    { id: 'struct-arrays-q2', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'Find the hottest city. Dry run: fill in `i` and `hot` (the index of the hottest city so far).', code: progF(cpp`
struct City {
    string name;
    int temp;
};`, cpp`
    City c[4] = {{"Lahore", 41}, {"Karachi", 36}, {"Jacobabad", 49}, {"Quetta", 30}};
    int hot = 0;
    for (int i = 1; i < 4; i++) {
        if (c[i].temp > c[hot].temp) {
            hot = i;
        }
    }
    cout << c[hot].name << " " << c[hot].temp;`), vars: ['i', 'hot'], hints: ['Compare with `c[hot].temp`, the best so far, not with the previous city.'], explain: '36 > 41 no; 49 > 41 yes → hot = 2; 30 > 49 no. Output `Jacobabad 49`.' },
    { id: 'struct-arrays-q3', kind: 'blanks', tag: 'real life', prompt: 'Complete the stationery bill. It should print `1800`.', code: progF(cpp`
struct Item {
    string name;
    int price;
    int qty;
};`, cpp`
    Item cart[3] = {{"Pen", 30, 4}, {"Copy", 90, 2}, {"Bag", 1500, 1}};
    int total = 0;
    for (int i = 0; i < [[1]]; i++) {
        total += cart[i].[[2]] * cart[i].[[3]];
    }
    cout << total;`), blanks: [{ answers: ['3'] }, { answers: ['price', 'qty'] }, { answers: ['qty', 'price'] }], chips: ['3', '4', 'price', 'qty', 'name'], output: '1800', hints: ['The cart has 3 items.', 'Cost of one row = price × quantity.'], explain: '120 + 180 + 1500 = 1800.' },
    { id: 'struct-arrays-q4', kind: 'bug', tag: 'tricky', prompt: 'After sorting, Ali shows 90 marks — but Sara scored 90! Find the wrong line.', code: progF(STUDENT_MARKS, cpp`
    Student cls[3] = {{"Ali", 60}, {"Sara", 90}, {"Umar", 75}};
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2 - i; j++) {
            if (cls[j].marks < cls[j + 1].marks) {
                int temp = cls[j].marks;
                cls[j].marks = cls[j + 1].marks;
                cls[j + 1].marks = temp;
            }
        }
    }
    for (int i = 0; i < 3; i++) {
        cout << cls[i].name << " " << cls[i].marks << endl;
    }`), bugLine: 14, options: ['Only the marks are swapped — swap the whole struct: `Student temp = cls[j];`', 'The outer loop should run 3 times', 'Use `>` instead of `<`', 'The array must be sorted by name first'], answer: 0, fixed: progF(STUDENT_MARKS, cpp`
    Student cls[3] = {{"Ali", 60}, {"Sara", 90}, {"Umar", 75}};
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2 - i; j++) {
            if (cls[j].marks < cls[j + 1].marks) {
                Student temp = cls[j];
                cls[j] = cls[j + 1];
                cls[j + 1] = temp;
            }
        }
    }
    for (int i = 0; i < 3; i++) {
        cout << cls[i].name << " " << cls[i].marks << endl;
    }`), hints: ['The marks end up in the right order. What about the names?'], explain: 'The names never move, so marks get attached to the wrong people. Swap the whole record and the name moves with its marks.' },
    { id: 'struct-arrays-q5', kind: 'mcq', prompt: 'Bubble sort on **5** records uses `for (i = 0; i < 4; i++)` and `for (j = 0; j < 4 - i; j++)`. How many times does the comparison `cls[j].marks < cls[j + 1].marks` run?', options: ['10', '20', '25', '4'], answer: 0, hints: ['Count the inner loop for i = 0, 1, 2, 3.'], explain: '4 + 3 + 2 + 1 = 10 comparisons, whatever the data is.' },
    { id: 'struct-arrays-q6', kind: 'paths', tag: 'real life', prompt: 'A general store checks its stock. Find an input (a product name) for every message.', code: progF(cpp`
struct Product {
    string name;
    int qty;
};`, cpp`
    Product stock[3] = {{"Sugar", 12}, {"Flour", 0}, {"Oil", 5}};
    string want;
    cin >> want;
    int pos = -1;
    for (int i = 0; i < 3; i++) {
        if (stock[i].name == want) {
            pos = i;
        }
    }
    if (pos == -1) {
        cout << "No such product";
    } else if (stock[pos].qty == 0) {
        cout << want << " is out of stock";
    } else {
        cout << want << ": " << stock[pos].qty << " left";
    }`), paths: [{ label: '`No such product`', line: 21 }, { label: 'out of stock', line: 23 }, { label: 'items left', line: 25 }], start: 'Rice', hints: ['Names are case-sensitive: type them exactly as in the list.', 'Which product has qty 0?'], explain: '`Rice` (not in the list), `Flour` (qty 0), and `Sugar` or `Oil`.' },
    { id: 'struct-arrays-q7', kind: 'parsons', tag: 'real life', prompt: 'Arrange the program that prints the total runs of the team: `Total: 139`.', lines: ['#include <iostream>', 'using namespace std;', 'struct Player {', '    string name;', '    int runs;', '};', 'int main() {', '    Player team[3] = {{"Babar", 56}, {"Rizwan", 71}, {"Fakhar", 12}};', '    int total = 0;', '    for (int i = 0; i < 3; i++) {', '        total += team[i].runs;', '    }', '    cout << "Total: " << total;', '    return 0;', '}'], distractors: ['        total += team.runs[i];', '    for (int i = 0; i <= 3; i++) {'], hints: ['First the index, then the field.'], explain: '`team[i].runs` — pick the player, then the field. `i < 3` visits indexes 0, 1, 2.' },
    { id: 'struct-arrays-q8', kind: 'mcq', tag: 'tricky', prompt: 'What does `cls[2].name[0]` give?', code: progF(STUDENT_MARKS, cpp`
    Student cls[3] = {{"Ali", 72}, {"Sara", 88}, {"Umar", 65}};
    cout << cls[2].name[0];`), options: ["`'U'` — the first letter of the third student's name", "`'S'`", '`"Ali"`', 'It does not compile'], answer: 0, hints: ['Read left to right: element 2, its name, character 0.'], explain: '`cls[2]` is Umar\'s record, `.name` is "Umar", `[0]` is `U`.' },
  ],
  cheatsheet: [
    { code: 'Student cls[3] = {{"Ali", 72}, …};', text: 'an array of records, one `{…}` per element' },
    { code: 'cls[i].marks', text: 'first the index, then the field' },
    { code: 'int best = 0; … if (cls[i].x > cls[best].x) best = i;', text: 'keep the index of the best record' },
    { code: 'Student t = a[j]; a[j] = a[j+1]; a[j+1] = t;', text: 'swap whole records when sorting' },
  ],
};

// ------------------------------------------------------------------ Level: structs and functions
const LS3: Level = {
  id: 'struct-functions',
  kind: 'lesson',
  title: 'Structs and functions',
  tagline: 'Hand a whole record to a function in one go — as a copy, as the original (`&`), or read-only (`const &`) — and get a whole record back.',
  minutes: 30,
  objectives: [
    'You can choose between by value, by reference and by const reference',
    'You can return a struct from a function (e.g. `makePoint`, `midpoint`)',
    'You can write helper functions like `printRecord` and `updateRecord`',
  ],
  learn: [
    { t: 'p', text: 'A struct is passed to a function just like an `int` — but a struct can be big (strings, arrays…). So *how* you pass it matters for two reasons: **can the function change the original?** and **is a copy made?**' },
    { t: 'table', head: ['Parameter', 'Copy made?', 'Changes the original?', 'Use it for'], rows: [
      ['`Student s`', 'yes — the whole record', 'no', 'small structs you want to play with locally'],
      ['`Student &s`', 'no', '**yes**', 'update functions: `updateRecord`, `deposit`'],
      ['`const Student &s`', 'no', 'no — the compiler forbids it', 'read-only functions: `printRecord` (fast AND safe)'],
    ] },
    { t: 'viz', title: 'By value changes a copy; by reference changes the original', code: progF(cpp`
struct Account {
    string owner;
    double balance;
};

void depositCopy(Account a, double amt) {
    a.balance += amt;
}

void deposit(Account &a, double amt) {
    a.balance += amt;
}`, cpp`
    Account acc = {"Hina", 1000};
    depositCopy(acc, 500);
    cout << "After depositCopy: " << acc.balance << endl;
    deposit(acc, 500);
    cout << "After deposit: " << acc.balance << endl;`) },
    { t: 'callout', tone: 'warn', title: 'The forgotten &', text: 'In `depositCopy` the 500 goes into a **copy** that is thrown away when the function ends. The customer loses the money! If a function must change the record, write `&`.' },
    { t: 'callout', tone: 'key', title: 'const & = fast and safe', text: '`void printRecord(const Student &s)` — no copy is made (fast, even for big records), and if you accidentally write `s.marks = 0;` inside, the program does not compile.' },
    { t: 'viz', title: 'Returning a struct: makePoint and midpoint', code: progF(cpp`
struct Point {
    double x;
    double y;
};

Point makePoint(double x, double y) {
    Point p;
    p.x = x;
    p.y = y;
    return p;
}

Point midpoint(Point a, Point b) {
    Point m = {(a.x + b.x) / 2, (a.y + b.y) / 2};
    return m;
}`, cpp`
    Point a = makePoint(0, 0);
    Point b = makePoint(6, 5);
    Point m = midpoint(a, b);
    cout << "Midpoint: (" << m.x << ", " << m.y << ")" << endl;`) },
    { t: 'callout', tone: 'tip', title: 'Two answers from one function', text: 'A function can `return` only one thing — but that one thing can be a struct with two (or ten) fields. A `Point` returns x AND y together.' },
    { t: 'compare', items: [
      { title: 'Changing a const & parameter', good: false, code: progF(cpp`
struct Student {
    string name;
    int marks;
};

void show(const Student &s) {
    s.marks = 100;
    cout << s.name << " " << s.marks;
}`, cpp`
    Student st = {"Ali", 70};
    show(st);`), note: 'Compile error: *assignment of member \'marks\' in read-only object*.' },
      { title: 'Read only, as promised', good: true, code: progF(cpp`
struct Student {
    string name;
    int marks;
};

void show(const Student &s) {
    cout << s.name << " " << s.marks;
}`, cpp`
    Student st = {"Ali", 70};
    show(st);`) },
    ] },
  ],
  ways: {
    goal: 'Give Ahmed (70 marks) 5 bonus marks with a function, then print `Ahmed 75`.',
    items: [
      { title: 'Pass by reference', code: progF(cpp`
struct Student {
    string name;
    int marks;
};

void addBonus(Student &s) {
    s.marks += 5;
}`, cpp`
    Student st = {"Ahmed", 70};
    addBonus(st);
    cout << st.name << " " << st.marks;`), note: 'The function works on the original record.' },
      { title: 'Pass a copy, return the new record', code: progF(cpp`
struct Student {
    string name;
    int marks;
};

Student addBonus(Student s) {
    s.marks += 5;
    return s;
}`, cpp`
    Student st = {"Ahmed", 70};
    st = addBonus(st);
    cout << st.name << " " << st.marks;`), note: 'Works too, but two copies are made. Do not forget `st = …`!' },
      { title: 'Pass a pointer (next level)', code: progF(cpp`
struct Student {
    string name;
    int marks;
};

void addBonus(Student* p) {
    p->marks += 5;
}`, cpp`
    Student st = {"Ahmed", 70};
    addBonus(&st);
    cout << st.name << " " << st.marks;`), note: 'Send the address with `&st`; reach the field with `->`.' },
      { title: 'Pass only the field by reference', code: progF(cpp`
struct Student {
    string name;
    int marks;
};

void addBonus(int &m) {
    m += 5;
}`, cpp`
    Student st = {"Ahmed", 70};
    addBonus(st.marks);
    cout << st.name << " " << st.marks;`), note: '`st.marks` is an ordinary int, so an `int &` can refer to it.' },
    ],
    takeaway: 'To change a record inside a function you need a reference, a pointer, or a returned copy that you store back.',
    check: { id: 'struct-functions-ways-check', kind: 'mcq', prompt: 'With `addBonus(st);` in main, which function does NOT change `st`?', options: ['`void addBonus(Student s) { s.marks += 5; }`', '`void addBonus(Student &s) { s.marks += 5; }`', '`void addBonus(Student &s) { s.marks = s.marks + 5; }`', '`void addBonus(Student &s) { s.marks++; s.marks += 4; }`'], answer: 0, hints: ['Look for the missing `&`.'], explain: 'Without `&` the function gets a copy. The copy gets 75; `st` still has 70.' },
  },
  watch: [
    { title: 'printRecord and updateRecord helpers', intro: 'Three small helpers: one prints (const &), one updates (&), one takes the whole array.', code: progF(cpp`
struct Student {
    string name;
    int marks;
};

void printRecord(const Student &s) {
    cout << s.name << ": " << s.marks << endl;
}

void updateRecord(Student &s, int bonus) {
    s.marks += bonus;
    if (s.marks > 100) {
        s.marks = 100;
    }
}

void printAll(const Student list[], int n) {
    for (int i = 0; i < n; i++) {
        printRecord(list[i]);
    }
}`, cpp`
    Student cls[3] = {{"Ali", 72}, {"Sara", 97}, {"Umar", 65}};
    for (int i = 0; i < 3; i++) {
        updateRecord(cls[i], 5);
    }
    printAll(cls, 3);`) },
    { title: 'Returning two answers in one struct', intro: 'The coldest and hottest day of the week come back together in a `Range`.', code: progF(cpp`
struct Range {
    int low;
    int high;
};

Range findRange(const int a[], int n) {
    Range r = {a[0], a[0]};
    for (int i = 1; i < n; i++) {
        if (a[i] < r.low) {
            r.low = a[i];
        }
        if (a[i] > r.high) {
            r.high = a[i];
        }
    }
    return r;
}`, cpp`
    int temps[5] = {31, 27, 35, 29, 33};
    Range week = findRange(temps, 5);
    cout << "Coldest " << week.low << ", hottest " << week.high << endl;`) },
  ],
  think: {
    title: 'Adding two times',
    problem: 'A bus trip has two parts, each given in hours and minutes. Write a function that adds two `Time` records and returns the total, e.g. `1 45` + `2 30` = `4:15`.',
    steps: [
      { text: 'Design the record: hours and minutes.', lines: [4, 5, 6, 7] },
      { text: 'The function takes two Times and returns a Time.', lines: [9] },
      { text: 'Add hours to hours and minutes to minutes.', lines: [10, 11, 12] },
      { text: '60 minutes or more? Carry one hour.', lines: [13, 14, 15] },
      { text: 'Return the whole record.', lines: [17] },
      { text: 'In main: read both times, call the function, print.', lines: [21, 22, 23, 24] },
    ],
    code: progF(cpp`
struct Time {
    int h;
    int m;
};

Time addTime(Time a, Time b) {
    Time r;
    r.h = a.h + b.h;
    r.m = a.m + b.m;
    if (r.m >= 60) {
        r.h++;
        r.m -= 60;
    }
    return r;
}`, cpp`
    Time t1, t2;
    cin >> t1.h >> t1.m >> t2.h >> t2.m;
    Time total = addTime(t1, t2);
    cout << total.h << ":" << total.m << endl;`),
    input: '1 45 2 30\n',
    why: 'Passing by value is fine here: `Time` is tiny and the function must NOT change t1 or t2. The answer comes back as one struct with both fields.',
    yourTurn: {
      id: 'struct-functions-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with `2 50 1 25`. Fill in the fields of `r` and `total`.',
      code: progF(cpp`
struct Time {
    int h;
    int m;
};

Time addTime(Time a, Time b) {
    Time r;
    r.h = a.h + b.h;
    r.m = a.m + b.m;
    if (r.m >= 60) {
        r.h++;
        r.m -= 60;
    }
    return r;
}`, cpp`
    Time t1, t2;
    cin >> t1.h >> t1.m >> t2.h >> t2.m;
    Time total = addTime(t1, t2);
    cout << total.h << ":" << total.m << endl;`),
      input: '2 50 1 25\n',
      vars: ['r.h', 'r.m', 'total.h', 'total.m'],
      hints: ['50 + 25 = 75 minutes.', '75 ≥ 60 → one more hour, 15 minutes left.'],
      explain: 'r.h = 3, r.m = 75 → r.h = 4, r.m = 15. total gets a copy: `4:15`.',
    },
  },
  practice: [
    { id: 'struct-functions-q1', kind: 'predict', prompt: 'Predict the output.', code: progF(cpp`
struct Box {
    int w;
    int h;
};

void growW(Box b) {
    b.w *= 2;
}

void growH(Box &b) {
    b.h *= 2;
}`, cpp`
    Box x = {3, 4};
    growW(x);
    growH(x);
    cout << x.w << " " << x.h;`), hints: ['Which function has an `&`?'], explain: '`growW` doubles a copy, so w stays 3. `growH` doubles the original h → 8. Output `3 8`.' },
    { id: 'struct-functions-q2', kind: 'bug', prompt: 'The marks should become 80, but it prints `Ahmed: 55`. Find the line.', code: progF(cpp`
struct Student {
    string name;
    int marks;
};

void updateRecord(Student s, int newMarks) {
    s.marks = newMarks;
}

void printRecord(const Student &s) {
    cout << s.name << ": " << s.marks << endl;
}`, cpp`
    Student st = {"Ahmed", 55};
    updateRecord(st, 80);
    printRecord(st);`), bugLine: 9, options: ['`updateRecord` needs `Student &s` so it changes the original', '`printRecord` must not use `const`', '`newMarks` must be a double', 'Call `printRecord` before `updateRecord`'], answer: 0, fixed: progF(cpp`
struct Student {
    string name;
    int marks;
};

void updateRecord(Student &s, int newMarks) {
    s.marks = newMarks;
}

void printRecord(const Student &s) {
    cout << s.name << ": " << s.marks << endl;
}`, cpp`
    Student st = {"Ahmed", 55};
    updateRecord(st, 80);
    printRecord(st);`), hints: ['Which function is supposed to change the record?'], explain: 'Without `&`, `updateRecord` changes its own copy. Add `&` to work on `st` itself.' },
    { id: 'struct-functions-q3', kind: 'blanks', prompt: 'Complete the helpers so the program prints `Chai Rs 60`.', code: progF(cpp`
struct Item {
    string name;
    int price;
};

[[1]] makeItem(string n, int p) {
    Item it;
    it.name = n;
    it.price = p;
    [[2]] it;
}

void printItem([[3]] Item &it) {
    cout << it.name << " Rs " << it.price << endl;
}`, cpp`
    Item a = makeItem("Chai", 60);
    printItem(a);`), blanks: [{ answers: ['Item'] }, { answers: ['return'] }, { answers: ['const'] }], chips: ['Item', 'void', 'return', 'const', 'struct'], hints: ['What type does `makeItem` give back?', 'A read-only reference parameter.'], explain: '`Item makeItem(…)` returns the record; `printItem` only reads, so `const Item &`.' },
    { id: 'struct-functions-q4', kind: 'mcq', prompt: 'What happens with this function?', code: cpp`
void show(const Student &s) {
    s.marks = 100;
    cout << s.marks;
}`, options: ['It does not compile: `s` is read-only because of `const`', 'It prints 100 and changes the original', 'It prints 100 and changes only a copy', 'It crashes when it runs'], answer: 0, hints: ['What does `const` promise?'], explain: 'g++: *assignment of member \'marks\' in read-only object*. `const &` means "look, do not touch".' },
    { id: 'struct-functions-q5', kind: 'trace', mode: 'vars', tag: 'tricky', prompt: 'Dry run the midpoint function. Careful: the fields are `int`.', code: progF(cpp`
struct Point {
    int x;
    int y;
};

Point midpoint(Point a, Point b) {
    Point m;
    m.x = (a.x + b.x) / 2;
    m.y = (a.y + b.y) / 2;
    return m;
}`, cpp`
    Point p = {0, 9};
    Point q = {8, 4};
    Point c = midpoint(p, q);
    cout << c.x << " " << c.y;`), vars: ['m.x', 'm.y', 'c.x', 'c.y'], hints: ['(9 + 4) / 2 with ints is 13 / 2.'], explain: 'm.x = 8 / 2 = 4, m.y = 13 / 2 = 6 (integer division). c gets a copy → `4 6`.' },
    { id: 'struct-functions-q6', kind: 'mcq', prompt: 'A loop calls `show(cls[i])` for 5 students. How many Student **copies** are made if `show` is `void show(Student s)`, and how many if it is `void show(const Student &s)`?', options: ['5 copies, and 0 copies', '1 copy, and 1 copy', '0 copies, and 5 copies', '5 copies both times'], answer: 0, hints: ['A value parameter is a new variable made at every call.'], explain: 'By value makes a fresh copy at each of the 5 calls. `const &` just gives another name to the existing record — no copy.' },
    { id: 'struct-functions-q7', kind: 'parsons', tag: 'real life', prompt: 'A plot is 20 × 30 metres. Arrange the program that prints `Area: 600`.', lines: ['#include <iostream>', 'using namespace std;', 'struct Rect {', '    int w;', '    int h;', '};', 'int area(const Rect &r) {', '    return r.w * r.h;', '}', 'int main() {', '    Rect plot = {20, 30};', '    cout << "Area: " << area(plot);', '    return 0;', '}'], distractors: ['    return r->w * r->h;', '    cout << "Area: " << area(Rect);'], hints: ['The struct first, then the function, then main.', '`r` is a reference, not a pointer: use the dot.'], explain: 'Pass the variable `plot` (not the type) to `area`, which reads its fields with `.`.' },
    { id: 'struct-functions-q8', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: progF(cpp`
struct Player {
    string name;
    int runs;
};

void swapPlayers(Player &a, Player &b) {
    Player t = a;
    a = b;
    b = t;
}`, cpp`
    Player x = {"Babar", 50};
    Player y = {"Shaheen", 5};
    swapPlayers(x, y);
    x.runs += 10;
    cout << x.name << " " << x.runs << ", " << y.name << " " << y.runs;`), hints: ['After the swap, x holds Shaheen\'s whole record.'], explain: 'The whole records are swapped. Then x (now Shaheen, 5) gets +10. Output `Shaheen 15, Babar 50`.' },
  ],
  cheatsheet: [
    { code: 'void f(Student s)', text: 'works on a copy — the original is safe (and not updated)' },
    { code: 'void f(Student &s)', text: 'changes the original — for update functions' },
    { code: 'void f(const Student &s)', text: 'no copy, no changes — best for print/read functions' },
    { code: 'Point makePoint(…) { Point p; …; return p; }', text: 'return a whole record (several values at once)' },
  ],
};

// ------------------------------------------------------------------ Level: pointers to structs
const LS4: Level = {
  id: 'struct-pointers',
  kind: 'lesson',
  title: 'Pointers to structs and the arrow ->',
  tagline: 'A pointer can hold the address of a whole record. The arrow `p->age` reaches a field through it — and `new Student` builds records on the heap.',
  minutes: 30,
  objectives: [
    'You can use `p->field` and explain why it equals `(*p).field`',
    'You can create and free records with `new Student` / `delete` and `new Student[n]` / `delete[]`',
    'You can follow a chain of `next` pointers from node to node',
  ],
  learn: [
    { t: 'p', text: 'A pointer to a struct works like any pointer: it stores an address. The difference is that the thing at that address is a whole record, so after following the arrow you still have to pick a field. In the memory view the pointer is drawn as an **arrow** to the struct box.' },
    { t: 'viz', title: 'p points to s', code: progF(cpp`
struct Student {
    string name;
    int age;
};`, cpp`
    Student s = {"Ali", 18};
    Student* p = &s;
    cout << (*p).name << " is " << (*p).age << endl;
    p->age = 19;
    cout << s.name << " is now " << s.age << endl;`) },
    { t: 'table', head: ['Code', 'Meaning', 'OK?'], rows: [
      ['`s.age`', 'field of the struct variable `s`', '✔'],
      ['`(*p).age`', 'follow `p` to the struct, then take `age`', '✔'],
      ['`p->age`', 'short form of `(*p).age` — the normal way to write it', '✔'],
      ['`*p.age`', 'means `*(p.age)`: a pointer has no fields → compile error', '✘'],
      ['`p.age`', 'a pointer has no fields → g++: *maybe you meant to use \'->\'*', '✘'],
    ] },
    { t: 'callout', tone: 'warn', title: 'Why *p.age is wrong', text: 'The dot `.` is done **before** the star `*`. So `*p.age` asks for `p.age` first — but `p` is an address, not a record. Brackets fix it: `(*p).age`. The arrow `p->age` does the same with less typing.' },
    { t: 'viz', title: 'A record on the heap: new and delete', code: progF(cpp`
struct Student {
    string name;
    int age;
};`, cpp`
    Student* p = new Student;
    p->name = "Sana";
    p->age = 21;
    cout << p->name << " is " << p->age << endl;
    delete p;
    p = nullptr;`) },
    { t: 'callout', tone: 'warn', title: 'Every new needs a delete', text: '`new Student` makes a nameless record in the **Heap** — only `p` knows where it is. `delete p;` gives the memory back. Forget it → memory leak. Use `p` after delete → undefined behaviour. For `new Student[n]` use `delete[]`.' },
    { t: 'h', text: 'Last stop in Programming Fundamentals: from struct to class' },
    { t: 'code', caption: 'Preview only — you will write this in the OOP course (DryRun does not run classes yet).', code: cpp`
class Student {
private:
    string name;
    int marks;
public:
    void setMarks(int m) {
        if (m >= 0 && m <= 100) {
            marks = m;
        }
    }
    void print() const {
        cout << name << ": " << marks << endl;
    }
};` },
    { t: 'callout', tone: 'key', title: 'A struct is the first step towards a class', text: 'A struct groups **data**. A class groups data **and the functions that work on it** — `printRecord` and `updateRecord` move *inside* the type and become `s.print()` and `s.setMarks(80)`. `private` fields can only be changed through those functions, so nobody can store 150 marks by mistake. Everything you learned here — fields, `.`, `->`, `new`, arrays of records — you will use again with classes.' },
  ],
  ways: {
    goal: '`p` points to Ali (age 18). Change his age to 20 and print `Ali 20`.',
    items: [
      { title: 'The arrow', code: progF(cpp`
struct Student {
    string name;
    int age;
};`, cpp`
    Student s = {"Ali", 18};
    Student* p = &s;
    p->age = 20;
    cout << p->name << " " << p->age;`) },
      { title: 'Star and dot, with brackets', code: progF(cpp`
struct Student {
    string name;
    int age;
};`, cpp`
    Student s = {"Ali", 18};
    Student* p = &s;
    (*p).age = 20;
    cout << (*p).name << " " << (*p).age;`), note: 'Correct but clumsy — this is why `->` was invented.' },
      { title: 'A function with a pointer parameter', code: progF(cpp`
struct Student {
    string name;
    int age;
};

void setAge(Student* q, int a) {
    q->age = a;
}`, cpp`
    Student s = {"Ali", 18};
    Student* p = &s;
    setAge(p, 20);
    cout << p->name << " " << p->age;`), note: 'The pointer is copied, but the copy still points to the same record.' },
      { title: 'Use the struct directly', code: progF(cpp`
struct Student {
    string name;
    int age;
};`, cpp`
    Student s = {"Ali", 18};
    Student* p = &s;
    s.age = 20;
    cout << p->name << " " << p->age;`), note: '`p` looks at `s`, so it sees the change too.' },
    ],
    takeaway: '`p->age`, `(*p).age` and `s.age` all name the same box when `p` points to `s`.',
    check: { id: 'struct-pointers-ways-check', kind: 'mcq', prompt: 'Which line does NOT compile?', options: ['`*p.age = 20;`', '`p->age = 20;`', '`(*p).age = 20;`', '`s.age = 20;`'], answer: 0, hints: ['Which operator runs first, `*` or `.`?'], explain: '`*p.age` means `*(p.age)`, and a pointer has no field `age`.' },
  },
  watch: [
    { title: 'A dynamic array of records: new Student[n]', intro: 'The class size is read at run time, so the array is made on the heap.', code: progF(cpp`
struct Student {
    string name;
    int age;
};`, cpp`
    int n;
    cin >> n;
    Student* list = new Student[n];
    for (int i = 0; i < n; i++) {
        cin >> list[i].name >> list[i].age;
    }
    for (int i = 0; i < n; i++) {
        cout << list[i].name << " (" << list[i].age << ")" << endl;
    }
    delete[] list;`), input: '3\nAli 18\nSara 19\nUmar 20\n' },
    { title: 'Teaser for Data Structures: nodes linked by next', intro: 'Each Node holds a number and a pointer to the next Node. Follow the arrows until `nullptr`. This chain is called a **linked list**.', code: progF(cpp`
struct Node {
    int data;
    Node* next;
};`, cpp`
    Node c = {30, nullptr};
    Node b = {20, &c};
    Node a = {10, &b};
    Node* cur = &a;
    while (cur != nullptr) {
        cout << cur->data << " ";
        cur = cur->next;
    }
    cout << endl;`) },
    { title: 'Nodes on the heap', intro: 'The same chain, built with `new`. `head->next->data` follows two arrows.', code: progF(cpp`
struct Node {
    int data;
    Node* next;
};`, cpp`
    Node* head = new Node{1, nullptr};
    head->next = new Node{2, nullptr};
    head->next->next = new Node{3, nullptr};
    cout << head->data << " " << head->next->data << " " << head->next->next->data << endl;
    delete head->next->next;
    delete head->next;
    delete head;`) },
  ],
  think: {
    title: 'The cheapest product',
    problem: 'Read how many products a shop has, then each product\'s name and price into a dynamic array. Use a pointer `cheap` that always points to the cheapest product found so far.',
    steps: [
      { text: 'Read n and make an array of n Product records on the heap.', lines: [10, 11, 12] },
      { text: 'Fill every record from input.', lines: [13, 14, 15] },
      { text: 'Start by pointing at the first product.', lines: [16] },
      { text: 'For every other product: is it cheaper than the one `cheap` points to? Then point at it instead.', lines: [17, 18, 19] },
      { text: 'Print through the pointer with `->`, then free the array.', lines: [22, 23] },
    ],
    code: progF(cpp`
struct Product {
    string name;
    int price;
};`, cpp`
    int n;
    cin >> n;
    Product* shop = new Product[n];
    for (int i = 0; i < n; i++) {
        cin >> shop[i].name >> shop[i].price;
    }
    Product* cheap = &shop[0];
    for (int i = 1; i < n; i++) {
        if (shop[i].price < cheap->price) {
            cheap = &shop[i];
        }
    }
    cout << "Cheapest: " << cheap->name << " Rs " << cheap->price << endl;
    delete[] shop;`),
    input: '3\nSoap 120\nRice 90\nTea 300\n',
    why: 'Pointing at the record (instead of copying it) means we never copy names or prices — we just move the arrow. It is the same idea as keeping the index `best`.',
    yourTurn: {
      id: 'struct-pointers-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with `3`, `Pen 50`, `Book 40`, `Bag 900`. Fill in `n`, `i`, the condition and the output.',
      code: progF(cpp`
struct Product {
    string name;
    int price;
};`, cpp`
    int n;
    cin >> n;
    Product* shop = new Product[n];
    for (int i = 0; i < n; i++) {
        cin >> shop[i].name >> shop[i].price;
    }
    Product* cheap = &shop[0];
    for (int i = 1; i < n; i++) {
        if (shop[i].price < cheap->price) {
            cheap = &shop[i];
        }
    }
    cout << "Cheapest: " << cheap->name << " Rs " << cheap->price << endl;
    delete[] shop;`),
      input: '3\nPen 50\nBook 40\nBag 900\n',
      vars: ['n', 'i'],
      hints: ['40 < 50 → cheap moves to Book.', '900 < 40 is false.'],
      explain: 'cheap starts at Pen, moves to Book (40), stays there. Output `Cheapest: Book Rs 40`.',
    },
  },
  practice: [
    { id: 'struct-pointers-q1', kind: 'mcq', prompt: '`p` points to a Student. Which expression is exactly the same as `p->age`?', options: ['`(*p).age`', '`*p.age`', '`p.age`', '`&p.age`'], answer: 0, hints: ['The arrow = follow the pointer, then take the field.'], explain: '`p->age` is short for `(*p).age`. The brackets matter.' },
    { id: 'struct-pointers-q2', kind: 'bug', prompt: 'This does not compile. Find the line.', code: progF(cpp`
struct Account {
    string owner;
    double balance;
};`, cpp`
    Account acc = {"Hina", 2500};
    Account* p = &acc;
    p.balance += 500;
    cout << p->owner << " " << p->balance;`), bugLine: 12, options: ['`p` is a pointer: write `p->balance`', 'Write `*p.balance`', 'Write `&p.balance`', 'The balance must be an int'], answer: 0, fixed: progF(cpp`
struct Account {
    string owner;
    double balance;
};`, cpp`
    Account acc = {"Hina", 2500};
    Account* p = &acc;
    p->balance += 500;
    cout << p->owner << " " << p->balance;`), hints: ['Is `p` a record or an address?'], explain: 'g++: *request for member \'balance\' in \'p\', which is of pointer type \'Account*\' (maybe you meant to use \'->\' ?)*.' },
    { id: 'struct-pointers-q3', kind: 'mcq', tag: 'tricky', prompt: 'Why does `cout << *p.age;` not compile when `p` is a `Student*`?', options: ['The `.` runs before `*`, so C++ looks for a field `age` inside the pointer', 'Because `age` is an int and `*` needs a double', 'Because you cannot print through a pointer', 'Because `*` must come after the name'], answer: 0, hints: ['Think about operator order, like `*` before `+` in maths.'], explain: '`*p.age` = `*(p.age)`. Write `(*p).age` or, better, `p->age`.' },
    { id: 'struct-pointers-q4', kind: 'predict', prompt: 'Predict the output.', code: progF(cpp`
struct Car {
    string brand;
    int speed;
};`, cpp`
    Car c = {"Suzuki", 60};
    Car* p = &c;
    Car* q = p;
    p->speed += 20;
    q->speed *= 2;
    Car d = c;
    d.speed = 0;
    cout << c.speed << " " << (*p).speed << " " << d.speed;`), hints: ['`p` and `q` both point at `c`.', '`d` is a copy — a separate record.'], explain: '60 + 20 = 80, then × 2 = 160 (both pointers change `c`). `d` is a copy set to 0. Output `160 160 0`.' },
    { id: 'struct-pointers-q5', kind: 'blanks', prompt: 'Make a record on the heap, use it, and free it. It should print `Sana 21`.', code: progF(cpp`
struct Student {
    string name;
    int age;
};`, cpp`
    Student* p = [[1]] Student;
    p[[2]]name = "Sana";
    p->age = 21;
    cout << p->name << " " << p->age;
    [[3]] p;`), blanks: [{ answers: ['new'] }, { answers: ['->'] }, { answers: ['delete'] }], chips: ['new', 'delete', 'delete[]', '->', '.', '*'], output: 'Sana 21', hints: ['Which keyword creates memory on the heap?', 'One record → `delete`, an array → `delete[]`.'], explain: '`new Student` → use it with `->` → `delete p`.' },
    { id: 'struct-pointers-q6', kind: 'trace', mode: 'vars', prompt: 'Walk the linked nodes. Fill in `sum` and `count`. How many times does the loop body run?', code: progF(cpp`
struct Node {
    int data;
    Node* next;
};`, cpp`
    Node c = {7, nullptr};
    Node b = {5, &c};
    Node a = {3, &b};
    int sum = 0;
    int count = 0;
    Node* cur = &a;
    while (cur != nullptr) {
        sum += cur->data;
        count++;
        cur = cur->next;
    }
    cout << count << " nodes, sum " << sum;`), vars: ['sum', 'count'], hints: ['The chain is a → b → c → nullptr.', 'The loop stops when `cur` becomes nullptr.'], explain: '3 + 5 + 7 = 15 in 3 turns of the loop. Output `3 nodes, sum 15`.' },
    { id: 'struct-pointers-q7', kind: 'blanks', tag: 'real life', prompt: 'A hostel reads how many rooms it has and each room\'s number of beds. Complete it. Input `2`, `101 3`, `102 4` → `Total beds: 7`.', code: progF(cpp`
struct Room {
    int number;
    int beds;
};`, cpp`
    int n;
    cin >> n;
    Room* rooms = [[1]] Room[n];
    int total = 0;
    for (int i = 0; i < n; i++) {
        cin >> rooms[i].number >> rooms[i].beds;
        total += rooms[i].[[2]];
    }
    cout << "Total beds: " << total;
    [[3]] rooms;`), blanks: [{ answers: ['new'] }, { answers: ['beds'] }, { answers: ['delete[]', 'delete []'] }], chips: ['new', 'delete', 'delete[]', 'beds', 'number'], input: '2\n101 3\n102 4\n', output: 'Total beds: 7', hints: ['An array made with `new … [n]` is freed with `delete[]`.'], explain: '`new Room[n]` makes n records; `delete[] rooms` frees all of them.' },
    { id: 'struct-pointers-q8', kind: 'predict', tag: 'tricky', prompt: 'Pointer arithmetic works on arrays of structs too. Predict the output.', code: progF(cpp`
struct Student {
    string name;
    int age;
};`, cpp`
    Student* list = new Student[3];
    list[0] = {"Ali", 18};
    list[1] = {"Sara", 19};
    list[2] = {"Umar", 20};
    Student* p = list + 2;
    cout << p->name << " " << (p - 1)->age;
    delete[] list;`), hints: ['`list + 2` points at element 2.', '`p - 1` points at element 1.'], explain: '`p` → Umar; `p - 1` → Sara, age 19. Output `Umar 19`.' },
  ],
  cheatsheet: [
    { code: 'Student* p = &s;  p->age', text: 'the arrow = `(*p).age`; never `*p.age` or `p.age`' },
    { code: 'Student* p = new Student; … delete p;', text: 'one record on the heap' },
    { code: 'Student* a = new Student[n]; … delete[] a;', text: 'a dynamic array of records; `a[i].field`' },
    { code: 'struct Node { int data; Node* next; };', text: 'a record that points to the next one — the start of linked lists' },
  ],
};

// ------------------------------------------------------------------ Checkpoint + capstone
const CS: Level = {
  id: 'checkpoint-structs',
  kind: 'revision',
  title: 'Structures',
  tagline: '**The last checkpoint of Programming Fundamentals.** Libraries, bank accounts, cricket averages and shop inventories — then build a complete student-records program.',
  minutes: 40,
  objectives: [
    'Model real records with structs, arrays of structs and nested structs',
    'Choose the right way to pass a struct to a function',
    'Use `->`, `new` and `delete[]` with records',
  ],
  practice: [
    { id: 'checkpoint-structs-q1', kind: 'predict', tag: 'real life', prompt: 'A library shelf. Predict the output.', code: progF(cpp`
struct Book {
    string title;
    bool issued;
};`, cpp`
    Book shelf[4] = {{"Raja Gidh", true}, {"Udaas Naslain", false}, {"Aangan", false}, {"Peer-e-Kamil", true}};
    int available = 0;
    for (int i = 0; i < 4; i++) {
        if (!shelf[i].issued) {
            cout << shelf[i].title << endl;
            available++;
        }
    }
    cout << available << " of 4 books on the shelf";`), hints: ['`!shelf[i].issued` is true when the book is NOT issued.'], explain: 'Udaas Naslain and Aangan are not issued → 2 titles, then `2 of 4 books on the shelf`.' },
    { id: 'checkpoint-structs-q2', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'A bank account with deposit and withdraw functions. Fill in `acc.balance` whenever it changes.', code: progF(cpp`
struct Account {
    string owner;
    int balance;
};

void deposit(Account &a, int amt) {
    a.balance += amt;
}

bool withdraw(Account &a, int amt) {
    if (amt > a.balance) {
        return false;
    }
    a.balance -= amt;
    return true;
}`, cpp`
    Account acc = {"Bilal", 5000};
    deposit(acc, 2000);
    if (!withdraw(acc, 9000)) {
        cout << "Not enough money" << endl;
    }
    withdraw(acc, 3000);
    cout << "Balance: " << acc.balance << endl;`), vars: ['acc.balance'], hints: ['Both functions take `Account &`, so they change `acc` itself.', '9000 > 7000, so the first withdraw returns false and changes nothing.'], explain: '5000 → 7000; withdraw 9000 refused; withdraw 3000 → 4000.' },
    { id: 'checkpoint-structs-q3', kind: 'bug', tag: 'real life', prompt: 'Babar scored 250 runs in 4 innings, so his average is 62.50 — but the program prints 62.00. Find the line.', code: progF(cpp`
struct Player {
    string name;
    int runs;
    int innings;
};`, cpp`
    Player p = {"Babar", 250, 4};
    double avg = p.runs / p.innings;
    cout << fixed << setprecision(2) << p.name << " average: " << avg;`, '#include <iomanip>\n'), bugLine: 13, options: ['Integer division: write `(double) p.runs / p.innings`', '`avg` should be an int', 'Use `setprecision(1)`', 'Swap runs and innings'], answer: 0, fixed: progF(cpp`
struct Player {
    string name;
    int runs;
    int innings;
};`, cpp`
    Player p = {"Babar", 250, 4};
    double avg = (double) p.runs / p.innings;
    cout << fixed << setprecision(2) << p.name << " average: " << avg;`, '#include <iomanip>\n'), hints: ['Both fields are `int`.'], explain: '`250 / 4` with two ints is 62 — the .5 is lost before it is stored in the double. Cast one side to double.' },
    { id: 'checkpoint-structs-q4', kind: 'blanks', tag: 'real life', prompt: 'Batting averages of a team: runs ÷ times out (not-out players: just their runs). Complete it. Output starts `Babar 51.7`.', code: progF(cpp`
struct Player {
    string name;
    int runs;
    int outs;
};

double average([[1]] Player &p) {
    if (p.outs == 0) {
        return p.runs;
    }
    return (double) p.[[2]] / p.outs;
}`, cpp`
    Player team[3] = {{"Babar", 310, 6}, {"Rizwan", 150, 4}, {"Saim", 45, 0}};
    cout << fixed << setprecision(1);
    for (int i = 0; i < 3; i++) {
        cout << team[i].[[3]] << " " << average(team[i]) << endl;
    }`, '#include <iomanip>\n'), blanks: [{ answers: ['const'] }, { answers: ['runs'] }, { answers: ['name'] }], chips: ['const', 'runs', 'outs', 'name', '&'], output: 'Babar 51.7\nRizwan 37.5\nSaim 45.0\n', hints: ['`average` only reads the player.', '310 / 6 = 51.67 → 51.7'], explain: 'A read-only helper takes `const Player &`; the average is runs / outs.' },
    { id: 'checkpoint-structs-q5', kind: 'mcq', prompt: 'Which struct definition is correct?', options: ['`struct Book { string title; int pages; };`', '`struct Book { string title, int pages };`', '`struct Book ( string title; int pages; );`', '`Book struct { string title; int pages; }`'], answer: 0, hints: ['Curly braces, a `;` after every field, and `};` at the end.'], explain: 'Fields are declared like variables, each ending with `;`, and the struct ends with `};`.' },
    { id: 'checkpoint-structs-q6', kind: 'paths', tag: 'real life', prompt: 'An ATM works on an Account record. Find an input (the amount) for every message.', code: progF(cpp`
struct Account {
    string owner;
    int balance;
};`, cpp`
    Account acc = {"Hina", 10000};
    int amt;
    cin >> amt;
    if (amt <= 0 || amt % 500 != 0) {
        cout << "Invalid amount";
    } else if (amt > acc.balance) {
        cout << "Insufficient balance";
    } else {
        acc.balance -= amt;
        cout << "Done. Left: " << acc.balance;
    }`), paths: [{ label: '`Invalid amount`', line: 14 }, { label: '`Insufficient balance`', line: 16 }, { label: 'money given', line: 18 }], start: '750', hints: ['The amount must be a positive multiple of 500.', 'The balance is 10000.'], explain: 'e.g. `750` (not a multiple of 500), `15000` (too much), `2000` (done, 8000 left).' },
    { id: 'checkpoint-structs-q7', kind: 'parsons', tag: 'real life', prompt: 'Inventory: arrange the program that prints the value of the whole stock, `Stock value: Rs 3600`.', lines: ['#include <iostream>', 'using namespace std;', 'struct Product {', '    string name;', '    int price;', '    int qty;', '};', 'int main() {', '    Product stock[3] = {{"Soap", 120, 10}, {"Rice", 300, 5}, {"Tea", 450, 2}};', '    int value = 0;', '    for (int i = 0; i < 3; i++) {', '        value += stock[i].price * stock[i].qty;', '    }', '    cout << "Stock value: Rs " << value;', '    return 0;', '}'], distractors: ['        value += stock.price[i] * stock.qty[i];', '    int value;'], hints: ['Start the total at 0.', 'Index first, then the field.'], explain: '1200 + 1500 + 900 = 3600.' },
    { id: 'checkpoint-structs-q8', kind: 'predict', tag: 'tricky', prompt: 'Copy or pointer? Predict the output.', code: progF(cpp`
struct Student {
    string name;
    int age;
};`, cpp`
    Student a = {"Ali", 18};
    Student b = a;
    Student* p = &a;
    b.age = 30;
    p->age = 25;
    b.name = "Bilal";
    cout << a.name << " " << a.age << " | " << b.name << " " << b.age;`), hints: ['`b` is a separate copy. `p` points at `a`.'], explain: 'Only `p` changes `a` (25). `b` is Bilal 30. Output `Ali 25 | Bilal 30`.' },
    { id: 'checkpoint-structs-q9', kind: 'mcq', prompt: 'How many `int` boxes does this array contain?', code: cpp`
struct Date {
    int day;
    int month;
    int year;
};

struct Employee {
    string name;
    Date joined;
    double salary;
};

Employee staff[5];`, options: ['15', '5', '3', '20'], answer: 0, hints: ['Each Employee has one Date; each Date has 3 ints.'], explain: '5 employees × 3 ints in `joined` = 15. (Also 5 strings and 5 doubles.)' },
    { id: 'checkpoint-structs-q10', kind: 'trace', mode: 'vars', prompt: 'Sort 3 players by runs (high to low). Fill in `j` and the runs in each box after every swap.', code: progF(cpp`
struct Player {
    string name;
    int runs;
};`, cpp`
    Player t[3] = {{"Saim", 20}, {"Babar", 45}, {"Fakhar", 60}};
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2 - i; j++) {
            if (t[j].runs < t[j + 1].runs) {
                Player tmp = t[j];
                t[j] = t[j + 1];
                t[j + 1] = tmp;
            }
        }
    }
    cout << t[0].name << " " << t[1].name << " " << t[2].name;`), vars: ['j', 't[0].runs', 't[1].runs', 't[2].runs'], hints: ['The array starts in the worst order, so every comparison swaps.', 'There are 2 + 1 = 3 comparisons.'], explain: '20 45 60 → 45 20 60 → 45 60 20 → 60 45 20. Output `Fakhar Babar Saim`.' },
    { id: 'checkpoint-structs-q11', kind: 'blanks', prompt: 'A function returns a total AND a grade in one struct. Complete it: it prints `245 A`.', code: progF(cpp`
struct Result {
    int total;
    char grade;
};

[[1]] getResult(int a, int b, int c) {
    Result r;
    r.total = a + b + c;
    if (r.total >= 240) {
        r.grade = 'A';
    } else if (r.total >= 180) {
        r.grade = 'B';
    } else {
        r.grade = 'C';
    }
    [[2]] r;
}`, cpp`
    Result res = getResult(85, 70, 90);
    cout << res.total << " " << res[[3]]grade;`), blanks: [{ answers: ['Result'] }, { answers: ['return'] }, { answers: ['.'] }], chips: ['Result', 'void', 'int', 'return', '.', '->'], output: '245 A', hints: ['The return type is the struct.', '`res` is a struct variable, not a pointer.'], explain: '`Result getResult(…)` builds the record and returns it; main reads `res.grade`.' },
    { id: 'checkpoint-structs-q12', kind: 'bug', prompt: 'The librarian wants to print a book. Find the line that does not compile.', code: progF(cpp`
struct Book {
    string title;
    string author;
};`, cpp`
    Book b = {"Aangan", "Khadija Mastoor"};
    Book* p = &b;
    cout << p->title << " by ";
    cout << *p << endl;`), bugLine: 13, options: ['cout cannot print a whole Book — print `p->author`', 'Use `p.title` on line 12', 'Remove the `*` from the declaration of `p`', 'Books need a page count'], answer: 0, fixed: progF(cpp`
struct Book {
    string title;
    string author;
};`, cpp`
    Book b = {"Aangan", "Khadija Mastoor"};
    Book* p = &b;
    cout << p->title << " by ";
    cout << p->author << endl;`), hints: ['`*p` is a whole Book record.'], explain: '`*p` is a Book, and cout does not know how to print a Book. Print a field: `p->author`.' },
    { id: 'checkpoint-structs-q13', kind: 'blanks', prompt: '**Capstone: student records.** Read n students (name + 3 marks) into a dynamic array, compute each average with a helper, print every record and the topper. Input: `3`, `Ali 70 80 91`, `Sara 90 85 95`, `Umar 60 70 66`.', code: progF(cpp`
struct Student {
    string name;
    int marks[3];
    double avg;
};

void computeAvg(Student [[1]]s) {
    int sum = 0;
    for (int i = 0; i < 3; i++) {
        sum += s.[[2]][i];
    }
    s.avg = sum / [[3]];
}

void printRecord(const Student &s) {
    cout << s.name << ": " << s.avg << endl;
}`, cpp`
    int n;
    cin >> n;
    Student* cls = [[4]] Student[n];
    for (int i = 0; i < n; i++) {
        cin >> cls[i].name >> cls[i].marks[0] >> cls[i].marks[1] >> cls[i].marks[2];
        computeAvg(cls[i]);
    }
    int best = 0;
    for (int i = 0; i < n; i++) {
        printRecord(cls[i]);
        if (cls[i].avg > cls[best].[[5]]) {
            best = i;
        }
    }
    cout << "Topper: " << cls[best].name << endl;
    [[6]] cls;`), blanks: [{ answers: ['&'] }, { answers: ['marks'] }, { answers: ['3.0', '3.0f', '(double) 3', '(double)3'] }, { answers: ['new'] }, { answers: ['avg'] }, { answers: ['delete[]', 'delete []'] }], chips: ['&', '*', 'const', 'marks', 'avg', '3', '3.0', 'new', 'delete', 'delete[]'], input: '3\nAli 70 80 91\nSara 90 85 95\nUmar 60 70 66\n', output: 'Ali: 80.3333\nSara: 90\nUmar: 65.3333\nTopper: Sara\n', hints: ['`computeAvg` must change the record it gets.', '`sum / 3` would be integer division.', 'An array from `new … [n]` needs `delete[]`.'], explain: 'This program uses everything from the unit: a struct with an array field, a `&` helper that updates a record, a `const &` helper that prints it, a dynamic array of records, the topper search with `best`, and `delete[]`. Next course: turn `computeAvg` and `printRecord` into member functions of a class!' },
  ],
  cheatsheet: [
    { code: 'struct T { … };', text: 'a record type — `;` at the end' },
    { code: 'x.f   a[i].f   x.inner.f   p->f', text: 'reach a field: variable, array element, nested, pointer' },
    { code: 'f(T x)  f(T &x)  f(const T &x)', text: 'copy / change the original / read-only without a copy' },
    { code: 'new T  delete p   new T[n]  delete[] a', text: 'records on the heap' },
    { code: 'class T { private: … public: void print(); };', text: 'next course: data + functions together' },
  ],
  exam: {
    title: 'Exam Challenge: Structures',
    intro: '**Instructions:** State the output of each program below. If there is an error, write it explicitly and give the line number. Assume all the required headers are included. For every struct variable draw one box with a small box for each field — and remember: pass by value makes a **new** box, pass by `&` does not.',
    questions: [
      { id: 'checkpoint-structs-x1', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: progF(cpp`
struct Player {
    string name;
    int runs;
};

void addRuns(Player p, int r) {
    p.runs += r;
}

void addRunsRef(Player& p, int r) {
    p.runs += r;
}`, cpp`
    Player a = {"Babar", 50};
    Player b = a;
    addRuns(a, 10);
    addRunsRef(b, 20);
    b.name[0] = 'K';
    addRuns(b, 5);
    cout << a.name << " " << a.runs << endl;
    cout << b.name << " " << b.runs << endl;`), hints: ['`Player b = a;` copies every field — `a` and `b` are two separate records.', 'Which function works on a copy?'], explain: '`b = a` makes a full copy: two records `{"Babar", 50}`.\n- `addRuns(a, 10)` changes a **copy** of `a` → `a` stays 50.\n- `addRunsRef(b, 20)` changes `b` itself → 70.\n- `b.name[0] = \'K\'` changes only `b`\'s name → `Kabar` (`a.name` is a separate string).\n- `addRuns(b, 5)` again works on a copy → `b` stays 70.\n\nOutput:\n`Babar 50`\n`Kabar 70`' },
      { id: 'checkpoint-structs-x2', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it (with the line number).', code: progF(cpp`
struct Point {
    int x;
    int y;
}`, cpp`
    Point p = {3, 4};
    cout << p.x * p.y;`), hints: ['Look at the very end of the struct definition.'], explain: '**Compile error on line 7:** `expected \';\' after struct definition`.\n\nA struct definition is a declaration, and every declaration ends with a semicolon: `};`. g++ reports it at the closing brace on line 7.\n\n**Fix:** write `};` on line 7 → the program prints `12`.' },
      { id: 'checkpoint-structs-x3', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it (with the line number).', code: progF(cpp`
struct Point {
    int x;
    int y;
};`, cpp`
    Point pt = {3, 4};
    Point* p = &pt;
    (*p).x = 10;
    cout << p->x << " " << p.y;`), hints: ['`p` is not a Point — it is a pointer to a Point.', 'Which operators reach a field through a pointer?'], explain: '**Compile error on line 13:** `request for member \'y\' in \'p\', which is of pointer type \'Point*\' (maybe you meant to use \'->\' ?)`.\n\nThe dot `.` works on a **struct variable**. `p` is a **pointer**, so use `p->y` or `(*p).y`. Line 12 `(*p).x` and `p->x` on line 13 are correct.\n\n**Fix:** `cout << p->x << " " << p->y;` → prints `10 4`.' },
      { id: 'checkpoint-structs-x4', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it (with the line number).', code: progF(cpp`
struct Book {
    string title;
    int pages;
};`, cpp`
    Book b1 = {"Aab-e-Hayat", 350};
    Book b2 = b1;
    b2.pages += 50;
    cout << b2 << endl;`), hints: ['Copying a struct with `=` is allowed. Can `cout` print a whole record?'], explain: '**Compile error on line 13:** `no match for \'operator<<\'` (operand types are `ostream` and `Book`).\n\n`cout` knows how to print `int`, `double`, `char`, `string` … but not your own type `Book`. Lines 11–12 are fine: `=` copies all fields and `b2.pages += 50` changes only the copy.\n\n**Fix:** print the fields: `cout << b2.title << " " << b2.pages << endl;` → `Aab-e-Hayat 400`.' },
      { id: 'checkpoint-structs-x5', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: progF(cpp`
struct Item {
    string name;
    int qty;
    double price;
};`, cpp`
    Item shop[3] = {{"Pen", 10, 20}, {"Copy", 4, 80.5}, {"Bag", 1, 1500}};
    Item* best = &shop[0];
    for (int i = 1; i < 3; i++) {
        if (shop[i].qty * shop[i].price > best->qty * best->price) {
            best = &shop[i];
        }
    }
    best->qty--;
    cout << best->name << " " << best->qty << " " << (*best).price * 2 << endl;
    cout << shop[2].qty + shop[0].qty / 4 << endl;`), hints: ['Stock value = `qty * price`: 200, 322 and 1500.', '`best` points INTO the array, so `best->qty--` changes the array element.'], explain: 'Values: Pen 10 × 20 = 200, Copy 4 × 80.5 = 322, Bag 1 × 1500 = 1500. `best` moves to Copy (322 > 200), then to Bag (1500 > 322).\n\n`best->qty--` → Bag\'s qty becomes 0 **in the array**. `(*best).price * 2` = 3000 (a double that is a whole number prints without `.0`). Line 1: `Bag 0 3000`.\n\nLine 2: `shop[2].qty` is now 0, `10 / 4` = 2 (integer division) → `2`.' },
      { id: 'checkpoint-structs-x6', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: progF(cpp`
struct Date {
    int d, m;
};

struct Student {
    string name;
    Date dob;
    int marks[3];
};

int total(const Student& s) {
    int t = 0;
    for (int i = 0; i < 3; i++) {
        t += s.marks[i];
    }
    return t;
}`, cpp`
    Student s1 = {"Ali", {14, 8}, {70, 80, 90}};
    Student s2 = s1;
    s2.name = "Sana";
    s2.marks[1] = 95;
    s2.dob.m++;
    Student* p = &s2;
    p->marks[0] -= 5;
    cout << total(s1) << " " << total(*p) << endl;
    cout << s1.dob.d << "/" << s1.dob.m << " " << p->dob.m << endl;`), hints: ['Copying a struct copies the array inside it too — `s2.marks` is a separate array.', '`p` points at `s2`, not at `s1`.'], explain: '`s2 = s1` copies **everything**, including the nested `Date` and the `marks` array. From then on the changes touch only `s2`:\n- `marks[1]` = 95, `dob.m` = 9, and through `p`: `marks[0]` = 65.\n\n`total(s1)` = 70 + 80 + 90 = 240. `total(*p)` = 65 + 95 + 90 = 250 → `240 250`.\n\n`s1`\'s date is still `14/8`, `p->dob.m` = 9 → `14/8 9`.' },
      { id: 'checkpoint-structs-x7', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: progF(cpp`
struct Account {
    string owner;
    int balance = 1000;
};

void deposit(Account* a, int amt) {
    a->balance += amt;
}

Account withdraw(Account a, int amt) {
    a.balance -= amt;
    return a;
}`, cpp`
    Account* acc = new Account;
    acc->owner = "Zara";
    deposit(acc, 500);
    Account copy = withdraw(*acc, 700);
    Account* arr = new Account[2];
    arr[1] = copy;
    arr[0].balance += arr[1].balance;
    cout << acc->balance << " " << copy.balance << " " << arr[0].balance << endl;
    delete acc;
    delete[] arr;`), hints: ['Every new `Account` starts with `balance = 1000` (the default value).', '`withdraw` gets a copy and **returns** the changed copy.'], explain: '- `new Account` → balance 1000; `deposit` goes through the pointer → `acc` has 1500.\n- `withdraw(*acc, 700)` works on a copy: the copy becomes 800 and is returned into `copy`. `acc` still has 1500.\n- `new Account[2]` → two records, both 1000. `arr[1] = copy` → 800. `arr[0].balance` = 1000 + 800 = 1800.\n\nOutput: `1500 800 1800`. Then one `delete` for the single record and `delete[]` for the array.' },
      { id: 'checkpoint-structs-x8', kind: 'count', tag: 'exam', prompt: 'The class list is sorted by marks, highest first. How many times is `swapS` called? What does the program print?', code: progF(cpp`
struct Student {
    string name;
    int marks;
};

void swapS(Student& a, Student& b) {
    Student t = a;
    a = b;
    b = t;
}`, cpp`
    Student s[4] = {{"Hina", 40}, {"Ali", 60}, {"Sara", 90}, {"Umar", 75}};
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3 - i; j++) {
            if (s[j].marks < s[j + 1].marks) {
                swapS(s[j], s[j + 1]);
            }
        }
    }
    for (int i = 0; i < 4; i++) {
        cout << s[i].name[0];
    }`), count: { calls: 'swapS' }, hints: ['Bubble sort swaps exactly once for every pair that is in the wrong order.', 'Wrong-order pairs (a smaller mark before a bigger one): count them for 40, 60, 90, 75.'], explain: 'Marks: 40, 60, 90, 75.\n- Pass 1 (`i = 0`): 40<60 swap → 60,40,90,75; 40<90 swap → 60,90,40,75; 40<75 swap → 60,90,75,40 (**3** swaps).\n- Pass 2: 60<90 swap → 90,60,75,40; 60<75 swap → 90,75,60,40 (**2** swaps).\n- Pass 3: 90 vs 75 — no swap.\n\nTotal **5** calls (the same as the number of wrong-order pairs). Order: Sara, Umar, Ali, Hina → prints `SUAH`.' },
      { id: 'checkpoint-structs-x9', kind: 'count', tag: 'exam', prompt: 'A bar chart of marks: one `*` for every full 20 marks. How many `*` does the program print?', code: progF(cpp`
struct Result {
    string name;
    int marks;
};`, cpp`
    Result r[4] = {{"Ali", 45}, {"Sara", 72}, {"Umar", 99}, {"Hina", 8}};
    for (int i = 0; i < 4; i++) {
        if (r[i].marks % 2 == 0) r[i].marks += 20;
        cout << r[i].name << ": ";
        for (int k = 1; k <= r[i].marks / 20; k++) {
            cout << "*";
        }
        cout << endl;
    }`), count: { text: '*' }, unit: 'stars', hints: ['Even marks get a bonus of 20 first.', '`/ 20` is integer division.'], explain: '- Ali 45 (odd) → 45 / 20 = **2**\n- Sara 72 (even) → 92 → 92 / 20 = **4**\n- Umar 99 (odd) → **4**\n- Hina 8 (even) → 28 → **1**\n\nTotal 2 + 4 + 4 + 1 = **11** stars.' },
      { id: 'checkpoint-structs-x10', kind: 'blanks', tag: 'exam', prompt: 'Complete the student-record report: print each student with a grade (A: 85+, B: 70+, else C), then the class average and the topper.', code: progF(cpp`
struct Student {
    string name;
    int marks;
};

char grade(int m) {
    if (m >= 85) return 'A';
    if (m >= 70) return 'B';
    return 'C';
}`, cpp`
    Student cls[4] = {{"Ali", 78}, {"Sara", 91}, {"Umar", 64}, {"Hina", 85}};
    int top = 0, sum = 0;
    for (int i = 0; i < 4; i++) {
        sum += cls[i].[[1]];
        if (cls[i].marks > [[2]]) top = i;
        cout << cls[i].name << " " << [[3]](cls[i].marks) << endl;
    }
    cout << "Average: " << [[4]] << endl;
    cout << "Topper: " << cls[top].name << endl;`), blanks: [{ answers: ['marks'] }, { answers: ['cls[top].marks'] }, { answers: ['grade'] }, { answers: ['sum / 4.0', 'sum/4.0', 'sum / 4.0f', '(double)sum / 4', '(double) sum / 4', 'sum / (double)4', 'sum * 1.0 / 4'] }], chips: ['marks', 'name', 'cls[top].marks', 'cls[i].marks', 'grade', 'sum / 4', 'sum / 4.0'], output: 'Ali B\nSara A\nUmar C\nHina A\nAverage: 79.5\nTopper: Sara\n', hints: ['Compare with the marks of the best student found so far.', '`sum / 4` would be integer division (79).'], explain: 'Grades: 78 → B, 91 → A, 64 → C, 85 → A (`>= 85` includes 85). `sum` = 318, `318 / 4.0` = 79.5 (with `/ 4` it would print 79). `top` changes only at Sara (91 > 78); 85 is not bigger than 91. Output ends with `Average: 79.5` and `Topper: Sara`.' },
    ],
  },
};

export const unit11: Unit = {
  id: 'u11',
  num: 11,
  title: 'Structures: your own data types',
  summary: 'Group related values into one record with `struct` — the step before classes.',
  levels: [LS1, LS2, LS3, LS4, CS],
};
