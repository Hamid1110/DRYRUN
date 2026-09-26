'use client';

import { useEffect, useState } from 'react';
import { COURSES, COURSE_TRACKS, LEVELS, findLevel, isUnlocked, type CourseTrack } from '@/content/course';
import { Link, requestStage, useNav } from '@/lib/router';
import { resetAll, setUnlockAll, useProgress } from '@/lib/progress';
import { setDrawer, setPrefs, usePrefs, type ThemePref } from '@/lib/prefs';
import { useActiveTrack } from '@/lib/courseTrack';
import { Icon } from '@/components/ui/Icon';

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="logo" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} fill="none">
        <defs>
          <linearGradient id="sb-dr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="sb-dr-shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* Rounded Squircle */}
        <rect x="1" y="1" width="30" height="30" rx="8" fill="url(#sb-dr-bg)" />
        {/* Glossy inner rim */}
        <rect x="1.5" y="1.5" width="29" height="29" rx="7.5" stroke="url(#sb-dr-shine)" strokeWidth="1" />
        {/* Code Execution Chevron */}
        <path d="M8.5 8.5L17.5 16L8.5 23.5" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Terminal Trace Cursor Bar */}
        <path d="M19 21.5H24.5" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
        {/* Micro Execution Bead */}
        <circle cx="21.5" cy="11.5" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
      </svg>
    </span>
  );
}

function ExecMark() {
  return (
    <svg viewBox="0 0 22 14" width="16" height="11" aria-hidden="true" className="sb-exec">
      <path d="M1 5h12V1l8 6-8 6V9H1z" />
    </svg>
  );
}

export function Sidebar() {
  const nav = useNav();
  const p = useProgress();
  const prefs = usePrefs();
  const [activeTrack, setActiveTrack] = useActiveTrack();
  const activeId = nav.route.name === 'level' ? nav.route.id : null;
  const activeLevelRef = activeId ? findLevel(activeId) : undefined;
  const activeUnit = activeLevelRef?.unit.id;

  // Auto-sync active track if navigated to a level in a different course
  useEffect(() => {
    if (activeLevelRef && activeLevelRef.track !== activeTrack) {
      setActiveTrack(activeLevelRef.track);
    }
  }, [activeLevelRef, activeTrack, setActiveTrack]);

  const course = COURSES[activeTrack] ?? COURSES.pf;
  const courseLevels = LEVELS.filter((l) => l.track === activeTrack);
  const total = courseLevels.length;
  const done = courseLevels.filter((l) => p.levels[l.level.id]?.done).length;

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [confirmReset, setConfirmReset] = useState(false);
  const isOpen = (id: string, idx: number) => open[id] ?? (id === activeUnit || (idx === 0 && !activeUnit));

  const closePanel = () => {
    if (window.matchMedia('(max-width: 900px)').matches) setDrawer(false);
    else setPrefs({ sidebar: 'closed' });
  };

  const exportProgress = () => {
    try {
      const backup: Record<string, string> = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith('dryrun.')) {
          const val = window.localStorage.getItem(k);
          if (val !== null) backup[k] = val;
        }
      }
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dryrun-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Backup failed: ' + String(err));
    }
  };

  const importProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (typeof data === 'object' && data !== null) {
          Object.entries(data).forEach(([k, v]) => {
            if (k.startsWith('dryrun.') && typeof v === 'string') {
              window.localStorage.setItem(k, v);
            }
          });
          window.location.reload();
        }
      } catch {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  const themes: { key: ThemePref; icon: string; label: string }[] = [
    { key: 'system', icon: 'monitor', label: 'System' },
    { key: 'light', icon: 'sun', label: 'Light' },
    { key: 'dark', icon: 'moon', label: 'Dark' },
  ];

  return (
    <aside className="sb" aria-label="Course navigation">
      <div className="sb-head">
        <Link to={{ name: 'home' }} className="sb-brand" title="DryRun Home">
          <Logo />
          <span className="sb-word">
            Dry<span className="sb-word-accent">Run</span>
          </span>
        </Link>
        <button className="icon-btn" onClick={closePanel} aria-label="Close course panel">
          <Icon name="chev-left" />
        </button>
      </div>

      <div className="sb-scroll">
        {/* Search Bar Trigger */}
        <button
          className="sb-search-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('dryrun:open-search'))}
          type="button"
          aria-label="Search course topics"
        >
          <Icon name="search" size={14} />
          <span>Search topics...</span>
          <kbd>Ctrl K</kbd>
        </button>

        {/* 3 Main Course Tracks */}
        <div className="sb-track-selector">
          <div className="sb-track-tabs">
            {COURSE_TRACKS.map((t) => {
              const isCur = activeTrack === t.id;
              const trLevels = LEVELS.filter((l) => l.track === t.id);
              const trDone = trLevels.filter((l) => p.levels[l.level.id]?.done).length;
              return (
                <button
                  key={t.id}
                  className={`sb-track-tab${isCur ? ' is-on' : ''}`}
                  onClick={() => setActiveTrack(t.id)}
                  type="button"
                  title={t.label}
                >
                  <Icon name={t.icon} size={14} />
                  <span className="sb-track-tab-name">{t.label}</span>
                  <span className="sb-track-badge">
                    {trDone}/{trLevels.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sb-course">
          <div className="eyebrow">Course</div>
          <div className="sb-course-title">{course.title}</div>
          <div className="sb-course-meta">
            {course.lang} · {course.units.length} units
          </div>
          <div className="sb-progress" aria-label={`${done} of ${total} levels done`}>
            <div className="bar">
              <span style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
            </div>
            <span className="tnum">
              {done}/{total}
            </span>
          </div>
        </div>

        <nav className="sb-units">
          {course.units.map((u, ui) => {
            const unitDone = u.levels.filter((l) => p.levels[l.id]?.done).length;
            const cp = u.levels.find((l) => l.kind === 'revision');
            const complete = !!cp && !!p.levels[cp.id]?.done;
            const examQs = cp?.exam?.questions ?? [];
            const examDone = cp ? examQs.filter((q) => p.levels[cp.id]?.qs[q.id]).length : 0;
            const expanded = isOpen(u.id, ui);
            const soon = u.levels.length === 0;
            return (
              <div key={u.id} className={`sb-unit${soon ? ' is-soon' : ''}${complete ? ' is-complete' : ''}`}>
                <button className="sb-unit-head" aria-expanded={expanded} onClick={() => setOpen((o) => ({ ...o, [u.id]: !expanded }))}>
                  <span className="sb-unit-num">Unit {u.num}</span>
                  <span className="sb-unit-title">{u.title}</span>
                  <span className="sb-unit-meta">
                    {soon ? <span className="pill">soon</span> : complete ? <span className="sb-unit-done"><Icon name="check-circle" size={16} /> done</span> : <span className="tnum">{unitDone}/{u.levels.length}</span>}
                    <Icon name="chev-down" className={`sb-chev${expanded ? ' is-open' : ''}`} />
                  </span>
                </button>
                {expanded && (
                  <ul className="sb-levels">
                    {u.levels.map((l) => {
                      const ref = findLevel(l.id)!;
                      const lp = p.levels[l.id];
                      const locked = !isUnlocked(p, l.id);
                      const active = l.id === activeId;
                      const cls = `sb-lvl${active ? ' is-active' : ''}${lp?.done ? ' is-done' : ''}${locked ? ' is-locked' : ''}${l.kind === 'revision' ? ' is-rev' : ''}`;
                      return (
                        <li key={l.id}>
                          <Link to={{ name: 'level', id: l.id }} className={cls} aria-current={active ? 'page' : undefined}>
                            <span className="sb-gutter">{active && <ExecMark />}</span>
                            <span className="sb-num tnum">{l.kind === 'revision' ? <Icon name="flag" size={14} /> : String(ref.num).padStart(2, '0')}</span>
                            <span className="sb-name">{l.kind === 'revision' ? `Checkpoint: ${l.title}` : l.title}</span>
                            <span className="sb-state">
                              {lp?.done ? <Icon name="check" size={15} /> : locked ? <Icon name="lock" size={14} /> : null}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                    {cp && examQs.length > 0 && (
                      <li>
                        <Link to={{ name: 'level', id: cp.id }} onClick={() => requestStage('exam')} className="sb-lvl sb-exam">
                          <span className="sb-gutter" />
                          <span className="sb-num">
                            <Icon name="medal" size={15} />
                          </span>
                          <span className="sb-name">
                            Exam practice <span className="sb-exam-n tnum">{examDone}/{examQs.length}</span>
                          </span>
                          <span className="sb-state" />
                        </Link>
                      </li>
                    )}
                    {soon &&
                      u.planned?.map((t, i) => (
                        <li key={i}>
                          <span className="sb-lvl is-planned">
                            <span className="sb-gutter" />
                            <span className="sb-num">··</span>
                            <span className="sb-name">{t}</span>
                            <span className="sb-state" />
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="sb-foot">
        <div className="seg" role="radiogroup" aria-label="Theme">
          {themes.map((t) => (
            <button
              key={t.key}
              role="radio"
              aria-checked={prefs.theme === t.key}
              className={`seg-btn${prefs.theme === t.key ? ' is-on' : ''}`}
              onClick={() => setPrefs({ theme: t.key })}
              title={t.label}
            >
              <Icon name={t.icon} size={15} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        <label className="switch">
          <input type="checkbox" checked={p.unlockAll} onChange={(e) => setUnlockAll(e.target.checked)} />
          <span className="track" />
          Open every level (free roam)
        </label>
        
        {/* Browser-isolated Data Notice & Backup/Restore */}
        <div className="sb-storage-badge" title="All progress and code stays entirely in this browser. No server collision.">
          <Icon name="shield" size={13} />
          <span>100% Private in Browser</span>
        </div>
        <div className="sb-data-actions">
          <button
            className="btn btn-sm btn-ghost"
            onClick={exportProgress}
            title="Download backup file of your progress and code"
            type="button"
          >
            <Icon name="download" size={13} /> Backup
          </button>
          <label className="btn btn-sm btn-ghost" title="Restore progress from a backup file" style={{ cursor: 'pointer', margin: 0 }}>
            <Icon name="upload" size={13} /> Restore
            <input type="file" accept=".json" onChange={importProgress} style={{ display: 'none' }} />
          </label>
        </div>

        <button
          className={`btn btn-sm ${confirmReset ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => {
            if (confirmReset) {
              resetAll();
              setConfirmReset(false);
            } else setConfirmReset(true);
          }}
          onBlur={() => setConfirmReset(false)}
        >
          <Icon name="undo" /> {confirmReset ? 'Click again to erase progress' : 'Reset my progress'}
        </button>
      </div>
    </aside>
  );
}
