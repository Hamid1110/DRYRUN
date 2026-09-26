// Content model. Every level is plain data — add a new level by writing one of these objects.
// Text fields ("Inline") accept mini-markdown: `code`, **bold**, *italic*, [link](url).

export type Inline = string;

export type Block =
  | { t: 'p'; text: Inline }
  | { t: 'h'; text: Inline }
  | { t: 'list'; items: Inline[]; ordered?: boolean }
  | { t: 'code'; code: string; caption?: Inline; output?: string; input?: string; run?: boolean }
  | { t: 'callout'; tone: 'tip' | 'warn' | 'info' | 'key'; title?: Inline; text: Inline }
  | { t: 'table'; head: Inline[]; rows: Inline[][]; caption?: Inline }
  | { t: 'syntax'; title: Inline; code: string; parts: { token: string; text: Inline }[] }
  | { t: 'anatomy'; code: string; notes: { lines: number[]; label: Inline; text: Inline }[] }
  | { t: 'viz'; title?: Inline; code: string; input?: string; setup?: boolean; fine?: boolean }
  /** a flowchart you can dry-run (built from the C++ code; the code itself is hidden) */
  | { t: 'flow'; title?: Inline; code: string; input?: string }
  /** a still flowchart picture (built from the C++ code) */
  | { t: 'flowchart'; code: string; caption?: Inline }
  | { t: 'compare'; items: { title: Inline; code: string; output?: string; note?: Inline; good?: boolean }[] }
  | { t: 'terms'; items: { term: Inline; def: Inline }[] };

export interface Way {
  title: Inline;
  code: string;
  view?: 'code' | 'flow';
  note?: Inline;
  input?: string;
}

export interface WaysSection {
  goal: Inline;
  intro?: Inline;
  items: Way[];
  takeaway?: Inline;
  /** a quick question at the end: "which of these does NOT ..." */
  check?: MCQ;
}

export interface Demo {
  title: Inline;
  view?: 'code' | 'flow';
  intro?: Inline;
  code: string;
  input?: string;
  /** start with every << shown as its own step */
  fine?: boolean;
  /** show #include / using / main explanation steps first */
  setup?: boolean;
}

export interface ThinkSection {
  title: Inline;
  problem: Inline;
  /** plain-English algorithm; `lines` = code lines this step becomes */
  steps: { text: Inline; lines?: number[] }[];
  code: string;
  view?: 'code' | 'flow';
  /** value(s) used for the worked dry run */
  input?: string;
  why?: Inline;
  yourTurn?: TraceQ;
}

interface QBase {
  id: string;
  prompt: Inline;
  hints?: Inline[];
  explain?: Inline;
  /** e.g. "real life", "tricky", "exam" */
  tag?: string;
  /** show the program as a flowchart instead of C++ code */
  view?: 'code' | 'flow';
  /** where a past-paper question comes from, e.g. "PF Final Exam, Fall 2022 · Q1(c)" */
  source?: string;
}

export interface MCQ extends QBase {
  kind: 'mcq';
  code?: string;
  input?: string;
  options: Inline[];
  answer: number;
}

export interface Blanks extends QBase {
  kind: 'blanks';
  /** code with [[1]], [[2]] markers */
  code: string;
  blanks: { answers: string[]; hint?: Inline }[];
  /** syntax chips the learner can tap to insert */
  chips?: string[];
  input?: string;
  /** if set, a filled program is also accepted when its output equals this */
  output?: string;
}

export interface Predict extends QBase {
  kind: 'predict';
  code: string;
  input?: string;
}

export type TraceMode = 'output' | 'vars';

export interface TraceQ extends QBase {
  kind: 'trace';
  code: string;
  input?: string;
  mode: TraceMode;
  /** variables shown as columns (vars mode) */
  vars?: string[];
  /** 0-based row numbers whose answer cells stay filled in as examples */
  given?: number[];
}

export interface Parsons extends QBase {
  kind: 'parsons';
  /** correct program, one entry per line (keep indentation) */
  lines: string[];
  /** extra wrong lines mixed into the bank */
  distractors?: string[];
  input?: string;
}

export interface Bug extends QBase {
  kind: 'bug';
  code: string;
  /** 1-based line that contains the mistake */
  bugLine: number;
  options: Inline[];
  answer: number;
  fixed: string;
  input?: string;
}

export interface PathHunt extends QBase {
  kind: 'paths';
  code: string;
  paths: { label: Inline; line: number }[];
  start?: string;
}

/**
 * "How many times?" — the answer is counted by the engine:
 *  - line:   how many times the statement on this line runs
 *  - checks: how many times the condition on this line (if / loop) is checked
 *  - calls:  how many times this function is called
 *  - text:   how many times this text appears in the output
 */
export interface CountQ extends QBase {
  kind: 'count';
  code: string;
  input?: string;
  count: { line: number } | { checks: number } | { calls: string } | { text: string };
  /** word for the unit, e.g. "times", "stars" (default "times") */
  unit?: string;
}

/**
 * "Write the program yourself" — used for past-paper programming questions and lab tasks.
 * The learner writes code; syntax is checked line by line while typing; the logic is checked
 * at the end by running the tests and comparing with the reference solution's output.
 */
export interface TaskQ extends QBase {
  kind: 'task';
  /** category / course track */
  track?: 'pf' | 'oop' | 'dsa';
  /** starting code (default: #include, using, empty main) */
  starter?: string;
  /** reference solution — shown (with a dry run) only after solving or giving up */
  solution: string;
  /** test runs; the expected output of each comes from running the solution */
  tests: { input?: string; label?: Inline }[];
  /** exact: same output; lines: every solution line appears in order; numbers: same numbers in the same order */
  compare?: 'exact' | 'lines' | 'numbers';
  /** step-by-step guidance for the unlimited hint button */
  steps: Inline[];
}

export type Question = MCQ | Blanks | Predict | TraceQ | Parsons | Bug | PathHunt | CountQ | TaskQ;

/** a lab sheet: a group of programming tasks */
export interface Lab {
  id: string;
  title: Inline;
  /** e.g. "PF Lab Final, Fall 2023" */
  source?: string;
  intro?: Inline;
  /** category track: pf | oop | dsa */
  track?: 'pf' | 'oop' | 'dsa';
  /** unit number this lab practises (for filtering) */
  unit?: number;
  tasks: TaskQ[];
}

/** the gold "Exam Challenge" box shown after a checkpoint */
export interface ExamSet {
  title?: Inline;
  intro?: Inline;
  questions: Question[];
}

export interface Level {
  id: string;
  kind: 'lesson' | 'revision';
  /** past-paper style questions in a gold box (checkpoints) */
  exam?: ExamSet;
  title: string;
  tagline: Inline;
  objectives: Inline[];
  learn?: Block[];
  ways?: WaysSection;
  watch?: Demo[];
  think?: ThinkSection;
  practice: Question[];
  /** one-screen summary shown at the end */
  cheatsheet?: { code: string; text: Inline }[];
  minutes?: number;
}

export interface Unit {
  id: string;
  num: number;
  title: string;
  summary: Inline;
  levels: Level[];
  /** titles of levels not built yet (shown as "coming soon") */
  planned?: string[];
}

export interface Course {
  id: string;
  title: string;
  lang: string;
  units: Unit[];
}

export const STAGES = [
  { key: 'learn', label: 'Learn', long: 'Understand the idea' },
  { key: 'ways', label: 'All the ways', long: 'Every way it can be written' },
  { key: 'watch', label: 'Watch', long: 'See the dry run, step by step' },
  { key: 'think', label: 'Think', long: 'English steps → code → your trace' },
  { key: 'practice', label: 'Practice', long: 'Solve it yourself' },
] as const;

export type StageKey = (typeof STAGES)[number]['key'] | 'exam';

/** questions taken from one real past paper; each is filed under the unit it practises */
export interface PaperSet {
  id: string;
  /** e.g. "PF Final Exam · Fall 2022" */
  title: string;
  year: number;
  questions: { unit: number; q: Question }[];
}
