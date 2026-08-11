// ============================================================================
// Cometia — Snapshot Engine.
//   Envuelve el motor de diagnóstico (engine.js) y produce una FOTOGRAFÍA
//   completa y COMPARABLE del estado de una web en un momento dado.
//
//   Un snapshot guarda no solo "salud = 74", sino TODO lo necesario para
//   responder después: ¿por qué era 74? y ¿qué cambió para pasar a 61?
//   Por eso conserva: salud, recuentos, notas, métricas crudas, findings
//   (compactos), señales del HTML y recursos. Nada de esto se inventa: si
//   un dato no está disponible, es null.
//
//   No toca engine.js. Solo lo consume. Reutilizar > refactorizar > reescribir.
// ============================================================================
import { analyzePsi, analyzePage, diagnostica, hostOf } from './engine.js';

// Métricas de Lighthouse que nos importan para comparar en el tiempo.
// Guardamos el valor numérico crudo (ms o índice) para poder diferenciar.
const METRIC_AUDITS = {
  lcp: 'largest-contentful-paint',
  cls: 'cumulative-layout-shift',
  tbt: 'total-blocking-time',
  fcp: 'first-contentful-paint',
  si: 'speed-index',
  ttfb: 'server-response-time',
  tti: 'interactive',
};

function metricValue(aud, id) {
  const a = aud && aud[id];
  return a && typeof a.numericValue === 'number' ? Math.round(a.numericValue * 1000) / 1000 : null;
}

// Cuenta de dominios de terceros y peso total de scripts externos: sirve para
// detectar "se añadió un recurso pesado" entre dos snapshots (posible causa).
function extractResources(aud) {
  const out = { thirdPartyCount: null, thirdPartyWastedMs: null, requestCount: null, totalBytes: null };
  const tp = aud && aud['third-party-summary'];
  if (tp && tp.details && Array.isArray(tp.details.items)) {
    out.thirdPartyCount = tp.details.items.length;
    const w = tp.details.summary && tp.details.summary.wastedMs;
    if (typeof w === 'number') out.thirdPartyWastedMs = Math.round(w);
  }
  const net = aud && aud['network-requests'];
  if (net && net.details && Array.isArray(net.details.items)) {
    out.requestCount = net.details.items.length;
    let bytes = 0;
    for (const it of net.details.items) if (typeof it.transferSize === 'number') bytes += it.transferSize;
    out.totalBytes = bytes || null;
  }
  return out;
}

// Findings compactos: solo lo necesario para comparar y para explicar la alerta.
// El framing largo (queSignifica, impacto, causa, solución) NO se duplica aquí:
// vive en detectores.js y se recompone por id cuando hace falta mostrarlo.
function compactFindings(findings) {
  return findings.map((f) => ({
    id: f.id,
    categoria: f.categoria,
    titulo: f.titulo,
    severidad: f.severidad,
    prioridad: f.prioridad,
    evidencia: f.evidencia || '',
  }));
}

// Señales del HTML que queremos vigilar por cambios (title, contacto, tech…).
function pageSignals(page) {
  if (!page) return null;
  return {
    title: page.title || null,
    descLen: page.descContent ? page.descContent.length : 0,
    lang: page.lang || null,
    h1Count: page.h1Count,
    firstH1: page.firstH1 || '',
    imgCount: page.imgCount,
    imgsNoAlt: page.imgsNoAlt,
    words: page.words,
    hasTel: !!page.hasTel,
    hasWhatsapp: !!page.hasWhatsapp,
    hasForm: !!page.hasForm,
    ctaCount: page.ctaCount,
    schemaTypes: page.schemaTypes || [],
    social: page.social || [],
    tech: page.tech || null,
    noindex: !!page.noindex,
    canonical: !!page.canonical,
    sitemap: page.sitemap,
    robots: page.robots,
  };
}

/**
 * Construye un snapshot completo de una URL.
 * @param {string} url  URL ya normalizada.
 * @param {{apiKey?:string, strategy?:string}} opts
 * @returns {Promise<object>} snapshot  (o { error } si PSI falla)
 */
export async function buildSnapshot(url, opts = {}) {
  const strategy = opts.strategy || 'mobile';
  const [m, page] = await Promise.all([analyzePsi(url, strategy, opts.apiKey), analyzePage(url)]);
  if (m.error) return { error: m.error };

  const aud = (m.lhr && m.lhr.audits) || {};
  const metrics = {};
  for (const k of Object.keys(METRIC_AUDITS)) metrics[k] = metricValue(aud, METRIC_AUDITS[k]);

  const dx = diagnostica({ lhr: m.lhr, page });

  return {
    url,
    host: hostOf(url),
    strategy,
    reachable: !!page,
    salud: dx.salud,
    counts: dx.counts,
    scores: m.scores,
    global: m.global,
    metrics,
    resources: extractResources(aud),
    findings: compactFindings(dx.findings),
    ok: dx.ok.map((o) => o.titulo),
    signals: pageSignals(page),
  };
}

export { METRIC_AUDITS };
