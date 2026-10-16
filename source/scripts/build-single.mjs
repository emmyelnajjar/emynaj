// Builds the whole site into ONE html file (code, styles, photo and icon inside).
// That file opens by double click, no web host needed.  Run: npm run build:single
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'dist-single');

await build({
  root,
  configFile: false,
  plugins: [react()],
  base: './',
  logLevel: 'warn',
  build: {
    outDir,
    emptyOutDir: true,
    assetsInlineLimit: () => true, // put the photo inside the file as data
    cssCodeSplit: false,
    modulePreload: false,
    chunkSizeWarningLimit: 2000,
    rolldownOptions: { output: { codeSplitting: false } } // one script, so it can be inlined
  }
});

let html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
const read = rel => fs.readFileSync(path.join(outDir, rel), 'utf8');
// Inline text must not close its own tag early.
const safeScript = js => js.replace(/<\/script/gi, '<\\/script');
const safeStyle = css => css.replace(/<\/style/gi, '<\\/style');

html = html.replace(/<script type="module" crossorigin src="\.\/[^"]+"><\/script>/g, '');
const scripts = [...fs.readdirSync(path.join(outDir, 'assets'))].filter(f => f.endsWith('.js'));
const styles = [...fs.readdirSync(path.join(outDir, 'assets'))].filter(f => f.endsWith('.css'));
html = html.replace(/<link rel="stylesheet" crossorigin href="\.\/[^"]+">/g, '');
// (Replacements use functions so "$" signs inside the code are kept as-is.)
html = html.replace(
  '</head>',
  () => styles.map(f => `<style>${safeStyle(read('assets/' + f))}</style>`).join('\n') + '\n</head>'
);
// The app script goes at the end of <body> so the page is ready when it runs.
html = html.replace(
  '</body>',
  () => scripts.map(f => `<script type="module">${safeScript(read('assets/' + f))}</script>`).join('\n') + '\n</body>'
);
const favicon = fs.readFileSync(path.join(root, 'public/favicon.svg'), 'utf8');
html = html.replace('href="./favicon.svg"', () => `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`);

if (/src="\.\/assets|href="\.\/assets/.test(html)) throw new Error('Something was left outside the single file');
const out = path.join(root, 'emynaj-website-single.html');
fs.writeFileSync(out, html);
fs.rmSync(outDir, { recursive: true, force: true });
console.log(`Single file ready: ${out} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
