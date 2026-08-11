// ============================================================================
// Cometia — Motor de diagnóstico.
//   señales (PageSpeed + HTML real) → detección → gravedad → salud → prioridad
// El framing (qué significa, impacto, causa, solución) vive en detectores.js;
// aquí decidimos QUÉ se dispara y CON QUÉ gravedad según la evidencia real.
// ============================================================================
import { DETECTORES } from './detectores.js';

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const SEV_RANK = { critico: 3, importante: 2, mejora: 1 };

export function isConfigured(v) {
  if (!v) return false;
  const s = String(v).trim().toUpperCase();
  return s !== '' && !s.includes('TODO') && !s.includes('XXXX');
}
export function normalizeUrl(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let v = raw.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
  try {
    const u = new URL(v);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    const h = u.hostname.toLowerCase();
    if (['localhost', '127.0.0.1', '0.0.0.0'].includes(h) || h.endsWith('.local') || !h.includes('.')) return null;
    return u.toString();
  } catch { return null; }
}
export function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } }
function toScore(c) { return c && typeof c.score === 'number' ? Math.round(c.score * 100) : null; }

// ---------- PageSpeed ----------
export async function analyzePsi(url, strategy, apiKey) {
  const p = new URLSearchParams();
  p.set('url', url); p.set('strategy', strategy); p.set('locale', 'es');
  if (isConfigured(apiKey)) p.set('key', apiKey);
  for (const c of ['performance', 'seo', 'accessibility', 'best-practices']) p.append('category', c);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 55000);
  try {
    const r = await fetch(`${PSI_ENDPOINT}?${p}`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) return { error: 'HTTP ' + r.status };
    const data = await r.json();
    const lhr = data.lighthouseResult || {};
    const cats = lhr.categories || {};
    const scores = { performance: toScore(cats.performance), seo: toScore(cats.seo), accessibility: toScore(cats.accessibility), bestPractices: toScore(cats['best-practices']) };
    const present = Object.values(scores).filter((v) => v !== null);
    const global = present.length ? Math.round(present.reduce((a, b) => a + b, 0) / present.length) : null;
    return { scores, global, lhr };
  } catch (e) { clearTimeout(t); return { error: e && e.name === 'AbortError' ? 'timeout' : 'red' }; }
}

// ---------- HTML real de la página ----------
async function fetchText(url, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms || 12000);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CometiaBot/1.0; +https://cometia.es)' }, signal: ctrl.signal, redirect: 'follow' });
    clearTimeout(t);
    return { ok: r.ok, status: r.status, text: r.ok ? await r.text() : '' };
  } catch { clearTimeout(t); return { ok: false, status: 0, text: '' }; }
}
export async function analyzePage(url) {
  const main = await fetchText(url, 12000);
  if (!main.ok) return null;
  const html = main.text.slice(0, 500000);
  const origin = (() => { try { return new URL(url).origin; } catch { return null; } })();
  const [robots, sitemap] = origin
    ? await Promise.all([fetchText(origin + '/robots.txt', 6000), fetchText(origin + '/sitemap.xml', 6000)])
    : [{ ok: false }, { ok: false }];

  const pick = (re) => { const m = html.match(re); return m ? m[1].trim() : null; };
  const title = pick(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descTag = html.match(/<meta[^>]+name=["']description["'][^>]*>/i);
  const descContent = descTag ? (descTag[0].match(/content=["']([\s\S]*?)["']/i) || [])[1] || null : null;
  const lang = (html.match(/<html[^>]+lang=["']([^"']+)["']/i) || [])[1] || null;
  const canonical = /<link[^>]+rel=["']canonical["']/i.test(html);
  const noindex = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const og = /<meta[^>]+property=["']og:(title|image)["']/i.test(html);
  const schemaTypes = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    const tm = m[1].match(/"@type"\s*:\s*"([^"]+)"/); if (tm) schemaTypes.push(tm[1]);
  }
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const imgsNoAlt = imgs.filter((tg) => !/\balt\s*=/i.test(tg)).length;
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1Count = h1s.length;
  const firstH1 = h1Count ? h1s[0][1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const bodyText = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = bodyText ? bodyText.split(' ').filter(Boolean).length : 0;
  const hasTel = /href=["']tel:/i.test(html);
  const hasWhatsapp = /wa\.me\/|api\.whatsapp\.com|href=["'][^"']*whatsapp/i.test(html);
  const hasMailto = /href=["']mailto:/i.test(html);
  const hasForm = /<form\b/i.test(html);
  const social = ['facebook.com', 'instagram.com', 'linkedin.com', 'tiktok.com', 'youtube.com'].filter((s) => html.includes(s));
  // CTA: botones/enlaces con verbos de acción
  const ctaWords = /(comprar|contacta|contactar|cont[aá]ctanos|reserva|reservar|pide|pedir|solicita|solicitar|empieza|empezar|prueba|probar|llama|ll[aá]manos|presupuesto|cotiza|apúntate|reg[ií]strate|suscr[ií]bete|añadir al carrito|comprar ahora|más informaci[oó]n|descargar|sign up|get started|try (it )?free|start (free|now|for free)|book (a )?demo|request (a )?demo|buy now|add to cart|subscribe|download|contact us)/i;
  const clickable = [...html.matchAll(/<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => m[2].replace(/<[^>]+>/g, ' ').trim());
  const ctaCount = clickable.filter((tx) => ctaWords.test(tx)).length;
  // Prueba social (heurística)
  const socialProof = /(rese[ñn]a|opini[oó]n|valoraci[oó]n|testimonio|clientes satisfechos|estrellas|★|⭐|trustpilot|google reviews)/i.test(bodyText) || schemaTypes.some((t) => /Review|AggregateRating/i.test(t));
  // Teléfono en texto pero no clicable
  const phoneInText = /(?:\+?34[\s.]?)?(?:\d[\s.]?){9}/.test(bodyText.replace(/\s+/g, ' '));
  let tech = null;
  if (/wp-content|wp-includes/i.test(html)) tech = 'WordPress';
  else if (/cdn\.shopify\.com/i.test(html)) tech = 'Shopify';
  else if (/wix\.com|_wixCssState|static\.parastorage/i.test(html)) tech = 'Wix';
  else if (/squarespace/i.test(html)) tech = 'Squarespace';

  // Enlaces internos (para el análisis multipágina del informe).
  const internalLinks = [];
  const seenL = new Set();
  for (const mm of html.matchAll(/<a\b[^>]*href=["']([^"'#\s]+)["']/gi)) {
    if (internalLinks.length >= 6) break;
    const href = mm[1].trim();
    if (/^(mailto:|tel:|javascript:|#|data:)/i.test(href)) continue;
    try {
      const u = new URL(href, url);
      if (!origin || u.origin !== origin) continue;
      if (/\.(pdf|jpe?g|png|gif|webp|svg|zip|docx?|xlsx?|mp4|css|js)$/i.test(u.pathname)) continue;
      if (u.pathname === '/' || u.pathname === '') continue;
      const clean = u.origin + u.pathname;
      if (seenL.has(clean)) continue;
      seenL.add(clean); internalLinks.push(clean);
    } catch { /* ignora hrefs no válidos */ }
  }

  return {
    internalLinks,
    title, descContent, lang, canonical, noindex, viewport, og, schemaTypes,
    imgCount: imgs.length, imgsNoAlt, h1Count, firstH1, words,
    hasTel, hasWhatsapp, hasMailto, hasForm, social, ctaCount, socialProof, phoneInText, tech,
    robots: robots.ok ? true : robots.status === 404 ? false : null,
    sitemap: sitemap.ok ? true : sitemap.status === 404 ? false : null,
  };
}

// ---------- Reglas: evidencia → gravedad ----------
// Cada regla devuelve 'critico' | 'importante' | 'mejora' (se dispara),
// 'ok' (evaluado y correcto) o null (sin datos para evaluar).
function num(a) { return a && typeof a.numericValue === 'number' ? a.numericValue : null; }
function sav(a) { return (a && a.details && a.details.overallSavingsMs) || 0; }
function items(a) { return (a && a.details && Array.isArray(a.details.items)) ? a.details.items.length : 0; }
function fire(sev, ev) { return { sev, ev: ev || '' }; }
function savTxt(a) { const ms = sav(a); return ms >= 300 ? 'Se puede ahorrar ~' + (ms / 1000).toFixed(1) + ' s de carga' : ''; }
function psi(aud, id, big) { // audit de oportunidad
  const a = aud[id]; if (!a) return null;
  const ms = sav(a);
  if (a.score == null) { if (!(ms > 0)) return 'ok'; return fire(ms > (big || 1500) ? 'importante' : 'mejora', savTxt(a)); }
  if (a.score >= 0.9) return 'ok';
  return fire((a.score < 0.5 || ms > (big || 1500)) ? 'importante' : 'mejora', savTxt(a) || (a.displayValue || ''));
}
function bin(aud, id, sev, noun) {
  const a = aud[id]; if (!a || a.score == null) return null;
  if (a.score >= 0.9) return 'ok';
  const n = items(a);
  return fire(sev, n && noun ? n + ' ' + noun : '');
}

function rules(aud, p) {
  const R = {};
  const lcpA = aud['largest-contentful-paint']; const lcp = num(lcpA);
  const lcpRaw = lcpA && lcpA.displayValue ? lcpA.displayValue : (lcp != null ? (lcp / 1000).toFixed(1) + ' s' : '');
  // Blindaje: valores absurdos (picos de la prueba de Google) no se muestran con el número.
  const lcpEv = (lcp != null && lcp > 15000) ? 'Tarda muchísimo más de lo recomendable (lo ideal es menos de 2,5 s)' : 'Aparece en ' + lcpRaw + ' (lo recomendable es menos de 2,5 s)';
  R['lcp-alto'] = lcp == null ? null : lcp > 2500 ? fire(lcp > 4000 ? 'importante' : 'mejora', lcpEv) : 'ok';
  const clsA = aud['cumulative-layout-shift']; const cls = num(clsA);
  const clsTxt = clsA && clsA.displayValue ? clsA.displayValue : String(cls);
  R['cls-inestable'] = cls == null ? null : cls > 0.1 ? fire(cls > 0.25 ? 'importante' : 'mejora', 'Inestabilidad ' + clsTxt + ' (recomendable menos de 0,1)') : 'ok';
  R['respuesta-servidor-lenta'] = psi(aud, 'server-response-time', 600);
  R['javascript-sobrante'] = psi(aud, 'unused-javascript');
  R['css-sobrante'] = psi(aud, 'unused-css-rules');
  R['recursos-bloqueantes'] = psi(aud, 'render-blocking-resources', 500);
  R['imagenes-pesadas'] = psi(aud, 'uses-optimized-images', 1000);
  R['imagenes-formato-antiguo'] = psi(aud, 'modern-image-formats', 1000);
  R['imagenes-sin-dimensionar'] = bin(aud, 'unsized-images', 'importante', 'imágenes sin dimensionar');
  R['sin-compresion-servidor'] = psi(aud, 'uses-text-compression', 500);
  R['sin-cache'] = psi(aud, 'uses-long-cache-ttl');
  R['fuentes-tardias'] = bin(aud, 'font-display', 'mejora');
  R['javascript-antiguo'] = psi(aud, 'legacy-javascript');
  R['errores-consola'] = bin(aud, 'errors-in-console', 'mejora', 'errores en consola');
  R['librerias-vulnerables'] = bin(aud, 'no-vulnerable-libraries', 'importante');
  { const a = aud['third-party-summary']; const w = a && a.details && a.details.summary && a.details.summary.wastedMs; R['muchos-scripts-terceros'] = w == null ? null : w > 500 ? fire('mejora', 'Los scripts externos bloquean ~' + Math.round(w) + ' ms') : 'ok'; }
  R['sin-https'] = bin(aud, 'is-on-https', 'critico');

  // Accesibilidad (PSI)
  R['contraste-bajo'] = bin(aud, 'color-contrast', 'importante', 'textos con poco contraste');
  R['botones-sin-nombre'] = bin(aud, 'button-name', 'importante', 'botones sin nombre');
  R['enlaces-sin-nombre'] = bin(aud, 'link-name', 'mejora', 'enlaces sin nombre');
  R['campos-sin-etiqueta'] = bin(aud, 'label', 'importante', 'campos sin etiqueta');
  R['zonas-tactiles-pequenas'] = bin(aud, 'tap-targets', 'mejora', 'zonas táctiles pequeñas');

  if (p) {
    const T = p.title || '', D = p.descContent || '';
    R['sin-title'] = p.title ? 'ok' : fire('critico', '');
    R['title-corto'] = p.title ? (T.length < 30 ? fire('mejora', 'El tuyo: “' + T + '” (' + T.length + ' caracteres)') : 'ok') : null;
    R['title-largo'] = p.title ? (T.length > 65 ? fire('mejora', 'El tuyo: “' + T + '” (' + T.length + ' caracteres)') : 'ok') : null;
    R['sin-meta-description'] = p.descContent ? 'ok' : fire('importante', '');
    R['meta-description-corta'] = p.descContent ? (D.length < 70 ? fire('mejora', 'La tuya: “' + D.slice(0, 90) + (D.length > 90 ? '…' : '') + '” (' + D.length + ' car.)') : 'ok') : null;
    R['meta-description-larga'] = p.descContent ? (D.length > 165 ? fire('mejora', 'La tuya tiene ' + D.length + ' caracteres (Google la corta sobre 160)') : 'ok') : null;
    R['sin-h1'] = p.h1Count === 0 ? fire('importante', '') : 'ok';
    R['varios-h1'] = p.h1Count > 1 ? fire('mejora', 'Hay ' + p.h1Count + ' encabezados H1') : 'ok';
    R['sin-canonical'] = p.canonical ? 'ok' : fire('mejora', '');
    R['pagina-noindex'] = p.noindex ? fire('critico', 'La página incluye la etiqueta noindex') : 'ok';
    R['sin-datos-estructurados'] = p.schemaTypes.length ? 'ok' : fire('mejora', '');
    R['sin-open-graph'] = p.og ? 'ok' : fire('mejora', '');
    R['imagenes-sin-alt'] = p.imgCount === 0 ? null : p.imgsNoAlt === 0 ? 'ok' : fire(p.imgsNoAlt > p.imgCount / 2 ? 'importante' : 'mejora', p.imgsNoAlt + ' de ' + p.imgCount + ' imágenes sin texto alternativo');
    R['contenido-escaso'] = p.words < 250 ? fire('mejora', 'Unas ' + p.words + ' palabras en la portada') : 'ok';
    R['sin-sitemap'] = p.sitemap === false ? fire('mejora', 'No encontramos /sitemap.xml') : p.sitemap === true ? 'ok' : null;
    R['sin-robots-txt'] = p.robots === false ? fire('mejora', 'No encontramos /robots.txt') : p.robots === true ? 'ok' : null;
    R['sin-idioma-declarado'] = p.lang ? 'ok' : fire('mejora', '');
    R['sin-viewport-movil'] = p.viewport ? 'ok' : fire('importante', '');
    // Conversión (heurística)
    R['propuesta-valor-poco-clara'] = (p.h1Count === 0 || (p.firstH1 && p.firstH1.length < 12)) ? fire('importante', p.h1Count === 0 ? 'No hay un titular principal (H1)' : 'Tu titular: “' + p.firstH1 + '”') : 'ok';
    R['sin-cta-claro'] = p.ctaCount === 0 ? fire('importante', 'No detectamos botones de acción claros en la portada') : 'ok';
    R['contacto-no-visible'] = (p.hasTel || p.hasWhatsapp || p.hasForm) ? 'ok' : fire('importante', 'Sin teléfono, WhatsApp ni formulario visibles en la portada');
    R['sin-prueba-social'] = p.socialProof ? 'ok' : fire('mejora', '');
    R['sin-redes-sociales'] = p.social.length ? 'ok' : fire('mejora', '');
    R['telefono-no-clicable'] = (p.phoneInText && !p.hasTel) ? fire('mejora', 'Hay un teléfono en el texto, pero no como enlace pulsable') : 'ok';
  }
  return R;
}

function prioridad(sev, dif) {
  const base = sev === 'critico' ? 10 : sev === 'importante' ? 7 : 4;
  const pen = dif === 'Alta' ? 2 : dif === 'Media' ? 1 : 0;
  return Math.max(1, base - pen);
}

// ---------- Diagnóstico completo ----------
export function diagnostica({ lhr, page }) {
  const aud = (lhr && lhr.audits) || {};
  const R = rules(aud, page);
  const findings = [];
  const ok = [];
  let bien = 0, evaluados = 0;
  for (const id of Object.keys(DETECTORES)) {
    const res = R[id];
    if (res == null) continue; // sin datos → no cuenta
    evaluados++;
    if (res === 'ok') { bien++; ok.push({ titulo: DETECTORES[id].titulo, categoria: DETECTORES[id].categoria }); continue; }
    const d = DETECTORES[id];
    const sev = SEV_RANK[res.sev] <= SEV_RANK[d.severidadMax] ? res.sev : d.severidadMax;
    findings.push({ ...d, severidad: sev, evidencia: res.ev || '', prioridad: prioridad(sev, d.dificultad) });
  }
  findings.sort((a, b) => (SEV_RANK[b.severidad] - SEV_RANK[a.severidad]) || (b.prioridad - a.prioridad));
  const counts = {
    critico: findings.filter((f) => f.severidad === 'critico').length,
    importante: findings.filter((f) => f.severidad === 'importante').length,
    mejora: findings.filter((f) => f.severidad === 'mejora').length,
    bien,
    evaluados,
  };
  // Salud: penaliza por gravedad (no es la media de PageSpeed).
  const salud = Math.max(5, Math.min(100, 100 - (counts.critico * 15 + counts.importante * 6 + counts.mejora * 2)));
  return { salud, counts, findings, ok };
}

export function saludLabel(s) {
  if (s >= 90) return { t: 'Buena salud', c: '#0a8a4a', emoji: '🟢' };
  if (s >= 70) return { t: 'Mejorable', c: '#c9821a', emoji: '🟡' };
  if (s >= 45) return { t: 'Necesita atención', c: '#d1571a', emoji: '🟠' };
  return { t: 'Estado crítico', c: '#c0392b', emoji: '🔴' };
}
export const SEV = {
  critico: { label: 'Crítico', emoji: '🔴', c: '#c0392b' },
  importante: { label: 'Importante', emoji: '🟠', c: '#d1571a' },
  mejora: { label: 'Mejora', emoji: '🟡', c: '#c9821a' },
};
