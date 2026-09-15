// Persist the generator script so new images can be added to the map with one command.
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'src/assets';
const files = readdirSync(dir).filter((f) => /\.(webp|png|jpe?g|avif)$/.test(f));
const lines = [];
lines.push('// Auto-generated map of content image names -> Astro-optimized metadata.');
lines.push('// Generated from src/assets/*. Run: node scripts/gen-image-map.mjs');
lines.push('// when adding new images. Legacy /assets/foo.webp paths in page JSON resolve');
lines.push('// through this map at build time so every image gets srcset + responsive sizing.');
lines.push("import type { ImageMetadata } from 'astro';");
lines.push('');
files.forEach((f, i) => {
  lines.push(`import img${i} from '../assets/${f}';`);
});
lines.push('');
lines.push('export const imageMap: Record<string, ImageMetadata> = {');
files.forEach((f, i) => {
  lines.push(`  '${f}': img${i},`);
});
lines.push('};');
writeFileSync(join('src/utils/image-map.ts'), lines.join('\n') + '\n');
console.log('wrote src/utils/image-map.ts with', files.length, 'images');
