# Writing a unit for DryRun — brief for content authors

DryRun is an interactive Programming Fundamentals course in C++ for first-year university students (many are
not native English speakers). Every code example runs inside our own C++ engine, which records a Python-Tutor
style dry run (memory boxes, call stack, heap, pointer arrows, output, and a plain-English explanation of every step).
You write **course content as TypeScript data**. The UI computes all outputs with the engine — never hard-code an output.

## Read these first (in this order)

1. `CLAUDE.md` — project rules and content conventions.
2. `src/content/types.ts` — the content model (Level, Block, Question kinds, ThinkSection, WaysSection …).
3. `src/content/helpers.ts` — `cpp`, `prog(body, extraIncludes)` and `progF(top, body, extraIncludes)`.
4. `src/content/unit5/index.ts` — **the model to copy**. Match its structure, tone, depth and variety.
   Also skim `src/content/unit4/index.ts`.

## What a unit file looks like

One file: `src/content/unitN/index.ts`, exporting `export const unitN: Unit = { id: 'uN', num: N, title, summary, levels: [...] }`
(keep the id/num/title/summary that the stub already has; delete `planned`). Define each level as a `const Lxx: Level = {...}`
like unit5 does, then list them in `levels`. Import only from `'../types'` and `'../helpers'`.

### A lesson level (kind: 'lesson') has ALL of these
- `id` (the slug you were given), `title`, `tagline` (one sentence hook), `minutes` (15–30), `objectives` (3 short "you can …" lines).
- `learn`: 4–8 blocks. Start from the idea in plain words (a real-life analogy helps), then show code. Use a `viz` block for
  the main example (it becomes a steppable dry run). Use `syntax`, `anatomy`, `table`, `compare` (good vs bad), `callout`
  (tone tip / warn / key / info), `terms`. Explain *what happens in memory*.
- `ways`: "all the ways it can be written" — `goal`, 3–5 `items` that solve the SAME small task in different valid ways
  (each a full runnable program), a `takeaway`, and a `check` MCQ ("which of these does NOT …").
- `watch`: 1–3 demos (full programs) to step through in the visualizer, each with a title and a one-line intro.
- `think`: a small real problem → `steps` in plain English, each mapped to the code `lines` it becomes → `code` → `input`
  → `why` → `yourTurn`: a `trace` question (mode `'vars'` or `'output'`) on the same or a very similar program with a different input.
- `practice`: 6–8 questions mixing kinds: `mcq`, `predict`, `blanks` (with `chips`), `trace`, `parsons` (with `distractors`),
  `bug` (with `bugLine`, `options`, `answer`, `fixed`), `paths` (find an input for every path). Every question has
  `hints` (1–3, from gentle to strong) and an `explain`. Add `tag: 'real life'` or `tag: 'tricky'` where it fits.
- `cheatsheet`: 2–4 `{ code, text }` rows.

### A checkpoint level (kind: 'revision')
id given to you, `title` like "Checkpoint: Loops", tagline, objectives, and **10–14 practice questions** mixing all kinds,
at least 4 of them **real-life problems** (shop bill, marks, bank, attendance, temperatures, cricket scores, bus seats…),
ending with a bigger "capstone" question (usually a `blanks` or `parsons` building a small complete program, or a `trace`).
Checkpoints have no learn/ways/watch/think, just practice (+ optional cheatsheet).

### Question ids
Must be unique in the whole course. Use `<levelId>-q1`, `<levelId>-q2`, … and `<levelId>-think-trace`, `<levelId>-ways-check`.

## Writing style
- Simple English. Short sentences. Say "does not", not "doesn't". Explain *why*, not only *what*.
- Mini-markdown in text: `code`, **bold**, *italic*. Numbers and code in backticks.
- Real-life, local-friendly examples are good (rupees, cricket, marks out of 100, city names like Lahore / Karachi).
- The course theme is *problem solving* and *"how many times / how many ways can something happen"* — whenever it fits,
  ask the learner to predict how many times a loop runs, how many paths/outputs are possible, how many calls happen, etc.
- Show the common beginner mistakes (off-by-one, `=` vs `==`, missing `&`, forgetting `delete`, …) in `compare`,
  `bug` questions and `callout warn` blocks.

## Code conventions
- `cpp` is `String.raw`: write C++ escapes as-is, e.g. `cout << "A\n";`. Indent code bodies with 4 spaces.
- `prog(cpp\`…\`)` wraps statements in the standard skeleton; body starts on **line 5** (line 6 with an extra include
  like `prog(body, '#include <cstring>\n')`).
- `progF(cpp\`…functions/struct…\`, cpp\`…main body…\`)` puts functions or a struct **above** `main`. Line numbers
  depend on the top part — **always check them** with `npx tsx scripts/unit-tool.ts --file=src/content/unitN/index.ts lines <id>`.
- You may also write a complete program by hand with `cpp\`#include <iostream>…\``.
- Line numbers in `bugLine`, `think.steps[].lines`, `paths[].line`, anatomy `lines` are 1-based. Check every one.
- Blanks: `[[1]]`, `[[2]]` markers; each blank lists all accepted `answers` (e.g. `['i++', '++i', 'i += 1', 'i = i + 1']`).
- Any program that uses `cin` MUST have `input` (end it with `\n`). Paths questions use `start` as the first input.
- Trace questions in `vars` mode can use `vars: ['i', 'sum']`; columns may also be single boxes like `'arr[2]'`, `'m[1][0]'`, `'s.age'`.
  Keep traces SHORT (under ~15 rows): small loops, small inputs. Use `given: [0]` to pre-fill an example row when useful.

## What the engine supports (and what it does NOT)
Supported: int/double/char/bool/long long/float/string, const, all operators, casts, `cin`/`cout`/`getline`/`cin.ignore()`/
`cin.get()`/`cin.getline(arr, n)`, `while (cin >> x)`, iomanip (`setw`, `setprecision`, `fixed`, `left`, `right`, `setfill`),
cmath, cctype (`toupper`, `isdigit`, …), if/else/switch/ternary, while/for/do-while/range-for (`for (int x : arr)`, `for (int &x : arr)`),
break/continue, **functions** (void/return, pass by value, by reference `&`, const &, default arguments, overloading, prototypes,
recursion), **arrays** 1D/2D (init lists, brace elision, `int a[] = {…}`, `sizeof(a)/sizeof(a[0])`, arrays as parameters `int a[]`,
`int m[][3]`), **strings** (`length/size/empty/at/front/back/substr/find/append/push_back/pop_back/clear/insert/erase/c_str`, `s[i]`),
**C-strings** (`char s[20] = "Hi"`, `<cstring>`: `strlen strcpy strcat strcmp strncpy strncat strncmp`), **pointers**
(`&`, `*`, `->`, `nullptr`/`NULL`, pointer arithmetic, `p[i]`, pointer to pointer, const pointers, returning pointers),
**new/delete** (`new int`, `new int(5)`, `new int[n]`, `new int[n]{…}`, `new Student`, 2D dynamic arrays, `delete`, `delete[]`),
**structs** (fields incl. arrays/nested structs/default member values, `{…}` init, copy with `=`, arrays of structs, passing/returning
structs, pointers to structs), `<algorithm>` `sort(a, a+n)`, `reverse`, `swap`, `max`, `min`.
NOT supported: `vector`, classes/member functions, templates, `rand()`, files (`fstream`), `static` locals, `goto`, lambdas, `printf`.

## Rules that keep the content correct (the checks enforce most of them)
1. Every runnable program must compile and run to the end in our engine, with no runtime error and without needing more input.
2. Our output is compared **byte for byte with real g++** (`content-vs-gpp`). So a program must be deterministic:
   - never print an address (`cout << ptr`, `cout << intArray`) — explain addresses with the memory view instead;
   - never print an uninitialised variable, an out-of-bounds element, a dangling pointer, or anything else undefined;
   - `bug` questions: the BUGGY program must either fail to compile (then `bugLine` should be the line g++ complains about)
     or run deterministically and print a wrong-but-predictable result. No crashes, no garbage in buggy code either.
     (It is fine to *describe* crashes/garbage in text, callouts and MCQs.)
3. Keep programs small: each should run in well under 1500 dry-run steps (a loop iteration costs ~3 steps; recursion depth < 30).
4. Match g++ printing: doubles print like `cout` does (e.g. `2.5`, `3`, `0.333333`); use `fixed << setprecision(2)` with `#include <iomanip>` when you want 2 decimals.

## Validate (run all of these until they are clean — do not stop before)
```
npx tsc --noEmit --strict --target ES2020 --moduleResolution bundler --module esnext --skipLibCheck src/content/unitN/index.ts
npx tsx scripts/check-content.ts --file=src/content/unitN/index.ts          # add --verbose to see outputs
npx tsx scripts/content-vs-gpp.ts --file=src/content/unitN/index.ts         # compares every program with real g++
npx tsx scripts/unit-tool.ts --file=src/content/unitN/index.ts list
npx tsx scripts/unit-tool.ts --file=src/content/unitN/index.ts lines <questionId | levelId:think | levelId:watch1 | levelId:way2 | levelId:learn3>
npx tsx scripts/unit-tool.ts --file=src/content/unitN/index.ts run <id> [input]      # see the dry-run steps & output
npx tsx scripts/unit-tool.ts --file=src/content/unitN/index.ts trace <id>            # see a trace table's answer rows
npx tsx scripts/unit-tool.ts --file=src/content/unitN/index.ts paths <id> 5 12 -3    # which paths each input reaches
```
Also read through `run` output for your main examples: if an explanation step looks wrong or confusing, change the example.
For `paths` questions make sure EVERY path is reachable and the `explain` gives an input for each.
For `predict`/`mcq` questions make sure the answer in your explanation matches what `run` prints.

## Do not
- Do not edit any file other than your own `src/content/unitN/index.ts` (other people are editing other units at the same
  time). If you find an engine bug, work around it in your content and describe the bug in your final message.
- Do not run `npm run build`, `next build`, or the full-course scripts without `--file` (other units may be half-written).

## New tools (added later)

### "How many times?" questions — `kind: 'count'`
The engine counts the answer from a real run. Use one of:
- `count: { line: 7 }` — how many times the statement on line 7 runs (use a body line, not a `for (...)` header),
- `count: { checks: 6 }` — how many times the condition on line 6 (if / while / for) is checked,
- `count: { calls: 'fib' }` — how many times `fib()` is called in total,
- `count: { text: '*' }` — how many times that text appears in the output.
Optional `unit: 'stars'`. Ask the learner to *predict* the count. Great with tricky code: `if (cout << "Hi")`,
`while (cout << "*" && i++ < 3)`, short-circuit (`x > 0 && ++y`), `for` loops with `break`, nested loops, recursion.
`npx tsx scripts/unit-tool.ts --file=… run <id>` prints `COUNT ANSWER`.

### Output OR error
A `predict` question may now use a program that does NOT compile: the learner chooses "It does not compile" and picks
the line. The error line must be the line where g++ reports the first error (content-vs-gpp checks this). The `explain`
must say what the error is and why. Mix compiling and non-compiling programs so the learner has to decide.

### The gold "Exam Challenge" box (checkpoints only)
A checkpoint level may have `exam: { title?, intro?, questions: Question[] }`. It is shown as a gold box after the
checkpoint. Write these like real FAST-NUCES PF sessional/midterm questions: "State the output of the following code.
If there is an error, write it." Short, dense, tricky programs that test exact tracing:
precedence and integer division, `char`/`short`/`unsigned` overflow and wrap-around, ASCII arithmetic, `static_cast`,
`%` on doubles (error), `a += b > c > d`, chained/compound assignment (`a += b += c`), `if (x = 0)`, a stray `;` after
`if (...)`, dangling `else`, `else` without `if` (error), short-circuit side effects (`--i > 0 && (c += 1)`),
bitwise `& | ^ << >>` with the ternary operator, `switch` fall-through and `switch(0)`, `cout << cout` (error),
`cout` inside a condition, comma operator, `setw`/`setfill`/`setprecision` formatting, escape sequences,
nested loops with `break`, recursion traces (Collatz-like, fun1→fun2→fun3 with reference parameters and early `return`),
binary search traces, 2D arrays, strings, pointers … — **only topics taught up to that checkpoint**.
Each exam set: 8–10 questions, mostly `predict` (≈ 3 of them should NOT compile), 2–3 `count` questions, and 1
`trace` or `blanks` (a "complete the program" task like the exams). Every question needs `explain` (step-by-step why)
and 1–2 `hints`. Use `tag: 'exam'`. Question ids: `<levelId>-x1`, `<levelId>-x2`, …

### Flowcharts — `view: 'flow'`
Any question (and `ways` items, `watch` demos, `think`) can set `view: 'flow'`: the C++ program is shown as a
flowchart instead of code (Start/Stop ovals, rectangles for processing, parallelograms for input/output, diamonds with
Yes/No for decisions, loops drawn with a back arrow). The dry run lights up the running box. Blocks:
`{ t: 'flow', title, code, input }` (dry-runnable flowchart) and `{ t: 'flowchart', code, caption }` (still picture).
Box labels come from the code (`cin >> a` → "Input a", `cout << x` → "Display x", `i++` → "i = i + 1",
`if (c)`/`while (c)` → "c ?"). Override a label with a comment on the same line: `sum = sum + x; // @ Add x to sum`.
Prefer `while` loops in flowchart programs (a `for` loop becomes three boxes). Only `main()` is drawn.
Fill-in flowchart boxes: a `blanks` question with `view: 'flow'`: put the blank on its own statement line
(`    [[1]];`) or as a whole condition (`while ([[2]]) {`) — that box is drawn empty with its number, and the learner
types into "Box 1". Give several accepted answers (`'i = i + 1'`, `'i++'`, `'i += 1'`).

### "Write the program" tasks — `kind: 'task'`
For "write a C++ program that …" questions (past papers, labs). Fields: `prompt` (the full statement, mini-markdown;
list the rules/restrictions of the original question), `solution` (a complete, clear, commented model program),
`tests` (2–4 inputs `{ input: '5\n', label: 'n = 5' }` — expected outputs are computed by running the solution),
`compare` (`'numbers'` = same numbers in the same order — the default when the output has numbers, and forgiving about
prompt texts; `'lines'` = every solution output line appears in order; `'exact'` for patterns), `steps` (5–10 guided
hints in plain English that walk through the problem solving: what to read, which variables, which loop/condition,
what to print — never the full code), optional `starter` code. The learner writes code with a live syntax check, can run
it, then "Check my solution" runs every test; unlimited hints first show your `steps`, then solution lines one by one.
Keep solution prompts short ("Enter n: ") or none, so `numbers` comparison works. Solutions must pass content-vs-gpp.

### Past papers — `src/content/papers/<id>.ts`
One file per real paper, exporting `export const paper: PaperSet = { id, title, year, questions: [{ unit, q }, …] }`
(import `PaperSet` from `'../types'`, helpers from `'../helpers'`). `unit` = the unit number (0–11) whose gold
"Exam practice" box the question goes into (the topic it practises — e.g. pointers → 10, recursion → 7, flowchart → 0).
`title` like `"PF Final Exam · Fall 2022"`. Each question gets `source: '<title> · Q2(iii)'` and id `<paperId>-q2-iii`.
Convert every question faithfully (same code, same numbers) into the best kind: output/error → `predict`,
"how many times" → `count`, fill a gap / complete the code → `blanks`, "write a program" → `task`, theory/one-line
statements → `mcq` or `blanks`, flowcharts → `blanks`/`predict` with `view: 'flow'`. If the paper prints an address or
has undefined behaviour, change it minimally so the output is well-defined, and say so in `explain`.
Always add `explain` (a full worked solution / dry run) and 1–2 `hints`. Validate with `--file=src/content/papers/<id>.ts`.
