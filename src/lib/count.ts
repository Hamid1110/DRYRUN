import type { CountQ } from '@/content/types';
import type { RunResult } from '@/engine';

const SKIP = new Set(['start', 'end', 'compile', 'error', 'wait']);

/** the right answer to a "how many times?" question, counted from a real run */
export function countAnswer(q: Pick<CountQ, 'count'>, res: RunResult): number {
  const c = q.count;
  if ('text' in c) {
    if (!c.text) return 0;
    let n = 0;
    let at = res.stdout.indexOf(c.text);
    while (at >= 0) {
      n++;
      at = res.stdout.indexOf(c.text, at + c.text.length);
    }
    return n;
  }
  if ('calls' in c) return res.steps.filter((s) => s.kind === 'call' && s.frames[s.frames.length - 1]?.fn === c.calls).length;
  if ('checks' in c) return res.steps.filter((s) => s.line === c.checks && (s.kind === 'cond' || s.kind === 'loop')).length;
  const groups = new Set<number>();
  for (const s of res.steps) if (s.line === c.line && !SKIP.has(s.kind)) groups.add(s.group);
  return groups.size;
}

/** a short description of what is being counted */
export function countWhat(q: CountQ): string {
  const c = q.count;
  if ('text' in c) return `How many times does ${JSON.stringify(c.text)} appear in the output?`;
  if ('calls' in c) return `How many times is \`${c.calls}()\` called (count every call, including calls from inside itself)?`;
  if (q.view === 'flow') {
    if ('checks' in c) return 'How many times is the highlighted decision box checked?';
    return 'How many times does the highlighted box run?';
  }
  if ('checks' in c) return `How many times is the condition on line ${c.checks} checked?`;
  return `How many times does line ${c.line} run?`;
}
