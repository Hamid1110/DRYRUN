import type { Level, Unit } from '../types';
import { cpp, prog } from '../helpers';

const CCTYPE = '#include <cctype>\n';
const CSTRING = '#include <cstring>\n';

// ------------------------------------------------------------------ Level 1: inside a string
const LS1: Level = {
  id: 'string-inside',
  kind: 'lesson',
  title: 'Inside a string',
  tagline: 'A `string` is a row of characters, each in its own numbered box. Visit every box with a loop and you can count, change and build text.',
  minutes: 25,
  objectives: [
    'You can visit every character of a string with a loop from `0` to `length() - 1`',
    'You can change one character, count a letter and join strings with `+` and `+=`',
    'You can predict how `==` and `<` compare two strings (dictionary order by ASCII)',
  ],
  learn: [
    { t: 'p', text: 'Think of a string as a **row of seats in a bus**. Every seat holds one character, and the seats are numbered from **0**. The word `Quetta` sits in seats 0 to 5, so it has `6` characters. You already know `.length()` and `s[i]` — now we use them *together* with a loop.' },
    { t: 'viz', title: 'Visit every seat, then change one', code: prog(cpp`
    string city = "Quetta";
    cout << city.length() << endl;
    for (int i = 0; i < city.length(); i++) {
        cout << i << ":" << city[i] << " ";
    }
    cout << endl;
    city[0] = 'q';
    cout << city << endl;`) },
    { t: 'table', head: ['Position `i`', '0', '1', '2', '3', '4', '5'], rows: [
      ['`city[i]`', "`'Q'`", "`'u'`", "`'e'`", "`'t'`", "`'t'`", "`'a'`"],
    ], caption: '`city.length()` is 6, but the last position is **5**. The loop condition `i < city.length()` stops exactly there.' },
    { t: 'callout', tone: 'warn', title: 'Off by one', text: 'Positions go from `0` to `length() - 1`. `s[s.length()]` is **past the last letter**, and `i <= s.length()` makes one step too many. Use `s.at(i)` if you want C++ to stop the program with an error instead of reading a wrong box.' },
    { t: 'h', text: 'Count a letter' },
    { t: 'viz', title: 'How many times does a appear in banana?', code: prog(cpp`
    string word = "banana";
    int count = 0;
    for (int i = 0; i < word.length(); i++) {
        if (word[i] == 'a') {
            count++;
        }
    }
    cout << "a appears " << count << " times" << endl;`) },
    { t: 'callout', tone: 'key', title: 'The pattern', text: 'Loop over every position → ask a yes/no question about `s[i]` → update a counter. The loop body runs **exactly `length()` times** — 6 times for `banana`.' },
    { t: 'h', text: 'Join strings with + and +=' },
    { t: 'viz', title: 'Building a full name', code: prog(cpp`
    string first = "Ali";
    string last = "Raza";
    string full = first + " " + last;
    full += '!';
    cout << full << " has " << full.length() << " characters" << endl;`) },
    { t: 'compare', items: [
      { title: 'Two quoted texts', good: false, code: 'string s = "Ali" + " Raza";', note: 'Does not compile. Two text literals are not `string` variables, so `+` cannot join them.' },
      { title: 'Start from a string variable', good: true, code: 'string s = "Ali";\ns += " Raza";', note: 'At least one side of `+` must be a `string`. `+=` adds to the end of the variable.' },
    ] },
    { t: 'h', text: 'Compare strings' },
    { t: 'p', text: '`==` checks that both strings have the same letters in the same seats. `<` checks **dictionary order**: C++ compares seat 0 with seat 0, then seat 1 with seat 1, … and the first *different* letter decides, using its ASCII code.' },
    { t: 'table', head: ['Code', 'Result', 'Why'], rows: [
      ['`a == c` with `"apple"`, `"Apple"`', 'false', "`'a'` (97) is not `'A'` (65)"],
      ['`"apple" < "banana"`', 'true', "first letters: `'a'` (97) < `'b'` (98)"],
      ['`"Zebra" < "apple"`', 'true', "`'Z'` is 90 — ALL capitals come before small letters"],
      ['`"app" < "apple"`', 'true', 'same start, the shorter one comes first'],
    ], caption: 'In a real program at least one side must be a `string` variable, e.g. `string a = "apple";`.' },
    { t: 'terms', items: [
      { term: 'index / position', def: 'the seat number of a character, starting at 0' },
      { term: 'concatenate', def: 'join two strings end to end with `+` or `+=`' },
      { term: 'dictionary order', def: 'compare letter by letter; the first different letter (by ASCII code) decides' },
    ] },
  ],
  ways: {
    goal: 'Count how many times `a` appears in `"Karachi"` and print `2`.',
    items: [
      { title: 'for loop with an index', code: prog(cpp`
    string s = "Karachi";
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s[i] == 'a') count++;
    }
    cout << count;`) },
      { title: 'Range-for: one character at a time', code: prog(cpp`
    string s = "Karachi";
    int count = 0;
    for (char c : s) {
        if (c == 'a') count++;
    }
    cout << count;`), note: 'No index needed when you only *read* the letters.' },
      { title: 'while loop', code: prog(cpp`
    string s = "Karachi";
    int count = 0, i = 0;
    while (i < s.length()) {
        if (s[i] == 'a') count++;
        i++;
    }
    cout << count;`) },
      { title: 'Safe access with .at()', code: prog(cpp`
    string s = "Karachi";
    int count = 0;
    for (int i = 0; i < s.size(); i++) {
        if (s.at(i) == 'a') count++;
    }
    cout << count;`), note: '`size()` is the same as `length()`. `at(i)` checks the position for you.' },
      { title: 'Walk backwards', code: prog(cpp`
    string s = "Karachi";
    int count = 0;
    for (int i = s.length() - 1; i >= 0; i--) {
        if (s[i] == 'a') count++;
    }
    cout << count;`), note: 'The order does not matter for counting.' },
    ],
    takeaway: 'Every way visits all 7 positions exactly once. Pick the range-for when you only read, the index loop when you need the position.',
    check: { id: 'string-inside-ways-check', kind: 'mcq', prompt: 'Which loop body does NOT count the letter `a` correctly?', options: ["`if (s[i] = 'a') count++;`", "`if (s[i] == 'a') count++;`", "`if (s.at(i) == 'a') count += 1;`", "`if ('a' == s[i]) count = count + 1;`"], answer: 0, hints: ['Look for a single `=`.'], explain: "`s[i] = 'a'` **stores** `'a'` into the string (a non-zero value, so it is true). It counts every letter — and destroys the word." },
  },
  watch: [
    { title: 'Reverse a word', intro: 'Start from the last position and add each letter to a new string with `+=`.', code: prog(cpp`
    string word = "stressed";
    string rev = "";
    for (int i = word.length() - 1; i >= 0; i--) {
        rev += word[i];
    }
    cout << rev << endl;`) },
    { title: 'Which name comes first in the register?', intro: 'The `<` operator on strings is dictionary order.', code: prog(cpp`
    string a, b;
    cin >> a >> b;
    if (a < b) {
        cout << a << " comes first" << endl;
    } else if (b < a) {
        cout << b << " comes first" << endl;
    } else {
        cout << "Same name" << endl;
    }`), input: 'Sara Ali\n' },
  ],
  think: {
    title: 'Letter counter',
    problem: 'Read a word and one letter. Print how many times the letter appears in the word, e.g. `banana a` → `a appears 3 times`.',
    steps: [
      { text: 'Read the word and the letter.', lines: [5, 6, 7] },
      { text: 'Start a counter at 0 — nothing counted yet.', lines: [8] },
      { text: 'Visit every position from 0 to `length() - 1`.', lines: [9] },
      { text: 'Ask: is the letter in this seat the one we want?', lines: [10] },
      { text: 'If yes, add one to the counter.', lines: [11] },
      { text: 'After the loop, print the answer.', lines: [14] },
    ],
    code: prog(cpp`
    string word;
    char letter;
    cin >> word >> letter;
    int count = 0;
    for (int i = 0; i < word.length(); i++) {
        if (word[i] == letter) {
            count++;
        }
    }
    cout << letter << " appears " << count << " times" << endl;`),
    input: 'banana a\n',
    why: 'The loop runs once per character, so every seat is checked exactly once. The counter only changes when the question is true.',
    yourTurn: {
      id: 'string-inside-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the input `hello l`. Fill in `i` and `count` at every step.',
      code: prog(cpp`
    string word;
    char letter;
    cin >> word >> letter;
    int count = 0;
    for (int i = 0; i < word.length(); i++) {
        if (word[i] == letter) {
            count++;
        }
    }
    cout << letter << " appears " << count << " times" << endl;`),
      input: 'hello l\n',
      vars: ['i', 'count'],
      given: [0],
      hints: ['`hello` has 5 letters: positions 0 to 4.', "Only positions 2 and 3 hold `'l'`."],
      explain: 'The loop runs 5 times; `count` grows at `i = 2` and `i = 3` → `l appears 2 times`.',
    },
  },
  practice: [
    { id: 'string-inside-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    string s = "Pakistan";
    cout << s.length() << " " << s[0] << s[s.length() - 1];`), hints: ['Count the letters of Pakistan.', 'The last position is `length() - 1`.'], explain: '`Pakistan` has 8 letters. `s[0]` is `P`, `s[7]` is `n` → `8 Pn`.' },
    { id: 'string-inside-q2', kind: 'mcq', prompt: '`string s = "Lahore";` Which expression gives the **last** letter `e`?', options: ['`s[5]`', '`s[6]`', '`s[s.length()]`', '`s[-1]`'], answer: 0, hints: ['6 letters, first position is 0.'], explain: 'Positions are 0 to 5. `s[6]` and `s[s.length()]` are past the end; C++ has no negative positions.' },
    { id: 'string-inside-q3', kind: 'bug', prompt: 'It should print every letter with a space: `S i a l k o t`. The first letter is missing. Find the line.', code: prog(cpp`
    string s = "Sialkot";
    for (int i = 1; i < s.length(); i++) {
        cout << s[i] << " ";
    }`), bugLine: 6, options: ['Start the loop at `i = 0`', 'Use `i <= s.length()`', 'Print `s` instead of `s[i]`', 'Use `i += 2`'], answer: 0, fixed: prog(cpp`
    string s = "Sialkot";
    for (int i = 0; i < s.length(); i++) {
        cout << s[i] << " ";
    }`), hints: ['Where is the letter `S` stored?'], explain: 'The first letter lives at position **0**. Starting at 1 skips it.' },
    { id: 'string-inside-q4', kind: 'trace', mode: 'vars', prompt: 'Trace how the full name is built.', code: prog(cpp`
    string first = "Ali";
    string last = "Raza";
    string full = first + " " + last;
    full += "!";
    cout << full.length();`), vars: ['first', 'last', 'full'], hints: ['`+` makes a new string; `first` and `last` do not change.', 'Count the space and the `!` too.'], explain: '`full` becomes `Ali Raza`, then `Ali Raza!` — 9 characters.' },
    { id: 'string-inside-q5', kind: 'predict', tag: 'tricky', prompt: 'Predict the output (1 = true, 0 = false).', code: prog(cpp`
    string a = "Zebra", b = "apple", c = "app";
    cout << (a < b) << (c < b) << (a == "zebra");`), hints: ["`'Z'` is 90 and `'a'` is 97.", '`app` is the start of `apple`.', '`==` cares about capital letters.'], explain: "`'Z'` < `'a'` → 1. `app` is a shorter start of `apple` → 1. `Zebra` is not `zebra` → 0. Output `110`." },
    { id: 'string-inside-q6', kind: 'blanks', prompt: 'Count the letter `o` in `football`. Expected output: `o: 2`.', code: prog(cpp`
    string s = "football";
    int count = 0;
    for (int i = 0; i [[1]] s.length(); i++) {
        if (s[i] [[2]] 'o') {
            [[3]];
        }
    }
    cout << "o: " << count;`), blanks: [{ answers: ['<'] }, { answers: ['=='] }, { answers: ['count++', '++count', 'count += 1', 'count = count + 1'] }], chips: ['<', '<=', '==', '=', 'count++'], output: 'o: 2', hints: ['Stop before position `length()`.', 'Compare, do not store.'], explain: '`i < s.length()`, `s[i] == \'o\'`, `count++`.' },
    { id: 'string-inside-q7', kind: 'parsons', prompt: 'Build a program that reads one word and prints it backwards. Input `code` → `edoc`.', lines: [
      '#include <iostream>',
      'using namespace std;',
      'int main() {',
      '    string w;',
      '    cin >> w;',
      '    for (int i = w.length() - 1; i >= 0; i--) {',
      '        cout << w[i];',
      '    }',
      '    return 0;',
      '}',
    ], distractors: ['    for (int i = w.length(); i >= 0; i--) {', '        cout << w;'], input: 'code\n', hints: ['The last letter is at `length() - 1`.'], explain: 'Start at the last position and go down to 0, printing one letter each time.' },
    { id: 'string-inside-q8', kind: 'mcq', prompt: 'How many times does the loop body run?', code: prog(cpp`
    string s = "Karachi";
    for (int i = 0; i < s.length(); i += 2) {
        cout << s[i];
    }`), options: ['4 times', '3 times', '7 times', '8 times'], answer: 0, hints: ['Write down the values of `i`: 0, 2, …', 'Stop when `i` reaches 7 or more.'], explain: '`i` = 0, 2, 4, 6 → 4 times. It prints `Krci`.' },
  ],
  cheatsheet: [
    { code: 'for (int i = 0; i < s.length(); i++)', text: 'visit every position 0 … length()-1' },
    { code: "s[i] = 'x';", text: 'change one character' },
    { code: 's = a + " " + b;  s += "!";', text: 'join strings (one side must be a string)' },
    { code: 'a == b   a < b', text: 'same text? / dictionary order by ASCII (capitals first)' },
  ],
};

// ------------------------------------------------------------------ Level 2: string tools
const LS2: Level = {
  id: 'string-tools',
  kind: 'lesson',
  title: 'String tools',
  tagline: 'Cut out a piece, search for a word, insert and delete — `std::string` has a ready-made tool for every job.',
  minutes: 25,
  objectives: [
    'You can cut out part of a string with `substr(start, count)` and search with `find`',
    'You can detect "not found" (`string::npos`)',
    'You can edit a string with `insert`, `erase`, `append`, `push_back` and `pop_back`',
  ],
  learn: [
    { t: 'p', text: 'A string is not only a row of letters — it also comes with a **toolbox**. You call a tool with a dot: `s.find(\'@\')`, `s.substr(0, 4)`. The tools save you from writing a loop for every small job.' },
    { t: 'table', head: ['Tool', 'What it does', 'Example on `s = "Lahore"`'], rows: [
      ['`s.substr(start, count)`', 'copy `count` letters starting at `start`', '`s.substr(1, 3)` → `aho`'],
      ['`s.substr(start)`', 'copy from `start` to the end', '`s.substr(3)` → `ore`'],
      ['`s.find(x)`', 'position of the first `x` (a char or a string)', "`s.find('o')` → 3"],
      ['`s.insert(pos, t)`', 'put `t` in before position `pos`', '`s.insert(0, "Old ")` → `Old Lahore`'],
      ['`s.erase(pos, count)`', 'delete `count` letters from `pos`', '`s.erase(1, 2)` → `Lore`'],
      ['`s.append(t)`', 'add `t` at the end (same as `+=`)', '`s.append("!")` → `Lahore!`'],
      ['`s.push_back(c)` / `s.pop_back()`', 'add / remove ONE char at the end', "`s.push_back('s')` → `Lahores`"],
      ['`s.empty()`', 'true when the length is 0', '`s.empty()` → false (0)'],
    ] },
    { t: 'syntax', title: 'substr', code: 'string user = email.substr(0, at);', parts: [
      { token: 'email', text: 'the original string — it does **not** change' },
      { token: 'substr', text: '"sub-string": a copy of one piece' },
      { token: '0', text: 'the **start** position' },
      { token: 'at', text: 'HOW MANY letters to copy — a count, not an end position' },
    ] },
    { t: 'viz', title: 'Username and website from an email', code: prog(cpp`
    string email = "sara@gmail.com";
    int at = email.find('@');
    string user = email.substr(0, at);
    string site = email.substr(at + 1);
    cout << "user: " << user << endl;
    cout << "site: " << site << endl;`) },
    { t: 'callout', tone: 'key', title: 'Why substr(0, at) works', text: '`@` sits at position 4, so there are exactly **4** letters before it (positions 0–3). The position of a character is also the number of characters before it.' },
    { t: 'h', text: 'When find finds nothing' },
    { t: 'syntax', title: 'Not found → string::npos', code: 'if (s.find("xyz") == string::npos) {\n    cout << "not found";\n}', parts: [
      { token: 'string::npos', text: 'a special huge number (18446744073709551615) that means *no position*' },
      { token: '== string::npos', text: 'the official way to ask "was it NOT found?"' },
    ] },
    { t: 'viz', title: 'Found and not found, stored in an int', code: prog(cpp`
    string s = "Multan";
    int pos = s.find("tan");
    cout << pos << endl;
    pos = s.find("xyz");
    cout << pos << endl;
    if (pos == -1) {
        cout << "not found" << endl;
    }`) },
    { t: 'callout', tone: 'info', title: 'npos and -1', text: 'When you store the answer of `find` in an `int` (as we do in this course), `string::npos` turns into **-1**. So `pos == -1` and `s.find(x) == string::npos` ask the same question. Never use the result of a failed `find` as a position!' },
    { t: 'h', text: 'Editing tools' },
    { t: 'viz', title: 'Fix a spelling, then add and remove', code: prog(cpp`
    string w = "Lahre";
    w.insert(3, "o");
    w.append(" city");
    w.erase(6, 5);
    w.push_back('!');
    w.pop_back();
    cout << w << " " << w.empty() << endl;`) },
    { t: 'callout', tone: 'warn', title: 'Count, not end', text: '`s.substr(4, 7)` means *7 letters starting at 4* (positions 4 to 10) — **not** "from 4 to 7". The same is true for `erase(pos, count)`.' },
  ],
  ways: {
    goal: 'The full name is `"Ali Raza"`. Print only the first name: `Ali`.',
    items: [
      { title: 'find the space, then substr', code: prog(cpp`
    string name = "Ali Raza";
    int space = name.find(' ');
    cout << name.substr(0, space);`) },
      { title: 'Loop until the space', code: prog(cpp`
    string name = "Ali Raza";
    string first = "";
    int i = 0;
    while (name[i] != ' ') {
        first += name[i];
        i++;
    }
    cout << first;`), note: 'What `find` + `substr` do for you, written by hand.' },
      { title: 'Erase everything from the space', code: prog(cpp`
    string name = "Ali Raza";
    name.erase(name.find(' '));
    cout << name;`), note: 'Without a count, `erase` deletes to the end. This changes `name` itself.' },
      { title: 'for loop with break', code: prog(cpp`
    string name = "Ali Raza";
    string first = "";
    for (int i = 0; i < name.length(); i++) {
        if (name[i] == ' ') break;
        first.push_back(name[i]);
    }
    cout << first;`) },
    ],
    takeaway: 'The library tools (`find`, `substr`, `erase`) say the idea in one line. The loops show what really happens inside.',
    check: { id: 'string-tools-ways-check', kind: 'mcq', prompt: 'Which one does NOT print `Ali` for `name = "Ali Raza"`?', options: ["`cout << name.substr(name.find(' '));`", "`cout << name.substr(0, name.find(' '));`", '`cout << name.substr(0, 3);`', "`name.erase(3); cout << name;`"], answer: 0, hints: ['With one argument, substr copies from the start position **to the end**.'], explain: "`name.find(' ')` is 3, and `substr(3)` is `\" Raza\"` — the part after the first name." },
  },
  watch: [
    { title: 'Replace a word', intro: 'find → erase the old word → insert the new word at the same position.', code: prog(cpp`
    string s = "I like tea";
    string oldW = "tea", newW = "chai";
    int pos = s.find(oldW);
    if (pos != -1) {
        s.erase(pos, oldW.length());
        s.insert(pos, newW);
    }
    cout << s << endl;`) },
    { title: 'First and last name from a full line', intro: 'getline reads the whole name with its space; find splits it.', code: prog(cpp`
    string full;
    getline(cin, full);
    int space = full.find(' ');
    string first = full.substr(0, space);
    string last = full.substr(space + 1);
    cout << "First: " << first << endl;
    cout << "Last: " << last << endl;`), input: 'Hina Batool\n' },
  ],
  think: {
    title: 'Username from an email',
    problem: 'A sign-up form reads an email. Print the username (the part before `@`). If there is no `@`, print `Invalid email`.',
    steps: [
      { text: 'Read the email.', lines: [5, 6] },
      { text: 'Find the position of `@`.', lines: [7] },
      { text: 'Not found (`-1`, i.e. `string::npos`)? Then it is not an email.', lines: [8, 9] },
      { text: 'Otherwise the username is the `at` letters before it: `substr(0, at)`.', lines: [11] },
      { text: 'Print it.', lines: [12] },
    ],
    code: prog(cpp`
    string email;
    cin >> email;
    int at = email.find('@');
    if (at == -1) {
        cout << "Invalid email" << endl;
    } else {
        string user = email.substr(0, at);
        cout << "Username: " << user << endl;
    }`),
    input: 'sara@gmail.com\n',
    why: 'Always check the "not found" case before using the position — otherwise `substr` would get a meaningless number.',
    yourTurn: {
      id: 'string-tools-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the input `zain.pk` (someone forgot the @).',
      code: prog(cpp`
    string email;
    cin >> email;
    int at = email.find('@');
    if (at == -1) {
        cout << "Invalid email" << endl;
    } else {
        string user = email.substr(0, at);
        cout << "Username: " << user << endl;
    }`),
      input: 'zain.pk\n',
      vars: ['email', 'at'],
      hints: ['There is no `@` in `zain.pk`.', 'Stored in an int, "not found" is -1.'],
      explain: '`at` is -1, so the if is true → `Invalid email`. The else (and `substr`) never runs.',
    },
  },
  practice: [
    { id: 'string-tools-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    string s = "Islamabad";
    cout << s.substr(0, 5) << "|" << s.substr(5) << "|" << s.find('a');`), hints: ['5 letters from position 0.', 'With one argument substr goes to the end.', 'The first `a` — count from 0.'], explain: '`Islam`, `abad`, and the first `a` is at position 3 → `Islam|abad|3`.' },
    { id: 'string-tools-q2', kind: 'mcq', prompt: '`string s = "Pakistan";` What is `s.substr(3, 2)`?', options: ['`is`', '`ki`', '`kis`', '`ist`'], answer: 0, hints: ['P=0, a=1, k=2, i=3 …', 'The 2 is a count.'], explain: 'Start at position 3 (`i`) and take 2 letters: `is`.' },
    { id: 'string-tools-q3', kind: 'trace', mode: 'vars', prompt: 'Trace every edit of `w`.', code: prog(cpp`
    string w = "cat";
    w.push_back('s');
    w.insert(0, "big ");
    w.erase(0, 4);
    w.pop_back();
    cout << w << " " << w.length();`), vars: ['w'], hints: ['`push_back` adds at the end, `insert(0, …)` at the front.', '`erase(0, 4)` removes the 4 characters `big `.'], explain: '`cats` → `big cats` → `cats` → `cat`. Output `cat 3`.' },
    { id: 'string-tools-q4', kind: 'blanks', tag: 'real life', prompt: 'Print the domain of an email (everything after `@`). Input `ali@pu.edu.pk` → `pu.edu.pk`.', code: prog(cpp`
    string email;
    cin >> email;
    int at = email.[[1]]('@');
    cout << email.substr([[2]]);`), blanks: [{ answers: ['find'] }, { answers: ['at + 1', 'at+1', '1 + at'] }], chips: ['find', 'substr', 'at', 'at + 1', 'at - 1'], input: 'ali@pu.edu.pk\n', output: 'pu.edu.pk', hints: ['Which tool gives the position of a character?', 'Start one step AFTER the @.'], explain: '`email.find(\'@\')` is 3; `substr(at + 1)` copies from position 4 to the end.' },
    { id: 'string-tools-q5', kind: 'bug', prompt: 'It should print `Karachi`, but prints `Karachi Kin`. Find the line.', code: prog(cpp`
    string s = "PSL Karachi Kings";
    string team = s.substr(4, 11);
    cout << team;`), bugLine: 6, options: ['The second number is a count: use `s.substr(4, 7)`', 'Use `s.substr(5, 11)`', 'Use `s.find(4, 11)`', 'Use `s.substr(11, 4)`'], answer: 0, fixed: prog(cpp`
    string s = "PSL Karachi Kings";
    string team = s.substr(4, 7);
    cout << team;`), hints: ['`Karachi` starts at 4 and ends at 10. How many letters is that?'], explain: 'The writer thought "from 4 to 11". But `substr` wants a **count**: `Karachi` has 7 letters.' },
    { id: 'string-tools-q6', kind: 'mcq', prompt: 'What does `s.find("xyz")` return when `xyz` is not in `s`?', options: ['`string::npos` — a special huge number (it becomes -1 in an int)', '`0`', 'The length of `s`', 'The program stops with an error'], answer: 0, hints: ['0 is a real position — the very first seat.'], explain: 'Not found is `string::npos`. `0` would mean "found at the start", so it cannot mean "not found".' },
    { id: 'string-tools-q7', kind: 'parsons', tag: 'real life', prompt: 'A form reads a full name on one line. Print only the first name. Input `Hina Ali` → `Hina`.', lines: [
      '#include <iostream>',
      'using namespace std;',
      'int main() {',
      '    string full;',
      '    getline(cin, full);',
      "    int space = full.find(' ');",
      '    cout << full.substr(0, space);',
      '    return 0;',
      '}',
    ], distractors: ['    cout << full.substr(space);', '    getline(full, cin);'], input: 'Hina Ali\n', hints: ['getline first, then find, then substr.'], explain: 'The space is at position 4, so `substr(0, 4)` is `Hina`.' },
    { id: 'string-tools-q8', kind: 'predict', tag: 'tricky', prompt: 'How many times does the while loop run? Predict the output.', code: prog(cpp`
    string s = "a-b-c-d";
    int count = 0;
    int pos = s.find('-');
    while (pos != -1) {
        count++;
        s.erase(pos, 1);
        pos = s.find('-');
    }
    cout << count << " " << s;`), hints: ['Each round removes one `-`.', 'The loop stops when find cannot find a `-` any more.'], explain: 'There are 3 dashes, so the loop runs 3 times → `3 abcd`.' },
  ],
  cheatsheet: [
    { code: 's.substr(start, count)', text: 'copy a piece (count, not end!)' },
    { code: 's.find(x)', text: 'first position of x; not found → string::npos (-1 in an int)' },
    { code: 's.insert(pos, t)  s.erase(pos, n)', text: 'put in / cut out' },
    { code: 's.append(t)  s.push_back(c)  s.pop_back()  s.empty()', text: 'add at the end / remove last / is it empty?' },
  ],
};

// ------------------------------------------------------------------ Level 3: character processing
const LS3: Level = {
  id: 'char-processing',
  kind: 'lesson',
  title: 'Character processing',
  tagline: 'Every character is a small number. `<cctype>` asks questions about it — letter? digit? capital? — and changes it.',
  minutes: 25,
  objectives: [
    'You can test characters with `isalpha`, `isdigit`, `isupper`, `islower`, `isspace`',
    'You can change case with `toupper`/`tolower` and count vowels, digits and spaces',
    'You can use ASCII arithmetic for a palindrome check and a Caesar shift',
  ],
  learn: [
    { t: 'p', text: 'Inside memory a `char` is just a number — its **ASCII code**. `\'A\'` is 65, `\'a\'` is 97, `\'0\'` is 48. Letters and digits are stored in order, so you can do maths with them: `\'c\' - \'a\'` is 2, and `\'7\' - \'0\'` is the number 7.' },
    { t: 'table', head: ['Characters', 'ASCII codes', 'Note'], rows: [
      ["`'A'` … `'Z'`", '65 … 90', 'capitals come first'],
      ["`'a'` … `'z'`", '97 … 122', 'small letter = capital + 32'],
      ["`'0'` … `'9'`", '48 … 57', "the digit's value is `c - '0'`"],
      ["`' '` (space)", '32', ''],
    ] },
    { t: 'table', head: ['From `<cctype>`', 'Question / job', "Example"], rows: [
      ['`isalpha(c)`', 'is it a letter?', "`isalpha('k')` → true"],
      ['`isdigit(c)`', 'is it 0–9?', "`isdigit('7')` → true"],
      ['`isupper(c)` / `islower(c)`', 'capital? / small?', "`isupper('Q')` → true"],
      ['`isspace(c)`', 'space, tab or newline?', "`isspace(' ')` → true"],
      ['`toupper(c)` / `tolower(c)`', 'give the capital / small version', "`toupper('b')` → `'B'` (as a number!)"],
    ], caption: 'Add `#include <cctype>` at the top. The `is…` functions give non-zero for yes and 0 for no — use them inside `if`.' },
    { t: 'callout', tone: 'warn', title: 'toupper gives a number', text: "`cout << toupper('b');` prints **66**, not `B`. Store the result in a `char` (`c = toupper(c);`) or cast it: `cout << (char)toupper('b');`." },
    { t: 'viz', title: 'Count letters, digits and spaces', code: prog(cpp`
    string s;
    getline(cin, s);
    int letters = 0, digits = 0, spaces = 0;
    for (int i = 0; i < s.length(); i++) {
        if (isalpha(s[i])) letters++;
        else if (isdigit(s[i])) digits++;
        else if (isspace(s[i])) spaces++;
    }
    cout << letters << " letters, " << digits << " digits, " << spaces << " spaces" << endl;`, CCTYPE), input: 'Flat 7B\n' },
    { t: 'viz', title: 'Count vowels — make the letter small first', code: prog(cpp`
    string s = "Education";
    int vowels = 0;
    for (int i = 0; i < s.length(); i++) {
        char c = tolower(s[i]);
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vowels++;
        }
    }
    cout << "Vowels: " << vowels << endl;`, CCTYPE) },
    { t: 'callout', tone: 'tip', title: 'One test instead of two', text: '`tolower` first, then compare with small vowels only. Without it you would need 10 comparisons (`a`, `A`, `e`, `E`, …).' },
    { t: 'compare', items: [
      { title: 'Blind ASCII trick', good: false, code: 'c = c - 32;   // for every c', note: "Works for `'a'`…`'z'` only. A digit `'5'` (53) becomes 21 — a strange invisible character." },
      { title: 'Check first, or use toupper', good: true, code: "if (c >= 'a' && c <= 'z') c = c - 32;\n// or simply:\nc = toupper(c);", note: '`toupper` leaves digits, spaces and capitals unchanged.' },
    ] },
    { t: 'h', text: 'Caesar cipher: shifting letters' },
    { t: 'p', text: 'Julius Caesar hid messages by moving every letter 3 places forward: `a → d`, `b → e`, … and at the end it wraps around: `x → a`, `y → b`, `z → c`.' },
    { t: 'table', head: ['Step (c = `\'y\'`, key 3)', 'Value', 'Meaning'], rows: [
      ["`c - 'a'`", '24', "y is letter number 24 (a is 0)"],
      ['`+ 3`', '27', 'move 3 places'],
      ['`% 26`', '1', 'wrap around after z'],
      ["`+ 'a'`", "98 = `'b'`", 'back to a letter'],
    ], caption: "`c = (c - 'a' + 3) % 26 + 'a';`" },
  ],
  ways: {
    goal: 'Print `pak` in capitals: `PAK`.',
    items: [
      { title: 'toupper, stored back in the string', code: prog(cpp`
    string s = "pak";
    for (int i = 0; i < s.length(); i++) {
        s[i] = toupper(s[i]);
    }
    cout << s;`, CCTYPE) },
      { title: 'ASCII: subtract 32', code: prog(cpp`
    string s = "pak";
    for (int i = 0; i < s.length(); i++) {
        if (s[i] >= 'a' && s[i] <= 'z') s[i] = s[i] - 32;
    }
    cout << s;`), note: 'No library needed — small letters are exactly 32 after the capitals.' },
      { title: "ASCII: - 'a' + 'A'", code: prog(cpp`
    string s = "pak";
    for (int i = 0; i < s.length(); i++) {
        s[i] = s[i] - 'a' + 'A';
    }
    cout << s;`), note: 'Same idea, easier to read: position in the alphabet, then back from `A`.' },
      { title: 'Build a new string with range-for', code: prog(cpp`
    string s = "pak";
    string up = "";
    for (char c : s) {
        up += (char)toupper(c);
    }
    cout << up;`, CCTYPE) },
      { title: 'Print one capital at a time', code: prog(cpp`
    string s = "pak";
    for (int i = 0; i < s.length(); i++) {
        cout << (char)toupper(s[i]);
    }`, CCTYPE), note: 'The cast `(char)` turns the number back into a letter.' },
    ],
    takeaway: '`toupper` is the safest; the ASCII tricks show *why* it works.',
    check: { id: 'char-processing-ways-check', kind: 'mcq', prompt: 'Which loop body does NOT print `PAK`?', options: ['`cout << toupper(s[i]);`', '`cout << (char)toupper(s[i]);`', "`cout << char(s[i] - 32);`", '`s[i] = toupper(s[i]); cout << s[i];`'], answer: 0, hints: ['What type does toupper give back?'], explain: '`toupper` returns an `int`, so it prints the codes `806575`.' },
  },
  watch: [
    { title: 'Palindrome check with two positions', intro: '`i` walks in from the left, `j` from the right. One mismatch is enough to say "no".', code: prog(cpp`
    string w = "level";
    int i = 0, j = w.length() - 1;
    bool pal = true;
    while (i < j) {
        if (w[i] != w[j]) {
            pal = false;
            break;
        }
        i++;
        j--;
    }
    if (pal) {
        cout << w << " is a palindrome" << endl;
    } else {
        cout << w << " is not a palindrome" << endl;
    }`) },
    { title: 'Caesar shift by 3', intro: 'Watch `z` wrap around to `c`.', code: prog(cpp`
    string msg = "zoo";
    int key = 3;
    for (int i = 0; i < msg.length(); i++) {
        msg[i] = (msg[i] - 'a' + key) % 26 + 'a';
    }
    cout << msg << endl;`) },
  ],
  think: {
    title: 'Capitalise every word',
    problem: 'A form stores names in small letters: `ali raza khan`. Print it with the first letter of every word in capitals: `Ali Raza Khan`.',
    steps: [
      { text: 'Read the whole line (it has spaces).', lines: [6, 7] },
      { text: 'Visit every position.', lines: [8] },
      { text: 'A letter starts a word if it is the very first one (`i == 0`) OR the character before it is a space.', lines: [9] },
      { text: 'Such a letter becomes a capital.', lines: [10] },
      { text: 'Print the changed string.', lines: [13] },
    ],
    code: prog(cpp`
    string s;
    getline(cin, s);
    for (int i = 0; i < s.length(); i++) {
        if (i == 0 || s[i - 1] == ' ') {
            s[i] = toupper(s[i]);
        }
    }
    cout << s << endl;`, CCTYPE),
    input: 'ali raza khan\n',
    why: 'Short-circuit keeps it safe: when `i == 0` is true, `s[i - 1]` (position -1) is never read.',
    yourTurn: {
      id: 'char-processing-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the input `to be`.',
      code: prog(cpp`
    string s;
    getline(cin, s);
    for (int i = 0; i < s.length(); i++) {
        if (i == 0 || s[i - 1] == ' ') {
            s[i] = toupper(s[i]);
        }
    }
    cout << s << endl;`, CCTYPE),
      input: 'to be\n',
      vars: ['i', 's'],
      hints: ['`to be` has 5 characters: t, o, space, b, e.', 'Only positions 0 and 3 start a word.'],
      explain: 'The condition is true at `i = 0` and at `i = 3` (after the space) → `To Be`.',
    },
  },
  practice: [
    { id: 'char-processing-q1', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    char c = 'b';
    cout << toupper(c) << " " << (char)toupper(c) << " " << char(c + 1);`, CCTYPE), hints: ["`'B'` is 66.", '`toupper` returns an int.'], explain: '`66 B c`: the plain `toupper` prints its number; the casts print letters.' },
    { id: 'char-processing-q2', kind: 'trace', mode: 'vars', prompt: 'Palindrome check for `noon`. Trace `i`, `j` and `pal`.', code: prog(cpp`
    string w = "noon";
    int i = 0, j = w.length() - 1;
    bool pal = true;
    while (i < j) {
        if (w[i] != w[j]) pal = false;
        i++;
        j--;
    }
    cout << pal;`), vars: ['i', 'j', 'pal'], hints: ['`j` starts at 3.', 'Compare n/n, then o/o.'], explain: 'Two rounds (0,3) and (1,2); both pairs match, so `pal` stays true → `1`.' },
    { id: 'char-processing-q3', kind: 'blanks', tag: 'real life', prompt: 'Count the digits in a phone number. Input `0300-1234567` → `11`.', code: prog(cpp`
    string s;
    cin >> s;
    int digits = 0;
    for (int i = 0; i < s.length(); i++) {
        if ([[1]](s[i])) {
            digits++;
        }
    }
    cout << [[2]];`, CCTYPE), blanks: [{ answers: ['isdigit'] }, { answers: ['digits'] }], chips: ['isdigit', 'isalpha', 'isspace', 'digits', 's.length()'], input: '0300-1234567\n', output: '11', hints: ['Which function asks "is it 0–9"?'], explain: '`isdigit` is false only for the `-`, so 11 of the 12 characters are counted.' },
    { id: 'char-processing-q4', kind: 'bug', prompt: 'A Caesar shift by 3 should turn `zoo` into `crr`, but it prints `}rr`. Find the line.', code: prog(cpp`
    string msg = "zoo";
    for (int i = 0; i < msg.length(); i++) {
        msg[i] = msg[i] + 3;
    }
    cout << msg;`), bugLine: 7, options: ["Wrap around: `msg[i] = (msg[i] - 'a' + 3) % 26 + 'a';`", 'Use `msg[i] + 2`', 'Start the loop at 1', 'Use `toupper`'], answer: 0, fixed: prog(cpp`
    string msg = "zoo";
    for (int i = 0; i < msg.length(); i++) {
        msg[i] = (msg[i] - 'a' + 3) % 26 + 'a';
    }
    cout << msg;`), hints: ["`'z'` is 122. What is 125 in ASCII?"], explain: "`'z' + 3` is 125, which is `}`. Letters must wrap around after `z` — that is what `% 26` does." },
    { id: 'char-processing-q5', kind: 'mcq', prompt: "Which call is true for the space character `' '`?", options: ["`isspace(' ')`", "`isalpha(' ')`", "`isdigit(' ')`", "`isupper(' ')`"], answer: 0, explain: 'A space is not a letter, digit or capital — `isspace` is the one that says yes.' },
    { id: 'char-processing-q6', kind: 'paths', prompt: 'Find an input character for every message.', code: prog(cpp`
    char c;
    cin >> c;
    if (isupper(c)) {
        cout << "Capital letter";
    } else if (islower(c)) {
        cout << "Small letter";
    } else if (isdigit(c)) {
        cout << "Digit";
    } else {
        cout << "Symbol";
    }`, CCTYPE), paths: [{ label: '`Capital letter`', line: 9 }, { label: '`Small letter`', line: 11 }, { label: '`Digit`', line: 13 }, { label: '`Symbol`', line: 15 }], start: 'A', hints: ['Four kinds of characters: try one of each.'], explain: 'For example `A`, `k`, `7` and `#`. (`cin >>` skips spaces, so a space cannot be typed here.)' },
    { id: 'char-processing-q7', kind: 'parsons', prompt: 'Count the vowels in a word, capitals included. Input `Apple` → `2`.', lines: [
      '#include <cctype>',
      '#include <iostream>',
      'using namespace std;',
      'int main() {',
      '    string w;',
      '    cin >> w;',
      '    int v = 0;',
      '    for (int i = 0; i < w.length(); i++) {',
      '        char c = tolower(w[i]);',
      "        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') v++;",
      '    }',
      '    cout << v;',
      '    return 0;',
      '}',
    ], distractors: ["        if (c == 'a' && c == 'e' && c == 'i' && c == 'o' && c == 'u') v++;", '        char c = toupper(w[i]);'], input: 'Apple\n', hints: ['Make the letter small first, then compare with small vowels.', 'A letter cannot be `a` AND `e` at the same time.'], explain: '`A` → `a` counts, `e` counts → 2.' },
    { id: 'char-processing-q8', kind: 'predict', prompt: 'Predict the output. How many times does `sum` change?', code: prog(cpp`
    string s = "a1b2c3";
    int sum = 0;
    for (int i = 0; i < s.length(); i++) {
        if (isdigit(s[i])) {
            sum += s[i] - '0';
        }
    }
    cout << sum;`, CCTYPE), hints: ["`'2' - '0'` is 50 - 48 = 2."], explain: 'The loop runs 6 times but `sum` changes only 3 times (for the digits): 1 + 2 + 3 = `6`.' },
  ],
  cheatsheet: [
    { code: 'isalpha isdigit isupper islower isspace', text: 'yes/no questions about one char (#include <cctype>)' },
    { code: 'c = toupper(c);  (char)tolower(c)', text: 'change case — store in a char or cast before printing' },
    { code: "c - '0'", text: 'digit character → its number value' },
    { code: "(c - 'a' + k) % 26 + 'a'", text: 'Caesar shift with wrap-around' },
  ],
};

// ------------------------------------------------------------------ Level 4: C-strings
const LS4: Level = {
  id: 'c-strings',
  kind: 'lesson',
  title: 'C-strings: char arrays',
  tagline: 'Before `std::string` there was the char array: a row of boxes with a hidden `\\0` that marks where the text ends.',
  minutes: 25,
  objectives: [
    'You can create a char array, print it and read into it with `cin >>` or `cin.getline`',
    'You can explain the `\'\\0\'` terminator and the difference between size and length',
    'You can find the length of a C-string with a loop',
  ],
  learn: [
    { t: 'p', text: 'A **C-string** is simply a `char` array. The text sits in the first boxes, and right after the last letter C++ puts a special character `\'\\0\'` (the *null terminator*, ASCII 0). It is like the **full stop** at the end of a sentence: everything after it is ignored.' },
    { t: 'viz', title: 'char name[6] = "Ali";', code: prog(cpp`
    char name[6] = "Ali";
    cout << name << endl;
    name[0] = 'E';
    cout << name << endl;
    cout << sizeof(name) << endl;`) },
    { t: 'table', head: ['Index', '0', '1', '2', '3', '4', '5'], rows: [
      ['`name[i]`', "`'A'`", "`'l'`", "`'i'`", "`'\\0'`", 'unused', 'unused'],
    ], caption: '`"Ali"` needs **4** boxes: 3 letters + the `\\0`. The other boxes are simply not used.' },
    { t: 'table', head: ['', 'Meaning', 'For `char city[10] = "Multan";`'], rows: [
      ['**size**', 'how many boxes the array has (`sizeof`)', '10'],
      ['**length**', 'how many letters come before `\\0`', '6'],
      ['boxes in use', 'length + 1 for the `\\0`', '7'],
    ] },
    { t: 'callout', tone: 'key', title: 'How cout knows where to stop', text: '`cout << name;` prints box after box until it meets `\'\\0\'`. That is the only way C++ knows where the text ends — the array itself does not remember a length.' },
    { t: 'viz', title: 'Find the length with a loop', code: prog(cpp`
    char city[10] = "Multan";
    int len = 0;
    while (city[len] != '\0') {
        len++;
    }
    cout << "Length: " << len << endl;
    cout << "Size: " << sizeof(city) << endl;`) },
    { t: 'h', text: 'Reading into a char array' },
    { t: 'compare', items: [
      { title: 'cin >> name', code: 'char name[20];\ncin >> name;   // input: Ali Khan', output: 'Ali', note: 'Stops at the first space — one word only.', good: true },
      { title: 'cin.getline(name, 20)', code: 'char name[20];\ncin.getline(name, 20);   // input: Ali Khan', output: 'Ali Khan', note: 'Reads the whole line, at most 19 letters + `\\0`.', good: true },
    ] },
    { t: 'viz', title: 'cin.getline keeps the spaces', code: prog(cpp`
    char full[20];
    cin.getline(full, 20);
    cout << "Hello, " << full << "!" << endl;`), input: 'Ali Khan\n' },
    { t: 'callout', tone: 'warn', title: 'Always leave room for \\0', text: '`char code[3] = "abc";` does **not compile**: `"abc"` needs 4 boxes. And an array cannot be given new text with `=` later (`name = "Sara";` is an error) — you need `strcpy`, coming next.' },
    { t: 'terms', items: [
      { term: 'C-string', def: 'a char array whose text ends with `\'\\0\'`' },
      { term: "null terminator `'\\0'`", def: 'the end marker, ASCII code 0 — not the digit `\'0\'` (48)' },
      { term: 'size vs length', def: 'boxes in the array vs letters before the `\\0`' },
    ] },
  ],
  ways: {
    goal: '`char s[20] = "Karachi";` — print its length: `7`.',
    items: [
      { title: 'while until the terminator', code: prog(cpp`
    char s[20] = "Karachi";
    int len = 0;
    while (s[len] != '\0') {
        len++;
    }
    cout << len;`) },
      { title: 'for loop with an empty body', code: prog(cpp`
    char s[20] = "Karachi";
    int len;
    for (len = 0; s[len] != '\0'; len++) {
    }
    cout << len;`), note: 'All the work happens in the loop header.' },
      { title: 'Short form: the char itself as the condition', code: prog(cpp`
    char s[20] = "Karachi";
    int len = 0;
    while (s[len]) {
        len++;
    }
    cout << len;`), note: "`'\\0'` is 0, which counts as false; every letter is non-zero, which counts as true." },
      { title: 'The library function strlen', code: prog(cpp`
    char s[20] = "Karachi";
    cout << strlen(s);`, CSTRING), note: 'Does the same loop for you — next level.' },
    ],
    takeaway: 'Length = number of steps until `\\0`. The size of the array (20) is a different number.',
    check: { id: 'c-strings-ways-check', kind: 'mcq', prompt: 'Which one does NOT print 7 for `char s[20] = "Karachi";`?', options: ['`cout << sizeof(s);`', '`cout << strlen(s);`', "`int n = 0; while (s[n] != '\\0') n++; cout << n;`", '`int n = 0; while (s[n]) n++; cout << n;`'], answer: 0, hints: ['Size or length?'], explain: '`sizeof(s)` is the number of boxes: **20**.' },
  },
  watch: [
    { title: 'cin >> stops at the first space', intro: 'Type a city with spaces and see what arrives in the array.', code: prog(cpp`
    char city[20];
    cin >> city;
    cout << "City: " << city << endl;`), input: 'Dera Ghazi Khan\n' },
    { title: 'Copy a C-string by hand', intro: 'Copy letter by letter — and do not forget the `\\0` at the end.', code: prog(cpp`
    char src[6] = "Hello";
    char dst[6];
    int i = 0;
    while (src[i] != '\0') {
        dst[i] = src[i];
        i++;
    }
    dst[i] = '\0';
    cout << dst << endl;`) },
  ],
  think: {
    title: 'Print a word backwards',
    problem: 'Read one word into a char array and print it backwards, e.g. `Sana` → `anaS`.',
    steps: [
      { text: 'Read the word into a char array.', lines: [5, 6] },
      { text: 'Find the length: step forward until `\\0`.', lines: [7, 8, 9] },
      { text: 'The last letter is at `len - 1`. Walk from there down to 0.', lines: [11] },
      { text: 'Print one letter per step.', lines: [12] },
    ],
    code: prog(cpp`
    char word[20];
    cin >> word;
    int len = 0;
    while (word[len] != '\0') {
        len++;
    }
    for (int i = len - 1; i >= 0; i--) {
        cout << word[i];
    }
    cout << endl;`),
    input: 'Sana\n',
    why: 'A char array does not know its length, so we measure it first. Then we reuse the backward loop from level 1.',
    yourTurn: {
      id: 'c-strings-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run with the input `Ali`. Fill in `len` and `i`.',
      code: prog(cpp`
    char word[20];
    cin >> word;
    int len = 0;
    while (word[len] != '\0') {
        len++;
    }
    for (int i = len - 1; i >= 0; i--) {
        cout << word[i];
    }
    cout << endl;`),
      input: 'Ali\n',
      vars: ['len', 'i'],
      hints: ['The while loop stops when `word[3]` is `\\0`.', 'Then `i` goes 2, 1, 0.'],
      explain: '`len` becomes 3; the for loop prints `word[2]`, `word[1]`, `word[0]` → `ilA`.',
    },
  },
  practice: [
    { id: 'c-strings-q1', kind: 'mcq', prompt: '`char s[10] = "Hello";` How many boxes of `s` are used (letters + terminator)?', options: ['6', '5', '10', '4'], answer: 0, hints: ["Don't forget the hidden one."], explain: '5 letters + `\\0` = 6 boxes. The array has 10, so 4 are unused.' },
    { id: 'c-strings-q2', kind: 'predict', tag: 'tricky', prompt: 'Predict the output.', code: prog(cpp`
    char w[8] = "cricket";
    cout << w << endl;
    w[3] = '\0';
    cout << w << endl;`), hints: ['cout stops at the first `\\0`.'], explain: 'The second print stops at the new `\\0` in box 3 → `cri`. The letters `cket` are still in memory, just never reached.' },
    { id: 'c-strings-q3', kind: 'bug', prompt: 'This does not compile. Find the line.', code: prog(cpp`
    char code[4] = "PK-92";
    cout << code;`), bugLine: 5, options: ['The array is too small: `"PK-92"` needs 6 boxes — use `char code[6]`', 'Use single quotes', 'Use `cin.getline`', 'Remove the `-`'], answer: 0, fixed: prog(cpp`
    char code[6] = "PK-92";
    cout << code;`), hints: ['Count the letters and add one.'], explain: '5 characters + `\\0` = 6 boxes. g++: *initializer-string for char[4] is too long*.' },
    { id: 'c-strings-q4', kind: 'trace', mode: 'vars', prompt: 'Trace the length loop.', code: prog(cpp`
    char w[5] = "Hi!";
    int n = 0;
    while (w[n] != '\0') {
        n++;
    }
    cout << n;`), vars: ['n'], hints: ['`w[3]` is the terminator.'], explain: 'The condition is true for `H`, `i`, `!` and false at `w[3]` → `3`.' },
    { id: 'c-strings-q5', kind: 'blanks', prompt: 'Read a full name with spaces into a char array of 20. Input `Ayesha Khan` → `Name: Ayesha Khan`.', code: prog(cpp`
    char name[20];
    cin.[[1]](name, [[2]]);
    cout << "Name: " << name;`), blanks: [{ answers: ['getline'] }, { answers: ['20', 'sizeof(name)'] }], chips: ['getline', 'get', '20', '19'], input: 'Ayesha Khan\n', output: 'Name: Ayesha Khan', hints: ['The second argument is the size of the array.'], explain: '`cin.getline(name, 20)` reads up to 19 characters and adds `\\0`.' },
    { id: 'c-strings-q6', kind: 'mcq', tag: 'real life', prompt: '`char city[20]; cin >> city;` The user types `Dera Ghazi Khan`. What is in `city`?', options: ['`Dera`', '`Dera Ghazi Khan`', '`Dera Ghazi`', 'Nothing — it needs getline'], answer: 0, explain: '`cin >>` stops at the first space. Use `cin.getline(city, 20)` for the whole name.' },
    { id: 'c-strings-q7', kind: 'parsons', prompt: 'Read a line into a char array and count its spaces. Input `I love PF` → `2`.', lines: [
      '#include <iostream>',
      'using namespace std;',
      'int main() {',
      '    char s[50];',
      '    cin.getline(s, 50);',
      '    int spaces = 0;',
      "    for (int i = 0; s[i] != '\\0'; i++) {",
      "        if (s[i] == ' ') spaces++;",
      '    }',
      '    cout << spaces;',
      '    return 0;',
      '}',
    ], distractors: ['    cin >> s;', "    for (int i = 0; i < 50; i++) {"], input: 'I love PF\n', hints: ['`cin >>` would stop at the first space.', 'Stop at the terminator, not at the size.'], explain: 'The loop stops at `\\0` — we never look at the unused boxes, which hold garbage.' },
    { id: 'c-strings-q8', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    char s[] = "Ok!";
    cout << sizeof(s) << s[1];`), hints: ['With empty `[]`, C++ counts the boxes for you — including `\\0`.'], explain: '3 letters + `\\0` = 4 boxes; `s[1]` is `k` → `4k`.' },
  ],
  cheatsheet: [
    { code: 'char name[20] = "Ali";', text: '20 boxes; 3 letters + \\0 are used' },
    { code: "while (s[n] != '\\0') n++;", text: 'length with a loop' },
    { code: 'cin >> s;   cin.getline(s, 20);', text: 'one word / whole line (max 19 letters)' },
    { code: 'sizeof(s)', text: 'number of boxes — NOT the length' },
  ],
};

// ------------------------------------------------------------------ Level 5: <cstring>
const LS5: Level = {
  id: 'cstring-functions',
  kind: 'lesson',
  title: '<cstring> functions',
  tagline: 'Char arrays cannot use `=`, `+` or `==`. The `<cstring>` library gives you functions for copying, joining, measuring and comparing.',
  minutes: 25,
  objectives: [
    'You can use `strlen`, `strcpy`, `strcat` and `strncpy`',
    'You can read the result of `strcmp` (0 = equal, negative / positive = order)',
    'You can explain why a too-small buffer is dangerous and choose between C-strings and `std::string`',
  ],
  learn: [
    { t: 'table', head: ['Function', 'Does', 'Like std::string'], rows: [
      ['`strlen(s)`', 'number of letters before `\\0`', '`s.length()`'],
      ['`strcpy(dst, src)`', 'copy `src` into `dst` (with `\\0`)', '`dst = src;`'],
      ['`strcat(dst, src)`', 'add `src` to the end of `dst`', '`dst += src;`'],
      ['`strcmp(a, b)`', '0 if equal; negative if `a` comes first; positive if `b` comes first', '`a == b`, `a < b`'],
      ['`strncpy(dst, src, n)`', 'copy at most `n` letters', '`dst = src.substr(0, n);`'],
    ], caption: 'Add `#include <cstring>`. The destination always comes **first**, like `dst = src`.' },
    { t: 'viz', title: 'Copy, join, measure', code: prog(cpp`
    char first[20] = "Ali";
    char full[20];
    strcpy(full, first);
    strcat(full, " Raza");
    cout << full << endl;
    cout << strlen(full) << " of " << sizeof(full) << endl;`, CSTRING) },
    { t: 'syntax', title: 'strcmp', code: 'if (strcmp(a, b) == 0) { … }', parts: [
      { token: 'strcmp(a, b)', text: 'compares letter by letter, like a dictionary' },
      { token: '== 0', text: 'zero means **equal** — careful, not "false"!' },
      { token: '< 0 / > 0', text: '`a` comes before `b` / after `b`. Only the **sign** matters; the exact number can be -1, -18, …' },
    ] },
    { t: 'viz', title: 'Which word comes first?', code: prog(cpp`
    char a[10] = "apple";
    char b[10] = "apricot";
    if (strcmp(a, b) == 0) {
        cout << "same" << endl;
    } else if (strcmp(a, b) < 0) {
        cout << a << " comes first" << endl;
    } else {
        cout << b << " comes first" << endl;
    }`, CSTRING) },
    { t: 'callout', tone: 'warn', title: 'Never compare char arrays with ==', text: '`if (a == b)` compares the **addresses** of the two arrays, not the letters. Two different arrays are never at the same address, so it is false even for the same text. Use `strcmp(a, b) == 0`.' },
    { t: 'h', text: 'strncpy: copy only the first n letters' },
    { t: 'viz', title: 'A 3-letter city code', code: prog(cpp`
    char city[10] = "Lahore";
    char code[4];
    strncpy(code, city, 3);
    code[3] = '\0';
    cout << code << endl;`, CSTRING) },
    { t: 'callout', tone: 'info', title: 'strncpy does not always add \\0', text: 'If the source is longer than `n`, `strncpy` copies exactly `n` letters and **no terminator**. Add it yourself: `code[3] = \'\\0\';`.' },
    { t: 'h', text: 'The buffer danger' },
    { t: 'compare', items: [
      { title: 'Too small', good: false, code: 'char small[5];\nstrcpy(small, "Islamabad");', note: '9 letters + `\\0` need 10 boxes. `strcpy` does not check — it writes past the end and damages other variables (a *buffer overflow*). The program may crash or behave randomly.' },
      { title: 'Big enough', good: true, code: 'char big[10];\nstrcpy(big, "Islamabad");', note: 'Always make the destination at least **length + 1**. `strcpy`, `strcat` never check the size for you.' },
    ] },
    { t: 'table', head: ['', 'C-string `char s[20]`', '`std::string s`'], rows: [
      ['Size', 'fixed when you declare it', 'grows by itself'],
      ['Copy', '`strcpy(a, b)`', '`a = b`'],
      ['Join', '`strcat(a, b)`', '`a + b`, `a += b`'],
      ['Length', '`strlen(s)`', '`s.length()`'],
      ['Compare', '`strcmp(a, b) == 0`', '`a == b`, `a < b`'],
      ['Read a line', '`cin.getline(s, 20)`', '`getline(cin, s)`'],
      ['Danger', 'overflow if too small', 'safe'],
    ], caption: 'Use `std::string` in your own programs. Know C-strings because exams, old code and many libraries use them.' },
  ],
  ways: {
    goal: 'Put `Hello` and `World` together into a char array and print `Hello World`.',
    items: [
      { title: 'strcpy, then strcat twice', code: prog(cpp`
    char a[10] = "Hello", b[10] = "World";
    char full[20];
    strcpy(full, a);
    strcat(full, " ");
    strcat(full, b);
    cout << full;`, CSTRING) },
      { title: 'Start with text in the array', code: prog(cpp`
    char full[20] = "Hello";
    strcat(full, " ");
    strcat(full, "World");
    cout << full;`, CSTRING), note: 'Initialising with `=` is allowed only in the declaration.' },
      { title: 'By hand with loops', code: prog(cpp`
    char a[10] = "Hello", b[10] = "World";
    char full[20];
    int k = 0;
    for (int i = 0; a[i] != '\0'; i++) full[k++] = a[i];
    full[k++] = ' ';
    for (int i = 0; b[i] != '\0'; i++) full[k++] = b[i];
    full[k] = '\0';
    cout << full;`), note: 'What `strcpy` and `strcat` do inside.' },
      { title: 'With std::string instead', code: prog(cpp`
    char a[10] = "Hello", b[10] = "World";
    string full = a;
    full += " ";
    full += b;
    cout << full;`), note: 'A `string` can be made from a char array.' },
    ],
    takeaway: 'With char arrays every copy and join is a function call. With `std::string` it is just `=` and `+`.',
    check: { id: 'cstring-functions-ways-check', kind: 'mcq', prompt: 'With `char a[10] = "Hi", b[10] = "!", c[20];` which line does NOT compile?', options: ['`c = a + b;`', '`strcpy(c, a);`', '`strcat(c, b);`', '`cout << strlen(a);`'], answer: 0, hints: ['Arrays cannot be assigned or added.'], explain: '`+` does not join char arrays, and an array cannot be assigned with `=`. Use `strcpy` + `strcat`.' },
  },
  watch: [
    { title: 'Password login with strcmp', intro: 'Compare the typed text with the saved password.', code: prog(cpp`
    char pass[20];
    cin >> pass;
    if (strcmp(pass, "pak123") == 0) {
        cout << "Welcome!" << endl;
    } else {
        cout << "Wrong password" << endl;
    }`, CSTRING), input: 'pak123\n' },
    { title: 'Route code: Lah-Kar', intro: '`strncpy` takes 3 letters, `strcat` adds a dash, `strncat` adds 3 more.', code: prog(cpp`
    char from[10] = "Lahore", to[10] = "Karachi";
    char code[10];
    strncpy(code, from, 3);
    code[3] = '\0';
    strcat(code, "-");
    strncat(code, to, 3);
    cout << code << endl;`, CSTRING) },
  ],
  think: {
    title: 'Confirm a new password',
    problem: 'A sign-up screen reads the password twice. If it has fewer than 6 letters print `Too short`; if the two do not match print `Passwords do not match`; otherwise `Password saved`.',
    steps: [
      { text: 'Read both passwords into char arrays.', lines: [6, 7] },
      { text: 'Measure the first with `strlen`.', lines: [8] },
      { text: 'Compare the two with `strcmp` — not 0 means different.', lines: [10] },
      { text: 'Every rule passed → save.', lines: [12, 13] },
    ],
    code: prog(cpp`
    char p1[20], p2[20];
    cin >> p1 >> p2;
    if (strlen(p1) < 6) {
        cout << "Too short" << endl;
    } else if (strcmp(p1, p2) != 0) {
        cout << "Passwords do not match" << endl;
    } else {
        cout << "Password saved" << endl;
    }`, CSTRING),
    input: 'sky123 sky123\n',
    why: 'Check the cheap rule (length) first; only then compare. `strcmp` is the only correct way to compare two char arrays.',
    yourTurn: {
      id: 'cstring-functions-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'Dry run with `sky123 sky124`. What is printed?',
      code: prog(cpp`
    char p1[20], p2[20];
    cin >> p1 >> p2;
    if (strlen(p1) < 6) {
        cout << "Too short" << endl;
    } else if (strcmp(p1, p2) != 0) {
        cout << "Passwords do not match" << endl;
    } else {
        cout << "Password saved" << endl;
    }`, CSTRING),
      input: 'sky123 sky124\n',
      hints: ['`strlen("sky123")` is 6 — not less than 6.', 'The last letters differ, so strcmp is not 0.'],
      explain: 'The length rule passes, but `strcmp` is non-zero → `Passwords do not match`.',
    },
  },
  practice: [
    { id: 'cstring-functions-q1', kind: 'predict', prompt: 'Predict the output.', code: prog(cpp`
    char s[15] = "Quetta";
    cout << strlen(s) << " " << sizeof(s);`, CSTRING), hints: ['Letters vs boxes.'], explain: '`strlen` counts 6 letters; `sizeof` counts 15 boxes → `6 15`.' },
    { id: 'cstring-functions-q2', kind: 'mcq', tag: 'tricky', prompt: '`if (strcmp(a, b)) { cout << "X"; }` — when is `X` printed?', options: ['When `a` and `b` are **different**', 'When `a` and `b` are equal', 'Always', 'Never'], answer: 0, hints: ['Equal gives 0. What is 0 inside an if?'], explain: 'strcmp gives 0 for equal, and 0 is false. Any non-zero (different) result is true. Write `!= 0` to make it clear.' },
    { id: 'cstring-functions-q3', kind: 'bug', prompt: 'The user types the right PIN `4321`, but the program says `Wrong PIN`. Find the line.', code: prog(cpp`
    char saved[10] = "4321";
    char typed[10];
    cin >> typed;
    if (typed == saved) {
        cout << "Welcome";
    } else {
        cout << "Wrong PIN";
    }`, CSTRING), input: '4321\n', bugLine: 9, options: ['Use `strcmp(typed, saved) == 0`', 'Use `typed = saved`', 'Make the arrays bigger', 'Use `strlen(typed) == strlen(saved)`'], answer: 0, fixed: prog(cpp`
    char saved[10] = "4321";
    char typed[10];
    cin >> typed;
    if (strcmp(typed, saved) == 0) {
        cout << "Welcome";
    } else {
        cout << "Wrong PIN";
    }`, CSTRING), hints: ['What does `==` compare for arrays?'], explain: '`typed == saved` compares two different addresses → always false. `strcmp` compares the letters. (Equal length is not enough: `1234` has the same length.)' },
    { id: 'cstring-functions-q4', kind: 'blanks', prompt: 'Build `Mr. Ahmed` in `full`. Expected output: `Mr. Ahmed`.', code: prog(cpp`
    char name[10] = "Ahmed";
    char full[20];
    [[1]](full, "Mr. ");
    [[2]](full, name);
    cout << full;`, CSTRING), blanks: [{ answers: ['strcpy'] }, { answers: ['strcat'] }], chips: ['strcpy', 'strcat', 'strcmp', 'strlen'], output: 'Mr. Ahmed', hints: ['`full` is empty (garbage) at first — copy, do not join.', 'Then add to its end.'], explain: '`strcpy` puts `Mr. ` in, `strcat` adds `Ahmed` after it.' },
    { id: 'cstring-functions-q5', kind: 'trace', mode: 'vars', prompt: 'Trace `n` after each step.', code: prog(cpp`
    char s[20] = "PF";
    int n = strlen(s);
    strcat(s, "-101");
    n = strlen(s);
    strcpy(s, "OK");
    n = strlen(s);
    cout << s << " " << n;`, CSTRING), vars: ['n'], hints: ['`strcat` makes it `PF-101`.', '`strcpy` replaces everything.'], explain: '`n` goes 2 → 6 → 2. Output `OK 2`.' },
    { id: 'cstring-functions-q6', kind: 'mcq', prompt: 'Which statement about `std::string` and C-strings is TRUE?', options: ['`a == b` compares the text of two `std::string`s, but for char arrays you need `strcmp`', 'Char arrays grow automatically', '`strcat` checks that the destination is big enough', '`sizeof` gives the length of a C-string'], answer: 0, explain: 'Char arrays have a fixed size, `strcat` never checks, and `sizeof` gives the number of boxes.' },
    { id: 'cstring-functions-q7', kind: 'parsons', tag: 'real life', prompt: 'Make a 3-letter code from a city name. Input `Islamabad` → `Isl`.', lines: [
      '#include <cstring>',
      '#include <iostream>',
      'using namespace std;',
      'int main() {',
      '    char city[20], code[4];',
      '    cin >> city;',
      '    strncpy(code, city, 3);',
      "    code[3] = '\\0';",
      '    cout << code;',
      '    return 0;',
      '}',
    ], distractors: ['    code = city;', '    strcpy(code, city);'], input: 'Islamabad\n', hints: ['Copy only 3 letters.', 'strncpy does not add the terminator here.'], explain: '`strcpy` would write 10 characters into 4 boxes — an overflow. `strncpy` + `\\0` is safe.' },
    { id: 'cstring-functions-q8', kind: 'mcq', prompt: '`char a[6]; strcpy(a, "Pakistan");` What happens?', options: ['It writes past the end of `a` — undefined behaviour (crash or corrupted variables)', 'C++ copies only 5 letters', 'Compile error', 'The array grows to 9 boxes'], answer: 0, hints: ['Does strcpy know the size of `a`?'], explain: '`Pakistan` needs 9 boxes. `strcpy` never checks, so it overwrites memory after `a`. The array must have at least 9 boxes.' },
  ],
  cheatsheet: [
    { code: 'strlen(s)', text: 'letters before \\0' },
    { code: 'strcpy(dst, src)  strcat(dst, src)', text: 'copy / add to the end — dst must be big enough!' },
    { code: 'strcmp(a, b) == 0', text: 'equal; < 0 → a first; > 0 → b first' },
    { code: "strncpy(dst, src, n); dst[n] = '\\0';", text: 'copy n letters, then terminate' },
  ],
};

// ------------------------------------------------------------------ Checkpoint
const CS: Level = {
  id: 'checkpoint-strings',
  kind: 'revision',
  title: 'Strings',
  tagline: 'Passwords, CNICs, phone numbers, card numbers and names — real text problems that need loops, string tools, `<cctype>` and C-strings.',
  minutes: 35,
  objectives: [
    'Validate real input (password, CNIC, phone number) character by character',
    'Transform text: initials, usernames, masks and secret messages',
    'Choose between `std::string` tools and `<cstring>` functions',
  ],
  practice: [
    { id: 'checkpoint-strings-q1', kind: 'paths', tag: 'real life', prompt: 'Password rules: at least 8 characters, at least one digit and one capital letter. Find a password for every message.', code: prog(cpp`
    string p;
    cin >> p;
    bool digit = false, upper = false;
    for (int i = 0; i < p.length(); i++) {
        if (isdigit(p[i])) digit = true;
        if (isupper(p[i])) upper = true;
    }
    if (p.length() < 8) {
        cout << "Too short";
    } else if (!digit) {
        cout << "Add a digit";
    } else if (!upper) {
        cout << "Add a capital letter";
    } else {
        cout << "Strong";
    }`, CCTYPE), paths: [{ label: '`Too short`', line: 14 }, { label: '`Add a digit`', line: 16 }, { label: '`Add a capital letter`', line: 18 }, { label: '`Strong`', line: 20 }], start: 'abc', hints: ['Make it long first, then add a digit, then a capital.'], explain: 'For example `abc`, `abcdefgh`, `abcdefg1` and `Abcdefg1`.' },
    { id: 'checkpoint-strings-q2', kind: 'blanks', tag: 'real life', prompt: 'A CNIC is typed without dashes. It is valid when it has exactly 13 characters and all are digits. Input `3520212345671` → `Valid`.', code: prog(cpp`
    string cnic;
    cin >> cnic;
    bool ok = cnic.[[1]]() == 13;
    for (int i = 0; i < cnic.length(); i++) {
        if (![[2]](cnic[i])) {
            ok = false;
        }
    }
    if (ok) cout << "Valid";
    else cout << "Invalid";`, CCTYPE), blanks: [{ answers: ['length', 'size'] }, { answers: ['isdigit'] }], chips: ['length', 'isdigit', 'isalpha', 'find'], input: '3520212345671\n', output: 'Valid', hints: ['Which tool counts the characters?', 'One non-digit is enough to make it invalid.'], explain: 'Length 13 AND no character fails `isdigit` → `Valid`.' },
    { id: 'checkpoint-strings-q3', kind: 'predict', tag: 'real life', prompt: 'Initials from a name. Predict the output.', code: prog(cpp`
    string name = "Muhammad Ali Jinnah";
    string init = "";
    init += name[0];
    for (int i = 1; i < name.length(); i++) {
        if (name[i - 1] == ' ') {
            init += name[i];
        }
    }
    cout << init;`), hints: ['A letter right after a space starts a word.'], explain: 'Position 0 gives `M`; the letters after the two spaces give `A` and `J` → `MAJ`.' },
    { id: 'checkpoint-strings-q4', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'Word count: a word starts at a non-space whose left neighbour is a space (or that is the very first character). Trace it for `Go on PF`.', code: prog(cpp`
    string s = "Go on PF";
    int words = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s[i] != ' ' && (i == 0 || s[i - 1] == ' ')) {
            words++;
        }
    }
    cout << words;`), vars: ['i', 'words'], hints: ['Word starts are at positions 0, 3 and 6.'], explain: '`words` grows at `i = 0`, `3` and `6` → `3`.' },
    { id: 'checkpoint-strings-q5', kind: 'bug', tag: 'real life', prompt: 'A receipt should hide a card number except the last 4 digits: `************4444`. It prints `*************444`. Find the line.', code: prog(cpp`
    string card = "4111222233334444";
    for (int i = 0; i <= card.length() - 4; i++) {
        card[i] = '*';
    }
    cout << card;`), bugLine: 6, options: ['Use `<` instead of `<=`', 'Start at `i = 1`', 'Use `card.length() - 3`', "Use `card[i] == '*'`"], answer: 0, fixed: prog(cpp`
    string card = "4111222233334444";
    for (int i = 0; i < card.length() - 4; i++) {
        card[i] = '*';
    }
    cout << card;`), hints: ['16 digits, keep 4: how many stars?', 'With `<=` the loop also runs for `i = 12`.'], explain: 'Positions 0 to 11 (12 of them) must become `*`. `<=` also hides position 12 — the classic off-by-one.' },
    { id: 'checkpoint-strings-q6', kind: 'mcq', tag: 'real life', prompt: 'A mobile number must look like `0300-1234567`. Which condition checks the length and the dash?', options: ["`s.length() == 12 && s[4] == '-'`", "`s.length() == 11 && s[4] == '-'`", "`s.length() == 12 && s[5] == '-'`", "`s.length() == 12 || s[4] == '-'`"], answer: 0, hints: ['Count: 4 digits, a dash, 7 digits.', 'The dash is the 5th character.'], explain: '4 + 1 + 7 = 12 characters; the 5th character is at position **4**. Both must be true → `&&`.' },
    { id: 'checkpoint-strings-q7', kind: 'predict', tag: 'tricky', prompt: 'Sort names in a class list. Predict the output.', code: prog(cpp`
    string names[3] = {"sara", "Ali", "bilal"};
    sort(names, names + 3);
    for (int i = 0; i < 3; i++) {
        cout << names[i] << " ";
    }`, '#include <algorithm>\n'), hints: ['`sort` uses `<`, which is dictionary order by ASCII.'], explain: 'Capital `A` (65) comes before every small letter, then `b` < `s` → `Ali bilal sara `.' },
    { id: 'checkpoint-strings-q8', kind: 'mcq', prompt: '`string s = "Ali"; char c[10] = "Ali";` Which line does NOT compile?', options: ['`c = "Sara";`', '`s = "Sara";`', '`strcpy(c, "Sara");`', '`s += c;`'], answer: 0, hints: ['Which one uses `=` on an array?'], explain: 'An array cannot be assigned. `std::string` accepts `=` and `+=` (even with a char array); `strcpy` is the C-string way.' },
    { id: 'checkpoint-strings-q9', kind: 'blanks', tag: 'real life', prompt: 'Make a username: the part of the email before `@`, all in small letters. Expected output: `ali.khan`.', code: prog(cpp`
    string email = "Ali.Khan@Gmail.com";
    string user = email.substr(0, email.[[1]]('@'));
    for (int i = 0; i < user.length(); i++) {
        user[i] = [[2]](user[i]);
    }
    cout << user;`, CCTYPE), blanks: [{ answers: ['find'] }, { answers: ['tolower'] }], chips: ['find', 'substr', 'tolower', 'toupper'], output: 'ali.khan', hints: ['The position of `@` is also the count of letters before it.'], explain: '`find` gives 8, so `substr(0, 8)` is `Ali.Khan`; `tolower` changes only the capitals.' },
    { id: 'checkpoint-strings-q10', kind: 'predict', prompt: 'Two cities in alphabetical order. Predict the output.', code: prog(cpp`
    char a[10] = "Multan", b[10] = "Mardan";
    if (strcmp(a, b) < 0) {
        cout << a << " " << b;
    } else {
        cout << b << " " << a;
    }`, CSTRING), hints: ['Both start with `M`. Compare the 2nd letters.'], explain: "`'u'` > `'a'`, so `strcmp` is positive → the else → `Mardan Multan`." },
    { id: 'checkpoint-strings-q11', kind: 'trace', mode: 'vars', tag: 'real life', prompt: 'A friend sent a secret message shifted by 3. Decode it: move every letter 3 places **back** (with wrap-around).', code: prog(cpp`
    string msg = "fdw";
    for (int i = 0; i < msg.length(); i++) {
        msg[i] = (msg[i] - 'a' - 3 + 26) % 26 + 'a';
    }
    cout << msg;`), vars: ['i', 'msg'], hints: ["`'f' - 'a'` is 5; 5 - 3 + 26 = 28; 28 % 26 = 2 → `c`.", 'The `+ 26` keeps the number positive for letters like `a`, `b`, `c`.'], explain: '`f→c`, `d→a`, `w→t` → `cat`.' },
    { id: 'checkpoint-strings-q12', kind: 'mcq', tag: 'real life', prompt: 'A mobile number `03001234567` (11 digits) is shown with only the last 4 visible: `*******4567`. How many times does the hiding loop `for (int i = 0; i < s.length() - 4; i++) s[i] = \'*\';` run?', options: ['7', '4', '11', '8'], answer: 0, hints: ['`i` goes from 0 up to `length() - 5`.'], explain: '`11 - 4 = 7` positions (0 to 6) become stars.' },
    { id: 'checkpoint-strings-q13', kind: 'blanks', tag: 'real life', prompt: '**Capstone — registration slip.** Read a full name (one line) and a phone number. Print the initials in capitals and the phone number with only the last 4 digits visible. Input `sara ahmed khan` / `03214567890` → `SAK *******7890`.', code: prog(cpp`
    string name, phone;
    getline(cin, name);
    cin >> phone;
    string init = "";
    for (int i = 0; i < name.length(); i++) {
        if (i == 0 || name[i - 1] == [[1]]) {
            init += (char)[[2]](name[i]);
        }
    }
    for (int i = 0; i < phone.length() [[3]]; i++) {
        phone[i] = [[4]];
    }
    cout << init << " " << phone << endl;`, CCTYPE), blanks: [{ answers: ["' '"] }, { answers: ['toupper'] }, { answers: ['- 4', '-4'] }, { answers: ["'*'"] }], chips: ["' '", 'toupper', 'tolower', '- 4', '- 3', "'*'", '"*"'], input: 'sara ahmed khan\n03214567890\n', output: 'SAK *******7890\n', hints: ['A word starts after a space.', 'Initials must be capitals.', 'Keep the last 4 digits.', 'A single character goes in single quotes.'], explain: 'Initials: positions 0, 5 and 11 → `S`, `A`, `K`. Phone: 11 digits, the first 7 become `*` → `SAK *******7890`.' },
  ],
  cheatsheet: [
    { code: 'for (i …) if (isdigit(s[i])) …', text: 'check every character of an input' },
    { code: "i == 0 || s[i - 1] == ' '", text: 'this position starts a word' },
    { code: 's.substr(0, s.find(c))', text: 'the part before a character' },
    { code: "i < s.length() - 4 → '*'", text: 'mask all but the last 4' },
  ],
  exam: {
    title: 'Exam Challenge: Strings & characters',
    intro: '**Instructions:** State the output of each program below. If there is an error, write it explicitly and give the line number. Assume all the required headers are included. Use a rough sheet: write every string after every change, and keep an ASCII table in your head (`\'0\'` = 48, `\'A\'` = 65, `\'a\'` = 97).',
    questions: [
      { id: 'checkpoint-strings-x1', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: prog(cpp`
    string s = "PAKISTAN";
    s.erase(1, 3);
    s.insert(2, "ak");
    cout << s << " " << s.length() << endl;
    cout << s.substr(3, 2) << s.find('A') << endl;
    s = s + "!" + s[0];
    cout << s << (s > "Pz") << endl;`), hints: ['`erase(1, 3)` removes 3 characters starting at position 1.', 'Strings are compared letter by letter by ASCII: is `\'S\'` smaller than `\'z\'`?'], explain: '`erase(1, 3)` removes `AKI` → `PSTAN`. `insert(2, "ak")` puts `ak` before position 2 → `PSakTAN`, length `7`. Line 1: `PSakTAN 7`.\n\nPositions: P0 S1 a2 k3 T4 A5 N6. `substr(3, 2)` = `kT`, and the capital `A` is at position `5` (the small `a` does not match) → line 2: `kT5`.\n\n`s + "!" + s[0]` → `PSakTAN!P`. Compare with `"Pz"`: first letters equal, then `\'S\'` (83) < `\'z\'` (122), so `s > "Pz"` is false → `0`. Line 3: `PSakTAN!P0`.' },
      { id: 'checkpoint-strings-x2', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: prog(cpp`
    char c = 'A' + 2;
    int gap = 'a' - 'A';
    cout << c << c + 1 << (char)(c + gap) << endl;
    cout << '7' - '0' + '3' << " " << (char)('0' + 9) << endl;
    char d = 'z';
    d++;
    cout << d << " " << (int)'z' + 1 << endl;`), hints: ['`c + 1` is an `int` expression — `cout` prints a number, not a letter.', 'The character after `\'z\'` (122) in the ASCII table is `{` (123).'], explain: '`c` = 65 + 2 = 67 = `\'C\'`. `gap` = 97 − 65 = `32`.\n\nLine 1: `c` prints `C`; `c + 1` is an **int** → `68`; `(char)(67 + 32)` = `(char)99` = `c` → `C68c`.\n\nLine 2: `\'7\' - \'0\'` = 7, then `+ \'3\'` adds 51 → `58`. `(char)(48 + 9)` = `\'9\'` → `58 9`.\n\nLine 3: `d++` makes `d` = 123, which is the character `{`. `(int)\'z\' + 1` = `123` → `{ 123`.' },
      { id: 'checkpoint-strings-x3', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it (with the line number).', code: prog(cpp`
    string city = "Lahore";
    string a = city + " " + "Qalandars";
    string b = "Karachi " + "Kings";
    cout << a << endl << b;`), hints: ['What is the type of `"Karachi "` on its own? Is it a `std::string`?', 'Line 6 works because the first operand is already a `string`.'], explain: '**Compile error on line 7:** `invalid operands of types \'const char [9]\' and \'const char [6]\' to binary \'operator+\'`.\n\nA text in double quotes is a **C-string** (a char array), not a `std::string`. Two char arrays cannot be added with `+`. Line 6 is fine: `city + " "` is a `string` (because `city` is a string), and a string plus `"Qalandars"` is again a string.\n\n**Fix:** make one side a string: `string b = string("Karachi ") + "Kings";` or simply `string b = "Karachi Kings";`.' },
      { id: 'checkpoint-strings-x4', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: prog(cpp`
    char a[20] = "Pak";
    char b[] = "istan";
    cout << sizeof(a) << " " << strlen(a) << " " << sizeof(b) << endl;
    strcat(a, b);
    cout << a << " " << strlen(a) << endl;
    strcpy(b, "zoo");
    cout << b << " " << sizeof(b) << " " << (strcmp(a, b) < 0) << endl;`, CSTRING), hints: ['`sizeof` counts the boxes of the array (including the `\\0`); `strlen` counts letters up to the `\\0`.', '`char b[] = "istan"` makes an array of exactly 6 boxes, and it never changes size.'], explain: 'Line 1: `a` has **20** boxes (`sizeof`), but only **3** letters (`strlen`). `b` is sized by its text: 5 letters + `\\0` = **6** → `20 3 6`.\n\nLine 2: `strcat` appends `istan` to `a` → `Pakistan`, `strlen` = `8` → `Pakistan 8`.\n\nLine 3: `strcpy(b, "zoo")` overwrites `b` (4 of its 6 boxes are used). `sizeof(b)` is still `6`. `strcmp("Pakistan", "zoo")`: `\'P\'` (80) < `\'z\'` (122), so the result is negative and `< 0` is true → `zoo 6 1`.' },
      { id: 'checkpoint-strings-x5', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it (with the line number).', code: prog(cpp`
    string name = "Ayesha";
    char copy[10];
    strcpy(copy, name.c_str());
    cout << strlen(copy) << " " << strlen(name);`, CSTRING), hints: ['`strlen` belongs to `<cstring>`. What type of argument does it expect?', 'Line 8 works because `c_str()` turns the string into a C-string.'], explain: '**Compile error on line 9:** `cannot convert \'std::string\' to \'const char*\'`.\n\n`strlen` only accepts a C-string (`const char*`). `name` is a `std::string`, and C++ does not convert it automatically. Line 8 is correct because `name.c_str()` gives a C-string copy.\n\n**Fix:** use `name.length()` (the string way) or `strlen(name.c_str())`. Then the program prints `6 6`.' },
      { id: 'checkpoint-strings-x6', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it.', code: prog(cpp`
    string s = "a1B2c3";
    int sum = 0;
    for (int i = 0; i < s.length(); i++) {
        if (isdigit(s[i])) sum += s[i] - '0';
        else if (islower(s[i])) s[i] = toupper(s[i]);
        else s[i] = '*';
    }
    cout << s << " " << sum << " " << toupper('x') << endl;`, CCTYPE), hints: ['A capital letter is not a digit and not lower case — which branch does it take?', '`toupper` returns an **int**. What does `cout` print for an int?'], explain: 'Walk through `a1B2c3`:\n- `a` → lower → `A`\n- `1` → digit → sum = 1\n- `B` → not digit, not lower → `*`\n- `2` → sum = 3\n- `c` → `C`\n- `3` → sum = 6\n\nSo `s` = `A1*2C3` and `sum` = `6`. The trap: `toupper(\'x\')` returns the **int** 88, and `cout` prints it as a number (inside the loop it was stored in a `char` box, so it became a letter again). Output: `A1*2C3 6 88`.' },
      { id: 'checkpoint-strings-x7', kind: 'predict', tag: 'exam', prompt: 'State the output. If there is an error, write it (with the line number).', code: prog(cpp`
    string s = "lahore";
    s[0] = toupper(s[0]);
    s[s.length() - 1] = "E";
    cout << s;`, CCTYPE), hints: ['`s[i]` is one `char` box. What is `"E"` — a char or a text?'], explain: '**Compile error on line 8:** `invalid conversion from \'const char*\' to \'char\'`.\n\n`s[s.length() - 1]` is a single `char`. `"E"` (double quotes) is a C-string — an array of two characters `E` and `\\0` — not a single character. A string cannot be stored in a char box. Line 7 is fine: `toupper` returns the int 76, which is stored as the char `L`.\n\n**Fix:** use single quotes: `s[s.length() - 1] = \'E\';` → then it prints `LahorE`.' },
      { id: 'checkpoint-strings-x8', kind: 'count', tag: 'exam', prompt: 'How many times does the text `ab` appear in the output?', code: prog(cpp`
    string w = "b";
    for (int i = 1; i <= 4; i++) {
        if (i % 2 == 0) w = "a" + w;
        else w += "a";
        cout << w << " ";
    }`), count: { text: 'ab' }, hints: ['Odd `i` adds `a` at the end, even `i` adds `a` at the front.', 'Write the four words first, then look for `ab`.'], explain: 'The word after each round:\n- `i = 1` (odd): `ba`\n- `i = 2` (even): `aba`\n- `i = 3`: `abaa`\n- `i = 4`: `aabaa`\n\nOutput: `ba aba abaa aabaa `. `ba` has no `ab`; each of the other three words has exactly one → **3**. (Note: `"a" + w` compiles because `w` is a `string`.)' },
      { id: 'checkpoint-strings-x9', kind: 'count', tag: 'exam', prompt: 'How many times is `countA` called in total (count the first call from `main` too)? What does the program print?', code: cpp`
#include <iostream>
using namespace std;

int countA(string s, int i) {
    if (i >= s.length()) return 0;
    if (s[i] == 'n') return countA(s, i + 2);
    return (s[i] == 'a') + countA(s, i + 1);
}

int main() {
    cout << countA("banana", 0);
    return 0;
}
`, count: { calls: 'countA' }, hints: ['After an `n` the next call jumps 2 positions — the letter after `n` is never checked.', 'Positions of `banana`: b0 a1 n2 a3 n4 a5.'], explain: 'Calls with `i` = `0` (b, +0) → `1` (a, +1) → `2` (n, jump) → `4` (n, jump) → `6` (6 ≥ 6, return 0). That is **5** calls.\n\nOnly the `a` at position 1 is counted — positions 3 and 5 are skipped by the jumps — so the program prints `1`. `(s[i] == \'a\')` is a `bool` that becomes `1` or `0` in the addition.' },
      { id: 'checkpoint-strings-x10', kind: 'blanks', tag: 'exam', prompt: 'Complete the program so it prints the words of the sentence in **reverse order**: `PF is fun` → `fun is PF`. Walk from the end; every time a space is found, print the word after it.', code: prog(cpp`
    string s = "PF is fun";
    int end = s.length();
    for (int i = s.length() - 1; i >= 0; i--) {
        if (s[i] == [[1]]) {
            cout << s.[[2]](i + 1, end - i - 1) << " ";
            end = [[3]];
        }
    }
    cout << s.substr(0, [[4]]);`), blanks: [{ answers: ["' '"] }, { answers: ['substr'] }, { answers: ['i'] }, { answers: ['end'] }], chips: ["' '", '" "', 'substr', 'find', 'i', 'end', 'i + 1'], output: 'fun is PF', hints: ['`end` is the position just after the current word (a space or the end of the string).', 'The word after the space at `i` starts at `i + 1` and has `end - i - 1` letters.'], explain: '`end` starts at 9. At `i = 5` (a space) print `substr(6, 3)` = `fun`, set `end = 5`. At `i = 2` print `substr(3, 2)` = `is`, set `end = 2`. After the loop the first word is `substr(0, 2)` = `PF`. Output: `fun is PF`.' },
    ],
  },
};

export const unit9: Unit = {
  id: 'u9',
  num: 9,
  title: 'Strings & characters',
  summary: 'Work with text letter by letter — `std::string` and C-style char arrays.',
  levels: [LS1, LS2, LS3, LS4, LS5, CS],
};
