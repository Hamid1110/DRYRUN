// Builds a single self-contained HTML file of the app (hash routing, React from cdnjs).
// Used for quick previews/sharing; the real app is the Next.js project.
// Usage: npx tsx scripts/build-preview.ts [outFile]
import { build, type Plugin } from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { FONT_LINKS, PREFS_BOOT_SCRIPT } from '../src/lib/boot';

const out = resolve(process.argv[2] ?? 'preview-dist/index.html');

const reactGlobals: Plugin = {
  name: 'react-globals',
  setup(b) {
    b.onResolve({ filter: /^(react|react-dom|react-dom\/client|react\/jsx-runtime|react\/jsx-dev-runtime)$/ }, (a) => ({ path: a.path, namespace: 'rg' }));
    b.onLoad({ filter: /.*/, namespace: 'rg' }, (a) => {
      if (a.path === 'react') return { contents: 'module.exports = window.React;', loader: 'js' };
      if (a.path.startsWith('react-dom')) return { contents: 'module.exports = window.ReactDOM;', loader: 'js' };
      return {
        contents:
          'const R = window.React; export const Fragment = R.Fragment;' +
          'export function jsx(t, p, k) { return R.createElement(t, k === undefined ? p : Object.assign({}, p, { key: k })); }' +
          'export const jsxs = jsx; export const jsxDEV = jsx;',
        loader: 'js',
      };
    });
  },
};

async function main() {
const res = await build({
  entryPoints: ['src/preview/entry.tsx'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  jsx: 'automatic',
  write: false,
  outdir: 'preview-dist/tmp',
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [reactGlobals],
  logLevel: 'warning',
});

const js = res.outputFiles.find((f) => f.path.endsWith('.js'))!.text.replace(/<\/script/gi, '<\\/script');
const css = res.outputFiles.find((f) => f.path.endsWith('.css'))!.text.replace(/<\/style/gi, '<\\/style');

const html = `<title>DryRun C++ Lab</title>
<meta name="description" content="Learn Programming Fundamentals in C++ by watching every line run: memory, output and all.">
<script>${PREFS_BOOT_SCRIPT}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${FONT_LINKS.map((h) => `<link rel="stylesheet" href="${h}">`).join('\n')}
<style>${css}</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js" crossorigin></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js" crossorigin></script>
<script>${js}</script>
`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`wrote ${out} (${(html.length / 1024).toFixed(0)} KB)`);
// a complete HTML document for opening straight from disk (needs internet for React + fonts)
const full = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n${html}</body>\n</html>\n`;
const offline = out.replace(/index\.html$/, 'dryrun-offline.html');
writeFileSync(offline, full);
console.log(`wrote ${offline}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
