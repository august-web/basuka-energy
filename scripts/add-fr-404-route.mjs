// The Vercel adapter hardcodes its static-mode 404 fallback to the English
// /404.html, so unknown French URLs served the English page. It exposes no option
// to change this, so we patch the generated routing config after the build.
// Wired into `npm run build`, which is what Vercel runs.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const configPath = '.vercel/output/config.json';
const frPagePath = '.vercel/output/static/fr/404/index.html';
const FR_ROUTE_SRC = '^/fr(/.*)?$';

if (!existsSync(configPath) || !existsSync(frPagePath)) {
  console.log('add-fr-404-route: Vercel output not found, skipping.');
  process.exit(0);
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const routes = config.routes ?? [];

if (routes.some((route) => route.src === FR_ROUTE_SRC)) {
  console.log('add-fr-404-route: route already present.');
  process.exit(0);
}

const catchAllIndex = routes.findIndex(
  (route) => route.src === '^/.*$' && route.status === 404 && route.dest === '/404.html',
);

if (catchAllIndex === -1) {
  console.error('add-fr-404-route: unexpected route layout, leaving config untouched.');
  process.exit(1);
}

routes.splice(catchAllIndex, 0, {
  src: FR_ROUTE_SRC,
  dest: '/fr/404/index.html',
  status: 404,
});

writeFileSync(configPath, JSON.stringify(config, null, '\t') + '\n');
console.log('add-fr-404-route: added French 404 fallback for /fr/*.');