import type { PaperSet } from '../types';
import { cpp, prog, progF } from '../helpers';

// PF Final Exam, Fall 2022 (FAST-NUCES Islamabad, 16 Dec 2022).
// Q1: 13 "write the output" programs. Q2–Q5: complete the code / write a recursive function.

const T = 'PF Final Exam · Fall 2022';
const OUT = 'Write the output of this program. (The paper says: there is no syntax or logical error.)';

export const paper: PaperSet = {
  id: 'pf-final-fall22',
  title: T,
  year: 2022,
  questions: [
    // ───────────── Question 1 (13 × 5 marks): write the output ─────────────
    {
      unit: 7,
      q: {
        id: 'pf-final-fall22-q1-i', kind: 'predict', tag: 'exam', source: `${T} · Q1(i)`, prompt: OUT,
        code: progF(cpp`
int Quad(int n)
{
    return (n*n*n*n);
}`, cpp`
    int num=1634;
    int res=0;
    int remainder;
    int n = num;
    while(n!=0)
    {
        remainder = n % 10;
        res = res + Quad(remainder);
        n = n / 10;
    }
    cout<<"\n Result:"<<res;`),
        hints: ['`n % 10` gives the last digit and `n / 10` removes it. The digits come out in the order 4, 3, 6, 1.', '`Quad` returns the digit to the power 4. Add up 4⁴ + 3⁴ + 6⁴ + 1⁴.'],
        explain: 'The loop takes the digits of 1634 from the right and adds the **4th power** of each one:\n\n- n = 1634 → digit 4 → 256 → res = 256\n- n = 163 → digit 3 → 81 → res = 337\n- n = 16 → digit 6 → 1296 → res = 1633\n- n = 1 → digit 1 → 1 → res = 1634\n- n = 0 → the loop stops.\n\nThe `cout` starts with `\\n`, so the program prints an **empty line** first, then ` Result:1634` (with a space before `Result`).\n\n1634 is an *Armstrong number*: the sum of the 4th powers of its 4 digits is the number itself.',
      },
    },
    {
      unit: 5,
      q: {
        id: 'pf-final-fall22-q1-ii', kind: 'predict', tag: 'exam', source: `${T} · Q1(ii)`, prompt: OUT,
        code: prog(cpp`
    int y = 2;
    switch (y)
    {
        case 0:    y = y + 11;
        case 1:    y = y / 2;
        case 2:    y = y * 5;
        case 3:    y = y + 1;
        default: y = y % 3;
    }
    cout << y << endl;`),
        hints: ['There is no `break` anywhere. After the matching case, every case below it also runs (fall-through).'],
        explain: '`y` is 2, so the jump goes to `case 2`. There is **no `break`**, so all the statements below it run too:\n\n- `case 2`: y = 2 × 5 = 10\n- `case 3`: y = 10 + 1 = 11\n- `default`: y = 11 % 3 = 2\n\nOutput: `2`.',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-final-fall22-q1-iii', kind: 'predict', tag: 'exam', source: `${T} · Q1(iii)`, prompt: OUT,
        code: prog(cpp`
    int i, j, m, answer;
    m = 0;
    j = 3;
    while (m < 3) {
        for (i = 0; i < j; i++) {
            answer = i * m;
            cout << answer;
        }
        m = m + 1;
        cout << endl;
    }`),
        hints: ['The outer loop runs for m = 0, 1, 2. For each m, the inner loop prints i × m for i = 0, 1, 2 with no spaces.'],
        explain: 'Each row is one value of `m`; the inner loop prints `i * m` for i = 0, 1, 2 (no spaces), then `endl`:\n\n- m = 0 → 0 0 0 → `000`\n- m = 1 → 0 1 2 → `012`\n- m = 2 → 0 2 4 → `024`\n\nOutput:\n```\n000\n012\n024\n```',
      },
    },
    {
      unit: 10,
      q: {
        id: 'pf-final-fall22-q1-iv', kind: 'predict', tag: 'exam', source: `${T} · Q1(iv)`, prompt: OUT,
        code: prog(cpp`
    int num[5]= {1,2,3,4,5};
    int* p;
    p = num;
    *p = 20;
    p = &num[1];
    *(++p) = 30;
    p = num + 4;
    *p = 30;
    p = num;
    *(p + 3) = 40;
    for (int i = 1; i < 5; i++)
        cout << num[i] << "       ";`),
        hints: ['`*(++p)`: first move `p` one box forward, then write into that box.', 'The loop starts at `i = 1`, so `num[0]` is not printed.'],
        explain: 'Follow the arrow of `p`:\n\n- `p = num; *p = 20;` → num[0] = 20\n- `p = &num[1]; *(++p) = 30;` → p moves to num[2] first → num[2] = 30\n- `p = num + 4; *p = 30;` → num[4] = 30\n- `p = num; *(p + 3) = 40;` → num[3] = 40\n\nThe array is now {20, 2, 30, 40, 30}. The loop prints indexes 1 to 4, each followed by 7 spaces: `2       30       40       30       `.',
      },
    },
    {
      unit: 10,
      q: {
        id: 'pf-final-fall22-q1-v', kind: 'predict', tag: 'exam', source: `${T} · Q1(v)`, prompt: OUT,
        code: prog(cpp`
    int x[10]={0,1,2,3,4,5,6,7,8,9};
    int *ptr1,*ptr2;
    ptr1=x+2;
    ptr2=&x[9];
    cout<<*ptr1 * *ptr2;`),
        hints: ['`x + 2` points at `x[2]`.', 'In `*ptr1 * *ptr2`, the first and last `*` are dereferences and the middle one is multiplication.'],
        explain: '`ptr1 = x + 2` points at `x[2]` = 2 and `ptr2 = &x[9]` points at `x[9]` = 9. `*ptr1 * *ptr2` = 2 × 9 = **18**.',
      },
    },
    {
      unit: 8,
      q: {
        id: 'pf-final-fall22-q1-vi', kind: 'predict', tag: 'exam', source: `${T} · Q1(vi)`, prompt: OUT,
        code: progF(cpp`
int WHAT(int A[], int N){
    int ANS = 0;
    int S = 0;
    int E = N-1;
    for(S = 0, E = N-1; S < E; S++, E--)
        ANS += A[S] - A[E];
    return ANS;
}`, cpp`
    int A[] = {1, 2, 3, 4, -5, 1, 3, 2, 1};
    cout<< WHAT(A, 7);`),
        hints: ['Only the first 7 elements matter because N = 7, so E starts at 6.', 'S moves right and E moves left; the loop stops when they meet.'],
        explain: 'N = 7, so `S` starts at 0 and `E` at 6. Each step adds `A[S] - A[E]`:\n\n- S = 0, E = 6: 1 − 3 = −2 → ANS = −2\n- S = 1, E = 5: 2 − 1 = 1 → ANS = −1\n- S = 2, E = 4: 3 − (−5) = 8 → ANS = 7\n- S = 3, E = 3: `S < E` is false → stop.\n\nOutput: `7`.',
      },
    },
    {
      unit: 10,
      q: {
        id: 'pf-final-fall22-q1-vii', kind: 'predict', tag: 'exam', source: `${T} · Q1(vii)`, prompt: OUT,
        code: prog(cpp`
    int *a, *b, *c;
    int x = 800, y = 300;
    a = &x;
    b = &y;
    *a= (*b) - 200;
    cout<<x<<"    "<<*a;`),
        hints: ['`*a` is another name for `x`. `*b` is another name for `y`.'],
        explain: '`a` points at `x` and `b` points at `y`. `*a = (*b) - 200` means `x = 300 − 200 = 100`. Both `x` and `*a` are the same box, so it prints `100    100` (4 spaces in between). `c` is never used.',
      },
    },
    {
      unit: 7,
      q: {
        id: 'pf-final-fall22-q1-viii', kind: 'predict', tag: 'exam', source: `${T} · Q1(viii)`,
        prompt: 'Write the output of this program. *(In the paper, `x` is a `static` local variable inside `get()`: `int static x = 0;`. Our dry-run engine does not support `static` locals, so here `x` is a global variable — it behaves exactly the same: it is created once and keeps its value between calls.)*',
        code: progF(cpp`
int x = 0;   // paper: "int static x = 0;" inside get()

int get(int N=0)
{
    return x++;
}`, cpp`
    const int N = 6;
    int nums[] = { 1,2,3,4,5,6 };
    int idx=1;
    while (idx)
    {
        idx = get(get());
        if (idx >= N)
        {
            break;
        }
        cout << nums[idx] << endl;
    }`),
        hints: ['`x` keeps its value between calls. `return x++;` returns the old value, then adds 1.', 'Each loop pass calls `get` twice; `idx` gets the value of the **outer** (second) call.'],
        explain: 'Each call returns the current `x` and then increases it. The inner `get()` runs first, then the outer `get(...)` (its argument is ignored).\n\n- Pass 1: inner returns 0, outer returns **1** → idx = 1 → prints `nums[1]` = `2`\n- Pass 2: inner 2, outer **3** → prints `nums[3]` = `4`\n- Pass 3: inner 4, outer **5** → prints `nums[5]` = `6`\n- Pass 4: inner 6, outer **7** → 7 ≥ 6 → `break`.\n\nOutput:\n```\n2\n4\n6\n```\nWith `static int x` inside `get()` (the paper\'s version) the output is the same, because a static local is also created only once.',
      },
    },
    {
      unit: 6,
      q: {
        id: 'pf-final-fall22-q1-ix', kind: 'predict', tag: 'exam', source: `${T} · Q1(ix)`, prompt: OUT,
        code: prog(cpp`
    int i, j, var = 'A';
    for (i = 3; i >= 1; i--) {
        for (j = 0; j < i; j++)
        {
            if(((i+var + j))%4==0)
                continue;
            cout<<char (i+var + j);
        }
        cout<<endl;
    }`),
        hints: ['`var` holds 65 (the ASCII code of `A`). Work with numbers: 68 is `D`, 69 is `E` …', '`continue` skips printing when the number is a multiple of 4 (64, 68, 72 …).'],
        explain: '`var = \'A\'` stores **65**. For each (i, j) the code is `i + 65 + j`; multiples of 4 are skipped:\n\n- i = 3: j = 0 → 68 (`D`, 68 % 4 = 0 → skipped), j = 1 → 69 `E`, j = 2 → 70 `F` → line `EF`\n- i = 2: j = 0 → 67 `C`, j = 1 → 68 skipped → line `C`\n- i = 1: j = 0 → 66 `B` → line `B`\n\nOutput:\n```\nEF\nC\nB\n```',
      },
    },
    {
      unit: 7,
      q: {
        id: 'pf-final-fall22-q1-x', kind: 'predict', tag: 'exam', source: `${T} · Q1(x)`, prompt: OUT,
        code: progF(cpp`
void Sum(int a) {
    cout << a + 100 << endl;
}

void Sum(int a, int b, int c = 10) {
    cout << a + b + c << endl;
}`, cpp`
    Sum('A');
    Sum('B', 30);
    Sum(20, 30, 90.5);`),
        hints: ['The number of arguments picks the overload. A `char` argument becomes its ASCII code.', '`90.5` is passed to an `int` parameter, so it becomes 90.'],
        explain: '- `Sum(\'A\')`: one argument → `Sum(int a)`, a = 65 → prints `165`.\n- `Sum(\'B\', 30)`: two arguments → the 3-parameter version with `c = 10` (default) → 66 + 30 + 10 = `106`.\n- `Sum(20, 30, 90.5)`: `90.5` is converted to the `int` 90 (the fraction is cut off) → 20 + 30 + 90 = `140`.\n\nOutput:\n```\n165\n106\n140\n```',
      },
    },
    {
      unit: 7,
      q: {
        id: 'pf-final-fall22-q1-xi', kind: 'predict', tag: 'exam', source: `${T} · Q1(xi)`, prompt: OUT,
        code: cpp`
#include <iostream>
using namespace std;

void find(int , int& , int& ,int=4);
int main() {
    int one=1, two=2, three=3;
    find(one, two, three);
    cout <<one<<","<<two<<","<<three<<endl;
    return 0;
}
void find(int a, int& b, int& c, int d) {
    if(d<1)
        return;
    cout<<a<<","<<b<<","<<c<<endl;
    c = a + 2 * b;
    int temp = b;
    b = a;
    a = 2 * temp;
    d%2?find(b,a,c,d-1):find(c,b,a,d-1);
}
`,
        hints: ['`a` and `d` are copies; `b` and `c` are other names for the caller\'s variables. Draw which box each reference points to in every call.', 'd = 4 is even → `find(c, b, a, d-1)`; odd d → `find(b, a, c, d-1)`.'],
        explain: 'Call 1: `find(1, two, three, 4)` → prints `1,2,3`. three = 1 + 2×2 = **5**; temp = 2; two = **1**; a = 4. d = 4 is even → `find(c, b, a, 3)` = find(value 5, ref `two`, ref to call-1 `a`).\n\nCall 2: a = 5, b = two (1), c = a₁ (4), d = 3 → prints `5,1,4`. a₁ = 5 + 2 = 7; temp = 1; two = **5**; a = 2. d odd → `find(b, a, c, 2)` = find(value 5, ref a₂, ref a₁).\n\nCall 3: a = 5, b = a₂ (2), c = a₁ (7) → prints `5,2,7`. a₁ = 9; a₂ = 5; a = 4. d = 2 even → `find(c, b, a, 1)` = find(value 9, ref a₂, ref a₃).\n\nCall 4: a = 9, b = a₂ (5), c = a₃ (4) → prints `9,5,4`. Then the call with d = 0 returns at once.\n\nBack in `main`: one = 1 (passed by value), two = 5, three = 5.\n\nOutput:\n```\n1,2,3\n5,1,4\n5,2,7\n9,5,4\n1,5,5\n```',
      },
    },
    {
      unit: 10,
      q: {
        id: 'pf-final-fall22-q1-xii', kind: 'predict', tag: 'exam', source: `${T} · Q1(xii)`, prompt: OUT,
        code: progF(cpp`
char c[7][11] = {"PF-Final","PF","Exam","Students","lazy","2022", "programmer"};
char* add(char* ptr){
    return ptr + 11;
}
char* sub(char* ptr){
    return ptr - 11;
}`, cpp`
    char * mystery=c[4];
    cout<<mystery<<endl;
    cout<<sub(mystery)[2]<<endl;
    mystery= sub(mystery);
    cout<<mystery<<endl;
    cout<<sub(mystery) + 1 <<endl;
    cout<<add(add(mystery))+13<<endl;
    cout<<*add(add(mystery))<<endl;`),
        hints: ['Each row has exactly 11 chars and the rows sit one after another in memory. So `+ 11` jumps to the start of the next row and `- 11` to the previous row.', '`cout << charPointer` prints the text from that char up to `\\0`; `cout << *charPointer` prints one char.'],
        explain: 'Rows: c[0] "PF-Final", c[1] "PF", c[2] "Exam", c[3] "Students", c[4] "lazy", c[5] "2022", c[6] "programmer". One row = 11 chars, so `add` = next row, `sub` = previous row.\n\n1. `mystery` = c[4] → `lazy`\n2. `sub(mystery)` = c[3] = "Students", `[2]` → `u`\n3. `mystery = c[3]` → `Students`\n4. `sub(mystery) + 1` = c[2] + 1 → `xam`\n5. `add(add(mystery))` = c[5]; `+ 13` = 11 + 2 → c[6] + 2 → `ogrammer`\n6. `*add(add(mystery))` = first char of c[5] → `2`\n\nOutput:\n```\nlazy\nu\nStudents\nxam\nogrammer\n2\n```',
      },
    },
    {
      unit: 8,
      q: {
        id: 'pf-final-fall22-q1-xiii', kind: 'predict', tag: 'exam', source: `${T} · Q1(xiii)`,
        prompt: 'Write the output of this program. *(`::s` means the **global** `s`. In the paper the parameter is written `int list[][::s]`; here it is `int list[][3]`, which is the same thing, because our engine does not yet read a const variable as an array-parameter size.)*',
        code: progF(cpp`
const int s=3;
int* listMystery(int list[][3]){   // paper: int list[][::s]
    int i = 1,k=0;
    int *n = new int[::s];
    for(int i=0;i<::s;++i)
        n[i]=0;
    while(i < ::s)
    {
        int j = ::s - 1;
        while(j >= i)
        {
            n[k++]=list[j][i] * list[i][j];
            j = j - 1;
        }
        i = i + 1;
    }
    return n;
}
void displayMystery(int * arr){
    cout<<"[ ";
    for(int i=0;i<::s;++i)
        cout<<arr[i]<<(i!=(::s - 1)?" , ":" ");
    cout<<"]"<<endl;
}`, cpp`
    int L[][::s] = {{8, 9, 4}, {2, 3, 4}, {7, 6, 1}};
    int *ptr=listMystery(L);
    displayMystery(ptr);
    delete [] ptr;`),
        hints: ['The `for` loop has its own `i`; the `while` loop uses the outer `i`, which starts at **1**.', 'Pairs checked: (i, j) = (1, 2), (1, 1), (2, 2). Multiply `list[j][i]` by `list[i][j]`.'],
        explain: '`n` is a new heap array of 3 zeros. The `for` loop uses its own `i`, so the outer `i` is still **1** when the `while` starts.\n\n- i = 1, j = 2: n[0] = list[2][1] × list[1][2] = 6 × 4 = **24**\n- i = 1, j = 1: n[1] = list[1][1] × list[1][1] = 3 × 3 = **9**\n- i = 2, j = 2: n[2] = list[2][2] × list[2][2] = 1 × 1 = **1**\n\n`displayMystery` prints `" , "` after every element except the last, which gets `" "`.\n\nOutput: `[ 24 , 9 , 1 ]`. Then `delete [] ptr;` frees the heap array.',
      },
    },

    // ───────────── Question 2: complete Mirror_TwoD ─────────────
    {
      unit: 8,
      q: {
        id: 'pf-final-fall22-q2', kind: 'blanks', tag: 'exam', source: `${T} · Q2`,
        prompt: 'Complete the function `Mirror_TwoD`. It returns `true` if the 2D array is a **mirror**: (1) it is square, (2) all values on the main diagonal are the same, (3) the values above the diagonal are the same (and in the same order) as below it: `arr[i][j] == arr[j][i]`. Otherwise it returns `false`. Write one statement/expression per blank. Expected output: `1 1 0 0 0`.',
        code: progF(cpp`
bool Mirror_TwoD(int arr[][4], int rows, int cols) {
    if (rows != cols)
        return [[1]];
    for (int i = 0; i < rows; ++i) {
        if ([[2]])
            return false;
        for (int j = i + 1; j < cols; ++j) {
            if (arr[i][j] != arr[j][i])
                return false;
        }
    }
    return true;
}`, cpp`
    int a[4][4] = {{1, 2, 3, 4}, {2, 1, 6, 7}, {3, 6, 1, 9}, {4, 7, 9, 1}};
    int b[4][4] = {{5, 2, 2, 2}, {2, 5, 2, 2}, {2, 2, 5, 2}, {2, 2, 2, 5}};
    int c[4][4] = {{1, 2, 3, 4}, {2, 1, 6, 7}, {3, 6, 1, 9}, {4, 5, 9, 1}};
    int d[4][4] = {{5, 2, 2, 8}, {2, 5, 2, 2}, {8, 2, 5, 2}, {2, 5, 2, 5}};
    cout << Mirror_TwoD(a, 4, 4) << " " << Mirror_TwoD(b, 4, 4) << " ";
    cout << Mirror_TwoD(c, 4, 4) << " " << Mirror_TwoD(d, 4, 4) << " ";
    cout << Mirror_TwoD(a, 3, 4);`),
        blanks: [
          { answers: ['false', '0'], hint: 'Not square → not a mirror.' },
          { answers: ['arr[0][0] != arr[i][i]', 'arr[i][i] != arr[0][0]', '!(arr[0][0] == arr[i][i])', '!(arr[i][i] == arr[0][0])'], hint: 'Compare each diagonal value with the first one.' },
        ],
        chips: ['false', 'true', 'arr[i][i]', 'arr[0][0]', '!=', '=='],
        output: '1 1 0 0 0',
        hints: ['Rule 1 fails if `rows != cols` — what must the function return then?', 'Rule 2: every diagonal element `arr[i][i]` must equal the first one, `arr[0][0]`. Return false when they are different.'],
        explain: 'Blank 1: `false` — a non-square array can never be a mirror.\n\nBlank 2: `arr[0][0] != arr[i][i]` — if any diagonal value differs from the first diagonal value, rule 2 fails.\n\nThe inner loop (given) checks rule 3: every element above the diagonal `arr[i][j]` (j > i) must equal its mirror `arr[j][i]`.\n\nIn `main`: `a` and `b` are mirrors (1 1). In `c`, `arr[3][1]` is 5 but `arr[1][3]` is 7 (0). In `d`, `arr[0][3]` is 8 but `arr[3][0]` is 2 (0). `Mirror_TwoD(a, 3, 4)` is not square (0). Output: `1 1 0 0 0`.',
      },
    },

    // ───────────── Question 3: recursive Pell numbers ─────────────
    {
      unit: 7,
      q: {
        id: 'pf-final-fall22-q3', kind: 'task', tag: 'exam', source: `${T} · Q3`,
        prompt: '**Pell numbers:** P(N) = 2 × P(N−1) + P(N−2), with P(0) = 0 and P(1) = 1.\n\nWrite a **recursive** function `int pellNum(int n)` that returns the N-th Pell number. `main` reads `n` and prints `pellNum(n)`.\n\nRules (from the paper): **no loops, no `static` variables, no global variables** — zero marks otherwise.\n\nExample: input `5` → `29` (the list is 0, 1, 2, 5, 12, 29, …).',
        starter: cpp`
#include <iostream>
using namespace std;

int pellNum(int n)
{
    // write the recursive code here
}

int main() {
    int n;
    cin >> n;
    cout << pellNum(n) << endl; // Pell number at that position
    return 0;
}
`,
        solution: cpp`
#include <iostream>
using namespace std;

// returns the n-th Pell number: P(0) = 0, P(1) = 1, P(n) = 2*P(n-1) + P(n-2)
int pellNum(int n)
{
    if (n <= 1)          // base cases: P(0) = 0 and P(1) = 1
        return n;
    return 2 * pellNum(n - 1) + pellNum(n - 2);   // the rule, using two smaller calls
}

int main() {
    int n;
    cin >> n;
    cout << pellNum(n) << endl; // Pell number at that position
    return 0;
}
`,
        tests: [{ input: '0\n', label: 'n = 0' }, { input: '1\n', label: 'n = 1' }, { input: '5\n', label: 'n = 5' }, { input: '10\n', label: 'n = 10' }],
        compare: 'numbers',
        steps: [
          'Every recursive function needs a **base case** that returns without calling itself. Which values of n are given directly? P(0) = 0 and P(1) = 1.',
          'Notice that for both base cases the answer is n itself. So one `if (n <= 1) return n;` covers both.',
          'For bigger n, write the formula exactly as it is given: 2 × P(n−1) + P(n−2).',
          'Each `pellNum(n - 1)` and `pellNum(n - 2)` call solves a smaller problem, so the calls always reach the base case.',
          'Return the result of the formula: `return 2 * pellNum(n - 1) + pellNum(n - 2);`.',
          'Check by hand: P(2) = 2·1 + 0 = 2, P(3) = 2·2 + 1 = 5, P(4) = 2·5 + 2 = 12, P(5) = 2·12 + 5 = 29. So input 5 must print 29.',
        ],
        hints: ['Base case first: `if (n <= 1) return n;`', 'Then return 2 × (call with n−1) + (call with n−2).'],
        explain: 'Model answer:\n```\nint pellNum(int n) {\n    if (n <= 1) return n;\n    return 2 * pellNum(n - 1) + pellNum(n - 2);\n}\n```\nThe Pell numbers are 0, 1, 2, 5, 12, 29, 70, 169, 408, 985, 2378, … so n = 5 gives **29** and n = 10 gives **2378**. (The official key uses `if (n <= 2) return n;`, which also works because P(2) = 2.)',
      },
    },

    // ───────────── Question 4: middle character with two pointers ─────────────
    {
      unit: 10,
      q: {
        id: 'pf-final-fall22-q4', kind: 'blanks', tag: 'exam', source: `${T} · Q4`,
        prompt: 'Complete `findMidPosition`: it returns a pointer to the **middle character** of a C-string using **one single loop** (no nested loops, no built-in functions like `strlen`). For "abcde" it returns `c`. For an even length it returns the **second** middle: for "abcdef" it returns `d`. Idea: a slow pointer `sp` moves 1 step while a fast pointer `fp` moves 2 steps. Expected output: `c d a b`.',
        code: progF(cpp`
char* findMidPosition(char * sp)
{
    char* fp=sp;
    while ([[1]])
    {
        [[2]]
        [[3]]
    }
    return sp;
}`, cpp`
    char s1[] = "abcde";
    char s2[] = "abcdef";
    char s3[] = "a";
    char s4[] = "ab";
    cout << *findMidPosition(s1) << " " << *findMidPosition(s2) << " ";
    cout << *findMidPosition(s3) << " " << *findMidPosition(s4);`),
        blanks: [
          { answers: ["*fp != '\\0' && *(fp+1) != '\\0'", "*fp != '\\0' && *(fp + 1) != '\\0'", '*fp && *(fp + 1)', '*fp && *(fp+1)', "*fp != '\\0' && fp[1] != '\\0'", 'fp[0] && fp[1]'], hint: 'Keep going while fp is not on `\\0` AND the next char is not `\\0`.' },
          { answers: ['sp=sp+1;', 'sp = sp + 1;', 'sp++;', '++sp;', 'sp += 1;'], hint: 'The slow pointer moves one char.' },
          { answers: ['fp=fp+2;', 'fp = fp + 2;', 'fp += 2;'], hint: 'The fast pointer moves two chars.' },
        ],
        chips: ['*fp', "'\\0'", '*(fp + 1)', '&&', '!=', 'sp++;', 'fp += 2;'],
        output: 'c d a b',
        hints: ['When `fp` reaches the end of the string, `sp` has moved half as far — it is in the middle.', 'The fast pointer may only jump 2 chars if both the current char and the next one exist.'],
        explain: 'Model answer (the official key):\n```\nwhile (*fp != \'\\0\' && *(fp+1) != \'\\0\')\n{\n    sp = sp + 1;\n    fp = fp + 2;\n}\n```\n`fp` moves twice as fast as `sp`, so when `fp` hits the end, `sp` is at the middle.\n\n- "abcde": fp at a → c → e; at e the next char is `\\0` → stop. sp moved 2 times → `c`.\n- "abcdef": fp at a → c → e → `\\0` (index 6) → stop. sp moved 3 times → `d` (the second middle).\n- "a": the loop does not run → `a`. "ab": one step → `b`.\n\nOutput: `c d a b`.',
      },
    },

    // ───────────── Question 5: evaluate a polynomial ─────────────
    {
      unit: 10,
      q: {
        id: 'pf-final-fall22-q5', kind: 'blanks', tag: 'exam', source: `${T} · Q5`,
        prompt: 'Complete `CalcPoly`. `ptr` points to the coefficients a₀, a₁, …, aₙ (lowest power first), `size` is how many there are, `x` is the value, and the result is passed back in `value`: f(x) = a₀x⁰ + a₁x¹ + … + aₙxⁿ.\n\nRules: **no new variable** inside the function, do not change the return type, and use **only a `while` loop**. Then call the function in `main`. For {2, 3, 1, 2} and x = 4 the answer is `158`.',
        code: progF(cpp`
void CalcPoly(int *ptr, int size, int x, int &value)
{
    while ([[1]])
    {
        [[2]]
    }
}`, cpp`
    int arr[] = { 2, 3, 1, 2 };
    int output=0, x = 4, size=4;
    //Call CalcPoly function properly below
    [[3]]
    cout << output;`, '#include <cmath>\n'),
        blanks: [
          { answers: ['size-- > 0', 'size--', 'size-- != 0', '--size >= 0'], hint: 'Use `size` itself as the counter, counting down.' },
          { answers: ['value += *(ptr + size) * pow(x, size);', 'value += *(ptr+size) * pow(x, size);', 'value += ptr[size] * pow(x, size);', 'value = value + *(ptr + size) * pow(x, size);', 'value = value + ptr[size] * pow(x, size);'], hint: 'Add coefficient × x to the power of its index.' },
          { answers: ['CalcPoly(arr, size, x, output);', 'CalcPoly(arr,size,x,output);'], hint: 'The result must come back in `output`.' },
        ],
        chips: ['size--', '> 0', 'value +=', '*(ptr + size)', 'pow(x, size)', 'CalcPoly(', 'output'],
        output: '158',
        hints: ['Since you may not declare an index variable, count down with `size` itself: after `size-- > 0` is checked, `size` is already one smaller — exactly the index of the last coefficient.', 'Inside the loop add `*(ptr + size) * pow(x, size)` to `value` (it is a reference, so `main` sees it).'],
        explain: 'Model answer:\n```\nwhile (size-- > 0)\n{\n    value += *(ptr + size) * pow(x, size);\n}\n...\nCalcPoly(arr, size, x, output);\n```\n`size-- > 0` checks the old value and then decreases it, so the body runs with size = 3, 2, 1, 0:\n\n- size 3: 2 × 4³ = 128 → value = 128\n- size 2: 1 × 4² = 16 → 144\n- size 1: 3 × 4¹ = 12 → 156\n- size 0: 2 × 4⁰ = 2 → **158**\n\n`value` is a reference to `output`, so `main` prints `158`. (The paper\'s key also forgot the `;` after `cout << output` — it is added here.)',
      },
    },
  ],
};
