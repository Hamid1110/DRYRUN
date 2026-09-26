'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { findLevel, isUnlocked, levelLabel, nextLevel, prevLevel, type LevelRef } from '@/content/course';
import { STAGES, type Demo, type Level, type StageKey, type ThinkSection, type WaysSection } from '@/content/types';
import { Link, takePendingStage } from '@/lib/router';
import { Md, inline } from '@/lib/md';
import { completeLevel, levelProgress, markVisited, resetLevelPractice, useProgress } from '@/lib/progress';
import { Icon } from '@/components/ui/Icon';
import { CodeBlock } from '@/components/ui/Code';
import { Visualizer } from '@/components/viz/Visualizer';
import { QCode } from '@/components/viz/QCode';
import { QuestionCard } from '@/components/practice/QuestionCard';
import { Blocks, RunnableCode } from './Blocks';

// ---------------------------------------------------------------- stages

function stagesOf(level: Level) {
  if (level.kind === 'revision') {
    return [
      { key: 'practice' as StageKey, label: 'Checkpoint', long: 'Mixed questions from the whole unit' },
      ...(level.exam ? [{ key: 'exam' as StageKey, label: 'Exam Challenge', long: 'Past-paper style questions' }] : []),
    ];
  }
  return STAGES.filter((s) => {
    if (s.key === 'learn') return !!level.learn?.length;
    if (s.key === 'ways') return !!level.ways;
    if (s.key === 'watch') return !!level.watch?.length;
    if (s.key === 'think') return !!level.think;
    return true;
  });
}

function WaysView({ ways, levelId }: { ways: WaysSection; levelId: string }) {
  return (
    <div className="ways">
      <div className="ways-goal">
        <span className="eyebrow">The goal</span>
        <div className="ways-goal-text">
          <Md text={ways.goal} />
        </div>
      </div>
      {ways.intro && (
        <p className="b-p">
          <Md text={ways.intro} />
        </p>
      )}
      <div className="ways-grid">
        {ways.items.map((w, i) => (
          <div className="way" key={i}>
            <div className="way-head">
              <span className="way-num tnum">Way {i + 1}</span>
              <span className="way-title">
                <Md text={w.title} />
              </span>
            </div>
            {w.view === 'flow' ? <QCode code={w.code} view="flow" /> : <RunnableCode code={w.code} input={w.input} title={`Way ${i + 1}`} />}
            {w.note && (
              <p className="way-note">
                <Md text={w.note} />
              </p>
            )}
          </div>
        ))}
      </div>
      {ways.takeaway && (
        <div className="callout tone-key">
          <Icon name="star" className="callout-icon" />
          <div className="callout-text">{inline(ways.takeaway)}</div>
        </div>
      )}
      {ways.check && (
        <div className="stage-check">
          <div className="eyebrow">Quick check</div>
          <QuestionCard q={ways.check} levelId={levelId} />
        </div>
      )}
    </div>
  );
}

function WatchView({ demos }: { demos: Demo[] }) {
  const [k, setK] = useState(0);
  const d = demos[k];
  return (
    <div className="watch">
      {demos.length > 1 && (
        <div className="demo-tabs" role="tablist">
          {demos.map((x, i) => (
            <button key={i} role="tab" aria-selected={i === k} className={`demo-tab${i === k ? ' is-on' : ''}`} onClick={() => setK(i)}>
              <span className="tnum">{i + 1}</span>
              <Md text={x.title} />
            </button>
          ))}
        </div>
      )}
      <div className="demo">
        <h3 className="demo-title">
          <Md text={d.title} />
        </h3>
        {d.intro && (
          <p className="b-p">
            <Md text={d.intro} />
          </p>
        )}
        <p className="watch-tip">
          <Icon name="info" size={15} /> Press <strong>Next</strong> (or the → key) and say out loud what you think will happen <em>before</em> each step.
        </p>
        <Visualizer key={k} code={d.code} input={d.input} fine={d.fine} setup={d.setup} view={d.view} />
      </div>
      {demos.length > 1 && k < demos.length - 1 && (
        <div className="demo-next">
          <button className="btn" onClick={() => setK(k + 1)}>
            Next demo: <Md text={demos[k + 1].title} /> <Icon name="arrow-right" />
          </button>
        </div>
      )}
    </div>
  );
}

function ThinkView({ t, levelId }: { t: ThinkSection; levelId: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const lines = hover !== null ? t.steps[hover].lines ?? [] : [];
  return (
    <div className="think">
      <section className="think-problem">
        <span className="eyebrow">Problem</span>
        <h3>
          <Md text={t.title} />
        </h3>
        <p>
          <Md text={t.problem} />
        </p>
      </section>

      <div className="think-pair">
        <section className="think-step">
          <h3 className="think-h">
            <span className="think-num">1</span> Say it in plain English
          </h3>
          <ol className="en-steps">
            {t.steps.map((s, i) => (
              <li key={i}>
                <button
                  className={`en-step${hover === i ? ' is-on' : ''}`}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onClick={() => setHover(hover === i ? null : i)}
                >
                  <span className="en-num tnum">{i + 1}</span>
                  <span className="en-text">
                    <Md text={s.text} />
                  </span>
                  {s.lines && s.lines.length > 0 && <span className="en-lines mono">line {s.lines.join(', ')}</span>}
                </button>
              </li>
            ))}
          </ol>
        </section>
        <section className="think-step">
          <h3 className="think-h">
            <span className="think-num">2</span> {t.view === 'flow' ? 'Turn each step into a box' : 'Turn each step into code'}
          </h3>
          {t.view === "flow" ? <QCode code={t.code} view="flow" highlight={lines} /> : <CodeBlock code={t.code} highlightLines={lines} />}
          <p className="think-tip">
            <Icon name="info" size={15} /> Point at an English step to see which line it became.
          </p>
        </section>
      </div>

      {t.why && (
        <div className="callout tone-tip">
          <Icon name="bulb" className="callout-icon" />
          <div className="callout-text">{inline(t.why)}</div>
        </div>
      )}

      <section className="think-step">
        <h3 className="think-h">
          <span className="think-num">3</span> Watch the dry run{t.input ? ` with input ${t.input.trim().replace(/\n/g, ' ')}` : ''}
        </h3>
        <Visualizer code={t.code} input={t.input} view={t.view} />
      </section>

      {t.yourTurn && (
        <section className="think-step">
          <h3 className="think-h">
            <span className="think-num">4</span> Your turn: dry run it yourself
          </h3>
          <QuestionCard q={t.yourTurn} levelId={levelId} />
        </section>
      )}
    </div>
  );
}

const EXAM_PAGE = 6;

function ExamView({ level }: { level: Level }) {
  const p = useProgress();
  const lp = levelProgress(p, level.id);
  const exam = level.exam!;
  const all = exam.questions;
  const sources = Array.from(new Set(all.map((q) => q.source ?? 'Exam drill')));
  const [src, setSrc] = useState<string>('all');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [page, setPage] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const list = all.filter((q) => (src === 'all' || (q.source ?? 'Exam drill') === src) && (!onlyOpen || !lp.qs[q.id]));
  const pages = Math.max(1, Math.ceil(list.length / EXAM_PAGE));
  const pg = Math.min(page, pages - 1);
  const shown = list.slice(pg * EXAM_PAGE, pg * EXAM_PAGE + EXAM_PAGE);
  const done = all.filter((q) => lp.qs[q.id]).length;
  const got = all.reduce((s, q) => s + (lp.qs[q.id]?.score ?? 0), 0);
  const go = (k: number) => {
    setPage(k);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <section className="exam-box" aria-label="Exam practice" ref={topRef}>
      <div className="exam-head">
        <span className="exam-medal">
          <Icon name="medal" size={26} />
        </span>
        <div>
          <div className="eyebrow">Exam practice · optional · as many as you like</div>
          <h2 className="exam-title">{inline(exam.title ?? 'Past-paper style: output or error?')}</h2>
          <p className="exam-intro">
            <Md text={exam.intro ?? 'These are written like real university exam questions. For each one, decide first: does it compile? If yes, write the exact output. Take your time — trace on paper, then check.'} />
          </p>
        </div>
        <div className="exam-score tnum">
          <strong>{done}</strong>/{all.length}
          <span>answered{done ? ` · ${Math.round((got / Math.max(1, done)) * 100)}% right` : ''}</span>
        </div>
      </div>
      {(sources.length > 1 || all.length > EXAM_PAGE) && (
        <div className="exam-filters">
          <button className={`chip-btn${src === 'all' ? ' is-on' : ''}`} onClick={() => { setSrc('all'); setPage(0); }}>
            All ({all.length})
          </button>
          {sources.map((s) => (
            <button key={s} className={`chip-btn${src === s ? ' is-on' : ''}`} onClick={() => { setSrc(s); setPage(0); }}>
              {s} ({all.filter((q) => (q.source ?? 'Exam drill') === s).length})
            </button>
          ))}
          <label className="switch exam-open">
            <input type="checkbox" checked={onlyOpen} onChange={(e) => { setOnlyOpen(e.target.checked); setPage(0); }} />
            <span className="track" />
            only unanswered
          </label>
        </div>
      )}
      <div className="exam-list">
        {shown.map((q) => (
          <QuestionCard key={q.id} q={q} levelId={level.id} num={all.indexOf(q) + 1} />
        ))}
        {!shown.length && <p className="muted">Nothing left here — every question in this set is answered. 🎉</p>}
      </div>
      {pages > 1 && (
        <div className="exam-pager">
          <button className="btn btn-ghost" onClick={() => go(pg - 1)} disabled={pg === 0}>
            <Icon name="arrow-left" /> Previous
          </button>
          <span className="tnum">
            Page {pg + 1} of {pages}
          </span>
          <button className="btn btn-primary" onClick={() => go(pg + 1)} disabled={pg >= pages - 1}>
            More questions <Icon name="arrow-right" />
          </button>
        </div>
      )}
    </section>
  );
}

function PracticeView({ ref0 }: { ref0: LevelRef }) {
  const level = ref0.level;
  const p = useProgress();
  const lp = levelProgress(p, level.id);
  const qs = level.practice;
  const answered = qs.filter((q) => lp.qs[q.id]);
  const firstOpen = Math.max(0, qs.findIndex((q) => !lp.qs[q.id]));
  const [i, setI] = useState(firstOpen);
  const [showSummary, setShowSummary] = useState(false);
  const [round, setRound] = useState(0);
  const allDone = answered.length === qs.length && qs.length > 0;
  const score = allDone ? Math.round((qs.reduce((s, q) => s + (lp.qs[q.id]?.score ?? 0), 0) / qs.length) * 100) : 0;
  const nxt = nextLevel(level.id);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (allDone && !lp.done) completeLevel(level.id, score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  const goQ = (k: number) => {
    setI(k);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (allDone && showSummary) {
    const stars = score >= 90 ? 3 : score >= 70 ? 2 : 1;
    return (
      <div className="complete" ref={topRef}>
        <div className="complete-badge">
          <Icon name={level.kind === 'revision' ? 'trophy' : 'check-circle'} size={30} />
        </div>
        <h2>{level.kind === 'revision' ? 'Checkpoint cleared' : `${levelLabel(ref0)} complete`}</h2>
        <div className="complete-stars" aria-label={`${stars} of 3 stars`}>
          {[0, 1, 2].map((k) => (
            <Icon key={k} name="star" size={28} className={k < stars ? 'is-on' : ''} />
          ))}
        </div>
        <p className="complete-score">
          Score <strong className="tnum">{score}%</strong> — {score >= 90 ? 'excellent. You can predict this code like the computer does.' : score >= 70 ? 'solid. Review the questions you needed hints for.' : 'you finished it — repeat the practice once more to lock it in.'}
        </p>
        {level.cheatsheet && (
          <div className="cheat">
            <div className="eyebrow">Keep this in your head</div>
            <dl>
              {level.cheatsheet.map((c, k) => (
                <div key={k} className="cheat-row">
                  <dt>
                    <code>{c.code}</code>
                  </dt>
                  <dd>{inline(c.text)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <div className="complete-actions">
          {nxt && (
            <Link to={{ name: 'level', id: nxt.level.id }} className="btn btn-primary btn-lg">
              Next: {levelLabel(nxt)} — {nxt.level.title} <Icon name="arrow-right" />
            </Link>
          )}
          <button
            className="btn btn-lg"
            onClick={() => {
              resetLevelPractice(level.id);
              setShowSummary(false);
              setRound((r) => r + 1);
              setI(0);
            }}
          >
            <Icon name="refresh" /> Practice again
          </button>
        </div>
      </div>
    );
  }

  const q = qs[Math.min(i, qs.length - 1)];
  const isLast = i === qs.length - 1;
  const answeredThis = !!lp.qs[q.id];
  return (
    <div className="qrun" ref={topRef}>
      {level.kind === 'revision' && i === 0 && answered.length === 0 && (
        <div className="callout tone-info">
          <Icon name="flag" className="callout-icon" />
          <div className="callout-text">
            <Md text={level.tagline} />
          </div>
        </div>
      )}
      <div className="qrun-head">
        <div className="qrun-dots" role="tablist" aria-label="Questions">
          {qs.map((qq, k) => {
            const r = lp.qs[qq.id];
            const cls = `qdot${k === i ? ' is-cur' : ''}${r ? (r.revealed ? ' is-rev' : r.score >= 0.99 ? ' is-ok' : ' is-meh') : ''}`;
            return <button key={qq.id} role="tab" aria-selected={k === i} className={cls} onClick={() => goQ(k)} aria-label={`Question ${k + 1}`} />;
          })}
        </div>
        <span className="qrun-count tnum">
          {answered.length}/{qs.length} answered
        </span>
      </div>
      <QuestionCard key={`${q.id}-${round}`} q={q} levelId={level.id} num={i + 1} />
      <div className="qrun-nav">
        <button className="btn btn-ghost" onClick={() => goQ(Math.max(0, i - 1))} disabled={i === 0}>
          <Icon name="arrow-left" /> Previous
        </button>
        {!isLast && (
          <button className={`btn ${answeredThis ? 'btn-primary' : ''}`} onClick={() => goQ(i + 1)}>
            {answeredThis ? 'Next question' : 'Skip for now'} <Icon name="arrow-right" />
          </button>
        )}
        {isLast && (
          <button
            className="btn btn-primary"
            onClick={() => {
              const open = qs.findIndex((x) => !lp.qs[x.id]);
              if (open >= 0 && !allDone) goQ(open);
              else setShowSummary(true);
            }}
          >
            {allDone ? 'See my result' : 'Go to unanswered'} <Icon name="arrow-right" />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- screen

export function LevelScreen({ id }: { id: string }) {
  const ref = findLevel(id);
  const p = useProgress();
  const level = ref?.level;
  const stages = useMemo(() => (level ? stagesOf(level) : []), [level]);
  const [stage, setStage] = useState<StageKey>(() => {
    const want = takePendingStage();
    return (stages.find((x) => x.key === want)?.key ?? stages[0]?.key ?? 'learn') as StageKey;
  });
  useEffect(() => {
    const h = (e: Event) => {
      const k = (e as CustomEvent<string>).detail;
      if (stages.some((x) => x.key === k)) {
        takePendingStage();
        setStage(k as StageKey);
      }
    };
    window.addEventListener('dryrun:stage', h);
    return () => window.removeEventListener('dryrun:stage', h);
  }, [stages]);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (level) markVisited(level.id, stage);
  }, [level, stage]);

  if (!ref || !level) {
    return (
      <div className="empty-state">
        <h1>Level not found</h1>
        <p>This level does not exist (yet).</p>
        <Link to={{ name: 'home' }} className="btn btn-primary">
          Back to the course
        </Link>
      </div>
    );
  }

  const lp = levelProgress(p, level.id);
  const locked = !isUnlocked(p, level.id);
  const si = stages.findIndex((s) => s.key === stage);
  const pick = (k: StageKey) => {
    setStage(k);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const prev = prevLevel(level.id);

  return (
    <article className={`lvl${level.kind === 'revision' ? ' is-rev' : ''}`}>
      <header className="lvl-head">
        <div className="lvl-meta">
          <span className={`pill ${level.kind === 'revision' ? 'pill-warn' : 'pill-accent'}`}>
            {level.kind === 'revision' && <Icon name="flag" size={12} />}
            {levelLabel(ref)}
          </span>
          <span className="lvl-unit">
            Unit {ref.unit.num} · {ref.unit.title}
          </span>
          {level.minutes && <span className="lvl-min">about {level.minutes} min</span>}
          {lp.done && (
            <span className="pill pill-ok">
              <Icon name="check" size={12} /> done
            </span>
          )}
        </div>
        <h1 className="lvl-title">{level.title}</h1>
        <p className="lvl-tagline">
          <Md text={level.tagline} />
        </p>
        {level.objectives.length > 0 && (
          <div className="objectives">
            <div className="eyebrow">By the end you can</div>
            <ul>
              {level.objectives.map((o, i) => (
                <li key={i}>
                  <Icon name="check" size={14} />
                  <span>
                    <Md text={o} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {locked ? (
        <div className="locked">
          <Icon name="lock" size={22} />
          <div>
            <strong>This level is locked.</strong> Finish {prev ? `${levelLabel(prev)}: ${prev.level.title}` : 'the previous level'} first — or turn on “Open every level” in the course panel.
            {prev && (
              <div>
                <Link to={{ name: 'level', id: prev.level.id }} className="btn btn-primary btn-sm">
                  Go to {levelLabel(prev)}
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div ref={topRef} className="stage-anchor" />
          {stages.length > 1 && (
            <nav className="stages" aria-label="Stages of this level">
              {stages.map((s, i) => {
                const seen = lp.visited.includes(s.key);
                return (
                  <button key={s.key} className={`stage-tab${s.key === stage ? ' is-on' : ''}${seen ? ' is-seen' : ''}${s.key === 'exam' ? ' is-gold' : ''}`} onClick={() => pick(s.key)} aria-current={s.key === stage ? 'step' : undefined}>
                    <span className="stage-num tnum">{seen && s.key !== stage ? <Icon name="check" size={13} /> : i + 1}</span>
                    <span className="stage-label">{s.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          <div className="stage-body" key={`${level.id}-${stage}`}>
            {stage === 'learn' && level.learn && <Blocks blocks={level.learn} />}
            {stage === 'ways' && level.ways && <WaysView ways={level.ways} levelId={level.id} />}
            {stage === 'watch' && level.watch && <WatchView demos={level.watch} />}
            {stage === 'think' && level.think && <ThinkView t={level.think} levelId={level.id} />}
            {stage === 'practice' && <PracticeView ref0={ref} />}
            {stage === 'exam' && level.exam && <ExamView level={level} />}
          </div>

          {stage === 'practice' && level.exam && (
            <button className="exam-cta" onClick={() => pick('exam')}>
              <Icon name="medal" size={22} />
              <span>
                <strong>Exam Challenge</strong> — {level.exam.questions.length} past-paper style questions (output or error?). Try them after the checkpoint.
              </span>
              <Icon name="arrow-right" />
            </button>
          )}
          {stage !== 'practice' && stage !== 'exam' && (
            <div className="stage-nav">
              {si > 0 ? (
                <button className="btn btn-ghost" onClick={() => pick(stages[si - 1].key)}>
                  <Icon name="arrow-left" /> {stages[si - 1].label}
                </button>
              ) : (
                <span />
              )}
              {si < stages.length - 1 && (
                <button className="btn btn-primary btn-lg" onClick={() => pick(stages[si + 1].key)}>
                  Next: {stages[si + 1].label} <Icon name="arrow-right" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
}
