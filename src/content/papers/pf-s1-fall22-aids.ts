import type { PaperSet } from '../types';
import { cpp, prog } from '../helpers';

// PF Sessional-I (BS-AI/DS) · Fall 2022 — FAST Islamabad, 26 Sep 2022.
// Q1 outputs (6 codes), Q2 reasons and types of errors (4 codes), Q3 ticket booking program.
const T = 'PF Sessional-I (BS-AI/DS) · Fall 2022';
const P = 'pf-s1-fall22-aids';
const OUT1 = 'What is the output of the following code? If there are any errors, mention them clearly.';
const ERR2 = 'Write down the reasons and types of error in the following code. What happens when it is compiled?';

export const paper: PaperSet = {
  id: P,
  title: T,
  year: 2022,
  questions: [
    // ---------- Q1: outputs ----------
    {
      unit: 5,
      q: {
        id: `${P}-q1-1`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(1)`,
        prompt: OUT1,
        code: prog(cpp`
    int x = 5, y = 30;
    if (y / x > 2) {
        if (y % x != 2)
            x = x + 2; cout << x << "\n" << y; }
    cout << x << y;`),
        hints: ['The inner `if` has no braces: it owns only `x = x + 2;`. The `cout` on the same line is a separate statement.', 'The last `cout` has no space or newline between x and y.'],
        explain:
          'Line 6: `30 / 5 = 6`, `6 > 2` → true, enter the block.\nLine 7: `30 % 5 = 0`, `0 != 2` → true, so `x = 5 + 2 = 7`.\nLine 8: after `x = x + 2;` the `cout` is a new statement (still inside the outer braces): prints `7`, a newline, `30`.\nLine 9 prints x and y with nothing between: `730`.\nOutput:\n`7`\n`30730`',
      },
    },
    {
      unit: 2,
      q: {
        id: `${P}-q1-2`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(2)`,
        prompt: OUT1,
        code: prog(cpp`
    int a = 8;
    float b = 4.5;
    a = b + 3;
    cout << a + b;`),
        hints: ['`b + 3` is 7.5, but `a` is an `int`.', '`a + b` mixes int and float, so the result is a float.'],
        explain:
          'Line 7: `b + 3` = 7.5; stored in the `int a` it becomes `7` (the fraction is cut off).\nLine 8: `a + b` = 7 + 4.5 = `11.5` (int + float gives a float).\nOutput: **`11.5`**',
      },
    },
    {
      unit: 4,
      q: {
        id: `${P}-q1-3`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(3)`,
        prompt: OUT1,
        code: prog(cpp`
    int a = 6 + 1, b = 0, c = 2;
    a = 3 + (b = 5);
    c = c + a * 5 + (c + 17);
    cout << a << b << c;`),
        hints: ['`(b = 5)` stores 5 in b AND has the value 5.', 'The values are printed with no spaces between them.'],
        explain:
          'Line 6: `(b = 5)` makes b = 5 and gives 5, so `a = 3 + 5 = 8`.\nLine 7: `c = 2 + 8 * 5 + (2 + 17)` = 2 + 40 + 19 = `61`.\nLine 8 prints 8, 5 and 61 with no spaces.\nOutput: **`8561`**',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q1-4`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(4)`,
        prompt: OUT1,
        code: prog(cpp`
    int n = 10;
    if (n > 0)
        cout << "n is positive\n";
    if (n > 10)
    cout << "n is greater than 10";
    cout << " The value of n:" << n;
    if (n < 100)
      cout << "\n n is less than 100";`),
        hints: ['Is 10 greater than 10?', 'Without braces an `if` owns only the next statement — indentation does not matter.'],
        explain:
          'Line 6: `10 > 0` → prints `n is positive` and a newline.\nLine 8: `10 > 10` is false → line 9 is skipped.\nLine 10 is not part of any if → prints ` The value of n:10` (it starts with a space).\nLine 11: `10 < 100` → prints a newline and ` n is less than 100`.\nOutput:\n`n is positive`\n` The value of n:10`\n` n is less than 100`',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q1-5`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(5)`,
        prompt: OUT1,
        code: prog(cpp`
    int x = 2, y = 11, z = 20;
    if (x > 16 && y > x || z % 2 == 0)
        cout << "Hello World";
    else
        cout << "BYE";`),
        hints: ['`&&` is done before `||`: `(x > 16 && y > x) || (z % 2 == 0)`.'],
        explain:
          'The condition groups as `(x > 16 && y > x) || (z % 2 == 0)`.\nLeft: `2 > 16` is false → the `&&` part is false.\nRight: `20 % 2 == 0` is true → the whole condition is true.\nOutput: **`Hello World`**\n(Note: the printed paper forgot `return 0; }` at the end of this code. Copied exactly, g++ would report *expected `}` at end of input*. Here the closing brace is added so the program runs.)',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q1-6`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(6)`,
        prompt: OUT1,
        code: prog(cpp`
    int a = 7, b = 6, c = 0;
    switch (0) {
        case 1:
            a = 6; b = 8;
            cout << a << endl;
        case 0:
            b = a + c;
            cout << b << endl;
        default:
            c = b + 3;
            cout << c << endl;
    }
    cout << a << " " << b << " " << c;`),
        hints: ['`switch (0)` jumps straight to `case 0`. `case 1` is skipped.', 'There is no `break`, so after case 0 it falls into `default` too.'],
        explain:
          'The switch value is `0`, so it jumps to `case 0` (case 1 does not run: a stays 7, b stays 6).\n• case 0: `b = 7 + 0 = 7`, prints `7`.\n• No `break` → falls into default: `c = 7 + 3 = 10`, prints `10`.\nLine 17 prints `7 7 10`.\nOutput:\n`7`\n`10`\n`7 7 10`',
      },
    },
    // ---------- Q2: errors ----------
    {
      unit: 3,
      q: {
        id: `${P}-q2-1`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q2(1)`,
        prompt: ERR2,
        code: prog(cpp`
    int a, b, mult;
    cout << "Enter 1st number";
    cin >> a;
    cout << "Enter 2nd number;
    cin >> b;
    sum = a + b;
    cout < sum;`),
        input: '3\n4\n',
        hints: ['Look at every string: does each one open AND close?', 'Is there a variable called `sum`? And is `<` the output operator?'],
        explain:
          '**Compile error on line 8: missing terminating `"` character.** The string `"Enter 2nd number;` is never closed, so the compiler reads the rest of the line as part of the string.\nThis program has three **syntax (compile-time) errors**:\n1. Line 8: missing closing `"` → `cout << "Enter 2nd number";`\n2. Line 10: `sum` was not declared (only `a`, `b`, `mult` exist) → declare `int sum;` (or use `mult`).\n3. Line 11: `cout < sum` uses the comparison `<` instead of the insertion operator `<<` → `cout << sum;`.\nAfter the fixes, with input 3 and 4 it prints `Enter 1st numberEnter 2nd number7`.',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q2-2`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q2(2)`,
        prompt: ERR2,
        code: prog(cpp`
    int Ascii_value = 20;
    if (Ascii_value >= 0 && Ascii_value >= 47 ||
        Ascii_value >= 54 && Ascii_value <= 64) ||
        Ascii_value >= 91)
        cout << " You have entered special character";`),
        hints: ['Count the brackets: which `)` closes the `if (`?', 'Also think about the logic: `>= 0 && >= 47` — is that a range?'],
        explain:
          '**Compile error on line 7: expected primary-expression before `||` token.** The `)` after `64` already closes the `if (`. What follows, `|| Ascii_value >= 91)`, is not a valid statement. This is a **syntax error** (unbalanced brackets).\nThere is also a **logical error**: `Ascii_value >= 0 && Ascii_value >= 47` is not a range — it should be `Ascii_value <= 47`.\nCorrected: `if ((Ascii_value >= 0 && Ascii_value <= 47) || (Ascii_value >= 54 && Ascii_value <= 64) || Ascii_value >= 91)`. With the value 20, it then prints ` You have entered special character`.',
      },
    },
    {
      unit: 4,
      q: {
        id: `${P}-q2-3`,
        kind: 'mcq',
        tag: 'exam',
        source: `${T} · Q2(3)`,
        prompt: 'What type of error does this code have?',
        code: cpp`
int n = 9, div = 0;
div = n / 0;
cout << "result = " << div;
`,
        options: [
          'A **runtime error**: it compiles (g++ only warns), but dividing an integer by 0 crashes the program',
          'A **syntax error**: g++ refuses to compile `n / 0`',
          'A **logical error** only: it prints `result = 0`',
          'No error: it prints `result = 9`',
        ],
        answer: 0,
        hints: ['The grammar of `div = n / 0;` is perfectly fine.', 'What happens to the CPU when a whole number is divided by 0?'],
        explain:
          'The statement is grammatically correct, so it **compiles** (g++ only gives a warning: *division by zero*).\nWhen it runs, integer division by zero is impossible; the program crashes (on Linux: *Floating point exception*) before anything is printed. So this is a **runtime error**.\n(DryRun cannot show this crash as a normal run, so this question is multiple choice.)',
      },
    },
    {
      unit: 4,
      q: {
        id: `${P}-q2-4`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q2(4)`,
        prompt: ERR2,
        code: prog(cpp`
    int a, b, c;
    a + b = c;`),
        hints: ['The left side of `=` must be a box in memory (a variable). Is `a + b` a variable?'],
        explain:
          '**Compile error on line 6: lvalue required as left operand of assignment.** `a + b` is a temporary value, not a variable, so nothing can be stored in it. This is a **syntax (compile-time) error**.\nCorrection: `c = a + b;` (and give a and b values first — they are uninitialised).',
      },
    },
    // ---------- Q3: ticket booking ----------
    {
      unit: 5,
      q: {
        id: `${P}-q3`,
        kind: 'task',
        tag: 'real life',
        source: `${T} · Q3`,
        prompt:
          'In a couple of months there is the event of **23 March** (Pakistan Day). You want to see the parade in Islamabad, so you check ticket availability on the web. Create a **Ticket Booking System** for the parade park.\n\n**Park ticket** — PKR **10 per hour**:\n- children under 10 are not permitted in the park\n- age 10–15 gets **10% OFF**\n- age 15–20 gets **5% OFF**\n- above 20 is not allowed\n\n**Swing ticket** — PKR **10**:\n- age 1–5 gets **50% OFF**\n- age 5–10 gets **25% OFF**\n- above 10 is not allowed\n\nThe program asks for the **age** of the person and the **hours** they will stay in the park, then finds and displays the **total bill** (park ticket + swing ticket, for the ones the person is allowed to buy). If the person cannot buy any ticket, print a message.\n\nUse these boundaries (the paper overlaps them): park 10% for `10 <= age < 15`, 5% for `15 <= age <= 20`; swing 50% for `1 <= age < 5`, 25% for `5 <= age <= 10`.',
        solution: cpp`
#include <iostream>
using namespace std;

int main() {
    int age, hours;
    cout << "Enter age: ";
    cin >> age;
    cout << "Enter hours: ";
    cin >> hours;

    double park = 0, swing = 0;   // the two tickets

    // Park: PKR 10 per hour, only for ages 10 to 20
    if (age >= 10 && age < 15)
        park = hours * 10 * 0.90;       // 10% off
    else if (age >= 15 && age <= 20)
        park = hours * 10 * 0.95;       // 5% off

    // Swing: PKR 10, only for ages 1 to 10
    if (age >= 1 && age < 5)
        swing = 10 * 0.50;              // 50% off
    else if (age >= 5 && age <= 10)
        swing = 10 * 0.75;              // 25% off

    if (park == 0 && swing == 0)
        cout << "Sorry, no ticket is allowed for this age." << endl;
    else
        cout << "Total bill: PKR " << park + swing << endl;
    return 0;
}
`,
        tests: [
          { input: '12\n3\n', label: 'age 12, 3 hours (park only)' },
          { input: '10\n2\n', label: 'age 10, 2 hours (park + swing)' },
          { input: '4\n5\n', label: 'age 4 (swing only)' },
          { input: '25\n2\n', label: 'age 25 (not allowed)' },
        ],
        compare: 'numbers',
        steps: [
          'Read two whole numbers: `age` and `hours`.',
          'Keep two `double` variables for the two tickets, `park` and `swing`, both starting at 0 (0 means "not bought").',
          'Park ticket: the full price is `hours * 10`. Use an `if / else if` on the age: 10–14 pays 90% (`* 0.90`), 15–20 pays 95% (`* 0.95`). Other ages leave `park` at 0.',
          'Swing ticket: the full price is 10. Ages 1–4 pay 50% (`10 * 0.50`), ages 5–10 pay 75% (`10 * 0.75`). Other ages leave `swing` at 0.',
          'These are TWO separate decisions (a 10-year-old can buy both), so use two separate `if` chains, not one.',
          'If both tickets are still 0, print a "not allowed" message.',
          'Otherwise print the total bill `park + swing`. Test: age 12, 3 hours → 3 × 10 × 0.9 = 27.',
        ],
        hints: ['Two separate `if / else if` chains: one for the park, one for the swing.', 'A discount of 10% means paying 90%: `price * 0.90`.'],
        explain:
          'Age 12, 3 hours: park = 3 × 10 × 0.90 = 27, no swing (above 10) → `Total bill: PKR 27`.\nAge 10, 2 hours: park = 2 × 10 × 0.90 = 18, swing = 10 × 0.75 = 7.5 → `25.5`.\nAge 4: not allowed in the park, swing = 10 × 0.50 = 5 → `5`.\nAge 25: nothing allowed → the "Sorry" message.',
      },
    },
  ],
};
