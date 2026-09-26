import type { PaperSet } from '../types';
import { cpp, prog, progF } from '../helpers';

// PF Midterm Exam · Summer 2024 (FAST-NUCES Islamabad, CS1002, 24 Jul 2024, BCS 9A, Ms. Munazza Nida).
// Q1: 12 program segments (output or syntax error).
// Q2: Hollow Palindrome Number Pyramid.
// Q3: 2x2 Matrix Inverse using Adjoint Method.
// Q4: Selection sort concept and recursive selection sort.
// Plus classic exam drills: if (cout << 0) and while (cout << 0).

const T = 'PF Midterm Exam · Summer 2024';
const P = 'pf-mid-summer24';
const OUT = 'Determine whether the program produces an output or contains a syntax error. If there is an error, state it explicitly. If there is no error, write the exact output.';

export const paper: PaperSet = {
  id: P,
  title: T,
  year: 2024,
  questions: [
    // ------------------------------------------------------------------ Q1(1)
    {
      unit: 4,
      q: {
        id: `${P}-q1-1`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(1)`,
        prompt: OUT,
        code: prog(cpp`
    int a = 5, b = 3, c = 2, d = 4;
    int result = (a & b) ? ((c << 1) ^ d) : ((b | d) ? (a >> 1) : (c & d));
    cout << result << endl;`),
        hints: [
          '`a & b` does bitwise AND. In binary: 5 is 101, 3 is 011.',
          'If the condition is true (non-zero), only the first branch `((c << 1) ^ d)` is evaluated.',
          '`c << 1` shifts 2 left by 1 bit (2 * 2 = 4). `^` is bitwise XOR: 4 ^ 4 = ?',
        ],
        explain:
          '`a & b`: `5 & 3` = `(101 & 011)_2` = `001_2` = 1 (true).\nBecause the condition is non-zero (true), the first ternary branch `((c << 1) ^ d)` is taken.\n`c << 1`: `2 << 1` = 4.\n`4 ^ d`: `4 ^ 4` = **0** (any integer XORed with itself is 0).\nThe rest of the expression is skipped.\nOutput: **`0`**',
      },
    },

    // ------------------------------------------------------------------ Q1(2)
    {
      unit: 6,
      q: {
        id: `${P}-q1-2`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(2)`,
        prompt: OUT,
        code: prog(cpp`
    int i = 8, counter = 5;
    while (--i > 0 && (counter += 1)) { }
    cout << counter;`),
        hints: [
          '`--i` decrements `i` BEFORE checking `> 0`.',
          '`(counter += 1)` only runs when `--i > 0` is true because of `&&` short-circuiting.',
        ],
        explain:
          'In each iteration, `--i > 0` decrements `i` and tests it:\n- i becomes 7: true, counter becomes 6.\n- i becomes 6, 5, 4, 3, 2, 1: counter becomes 7, 8, 9, 10, 11, 12.\n- i becomes 0: `0 > 0` is **false**. Because the left operand of `&&` is false, `(counter += 1)` is skipped by short-circuit.\nThe loop ends with `counter = 12`.\nOutput: **`12`**',
      },
    },

    // ------------------------------------------------------------------ Q1(3)
    {
      unit: 8,
      q: {
        id: `${P}-q1-3`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(3)`,
        prompt: OUT,
        code: prog(cpp`
    int arr[2][2] = { {10, 22}, {30, 44} };
    arr[1][1] *= arr[0][0];
    cout << arr[0][0] << " " << arr[0][1] << endl;
    cout << arr[1][0] << " " << arr[1][1] << endl;`),
        hints: [
          'The array has rows 0 and 1, columns 0 and 1.',
          '`arr[1][1]` is 44, multiplied by `arr[0][0]` which is 10.',
        ],
        explain:
          '`arr[1][1]` (initially 44) is multiplied by `arr[0][0]` (10), becoming 440.\nRow 0: `10 22`.\nRow 1: `30 440`.\n*(Note: the original exam paper contained a typo `arr[2][1]`, which is outside bounds in C++; safely adapted to row 1)*.\nOutput:\n`10 22`\n`30 440`',
      },
    },

    // ------------------------------------------------------------------ Q1(4)
    {
      unit: 1,
      q: {
        id: `${P}-q1-4`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(4)`,
        prompt: OUT,
        code: prog(cpp`
    int a = 2, b = 5, c = 4, result = 0;
    char target = 'D', marker = 'A';
    if (target - marker > 2) {
        if (b > 3 || ++c > 5)
            target += 2;
        if (target == 'F')
            result = (a < 5 && marker++ == 'A') ? 100 : (target - 'A') * (marker - 60);
        else
            result = -50;
    }
    b += (target == 'F');
    cout << target << " /n" << cout << result << endl;
    cout << marker << endl << cout << b << endl;`),
        hints: [
          'Look closely at the `cout` statements at the bottom.',
          'Can `cout` be inserted into another `cout` using `<<`?',
        ],
        explain:
          '**Compile error on line 15: no match for `operator<<` with operands `std::ostream` and `std::ostream`.**\nThe expression `cout << target << " /n" << cout << result` tries to stream `cout` itself: `... << cout << ...`. In C++, you cannot insert an output stream into another stream.\n(There is also a typo `"/n"` with a forward slash instead of `\\n`). Nothing is printed because compilation fails.',
      },
    },

    // ------------------------------------------------------------------ Q1(5)
    {
      unit: 6,
      q: {
        id: `${P}-q1-5`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(5)`,
        prompt: OUT,
        code: prog(cpp`
    int num1 = 1, num2 = 6;
    while (!(num1 & 16)) {
        if (num1 == 3 || num1 == 6 || num1 == 9 || num1 == 12) {
            num2++;
        }
        num1++;
    }
    cout << (num2 % 5);`),
        hints: [
          '16 in binary is `10000` (bit 4). When does `num1 & 16` become non-zero?',
          'How many times is `num2++` executed while `num1` increases from 1 to 15?',
        ],
        explain:
          'The bitwise AND `num1 & 16` checks bit 4. For numbers 1 through 15, bit 4 is 0, so `!(num1 & 16)` is true.\nWhen `num1` reaches 16, `16 & 16 = 16`, `!(16)` is false, and the loop stops.\nWhile `num1` goes from 1 to 15, it hits 3, 6, 9, and 12 (4 times), so `num2` increments 4 times from 6 to 10.\nFinally `10 % 5 = 0`.\nOutput: **`0`**',
      },
    },

    // ------------------------------------------------------------------ Q1(6)
    {
      unit: 5,
      q: {
        id: `${P}-q1-6`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(6)`,
        prompt: OUT,
        code: prog(cpp`
    int num1 = 0, num2 = 10;
    if (!num1 && --num2 == 0)
        cout << "okay" << endl;
    cout << "count = " << num2 << endl;`),
        hints: [
          '`!num1` is `!0` which evaluates to true (1).',
          '`--num2` decrements `num2` from 10 to 9 before comparing with 0.',
        ],
        explain:
          '`num1` is 0, so `!num1` is true.\nThe right side of `&&` must be checked: `--num2` decrements `num2` from 10 to 9, and `9 == 0` is false.\nSo the `if` body `cout << "okay"` does NOT run.\nLine 8 prints `count = 9`.\nOutput: **`count = 9`**',
      },
    },

    // ------------------------------------------------------------------ Q1(7)
    {
      unit: 7,
      q: {
        id: `${P}-q1-7`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(7)`,
        prompt: OUT,
        code: progF(
          cpp`
int evaluate(int x, int y) {
    if ((x ^ y) & 1) { return (x > y) ? (x - y) : (y - x); }
    else { if ((x & y) == 0) { return (x > y) ? (x >> 1) : (y >> 1); }
           else { return (x > y) ? (x - y) : (y - x); } }
}
int compute(int x, int y) {
    if (!(x ^ y)) { return x; }
    int diff = evaluate(x, y);
    return (x > y) ? compute(diff, y) : compute(x, diff);
}`,
          cpp`
    int x = 10, y = 5;
    cout << "Result = " << compute(x, y) << endl;`,
        ),
        hints: [
          'Trace `compute(10, 5)` step by step.',
          'Is `(10 ^ 5)` equal to 0? No, 10 != 5.',
          'In `evaluate(10, 5)`: 10 is even and 5 is odd, so `(10 ^ 5) & 1` is 1 (true).',
        ],
        explain:
          '1. `compute(10, 5)`: `10 ^ 5 = 15 != 0`, so `!(10 ^ 5)` is false.\n2. `evaluate(10, 5)`: `(10 ^ 5) & 1` = `15 & 1` = 1 (true). Returns `(10 > 5) ? (10 - 5) : ...` = 5. So `diff = 5`.\n3. `10 > 5` is true, so it returns `compute(diff, y)` = `compute(5, 5)`.\n4. `compute(5, 5)`: `5 ^ 5 = 0`. `!(0)` is true! Returns 5 immediately.\nOutput: **`Result = 5`**',
      },
    },

    // ------------------------------------------------------------------ Q1(8)
    {
      unit: 6,
      q: {
        id: `${P}-q1-8`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(8)`,
        prompt: OUT,
        code: prog(cpp`
    int totalLines = 5;
    for (int r = totalLines; r >= 1; r--) {
        for (int s = 1; s < r; s++) {
            cout << "^";
        }
        for (int c = 1; c <= 5; c += 2) {
            if (r == 2 && c > 3) {
                break;
            }
            cout << "$";
        }
        cout << endl;
    }`),
        hints: [
          'Outer loop `r` goes 5, 4, 3, 2, 1.',
          'The `s` loop prints `r - 1` carats `^`.',
          'The `c` loop runs for c = 1, 3, 5 (up to 3 dollar signs `$`). Watch the `break` when `r == 2 && c > 3`!',
        ],
        explain:
          '- r = 5: 4 `^`, then 3 `$` (c=1,3,5) → `^^^^$$$`\n- r = 4: 3 `^`, then 3 `$` → `^^^$$$`\n- r = 3: 2 `^`, then 3 `$` → `^^$$$`\n- r = 2: 1 `^`, then for c=1 (`$`), c=3 (`$`), c=5 hits `r == 2 && c > 3` → `break`! Only 2 `$` printed → `^$$`\n- r = 1: 0 `^`, then 3 `$` → `$$$`\nOutput:\n`^^^^$$$`\n`^^^$$$`\n`^^$$$`\n`^$$`\n`$$$`',
      },
    },

    // ------------------------------------------------------------------ Q1(9)
    {
      unit: 7,
      q: {
        id: `${P}-q1-9`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(9)`,
        prompt: OUT,
        code: progF(
          cpp`
void fun3(int x, int &sum);
void fun2(int x, int &sum);
void fun1(int x, int &sum);
void fun3(int x, int &sum) {
    if (x == 6)
        return;
    sum += 8;
    return;
    sum += 20;
    x++;
}
void fun2(int x, int &sum) {
    fun3(x + 1, sum);
    sum += 4;
}
void fun1(int x, int &sum) {
    fun2(x + 2, sum);
    sum += 3;
}`,
          cpp`
    int total = 0;
    fun1(2, total);
    cout << total;`,
        ),
        hints: [
          '`sum` is passed by reference (`int &sum`), so all modifications alter `total` in `main()`.',
          'Notice `return;` after `sum += 8;` inside `fun3`. Any code after `return;` is unreachable.',
        ],
        explain:
          '1. `main` starts with `total = 0` and calls `fun1(2, total)`.\n2. `fun1(2)` calls `fun2(2 + 2, total)` = `fun2(4, total)`.\n3. `fun2(4)` calls `fun3(4 + 1, total)` = `fun3(5, total)`.\n4. `fun3(5)`: `x == 6` is false. `sum += 8` runs, making `total = 8`. Then `return;` immediately exits the function (the statements `sum += 20; x++;` never run).\n5. Back in `fun2`: `sum += 4` runs, making `total = 8 + 4 = 12`.\n6. Back in `fun1`: `sum += 3` runs, making `total = 12 + 3 = 15`.\n7. `main` prints `total` which is 15.\nOutput: **`15`**',
      },
    },

    // ------------------------------------------------------------------ Q1(10)
    {
      unit: 7,
      q: {
        id: `${P}-q1-10`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(10)`,
        prompt: OUT,
        code: progF(
          cpp`
int calc(int x, int s) {
    if (x <= 1)
        return s;
    if (x % 2 == 0)
        return calc(x / 2, s + x);
    else
        return calc(3 * x + 1, s - 1) + x;
}`,
          cpp`
    cout << "Final Result: " << calc(5, 5) << endl;`,
        ),
        hints: [
          'Trace the recursive calls: `calc(5, 5)` is odd, so it returns `calc(16, 4) + 5`.',
          'Next 16, 8, 4, 2 are all even and follow `calc(x / 2, s + x)`.',
        ],
        explain:
          '- `calc(5, 5)`: 5 is odd → returns `calc(16, 4) + 5`.\n- `calc(16, 4)`: 16 is even → `calc(8, 20)`.\n- `calc(8, 20)`: 8 is even → `calc(4, 28)`.\n- `calc(4, 28)`: 4 is even → `calc(2, 32)`.\n- `calc(2, 32)`: 2 is even → `calc(1, 34)`.\n- `calc(1, 34)`: `x <= 1` is true → returns `s` = 34.\n- Add the outer `+ 5`: 34 + 5 = 39.\nOutput: **`Final Result: 39`**',
      },
    },

    // ------------------------------------------------------------------ Q1(11)
    {
      unit: 8,
      q: {
        id: `${P}-q1-11`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(11)`,
        prompt: OUT,
        code: prog(cpp`
    int a[] = {8, 14, 21, 35};
    int l = 0, h = 3, k = 14;
    int ans = -1;
    while (l <= h) {
        int m = (l + h) / 2;
        if (a[m] == k) {
            ans = m;
            break;
        }
        if (k < a[m])
            h = m - 1;
        else
            l = m + 1;
    }
    cout << ans;`),
        hints: [
          'This is binary search on a sorted 4-element array for target `k = 14`.',
          'Calculate `m = (l + h) / 2` for the first step.',
        ],
        explain:
          '1. `l = 0, h = 3`. Middle index `m = (0 + 3) / 2 = 1`.\n2. `a[1]` is 14, which equals `k` (14).\n3. `ans = 1; break;` exits the loop immediately.\n4. `cout << ans;` prints 1 (the index of 14).\nOutput: **`1`**',
      },
    },

    // ------------------------------------------------------------------ Q1(12)
    {
      unit: 5,
      q: {
        id: `${P}-q1-12`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(12)`,
        prompt: OUT,
        code: progF(
          cpp`
int calculate(int i, int m) {
    int value = (i * m * 2) + 20;
    value = 20 + (value % 20);
    return value;
}`,
          cpp`
    int i, j, m, answer;
    m = 0; j = 2;
    while (m < 5) {
        for (i = 0; i < j; i++) {
            switch (m % 3) {
                case 0:
                    answer = calculate(i, m);
                    cout << answer << " ";
                case 1:
                    answer = calculate(i, m);
                    cout << answer << " ";
                    break;
                case 2:
                    answer = calculate(i, m);
                    cout << answer << " ";
                    break;
            }
        }
        m = m + 1;
        cout << endl;
    }`,
        ),
        hints: [
          'Watch out: `case 0` has NO `break;`! It falls through into `case 1`.',
          '`m % 3` cycles as 0, 1, 2, 0, 1.',
        ],
        explain:
          'Because `case 0` lacks a `break`, whenever `m % 3 == 0` (for m = 0 and m = 3), both case 0 and case 1 execute, printing the value twice per iteration.\n- m = 0: `i = 0` prints `20 20 `, `i = 1` prints `20 20 `\n- m = 1: `i = 0` prints `20 `, `i = 1` prints `22 `\n- m = 2: `i = 0` prints `20 `, `i = 1` prints `24 `\n- m = 3: `i = 0` prints `20 20 `, `i = 1` prints `26 26 `\n- m = 4: `i = 0` prints `20 `, `i = 1` prints `28 `\nOutput:\n`20 20 20 20 `\n`20 22 `\n`20 24 `\n`20 20 26 26 `\n`20 28 `',
      },
    },

    // ------------------------------------------------------------------ Q2: Hollow Palindrome Pyramid
    {
      unit: 6,
      q: {
        id: `${P}-q2`,
        kind: 'task',
        tag: 'exam',
        source: `${T} · Q2`,
        prompt:
          '**Hollow Palindrome Number Pyramid** (10 marks)\n\nWrite a C++ program that prints a hollow palindrome number pyramid for a given positive integer `N`, where `N` represents the number of rows.\n\n**Rules:**\n- Read `N` using `cin`.\n- Do not hard-code the pattern; generate it programmatically with nested loops.\n- The bottom row is solid: numbers descending from `N` down to `1`, then ascending back up to `N`.\n- Upper rows are hollow: they have leading spaces, print the outer row number, then spaces, `1` in the center, spaces, and the outer row number again.\n- (No arrays, strings or STL containers allowed).',
        starter: cpp`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    // write your nested loops here

    return 0;
}
`,
        solution: cpp`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int sp = n - 1; sp >= i; sp--) {
            cout << " ";
        }
        for (int j = i; j >= 1; j--) {
            if (j == i || j == 1 || i == n)
                cout << j;
            else
                cout << " ";
        }
        if (i > 1) {
            for (int k = 2; k <= i; k++) {
                if (k == i || i == n)
                    cout << k;
                else
                    cout << " ";
            }
        }
        cout << endl;
    }
    return 0;
}
`,
        tests: [
          { input: '5\n', label: 'N = 5' },
          { input: '3\n', label: 'N = 3' },
          { input: '7\n', label: 'N = 7' },
        ],
        compare: 'exact',
        steps: [
          'Read `n` from input.',
          'Write an outer loop `for (int i = 1; i <= n; i++)` for each row.',
          'Print `n - i` leading spaces to align the pyramid.',
          'Run a descending loop `for (int j = i; j >= 1; j--)` for the left half: print `j` if `j == i`, `j == 1`, or `i == n` (bottom row); otherwise print space.',
          'For rows `i > 1`, run an ascending loop `for (int k = 2; k <= i; k++)`: print `k` if `k == i` or `i == n`; otherwise print space.',
          'End each row with `cout << endl;`.',
        ],
        hints: [
          'Break each row into: leading spaces, left descending numbers, and right ascending numbers.',
          'A cell is filled if it is the first number (`j == i`), center (`j == 1`), outer right (`k == i`), or the bottom row (`i == n`).',
        ],
        explain:
          'Nested loops handle the pyramid geometry row by row:\n1. `n - i` spaces create the pyramid slope.\n2. Left half prints from `i` down to `1`. Being hollow means printing space unless on the border (`j == i`), center (`j == 1`), or bottom row (`i == n`).\n3. Right half mirrors from `2` up to `i` with identical hollow logic.',
      },
    },

    // ------------------------------------------------------------------ Q3: Matrix Inverse
    {
      unit: 8,
      q: {
        id: `${P}-q3`,
        kind: 'task',
        tag: 'exam',
        source: `${T} · Q3`,
        prompt:
          '**Inverse of a 2x2 Matrix using the Adjoint Method** (10 marks)\n\nWrite a C++ program to compute the inverse of a `2 x 2` matrix.\n\n**Formula:**\nFor matrix $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$:\n- Determinant: $\\det(A) = ad - bc$.\n- Adjoint: $\\text{Adj}(A) = \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$.\n- Inverse: $A^{-1} = \\frac{1}{\\det(A)} \\times \\text{Adj}(A)$.\n\n**Requirements:**\n- Read 4 numbers for the 2x2 matrix.\n- If determinant is 0, display: `Inverse does not exist.` (with a newline).\n- Otherwise, display `Inverse Matrix:` followed by the 2 rows formatted to two decimal places (`fixed << setprecision(2)`).',
        starter: cpp`#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double a[2][2];
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++)
            cin >> a[i][j];

    // compute determinant, check for zero, and print inverse

    return 0;
}
`,
        solution: cpp`#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double arr[2][2];
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++)
            cin >> arr[i][j];

    double det = (arr[0][0] * arr[1][1]) - (arr[0][1] * arr[1][0]);

    if (det == 0) {
        cout << "Inverse does not exist." << endl;
    } else {
        double adj[2][2];
        adj[0][0] = arr[1][1];
        adj[0][1] = -arr[0][1];
        adj[1][0] = -arr[1][0];
        adj[1][1] = arr[0][0];

        cout << "Inverse Matrix:" << endl;
        cout << fixed << setprecision(2);
        for (int i = 0; i < 2; i++) {
            cout << (adj[i][0] / det) << " " << (adj[i][1] / det) << endl;
        }
    }
    return 0;
}
`,
        tests: [
          { input: '4 7 2 6\n', label: 'det != 0' },
          { input: '2 4 1 2\n', label: 'det == 0' },
          { input: '1 2 3 4\n', label: 'negative det' },
        ],
        compare: 'numbers',
        steps: [
          'Read the four values into a 2D array `arr[2][2]`.',
          'Calculate `det = arr[0][0] * arr[1][1] - arr[0][1] * arr[1][0]`.',
          'Check if `det == 0`: print `Inverse does not exist.` and exit.',
          'Form the adjoint: swap main diagonal elements (`adj[0][0] = arr[1][1]`, `adj[1][1] = arr[0][0]`), and negate off-diagonal elements (`-arr[0][1]`, `-arr[1][0]`).',
          'Print `Inverse Matrix:`, set `#include <iomanip>` precision to 2 with `fixed << setprecision(2)`.',
          'Divide each adjoint element by `det` and print in 2 rows.',
        ],
        hints: [
          'Adjoint of [[a, b], [c, d]] is [[d, -b], [-c, a]].',
          'Use `#include <iomanip>` with `fixed` and `setprecision(2)` to match the 2-decimal format.',
        ],
        explain:
          'Determinant `ad - bc` determines if the matrix is invertible. If non-zero, each element of the adjoint is divided by `det` to produce the inverse matrix.',
      },
    },

    // ------------------------------------------------------------------ Q4: Selection Sort
    {
      unit: 8,
      q: {
        id: `${P}-q4-1`,
        kind: 'mcq',
        tag: 'exam',
        source: `${T} · Q4(1)`,
        prompt:
          '**Ancient Temple Problem:**\nA magic wand scans all remaining unsorted blocks from left to right, finds the smallest block, and swaps it with the block at the current starting position. Then it moves one step to the right.\n\nWhich sorting algorithm works **exactly** like this magic wand?',
        options: [
          'Selection Sort',
          'Bubble Sort',
          'Insertion Sort',
          'Merge Sort',
        ],
        answer: 0,
        hints: [
          'Think: it SELECTS the smallest element in each pass and places it at the beginning.',
        ],
        explain:
          '**Selection Sort** repeatedly scans the unsorted portion of the array, selects the smallest element, and swaps it with the first unsorted position.',
      },
    },

    // ------------------------------------------------------------------ Classic Exam Drill: if (cout << 0)
    {
      unit: 5,
      q: {
        id: `${P}-cout-zero-predict`,
        kind: 'predict',
        tag: 'exam',
        source: 'Exam Drill · Stream as Condition',
        prompt:
          'State the output of the following code. (A classic university exam question on stream boolean conversion!)',
        code: prog(cpp`
    if (cout << 0)
        cout << "A";
    else
        cout << "B";`),
        hints: [
          '`cout << 0` prints `0` immediately to the output screen.',
          'What boolean value does an output stream evaluate to in an `if (...)` statement? A stream that is working normally evaluates to true!',
        ],
        explain:
          '1. In C++, evaluating an expression inside `if (...)` runs the expression.\n2. `cout << 0` outputs the character `0` to the console.\n3. The result of `cout << 0` is the `cout` stream itself (`ostream&`).\n4. In a boolean condition, `cout` converts to `bool`, testing if the stream is in a good state (not failed). Since printing succeeded, the stream is good, so the condition evaluates to **true**!\n5. Because the condition is true, the `if` body executes and prints `A`.\nCombined output: **`0A`**.',
      },
    },

    // ------------------------------------------------------------------ Classic Exam Drill: count zeros
    {
      unit: 6,
      q: {
        id: `${P}-cout-zero-while-count`,
        kind: 'count',
        tag: 'exam',
        source: 'Exam Drill · Stream in Loop Condition',
        count: { text: '0' },
        unit: 'zeros',
        prompt:
          'How many times does the digit `0` appear in the output of this program?',
        code: prog(cpp`
    int i = 0;
    while (cout << 0 && i++ < 3) {
        cout << "*";
    }`),
        hints: [
          'The `while` condition runs on EVERY iteration, including the final check that terminates the loop!',
          'In `cout << 0 && i++ < 3`, `cout << 0` is on the left of `&&`, so it ALWAYS prints before the right side is checked.',
        ],
        explain:
          'Let us trace each condition check:\n- Check 1: `cout << 0` prints `0`. Then `0 < 3` is true (`i` becomes 1). Body prints `*`. Output: `0*`\n- Check 2: `cout << 0` prints `0`. Then `1 < 3` is true (`i` becomes 2). Body prints `*`. Output: `0*0*`\n- Check 3: `cout << 0` prints `0`. Then `2 < 3` is true (`i` becomes 3). Body prints `*`. Output: `0*0*0*`\n- Check 4: `cout << 0` prints `0`. Then `3 < 3` is **false** (`i` becomes 4). Loop ends!\nTotal printed: `0*0*0*0`.\nThe digit `0` appears **4** times.',
      },
    },

    // ------------------------------------------------------------------ Classic Exam Drill: short-circuit count
    {
      unit: 4,
      q: {
        id: `${P}-cout-zero-shortcircuit`,
        kind: 'count',
        tag: 'exam',
        source: 'Exam Drill · Stream Short-Circuit Trap',
        count: { text: '0' },
        unit: 'zeros',
        prompt:
          'How many times does the digit `0` appear in the output? Watch carefully for short-circuit evaluation in `&&` and `||`!',
        code: prog(cpp`
    int a = 0, b = 1;
    if (a != 0 && (cout << 0)) cout << "!";
    if (a == 0 || (cout << 0)) cout << "!";
    if (b == 0 || (cout << 0)) cout << "!";
    if (b == 1 && (cout << 0)) cout << "!";`),
        hints: [
          'In `false && expr`, `expr` is SKIPPED (short-circuit).',
          'In `true || expr`, `expr` is SKIPPED (short-circuit).',
        ],
        explain:
          'Line 6: `a != 0` is `0 != 0` (false) → `&&` skips `cout << 0`. Nothing printed.\nLine 7: `a == 0` is `0 == 0` (true) → `||` skips `cout << 0`. Body prints `!`.\nLine 8: `b == 0` is `1 == 0` (false) → `||` MUST evaluate `cout << 0`: prints `0` and is true. Body prints `!`.\nLine 9: `b == 1` is `1 == 1` (true) → `&&` MUST evaluate `cout << 0`: prints `0` and is true. Body prints `!`.\nTotal output: `!0!0!`.\nThe digit `0` appears **2** times.',
      },
    },
  ],
};
