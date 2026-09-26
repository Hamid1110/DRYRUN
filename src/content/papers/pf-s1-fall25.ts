import type { PaperSet } from '../types';
import { cpp, prog } from '../helpers';

// PF Sessional-I, Fall 2025 (FAST-NUCES Islamabad, CS1002, 23 Sep 2025).
// Q1 fill conditions, Q2 flowchart, Q3 report card (setw/setfill), Q4 14 one-mark outputs, Q5 8 two-mark outputs.

const T = 'PF Sessional-I · Fall 2025';
const CM = '#include <cmath>\n';
const OUT = 'State the output of the following code. If there is an error, write it explicitly. If there is no output, write "No Output".';

export const paper: PaperSet = {
  id: 'pf-s1-fall25',
  title: T,
  year: 2025,
  questions: [
    // ------------------------------------------------------------------ Q1
    {
      unit: 5,
      q: {
        id: 'pf-s1-fall25-q1',
        kind: 'blanks',
        source: `${T} · Q1`,
        tag: 'exam',
        prompt: 'The program checks whether an input character is an **uppercase** alphabet, a **lowercase** alphabet, or **not an alphabet** at all. Complete the missing statement and conditions.\n**Restrictions:** do not use `<cctype>` (no `isupper`, `islower` …) and do not use the operators `>=`, `<=` or `&&`.',
        code: cpp`#include <iostream>
using namespace std;
int main() {
    char ch;
    cout << "Enter a character: ";
    [[1]];
    if ([[2]]) {
        cout << ch << " is an Uppercase Alphabet." << endl;
    }
    else
        if ([[3]]) {
        cout << ch << " is a Lowercase Alphabet." << endl;
    }
    else {
        cout << ch << " is Not an Alphabet." << endl;
    }
    return 0;
}
`,
        input: 'q\n',
        blanks: [
          { answers: ['cin >> ch'], hint: 'Read one character into ch.' },
          {
            answers: [
              "!(ch < 'A' || ch > 'Z')",
              "!(ch > 'Z' || ch < 'A')",
              '!(ch < 65 || ch > 90)',
              '!(ch > 90 || ch < 65)',
              "!(ch < 'A') & !(ch > 'Z')",
              "ch > '@' & ch < '['",
              'ch > 64 & ch < 91',
            ],
            hint: 'Uppercase means NOT (below A or above Z).',
          },
          {
            answers: [
              "!(ch < 'a' || ch > 'z')",
              "!(ch > 'z' || ch < 'a')",
              '!(ch < 97 || ch > 122)',
              '!(ch > 122 || ch < 97)',
              "!(ch < 'a') & !(ch > 'z')",
              "ch > '`' & ch < '{'",
              'ch > 96 & ch < 123',
            ],
            hint: 'Same idea with a and z.',
          },
        ],
        chips: ['cin', '>>', 'ch', '!', '(', ')', '<', '>', '||', "'A'", "'Z'", "'a'", "'z'"],
        hints: [
          'Without `>=` and `&&`, turn the question around: when is a character **not** a capital letter? When it is `< \'A\'` **or** `> \'Z\'`.',
          'De Morgan: `ch >= \'A\' && ch <= \'Z\'` is the same as `!(ch < \'A\' || ch > \'Z\')`.',
        ],
        explain:
          "Box 1: `cin >> ch` reads the character.\nBox 2: the normal test would be `ch >= 'A' && ch <= 'Z'`, but `>=`, `<=` and `&&` are banned. **De Morgan's law** rewrites it: \"inside the range\" = \"NOT (below the start OR above the end)\" → `!(ch < 'A' || ch > 'Z')`.\nBox 3: the same for small letters → `!(ch < 'a' || ch > 'z')`.\nDry run with `q` (ASCII 113): `113 < 65` false, `113 > 90` true → `||` gives true → `!` gives false, so it is not uppercase. Next: `113 < 97` false, `113 > 122` false → false → `!` gives true → `q is a Lowercase Alphabet.`\n(Other correct answers: compare with ASCII numbers `!(ch < 65 || ch > 90)`, or use strict `>`/`<` with the neighbour characters: `ch > '@' & ch < '['`, since `'@'` is 64 and `'['` is 91.)",
      },
    },
    // ------------------------------------------------------------------ Q2
    {
      unit: 0,
      q: {
        id: 'pf-s1-fall25-q2',
        kind: 'blanks',
        view: 'flow',
        source: `${T} · Q2`,
        tag: 'exam',
        prompt: 'Complete the flowchart by filling in the missing steps (**2 process boxes and 2 decision boxes**) so that it finds the **nearest square root** of a positive number **without** built-in functions like `pow` or `sqrt`.\nExamples: `144` → `12 is the Nearest Square root`; `132` → `11 …` (121 is nearer than 144); `133` → `12 …` (144 is nearer than 121). The dry run uses `132`.',
        code: prog(cpp`
    int num, i = 0, j = 0;
    cin >> num;
    while ([[1]]) {
        [[2]];
        [[3]];
    }
    if ([[4]]) {
        cout << j << " is the Nearest Square root" << endl;
    } else {
        cout << i << " is the Nearest Square root" << endl;
    }`),
        input: '132\n',
        blanks: [
          { answers: ['i * i < num', 'num > i * i', 'i < num / i'], hint: 'Keep going while the square of i is still smaller than num.' },
          { answers: ['i = i + 1', 'i++', '++i', 'i += 1'], hint: 'Move to the next whole number.' },
          { answers: ['j = i - 1', 'j = -1 + i'], hint: 'j always stays one step behind i.' },
          {
            answers: ['num - j * j < i * i - num', 'i * i - num > num - j * j', 'num - j * j <= i * i - num', 'j * j + i * i > 2 * num', '2 * num < i * i + j * j'],
            hint: 'Which square is closer to num: j·j (below) or i·i (above)?',
          },
        ],
        chips: ['i', 'j', 'num', '*', '+', '-', '<', '>', '=', '1'],
        hints: [
          'The loop increases i until `i * i` reaches or passes num. Then the answer is either i (square just above) or the number just before it (square just below).',
          'Store that previous number in j, and at the end compare the two distances `num - j*j` and `i*i - num`.',
        ],
        explain:
          'Box 1: `i * i < num` — keep looping while the square of i is still below num.\nBox 2: `i = i + 1`. Box 3: `j = i - 1` (j is the number just before i).\nWhen the loop stops, `j * j < num <= i * i`: num lies between two neighbouring squares.\nBox 4: `num - j * j < i * i - num` — is num closer to the lower square? Yes → display j, No → display i.\nDry run for 132: i = 1, 2, …, 11 (121 < 132), then i = 12 (144 is not < 132) → stop with i = 12, j = 11. Distances: 132 − 121 = **11**, 144 − 132 = **12** → 11 < 12 → Yes → `11 is the Nearest Square root`.\nFor 133: 12 < 11 is No → `12`. For 144: 144 − 121 = 23 < 0 is No → `12`. (A tie is impossible: it would need 2·num = j² + (j+1)², an odd number.)',
      },
    },
    // ------------------------------------------------------------------ Q3
    {
      unit: 1,
      q: {
        id: 'pf-s1-fall25-q3',
        kind: 'predict',
        source: `${T} · Q3`,
        tag: 'exam',
        prompt: 'State the output of the following code (it is error free). Watch `setw`, `setfill`, `left`/`right`, `fixed`, and the escape sequences.\n*Note:* `\\r` is a carriage return. On a real terminal it jumps back to the start of the line, so the text after it overwrites `Note:`. The checker here ignores `\\r`, so type the characters in the order they are sent.',
        code: cpp`#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double x;
    cout << "Enter a number: ";
    x=52;
    cout<<x;
    cout << "\nReport Card\n";
    cout << "============\n";

    int base = static_cast<int>(x) % 7;
    double factor = x / 3 + base * 2 / 1.5;

    double bonus;
    if (!(x < 10)) bonus = factor * 2.5;
    else bonus = (factor + 5) / 2;

    double penalty =-1.5;
    if (bonus > 70);
        penalty = 4.0;

    cout << left << setw(12) << setfill('*')<<"Value"
         << right << setw(10)<<setfill('.') << fixed << setprecision(2) << x << endl;

    cout << left << setw(12) << setfill('*')<< "Factor"
         << right << setw(10) <<setfill('.')<< factor << endl;

    cout << left << setw(12) << setfill('*')<< "Bonus"
         << right << setw(10) <<setfill('.')<< bonus << endl;

    cout << left << setw(12) << setfill('*')<< "Penalty"
         << right << setw(10) <<setfill('.')<< penalty << endl;

    if (static_cast<int>(x) % 2 == 0)
        cout << "Note:\rEven number detected.";
    else
        cout << "Note:\\tOdd number detected.";

    cout << "\nPath: C:\\\\Users\\\\Public\t" << static_cast<int>(x + bonus) << endl;
}
`,
        hints: [
          '`left << setw(12) << setfill(\'*\')` pads the word on the RIGHT with `*` up to 12 characters; `right << setw(10)` pads the number on the LEFT with `.`.',
          '`if (bonus > 70);` has an empty body — the next line always runs. `\\\\` prints one backslash.',
        ],
        explain:
          'Line 9 prints `52` right after the prompt (x is 52, a whole double prints without decimals): `Enter a number: 52`.\nbase = 52 % 7 = **3**. factor = 52 / 3 + 3 * 2 / 1.5 = 17.3333 + 6 / 1.5 = 17.3333 + 4 = **21.3333**.\n`!(52 < 10)` is true → bonus = 21.3333 × 2.5 = **53.3333**.\n`if (bonus > 70);` — the `;` is an empty body, so `penalty = 4.0;` ALWAYS runs → penalty = **4**.\nFormatting: `left, setw(12), fill *` → `Value*******` (5 letters + 7 stars). Then `right, setw(10), fill .` with `fixed, setprecision(2)` (they stay on!) → `52.00` becomes `.....52.00`.\n`Factor******...…21.33`, `Bonus*******.....53.33`, `Penalty*****......4.00`.\n52 is even → `Note:` + `\\r` + `Even number detected.` (on a terminal you see only `Even number detected.`).\nLast line: `\\\\\\\\` is two escaped backslashes → `C:\\\\Users\\\\Public`, then a tab, then `static_cast<int>(52 + 53.33)` = **105**.\nOutput:\n`Enter a number: 52`\n`Report Card`\n`============`\n`Value*******.....52.00`\n`Factor******.....21.33`\n`Bonus*******.....53.33`\n`Penalty*****......4.00`\n`Note:Even number detected.`\n`Path: C:\\\\Users\\\\Public` *(tab)* `105`',
      },
    },
    // ------------------------------------------------------------------ Q4 (1 mark each)
    {
      unit: 4,
      q: {
        id: 'pf-s1-fall25-q4-1',
        kind: 'predict',
        source: `${T} · Q4(1)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    double x = static_cast<int>(7.7); int y = 3;
    cout << x % y;`),
        hints: ['`x` holds a whole value (7), but what is its TYPE?'],
        explain: '**Compile error on line 6**: invalid operands of types `double` and `int` to binary `operator%`.\n`static_cast<int>(7.7)` gives 7, but it is stored in a `double` variable, so x is the double `7.0`. The `%` operator only accepts integer types. The value being whole does not matter — only the type does.',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s1-fall25-q4-2',
        kind: 'predict',
        source: `${T} · Q4(2)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    cout << pow(2,3) % 2 << endl;`, CM),
        hints: ['What type does `pow` return?'],
        explain: '**Compile error on line 6**: `pow` always returns a `double` (here `8.0`), and `%` cannot be used with a `double`. Fix: `static_cast<int>(pow(2,3)) % 2` (prints 0).',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s1-fall25-q4-3',
        kind: 'predict',
        source: `${T} · Q4(3)`,
        tag: 'exam',
        prompt: OUT + ' (ASCII of `\'a\'` is 97.)',
        code: prog(cpp`
    int easy = 3 *(-48 + 16 + 'a' / 2);
    cout << easy << endl ;`),
        hints: ["`'a'` is just the number 97 in arithmetic.", '`/` is done before `+`, and 97 / 2 is integer division.'],
        explain: "Inside the brackets `/` comes first: `'a' / 2` = 97 / 2 = **48** (integer division).\nThen −48 + 16 + 48 = **16**, and 3 × 16 = **48**.\nOutput: `48`",
      },
    },
    {
      unit: 2,
      q: {
        id: 'pf-s1-fall25-q4-4',
        kind: 'predict',
        source: `${T} · Q4(4)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    int a = b = c = d = e = 10;
    a += b += c += d += e;
    cout << a;`),
        hints: ['Which variables does line 5 actually declare?'],
        explain: "**Compile error on line 5**: `'b' was not declared in this scope`.\n`int a = b = c = d = e = 10;` declares ONLY `a`; the initializer `b = c = d = e = 10` tries to assign to b, c, d, e, which do not exist yet. Fix: `int a, b, c, d, e; a = b = c = d = e = 10;` — then line 6 (right to left: d = 20, c = 30, b = 40, a = 50) would print `50`.",
      },
    },
    {
      unit: 2,
      q: {
        id: 'pf-s1-fall25-q4-5',
        kind: 'predict',
        source: `${T} · Q4(5)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    short int s = 65536;
    if(s) cout << "True"; else cout << "False";`),
        hints: ['A `short` has 16 bits: it can hold 65536 different values, from −32768 to 32767.'],
        explain: '65536 does not fit in a 16-bit `short`. The value wraps around: 65536 mod 65536 = **0** (g++ only gives a warning, not an error). `if (0)` is false.\nOutput: `False`',
      },
    },
    {
      unit: 2,
      q: {
        id: 'pf-s1-fall25-q4-6',
        kind: 'predict',
        source: `${T} · Q4(6)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    unsigned short int u = 65792;
    char ch;
    if(ch=u) cout << true; else cout << false;`),
        hints: ['65792 = 65536 + 256.', 'A `char` keeps only the lowest 8 bits. And `cout << true` prints a number.'],
        explain: '`unsigned short` holds 0 … 65535, so u = 65792 − 65536 = **256**.\n`ch = u` is an **assignment** (not `==`): a char keeps only 8 bits, 256 mod 256 = **0**. The value of the assignment is 0 → false.\n`cout << false` prints the number `0` (bools print as 1/0 unless you use `boolalpha`).\nOutput: `0`',
      },
    },
    {
      unit: 2,
      q: {
        id: 'pf-s1-fall25-q4-7',
        kind: 'predict',
        source: `${T} · Q4(7)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    unsigned char c = 250;
    c += 72;
    cout << static_cast<char>(c) << endl;`),
        hints: ['An `unsigned char` holds 0 … 255 and wraps around.', 'Which character has ASCII code 66?'],
        explain: '250 + 72 = 322, which does not fit in an unsigned char (max 255): 322 − 256 = **66**.\nPrinted as a char, 66 is `B`.\nOutput: `B`',
      },
    },
    {
      unit: 2,
      q: {
        id: 'pf-s1-fall25-q4-8',
        kind: 'predict',
        source: `${T} · Q4(8)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    unsigned char ch = 888;
    cout << ch << endl;`),
        hints: ['888 mod 256 = ?', 'ASCII 120 is a small letter.'],
        explain: 'It compiles (only a warning). 888 does not fit in 8 bits: 888 − 3 × 256 = 888 − 768 = **120**. `cout` prints an `unsigned char` as a character: ASCII 120 is `x`.\nOutput: `x`',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s1-fall25-q4-9',
        kind: 'predict',
        source: `${T} · Q4(9)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    int a=5,b=15,c=4,d=1;
    a += b > c > d;
    cout << a << endl;`),
        hints: ['`>` is evaluated left to right and gives 1 or 0.', '`+=` has the lowest precedence here.'],
        explain: '`b > c > d` is `(b > c) > d` = `(15 > 4) > 1` = `1 > 1` = **0**. (It does NOT mean "b > c and c > d".)\n`a += 0` → a = 5.\nOutput: `5`',
      },
    },
    {
      unit: 5,
      q: {
        id: 'pf-s1-fall25-q4-10',
        kind: 'predict',
        source: `${T} · Q4(10)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    int a = 5, b = 0;
    if (a = b) cout << pow(a,b); else cout << pow(b,a);`, CM),
        hints: ['`a = b` is an assignment. What value does it leave in a, and what is the condition?', 'What is 0 to the power 0?'],
        explain: '`a = b` stores 0 in a; the condition is 0 → false → the else runs: `pow(b, a)` = `pow(0, 0)`.\nBy definition `pow(0, 0)` returns **1** (a double, printed as `1`).\nOutput: `1`',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s1-fall25-q4-11',
        kind: 'predict',
        source: `${T} · Q4(11)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    int a=10, b=30; double c=37;
    b = c - b - a;
    b =- 10;
    cout << b << endl;`),
        hints: ['`=-` is not an operator. Read it as `=` followed by `-10`.'],
        explain: 'Line 6: b = 37 − 30 − 10 = −3 (stored as int).\nLine 7: `b =- 10;` is `b = -10;` (C++ has no `=-` operator; it is `=` and a unary minus). The old value is overwritten.\nOutput: `-10`',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s1-fall25-q4-12',
        kind: 'predict',
        source: `${T} · Q4(12)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    double x = 5.5;
    cout << (static_cast<int>(x) % 3 + x * 2) << endl;`),
        hints: ['The cast makes a temporary int 5, so `%` is legal here.'],
        explain: '`static_cast<int>(x)` = 5, and 5 % 3 = **2**. x * 2 = **11.0**. 2 + 11.0 = 13.0, printed as `13`.\nOutput: `13`',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s1-fall25-q4-13',
        kind: 'predict',
        source: `${T} · Q4(13)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    int a,b,c,d,e;
    a = b = c*3 = d+5 = e = 10;
    a += 25; b -= 30; c /= 10; d *= 5; e %= 15;
    cout<<"a="<<a<<" b="<<b<<" c="<<c<<" d="<<d<<" e="<<e<<endl;`),
        hints: ['Assignment works right to left. What stands on the left of each `=`?'],
        explain: '**Compile error on line 6**: `lvalue required as left operand of assignment`.\nThe chain is done right to left: `e = 10` is fine, but next comes `d+5 = …`. `d+5` is a temporary value, not a variable (not an *lvalue*), so nothing can be stored in it. (`c*3 = …` has the same problem.)',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s1-fall25-q4-14',
        kind: 'predict',
        source: `${T} · Q4(14)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    int a = 25;
    cout << !(!(a));`),
        hints: ['`!` of any non-zero number is 0, and `!0` is 1.'],
        explain: '`!a` = `!25` = 0 (false). `!0` = 1 (true). A `bool` prints as a number.\nOutput: `1` (a double `!` turns any number into 0 or 1).',
      },
    },
    // ------------------------------------------------------------------ Q5 (2 marks each)
    {
      unit: 5,
      q: {
        id: 'pf-s1-fall25-q5-1',
        kind: 'predict',
        source: `${T} · Q5(1)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    int x = 10, y = 5, z = 3, u = 4;
    if ((y-=2)<(x+=3) && (z+=1)<= y-1){
        if (x > y || (u+=1) <= y)
            cout<<x+y*z-z%u<<endl;
        cout<<z/u<<endl;}
    cout <<x<<y<<endl<<z<<u<<endl;`),
        hints: ['The compound assignments inside the condition really change x, y and z.', 'If the left side of `||` is true, `(u+=1)` never runs.'],
        explain: 'Line 6: `y -= 2` → y = 3; `x += 3` → x = 13; `3 < 13` true, so `&&` evaluates the right side: `z += 1` → z = 4, `4 <= 3 - 1` → `4 <= 2` is **false**. The whole condition is false, the block is skipped.\nLine 10 prints x and y without a space, a newline, then z and u: `133` and `44`.\nOutput:\n`133`\n`44`',
      },
    },
    {
      unit: 2,
      q: {
        id: 'pf-s1-fall25-q5-2',
        kind: 'predict',
        source: `${T} · Q5(2)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    short int a = 65536;   int b = 25/4;
    double c = pow(2.5, 2);
    a = a + b * c;
    double d = a / b;
    cout << d << endl;`, CM),
        hints: ['65536 wraps to 0 in a short. 25/4 is integer division.', 'a / b: both are integers, so the division happens BEFORE storing into the double.'],
        explain: 'a = 65536 → wraps to **0** (16-bit short). b = 25 / 4 = **6**. c = 2.5² = **6.25**.\na = 0 + 6 × 6.25 = 37.5 → stored in a short → **37** (decimal part cut).\nd = a / b = 37 / 6 — both integers → **6**, then converted to 6.0.\nOutput: `6`',
      },
    },
    {
      unit: 5,
      q: {
        id: 'pf-s1-fall25-q5-3',
        kind: 'predict',
        source: `${T} · Q5(3)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    int x = 1, y=2;
    if(y=0)
        cout << "A";
    else if(y && (x=9))
        cout << "B"; cout<< "C";
    if(x>2); else cout << "D";
    if(x<2 && y<x || y == 0) cout << "E";
    if(x<0);
    {    cout<<"A";    }`),
        hints: ['`y=0` assigns and is false. With y = 0, does `(x=9)` ever run?', 'An `if (...);` with an empty body followed by `else` is legal. A `{ }` block after `if(x<0);` always runs.'],
        explain: 'Line 6: `y = 0` → false, no `A`.\nLine 8: `y && (x=9)`: y is 0 → `&&` short-circuits, **x stays 1**, no `B`.\nLine 9: `cout << "C";` is a separate statement → `C`.\nLine 10: `x > 2` false → else → `D`.\nLine 11: `(x<2 && y<x)` = (true && 0<1 true) = true → `E`.\nLine 12: `if(x<0);` empty body. Line 13: a plain block, always runs → `A`.\nOutput: `CDEA`',
      },
    },
    {
      unit: 5,
      q: {
        id: 'pf-s1-fall25-q5-4',
        kind: 'predict',
        source: `${T} · Q5(4)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    int a = 10/3 + 18%5;
    int b = (a*5) / 7;
    int c = pow(2,3) + b;
    if (a > b && b != 0 && (a*b)/b == a)
        if (c % a == 0 || (b - c) < 0)
            cout << a + b + c;
            cout << c - a;
    else
        cout << a * b - c;`, CM),
        hints: ['Without braces the outer `if` owns only the inner `if`, which owns only one `cout`.', 'Then comes a normal statement. Can an `else` follow it?'],
        explain: '**Compile error on line 12**: `else` without a previous `if`.\nIndentation means nothing to the compiler. The inner `if` (line 9) owns only line 10; the outer `if` owns only that inner if. Line 11 `cout << c - a;` is a new, separate statement. So the `else` on line 12 follows a plain `cout` — it has no `if` to belong to.\n(The values would be a = 3 + 3 = 6, b = 30 / 7 = 4, c = 8 + 4 = 12, but the program never runs.)',
      },
    },
    {
      unit: 2,
      q: {
        id: 'pf-s1-fall25-q5-5',
        kind: 'predict',
        source: `${T} · Q5(5)`,
        tag: 'exam',
        prompt: OUT + " (ASCII: `'A'` = 65, `'a'` = 97.)",
        code: prog(cpp`
    char ch=128;
    if(ch>0)
        cout<<static_cast<int>(ch)<<endl;
    ch=-129;
    if(!(ch<0))
        cout<<static_cast<int>(ch)<<endl;
    ch = ('a'-'A')*2+5;
    cout<<ch<<endl;`),
        hints: ['A (signed) char holds −128 … 127. 128 wraps to −128; −129 wraps to 127.', "('a' − 'A') = 32."],
        explain: 'Line 5: 128 does not fit in a signed char → **−128**. `-128 > 0` false → nothing printed.\nLine 8: −129 wraps to **127**. `!(127 < 0)` → true → prints `127`.\nLine 11: (97 − 65) × 2 + 5 = 32 × 2 + 5 = **69**, printed as a char: `E`.\nOutput:\n`127`\n`E`',
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s1-fall25-q5-6',
        kind: 'predict',
        source: `${T} · Q5(6)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    char ch = 'd';
    int val = ch - 'a';
    int a = 14/3 + val;
    double z = a / 2.0;
    if (a % 2 == 1 && z > 3) cout << static_cast<int>(z * 2);
    else cout << a;`),
        hints: ["`'d' - 'a'` = 3.", '14 / 3 is integer division.'],
        explain: "val = 'd' − 'a' = 100 − 97 = **3**. a = 14 / 3 + 3 = 4 + 3 = **7**. z = 7 / 2.0 = **3.5**.\n`7 % 2 == 1` true and `3.5 > 3` true → print `static_cast<int>(3.5 * 2)` = 7.\nOutput: `7`",
      },
    },
    {
      unit: 4,
      q: {
        id: 'pf-s1-fall25-q5-7',
        kind: 'predict',
        source: `${T} · Q5(7)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    double d = pow(3.0, 3) / 2;
    int x = static_cast<int>(d) - (5/2);
    if(x > 10 && d - x < 1.0)cout << x + static_cast<int>(d);
    else cout << x - static_cast<int>(d);`, CM),
        hints: ['3³ / 2 = 13.5. And 5/2 is 2.'],
        explain: 'd = 27 / 2 = **13.5**. x = 13 − 2 = **11**.\n`x > 10` true, but `d - x` = 13.5 − 11 = 2.5, and `2.5 < 1.0` is false → else.\nx − 13 = 11 − 13 = **−2**.\nOutput: `-2`',
      },
    },
    {
      unit: 5,
      q: {
        id: 'pf-s1-fall25-q5-8',
        kind: 'predict',
        source: `${T} · Q5(8)`,
        tag: 'exam',
        prompt: OUT,
        code: prog(cpp`
    int marks = 85;
    if (marks >= 50) cout << "Grade D\n";
        if (marks >= 60) cout << "Grade C\n";
            if (marks >= 70) cout << "Grade B\n";
                if (marks >= 80) cout << "Grade A\n";
                    if (marks >= 90) cout << "Grade A+\n";
    else cout << "Failed" ;`),
        hints: ['Every `if (…) cout …;` line is complete — the ifs are NOT nested.', 'The `else` belongs to the nearest `if` above it.'],
        explain: 'Five independent ifs. The `else` on line 10 belongs to the **nearest** if, `if (marks >= 90)` (dangling else).\n85: `>= 50` → `Grade D`, `>= 60` → `Grade C`, `>= 70` → `Grade B`, `>= 80` → `Grade A`, `>= 90` false → its else → `Failed`.\nOutput:\n`Grade D`\n`Grade C`\n`Grade B`\n`Grade A`\n`Failed`',
      },
    },
  ],
};
