import type { Level } from '../types';
import { cpp, prog } from '../helpers';

const HELLO = cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}
`;

export const L1: Level = {
  id: 'first-program',
  kind: 'lesson',
  title: 'Your first C++ program',
  tagline: 'Every C++ program has the same skeleton. Learn what each line does — and where the computer starts reading.',
  minutes: 15,
  objectives: [
    'Name the parts of every C++ program and say what each one does',
    'Explain that execution starts inside `main()` and goes top to bottom',
    'Fix the three most common beginner errors: a missing `;`, a missing `}` and a capital letter in `cout`',
  ],

  learn: [
    {
      t: 'p',
      text: 'A program is a list of instructions. The computer follows them **one at a time, top to bottom**, starting inside `main()`. Here is the smallest useful C++ program. It prints *Hello, World!* on the screen.',
    },
    {
      t: 'anatomy',
      code: HELLO,
      notes: [
        {
          lines: [1],
          label: '`#include <iostream>` — bring in the toolbox',
          text: 'Before the program runs, this line copies the **iostream** library into your file. That library gives you `cout` (output) and `cin` (input). Without it, the compiler has never heard of `cout`.',
        },
        {
          lines: [2],
          label: '`using namespace std;` — use the short names',
          text: '`cout` really lives in a group of names called `std`. This line lets you write `cout` instead of the full name `std::cout`.',
        },
        {
          lines: [4],
          label: '`int main()` — where execution starts',
          text: 'Every program has exactly **one** `main`. When you run the program, the computer jumps straight here. `int` means main gives back a whole number when it finishes.',
        },
        {
          lines: [4, 7],
          label: '`{` and `}` — the body of main',
          text: 'Everything between the curly braces belongs to `main`. Every `{` needs a matching `}`.',
        },
        {
          lines: [5],
          label: 'A statement',
          text: '`cout << "Hello, World!";` sends the text to the screen. Every statement ends with a **semicolon** `;` — like a full stop at the end of a sentence.',
        },
        {
          lines: [6],
          label: '`return 0;` — finished, all good',
          text: 'Ends `main`. The 0 tells the operating system that the program finished without problems.',
        },
      ],
    },
    {
      t: 'callout',
      tone: 'key',
      title: 'Execution rule #1',
      text: 'The computer starts at the **first line inside `main()`** and runs **one statement at a time, top to bottom**. It never skips ahead and never goes back — unless your code tells it to (you will learn how in later units).',
    },
    { t: 'h', text: 'From your code to a running program' },
    {
      t: 'list',
      ordered: true,
      items: [
        '**You write** the code in a `.cpp` file. This is called the *source code*.',
        '**The compiler** (g++, or the one inside Dev-C++, Code::Blocks or Visual Studio) checks every line. One mistake — even a missing `;` — and it stops with an **error**.',
        'If there are no errors, it builds a **program** (an `.exe` file on Windows).',
        '**You run** the program. Now the statements inside `main()` execute, one by one.',
      ],
    },
    {
      t: 'callout',
      tone: 'warn',
      title: 'Compile error = nothing runs',
      text: 'If the compiler finds an error, your program is never built — not even the lines before the mistake run. The error message tells you the **line** and **column** where the compiler got confused, e.g. `main.cpp:5:20: error: expected \';\' before \'return\'`.',
    },
    { t: 'h', text: 'Four rules that catch most beginners' },
    {
      t: 'table',
      head: ['Rule', 'Wrong', 'Right'],
      rows: [
        ['C++ is **case-sensitive**', '`Cout << "Hi";`', '`cout << "Hi";`'],
        ['Every statement ends with `;`', '`cout << "Hi"`', '`cout << "Hi";`'],
        ['Every `{` needs a `}`', '`int main() { …`', '`int main() { … }`'],
        ['Text goes inside **double** quotes', '`cout << Hi;`', '`cout << "Hi";`'],
      ],
    },
    {
      t: 'compare',
      items: [
        { title: 'Correct', good: true, code: HELLO },
        {
          title: 'One missing semicolon',
          good: false,
          code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!"
    return 0;
}
`,
          note: 'The compiler only notices the missing `;` when it reaches the next word (`return`), so the message points at the **end of line 5**. Press *Dry run* to see the full compiler message.',
        },
      ],
    },
    {
      t: 'terms',
      items: [
        { term: 'Source code', def: 'The text of your program, written in C++.' },
        { term: 'Compiler', def: 'The tool that checks your code and turns it into a program the computer can run.' },
        { term: 'Statement', def: 'One instruction, ending with `;`.' },
        { term: 'Execution', def: 'Running the program — the statements are carried out one by one.' },
        { term: 'Dry run', def: 'Running a program **by hand** on paper: you play the computer, line by line. That is what this whole course trains.' },
      ],
    },
  ],

  ways: {
    goal: 'Print exactly `Hello, World!` — the program can be written in many ways.',
    intro: 'Each version below prints the same thing. Press *Dry run* on any of them and compare.',
    items: [
      { title: 'The classic', code: HELLO, note: 'The version you will write most often.' },
      {
        title: 'Without `using namespace std;`',
        code: cpp`
#include <iostream>

int main() {
    std::cout << "Hello, World!";
    return 0;
}
`,
        note: 'Then you must write the full name `std::cout`. Professional code often does this.',
      },
      {
        title: 'Without `return 0;`',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
}
`,
        note: 'Allowed **only in main**: reaching the closing `}` automatically returns 0. Your teacher may still want you to write it.',
      },
      {
        title: 'Squashed onto one line',
        code: cpp`
#include <iostream>
using namespace std;
int main(){cout<<"Hello, World!";return 0;}
`,
        note: 'Spaces and line breaks **between** words and symbols do not matter to the compiler. They matter a lot to humans reading your code!',
      },
      {
        title: 'With comments',
        code: cpp`
#include <iostream>
using namespace std;

// My first program
int main() {
    cout << "Hello, World!"; // prints a greeting
    /* the next line ends
       the program */
    return 0;
}
`,
        note: 'Everything after `//` on a line, and everything between `/*` and `*/`, is ignored by the compiler. Comments are notes for people.',
      },
      {
        title: 'Braces on their own lines',
        code: cpp`
#include <iostream>
using namespace std;

int main()
{
    cout << "Hello, World!";
    return 0;
}
`,
        note: 'A different layout style. Choose one style and use it everywhere.',
      },
    ],
    takeaway: 'The compiler cares about the **words, symbols and quotes** and their **order** — not about how you space them out. Six different-looking files, one identical program.',
    check: {
      id: 'l1-ways-check',
      kind: 'mcq',
      prompt: 'Which change would STOP the Hello World program from compiling?',
      options: ['Removing `return 0;`', 'Writing everything on one line', 'Removing the `;` after the `cout` statement', 'Adding the comment `// hello` above `main`'],
      answer: 2,
      explain: 'Every statement needs its `;`. The other three changes still compile: `return 0;` is optional in `main`, spacing does not matter, and comments are ignored.',
    },
  },

  watch: [
    {
      title: 'Hello, World! — from the very first line',
      intro: 'This dry run starts **before** the program runs: first the setup lines, then execution inside `main()`.',
      code: HELLO,
      setup: true,
    },
    {
      title: 'Two statements, top to bottom',
      intro: 'The second `cout` runs only after the first one is completely finished. Watch where the second piece of text appears on the screen.',
      code: prog(cpp`
    cout << "I am learning ";
    cout << "C++";`),
    },
    {
      title: 'A program that does not compile',
      intro: 'With an error, **nothing** runs — not even line 5. Read the message: it gives a line and a column.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "Hello"
    return 0;
}
`,
    },
  ],

  think: {
    title: 'Welcome message',
    problem: 'Write a program that shows `Welcome to PF!` on the screen.',
    steps: [
      { text: 'I need to show output, so I need the **iostream** toolbox.', lines: [1] },
      { text: 'I want to write `cout` instead of `std::cout`.', lines: [2] },
      { text: 'Every program starts in `main`, so open `main`.', lines: [4] },
      { text: 'Send the text `Welcome to PF!` to the screen.', lines: [5] },
      { text: 'Tell the system the program finished fine.', lines: [6] },
      { text: 'Close `main`.', lines: [7] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to PF!";
    return 0;
}
`,
    why: 'Every English step became exactly one line of code. That is the habit to build from day one: **think in English first, then translate**.',
    yourTurn: {
      id: 'l1-think-trace',
      kind: 'trace',
      mode: 'output',
      prompt: 'This version prints the same message in three pieces. Fill in what **each line** prints. The first row is done for you. Watch the "Screen so far" box grow.',
      code: prog(cpp`
    cout << "Welcome ";
    cout << "to ";
    cout << "PF!";`),
      given: [0],
      hints: ['A `cout` prints exactly what is between the double quotes — including the spaces.', 'Line 6 prints the two letters `to` followed by one space.'],
      explain: 'Each `cout` continues exactly where the previous one stopped, so the three pieces join into `Welcome to PF!` on one line.',
    },
  },

  practice: [
    {
      id: 'l1-q1',
      kind: 'mcq',
      prompt: 'Where does a C++ program start running?',
      options: [
        'At the first line of the file (`#include`)',
        'At the first statement inside `main()`',
        'At the line with `return 0;`',
        'Wherever the cursor is in the editor',
      ],
      answer: 1,
      explain: 'Lines like `#include` and `using` prepare the program before it runs. Execution itself always begins at the first statement inside `main()`.',
    },
    {
      id: 'l1-q2',
      kind: 'parsons',
      prompt: 'Put the lines in the right order to build a program that prints `Hi!`. One line in the bank is a trap.',
      lines: ['#include <iostream>', 'using namespace std;', 'int main() {', '    cout << "Hi!";', '    return 0;', '}'],
      distractors: ['    cout << Hi!;'],
      hints: ['Setup lines come first: the `#include`, then `using namespace std;`.', 'Text must be inside double quotes, so `cout << Hi!;` is the trap.'],
      explain: 'Setup lines first, then `main` opens with `{`, the statements go inside, and `}` closes it. `cout << Hi!;` is wrong because the text has no quotes.',
    },
    {
      id: 'l1-q3',
      kind: 'bug',
      prompt: 'This program will not compile. Read the compiler message, find the mistake, then choose the fix.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "Good morning"
    return 0;
}
`,
      bugLine: 5,
      options: ['Add `;` at the end of line 5', 'Add `;` at the end of line 6', 'Put `Good morning` in single quotes', 'Delete line 6'],
      answer: 0,
      fixed: prog(cpp`
    cout << "Good morning";`),
      hints: ['The message says `expected \';\' before \'return\'`. What is missing just before the word `return`?'],
      explain: 'The statement on line 5 has no `;`. The compiler only notices when it reaches `return` on line 6 — that is why the message says *before \'return\'* and points at the end of line 5.',
    },
    {
      id: 'l1-q4',
      kind: 'bug',
      prompt: 'Another program that does not compile. Find the line and choose the fix.',
      code: prog(cpp`
    Cout << "Hello";`),
      bugLine: 5,
      options: ['Write `cout` in lowercase', 'Add `#include <Cout>`', 'Put `Cout` in quotes', 'Remove `using namespace std;`'],
      answer: 0,
      fixed: prog(cpp`
    cout << "Hello";`),
      hints: ['C++ is case-sensitive. Is `Cout` the same name as `cout`?'],
      explain: 'C++ is case-sensitive: `Cout` and `cout` are two different names, and only `cout` exists.',
    },
    {
      id: 'l1-q5',
      kind: 'bug',
      prompt: 'This one wanted to print the word Hello. What went wrong?',
      code: prog(cpp`
    cout << Hello;`),
      bugLine: 5,
      options: ['Put Hello inside double quotes: `"Hello"`', 'Use single quotes: `\'Hello\'`', 'Write `HELLO` in capitals', 'Add a space: `<< Hello ;`'],
      answer: 0,
      fixed: prog(cpp`
    cout << "Hello";`),
      hints: ['Without quotes, C++ thinks `Hello` is the name of something — like a variable.', 'Single quotes can hold only ONE character.'],
      explain: 'Without quotes, `Hello` is treated as a *name* the compiler does not know: `\'Hello\' was not declared in this scope`. Text must be in double quotes. Single quotes are only for one character, like `\'H\'`.',
    },
    {
      id: 'l1-q6',
      kind: 'mcq',
      prompt: 'What does `#include <iostream>` do?',
      options: ['It prints text to the screen', 'It gives your program the input/output tools such as `cout` and `cin`', 'It starts the program', 'It ends every statement'],
      answer: 1,
      explain: 'It copies the iostream library into your program before it is compiled, so names like `cout` and `cin` exist.',
    },
    {
      id: 'l1-q7',
      kind: 'predict',
      tag: 'tricky',
      prompt: 'What exactly does this program print? Type the output.',
      code: prog(cpp`
    cout << "Programming";
    cout << "Fundamentals";`),
      hints: ['Does `cout` add a space or a new line by itself?'],
      explain: '`cout` never adds anything by itself. The second word continues right where the first one stopped: `ProgrammingFundamentals`.',
    },
    {
      id: 'l1-q8',
      kind: 'blanks',
      prompt: 'Complete the skeleton so the program prints `Ready!`. Tap the syntax bank to fill a blank.',
      code: cpp`
#include [[1]]
using namespace [[2]];

int [[3]]() {
    cout << "Ready!";
    return 0;
[[4]]
`,
      blanks: [{ answers: ['<iostream>'] }, { answers: ['std'] }, { answers: ['main'] }, { answers: ['}'] }],
      chips: ['<iostream>', 'std', 'main', '{', '}', ';'],
      hints: ['The library with `cout` in it is called iostream.', 'Every `{` needs a closing brace.'],
      explain: 'This skeleton is the same in every program you will write in this course.',
    },
    {
      id: 'l1-q9',
      kind: 'mcq',
      prompt: 'What does `return 0;` inside `main` mean?',
      options: ['Print 0 on the screen', 'The program finished successfully', 'Start the program again', 'Delete everything that was printed'],
      answer: 1,
      explain: '`return` ends `main`. The value 0 is a message to the operating system: *everything went fine*. Nothing is printed.',
    },
    {
      id: 'l1-q10',
      kind: 'mcq',
      tag: 'real life',
      prompt: 'Your friend sends you a screenshot: `error: expected \'}\' at end of input`. What is most likely wrong with the code?',
      options: ['A `{` was opened but never closed', 'The program has no `cout`', 'A text has no quotes', '`main` is spelled wrong'],
      answer: 0,
      explain: 'The compiler reached the end of the file while it was still waiting for a closing `}`. Count your braces: every `{` needs a `}`.',
    },
  ],

  cheatsheet: [
    { code: '#include <iostream>', text: 'brings in `cout` and `cin`' },
    { code: 'using namespace std;', text: 'lets you write `cout` instead of `std::cout`' },
    { code: 'int main() { … }', text: 'execution starts at the first line inside' },
    { code: ';', text: 'ends every statement' },
    { code: 'return 0;', text: 'main finished successfully' },
  ],
};
