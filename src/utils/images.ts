/**
 * Resolve a legacy "/assets/foo.webp" public path to the same file living in
 * src/assets/, so Astro can optimize it at build time (srcset, width, format).
 * Falls back to the original path when no matching source asset exists
 * (e.g. favicons, logo, or images that intentionally stay unoptimized).
 */
import type { ImageMetadata } from 'astro';
import { imageMap } from './image-map';

export function resolveImage(src: string | undefined | null): string | ImageMetadata | null {
  if (!src) return null;
  if (!src.startsWith('/assets/')) return src;
  const name = src.split('/').pop()!;
  return imageMap[name] ?? src;
}

export type { ImageMetadata };
