// Engine test programs for arrays, functions, references, pointers, dynamic memory and structs.
import type { Case } from './engine-test';

const P = (body: string, top = '', inc = '') => `${inc}#include <iostream>\nusing namespace std;\n${top}\nint main() {\n${body}\n    return 0;\n}\n`;

export const PF_CASES: Case[] = [
  // ---------------- arrays
  { name: 'arr-basic', code: P(`    int a[5] = {10, 20, 30};
    for (int i = 0; i < 5; i++) cout << a[i] << " ";
    cout << endl;
    a[4] = a[0] + a[1];
    cout << a[4] << " " << sizeof(a) << " " << sizeof(a) / sizeof(a[0]) << endl;`) },
  { name: 'arr-sum-max', code: P(`    int marks[] = {45, 78, 62, 91, 55};
    int n = 5, sum = 0, mx = marks[0];
    for (int i = 0; i < n; i++) {
        sum += marks[i];
        if (marks[i] > mx) mx = marks[i];
    }
    cout << "Sum: " << sum << " Max: " << mx << " Avg: " << (double)sum / n << endl;`) },
  { name: 'arr-input', code: P(`    int a[4];
    for (int i = 0; i < 4; i++) cin >> a[i];
    for (int i = 3; i >= 0; i--) cout << a[i] << ' ';
    cout << endl;`), input: '5 8 1 9\n' },
  { name: 'arr-linear-search', code: P(`    int a[6] = {4, 7, 1, 9, 7, 3};
    int key = 7, pos = -1;
    for (int i = 0; i < 6; i++) {
        if (a[i] == key) { pos = i; break; }
    }
    if (pos != -1) cout << "Found at " << pos << endl; else cout << "Not found" << endl;`) },
  { name: 'arr-bubble', code: P(`    int a[5] = {5, 1, 4, 2, 8};
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4 - i; j++)
            if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; }
    for (int x : a) cout << x << " ";
    cout << endl;`) },
  { name: 'arr-selection-swap', code: P(`    int a[] = {29, 10, 14, 37, 13};
    int n = sizeof(a) / sizeof(a[0]);
    for (int i = 0; i < n - 1; i++) {
        int m = i;
        for (int j = i + 1; j < n; j++) if (a[j] < a[m]) m = j;
        swap(a[i], a[m]);
    }
    for (int i = 0; i < n; i++) cout << a[i] << (i < n - 1 ? "," : "\\n");`) },
  { name: 'arr-2d', code: P(`    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int total = 0;
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            cout << m[r][c] << " ";
            total += m[r][c];
        }
        cout << endl;
    }
    cout << total << " " << sizeof(m) << " " << sizeof(m[0]) << endl;`) },
  { name: 'arr-2d-elision', code: P(`    int m[2][2] = {1, 2, 3};
    cout << m[0][0] << m[0][1] << m[1][0] << m[1][1] << endl;
    int z[3] = {};
    cout << z[0] + z[1] + z[2] << endl;`) },
  { name: 'arr-range-for-ref', code: P(`    int a[4] = {1, 2, 3, 4};
    for (int &x : a) x *= 10;
    for (auto x : a) cout << x << " ";
    cout << endl;
    string s = "abc";
    for (char c : s) cout << (char)(c - 32);
    cout << endl;`) },
  { name: 'arr-const-size', code: P(`    int a[N];
    for (int i = 0; i < N; i++) a[i] = i * i;
    cout << a[N - 1] << endl;`, 'const int N = 6;') },
  { name: 'arr-global-zero', code: P(`    cout << g[0] << g[4] << endl;
    g[2] = 7;
    cout << g[2] << endl;`, 'int g[5];') },
  { name: 'arr-vla', code: P(`    int n;
    cin >> n;
    int a[n];
    for (int i = 0; i < n; i++) a[i] = i + 1;
    cout << a[n - 1] << endl;`), input: '3\n' },
  { name: 'arr-strings', code: P(`    string names[3] = {"Ali", "Sara", "Omar"};
    for (int i = 0; i < 3; i++) cout << names[i][0];
    cout << " " << names[1].length() << endl;`) },
  { name: 'arr-char-counts', code: P(`    int freq[26] = {0};
    string w = "banana";
    for (char c : w) freq[c - 'a']++;
    cout << freq[0] << freq[1] << freq[13] << endl;`) },

  // ---------------- functions
  { name: 'fn-basic', code: P(`    cout << add(3, 4) << endl;
    int s = add(10, -2);
    greet();
    cout << s << endl;`, `int add(int a, int b) {
    return a + b;
}
void greet() {
    cout << "Hello!" << endl;
}`) },
  { name: 'fn-prototype', code: P(`    cout << square(5) << " " << isEven(7) << endl;`, `int square(int x);
bool isEven(int n);`) + `int square(int x) {
    return x * x;
}
bool isEven(int n) {
    return n % 2 == 0;
}
` },
  { name: 'fn-by-value-vs-ref', code: P(`    int a = 5, b = 5;
    byValue(a);
    byRef(b);
    cout << a << " " << b << endl;
    int x = 1, y = 2;
    swapRef(x, y);
    cout << x << y << endl;`, `void byValue(int n) { n = n * 10; }
void byRef(int &n) { n = n * 10; }
void swapRef(int &p, int &q) {
    int t = p;
    p = q;
    q = t;
}`) },
  { name: 'fn-default-overload', code: P(`    cout << area(4) << " " << area(4, 2) << " " << area(2.5) << endl;
    cout << power(3) << " " << power(2, 5) << endl;`, `int area(int l, int w = 1) { return l * w; }
double area(double r) { return 3.14 * r * r; }
long long power(int b, int e = 2) {
    long long r = 1;
    for (int i = 0; i < e; i++) r *= b;
    return r;
}`) },
  { name: 'fn-recursion', code: P(`    cout << fact(5) << " " << fib(10) << " " << sumDigits(9875) << endl;
    countdown(3);`, `int fact(int n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
}
int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}
int sumDigits(int n) {
    if (n == 0) return 0;
    return n % 10 + sumDigits(n / 10);
}
void countdown(int n) {
    if (n == 0) { cout << "Go!" << endl; return; }
    cout << n << " ";
    countdown(n - 1);
}`) },
  { name: 'fn-array-param', code: P(`    int a[5] = {3, 9, 2, 7, 5};
    printArr(a, 5);
    doubleAll(a, 5);
    printArr(a, 5);
    cout << maxOf(a, 5) << endl;`, `void printArr(int arr[], int n) {
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    cout << endl;
}
void doubleAll(int arr[], int n) {
    for (int i = 0; i < n; i++) arr[i] *= 2;
}
int maxOf(const int arr[], int n) {
    int m = arr[0];
    for (int i = 1; i < n; i++) if (arr[i] > m) m = arr[i];
    return m;
}`) },
  { name: 'fn-2d-param', code: P(`    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    cout << rowSum(m, 1) << endl;`, `int rowSum(int a[][3], int r) {
    int s = 0;
    for (int c = 0; c < 3; c++) s += a[r][c];
    return s;
}`) },
  { name: 'fn-scope-global', code: P(`    cout << counter << endl;
    bump(); bump();
    cout << counter << endl;
    int counter = 100;
    cout << counter << " " << ::counter << endl;`, `int counter = 0;
void bump() { counter++; }`).replace(' << ::counter', '') },
  { name: 'fn-string-param', code: P(`    string s = "hello";
    cout << shout(s) << " " << s << endl;
    string t = "abc";
    reverseIt(t);
    cout << t << endl;`, `string shout(string s) {
    for (int i = 0; i < (int)s.length(); i++) s[i] = toupper(s[i]);
    return s + "!";
}
void reverseIt(string &s) {
    int n = s.length();
    for (int i = 0; i < n / 2; i++) swap(s[i], s[n - 1 - i]);
}`) },
  { name: 'fn-returns-in-loop', code: P(`    for (int i = 1; i <= 10; i++) if (isPrime(i)) cout << i << " ";
    cout << endl;`, `bool isPrime(int n) {
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++)
        if (n % d == 0) return false;
    return true;
}`) },

  // ---------------- pointers
  { name: 'ptr-basic', code: P(`    int x = 10;
    int* p = &x;
    cout << *p << endl;
    *p = 25;
    cout << x << endl;
    int y = 3;
    p = &y;
    *p += 1;
    cout << x << " " << y << " " << (p == &y) << endl;`) },
  { name: 'ptr-arith', code: P(`    int a[5] = {10, 20, 30, 40, 50};
    int* p = a;
    cout << *p << " " << *(p + 2) << " " << p[3] << endl;
    p++;
    cout << *p << endl;
    p += 2;
    cout << *p << " " << p - a << endl;
    for (int* q = a; q < a + 5; q++) cout << *q / 10;
    cout << endl;`) },
  { name: 'ptr-null', code: P(`    int* p = nullptr;
    if (p == nullptr) cout << "null" << endl;
    int* q = NULL;
    if (!q) cout << "also null" << endl;
    int v = 4;
    q = &v;
    if (q) cout << *q << endl;`) },
  { name: 'ptr-swap', code: P(`    int a = 1, b = 2;
    swapP(&a, &b);
    cout << a << " " << b << endl;`, `void swapP(int* x, int* y) {
    int t = *x;
    *x = *y;
    *y = t;
}`) },
  { name: 'ptr-to-ptr', code: P(`    int x = 5;
    int* p = &x;
    int** pp = &p;
    **pp = 9;
    cout << x << " " << *p << endl;`) },
  { name: 'ptr-const', code: P(`    int x = 5, y = 6;
    const int* p = &x;
    p = &y;
    cout << *p << endl;
    int* const q = &x;
    *q = 50;
    cout << x << endl;`) },
  { name: 'ptr-char-array', code: P(`    char s[] = "Hello";
    char* p = s;
    while (*p != '\\0') {
        cout << *p << "-";
        p++;
    }
    cout << endl << s << " " << sizeof(s) << endl;`) },
  { name: 'dyn-single', code: P(`    int* p = new int;
    *p = 42;
    cout << *p << endl;
    delete p;
    p = nullptr;
    double* d = new double(2.5);
    cout << *d * 2 << endl;
    delete d;`) },
  { name: 'dyn-array', code: P(`    int n;
    cin >> n;
    int* arr = new int[n];
    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 3;
    int sum = 0;
    for (int i = 0; i < n; i++) sum += arr[i];
    cout << sum << endl;
    delete[] arr;`), input: '4\n' },
  { name: 'dyn-2d', code: P(`    int r = 2, c = 3;
    int** m = new int*[r];
    for (int i = 0; i < r; i++) m[i] = new int[c];
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) m[i][j] = i * 10 + j;
    cout << m[1][2] << endl;
    for (int i = 0; i < r; i++) delete[] m[i];
    delete[] m;`) },
  { name: 'dyn-init', code: P(`    int* a = new int[4]{1, 2};
    cout << a[0] << a[1] << a[2] << a[3] << endl;
    int* z = new int();
    cout << *z << endl;
    delete[] a;
    delete z;`) },
  { name: 'fn-return-ptr', code: P(`    int a[5] = {4, 9, 2, 9, 1};
    int* m = findMax(a, 5);
    *m = 0;
    for (int i = 0; i < 5; i++) cout << a[i];
    cout << endl;
    int* made = makeArray(3);
    cout << made[2] << endl;
    delete[] made;`, `int* findMax(int arr[], int n) {
    int* best = &arr[0];
    for (int i = 1; i < n; i++) if (arr[i] > *best) best = &arr[i];
    return best;
}
int* makeArray(int n) {
    int* p = new int[n];
    for (int i = 0; i < n; i++) p[i] = i * 100;
    return p;
}`) },

  // ---------------- C strings
  { name: 'cstring', code: P(`    char a[20] = "Hello";
    char b[] = "World";
    cout << strlen(a) << endl;
    strcat(a, " ");
    strcat(a, b);
    cout << a << " " << strlen(a) << endl;
    char c[20];
    strcpy(c, a);
    cout << c << endl;
    cout << (strcmp("abc", "abd") < 0) << (strcmp(b, "World") == 0) << endl;`, '', '#include <cstring>\n') },
  { name: 'cstring-input', code: P(`    char name[20];
    cin >> name;
    char line[30];
    cin.ignore();
    cin.getline(line, 30);
    cout << name << "|" << line << "|" << strlen(line) << endl;`, '', '#include <cstring>\n'), input: 'Ali\nGood morning all\n' },
  { name: 'cstring-manual', code: P(`    char s[] = "Programming";
    int count = 0;
    for (int i = 0; s[i] != '\\0'; i++)
        if (s[i] == 'm' || s[i] == 'g') count++;
    cout << count << endl;
    for (int i = 0; s[i]; i++) s[i] = toupper(s[i]);
    cout << s << endl;`) },

  // ---------------- structs
  { name: 'struct-basic', code: P(`    Student s1;
    s1.name = "Ali";
    s1.age = 20;
    s1.gpa = 3.5;
    Student s2 = {"Sara", 19, 3.9};
    cout << s1.name << " " << s1.age << " " << s1.gpa << endl;
    cout << s2.name << " " << s2.age << " " << s2.gpa << endl;
    s1 = s2;
    s1.age++;
    cout << s1.name << s1.age << s2.age << endl;`, `struct Student {
    string name;
    int age;
    double gpa;
};`) },
  { name: 'struct-array', code: P(`    Item cart[3] = {{"Pen", 20, 3}, {"Book", 150, 1}, {"Bag", 900, 1}};
    int total = 0;
    for (int i = 0; i < 3; i++) total += cart[i].price * cart[i].qty;
    cout << "Total: " << total << endl;
    int best = 0;
    for (int i = 1; i < 3; i++) if (cart[i].price > cart[best].price) best = i;
    cout << cart[best].name << endl;`, `struct Item {
    string name;
    int price;
    int qty;
};`) },
  { name: 'struct-fn', code: P(`    Point a = {1, 2}, b = {4, 6};
    cout << dist2(a, b) << endl;
    moveBy(a, 10);
    cout << a.x << "," << a.y << endl;
    Point m = mid(a, b);
    cout << m.x << "," << m.y << endl;`, `struct Point {
    int x, y;
};
int dist2(Point p, Point q) {
    int dx = p.x - q.x, dy = p.y - q.y;
    return dx * dx + dy * dy;
}
void moveBy(Point &p, int d) {
    p.x += d;
    p.y += d;
}
Point mid(const Point &p, const Point &q) {
    Point r;
    r.x = (p.x + q.x) / 2;
    r.y = (p.y + q.y) / 2;
    return r;
}`) },
  { name: 'struct-ptr', code: P(`    Box b = {3, 4};
    Box* p = &b;
    p->w = 10;
    (*p).h = 20;
    cout << b.w << " " << b.h << " " << p->w * p->h << endl;
    Box* h = new Box;
    h->w = 1;
    h->h = 2;
    cout << h->w + h->h << endl;
    delete h;`, `struct Box {
    int w;
    int h;
};`) },
  { name: 'struct-nested', code: P(`    Emp e = {"Zara", {12, 5, 2020}, 55000};
    cout << e.name << " joined " << e.joined.d << "/" << e.joined.m << "/" << e.joined.y << endl;
    e.joined.y += 1;
    cout << e.joined.y << " " << sizeof(Date) << endl;`, `struct Date {
    int d, m, y;
};
struct Emp {
    string name;
    Date joined;
    int salary;
};`) },
  { name: 'struct-default-member', code: P(`    Counter c;
    c.count += 5;
    cout << c.count << " " << c.label << endl;`, `struct Counter {
    int count = 10;
    string label = "clicks";
};`) },

  // ---------------- compile errors (same line as g++)
  { name: 'E-arr-too-many', code: P(`    int a[3] = {1, 2, 3, 4};`), compileErrorLine: 5 },
  { name: 'E-arr-assign', code: P(`    int a[3] = {1, 2, 3};
    int b[3];
    b = a;`), compileErrorLine: 7 },
  { name: 'E-arr-no-size', code: P(`    int a[];`), compileErrorLine: 5 },
  { name: 'E-cin-array', code: P(`    int a[3];
    cin >> a;`), compileErrorLine: 6 },
  { name: 'E-fn-undeclared', code: P(`    cout << twice(4);`) + 'int twice(int x) { return 2 * x; }\n', compileErrorLine: 5 },
  { name: 'E-fn-too-few', code: P(`    cout << add(1);`, 'int add(int a, int b) { return a + b; }'), compileErrorLine: 6 },
  { name: 'E-fn-too-many', code: P(`    cout << add(1, 2, 3);`, 'int add(int a, int b) { return a + b; }'), compileErrorLine: 6 },
  { name: 'E-fn-void-value', code: P(`    int x = hello();`, 'void hello() { cout << "hi"; }'), compileErrorLine: 6 },
  { name: 'E-fn-void-return-value', code: P(`    show();`, 'void show() {\n    return 5;\n}'), compileErrorLine: 5 },
  { name: 'E-ref-rvalue', code: P(`    inc(5);`, 'void inc(int &n) { n++; }'), compileErrorLine: 6 },
  { name: 'E-ptr-from-int', code: P(`    int x = 5;
    int* p = x;`), compileErrorLine: 6 },
  { name: 'E-ptr-type', code: P(`    double d = 1.5;
    int* p = &d;`), compileErrorLine: 6 },
  { name: 'E-deref-int', code: P(`    int x = 5;
    cout << *x;`), compileErrorLine: 6 },
  { name: 'E-ptr-cmp-int', code: P(`    int x = 5;
    int* p = &x;
    if (p == 5) cout << "?";`), compileErrorLine: 7 },
  { name: 'E-const-ptr', code: P(`    int x = 5;
    const int* p = &x;
    *p = 6;`), compileErrorLine: 7 },
  { name: 'E-struct-no-member', code: P(`    S s;
    s.agee = 5;`, 'struct S { int age; };'), compileErrorLine: 7 },
  { name: 'E-struct-dot-on-ptr', code: P(`    S s;
    S* p = &s;
    p.age = 5;`, 'struct S { int age; };'), compileErrorLine: 8 },
  { name: 'E-struct-missing-semi', code: '#include <iostream>\nusing namespace std;\nstruct S {\n    int a;\n}\nint main() {\n    return 0;\n}\n', compileErrorLine: 5 },
  { name: 'E-struct-cout', code: P(`    S s = {1};
    cout << s;`, 'struct S { int a; };'), compileErrorLine: 7 },
  { name: 'E-delete-int', code: P(`    int x = 5;
    delete x;`), compileErrorLine: 6 },
  { name: 'E-strlen-string', code: P(`    string s = "abc";
    cout << strlen(s);`, '', '#include <cstring>\n'), compileErrorLine: 7 },
  { name: 'E-char-too-long', code: P(`    char s[3] = "abcd";`), compileErrorLine: 5 },
  { name: 'E-ref-uninit', code: P(`    int& r;`), compileErrorLine: 5 },
  { name: 'E-return-no-value', code: P(`    cout << f();`, 'int f() {\n    return;\n}'), compileErrorLine: 5 },
  // ---------------- misc
  { name: 'while-cin', code: P(`    int x, sum = 0, count = 0;
    while (cin >> x) {
        sum += x;
        count++;
    }
    cout << sum << " " << count << endl;`), input: '3 4 5\n' },
  { name: 'string-methods-2', code: P(`    string s = "Hello World";
    s.insert(5, ",");
    cout << s << endl;
    s.erase(0, 7);
    cout << s << " " << s.find('o') << endl;
    const char* c = s.c_str();
    cout << c[0] << endl;`) },
  { name: 'algo-sort', code: P(`    int a[6] = {5, 2, 9, 1, 7, 3};
    sort(a, a + 6);
    for (int x : a) cout << x;
    cout << endl;
    reverse(a, a + 6);
    for (int x : a) cout << x;
    cout << endl;`, '', '#include <algorithm>\n') },
  { name: 'fn-call-in-cond', code: P(`    int n = 0;
    while (next(n) < 5) cout << n << " ";
    cout << endl;`, `int next(int &k) {
    k++;
    return k;
}`) },
  { name: 'fn-global-array', code: P(`    for (int i = 0; i < 3; i++) push(i * i);
    cout << top << ":" << stack[0] << stack[1] << stack[2] << endl;`, `int stack[10];
int top = 0;
void push(int v) {
    stack[top] = v;
    top++;
}`) },
  { name: 'ptr-struct-array', code: P(`    P arr[2] = {{1, 2}, {3, 4}};
    P* q = arr;
    q++;
    cout << q->a << (q - 1)->b << endl;`, 'struct P { int a, b; };') },
  { name: 'char-arr-loop-len', code: P(`    char w[] = "racecar";
    int n = 0;
    while (w[n] != '\\0') n++;
    bool pal = true;
    for (int i = 0; i < n / 2; i++) if (w[i] != w[n - 1 - i]) pal = false;
    cout << n << " " << pal << endl;`) },
  { name: 'const-ref-temp', code: P(`    show("Hamza");
    string s = "Ali";
    show(s + "!");`, 'void show(const string &n) { cout << "[" << n << "]" << endl; }') },
  { name: 'string-plus-chararr', code: P(`    char a[10] = "Hello", b[10] = "World";
    string full = a;
    full += " ";
    full += b;
    cout << full << " " << (full == "Hello World") << endl;`) },
  { name: 'global-scope-op', code: P(`    int Mystery = 6;
    cout << Mystery << " " << ::Mystery << endl;
    ::Mystery++;
    cout << ::Mystery << endl;`, 'int Mystery = 10;') },
  { name: 'switch-empty-body', code: P(`    int x = 2;
    switch (x);
    {
        cout << "block runs" << endl;
    }`) },
  { name: 'global-const-2d-param', code: P(`    int a[MAX][MAX] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    cout << sum(a, MAX) << " " << a[2][1] << endl;`, `const int MAX = 3;
int sum(int m[][MAX], int n) {
    int s = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < MAX; j++) s += m[i][j];
    return s;
}`) },
];
