'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { COURSES, findLevel, levelLabel } from '@/content/course';
import { Link, useNav } from '@/lib/router';
import { useProgress } from '@/lib/progress';
import { applyPrefs, setDrawer, setPrefs, usePrefs } from '@/lib/prefs';
import { useActiveTrack } from '@/lib/courseTrack';
import { Icon } from '@/components/ui/Icon';
import { Sidebar } from './Sidebar';
import { createPortal } from 'react-dom';
import { CompilerPanel } from './CompilerPanel';
import { LabsPanel } from './LabsPanel';
import { SearchModal } from '../search/SearchModal';
import { ProfileModal } from '../user/ProfileModal';
import { getUserProfile, hasPromptedProfile, useUserProfile } from '@/lib/userProfile';

function TopBar() {
  const nav = useNav();
  const p = useProgress();
  const prefs = usePrefs();
  const [activeTrack] = useActiveTrack();
  const ref = nav.route.name === 'level' ? findLevel(nav.route.id) : undefined;
  const currentCourse = ref ? COURSES[ref.track] : COURSES[activeTrack] ?? COURSES.pf;
  const [compiler, setCompiler] = useState(false);
  const closeCompiler = useCallback(() => setCompiler(false), []);
  const [labs, setLabs] = useState(false);
  const closeLabs = useCallback(() => setLabs(false), []);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    const onOpenSearch = () => setSearchOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('dryrun:open-search', onOpenSearch);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('dryrun:open-search', onOpenSearch);
    };
  }, []);

  const toggle = () => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      setDrawer(document.documentElement.getAttribute('data-drawer') !== 'open');
    } else {
      setPrefs({ sidebar: prefs.sidebar === 'open' ? 'closed' : 'open' });
    }
  };

  return (
    <header className="top">
      <button className="icon-btn top-toggle" onClick={toggle} aria-label="Show or hide the course panel">
        <Icon name="menu" />
      </button>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to={{ name: 'home' }} className="crumb">
          {currentCourse.title}
        </Link>
        {ref && (
          <>
            <Icon name="chev-right" size={14} className="crumb-sep" />
            <span className="crumb is-unit">Unit {ref.unit.num}</span>
            <Icon name="chev-right" size={14} className="crumb-sep" />
            <span className="crumb is-here">
              {levelLabel(ref)}: {ref.level.title}
            </span>
          </>
        )}
      </nav>

      {/* Prominent Search Bar Trigger */}
      <button
        className="top-search-btn"
        onClick={() => setSearchOpen(true)}
        aria-label="Search topics and past papers"
        type="button"
      >
        <Icon name="search" size={15} />
        <span>Search topics, exam questions...</span>
        <kbd className="top-search-kbd">Ctrl K</kbd>
      </button>

      <div className="top-stats">
        <span className="stat" title="Experience points: earned by solving practice questions">
          <Icon name="bolt" size={15} />
          <span className="tnum">{p.xp}</span>
          <span className="stat-unit">XP</span>
        </span>
        <span className="stat" title="Days in a row you practised">
          <Icon name="flame" size={15} />
          <span className="tnum">{p.streak.days}</span>
          <span className="stat-unit">day{p.streak.days === 1 ? '' : 's'}</span>
        </span>
        <Link to={{ name: 'users' }} className="top-community" title="Live active learners & community leaderboard">
          <span className="live-pulse-dot" />
          <Icon name="users" size={15} />
          <span>Learners</span>
        </Link>
        <button className="btn top-labs" onClick={() => setLabs(true)} title="Lab tasks: solve them yourself, then see the dry run">
          <Icon name="flask" />
          <span>Labs</span>
        </button>
        <button className="btn btn-primary top-compiler" onClick={() => setCompiler(true)} title="Write and dry-run your own C++ program">
          <Icon name="terminal" />
          <span>C++ Compiler</span>
        </button>
      </div>
      {searchOpen && createPortal(<SearchModal isOpen={searchOpen} onClose={closeSearch} onOpenLab={() => { closeSearch(); setLabs(true); }} />, document.body)}
      {compiler && createPortal(<CompilerPanel onClose={closeCompiler} />, document.body)}
      {labs && createPortal(<LabsPanel onClose={closeLabs} />, document.body)}
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const nav = useNav();
  const prefs = usePrefs();
  const p = useProgress();
  const profile = useUserProfile();
  const routeKey = nav.route.name === 'level' ? nav.route.id : nav.route.name;

  const [promptOpen, setPromptOpen] = useState(false);

  // Show profile prompt once per browser for first-time visitors
  useEffect(() => {
    if (!hasPromptedProfile()) {
      const timer = setTimeout(() => {
        setPromptOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Periodic heartbeat reporting user's presence, points, streak to server
  useEffect(() => {
    const sendHeartbeat = () => {
      const prof = getUserProfile();
      if (!prof) return;
      const doneCount = Object.values(p.levels).filter((l) => l.done).length;
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: prof.id,
          name: prof.name,
          institute: prof.institute,
          xp: p.xp,
          streakDays: p.streak.days || 1,
          levelsDone: doneCount,
        }),
      }).catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 45000);
    return () => clearInterval(interval);
  }, [p.xp, p.streak.days, profile]);

  useEffect(() => {
    applyPrefs(prefs);
  }, [prefs]);

  useEffect(() => {
    setDrawer(false);
  }, [routeKey]);

  return (
    <div className="app">
      <Sidebar />
      <div className="scrim" onClick={() => setDrawer(false)} aria-hidden="true" />
      <div className="main-col">
        <TopBar />
        <main className="main" id="main">
          {children}
        </main>
      </div>
      {promptOpen && (
        <ProfileModal
          isOpen={promptOpen}
          isInitialPrompt={true}
          onClose={() => setPromptOpen(false)}
        />
      )}
    </div>
  );
}
