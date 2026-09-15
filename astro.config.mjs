// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://basukaenergy.com',
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
