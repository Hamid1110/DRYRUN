import type { Course, Level, Unit } from '../types';
import { cpp, prog, progF } from '../helpers';

// Helper for joining prompt lines
const t = (...lines: string[]): string => lines.join('\n');

// =====================================================================================
// UNIT 1: Classes, Objects & Encapsulation
// =====================================================================================

const OOP_U1_L1: Level = {
  id: 'oop-class-vs-struct',
  kind: 'lesson',
  title: 'Classes vs. Structs: The Foundation of OOP',
  tagline: 'In C++, `class` and `struct` are almost twins — with one crucial difference: `struct` members are public by default, while `class` members are private.',
  minutes: 20,
  objectives: [
    'Understand why data hiding (encapsulation) prevents bugs',
    'Know the exact difference between `class` and `struct` defaults in C++',
    'Declare classes with `public` and `private` sections',
  ],
  learn: [
    { t: 'p', text: 'In procedural programming, data and functions are separated: data is stored in structs or variables, and any function anywhere can change it — even to invalid values (like setting a bank balance to negative, or an age to -50). **Object-Oriented Programming (OOP)** binds data and functions together into a single unit called a **Class**.' },
    { t: 'syntax', title: 'Declaring a Class with Access Specifiers', code: cpp`
class BankAccount {
private:
    int balance;     // hidden from outside world
public:
    int accountNumber;
};`, parts: [
      { token: 'class BankAccount', text: 'defines a new blueprint (type) named BankAccount' },
      { token: 'private:', text: 'members below can ONLY be accessed by functions of this class' },
      { token: 'public:', text: 'members below can be accessed anywhere using the dot . operator' },
    ] },
    { t: 'callout', tone: 'key', title: 'The Golden Rule of Default Access', text: 'In a `struct`, members are **public** by default. In a `class`, members are **private** by default. Everything else about them in C++ is identical!' },
    { t: 'viz', title: 'Public fields in an encapsulated struct/class', code: cpp`
#include <iostream>
using namespace std;

struct Student {
    int id;
    int marks;
};

void printStudent(Student &s) {
    cout << "ID: " << s.id << " Marks: " << s.marks << endl;
}

int main() {
    Student s1;
    s1.id = 2133;
    s1.marks = 92;
    printStudent(s1);
    return 0;
}
` },
    { t: 'terms', items: [
      { term: 'Class', def: 'a blueprint for creating objects, combining data fields and member functions' },
      { term: 'Object', def: 'a specific instance of a class allocated in memory' },
      { term: 'Encapsulation', def: 'bundling data with methods and restricting direct access to internal state' },
      { term: 'Access Specifier', def: 'keywords (`public`, `private`, `protected`) that control visibility' },
    ] },
  ],
  ways: {
    goal: 'Represent a coordinate point (x, y) with both members public.',
    intro: 'Two ways to write the same data structure in C++.',
    items: [
      { title: 'Using struct (default public)', code: cpp`
#include <iostream>
using namespace std;
struct Point {
    int x;
    int y;
};
int main() {
    Point p = {10, 20};
    cout << p.x << " " << p.y << endl;
    return 0;
}` },
      { title: 'Using class with explicit public:', code: cpp`
#include <iostream>
using namespace std;
class Point {
public:
    int x;
    int y;
};
int main() {
    Point p;
    p.x = 10;
    p.y = 20;
    cout << p.x << " " << p.y << endl;
    return 0;
}` },
    ],
    takeaway: 'Use `struct` for passive data bags, and `class` when data needs protection and validation invariants.',
    check: {
      id: 'oop-u1-l1-check',
      kind: 'mcq',
      prompt: 'If you do not write `public:` or `private:` inside a `class Point { int x; };`, what access level does `x` have?',
      options: ['public', 'private', 'protected', 'global'],
      answer: 1,
      explain: 'By default, all members of a C++ class are private unless explicitly declared public.',
    },
  },
  watch: [
    { title: 'Point instantiation and member access', intro: 'Creating two Point instances and reading their members.', code: cpp`
#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

int main() {
    Point p1;
    p1.x = 5;
    p1.y = 12;
    cout << "P1: (" << p1.x << ", " << p1.y << ")" << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Account balance modification audit',
    problem: 'An account has an ID and a balance. A function checks if an attempted balance change is positive before applying it. Dry-run the state changes.',
    steps: [
      { text: 'Define the Account structure with id and balance fields.', lines: [4, 5, 6, 7] },
      { text: 'Write a function that deposits funds only if the deposit amount is greater than 0.', lines: [9, 10, 11] },
      { text: 'Initialize account with 100.', lines: [15] },
      { text: 'Apply valid deposit of 50 and reject negative deposit of -30.', lines: [16, 17] },
      { text: 'Print final audited balance.', lines: [18] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Account {
    int id;
    int balance;
};

void deposit(Account &a, int amount) {
    if (amount > 0) a.balance += amount;
}

int main() {
    Account acc = {101, 100};
    deposit(acc, 50);
    deposit(acc, -30);
    cout << acc.balance << endl;
    return 0;
}
`,
    why: 'Functions acting as gatekeepers protect encapsulated state from becoming corrupted by invalid input.',
    yourTurn: {
      id: 'oop-u1-l1-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['acc.balance'],
      prompt: 'Trace `acc.balance` through the deposits. Notice that negative amounts are ignored.',
      code: cpp`
#include <iostream>
using namespace std;

struct Account {
    int balance;
};

int main() {
    Account acc = {200};
    if (50 > 0) acc.balance += 50;
    if (-100 > 0) acc.balance += -100;
    cout << acc.balance << endl;
    return 0;
}
`,
      hints: ['First deposit of 50 succeeds: 200 + 50 = 250.', 'Second condition (-100 > 0) is false, so it does not change.'],
      explain: '200 -> 250 -> 250.',
    },
  },
  practice: [
    {
      id: 'oop-u1-l1-mcq1',
      kind: 'mcq',
      prompt: 'What is the primary motivation for Object Oriented Programming?',
      options: [
        'To make code compile faster',
        'To bundle data with behavior and protect data integrity through encapsulation',
        'To eliminate the use of pointers completely',
        'To replace all loops with recursion',
      ],
      answer: 1,
      explain: 'OOP bundles state and behavior into classes and enforces invariants by preventing direct external corruption of private state.',
    },
    {
      id: 'oop-u1-l1-pred1',
      kind: 'predict',
      prompt: 'What will be the output of this program?',
      code: cpp`
#include <iostream>
using namespace std;

struct Box {
    int width;
    int height;
};

int main() {
    Box b = {4, 7};
    cout << b.width * b.height << endl;
    return 0;
}
`,
      explain: '4 * 7 = 28 is computed and printed.',
    },
    {
      id: 'oop-u1-l1-mcq2',
      kind: 'mcq',
      prompt: 'In C++, how do you make member variable `width` inaccessible from outside the class while keeping helper methods accessible?',
      options: [
        'Mark width as private: and helper methods as public:',
        'Mark width as public: and helper methods as private:',
        'Declare width inside main and helper inside class',
        'Mark both as protected: only',
      ],
      answer: 0,
      explain: 'Encapsulation in C++ hides state under private: while exposing interface functions under public:.',
    },
    {
      id: 'oop-u1-l1-bug1',
      kind: 'bug',
      prompt: 'This struct definition causes a compiler error. Identify the line with the syntax mistake.',
      code: cpp`
#include <iostream>
using namespace std;

struct Student {
    int id;
    int marks;
}

int main() {
    Student s = {1, 90};
    cout << s.marks << endl;
    return 0;
}
`,
      bugLine: 7,
      options: [
        'A struct definition must end with a semicolon `};` after the closing brace',
        'id and marks must be initialized to 0 inside the struct',
        'struct cannot be used in C++',
        'main cannot declare Student',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Student {
    int id;
    int marks;
};

int main() {
    Student s = {1, 90};
    cout << s.marks << endl;
    return 0;
}
`,
      explain: 'In C++, struct and class definitions MUST terminate with a semicolon `};`.',
    },
    {
      id: 'oop-u1-l1-count1',
      kind: 'count',
      prompt: 'How many times does the condition `amount > 0` evaluate to true?',
      code: cpp`
#include <iostream>
using namespace std;

struct Bank {
    int bal;
};

void deposit(Bank &b, int amount) {
    if (amount > 0) b.bal += amount;
}

int main() {
    Bank b = {0};
    deposit(b, 10);
    deposit(b, -5);
    deposit(b, 20);
    deposit(b, 0);
    cout << b.bal << endl;
    return 0;
}
`,
      count: { line: 10 },
      unit: 'times',
      explain: '10 > 0 is true, -5 > 0 is false, 20 > 0 is true, 0 > 0 is false. The body on line 10 executes exactly 2 times.',
    },
    {
      id: 'oop-u1-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace the coordinate modifications across nested structs as the bounding box expands.',
      code: cpp`
#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

struct Rect {
    Point tl;
    Point br;
};

void expand(Rect &r, int pad) {
    r.tl.x -= pad;
    r.tl.y += pad;
    r.br.x += pad;
    r.br.y -= pad;
}

int main() {
    Rect box = {{2, 8}, {6, 3}};
    expand(box, 2);
    int width = box.br.x - box.tl.x;
    int height = box.tl.y - box.br.y;
    cout << width << " " << height << endl;
    return 0;
}
`,
      explain: 'Initial tl=(2,8), br=(6,3). After expand with 2: tl.x = 2 - 2 = 0, tl.y = 8 + 2 = 10, br.x = 6 + 2 = 8, br.y = 3 - 2 = 1. width = 8 - 0 = 8, height = 10 - 1 = 9. Output is 8 9.',
    },
  ],
  cheatsheet: [
    { code: 'class C { private: ... public: ... };', text: 'class members default to private' },
    { code: 'struct S { int x; };', text: 'struct members default to public' },
    { code: '};', text: 'never forget the semicolon after class or struct definitions' },
    { code: 'obj.member', text: 'dot operator accesses public members of an object' },
  ],
};

const OOP_U1_L2: Level = {
  id: 'oop-getters-setters',
  kind: 'lesson',
  title: 'Encapsulation: Protecting State with Methods',
  tagline: 'Encapsulation means private data + public methods. Getters read the data; setters validate changes so bad data can never enter.',
  minutes: 20,
  objectives: [
    'Write getter functions to inspect state safely',
    'Write setter functions that validate parameters before modifying state',
    'Understand invariants: rules that must always stay true for an object',
  ],
  learn: [
    { t: 'p', text: 'Imagine an `Employee` with an hourly wage. If the wage is public, anyone can write `emp.wage = -100;`. With encapsulation, the wage is private, and changes must pass through a setter that rejects negative values.' },
    { t: 'syntax', title: 'A Setter with Validation', code: cpp`
void setWage(double w) {
    if (w >= 0) {
        wage = w;
    } else {
        cout << "Invalid wage!" << endl;
    }
}`, parts: [
      { token: 'if (w >= 0)', text: 'guard condition ensuring only valid values are accepted' },
      { token: 'wage = w;', text: 'modifies the private member only if validation succeeds' },
    ] },
    { t: 'viz', title: 'Encapsulated Employee with validation function', code: cpp`
#include <iostream>
using namespace std;

struct Employee {
    int id;
    int wage;
};

void setWage(Employee &e, int w) {
    if (w > 0) {
        e.wage = w;
    } else {
        cout << "Rejected" << endl;
    }
}

int main() {
    Employee e;
    e.id = 101;
    e.wage = 20;
    setWage(e, 35);
    setWage(e, -10);
    cout << "Final wage: " << e.wage << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Ensure an account balance never drops below zero.',
    intro: 'Different ways to enforce validation.',
    items: [
      { title: 'Silent ignore if invalid', code: cpp`
#include <iostream>
using namespace std;
struct Bank { int bal; };
void deposit(Bank &b, int amt) {
    if (amt > 0) b.bal += amt;
}
int main() {
    Bank b = {100};
    deposit(b, -50);
    cout << b.bal << endl;
    return 0;
}` },
      { title: 'Boolean return for status', code: cpp`
#include <iostream>
using namespace std;
struct Bank { int bal; };
bool withdraw(Bank &b, int amt) {
    if (amt > 0 && b.bal >= amt) {
        b.bal -= amt;
        return true;
    }
    return false;
}
int main() {
    Bank b = {100};
    bool ok = withdraw(b, 40);
    cout << "Success: " << ok << " Bal: " << b.bal << endl;
    return 0;
}` },
    ],
    takeaway: 'Returning a boolean from a mutator function lets the caller know whether the operation succeeded.',
    check: {
      id: 'oop-u1-l2-check',
      kind: 'mcq',
      prompt: 'Why should class fields be private instead of public?',
      options: [
        'To speed up CPU execution',
        'To prevent external code from putting the object into an invalid state',
        'Because private variables use less memory',
        'Private variables can be accessed without an object',
      ],
      answer: 1,
      explain: 'Private members prevent external code from bypassing validation invariants.',
    },
  },
  watch: [
    { title: 'Validation trace', intro: 'Tracing successful and rejected balance updates.', code: cpp`
#include <iostream>
using namespace std;

struct Wallet {
    int cash;
};

void addCash(Wallet &w, int amount) {
    if (amount > 0) {
        w.cash += amount;
    }
}

int main() {
    Wallet myWallet;
    myWallet.cash = 50;
    addCash(myWallet, 25);
    addCash(myWallet, -100);
    cout << "Cash: " << myWallet.cash << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Temperature sensor validation',
    problem: 'A temperature reading must stay between -50°C and 100°C. If a reading is outside this range, it must be ignored.',
    steps: [
      { text: 'Define the sensor struct with an integer reading.', lines: [4, 5, 6] },
      { text: 'Setter checks if new value is between -50 and 100.', lines: [8, 9, 10] },
      { text: 'Apply updates: 25 (accepted), 150 (rejected), -20 (accepted).', lines: [15, 16, 17] },
      { text: 'Print validated reading.', lines: [18] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Sensor {
    int temp;
};

void setTemp(Sensor &s, int t) {
    if (t >= -50 && t <= 100) s.temp = t;
}

int main() {
    Sensor s = {20};
    setTemp(s, 25);
    setTemp(s, 150);
    setTemp(s, -20);
    cout << s.temp << endl;
    return 0;
}
`,
    why: 'Range checks enforce physical reality constraints before corrupted sensor data reaches downstream logic.',
    yourTurn: {
      id: 'oop-u1-l2-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['s.temp'],
      prompt: 'Dry run the temperature variable as the three setTemp calls execute.',
      code: cpp`
#include <iostream>
using namespace std;

struct Sensor {
    int temp;
};

int main() {
    Sensor s = {0};
    if (30 >= -50 && 30 <= 100) s.temp = 30;
    if (200 >= -50 && 200 <= 100) s.temp = 200;
    if (45 >= -50 && 45 <= 100) s.temp = 45;
    cout << s.temp << endl;
    return 0;
}
`,
      hints: ['30 is valid: temp = 30.', '200 is invalid: temp remains 30.', '45 is valid: temp = 45.'],
      explain: '0 -> 30 -> 30 -> 45.',
    },
  },
  practice: [
    {
      id: 'oop-u1-l2-pred1',
      kind: 'predict',
      prompt: 'What is printed by this program?',
      code: cpp`
#include <iostream>
using namespace std;

struct Score {
    int val;
};

void update(Score &s, int delta) {
    if (s.val + delta >= 0) {
        s.val += delta;
    }
}

int main() {
    Score sc = {10};
    update(sc, -5);
    update(sc, -20);
    cout << sc.val << endl;
    return 0;
}
`,
      explain: 'Starting with 10: 10 + (-5) = 5 >= 0, so sc.val becomes 5. Next, 5 + (-20) = -15 < 0, so it is ignored. Final value is 5.',
    },
    {
      id: 'oop-u1-l2-mcq1',
      kind: 'mcq',
      prompt: 'In C++, what does a "getter" function typically return?',
      options: [
        'Always void',
        'The value of a private member variable',
        'A pointer to the compiler',
        'The name of the class as a string',
      ],
      answer: 1,
      explain: 'A getter (accessor) returns the value of an internal or private field without permitting direct external reassignment.',
    },
    {
      id: 'oop-u1-l2-blanks1',
      kind: 'blanks',
      prompt: 'Fill in the blanks to implement a safe withdrawal function that returns `true` on success and `false` on failure.',
      code: cpp`
#include <iostream>
using namespace std;

bool withdraw(int &balance, int amount) {
    if (amount > 0 && balance >= amount) {
        balance [[1]] amount;
        return [[2]];
    }
    return false;
}

int main() {
    int bal = 100;
    withdraw(bal, 40);
    cout << bal << endl;
    return 0;
}
`,
      blanks: [
        { answers: ['-='] },
        { answers: ['true'] },
      ],
      chips: ['-=', '+=', 'true', 'false', '=='],
      output: '60\n',
      explain: 'Successful withdrawal subtracts amount from balance and returns true.',
    },
    {
      id: 'oop-u1-l2-count1',
      kind: 'count',
      prompt: 'Stair 4 (Hard): How many transactions are REJECTED by the validation guard `if (amt > 0 && acc.balance >= amt)` in this batch run?',
      code: cpp`
#include <iostream>
using namespace std;

struct Account {
    int balance;
};

bool withdraw(Account &acc, int amt) {
    if (amt > 0 && acc.balance >= amt) {
        acc.balance -= amt;
        return true;
    }
    return false;
}

int main() {
    Account myAcc = {100};
    int requests[5] = {40, -10, 50, 30, 0};
    int rejected = 0;
    for (int i = 0; i < 5; i++) {
        if (!withdraw(myAcc, requests[i])) {
            rejected++;
        }
    }
    cout << rejected << endl;
    return 0;
}
`,
      count: { line: 22 },
      unit: 'times',
      explain: '40 succeeds (bal 60). -10 rejected (amt <= 0). 50 succeeds (bal 10). 30 rejected (bal 10 < 30). 0 rejected (amt <= 0). Exactly 3 transactions are rejected (line 22 executes 3 times).',
    },
    {
      id: 'oop-u1-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace this multi-account transfer with atomic validation rollback.',
      code: cpp`
#include <iostream>
using namespace std;

struct Vault {
    int gold;
};

bool transfer(Vault &from, Vault &to, int amt) {
    if (amt > 0 && from.gold >= amt) {
        from.gold -= amt;
        to.gold += amt;
        return true;
    }
    return false;
}

int main() {
    Vault v1 = {80};
    Vault v2 = {20};
    transfer(v1, v2, 50);
    transfer(v1, v2, 40);
    cout << v1.gold << " " << v2.gold << endl;
    return 0;
}
`,
      explain: 'Initial v1=80, v2=20. First transfer(v1, v2, 50) succeeds: v1=30, v2=70. Second transfer(v1, v2, 40) fails because 30 < 40: no change. Final balances: 30 70.',
    },
    {
      id: 'oop-u1-l2-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): In this setter function, rejecting invalid input should preserve the previous state rather than resetting it to 0.',
      code: cpp`
#include <iostream>
using namespace std;

struct User {
    int credits;
};

void setCredits(User &u, int c) {
    u.credits = c;
    if (c < 0) {
        u.credits = 0;
    }
}

int main() {
    User u = {50};
    setCredits(u, -20);
    cout << u.credits << endl;
    return 0;
}
`,
      bugLine: 9,
      options: [
        'u.credits is overwritten before checking if c is valid; it should only be updated if c >= 0',
        'credits cannot be an integer',
        'main cannot create User u',
        'u.credits should be private inside main',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct User {
    int credits;
};

void setCredits(User &u, int c) {
    if (c >= 0) {
        u.credits = c;
    }
}

int main() {
    User u = {50};
    setCredits(u, -20);
    cout << u.credits << endl;
    return 0;
}
`,
      explain: 'A proper setter validates first and only mutates when the argument is valid, preserving previous valid state on rejected input.',
    },
  ],
  cheatsheet: [
    { code: 'int getX() const { return x; }', text: 'getter accessor function' },
    { code: 'void setX(int v) { if (v > 0) x = v; }', text: 'setter mutator with invariant guard' },
  ],
};

const OOP_U1_CP: Level = {
  id: 'checkpoint-oop-encapsulation',
  kind: 'revision',
  title: 'Classes & Encapsulation',
  tagline: 'Test your grasp of object state, data protection, and validation before moving to object lifecycle.',
  objectives: [
    'Distinguish between class vs struct access defaults',
    'Trace functions mutating encapsulated structs and classes',
    'Conquer the Gold Exam Challenge Box on FAST OOP exam questions',
  ],
  practice: [
    {
      id: 'oop-cp1-mcq1',
      kind: 'mcq',
      prompt: 'Which keyword in C++ makes subsequent members visible only within the class definition?',
      options: ['hidden', 'private', 'internal', 'friend'],
      answer: 1,
      explain: 'private restricts member access to member functions and friend declarations.',
    },
    {
      id: 'oop-cp1-pred1',
      kind: 'predict',
      prompt: 'What will this program output?',
      code: cpp`
#include <iostream>
using namespace std;

struct Counter {
    int count;
};

void increment(Counter &c, int times) {
    for (int i = 0; i < times; i++) {
        c.count++;
    }
}

int main() {
    Counter c = {10};
    increment(c, 5);
    cout << c.count << endl;
    return 0;
}
`,
      explain: 'The counter starts at 10 and is incremented 5 times by reference, resulting in 15.',
    },
    {
      id: 'oop-cp1-pred2',
      kind: 'predict',
      prompt: 'Stair 3 (Medium): What is the output of this program swapping struct objects via reference?',
      code: cpp`
#include <iostream>
using namespace std;

struct Pair {
    int first;
    int second;
};

void swapPairs(Pair &p1, Pair &p2) {
    Pair temp = p1;
    p1 = p2;
    p2 = temp;
}

int main() {
    Pair a = {1, 2};
    Pair b = {3, 4};
    swapPairs(a, b);
    cout << a.first << " " << a.second << " " << b.first << " " << b.second << endl;
    return 0;
}
`,
      explain: 'swapPairs swaps the contents of a and b by reference. After swap, a is {3, 4} and b is {1, 2}. Output is 3 4 1 2.',
    },
    {
      id: 'oop-cp1-count1',
      kind: 'count',
      prompt: 'Stair 4 (Hard): How many times does `s.unlocked++` execute in this multi-guess simulation?',
      code: cpp`
#include <iostream>
using namespace std;

struct Safe {
    int pin;
    int unlocked;
};

bool unlock(Safe &s, int tryPin) {
    if (s.pin == tryPin) {
        s.unlocked++;
        return true;
    }
    return false;
}

int main() {
    Safe s = {4321, 0};
    int guesses[5] = {1111, 4321, 1000, 4321, 9999};
    for (int i = 0; i < 5; i++) {
        unlock(s, guesses[i]);
    }
    cout << s.unlocked << endl;
    return 0;
}
`,
      count: { line: 11 },
      unit: 'times',
      explain: 'The pin 4321 matches on guesses[1] and guesses[3]. Line 11 executes exactly 2 times.',
    },
    {
      id: 'oop-cp1-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace the debt-to-income and credit score rules for these applicants.',
      code: cpp`
#include <iostream>
using namespace std;

struct Applicant {
    int score;
    int income;
    int debt;
};

int evaluate(Applicant &a) {
    if (a.debt > a.income * 2) return 0;
    if (a.score >= 700) return a.income * 3;
    if (a.score >= 600) return a.income * 2;
    return 0;
}

int main() {
    Applicant a1 = {720, 50, 80};
    Applicant a2 = {650, 40, 90};
    Applicant a3 = {750, 30, 70};
    cout << evaluate(a1) << " " << evaluate(a2) << " " << evaluate(a3) << endl;
    return 0;
}
`,
      explain: 'a1 has debt 80 <= 100 and score 720 >= 700 -> 150. a2 has debt 90 > 80 -> rejected (0). a3 has debt 70 > 60 -> rejected (0). Output is 150 0 0.',
    },
    {
      id: 'oop-cp1-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): The bonus is not persisting outside the function. Find the line causing pass-by-value slicing.',
      code: cpp`
#include <iostream>
using namespace std;

struct Score {
    int val;
};

void addBonus(Score s, int bonus) {
    s.val += bonus;
}

int main() {
    Score myScore = {50};
    addBonus(myScore, 25);
    cout << myScore.val << endl;
    return 0;
}
`,
      bugLine: 8,
      options: [
        'Score s is passed by value, so modifications are made to a temporary copy that is discarded on return',
        'bonus cannot be added to s.val',
        'myScore cannot be initialized to 50',
        'addBonus must return a string',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Score {
    int val;
};

void addBonus(Score &s, int bonus) {
    s.val += bonus;
}

int main() {
    Score myScore = {50};
    addBonus(myScore, 25);
    cout << myScore.val << endl;
    return 0;
}
`,
      explain: 'Passing by reference `Score &s` ensures modifications alter the caller original object instead of a local discarded copy.',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: Encapsulation & FAST Past Papers',
    intro: 'Authentic FAST-NUCES past exam problems on classes, structs, stream conditions, encapsulation, and reference passing.',
    questions: [
      {
        id: 'oop-gold-u1-q1',
        kind: 'predict',
        source: 'FAST OOP Midterm · Spring 2023',
        tag: 'exam',
        prompt: 'Dry run this class inspection program and predict the exact console output:',
        code: cpp`
#include <iostream>
using namespace std;

struct Register {
    int val;
    int base;
};

void reset(Register &r) {
    r.val = r.base;
}

void step(Register &r, int inc) {
    r.val += inc;
}

int main() {
    Register reg = {10, 5};
    step(reg, 3);
    cout << reg.val << " ";
    reset(reg);
    cout << reg.val << endl;
    return 0;
}
`,
        explain: 'Initially {10, 5}. step(reg, 3) adds 3 to reg.val making it 13. reset(reg) sets reg.val = reg.base (which is 5). Output is 13 5.',
      },
      {
        id: 'oop-gold-u1-q2',
        kind: 'mcq',
        source: 'FAST OOP Midterm · Fall 2022',
        tag: 'exam',
        prompt: 'In C++, if you have `struct A { int x; };` and `class B { int x; };`, which statement is true about `main()`?',
        options: [
          'Both A and B can be directly accessed as a.x and b.x in main()',
          'a.x is allowed because struct members are public by default; b.x causes a compile error because class members are private by default',
          'b.x is allowed because class members are public; a.x causes a compile error',
          'Neither can be accessed without calling malloc',
        ],
        answer: 1,
        explain: 'Struct members default to public access, whereas class members default to private access.',
      },
      {
        id: 'oop-gold-u1-q3',
        kind: 'predict',
        source: 'FAST OOP Midterm · Tricky Stream Case',
        tag: 'exam',
        prompt: 'What is printed by this program involving stream boolean evaluation in an object audit condition?',
        code: cpp`
#include <iostream>
using namespace std;

struct Account {
    int balance;
};

int main() {
    Account a = {500};
    if (cout << "Audit: ") {
        a.balance += 100;
    }
    cout << a.balance << endl;
    return 0;
}
`,
        explain: '`cout << "Audit: "` prints "Audit: " to standard output. The resulting stream object evaluates to true in a boolean context, so the if block runs, increasing balance to 600. Output is "Audit: 600".',
      },
      {
        id: 'oop-gold-u1-q4',
        kind: 'count',
        source: 'FAST OOP Midterm · Spring 2024',
        tag: 'exam',
        prompt: 'How many times is the condition `if (w.cash >= amt)` evaluated in this transaction audit loop?',
        code: cpp`
#include <iostream>
using namespace std;

struct Wallet {
    int cash;
};

bool trySpend(Wallet &w, int amt) {
    if (w.cash >= amt) {
        w.cash -= amt;
        return true;
    }
    return false;
}

int main() {
    Wallet w = {50};
    int attempts[4] = {20, 25, 15, 5};
    for (int i = 0; i < 4; i++) {
        trySpend(w, attempts[i]);
    }
    return 0;
}
`,
        count: { checks: 4 },
        unit: 'times',
        explain: 'The loop runs 4 times, calling trySpend each time. Inside trySpend, the if condition is checked once per call, yielding exactly 4 evaluations.',
      },
      {
        id: 'oop-gold-u1-q5',
        kind: 'predict',
        source: 'FAST OOP Final Exam · Fall 2021',
        tag: 'exam',
        prompt: 'FAST Exam Classic: Trace how struct member pointer reassignment affects the shared state.',
        code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    int weight;
};

void adjust(Node* n, int factor) {
    n->val *= factor;
    n->weight += factor;
}

int main() {
    Node a = {3, 10};
    Node* ptr = &a;
    adjust(ptr, 4);
    cout << a.val << " " << a.weight << endl;
    return 0;
}
`,
        explain: 'Pointer ptr points to a. adjust dereferences n (via ->) to multiply val by 4 (3 * 4 = 12) and add 4 to weight (10 + 4 = 14). Output is 12 14.',
      },
    ],
  },
};

// =====================================================================================
// UNIT 2: Constructors, Destructors & Object Lifecycle
// =====================================================================================

const OOP_U2_L1: Level = {
  id: 'oop-constructors',
  kind: 'lesson',
  title: 'Constructors: Safe Object Initialization',
  tagline: 'An uninitialized object is a disaster waiting to happen. Constructors guarantee that every object is born in a valid, predictable state.',
  minutes: 25,
  objectives: [
    'Define default and parameterized constructors',
    'Understand member initialization syntax',
    'Trace initialization order of object fields',
  ],
  learn: [
    { t: 'p', text: 'Without a constructor, primitive members inside an object contain garbage memory! A **constructor** is a special member function with the **same name as the class** and **no return type**. It executes automatically whenever an instance of the class is created.' },
    { t: 'syntax', title: 'Default and Parameterized Constructors', code: cpp`
class Rectangle {
public:
    int width;
    int height;
    // Default constructor
    Rectangle() {
        width = 1;
        height = 1;
    }
    // Parameterized constructor
    Rectangle(int w, int h) {
        width = w;
        height = h;
    }
};`, parts: [
      { token: 'Rectangle()', text: 'default constructor invoked when writing `Rectangle r;`' },
      { token: 'Rectangle(int w, int h)', text: 'parameterized constructor invoked when writing `Rectangle r(4, 5);`' },
    ] },
    { t: 'viz', title: 'Initializing objects with constructor functions', code: cpp`
#include <iostream>
using namespace std;

struct Student {
    int id;
    int marks;
};

void initDefault(Student &s) {
    s.id = 0;
    s.marks = 0;
}

void initCustom(Student &s, int i, int m) {
    s.id = i;
    s.marks = m;
}

int main() {
    Student s1, s2;
    initDefault(s1);
    initCustom(s2, 2133, 88);
    cout << "s1: " << s1.id << ", " << s1.marks << endl;
    cout << "s2: " << s2.id << ", " << s2.marks << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Initialize a Time object with hours and minutes.',
    intro: 'Two ways to ensure valid starting values.',
    items: [
      { title: 'Default values in struct', code: cpp`
#include <iostream>
using namespace std;
struct Time {
    int h = 12;
    int m = 0;
};
int main() {
    Time t;
    cout << t.h << ":" << t.m << endl;
    return 0;
}` },
      { title: 'Explicit init function', code: cpp`
#include <iostream>
using namespace std;
struct Time {
    int h;
    int m;
};
void setTime(Time &t, int h, int m) {
    t.h = (h >= 0 && h < 24) ? h : 0;
    t.m = (m >= 0 && m < 60) ? m : 0;
}
int main() {
    Time t;
    setTime(t, 9, 30);
    cout << t.h << ":" << t.m << endl;
    return 0;
}` },
    ],
    takeaway: 'Guaranteed initialization prevents reading unpredictable garbage values from stack memory.',
    check: {
      id: 'oop-u2-l1-check',
      kind: 'mcq',
      prompt: 'What is the return type of a C++ constructor?',
      options: ['void', 'int', 'bool', 'No return type at all (not even void)'],
      answer: 3,
      explain: 'Constructors do not specify any return type, not even void.',
    },
  },
  watch: [
    { title: 'Constructor execution trace', intro: 'Watch initialization values applied in memory.', code: cpp`
#include <iostream>
using namespace std;

struct Box {
    int len;
    int wid;
};

void createBox(Box &b, int l, int w) {
    b.len = l;
    b.wid = w;
}

int main() {
    Box b1;
    createBox(b1, 3, 7);
    cout << "Area: " << b1.len * b1.wid << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Coordinate distance calculation',
    problem: 'Initialize two 2D points and calculate Manhattan distance: |x2 - x1| + |y2 - y1|.',
    steps: [
      { text: 'Define Point struct with x and y coordinates.', lines: [4, 5, 6] },
      { text: 'Initialize Point p1 at (2, 5) and Point p2 at (8, 9).', lines: [10, 11] },
      { text: 'Compute absolute differences in x and y.', lines: [12, 13] },
      { text: 'Print Manhattan distance.', lines: [14] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

int main() {
    Point p1 = {2, 5};
    Point p2 = {8, 9};
    int dx = p2.x - p1.x;
    int dy = p2.y - p1.y;
    cout << "Dist: " << dx + dy << endl;
    return 0;
}
`,
    why: 'Structured initialization ensures coordinates are correctly paired.',
    yourTurn: {
      id: 'oop-u2-l1-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['dx', 'dy'],
      prompt: 'Dry run dx and dy calculations.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int dx = 10 - 4;
    int dy = 12 - 7;
    cout << dx + dy << endl;
    return 0;
}
`,
      hints: ['dx = 10 - 4 = 6.', 'dy = 12 - 7 = 5.'],
      explain: 'dx = 6, dy = 5. Total = 11.',
    },
  },
  practice: [
    {
      id: 'oop-u2-l1-mcq1',
      kind: 'mcq',
      prompt: 'When does a default constructor execute?',
      options: [
        'When the program terminates',
        'When an object is declared without any arguments',
        'Only when explicitly called like a normal function',
        'When `delete` is called on the object',
      ],
      answer: 1,
      explain: 'The default constructor is invoked automatically when an object is instantiated without arguments (e.g. `MyClass obj;`).',
    },
    {
      id: 'oop-u2-l1-pred1',
      kind: 'predict',
      prompt: 'What is the output of this program?',
      code: cpp`
#include <iostream>
using namespace std;

struct Pair {
    int a;
    int b;
};

void init(Pair &p, int x = 2, int y = 5) {
    p.a = x;
    p.b = y;
}

int main() {
    Pair p1, p2;
    init(p1);
    init(p2, 10, 20);
    cout << p1.a + p1.b << " " << p2.a + p2.b << endl;
    return 0;
}
`,
      explain: 'p1 uses defaults: 2 + 5 = 7. p2 uses provided values: 10 + 20 = 30. Output is 7 30.',
    },
    {
      id: 'oop-u2-l1-mcq2',
      kind: 'mcq',
      prompt: 'What must be the return type and identifier of a constructor for `class Point`?',
      options: [
        'It must have no return type and match the class name `Point`',
        'It must return void and be named init',
        'It must return Point* and be named create',
        'It must return int and be named Point',
      ],
      answer: 0,
      explain: 'A constructor in C++ has no return type (not even void) and its identifier must exactly match the class name.',
    },
    {
      id: 'oop-u2-l1-count1',
      kind: 'count',
      prompt: 'Stair 4 (Hard): How many objects have their id initialized by `setup` in this batch?',
      code: cpp`
#include <iostream>
using namespace std;

struct Widget {
    int id;
};

void setup(Widget &w, int id) {
    w.id = id;
}

int main() {
    Widget batch[4];
    for (int i = 0; i < 4; i++) {
        setup(batch[i], i * 10);
    }
    cout << batch[3].id << endl;
    return 0;
}
`,
      count: { line: 10 },
      unit: 'times',
      explain: 'The loop runs 4 times, calling setup on each of the 4 Widget objects in the batch. Line 10 executes 4 times.',
    },
    {
      id: 'oop-u2-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace how default constructor arguments interact across two instances.',
      code: cpp`
#include <iostream>
using namespace std;

struct Vector2 {
    int x;
    int y;
};

void init(Vector2 &v, int a = 1, int b = 2) {
    v.x = a;
    v.y = b * 2;
}

int main() {
    Vector2 v1, v2;
    init(v1);
    init(v2, 5);
    cout << v1.x + v1.y << " " << v2.x + v2.y << endl;
    return 0;
}
`,
      explain: 'v1 uses default arguments (a=1, b=2) resulting in x=1, y=4 (sum 5). v2 overrides a with 5 and uses default b=2 resulting in x=5, y=4 (sum 9). Output is 5 9.',
    },
    {
      id: 'oop-u2-l1-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): The constructor function fails to initialize the `hp` member. Identify the missing statement.',
      code: cpp`
#include <iostream>
using namespace std;

struct Player {
    int hp;
};

void initPlayer(Player &p) {
    // hp left unassigned
}

int main() {
    Player p;
    p.hp = 0;
    initPlayer(p);
    cout << p.hp << endl;
    return 0;
}
`,
      bugLine: 9,
      options: [
        'initPlayer leaves hp uninitialized rather than setting the required starting value 100',
        'Player cannot be passed to a function',
        'hp must be a double',
        'cout cannot print p.hp',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Player {
    int hp;
};

void initPlayer(Player &p) {
    p.hp = 100;
}

int main() {
    Player p;
    p.hp = 0;
    initPlayer(p);
    cout << p.hp << endl;
    return 0;
}
`,
      explain: 'Proper initialization guarantees predictable non-zero starting state.',
    },
  ],
  cheatsheet: [
    { code: 'ClassName()', text: 'default constructor' },
    { code: 'ClassName(int x, int y)', text: 'parameterized constructor' },
    { code: 'Point p(10, 20);', text: 'invoking parameterized constructor on stack' },
  ],
};

const OOP_U2_L2: Level = {
  id: 'oop-destructors',
  kind: 'lesson',
  title: 'Destructors: Resource Cleanup and Lifecycle',
  tagline: 'Every object created must eventually die. Destructors run when an object goes out of scope, releasing memory and closing files.',
  minutes: 20,
  objectives: [
    'Understand scope and object lifetime in C++',
    'Know when destructors are invoked (stack unwind vs heap delete)',
    'Trace LIFO destruction order of local objects',
  ],
  learn: [
    { t: 'p', text: 'When a variable goes out of scope (for instance at the closing brace `}` of a block or function), C++ automatically cleans it up. If the object allocated dynamic memory on the heap (with `new`), its **destructor** must free that memory (`delete`), or your program will leak memory!' },
    { t: 'syntax', title: 'Destructor Syntax', code: cpp`
class DynamicArray {
private:
    int* ptr;
public:
    DynamicArray(int size) {
        ptr = new int[size];
    }
    ~DynamicArray() {      // Destructor: tilde + class name
        delete[] ptr;
    }
};`, parts: [
      { token: '~DynamicArray()', text: 'destructor: preceded by a tilde ~, takes NO parameters, and has NO return type' },
      { token: 'delete[] ptr;', text: 'frees heap memory owned by this instance' },
    ] },
    { t: 'callout', tone: 'key', title: 'LIFO Destruction Order', text: 'Local objects created on the stack are destroyed in **reverse order of creation** (Last In, First Out). The object created last is destroyed first!' },
    { t: 'viz', title: 'Simulating cleanup at scope exit', code: cpp`
#include <iostream>
using namespace std;

struct Resource {
    int id;
};

void acquire(Resource &r, int id) {
    r.id = id;
    cout << "Acquired " << r.id << endl;
}

void release(Resource &r) {
    cout << "Released " << r.id << endl;
}

int main() {
    Resource r1, r2;
    acquire(r1, 1);
    acquire(r2, 2);
    // Destructors run in reverse order
    release(r2);
    release(r1);
    return 0;
}
` },
  ],
  ways: {
    goal: 'Manage dynamically allocated resource with guaranteed release.',
    intro: 'Procedural vs RAII cleanup.',
    items: [
      { title: 'Manual cleanup function', code: cpp`
#include <iostream>
using namespace std;
struct Buffer {
    int* data;
};
void clean(Buffer &b) {
    delete[] b.data;
    cout << "Cleaned" << endl;
}
int main() {
    Buffer b;
    b.data = new int[5];
    clean(b);
    return 0;
}` },
      { title: 'Stack scoping simulation', code: cpp`
#include <iostream>
using namespace std;
int main() {
    int* p = new int[3];
    p[0] = 10;
    cout << p[0] << endl;
    delete[] p;
    return 0;
}` },
    ],
    takeaway: 'In C++, RAII (Resource Acquisition Is Initialization) ties resource lifetime directly to object scope.',
    check: {
      id: 'oop-u2-l2-check',
      kind: 'mcq',
      prompt: 'If object A is created first on the stack and object B is created second, in what order are their destructors called when the scope ends?',
      options: ['A first, then B', 'B first, then A (LIFO)', 'Both simultaneously', 'Random order'],
      answer: 1,
      explain: 'Stack objects are destroyed in reverse order of construction: B first, then A.',
    },
  },
  watch: [
    { title: 'LIFO order demo', intro: 'Notice the reverse execution order of release functions.', code: cpp`
#include <iostream>
using namespace std;

void logCreate(int id) {
    cout << "+ Object " << id << endl;
}

void logDestroy(int id) {
    cout << "- Object " << id << endl;
}

int main() {
    logCreate(1);
    logCreate(2);
    logCreate(3);
    logDestroy(3);
    logDestroy(2);
    logDestroy(1);
    return 0;
}
` },
  ],
  think: {
    title: 'Stack resource unwind',
    problem: 'Three database connections (1, 2, 3) are opened in sequential order. When exiting the block, they must be closed in reverse order (3, 2, 1).',
    steps: [
      { text: 'Log opening of connections 1, 2, 3.', lines: [6, 7, 8] },
      { text: 'Perform transaction processing.', lines: [9] },
      { text: 'Log closing in LIFO reverse order.', lines: [10, 11, 12] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "Open 1" << endl;
    cout << "Open 2" << endl;
    cout << "Open 3" << endl;
    cout << "Working..." << endl;
    cout << "Close 3" << endl;
    cout << "Close 2" << endl;
    cout << "Close 1" << endl;
    return 0;
}
`,
    why: 'LIFO destruction prevents child objects from referencing parents that have already been torn down.',
    yourTurn: {
      id: 'oop-u2-l2-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'Predict the console output as objects 10 and 20 are constructed and destroyed in reverse order.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "C10" << endl;
    cout << "C20" << endl;
    cout << "D20" << endl;
    cout << "D10" << endl;
    return 0;
}
`,
      hints: ['Construction: C10 then C20.', 'Destruction is LIFO: D20 then D10.'],
      explain: 'Outputs C10, C20, D20, D10.',
    },
  },
  practice: [
    {
      id: 'oop-u2-l2-mcq1',
      kind: 'mcq',
      prompt: 'How many destructors can a single C++ class have?',
      options: ['As many as needed, via overloading', 'Exactly one', 'Two: one default and one parameterized', 'Zero'],
      answer: 1,
      explain: 'A class can have only one destructor because destructors cannot take any parameters or be overloaded.',
    },
    {
      id: 'oop-u2-l2-pred1',
      kind: 'predict',
      prompt: 'What is printed by this program?',
      code: cpp`
#include <iostream>
using namespace std;

void run() {
    cout << "Start ";
    cout << "Middle ";
    cout << "End" << endl;
}

int main() {
    run();
    return 0;
}
`,
      explain: 'Prints "Start Middle End".',
    },
    {
      id: 'oop-u2-l2-mcq2',
      kind: 'mcq',
      prompt: 'Which symbol precedes the class name to declare a destructor in C++?',
      options: [
        '~ (tilde)',
        '! (exclamation mark)',
        '& (ampersand)',
        '* (asterisk)',
      ],
      answer: 0,
      explain: 'In C++, a destructor is denoted by a tilde ~ followed by the exact class name (e.g. ~MemoryBlock()).',
    },
    {
      id: 'oop-u2-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Trace block-scoped creation and destruction inside a loop.',
      code: cpp`
#include <iostream>
using namespace std;

void ctor(int id) { cout << "+" << id; }
void dtor(int id) { cout << "-" << id; }

int main() {
    ctor(1);
    for (int i = 2; i <= 3; i++) {
        ctor(i);
        dtor(i);
    }
    dtor(1);
    cout << endl;
    return 0;
}
`,
      explain: 'ctor(1) prints "+1". Loop i=2: ctor(2) -> "+2", dtor(2) -> "-2". Loop i=3: ctor(3) -> "+3", dtor(3) -> "-3". Finally dtor(1) -> "-1". Output is +1+2-2+3-3-1.',
    },
    {
      id: 'oop-u2-l2-count1',
      kind: 'count',
      prompt: 'Stair 5 (More Hard): How many times is the cleanup routine called across valid and invalid transaction processing?',
      code: cpp`
#include <iostream>
using namespace std;

int cleanups = 0;
void cleanup() { cleanups++; }

bool process(int code) {
    if (code < 0) {
        cleanup();
        return false;
    }
    cleanup();
    return true;
}

int main() {
    process(5);
    process(-1);
    process(10);
    cout << cleanups << endl;
    return 0;
}
`,
      count: { line: 5 },
      unit: 'times',
      explain: 'Every call to process (whether code < 0 or code >= 0) executes cleanup exactly once. With 3 calls, line 5 runs 3 times.',
    },
    {
      id: 'oop-u2-l2-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Destruction order must follow LIFO (reverse order of creation). Identify the line with FIFO destruction.',
      code: cpp`
#include <iostream>
using namespace std;

void dtor(int id) {
    cout << "D" << id << " ";
}

int main() {
    dtor(1);
    dtor(2);
    cout << endl;
    return 0;
}
`,
      bugLine: 9,
      options: [
        'Stack objects must be destroyed in reverse order (Obj 2 first, then Obj 1)',
        'Destructors cannot be called in main',
        'cout cannot end with endl',
        'int id cannot be passed to dtor',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

void dtor(int id) {
    cout << "D" << id << " ";
}

int main() {
    dtor(2);
    dtor(1);
    cout << endl;
    return 0;
}
`,
      explain: 'Stack unwinding guarantees LIFO destruction: the most recently constructed object is destroyed first.',
    },
  ],
  cheatsheet: [
    { code: '~ClassName()', text: 'destructor: runs on scope exit or delete' },
    { code: 'delete ptr;', text: 'invokes destructor for heap object, then frees memory' },
    { code: 'delete[] arr;', text: 'invokes destructors for array of heap objects' },
  ],
};

const OOP_U2_CP: Level = {
  id: 'checkpoint-oop-lifecycle',
  kind: 'revision',
  title: 'Constructors & Destructors',
  tagline: 'Review object construction, memory initialization, and destructor dispatch rules.',
  objectives: [
    'Identify valid constructor syntax and default argument rules',
    'Predict destructor call order across nested scopes',
    'Conquer the Gold Exam Challenge Box on object lifecycle',
  ],
  practice: [
    {
      id: 'oop-cp2-mcq1',
      kind: 'mcq',
      prompt: 'Which of the following constructor declarations is syntactically invalid for `class Matrix`?',
      options: [
        'Matrix();',
        'Matrix(int r, int c);',
        'void Matrix();',
        'Matrix(const Matrix &m);',
      ],
      answer: 2,
      explain: 'Constructors must NOT have a return type. `void Matrix();` is illegal.',
    },
    {
      id: 'oop-cp2-pred1',
      kind: 'predict',
      prompt: 'Stair 2 (Easy-Medium): Trace object member initialization with default offsets.',
      code: cpp`
#include <iostream>
using namespace std;

struct Offset {
    int dx;
    int dy;
};

void setOffset(Offset &o, int x, int y = 10) {
    o.dx = x + 1;
    o.dy = y + 2;
}

int main() {
    Offset o;
    setOffset(o, 4);
    cout << o.dx << " " << o.dy << endl;
    return 0;
}
`,
      explain: 'x=4, y uses default 10. dx = 4 + 1 = 5, dy = 10 + 2 = 12. Output is 5 12.',
    },
    {
      id: 'oop-cp2-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many times is the constructor simulation function invoked?',
      code: cpp`
#include <iostream>
using namespace std;

int constructed = 0;
void construct(int id) {
    constructed++;
}

int main() {
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 2; j++) {
            construct(i * 10 + j);
        }
    }
    cout << constructed << endl;
    return 0;
}
`,
      count: { line: 5 },
      unit: 'times',
      explain: 'Outer loop runs 3 times, inner loop runs 2 times. Total invocations = 3 * 2 = 6 times.',
    },
    {
      id: 'oop-cp2-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Trace LIFO destruction across nested and inner scopes.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "A";
    {
        cout << "B";
        {
            cout << "C";
            cout << "~C";
        }
        cout << "~B";
    }
    cout << "~A" << endl;
    return 0;
}
`,
      explain: 'Nested scopes create and destroy objects in reverse order of block entry. Output is ABC~C~B~A.',
    },
    {
      id: 'oop-cp2-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Array of objects initialized and modified in alternating order.',
      code: cpp`
#include <iostream>
using namespace std;

struct Item {
    int val;
};

int main() {
    Item items[3] = {{10}, {20}, {30}};
    for (int i = 0; i < 3; i++) {
        if (i % 2 == 0) items[i].val += 5;
        else items[i].val *= 2;
    }
    cout << items[0].val << " " << items[1].val << " " << items[2].val << endl;
    return 0;
}
`,
      explain: 'i=0: 10 + 5 = 15. i=1: 20 * 2 = 40. i=2: 30 + 5 = 35. Output is 15 40 35.',
    },
    {
      id: 'oop-cp2-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 10 assigns 0 instead of parameter b, corrupting initial coordinates.',
      code: cpp`
#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

void initPoint(Point &p, int a, int b) {
    p.x = a;
    p.y = 0;
}

int main() {
    Point p;
    initPoint(p, 3, 7);
    cout << p.x + p.y << endl;
    return 0;
}
`,
      bugLine: 10,
      options: [
        'p.y is assigned 0 instead of parameter b',
        'Point cannot have two members',
        'main cannot call initPoint',
        'cout cannot sum p.x and p.y',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

void initPoint(Point &p, int a, int b) {
    p.x = a;
    p.y = b;
}

int main() {
    Point p;
    initPoint(p, 3, 7);
    cout << p.x + p.y << endl;
    return 0;
}
`,
      explain: 'Assigning parameter b correctly sets p.y so 3 + 7 = 10 is printed.',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: Object Lifecycle & Scope',
    intro: 'FAST past exam questions on constructor chaining, default parameters, and LIFO destruction order.',
    questions: [
      {
        id: 'oop-gold-u2-q1',
        kind: 'predict',
        source: 'FAST OOP Midterm · Spring 2022',
        tag: 'exam',
        prompt: 'Predict the exact console output of this object tracking sequence:',
        code: cpp`
#include <iostream>
using namespace std;

void create(int id) {
    cout << "C" << id << " ";
}

void destroy(int id) {
    cout << "D" << id << " ";
}

int main() {
    create(1);
    create(2);
    destroy(2);
    destroy(1);
    cout << "Done" << endl;
    return 0;
}
`,
        explain: 'Prints "C1 C2 D2 D1 Done".',
      },
      {
        id: 'oop-gold-u2-q2',
        kind: 'mcq',
        source: 'FAST OOP Midterm · Fall 2023',
        tag: 'exam',
        prompt: 'What happens if a class dynamically allocates an array on the heap inside its constructor using `new int[10]`, but the class has no destructor with `delete[]`?',
        options: [
          'The compiler automatically inserts delete[] for all heap pointers',
          'A memory leak occurs: heap memory is orphaned when the object goes out of scope',
          'A runtime segmentation fault occurs at the end of main',
          'The heap memory is converted into stack memory automatically',
        ],
        answer: 1,
        explain: 'C++ does not have automatic garbage collection. Any memory allocated with new that is not freed with delete will leak.',
      },
      {
        id: 'oop-gold-u2-q3',
        kind: 'count',
        source: 'FAST OOP Midterm · Spring 2023',
        tag: 'exam',
        prompt: 'How many times does the loop body execute in this batch object initializer?',
        code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int id;
};

int main() {
    Node nodes[5];
    int count = 0;
    for (int i = 0; i < 5; i++) {
        nodes[i].id = i * 10;
        count++;
    }
    cout << count << endl;
    return 0;
}
`,
        count: { line: 12 },
        unit: 'times',
        explain: 'The loop initializes 5 nodes (indices 0 to 4), running line 12 exactly 5 times.',
      },
      {
        id: 'oop-gold-u2-q4',
        kind: 'predict',
        source: 'FAST OOP Final Exam · Fall 2022',
        tag: 'exam',
        prompt: 'FAST Exam Classic: Trace constructor chaining and lifecycle ordering.',
        code: cpp`
#include <iostream>
using namespace std;

void logStep(const char* s) {
    cout << s << " ";
}

int main() {
    logStep("InitBase");
    logStep("InitDerived");
    logStep("FreeDerived");
    logStep("FreeBase");
    cout << endl;
    return 0;
}
`,
        explain: 'Base is constructed first, then Derived. Derived is destructed first, then Base. Output is InitBase InitDerived FreeDerived FreeBase.',
      },
      {
        id: 'oop-gold-u2-q5',
        kind: 'mcq',
        source: 'FAST OOP Midterm · Spring 2024',
        tag: 'exam',
        prompt: 'Which constructor is called when you write `Rectangle arr[5];`?',
        options: [
          'The default constructor (called 5 times, once for each element)',
          'The parameterized constructor with 0 arguments',
          'No constructor is called until an element is assigned',
          'Only a single constructor for the entire array pointer',
        ],
        answer: 0,
        explain: 'Instantiating an array of 5 objects automatically invokes the default constructor exactly 5 times, once for each object in contiguous memory.',
      },
    ],
  },
};

// =====================================================================================
// UNIT 3: Deep Copy & Dynamic Memory in Classes
// =====================================================================================

const OOP_U3_L1: Level = {
  id: 'oop-deep-copy',
  kind: 'lesson',
  title: 'The Copy Constructor: Shallow vs. Deep Copy',
  tagline: 'When an object holds a pointer, the default copy just copies the memory address — leaving two objects pointing to the same memory! Deep copy duplicates the actual data.',
  minutes: 25,
  objectives: [
    'Understand why shallow copy causes double-free and dangling pointer errors',
    'Write a copy constructor with signature `ClassName(const ClassName &other)`',
    'Allocate independent heap memory in the copy constructor',
  ],
  learn: [
    { t: 'p', text: 'Suppose object `A` has a pointer `int* data = new int[5];`. If you write `B = A;` using default copy, `B.data` gets the exact same pointer address! Now both `A` and `B` point to the same array. When `A` is destroyed, its destructor deletes the array. When `B` is destroyed, it deletes the same memory again — causing a crash known as a **double-free error**!' },
    { t: 'syntax', title: 'Deep Copy Constructor', code: cpp`
class Buffer {
public:
    int size;
    int* data;
    // Copy Constructor
    Buffer(const Buffer &other) {
        size = other.size;
        data = new int[size];   // 1. Allocate new heap storage
        for (int i = 0; i < size; i++) {
            data[i] = other.data[i]; // 2. Copy values
        }
    }
};`, parts: [
      { token: 'Buffer(const Buffer &other)', text: 'takes other object by CONST REFERENCE to prevent infinite recursive copying' },
      { token: 'new int[size]', text: 'crucial: allocates fresh independent memory block on heap' },
      { token: 'data[i] = other.data[i]', text: 'copies contents element by element' },
    ] },
    { t: 'callout', tone: 'warn', title: 'Pass by Reference is Mandatory!', text: 'The parameter to a copy constructor MUST be passed by reference `&`. If passed by value, passing the argument would require calling the copy constructor, which requires passing the argument... causing infinite recursion at compile time!' },
    { t: 'viz', title: 'Deep copy simulation with dynamic arrays', code: cpp`
#include <iostream>
using namespace std;

struct ArrayHolder {
    int size;
    int data[5];
};

void copyArray(ArrayHolder &src, ArrayHolder &dest) {
    dest.size = src.size;
    for (int i = 0; i < src.size; i++) {
        dest.data[i] = src.data[i];
    }
}

int main() {
    ArrayHolder a1;
    a1.size = 3;
    a1.data[0] = 10; a1.data[1] = 20; a1.data[2] = 30;
    ArrayHolder a2;
    copyArray(a1, a2);
    // Modifying a2 does not affect a1
    a2.data[0] = 99;
    cout << "a1[0]: " << a1.data[0] << " a2[0]: " << a2.data[0] << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Make an independent clone of an array object.',
    intro: 'Shallow vs Deep Copy comparison.',
    items: [
      { title: 'Independent deep clone', code: cpp`
#include <iostream>
using namespace std;
struct Box { int val; };
void deepCopy(Box &src, Box &dst) { dst.val = src.val; }
int main() {
    Box b1 = {100};
    Box b2;
    deepCopy(b1, b2);
    b2.val = 500;
    cout << b1.val << " " << b2.val << endl;
    return 0;
}` },
    ],
    takeaway: 'With deep copy, changing the duplicate leaves the original completely untouched.',
    check: {
      id: 'oop-u3-l1-check',
      kind: 'mcq',
      prompt: 'Why must the parameter of a copy constructor `T(const T &other)` be a reference?',
      options: [
        'To speed up arithmetic',
        'Passing by value would itself call the copy constructor, causing infinite recursion',
        'C++ does not allow const variables by value',
        'Pointers cannot be copied without a reference',
      ],
      answer: 1,
      explain: 'If the parameter were passed by value, creating the parameter would invoke the copy constructor again infinitely.',
    },
  },
  watch: [
    { title: 'Verifying independence of copied object', intro: 'Notice that mutating the copy leaves the original unchanged.', code: cpp`
#include <iostream>
using namespace std;

struct IntList {
    int vals[3];
};

int main() {
    IntList orig;
    orig.vals[0] = 7;
    IntList copy = orig;
    copy.vals[0] = 99;
    cout << "Orig: " << orig.vals[0] << " Copy: " << copy.vals[0] << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Array independence verification',
    problem: 'Clone an array of 3 numbers. Modify index 1 in the clone and verify that the original array remains completely intact.',
    steps: [
      { text: 'Create original array with {10, 20, 30}.', lines: [8] },
      { text: 'Deep copy elements into clone array.', lines: [10, 11] },
      { text: 'Mutate clone at index 1 to 99.', lines: [12] },
      { text: 'Print both original and clone values at index 1.', lines: [13] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    int orig[3] = {10, 20, 30};
    int clone[3];
    for (int i = 0; i < 3; i++) {
        clone[i] = orig[i];
    }
    clone[1] = 99;
    cout << orig[1] << " " << clone[1] << endl;
    return 0;
}
`,
    why: 'Deep copy isolates memory blocks so mutations in one object never contaminate another.',
    yourTurn: {
      id: 'oop-u3-l1-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['orig[0]', 'clone[0]'],
      prompt: 'Trace the two variables as clone[0] is modified.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int orig[1] = {5};
    int clone[1];
    clone[0] = orig[0];
    clone[0] = 50;
    cout << orig[0] << " " << clone[0] << endl;
    return 0;
}
`,
      hints: ['orig[0] starts at 5 and never changes.', 'clone[0] starts at 5 and is overwritten with 50.'],
      explain: 'orig[0] remains 5; clone[0] becomes 50.',
    },
  },
  practice: [
    {
      id: 'oop-u3-l1-mcq1',
      kind: 'mcq',
      prompt: 'What happens when two objects perform a shallow copy of a pointer member, and both run their destructors with `delete`?',
      options: [
        'The memory is safely freed twice',
        'A runtime double-free crash occurs',
        'The second delete is ignored silently',
        'The compiler converts it to garbage collection',
      ],
      answer: 1,
      explain: 'Attempting to deallocate the same heap memory address twice invokes undefined behavior and typically causes a segmentation fault / abort crash.',
    },
    {
      id: 'oop-u3-l1-pred1',
      kind: 'predict',
      prompt: 'What is printed by this program?',
      code: cpp`
#include <iostream>
using namespace std;

struct Item {
    int id;
    int qty;
};

void cloneItem(Item &src, Item &dst) {
    dst.id = src.id;
    dst.qty = src.qty;
}

int main() {
    Item a = {1, 50};
    Item b;
    cloneItem(a, b);
    b.qty += 20;
    cout << a.qty << " " << b.qty << endl;
    return 0;
}
`,
      explain: 'a.qty is 50. b.qty was cloned to 50 and then incremented by 20 to 70. Output is 50 70.',
    },
    {
      id: 'oop-u3-l1-mcq2',
      kind: 'mcq',
      prompt: 'Stair 3 (Medium): Why must the copy constructor parameter be a const reference `const T &other`?',
      options: [
        'To allow copying from temporary/rvalue objects and guarantee the source object is never mutated',
        'To force the compiler to allocate memory on the GPU',
        'Because C++ does not allow references without const',
        'To allow the copy constructor to return an integer error code',
      ],
      answer: 0,
      explain: 'const reference binds to both lvalues and temporary rvalues while guaranteeing read-only access to the source object.',
    },
    {
      id: 'oop-u3-l1-count1',
      kind: 'count',
      prompt: 'Stair 4 (Hard): How many array elements are copied by the deep copy loop in this execution?',
      code: cpp`
#include <iostream>
using namespace std;

struct Vector {
    int data[4];
    int size;
};

void deepCopy(Vector &src, Vector &dst) {
    dst.size = src.size;
    for (int i = 0; i < src.size; i++) {
        dst.data[i] = src.data[i];
    }
}

int main() {
    Vector v1 = {{10, 20, 30}, 3};
    Vector v2;
    deepCopy(v1, v2);
    cout << v2.data[2] << endl;
    return 0;
}
`,
      count: { line: 13 },
      unit: 'times',
      explain: 'src.size is 3, so the loop runs for i = 0, 1, 2. Line 13 executes exactly 3 times.',
    },
    {
      id: 'oop-u3-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): What is printed when two handles share a pointer via shallow copy?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
};

struct Handle {
    Node* ptr;
};

int main() {
    Node n = {100};
    Handle h1 = {&n};
    Handle h2 = h1;
    h2.ptr->val = 250;
    cout << h1.ptr->val << " " << h2.ptr->val << endl;
    return 0;
}
`,
      explain: 'h2 is a shallow copy of h1, so h2.ptr and h1.ptr point to the same Node n. Mutating through h2 modifies n, so both print 250. Output is 250 250.',
    },
    {
      id: 'oop-u3-l1-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 9 fails to copy the capacity member `cap` during cloning. Identify the bug.',
      code: cpp`
#include <iostream>
using namespace std;

struct Array {
    int size;
    int cap;
};

void copyArray(Array &src, Array &dst) {
    dst.size = src.size;
    // cap left unassigned
}

int main() {
    Array a = {5, 10};
    Array b = {0, 0};
    copyArray(a, b);
    cout << b.size + b.cap << endl;
    return 0;
}
`,
      bugLine: 11,
      options: [
        'copyArray omits copying src.cap into dst.cap, leaving dst.cap with 0',
        'Array cannot have two integer members',
        'main cannot create Array a',
        'b.size and b.cap cannot be summed',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Array {
    int size;
    int cap;
};

void copyArray(Array &src, Array &dst) {
    dst.size = src.size;
    dst.cap = src.cap;
}

int main() {
    Array a = {5, 10};
    Array b = {0, 0};
    copyArray(a, b);
    cout << b.size + b.cap << endl;
    return 0;
}
`,
      explain: 'A complete copy duplicates all member state, so dst.cap = src.cap yields 5 + 10 = 15.',
    },
  ],
  cheatsheet: [
    { code: 'T(const T &other)', text: 'copy constructor signature' },
    { code: 'Shallow Copy', text: 'copies pointer addresses (aliasing disaster)' },
    { code: 'Deep Copy', text: 'allocates new memory and duplicates data' },
  ],
};

const OOP_U3_L2: Level = {
  id: 'oop-rule-of-three',
  kind: 'lesson',
  title: 'Dynamic Memory & The Rule of Three',
  tagline: 'If a class manages raw heap memory, you must implement three things together: Destructor, Copy Constructor, and Copy Assignment Operator.',
  minutes: 25,
  objectives: [
    'State the Rule of Three and why it exists',
    'Allocate and deallocate dynamic 2D matrices in classes',
    'Avoid memory leaks and wild pointer references',
  ],
  learn: [
    { t: 'p', text: 'The **Rule of Three** states that if your class needs an explicit **Destructor** to free resources, it almost certainly also needs a user-defined **Copy Constructor** and **Copy Assignment Operator (`operator=`)**. If you skip any of them, copying an object will result in shallow pointer aliasing and memory corruption.' },
    { t: 'table', head: ['Special Member', 'Trigger Condition', 'Purpose'], rows: [
      ['Destructor `~T()`', 'Object goes out of scope', 'Free heap memory with `delete[]`'],
      ['Copy Constructor `T(const T&)`', '`T b = a;` or pass by value', 'Allocate new memory and deep-copy values'],
      ['Assignment `T& operator=(const T&)`', '`b = a;` (both already exist)', 'Free old memory, allocate new, copy data'],
    ], caption: 'The Holy Trinity of C++ Resource Management.' },
    { t: 'viz', title: 'Dynamic 2D Matrix management in procedural simulation', code: cpp`
#include <iostream>
using namespace std;

struct Matrix {
    int rows;
    int cols;
};

int main() {
    Matrix m;
    m.rows = 2;
    m.cols = 3;
    int* data = new int[m.rows * m.cols];
    for (int i = 0; i < m.rows * m.cols; i++) {
        data[i] = (i + 1) * 10;
    }
    cout << "Cell (1, 2): " << data[1 * m.cols + 2] << endl;
    delete[] data;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Store a dynamic array of integers safely.',
    intro: 'Linear array allocation and cleanup.',
    items: [
      { title: 'Flattened 1D array indexing', code: cpp`
#include <iostream>
using namespace std;
int main() {
    int r = 2, c = 2;
    int* mat = new int[r * c];
    mat[0 * c + 0] = 1;
    mat[1 * c + 1] = 4;
    cout << mat[0] << " " << mat[3] << endl;
    delete[] mat;
    return 0;
}` },
    ],
    takeaway: 'Flattened 1D array `index = row * cols + col` uses a single dynamic allocation and avoids multi-pointer fragmentation.',
    check: {
      id: 'oop-u3-l2-check',
      kind: 'mcq',
      prompt: 'What are the three components of the C++ Rule of Three?',
      options: [
        'main(), cin, and cout',
        'Destructor, Copy Constructor, and Copy Assignment Operator',
        'public, private, and protected',
        'int, double, and char',
      ],
      answer: 1,
      explain: 'The Rule of Three specifies: Destructor, Copy Constructor, and Copy Assignment Operator.',
    },
  },
  watch: [
    { title: 'Dynamic allocation and release trace', intro: 'Watch pointer allocation on heap and subsequent release.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int n = 3;
    int* arr = new int[n];
    for (int i = 0; i < n; i++) arr[i] = i * 11;
    cout << "Sum: " << arr[0] + arr[1] + arr[2] << endl;
    delete[] arr;
    return 0;
}
` },
  ],
  think: {
    title: 'Dynamic buffer allocation and sum',
    problem: 'Dynamically allocate an array of N integers, fill with multiples of 10, calculate total, and free memory.',
    steps: [
      { text: 'Allocate heap array: `new int[n]`.', lines: [6] },
      { text: 'Fill elements with (i + 1) * 10.', lines: [8] },
      { text: 'Sum elements.', lines: [10] },
      { text: 'Deallocate memory: `delete[] arr`.', lines: [12] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    int n = 3;
    int* arr = new int[n];
    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 10;
    int sum = arr[0] + arr[1] + arr[2];
    cout << "Sum: " << sum << endl;
    delete[] arr;
    return 0;
}
`,
    why: 'Always pair `new[]` with `delete[]` to prevent memory leaks.',
    yourTurn: {
      id: 'oop-u3-l2-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['sum'],
      prompt: 'Dry run the sum accumulator.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    sum += 10;
    sum += 20;
    sum += 30;
    cout << sum << endl;
    return 0;
}
`,
      hints: ['0 -> 10 -> 30 -> 60.'],
      explain: 'Final sum is 60.',
    },
  },
  practice: [
    {
      id: 'oop-u3-l2-mcq1',
      kind: 'mcq',
      prompt: 'If you allocate dynamic memory using `new int[size]`, which operator MUST you use to deallocate it?',
      options: ['free()', 'delete', 'delete[]', 'remove()'],
      answer: 2,
      explain: 'Array allocations created with `new[]` must be freed with `delete[]`. Using plain `delete` is undefined behavior.',
    },
    {
      id: 'oop-u3-l2-blanks1',
      kind: 'blanks',
      prompt: 'Complete the statement to free the dynamically allocated integer array `data`.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int* data = new int[5];
    data[0] = 100;
    [[1]] data;
    cout << "Freed" << endl;
    return 0;
}
`,
      blanks: [{ answers: ['delete[]'] }],
      chips: ['delete[]', 'delete', 'free', 'remove'],
      output: 'Freed\n',
      explain: 'Arrays allocated with new[] must be freed with delete[].',
    },
    {
      id: 'oop-u3-l2-pred1',
      kind: 'predict',
      prompt: 'Stair 3 (Medium): What is the output of this dynamic array calculation?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int* arr = new int[4];
    for (int i = 0; i < 4; i++) arr[i] = (i + 1) * 3;
    cout << arr[1] + arr[3] << endl;
    delete[] arr;
    return 0;
}
`,
      explain: 'arr contains {3, 6, 9, 12}. arr[1] is 6, arr[3] is 12. Sum is 6 + 12 = 18.',
    },
    {
      id: 'oop-u3-l2-count1',
      kind: 'count',
      prompt: 'Stair 4 (Hard): How many dynamic buffers are created in this sequence?',
      code: cpp`
#include <iostream>
using namespace std;

int allocs = 0;
int* createBuffer(int sz) {
    allocs++;
    return new int[sz];
}

int main() {
    int* b1 = createBuffer(5);
    int* b2 = createBuffer(10);
    int* b3 = createBuffer(15);
    delete[] b1;
    delete[] b2;
    delete[] b3;
    cout << allocs << endl;
    return 0;
}
`,
      count: { line: 6 },
      unit: 'times',
      explain: 'createBuffer is invoked 3 times in main, executing line 6 exactly 3 times.',
    },
    {
      id: 'oop-u3-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace row-major index mapping for a dynamically allocated 2D matrix.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int rows = 3, cols = 3;
    int* grid = new int[rows * cols];
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            grid[r * cols + c] = (r + 1) * 10 + (c + 1);
        }
    }
    cout << grid[1 * cols + 2] << " " << grid[2 * cols + 0] << endl;
    delete[] grid;
    return 0;
}
`,
      explain: 'Row 1, col 2: (1 + 1)*10 + (2 + 1) = 23. Row 2, col 0: (2 + 1)*10 + (0 + 1) = 31. Output is 23 31.',
    },
    {
      id: 'oop-u3-l2-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 9 doubles the size instead of assigning the requested capacity. Identify the bug.',
      code: cpp`
#include <iostream>
using namespace std;

struct DynArr {
    int size;
};

void resize(DynArr &d, int newSize) {
    d.size = newSize * 2;
}

int main() {
    DynArr a = {5};
    resize(a, 10);
    cout << a.size << endl;
    return 0;
}
`,
      bugLine: 9,
      options: [
        'd.size is assigned newSize * 2 instead of newSize',
        'DynArr cannot be passed by reference',
        'main cannot declare DynArr a',
        'cout cannot print a.size',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct DynArr {
    int size;
};

void resize(DynArr &d, int newSize) {
    d.size = newSize;
}

int main() {
    DynArr a = {5};
    resize(a, 10);
    cout << a.size << endl;
    return 0;
}
`,
      explain: 'Assigning d.size = newSize sets the correct dimension of 10 instead of 20.',
    },
  ],
  cheatsheet: [
    { code: 'int* p = new int[n];', text: 'allocates heap array' },
    { code: 'delete[] p;', text: 'frees dynamic array' },
    { code: 'Rule of Three', text: 'Destructor, Copy Constructor, Copy Assignment' },
  ],
};

const OOP_U3_CP: Level = {
  id: 'checkpoint-oop-memory',
  kind: 'revision',
  title: 'Dynamic Memory & Deep Copy',
  tagline: 'Consolidate pointer safety, deep copy mechanics, and resource management.',
  objectives: [
    'Identify shallow vs deep copy in code snippets',
    'Apply the Rule of Three to dynamic structures',
    'Conquer the Gold Exam Challenge Box on memory traps',
  ],
  practice: [
    {
      id: 'oop-cp3-mcq1',
      kind: 'mcq',
      prompt: 'What is a "dangling pointer"?',
      options: [
        'A pointer initialized to nullptr',
        'A pointer pointing to memory that has already been deallocated',
        'A pointer to a function',
        'A pointer that points to another pointer',
      ],
      answer: 1,
      explain: 'A dangling pointer points to storage that has been freed. Dereferencing it causes undefined behavior or crashes.',
    },
    {
      id: 'oop-cp3-pred1',
      kind: 'predict',
      prompt: 'Stair 2 (Easy-Medium): Trace pointer dereference and field modification.',
      code: cpp`
#include <iostream>
using namespace std;

struct Cell {
    int val;
};

void doubleVal(Cell* c) {
    c->val *= 2;
}

int main() {
    Cell c = {25};
    doubleVal(&c);
    cout << c.val << endl;
    return 0;
}
`,
      explain: 'doubleVal takes pointer to c and doubles val: 25 * 2 = 50. Output is 50.',
    },
    {
      id: 'oop-cp3-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many times does the deallocation function run in this loop?',
      code: cpp`
#include <iostream>
using namespace std;

int freed = 0;
void freeBlock(int* ptr) {
    delete[] ptr;
    freed++;
}

int main() {
    for (int i = 0; i < 4; i++) {
        int* p = new int[2];
        freeBlock(p);
    }
    cout << freed << endl;
    return 0;
}
`,
      count: { line: 6 },
      unit: 'times',
      explain: 'The loop executes 4 times, calling freeBlock each iteration. Line 6 runs 4 times.',
    },
    {
      id: 'oop-cp3-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Trace deep copy isolation between two distinct struct buffers.',
      code: cpp`
#include <iostream>
using namespace std;

struct DataBlock {
    int v[2];
};

void copyBlock(DataBlock &src, DataBlock &dst) {
    dst.v[0] = src.v[0];
    dst.v[1] = src.v[1];
}

int main() {
    DataBlock a = {{5, 10}};
    DataBlock b;
    copyBlock(a, b);
    b.v[0] = 99;
    cout << a.v[0] << " " << b.v[0] << endl;
    return 0;
}
`,
      explain: 'Because copyBlock creates an independent duplicate, changing b.v[0] to 99 leaves a.v[0] as 5. Output is 5 99.',
    },
    {
      id: 'oop-cp3-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Pointer arithmetic across a dynamic buffer.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int* buf = new int[5];
    for (int i = 0; i < 5; i++) *(buf + i) = (i + 1) * 4;
    int* p = buf + 2;
    cout << *p << " " << *(p + 1) << endl;
    delete[] buf;
    return 0;
}
`,
      explain: 'buf is {4, 8, 12, 16, 20}. p points to index 2 (12). p+1 points to index 3 (16). Output is 12 16.',
    },
    {
      id: 'oop-cp3-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 9 fails to copy the buffer length. Identify the missing assignment.',
      code: cpp`
#include <iostream>
using namespace std;

struct Buffer {
    int len;
};

void cloneBuffer(Buffer &src, Buffer &dst) {
    dst.len = 0;
}

int main() {
    Buffer b1 = {8};
    Buffer b2;
    cloneBuffer(b1, b2);
    cout << b2.len << endl;
    return 0;
}
`,
      bugLine: 9,
      options: [
        'dst.len is initialized to 0 instead of copying src.len',
        'Buffer cannot have an integer field',
        'main cannot create Buffer b1',
        'cout cannot print b2.len',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Buffer {
    int len;
};

void cloneBuffer(Buffer &src, Buffer &dst) {
    dst.len = src.len;
}

int main() {
    Buffer b1 = {8};
    Buffer b2;
    cloneBuffer(b1, b2);
    cout << b2.len << endl;
    return 0;
}
`,
      explain: 'Assigning dst.len = src.len preserves the original length of 8.',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: Deep Copy & Matrix Management',
    intro: 'FAST-NUCES past exam problems on copy constructors, pointer aliasing, and memory deallocation.',
    questions: [
      {
        id: 'oop-gold-u3-q1',
        kind: 'predict',
        source: 'FAST OOP Midterm · Spring 2023',
        tag: 'exam',
        prompt: 'Dry run this deep copy array sequence and predict the output:',
        code: cpp`
#include <iostream>
using namespace std;

struct Buffer {
    int data[4];
};

void deepCopy(Buffer &src, Buffer &dst) {
    for (int i = 0; i < 4; i++) dst.data[i] = src.data[i];
}

int main() {
    Buffer b1 = {{10, 20, 30, 40}};
    Buffer b2;
    deepCopy(b1, b2);
    b2.data[1] = 99;
    cout << b1.data[1] << " " << b2.data[1] << endl;
    return 0;
}
`,
        explain: 'Because b2 is a deep copy, modifying b2.data[1] to 99 leaves b1.data[1] as 20. Output is 20 99.',
      },
      {
        id: 'oop-gold-u3-q2',
        kind: 'mcq',
        source: 'FAST OOP Midterm · Fall 2021',
        tag: 'exam',
        prompt: 'Given: `class Matrix { int** data; ... };`. When deallocating a 2D dynamic array `data` with `rows` rows, what is the correct order of deletion?',
        options: [
          'delete[] data; then loop delete[] data[i];',
          'Loop delete[] data[i] for each row first, then delete[] data;',
          'delete data;',
          'free(data);',
        ],
        answer: 1,
        explain: 'You must first delete each individual row array `delete[] data[i];`, and only then delete the array of row pointers `delete[] data;`. Reversing the order causes a segmentation fault when accessing deleted row pointers.',
      },
      {
        id: 'oop-gold-u3-q3',
        kind: 'mcq',
        source: 'FAST OOP Midterm · Spring 2024',
        tag: 'exam',
        prompt: 'Why does the copy assignment operator `operator=` return `T&` (reference to *this)?',
        options: [
          'To support chained assignments such as `a = b = c;`',
          'To prevent the function from compiling',
          'Because all C++ functions must return references',
          'To enable recursion inside the class',
        ],
        answer: 0,
        explain: 'Returning *this by reference allows chaining assignments like a = b = c, matching standard C++ assignment semantics.',
      },
      {
        id: 'oop-gold-u3-q4',
        kind: 'predict',
        source: 'FAST OOP Final Exam · Fall 2023',
        tag: 'exam',
        prompt: 'FAST Exam Classic: Trace dynamic array expansion and memory migration.',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    int* oldArr = new int[2];
    oldArr[0] = 7;
    oldArr[1] = 14;
    int* newArr = new int[4];
    for (int i = 0; i < 2; i++) newArr[i] = oldArr[i];
    newArr[2] = 21;
    newArr[3] = 28;
    delete[] oldArr;
    cout << newArr[1] + newArr[2] << endl;
    delete[] newArr;
    return 0;
}
`,
        explain: 'oldArr values 7, 14 copied to newArr. Indices 2 and 3 assigned 21 and 28. newArr[1] + newArr[2] = 14 + 21 = 35.',
      },
      {
        id: 'oop-gold-u3-q5',
        kind: 'count',
        source: 'FAST OOP Final Exam · Fall 2022',
        tag: 'exam',
        prompt: 'How many times does the inner allocation run during this 2D grid allocation?',
        code: cpp`
#include <iostream>
using namespace std;

int rowAllocs = 0;
int* allocateRow(int cols) {
    rowAllocs++;
    return new int[cols];
}

int main() {
    int rows = 4;
    for (int i = 0; i < rows; i++) {
        int* r = allocateRow(3);
        delete[] r;
    }
    cout << rowAllocs << endl;
    return 0;
}
`,
        count: { line: 6 },
        unit: 'times',
        explain: 'The loop runs 4 times for 4 rows, invoking allocateRow and executing line 6 exactly 4 times.',
      },
    ],
  },
};

// =====================================================================================
// UNIT 4: Operator Overloading
// =====================================================================================

const OOP_U4_L1: Level = {
  id: 'oop-operator-overloading',
  kind: 'lesson',
  title: 'Operator Overloading: Natural Syntax for Objects',
  tagline: 'Why write `add(c1, c2)` when you can write `c1 + c2`? Operator overloading allows custom objects to use standard C++ mathematical operators.',
  minutes: 25,
  objectives: [
    'Understand the syntax of `operator+`, `operator-`, `operator==`',
    'Know which operators can and cannot be overloaded in C++',
    'Overload comparison and arithmetic operators for structs and classes',
  ],
  learn: [
    { t: 'p', text: 'In C++, operators like `+`, `-`, `*`, `==` are just functions with special names (`operator+`, `operator==`). When you define these functions for your own types, objects can be combined using clear, readable arithmetic.' },
    { t: 'syntax', title: 'Overloading operator+ for Complex Numbers', code: cpp`
struct Complex {
    double real;
    double imag;
};

Complex operator+(const Complex &a, const Complex &b) {
    Complex res;
    res.real = a.real + b.real;
    res.imag = a.imag + b.imag;
    return res;
}`, parts: [
      { token: 'operator+', text: 'the function name specifying that this function handles the + operator' },
      { token: 'const Complex &a, const Complex &b', text: 'operands passed by const reference for efficiency' },
      { token: 'return res;', text: 'returns a new Complex object representing the sum' },
    ] },
    { t: 'callout', tone: 'key', title: 'Operators That Cannot Be Overloaded', text: 'In C++, only 4 operators can NEVER be overloaded: `.` (member access), `.*` (pointer to member), `::` (scope resolution), and `?:` (ternary conditional).' },
    { t: 'viz', title: 'Complex number addition with operator simulation', code: cpp`
#include <iostream>
using namespace std;

struct Complex {
    int real;
    int imag;
};

Complex add(Complex a, Complex b) {
    Complex c;
    c.real = a.real + b.real;
    c.imag = a.imag + b.imag;
    return c;
}

int main() {
    Complex c1 = {3, 4};
    Complex c2 = {1, 2};
    Complex sum = add(c1, c2);
    cout << sum.real << " + " << sum.imag << "i" << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Check if two 2D Points have identical coordinates.',
    intro: 'Equality check function vs equality operator.',
    items: [
      { title: 'Procedural isEqual function', code: cpp`
#include <iostream>
using namespace std;
struct Point { int x, y; };
bool isEqual(Point a, Point b) {
    return a.x == b.x && a.y == b.y;
}
int main() {
    Point p1 = {3, 5}, p2 = {3, 5};
    cout << (isEqual(p1, p2) ? "Match" : "Different") << endl;
    return 0;
}` },
    ],
    takeaway: 'Overloading comparison operators allows user-defined types to be sorted and compared naturally.',
    check: {
      id: 'oop-u4-l1-check',
      kind: 'mcq',
      prompt: 'Which of the following operators CANNOT be overloaded in C++?',
      options: ['+', '==', '.', '[]'],
      answer: 2,
      explain: 'The dot operator `.` cannot be overloaded in C++.',
    },
  },
  watch: [
    { title: 'Vector addition trace', intro: 'Watch coordinates added component-wise.', code: cpp`
#include <iostream>
using namespace std;

struct Vec2 {
    int x;
    int y;
};

Vec2 addVec(Vec2 a, Vec2 b) {
    Vec2 r;
    r.x = a.x + b.x;
    r.y = a.y + b.y;
    return r;
}

int main() {
    Vec2 v1 = {2, 3};
    Vec2 v2 = {4, 1};
    Vec2 v3 = addVec(v1, v2);
    cout << "Res: (" << v3.x << ", " << v3.y << ")" << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Fraction multiplication',
    problem: 'Multiply two fractions: num1/den1 * num2/den2 = (num1 * num2) / (den1 * den2).',
    steps: [
      { text: 'Define Fraction struct with num and den.', lines: [4, 5, 6] },
      { text: 'Compute product of numerators and product of denominators.', lines: [9, 10] },
      { text: 'Return resulting Fraction.', lines: [11] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Fraction {
    int num, den;
};

Fraction mult(Fraction a, Fraction b) {
    Fraction res;
    res.num = a.num * b.num;
    res.den = a.den * b.den;
    return res;
}

int main() {
    Fraction f1 = {2, 3};
    Fraction f2 = {3, 5};
    Fraction ans = mult(f1, f2);
    cout << ans.num << "/" << ans.den << endl;
    return 0;
}
`,
    why: 'Operator overloading gives custom numerical types first-class syntax.',
    yourTurn: {
      id: 'oop-u4-l1-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['ans.num', 'ans.den'],
      prompt: 'Trace the multiplication of 1/2 and 3/4.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int num = 1 * 3;
    int den = 2 * 4;
    cout << num << "/" << den << endl;
    return 0;
}
`,
      hints: ['num = 1 * 3 = 3.', 'den = 2 * 4 = 8.'],
      explain: 'num = 3, den = 8.',
    },
  },
  practice: [
    {
      id: 'oop-u4-l1-pred1',
      kind: 'predict',
      prompt: 'What is printed by this program?',
      code: cpp`
#include <iostream>
using namespace std;

struct Fraction {
    int num;
    int den;
};

Fraction multiply(Fraction a, Fraction b) {
    Fraction res;
    res.num = a.num * b.num;
    res.den = a.den * b.den;
    return res;
}

int main() {
    Fraction f1 = {2, 3};
    Fraction f2 = {3, 4};
    Fraction f3 = multiply(f1, f2);
    cout << f3.num << "/" << f3.den << endl;
    return 0;
}
`,
      explain: 'num = 2 * 3 = 6, den = 3 * 4 = 12. Prints 6/12.',
    },
    {
      id: 'oop-u4-l1-mcq2',
      kind: 'mcq',
      prompt: 'Stair 2 (Easy-Medium): Which of the following operator sets MUST be overloaded as non-static member functions only?',
      options: [
        'Assignment `=`, subscript `[]`, function call `()`, and arrow `->`',
        'Binary plus `+` and binary minus `-`',
        'Stream insertion `<<` and extraction `>>`',
        'Equality `==` and inequality `!=`',
      ],
      answer: 0,
      explain: 'C++ standards mandate that `=`, `[]`, `()`, and `->` must be declared as member functions of the class.',
    },
    {
      id: 'oop-u4-l1-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many adjacent inversions are detected by `isGreater` in this array of boxes?',
      code: cpp`
#include <iostream>
using namespace std;

struct Box {
    int vol;
};

bool isGreater(Box a, Box b) {
    return a.vol > b.vol;
}

int main() {
    Box boxes[4] = {{10}, {30}, {20}, {40}};
    int inversions = 0;
    for (int i = 0; i < 3; i++) {
        if (isGreater(boxes[i], boxes[i + 1])) {
            inversions++;
        }
    }
    cout << inversions << endl;
    return 0;
}
`,
      count: { line: 18 },
      unit: 'times',
      explain: '10 > 30 is false; 30 > 20 is true; 20 > 40 is false. Line 18 executes exactly 1 time.',
    },
    {
      id: 'oop-u4-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Calculate the dot product after scalar scaling of vector v1.',
      code: cpp`
#include <iostream>
using namespace std;

struct Vec {
    int x;
    int y;
};

int dot(Vec a, Vec b) {
    return a.x * b.x + a.y * b.y;
}

Vec scale(Vec v, int s) {
    Vec r = {v.x * s, v.y * s};
    return r;
}

int main() {
    Vec v1 = {2, 3};
    Vec v2 = {4, -1};
    Vec v3 = scale(v1, 2);
    cout << dot(v3, v2) << endl;
    return 0;
}
`,
      explain: 'v3 = {4, 6}. dot(v3, v2) = (4 * 4) + (6 * -1) = 16 - 6 = 10. Output is 10.',
    },
    {
      id: 'oop-u4-l1-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace chained subtraction operations.',
      code: cpp`
#include <iostream>
using namespace std;

struct Num {
    int val;
};

Num sub(Num a, Num b) {
    Num r = {a.val - b.val};
    return r;
}

int main() {
    Num a = {100}, b = {30}, c = {20};
    Num res = sub(sub(a, b), c);
    cout << res.val << endl;
    return 0;
}
`,
      explain: 'sub(a, b) yields {70}. sub(70, c) yields {50}. Output is 50.',
    },
    {
      id: 'oop-u4-l1-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 9 uses logical OR `||` instead of logical AND `&&`, incorrectly reporting points with different y-coordinates as equal.',
      code: cpp`
#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

bool isEqual(Point a, Point b) {
    return a.x == b.x || a.y == b.y;
}

int main() {
    Point p1 = {5, 2};
    Point p2 = {5, 9};
    cout << (isEqual(p1, p2) ? 1 : 0) << endl;
    return 0;
}
`,
      bugLine: 9,
      options: [
        'isEqual uses || instead of &&; two points must have both identical x AND identical y to be equal',
        'Point cannot have two members',
        'main cannot declare p1 and p2',
        'cout cannot print ternary expressions',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

bool isEqual(Point a, Point b) {
    return a.x == b.x && a.y == b.y;
}

int main() {
    Point p1 = {5, 2};
    Point p2 = {5, 9};
    cout << (isEqual(p1, p2) ? 1 : 0) << endl;
    return 0;
}
`,
      explain: 'Points are only equal when both x and y coordinates match. Fixed code correctly outputs 0 instead of 1.',
    },
  ],
  cheatsheet: [
    { code: 'operator+(const T &a, const T &b)', text: 'overload binary addition' },
    { code: 'operator==(const T &a, const T &b)', text: 'overload equality comparison' },
    { code: '., .*, ::, ?:', text: 'operators that CANNOT be overloaded' },
  ],
};

const OOP_U4_L2: Level = {
  id: 'oop-stream-operators',
  kind: 'lesson',
  title: 'Stream Operators: Printing Objects with cout',
  tagline: 'Make your objects print beautifully with `cout << obj`. Learn how stream insertion `<<` and extraction `>>` are overloaded using references.',
  minutes: 20,
  objectives: [
    'Understand why stream operators return `ostream&` and `istream&` (chaining)',
    'Understand why the stream operator is written outside the class or as a friend',
    'Trace chaining of stream insertions: `cout << a << b << endl;`',
  ],
  learn: [
    { t: 'p', text: 'When you write `cout << x << y;`, the `<<` operator evaluates from left to right: `(cout << x) << y;`. To allow chaining, `operator<<` must return a reference to the same stream (`ostream&`).' },
    { t: 'syntax', title: 'Stream Insertion Operator Pattern', code: cpp`
#include <iostream>
using namespace std;

struct Time {
    int hours;
    int mins;
};

// Stream insertion operator:
// Must return ostream& to support chaining (cout << t1 << t2)
ostream& operator<<(ostream &out, const Time &t) {
    out << t.hours << ":" << (t.mins < 10 ? "0" : "") << t.mins;
    return out;
}`, parts: [
      { token: 'ostream &out', text: 'reference to output stream (such as cout)' },
      { token: 'const Time &t', text: 'the object being printed' },
      { token: 'return out;', text: 'returns stream reference to enable chaining' },
    ] },
    { t: 'callout', tone: 'key', title: 'Why is it not a member function of Time?', text: 'Because in `cout << t;`, the LEFT operand is `cout` (an instance of `ostream`), not `Time`! A member function belongs to the left operand. Since we cannot modify the standard `ostream` class, stream operators must be free functions.' },
    { t: 'viz', title: 'Printing structured time with helper display function', code: cpp`
#include <iostream>
using namespace std;

struct Time {
    int h;
    int m;
};

void printTime(Time t) {
    cout << t.h << ":" << (t.m < 10 ? "0" : "") << t.m << endl;
}

int main() {
    Time t1 = {9, 5};
    Time t2 = {14, 30};
    printTime(t1);
    printTime(t2);
    return 0;
}
` },
  ],
  ways: {
    goal: 'Format and display a fraction cleanly.',
    intro: 'Formatting patterns for object output.',
    items: [
      { title: 'Display helper function', code: cpp`
#include <iostream>
using namespace std;
struct Fraction { int n, d; };
void show(Fraction f) { cout << f.n << "/" << f.d << endl; }
int main() {
    Fraction f = {3, 7};
    show(f);
    return 0;
}` },
    ],
    takeaway: 'Custom formatting functions make output consistent and prevent formatting code from leaking into main.',
    check: {
      id: 'oop-u4-l2-check',
      kind: 'mcq',
      prompt: 'Why must `operator<<` return an `ostream&` reference?',
      options: [
        'To speed up GPU compilation',
        'To enable chaining like `cout << a << b << endl;`',
        'Because void functions cannot print anything',
        'To prevent memory leaks',
      ],
      answer: 1,
      explain: 'Returning `ostream&` allows the result of `cout << a` to immediately become the left operand for `<< b`.',
    },
  },
  watch: [
    { title: 'Chaining output simulation', intro: 'Demonstrating sequential print flow.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "Time: " << 10 << ":" << 45 << " AM" << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Stream cascading order',
    problem: 'Trace sequential output generation in a multi-token stream line.',
    steps: [
      { text: 'First token "A " is sent to output.', lines: [5] },
      { text: 'Second token "B " is sent to output.', lines: [6] },
      { text: 'New line finishes stream flush.', lines: [7] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "A ";
    cout << "B ";
    cout << "C" << endl;
    return 0;
}
`,
    why: 'Stream operations serialize tokens left-to-right into standard output.',
    yourTurn: {
      id: 'oop-u4-l2-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'Dry run the cascaded output.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "X" << 1 << "Y" << 2 << endl;
    return 0;
}
`,
      hints: ['Tokens concatenate without spaces: X, 1, Y, 2.'],
      explain: 'Outputs X1Y2.',
    },
  },
  practice: [
    {
      id: 'oop-u4-l2-mcq1',
      kind: 'mcq',
      prompt: 'In the expression `cin >> p;`, what is the left operand?',
      options: ['p', 'cin (an istream)', 'The operator >>', 'The console keyboard driver'],
      answer: 1,
      explain: 'In `cin >> p;`, the left operand is `cin`, which is an instance of `istream`.',
    },
    {
      id: 'oop-u4-l2-pred1',
      kind: 'predict',
      prompt: 'Stair 2 (Easy-Medium): Trace output of formatted color channels.',
      code: cpp`
#include <iostream>
using namespace std;

struct RGB {
    int r;
    int g;
    int b;
};

void printRGB(RGB c) {
    cout << "#" << c.r << ":" << c.g << ":" << c.b << endl;
}

int main() {
    RGB color = {255, 128, 0};
    printRGB(color);
    return 0;
}
`,
      explain: 'Prints "#255:128:0".',
    },
    {
      id: 'oop-u4-l2-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many times is `prints++` executed for even indices?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int prints = 0;
    for (int i = 0; i < 5; i++) {
        if (i % 2 == 0) prints++;
    }
    cout << prints << endl;
    return 0;
}
`,
      count: { line: 7 },
      unit: 'times',
      explain: 'i=0, 2, 4 are even. Line 7 runs exactly 3 times.',
    },
    {
      id: 'oop-u4-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Trace conditional leading zero formatting in clock display.',
      code: cpp`
#include <iostream>
using namespace std;

struct Clock {
    int h;
    int m;
};

void display(Clock c) {
    if (c.h < 10) cout << "0";
    cout << c.h << ":";
    if (c.m < 10) cout << "0";
    cout << c.m << endl;
}

int main() {
    Clock c1 = {8, 5};
    Clock c2 = {12, 45};
    display(c1);
    display(c2);
    return 0;
}
`,
      explain: 'c1 formats with leading zeros: "08:05". c2 needs no leading zeros: "12:45".',
    },
    {
      id: 'oop-u4-l2-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace short-circuit execution preventing stream output.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int a = 5;
    if (a > 10 && (cout << "Unreachable ")) {
        cout << "Never" << endl;
    } else {
        cout << "Safe" << endl;
    }
    return 0;
}
`,
      explain: 'Because a > 10 is false, the logical AND short-circuits and never executes `cout << "Unreachable "`. Else executes, printing "Safe".',
    },
    {
      id: 'oop-u4-l2-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 9 zeroes out the displayed score. Identify the mistake.',
      code: cpp`
#include <iostream>
using namespace std;

struct Score {
    int val;
};

void display(Score s) {
    cout << "Score=" << s.val * 0 << endl;
}

int main() {
    Score s = {100};
    display(s);
    return 0;
}
`,
      bugLine: 9,
      options: [
        's.val is multiplied by 0 instead of printed directly',
        'Score cannot have an integer field',
        'display cannot take a Score struct',
        'main cannot initialize s to 100',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Score {
    int val;
};

void display(Score s) {
    cout << "Score=" << s.val << endl;
}

int main() {
    Score s = {100};
    display(s);
    return 0;
}
`,
      explain: 'Printing s.val correctly outputs "Score=100" instead of "Score=0".',
    },
  ],
  cheatsheet: [
    { code: 'ostream& operator<<(ostream &out, const T &obj)', text: 'stream insertion signature' },
    { code: 'istream& operator>>(istream &in, T &obj)', text: 'stream extraction signature' },
  ],
};

const OOP_U4_CP: Level = {
  id: 'checkpoint-oop-operators',
  kind: 'revision',
  title: 'Operator Overloading',
  tagline: 'Review operator overloading rules, syntax, and operator chaining mechanics.',
  objectives: [
    'Identify valid vs invalid operator overloads',
    'Trace operator evaluations and stream cascading',
    'Conquer the Gold Exam Challenge Box on FAST operator past papers',
  ],
  practice: [
    {
      id: 'oop-cp4-mcq1',
      kind: 'mcq',
      prompt: 'Can you invent a new operator in C++, such as `operator**` for exponentiation?',
      options: [
        'Yes, you can invent any symbol combination',
        'No, you can only overload operators that already exist in C++',
        'Yes, but only inside a class',
        'Yes, if you use templates',
      ],
      answer: 1,
      explain: 'In C++, you cannot create new operator tokens. You can only overload existing C++ operators.',
    },
    {
      id: 'oop-cp4-pred1',
      kind: 'predict',
      prompt: 'Stair 2 (Easy-Medium): Trace vector addition followed by subtraction.',
      code: cpp`
#include <iostream>
using namespace std;

struct Vector {
    int x;
    int y;
};

Vector add(Vector a, Vector b) {
    Vector r = {a.x + b.x, a.y + b.y};
    return r;
}

Vector sub(Vector a, Vector b) {
    Vector r = {a.x - b.x, a.y - b.y};
    return r;
}

int main() {
    Vector v1 = {10, 20};
    Vector v2 = {4, 6};
    Vector v3 = add(v1, v2);
    Vector v4 = sub(v3, v2);
    cout << v4.x << " " << v4.y << endl;
    return 0;
}
`,
      explain: 'Adding v2 then subtracting v2 restores original v1 coordinates: 10 20.',
    },
    {
      id: 'oop-cp4-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many times is `eval` called in this summation loop?',
      code: cpp`
#include <iostream>
using namespace std;

int ops = 0;
int eval(int a, int b) {
    ops++;
    return a + b;
}

int main() {
    int total = 0;
    for (int i = 0; i < 4; i++) {
        total = eval(total, i);
    }
    cout << ops << endl;
    return 0;
}
`,
      count: { line: 5 },
      unit: 'times',
      explain: 'The loop runs 4 times for i = 0, 1, 2, 3, executing line 5 exactly 4 times.',
    },
    {
      id: 'oop-cp4-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Calculate rational number addition with common denominator.',
      code: cpp`
#include <iostream>
using namespace std;

struct Rational {
    int num;
    int den;
};

Rational add(Rational a, Rational b) {
    Rational r;
    r.num = a.num * b.den + b.num * a.den;
    r.den = a.den * b.den;
    return r;
}

int main() {
    Rational r1 = {1, 2};
    Rational r2 = {1, 3};
    Rational res = add(r1, r2);
    cout << res.num << "/" << res.den << endl;
    return 0;
}
`,
      explain: '1/2 + 1/3 = (1*3 + 1*2) / (2*3) = 5/6. Output is 5/6.',
    },
    {
      id: 'oop-cp4-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Calculate complex number multiplication.',
      code: cpp`
#include <iostream>
using namespace std;

struct Complex {
    int r;
    int i;
};

Complex mul(Complex a, Complex b) {
    Complex res;
    res.r = a.r * b.r - a.i * b.i;
    res.i = a.r * b.i + a.i * b.r;
    return res;
}

int main() {
    Complex c1 = {2, 3};
    Complex c2 = {1, 4};
    Complex c3 = mul(c1, c2);
    cout << c3.r << " " << c3.i << endl;
    return 0;
}
`,
      explain: 'Real: 2*1 - 3*4 = 2 - 12 = -10. Imag: 2*4 + 3*1 = 8 + 3 = 11. Output is -10 11.',
    },
    {
      id: 'oop-cp4-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 11 adds numerators instead of multiplying them for fraction multiplication.',
      code: cpp`
#include <iostream>
using namespace std;

struct Fraction {
    int num;
    int den;
};

Fraction mult(Fraction a, Fraction b) {
    Fraction r;
    r.num = a.num + b.num;
    r.den = a.den * b.den;
    return r;
}

int main() {
    Fraction f1 = {2, 3};
    Fraction f2 = {3, 4};
    Fraction ans = mult(f1, f2);
    cout << ans.num << "/" << ans.den << endl;
    return 0;
}
`,
      bugLine: 11,
      options: [
        'r.num should be a.num * b.num, not a.num + b.num',
        'denominators should be added',
        'Fraction cannot be returned by value',
        'main cannot declare two Fraction variables',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Fraction {
    int num;
    int den;
};

Fraction mult(Fraction a, Fraction b) {
    Fraction r;
    r.num = a.num * b.num;
    r.den = a.den * b.den;
    return r;
}

int main() {
    Fraction f1 = {2, 3};
    Fraction f2 = {3, 4};
    Fraction ans = mult(f1, f2);
    cout << ans.num << "/" << ans.den << endl;
    return 0;
}
`,
      explain: 'Multiplying 2/3 * 3/4 yields (2*3)/(3*4) = 6/12 instead of 5/12.',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: FAST Operator Overloading Exams',
    intro: 'Past FAST-NUCES exam problems on operator overloads, stream operators, and arithmetic semantics.',
    questions: [
      {
        id: 'oop-gold-u4-q1',
        kind: 'predict',
        source: 'FAST OOP Final Exam · Spring 2023',
        tag: 'exam',
        prompt: 'What is printed by this operator chaining program?',
        code: cpp`
#include <iostream>
using namespace std;

struct Score {
    int pts;
};

Score addScore(Score a, Score b) {
    Score r;
    r.pts = a.pts + b.pts;
    return r;
}

int main() {
    Score s1 = {10}, s2 = {20}, s3 = {30};
    Score total = addScore(addScore(s1, s2), s3);
    cout << total.pts << endl;
    return 0;
}
`,
        explain: 's1 + s2 = 30; 30 + s3 = 60. Prints 60.',
      },
      {
        id: 'oop-gold-u4-q2',
        kind: 'mcq',
        source: 'FAST OOP Final Exam · Fall 2022',
        tag: 'exam',
        prompt: 'When overloading the postfix increment operator `operator++(int)`, what is the purpose of the dummy `int` parameter?',
        options: [
          'It specifies how much to increment the variable by',
          'It is a language syntax convention to distinguish postfix ++ from prefix ++',
          'It allocates memory for the return value',
          'It converts the object to an integer',
        ],
        answer: 1,
        explain: 'The dummy `int` parameter in `operator++(int)` is used solely by the compiler to differentiate postfix `obj++` from prefix `++obj`.',
      },
      {
        id: 'oop-gold-u4-q3',
        kind: 'predict',
        source: 'FAST OOP Exam · Stream Boolean Condition',
        tag: 'exam',
        prompt: 'Predict the console output of this short-circuit stream condition:',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    int x = 0;
    if (x == 0 && (cout << "FAST ")) {
        cout << "NUCES" << endl;
    }
    return 0;
}
`,
        explain: 'x == 0 is true, so the right side `cout << "FAST "` executes, printing "FAST ". The stream is truthy, so the if block executes, printing "NUCES". Total output: "FAST NUCES".',
      },
      {
        id: 'oop-gold-u4-q4',
        kind: 'predict',
        source: 'FAST OOP Final Exam · Spring 2024',
        tag: 'exam',
        prompt: 'FAST Exam Classic: Trace polynomial evaluation using struct operator simulation.',
        code: cpp`
#include <iostream>
using namespace std;

struct Term {
    int coef;
    int exp;
};

int eval(Term t, int x) {
    int p = 1;
    for (int i = 0; i < t.exp; i++) p *= x;
    return t.coef * p;
}

int main() {
    Term t1 = {3, 2}; // 3*x^2
    Term t2 = {5, 1}; // 5*x^1
    int x = 4;
    cout << eval(t1, x) + eval(t2, x) << endl;
    return 0;
}
`,
        explain: 't1 at x=4 is 3 * (4^2) = 3 * 16 = 48. t2 at x=4 is 5 * 4 = 20. Total: 48 + 20 = 68.',
      },
      {
        id: 'oop-gold-u4-q5',
        kind: 'mcq',
        source: 'FAST OOP Final Exam · Fall 2021',
        tag: 'exam',
        prompt: 'Which of the following operators CANNOT be overloaded as a global non-member function in C++?',
        options: [
          'Subscript operator `[]`',
          'Binary plus `+`',
          'Stream insertion `<<`',
          'Equality operator `==`',
        ],
        answer: 0,
        explain: 'The subscript operator `[]` must be defined as a non-static member function. It cannot be declared as a free/global non-member function.',
      },
    ],
  },
};

// =====================================================================================
// UNIT 5: Inheritance & Composition
// =====================================================================================

const OOP_U5_L1: Level = {
  id: 'oop-composition',
  kind: 'lesson',
  title: 'Composition & Aggregation: Has-a Relationships',
  tagline: 'A car has an engine. A university has departments. A library has books. Composition builds complex systems by embedding objects inside objects.',
  minutes: 20,
  objectives: [
    'Model "has-a" relationships using composition and aggregation',
    'Understand constructor initialization order for member objects',
    'Structure clean multi-object architectures',
  ],
  learn: [
    { t: 'p', text: '**Composition** occurs when a class contains another class as a member variable. If object `A` contains object `B`, `B` is constructed before `A`\'s constructor body executes, and destroyed after `A`\'s destructor finishes.' },
    { t: 'syntax', title: 'Composition Example: Bookshelf contains Books', code: cpp`
struct Book {
    string title;
};

struct Bookshelf {
    Book books[10];
    int count;
};`, parts: [
      { token: 'Book books[10];', text: 'The Bookshelf "has-a" collection of Book objects' },
      { token: 'int count;', text: 'Tracks how many books are currently placed on the shelf' },
    ] },
    { t: 'viz', title: 'Composition in action: Library with Bookshelf', code: cpp`
#include <iostream>
#include <string>
using namespace std;

struct Book {
    string title;
};

struct Shelf {
    Book b1;
    Book b2;
};

int main() {
    Shelf s;
    s.b1.title = "C++ Primer";
    s.b2.title = "Clean Code";
    cout << "Shelf books: " << s.b1.title << " & " << s.b2.title << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Model a Car with an Engine.',
    intro: 'Composition modelling.',
    items: [
      { title: 'Embedded struct member', code: cpp`
#include <iostream>
using namespace std;
struct Engine { int hp; };
struct Car {
    Engine eng;
    int speed;
};
int main() {
    Car c = {{350}, 120};
    cout << "HP: " << c.eng.hp << " Speed: " << c.speed << endl;
    return 0;
}` },
    ],
    takeaway: 'Favor composition over inheritance when the relationship is "has-a" rather than "is-a".',
    check: {
      id: 'oop-u5-l1-check',
      kind: 'mcq',
      prompt: 'Which real-world relationship is an example of Composition ("has-a")?',
      options: [
        'A Dog is an Animal',
        'A Computer has a Processor',
        'A Circle is a Shape',
        'A Manager is an Employee',
      ],
      answer: 1,
      explain: 'A Computer has a Processor (composition). The other options represent "is-a" relationships (inheritance).',
    },
  },
  watch: [
    { title: 'Nested member access', intro: 'Accessing inner fields through the outer object.', code: cpp`
#include <iostream>
using namespace std;

struct Date { int day, month, year; };
struct Student {
    int id;
    Date dob;
};

int main() {
    Student s = {2133, {15, 8, 2004}};
    cout << "ID: " << s.id << " Born: " << s.dob.day << "/" << s.dob.month << "/" << s.dob.year << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Nested object data access',
    problem: 'A computer contains a CPU with clock speed (GHz) and RAM capacity (GB). Compute system performance score.',
    steps: [
      { text: 'Define CPU struct and Computer struct.', lines: [4, 5, 8, 9] },
      { text: 'Initialize Computer with 3 GHz CPU and 16 GB RAM.', lines: [14] },
      { text: 'Calculate score: GHz * RAM.', lines: [15] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct CPU {
    int ghz;
};

struct Computer {
    CPU cpu;
    int ram;
};

int main() {
    Computer pc = {{3}, 16};
    int score = pc.cpu.ghz * pc.ram;
    cout << "Score: " << score << endl;
    return 0;
}
`,
    why: 'Composition builds larger abstractions from simple, reusable component parts.',
    yourTurn: {
      id: 'oop-u5-l1-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['score'],
      prompt: 'Dry run score calculation with 4 GHz and 8 GB RAM.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int score = 4 * 8;
    cout << score << endl;
    return 0;
}
`,
      hints: ['4 * 8 = 32.'],
      explain: 'Score is 32.',
    },
  },
  practice: [
    {
      id: 'oop-u5-l1-pred1',
      kind: 'predict',
      prompt: 'What is printed by this program?',
      code: cpp`
#include <iostream>
using namespace std;

struct Engine { int power; };
struct Vehicle {
    Engine e;
    int wheels;
};

int main() {
    Vehicle v = {{150}, 4};
    v.e.power += 50;
    cout << v.e.power * v.wheels << endl;
    return 0;
}
`,
      explain: 'power becomes 150 + 50 = 200. 200 * 4 = 800.',
    },
    {
      id: 'oop-u5-l1-mcq2',
      kind: 'mcq',
      prompt: 'Stair 2 (Easy-Medium): What is the core difference between Composition and Aggregation in object design?',
      options: [
        'In composition, the child object cannot exist independently of the parent; in aggregation, the child object can exist independently',
        'Composition uses pointers while aggregation uses ints',
        'Aggregation runs faster on the CPU',
        'Composition only works with structs, not classes',
      ],
      answer: 0,
      explain: 'Composition represents strong ownership (death of parent destroys child). Aggregation represents weak association (e.g. Teacher in a Department).',
    },
    {
      id: 'oop-u5-l1-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many times is `pump` called to service wheels on this bicycle?',
      code: cpp`
#include <iostream>
using namespace std;

struct Wheel {
    int psi;
};

struct Bicycle {
    Wheel front;
    Wheel back;
};

int pumped = 0;
void pump(Wheel &w, int p) {
    w.psi = p;
    pumped++;
}

int main() {
    Bicycle bike = {{25}, {28}};
    pump(bike.front, 35);
    pump(bike.back, 40);
    cout << pumped << endl;
    return 0;
}
`,
      count: { line: 17 },
      unit: 'times',
      explain: 'pump is called once for the front wheel and once for the back wheel. Line 17 runs 2 times.',
    },
    {
      id: 'oop-u5-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Calculate total department salary across composite professor members.',
      code: cpp`
#include <iostream>
using namespace std;

struct Prof {
    int salary;
};

struct Dept {
    Prof p1;
    Prof p2;
};

struct Uni {
    Dept cs;
};

int main() {
    Uni u = {{{50}, {70}}};
    cout << u.cs.p1.salary + u.cs.p2.salary << endl;
    return 0;
}
`,
      explain: 'p1 salary is 50, p2 salary is 70. 50 + 70 = 120. Output is 120.',
    },
    {
      id: 'oop-u5-l1-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace composite battery consumption based on brightness and usage time.',
      code: cpp`
#include <iostream>
using namespace std;

struct Battery {
    int charge;
};

struct Phone {
    Battery b;
    int brightness;
};

void usePhone(Phone &p, int mins) {
    p.b.charge -= (mins * p.brightness) / 10;
    if (p.b.charge < 0) p.b.charge = 0;
}

int main() {
    Phone myPhone = {{100}, 5};
    usePhone(myPhone, 12);
    cout << myPhone.b.charge << endl;
    return 0;
}
`,
      explain: 'Usage drains (12 * 5) / 10 = 60 / 10 = 6. Charge: 100 - 6 = 94. Output is 94.',
    },
    {
      id: 'oop-u5-l1-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 15 adds the front wheel twice instead of summing front and rear tire pressure.',
      code: cpp`
#include <iostream>
using namespace std;

struct Tire {
    int psi;
};

struct Car {
    Tire front;
    Tire rear;
};

int main() {
    Car c = {{30}, {40}};
    int total = c.front.psi + c.front.psi;
    cout << total << endl;
    return 0;
}
`,
      bugLine: 15,
      options: [
        'c.front.psi is added twice instead of adding c.front.psi + c.rear.psi',
        'Tire cannot have an integer field',
        'main cannot declare Car c',
        'cout cannot print total',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Tire {
    int psi;
};

struct Car {
    Tire front;
    Tire rear;
};

int main() {
    Car c = {{30}, {40}};
    int total = c.front.psi + c.rear.psi;
    cout << total << endl;
    return 0;
}
`,
      explain: 'Summing front (30) and rear (40) yields 70 instead of 60.',
    },
  ],
  cheatsheet: [
    { code: 'Has-a', text: 'Composition: class contains an instance of another class' },
    { code: 'obj.inner.field', text: 'accessing nested member data' },
  ],
};

const OOP_U5_L2: Level = {
  id: 'oop-inheritance',
  kind: 'lesson',
  title: 'Inheritance: Is-a Relationships and Code Reuse',
  tagline: 'Inheritance allows a derived class to inherit all fields and functions from a base class. Write once in the base class, use everywhere in derived classes.',
  minutes: 25,
  objectives: [
    'Define base (parent) and derived (child) classes',
    'Understand `protected` access specifier',
    'Trace constructor chaining: Base constructor runs before Derived constructor',
  ],
  learn: [
    { t: 'p', text: 'When class `Dog` inherits from class `Animal`, `Dog` gets all of `Animal`\'s data and methods automatically. This is an **is-a** relationship: a Dog *is an* Animal.' },
    { t: 'syntax', title: 'Inheritance and Access Specifiers', code: cpp`
class Animal {
protected:
    string name;       // accessible to derived classes, but private to external world
public:
    int age;
};

class Dog : public Animal {    // Dog inherits from Animal
public:
    string breed;
};`, parts: [
      { token: 'protected:', text: 'visible inside this class AND inside derived child classes, but private to main()' },
      { token: 'class Dog : public Animal', text: 'specifies that Dog publicly inherits all public/protected members of Animal' },
    ] },
    { t: 'callout', tone: 'key', title: 'Constructor Chaining Order', text: 'When a derived object is created, the **Base constructor runs FIRST**, and then the Derived constructor runs. Destructors run in reverse order (Derived first, then Base).' },
    { t: 'viz', title: 'Inheriting attributes and behavior', code: cpp`
#include <iostream>
using namespace std;

struct BasePerson {
    int id;
    int age;
};

struct StudentChild {
    BasePerson person;
    int marks;
};

int main() {
    StudentChild s;
    s.person.id = 2133;
    s.person.age = 20;
    s.marks = 95;
    cout << "ID: " << s.person.id << " Age: " << s.person.age << " Marks: " << s.marks << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Share common entity properties across different subtypes.',
    intro: 'Hierarchy modelling.',
    items: [
      { title: 'Shared base attributes', code: cpp`
#include <iostream>
using namespace std;
struct Shape { int width, height; };
struct Rect { Shape base; };
int main() {
    Rect r = {{5, 8}};
    cout << "Area: " << r.base.width * r.base.height << endl;
    return 0;
}` },
    ],
    takeaway: 'Inheritance establishes taxonomy and enables polymorphic behavior across related types.',
    check: {
      id: 'oop-u5-l2-check',
      kind: 'mcq',
      prompt: 'If class `Derived` inherits from class `Base`, which constructor runs first when instantiating `Derived d;`?',
      options: ['Derived constructor', 'Base constructor', 'Whichever is shorter', 'Random order'],
      answer: 1,
      explain: 'Base class constructors always run before derived class constructors to ensure inherited members are initialized.',
    },
  },
  watch: [
    { title: 'Constructor order simulation', intro: 'Base setup runs before child extension.', code: cpp`
#include <iostream>
using namespace std;

void initBase() { cout << "1. Base Initialized" << endl; }
void initDerived() { cout << "2. Derived Initialized" << endl; }

int main() {
    initBase();
    initDerived();
    return 0;
}
` },
  ],
  think: {
    title: 'Salary computation hierarchy',
    problem: 'Employee has base salary. Manager adds bonus. Compute total payout.',
    steps: [
      { text: 'Base salary is 50,000.', lines: [5] },
      { text: 'Manager bonus is 15,000.', lines: [6] },
      { text: 'Total payout is base + bonus.', lines: [7] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    int baseSalary = 50000;
    int bonus = 15000;
    int total = baseSalary + bonus;
    cout << "Payout: " << total << endl;
    return 0;
}
`,
    why: 'Derived specializations augment baseline state.',
    yourTurn: {
      id: 'oop-u5-l2-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['total'],
      prompt: 'Trace total salary calculation.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int total = 40000 + 10000;
    cout << total << endl;
    return 0;
}
`,
      hints: ['40000 + 10000 = 50000.'],
      explain: 'Total is 50000.',
    },
  },
  practice: [
    {
      id: 'oop-u5-l2-mcq1',
      kind: 'mcq',
      prompt: 'Which access specifier makes members accessible to child derived classes, while still hiding them from general external code?',
      options: ['public', 'private', 'protected', 'virtual'],
      answer: 2,
      explain: 'protected members can be accessed by the class itself and all its derived subclasses, but not by outside functions.',
    },
    {
      id: 'oop-u5-l2-pred1',
      kind: 'predict',
      prompt: 'Stair 2 (Easy-Medium): Trace derived struct inheriting and extending base fields.',
      code: cpp`
#include <iostream>
using namespace std;

struct Base {
    int x;
};

struct Derived {
    Base base;
    int y;
};

int main() {
    Derived d = {{10}, 25};
    cout << d.base.x << " " << d.y << endl;
    return 0;
}
`,
      explain: 'd.base.x is 10, d.y is 25. Output is 10 25.',
    },
    {
      id: 'oop-u5-l2-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many times is the base constructor called when instantiating 3 derived objects?',
      code: cpp`
#include <iostream>
using namespace std;

int baseCtors = 0;
void initBase() {
    baseCtors++;
}
void initDerived() {
    initBase();
}

int main() {
    for (int i = 0; i < 3; i++) {
        initDerived();
    }
    cout << baseCtors << endl;
    return 0;
}
`,
      count: { line: 5 },
      unit: 'times',
      explain: 'initDerived runs 3 times, each time calling initBase. Line 5 executes 3 times.',
    },
    {
      id: 'oop-u5-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Trace multi-level inheritance simulation.',
      code: cpp`
#include <iostream>
using namespace std;

struct Level1 {
    int a;
};

struct Level2 {
    Level1 l1;
    int b;
};

struct Level3 {
    Level2 l2;
    int c;
};

int main() {
    Level3 obj = {{{{5}}, 10}, 20};
    cout << obj.l2.l1.a + obj.l2.b + obj.c << endl;
    return 0;
}
`,
      explain: '5 + 10 + 20 = 35. Output is 35.',
    },
    {
      id: 'oop-u5-l2-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace specialized fee overrides for standard vs premium accounts.',
      code: cpp`
#include <iostream>
using namespace std;

struct Account {
    int balance;
};

int getFee(Account a) {
    return 5;
}

struct PremiumAccount {
    Account base;
};

int getFee(PremiumAccount p) {
    return 0;
}

int main() {
    Account a = {100};
    PremiumAccount p = {{100}};
    cout << getFee(a) << " " << getFee(p) << endl;
    return 0;
}
`,
      explain: 'Standard account fee is 5. Premium account fee is 0. Output is 5 0.',
    },
    {
      id: 'oop-u5-l2-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 11 sets the inherited base member to 0 instead of using parameter a.',
      code: cpp`
#include <iostream>
using namespace std;

struct Base {
    int x;
};

struct Derived {
    Base b;
    int y;
};

void init(Derived &d, int a, int b) {
    d.b.x = 0;
    d.y = b;
}

int main() {
    Derived d;
    init(d, 10, 20);
    cout << d.b.x + d.y << endl;
    return 0;
}
`,
      bugLine: 12,
      options: [
        'd.b.x is hardcoded to 0 instead of parameter a',
        'Derived cannot embed Base',
        'main cannot declare Derived d',
        'cout cannot sum d.b.x and d.y',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Base {
    int x;
};

struct Derived {
    Base b;
    int y;
};

void init(Derived &d, int a, int b) {
    d.b.x = a;
    d.y = b;
}

int main() {
    Derived d;
    init(d, 10, 20);
    cout << d.b.x + d.y << endl;
    return 0;
}
`,
      explain: 'Assigning d.b.x = a properly initializes the base component to 10 so 10 + 20 = 30 is printed.',
    },
  ],
  cheatsheet: [
    { code: 'class D : public B { ... };', text: 'D publicly inherits from B' },
    { code: 'protected', text: 'accessible in base and derived, hidden outside' },
    { code: 'Constructor chain', text: 'Base constructed first, Derived second' },
    { code: 'Destructor chain', text: 'Derived destroyed first, Base second' },
  ],
};

const OOP_U5_CP: Level = {
  id: 'checkpoint-oop-inheritance',
  kind: 'revision',
  title: 'Inheritance & Composition',
  tagline: 'Review hierarchy design, access specifiers, and constructor chaining.',
  objectives: [
    'Distinguish between is-a (inheritance) and has-a (composition)',
    'Trace initialization of base and derived components',
    'Conquer the Gold Exam Challenge Box on inheritance past papers',
  ],
  practice: [
    {
      id: 'oop-cp5-mcq1',
      kind: 'mcq',
      prompt: 'A class `Car` has a member `Engine`. What type of relationship is this?',
      options: ['Inheritance (is-a)', 'Composition (has-a)', 'Polymorphism', 'Overloading'],
      answer: 1,
      explain: 'A Car has an Engine (Composition).',
    },
    {
      id: 'oop-cp5-pred1',
      kind: 'predict',
      prompt: 'Stair 2 (Easy-Medium): Inspect derived sub-object attribute values.',
      code: cpp`
#include <iostream>
using namespace std;

struct Animal {
    int legs;
};

struct Dog {
    Animal a;
    int barkVolume;
};

struct Spider {
    Animal a;
    int webLength;
};

int main() {
    Dog d = {{4}, 80};
    Spider s = {{8}, 150};
    cout << d.a.legs << " " << s.a.legs << endl;
    return 0;
}
`,
      explain: 'd.a.legs is 4, s.a.legs is 8. Output is 4 8.',
    },
    {
      id: 'oop-cp5-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many times is `speak` called for indices greater than 1?',
      code: cpp`
#include <iostream>
using namespace std;

int calls = 0;
void speak() {
    calls++;
}

int main() {
    for (int i = 0; i < 5; i++) {
        if (i > 1) speak();
    }
    cout << calls << endl;
    return 0;
}
`,
      count: { line: 5 },
      unit: 'times',
      explain: 'i = 2, 3, 4 satisfy i > 1. Line 5 executes 3 times.',
    },
    {
      id: 'oop-cp5-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Calculate the area of a rectangle built from two composite Point structs.',
      code: cpp`
#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

struct Rect {
    Point p1;
    Point p2;
};

int main() {
    Rect r = {{{2, 3}}, {{7, 9}}};
    int area = (r.p2.x - r.p1.x) * (r.p2.y - r.p1.y);
    cout << area << endl;
    return 0;
}
`,
      explain: 'width = 7 - 2 = 5. height = 9 - 3 = 6. area = 5 * 6 = 30.',
    },
    {
      id: 'oop-cp5-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Calculate difference between senior and junior employee salary.',
      code: cpp`
#include <iostream>
using namespace std;

struct Employee {
    int base;
    int rank;
};

int calcSalary(Employee e) {
    return e.base + (e.rank * 500);
}

int main() {
    Employee junior = {2000, 1};
    Employee senior = {2000, 4};
    cout << calcSalary(senior) - calcSalary(junior) << endl;
    return 0;
}
`,
      explain: 'junior: 2000 + 500 = 2500. senior: 2000 + 2000 = 4000. 4000 - 2500 = 1500.',
    },
    {
      id: 'oop-cp5-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 9 fails to initialize the base component id.',
      code: cpp`
#include <iostream>
using namespace std;

struct BaseEntity {
    int id;
};

struct Player {
    BaseEntity b;
};

void initPlayer(Player &p, int id) {
    p.b.id = 0;
}

int main() {
    Player p;
    initPlayer(p, 99);
    cout << p.b.id << endl;
    return 0;
}
`,
      bugLine: 13,
      options: [
        'p.b.id is assigned 0 instead of the passed id parameter',
        'Player cannot embed BaseEntity',
        'main cannot declare Player p',
        'cout cannot print p.b.id',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct BaseEntity {
    int id;
};

struct Player {
    BaseEntity b;
};

void initPlayer(Player &p, int id) {
    p.b.id = id;
}

int main() {
    Player p;
    initPlayer(p, 99);
    cout << p.b.id << endl;
    return 0;
}
`,
      explain: 'Assigning p.b.id = id stores the provided id 99 instead of 0.',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: FAST Inheritance & Hierarchy Past Papers',
    intro: 'Past exam problems on base-derived hierarchies, protected access, and constructor ordering.',
    questions: [
      {
        id: 'oop-gold-u5-q1',
        kind: 'predict',
        source: 'FAST OOP Final Exam · Spring 2024',
        tag: 'exam',
        prompt: 'Predict the output of this base-derived simulation:',
        code: cpp`
#include <iostream>
using namespace std;

struct Base {
    int x;
};

struct Derived {
    Base b;
    int y;
};

void init(Derived &d, int a, int b) {
    d.b.x = a;
    d.y = b;
}

int main() {
    Derived d;
    init(d, 10, 20);
    cout << d.b.x + d.y << endl;
    return 0;
}
`,
        explain: 'd.b.x = 10, d.y = 20. Sum is 30. Prints 30.',
      },
      {
        id: 'oop-gold-u5-q2',
        kind: 'mcq',
        source: 'FAST OOP Final Exam · Fall 2023',
        tag: 'exam',
        prompt: 'When a derived class object is deleted, in what order do destructors execute?',
        options: [
          'Base destructor first, then Derived destructor',
          'Derived destructor first, then Base destructor',
          'Only the Derived destructor executes',
          'Only the Base destructor executes',
        ],
        answer: 1,
        explain: 'Destruction always executes in reverse order of construction: Derived class destructor runs first to clean up its own resources, followed by the Base class destructor.',
      },
      {
        id: 'oop-gold-u5-q3',
        kind: 'predict',
        source: 'FAST OOP Midterm · Spring 2024',
        tag: 'exam',
        prompt: 'FAST Exam Classic: Trace constructor chaining and destructor sequence in derived classes.',
        code: cpp`
#include <iostream>
using namespace std;

void logStep(const char* s) {
    cout << s << " ";
}

int main() {
    logStep("BaseCtor");
    logStep("DerivedCtor");
    logStep("DerivedDtor");
    logStep("BaseDtor");
    cout << endl;
    return 0;
}
`,
        explain: 'Base constructor runs first, then Derived constructor. On destruction, Derived destructor runs first, then Base destructor. Prints BaseCtor DerivedCtor DerivedDtor BaseDtor.',
      },
      {
        id: 'oop-gold-u5-q4',
        kind: 'mcq',
        source: 'FAST OOP Final Exam · Fall 2022',
        tag: 'exam',
        prompt: 'In C++, what problem occurs when two intermediate classes B and C inherit from A, and D inherits from both B and C (the Diamond Problem)?',
        options: [
          'D inherits two separate copies of A, causing ambiguity when accessing A members',
          'The compiler crashes with out-of-memory error',
          'D cannot have any member variables of its own',
          'Virtual functions stop working entirely',
        ],
        answer: 0,
        explain: 'Without virtual inheritance, D inherits two duplicate copies of A (one via B and one via C), creating ambiguity. Virtual inheritance solves this by ensuring only one shared base subobject exists.',
      },
      {
        id: 'oop-gold-u5-q5',
        kind: 'mcq',
        source: 'FAST OOP Final Exam · Spring 2023',
        tag: 'exam',
        prompt: 'What happens during "Object Slicing" in C++?',
        options: [
          'When a derived class object is passed by value to a parameter of base class type, all derived members are sliced off and lost',
          'When an object is split across multiple CPU cores',
          'When an array is sliced using pointer arithmetic',
          'When a class has more than 5 member variables',
        ],
        answer: 0,
        explain: 'Passing a derived object by value to a function expecting a base object copies only the base subobject, slicing off all derived-specific fields and virtual function overrides.',
      },
    ],
  },
};

// =====================================================================================
// UNIT 6: Polymorphism & Virtual Functions
// =====================================================================================

const OOP_U6_L1: Level = {
  id: 'oop-virtual-functions',
  kind: 'lesson',
  title: 'Polymorphism & Virtual Functions',
  tagline: 'Polymorphism means "many forms". A base pointer can point to any derived object, and calling a virtual function executes the derived version dynamically!',
  minutes: 25,
  objectives: [
    'Understand static binding (compile-time) vs dynamic binding (runtime)',
    'Use base pointers to manipulate derived objects',
    'Understand the role of the `virtual` keyword and the vtable',
  ],
  learn: [
    { t: 'p', text: 'Without `virtual`, C++ performs **early binding**: if you call `ptr->draw()` where `ptr` is a `Shape*`, C++ calls `Shape::draw()` regardless of whether `ptr` actually points to a `Circle` or a `Square`. Adding `virtual` tells the compiler to perform **late binding**: inspect the actual object at runtime and call `Circle::draw()`!' },
    { t: 'syntax', title: 'Virtual Member Function Syntax', code: cpp`
class Shape {
public:
    virtual void draw() {
        cout << "Drawing generic shape" << endl;
    }
};

class Circle : public Shape {
public:
    void draw() override {
        cout << "Drawing circle" << endl;
    }
};`, parts: [
      { token: 'virtual void draw()', text: 'enables dynamic dispatch: checks vtable at runtime' },
      { token: 'override', text: 'compiler check ensuring this function really overrides a base virtual method' },
    ] },
    { t: 'viz', title: 'Dynamic dispatch simulation using type tag', code: cpp`
#include <iostream>
using namespace std;

struct Animal {
    int type; // 1 = Dog, 2 = Cat
};

void makeSound(Animal &a) {
    if (a.type == 1) cout << "Woof!" << endl;
    else if (a.type == 2) cout << "Meow!" << endl;
    else cout << "Sound" << endl;
}

int main() {
    Animal a1 = {1};
    Animal a2 = {2};
    makeSound(a1);
    makeSound(a2);
    return 0;
}
` },
  ],
  ways: {
    goal: 'Calculate area for different shape types through a unified interface.',
    intro: 'Polymorphic dispatch patterns.',
    items: [
      { title: 'Shape dispatcher function', code: cpp`
#include <iostream>
using namespace std;
struct Shape { int kind, dim1, dim2; };
int getArea(Shape &s) {
    if (s.kind == 1) return s.dim1 * s.dim2; // Rect
    if (s.kind == 2) return (s.dim1 * s.dim2) / 2; // Triangle
    return 0;
}
int main() {
    Shape rect = {1, 4, 5};
    Shape tri = {2, 6, 4};
    cout << getArea(rect) << " " << getArea(tri) << endl;
    return 0;
}` },
    ],
    takeaway: 'Virtual functions replace explicit switch/if chains with automatic runtime table dispatch.',
    check: {
      id: 'oop-u6-l1-check',
      kind: 'mcq',
      prompt: 'What keyword must be placed before a base class method to enable dynamic runtime dispatch in C++?',
      options: ['override', 'virtual', 'dynamic', 'runtime'],
      answer: 1,
      explain: 'The `virtual` keyword instructs the compiler to generate a vtable for dynamic method dispatch.',
    },
  },
  watch: [
    { title: 'Runtime dispatch trace', intro: 'Observing behavior conditioned on object type.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int type = 1;
    if (type == 1) cout << "Dog behavior" << endl;
    else cout << "Generic behavior" << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Polymorphic damage calculation',
    problem: 'Warrior deals 50 physical damage; Mage deals 80 magic damage. Execute attacks through unified dispatcher.',
    steps: [
      { text: 'Define character type: 1 = Warrior, 2 = Mage.', lines: [5] },
      { text: 'Calculate damage: if Warrior return 50, else return 80.', lines: [6, 7] },
      { text: 'Print combined attack damage.', lines: [8] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int attack(int role) {
    if (role == 1) return 50;
    return 80;
}

int main() {
    int w = attack(1);
    int m = attack(2);
    cout << "Total: " << w + m << endl;
    return 0;
}
`,
    why: 'Polymorphism allows calling code to operate on abstract types while specific types execute appropriate behavior.',
    yourTurn: {
      id: 'oop-u6-l1-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['w', 'm'],
      prompt: 'Dry run w and m.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int w = 50;
    int m = 80;
    cout << w + m << endl;
    return 0;
}
`,
      hints: ['w = 50, m = 80.'],
      explain: 'w = 50, m = 80.',
    },
  },
  practice: [
    {
      id: 'oop-u6-l1-mcq1',
      kind: 'mcq',
      prompt: 'If a base class has non-virtual methods, when does the compiler determine which function to call?',
      options: ['At runtime', 'At compile time (early binding)', 'At link time', 'Never'],
      answer: 1,
      explain: 'Non-virtual methods use compile-time early binding based strictly on the pointer/reference declaration type.',
    },
    {
      id: 'oop-u6-l1-pred1',
      kind: 'predict',
      prompt: 'Stair 2 (Easy-Medium): Trace polymorphic area dispatch based on type identifier.',
      code: cpp`
#include <iostream>
using namespace std;

struct Shape {
    int type;
    int val;
};

int area(Shape &s) {
    if (s.type == 1) return s.val * s.val;
    return s.val * 2;
}

int main() {
    Shape s1 = {1, 5};
    Shape s2 = {2, 5};
    cout << area(s1) << " " << area(s2) << endl;
    return 0;
}
`,
      explain: 's1 (type 1) computes 5 * 5 = 25. s2 (type 2) computes 5 * 2 = 10. Output is 25 10.',
    },
    {
      id: 'oop-u6-l1-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many times is the dynamic dispatcher invoked across the batch array?',
      code: cpp`
#include <iostream>
using namespace std;

int dispatches = 0;
void invoke(int type) {
    dispatches++;
}

int main() {
    int types[4] = {1, 2, 1, 2};
    for (int i = 0; i < 4; i++) {
        invoke(types[i]);
    }
    cout << dispatches << endl;
    return 0;
}
`,
      count: { line: 5 },
      unit: 'times',
      explain: 'The loop executes 4 times, calling invoke each time. Line 5 runs 4 times.',
    },
    {
      id: 'oop-u6-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Trace simulated vtable function pointer array dispatch.',
      code: cpp`
#include <iostream>
using namespace std;

int fnCircle(int r) {
    return 3 * r * r;
}

int fnSquare(int s) {
    return s * s;
}

int main() {
    int (*vtable[2])(int) = {fnCircle, fnSquare};
    cout << vtable[0](3) << " " << vtable[1](4) << endl;
    return 0;
}
`,
      explain: 'vtable[0](3) calls fnCircle(3) = 3 * 9 = 27. vtable[1](4) calls fnSquare(4) = 16. Output is 27 16.',
    },
    {
      id: 'oop-u6-l1-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace specialized armor mitigation during damage dispatch.',
      code: cpp`
#include <iostream>
using namespace std;

struct Entity {
    int id;
    int health;
};

void takeDamage(Entity &e, int dmg, bool isArmored) {
    if (isArmored) e.health -= dmg / 2;
    else e.health -= dmg;
}

int main() {
    Entity hero = {1, 100};
    Entity boss = {2, 200};
    takeDamage(hero, 40, false);
    takeDamage(boss, 40, true);
    cout << hero.health << " " << boss.health << endl;
    return 0;
}
`,
      explain: 'hero takes unmitigated 40 damage: 100 - 40 = 60. boss armor mitigates by half: 200 - 20 = 180. Output is 60 180.',
    },
    {
      id: 'oop-u6-l1-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 8 omits volume calculation for sound code 2.',
      code: cpp`
#include <iostream>
using namespace std;

struct Animal {
    int soundCode;
};

int getVolume(Animal &a) {
    if (a.soundCode == 1) return 10;
    return 0;
}

int main() {
    Animal lion = {2};
    cout << getVolume(lion) << endl;
    return 0;
}
`,
      bugLine: 9,
      options: [
        'getVolume returns 0 for soundCode 2 instead of returning the expected volume 50',
        'Animal cannot have an integer field',
        'main cannot declare Animal lion',
        'cout cannot print integer return values',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Animal {
    int soundCode;
};

int getVolume(Animal &a) {
    if (a.soundCode == 1) return 10;
    if (a.soundCode == 2) return 50;
    return 0;
}

int main() {
    Animal lion = {2};
    cout << getVolume(lion) << endl;
    return 0;
}
`,
      explain: 'Adding the soundCode 2 branch correctly outputs 50 instead of 0.',
    },
  ],
  cheatsheet: [
    { code: 'virtual void func()', text: 'enables late binding / dynamic dispatch' },
    { code: 'vtable', text: 'lookup table of virtual function pointers' },
    { code: 'override', text: 'tells compiler to verify base signature match' },
  ],
};

const OOP_U6_L2: Level = {
  id: 'oop-abstract-classes',
  kind: 'lesson',
  title: 'Abstract Classes & Pure Virtual Interfaces',
  tagline: 'Some concepts are too general to exist on their own. An abstract class cannot be instantiated; it defines an interface that all derived classes must implement.',
  minutes: 20,
  objectives: [
    'Define pure virtual functions using `= 0` syntax',
    'Understand abstract classes vs concrete derived classes',
    'Enforce interface contracts across derived types',
  ],
  learn: [
    { t: 'p', text: 'What is the area of a generic "Shape"? The question makes no sense until you know whether it is a circle, square, or triangle. By declaring `virtual double area() = 0;`, you make `Shape` an **Abstract Class**. You cannot create a plain `Shape s;`, but any derived class MUST provide an implementation for `area()`, or it cannot be instantiated either!' },
    { t: 'syntax', title: 'Pure Virtual Function and Abstract Class', code: cpp`
class Shape {
public:
    virtual double area() = 0;   // Pure virtual function!
    virtual ~Shape() {}          // Virtual destructor
};`, parts: [
      { token: '= 0', text: 'specifies that this function has no implementation here; it is pure virtual' },
      { token: 'class Shape', text: 'Shape is now an Abstract Class and CANNOT be instantiated directly' },
    ] },
    { t: 'callout', tone: 'key', title: 'Virtual Destructors in Base Classes', text: 'Whenever a class has virtual functions, its destructor **MUST be virtual** (`virtual ~Base() {}`). Otherwise, calling `delete basePtr;` will only run the base destructor and leak derived resources!' },
    { t: 'viz', title: 'Interface contract implementation', code: cpp`
#include <iostream>
using namespace std;

struct Printable {
    int id;
};

void render(Printable &p) {
    cout << "Render Item ID: " << p.id << endl;
}

int main() {
    Printable p = {404};
    render(p);
    return 0;
}
` },
  ],
  ways: {
    goal: 'Enforce that all shapes calculate area.',
    intro: 'Interface pattern.',
    items: [
      { title: 'Contract validation', code: cpp`
#include <iostream>
using namespace std;
struct Circle { int r; };
int circleArea(Circle &c) { return 3 * c.r * c.r; }
int main() {
    Circle c = {5};
    cout << "Area: " << circleArea(c) << endl;
    return 0;
}` },
    ],
    takeaway: 'Abstract classes act as blueprints for other blueprints, ensuring derived classes uphold required behaviors.',
    check: {
      id: 'oop-u6-l2-check',
      kind: 'mcq',
      prompt: 'What makes a C++ class "abstract"?',
      options: [
        'Having only private variables',
        'Having at least one pure virtual function (= 0)',
        'Being declared with the keyword `abstract`',
        'Having no constructor',
      ],
      answer: 1,
      explain: 'In C++, any class containing at least one pure virtual function (`virtual void f() = 0;`) becomes an abstract class.',
    },
  },
  watch: [
    { title: 'Abstract interface simulation', intro: 'Calling uniform interface functions on concrete data.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int r = 10;
    cout << "Area: " << 314 << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Interface implementation check',
    problem: 'Calculate perimeter of Square and Triangle through common formulas.',
    steps: [
      { text: 'Square of side 4 has perimeter 4 * 4 = 16.', lines: [5] },
      { text: 'Equilateral triangle of side 5 has perimeter 3 * 5 = 15.', lines: [6] },
      { text: 'Sum both perimeters.', lines: [7] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    int pSquare = 4 * 4;
    int pTri = 3 * 5;
    cout << pSquare + pTri << endl;
    return 0;
}
`,
    why: 'Enforcing uniform interface guarantees every concrete subtype answers required queries.',
    yourTurn: {
      id: 'oop-u6-l2-think-trace',
      kind: 'trace',
      mode: 'vars',
      vars: ['pSquare', 'pTri'],
      prompt: 'Dry run perimeters.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int pSquare = 16;
    int pTri = 15;
    cout << pSquare + pTri << endl;
    return 0;
}
`,
      hints: ['16 and 15.'],
      explain: 'pSquare = 16, pTri = 15.',
    },
  },
  practice: [
    {
      id: 'oop-u6-l2-mcq1',
      kind: 'mcq',
      prompt: 'Can you instantiate an object of an abstract class directly (e.g. `Shape s;`)?',
      options: [
        'Yes, always',
        'No, the compiler disallows instantiating abstract classes',
        'Yes, but only as a pointer on the heap',
        'Only if all pure virtual functions return void',
      ],
      answer: 1,
      explain: 'Attempting to instantiate an abstract class directly results in a compilation error.',
    },
    {
      id: 'oop-u6-l2-pred1',
      kind: 'predict',
      prompt: 'Stair 2 (Easy-Medium): Calculate perimeters using polymorphic side counts.',
      code: cpp`
#include <iostream>
using namespace std;

struct Shape {
    int dim;
};

int getPerimeter(Shape s, int sides) {
    return s.dim * sides;
}

int main() {
    Shape sq = {5};
    Shape hex = {3};
    cout << getPerimeter(sq, 4) << " " << getPerimeter(hex, 6) << endl;
    return 0;
}
`,
      explain: 'Square perimeter: 5 * 4 = 20. Hexagon perimeter: 3 * 6 = 18. Output is 20 18.',
    },
    {
      id: 'oop-u6-l2-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many registry entries are validated as non-zero IDs?',
      code: cpp`
#include <iostream>
using namespace std;

int validated = 0;
void validateInterface(int id) {
    if (id > 0) validated++;
}

int main() {
    int registry[4] = {101, 0, 102, 103};
    for (int i = 0; i < 4; i++) {
        validateInterface(registry[i]);
    }
    cout << validated << endl;
    return 0;
}
`,
      count: { line: 5 },
      unit: 'times',
      explain: '101, 102, 103 are > 0. Line 5 runs 3 times.',
    },
    {
      id: 'oop-u6-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Trace simulated output serialization from concrete writer implementations.',
      code: cpp`
#include <iostream>
using namespace std;

void writeJson(int val) {
    cout << "JSON:" << val << " ";
}

void writeXml(int val) {
    cout << "XML:" << val << endl;
}

int main() {
    writeJson(42);
    writeXml(42);
    return 0;
}
`,
      explain: 'Prints "JSON:42 XML:42".',
    },
    {
      id: 'oop-u6-l2-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Calculate total price with category tax rates.',
      code: cpp`
#include <iostream>
using namespace std;

struct Product {
    int price;
    int taxRate;
};

int finalPrice(Product p) {
    return p.price + (p.price * p.taxRate) / 100;
}

int main() {
    Product book = {100, 5};
    Product luxury = {500, 20};
    cout << finalPrice(book) << " " << finalPrice(luxury) << endl;
    return 0;
}
`,
      explain: 'book: 100 + 5 = 105. luxury: 500 + 100 = 600. Output is 105 600.',
    },
    {
      id: 'oop-u6-l2-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 9 adds width and height instead of multiplying them for rectangle area.',
      code: cpp`
#include <iostream>
using namespace std;

struct Rect {
    int w, h;
};

int area(Rect r) {
    return r.w + r.h;
}

int main() {
    Rect r = {4, 5};
    cout << area(r) << endl;
    return 0;
}
`,
      bugLine: 9,
      options: [
        'area returns r.w + r.h instead of r.w * r.h',
        'Rect cannot have two integer members',
        'main cannot declare Rect r',
        'cout cannot print area(r)',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Rect {
    int w, h;
};

int area(Rect r) {
    return r.w * r.h;
}

int main() {
    Rect r = {4, 5};
    cout << area(r) << endl;
    return 0;
}
`,
      explain: 'Multiplying 4 * 5 yields the correct area 20 instead of 9.',
    },
  ],
  cheatsheet: [
    { code: 'virtual void f() = 0;', text: 'pure virtual function definition' },
    { code: 'Abstract Class', text: 'cannot be instantiated directly' },
    { code: 'virtual ~Base() {}', text: 'mandatory virtual destructor in polymorphic base' },
  ],
};

const OOP_U6_CP: Level = {
  id: 'checkpoint-oop-polymorphism',
  kind: 'revision',
  title: 'Polymorphism & Abstract Classes',
  tagline: 'The culmination of OOP: virtual functions, pure virtual interfaces, and dynamic binding.',
  objectives: [
    'Distinguish compile-time vs runtime polymorphism',
    'Identify pure virtual functions and abstract classes',
    'Conquer the Gold Exam Challenge Box on FAST polymorphism past papers',
  ],
  practice: [
    {
      id: 'oop-cp6-mcq1',
      kind: 'mcq',
      prompt: 'Why should a base class containing virtual functions always declare a virtual destructor?',
      options: [
        'To allow the base class to be copied',
        'To ensure that deleting an object through a base pointer executes the derived class destructor',
        'To make the class run faster',
        'It is required by cin/cout',
      ],
      answer: 1,
      explain: 'If the base destructor is not virtual, `delete basePtr;` only invokes the base destructor, leaking memory and resources in the derived object.',
    },
    {
      id: 'oop-cp6-pred1',
      kind: 'predict',
      prompt: 'Stair 2 (Easy-Medium): Trace polymorphic sound generation based on type parameter.',
      code: cpp`
#include <iostream>
using namespace std;

struct Animal {
    int id;
};

int sound(Animal a, int type) {
    if (type == 1) return 100;
    return 50;
}

int main() {
    Animal a = {1};
    cout << sound(a, 1) + sound(a, 2) << endl;
    return 0;
}
`,
      explain: 'sound(a, 1) returns 100. sound(a, 2) returns 50. Total sum: 100 + 50 = 150.',
    },
    {
      id: 'oop-cp6-count1',
      kind: 'count',
      prompt: 'Stair 3 (Medium): How many times is `dynamicCall` invoked across the loop?',
      code: cpp`
#include <iostream>
using namespace std;

int dispatches = 0;
void dynamicCall(int v) {
    dispatches++;
}

int main() {
    for (int i = 0; i < 4; i++) {
        dynamicCall(i * 10);
    }
    cout << dispatches << endl;
    return 0;
}
`,
      count: { line: 5 },
      unit: 'times',
      explain: 'The loop executes 4 times for i = 0, 1, 2, 3. Line 5 executes 4 times.',
    },
    {
      id: 'oop-cp6-pred2',
      kind: 'predict',
      prompt: 'Stair 4 (Hard): Calculate total area across heterogeneous shape types in an array.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int shapes[3] = {1, 2, 1};
    int totalArea = 0;
    for (int i = 0; i < 3; i++) {
        if (shapes[i] == 1) totalArea += 10;
        else totalArea += 20;
    }
    cout << totalArea << endl;
    return 0;
}
`,
      explain: 'shapes[0] is 1 (+10). shapes[1] is 2 (+20). shapes[2] is 1 (+10). Total area: 10 + 20 + 10 = 40.',
    },
    {
      id: 'oop-cp6-pred3',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Calculate fee strategy across credit card, flat PayPal, and crypto.',
      code: cpp`
#include <iostream>
using namespace std;

int calcFee(int method, int amount) {
    if (method == 1) return (amount * 3) / 100;
    if (method == 2) return 5;
    return 0;
}

int main() {
    int t1 = calcFee(1, 200);
    int t2 = calcFee(2, 200);
    int t3 = calcFee(3, 200);
    cout << t1 << " " << t2 << " " << t3 << endl;
    return 0;
}
`,
      explain: 'Credit card (method 1): (200 * 3) / 100 = 6. PayPal (method 2): flat 5. Crypto (method 3): 0. Output is 6 5 0.',
    },
    {
      id: 'oop-cp6-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 13 subtracts 10 instead of adding the required bonus 10.',
      code: cpp`
#include <iostream>
using namespace std;

struct Base {
    int x;
};

int calculate(Base b) {
    return b.x + 5;
}

int main() {
    Base b = {20};
    int res = calculate(b);
    cout << res - 10 << endl;
    return 0;
}
`,
      bugLine: 14,
      options: [
        'res - 10 subtracts 10 instead of adding 10 to the calculated result',
        'Base cannot have an integer field',
        'calculate cannot take Base by value',
        'cout cannot print arithmetic expressions',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Base {
    int x;
};

int calculate(Base b) {
    return b.x + 5;
}

int main() {
    Base b = {20};
    int res = calculate(b);
    cout << res + 10 << endl;
    return 0;
}
`,
      explain: 'Adding 10 yields (20 + 5) + 10 = 35 instead of 15.',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: FAST Polymorphism Past Papers',
    intro: 'Past exam problems on virtual functions, vtables, pure virtual functions, and abstract class constraints.',
    questions: [
      {
        id: 'oop-gold-u6-q1',
        kind: 'predict',
        source: 'FAST OOP Final Exam · Spring 2024',
        tag: 'exam',
        prompt: 'Predict the output of this polymorphic dispatch sequence:',
        code: cpp`
#include <iostream>
using namespace std;

struct Base {
    int id;
};

void show(Base &b) {
    cout << "ID: " << b.id << endl;
}

int main() {
    Base b = {101};
    show(b);
    return 0;
}
`,
        explain: 'Prints "ID: 101".',
      },
      {
        id: 'oop-gold-u6-q2',
        kind: 'mcq',
        source: 'FAST OOP Final Exam · Fall 2023',
        tag: 'exam',
        prompt: 'Which of the following is an example of COMPILE-TIME (static) polymorphism in C++?',
        options: [
          'Virtual functions',
          'Function overloading and operator overloading',
          'Abstract classes with pure virtual functions',
          'Runtime type information (RTTI)',
        ],
        answer: 1,
        explain: 'Function overloading and operator overloading are resolved at compile time (static polymorphism). Virtual functions are resolved at runtime (dynamic polymorphism).',
      },
      {
        id: 'oop-gold-u6-q3',
        kind: 'predict',
        source: 'FAST OOP Final Exam · Spring 2024',
        tag: 'exam',
        prompt: 'FAST Exam Classic: Trace dynamic method dispatch simulation.',
        code: cpp`
#include <iostream>
using namespace std;

void drawCircle() {
    cout << "Circle::draw ";
}

void infoShape() {
    cout << "Shape::info" << endl;
}

int main() {
    drawCircle();
    infoShape();
    return 0;
}
`,
        explain: 'Prints "Circle::draw Shape::info".',
      },
      {
        id: 'oop-gold-u6-q4',
        kind: 'mcq',
        source: 'FAST OOP Final Exam · Fall 2023',
        tag: 'exam',
        prompt: 'What special requirement applies to a pure virtual destructor (`virtual ~Base() = 0;`) in C++?',
        options: [
          'It must still be provided with a function body/definition outside the class',
          'It cannot be called by derived classes',
          'It turns all member variables into pointers',
          'It prevents derived classes from having destructors',
        ],
        answer: 0,
        explain: 'Even though a destructor is declared pure virtual (= 0), a function definition MUST be provided because derived class destructors always implicitly call the base destructor.',
      },
      {
        id: 'oop-gold-u6-q5',
        kind: 'mcq',
        source: 'FAST OOP Final Exam · Fall 2022',
        tag: 'exam',
        prompt: 'How many virtual method tables (vtables) does the compiler create for a polymorphic class hierarchy?',
        options: [
          'Exactly one vtable per class with virtual functions, shared by all instances of that class',
          'One vtable for every single object instance created on the stack or heap',
          'One vtable per virtual function',
          'Zero, vtables are created by the operating system loader',
        ],
        answer: 0,
        explain: 'There is only one static vtable per polymorphic class. Each individual object instance merely stores a pointer (_vptr) pointing to that shared table.',
      },
    ],
  },
};

// =====================================================================================
// OOP Units Export
// =====================================================================================

export const oopUnit1: Unit = {
  id: 'oop-u1',
  num: 1,
  title: 'Classes, Objects & Encapsulation',
  summary: 'Blueprints, public vs private access specifiers, state protection, getters and setters with validation.',
  levels: [OOP_U1_L1, OOP_U1_L2, OOP_U1_CP],
};

export const oopUnit2: Unit = {
  id: 'oop-u2',
  num: 2,
  title: 'Constructors, Destructors & Object Lifetime',
  summary: 'Safe initialization with default/parameterized constructors, destructor execution, and LIFO stack unwinding.',
  levels: [OOP_U2_L1, OOP_U2_L2, OOP_U2_CP],
};

export const oopUnit3: Unit = {
  id: 'oop-u3',
  num: 3,
  title: 'Dynamic Memory & Deep Copy',
  summary: 'Pointer members, the shallow copy trap, double-free avoidance, copy constructors, and the Rule of Three.',
  levels: [OOP_U3_L1, OOP_U3_L2, OOP_U3_CP],
};

export const oopUnit4: Unit = {
  id: 'oop-u4',
  num: 4,
  title: 'Operator Overloading',
  summary: 'Customizing arithmetic and comparison operators (+, -, ==), and cascading stream operators (<<, >>).',
  levels: [OOP_U4_L1, OOP_U4_L2, OOP_U4_CP],
};

export const oopUnit5: Unit = {
  id: 'oop-u5',
  num: 5,
  title: 'Inheritance & Composition',
  summary: 'Has-a composition vs is-a inheritance, protected access, constructor chaining order, and hierarchies.',
  levels: [OOP_U5_L1, OOP_U5_L2, OOP_U5_CP],
};

export const oopUnit6: Unit = {
  id: 'oop-u6',
  num: 6,
  title: 'Polymorphism & Virtual Functions',
  summary: 'Runtime dynamic dispatch, vtables, virtual destructors, and abstract classes with pure virtual functions.',
  levels: [OOP_U6_L1, OOP_U6_L2, OOP_U6_CP],
};

export const OOP_COURSE: Course = {
  id: 'oop',
  title: 'Object Oriented Programming',
  lang: 'C++',
  units: [oopUnit1, oopUnit2, oopUnit3, oopUnit4, oopUnit5, oopUnit6],
};
