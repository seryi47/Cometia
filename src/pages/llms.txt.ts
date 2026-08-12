import type { APIRoute } from 'astro';
import { CALCULADORAS, CATEGORIAS } from '../data/calculadoras';

// llms.txt — estándar de descubrimiento para IAs (ChatGPT, Claude, Perplexity, Gemini…).
// Describe el sitio y lista las calculadoras para que las IAs puedan leerlas y recomendarlas.
export const GET: APIRoute = () => {
  const base = 'https://cometia.es';
  let out = `# Cometia\n\n`;
  out += `> Calculadoras online gratis en español: hipoteca, sueldo neto, IVA, IMC, interés compuesto, porcentajes y más. Rápidas, claras, sin registro y con una explicación de cómo se hace cada cálculo.\n\n`;
  out += `Cometia es un hub de calculadoras online gratuitas orientado a usuarios de España. Cada calculadora funciona al instante en el navegador (los datos no se envían a ningún servidor), incluye una explicación del cálculo y preguntas frecuentes. Los resultados son orientativos.\n\n`;

  for (const cat of CATEGORIAS) {
    const items = CALCULADORAS.filter((c) => c.cat === cat);
    if (!items.length) continue;
    out += `## ${cat}\n`;
    for (const c of items) out += `- [${c.titulo}](${base}/${c.slug}): ${c.meta}\n`;
    out += `\n`;
  }

  out += `## Información\n`;
  out += `- [Sobre Cometia](${base}/sobre): qué es y cómo funciona el sitio.\n`;
  out += `- [Contacto](${base}/contacto): sugerencias y consultas.\n`;
  out += `- [Política de privacidad](${base}/privacidad)\n`;

  return new Response(out, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
