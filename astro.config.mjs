// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Páginas noindex que NO deben aparecer en el sitemap.
const NOINDEX = ['/aviso-legal', '/privacidad', '/en/privacy', '/404'];

// https://astro.build
export default defineConfig({
  site: 'https://cometia.es',
  // Una sola URL por página, SIN barra final, para que coincida con la
  // etiqueta canónica y el sitemap no genere duplicados (arregla el
  // "Página alternativa con etiqueta canónica adecuada" de Search Console).
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.includes(p)),
      serialize: (item) => ({ ...item, lastmod: new Date().toISOString() }),
    }),
  ],
});
