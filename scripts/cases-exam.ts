// Past-paper style "find the output or the error" programs (FAST PF sessionals / midterms).
import type { Case } from './engine-test';

const M = (body: string, top = '', inc = '') => `${inc}#include <iostream>\nusing namespace std;\n${top}\nint main() {\n${body}\n    return 0;\n}\n`;
const CM = '#include <cmath>\n';
const IO = '#include <iomanip>\n';

export const EXAM_CASES: Case[] = [
  { name: 'X-mod-double', code: M('    double x = static_cast<int>(7.7); int y = 3;\n    cout << x % y;'), compileErrorLine: 6 },
  { name: 'X-pow-mod', code: M('    cout << pow(2,3) % 2 << endl;', '', CM), compileErrorLine: 6 },
  { name: 'X-char-div', code: M("    int easy = 3 *(-48 + 16 + 'a' / 2);\n    cout << easy << endl;") },
  { name: 'X-chain-undeclared', code: M('    int a = b = c = d = e = 10;\n    a += b += c += d += e;\n    cout << a;'), compileErrorLine: 5 },
  { name: 'X-chain-ok', code: M('    int a, b, c, d, e;\n    a = b = c = d = e = 10;\n    a += b += c += d += e;\n    cout << a << " " << b << " " << c << " " << d << " " << e;') },
  { name: 'X-short-wrap', code: M('    short int s = 65536;\n    if(s) cout << "True"; else cout << "False";') },
  { name: 'X-char-assign-if', code: M('    unsigned short int u = 65792;\n    char ch;\n    if(ch=u) cout << true; else cout << false;') },
  { name: 'X-uchar-plus', code: M('    unsigned char c = 250;\n    c += 72;\n    cout << static_cast<char>(c) << endl;') },
  { name: 'X-uchar-888', code: M('    unsigned char ch = 888;\n    cout << ch << endl;') },
  { name: 'X-chained-compare', code: M('    int a=5,b=15,c=4,d=1;\n    a += b > c > d;\n    cout << a << endl;') },
  { name: 'X-if-assign-pow', code: M('    int a = 5, b = 0;\n    if (a = b) cout << pow(a,b); else cout << pow(b,a);', '', CM) },
  { name: 'X-eq-minus', code: M('    int a=10, b=30; double c=37;\n    b = c - b - a;\n    b =- 10;\n    cout << b << endl;') },
  { name: 'X-cast-mod', code: M('    double x = 5.5;\n    cout << (static_cast<int>(x) % 3 + x * 2) << endl;') },
  { name: 'X-lvalue-chain', code: M('    int a,b,c,d,e;\n    a = b = c*3 = d+5 = e = 10;'), compileErrorLine: 6 },
  { name: 'X-not-not', code: M('    int a = 25;\n    cout << !(!(a));') },
  { name: 'X-short-circuit-block', code: M(`    int x = 10, y = 5, z = 3, u = 4;
    if ((y-=2)<(x+=3) && (z+=1)<= y-1){
        if (x > y || (u+=1) <= y)
            cout<<x+y*z-z%u<<endl;
        cout<<z/u<<endl;}
    cout <<x<<y<<endl<<z<<u<<endl;`) },
  { name: 'X-short-pow', code: M('    short int a = 65536;   int b = 25/4;\n    double c = pow(2.5, 2);\n    a = a + b * c;\n    double d = a / b;\n    cout << d << endl;', '', CM) },
  { name: 'X-if-traps', code: M(`    int x = 1, y=2;
    if(y=0)
        cout << "A";
    else if(y && (x=9))
        cout << "B"; cout<< "C";
    if(x>2); else cout << "D";
    if(x<2 && y<x || y == 0) cout << "E";
    if(x<0);
    {    cout<<"A";    }`) },
  { name: 'X-else-without-if', code: M(`    int a = 10/3 + 18%5;
    int b = (a*5) / 7;
    int c = pow(2,3) + b;
    if (a > b && b != 0 && (a*b)/b == a)
        if (c % a == 0 || (b - c) < 0)
            cout << a + b + c;
            cout << c - a;
    else
        cout << a * b - c;`, '', CM), compileErrorLine: 12 },
  { name: 'X-char-128', code: M(`    char ch=128;
    if(ch>0)
        cout<<static_cast<int>(ch)<<endl;
    ch=-129;
    if(!(ch<0))
        cout<<static_cast<int>(ch)<<endl;
    ch = ('a'-'A')*2+5;
    cout<<ch<<endl;`) },
  { name: 'X-char-val', code: M(`    char ch = 'd';
    int val = ch - 'a';
    int a = 14/3 + val;
    double z = a / 2.0;
    if (a % 2 == 1 && z > 3) cout << static_cast<int>(z * 2);
    else cout << a;`) },
  { name: 'X-pow-cast', code: M(`    double d = pow(3.0, 3) / 2;
    int x = static_cast<int>(d) - (5/2);
    if(x > 10 && d - x < 1.0)cout << x + static_cast<int>(d);
    else cout << x - static_cast<int>(d);`, '', CM) },
  { name: 'X-dangling-else-grades', code: M(`    int marks = 85;
    if (marks >= 50) cout << "Grade D\\n";
        if (marks >= 60) cout << "Grade C\\n";
            if (marks >= 70) cout << "Grade B\\n";
                if (marks >= 80) cout << "Grade A\\n";
                    if (marks >= 90) cout << "Grade A+\\n";
    else cout << "Failed" ;`) },
  { name: 'X-report-card', code: M(`    double x;
    cout << "Enter a number: ";
    x=52;
    cout<<x;
    cout << "\\nReport Card\\n";
    cout << "============\\n";
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
        cout << "Note:\\rEven number detected.";
    else
        cout << "Note:\\\\tOdd number detected.";
    cout << "\\nPath: C:\\\\\\\\Users\\\\\\\\Public\\t" << static_cast<int>(x + bonus) << endl;`, '', IO) },
  { name: 'X-bitwise-ternary', code: M('    int a = 5, b = 3, c = 2, d = 4;\n    int result = (a & b) ? ((c << 1) ^ d) : ((b | d) ? (a >> 1) : (c & d));\n    cout << result << endl;') },
  { name: 'X-while-empty', code: M('    int i = 8, counter = 5;\n    while (--i > 0 && (counter += 1)) {    }\n    cout << counter;') },
  { name: 'X-cout-cout', code: M(`    char target = 'D', marker = 'A';
    int result = 5;
    cout << target << "/n" << cout << result << endl;`), compileErrorLine: 7 },
  { name: 'X-bit16', code: M(`    int num1 = 1, num2 = 6;
    while (!(num1 & 16)) {
        if (num1 == 3 || num1 == 6 || num1 == 9 || num1 == 12) {
            num2++;
        }
        num1++;
    }
    cout << (num2 % 5);`) },
  { name: 'X-evaluate-compute', code: M('    int x = 10, y = 5;\n    cout << "Result = " << compute(x, y) << endl;', `int evaluate(int x, int y) {
    if ((x ^ y) & 1) { return (x > y) ? (x - y) : (y - x); }
    else { if ((x & y) == 0) { return (x > y) ? (x >> 1) : (y >> 1); }
           else { return (x > y) ? (x - y) : (y - x); } } }
int compute(int x, int y) {
    if (!(x ^ y)) { return x; }
    int diff = evaluate(x, y);
    return (x > y) ? compute(diff, y) : compute(x, diff); }`) },
  { name: 'X-pattern-break', code: M(`    int totalLines = 5;
    for (int r = totalLines; r >= 1; r--) {
        for (int s = 1; s < r; s++) {
            cout << "^"; }
        for (int c = 1; c <= 5; c += 2) {
            if (r == 2 && c > 3) {
                break; }
            cout << "$"; }
        cout << endl; }`) },
  { name: 'X-fun123', code: `#include <iostream>
using namespace std;
void fun3(int x, int &sum);
void fun2(int x, int &sum);
void fun1(int x, int &sum);
int main() {
    int total = 0;
    fun1(2, total);
    cout << total;
    return 0;
}
void fun3(int x, int &sum) {
    if (x == 6)
        return;
    sum += 8;
    return;
    sum += 20;
    x++; }
void fun2(int x, int &sum) {
    fun3(x + 1, sum);
    sum += 4; }
void fun1(int x, int &sum) {
    fun2(x + 2, sum);
    sum += 3; }
` },
  { name: 'X-collatz-calc', code: M('    cout << "Final Result: " << calc(5, 5) << endl;', `int calc(int x, int s) {
    if (x <= 1)
        return s;
    if (x % 2 == 0)
        return calc(x / 2, s + x);
    else
        return calc(3 * x + 1, s - 1) + x; }`) },
  { name: 'X-binary-search', code: M(`    int a[] = {8, 14, 21, 35};
    int l = 0, h = 3, k = 14;
    int ans = -1;
    while (l <= h) {
        int m = (l + h) / 2;
        if (a[m] == k) {
            ans = m;
            break; }
        if (k < a[m])
            h = m - 1;
        else
            l = m + 1; }
    cout << ans;`) },
  { name: 'X-calculate-switch', code: M(`    int i, j, m, answer;
    m = 0, j = 2;
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
            } }
        m = m + 1;
        cout << endl; }`, `int calculate(int i, int m) {
    int value = (i * m * 2) + 20;
    value = 20 + (value % 20);
    return value; }`) },
  { name: 'X-nested-if-div', code: M(`    int x = 5, y = 30;
    if(y/x > 2){
        if(y % x !=2)
            x = x + 2; cout<<x<<"\\n"<<y;}
    cout<<x<<y;`) },
  { name: 'X-float-to-int', code: M('    int a =8;\n    float b=4.5;\n    a=b+3;\n    cout<< a+b;') },
  { name: 'X-assign-in-expr', code: M('    int a=6+1, b=0, c=2;\n    a = 3 + (b =5) ;\n    c=c+a*5+( c+17) ;\n    cout<<a<<b<<c;') },
  { name: 'X-if-no-braces', code: M(`    int n = 10;
    if(n>0)
        cout<< "n is positive\\n";
    if(n>10)
    cout<<"n is greater than 10";
    cout<< " The value of n:"<<n;
    if(n<100)
        cout<<"\\n n is less than 100";`) },
  { name: 'X-and-or-mix', code: M('    int x=2, y=11, z=20;\n    if(x>16 && y>x || z%2==0 )\n        cout<<"Hello World";\n    else\n        cout<< "BYE";') },
  { name: 'X-switch0', code: M(`    int a=7,b=6,c=0;
    switch(0){
        case 1:
            a=6; b=8;
            cout<<a<<endl;
        case 0:
            b=a+c;
            cout<<b<<endl;
        default:
            c=b+3;
            cout<<c<<endl;}
    cout<<a<<" "<<b<<" "<<c;`) },
  { name: 'X-err-cout-less', code: M('    int a = 1, b = 2, sum;\n    sum = a+b;\n    cout<sum;'), compileErrorLine: 7 },
  { name: 'X-err-lvalue-sum', code: M('    int a, b, c;\n    a + b = c;'), compileErrorLine: 6 },
  { name: 'X-cout-in-if', code: M('    if (cout << 0) cout << "A";\n    int i = 0;\n    while (cout << "*" && i < 3) i++;\n    cout << endl;') },
  { name: 'X-cout-in-for', code: M('    for (int i = 0; cout << i, i < 3; i++) cout << "-";\n    cout << endl;') },
  { name: 'X-comma-ops', code: M('    int a = (1, 2, 3);\n    int b;\n    b = 4, 5;\n    cout << a << b << endl;') },
];
