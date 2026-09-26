# DryRun — Programming Fundamentals in C++

An interactive course that teaches beginners to **think like the computer**: every example runs
line by line in the browser, showing memory, output and the step-by-step working of every
expression. Learners then dry-run code themselves in fill-in tables, with hints and a
"watch this step" rewind whenever they go off track.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

No install needed just to look: open `preview-dist/dryrun-offline.html` in a browser
(it loads React and fonts from the internet).

## C++ Compiler (top right)

Every page has a **C++ Compiler** button. It opens a full-screen editor pre-filled with
`#include <iostream>`, `using namespace std;` and `int main()`. Write any program, type the
keyboard input, press **Run & dry run** (or Ctrl+Enter): you get g++-style errors, the output,
and the full step-by-step dry run with memory: arrays as rows of boxes, a frame per function call,
a heap section for `new`, and arrows for pointers and references. Code is saved in the browser.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | production build / serve it |
| `npm run check:content` | validates every level: code compiles, answers exist, line numbers are in range |
| `npm run test:engine` | runs ~70 programs through the engine **and** real `g++`, compares output byte for byte (needs g++ on PATH) |
| `npm run test:content-gpp` | the same comparison for every program inside the course content |
| `npx tsx scripts/unit-tool.ts --file=… list\|lines\|run\|trace\|paths` | helper for writing content (see `docs/CONTENT_BRIEF.md`) |
| `npm run preview:build` | builds the single-file preview in `preview-dist/` |

## How it is built

```
src/
  engine/        C++ interpreter for a beginner subset — no server needed
    lexer.ts       tokens (+ g++-style errors for stray/curly quotes, bad escapes)
    parser.ts      recursive-descent parser → AST (g++-style syntax errors)
    checker.ts     compile-time checks: undeclared names, missing includes, type errors, warnings
    interpreter.ts runs main() and records every step (memory, console, input, explanation,
                   expression breakdown like  a + b * 2 → 5 + 3 * 2 → 5 + 6 → 11)
    values.ts      C++ value semantics: int overflow, integer division, printf-exact doubles
  content/       the course, as plain data
    types.ts       Level / Question types (the content model)
    course.ts      units, level order, unlocking
    unit1/ … unit11/ Output · Variables · Input · Operators · Decisions · Loops · Functions · Arrays ·
                     Strings · Pointers & dynamic memory · Structures (59 lessons + 11 checkpoints)
  components/
    viz/           the dry-run visualizer (code arrows, memory, console, input)
    practice/      question types: mcq, predict, blanks, trace table, parsons, bug, paths
    level/         level page with its five stages
    shell/         sidebar, top bar (with the C++ Compiler button), CompilerPanel, Next.js adapter
  lib/           router abstraction, progress (localStorage), prefs, highlighter, mini-markdown
  app/           Next.js routes: /, /learn/[levelId], /playground
  preview/       entry for the single-file preview (hash routing)
```

### Supported C++ (engine)

`#include`, `using namespace std`, `int/double/float/char/bool/string/long long/unsigned…`,
`const`, `cout` (with `endl`, `setw`, `setprecision`, `fixed`, `left/right`, `setfill`, `boolalpha`),
`cin >>` and `getline`, all arithmetic / relational / logical / compound / `++ --` operators,
casts, `if/else`, `switch`, `?:`, `while`, `do-while`, `for`, `break/continue`, block scopes,
`string` methods (`length`, `substr`, `find`, `at`, `[]`, `+`), `<cmath>` and `<cctype>` basics.

Not yet: user-defined functions (parsed, not executed), arrays, pointers, structs.

## Adding a level

1. Create `src/content/unitN/LX-name.ts` exporting a `Level` (see `src/content/types.ts`).
   Use the helpers in `src/content/helpers.ts`:
   ``prog(cpp`    cout << "Hi";`)`` wraps statements in the standard skeleton
   (body starts at **line 5**).
2. Add it to the unit's `levels` array (and the unit to `COURSE` in `course.ts`).
3. Run `npm run check:content` — it catches wrong line numbers, answers that do not compile, etc.

Every level has up to five stages: **Learn** (content blocks), **All the ways** (many programs,
same output), **Watch** (visualizer demos), **Think** (English steps → code → dry run → your-turn
table) and **Practice** (questions). Checkpoints (`kind: 'revision'`) only have practice.

Outputs shown to learners are never typed by hand — they are computed by the engine, and
`npm run test:content-gpp` proves they match a real compiler.
