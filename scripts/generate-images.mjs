// Generates branded .webp placeholder images for every product, plus the
// news/project images referenced by the seed. Run after the API is up:
//   pnpm gen:images
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const UPLOADS = join(ROOT, 'apps', 'api', 'uploads');
const API = process.env.API_URL || 'http://localhost:3001';

const GRADIENTS = [
  ['#062c6b', '#1A7FE8'],
  ['#0A4DB8', '#3BBFFF'],
  ['#0b3a86', '#2a9df4'],
  ['#10204a', '#1A7FE8'],
  ['#0A4DB8', '#1a7a8a'],
];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrap(text, max) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  return lines.slice(0, 4);
}

function pickGradient(key) {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

function svg({ title, subtitle, w = 800, h = 600 }) {
  const [c1, c2] = pickGradient(title);
  const lines = wrap(title, 22);
  const startY = h / 2 - (lines.length - 1) * 26 - 10;
  const titleSpans = lines
    .map(
      (ln, i) =>
        `<text x="48" y="${startY + i * 52}" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="700" fill="#ffffff">${esc(ln)}</text>`,
    )
    .join('');
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0 L0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <circle cx="${w - 90}" cy="90" r="120" fill="rgba(255,255,255,0.06)"/>
  ${subtitle ? `<text x="48" y="${startY - 40}" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#9fc6ff" letter-spacing="2">${esc(subtitle.toUpperCase())}</text>` : ''}
  ${titleSpans}
  <text x="48" y="${h - 40}" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600" fill="rgba(255,255,255,0.85)">Power Automation</text>
</svg>`);
}

async function writeWebp(relPath, { title, subtitle, w, h }) {
  const out = join(UPLOADS, relPath);
  await mkdir(dirname(out), { recursive: true });
  await sharp(svg({ title, subtitle, w, h }))
    .webp({ quality: 82 })
    .toFile(out);
  return relPath;
}

async function main() {
  // Products from the live API.
  const res = await fetch(`${API}/api/products?limit=500`);
  if (!res.ok) throw new Error(`API ${res.status} — is the stack up?`);
  const { data } = await res.json();
  let count = 0;
  for (const p of data) {
    await writeWebp(`products/${p.slug}.webp`, {
      title: p.nameEn || p.nameUz,
      subtitle: p.brand?.name ?? '',
    });
    count++;
  }
  console.log(`✅ ${count} product images`);

  // News + project images referenced by the seed.
  const news = [
    ['news/shortan.webp', 'Shurtan Gas Chemical Complex', 'Project'],
    ['news/coriolis.webp', 'Choosing a Coriolis Flowmeter', 'Technical article'],
  ];
  const projects = [
    ['projects/ustyurt-1.webp', 'Ustyurt Gas Chemical Complex', 'Oil & Gas'],
    ['projects/ustyurt-2.webp', 'Ustyurt — Control Room', 'Oil & Gas'],
    ['projects/olmaliq-1.webp', 'Almalyk MMC Water Treatment', 'Mining'],
  ];
  const brands = ['Emerson', 'Yokogawa', 'ABB', 'Endress+Hauser', 'Honeywell', 'Siemens', 'Bürkert'];

  for (const [path, title, sub] of [...news, ...projects]) {
    await writeWebp(path, { title, subtitle: sub, w: 1280, h: 720 });
  }
  for (const b of brands) {
    await writeWebp(`brands/${b.toLowerCase().replace(/[^a-z]/g, '')}.webp`, {
      title: b,
      subtitle: '',
      w: 400,
      h: 200,
    });
  }
  console.log(`✅ news/project/brand images`);
  console.log('🎉 Image generation complete →', UPLOADS);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
