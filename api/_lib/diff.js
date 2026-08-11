// ============================================================================
// Cometia — Diff Engine.
//   Compara dos snapshots (anterior → nuevo) y decide QUÉ ha cambiado de forma
//   relevante. Su trabajo NO es listar todas las diferencias, sino separar la
//   señal del ruido: una web viva cambia constantemente; solo unas pocas cosas
//   merecen la atención (y menos aún, una alerta).
//
//   Reglas de oro:
//     · NO llamamos "regresión" a cualquier cambio → hay umbrales.
//     · Cada cambio lleva CONFIANZA (medido / inferido / hipótesis). Nunca
//       fingimos saber una causa que solo estamos deduciendo.
//     · Lo medido (salud, findings, métricas) es 'medido'. La CAUSA de un
//       cambio casi siempre es 'hipótesis'.
// ============================================================================

const SEV_RANK = { critico: 3, importante: 2, mejora: 1 };

// Umbrales por defecto (configurables). Bajar la salud 74→73 NO alerta; 74→51 sí.
export const DEFAULT_THRESHOLDS = {
  saludImportante: 10, // caída de salud que se considera importante
  saludCritica: 20, // caída de salud que se considera crítica
  saludMejora: 8, // subida de salud que merece destacarse
};

// Métricas: todas "menor es mejor". Un cambio solo cuenta si supera el mínimo
// absoluto Y el relativo (evita alertar por ruido de medición de Lighthouse).
const METRICS = {
  lcp: { label: 'Contenido principal (LCP)', unit: 'ms', abs: 800, rel: 0.15 },
  cls: { label: 'Estabilidad visual (CLS)', unit: '', abs: 0.05, rel: 0 },
  tbt: { label: 'Bloqueo de interacción (TBT)', unit: 'ms', abs: 150, rel: 0.25 },
  fcp: { label: 'Primer contenido (FCP)', unit: 'ms', abs: 500, rel: 0.15 },
  si: { label: 'Velocidad de carga (Speed Index)', unit: 'ms', abs: 1000, rel: 0.15 },
  ttfb: { label: 'Respuesta del servidor (TTFB)', unit: 'ms', abs: 300, rel: 0.25 },
  tti: { label: 'Interactividad (TTI)', unit: 'ms', abs: 1500, rel: 0.15 },
};

function fmtMetric(v, unit) {
  if (v == null) return '—';
  if (unit === 'ms') return v >= 1000 ? (v / 1000).toFixed(1).replace('.', ',') + ' s' : Math.round(v) + ' ms';
  return String(Math.round(v * 1000) / 1000).replace('.', ',');
}

function byId(findings) {
  const m = new Map();
  for (const f of findings || []) m.set(f.id, f);
  return m;
}

// Compara los findings de dos snapshots por id.
function diffFindings(prev, next) {
  const A = byId(prev), B = byId(next);
  const nuevos = [], resueltos = [], empeorados = [], mejorados = [];
  for (const [id, f] of B) {
    if (!A.has(id)) nuevos.push(f);
    else {
      const a = A.get(id);
      if (SEV_RANK[f.severidad] > SEV_RANK[a.severidad]) empeorados.push({ ...f, desde: a.severidad });
      else if (SEV_RANK[f.severidad] < SEV_RANK[a.severidad]) mejorados.push({ ...f, desde: a.severidad });
    }
  }
  for (const [id, f] of A) if (!B.has(id)) resueltos.push(f);
  return { nuevos, resueltos, empeorados, mejorados };
}

// Compara las métricas crudas de Lighthouse con umbrales absoluto + relativo.
function diffMetrics(prev, next) {
  const out = [];
  const pm = prev.metrics || {}, nm = next.metrics || {};
  for (const k of Object.keys(METRICS)) {
    const a = pm[k], b = nm[k];
    if (a == null || b == null) continue;
    const delta = b - a; // >0 = empeora
    const cfg = METRICS[k];
    const rel = a > 0 ? Math.abs(delta) / a : 1;
    if (Math.abs(delta) < cfg.abs) continue;
    if (cfg.rel && rel < cfg.rel) continue;
    out.push({
      metric: k, label: cfg.label, unit: cfg.unit,
      prev: a, next: b, delta, empeora: delta > 0,
      texto: fmtMetric(a, cfg.unit) + ' → ' + fmtMetric(b, cfg.unit),
    });
  }
  return out;
}

// Cambios en señales del HTML que importan (contacto, title, tech, schema…).
function diffSignals(prev, next) {
  const a = prev.signals, b = next.signals;
  if (!a || !b) return [];
  const ch = [];
  if (a.title !== b.title && (a.title || b.title))
    ch.push({ tipo: 'senal', clave: 'title', severidad: 'mejora', confianza: 'medido', titulo: 'El título de la página ha cambiado', evidencia: 'Antes: “' + (a.title || '—') + '” · Ahora: “' + (b.title || '—') + '”' });
  const contactoAntes = a.hasTel || a.hasWhatsapp || a.hasForm;
  const contactoAhora = b.hasTel || b.hasWhatsapp || b.hasForm;
  if (contactoAntes && !contactoAhora)
    ch.push({ tipo: 'senal', clave: 'contacto', severidad: 'importante', confianza: 'medido', titulo: 'Han desaparecido las vías de contacto visibles', evidencia: 'Ya no se detecta teléfono, WhatsApp ni formulario en la portada' });
  if (a.noindex !== b.noindex && b.noindex)
    ch.push({ tipo: 'senal', clave: 'noindex', severidad: 'critico', confianza: 'medido', titulo: 'La página se ha marcado como NO indexable (noindex)', evidencia: 'Google dejará de mostrarla en los resultados' });
  if ((a.schemaTypes || []).length > 0 && (b.schemaTypes || []).length === 0)
    ch.push({ tipo: 'senal', clave: 'schema', severidad: 'mejora', confianza: 'medido', titulo: 'Se han perdido los datos estructurados (schema)', evidencia: 'Antes había: ' + a.schemaTypes.join(', ') });
  if (a.tech !== b.tech && (a.tech || b.tech))
    ch.push({ tipo: 'senal', clave: 'tech', severidad: 'mejora', confianza: 'inferido', titulo: 'La tecnología de la web parece haber cambiado', evidencia: 'Antes: ' + (a.tech || 'desconocida') + ' · Ahora: ' + (b.tech || 'desconocida') });
  return ch;
}

// Intenta atribuir una CAUSA a una regresión de rendimiento. Siempre hipótesis.
function inferCausa(prev, next, metricsDiff) {
  const perfEmpeora = metricsDiff.some((m) => m.empeora && ['lcp', 'tbt', 'si', 'fcp'].includes(m.metric));
  if (!perfEmpeora) return null;
  const rp = prev.resources || {}, rn = next.resources || {};
  if (rp.thirdPartyCount != null && rn.thirdPartyCount != null && rn.thirdPartyCount > rp.thirdPartyCount)
    return { texto: 'Han aparecido nuevos recursos de terceros (de ' + rp.thirdPartyCount + ' a ' + rn.thirdPartyCount + ' dominios externos), lo que suele frenar la carga.', confianza: 'hipotesis' };
  if (rp.totalBytes != null && rn.totalBytes != null && rn.totalBytes > rp.totalBytes * 1.25)
    return { texto: 'La página pesa bastante más que antes (' + Math.round(rp.totalBytes / 1024) + ' KB → ' + Math.round(rn.totalBytes / 1024) + ' KB), posible causa de la ralentización.', confianza: 'hipotesis' };
  if (rp.requestCount != null && rn.requestCount != null && rn.requestCount > rp.requestCount + 10)
    return { texto: 'La página carga más archivos que antes (' + rp.requestCount + ' → ' + rn.requestCount + ' peticiones).', confianza: 'hipotesis' };
  return null;
}

/**
 * Compara dos snapshots del mismo sitio.
 * @param {object} prev  snapshot anterior
 * @param {object} next  snapshot nuevo
 * @param {object} [thr] umbrales (opcional)
 * @returns {object} resultado del diff (ver campos abajo)
 */
export function diffSnapshots(prev, next, thr = DEFAULT_THRESHOLDS) {
  if (!prev || !next) return { primeraVez: true, changes: [], alertLevel: 'none', alertable: false };

  const saludDelta = next.salud - prev.salud; // <0 = empeora
  const findingsDiff = diffFindings(prev.findings, next.findings);
  const metricsDiff = diffMetrics(prev, next);
  const signalChanges = diffSignals(prev, next);
  const causa = inferCausa(prev, next, metricsDiff);

  const changes = [];

  // 1) Salud global
  if (saludDelta <= -thr.saludImportante)
    changes.push({ tipo: 'regresion', severidad: saludDelta <= -thr.saludCritica ? 'critico' : 'importante', confianza: 'medido', titulo: 'La salud de la web ha bajado', evidencia: prev.salud + ' → ' + next.salud + ' (' + saludDelta + ')' });
  else if (saludDelta >= thr.saludMejora)
    changes.push({ tipo: 'mejora', severidad: 'mejora', confianza: 'medido', titulo: 'La salud de la web ha mejorado', evidencia: prev.salud + ' → ' + next.salud + ' (+' + saludDelta + ')' });

  // 2) Problemas nuevos (solo críticos/importantes generan cambio destacado)
  for (const f of findingsDiff.nuevos)
    if (f.severidad !== 'mejora')
      changes.push({ tipo: 'nuevo-problema', severidad: f.severidad, confianza: 'medido', titulo: 'Nuevo problema: ' + f.titulo, categoria: f.categoria, evidencia: f.evidencia });
  // 3) Problemas empeorados
  for (const f of findingsDiff.empeorados)
    changes.push({ tipo: 'empeorado', severidad: f.severidad, confianza: 'medido', titulo: 'Ha empeorado: ' + f.titulo, categoria: f.categoria, evidencia: (f.desde + ' → ' + f.severidad) });
  // 4) Problemas resueltos (buenas noticias)
  for (const f of findingsDiff.resueltos)
    if (f.severidad !== 'mejora')
      changes.push({ tipo: 'resuelto', severidad: 'mejora', confianza: 'medido', titulo: 'Resuelto: ' + f.titulo, categoria: f.categoria, evidencia: '' });

  // 5) Métricas con cambio significativo
  for (const md of metricsDiff)
    changes.push({ tipo: md.empeora ? 'metrica-empeora' : 'metrica-mejora', severidad: md.empeora ? 'importante' : 'mejora', confianza: 'medido', titulo: (md.empeora ? 'Empeora: ' : 'Mejora: ') + md.label, evidencia: md.texto });

  // 6) Señales del HTML
  for (const s of signalChanges) changes.push(s);

  // Nivel de alerta = lo peor que hayamos encontrado.
  const worst = changes.reduce((acc, c) => Math.max(acc, SEV_RANK[c.severidad] || 0), 0);
  const empeora = changes.some((c) => ['regresion', 'nuevo-problema', 'empeorado', 'metrica-empeora'].includes(c.tipo) || (c.tipo === 'senal' && SEV_RANK[c.severidad] >= 2));
  let alertLevel = 'none';
  if (empeora && worst >= 3) alertLevel = 'critical';
  else if (empeora && worst >= 2) alertLevel = 'important';
  else if (changes.length) alertLevel = 'minor';

  // Solo alertamos (email) por regresiones importantes/críticas. Nunca por ruido.
  const alertable = alertLevel === 'critical' || alertLevel === 'important';

  const headline = buildHeadline({ next, saludDelta, findingsDiff, alertLevel });

  return {
    primeraVez: false,
    saludPrev: prev.salud, saludNext: next.salud, saludDelta,
    findingsDiff, metricsDiff, signalChanges, causa,
    changes, alertLevel, alertable, headline,
  };
}

function buildHeadline({ next, saludDelta, findingsDiff, alertLevel }) {
  if (alertLevel === 'none') return next.host + ' sin cambios relevantes';
  if (saludDelta <= -1) return next.host + ' ha empeorado (' + saludDelta + ' de salud)';
  const nuevosGraves = findingsDiff.nuevos.filter((f) => f.severidad !== 'mejora').length;
  if (nuevosGraves) return next.host + ': ' + nuevosGraves + ' problema(s) nuevo(s)';
  if (saludDelta >= 1) return next.host + ' ha mejorado (+' + saludDelta + ' de salud)';
  return next.host + ' ha cambiado';
}

export { METRICS };
