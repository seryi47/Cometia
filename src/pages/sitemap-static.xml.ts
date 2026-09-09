import type { APIRoute } from 'astro';
import { ZONAS, TYPE_ORDER, porTipo, porZonaTipo, altHome, altZona, altTipo, altZonaTipo, altMap, altPage } from '../data/guia/lugares';
import { urlBlock, urlset } from '../seo';

export const GET: APIRoute = () => {
  let b = urlBlock(altHome());
  for (const z of ZONAS) b += urlBlock(altZona(z));
  for (const t of TYPE_ORDER) if (porTipo(t).length) b += urlBlock(altTipo(t));
  for (const z of ZONAS) for (const t of TYPE_ORDER) if (porZonaTipo(z, t).length) b += urlBlock(altZonaTipo(z, t));
  b += urlBlock(altMap());
  b += urlBlock(altPage('about'));
  b += urlBlock(altPage('contact'));
  return urlset(b);
};
