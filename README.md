# Ba-Suka Energy — Website (Astro + Tailwind)

Modern rebuild of https://basukaenergy.com/ (the original WordPress codebase was
lost; this version was rebuilt by scraping the live site). All copy and imagery
belong to Ba-Suka Energy.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve the production build
```

## Editing content

All page copy lives in `src/data/*.json` — one file per page
(`home`, `about`, `how-it-works`, `services`, `partners`, `impact`,
`academy`, `ba-suka-academy`, `contact`). Each file is an ordered list of
sections (`hero`, `cards`, `steps`, `stats`, `faq`, `cta`, `logos`, `text`,
`image`, `contact`) rendered by `src/components/Sections.astro`. Edit JSON,
save, done — no component code needed for copy changes.

Images live in `public/assets/`.

## Structure

```
src/
  data/        page content (JSON)
  layouts/     Base.astro (head/SEO), Page.astro (header/footer wrapper)
  components/  Header, Footer, WhatsAppFloat, Sections (section renderer)
  pages/       one folder per route, matching the original URL structure
```

## Deploy

Static output — host `dist/` anywhere (Netlify, Vercel, Cloudflare Pages, S3,
nginx). Directory URLs like `/academy/` work out of the box.

## Notes

- No cookie banner (no tracking), no contact form (original had none) — CTAs
  link to WhatsApp (+226 66 38 45 92) and the contact page.
- The broken gtranslate flag switcher from the original site was dropped;
  add Astro i18n later if French is needed.
- Contact page data (phone/email) came from the original site and should be
  verified with the client before launch.
