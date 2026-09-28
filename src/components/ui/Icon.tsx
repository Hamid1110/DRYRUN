import type { SVGProps } from 'react';

// Hand-drawn line icons (24×24, 2px stroke).
const P: Record<string, string> = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  x: 'M6 6l12 12M18 6L6 18',
  'chev-right': 'M9 6l6 6-6 6',
  'chev-left': 'M15 6l-6 6 6 6',
  'chev-down': 'M6 9l6 6 6-6',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 017 0v3',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  'check-circle': 'M12 21a9 9 0 110-18 9 9 0 010 18zM8 12.5l3 3 5-6',
  circle: 'M12 21a9 9 0 110-18 9 9 0 010 18z',
  play: 'M8 5.5v13l11-6.5z',
  pause: 'M8 5h3v14H8zM13 5h3v14h-3z',
  first: 'M6 5v14M18 6l-8 6 8 6z',
  last: 'M18 5v14M6 6l8 6-8 6z',
  prev: 'M15 6l-6 6 6 6',
  next: 'M9 6l6 6-6 6',
  sun: 'M12 16a4 4 0 100-8 4 4 0 000 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z',
  monitor: 'M3 5h18v11H3zM8 20h8M12 16v4',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  flame: 'M12 22c4 0 7-2.8 7-7 0-3.5-2.5-6-4-8-.5 2-1.5 3-3 3.5C12.5 7 11 4 8.5 2 8.5 6 5 8.5 5 14c0 4.2 3 8 7 8z',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  book: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v16M8 7h7',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z',
  route: 'M6 19a2 2 0 100-4 2 2 0 000 4zM18 9a2 2 0 100-4 2 2 0 000 4zM6 15V9a4 4 0 014-4h6M18 9v6a4 4 0 01-4 4H8',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  terminal: 'M3 5h18v14H3zM7 10l3 2-3 2M12 15h5',
  cpu: 'M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4',
  keyboard: 'M3 7h18v10H3zM7 11h.01M11 11h.01M15 11h.01M7 14h10',
  refresh: 'M20 11a8 8 0 10-2.3 5.7M20 4v7h-7',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',
  trophy: 'M8 4h8v5a4 4 0 01-8 0zM8 6H4.5a3.5 3.5 0 004 4M16 6h3.5a3.5 3.5 0 01-4 4M12 13v4M8.5 21h7M9.5 17h5v4h-5z',
  flask: 'M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 006 21h12a1.7 1.7 0 001.5-2.5L14 9V3M7.5 15h9',
  hash: 'M5 9h14M5 15h14M10 4L8 20M16 4l-2 16',
  medal: 'M8 3h8l-2.5 6h-3zM12 21a6 6 0 100-12 6 6 0 000 12zM12 12.5l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3z',
  flow: 'M8 3h8v4H8zM12 7v3M12 10l5 3.5-5 3.5-5-3.5zM12 17v2M8 19h8v3H8z',
  target: 'M12 21a9 9 0 110-18 9 9 0 010 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 12h.01',
  bug: 'M9 7a3 3 0 016 0v1H9zM7 9h10v5a5 5 0 01-10 0zM12 9v10M4 12h3M17 12h3M5 18l2.5-1.5M19 18l-2.5-1.5M5 7l2.5 1.5M19 7l-2.5 1.5',
  puzzle: 'M10 4h4v3a1.5 1.5 0 003 0V4h3v6h-3a1.5 1.5 0 000 3h3v7h-6v-3a1.5 1.5 0 00-3 0v3H4v-7h3a1.5 1.5 0 000-3H4V4z',
  pencil: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3',
  help: 'M12 21a9 9 0 110-18 9 9 0 010 18zM9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.5M12 17h.01',
  info: 'M12 21a9 9 0 110-18 9 9 0 010 18zM12 11v6M12 7.5h.01',
  alert: 'M12 3l10 18H2zM12 10v5M12 18h.01',
  'x-circle': 'M12 21a9 9 0 110-18 9 9 0 010 18zM9 9l6 6M15 9l-6 6',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  split: 'M6 3v6a6 6 0 006 6h0a6 6 0 016 6M18 3v6a6 6 0 01-6 6',
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  drag: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
};

export type IconName = keyof typeof P;

export function Icon({ name, size, ...rest }: { name: IconName | string; size?: number } & SVGProps<SVGSVGElement>) {
  const d = P[name] ?? P.circle;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size ?? 18}
      height={size ?? 18}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
