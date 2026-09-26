import type { PaperSet } from '../types';
import { cpp, prog, progF } from '../helpers';

// PF Sessional-II · Fall 2020 — Question 1 (A)–(G): "Write the output of the given C++ code segments.
// There are no syntax errors." Every code contains #include <iostream> and using namespace std.
const T = 'PF Sessional-II · Fall 2020';
const P = 'pf-s2-fall20';
const ASK = 'What would be the output produced by executing the following C++ code? (There are no syntax errors.)';

export const paper: PaperSet = {
  id: P,
  title: T,
  year: 2020,
  questions: [
    {
      unit: 7,
      q: {
        id: `${P}-q1-a`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(A)`,
        prompt: ASK,
        code: progF(
          cpp`
float Mystery(int y, int x) {
    return (y + x + 7.0 / 2);
}`,
          cpp`
    float i = 9.5;
    int j = 4;
    cout << Mystery(i, j) << endl;`,
        ),
        hints: ['Look at the TYPE of the parameters. What happens to `9.5` when it is copied into an `int y`?', '`7.0 / 2` has a double in it, so it is NOT integer division.'],
        explain:
          'Line 11: `Mystery(i, j)` is called. The parameters are `int`, so the values are **converted** while they are copied: `y = 9` (the `.5` of `9.5` is cut off) and `x = 4`.\nLine 5: `7.0 / 2` is a double division = `3.5`. So `y + x + 3.5` = 9 + 4 + 3.5 = `16.5`.\nThe return type is `float`, and 16.5 fits exactly, so `cout` prints `16.5` and then a newline.\nOutput: **`16.5`**',
      },
    },
    {
      unit: 6,
      q: {
        id: `${P}-q1-b`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(B)`,
        prompt: ASK,
        code: prog(cpp`
    int i = 65;
    for (char ch = i; ch <= 70; ++ch)
        cout << ch << " ";`),
        hints: ['`char ch = 65` stores the character with ASCII code 65. Which letter is that?', 'A `char` is printed by `cout` as a letter, not as a number.'],
        explain:
          'Line 6: `ch` starts as the char with code 65, which is `A`. The loop runs while `ch <= 70` — codes 65, 66, 67, 68, 69, 70 = `A B C D E F` (6 times).\nEach time `cout << ch` prints the **letter** (because `ch` is a `char`), followed by a space.\nWhen `ch` becomes 71 (`G`), `71 <= 70` is false and the loop stops.\nOutput: **`A B C D E F `** (there is a space after F).\n(The paper\'s answer key wrote `ABCDEF`, but the code prints a space after every letter.)',
      },
    },
    {
      unit: 7,
      q: {
        id: `${P}-q1-c`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(C)`,
        prompt: ASK,
        code: progF(
          cpp`
int fun(int x) {
    return x % 3 + 1;
}`,
          cpp`
    int b = 5;
    int y = 2 + fun(3 * b + 1);
    int z = fun(fun(y));
    cout << y << "-" << z;`,
        ),
        hints: ['First work out the argument `3 * b + 1`, then `fun` of it.', 'For `fun(fun(y))` do the inner call first.'],
        explain:
          'Line 10: the argument is `3 * 5 + 1 = 16`. `fun(16)` = 16 % 3 + 1 = 1 + 1 = `2`. So `y = 2 + 2 = 4`.\nLine 11: inner call `fun(4)` = 4 % 3 + 1 = `2`. Outer call `fun(2)` = 2 % 3 + 1 = `3`. So `z = 3`.\nLine 12 prints y, a dash, and z (no newline).\nOutput: **`4-3`**',
      },
    },
    {
      unit: 7,
      q: {
        id: `${P}-q1-d`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(D)`,
        prompt: ASK,
        code: progF(
          cpp`
void PRINT(int i, int limit)
{
    do
    {
        if (i++ < limit)
        {
            cout << "MID" << i;
            continue;
        }
    } while (i == limit);
}`,
          cpp`
    int i = 1;
    PRINT(i, 3);`,
        ),
        hints: ['`i++ < limit` compares the OLD value of i, then adds 1.', 'In a do-while, `continue` jumps to the `while (...)` check — it does NOT skip it.'],
        explain:
          'Line 18: `PRINT(1, 3)` → inside the function `i = 1`, `limit = 3`.\nThe do-while body always runs once. Line 8: `i++ < limit` compares **1** < 3 → true, and then i becomes `2`.\nLine 10 prints `MID` and the new i → `MID2`.\nLine 11: `continue` jumps to the loop condition on line 13: `i == limit` → `2 == 3` is false, so the loop ends and the function returns.\nOutput: **`MID2`**',
      },
    },
    {
      unit: 6,
      q: {
        id: `${P}-q1-e`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(E)`,
        prompt: ASK,
        code: prog(cpp`
    int x, y = 4;
    for (x = 2; x < y; x++)
        y = y - 1 % x;
    cout << y << "-";
    x = 4;
    do {
        cout << --x << "-";
        x *= 2;
    } while (x <= 10);`),
        hints: ['`%` is done before `-`: `y - 1 % x` means `y - (1 % x)`.', 'The `for` has no braces, so only line 7 is inside it. Line 8 runs once, after the loop.'],
        explain:
          'The for loop (line 6–7): x = 2: `2 < 4` true → `y = 4 - (1 % 2) = 4 - 1 = 3`. x becomes 3: `3 < 3` false → loop ends.\nLine 8 (after the loop) prints `3-`.\nThe do-while: x = 4.\n• `--x` → x = 3, print `3-`; x = 6. `6 <= 10` true.\n• `--x` → x = 5, print `5-`; x = 10. `10 <= 10` true.\n• `--x` → x = 9, print `9-`; x = 18. `18 <= 10` false → stop.\nOutput: **`3-3-5-9-`**',
      },
    },
    {
      unit: 6,
      q: {
        id: `${P}-q1-f`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(F)`,
        prompt: ASK,
        code: prog(cpp`
    int i, j, sum = 10;
    for (i = 0; i < 5; i++)
        if (i % 2)
            for (j = 0; j <= 3; sum += j, j++);
        else
            for (j = 3; j > 0; sum += j, j--);
    cout << sum;`),
        hints: ['Both inner loops end with `;` — they have an EMPTY body. All the work is in the update part `sum += j, j++`.', 'Odd i adds 0+1+2+3, even i adds 3+2+1. How many odd and even values does i take?'],
        explain:
          'The inner loops have an empty body (`;`). The update part uses the comma operator: first `sum += j`, then change j.\n• Odd i (`i % 2` is 1): j = 0, 1, 2, 3 → adds 0 + 1 + 2 + 3 = `6`.\n• Even i: j = 3, 2, 1 → adds 3 + 2 + 1 = `6`.\ni takes 0, 1, 2, 3, 4 — five values, and every one adds 6.\nsum = 10 + 5 × 6 = `40`. Line 11 runs once, after the outer loop.\nOutput: **`40`**',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q1-g`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(G)`,
        prompt: ASK,
        code: prog(cpp`
    int y = 0;
    switch (y) {
        case 0: y = y + 11;
        case 1: y = y / 2;
        case 2: y = y * 5;
        case 3: y = y + 1;
        default: y = y % 3;
    }
    cout << y << endl;`),
        hints: ['There is no `break` anywhere. After jumping to `case 0`, what happens next?', 'Keep the new value of y after every line: 11, then …'],
        explain:
          'y is 0, so the switch jumps to `case 0`. There are **no `break`s**, so it falls through every case below it:\n• case 0: y = 0 + 11 = `11`\n• case 1: y = 11 / 2 = `5` (integer division)\n• case 2: y = 5 * 5 = `25`\n• case 3: y = 25 + 1 = `26`\n• default: y = 26 % 3 = `2`\nOutput: **`2`**',
      },
    },
  ],
};
