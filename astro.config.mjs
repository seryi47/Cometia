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
      serialize: (item) => {
        const u = item.url.replace('https://cometia.es', '').replace(/\/en\//, '/');
        const segs = u.split('/').filter(Boolean);
        let priority = 0.6;                 // fichas y resto
        if (u === '/' || u === '') priority = 1.0;            // home
        else if (u === '/mapa') priority = 0.9;               // mapa
        else if (segs.length === 1) priority = 0.8;           // zona o tipo global
        else if (segs.length === 2 && segs[0] !== 'sitio' && segs[0] !== 'place') priority = 0.8; // tipo+zona
        return { ...item, lastmod: new Date().toISOString(), changefreq: 'weekly', priority };
      },
    }),
  ],
});
