import type { PaperSet } from '../types';
import { cpp, prog, progF } from '../helpers';

// PF Sessional-II (BS-AI/DS), FAST-NUCES Islamabad, Fall 2022 (10 November 2022).
// Question I: 18 short output / error questions (a–r) · II: alphabet pattern function
// · III: digit-sum function · IV: sum of a series.
// The paper shows only the code of main (without return 0); here each snippet is wrapped in a full program,
// so paper line k is line k + 4 of the program.
const T = 'PF Sessional-II (BS-AI/DS) · Fall 2022';
const S = (part: string) => `${T} · ${part}`;
const DISPLAY = 'What will the following program display on screen? Explain the error or bug if there is any.';
const OUTPUT = 'What is the output of the following program segment? Identify errors (if any).';

export const paper: PaperSet = {
  id: 'pf-s2-fall22-aids',
  title: T,
  year: 2022,
  questions: [
    // ------------------------------------------------------------------ Question I
    {
      unit: 4,
      q: {
        id: 'pf-s2-fall22-aids-q1-a', kind: 'predict', tag: 'exam', source: S('QI(a)'),
        prompt: DISPLAY,
        code: prog(cpp`
    int a, b, c;
    a = 6, b = 4, c = 2;
    int max = (a > b > c) * (a + b + c);
    cout << max;`),
        hints: ['`a > b > c` is NOT "a > b and b > c". It is `(a > b) > c`.', 'A comparison gives `true` (1) or `false` (0).'],
        explain: 'Line 6: `a = 6, b = 4, c = 2;` is fine (comma operator, three assignments).\nLine 7: `>` groups left to right: `(a > b) > c` → `(6 > 4) > 2` → `1 > 2` → `0` (false).\n`0 * (6 + 4 + 2)` = 0.\nOutput: **`0`**\nThe bug: to test "a > b > c" in C++ you must write `a > b && b > c` (that would give 12).',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-aids-q1-b', kind: 'predict', tag: 'exam', source: S('QI(b)'),
        prompt: DISPLAY,
        code: prog(cpp`
    char alphabet = 'A';
    for (int i = ('F' - 'A' + 1); i >= 1; --i)
    {
        for (int j = 1; j <= i; ++j)
        {
            cout << alphabet << " ";
        }
        ++alphabet;
        cout << endl;
    }`),
        hints: ['`\'F\' - \'A\' + 1` = 70 − 65 + 1 = 6, so the outer loop runs for i = 6, 5, 4, 3, 2, 1.', 'Row i prints the current letter i times, then the letter moves to the next one.'],
        explain: 'No error. `\'F\' - \'A\' + 1` = 6.\ni = 6: `A` six times; alphabet becomes `B`.\ni = 5: `B` five times … i = 1: `F` once.\nOutput (each letter followed by a space):\n`A A A A A A `\n`B B B B B `\n`C C C C `\n`D D D `\n`E E `\n`F `',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-aids-q1-c', kind: 'predict', tag: 'exam', source: S('QI(c)'),
        prompt: DISPLAY,
        code: prog(cpp`
    int i, j, m, answer;
    m = 0;
    j = 4;
    while (m < 5) {
    for (i = 0; i < j; i++){
        answer = i * m;
        cout << answer;
    }
    m = m + 1;
    cout << endl;}`),
        hints: ['For each m = 0 … 4, the for loop prints i * m for i = 0, 1, 2, 3.', 'There is no space between the numbers.'],
        explain: 'No error. The outer loop runs for m = 0, 1, 2, 3, 4; each row prints `0*m 1*m 2*m 3*m` without spaces.\nm = 0: `0000`\nm = 1: `0123`\nm = 2: `0246`\nm = 3: `0369`\nm = 4: `04812` (0, 4, 8, 12)\nOutput:\n`0000`\n`0123`\n`0246`\n`0369`\n`04812`',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s2-fall22-aids-q1-d', kind: 'predict', tag: 'exam', source: S('QI(d)'),
        prompt: OUTPUT,
        code: prog(cpp`
    int x = 5, y = 10;
    int z = ++x * y--;
    cout << (z + y);`),
        hints: ['`++x` changes x first and uses 6. `y--` uses the old value 10, then y becomes 9.'],
        explain: 'No error. `++x` → x = 6 and the value used is 6. `y--` uses 10, and afterwards y = 9.\nz = 6 * 10 = 60.\n`z + y` = 60 + 9 = 69.\nOutput: **`69`**',
      },
    },
    {
      unit: 7,
      q: {
        id: 'pf-s2-fall22-aids-q1-e', kind: 'predict', tag: 'exam', source: S('QI(e)'),
        prompt: OUTPUT,
        code: prog(cpp`
    int x=10;
    {
        cout<<x<<"\t";
        int x=20;
        cout<<(x++)<<"\t";
    }
    cout<<(--x);`),
        hints: ['Before line 8, only the outer x (10) exists.', 'The inner `x` (20) dies at the closing `}`. Which x does the last line change?'],
        explain: 'No error: a new block `{ }` may declare its own `x`.\nLine 7: the inner x does not exist yet → prints the outer x: `10`, then a tab.\nLine 8: a new inner x = 20 hides the outer one. Line 9: `x++` prints 20 (then inner x = 21), then a tab.\nLine 10: the inner x is destroyed.\nLine 11: `--x` works on the outer x: 10 → 9, prints `9`.\nOutput: **`10\t20\t9`** (tabs between the numbers).',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s2-fall22-aids-q1-f', kind: 'predict', tag: 'exam', source: S('QI(f)'),
        prompt: OUTPUT,
        code: prog(cpp`
    int z = 5, j = 7, k = 6, n = 3;
    cout << (z + j % k + k * n - 15) << "\t" ;
    cout << (z % n + 5) << endl;`),
        hints: ['`%` and `*` are done before `+` and `-`.'],
        explain: 'No error.\n`z + j % k + k * n - 15` = 5 + (7 % 6) + (6 * 3) − 15 = 5 + 1 + 18 − 15 = **9**.\n`z % n + 5` = (5 % 3) + 5 = 2 + 5 = **7**.\nOutput: **`9\t7`** (a tab between them, then a newline).',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-aids-q1-g', kind: 'predict', tag: 'exam', source: S('QI(g)'),
        prompt: OUTPUT,
        code: prog(cpp`
    int i = 12, counter = 5;
    while (i - 1)
    {
        ++counter;
        i--;
    }
    cout<<counter;`),
        hints: ['`while (i - 1)` means "while i - 1 is not zero", i.e. while i != 1.', 'i goes 12, 11, …, 2 inside the loop. How many values is that?'],
        explain: 'No error. The condition is true while `i - 1 != 0`, i.e. while i is not 1.\nThe body runs for i = 12, 11, …, 2 → **11 times**, so counter = 5 + 11 = 16.\nWhen i becomes 1, `i - 1` is 0 (false) and the loop stops.\nOutput: **`16`**',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s2-fall22-aids-q1-h', kind: 'predict', tag: 'exam', source: S('QI(h)'),
        prompt: OUTPUT,
        code: prog(cpp`
    int a=5;
    int b=a++++;
    cout<<b;`),
        hints: ['`a++` gives back a plain VALUE (a copy of the old a), not the variable itself.', 'Can you increment a value like `5++`?'],
        explain: '**Compile error on line 6: lvalue required as increment operand.**\n`a++++` is read as `(a++)++`. The first `a++` returns a temporary value (5), not a variable. `++` needs a variable (an *lvalue*) it can change, so the second `++` is illegal. Nothing is printed.\n(With the prefix form, `++++a` would compile, because `++a` returns the variable a itself.)',
      },
    },
    {
      unit: 7,
      q: {
        id: 'pf-s2-fall22-aids-q1-i', kind: 'mcq', tag: 'exam', source: S('QI(i)'),
        prompt: 'What is the output of the following program segment? Identify errors (if any). **Assume an uninitialised variable has value zero in the beginning.**',
        code: cpp`
int x=10;
    {
        int x=x;
        cout<<x<<"\t";
    }
cout<<(--x);
`,
        options: ['`10\t9`', '`0\t9` — the inner `x` is initialised with itself (not with the outer 10)', '`10\t10`', 'Compile error: `x` is declared twice'],
        answer: 1,
        hints: ['A variable\'s scope starts right after its name — BEFORE the `=`.', 'So in `int x=x;` both x\'s are the NEW inner x.'],
        explain: 'It compiles (a new block may declare its own x).\nThe scope of the inner x begins right after its name, so in `int x=x;` the `x` on the right is already the **inner** x, which has no value yet. It is initialised with its own garbage — by the question\'s rule, **0**. So `0` and a tab are printed.\nAt `}` the inner x dies. `--x` changes the outer x: 10 → 9.\nOutput: **`0\t9`** (in a real program the first number is garbage — undefined behaviour — so DryRun does not run this one).',
      },
    },
    {
      unit: 5,
      q: {
        id: 'pf-s2-fall22-aids-q1-j', kind: 'predict', tag: 'exam', source: S('QI(j)'),
        prompt: DISPLAY,
        code: prog(cpp`
    int suite = 5 ;
    switch ( suite ) ;
    {
    case 0+5 ;
    cout<< "\nClub" ;
    case 1+5 ;
    cout<< "\nDiamond" ;
    }`),
        hints: ['Look at what ends line 6 — the `switch` gets an empty body.', 'After `case 0+5` there must be a colon `:`.'],
        explain: '**Compile error on line 8.**\nTwo bugs: (1) line 6 `switch ( suite ) ;` — the `;` is the whole (empty) body of the switch, so the block `{ … }` below is NOT part of the switch and its `case` labels are "not within a switch statement". (2) `case 0+5 ;` and `case 1+5 ;` use `;` instead of `:` ("expected `:` before `;`").\nThe first error g++ reports is on line 8 (`case 0+5 ;`). Nothing is printed.\nFixed: `switch (suite) { case 0+5: cout << "\\nClub"; case 1+5: cout << "\\nDiamond"; }` would print `Club` and `Diamond` on new lines (fall-through, no `break`).',
      },
    },
    {
      unit: 5,
      q: {
        id: 'pf-s2-fall22-aids-q1-k', kind: 'predict', tag: 'exam', source: S('QI(k)'),
        prompt: OUTPUT,
        code: prog(cpp`
    int i=0, n = 0;
    if ((i < 1) && (++i < n))
    {
        cout << "Condition True!";
    }
    else
        cout<<"Not True";`),
        hints: ['`i < 1` is true, so `&&` must also evaluate the right side (and `++i` really runs).'],
        explain: 'No error. `i < 1` → 0 < 1 is true, so `&&` evaluates the right side: `++i` makes i = 1, and `1 < 0` is false.\ntrue && false = false → the else runs.\nOutput: **`Not True`**',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-aids-q1-l', kind: 'predict', tag: 'exam', source: S('QI(l)'),
        prompt: DISPLAY,
        code: prog(cpp`
    int x = 8, y = 0, z ;
    while ( x >= 0 && y <=5 )
    {
        if ( x == y )
        break ;
        else
        cout<<x<<y ;
        x-- ;
        y+=2 ;
    }`),
        hints: ['Each round prints x and y side by side, then x goes down by 1 and y up by 2.', 'Check the loop condition before every round: y must be at most 5.'],
        explain: 'No error (z is never used).\nx = 8, y = 0: not equal → prints `80`; x = 7, y = 2.\nx = 7, y = 2 → `72`; x = 6, y = 4.\nx = 6, y = 4 → `64`; x = 5, y = 6.\nNow `y <= 5` is false → the loop ends (the `break` never runs).\nOutput: **`807264`**',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s2-fall22-aids-q1-m', kind: 'predict', tag: 'exam', source: S('QI(m)'),
        prompt: OUTPUT,
        code: prog(cpp`
    int z, x=5, y=-10, a=4, b=2;
    z = x++ - --y * b / a;
    cout<<z;`),
        hints: ['`--y` makes y = −11 first. `*` and `/` go left to right before the `-`.', 'Integer division cuts toward zero: −22 / 4 = −5.'],
        explain: 'No error.\n`x++` uses 5 (x becomes 6 later). `--y` → y = −11.\n`--y * b / a` = (−11 × 2) / 4 = −22 / 4 = **−5** (integer division truncates toward zero).\nz = 5 − (−5) = 10.\nOutput: **`10`**',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-aids-q1-n', kind: 'predict', tag: 'exam', source: S('QI(n)'),
        prompt: DISPLAY,
        code: prog(cpp`
    int x = 1, y =2, n=50 ;
    while (y <=n )
    {
        if ( n%y == 0 )
        {
            n=n/y;
            x=x+1;
        }
        else
        y=y+1;
        cout<<x<<y<<" ";
    }`),
        hints: ['When y divides n, n is divided and x grows; otherwise y grows. Either way x and y are printed.', 'The loop stops when y becomes bigger than n.'],
        explain: 'No error. The loop splits 50 into prime factors (2 × 5 × 5); x counts them (+1).\ny = 2: 50 % 2 = 0 → n = 25, x = 2 → `22 `\ny = 2: 25 % 2 ≠ 0 → y = 3 → `23 `\ny = 3: 25 % 3 ≠ 0 → y = 4 → `24 `\ny = 4: 25 % 4 ≠ 0 → y = 5 → `25 `\ny = 5: 25 % 5 = 0 → n = 5, x = 3 → `35 `\ny = 5: 5 % 5 = 0 → n = 1, x = 4 → `45 `\nNow `5 <= 1` is false → stop.\nOutput: **`22 23 24 25 35 45 `**',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s2-fall22-aids-q1-o', kind: 'predict', tag: 'exam', source: S('QI(o)'),
        prompt: DISPLAY,
        code: prog(cpp`
    int a = 0, b=26;
    float f=2.6;
    b+= (a = 50)*f/2*10-b%5;
    cout << a << "#" << b;`),
        hints: ['`(a = 50)` stores 50 in a and has the value 50. `b%5` uses the OLD b (26).', 'Once f (a float) joins, the multiplication is done with decimals; the result is cut to an int when stored in b.'],
        explain: 'No error. (The printed paper shows `b\\%5` — a typesetting slip for `b%5`.)\n`(a = 50)` → a = 50. `50 * f` = 130 (float), `/ 2` = 65, `* 10` = 650.\n`b % 5` = 26 % 5 = 1 → right side = 650 − 1 = 649.\n`b += 649` → b = 26 + 649 = 675.\nOutput: **`50#675`**',
      },
    },
    {
      unit: 7,
      q: {
        id: 'pf-s2-fall22-aids-q1-p', kind: 'predict', tag: 'exam', source: S('QI(p)'),
        prompt: OUTPUT,
        code: progF(cpp`
float Mystery(int y, int x){
        return (y + x + 7.0 / 2); }`, cpp`
        float i = 9.5;
        int j = 4;
        cout << Mystery(i, j) << endl;`),
        hints: ['The parameter `y` is an `int`: what happens to 9.5 when it is passed?', '`7.0 / 2` is a double division.'],
        explain: 'No error. The float 9.5 is passed into the `int` parameter y, so y = 9 (the .5 is cut). x = 4.\n`7.0 / 2` = 3.5. 9 + 4 + 3.5 = 16.5, returned as a float.\nOutput: **`16.5`**',
      },
    },
    {
      unit: 7,
      q: {
        id: 'pf-s2-fall22-aids-q1-q', kind: 'predict', tag: 'exam', source: S('QI(q)'),
        prompt: OUTPUT,
        code: progF(cpp`
int fun(int x){
        return x % 3 + 1; }`, cpp`
        int b = 5;
        int y = 2 + fun(3 * b + 1);
        int z = fun(fun(y));
        cout << y << "-" << z;`),
        hints: ['`fun(16)` = 16 % 3 + 1.', 'For `fun(fun(y))` do the inner call first.'],
        explain: 'No error.\n`fun(3 * 5 + 1)` = fun(16) = 16 % 3 + 1 = 1 + 1 = 2 → y = 2 + 2 = 4.\n`fun(4)` = 4 % 3 + 1 = 2, then `fun(2)` = 2 % 3 + 1 = 3 → z = 3.\nOutput: **`4-3`**',
      },
    },
    {
      unit: 5,
      q: {
        id: 'pf-s2-fall22-aids-q1-r', kind: 'task', tag: 'exam', source: S('QI(r)'),
        prompt: 'Convert the `switch` code shown in the starter program (inside the comment) into **if-else** decision structures. Your program must print exactly the same as the switch for every input: read one `char` into `sport`, do not print a prompt.\nWatch out: some cases have **no `break`**, so they fall through into the next case.',
        starter: cpp`
#include <iostream>
using namespace std;

int main() {
    char sport;
    cin >> sport;
    /* Convert this switch into if / else if / else:
    switch (sport) {
    case 'c':
    cout << "You like Cricket";
    case 'f':
    cout << "You like Football";
    break;
    case 't':
    case 'H':
    cout << "You like Tennis";
    cout << "You like Hockey";
    case 'B':
    cout << "You like BasketBall";
    break; }
    */

    return 0;
}
`,
        solution: cpp`
#include <iostream>
using namespace std;

int main() {
    char sport;
    cin >> sport;
    if (sport == 'c') {
        // case 'c' has no break: it falls into case 'f'
        cout << "You like Cricket";
        cout << "You like Football";
    }
    else if (sport == 'f') {
        cout << "You like Football";
    }
    else if (sport == 't' || sport == 'H') {
        // 't' and 'H' share code, and there is no break before case 'B'
        cout << "You like Tennis";
        cout << "You like Hockey";
        cout << "You like BasketBall";
    }
    else if (sport == 'B') {
        cout << "You like BasketBall";
    }
    return 0;
}
`,
        tests: [
          { input: 'c\n', label: "sport = 'c'" },
          { input: 'f\n', label: "sport = 'f'" },
          { input: 't\n', label: "sport = 't'" },
          { input: 'B\n', label: "sport = 'B'" },
        ],
        compare: 'exact',
        steps: [
          'Read one character into `sport` with `cin >> sport;`.',
          'Write down, for each case value, EVERYTHING the switch prints — follow the code until the next `break` or the end.',
          "`'c'` has no break, so it prints Cricket AND Football. `'f'` prints only Football.",
          "`'t'` and `'H'` are stacked labels: they run the same code. There is no break after Hockey, so BasketBall is printed too.",
          "`'B'` prints only BasketBall. Any other letter prints nothing (no `default`).",
          "Now write one `if` / `else if` per group: `if (sport == 'c')`, `else if (sport == 'f')`, `else if (sport == 't' || sport == 'H')`, `else if (sport == 'B')`.",
          'Inside each branch put the `cout` lines of that group, with the same texts and no extra spaces or newlines.',
        ],
        hints: ['A case without `break` continues into the next case.'],
        explain: 'The trick is fall-through. What the switch really prints:\n`c` → `You like CricketYou like Football`\n`f` → `You like Football`\n`t` or `H` → `You like TennisYou like HockeyYou like BasketBall`\n`B` → `You like BasketBall`\nanything else → nothing.\nThe if-else version needs one branch per group, and the grouped labels `\'t\'` / `\'H\'` become `sport == \'t\' || sport == \'H\'`.',
      },
    },
    // ------------------------------------------------------------------ Question II
    {
      unit: 7,
      q: {
        id: 'pf-s2-fall22-aids-q2-a', kind: 'task', tag: 'exam', source: S('QII(a)'),
        prompt: 'Write a **function** in C++ which takes a number as input and prints the pattern of alphabets shown in the starter code (for n = 5 and n = 4). You are required to **validate** the input: the number must be between 1 and 26 (otherwise print `Invalid input`).\nIn `main`, read n (no prompt) and call your function. Every row is shifted 2 more spaces to the right than the row above.',
        starter: cpp`
#include <iostream>
using namespace std;

// For n = 5:            For n = 4:
// A B C D E D C B A     A B C D C B A
//   B C D E D C B         B C D C B
//     C D E D C             C D C
//       D E D                 D
//         E

int main() {

    return 0;
}
`,
        solution: cpp`
#include <iostream>
using namespace std;

void printPattern(int n) {
    if (n < 1 || n > 26) {           // validate the input
        cout << "Invalid input" << endl;
        return;
    }
    for (int row = 0; row < n; row++) {
        for (int s = 0; s < row; s++)          // 2 spaces for every row above
            cout << "  ";
        for (int c = row; c < n; c++)          // going up: A+row ... last letter
            cout << char('A' + c) << " ";
        for (int c = n - 2; c >= row; c--)     // coming down again (last letter not repeated)
            cout << char('A' + c) << " ";
        cout << endl;
    }
}

int main() {
    int n;
    cin >> n;
    printPattern(n);
    return 0;
}
`,
        tests: [
          { input: '5\n', label: 'n = 5' },
          { input: '4\n', label: 'n = 4' },
          { input: '1\n', label: 'n = 1' },
          { input: '30\n', label: 'n = 30 (invalid)' },
        ],
        compare: 'lines',
        steps: [
          'Write `void printPattern(int n)`. `main` reads n with `cin` and calls it.',
          'First validate: if `n < 1 || n > 26`, print `Invalid input` and `return`.',
          'There are n rows. Use an outer loop `row = 0 … n - 1`.',
          'Each row starts with `2 * row` spaces (one letter + one space is 2 characters wide).',
          "Letters going up: from `'A' + row` to `'A' + n - 1`. Print them with `char('A' + c)` followed by a space.",
          "Letters coming down: from `'A' + n - 2` back to `'A' + row` (do not print the middle letter twice).",
          'End every row with `endl`. Check with n = 5: the last row is 8 spaces and `E`.',
        ],
        hints: ["`char('A' + 2)` is `C`."],
        explain: 'Row r (0-based) has 2r spaces, then the letters r … n−1 going up and n−2 … r going down. For n = 5, row 0 is A…E…A, row 4 is only E. Inputs outside 1 … 26 are rejected before any printing.',
      },
    },
    // ------------------------------------------------------------------ Question III
    {
      unit: 7,
      q: {
        id: 'pf-s2-fall22-aids-q3-a', kind: 'task', tag: 'exam', source: S('QIII(a)'),
        prompt: 'Write a **function** in C++ which takes a number n as a parameter and returns whether the sum of all digits **except the unit digit** (rightmost digit) is equal to the unit digit. If it is, print `YES` in `main`, otherwise print `NO`.\nExample: 1124 → `YES` because 1 + 1 + 2 = 4. 2348 → `NO` because 2 + 3 + 4 is not 8.\nRead n in `main` (no prompt).',
        solution: cpp`
#include <iostream>
using namespace std;

bool sumEqualsUnit(int n) {
    int unit = n % 10;      // rightmost digit
    n = n / 10;             // remove it
    int sum = 0;
    while (n > 0) {         // add the remaining digits
        sum += n % 10;
        n /= 10;
    }
    return sum == unit;
}

int main() {
    int n;
    cin >> n;
    if (sumEqualsUnit(n))
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
    return 0;
}
`,
        tests: [
          { input: '1124\n', label: 'n = 1124' },
          { input: '2348\n', label: 'n = 2348' },
          { input: '505\n', label: 'n = 505' },
          { input: '7\n', label: 'n = 7 (one digit)' },
        ],
        compare: 'lines',
        steps: [
          'Write a function `bool sumEqualsUnit(int n)` — it returns true or false.',
          'The unit digit is `n % 10`. Save it in a variable `unit`.',
          'Remove the unit digit: `n = n / 10;`.',
          'Add up the digits that are left: while `n > 0`, add `n % 10` to `sum`, then `n /= 10`.',
          'Return `sum == unit`.',
          'In `main`: read n, call the function inside an `if`, print `YES` or `NO`.',
          'Test by hand: 1124 → unit 4, the rest 112 → 1 + 1 + 2 = 4 → YES.',
        ],
        hints: ['`% 10` gives the last digit, `/ 10` removes it.'],
        explain: '`n % 10` peels off the unit digit, `n / 10` drops it; then the usual digit-sum loop adds the others.\n1124 → 4 vs 1+1+2 = 4 → `YES`. 2348 → 8 vs 9 → `NO`. 505 → 5 vs 5+0 → `YES`. 7 → 7 vs 0 → `NO`.',
      },
    },
    // ------------------------------------------------------------------ Question IV
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-aids-q4-a', kind: 'task', tag: 'exam', source: S('QIV(a)'),
        prompt: 'The value of a function F is defined by the series\n**F = 1/3 − x²/9 + x⁴/27 − x⁶/81 + x⁸/243 − …**\nWrite a C++ program that takes **n** (number of terms) and the value of **x** as input (in this order, no prompts) and calculates the sum of the first n terms. Example: n = 5, x = 2 → `0.744856`.\n(The printed paper shows only `+` signs, but its own example 0.744856 is the value with alternating signs: (81 − 108 + 144 − 192 + 256) / 243 = 181 / 243.)',
        solution: cpp`
#include <iostream>
using namespace std;

int main() {
    int n;
    double x;
    cin >> n >> x;
    double term = 1.0 / 3;      // first term: 1/3
    double sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += term;
        term = term * (-x * x) / 3;   // next term: times -x^2, and the bottom times 3
    }
    cout << sum << endl;
    return 0;
}
`,
        tests: [
          { input: '5 2\n', label: 'n = 5, x = 2' },
          { input: '1 7\n', label: 'n = 1, x = 7' },
          { input: '4 1\n', label: 'n = 4, x = 1' },
          { input: '3 3\n', label: 'n = 3, x = 3' },
        ],
        compare: 'numbers',
        steps: [
          'Read `n` (an int) and `x` (a double).',
          'Look at how one term becomes the next: the top is multiplied by x², the bottom by 3, and the sign flips.',
          'So keep a variable `term`, starting at `1.0 / 3` (use 1.0, not 1, to avoid integer division!).',
          'Keep `sum = 0`. Loop n times.',
          'In each round: `sum += term;` then `term = term * (-x * x) / 3;`.',
          'After the loop print `sum` with `cout` (default printing gives 0.744856 for n = 5, x = 2).',
          'Check by hand: n = 3, x = 3 → 1/3 − 1 + 3 = 2.33333.',
        ],
        hints: ['Build each term from the previous one instead of using pow().'],
        explain: 'Each term = previous term × (−x²) / 3. Starting from 1/3 and adding n terms:\nn = 5, x = 2: 1/3 − 4/9 + 16/27 − 64/81 + 256/243 = 181/243 = **0.744856**.',
      },
    },
  ],
};
