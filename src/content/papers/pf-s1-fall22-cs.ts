import type { PaperSet } from '../types';
import { cpp, prog } from '../helpers';

// PF Sessional-I (BS-CS) · Fall 2022 — FAST Islamabad, 26 Sep 2022.
// Q1 expressions / logical expressions / bit flip, Q2 complete the code, Q3 outputs, Q4 find the errors.
const T = 'PF Sessional-I (BS-CS) · Fall 2022';
const P = 'pf-s1-fall22-cs';
const EXPR = 'Q1(a) — What is the **value** of this expression? The program prints it.';
const OUT3 = 'Write the output of the following program. (The paper says there is no syntax or logical error.)';
const ERR4 = 'Identify the errors in the following program, correct them and write the corrected output. What happens when you compile it exactly as written?';
const LOGIC_CHIPS = ['&&', '||', '!', '%', '==', '!=', '>=', '<=', '(', ')'];

export const paper: PaperSet = {
  id: P,
  title: T,
  year: 2022,
  questions: [
    // ---------- Q1(a): value of each expression ----------
    {
      unit: 4,
      q: {
        id: `${P}-q1-a-i`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(a)(i)`,
        prompt: EXPR,
        code: prog(cpp`
    cout << 3 * 5 / 4 * 3 * 2 % 4 + !5 * static_cast<double>(3) / 12 << endl;`),
        hints: ['`*`, `/` and `%` have the same precedence and go left to right. `!` is done before all of them.', '`!5` is `0` (false), so the whole right part is 0.'],
        explain:
          'Left part, strictly left to right (all integers):\n`3 * 5 = 15` → `15 / 4 = 3` → `3 * 3 = 9` → `9 * 2 = 18` → `18 % 4 = 2`.\nRight part: `!5` is `0` (any non-zero number is true, so NOT is false = 0). `0 * 3.0 / 12 = 0.0`.\n`2 + 0.0 = 2.0` — a double, but `cout` prints a whole double without `.0`.\nOutput: **`2`**',
      },
    },
    {
      unit: 4,
      q: {
        id: `${P}-q1-a-ii`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(a)(ii)`,
        prompt: EXPR,
        code: prog(cpp`
    cout << (3 != 10 || 6 <= 10 * -200) << endl;`),
        hints: ['`||` is true as soon as one side is true.', '`cout` prints `true` as `1`.'],
        explain:
          '`3 != 10` is true, so `||` is already true (the right side, `6 <= -2000`, is not even needed — it would be false).\nA `bool` true is printed by `cout` as `1`.\nOutput: **`1`**',
      },
    },
    {
      unit: 4,
      q: {
        id: `${P}-q1-a-iii`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(a)(iii)`,
        prompt: EXPR,
        code: prog(cpp`
    cout << ('b' > 'Z') << endl;`),
        hints: ['Characters are compared by their ASCII codes.', '`Z` is 90. Lower-case letters start at 97.'],
        explain:
          '`\'b\'` has ASCII code 98 and `\'Z\'` has code 90. `98 > 90` is true. (Every lower-case letter is "bigger" than every capital letter.)\nOutput: **`1`**',
      },
    },
    {
      unit: 4,
      q: {
        id: `${P}-q1-a-iv`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(a)(iv)`,
        prompt: EXPR,
        code: prog(cpp`
    cout << static_cast<char>(11 / 7 * 3 * 2 * 39 % 102 + 55) << endl;`),
        hints: ['Go left to right: `11 / 7` is integer division.', 'You get a number; which letter has that ASCII code? (`A` = 65)'],
        explain:
          'Left to right: `11 / 7 = 1` → `1 * 3 = 3` → `3 * 2 = 6` → `6 * 39 = 234` → `234 % 102 = 30`. Then `30 + 55 = 85`.\n`static_cast<char>(85)` is the character with code 85: A = 65, so 85 is 20 letters after A → `U`.\nOutput: **`U`**',
      },
    },
    {
      unit: 4,
      q: {
        id: `${P}-q1-a-v`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q1(a)(v)`,
        prompt: EXPR,
        code: prog(
          cpp`
    cout << pow(8, 730 % 9) - pow(2, 5 / 2) / 2 << endl;`,
          '#include <cmath>\n',
        ),
        hints: ['`730 % 9`: 9 × 81 = 729.', '`5 / 2` is integer division, and `/` is done before `-`.'],
        explain:
          '`730 % 9 = 1` (because 9 × 81 = 729), so `pow(8, 1) = 8`.\n`5 / 2 = 2`, so `pow(2, 2) = 4`, and `4 / 2 = 2` (division before subtraction).\n`8 - 2 = 6` (a double, printed as `6`).\nOutput: **`6`**',
      },
    },
    // ---------- Q1(b): write logical expressions ----------
    {
      unit: 5,
      q: {
        id: `${P}-q1-b-i`,
        kind: 'blanks',
        tag: 'exam',
        source: `${T} · Q1(b)(i)`,
        prompt: 'Write a logical expression for: **N is any number other than a multiple of 3.** (The program tests your expression on the numbers 1 to 12 and prints the ones for which it is true.)',
        code: prog(cpp`
    for (int N = 1; N <= 12; N++)
        if ([[1]])
            cout << N << " ";`),
        blanks: [{ answers: ['N % 3 != 0', '!(N % 3 == 0)', 'N % 3', '(N % 3 != 0)', 'N % 3 > 0'] }],
        chips: LOGIC_CHIPS,
        hints: ['"Multiple of 3" means the remainder after dividing by 3 is 0.', 'You want the OTHER numbers: remainder NOT equal to 0.'],
        explain:
          'N is a multiple of 3 when `N % 3 == 0`. "Other than" means the opposite: `N % 3 != 0` (or `!(N % 3 == 0)`).\nThe test loop prints the numbers where the expression is true: **`1 2 4 5 7 8 10 11 `**',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q1-b-ii`,
        kind: 'blanks',
        tag: 'exam',
        source: `${T} · Q1(b)(ii)`,
        prompt: 'Write a logical expression for: **N is any lower-case letter other than the vowels (a, e, i, o and u).** The program tests it on the characters in the input and prints those that pass.',
        code: prog(cpp`
    char N;
    while (cin >> N)
        if ([[1]])
            cout << N;`),
        input: 'a b e z i o u k A Z m\n',
        blanks: [
          {
            answers: [
              "N >= 'a' && N <= 'z' && N != 'a' && N != 'e' && N != 'i' && N != 'o' && N != 'u'",
              "(N >= 'a' && N <= 'z') && !(N == 'a' || N == 'e' || N == 'i' || N == 'o' || N == 'u')",
              "N >= 'a' && N <= 'z' && !(N == 'a' || N == 'e' || N == 'i' || N == 'o' || N == 'u')",
            ],
          },
        ],
        chips: [...LOGIC_CHIPS, "'a'", "'z'"],
        hints: ['Two parts joined with `&&`: "is a lower-case letter" AND "is not a vowel".', "Lower-case: `N >= 'a' && N <= 'z'`. Not a vowel: `N != 'a' && N != 'e' && …` (all five must be different)."],
        explain:
          "Lower-case letter: `N >= 'a' && N <= 'z'`.\nNot a vowel: `!(N == 'a' || N == 'e' || N == 'i' || N == 'o' || N == 'u')`, which is the same as `N != 'a' && N != 'e' && N != 'i' && N != 'o' && N != 'u'` (De Morgan: NOT of an OR = AND of the NOTs).\nJoin them with `&&`.\nFrom the input `a b e z i o u k A Z m` it keeps `b`, `z`, `k`, `m` (the capitals `A`, `Z` fail the first part). Output: **`bzkm`**\nCommon mistake: `N != 'a' || N != 'e'` — this is ALWAYS true, because no letter equals both.",
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q1-b-iii`,
        kind: 'blanks',
        tag: 'exam',
        source: `${T} · Q1(b)(iii)`,
        prompt: 'Write a logical expression for: **N lies outside the range [-20, 20] and outside [120, 2020].** The program tests it on the numbers in the input.',
        code: prog(cpp`
    int N;
    while (cin >> N)
        if ([[1]])
            cout << N << " ";`),
        input: '-25 -20 0 20 21 119 120 500 2020 2021\n',
        blanks: [
          {
            answers: [
              '!(N >= -20 && N <= 20) && !(N >= 120 && N <= 2020)',
              '!((N >= -20 && N <= 20) || (N >= 120 && N <= 2020))',
              '(N < -20 || N > 20) && (N < 120 || N > 2020)',
            ],
          },
        ],
        chips: LOGIC_CHIPS,
        hints: ['Inside [-20, 20] is `N >= -20 && N <= 20`. Outside is the NOT of that.', 'N must be outside BOTH ranges, so join the two "outside" parts with `&&`.'],
        explain:
          'Inside [-20, 20]: `N >= -20 && N <= 20`. Outside: `!(N >= -20 && N <= 20)`, or `N < -20 || N > 20`.\nSame for [120, 2020]. N must be outside **both**, so: `(N < -20 || N > 20) && (N < 120 || N > 2020)`.\nThe square brackets mean the end points belong to the range, so -20, 20, 120 and 2020 are inside.\nFrom the input it keeps: **`-25 21 119 2021 `**',
      },
    },
    // ---------- Q1(c): flip one bit ----------
    {
      unit: 4,
      q: {
        id: `${P}-q1-c`,
        kind: 'blanks',
        tag: 'exam',
        source: `${T} · Q1(c)`,
        prompt:
          'Write the missing code: an expression that **reverses (flips) one bit** of the input number `n` at the given bit position (position 1 = the rightmost bit).\nExpected output 01 (input 5, 6): before `5 0000000000000101`, after `37 0000000000100101`.\nExpected output 02 (input 5, 3): after `1 0000000000000001`.\n(The paper printed the bits with `bitset<16>(n)`; DryRun does not have `<bitset>`, so a small loop prints the 16 bits instead.)',
        code: prog(cpp`
    unsigned short int n;
    int bitposition;

    cout << "Enter a number" << endl;
    cin >> n;
    cout << "Enter position of bit you want to reverse" << endl;
    cin >> bitposition;
    cout << "Number & it\'s bit representation before conversion" << endl;
    cout << n << " ";
    for (int b = 15; b >= 0; b--) cout << ((n >> b) & 1);   // like bitset<16>(n)
    cout << endl;

    n = n ^ [[1]];

    cout << "Number & it\'s bit representation after conversion" << endl;
    cout << n << " ";
    for (int b = 15; b >= 0; b--) cout << ((n >> b) & 1);
    cout << endl;`),
        input: '5\n6\n',
        blanks: [
          {
            answers: ['(1 << (bitposition - 1))', '1 << bitposition - 1', '(1 << bitposition - 1)', '1 << (bitposition - 1)'],
          },
        ],
        chips: ['^', '<<', '1', 'bitposition', '-', '(', ')'],
        hints: ['XOR (`^`) with 1 flips a bit; XOR with 0 keeps it.', 'Make a number that has a 1 ONLY at the wanted position: shift 1 to the left by `bitposition - 1`.'],
        explain:
          'A **mask** with a single 1-bit at position p is `1 << (p - 1)` (position 1 is the rightmost bit, so we shift one less).\n`n ^ mask` flips exactly that bit: `x ^ 1` flips, `x ^ 0` keeps.\nInput 5, 6: mask = `1 << 5` = 32 = `0000000000100000`. `5 ^ 32` = `0000000000100101` = **37**.\nInput 5, 3: mask = `1 << 2` = 4. 5 = `…0101`, bit 3 is 1, so it becomes 0: `5 ^ 4` = **1**.\nNote: `<<` has LOWER precedence than `-`, so `1 << bitposition - 1` also works; the paper also accepts `temp = 1; temp = temp << bitposition - 1; n = n ^ temp;`.\nOutput for input 5, 6:\n`Enter a number`\n`Enter position of bit you want to reverse`\n`Number & it\'s bit representation before conversion`\n`5 0000000000000101`\n`Number & it\'s bit representation after conversion`\n`37 0000000000100101`',
      },
    },
    // ---------- Q2: complete the code ----------
    {
      unit: 5,
      q: {
        id: `${P}-q2-a`,
        kind: 'blanks',
        tag: 'real life',
        source: `${T} · Q2(a)`,
        prompt: 'Complete the code. This program calculates the **loss or profit** of a product based on its cost price and selling price.',
        code: prog(cpp`
    int cp, sp, amt;
    cout << "Enter cost price: ";
    cin >> cp;
    cout << "Enter selling price: ";
    cin >> sp;

    if ([[1]])
    {
        // Calculate Profit
        [[2]];
        cout << "Profit: " << amt << endl;
    }

    if ([[3]])
    {
        // Calculate Loss
        [[4]];
        cout << "Loss: " << amt << endl;
    }

    if ([[5]])
        cout << "No profit no loss..." << endl;`),
        input: '500\n650\n',
        blanks: [
          { answers: ['sp > cp', 'cp < sp'] },
          { answers: ['amt = sp - cp', 'amt = -cp + sp'] },
          { answers: ['cp > sp', 'sp < cp'] },
          { answers: ['amt = cp - sp', 'amt = -sp + cp'] },
          { answers: ['sp == cp', 'cp == sp'] },
        ],
        chips: ['sp', 'cp', 'amt', '>', '<', '==', '=', '-'],
        hints: ['Profit happens when you sell for MORE than you paid.', 'Profit = selling price − cost price. Loss = cost price − selling price (so it is positive).'],
        explain:
          'Profit when `sp > cp`, amount `amt = sp - cp`. Loss when `cp > sp`, amount `amt = cp - sp`. Neither when `sp == cp`.\nThe three `if`s are separate, but exactly one condition can be true.\nWith cost 500 and selling price 650: 650 > 500 → `amt = 150`.\nOutput: `Enter cost price: Enter selling price: Profit: 150`',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q2-b`,
        kind: 'blanks',
        tag: 'exam',
        source: `${T} · Q2(b)`,
        prompt: 'Complete the condition. *A year is a leap year if it is exactly divisible by 4 AND not divisible by 100, OR if it is exactly divisible by 400.* The test input is `1900`.',
        code: prog(cpp`
    int year;
    cin >> year;

    if ([[1]])
        cout << "LEAP YEAR";
    else
        cout << "COMMON YEAR";`),
        input: '1900\n',
        blanks: [
          {
            answers: [
              '(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)',
              '(year % 4 == 0 && year % 100 != 0) || year % 400 == 0',
              'year % 4 == 0 && year % 100 != 0 || year % 400 == 0',
              'year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)',
            ],
          },
        ],
        chips: LOGIC_CHIPS,
        hints: ['"Divisible by 4" is `year % 4 == 0`.', 'Two cases joined by `||`: (by 4 AND not by 100) OR (by 400).'],
        explain:
          'Condition: `(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)`.\nFor 1900: divisible by 4 (true) but also by 100, so the first part is false; 1900 % 400 = 300, so the second part is false too → `COMMON YEAR`.\n(If you only check `year % 4 == 0`, 1900 wrongly becomes a leap year.) 2000 and 2024 are leap years, 2023 is not.\nOutput: **`COMMON YEAR`**',
      },
    },
    // ---------- Q3: outputs ----------
    {
      unit: 1,
      q: {
        id: `${P}-q3-a`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q3(a)`,
        prompt: OUT3,
        code: prog(
          cpp`
    cout << "\'D\'\t\'i\'\t\'g\'\t\'e\'\t\'s\'\t\'t\'\n";
    cout << setw(10) << "\\\n" << setw(8) << "\\\n" << setw(6) << "\\\n" << setw(4) << "\\\n" << setw(2) << "\\\n" << endl;
    cout << setw(2) << "/\n" << setw(4) << "/\n" << setw(6) << "/\n" << setw(8) << "/\n" << setw(10) << "/\n" << endl;`,
          '#include <iomanip>\n',
        ),
        hints: ['`"\\\\\\n"` is only TWO characters: a backslash and a newline.', '`setw(10)` pads the next item (2 characters) with 8 spaces on the LEFT. `setw` works only for the next item.'],
        explain:
          "Line 6: `\\'` prints a single quote and `\\t` is a tab: `'D'` TAB `'i'` TAB `'g'` TAB `'e'` TAB `'s'` TAB `'t'`, then a newline.\nLine 7: each string `\"\\\\\\n\"` is 2 characters (`\\` + newline). `setw(w)` right-aligns it in w characters, so it gets `w − 2` spaces before it: 8, 6, 4, 2 and 0 spaces. The backslashes step to the LEFT. Then `endl` adds an empty line.\nLine 8: same with `/`: 0, 2, 4, 6, 8 spaces — the slashes step to the RIGHT, then an empty line.\nOutput (· = space):\n`'D'→'i'→'g'→'e'→'s'→'t'`\n`········\\`\n`······\\`\n`····\\`\n`··\\`\n`\\`\n(empty line)\n`/`\n`··/`\n`····/`\n`······/`\n`········/`\n(empty line)",
      },
    },
    {
      unit: 2,
      q: {
        id: `${P}-q3-b`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q3(b)`,
        prompt: OUT3,
        code: prog(cpp`
    int flightNum = 89, travelTime, distance;
    travelTime = distance = 250 / (double)40;
    cout << travelTime << endl;`),
        hints: ['`(double)40` makes the division a real division: 6.25.', 'Storing 6.25 in an `int` cuts off the fraction. Chained `=` goes right to left.'],
        explain:
          '`250 / (double)40` = `6.25` (the cast makes it a double division).\nChained assignment runs right to left: `distance = 6.25` stores `6` (an int cannot keep `.25`), and the value of that assignment (6) goes into `travelTime`.\n`flightNum` is not used.\nOutput: **`6`**',
      },
    },
    {
      unit: 4,
      q: {
        id: `${P}-q3-c`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q3(c)`,
        prompt: OUT3,
        code: prog(cpp`
    short int unus, duo, tres;
    unus = duo = tres = 5.5;
    unus += 4;
    duo *= 2;
    tres -= 4;
    unus /= 3;
    duo += tres;
    cout << unus << endl;
    cout << duo << endl;
    cout << tres << endl;`),
        hints: ['A `short int` holds whole numbers only: `5.5` becomes 5.', 'Do the compound assignments in order and keep a small table.'],
        explain:
          'Line 6: 5.5 is stored in a `short int`, so all three become `5`.\n• `unus += 4` → 9\n• `duo *= 2` → 10\n• `tres -= 4` → 1\n• `unus /= 3` → 9 / 3 = 3\n• `duo += tres` → 10 + 1 = 11\nOutput:\n`3`\n`11`\n`1`',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q3-d`,
        kind: 'predict',
        tag: 'tricky',
        source: `${T} · Q3(d)`,
        prompt: OUT3,
        code: prog(cpp`
    char ch = 128;
    if (ch > 0)
        cout << (int)ch << endl;

    ch = -129;
    if (!(ch < 0))
        cout << (int)ch << endl;

    ch = ('a' - 'A') * 2 + 5;
    cout << ch << endl;`),
        hints: ['A `char` (signed, 1 byte) holds only -128 … 127. Values outside WRAP around by 256.', "`'a' - 'A'` is 97 − 65 = 32."],
        explain:
          'A signed `char` holds −128 … 127. A value outside that range wraps around (add or subtract 256).\nLine 5: 128 wraps to `−128`. `−128 > 0` is false → nothing printed.\nLine 9: −129 wraps to `127`. `!(127 < 0)` is true → prints `127`.\nLine 13: `(97 − 65) * 2 + 5` = 32 × 2 + 5 = 69. Code 69 is the letter `E`, and a `char` prints as a letter.\nOutput:\n`127`\n`E`',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q3-e`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q3(e)`,
        prompt: OUT3,
        code: prog(cpp`
    int flag = (int(1.5 + 6) % 4);
    if (!!!flag)
        cout << "*" << (5 >= 6 || 1 < 8 && 9 == 7) << endl;
    cout << "@" << (5 + 1 == 6 || 8 - 1 > 4) << endl;`),
        hints: ['`int(7.5)` is 7. Then `% 4`.', 'Three `!`s: `!!!x` is the same as `!x`. Also: the `if` has no braces.'],
        explain:
          'Line 5: `int(1.5 + 6)` = `int(7.5)` = 7, and `7 % 4 = 3`, so flag = 3.\nLine 6: `!3` = 0, `!!3` = 1, `!!!3` = 0 → false. Line 7 is skipped.\nLine 8 is NOT inside the if (no braces), so it always runs: `5 + 1 == 6` is true → the `||` is true → prints `@1`.\nOutput: **`@1`**',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q3-f`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q3(f)`,
        prompt: OUT3,
        code: prog(cpp`
    int i = 5, k = 6;
    int j = 7;
    if (17 < 13 && 14 > 2 || 155 % 5 == 1 && 17 / 5 > 2)
        cout << j + i << endl;
    else
        cout << i - j << endl;
    j -= 1;
    if (17 < 13 && 14 > 2 || 155 % 5 == 1 && 17 / 5 > 2)
        cout << j + i << endl;
    else
        cout << i - j << endl;
    j -= 1;
    if (17 < 13 && 14 > 2 || 155 % 5 == 1 && 17 / 5 > 2)
        cout << j + i << endl;
    else
        cout << i - j << endl;`),
        hints: ['The condition has only constants — it has the same value all three times.', '`&&` is done before `||`.'],
        explain:
          'The condition is `(17 < 13 && 14 > 2) || (155 % 5 == 1 && 17 / 5 > 2)`.\nLeft: `17 < 13` is false → false. Right: `155 % 5` is 0, not 1 → false. So the condition is always **false** and the `else` runs each time: `i - j`.\n• j = 7: 5 − 7 = `-2`\n• j = 6: 5 − 6 = `-1`\n• j = 5: 5 − 5 = `0`\nOutput:\n`-2`\n`-1`\n`0`',
      },
    },
    // ---------- Q4: find the errors ----------
    {
      unit: 2,
      q: {
        id: `${P}-q4-a`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q4(a)`,
        prompt: ERR4,
        code: cpp`
#include <iostream>
#include <iomanip>
using namespace std;
int main()
{
    int return = 2000;
    cout << "Loan returned =" << return << endl;
    int length = 200.5;
    cout << "Length     = " << length;
    char initial = 'a';
    char newchar = initial - 32;
    cout << newchar << endl;
    int ch = 100;
    cout << (char)ch << endl;
    return 0;
}
`,
        hints: ['Can a variable be named with a C++ keyword?', 'The other lines are legal: `200.5` into an int just loses `.5`.'],
        explain:
          '**Compile error on line 6: expected unqualified-id before `return`.** `return` is a reserved word (keyword), so it cannot be a variable name. Line 7 has the same error.\nThe other lines are legal: `int length = 200.5` stores 200 (only a warning).\nCorrection: rename the variable, e.g. `int loan = 2000;` and `cout << "Loan returned =" << loan << endl;`.\nCorrected output:\n`Loan returned =2000`\n`Length     = 200A` (no `endl` after 200, and `\'a\' - 32` = 65 = `A`)\n`d` (code 100)',
      },
    },
    {
      unit: 2,
      q: {
        id: `${P}-q4-b`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q4(b)`,
        prompt: ERR4,
        code: cpp`
#include <iostream>
using namespace std;
int main() {
    Float const PI = 3.7;
    cout << PI + 0.3 << endl;
    PI = 3.7125;
    cout << "new value \n" << PI << endl;
    return 0;
}
`,
        hints: ['C++ is case-sensitive.', 'Even after fixing the type, can you change a `const`?'],
        explain:
          '**Compile error on line 4: `Float` was not declared** — C++ is case-sensitive; the type is `float`.\nSecond error, line 6: `PI = 3.7125;` — assignment of read-only variable `PI`. A `const` cannot be changed after it is created. Remove that line.\nCorrected program: `float const PI = 3.7;` and no line 6.\nCorrected output:\n`4` (3.7 + 0.3 = 4, printed without decimals)\n`new value `\n`3.7`',
      },
    },
    {
      unit: 4,
      q: {
        id: `${P}-q4-c`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q4(c)`,
        prompt: ERR4 + ' (The answer must be in floating point.)',
        code: cpp`
#include <iostream>
#include <cmath>
using namespace std;
int main()
{
    int value1 = 3, value2, value3;
    value2 = 3 * pow(value1, 2.0);
    (double)value3 = 3 + value2 / 2 - 1;
    cout << value3 << endl;
    return 0;
}
`,
        hints: ['A cast makes a temporary VALUE. Can you store something into a temporary value?', 'For a floating-point answer, what type should the variables be?'],
        explain:
          '**Compile error on line 8: lvalue required as left operand of assignment.** `(double)value3` is a temporary converted copy, not a variable — you cannot assign to it.\nThe answer must be floating point, so declare the variables as `double`: `double value1 = 3, value2, value3;` and write line 8 as `value3 = 3 + value2 / 2 - 1;` (or cast the right side: `3 + (double)value2 / 2 - 1`).\nCorrected: `value2 = 3 * 3² = 27`, `value3 = 3 + 27 / 2.0 - 1 = 3 + 13.5 - 1 = 15.5`.\nCorrected output: **`15.5`**',
      },
    },
    {
      unit: 5,
      q: {
        id: `${P}-q4-d`,
        kind: 'predict',
        tag: 'exam',
        source: `${T} · Q4(d)`,
        prompt: ERR4,
        code: prog(cpp`
    int n = 89;
    if (n > 'A')
        cout << (int)A << endl;
    else
        cout << (char)n;`),
        hints: ['Is `A` (without quotes) a variable in this program?'],
        explain:
          "**Compile error on line 7: `A` was not declared in this scope.** Without quotes, `A` is a variable name, and no variable `A` exists. The character needs quotes: `'A'`.\nCorrection: `cout << (int)'A' << endl;`\nCorrected run: `89 > 'A'` → 89 > 65 is true → prints the code of `'A'`.\nCorrected output: **`65`**",
      },
    },
  ],
};
