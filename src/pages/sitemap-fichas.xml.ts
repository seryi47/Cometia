import type { APIRoute } from 'astro';
import { LUGARES, altFicha } from '../data/guia/lugares';
import { urlBlock, urlset } from '../seo';

export const GET: APIRoute = () => {
  let b = '';
  for (const l of LUGARES) b += urlBlock(altFicha(l.slug));
  return urlset(b);
};
