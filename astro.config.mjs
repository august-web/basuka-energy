// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://basukaenergy.com',
  // Server adapter enables the /api/* endpoints used by the site forms.
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      // Annotate EN/FR URL pairs with xhtml:link alternates so search engines
      // serve the right locale version in regional results.
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          fr: 'fr',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
