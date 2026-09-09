// Utilidades para generar sitemaps multiidioma con enlaces hreflang.
import { LANG_META, LANGS, type Lang } from './i18n';

const SITE = 'https://cometia.es';
export const LASTMOD = '2026-09-09';

/** Devuelve un bloque <url> por cada idioma disponible, cada uno con el
 *  clúster completo de alternativas hreflang + x-default (ES). */
export function urlBlock(alts: Partial<Record<Lang, string>>): string {
  const avail = LANGS.filter((l) => alts[l]);
  if (!avail.length) return '';
  const links = avail
    .map((l) => `<xhtml:link rel="alternate" hreflang="${LANG_META[l].htmlLang}" href="${SITE}${alts[l]}"/>`)
    .join('');
  const xdef = alts.es ? `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${alts.es}"/>` : '';
  return avail
    .map((l) => `<url><loc>${SITE}${alts[l]}</loc>${links}${xdef}<lastmod>${LASTMOD}</lastmod></url>`)
    .join('');
}

export function urlset(body: string): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${body}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
