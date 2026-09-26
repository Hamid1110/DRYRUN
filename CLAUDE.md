@AGENTS.md

# DryRun — project notes

Interactive Programming Fundamentals (C++) course. Next.js 16 App Router + React 19, plain CSS
(tokens in `src/styles/tokens.css`), no UI library. Content language: simple English.

## Architecture rules

- `src/engine/` is framework-free TypeScript. Keep it that way (it also runs in scripts/tests).
- Course content is plain data in `src/content/` (types in `types.ts`). Never hard-code program
  output in content — the UI computes it with the engine.
- UI components must not import `next/*` except `src/components/shell/NextRoot.tsx` and `src/app/`.
  Navigation goes through `src/lib/router.tsx` (`useNav`, `Link`) so the same UI also runs in the
  single-file preview (`src/preview/entry.tsx`, hash routing, React 18 UMD from cdnjs).
  Therefore: no React-19-only APIs (`use`, ref-as-prop, `<Context value>`) in shared components.
- Progress lives in `src/lib/progress.ts` (localStorage). `DEFAULT_UNLOCK_ALL` controls free roam.
- Single-column CSS grids that contain code must use `grid-template-columns: minmax(0, 1fr)`,
  otherwise long code lines push the page wider than a phone screen.

## After changing things

- Content changed → `npm run check:content` and `npm run test:content-gpp`.
- Engine changed → `npm run test:engine` (compares with real g++; add a case for every fix).
- Then `npx tsc --noEmit` and `npm run build`.

## Content conventions

- Code snippets: ``prog(cpp`...`)`` from `src/content/helpers.ts`; body starts at line 5.
  `cpp` is `String.raw`, so write C++ escapes as-is (`"A\n"`).
- Prose strings: mini-markdown (`code`, **bold**, *italic*). Prefer "does not" over "doesn't".
- Blanks in fill-in code: `[[1]]`, `[[2]]` … (may sit inside string literals).
- Programs with functions/structs above main: ``progF(cpp`top`, cpp`body`)``; check line numbers with
  `npx tsx scripts/unit-tool.ts --file=src/content/unitN/index.ts lines <id>`. Full authoring guide: `docs/CONTENT_BRIEF.md`.
- Never print addresses or undefined values in runnable content (output is compared with real g++).
- Line numbers in `bugLine`, `think.steps[].lines`, `paths[].line` are 1-based.
