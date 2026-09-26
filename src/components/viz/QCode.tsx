'use client';

import { useMemo } from 'react';
import { buildFlow, flowNodeFor } from '@/engine';
import { RunnableCode } from '@/components/level/Blocks';
import { FlowChart } from './FlowChart';

/** program shown either as C++ code or as a flowchart */
export function QCode({
  code,
  input,
  view,
  showOutput = false,
  allowRun = false,
  highlight,
}: {
  code: string;
  input?: string;
  view?: 'code' | 'flow';
  showOutput?: boolean;
  allowRun?: boolean;
  highlight?: number[];
}) {
  const g = useMemo(() => (view === 'flow' ? buildFlow(code) : null), [code, view]);
  if (g) {
    const active = highlight?.length ? flowNodeFor(g, { kind: 'out', line: highlight[0] })?.id ?? null : null;
    return <FlowChart g={g} active={active} />;
  }
  return <RunnableCode code={code} input={input} showOutput={showOutput} allowRun={allowRun} highlight={highlight} />;
}
