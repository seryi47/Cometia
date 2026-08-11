// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Páginas noindex que NO deben aparecer en el sitemap.
const NOINDEX = ['/aviso-legal', '/privacidad', '/gracias'];

// https://astro.build
export default defineConfig({
  site: 'https://cometia.es',
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.includes(p)),
      serialize: (item) => ({ ...item, lastmod: new Date().toISOString() }),
    }),
  ],
});
