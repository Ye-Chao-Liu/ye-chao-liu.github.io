import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';

const origin = 'https://ye-chao-liu.github.io';
const root = resolve('dist');
const routes = ['/', '/research/', '/publications/', '/projects/', '/about/'];
const read = file => readFileSync(file, 'utf8');
const walk = dir => readdirSync(dir).flatMap(name => {
  const file = resolve(dir, name);
  return statSync(file).isDirectory() ? walk(file) : [file];
});
const pages = walk(root).filter(file => file.endsWith('.html'));
const external = new Set();
let links = 0;
function target(pathname) {
  const path = resolve(root, '.' + decodeURIComponent(pathname));
  assert.ok(path === root || path.startsWith(root + sep), `Unsafe path: ${pathname}`);
  return existsSync(path) && statSync(path).isDirectory() ? resolve(path, 'index.html') : path;
}
for (const file of pages) {
  const path = '/' + relative(root, file).split(sep).join('/').replace(/index\.html$/, '');
  const html = read(file);
  assert.match(html, /<html lang="en"/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path}: one h1`);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<main id="main"/);
  for (const img of html.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /\balt="[^"]+"/, `${path}: image alt`);
  const head = html.split('</head>')[0];
  if (path === '/404.html') {
    assert.match(head, /name="robots" content="noindex, follow"/);
    assert.doesNotMatch(head, /rel="canonical"/);
    assert.match(html, /Return home/);
  } else {
    assert.ok(routes.includes(path), `Review new route: ${path}`);
    assert.ok(head.includes(`rel="canonical" href="${origin}${path}"`), `${path}: canonical`);
  }
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (/^(mailto:|data:)/.test(value)) continue;
    const url = new URL(value, origin + path);
    if (url.origin !== origin) { external.add(url.href); continue; }
    const dest = target(url.pathname);
    assert.ok(existsSync(dest), `${path}: missing target ${value}`);
    if (url.hash && dest.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(read(dest).includes(`id="${id}"`), `${path}: missing anchor ${value}`);
    }
    links++;
  }
}
const sitemap = read(resolve(root, 'sitemap.xml'));
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]).sort(), routes.map(p => origin + p).sort());
assert.match(read(resolve(root, 'robots.txt')), /User-agent: \*\nAllow: \/\n\nSitemap: https:\/\/ye-chao-liu.github.io\/sitemap.xml/);
assert.ok(!existsSync(resolve(root, 'cv_liu.tex')) && !existsSync(resolve(root, 'src')), 'Source data must not be copied to dist');
const publications = readdirSync('src/data/publications').filter(f => f.endsWith('.json')).map(f => JSON.parse(read('src/data/publications/' + f)));
const date = p => p.publicationDate || p.acceptanceDate || p.preprintDate || String(p.year);
const expected = [...publications].sort((a,b) => date(b).localeCompare(date(a)) || a.id.localeCompare(b.id)).map(p => p.id);
const rendered = [...read(resolve(root, 'publications/index.html')).matchAll(/<article\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
assert.deepEqual(rendered, expected, 'Publication sorting must match shared chronology');
console.log(`Built site valid: ${pages.length} HTML pages, ${links} internal links/assets/anchors; metadata, sitemap, robots, source exclusion, and publication order checked.`);
console.log('Publication order: ' + expected.join(', '));

// Explicit opt-in: external providers can block automated requests. Results need human review.
if (process.argv.includes('--external')) {
  for (const file of walk(resolve('src/data')).filter(f => f.endsWith('.json'))) {
    const record = JSON.parse(read(file));
    function collect(value, key = '') {
      if (typeof value === 'string') {
        if (/^https?:\/\//.test(value)) external.add(value);
        if (['doi','preprintDoi'].includes(key)) external.add('https://doi.org/' + value);
        if (key === 'arxiv') external.add('https://arxiv.org/abs/' + value);
      } else if (value && typeof value === 'object') for (const [k,v] of Object.entries(value)) collect(v,k);
    }
    collect(record);
  }
  const urls = [...external].sort();
  const results = [];
  async function worker() {
    while (urls.length) {
      const url = urls.shift();
      try {
        const response = await fetch(url, { method:'GET', redirect:'follow', signal:AbortSignal.timeout(15000) });
        results.push({ url, status:response.status, finalUrl:response.url });
        await response.body?.cancel();
      } catch(error) { results.push({ url, error:error.message }); }
    }
  }
  await Promise.all(Array.from({length:4}, worker));
  mkdirSync('previews', {recursive:true});
  writeFileSync('previews/pre-release-links.json', JSON.stringify(results.sort((a,b)=>a.url.localeCompare(b.url)), null, 2) + '\n');
  console.log(`External check: ${results.filter(r => r.status >= 200 && r.status < 400).length}/${results.length} successful; details in previews/pre-release-links.json (ignored).`);
}
