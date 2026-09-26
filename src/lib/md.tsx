import { Fragment, type ReactNode } from 'react';

// Tiny inline-markdown renderer used for all lesson text and engine explanations.
// Supports: `code`, **bold**, *italic*, [link](url) and line breaks.

const RE = /(`+)([\s\S]*?)\1|\*\*([\s\S]+?)\*\*|\*([^*\s][^*\n]*?)\*|\[([^\]]+)\]\(([^)\s]+)\)|\n/g;

export function inline(text: string, key = 'i'): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  RE.lastIndex = 0;
  const re = new RegExp(RE.source, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1]) out.push(<code className="ic" key={k}>{m[2]}</code>);
    else if (m[3] !== undefined) out.push(<strong key={k}>{inline(m[3], k)}</strong>);
    else if (m[4] !== undefined) out.push(<em key={k}>{inline(m[4], k)}</em>);
    else if (m[5] !== undefined) {
      out.push(
        <a key={k} href={m[6]} target="_blank" rel="noreferrer">
          {m[5]}
        </a>,
      );
    } else out.push(<br key={k} />);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Md({ text, as = 'span', className }: { text: string; as?: 'span' | 'p' | 'div'; className?: string }) {
  const Tag = as;
  return <Tag className={className}>{inline(text)}</Tag>;
}

/** Paragraph blocks separated by blank lines. */
export function MdBlock({ text, className }: { text: string; className?: string }) {
  const paras = text.split(/\n{2,}/);
  return (
    <div className={className}>
      {paras.map((p, i) => (
        <Fragment key={i}>
          <p>{inline(p, `p${i}`)}</p>
        </Fragment>
      ))}
    </div>
  );
}
