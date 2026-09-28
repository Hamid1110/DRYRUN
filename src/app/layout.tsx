import type { Metadata, Viewport } from 'next';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/shell.css';
import '../styles/home.css';
import '../styles/level.css';
import '../styles/viz.css';
import '../styles/practice.css';
import '../styles/users.css';
import { NextRoot } from '@/components/shell/NextRoot';
import { FONT_LINKS, PREFS_BOOT_SCRIPT } from '@/lib/boot';

export const metadata: Metadata = {
  title: {
    default: 'DryRun — Learn to Think Like the Computer',
    template: '%s · DryRun',
  },
  description: 'Learn C++, Object-Oriented Programming, and Data Structures by watching every line run: memory, output, and all. Then dry-run it yourself.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" data-sidebar="open" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFS_BOOT_SCRIPT }} />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {FONT_LINKS.map((href) => (
          // eslint-disable-next-line @next/next/no-page-custom-font
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body>
        <NextRoot>{children}</NextRoot>
      </body>
    </html>
  );
}
