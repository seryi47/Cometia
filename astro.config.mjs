// @ts-check
import { defineConfig } from 'astro/config';

// El sitemap se genera a mano en src/pages/sitemap-*.xml.ts con enlaces
// hreflang multiidioma (mejor para un sitio de 7 idiomas). La integración
// @astrojs/sitemap no encaja con ES en la raíz, por eso no se usa.

// https://astro.build
export default defineConfig({
  site: 'https://cometia.es',
  // Una sola URL por página, SIN barra final, para que coincida con la
  // etiqueta canónica y no generar duplicados.
  trailingSlash: 'never',
});
