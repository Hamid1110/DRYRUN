'use client';

import { COURSES, COURSE_TRACKS, LEVELS, findLevel, isUnlocked, levelLabel, resumeLevel } from '@/content/course';
import { STAGES, type Unit } from '@/content/types';
import { Link } from '@/lib/router';
import { useProgress, type ProgressState } from '@/lib/progress';
import { useActiveTrack } from '@/lib/courseTrack';
import { Md } from '@/lib/md';
import { Icon } from '@/components/ui/Icon';
import { Visualizer } from '@/components/viz/Visualizer';

const HERO_CODE = `#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter a number: ";
    cin >> n;
    if (n % 2 == 0)
        cout << n << " is even";
    else
        cout << n << " is odd";
    return 0;
}
`;

const STAGE_ICONS: Record<string, string> = { learn: 'book', ways: 'split', watch: 'eye', think: 'bulb', practice: 'target' };

function Stars({ n }: { n: number }) {
  return (
    <span className="stars" aria-label={`${n} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <Icon key={i} name="star" size={14} className={i < n ? 'is-on' : ''} />
      ))}
    </span>
  );
}

function UnitBlock({ u, p }: { u: Unit; p: ProgressState }) {
  const soon = u.levels.length === 0;
  return (
    <section className={`unit-block${soon ? ' is-soon' : ''}`}>
      <div className="unit-head">
        <span className="unit-num">Unit {u.num}</span>
        <h3>{u.title}</h3>
        <p>
          <Md text={u.summary} />
        </p>
      </div>
      <div className="level-grid">
        {u.levels.map((l) => {
          const ref = findLevel(l.id)!;
          const lp = p.levels[l.id];
          const locked = !isUnlocked(p, l.id);
          return (
            <Link
              key={l.id}
              to={{ name: 'level', id: l.id }}
              className={`level-card${l.kind === 'revision' ? ' is-rev' : ''}${lp?.done ? ' is-done' : ''}${locked ? ' is-locked' : ''}`}
            >
              <div className="lc-top">
                <span className="lc-num">
                  {l.kind === 'revision' ? <Icon name="flag" size={14} /> : null}
                  {levelLabel(ref)}
                </span>
                {lp?.done ? <Stars n={lp.stars} /> : locked ? <Icon name="lock" size={15} /> : null}
              </div>
              <div className="lc-title">{l.title}</div>
              <div className="lc-tag">
                <Md text={l.tagline} />
              </div>
              <div className="lc-foot">
                {l.minutes ? `${l.minutes} min · ` : ''}
                {l.practice.length} questions
              </div>
            </Link>
          );
        })}
        {soon &&
          u.planned?.map((t, i) => (
            <div key={i} className="level-card is-planned">
              <div className="lc-top">
                <span className="lc-num">Coming soon</span>
              </div>
              <div className="lc-title">{t}</div>
            </div>
          ))}
      </div>
    </section>
  );
}

export function HomeScreen() {
  const p = useProgress();
  const [activeTrack, setActiveTrack] = useActiveTrack();
  const course = COURSES[activeTrack] ?? COURSES.pf;
  const resume = resumeLevel(p, activeTrack);
  const started = Object.values(p.levels).some((l) => l.visited.length > 0);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <div className="eyebrow">{course.title} · C++</div>
          <h1 className="display">Learn to think like the computer.</h1>
          <p className="lede">
            A program runs one line at a time. Watch it happen — memory, output and all — then dry-run it yourself until you can predict every step.
          </p>
          <div className="hero-cta">
            <Link to={{ name: 'level', id: resume.level.id }} className="btn btn-primary btn-lg">
              {started ? `Continue: ${levelLabel(resume)}` : `Start ${levelLabel(resume)}`}
              <Icon name="arrow-right" />
            </Link>
            <button className="btn btn-ghost btn-lg" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
              How a level works
            </button>
          </div>
          <ul className="hero-points">
            <li>
              <Icon name="eye" size={16} /> See every variable change in memory
            </li>
            <li>
              <Icon name="route" size={16} /> Find every path a program can take
            </li>
            <li>
              <Icon name="pencil" size={16} /> Fill the dry-run table yourself — with hints
            </li>
          </ul>
        </div>
        <div className="hero-demo">
          <Visualizer variant="hero" autoplay code={HERO_CODE} input={'7\n'} />
          <p className="hero-caption">This is running right now: the user typed 7. Press pause to stop it.</p>
        </div>
      </section>

      <section className="how" id="how">
        <div className="section-head">
          <div className="eyebrow">The method</div>
          <h2>Every level has the same five stages</h2>
        </div>
        <ol className="flow">
          {STAGES.map((s, i) => (
            <li className="flow-step" key={s.key}>
              <span className="flow-num tnum">{i + 1}</span>
              <Icon name={STAGE_ICONS[s.key]} size={20} className="flow-icon" />
              <strong>{s.label}</strong>
              <span>{s.long}</span>
            </li>
          ))}
        </ol>
        <p className="how-note">
          After each unit comes a <strong>checkpoint</strong>: mixed questions from everything so far, including real-life problems.
        </p>
      </section>

      <section className="map">
        <div className="section-head">
          <div className="eyebrow">Course map</div>
          <h2>{course.title}</h2>
        </div>

        {/* 3 Main Course Tracks */}
        <div className="home-track-selector" role="tablist" aria-label="Course tracks">
          {COURSE_TRACKS.map((t) => {
            const isCur = activeTrack === t.id;
            const trLevels = LEVELS.filter((l) => l.track === t.id);
            const trDone = trLevels.filter((l) => p.levels[l.level.id]?.done).length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isCur}
                className={`home-track-tab${isCur ? ' is-on' : ''}`}
                onClick={() => setActiveTrack(t.id)}
                type="button"
              >
                <Icon name={t.icon} size={16} />
                <span className="home-track-name">{t.label}</span>
                <span className="home-track-badge">
                  {trDone}/{trLevels.length}
                </span>
              </button>
            );
          })}
        </div>

        {course.units.map((u) => (
          <UnitBlock key={u.id} u={u} p={p} />
        ))}
      </section>
    </div>
  );
}
