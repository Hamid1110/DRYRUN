// Runs a corpus of programs through the DryRun engine and through real g++,
// and checks that the console output is identical.
// Usage: npx tsx scripts/engine-test.ts [--verbose]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runProgram } from '../src/engine';
import { PF_CASES } from './cases-pf';
import { EXAM_CASES } from './cases-exam';

export interface Case {
  name: string;
  code: string;
  input?: string;
  /** expect a compile error on this line */
  compileErrorLine?: number;
}

const H = '#include <iostream>\nusing namespace std;\n';
const wrap = (body: string, extraInc = '') => `${extraInc}${H}\nint main() {\n${body}\n    return 0;\n}\n`;

export const CASES: Case[] = [
  { name: 'hello', code: wrap('    cout << "Hello, World!" << endl;') },
  { name: 'chain', code: wrap('    cout << "Hello" << " " << "World";\n    cout << "!";\n    cout << endl << "Next line";') },
  { name: 'newlines', code: wrap('    cout << "A\\nB" << endl;\n    cout << \'\\n\';\n    cout << "C" << "\\n" << "D\\n\\n";\n    cout << endl;') },
  { name: 'escapes', code: wrap('    cout << "Name:\\tAli\\n";\n    cout << "She said \\"Hi\\"" << endl;\n    cout << "C:\\\\Users\\\\ali" << endl;\n    cout << "It\'s" << \'\\\'\' << endl;\n    cout << "a\\tbb\\tccc\\tdddddddd\\te" << endl;') },
  { name: 'text-vs-math', code: wrap('    cout << 5 + 3 << endl;\n    cout << "5 + 3" << endl;\n    cout << "5" << 3 << endl;\n    cout << 7 / 2 << " " << 7 % 2 << " " << 7.0 / 2 << endl;\n    cout << 10 - 2 * 3 << " " << (10 - 2) * 3 << endl;\n    cout << -7 / 2 << " " << -7 % 2 << endl;') },
  { name: 'doubles', code: wrap('    cout << 2.50 << " " << 3.0 << " " << 1.0 / 3 << " " << 1e7 << " " << 0.1 + 0.2 << endl;\n    cout << 100.0 / 3.0 << " " << 2.0 / 3 * 3 << " " << 123456.789 << " " << 1234567.0 << endl;') },
  { name: 'char-math', code: wrap('    char c = \'A\';\n    cout << c << " " << c + 1 << " " << (char)(c + 1) << endl;\n    char d = c + 2;\n    cout << d << endl;\n    int code = \'a\';\n    cout << code << endl;') },
  { name: 'bools', code: wrap('    bool ok = 5 > 3;\n    cout << ok << " " << (2 > 9) << endl;\n    cout << boolalpha << ok << " " << !ok << endl;') },
  { name: 'vars', code: wrap('    int a = 5, b;\n    b = 10;\n    a = a + 2;\n    int temp = a;\n    a = b;\n    b = temp;\n    cout << a << " " << b << endl;\n    double avg = (a + b) / 2;\n    double avg2 = (a + b) / 2.0;\n    cout << avg << " " << avg2 << endl;\n    int t = 3.99;\n    cout << t << endl;') },
  { name: 'compound', code: wrap('    int x = 10;\n    x += 5;\n    x -= 3;\n    x *= 2;\n    x /= 5;\n    x %= 3;\n    cout << x << endl;\n    int i = 5;\n    int y = i++;\n    int z = ++i;\n    cout << i << " " << y << " " << z << endl;\n    i--;\n    --i;\n    cout << i << endl;') },
  { name: 'cin-sum', code: wrap('    int a, b;\n    cout << "Enter two numbers: ";\n    cin >> a >> b;\n    cout << "Sum = " << a + b << endl;'), input: '12 30\n' },
  { name: 'cin-lines', code: wrap('    int a;\n    double d;\n    char c;\n    string w;\n    cout << "a? ";\n    cin >> a;\n    cout << "d? ";\n    cin >> d;\n    cout << "c w? ";\n    cin >> c >> w;\n    cout << a << "|" << d << "|" << c << "|" << w << endl;'), input: '7\n2.5\nx hello world\n' },
  { name: 'cin-decimal-into-int', code: wrap('    int a;\n    double b;\n    cin >> a >> b;\n    cout << a << " " << b << endl;'), input: '3.75\n' },
  { name: 'getline', code: wrap('    int age;\n    string name;\n    cin >> age;\n    getline(cin, name);\n    cout << "[" << name << "]" << endl;\n    getline(cin, name);\n    cout << "[" << name << "]" << endl;'), input: '20\nAli Khan\n' },
  { name: 'even-odd', code: wrap('    int n;\n    cout << "Enter a number: ";\n    cin >> n;\n    if (n % 2 == 0) {\n        cout << n << " is Even" << endl;\n    } else {\n        cout << n << " is Odd" << endl;\n    }'), input: '7\n' },
  { name: 'grades', code: wrap('    int marks;\n    cin >> marks;\n    if (marks >= 80) {\n        cout << "A" << endl;\n    } else if (marks >= 70) {\n        cout << "B" << endl;\n    } else if (marks >= 60) {\n        cout << "C" << endl;\n    } else {\n        cout << "F" << endl;\n    }'), input: '72\n' },
  { name: 'largest3', code: wrap('    int a, b, c;\n    cin >> a >> b >> c;\n    if (a >= b && a >= c) cout << "Largest is " << a << endl;\n    else if (b >= c) cout << "Largest is " << b << endl;\n    else cout << "Largest is " << c << endl;'), input: '7 12 5\n' },
  { name: 'leap', code: wrap('    int y;\n    cin >> y;\n    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) cout << y << " is a leap year" << endl;\n    else cout << y << " is not a leap year" << endl;'), input: '1900\n' },
  { name: 'nested', code: wrap('    char rating = \'P\';\n    int age = 12;\n    bool withAdult = true;\n    if (rating == \'A\') {\n        if (age >= 18) cout << "Allowed"; else cout << "Denied";\n    } else if (rating == \'P\') {\n        if (age >= 13 || withAdult) {\n            cout << "Allowed" << endl;\n        } else {\n            cout << "Denied" << endl;\n        }\n    } else {\n        cout << "Allowed" << endl;\n    }') },
  { name: 'switch', code: wrap('    int day = 3;\n    switch (day) {\n        case 1: cout << "Mon"; break;\n        case 2: cout << "Tue"; break;\n        case 3: cout << "Wed";\n        case 4: cout << "Thu"; break;\n        default: cout << "?";\n    }\n    cout << endl;\n    char op = \'*\';\n    switch (op) {\n        case \'+\': cout << 2 + 3; break;\n        case \'*\': cout << 2 * 3; break;\n        default: cout << "bad";\n    }\n    cout << endl;') },
  { name: 'ternary', code: wrap('    int a = 4, b = 9;\n    int big = a > b ? a : b;\n    cout << big << " " << (a % 2 == 0 ? "even" : "odd") << endl;') },
  { name: 'logic', code: wrap('    int x = 5;\n    cout << (x > 1 && x < 10) << (x < 1 || x > 3) << !(x == 5) << endl;\n    bool t = x > 100 && x / 0 == 1;\n    cout << t << endl;') },
  { name: 'while-sum', code: wrap('    int i = 1, sum = 0;\n    while (i <= 5) {\n        sum += i;\n        i++;\n    }\n    cout << "sum=" << sum << endl;') },
  { name: 'for-fact', code: wrap('    long long f = 1;\n    for (int i = 1; i <= 20; i++) {\n        f *= i;\n    }\n    cout << f << endl;\n    for (int i = 0; i < 3; i++) cout << i << " ";\n    cout << endl;') },
  { name: 'do-while', code: wrap('    int n = 0;\n    do {\n        cout << n << ",";\n        n += 3;\n    } while (n < 10);\n    cout << endl;') },
  { name: 'break-continue', code: wrap('    for (int i = 1; i <= 10; i++) {\n        if (i % 2 == 0) continue;\n        if (i > 7) break;\n        cout << i;\n    }\n    cout << endl;') },
  { name: 'iomanip', code: wrap('    double price = 3.14159;\n    cout << fixed << setprecision(2) << price << endl;\n    cout << setw(8) << 42 << "|" << endl;\n    cout << left << setw(8) << "Ali" << "|" << right << setw(6) << 7.5 << endl;\n    cout << setfill(\'*\') << setw(5) << 1 << endl;\n    cout << setprecision(0) << 2.5 << " " << 3.5 << endl;', '#include <iomanip>\n') },
  { name: 'precision-default', code: wrap('    cout << setprecision(3) << 3.14159 << " " << 1234.5 << " " << 0.000123456 << endl;', '#include <iomanip>\n') },
  { name: 'overflow', code: wrap('    int big = 2147483647;\n    big = big + 1;\n    cout << big << endl;\n    int m = 50000 * 50000;\n    cout << m << endl;\n    char c = 200;\n    cout << (int)c << endl;') },
  { name: 'strings', code: wrap('    string first = "Ali";\n    string last = "Khan";\n    string full = first + " " + last;\n    cout << full << " " << full.length() << endl;\n    cout << full.substr(0, 3) << " " << full[4] << endl;\n    full[0] = \'a\';\n    cout << full << endl;\n    cout << (first < last) << " " << (first == "Ali") << endl;') },
  { name: 'math', code: wrap('    cout << pow(2, 10) << " " << sqrt(81) << " " << abs(-5) << " " << ceil(2.1) << " " << floor(2.9) << " " << round(2.5) << endl;\n    cout << max(3, 9) << " " << min(2.5, 1.5) << endl;', '#include <cmath>\n') },
  { name: 'casting', code: wrap('    int a = 7, b = 2;\n    cout << a / b << " " << (double)a / b << " " << static_cast<double>(a) / b << " " << double(a / b) << endl;\n    cout << (int)3.99 << " " << (int)-3.99 << " " << (char)97 << " " << (int)\'z\' << endl;') },
  { name: 'uninit-string-global', code: `${H}int counter;\nint main() {\n    string s;\n    cout << "[" << s << "]" << counter << endl;\n    return 0;\n}\n` },
  { name: 'digits', code: wrap('    int n = 4729;\n    int last = n % 10;\n    int rest = n / 10;\n    int first = n / 1000;\n    cout << last << " " << rest << " " << first << " " << (n / 10) % 10 << endl;') },
  { name: 'scope', code: wrap('    int x = 1;\n    {\n        int x = 2;\n        cout << x;\n    }\n    cout << x << endl;\n    if (x == 1) {\n        int y = 10;\n        cout << y << endl;\n    }') },
  { name: 'std-qualified', code: '#include <iostream>\n\nint main() {\n    std::cout << "Hi" << std::endl;\n    std::string s = "ok";\n    std::cout << s << std::endl;\n    return 0;\n}\n' },
  { name: 'no-return', code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "no return";\n}\n' },
  { name: 'cstr-plus-int', code: wrap('    cout << "Hello" + 1 << endl;') },
  { name: 'to_string', code: wrap('    int n = 42;\n    string s = "n=" + to_string(n);\n    cout << s << " " << to_string(2.5) << endl;') },
  { name: 'unsigned-compare', code: wrap('    string s = "abc";\n    int i = -1;\n    cout << (i < (int)s.length()) << endl;\n    unsigned int u = 1;\n    cout << (i < u) << endl;') },
  { name: 'float', code: wrap('    float f = 0.1f;\n    float g = 1.0f / 3;\n    cout << f << " " << g << " " << f * 3 << endl;') },
  { name: 'multi-line-cout', code: wrap('    cout << "Line one"\n         << endl\n         << "Line two"\n         << endl;') },

  // ----- compile errors: our engine must report an error on the same line as g++
  { name: 'E-missing-semi', code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hi"\n    return 0;\n}\n', compileErrorLine: 4 },
  { name: 'E-no-using', code: '#include <iostream>\nint main() {\n    cout << "Hi";\n    return 0;\n}\n', compileErrorLine: 3 },
  { name: 'E-no-include', code: 'using namespace std;\nint main() {\n    cout << "Hi";\n    return 0;\n}\n', compileErrorLine: 3 },
  { name: 'E-Cout', code: wrap('    Cout << "Hi";'), compileErrorLine: 5 },
  { name: 'E-no-quotes', code: wrap('    cout << Hello;'), compileErrorLine: 5 },
  { name: 'E-cout-shift-wrong', code: wrap('    cout >> "Hi";'), compileErrorLine: 5 },
  { name: 'E-unterminated', code: wrap('    cout << "Hi;'), compileErrorLine: 5 },
  { name: 'E-missing-brace', code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hi" << endl;\n    return 0;\n', compileErrorLine: 6 },
  { name: 'E-redeclare', code: wrap('    int x = 5;\n    int x = 6;'), compileErrorLine: 6 },
  { name: 'E-double-mod', code: wrap('    double d = 5.5;\n    cout << d % 2;'), compileErrorLine: 6 },
  { name: 'E-cstr-plus', code: wrap('    cout << "a" + "b";'), compileErrorLine: 5 },
  { name: 'E-int-from-text', code: wrap('    int x = "hello";'), compileErrorLine: 5 },
  { name: 'E-const', code: wrap('    const int x = 5;\n    x = 6;'), compileErrorLine: 6 },
  { name: 'E-cin-endl', code: wrap('    int x;\n    cin >> x >> endl;'), compileErrorLine: 6 },
  { name: 'E-cout-less', code: wrap('    int a = 1;\n    cout << a < 2;'), compileErrorLine: 6 },
  { name: 'E-decl-semi', code: wrap('    int x = 5\n    int y = 6;'), compileErrorLine: 6 },
  { name: 'E-brace-semi', code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hi" << endl\n}\n', compileErrorLine: 4 },
  { name: 'E-string-no-std', code: '#include <iostream>\nint main() {\n    string s;\n    return 0;\n}\n', compileErrorLine: 3 },
  { name: 'E-switch-string', code: wrap('    string s = "a";\n    switch (s) { case 1: break; }'), compileErrorLine: 6 },
  { name: 'E-setw-no-iomanip', code: wrap('    cout << setw(5) << 1;'), compileErrorLine: 5 },
  { name: 'E-pow-no-cmath', code: wrap('    cout << pow(2, 3);'), compileErrorLine: 5 },
  { name: 'E-string-int', code: wrap('    string s = 5;'), compileErrorLine: 5 },
  { name: 'E-lvalue', code: wrap('    int a = 1, b = 2;\n    a + b = 5;'), compileErrorLine: 6 },
  { name: 'E-else-without-if', code: wrap('    int x = 1;\n    if (x > 0);\n    {\n        cout << "pos";\n    }\n    else {\n        cout << "neg";\n    }'), compileErrorLine: 10 },
];

function gpp(code: string, input: string, dir: string, i: number): { ok: boolean; out: string; err: string; errLine?: number } {
  const src = join(dir, `c${i}.cpp`);
  const bin = join(dir, `c${i}`);
  writeFileSync(src, code);
  try {
    execFileSync('g++', ['-std=c++17', '-o', bin, src], { stdio: 'pipe' });
  } catch (e) {
    const err = String((e as { stderr?: Buffer }).stderr ?? '');
    const m = new RegExp(`c${i}\\.cpp:(\\d+):\\d+: error`).exec(err);
    return { ok: false, out: '', err, errLine: m ? Number(m[1]) : undefined };
  }
  try {
    const out = execFileSync(bin, [], { input, stdio: 'pipe', timeout: 5000 }).toString();
    return { ok: true, out, err: '' };
  } catch (e) {
    return { ok: true, out: String((e as { stdout?: Buffer }).stdout ?? ''), err: 'crash' };
  }
}

const show = (s: string) => JSON.stringify(s);

export function runCases(cases: Case[], verbose = false): number {
  const dir = mkdtempSync(join(tmpdir(), 'dryrun-'));
  let fails = 0;
  cases.forEach((c, i) => {
    const input = c.input ?? '';
    const ours = runProgram(c.code, { input, maxSteps: 20000 });
    const real = gpp(c.code, input, dir, i);
    if (c.compileErrorLine !== undefined) {
      const ourLine = ours.compileErrors[0]?.line;
      const ok = !real.ok && ours.compileErrors.length > 0 && ourLine === real.errLine;
      if (!ok) {
        fails++;
        console.log(`FAIL ${c.name}: g++ line ${real.errLine} vs ours ${ourLine} :: ${ours.compileErrors[0]?.msg ?? 'no error'}\n   g++: ${real.err.split('\n').find((l) => l.includes('error')) ?? ''}`);
      } else if (verbose) console.log(`ok   ${c.name}: ${ours.compileErrors[0].line}:${ours.compileErrors[0].col} ${ours.compileErrors[0].msg}`);
      return;
    }
    if (!real.ok) {
      fails++;
      console.log(`FAIL ${c.name}: g++ did not compile it:\n${real.err}`);
      return;
    }
    if (ours.compileErrors.length) {
      fails++;
      console.log(`FAIL ${c.name}: we reported a compile error: ${ours.compileErrors.map((d) => `${d.line}:${d.col} ${d.msg}`).join(' | ')}`);
      return;
    }
    if (ours.stdout !== real.out) {
      fails++;
      console.log(`FAIL ${c.name}\n   g++ : ${show(real.out)}\n   ours: ${show(ours.stdout)}${ours.runtimeError ? '\n   runtime: ' + ours.runtimeError.msg : ''}`);
    } else if (verbose) console.log(`ok   ${c.name} (${ours.steps.length} steps)`);
  });
  console.log(`\n${cases.length - fails}/${cases.length} passed`);
  return fails;
}

function hasGpp(): boolean {
  try {
    execFileSync('g++', ['--version'], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

if (!hasGpp()) {
  console.log('g++ was not found on PATH, so outputs cannot be compared with a real compiler. Install MinGW-w64 (Windows) or build-essential (Linux) and try again.');
  process.exit(0);
}

if (process.argv[1]?.endsWith('engine-test.ts')) {
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
  const all = [...CASES, ...PF_CASES, ...EXAM_CASES].filter((c) => !only || c.name.includes(only));
  const fails = runCases(all, process.argv.includes('--verbose'));
  process.exit(fails ? 1 : 0);
}
