'use client';

import { useEffect, useMemo, useState } from 'react';
import { LABS } from '@/content/labs';
import type { Lab, TaskQ } from '@/content/types';
import { levelProgress, useProgress } from '@/lib/progress';
import { Icon } from '@/components/ui/Icon';
import { inline } from '@/lib/md';
import { QuestionCard } from '@/components/practice/QuestionCard';

const KEY = 'dryrun.labs.v2';

export type LabTrack = 'pf' | 'oop' | 'dsa';

interface TrackInfo {
  id: LabTrack;
  label: string;
  icon: string;
  desc: string;
}

const TRACKS: TrackInfo[] = [
  { id: 'pf', label: 'Programming Fundamentals', icon: 'terminal', desc: 'Loops, functions, 2D arrays, matrix traversals and pattern tasks' },
  { id: 'oop', label: 'Object Oriented Programming', icon: 'code', desc: 'Classes/structs, encapsulation, matrix operations, volume calculations and complex numbers' },
  { id: 'dsa', label: 'Data Structures', icon: 'grid', desc: 'Linked lists, in-place list reversal, stack parentheses matching, and queue operations' },
];

interface FlatTaskItem {
  lab: Lab;
  task: TaskQ;
  trackIndex: number;
}

/** Full-screen lab tasks: 3 clean tracks, solve it yourself first, with model solution and dry run. */
export function LabsPanel({ onClose }: { onClose: () => void }) {
  const p = useProgress();
  const [track, setTrack] = useState<LabTrack>('pf');
  const [taskIndex, setTaskIndex] = useState<number>(0);

  // Group all tasks by the 3 tracks
  const tasksByTrack = useMemo(() => {
    const map: Record<LabTrack, FlatTaskItem[]> = {
      pf: [],
      oop: [],
      dsa: [],
    };
    for (const lab of LABS) {
      const tr = lab.track ?? 'pf';
      for (const task of lab.tasks) {
        map[tr].push({
          lab,
          task,
          trackIndex: map[tr].length,
        });
      }
    }
    return map;
  }, []);

  // Restore saved track & task
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.track && (saved.track === 'pf' || saved.track === 'oop' || saved.track === 'dsa')) {
          setTrack(saved.track);
        }
        if (typeof saved.taskIndex === 'number') {
          setTaskIndex(saved.taskIndex);
        }
      }
    } catch {
      /* ignore */
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Save current selection
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ track, taskIndex }));
    } catch {
      /* ignore */
    }
  }, [track, taskIndex]);

  const list = tasksByTrack[track] || [];
  const currentItem = list[taskIndex] ?? list[0];
  const task = currentItem?.task;
  const lab = currentItem?.lab;

  const total = list.length;
  const solved = list.filter((item) => levelProgress(p, `lab:${item.lab.id}`).qs[item.task.id]?.ok).length;

  const changeTrack = (t: LabTrack) => {
    setTrack(t);
    setTaskIndex(0);
  };

  const goPrev = () => {
    if (taskIndex > 0) setTaskIndex(taskIndex - 1);
  };

  const goNext = () => {
    if (taskIndex < list.length - 1) setTaskIndex(taskIndex + 1);
  };

  const activeTrackInfo = TRACKS.find((t) => t.id === track) ?? TRACKS[0];

  return (
    <div className="cmp-scrim" role="dialog" aria-modal="true" aria-label="Lab tasks">
      <div className="cmp labs">
        <div className="cmp-head">
          <div className="cmp-title">
            <Icon name="flask" size={18} />
            <strong>Lab Tasks</strong>
            <span className="cmp-sub">
              {activeTrackInfo.label} · {solved}/{total} solved
            </span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close labs">
            <Icon name="x" />
          </button>
        </div>

        <div className="labs-body">
          {/* Left Navigation: 3 Main Tracks + Clean Task List */}
          <nav className="labs-nav" aria-label="Lab navigation">
            <div className="labs-track-selector">
              <span className="eyebrow">Subject Tracks</span>
              <div className="labs-track-tabs">
                {TRACKS.map((t) => {
                  const cnt = tasksByTrack[t.id].length;
                  const isCur = track === t.id;
                  const trSolved = tasksByTrack[t.id].filter(
                    (item) => levelProgress(p, `lab:${item.lab.id}`).qs[item.task.id]?.ok,
                  ).length;
                  return (
                    <button
                      key={t.id}
                      className={`labs-track-tab${isCur ? ' is-on' : ''}`}
                      onClick={() => changeTrack(t.id)}
                      type="button"
                    >
                      <Icon name={t.icon} size={15} />
                      <span className="labs-track-tab-name">{t.label}</span>
                      <span className="labs-track-badge">
                        {trSolved ? `${trSolved}/` : ''}{cnt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="labs-list-section">
              <div className="labs-list-head">
                <span className="eyebrow">{activeTrackInfo.label} Questions</span>
                <span className="tnum muted small">{total} tasks</span>
              </div>
              <div className="labs-tasks-scroll">
                {list.map((item, idx) => {
                  const lp = levelProgress(p, `lab:${item.lab.id}`);
                  const r = lp.qs[item.task.id];
                  const on = idx === taskIndex;
                  const title = item.task.prompt
                    .split('\n')[0]
                    .replace(/\*\*/g, '')
                    .replace(/^[Q0-9:.-]+\s*/, '')
                    .trim();

                  return (
                    <button
                      key={item.task.id}
                      className={`labs-task${on ? ' is-on' : ''}${r?.ok ? ' is-ok' : r ? ' is-rev' : ''}`}
                      onClick={() => setTaskIndex(idx)}
                      type="button"
                    >
                      <span className="labs-dot">
                        {r?.ok ? <Icon name="check" size={12} /> : idx + 1}
                      </span>
                      <span className="labs-task-title">{inline(title)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main Workspace Area */}
          <main className="labs-main">
            {task && lab ? (
              <div className="labs-card-wrap">
                {/* Header with question counter and prev/next buttons */}
                <div className="labs-task-header">
                  <div className="labs-task-crumb">
                    <span className="labs-track-pill">{activeTrackInfo.label}</span>
                    <span className="labs-task-counter tnum">
                      Question {taskIndex + 1} of {list.length}
                    </span>
                  </div>
                  <div className="labs-task-nav-btns">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={goPrev}
                      disabled={taskIndex === 0}
                      title="Previous task"
                    >
                      <Icon name="arrow-left" /> Previous
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={goNext}
                      disabled={taskIndex >= list.length - 1}
                      title="Next task"
                    >
                      Next task <Icon name="arrow-right" />
                    </button>
                  </div>
                </div>

                {/* Render the question card: user writes code, checks live syntax, tests, or views solution */}
                <QuestionCard
                  key={`${track}:${lab.id}:${task.id}`}
                  q={task}
                  levelId={`lab:${lab.id}`}
                  num={taskIndex + 1}
                />

                {/* Bottom navigation bar */}
                <div className="labs-nextrow">
                  <button
                    className="btn btn-ghost"
                    onClick={goPrev}
                    disabled={taskIndex === 0}
                  >
                    <Icon name="arrow-left" /> Previous question
                  </button>
                  <span className="tnum muted small">
                    {taskIndex + 1} / {list.length}
                  </span>
                  <button
                    className="btn btn-primary"
                    onClick={goNext}
                    disabled={taskIndex >= list.length - 1}
                  >
                    Next question <Icon name="arrow-right" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="cmp-empty">No tasks in this section yet.</div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
