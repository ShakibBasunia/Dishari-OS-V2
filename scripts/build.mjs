// Dishari OS build: (1) generates a folder per public route so /app, /admin … work on ANY static
// host (Vercel, Netlify, GitHub Pages, S3) without rewrites; (2) produces a single-file preview bundle.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(repo, 'public');
const ROUTES = ['app', 'demo-user', 'demo-admin', 'admin', 'sdg4', 'data', 'security', 'architecture', 'presentation', 'pitchdeck', 'audit'];
const tpl = readFileSync(join(repo, 'scripts', 'shell.html'), 'utf8');
writeFileSync(join(root, 'index.html'), tpl.replace('<!--BASE-->', '<base href="./">'));
for (const r of ROUTES) {
  mkdirSync(join(root, r), { recursive: true });
  writeFileSync(join(root, r, 'index.html'), tpl.replace('<!--BASE-->', '<base href="../">'));
}
console.log('index.html + route folders:', ROUTES.length);

// Single-file bundle (hash routing, inlined CSS/JS, system fonts) for offline sharing / previews
let html = tpl.replace('<!--BASE-->', '')
  .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\n?/, '')
  .replace(/<link rel="(icon|manifest|preconnect)"[^>]*>\n?/g, '');
html = html.replace('<link rel="stylesheet" href="assets/css/dishari.css">', () => `<style>${readFileSync(join(root, 'assets/css/dishari.css'), 'utf8')}</style>`);
html = html.replace('<script src="assets/js/core/core.js"></script>', '<script>window.DISHARI_HASH = true;</script>\n  <script src="assets/js/core/core.js"></script>');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>\n${readFileSync(join(root, src), 'utf8').replace(/<\/script/gi, '<\\/script')}\n</script>`);
mkdirSync(join(repo, 'dist'), { recursive: true });
writeFileSync(join(repo, 'dist', 'dishari-os-standalone.html'), html);
console.log('standalone bundle:', Math.round(html.length / 1024), 'KB');
