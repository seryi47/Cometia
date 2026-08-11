/**
 * Cometia — Radiografía GRATIS (Vercel serverless).
 * Analiza la web (PageSpeed + HTML real) y devuelve un DIAGNÓSTICO:
 *   Salud de la web + recuento por gravedad + el problema principal explicado.
 * No es un volcado de notas: es "qué te pasa y por qué importa". El detalle
 * completo (causa, solución, prioridad y plan) va en el informe de pago.
 */
import { analyzePsi, analyzePage, diagnostica, saludLabel, normalizeUrl, hostOf } from './_lib/engine.js';

export const config = { maxDuration: 60 };

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    if (typeof req.body === 'string' && req.body.length) { try { return resolve(JSON.parse(req.body)); } catch { return resolve({}); } }
    let d = '';
    req.on('data', (c) => (d += c));
    req.on('end', () => { try { resolve(d ? JSON.parse(d) : {}); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  let input = '';
  if (req.method === 'POST') { const b = await readBody(req); input = b.url || ''; }
  else if (req.method === 'GET') { input = (req.query && req.query.url) || ''; }
  else { res.statusCode = 405; return res.end(JSON.stringify({ error: 'Método no permitido.' })); }

  const url = normalizeUrl(input);
  if (!url) { res.statusCode = 400; return res.end(JSON.stringify({ error: 'Introduce una URL válida, por ejemplo tuempresa.es' })); }

  const apiKey = process.env.PAGESPEED_API_KEY;
  const [m, page] = await Promise.all([analyzePsi(url, 'mobile', apiKey), analyzePage(url)]);

  if (m.error) {
    // Cuota de Google agotada u otro fallo → degradamos con elegancia (el front cae en contacto).
    res.statusCode = 503;
    return res.end(JSON.stringify({ configured: false, message: 'Ahora mismo hay mucha demanda de análisis. Inténtalo en unos minutos o pídenoslo y te lo hacemos nosotros.' }));
  }

  const dx = diagnostica({ lhr: m.lhr, page });
  const sl = saludLabel(dx.salud);
  const top = dx.findings[0] || null;
  const restantes = dx.findings.slice(1, 6).map((f) => ({ titulo: f.titulo, severidad: f.severidad, categoria: f.categoria }));

  res.statusCode = 200;
  return res.end(JSON.stringify({
    configured: true,
    url,
    host: hostOf(url),
    salud: dx.salud,
    saludLabel: sl,
    counts: dx.counts,
    scores: m.scores,
    total: dx.findings.length,
    top: top ? { titulo: top.titulo, queSignifica: top.queSignifica, impacto: top.impacto, evidencia: top.evidencia, severidad: top.severidad, categoria: top.categoria, dificultad: top.dificultad } : null,
    restantes,
  }));
}
