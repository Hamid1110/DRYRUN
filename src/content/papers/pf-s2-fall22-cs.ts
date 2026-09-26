import type { PaperSet } from '../types';
import { cpp, prog, progF } from '../helpers';

// PF Sessional-II (BS-CS), FAST-NUCES Islamabad, Fall 2022 (17 November 2022).
// Q1: array dry runs · Q2: output of programs · Q3: choose the statement that completes the code.
const T = 'PF Sessional-II (BS-CS) · Fall 2022';
const S = (part: string) => `${T} · ${part}`;
const ASK = 'Write the output of the program. In case of no output, write **NO Output** with the reason.';

// Q1.1 — the Collatz-length program from the paper (line 11 is the if, line 17 stores B[i])
const collatz = (extra: string, after = '') => prog(cpp`
    const int N = 3;
    int A[N] = {3, 2, 1};
    int B[N] = {0};
    for (int i = 0; i < N; ++i)
    {
        int length = 1;
        while (A[i] != 1) {
            if (A[i] % 2)
                A[i] = A[i] * 3 + 1;
            else
                A[i] /= 2;
            ++length;
        }
        B[i] = length;${extra}
    }${after}`);

// Q1.2 — the paper uses `static int i = 0;` inside get(). DryRun does not run `static` locals,
// so the counter is a global variable with the same behaviour (it keeps its value between calls).
const reverseTop = cpp`
int counter = 0;   // paper: static int i = 0; inside get()

int get(int N)
{
    return N - (counter++) - 1;
}`;
const reverseBody = (inLoop: string, after: string) => cpp`
    int SIZE = 10;
    int arr[] = {5, 6, 7, 8, 9, 10, 11, 12, 13, 14};
    int j;
    for (int i = 0; i < SIZE; i++)
    {
        j = get(SIZE);
        if (j == i)
            continue;
        arr[i] += arr[j];
        arr[j] = arr[i] - arr[j];
        arr[i] -= arr[j];${inLoop}
    }${after}`;
const printArr = (indent: string) =>
  `\n${indent}for (int k = 0; k < SIZE; k++)\n${indent}    cout << arr[k] << " ";\n${indent}cout << endl;`;

export const paper: PaperSet = {
  id: 'pf-s2-fall22-cs',
  title: T,
  year: 2022,
  questions: [
    // ------------------------------------------------------------------ Question 1.1
    {
      unit: 8,
      q: {
        id: 'pf-s2-fall22-cs-q1-1-a', kind: 'predict', tag: 'exam', source: S('Q1.1(a)'),
        prompt: 'What are the contents of array `B` when the **1st** iteration of the `for` loop terminates? (We added one `cout` that prints `B` only at the end of the 1st iteration, `i == 0`.)',
        code: collatz('\n' + cpp`
        if (i == 0)
            cout << B[0] << " " << B[1] << " " << B[2] << endl;`),
        hints: ['`B[N] = {0}` sets ALL three boxes to 0. Only `B[0]` is written in the first iteration.', 'Follow A[0] = 3: odd → 3*3+1, even → halve, until it is 1. `length` starts at 1 and grows once per change.'],
        explain: '`B = {0, 0, 0}` at the start (the `{0}` fills the rest with zeros).\nIteration 1 (i = 0), A[0] = 3, length = 1:\n3 is odd → 10 (length 2) → 5 (3) → 16 (4) → 8 (5) → 4 (6) → 2 (7) → 1 (8). Now `A[0] == 1`, the while stops.\n`B[0] = 8`. B[1] and B[2] are still 0.\nOutput: **`8 0 0`**',
      },
    },
    {
      unit: 8,
      q: {
        id: 'pf-s2-fall22-cs-q1-1-b', kind: 'mcq', tag: 'exam', source: S('Q1.1(b)'),
        prompt: 'What are the contents of array `B` (B[0], B[1], B[2]) when the **2nd** iteration of the `for` loop terminates?',
        code: collatz(''),
        options: ['`8 2 0`', '`8 1 0`', '`8 2 1`', '`7 1 0`'],
        answer: 0,
        hints: ['B[0] was already found in part (a).', 'A[1] = 2 needs only ONE change to reach 1. How much does `length` grow?'],
        explain: 'After iteration 1: B = {8, 0, 0} (3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 is 7 changes, so length = 1 + 7 = 8).\nIteration 2 (i = 1): A[1] = 2, length = 1. 2 is even → 1, `++length` → 2. Now A[1] is 1, the while stops. `B[1] = 2`.\nB[2] has not been touched yet, it is still 0.\nAnswer: **`8 2 0`**',
      },
    },
    {
      unit: 8,
      q: {
        id: 'pf-s2-fall22-cs-q1-1-c', kind: 'predict', tag: 'exam', source: S('Q1.1(c)'),
        prompt: 'What are the contents of array `B` when the **3rd** (last) iteration of the `for` loop terminates? (We added a `cout` after the loop that prints `B`.)',
        code: collatz('', '\n    cout << B[0] << " " << B[1] << " " << B[2] << endl;'),
        hints: ['A[2] is already 1, so the while condition is false at once.', 'When the while loop body never runs, `length` keeps its first value.'],
        explain: 'Iteration 1: A[0] = 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1, length = 8 → `B[0] = 8`.\nIteration 2: A[1] = 2 → 1, length = 2 → `B[1] = 2`.\nIteration 3: A[2] = 1, so `A[2] != 1` is false immediately; the while body runs 0 times and length stays 1 → `B[2] = 1`.\nThen `++i` makes i = 3, `3 < 3` is false and the loop ends.\nOutput: **`8 2 1`** (each value is the number of terms in the 3n+1 sequence of 3, 2 and 1).',
      },
    },
    // ------------------------------------------------------------------ Question 1.2
    {
      unit: 8,
      q: {
        id: 'pf-s2-fall22-cs-q1-2-a', kind: 'predict', tag: 'exam', source: S('Q1.2(a)'),
        prompt: 'What are the contents of the array after the **2nd** iteration of the `for` loop? (We added a `cout` that prints the array only at the end of the 2nd iteration, `i == 1`. The paper wrote `static int i = 0;` inside `get()`; here it is a global `counter` — it works the same way: it is NOT reset between calls.)',
        code: progF(reverseTop, reverseBody(`\n        if (i == 1) {${printArr('            ')}\n        }`, '')),
        hints: ['`get(10)` returns 9, then 8, then 7 … because the counter grows by 1 on every call.', 'The three lines `a += b; b = a - b; a -= b;` swap `arr[i]` and `arr[j]` without a temporary variable.'],
        explain: 'The counter starts at 0 and goes up by one on each call, so `get(SIZE)` returns 10 − 0 − 1 = 9, then 8, 7, 6 …\nThe three lines swap two boxes: `arr[i] += arr[j]` (sum), `arr[j] = sum − arr[j]` (old arr[i]), `arr[i] -= arr[j]` (old arr[j]).\ni = 0, j = 9: swap 5 and 14 → `14 6 7 8 9 10 11 12 13 5`.\ni = 1, j = 8: swap 6 and 13 → `14 13 7 8 9 10 11 12 6 5`.\nOutput: **`14 13 7 8 9 10 11 12 6 5 `** (a space after each number).',
      },
    },
    {
      unit: 8,
      q: {
        id: 'pf-s2-fall22-cs-q1-2-b', kind: 'predict', tag: 'exam', source: S('Q1.2(b)'),
        prompt: 'What are the contents of the array after the `for` loop terminates? (We print the array after the loop. `static int i` of the paper is the global `counter` here.)',
        code: progF(reverseTop, reverseBody('', printArr('    '))),
        hints: ['Is `j == i` ever true? `j = 9 - i`, so it needs 9 = 2i.', 'The loop goes all the way to i = 9. What happens to a pair that is swapped twice?'],
        explain: '`j` takes the values 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 for i = 0 … 9, so `j == i` is never true (9 − i = i has no whole solution) and `continue` never runs.\ni = 0 … 4 swap the pairs (0,9) (1,8) (2,7) (3,6) (4,5): the array is reversed: `14 13 12 11 10 9 8 7 6 5`.\ni = 5 … 9 swap the pairs (5,4) (6,3) (7,2) (8,1) (9,0) — the SAME pairs again — so every swap is undone.\nThe array is back to the original.\nOutput: **`5 6 7 8 9 10 11 12 13 14 `**\n(To really reverse, the loop should stop at `SIZE / 2`.)',
      },
    },
    // ------------------------------------------------------------------ Question 2
    {
      unit: 8,
      q: {
        id: 'pf-s2-fall22-cs-q2-i', kind: 'predict', tag: 'exam', source: S('Q2(i)'),
        prompt: ASK,
        code: cpp`
#include <iostream>
using namespace std;

int list[5] = {2, 4, 8, 10, -1};
int nextList[5] = {3, -1, 0, 1, -1};
int start = 2;
int Free = 4;
void magic(int val, int position) {
    int start = ::start;
    for (int i = 0; i < position - 1; i++)
        start = nextList[start];
    list[Free] = val; nextList[Free] = nextList[start];
    nextList[start] = Free++;
}
void magic() {
    int start = ::start;
    while (start != -1) {
        cout << list[start] << "->";
        start = nextList[start];
    }
    cout << "*" << endl;
}
int main()
{
    magic();
    magic(5, 2);
    magic();
    return 0;
}
`,
        hints: ['`::start` means the GLOBAL start (2). `nextList[k]` tells which index comes after index k; -1 means the end.', '`magic(5, 2)` walks `position - 1 = 1` step, then links the new box (index 4) right after it.'],
        explain: 'The two arrays form a chain: start at index 2, then follow `nextList`.\n`magic()`: index 2 → list[2] = 8, next 0 → list[0] = 2, next 3 → list[3] = 10, next 1 → list[1] = 4, next −1 → stop. Line 1: `8->2->10->4->*`.\n`magic(5, 2)`: local start = 2; the for loop runs once: start = nextList[2] = 0. Then list[4] = 5, nextList[4] = nextList[0] = 3, nextList[0] = 4 (and Free becomes 5). So index 0 now points to the new box 4, and box 4 points to 3.\n`magic()`: 2 → 0 → 4 → 3 → 1: `8->2->5->10->4->*`.\nOutput:\n`8->2->10->4->*`\n`8->2->5->10->4->*`',
      },
    },
    {
      unit: 7,
      q: {
        id: 'pf-s2-fall22-cs-q2-ii', kind: 'predict', tag: 'exam', source: S('Q2(ii)'),
        prompt: ASK,
        code: progF(cpp`
float calc(int y, int x) {
    return (y + x + 7.0 / 2);
}`, cpp`
    float i = 9.5;
    int j = 4.5;
    cout << calc(i, j) << endl;`),
        hints: ['`int j = 4.5;` keeps only the whole part.', 'The parameters are `int`, so 9.5 is cut when it is passed. `7.0 / 2` is a double division.'],
        explain: '`int j = 4.5;` compiles (a double is converted to int) and stores **4**.\n`calc(i, j)`: both parameters are `int`, so y = 9 (9.5 is truncated) and x = 4.\n`7.0 / 2` = 3.5 (a double, because 7.0 is a double). y + x + 3.5 = 16.5, returned as a float.\nOutput: **`16.5`**',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-cs-q2-iii', kind: 'mcq', tag: 'exam', source: S('Q2(iii)'),
        prompt: 'Write the output of this code (it is inside `main`). In case of no output, write NO Output with the reason.',
        code: cpp`
float x = 10;
while (x < 100) {
    int x = 20;
    x *= 5;
    x -= 10;
}
cout << x << endl;
`,
        options: ['`90`', '`100`', 'No output: infinite loop — the loop changes a new inner `x`, the outer `x` stays 10', 'Compile error: `x` is declared twice'],
        answer: 2,
        hints: ['`int x = 20;` inside the braces creates a NEW variable that hides the outer `x`.', 'Which `x` does the condition `x < 100` read?'],
        explain: 'Declaring `int x` inside the loop body is legal: it is a new variable in an inner block (it *shadows* the outer float x).\nEvery iteration: inner x = 20 → 100 → 90, then the inner x is destroyed at `}`.\nThe condition `x < 100` is outside that block, so it reads the OUTER x, which is always 10. `10 < 100` is always true → **infinite loop**; `cout << x` is never reached.\nAnswer: **NO Output (infinite loop)**. (DryRun cannot run this program because it never ends.)',
      },
    },
    {
      unit: 9,
      q: {
        id: 'pf-s2-fall22-cs-q2-iv', kind: 'predict', tag: 'exam', source: S('Q2(iv)'),
        prompt: ASK,
        code: prog(cpp`
    char text[] = "Hello WorlD";
    int i = 0;
    while (text[i] != '\0')
    {
        if (text[i] == 'W' || text[i] == 'H' || text[i] == 'D')
            text[i] = '#';
        else if (text[i] >= 'a' && text[i] <= 'z')
            text[i] -= 32;
        else if (i % 2 == 0)
            text[i] = text[i] - 1;
        else
            text[i] = '&';
        i++;
    }
    cout << text << endl;`),
        hints: ['`W`, `H` and `D` become `#`. A small letter minus 32 is the same capital letter.', 'Only the space (index 5) reaches the last two branches. Is 5 even?'],
        explain: 'Go through each index:\n0 `H` → `#`; 1 `e` → `E`; 2 `l` → `L`; 3 `l` → `L`; 4 `o` → `O`;\n5 space: not W/H/D, not small; i = 5 is odd → `&`;\n6 `W` → `#`; 7 `o` → `O`; 8 `r` → `R`; 9 `l` → `L`; 10 `D` → `#`.\nThe loop stops at `\\0`.\nOutput: **`#ELLO&#ORL#`**',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-cs-q2-v', kind: 'predict', tag: 'exam', source: S('Q2(v)'),
        prompt: ASK,
        code: prog(cpp`
    int MAX = 70;
    for (char ch = 65; ch <= MAX; ++ch) {
        int i = 'A';
        while (true)
        {
            if (i++ % 2 == 0)
                continue;
            if (i > ch)
                break;
            cout << ch << " ";
        }
        cout << endl;
    }`),
        hints: ['ch goes from 65 (`A`) to 70 (`F`). `i++ % 2` tests the OLD i, then i grows.', 'Only when the old i was odd do we reach `if (i > ch)`. At that moment i is even: 66, 68, 70 …'],
        explain: 'Inside the while loop, the check `i > ch` is only reached when the OLD i was odd, so at that point i is 66, 68, 70, … One character is printed for each of these values that is `<= ch`.\nch = `A` (65): 66 > 65 → break at once → empty line.\nch = `B` (66): 66 ≤ 66 → print; 68 > 66 → break → `B `.\nch = `C` (67): 66 → print; 68 → break → `C `.\nch = `D` (68): 66, 68 → print twice; 70 → break → `D D `.\nch = `E` (69): 66, 68 → `E E `.\nch = `F` (70): 66, 68, 70 → `F F F `.\nOutput (the first line is EMPTY, each letter is followed by a space):\n(empty line)\n`B `\n`C `\n`D D `\n`E E `\n`F F F `',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-cs-q2-vi', kind: 'predict', tag: 'exam', source: S('Q2(vi)'),
        prompt: ASK,
        code: prog(cpp`
    int x, y = 4;
    for (x = 2; x < y; x += 2)
        y = y + 1 % x;
    cout << y << endl;
    x = y;
    do {
        cout << --x << endl;
        x *= 4;
    } while (x <= 10);`),
        hints: ['`%` is done before `+`: `y + 1 % x` means `y + (1 % x)`. With x = 2 or 4, `1 % x` is 1.', 'A do-while runs its body at least once, and `--x` changes x before printing.'],
        explain: 'Only y is initialised, but x is set by the for loop before it is used.\nx = 2: 2 < 4 → y = 4 + (1 % 2) = 5. x = 4: 4 < 5 → y = 5 + (1 % 4) = 6. x = 6: 6 < 6 is false → stop.\nPrint `6`.\nx = 6. do-while: `--x` → 5, print `5`; x = 20. `20 <= 10` is false → stop.\nOutput:\n`6`\n`5`',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-cs-q2-vii', kind: 'predict', tag: 'exam', source: S('Q2(vii)'),
        prompt: ASK,
        code: prog(cpp`
    int i, j, sum = 10;
    for (i = 0; i < 5; i++)
        if (i % 2)
            for (j = 0; j <= 3; sum += j++);
        else
            for (j = 3; j > 0; sum += --j);
        cout << sum;`),
        hints: ['Both inner `for` loops have an empty body `;` — all the work is in the update part.', '`cout << sum;` is NOT inside the outer loop (only the if/else is). It runs once.'],
        explain: 'Even i (0, 2, 4): j = 3; `sum += --j` adds 2, then 1, then 0 (j becomes 0 and `j > 0` fails) → +3 each time.\nOdd i (1, 3): j = 0 … 3; `sum += j++` adds 0 + 1 + 2 + 3 → +6 each time.\nsum = 10 + 3 + 6 + 3 + 6 + 3 = 31.\nThe indentation is misleading: the outer `for` owns only the if/else, so `cout << sum;` runs once after the loop.\nOutput: **`31`**',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-s2-fall22-cs-q2-viii', kind: 'predict', tag: 'exam', source: S('Q2(viii)'),
        prompt: ASK,
        code: prog(cpp`
    int r = 5, x = 0;
    while (x < r) {
        int y = 1;
        while (y < r - x) {
            cout << " ";
            y++;
        }
        int z = 0, n = 1;
        while (z <= x) {
            n = z == 0 || x == 0 ? 1 : n * (x - z + 1) / z;
            char ch = n == 1 ? 'X' : n % 3 == 0 ? 'Y' : 'V';
            cout << ch << ' ';
            z++;
        }
        cout << '\n';
        x++;
    }`),
        hints: ['Row x starts with `r - x - 1` spaces. Then n runs through Pascal\'s triangle row x: 1, x, …', 'n = 1 → `X`, n divisible by 3 → `Y`, anything else → `V`.'],
        explain: 'Row x prints 4 − x spaces, then the numbers of row x of Pascal\'s triangle (`n * (x - z + 1) / z` builds C(x, z)), each as a letter followed by a space.\nx = 0: 1 → `    X `\nx = 1: 1 1 → `   X X `\nx = 2: 1 2 1 → `  X V X `\nx = 3: 1 3 3 1 → ` X Y Y X `\nx = 4: 1 4 6 4 1 → `X V Y V X `\nOutput (4, 3, 2, 1, 0 leading spaces; a space after every letter):\n`    X `\n`   X X `\n`  X V X `\n` X Y Y X `\n`X V Y V X `',
      },
    },
    // ------------------------------------------------------------------ Question 3
    {
      unit: 7,
      q: {
        id: 'pf-s2-fall22-cs-q3-a', kind: 'mcq', tag: 'exam', source: S('Q3(a)'),
        prompt: 'Log base 2 (binary logarithm) is the inverse of the power of two: if n = 2^x then log₂ n = x. The function below finds log base 2 of a 32-bit integer. Which statement completes `while ( ______ )`?',
        code: cpp`
int log2(int x)
{
    int res = 0;
    while ( ______ )
        res++;
    return res;
}
`,
        options: ['`x >>= 2`', '`x >>= 1`', '`x <<= 2`', '`x <<= 1`', '`x ~= 2`', 'None of the above'],
        answer: 1,
        hints: ['Shifting right by 1 is the same as dividing by 2 (for positive numbers).', 'Count how many times you can halve x before it becomes 0.'],
        explain: '`x >>= 1` shifts x one bit to the right (x = x / 2) and the loop continues while the new x is not 0.\nFor x = 32: 16, 8, 4, 2, 1 are non-zero (5 times `res++`), then 0 stops the loop → returns **5** = log₂ 32.\n`x >>= 2` divides by 4 (wrong count), `<<=` makes x bigger (it never reaches 0 in a sensible way), and `~=` is not a C++ operator.\nAnswer: **(b) `x >>= 1`**',
      },
    },
    {
      unit: 7,
      q: {
        id: 'pf-s2-fall22-cs-q3-b', kind: 'mcq', tag: 'exam', source: S('Q3(b)'),
        prompt: 'The function below checks if a given integer is a power of 2. Which expression completes `return ______;`?',
        code: cpp`
bool isPowerof2(int x)
{
    return ______;
}
`,
        options: ['`(x && !(x && x-1))`', '`(x || !(x || x-1))`', '`(x & !(x & x-1))`', '`(x | !(x && x-1))`', '`(x && !(x & x-1))`', 'None of the above'],
        answer: 4,
        hints: ['A power of 2 has exactly ONE bit set: 8 = 1000, 7 = 0111.', '`x & (x-1)` removes the lowest 1-bit. `-` is done before `&`.'],
        explain: 'A power of two has exactly one 1-bit. `x - 1` flips that bit and turns all lower bits on, so `x & (x-1)` is 0 **only** for powers of two (and for 0).\n`!(x & x-1)` is true when that result is 0. `x &&` removes the case x = 0.\nExample: x = 8 → 8 & 7 = 1000 & 0111 = 0 → `!0` = true → true. x = 6 → 6 & 5 = 110 & 101 = 100 ≠ 0 → false.\nThe other options use `&&` / `||` (logical, not bitwise) or `&` / `|` with a bool, which do not test the bits.\nAnswer: **(e) `(x && !(x & x-1))`**',
      },
    },
    {
      unit: 8,
      q: {
        id: 'pf-s2-fall22-cs-q3-c', kind: 'blanks', tag: 'exam', source: S('Q3(c)'),
        prompt: 'Given an array `arr[]` of size N with the numbers 1 … N+1 and one number missing (no duplicates), find the missing number. Example: `{1, 2, 4, 6, 3, 7, 8}` → `5`.\nComplete the statement. Options in the paper: (a) `arr[temp[i] - 1] = 1;` (b) `arr[temp[i] + 1] = 1;` (c) `temp[arr[i] - 1] = 1;` (d) `temp[arr[i] + 1] = 1;` (e) None of the above.',
        code: prog(cpp`
    int arr[] = { 1, 10, 3, 7, 5, 6, 9, 2, 8 };
    const int N = sizeof(arr) / sizeof(arr[0]);

    int i;
    int temp[N + 1];
    for (int i = 0; i <= N; i++) {
        temp[i] = 0;
    }

    for (i = 0; i < N; i++) {
        [[1]];
    }

    int ans;
    for (i = 0; i <= N; i++) {
        if (temp[i] == 0)
            ans = i + 1;
    }

    cout << ans << endl;`),
        blanks: [{ answers: ['temp[arr[i] - 1] = 1', 'temp[arr[i]-1] = 1', 'temp[arr[i]-1]=1', 'temp[arr[i] - 1]=1'], hint: 'Mark the box that belongs to the number `arr[i]`.' }],
        chips: ['temp', 'arr', '[', ']', 'i', '- 1', '+ 1', '= 1'],
        hints: ['`temp[k]` should become 1 when the number k + 1 is present.', 'Number v lives in box v − 1 (numbers start at 1, indexes at 0).'],
        explain: 'N = 9 (the array has 9 numbers from 1 … 10), `temp` has 10 boxes, all 0.\n`temp[arr[i] - 1] = 1` marks "number arr[i] is present": 1 → temp[0], 10 → temp[9], 3 → temp[2] …\nThe number 4 is missing, so temp[3] stays 0 and the last loop sets `ans = 3 + 1 = 4`.\nOutput: **`4`** — answer **(c)**.\nOptions (a)/(b) write into `arr`, and (d) is off by two and would even write past the end for 10.\nNote: the paper also had the line `N &= N;` after `temp`. It is left out here: N is `const`, so that line does not compile ("assignment of read-only variable"), and `N & N` is just N anyway.',
      },
    },
  ],
};
