/**
 * Cometia — Informe completo (diagnóstico) por email + PDF (Vercel serverless).
 * Lo llama el webhook de Stripe tras un pago confirmado (con x-deliver-secret).
 *
 * El informe NO es un volcado de métricas: es un DIAGNÓSTICO accionable —
 * Salud de la web, qué arreglar primero (con causa, impacto, solución, prioridad),
 * lo que está bien (no lo toques) y un plan de acción. Todo en cristiano.
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { analyzePsi, analyzePage, diagnostica, saludLabel, normalizeUrl, hostOf, isConfigured, SEV } from './_lib/engine.js';

export const config = { maxDuration: 60 };
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

function validEmail(e) { return typeof e === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.trim()); }
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
function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function resumenSalud(s) {
  if (s >= 90) return 'Tu web está muy bien. Son ajustes finos, pero afinarlos te separa de la competencia.';
  if (s >= 70) return 'Tu web está bien, con un margen de mejora claro en algunos puntos.';
  if (s >= 45) return 'Tu web tiene varios puntos débiles que conviene atender. Todos tienen solución.';
  return 'Tu web necesita atención: hay problemas que pueden estar frenándote. La buena noticia es que se arreglan.';
}
function plan(findings) {
  const hoy = findings.filter((f) => (f.severidad === 'critico' || f.severidad === 'importante') && f.dificultad === 'Baja');
  const semana = findings.filter((f) => (f.severidad === 'critico' || f.severidad === 'importante') && f.dificultad !== 'Baja');
  const mes = findings.filter((f) => f.severidad === 'mejora');
  return { hoy, semana, mes };
}

// ---------- Email ----------
function chip(sev) { const s = SEV[sev] || SEV.mejora; return '<span style="display:inline-block;font-size:11px;font-weight:800;color:#fff;background:' + s.c + ';padding:2px 8px;border-radius:20px;vertical-align:middle">' + s.emoji + ' ' + s.label + '</span>'; }
function findingFull(f, i) {
  const inf = f.confianza === 'inferencia' ? ' <span style="color:#8a8f98;font-size:12px">(estimación)</span>' : '';
  return '<div style="padding:16px 0;border-bottom:1px solid #ececE6">' +
    '<div style="font-weight:800;font-size:16px;color:#15171b">' + (i != null ? (i + 1) + '. ' : '') + esc(f.titulo) + ' ' + chip(f.severidad) + inf + '</div>' +
    '<div style="font-size:12px;color:#8a8f98;margin-top:2px">' + esc(f.categoria) + ' · Prioridad ' + f.prioridad + '/10 · Dificultad ' + esc(f.dificultad) + '</div>' +
    (f.evidencia ? '<div style="margin-top:8px;font-family:monospace;font-size:13px;color:#15171b;background:#f6f6f0;border:1px solid #e6e6e0;padding:6px 10px;display:inline-block">🔎 ' + esc(f.evidencia) + '</div>' : '') +
    '<div style="margin-top:8px;font-size:14px;line-height:1.55;color:#5c616b"><strong style="color:#7a808a">Qué pasa:</strong> ' + esc(f.queSignifica) + '</div>' +
    '<div style="margin-top:4px;font-size:14px;line-height:1.55;color:#5c616b"><strong style="color:#7a808a">Por qué importa:</strong> ' + esc(f.impacto) + '</div>' +
    '<div style="margin-top:4px;font-size:14px;line-height:1.55;color:#5c616b"><strong style="color:#7a808a">Por qué ocurre:</strong> ' + esc(f.causa) + '</div>' +
    '<div style="margin-top:4px;font-size:14px;line-height:1.55;color:#15171b"><strong style="color:#1b2ed8">Solución:</strong> ' + esc(f.recomendacion) + ' <span style="color:#8a8f98">— ' + esc(f.quien) + '</span></div>' +
    '</div>';
}
function findingSlim(f) {
  return '<li style="padding:9px 0;border-bottom:1px solid #f0f0ea;font-size:14px;line-height:1.5"><strong>' + esc(f.titulo) + '</strong> <span style="color:#8a8f98">· ' + esc(f.categoria) + '</span><br><span style="color:#5c616b">→ ' + esc(f.recomendacion) + '</span></li>';
}
function planList(arr) { return arr.length ? '<ul style="margin:4px 0 0;padding-left:18px;color:#5c616b;font-size:14px">' + arr.slice(0, 6).map((f) => '<li style="margin:3px 0">' + esc(f.titulo) + '</li>').join('') + '</ul>' : '<p style="margin:4px 0 0;color:#8a8f98;font-size:14px">Nada pendiente aquí.</p>'; }

function block_otras(otras) {
  if (!otras || !otras.length) return '';
  let h = '<h2 style="font-size:17px;color:#15171b;margin:30px 0 2px">📄 Otras páginas que hemos revisado</h2>' +
    '<p style="margin:6px 0 8px;color:#8a8f98;font-size:13px">No solo la portada: también miramos estas páginas de tu web.</p>';
  for (const o of otras) {
    const oSl = saludLabel(o.salud);
    h += '<div style="margin-top:10px;padding:12px 14px;border:1px solid #ececE6;border-radius:8px">' +
      '<div style="font-weight:800;color:#15171b">' + esc(o.path) + ' <span style="font-weight:700;color:' + oSl.c + '">· Salud ' + o.salud + '</span></div>';
    if (o.nuevos && o.nuevos.length) {
      h += '<div style="color:#8a8f98;font-size:13px;margin-top:2px">Puntos propios de esta página:</div>' +
        '<ul style="margin:4px 0 0;padding-left:18px;color:#5c616b;font-size:14px">' +
        o.nuevos.slice(0, 5).map((f) => '<li style="margin:2px 0">' + esc(f.titulo) + (f.evidencia ? ' <span style="color:#8a8f98">(' + esc(f.evidencia) + ')</span>' : '') + '</li>').join('') +
        '</ul>';
    } else {
      h += '<div style="color:#5c616b;font-size:14px;margin-top:4px">Tiene los mismos puntos que la portada; nada específico adicional.</div>';
    }
    h += '</div>';
  }
  return h;
}
function emailHtml({ url, host, salud, sl, counts, findings, ok, otras }) {
  const prioritarios = findings.filter((f) => f.severidad === 'critico' || f.severidad === 'importante');
  const mejoras = findings.filter((f) => f.severidad === 'mejora');
  const pl = plan(findings);
  const velUrgente = findings.some((f) => f.categoria === 'Velocidad' && (f.severidad === 'critico' || f.severidad === 'importante'));
  const okByCat = {};
  for (const o of (ok || [])) okByCat[o.categoria] = (okByCat[o.categoria] || 0) + 1;
  const okResumen = Object.keys(okByCat).map((c) => esc(c) + ' (' + okByCat[c] + ')').join(' · ');

  let body = '';
  // Arregla primero
  if (prioritarios.length) {
    body += '<h2 style="font-size:19px;color:#15171b;margin:30px 0 2px">🔥 Arregla esto primero</h2>' +
      '<p style="margin:0 0 8px;color:#8a8f98;font-size:13px">Ordenado por lo que más mueve la aguja. Empieza por el 1.</p>' +
      prioritarios.map((f, i) => findingFull(f, i)).join('');
  }
  // Cuando puedas
  if (mejoras.length) {
    body += '<h2 style="font-size:17px;color:#15171b;margin:30px 0 2px">🟡 Cuando puedas</h2>' +
      '<ul style="list-style:none;margin:8px 0 0;padding:0">' + mejoras.map(findingSlim).join('') + '</ul>';
  }
  // Lo que está bien
  body += '<h2 style="font-size:17px;color:#15171b;margin:30px 0 2px">🟢 Lo que está bien (no lo toques)</h2>' +
    '<p style="margin:6px 0 0;color:#5c616b;font-size:14px;line-height:1.55"><strong>' + (counts.bien || 0) + ' comprobaciones están correctas</strong> y no necesitas tocarlas' + (okResumen ? ': ' + okResumen : '') + '.</p>';
  // Otras páginas
  body += block_otras(otras);
  // Plan
  body += '<h2 style="font-size:17px;color:#15171b;margin:30px 0 6px">📋 Tu plan de acción</h2>' +
    '<p style="font-weight:700;color:#1b2ed8;margin:8px 0 0">Hoy (rápido y con impacto)</p>' + planList(pl.hoy) +
    '<p style="font-weight:700;color:#1b2ed8;margin:14px 0 0">Esta semana</p>' + planList(pl.semana) +
    '<p style="font-weight:700;color:#1b2ed8;margin:14px 0 0">Este mes</p>' + planList(pl.mes);
  // WPO bridge
  if (velUrgente) {
    body += '<div style="margin:28px 0 0;padding:16px 18px;background:#eceeff;border-left:3px solid #1b2ed8;border-radius:0 8px 8px 0">' +
      '<strong style="color:#15171b">¿Prefieres que lo arreglemos por ti?</strong> Varios de estos puntos son de velocidad. Los dejamos resueltos con garantía de resultado — si no mejora, te devolvemos el dinero. Responde a este correo y te contamos.</div>';
  }

  const col = sl.c;
  return '<!doctype html><html><body style="margin:0;background:#f1f1ec;font-family:Arial,Helvetica,sans-serif;color:#15171b">' +
    '<div style="max-width:640px;margin:0 auto;padding:24px">' +
    '<div style="background:#181510;color:#fff;border-radius:12px 12px 0 0;padding:22px 24px">' +
    '<div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.85">Cometia · Diagnóstico de tu web</div>' +
    '<div style="font-size:22px;font-weight:800;margin-top:4px">' + esc(host) + '</div></div>' +
    '<div style="background:#fff;border:1px solid #e6e6e0;border-top:0;border-radius:0 0 12px 12px;padding:24px">' +
    '<p style="margin:0 0 4px;color:#5c616b">Salud de tu web:</p>' +
    '<div style="font-size:48px;font-weight:800;color:' + col + ';line-height:1">' + salud + '<span style="font-size:20px;color:#8a8f98">/100</span> <span style="font-size:18px">' + sl.emoji + '</span></div>' +
    '<div style="color:' + col + ';font-weight:800;margin-top:2px">' + esc(sl.t) + '</div>' +
    '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px 14px;font-size:13px;font-weight:700">' +
    '<span style="color:#c0392b">' + counts.critico + ' críticos</span><span style="color:#c0561a">' + counts.importante + ' importantes</span><span style="color:#915e00">' + counts.mejora + ' mejoras</span><span style="color:#1c7a4d">' + counts.bien + ' correctos</span></div>' +
    '<p style="margin:14px 0 0;color:#15171b;font-size:15px;line-height:1.6">' + resumenSalud(salud) + '</p>' +
    body +
    '<p style="margin:26px 0 0;color:#8a8f98;font-size:12px">Diagnóstico de <strong>' + esc(url) + '</strong> con datos oficiales de Google (PageSpeed) y análisis de tu página. PDF adjunto para guardarlo o pasárselo a quien lleva tu web. — Cometia, un proyecto de Órbita Labs.</p>' +
    '</div></div></body></html>';
}

// ---------- PDF ----------
function pdfSafe(s) { return String(s == null ? '' : s).replace(/→/g, '>').replace(/[—–]/g, '-').replace(/…/g, '...').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/[^\x00-\xFF]/g, ''); }
function wrap(text, font, size, maxW) {
  const words = pdfSafe(text).split(/\s+/); const lines = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (font.widthOfTextAtSize(t, size) > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}
function saludColorPdf(s) { if (s >= 90) return rgb(0.11, 0.48, 0.3); if (s >= 70) return rgb(0.57, 0.37, 0); if (s >= 45) return rgb(0.75, 0.34, 0.1); return rgb(0.74, 0.2, 0.17); }
async function buildPdf({ host, salud, sl, counts, findings, otras }) {
  const doc = await PDFDocument.create();
  const W = 595.28, H = 841.89, M = 48;
  let page = doc.addPage([W, H]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.08, 0.09, 0.11), muted = rgb(0.55, 0.58, 0.63), brand = rgb(0.106, 0.18, 0.847), line = rgb(0.88, 0.88, 0.85);
  let y = 0;
  const ensure = (n) => { if (y < n) { page = doc.addPage([W, H]); y = H - 56; } };
  const para = (t, size, color, x) => { for (const ln of wrap(t, font, size || 10, W - 2 * M - (x ? x - M : 0))) { ensure(64); page.drawText(ln, { x: x || M, y, size: size || 10, font, color: color || ink }); y -= (size || 10) + 3; } };
  const h2 = (t) => { ensure(110); y -= 24; page.drawText(pdfSafe(t), { x: M, y, size: 13, font: bold, color: ink }); y -= 16; };
  let fecha = ''; try { fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) {}

  page.drawRectangle({ x: 0, y: H - 120, width: W, height: 120, color: rgb(0.094, 0.082, 0.063) });
  page.drawRectangle({ x: 0, y: H - 4, width: W, height: 4, color: brand });
  const w1 = bold.widthOfTextAtSize('comet', 26);
  page.drawText('comet', { x: M, y: H - 60, size: 26, font: bold, color: rgb(0.95, 0.93, 0.89) });
  page.drawText('ia', { x: M + w1, y: H - 60, size: 26, font: bold, color: rgb(0.55, 0.62, 1) });
  page.drawText('DIAGNOSTICO DE TU WEB', { x: M, y: H - 84, size: 9, font, color: rgb(0.6, 0.62, 0.68) });
  page.drawText(pdfSafe(host), { x: M, y: H - 102, size: 13, font: bold, color: rgb(0.75, 0.77, 0.82) });
  if (fecha) page.drawText(pdfSafe(fecha), { x: W - M - font.widthOfTextAtSize(pdfSafe(fecha), 10), y: H - 102, size: 10, font, color: rgb(0.55, 0.57, 0.62) });

  y = H - 120 - 44;
  page.drawText('SALUD DE TU WEB', { x: M, y, size: 10, font, color: muted }); y -= 42;
  const g = String(salud);
  page.drawText(g, { x: M, y, size: 50, font: bold, color: saludColorPdf(salud) });
  page.drawText('/100', { x: M + bold.widthOfTextAtSize(g, 50) + 8, y: y + 8, size: 16, font, color: muted });
  page.drawText(pdfSafe(sl.t), { x: M + bold.widthOfTextAtSize(g, 50) + 58, y: y + 6, size: 12, font: bold, color: saludColorPdf(salud) });
  y -= 22;
  page.drawText(pdfSafe(counts.critico + ' criticos   ' + counts.importante + ' importantes   ' + counts.mejora + ' mejoras   ' + counts.bien + ' correctos'), { x: M, y, size: 10, font: bold, color: ink });
  y -= 18; para(resumenSalud(salud), 10.5);

  const prioritarios = findings.filter((f) => f.severidad === 'critico' || f.severidad === 'importante');
  const mejoras = findings.filter((f) => f.severidad === 'mejora');
  if (prioritarios.length) {
    h2('ARREGLA ESTO PRIMERO');
    prioritarios.forEach((f, i) => {
      ensure(120);
      for (const ln of wrap((i + 1) + '. ' + f.titulo + '  [' + (SEV[f.severidad] || {}).label + ']', bold, 11.5, W - 2 * M)) { page.drawText(ln, { x: M, y, size: 11.5, font: bold, color: ink }); y -= 15; }
      para('Prioridad ' + f.prioridad + '/10 - Dificultad ' + f.dificultad + ' - ' + f.categoria, 9, muted, M + 12);
      if (f.evidencia) para('Lo que vemos: ' + f.evidencia, 9.5, ink, M + 12);
      para('Que pasa: ' + f.queSignifica, 9.5, muted, M + 12);
      para('Por que importa: ' + f.impacto, 9.5, muted, M + 12);
      para('Solucion: ' + f.recomendacion + ' (' + f.quien + ')', 9.5, brand, M + 12);
      y -= 8;
    });
  }
  if (mejoras.length) {
    h2('CUANDO PUEDAS');
    for (const f of mejoras) { ensure(60); para('- ' + f.titulo + ': ' + f.recomendacion, 9.5, muted, M); }
  }
  h2('LO QUE ESTA BIEN');
  para(counts.bien + ' comprobaciones estan correctas. No necesitas tocarlas.', 10, rgb(0.11, 0.48, 0.3));

  if (otras && otras.length) {
    h2('OTRAS PAGINAS REVISADAS');
    for (const o of otras) {
      ensure(70);
      para(o.path + '  (Salud ' + o.salud + ')', 10.5, ink);
      for (const f of o.findings.slice(0, 5)) para('- ' + f.titulo + (f.evidencia ? ' (' + f.evidencia + ')' : ''), 9.5, muted, M + 12);
    }
  }

  const pl = plan(findings);
  h2('TU PLAN DE ACCION');
  para('Hoy: ' + (pl.hoy.slice(0, 5).map((f) => f.titulo).join('; ') || 'nada urgente'), 9.5, muted, M);
  para('Esta semana: ' + (pl.semana.slice(0, 5).map((f) => f.titulo).join('; ') || 'nada pendiente'), 9.5, muted, M);
  para('Este mes: ' + (pl.mes.slice(0, 5).map((f) => f.titulo).join('; ') || 'solo mantener'), 9.5, muted, M);

  ensure(80);
  page.drawLine({ start: { x: M, y: 64 }, end: { x: W - M, y: 64 }, thickness: 1, color: line });
  page.drawText(pdfSafe('Cometia - un proyecto de Orbita Labs - cometia.es - datos oficiales de Google + analisis propio'), { x: M, y: 48, size: 8.5, font, color: muted });
  const bytes = await doc.save();
  return Buffer.from(bytes).toString('base64');
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ error: 'Método no permitido.' })); }
  const secret = process.env.DELIVER_SECRET;
  if (isConfigured(secret) && (req.headers['x-deliver-secret'] || '') !== secret) {
    res.statusCode = 401; return res.end(JSON.stringify({ error: 'No autorizado. El informe se entrega tras el pago.' }));
  }
  const b = await readBody(req);
  const url = normalizeUrl(b.url || '');
  const email = (b.email || '').trim();
  if (!url) { res.statusCode = 400; return res.end(JSON.stringify({ error: 'URL no válida.' })); }
  if (!validEmail(email)) { res.statusCode = 400; return res.end(JSON.stringify({ error: 'Email no válido.' })); }

  const apiKey = process.env.PAGESPEED_API_KEY;
  const [m, page] = await Promise.all([analyzePsi(url, 'mobile', apiKey), analyzePage(url)]);
  if (m.error) { res.statusCode = 502; return res.end(JSON.stringify({ error: 'No hemos podido analizar esa web ahora mismo.' })); }
  const dx = diagnostica({ lhr: m.lhr, page });
  const sl = saludLabel(dx.salud);
  const host = hostOf(url);

  // Multipágina: revisamos hasta 2 páginas internas (análisis del HTML, sin PageSpeed).
  const internal = (page && page.internalLinks ? page.internalLinks : []).slice(0, 2);
  const otrasRaw = await Promise.all(internal.map((l) => analyzePage(l).catch(() => null)));
  const homeIds = new Set(dx.findings.map((f) => f.id));
  const otras = [];
  internal.forEach((l, i) => {
    const pf = otrasRaw[i];
    if (!pf) return;
    const dxp = diagnostica({ lhr: {}, page: pf });
    if (!dxp.findings.length) return;
    let path = l; try { path = new URL(l).pathname || '/'; } catch (e) {}
    otras.push({ path, salud: dxp.salud, nuevos: dxp.findings.filter((f) => !homeIds.has(f.id)) });
  });

  const data = { url, host, salud: dx.salud, sl, counts: dx.counts, findings: dx.findings, ok: dx.ok, otras };

  const resendKey = process.env.RESEND_API_KEY;
  if (!isConfigured(resendKey)) { res.statusCode = 200; return res.end(JSON.stringify({ configured: false, sent: false, salud: dx.salud })); }
  const from = process.env.RESEND_FROM || 'Cometia <informe@cometia.es>';
  try {
    let attachments;
    try { const pdf = await buildPdf(data); attachments = [{ filename: `diagnostico-cometia-${host.replace(/[^a-z0-9.-]/gi, '')}.pdf`, content: pdf }]; } catch (e) { attachments = undefined; }
    const r = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [email], reply_to: 'cometia.es@gmail.com', subject: `Diagnóstico de ${host} — Salud ${dx.salud}/100`, html: emailHtml(data), ...(attachments ? { attachments } : {}) }),
    });
    res.statusCode = 200;
    return res.end(JSON.stringify({ configured: true, sent: r.ok, salud: dx.salud, problemas: dx.findings.length }));
  } catch (e) {
    res.statusCode = 200;
    return res.end(JSON.stringify({ configured: true, sent: false, salud: dx.salud, problemas: dx.findings.length }));
  }
}
