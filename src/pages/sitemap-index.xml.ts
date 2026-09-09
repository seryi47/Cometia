import type { APIRoute } from 'astro';
import { LASTMOD } from '../seo';

const SITE = 'https://cometia.es';
export const GET: APIRoute = () => {
  const parts = ['sitemap-static.xml', 'sitemap-fichas.xml'];
  const body = parts.map((s) => `<sitemap><loc>${SITE}/${s}</loc><lastmod>${LASTMOD}</lastmod></sitemap>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
