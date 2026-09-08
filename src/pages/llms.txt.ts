import type { APIRoute } from 'astro';
import { LUGARES, ZONAS, CATEGORIAS } from '../data/guia/lugares';

export const GET: APIRoute = () => {
  const lines: string[] = [];
  lines.push('# Cometia — Guía de bares y restaurantes de la Costa Blanca');
  lines.push('');
  lines.push('> Guía local e independiente de bares, restaurantes, pubs y cafeterías de Gran Alacant, Santa Pola, Alicante y Elche (provincia de Alicante, Costa Blanca, España). Bilingüe español/inglés. Datos de establecimientos de OpenStreetMap (ODbL); descripciones propias; valoraciones enlazadas a Google.');
  lines.push('');
  lines.push('- Web (ES): https://cometia.es/');
  lines.push('- Web (EN): https://cometia.es/en/');
  lines.push('- Sobre la guía: https://cometia.es/sobre');
  lines.push('');
  for (const z of ZONAS) {
    const items = LUGARES.filter((x) => x.zone === z).sort((a, b) => a.name.localeCompare(b.name));
    lines.push(`## ${z} (${items.length})`);
    for (const l of items) {
      lines.push(`- ${l.name} — ${CATEGORIAS[l.type].es}: https://cometia.es/sitio/${l.slug}`);
    }
    lines.push('');
  }
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
