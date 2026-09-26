// Single-file preview build: the same UI as the Next.js app, with hash-based routing.
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/shell.css';
import '../styles/home.css';
import '../styles/level.css';
import '../styles/viz.css';
import '../styles/practice.css';
import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { NavContext, type Nav, type Route } from '@/lib/router';
import { findLevel } from '@/content/course';
import { AppShell } from '@/components/shell/AppShell';
import { HomeScreen } from '@/components/home/HomeScreen';
import { LevelScreen } from '@/components/level/LevelScreen';
import { PlaygroundScreen } from '@/components/play/PlaygroundScreen';

function hashOf(r: Route): string {
  if (r.name === 'level') return r.id;
  if (r.name === 'playground') return 'sandbox';
  return 'home';
}

function parseHash(): Route {
  const h = decodeURIComponent(window.location.hash.slice(1));
  if (h === 'sandbox') return { name: 'playground' };
  if (h && findLevel(h)) return { name: 'level', id: h };
  return { name: 'home' };
}

function HashRoot() {
  const [route, setRoute] = useState<Route>(() => parseHash());
  useEffect(() => {
    const on = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const nav = useMemo<Nav>(
    () => ({
      route,
      href: (r) => '#' + hashOf(r),
      go: (r) => {
        const h = hashOf(r);
        if (window.location.hash.slice(1) === h) {
          setRoute(r);
          window.scrollTo(0, 0);
        } else {
          try {
            window.location.hash = h;
          } catch {
            setRoute(r);
          }
        }
      },
    }),
    [route],
  );
  let screen;
  if (route.name === 'level') screen = <LevelScreen key={route.id} id={route.id} />;
  else if (route.name === 'playground') screen = <PlaygroundScreen />;
  else screen = <HomeScreen />;
  return (
    <NavContext.Provider value={nav}>
      <AppShell>{screen}</AppShell>
    </NavContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<HashRoot />);
